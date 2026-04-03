export default function AdminBidsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-24 rounded-md bg-[#1A1A1A] animate-pulse" />
        <div className="mt-2 h-4 w-52 rounded-md bg-[#1A1A1A] animate-pulse" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-[#1A1A1A] animate-pulse" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-[#262626] bg-card overflow-hidden">
        <div className="border-b border-[#262626] px-5 py-3 flex gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 w-20 rounded bg-[#1A1A1A] animate-pulse" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-8 px-5 py-4 border-b border-[#1A1A1A]">
            <div className="h-4 w-36 rounded bg-[#1A1A1A] animate-pulse" />
            <div className="h-4 w-28 rounded bg-[#1A1A1A] animate-pulse" />
            <div className="h-4 w-20 rounded bg-[#1A1A1A] animate-pulse" />
            <div className="h-4 w-24 rounded bg-[#1A1A1A] animate-pulse" />
            <div className="h-5 w-16 rounded-full bg-[#1A1A1A] animate-pulse" />
            <div className="h-4 w-16 rounded bg-[#1A1A1A] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
