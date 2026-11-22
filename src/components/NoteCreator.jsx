import { useCallback, useEffect, useRef, useState } from 'react';
import { Pin, PinOff } from 'lucide-react';
import { DEFAULT_COLOR_ID, getNoteColor } from '../utils/colors';
import { ColorPicker } from './ColorPicker';

export function NoteCreator({ onCreateNote }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR_ID);
  const [isPinned, setIsPinned] = useState(false);

  const containerRef = useRef(null);
  const contentInputRef = useRef(null);

  const resetForm = useCallback(() => {
    setTitle('');
    setContent('');
    setColor(DEFAULT_COLOR_ID);
    setIsPinned(false);
    setIsExpanded(false);
  }, []);

  const commitAndClose = useCallback(() => {
    if (title.trim() || content.trim()) {
      onCreateNote({ title, content, color, isPinned });
    }
    resetForm();
  }, [title, content, color, isPinned, onCreateNote, resetForm]);

  useEffect(() => {
    if (!isExpanded) return undefined;

    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        commitAndClose();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isExpanded, commitAndClose]);

  useEffect(() => {
    if (isExpanded) {
      contentInputRef.current?.focus();
    }
  }, [isExpanded]);

  const colorTheme = getNoteColor(color);

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      resetForm();
    }
  }

  return (
    <section aria-label="Yeni not oluştur" className="mx-auto mb-8 w-full max-w-xl">
      <div
        ref={containerRef}
        onKeyDown={handleKeyDown}
        className={`rounded-2xl border shadow-sm transition-all ${colorTheme.bgClass} ${colorTheme.borderClass} ${
          isExpanded ? 'shadow-md' : 'hover:shadow-md'
        }`}
      >
        {!isExpanded ? (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-slate-500 focus-visible:outline-2 focus-visible:outline-amber-500 rounded-2xl"
          >
            <span>Not alın...</span>
          </button>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 px-4 pt-3">
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Başlık"
                aria-label="Başlık"
                className="w-full bg-transparent text-base font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsPinned((prev) => !prev)}
                aria-label={isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
                aria-pressed={isPinned}
                title={isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/8 focus-visible:outline-2 focus-visible:outline-amber-500 ${
                  isPinned ? 'text-slate-900 bg-black/8' : 'text-slate-500'
                }`}
              >
                {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              </button>
            </div>

            <textarea
              ref={contentInputRef}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Not alın..."
              aria-label="Not içeriği"
              rows={3}
              className="w-full resize-none bg-transparent px-4 py-2.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-500 focus:outline-none"
            />

            <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
              <div className="flex items-center gap-1">
                <ColorPicker selectedColor={color} onSelectColor={setColor} />
              </div>

              <button
                type="button"
                onClick={commitAndClose}
                className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-black/8 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-amber-500"
              >
                Kapat
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
