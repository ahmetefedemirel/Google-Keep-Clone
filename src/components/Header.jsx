import { StickyNote } from 'lucide-react';
import { SearchBar } from './SearchBar';

export function Header({ searchQuery, onSearchChange, noteCount }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-amber-950 shadow-xs">
            <StickyNote className="h-5 w-5" />
          </div>
          <h1 className="hidden text-lg font-semibold tracking-tight text-slate-800 sm:block">
            Keep Notlar
          </h1>
        </div>

        <SearchBar value={searchQuery} onChange={onSearchChange} />

        <div className="hidden shrink-0 text-xs font-medium text-slate-500 md:block">
          {noteCount} not
        </div>
      </div>
    </header>
  );
}
