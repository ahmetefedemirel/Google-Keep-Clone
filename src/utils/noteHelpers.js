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
 * Filters notes by Turkish-locale case-insensitive query across title and content.
 */
export function filterNotes(notes, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase('tr');
  if (!normalizedQuery) {
    return notes;
  }

  return notes.filter((note) => {
    const title = (note.title || '').toLocaleLowerCase('tr');
    const content = (note.content || '').toLocaleLowerCase('tr');
    return title.includes(normalizedQuery) || content.includes(normalizedQuery);
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
