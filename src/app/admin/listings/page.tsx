import { Package } from "lucide-react";
import { DeleteListingButton } from "./delete-listing-button";

async function getListings(status?: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("scraps")
    .select("id, title, category, quantity, unit, price, status, city, state, created_at, companies(name), users!scraps_seller_id_fkey(name)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return data ?? [];
}

const statusColor: Record<string, string> = {
  available: "bg-green-500/10 text-green-400",
  booked: "bg-yellow-500/10 text-yellow-400",
  collected: "bg-brand-accent/10 text-brand-accent",
};

const categoryColor: Record<string, string> = {
  Metal: "bg-blue-500/10 text-blue-400",
  "E-waste": "bg-purple-500/10 text-purple-400",
  Plastic: "bg-pink-500/10 text-pink-400",
  Paper: "bg-orange-500/10 text-orange-400",
  Glass: "bg-cyan-500/10 text-cyan-400",
  "Mixed Scrap": "bg-gray-500/10 text-gray-400",
};

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const listings = await getListings(params.status);

  const tabs = [
    { value: "all", label: "All" },
    { value: "available", label: "Available" },
    { value: "booked", label: "Booked" },
    { value: "collected", label: "Collected" },
  ];

  const activeTab = params.status ?? "all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Listings</h1>
        <p className="mt-1 text-sm text-white/40">All scrap listings on the platform</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={tab.value === "all" ? "/admin/listings" : `/admin/listings?status=${tab.value}`}
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

      <div className="rounded-xl border border-[#262626] bg-card overflow-hidden">
        {listings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Package className="h-8 w-8 text-white/20" />
            <p className="text-sm text-white/40">No listings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-[#262626]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 sm:px-5">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 sm:px-5">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 sm:px-5">Seller</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 sm:px-5">Price/kg</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 sm:px-5">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 sm:px-5">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 sm:px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {listings.map((listing: any) => (
                  <tr key={listing.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 sm:px-5">
                      <p className="max-w-[180px] truncate font-medium text-white">{listing.title}</p>
                      <p className="text-xs text-white/40">{listing.quantity} {listing.unit}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryColor[listing.category] ?? "bg-white/10 text-white/60"}`}>
                        {listing.category}
                      </span>
                    </td>
                    <td className="max-w-[140px] truncate px-4 py-4 text-white/60 sm:px-5">
                      {(listing.companies as any)?.name ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-white sm:px-5">
                      ₹{listing.price.toLocaleString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-white/60 sm:px-5">
                      {listing.city}, {listing.state}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[listing.status] ?? "bg-white/10 text-white/60"}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <DeleteListingButton id={listing.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-white/20">{listings.length} listing{listings.length !== 1 ? "s" : ""} shown</p>
    </div>
  );
}
