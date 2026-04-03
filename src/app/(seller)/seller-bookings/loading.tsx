export default function SellerBookingsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-40 rounded-md bg-white/[0.06] animate-pulse" />
        <div className="mt-2 h-4 w-64 rounded-md bg-[#1A1A1A] animate-pulse" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#262626] bg-card p-4 space-y-3 animate-pulse">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/[0.06]" />
                <div className="space-y-1">
                  <div className="h-4 w-28 rounded bg-white/[0.06]" />
                  <div className="h-3 w-40 rounded bg-[#1A1A1A]" />
                </div>
              </div>
              <div className="h-5 w-20 rounded-full bg-white/[0.06]" />
            </div>
            <div className="flex gap-6">
              <div className="h-6 w-24 rounded bg-white/[0.06]" />
              <div className="h-4 w-32 rounded bg-[#1A1A1A]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
