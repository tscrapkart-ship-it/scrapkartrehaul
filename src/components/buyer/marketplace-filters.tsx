"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, ArrowDownAZ, ArrowUpAZ, Clock } from "lucide-react";
import type { ScrapCategory } from "@/types";

const categories: (ScrapCategory | "All")[] = [
  "All",
  "Metal",
  "E-waste",
  "Plastic",
  "Paper",
  "Glass",
  "Mixed Scrap",
];

const sortOptions = [
  { value: "newest", label: "Newest", icon: Clock },
  { value: "price_asc", label: "Price: Low → High", icon: ArrowDownAZ },
  { value: "price_desc", label: "Price: High → Low", icon: ArrowUpAZ },
];

export function MarketplaceFilters({
  currentCategory,
  currentSort,
  currentSearch,
}: {
  currentCategory?: string;
  currentSort?: string;
  currentSearch?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All" && value !== "newest") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/marketplace?${params.toString()}`);
    });
  }

  function handleSearchChange(value: string) {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      updateParams("search", value);
    }, 300);
  }

  return (
    <div
      className={`space-y-4 transition-opacity duration-200 ${
        isPending ? "opacity-60" : "opacity-100"
      }`}
    >
      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#525252]" />
        <Input
          placeholder="Search by title, material, or location..."
          defaultValue={currentSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="h-11 rounded-xl border-[#262626] bg-[#141414] pl-10 text-[#F5F5F5] placeholder:text-[#525252] focus-visible:border-[#10B981]/40 focus-visible:ring-1 focus-visible:ring-[#10B981]/20"
        />
      </div>

      {/* Category pills + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isActive = (currentCategory ?? "All") === cat;
            return (
              <button
                key={cat}
                disabled={isPending}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#10B981] text-black shadow-sm"
                    : "bg-[#141414] border border-[#262626] text-[#A3A3A3] hover:border-[#404040] hover:text-white"
                }`}
                onClick={() => updateParams("category", cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1">
          {sortOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = (currentSort ?? "newest") === opt.value;
            return (
              <button
                key={opt.value}
                disabled={isPending}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#10B981]/10 text-[#10B981]"
                    : "text-[#737373] hover:bg-[#1A1A1A] hover:text-white"
                }`}
                onClick={() => updateParams("sort", opt.value)}
              >
                <Icon className="h-3.5 w-3.5" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
