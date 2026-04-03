export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-40 rounded-md bg-white/[0.06] animate-pulse" />
        <div className="mt-2 h-4 w-56 rounded-md bg-[#1A1A1A] animate-pulse" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#262626] bg-card p-5 animate-pulse">
            <div className="h-4 w-24 rounded bg-white/[0.06] mb-3" />
            <div className="h-8 w-16 rounded bg-white/[0.06]" />
          </div>
        ))}
      </div>

      {/* Recent listings skeleton */}
      <div className="rounded-xl border border-[#262626] bg-card p-5 space-y-4 animate-pulse">
        <div className="h-5 w-36 rounded bg-white/[0.06]" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-t border-white/[0.04]">
            <div className="space-y-1.5">
              <div className="h-4 w-48 rounded bg-white/[0.06]" />
              <div className="h-3 w-24 rounded bg-[#1A1A1A]" />
            </div>
            <div className="h-6 w-16 rounded-full bg-white/[0.06]" />
          </div>
        ))}
      </div>
    </div>
  );
}
