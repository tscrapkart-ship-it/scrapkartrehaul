export default function ScrapsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-36 rounded-md bg-white/[0.06] animate-pulse" />
          <div className="mt-2 h-4 w-48 rounded-md bg-[#1A1A1A] animate-pulse" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-white/[0.06] animate-pulse" />
      </div>

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
