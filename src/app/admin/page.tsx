import { Users, Package, Gavel, ArrowLeftRight, Building2, Clock, TrendingUp } from "lucide-react";

async function getStats() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: pendingApproval },
    { count: totalListings },
    { count: liveListings },
    { count: totalBids },
    { count: pendingBids },
    { count: totalTransactions },
    { count: completedTransactions },
    { count: totalCompanies },
    { count: pendingRecyclers },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }).neq("role", "admin"),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("is_approved", false).neq("role", "admin").not("role", "is", null),
    supabase.from("scraps").select("*", { count: "exact", head: true }),
    supabase.from("scraps").select("*", { count: "exact", head: true }).eq("status", "live"),
    supabase.from("listing_bids").select("*", { count: "exact", head: true }),
    supabase.from("listing_bids").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("transactions").select("*", { count: "exact", head: true }),
    supabase.from("transactions").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("companies").select("*", { count: "exact", head: true }),
    supabase.from("recycler_profiles").select("*", { count: "exact", head: true }).eq("verification_status", "pending"),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    pendingApproval: pendingApproval ?? 0,
    totalListings: totalListings ?? 0,
    liveListings: liveListings ?? 0,
    totalBids: totalBids ?? 0,
    pendingBids: pendingBids ?? 0,
    totalTransactions: totalTransactions ?? 0,
    completedTransactions: completedTransactions ?? 0,
    totalCompanies: totalCompanies ?? 0,
    pendingRecyclers: pendingRecyclers ?? 0,
  };
}

async function getRecentActivity() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const [{ data: recentUsers }, { data: recentListings }, { data: recentBids }] =
    await Promise.all([
      supabase
        .from("users")
        .select("id, name, email, role, is_approved, created_at")
        .neq("role", "admin")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("scraps")
        .select("id, title, category, status, created_at, companies(name)")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("listing_bids")
        .select("id, offered_price, status, created_at, scraps(title), users!listing_bids_recycler_id_fkey(name)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return {
    recentUsers: recentUsers ?? [],
    recentListings: recentListings ?? [],
    recentBids: recentBids ?? [],
  };
}

const roleLabel: Record<string, string> = {
  recycler: "Recycler",
  waste_producer: "Producer",
  both: "Both",
};

const bidStatusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  accepted: "bg-green-500/10 text-green-400",
  rejected: "bg-red-500/10 text-red-400",
  withdrawn: "bg-white/10 text-white/40",
};

export default async function AdminOverviewPage() {
  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()]);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      sub: stats.pendingApproval > 0 ? `${stats.pendingApproval} pending approval` : "All approved",
      icon: Users,
      color: stats.pendingApproval > 0 ? "text-yellow-400" : "text-blue-400",
      bg: stats.pendingApproval > 0 ? "bg-yellow-400/10" : "bg-blue-400/10",
      href: stats.pendingApproval > 0 ? "/admin/users?filter=pending" : "/admin/users",
    },
    {
      label: "Scrap Listings",
      value: stats.totalListings,
      sub: `${stats.liveListings} live and accepting bids`,
      icon: Package,
      color: "text-brand-accent",
      bg: "bg-brand-accent/10",
      href: "/admin/listings",
    },
    {
      label: "Total Bids",
      value: stats.totalBids,
      sub: `${stats.pendingBids} pending response`,
      icon: Gavel,
      color: stats.pendingBids > 0 ? "text-yellow-400" : "text-purple-400",
      bg: stats.pendingBids > 0 ? "bg-yellow-400/10" : "bg-purple-400/10",
      href: "/admin/bids",
    },
    {
      label: "Deals",
      value: stats.totalTransactions,
      sub: `${stats.completedTransactions} completed`,
      icon: ArrowLeftRight,
      color: "text-green-400",
      bg: "bg-green-400/10",
      href: "/admin/transactions",
    },
    {
      label: "Producer Profiles",
      value: stats.totalCompanies,
      sub: "Registered producer companies",
      icon: Building2,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      href: "/admin/companies",
    },
    {
      label: "Recycler Verifications",
      value: stats.pendingRecyclers,
      sub: "Awaiting compliance review",
      icon: Clock,
      color: stats.pendingRecyclers > 0 ? "text-yellow-400" : "text-white/40",
      bg: stats.pendingRecyclers > 0 ? "bg-yellow-400/10" : "bg-white/[0.06]",
      href: "/admin/recyclers",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="mt-1 text-sm text-white/40">Platform-wide activity at a glance</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <a key={card.label} href={card.href} className="group">
              <div className="rounded-xl border border-white/[0.06] bg-[#002a47] p-5 transition-colors hover:border-white/[0.12]">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/50">{card.label}</p>
                  <div className={`rounded-lg p-2 ${card.bg}`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
                <p className="mt-1 text-xs text-white/30">{card.sub}</p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent users */}
        <div className="rounded-xl border border-white/[0.06] bg-[#002a47] p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-accent" />
            <h2 className="text-sm font-semibold text-white">Recent Signups</h2>
          </div>
          <div className="space-y-3">
            {activity.recentUsers.length === 0 && (
              <p className="text-xs text-white/30">No users yet</p>
            )}
            {activity.recentUsers.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{u.name}</p>
                  <p className="text-xs text-white/40 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                  {!u.is_approved && u.role && (
                    <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400">pending</span>
                  )}
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-white/50">
                    {roleLabel[u.role] ?? u.role ?? "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent listings */}
        <div className="rounded-xl border border-white/[0.06] bg-[#002a47] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-brand-accent" />
            <h2 className="text-sm font-semibold text-white">Recent Listings</h2>
          </div>
          <div className="space-y-3">
            {activity.recentListings.length === 0 && (
              <p className="text-xs text-white/30">No listings yet</p>
            )}
            {activity.recentListings.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">{s.title}</p>
                  <p className="text-xs text-white/40">{(s.companies as any)?.name ?? "—"}</p>
                </div>
                <div className="flex gap-1.5 ml-2 shrink-0">
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-white/50">{s.category}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.status === "live" ? "bg-green-500/10 text-green-400" : "bg-white/[0.06] text-white/40"}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent bids */}
        <div className="rounded-xl border border-white/[0.06] bg-[#002a47] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Gavel className="h-4 w-4 text-brand-accent" />
            <h2 className="text-sm font-semibold text-white">Recent Bids</h2>
          </div>
          <div className="space-y-3">
            {activity.recentBids.length === 0 && (
              <p className="text-xs text-white/30">No bids yet</p>
            )}
            {activity.recentBids.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">{(b.scraps as any)?.title ?? "—"}</p>
                  <p className="text-xs text-white/40">by {(b.users as any)?.name ?? "—"} · ₹{b.offered_price?.toLocaleString("en-IN")}</p>
                </div>
                <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${bidStatusColor[b.status]}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
