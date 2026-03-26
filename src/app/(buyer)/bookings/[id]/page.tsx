import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isMockMode, mockBookings } from "@/lib/mock-data";
import { MessageCircle, Package, UserCircle, Calendar } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  collected: "bg-white/5 text-white/40 border-white/10",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

async function getBooking(id: string) {
  if (isMockMode()) {
    const booking = mockBookings.find((b) => b.id === id);
    if (!booking) return null;
    return {
      ...booking,
      seller: { name: booking.users?.name ?? "Seller", email: "seller@demo.com" },
      scrap: booking.scraps
        ? {
            ...booking.scraps,
            quantity: 500,
            unit: "kg",
            images: [],
            city: "Mumbai",
            state: "Maharashtra",
          }
        : null,
    };
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select(
      "*, scraps(title, category, price, quantity, unit, images, city, state), users!bookings_seller_id_fkey(name, email)"
    )
    .eq("id", id)
    .single();

  if (!data) return null;
  return {
    ...data,
    seller: data.users as { name: string; email: string } | null,
    scrap: data.scraps as {
      title: string;
      category: string;
      price: number;
      quantity: number;
      unit: string;
      images: string[];
      city: string | null;
      state: string | null;
    } | null,
  };
}

export default async function BuyerBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Booking Details</h1>
        <Badge className={`border ${statusColors[booking.status] ?? "bg-white/5 text-white/40"}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </div>

      <Card className="border-white/[0.06] bg-[#002a47]">
        <CardContent className="space-y-5 pt-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10">
              <Package className="h-4 w-4 text-brand-accent" />
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-white/40">Scrap Item</h3>
              <p className="mt-1 font-semibold text-white">
                {booking.scrap?.title}
              </p>
              <p className="text-sm text-brand-accent">
                ₹{booking.scrap?.price.toLocaleString("en-IN")}{" "}
                <span className="text-white/40">
                  — {booking.scrap?.quantity} {booking.scrap?.unit}
                </span>
              </p>
            </div>
          </div>

          <div className="border-t border-white/[0.06]" />

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
              <UserCircle className="h-4 w-4 text-white/40" />
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-white/40">Seller</h3>
              <p className="mt-1 font-medium text-white">{booking.seller?.name}</p>
              <p className="text-sm text-white/40">
                {booking.seller?.email}
              </p>
            </div>
          </div>

          <div className="border-t border-white/[0.06]" />

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
              <Calendar className="h-4 w-4 text-white/40" />
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-white/40">Booked On</h3>
              <p className="mt-1 text-white/70">
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

      <Link href={`/bookings/${booking.id}/chat`}>
        <Button className="w-full bg-brand-accent text-brand-dark font-semibold hover:bg-brand-accent/90 mt-2">
          <MessageCircle className="mr-2 h-4 w-4" />
          Open Chat with Seller
        </Button>
      </Link>
    </div>
  );
}
