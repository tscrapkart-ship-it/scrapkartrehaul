import { ScrapGrid } from "@/components/buyer/scrap-grid";
import { MarketplaceFilters } from "@/components/buyer/marketplace-filters";
import { isMockMode, mockScraps } from "@/lib/mock-data";
import type { ScrapCategory } from "@/types";
import { Store } from "lucide-react";

async function getScraps(params: {
  category?: string;
  sort?: string;
  search?: string;
}) {
  if (isMockMode()) {
    let results = mockScraps.filter((s) => s.status === "live");
    if (params.category && params.category !== "All") {
      results = results.filter((s) => s.category === params.category);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      results = results.filter((s) => s.title.toLowerCase().includes(q));
    }
    if (params.sort === "price_asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (params.sort === "price_desc") {
      results.sort((a, b) => b.price - a.price);
    }
    return results;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("scraps")
    .select("*, companies(name, logo_url)")
    .eq("status", "live");

  if (params.category && params.category !== "All") {
    query = query.eq("category", params.category as ScrapCategory);
  }
  if (params.search) {
    query = query.ilike("title", `%${params.search}%`);
  }
  if (params.sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (params.sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data } = await query;
  return data ?? [];
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; search?: string }>;
}) {
  const params = await searchParams;
  const scraps = await getScraps(params);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
            <Store className="h-5 w-5 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Marketplace</h1>
            <p className="text-sm text-[#737373]">
              Browse available scrap materials from verified sellers
            </p>
          </div>
        </div>
        {scraps.length > 0 && (
          <span className="shrink-0 rounded-lg bg-[#1A1A1A] border border-[#262626] px-3 py-1.5 text-xs font-medium text-[#737373]">
            {scraps.length} listing{scraps.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <MarketplaceFilters
        currentCategory={params.category}
        currentSort={params.sort}
        currentSearch={params.search}
      />
      <ScrapGrid scraps={scraps} />
    </div>
  );
}
