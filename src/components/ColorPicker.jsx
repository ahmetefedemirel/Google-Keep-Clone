import { useEffect, useRef, useState } from 'react';
import { Check, Palette } from 'lucide-react';
import { NOTE_COLORS } from '../utils/colors';

export function ColorPicker({ selectedColor, onSelectColor, align = 'left' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const positionClass = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div
      ref={containerRef}
      className="relative"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Renk değiştir"
        aria-expanded={isOpen}
        title="Renk değiştir"
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-black/8 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-amber-500"
      >
        <Palette className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          role="group"
          aria-label="Arka plan rengi seç"
          className={`absolute bottom-10 ${positionClass} z-40 flex items-center gap-1.5 rounded-full border border-slate-200 bg-white p-2 shadow-lg`}
        >
          {NOTE_COLORS.map((color) => {
            const isSelected = selectedColor === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => {
                  onSelectColor(color.id);
                  setIsOpen(false);
                }}
                title={color.label}
                aria-label={color.label}
                aria-pressed={isSelected}
                className={`flex h-7 w-7 items-center justify-center rounded-full border transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-amber-500 ${color.swatchClass} ${
                  isSelected ? 'ring-2 ring-slate-700 ring-offset-1' : ''
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5 text-slate-800" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
