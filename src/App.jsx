import { useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import { Header } from './components/Header';
import { LabelFilterBar } from './components/LabelFilterBar';
import { NoteCreator } from './components/NoteCreator';
import { NoteGrid } from './components/NoteGrid';
import { NoteModal } from './components/NoteModal';
import { PinModal } from './components/PinModal';
import { useHiddenPin } from './hooks/useHiddenPin';
import { useNotes } from './hooks/useNotes';

export default function App() {
  const [isHiddenView, setIsHiddenView] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const { hasPin, savePin, verifyPin } = useHiddenPin();

  const {
    viewNotes,
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
    toggleHidden,
    changeColor,
    changeLabels,
  } = useNotes(isHiddenView);

  const [editingNoteId, setEditingNoteId] = useState(null);

  const editingNote = useMemo(
    () => viewNotes.find((note) => note.id === editingNoteId) ?? null,
    [viewNotes, editingNoteId]
  );

  function resetViewContext() {
    setEditingNoteId(null);
    setSearchQuery('');
    setSelectedLabel(null);
  }

  function handleToggleHiddenView() {
    if (isHiddenView) {
      resetViewContext();
      setIsHiddenView(false);
    } else {
      setIsPinModalOpen(true);
    }
  }

  function handlePinSuccess() {
    setIsPinModalOpen(false);
    resetViewContext();
    setIsHiddenView(true);
  }

  function handleDeleteNote(id) {
    if (editingNoteId === id) {
      setEditingNoteId(null);
    }
    deleteNote(id);
  }

  function handleToggleHidden(id) {
    if (editingNoteId === id) {
      setEditingNoteId(null);
    }
    toggleHidden(id);
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        noteCount={viewNotes.length}
        isHiddenView={isHiddenView}
        onToggleHiddenView={handleToggleHiddenView}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {isHiddenView ? (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Gizli Notlar</h2>
                <p className="text-xs text-slate-500">
                  Bu görünümdeki notlar ana listede ve normal aramalarda görünmez.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleHiddenView}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              Gizli notları kilitle
            </button>
          </div>
        ) : (
          <NoteCreator onCreateNote={addNote} availableLabels={availableLabels} />
        )}

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
          isHiddenView={isHiddenView}
          onSelectNote={setEditingNoteId}
          onTogglePin={togglePin}
          onToggleHidden={handleToggleHidden}
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

      {isPinModalOpen && (
        <PinModal
          hasPin={hasPin}
          onSavePin={savePin}
          onVerifyPin={verifyPin}
          onSuccess={handlePinSuccess}
          onClose={() => setIsPinModalOpen(false)}
        />
      )}
    </div>
  );
}
