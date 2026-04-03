"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Gavel,
  IndianRupee,
  CalendarDays,
  MessageSquare,
  User,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Bid {
  id: string;
  offered_price: number;
  estimated_pickup_date: string | null;
  message: string | null;
  status: string;
  created_at: string;
  recycler_id: string;
  users: { name: string; email: string } | null;
}

const statusConfig: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  accepted: "bg-green-500/10 text-green-400 border border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  withdrawn: "bg-[#1A1A1A] text-white/40 border border-[#262626]",
};

export function BidsList({
  listingId,
  listingStatus,
}: {
  listingId: string;
  listingStatus: string;
}) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBids = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("listing_bids")
      .select("*, users!listing_bids_recycler_id_fkey(name, email)")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false });
    setBids((data as Bid[]) ?? []);
    setLoading(false);
  }, [listingId]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  async function handleAccept(bid: Bid) {
    setActionLoading(bid.id);
    const supabase = createClient();

    // Optimistic update — show accepted state immediately
    setBids((prev) =>
      prev.map((b) =>
        b.id === bid.id
          ? { ...b, status: "accepted" }
          : b.status === "pending"
            ? { ...b, status: "rejected" }
            : b
      )
    );

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Run all mutations in parallel where possible
      const now = new Date().toISOString();
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const [acceptRes, , ,] = await Promise.all([
        // Accept this bid
        supabase
          .from("listing_bids")
          .update({ status: "accepted", responded_at: now })
          .eq("id", bid.id),
        // Reject all other pending bids for this listing
        supabase
          .from("listing_bids")
          .update({ status: "rejected", responded_at: now })
          .eq("listing_id", listingId)
          .eq("status", "pending")
          .neq("id", bid.id),
        // Mark listing as matched
        supabase
          .from("scraps")
          .update({ status: "matched", matched_recycler_id: bid.recycler_id })
          .eq("id", listingId),
        // Create the transaction
        supabase.from("transactions").insert({
          listing_id: listingId,
          bid_id: bid.id,
          producer_id: user.id,
          recycler_id: bid.recycler_id,
          final_price: bid.offered_price,
          pickup_date: bid.estimated_pickup_date,
          pickup_otp: otp,
          status: "scheduled",
        }),
      ]);

      if (acceptRes.error) throw acceptRes.error;

      toast.success("Bid accepted! A deal has been created.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to accept bid.");
      // Rollback — refetch real state
      await fetchBids();
    }

    setActionLoading(null);
  }

  async function handleReject(bidId: string) {
    setActionLoading(bidId);
    const supabase = createClient();

    // Optimistic update
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: "rejected" } : b))
    );

    const { error } = await supabase
      .from("listing_bids")
      .update({ status: "rejected", responded_at: new Date().toISOString() })
      .eq("id", bidId);

    if (error) {
      toast.error(error.message);
      // Rollback
      await fetchBids();
    } else {
      toast.success("Bid rejected.");
    }
    setActionLoading(null);
  }

  const pendingCount = bids.filter((b) => b.status === "pending").length;

  return (
    <Card className="border-[#262626] bg-card">
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gavel className="h-4 w-4 text-brand-accent" />
            <h3 className="font-semibold text-white">Bids Received</h3>
          </div>
          {pendingCount > 0 && (
            <span className="rounded-full bg-brand-accent/20 px-2.5 py-0.5 text-xs font-semibold text-brand-accent">
              {pendingCount} pending
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-white/40">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading bids...
          </div>
        ) : bids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1A1A] mb-3">
              <Gavel className="h-6 w-6 text-white/20" />
            </div>
            <p className="text-white/40">No bids yet</p>
            <p className="text-xs text-white/25 mt-1">
              Recyclers will see your listing and submit bids.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="rounded-xl border border-[#262626] bg-[#141414] p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-secondary/20 text-xs font-bold text-brand-accent">
                      {bid.users?.name?.charAt(0) ?? "R"}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-white/30" />
                        <span className="text-sm font-medium text-white">
                          {bid.users?.name ?? "Recycler"}
                        </span>
                      </div>
                      <p className="text-xs text-white/30">{bid.users?.email}</p>
                    </div>
                  </div>
                  <Badge className={statusConfig[bid.status] ?? "bg-[#1A1A1A] text-white/40"}>
                    {bid.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5 text-brand-accent" />
                    <span className="text-xl font-bold text-brand-accent">
                      ₹{bid.offered_price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {bid.estimated_pickup_date && (
                    <div className="flex items-center gap-1.5 text-white/50">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>
                        {new Date(bid.estimated_pickup_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {bid.message && (
                  <div className="flex items-start gap-2 rounded-lg bg-[#141414] px-3 py-2">
                    <MessageSquare className="h-3.5 w-3.5 text-white/30 shrink-0 mt-0.5" />
                    <p className="text-xs text-white/50 leading-relaxed">{bid.message}</p>
                  </div>
                )}

                {/* Actions — only for pending bids when listing is still live */}
                {bid.status === "pending" && listingStatus === "live" && (
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(bid)}
                      disabled={actionLoading === bid.id}
                      className="flex-1 bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25"
                    >
                      {actionLoading === bid.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Accept
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(bid.id)}
                      disabled={actionLoading === bid.id}
                      className="flex-1 border-red-500/25 text-red-400 hover:bg-red-500/10"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
