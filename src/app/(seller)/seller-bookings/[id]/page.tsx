"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle2, Package, User, Calendar, Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  collected: "bg-green-500/10 text-green-400 border border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
};

interface BookingDetail {
  id: string;
  status: string;
  created_at: string;
  scrap_id: string;
  scraps: { title: string; price: number; quantity: number; unit: string } | null;
  users: { name: string; email: string } | null;
}

export default function SellerBookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      const supabase = createClient();
      const { data } = await supabase
        .from("bookings")
        .select(
          "*, scraps(title, price, quantity, unit), users!bookings_buyer_id_fkey(name, email)"
        )
        .eq("id", params.id as string)
        .single();
      if (data) setBooking(data as unknown as BookingDetail);
    }
    fetchBooking();
  }, [params.id]);

  async function markCollected() {
    if (!booking) return;
    setLoading(true);
    const supabase = createClient();

    await supabase
      .from("bookings")
      .update({ status: "collected" })
      .eq("id", booking.id);

    await supabase
      .from("scraps")
      .update({ status: "collected" })
      .eq("id", booking.scrap_id);

    router.refresh();
    setBooking({ ...booking, status: "collected" });
    setLoading(false);
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-accent" />
        <span className="ml-2 text-white/40">Loading...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Booking Details</h1>
        <Badge className={statusColors[booking.status] ?? "bg-white/[0.06] text-white/60"}>
          {booking.status}
        </Badge>
      </div>

      <Card className="border-white/[0.06] bg-white/[0.03]">
        <CardContent className="space-y-5 pt-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10">
              <Package className="h-4 w-4 text-brand-accent" />
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-white/30">Scrap Item</h3>
              <p className="mt-1 font-semibold text-white">
                {booking.scraps?.title}
              </p>
              <p className="text-sm text-brand-accent">
                ₹{booking.scraps?.price.toLocaleString("en-IN")} —{" "}
                {booking.scraps?.quantity} {booking.scraps?.unit}
              </p>
            </div>
          </div>

          <div className="border-t border-white/[0.06]" />

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/20">
              <User className="h-4 w-4 text-brand-accent" />
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-white/30">Buyer</h3>
              <p className="mt-1 font-medium text-white">{booking.users?.name}</p>
              <p className="text-sm text-white/40">
                {booking.users?.email}
              </p>
            </div>
          </div>

          <div className="border-t border-white/[0.06]" />

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
              <Calendar className="h-4 w-4 text-white/40" />
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-white/30">Booked On</h3>
              <p className="mt-1 text-white/80">
                {new Date(booking.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Link href={`/seller-bookings/${booking.id}/chat`} className="flex-1">
          <Button className="w-full bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold">
            <MessageCircle className="mr-2 h-4 w-4" />
            Open Chat with Buyer
          </Button>
        </Link>
        {booking.status === "confirmed" && (
          <Button
            onClick={markCollected}
            disabled={loading}
            className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {loading ? "Updating..." : "Mark as Collected"}
          </Button>
        )}
      </div>
    </div>
  );
}
