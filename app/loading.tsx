export default function Loading() {
  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6 animate-pulse">
        {/* Breadcrumb / label */}
        <div className="h-3 w-16 bg-line/50 rounded mb-4" />
        {/* Heading */}
        <div className="h-8 w-72 bg-line/60 rounded mb-3" />
        {/* Subtitle */}
        <div className="h-4 w-96 max-w-full bg-line/40 rounded mb-10" />

        {/* Content block */}
        <div className="border border-line rounded-2xl bg-card/50 p-7 space-y-5">
          <div className="h-4 w-full bg-line/40 rounded" />
          <div className="h-4 w-5/6 bg-line/30 rounded" />
          <div className="h-4 w-4/6 bg-line/30 rounded" />
          <div className="h-4 w-full bg-line/40 rounded" />
          <div className="h-4 w-3/4 bg-line/30 rounded" />
        </div>

        {/* Secondary block */}
        <div className="border border-line rounded-2xl bg-card/50 p-7 space-y-5 mt-8">
          <div className="h-5 w-48 bg-line/50 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-24 bg-line/30 rounded-lg" />
            <div className="h-24 bg-line/30 rounded-lg" />
            <div className="h-24 bg-line/30 rounded-lg" />
          </div>
        </div>
      </div>
    </main>
  );
}
