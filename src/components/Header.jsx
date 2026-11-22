import { Lock, LockOpen, StickyNote } from 'lucide-react';
import { SearchBar } from './SearchBar';

export function Header({
  searchQuery,
  onSearchChange,
  noteCount,
  isHiddenView = false,
  onToggleHiddenView,
}) {
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

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggleHiddenView}
            aria-pressed={isHiddenView}
            title={isHiddenView ? 'Normal notlara dön' : 'Gizli notları aç'}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-amber-500 ${
              isHiddenView
                ? 'border-slate-900 bg-slate-900 text-white shadow-2xs hover:bg-slate-800'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {isHiddenView ? <LockOpen className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            <span>Gizli Notlar</span>
          </button>

          <div className="hidden text-xs font-medium text-slate-500 md:block">
            {noteCount} {isHiddenView ? 'gizli not' : 'not'}
          </div>
        </div>
      </div>
    </header>
  );
}
