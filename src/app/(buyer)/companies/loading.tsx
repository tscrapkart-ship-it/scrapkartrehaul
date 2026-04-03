export default function CompaniesLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-36 rounded-md bg-[#1A1A1A] animate-pulse" />
        <div className="mt-2 h-4 w-64 rounded-md bg-[#1A1A1A] animate-pulse" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#262626] bg-card p-5 space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#1A1A1A]" />
              <div className="space-y-1.5">
                <div className="h-5 w-32 rounded bg-[#1A1A1A]" />
                <div className="h-3 w-20 rounded bg-[#1A1A1A]" />
              </div>
            </div>
            <div className="h-4 w-full rounded bg-[#1A1A1A]" />
            <div className="h-4 w-3/4 rounded bg-[#1A1A1A]" />
          </div>
        ))}
      </div>
    </div>
  );
}
