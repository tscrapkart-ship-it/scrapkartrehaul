import { redirect } from "next/navigation";

// Bookings replaced by bids in the new model.
export default async function AdminBookingsPage() {
  redirect("/admin/bids");
}
