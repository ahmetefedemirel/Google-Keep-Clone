import { Pin, PinOff, Trash2, X } from 'lucide-react';
import { getNoteColor } from '../utils/colors';
import { ColorPicker } from './ColorPicker';
import { LabelPicker } from './LabelPicker';

export function NoteCard({
  note,
  availableLabels = [],
  onSelect,
  onTogglePin,
  onChangeColor,
  onChangeLabels,
  onDelete,
}) {
  const colorTheme = getNoteColor(note.color);
  const labels = Array.isArray(note.labels) ? note.labels : [];

  function handleRemoveLabel(event, labelToRemove) {
    event.stopPropagation();
    onChangeLabels(
      note.id,
      labels.filter((label) => label !== labelToRemove)
    );
  }

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

      {labels.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {labels.map((label) => (
            <span
              key={label}
              className="inline-flex max-w-full items-center gap-1 rounded-full bg-black/6 py-0.5 pl-2.5 pr-1.5 text-xs font-medium text-slate-700"
            >
              <span className="truncate">{label}</span>
              <button
                type="button"
                onClick={(event) => handleRemoveLabel(event, label)}
                aria-label={`${label} etiketini kaldır`}
                title={`${label} etiketini kaldır`}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-black/10 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-amber-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

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
        <div className="flex items-center gap-1">
          <ColorPicker
            selectedColor={note.color}
            onSelectColor={(nextColor) => onChangeColor(note.id, nextColor)}
          />
          <LabelPicker
            selectedLabels={labels}
            availableLabels={availableLabels}
            onChangeLabels={(nextLabels) => onChangeLabels(note.id, nextLabels)}
          />
        </div>

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
