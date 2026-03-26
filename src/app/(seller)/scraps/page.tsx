import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrapCard } from "@/components/shared/scrap-card";
import { isMockMode, mockScraps } from "@/lib/mock-data";
import { Package, Plus } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          My Scrap Listings
        </h1>
        <Link href="/scraps/new">
          <Button className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            New Listing
          </Button>
        </Link>
      </div>

      {scraps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.06] py-16">
          <Package className="h-12 w-12 text-white/20" />
          <p className="mt-4 text-lg font-medium text-white/60">
            No listings yet
          </p>
          <p className="mt-1 text-sm text-white/40">
            Create your first scrap listing to start selling.
          </p>
          <Link href="/scraps/new" className="mt-4">
            <Button className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
