import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { LabelFilterBar } from './components/LabelFilterBar';
import { NoteCreator } from './components/NoteCreator';
import { NoteGrid } from './components/NoteGrid';
import { NoteModal } from './components/NoteModal';
import { useNotes } from './hooks/useNotes';

export default function App() {
  const {
    notes,
    pinnedNotes,
    otherNotes,
    availableLabels,
    selectedLabel,
    setSelectedLabel,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    changeColor,
    changeLabels,
  } = useNotes();

  const [editingNoteId, setEditingNoteId] = useState(null);

  const editingNote = useMemo(
    () => notes.find((note) => note.id === editingNoteId) ?? null,
    [notes, editingNoteId]
  );

  function handleDeleteNote(id) {
    if (editingNoteId === id) {
      setEditingNoteId(null);
    }
    deleteNote(id);
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        noteCount={notes.length}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <NoteCreator onCreateNote={addNote} availableLabels={availableLabels} />

        <LabelFilterBar
          labels={availableLabels}
          selectedLabel={selectedLabel}
          onSelectLabel={setSelectedLabel}
        />

        <NoteGrid
          pinnedNotes={pinnedNotes}
          otherNotes={otherNotes}
          availableLabels={availableLabels}
          hasSearchQuery={Boolean(searchQuery.trim())}
          selectedLabel={selectedLabel}
          onSelectNote={setEditingNoteId}
          onTogglePin={togglePin}
          onChangeColor={changeColor}
          onChangeLabels={changeLabels}
          onDeleteNote={handleDeleteNote}
        />
      </main>

      {editingNote && (
        <NoteModal
          key={editingNote.id}
          note={editingNote}
          availableLabels={availableLabels}
          onSave={updateNote}
          onChangeLabels={changeLabels}
          onDelete={handleDeleteNote}
          onClose={() => setEditingNoteId(null)}
        />
      )}
    </div>
  );
}
