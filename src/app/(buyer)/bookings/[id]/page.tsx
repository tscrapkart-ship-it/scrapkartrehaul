import { redirect } from "next/navigation";

// Bid details are now managed on the listing page.
// This route is kept for backward compatibility.
export default async function BuyerBookingDetailPage() {
  redirect("/bookings");
}
