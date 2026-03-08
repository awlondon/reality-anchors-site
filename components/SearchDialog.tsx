'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { search, type SearchResult } from '@/lib/searchIndex';
import { trackEvent } from '@/lib/analytics';

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setSelected(0);
  }, []);

  // Cmd/Ctrl+K to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Search as user types
  useEffect(() => {
    const r = search(query);
    setResults(r);
    setSelected(0);
  }, [query]);

  // Keyboard nav inside results
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && results[selected]) {
      trackEvent('search_select', { query, result: results[selected].title });
      close();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" role="dialog" aria-label="Site search" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} aria-hidden="true" />

      {/* Dialog */}
      <div className="relative w-full max-w-lg mx-4 bg-card border border-line rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b border-line">
          <svg className="w-5 h-5 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search pages, tools, pricing..."
            className="w-full py-3 bg-transparent text-txt placeholder:text-muted/50 focus:outline-none text-sm"
            aria-label="Search"
          />
          <kbd className="hidden sm:block text-xs text-muted/50 border border-line rounded px-1.5 py-0.5 font-mono">
            esc
          </kbd>
        </div>

        {/* Results */}
        {query.length >= 2 && (
          <div className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="text-sm text-muted px-3 py-4">No results for &ldquo;{query}&rdquo;</p>
            ) : (
              <ul role="listbox">
                {results.map((r, i) => (
                  <li key={r.href} role="option" aria-selected={i === selected}>
                    <Link
                      href={r.href}
                      onClick={() => {
                        trackEvent('search_select', { query, result: r.title });
                        close();
                      }}
                      className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        i === selected ? 'bg-accent/10 text-txt' : 'text-muted hover:bg-white/5 hover:text-txt'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{r.title}</div>
                        <div className="text-xs text-muted/70 truncate">{r.description}</div>
                      </div>
                      <span className="text-xs text-accent/60 font-mono shrink-0 mt-0.5">{r.category}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-line text-xs text-muted/40">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> select</span>
          <span><kbd className="font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
