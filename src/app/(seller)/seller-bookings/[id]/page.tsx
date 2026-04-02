import { redirect } from "next/navigation";

// Bid details are now managed on the listing page via BidsList component.
// This route is kept for backward compatibility.
export default async function SellerBookingDetailPage() {
  redirect("/seller-bookings");
}
