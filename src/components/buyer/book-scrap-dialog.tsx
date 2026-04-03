"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShoppingBag, Info } from "lucide-react";

export function BookScrapDialog({
  scrapId,
  scrapTitle,
  sellerId,
}: {
  scrapId: string;
  scrapTitle: string;
  sellerId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleBook() {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        buyer_id: user.id,
        seller_id: sellerId,
        scrap_id: scrapId,
        status: "confirmed",
      })
      .select()
      .single();

    if (bookingError) {
      alert(bookingError.message);
      setLoading(false);
      return;
    }

    // Update scrap status
    await supabase
      .from("scraps")
      .update({ status: "booked" })
      .eq("id", scrapId);

    router.push(`/bookings/${booking.id}`);
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button className="w-full bg-brand-accent text-brand-dark hover:bg-brand-accent/80" size="lg" />
        }
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        Book Now
      </AlertDialogTrigger>
      <AlertDialogContent className="border-[#262626] bg-brand-dark text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Confirm Booking</AlertDialogTitle>
          <AlertDialogDescription className="text-white/50">
            You are about to book &quot;{scrapTitle}&quot;. The seller will be
            notified and you can communicate via chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-start gap-2 rounded-xl bg-brand-accent/5 p-3 text-sm text-white/40">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent/60" />
          Payment integration coming soon. This is a booking confirmation only.
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 bg-transparent text-white/60 hover:bg-[#1A1A1A] hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBook}
            disabled={loading}
            className="bg-brand-accent text-brand-dark hover:bg-brand-accent/80"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
