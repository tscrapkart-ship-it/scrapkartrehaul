import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrapCard } from "@/components/shared/scrap-card";
import { isMockMode, mockScraps } from "@/lib/mock-data";
import { Package, Plus, Layers } from "lucide-react";

async function getScraps() {
  if (isMockMode()) {
    return mockScraps.filter((s) => s.seller_id === "u2");
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("scraps")
    .select("*")
    .eq("seller_id", user!.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function SellerScrapsPage() {
  const scraps = await getScraps();

  const liveCount = scraps.filter((s) => s.status === "live").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
            <Layers className="h-5 w-5 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Listings</h1>
            <p className="text-sm text-[#737373]">
              {scraps.length > 0
                ? `${scraps.length} total · ${liveCount} live`
                : "Create and manage your scrap listings"}
            </p>
          </div>
        </div>
        <Link href="/scraps/new">
          <Button className="bg-[#10B981] text-black hover:bg-[#059669] font-semibold h-10 px-5 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Plus className="mr-2 h-4 w-4" />
            New Listing
          </Button>
        </Link>
      </div>

      {scraps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#262626] bg-[#141414]/50 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A1A1A] border border-[#262626] mb-4">
            <Package className="h-7 w-7 text-[#525252]" />
          </div>
          <p className="text-lg font-semibold text-[#D4D4D4]">No listings yet</p>
          <p className="mt-1 text-sm text-[#525252] max-w-xs text-center">
            Create your first scrap listing to start receiving bids from verified recyclers.
          </p>
          <Link href="/scraps/new" className="mt-6">
            <Button className="bg-[#10B981] text-black hover:bg-[#059669] font-semibold h-10 px-6 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {scraps.map((scrap) => (
            <Link key={scrap.id} href={`/scraps/${scrap.id}/edit`}>
              <ScrapCard scrap={scrap} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
