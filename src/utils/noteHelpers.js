/**
 * Generates a unique note identifier using Web Crypto with a fallback.
 */
export function createNoteId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Safely normalizes a note's labels array with trimming and Turkish case-insensitive deduplication.
 */
export function normalizeLabels(labels) {
  if (!Array.isArray(labels)) {
    return [];
  }

  const seen = new Set();
  const normalized = [];

  for (const rawLabel of labels) {
    if (typeof rawLabel !== 'string') continue;
    const trimmed = rawLabel.trim();
    if (!trimmed) continue;

    const key = trimmed.toLocaleLowerCase('tr');
    if (seen.has(key)) continue;

    seen.add(key);
    normalized.push(trimmed);
  }

  return normalized;
}

/**
 * Checks whether two label lists contain the same normalized labels in order.
 */
export function areLabelsEqual(first, second) {
  const normalizedFirst = normalizeLabels(first);
  const normalizedSecond = normalizeLabels(second);

  if (normalizedFirst.length !== normalizedSecond.length) {
    return false;
  }

  return normalizedFirst.every((label, index) => label === normalizedSecond[index]);
}

/**
 * Extracts a sorted, deduplicated list of all labels currently used across notes.
 */
export function getUniqueLabels(notes) {
  if (!Array.isArray(notes)) {
    return [];
  }

  const labelMap = new Map();

  for (const note of notes) {
    const noteLabels = normalizeLabels(note?.labels);
    for (const label of noteLabels) {
      const key = label.toLocaleLowerCase('tr');
      if (!labelMap.has(key)) {
        labelMap.set(key, label);
      }
    }
  }

  return Array.from(labelMap.values()).sort((a, b) =>
    a.localeCompare(b, 'tr', { sensitivity: 'base' })
  );
}

/**
 * Filters notes by hidden state, defaulting missing `isHidden` values to false.
 */
export function filterNotesByVisibility(notes, showHidden = false) {
  if (!Array.isArray(notes)) {
    return [];
  }
  const targetHidden = Boolean(showHidden);
  return notes.filter((note) => Boolean(note?.isHidden) === targetHidden);
}

/**
 * Filters notes by selected label and Turkish-locale case-insensitive query across title, content, and labels.
 */
export function filterNotes(notes, query = '', selectedLabel = null) {
  const normalizedSelectedLabel =
    typeof selectedLabel === 'string' && selectedLabel.trim()
      ? selectedLabel.trim().toLocaleLowerCase('tr')
      : null;
  const normalizedQuery = typeof query === 'string' ? query.trim().toLocaleLowerCase('tr') : '';

  if (!normalizedSelectedLabel && !normalizedQuery) {
    return notes;
  }

  return notes.filter((note) => {
    const noteLabels = normalizeLabels(note?.labels);

    if (normalizedSelectedLabel) {
      const hasSelectedLabel = noteLabels.some(
        (label) => label.toLocaleLowerCase('tr') === normalizedSelectedLabel
      );
      if (!hasSelectedLabel) {
        return false;
      }
    }

    if (!normalizedQuery) {
      return true;
    }

    const title = (note?.title || '').toLocaleLowerCase('tr');
    const content = (note?.content || '').toLocaleLowerCase('tr');
    const matchesLabel = noteLabels.some((label) =>
      label.toLocaleLowerCase('tr').includes(normalizedQuery)
    );

    return title.includes(normalizedQuery) || content.includes(normalizedQuery) || matchesLabel;
  });
}

/**
 * Partitions notes into pinned and unpinned lists, each ordered newest first.
 */
export function partitionNotes(notes) {
  const sorted = [...notes].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const pinnedNotes = [];
  const otherNotes = [];

  for (const note of sorted) {
    if (note.isPinned) {
      pinnedNotes.push(note);
    } else {
      otherNotes.push(note);
    }
  }

  return { pinnedNotes, otherNotes };
}

/**
 * Formats a timestamp for Turkish display inside the note editor modal.
 */
export function formatNoteDate(timestamp) {
  if (!timestamp) return '';
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  } catch {
    return '';
  }
}
