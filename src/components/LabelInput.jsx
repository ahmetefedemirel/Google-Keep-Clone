import { useMemo, useState } from 'react';
import { Plus, Tag, X } from 'lucide-react';
import { normalizeLabels } from '../utils/noteHelpers';

const MAX_LABEL_LENGTH = 24;

export function LabelInput({ labels = [], availableLabels = [], onChange }) {
  const [inputValue, setInputValue] = useState('');

  const safeLabels = useMemo(() => normalizeLabels(labels), [labels]);

  const suggestions = useMemo(() => {
    const attachedKeys = new Set(safeLabels.map((label) => label.toLocaleLowerCase('tr')));
    const query = inputValue.trim().toLocaleLowerCase('tr');

    return availableLabels.filter((label) => {
      const key = label.toLocaleLowerCase('tr');
      if (attachedKeys.has(key)) return false;
      if (query && !key.includes(query)) return false;
      return true;
    });
  }, [availableLabels, safeLabels, inputValue]);

  function addLabel(rawValue) {
    const trimmed = rawValue.trim().slice(0, MAX_LABEL_LENGTH);
    if (!trimmed) return;

    const key = trimmed.toLocaleLowerCase('tr');
    const canonical =
      availableLabels.find((existing) => existing.toLocaleLowerCase('tr') === key) ?? trimmed;

    const alreadyAdded = safeLabels.some((existing) => existing.toLocaleLowerCase('tr') === key);
    if (!alreadyAdded) {
      onChange(normalizeLabels([...safeLabels, canonical]));
    }
    setInputValue('');
  }

  function removeLabel(labelToRemove) {
    onChange(safeLabels.filter((label) => label !== labelToRemove));
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      event.stopPropagation();
      addLabel(inputValue);
      return;
    }

    if (event.key === 'Escape' && inputValue) {
      event.preventDefault();
      event.stopPropagation();
      setInputValue('');
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {safeLabels.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {safeLabels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-full bg-black/8 py-0.5 pl-2.5 pr-1.5 text-xs font-medium text-slate-800"
            >
              <span className="max-w-36 truncate">{label}</span>
              <button
                type="button"
                onClick={() => removeLabel(label)}
                aria-label={`${label} etiketini kaldır`}
                title={`${label} etiketini kaldır`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-black/10 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-amber-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/4 px-2.5 py-1 transition-colors focus-within:border-black/25 focus-within:bg-white/60">
          <Tag className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden="true" />
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={MAX_LABEL_LENGTH}
            placeholder="Etiket ekle..."
            aria-label="Etiket ekle"
            className="w-28 bg-transparent text-xs text-slate-800 placeholder:text-slate-500 focus:outline-none sm:w-32"
          />
          {inputValue.trim() && (
            <button
              type="button"
              onClick={() => addLabel(inputValue)}
              aria-label="Etiketi ekle"
              title="Etiketi ekle"
              className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              <Plus className="h-3 w-3" />
            </button>
          )}
        </div>

        {suggestions.slice(0, 6).map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => addLabel(label)}
            aria-label={`${label} etiketini ekle`}
            className="inline-flex items-center gap-0.5 rounded-full border border-black/10 bg-white/50 px-2.5 py-1 text-xs text-slate-600 transition-colors hover:bg-black/8 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-amber-500"
          >
            <Plus className="h-3 w-3" aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
