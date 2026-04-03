import { ScrapCardSkeleton } from "@/components/shared/scrap-card";

export default function ScrapsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-36 rounded-md bg-[#1A1A1A] animate-pulse" />
          <div className="mt-2 h-4 w-48 rounded-md bg-[#1A1A1A] animate-pulse" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-[#1A1A1A] animate-pulse" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ScrapCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
