import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Plus, Tag } from 'lucide-react';
import { normalizeLabels } from '../utils/noteHelpers';

const MAX_LABEL_LENGTH = 24;

export function LabelPicker({
  selectedLabels = [],
  availableLabels = [],
  onChangeLabels,
  align = 'left',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const safeSelected = useMemo(() => normalizeLabels(selectedLabels), [selectedLabels]);
  const selectedKeySet = useMemo(
    () => new Set(safeSelected.map((label) => label.toLocaleLowerCase('tr'))),
    [safeSelected]
  );

  const allOptions = useMemo(() => {
    const merged = normalizeLabels([...availableLabels, ...safeSelected]);
    return merged.sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }));
  }, [availableLabels, safeSelected]);

  const trimmedInput = inputValue.trim().slice(0, MAX_LABEL_LENGTH);
  const normalizedQuery = trimmedInput.toLocaleLowerCase('tr');

  const filteredOptions = useMemo(() => {
    if (!normalizedQuery) return allOptions;
    return allOptions.filter((label) => label.toLocaleLowerCase('tr').includes(normalizedQuery));
  }, [allOptions, normalizedQuery]);

  const exactExistingMatch = useMemo(
    () => allOptions.find((label) => label.toLocaleLowerCase('tr') === normalizedQuery) ?? null,
    [allOptions, normalizedQuery]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    inputRef.current?.focus();

    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setInputValue('');
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setIsOpen(false);
        setInputValue('');
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function toggleLabel(label) {
    const key = label.toLocaleLowerCase('tr');
    if (selectedKeySet.has(key)) {
      onChangeLabels(safeSelected.filter((item) => item.toLocaleLowerCase('tr') !== key));
    } else {
      onChangeLabels(normalizeLabels([...safeSelected, label]));
    }
  }

  function addNewLabel() {
    if (!trimmedInput) return;

    const canonical = exactExistingMatch ?? trimmedInput;
    const key = canonical.toLocaleLowerCase('tr');

    if (!selectedKeySet.has(key)) {
      onChangeLabels(normalizeLabels([...safeSelected, canonical]));
    }
    setInputValue('');
  }

  function handleInputKeyDown(event) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      event.stopPropagation();
      addNewLabel();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      if (inputValue) {
        setInputValue('');
      } else {
        setIsOpen(false);
      }
    }
  }

  const positionClass = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div
      ref={containerRef}
      className="relative"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => {
            if (prev) setInputValue('');
            return !prev;
          });
        }}
        aria-label="Etiketleri düzenle"
        aria-expanded={isOpen}
        title="Etiketleri düzenle"
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-black/8 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-amber-500"
      >
        <Tag className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          role="group"
          aria-label="Etiketleri yönet"
          className={`absolute bottom-10 ${positionClass} z-40 w-56 rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg`}
        >
          <p className="mb-2 text-xs font-semibold text-slate-700">Etiket ekle</p>

          <div className="mb-2 flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 focus-within:border-amber-400 focus-within:bg-white">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleInputKeyDown}
              maxLength={MAX_LABEL_LENGTH}
              placeholder="Etiket adı..."
              aria-label="Etiket ara veya ekle"
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {trimmedInput && (
              <button
                type="button"
                onClick={addNewLabel}
                aria-label="Etiketi ekle"
                title="Etiketi ekle"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-amber-500"
              >
                <Plus className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="max-h-40 space-y-0.5 overflow-y-auto">
            {filteredOptions.map((label) => {
              const isSelected = selectedKeySet.has(label.toLocaleLowerCase('tr'));
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleLabel(label)}
                  aria-pressed={isSelected}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-amber-500"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      isSelected
                        ? 'border-slate-800 bg-slate-800 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" strokeWidth={2.5} />}
                  </span>
                  <span className="truncate">{label}</span>
                </button>
              );
            })}

            {trimmedInput && !exactExistingMatch && (
              <button
                type="button"
                onClick={addNewLabel}
                className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-xs font-medium text-slate-800 transition-colors hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-amber-500"
              >
                <Plus className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                <span className="truncate">"{trimmedInput}" oluştur</span>
              </button>
            )}

            {filteredOptions.length === 0 && !trimmedInput && (
              <p className="px-2 py-1 text-xs text-slate-400">
                Henüz etiket yok. Yeni bir etiket yazın.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
