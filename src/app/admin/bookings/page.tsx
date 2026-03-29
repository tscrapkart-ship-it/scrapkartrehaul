import { CalendarDays } from "lucide-react";

async function getBookings(status?: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("bookings")
    .select(`
      id, status, scheduled_at, created_at,
      scraps(title, category),
      buyer:users!bookings_buyer_id_fkey(name, email),
      seller:users!bookings_seller_id_fkey(name, email)
    `)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return data ?? [];
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-green-500/10 text-green-400",
  collected: "bg-brand-accent/10 text-brand-accent",
  cancelled: "bg-red-500/10 text-red-400",
};

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const bookings = await getBookings(params.status);

  const tabs = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "collected", label: "Collected" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const activeTab = params.status ?? "all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Bookings</h1>
        <p className="mt-1 text-sm text-white/40">All bookings across the platform</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={tab.value === "all" ? "/admin/bookings" : `/admin/bookings?status=${tab.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeTab === tab.value
                ? "bg-brand-accent text-brand-dark"
                : "border border-white/10 text-white/60 hover:border-brand-accent/30 hover:text-white"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#002a47] overflow-hidden">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <CalendarDays className="h-8 w-8 text-white/20" />
            <p className="text-sm text-white/40">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Scrap</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Buyer</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Seller</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Scheduled</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {bookings.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="max-w-[180px] truncate font-medium text-white">
                        {(booking.scraps as any)?.title ?? "—"}
                      </p>
                      <p className="text-xs text-white/40">{(booking.scraps as any)?.category ?? ""}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white">{(booking.buyer as any)?.name ?? "—"}</p>
                      <p className="text-xs text-white/40">{(booking.buyer as any)?.email ?? ""}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white">{(booking.seller as any)?.name ?? "—"}</p>
                      <p className="text-xs text-white/40">{(booking.seller as any)?.email ?? ""}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[booking.status] ?? "bg-white/10 text-white/60"}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/60">
                      {booking.scheduled_at
                        ? new Date(booking.scheduled_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-white/40">
                      {new Date(booking.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-white/20">{bookings.length} booking{bookings.length !== 1 ? "s" : ""} shown</p>
    </div>
  );
}
