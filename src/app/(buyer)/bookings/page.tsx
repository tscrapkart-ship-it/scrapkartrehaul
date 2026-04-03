import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Gavel, IndianRupee, CalendarDays, ArrowRight, ChevronRight } from "lucide-react";

const statusConfig: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  pending: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400", border: "border-yellow-500/20" },
  accepted: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400", border: "border-green-500/20" },
  rejected: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", border: "border-red-500/20" },
  withdrawn: { bg: "bg-[#1A1A1A]", text: "text-[#525252]", dot: "bg-[#525252]", border: "border-[#262626]" },
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Bids</h1>
          <p className="mt-1 text-sm text-[#737373]">
            Track all bids you&apos;ve submitted across listings
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 text-xs font-semibold text-yellow-400">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Summary stats */}
      {bids.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Bids", value: bids.length, color: "text-white", border: "border-[#262626]" },
            { label: "Pending", value: pendingCount, color: "text-yellow-400", border: pendingCount > 0 ? "border-yellow-500/15" : "border-[#262626]" },
            { label: "Accepted", value: acceptedCount, color: "text-green-400", border: acceptedCount > 0 ? "border-green-500/15" : "border-[#262626]" },
          ].map((stat, i) => (
            <div key={stat.label} className={`animate-scale-in delay-${i + 1} rounded-xl border bg-[#141414] p-4 text-center ${stat.border}`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-[#525252] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {bids.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#262626] bg-[#141414]/50 py-16">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A1A1A] border border-[#262626]">
            <Gavel className="h-7 w-7 text-[#525252]" />
          </div>
          <p className="text-lg font-semibold text-[#D4D4D4]">No bids yet</p>
          <p className="mt-1 text-sm text-[#525252] max-w-xs text-center">
            Browse the marketplace and submit bids on listings you&apos;re interested in.
          </p>
          <Link
            href="/marketplace"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#10B981] px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#059669] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            Browse Marketplace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bids.map((bid, i) => {
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
            const sc = statusConfig[bid.status] ?? statusConfig.withdrawn;

            return (
              <Link key={bid.id} href={`/marketplace/${scrap?.id ?? ""}`}>
                <div className={`animate-slide-up delay-${Math.min(i + 1, 6)} group rounded-xl border border-[#262626] bg-[#141414] p-5 transition-all hover:border-[#333] hover:bg-[#1A1A1A] cursor-pointer`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#10B981]/10 px-2.5 py-0.5 text-xs font-medium text-[#10B981]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                          {scrap?.category}
                        </span>
                        {scrap?.companies?.name && (
                          <span className="text-xs text-[#525252] truncate">
                            by {scrap.companies.name}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-white truncate group-hover:text-[#10B981] transition-colors">
                        {scrap?.title ?? "Unknown listing"}
                      </p>
                      {scrap?.city && (
                        <p className="text-xs text-[#525252] mt-0.5">
                          {scrap.city}{scrap.state ? `, ${scrap.state}` : ""}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge className={`${sc.bg} ${sc.text} border ${sc.border}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot} mr-1`} />
                        {bid.status}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-[#525252] group-hover:text-[#10B981] transition-colors" />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-[#1A1A1A]">
                    <div className="flex items-center gap-1.5 text-[#10B981]">
                      <IndianRupee className="h-3.5 w-3.5" />
                      <span className="font-bold">
                        ₹{bid.offered_price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-[#525252] font-normal">your offer</span>
                    </div>
                    {bid.estimated_pickup_date && (
                      <div className="flex items-center gap-1.5 text-xs text-[#525252]">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(bid.estimated_pickup_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    )}
                    <span className="text-xs text-[#3F3F3F] ml-auto">
                      {new Date(bid.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
