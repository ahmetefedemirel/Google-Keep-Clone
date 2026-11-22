import { Pin, PinOff, Trash2 } from 'lucide-react';
import { getNoteColor } from '../utils/colors';
import { ColorPicker } from './ColorPicker';

export function NoteCard({ note, onSelect, onTogglePin, onChangeColor, onDelete }) {
  const colorTheme = getNoteColor(note.color);

  function handleCardKeyDown(event) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(note.id);
    }
  }

  return (
    <article
      tabIndex={0}
      onClick={() => onSelect(note.id)}
      onKeyDown={handleCardKeyDown}
      aria-label={note.title ? `${note.title} notunu düzenle` : 'Notu düzenle'}
      className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 shadow-2xs transition-all hover:shadow-md focus-visible:outline-2 focus-visible:outline-amber-500 ${colorTheme.bgClass} ${colorTheme.borderClass}`}
    >
      <div className="mb-3 pr-8">
        {note.title && (
          <h3 className="mb-1.5 line-clamp-2 text-base font-semibold leading-snug text-slate-900 break-words">
            {note.title}
          </h3>
        )}
        {note.content && (
          <p className="line-clamp-8 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">
            {note.content}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onTogglePin(note.id);
        }}
        aria-label={note.isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
        aria-pressed={note.isPinned}
        title={note.isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
        className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-black/8 focus-visible:outline-2 focus-visible:outline-amber-500 ${
          note.isPinned
            ? 'bg-black/6 text-slate-900 opacity-100'
            : 'text-slate-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'
        }`}
      >
        {note.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
      </button>

      <div
        className="flex items-center justify-between pt-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        onClick={(event) => event.stopPropagation()}
      >
        <ColorPicker
          selectedColor={note.color}
          onSelectColor={(nextColor) => onChangeColor(note.id, nextColor)}
        />

        <button
          type="button"
          onClick={() => onDelete(note.id)}
          aria-label="Sil"
          title="Sil"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-black/8 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-amber-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
