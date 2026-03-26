import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ChatInterface } from "@/components/shared/chat-interface";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

export default async function SellerChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*, scraps(title)")
    .eq("id", id)
    .single();

  if (!booking || booking.seller_id !== user.id) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link
          href={`/seller-bookings/${id}`}
          className="flex items-center gap-1.5 text-sm text-brand-accent hover:text-brand-accent/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Booking
        </Link>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-white/40" />
          <h1 className="text-lg font-semibold text-white">
            Chat — {(booking.scraps as { title: string })?.title}
          </h1>
        </div>
      </div>
      <ChatInterface
        bookingId={id}
        currentUserId={user.id}
        otherUserId={booking.buyer_id}
      />
    </div>
  );
}
