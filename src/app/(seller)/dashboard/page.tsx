import { Card, CardContent } from "@/components/ui/card";
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

const categoryColors: Record<string, string> = {
  Metal: "bg-orange-500/10 text-orange-400",
  "E-waste": "bg-purple-500/10 text-purple-400",
  Plastic: "bg-blue-500/10 text-blue-400",
  Paper: "bg-green-500/10 text-green-400",
  Glass: "bg-cyan-500/10 text-cyan-400",
  "Mixed Scrap": "bg-white/10 text-white/60",
};

const listingStatusColors: Record<string, string> = {
  live: "text-green-400",
  matched: "text-blue-400",
  picked: "text-purple-400",
  completed: "text-white/40",
  cancelled: "text-red-400",
};

export default async function SellerDashboard() {
  const data = await getDashboardData();
  if (!data) return null;

  const { company, totalListings, liveListings, pendingBids, totalEarned, recentListings } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Producer Dashboard</h1>
        <Link href="/scraps/new">
          <Button className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            New Listing
          </Button>
        </Link>
      </div>

      {/* Company card */}
      {company ? (
        <Card className="border-white/[0.06] bg-white/[0.03]">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-secondary/20">
                  <Building2 className="h-5 w-5 text-brand-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{company.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {company.city && (
                      <p className="text-sm text-white/40">
                        {company.city}{company.state ? `, ${company.state}` : ""}
                      </p>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        company.verification_status === "verified"
                          ? "bg-green-500/10 text-green-400"
                          : company.verification_status === "rejected"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
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
                  className="border-white/[0.06] text-white/60 hover:bg-white/[0.06] hover:text-white"
                >
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-brand-accent/30 bg-brand-accent/5">
          <CardContent className="flex items-center justify-between pt-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10">
                <Building2 className="h-5 w-5 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Set up your company profile</h3>
                <p className="text-sm text-white/40">Required before posting listings.</p>
              </div>
            </div>
            <Link href="/company/setup">
              <Button className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold">
                Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-white/[0.06] bg-white/[0.03]">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/40">Total Listings</p>
              <Package className="h-5 w-5 text-white/20" />
            </div>
            <p className="mt-2 text-3xl font-bold text-brand-accent">{totalListings}</p>
          </CardContent>
        </Card>

        <Card className="border-white/[0.06] bg-white/[0.03]">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/40">Live Listings</p>
              <Package className="h-5 w-5 text-green-400/30" />
            </div>
            <p className="mt-2 text-3xl font-bold text-green-400">{liveListings}</p>
          </CardContent>
        </Card>

        <Card className={`border-white/[0.06] bg-white/[0.03] ${pendingBids > 0 ? "border-yellow-500/20 bg-yellow-500/5" : ""}`}>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/40">Pending Bids</p>
              <Gavel className={`h-5 w-5 ${pendingBids > 0 ? "text-yellow-400/50" : "text-white/20"}`} />
            </div>
            <p className={`mt-2 text-3xl font-bold ${pendingBids > 0 ? "text-yellow-400" : "text-brand-accent"}`}>
              {pendingBids}
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/[0.06] bg-white/[0.03]">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/40">Total Earned</p>
              <TrendingUp className="h-5 w-5 text-white/20" />
            </div>
            <p className="mt-2 text-2xl font-bold text-brand-accent">
              ₹{totalEarned.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      {pendingBids > 0 && (
        <Link href="/seller-bookings">
          <Card className="border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-between pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/15">
                  <Gavel className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {pendingBids} pending bid{pendingBids !== 1 ? "s" : ""} awaiting your response
                  </p>
                  <p className="text-sm text-white/40">Review and accept or decline</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-yellow-400/60" />
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Recent listings */}
      {recentListings.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium uppercase tracking-wider text-white/40">Recent Listings</h2>
            <Link href="/scraps" className="text-xs text-brand-accent hover:text-brand-accent/80">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {recentListings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[listing.category] ?? "bg-white/10 text-white/50"}`}>
                    {listing.category}
                  </span>
                  <p className="text-sm font-medium text-white truncate max-w-[200px]">{listing.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${listingStatusColors[listing.status] ?? "text-white/40"}`}>
                    {listing.status}
                  </span>
                  <Link href={`/marketplace/${listing.id}`}>
                    <ArrowRight className="h-4 w-4 text-white/20 hover:text-brand-accent transition-colors" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalListings === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.06] py-14">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04] mb-3">
            <ArrowLeftRight className="h-6 w-6 text-white/20" />
          </div>
          <p className="text-white/60 font-medium">No listings yet</p>
          <p className="text-sm text-white/30 mt-1 mb-5">Post your first scrap listing to start receiving bids.</p>
          <Link href="/scraps/new">
            <Button className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Post a Listing
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
