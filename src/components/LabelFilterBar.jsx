import { Tag } from 'lucide-react';

export function LabelFilterBar({ labels, selectedLabel, onSelectLabel }) {
  if (!Array.isArray(labels) || labels.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Etiketlere göre filtrele"
      className="mb-6 flex flex-wrap items-center gap-2"
    >
      <span className="inline-flex items-center gap-1.5 pr-1 text-xs font-medium text-slate-500">
        <Tag className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Etiketler:</span>
      </span>

      <button
        type="button"
        onClick={() => onSelectLabel(null)}
        aria-pressed={selectedLabel === null}
        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-amber-500 ${
          selectedLabel === null
            ? 'border-slate-800 bg-slate-800 text-white shadow-2xs'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        Tümü
      </button>

      {labels.map((label) => {
        const isSelected = selectedLabel === label;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelectLabel(isSelected ? null : label)}
            aria-pressed={isSelected}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-amber-500 ${
              isSelected
                ? 'border-slate-800 bg-slate-800 text-white shadow-2xs'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
