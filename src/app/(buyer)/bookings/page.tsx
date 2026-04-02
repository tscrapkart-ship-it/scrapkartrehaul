import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gavel, IndianRupee, CalendarDays, ArrowRight } from "lucide-react";

const statusConfig: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  accepted: "bg-green-500/10 text-green-400 border border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  withdrawn: "bg-white/[0.06] text-white/40 border border-white/[0.06]",
};

async function getMyBids() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("listing_bids")
    .select("*, scraps(id, title, category, quantity, unit, city, state, seller_id, companies(name))")
    .eq("recycler_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function MyBidsPage() {
  const bids = await getMyBids();
  const pendingCount = bids.filter((b) => b.status === "pending").length;
  const acceptedCount = bids.filter((b) => b.status === "accepted").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Bids</h1>
        <p className="mt-1 text-sm text-white/40">
          Track all bids you&apos;ve submitted across listings
        </p>
      </div>

      {/* Summary stats */}
      {bids.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: bids.length, class: "text-white" },
            { label: "Pending", value: pendingCount, class: "text-yellow-400" },
            { label: "Accepted", value: acceptedCount, class: "text-green-400" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-center">
              <p className={`text-2xl font-bold ${stat.class}`}>{stat.value}</p>
              <p className="text-xs text-white/40 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {bids.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.06] bg-[#002a47] py-16">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]">
            <Gavel className="h-6 w-6 text-white/30" />
          </div>
          <p className="text-lg font-medium text-white/60">No bids yet</p>
          <p className="mt-1 text-sm text-white/30">
            Browse the marketplace and submit bids on listings.
          </p>
          <Link
            href="/marketplace"
            className="mt-5 rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-accent/90"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bids.map((bid) => {
            const scrap = bid.scraps as {
              id: string;
              title: string;
              category: string;
              quantity: number;
              unit: string;
              city: string | null;
              state: string | null;
              companies: { name: string } | null;
            } | null;

            return (
              <Link key={bid.id} href={`/marketplace/${scrap?.id ?? ""}`}>
                <Card className="border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all cursor-pointer">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded-full bg-brand-accent/10 px-2.5 py-0.5 text-xs font-medium text-brand-accent">
                            {scrap?.category}
                          </span>
                          {scrap?.companies?.name && (
                            <span className="text-xs text-white/30 truncate">
                              by {scrap.companies.name}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-white truncate">
                          {scrap?.title ?? "Unknown listing"}
                        </p>
                        {scrap?.city && (
                          <p className="text-xs text-white/40 mt-0.5">
                            {scrap.city}{scrap.state ? `, ${scrap.state}` : ""}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge className={statusConfig[bid.status] ?? "bg-white/[0.06] text-white/40"}>
                          {bid.status}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-white/20" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-white/[0.04]">
                      <div className="flex items-center gap-1 text-brand-accent">
                        <IndianRupee className="h-3.5 w-3.5" />
                        <span className="font-bold">
                          ₹{bid.offered_price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-white/40 font-normal">your offer</span>
                      </div>
                      {bid.estimated_pickup_date && (
                        <div className="flex items-center gap-1 text-xs text-white/40">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(bid.estimated_pickup_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      )}
                      <span className="text-xs text-white/25 ml-auto">
                        {new Date(bid.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
