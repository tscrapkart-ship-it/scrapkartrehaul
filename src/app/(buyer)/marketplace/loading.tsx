import { ScrapCardSkeleton } from "@/components/shared/scrap-card";

export default function MarketplaceLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-40 rounded-md bg-[#1A1A1A] animate-pulse" />
        <div className="mt-2 h-4 w-full max-w-72 rounded-md bg-[#1A1A1A] animate-pulse" />
      </div>

      {/* Filter skeleton */}
      <div className="space-y-4">
        <div className="h-10 max-w-md rounded-md bg-[#1A1A1A] animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full bg-[#1A1A1A] animate-pulse" />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-24 sm:w-32 rounded-md bg-[#1A1A1A] animate-pulse" />
          ))}
        </div>
      </div>

      {/* Grid skeleton using ScrapCardSkeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ScrapCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
