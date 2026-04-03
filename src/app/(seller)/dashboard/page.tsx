import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Package,
  Gavel,
  ArrowLeftRight,
  Building2,
  Plus,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";

async function getDashboardData() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [company, listingsRes, pendingBidsRes, transactionsRes] =
    await Promise.all([
      supabase.from("companies").select("*").eq("owner_id", user.id).single(),
      supabase
        .from("scraps")
        .select("id, title, category, status, created_at", { count: "exact" })
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("listing_bids")
        .select("id, listing_id, offered_price, status, scraps!inner(seller_id)", { count: "exact" })
        .eq("scraps.seller_id", user.id)
        .eq("status", "pending"),
      supabase
        .from("transactions")
        .select("id, final_price, status", { count: "exact" })
        .eq("producer_id", user.id),
    ]);

  const listings = listingsRes.data ?? [];
  const totalListings = listingsRes.count ?? 0;
  const liveListings = listings.filter((l) => l.status === "live").length;
  const pendingBids = pendingBidsRes.count ?? 0;
  const totalEarned = (transactionsRes.data ?? [])
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + (t.final_price ?? 0), 0);

  return {
    company: company.data,
    totalListings,
    liveListings,
    pendingBids,
    totalEarned,
    recentListings: listings,
  };
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Metal: { bg: "bg-blue-500/10", text: "text-blue-400" },
  "E-waste": { bg: "bg-purple-500/10", text: "text-purple-400" },
  Plastic: { bg: "bg-yellow-500/10", text: "text-yellow-400" },
  Paper: { bg: "bg-green-500/10", text: "text-green-400" },
  Glass: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
  "Mixed Scrap": { bg: "bg-gray-500/10", text: "text-gray-400" },
};

const listingStatusConfig: Record<string, { text: string; dot: string }> = {
  live: { text: "text-green-400", dot: "bg-green-400" },
  matched: { text: "text-blue-400", dot: "bg-blue-400" },
  picked: { text: "text-purple-400", dot: "bg-purple-400" },
  completed: { text: "text-[#525252]", dot: "bg-[#525252]" },
  cancelled: { text: "text-red-400", dot: "bg-red-400" },
};

