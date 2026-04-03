import { Gavel } from "lucide-react";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  accepted: "bg-green-500/10 text-green-400",
  rejected: "bg-red-500/10 text-red-400",
  withdrawn: "bg-[#1A1A1A] text-white/40",
};

async function getBids(status?: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("listing_bids")
    .select("*, scraps(title, category), users!listing_bids_recycler_id_fkey(name, email)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return data ?? [];
}

export default async function AdminBidsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const bids = await getBids(params.status);
  const activeStatus = params.status ?? "all";

  const tabs = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "withdrawn", label: "Withdrawn" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Bids</h1>
        <p className="mt-1 text-sm text-white/40">All bids submitted by recyclers</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={tab.value === "all" ? "/admin/bids" : `/admin/bids?status=${tab.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeStatus === tab.value
                ? "bg-brand-accent text-brand-dark"
                : "border border-white/10 text-white/60 hover:border-brand-accent/30 hover:text-white"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-[#262626] bg-card overflow-hidden">
        {bids.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Gavel className="h-8 w-8 text-white/20" />
            <p className="text-sm text-white/40">No bids found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#262626]">
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Listing</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Recycler</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Offered Price</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Pickup Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {bids.map((bid: any) => (
                  <tr key={bid.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-white truncate max-w-[200px]">{bid.scraps?.title ?? "—"}</p>
                      <p className="text-xs text-white/40">{bid.scraps?.category}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white">{bid.users?.name ?? "—"}</p>
                      <p className="text-xs text-white/40">{bid.users?.email}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-brand-accent">
                      ₹{bid.offered_price?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-4 text-white/60">
                      {bid.estimated_pickup_date
                        ? new Date(bid.estimated_pickup_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[bid.status] ?? "bg-white/10 text-white/60"}`}>
                        {bid.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/40">
                      {new Date(bid.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-white/20">{bids.length} bid{bids.length !== 1 ? "s" : ""} shown</p>
    </div>
  );
}
