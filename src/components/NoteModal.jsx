import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Pin, PinOff, Trash2 } from 'lucide-react';
import { DEFAULT_COLOR_ID, getNoteColor } from '../utils/colors';
import { formatNoteDate } from '../utils/noteHelpers';
import { ColorPicker } from './ColorPicker';
import { LabelInput } from './LabelInput';

export function NoteModal({
  note,
  availableLabels = [],
  onSave,
  onChangeLabels,
  onDelete,
  onClose,
}) {
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  const [color, setColor] = useState(note.color || DEFAULT_COLOR_ID);
  const [isPinned, setIsPinned] = useState(Boolean(note.isPinned));
  const [isHidden, setIsHidden] = useState(Boolean(note.isHidden));
  const [labels, setLabels] = useState(() => (Array.isArray(note.labels) ? note.labels : []));

  const dialogRef = useRef(null);
  const isDeletingRef = useRef(false);
  const draftRef = useRef({ title, content, color, isPinned, isHidden, labels });

  useEffect(() => {
    draftRef.current = { title, content, color, isPinned, isHidden, labels };
  }, [title, content, color, isPinned, isHidden, labels]);

  function handleLabelsChange(nextLabels) {
    setLabels(nextLabels);
    onChangeLabels?.(note.id, nextLabels);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (!dialog.open) {
      dialog.showModal();
    }

    // Fallback light-dismiss for browsers without native `closedby="any"` support (e.g. Safari)
    let cleanupBackdrop = () => {};
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      let pressedOutside = false;
      const isOutside = (event) => {
        const rect = dialog.getBoundingClientRect();
        return (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        );
      };

      const handlePointerDown = (event) => {
        pressedOutside = isOutside(event);
      };
      const handlePointerUp = (event) => {
        if (pressedOutside && isOutside(event)) {
          dialog.close();
        }
        pressedOutside = false;
      };

      dialog.addEventListener('pointerdown', handlePointerDown);
      dialog.addEventListener('pointerup', handlePointerUp);
      cleanupBackdrop = () => {
        dialog.removeEventListener('pointerdown', handlePointerDown);
        dialog.removeEventListener('pointerup', handlePointerUp);
      };
    }

    return () => {
      cleanupBackdrop();
    };
  }, [note.id]);

  function handleDialogClose() {
    const dialog = dialogRef.current;
    if (dialog?.open) {
      return;
    }
    if (dialog) {
      dialog.returnValue = '';
    }

    if (!isDeletingRef.current) {
      const current = draftRef.current;
      if (!current.title.trim() && !current.content.trim()) {
        onDelete(note.id);
      } else {
        onSave(note.id, current);
      }
    }

    onClose();
  }

  function handleDeleteClick() {
    isDeletingRef.current = true;
    onDelete(note.id);
    dialogRef.current?.close();
  }

  const colorTheme = getNoteColor(color);
  const formattedDate = formatNoteDate(note.updatedAt);

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-label="Notu düzenle"
      onClose={handleDialogClose}
      className={`m-auto w-[min(92vw,36rem)] overflow-visible rounded-2xl border p-0 shadow-2xl ${colorTheme.bgClass} ${colorTheme.borderClass}`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2 px-5 pt-4">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Başlık"
            aria-label="Başlık"
            autoFocus
            className="w-full bg-transparent text-lg font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsPinned((prev) => !prev)}
            aria-label={isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
            aria-pressed={isPinned}
            title={isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/8 focus-visible:outline-2 focus-visible:outline-amber-500 ${
              isPinned ? 'bg-black/8 text-slate-900' : 'text-slate-500'
            }`}
          >
            {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </button>
        </div>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Not alın..."
          aria-label="Not içeriği"
          rows={7}
          className="max-h-[55vh] w-full resize-y bg-transparent px-5 py-3 text-sm leading-relaxed text-slate-800 placeholder:text-slate-500 focus:outline-none"
        />

        <div className="px-5 pb-3">
          <LabelInput
            labels={labels}
            availableLabels={availableLabels}
            onChange={handleLabelsChange}
          />
        </div>

        {formattedDate && (
          <div className="px-5 pb-2 text-right text-xs text-slate-500">
            Son düzenleme: {formattedDate}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-black/8 px-4 py-2.5">
          <div className="flex items-center gap-1">
            <ColorPicker selectedColor={color} onSelectColor={setColor} />
            <button
              type="button"
              onClick={() => setIsHidden((prev) => !prev)}
              aria-label={isHidden ? 'Gizliden çıkar' : 'Gizle'}
              aria-pressed={isHidden}
              title={isHidden ? 'Gizliden çıkar' : 'Gizle'}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/8 focus-visible:outline-2 focus-visible:outline-amber-500 ${
                isHidden ? 'bg-black/8 text-slate-900' : 'text-slate-600'
              }`}
            >
              {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={handleDeleteClick}
              aria-label="Sil"
              title="Sil"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-black/8 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-800 transition-colors hover:bg-black/8 focus-visible:outline-2 focus-visible:outline-amber-500"
          >
            Kapat
          </button>
        </div>
      </div>
    </dialog>
  );
}