export default async function SellerDashboard() {
  const data = await getDashboardData();
  if (!data) return null;

  const { company, totalListings, liveListings, pendingBids, totalEarned, recentListings } = data;

  const stats = [
    {
      label: "Total Listings",
      value: totalListings,
      icon: Package,
      iconColor: "text-[#10B981]",
      iconBg: "bg-[#10B981]/10",
      border: "border-[#10B981]/10",
    },
    {
      label: "Live Listings",
      value: liveListings,
      icon: Sparkles,
      iconColor: "text-green-400",
      iconBg: "bg-green-400/10",
      border: "border-green-400/10",
    },
    {
      label: "Pending Bids",
      value: pendingBids,
      icon: Gavel,
      iconColor: pendingBids > 0 ? "text-yellow-400" : "text-[#525252]",
      iconBg: pendingBids > 0 ? "bg-yellow-400/10" : "bg-[#1A1A1A]",
      border: pendingBids > 0 ? "border-yellow-400/20" : "border-[#262626]",
      highlight: pendingBids > 0,
    },
    {
      label: "Total Earned",
      value: `₹${totalEarned.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      iconColor: "text-[#10B981]",
      iconBg: "bg-[#10B981]/10",
      border: "border-[#10B981]/10",
      isPrice: true,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Producer Dashboard
          </h1>
          <p className="mt-1 text-base text-[#737373]">
            Manage your scrap listings and track bids
          </p>
        </div>
        <Link href="/scraps/new">
          <Button className="bg-[#10B981] text-black hover:bg-[#059669] font-semibold h-10 px-5 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Plus className="mr-2 h-4 w-4" />
            New Listing
          </Button>
        </Link>
      </div>

      {/* Company card */}
      {company ? (
        <div className="animate-slide-up delay-1 rounded-xl border border-[#262626] bg-[#141414] p-5 transition-all hover:border-[#333]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
                {company.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={company.logo_url} alt="" className="h-full w-full rounded-xl object-cover" />
                ) : (
                  <Building2 className="h-6 w-6 text-[#10B981]" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">{company.name}</h3>
                <div className="flex items-center gap-2.5 mt-0.5">
                  {company.city && (
                    <p className="text-base text-[#737373]">
                      {company.city}{company.state ? `, ${company.state}` : ""}
                    </p>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                      company.verification_status === "verified"
                        ? "bg-green-500/10 text-green-400"
                        : company.verification_status === "rejected"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      company.verification_status === "verified"
                        ? "bg-green-400"
                        : company.verification_status === "rejected"
                        ? "bg-red-400"
                        : "bg-yellow-400"
                    }`} />
                    {company.verification_status === "verified"
                      ? "Verified"
                      : company.verification_status === "rejected"
                      ? "Rejected"
                      : "Pending Review"}
                  </span>
                </div>
              </div>
            </div>
            <Link href="/company/edit">
              <Button
                variant="outline"
                size="sm"
                className="border-[#262626] text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white hover:border-[#333]"
              >
                Edit Profile
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="animate-slide-up delay-1 rounded-xl border border-[#10B981]/30 bg-[#10B981]/[0.04] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
                <Building2 className="h-6 w-6 text-[#10B981]" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Set up your company profile</h3>
                <p className="text-base text-[#737373] mt-0.5">Required before posting listings.</p>
              </div>
            </div>
            <Link href="/company/setup">
              <Button className="bg-[#10B981] text-black hover:bg-[#059669] font-semibold">
                Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`animate-scale-in delay-${i + 2} rounded-xl border bg-[#141414] p-5 transition-all hover:border-[#333] ${
                stat.highlight ? "border-yellow-500/20 bg-yellow-500/[0.03]" : stat.border
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium uppercase tracking-wider text-[#737373]">{stat.label}</p>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconBg}`}>
                  <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </div>
              <p className={`text-3xl font-bold ${stat.highlight ? "text-yellow-400" : stat.isPrice ? "text-[#10B981]" : "text-white"}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Pending bids alert */}
      {pendingBids > 0 && (
        <Link href="/seller-bookings" className="block animate-slide-up">
          <div className="group flex items-center justify-between rounded-xl border border-yellow-500/20 bg-yellow-500/[0.04] p-4 transition-all hover:border-yellow-500/30 hover:bg-yellow-500/[0.06] cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-base">
                  {pendingBids} pending bid{pendingBids !== 1 ? "s" : ""} awaiting your response
                </p>
                <p className="text-base text-[#737373]">Review and accept or decline</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-yellow-400/60 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      )}

      {/* Recent listings */}
      {recentListings.length > 0 && (
        <div className="animate-slide-up delay-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-medium uppercase tracking-widest text-[#525252]">Recent Listings</h2>
            <Link href="/scraps" className="text-sm text-[#10B981] hover:text-[#34D399] transition-colors flex items-center gap-1">
              View all
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-xl border border-[#262626] bg-[#141414] divide-y divide-[#262626] overflow-hidden">
            {recentListings.map((listing) => {
              const cat = categoryColors[listing.category] ?? { bg: "bg-[#1A1A1A]", text: "text-[#737373]" };
              const status = listingStatusConfig[listing.status] ?? { text: "text-[#525252]", dot: "bg-[#525252]" };
              return (
                <Link
                  key={listing.id}
                  href={`/marketplace/${listing.id}`}
                  className="group flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-[#1A1A1A]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${cat.bg} ${cat.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${cat.text.replace("text-", "bg-")}`} />
                      {listing.category}
                    </span>
                    <p className="text-base font-medium text-[#D4D4D4] truncate group-hover:text-white transition-colors">
                      {listing.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${status.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {listing.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#525252] group-hover:text-[#10B981] transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalListings === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#262626] bg-[#141414]/50 py-16 animate-fade-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A1A1A] border border-[#262626] mb-4">
            <ArrowLeftRight className="h-7 w-7 text-[#525252]" />
          </div>
          <p className="text-[#D4D4D4] font-semibold text-xl">No listings yet</p>
          <p className="text-base text-[#525252] mt-1 mb-6 max-w-xs text-center">
            Post your first scrap listing to start receiving bids from verified recyclers.
          </p>
          <Link href="/scraps/new">
            <Button className="bg-[#10B981] text-black hover:bg-[#059669] font-semibold h-10 px-6 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Plus className="mr-2 h-4 w-4" />
              Post a Listing
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
