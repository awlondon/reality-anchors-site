'use client';

import { useState } from 'react';

export default function AcronymHint({
  acronym,
  caption,
}: {
  acronym: string;
  caption: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const isOpen = isHovered || isPinned;

  return (
    <span className="relative inline-flex items-center align-baseline">
      <button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        onClick={() => setIsPinned((prev) => !prev)}
        className="inline-flex items-center rounded px-1 text-inherit decoration-dotted underline-offset-2 transition-colors hover:bg-neutral-100 hover:text-neutral-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        aria-expanded={isOpen}
        aria-label={`${acronym}: ${caption}`}
      >
        {acronym}
      </button>
      {isOpen ? (
        <span className="absolute left-0 top-full z-20 mt-1 w-64 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-left text-[11px] font-normal normal-case tracking-normal text-white shadow-lg">
          {caption}
        </span>
      ) : null}
    </span>
  );
}
