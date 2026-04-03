import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Gavel, IndianRupee, CalendarDays, User, ChevronRight, Plus, MessageSquare } from "lucide-react";

const statusConfig: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  pending: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400", border: "border-yellow-500/20" },
  accepted: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400", border: "border-green-500/20" },
  rejected: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", border: "border-red-500/20" },
  withdrawn: { bg: "bg-[#1A1A1A]", text: "text-[#525252]", dot: "bg-[#525252]", border: "border-[#262626]" },
};

async function getIncomingBids() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("listing_bids")
    .select("*, scraps!inner(id, title, category, quantity, unit, seller_id), users!listing_bids_recycler_id_fkey(name, email)")
    .eq("scraps.seller_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function SellerBidsPage() {
  const bids = await getIncomingBids();
  const pendingCount = bids.filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Incoming Bids</h1>
          <p className="mt-1 text-base text-[#737373]">
            Review and respond to bids from recyclers
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 px-3 py-1.5 text-sm font-semibold text-[#10B981]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            {pendingCount} pending
          </span>
        )}
      </div>

      {bids.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#262626] bg-[#141414]/50 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A1A1A] border border-[#262626] mb-4">
            <Gavel className="h-7 w-7 text-[#525252]" />
          </div>
          <p className="text-xl font-semibold text-[#D4D4D4]">No bids yet</p>
          <p className="mt-1 text-base text-[#525252] max-w-xs text-center">
            Bids will appear here when recyclers submit offers on your listings.
          </p>
          <Link
            href="/scraps/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#10B981] px-5 py-2.5 text-base font-semibold text-black transition-all hover:bg-[#059669] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <Plus className="h-4 w-4" />
            Post a Listing
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
            } | null;
            const recycler = bid.users as { name: string; email: string } | null;
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
                      </div>
                      <p className="font-semibold text-white truncate group-hover:text-[#10B981] transition-colors text-base">
                        {scrap?.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-sm text-[#525252] mt-1">
                        <User className="h-3 w-3" />
                        <span className="text-[#A3A3A3]">{recycler?.name ?? "Recycler"}</span>
                        {recycler?.email && (
                          <span className="text-[#3F3F3F]">— {recycler.email}</span>
                        )}
                      </div>
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
                      <span className="font-bold text-base">
                        ₹{bid.offered_price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-[#525252] font-normal">offered</span>
                    </div>
                    {bid.estimated_pickup_date && (
                      <div className="flex items-center gap-1.5 text-sm text-[#525252]">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(bid.estimated_pickup_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    )}
                    <span className="text-sm text-[#3F3F3F] ml-auto">
                      {new Date(bid.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {bid.message && (
                    <div className="flex items-start gap-2 mt-3 pt-3 border-t border-[#1A1A1A]">
                      <MessageSquare className="h-3.5 w-3.5 text-[#3F3F3F] shrink-0 mt-0.5" />
                      <p className="text-sm text-[#525252] italic truncate">
                        &ldquo;{bid.message}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
