export default function MarketplaceLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-40 rounded-md bg-white/[0.06] animate-pulse" />
        <div className="mt-2 h-4 w-72 rounded-md bg-[#1A1A1A] animate-pulse" />
      </div>

      {/* Filter skeleton */}
      <div className="space-y-4">
        <div className="h-10 max-w-md rounded-md bg-white/[0.06] animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full bg-white/[0.06] animate-pulse" />
          ))}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-32 rounded-md bg-white/[0.06] animate-pulse" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#262626] bg-card p-4 space-y-3 animate-pulse">
            <div className="aspect-video w-full rounded-lg bg-white/[0.06]" />
            <div className="h-5 w-3/4 rounded bg-white/[0.06]" />
            <div className="h-4 w-1/2 rounded bg-[#1A1A1A]" />
            <div className="flex justify-between">
              <div className="h-6 w-24 rounded bg-white/[0.06]" />
              <div className="h-6 w-16 rounded-full bg-white/[0.06]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
