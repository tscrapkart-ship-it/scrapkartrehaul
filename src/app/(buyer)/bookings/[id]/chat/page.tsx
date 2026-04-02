import { redirect } from "next/navigation";

// Chat is now scoped to transactions. Redirect to deals.
export default async function BuyerBookingChatPage() {
  redirect("/transactions");
}
