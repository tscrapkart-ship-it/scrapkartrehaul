import Link from "next/link";
import { BookingCard } from "@/components/shared/booking-card";
import { isMockMode, mockBookings } from "@/lib/mock-data";
import { CalendarDays } from "lucide-react";

async function getBookings() {
  if (isMockMode()) return mockBookings;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("bookings")
    .select(
      "*, scraps(title, category, price), users!bookings_seller_id_fkey(name)"
    )
    .eq("buyer_id", user!.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function BuyerBookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
        <p className="mt-1 text-sm text-white/40">
          Track and manage your scrap material bookings
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.06] bg-[#002a47] py-16">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]">
            <CalendarDays className="h-6 w-6 text-white/30" />
          </div>
          <p className="text-lg font-medium text-white/60">
            No bookings yet
          </p>
          <p className="mt-1 text-sm text-white/30">
            Browse the marketplace to find scrap materials.
          </p>
          <Link
            href="/marketplace"
            className="mt-5 rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-accent/90"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {bookings.map((booking) => (
            <Link key={booking.id} href={`/bookings/${booking.id}`}>
              <BookingCard
                booking={booking}
                counterpartyName={
                  (booking.users as { name: string } | null)?.name
                }
                role="buyer"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
