import { Search, X } from 'lucide-react';

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex w-full max-w-xl items-center">
      <Search
        className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-500"
        aria-hidden="true"
      />
      <input
        type="text"
        role="searchbox"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Notlarda ara..."
        aria-label="Notlarda ara"
        className="w-full rounded-xl border border-transparent bg-slate-100 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-500 transition-all focus:border-slate-200 focus:bg-white focus:shadow-sm focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Aramayı temizle"
          title="Aramayı temizle"
          className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-200/70 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-amber-500"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
