import { Search, StickyNote } from 'lucide-react';
import { NoteCard } from './NoteCard';

function NoteSection({
  heading,
  notes,
  onSelectNote,
  onTogglePin,
  onChangeColor,
  onDeleteNote,
}) {
  return (
    <section className="mb-8 last:mb-0">
      {heading && (
        <h2 className="mb-3 px-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {heading}
        </h2>
      )}
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onSelect={onSelectNote}
            onTogglePin={onTogglePin}
            onChangeColor={onChangeColor}
            onDelete={onDeleteNote}
          />
        ))}
      </div>
    </section>
  );
}

export function NoteGrid({
  pinnedNotes,
  otherNotes,
  hasSearchQuery,
  onSelectNote,
  onTogglePin,
  onChangeColor,
  onDeleteNote,
}) {
  const hasPinned = pinnedNotes.length > 0;
  const hasOther = otherNotes.length > 0;

  if (!hasPinned && !hasOther) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          {hasSearchQuery ? <Search className="h-8 w-8" /> : <StickyNote className="h-8 w-8" />}
        </div>
        <p className="text-base font-medium text-slate-600">
          {hasSearchQuery ? 'Aramanızla eşleşen not bulunamadı' : 'Henüz not eklenmedi'}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          {hasSearchQuery
            ? 'Farklı bir anahtar kelime deneyin.'
            : 'Yukarıdaki alandan ilk notunuzu oluşturun.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {hasPinned && (
        <NoteSection
          heading="SABİTLENENLER"
          notes={pinnedNotes}
          onSelectNote={onSelectNote}
          onTogglePin={onTogglePin}
          onChangeColor={onChangeColor}
          onDeleteNote={onDeleteNote}
        />
      )}

      {hasOther && (
        <NoteSection
          heading={hasPinned ? 'DİĞERLERİ' : null}
          notes={otherNotes}
          onSelectNote={onSelectNote}
          onTogglePin={onTogglePin}
          onChangeColor={onChangeColor}
          onDeleteNote={onDeleteNote}
        />
      )}
    </div>
  );
}
