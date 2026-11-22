import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_COLOR_ID } from '../utils/colors';
import {
  areLabelsEqual,
  createNoteId,
  filterNotes,
  getUniqueLabels,
  normalizeLabels,
  partitionNotes,
} from '../utils/noteHelpers';

const STORAGE_KEY = 'keep_clone_notes_v1';

/**
 * Manages note CRUD, pin state, color selection, labels, search/label filtering, and localStorage persistence.
 */
export function useNotes() {
  const [rawNotes, setRawNotes] = useLocalStorage(STORAGE_KEY, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(null);

  const notes = useMemo(() => {
    if (!Array.isArray(rawNotes)) return [];
    return rawNotes.map((note) => ({
      ...note,
      labels: normalizeLabels(note?.labels),
    }));
  }, [rawNotes]);

  const availableLabels = useMemo(() => getUniqueLabels(notes), [notes]);

  const activeLabel = useMemo(() => {
    if (!selectedLabel) return null;
    const normalizedSelected = selectedLabel.toLocaleLowerCase('tr');
    return (
      availableLabels.find((label) => label.toLocaleLowerCase('tr') === normalizedSelected) ?? null
    );
  }, [selectedLabel, availableLabels]);

  useEffect(() => {
    if (selectedLabel && !activeLabel) {
      setSelectedLabel(null);
    }
  }, [selectedLabel, activeLabel]);

  const addNote = useCallback(
    ({ title = '', content = '', color = DEFAULT_COLOR_ID, isPinned = false, labels = [] }) => {
      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();

      if (!trimmedTitle && !trimmedContent) {
        return null;
      }

      const now = Date.now();
      const newNote = {
        id: createNoteId(),
        title: trimmedTitle,
        content: trimmedContent,
        color,
        isPinned: Boolean(isPinned),
        labels: normalizeLabels(labels),
        createdAt: now,
        updatedAt: now,
      };

      setRawNotes((prev) => [newNote, ...(Array.isArray(prev) ? prev : [])]);
      return newNote;
    },
    [setRawNotes]
  );

  const updateNote = useCallback(
    (id, updates) => {
      setRawNotes((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list.map((note) => {
          if (note.id !== id) return note;

          const currentLabels = normalizeLabels(note.labels);
          const nextTitle = updates.title !== undefined ? updates.title.trim() : note.title;
          const nextContent = updates.content !== undefined ? updates.content.trim() : note.content;
          const nextColor = updates.color !== undefined ? updates.color : note.color;
          const nextPinned = updates.isPinned !== undefined ? Boolean(updates.isPinned) : note.isPinned;
          const nextLabels =
            updates.labels !== undefined ? normalizeLabels(updates.labels) : currentLabels;

          const hasChanged =
            nextTitle !== note.title ||
            nextContent !== note.content ||
            nextColor !== note.color ||
            nextPinned !== note.isPinned ||
            !areLabelsEqual(currentLabels, nextLabels);

          if (!hasChanged) return note;

          return {
            ...note,
            title: nextTitle,
            content: nextContent,
            color: nextColor,
            isPinned: nextPinned,
            labels: nextLabels,
            updatedAt: Date.now(),
          };
        });
      });
    },
    [setRawNotes]
  );

  const deleteNote = useCallback(
    (id) => {
      setRawNotes((prev) => (Array.isArray(prev) ? prev.filter((note) => note.id !== id) : []));
    },
    [setRawNotes]
  );

  const togglePin = useCallback(
    (id) => {
      setRawNotes((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list.map((note) =>
          note.id === id
            ? { ...note, isPinned: !note.isPinned, updatedAt: Date.now() }
            : note
        );
      });
    },
    [setRawNotes]
  );

  const changeColor = useCallback(
    (id, color) => {
      setRawNotes((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list.map((note) =>
          note.id === id && note.color !== color
            ? { ...note, color, updatedAt: Date.now() }
            : note
        );
      });
    },
    [setRawNotes]
  );

  const changeLabels = useCallback(
    (id, labels) => {
      const nextLabels = normalizeLabels(labels);
      setRawNotes((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list.map((note) => {
          if (note.id !== id) return note;
          const currentLabels = normalizeLabels(note.labels);
          if (areLabelsEqual(currentLabels, nextLabels)) return note;
          return {
            ...note,
            labels: nextLabels,
            updatedAt: Date.now(),
          };
        });
      });
    },
    [setRawNotes]
  );

  const filteredNotes = useMemo(
    () => filterNotes(notes, searchQuery, activeLabel),
    [notes, searchQuery, activeLabel]
  );

  const { pinnedNotes, otherNotes } = useMemo(
    () => partitionNotes(filteredNotes),
    [filteredNotes]
  );

  return {
    notes,
    pinnedNotes,
    otherNotes,
    availableLabels,
    selectedLabel: activeLabel,
    setSelectedLabel,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    changeColor,
    changeLabels,
  };
}
