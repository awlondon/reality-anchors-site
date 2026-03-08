'use client';

/**
 * Reusable skeleton/shimmer placeholder for heavy sections.
 * Shows a pulsing gradient while content is loading.
 */
export default function SectionSkeleton({
  lines = 3,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`} aria-busy="true" aria-label="Loading content">
      {/* Title bar */}
      <div className="h-6 w-48 bg-line/40 rounded" />

      {/* Content lines */}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-line/30 rounded"
          style={{ width: `${85 - i * 12}%` }}
        />
      ))}

      {/* Card placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {[1, 2].map((n) => (
          <div key={n} className="h-32 bg-line/20 rounded-xl border border-line/30" />
        ))}
      </div>
    </div>
  );
}
