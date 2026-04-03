import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gavel, IndianRupee, CalendarDays, User, ArrowRight } from "lucide-react";

const statusConfig: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  accepted: "bg-green-500/10 text-green-400 border border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  withdrawn: "bg-white/[0.06] text-white/40 border border-[#262626]",
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Incoming Bids</h1>
          <p className="mt-1 text-sm text-white/40">
            Review and respond to bids from recyclers
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="rounded-full bg-brand-accent/20 px-3 py-1 text-sm font-semibold text-brand-accent">
            {pendingCount} pending
          </span>
        )}
      </div>

      {bids.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#262626] py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1A1A] mb-3">
            <Gavel className="h-6 w-6 text-white/20" />
          </div>
          <p className="text-lg font-medium text-white/60">No bids yet</p>
          <p className="mt-1 text-sm text-white/40">
            Bids will appear here when recyclers submit offers on your listings.
          </p>
          <Link href="/scraps/new" className="mt-5 rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-accent/90 transition-colors">
            Post a Listing
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
            } | null;
            const recycler = bid.users as { name: string; email: string } | null;

            return (
              <Link key={bid.id} href={`/marketplace/${scrap?.id ?? ""}`}>
                <Card className="border-[#262626] bg-[#141414] hover:border-[#333333] hover:bg-[#1A1A1A] transition-all cursor-pointer">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded-full bg-brand-accent/10 px-2.5 py-0.5 text-xs font-medium text-brand-accent">
                            {scrap?.category}
                          </span>
                        </div>
                        <p className="font-semibold text-white truncate">{scrap?.title}</p>
                        <div className="flex items-center gap-1 text-xs text-white/40 mt-0.5">
                          <User className="h-3 w-3" />
                          {recycler?.name ?? "Recycler"}
                          {recycler?.email && (
                            <span className="text-white/25">— {recycler.email}</span>
                          )}
                        </div>
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
                        <span className="text-xs text-white/40 font-normal">offered</span>
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

                    {bid.message && (
                      <p className="mt-2 text-xs text-white/40 italic truncate">
                        &ldquo;{bid.message}&rdquo;
                      </p>
                    )}
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
