import Link from "next/link";
import { BookingCard } from "@/components/shared/booking-card";
import { isMockMode, mockBookings } from "@/lib/mock-data";
import { CalendarCheck } from "lucide-react";

async function getSellerBookings() {
  if (isMockMode()) {
    return mockBookings.map((b) => ({
      ...b,
      users: { name: "EcoRecycle Solutions" },
    }));
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("bookings")
    .select(
      "*, scraps(title, category, price), users!bookings_buyer_id_fkey(name)"
    )
    .eq("seller_id", user!.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function SellerBookingsPage() {
  const bookings = await getSellerBookings();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Bookings</h1>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.06] py-16">
          <CalendarCheck className="h-12 w-12 text-white/20" />
          <p className="mt-4 text-lg font-medium text-white/60">
            No bookings yet
          </p>
          <p className="mt-1 text-sm text-white/40">
            Bookings will appear here when buyers book your scrap listings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {bookings.map((booking) => (
            <Link key={booking.id} href={`/seller-bookings/${booking.id}`}>
              <BookingCard
                booking={booking}
                counterpartyName={
                  (booking.users as { name: string } | null)?.name
                }
                role="seller"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
