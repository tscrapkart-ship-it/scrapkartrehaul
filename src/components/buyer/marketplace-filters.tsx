"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low -> High" },
  { value: "price_desc", label: "Price: High -> Low" },
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
    <div className={`space-y-4 transition-opacity ${isPending ? "opacity-60" : "opacity-100"}`}>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <Input
          placeholder="Search scrap listings..."
          defaultValue={currentSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="border-white/[0.06] bg-[#002a47] pl-10 text-white placeholder:text-white/30 focus-visible:ring-brand-accent/30"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = (currentCategory ?? "All") === cat;
          return (
            <button
              key={cat}
              disabled={isPending}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-accent text-brand-dark"
                  : "border border-white/10 bg-transparent text-white/60 hover:border-brand-accent/30 hover:text-white"
              }`}
              onClick={() => updateParams("category", cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        {sortOptions.map((opt) => {
          const isActive = (currentSort ?? "newest") === opt.value;
          return (
            <Button
              key={opt.value}
              variant="ghost"
              size="sm"
              disabled={isPending}
              className={
                isActive
                  ? "bg-brand-secondary/20 text-brand-accent hover:bg-brand-secondary/30"
                  : "text-white/40 hover:bg-white/[0.06] hover:text-white"
              }
              onClick={() => updateParams("sort", opt.value)}
            >
              {opt.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
