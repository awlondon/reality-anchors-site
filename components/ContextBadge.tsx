'use client';

import { useState, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  context: string;
};

export default function ContextBadge({ children, context }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 cursor-help group"
        aria-expanded={open}
        aria-label="Show context for this number"
      >
        {children}
        <svg className="w-3 h-3 text-muted/50 group-hover:text-accent transition-colors shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="8" y="11.5" textAnchor="middle" fontSize="9" fill="currentColor">i</text>
        </svg>
      </button>
      {open && (
        <span className="absolute z-20 left-0 top-full mt-1 w-48 rounded-lg border border-line bg-card px-3 py-2 text-[11px] text-muted leading-relaxed shadow-xl shadow-black/30">
          {context}
        </span>
      )}
    </span>
  );
}
