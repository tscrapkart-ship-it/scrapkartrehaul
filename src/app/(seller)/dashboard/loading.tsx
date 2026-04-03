export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 rounded-lg bg-[#1A1A1A] animate-pulse" />
          <div className="mt-2 h-4 w-64 rounded-lg bg-[#141414] animate-pulse" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-[#1A1A1A] animate-pulse" />
      </div>

      {/* Company card skeleton */}
      <div className="rounded-xl border border-[#262626] bg-[#141414] p-5 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[#1A1A1A]" />
          <div className="space-y-2">
            <div className="h-5 w-40 rounded bg-[#1A1A1A]" />
            <div className="h-3 w-24 rounded bg-[#0A0A0A]" />
          </div>
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#262626] bg-[#141414] p-5 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-20 rounded bg-[#1A1A1A]" />
              <div className="h-8 w-8 rounded-lg bg-[#1A1A1A]" />
            </div>
            <div className="h-7 w-12 rounded bg-[#1A1A1A]" />
          </div>
        ))}
      </div>

      {/* Recent listings skeleton */}
      <div className="rounded-xl border border-[#262626] bg-[#141414] divide-y divide-[#262626] overflow-hidden animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="h-6 w-16 rounded-md bg-[#1A1A1A]" />
              <div className="h-4 w-36 rounded bg-[#1A1A1A]" />
            </div>
            <div className="h-4 w-12 rounded bg-[#0A0A0A]" />
          </div>
        ))}
      </div>
    </div>
  );
}
