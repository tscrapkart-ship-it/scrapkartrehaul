export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-44 rounded-md bg-[#1A1A1A] animate-pulse" />
        <div className="mt-2 h-4 w-48 rounded-md bg-[#1A1A1A] animate-pulse" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#262626] bg-card p-5 animate-pulse">
            <div className="h-4 w-28 rounded bg-[#1A1A1A] mb-3" />
            <div className="h-8 w-14 rounded bg-[#1A1A1A]" />
          </div>
        ))}
      </div>

      {/* Recent activity skeleton */}
      <div className="rounded-xl border border-[#262626] bg-card p-5 space-y-4 animate-pulse">
        <div className="h-5 w-32 rounded bg-[#1A1A1A]" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-t border-[#1A1A1A]">
            <div className="h-4 w-56 rounded bg-[#1A1A1A]" />
            <div className="h-4 w-20 rounded bg-[#1A1A1A]" />
          </div>
        ))}
      </div>
    </div>
  );
}
