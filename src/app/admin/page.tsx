import Link from "next/link";
import {
  Users,
  Package,
  Gavel,
  ArrowLeftRight,
  Building2,
  Clock,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

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

const bidStatusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
  accepted: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  rejected: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  withdrawn: { bg: "bg-[#1A1A1A]", text: "text-[#525252]", dot: "bg-[#525252]" },
};

export default async function AdminOverviewPage() {
  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()]);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      sub: stats.pendingApproval > 0 ? `${stats.pendingApproval} pending approval` : "All approved",
      icon: Users,
      iconColor: stats.pendingApproval > 0 ? "text-yellow-400" : "text-blue-400",
      iconBg: stats.pendingApproval > 0 ? "bg-yellow-400/10" : "bg-blue-400/10",
      border: stats.pendingApproval > 0 ? "border-yellow-400/15" : "border-[#262626]",
      href: stats.pendingApproval > 0 ? "/admin/users?filter=pending" : "/admin/users",
    },
    {
      label: "Scrap Listings",
      value: stats.totalListings,
      sub: `${stats.liveListings} live and accepting bids`,
      icon: Package,
      iconColor: "text-[#10B981]",
      iconBg: "bg-[#10B981]/10",
      border: "border-[#262626]",
      href: "/admin/listings",
    },
    {
      label: "Total Bids",
      value: stats.totalBids,
      sub: `${stats.pendingBids} pending response`,
      icon: Gavel,
      iconColor: stats.pendingBids > 0 ? "text-yellow-400" : "text-purple-400",
      iconBg: stats.pendingBids > 0 ? "bg-yellow-400/10" : "bg-purple-400/10",
      border: stats.pendingBids > 0 ? "border-yellow-400/15" : "border-[#262626]",
      href: "/admin/bids",
    },
    {
      label: "Deals",
      value: stats.totalTransactions,
      sub: `${stats.completedTransactions} completed`,
      icon: ArrowLeftRight,
      iconColor: "text-green-400",
      iconBg: "bg-green-400/10",
      border: "border-[#262626]",
      href: "/admin/transactions",
    },
    {
      label: "Producer Profiles",
      value: stats.totalCompanies,
      sub: "Registered producer companies",
      icon: Building2,
      iconColor: "text-orange-400",
      iconBg: "bg-orange-400/10",
      border: "border-[#262626]",
      href: "/admin/companies",
    },
    {
      label: "Recycler Verifications",
      value: stats.pendingRecyclers,
      sub: "Awaiting compliance review",
      icon: Clock,
      iconColor: stats.pendingRecyclers > 0 ? "text-yellow-400" : "text-[#525252]",
      iconBg: stats.pendingRecyclers > 0 ? "bg-yellow-400/10" : "bg-[#1A1A1A]",
      border: stats.pendingRecyclers > 0 ? "border-yellow-400/15" : "border-[#262626]",
      href: "/admin/recyclers",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <p className="mt-1 text-base text-[#737373]">Platform-wide activity at a glance</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="group">
              <div className={`animate-scale-in delay-${i + 1} rounded-xl border bg-[#141414] p-5 transition-all hover:border-[#333] hover:bg-[#1A1A1A] ${card.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#737373]">{card.label}</p>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg} transition-transform group-hover:scale-110`}>
                    <Icon className={`h-4.5 w-4.5 ${card.iconColor}`} />
                  </div>
                </div>
                <p className="text-4xl font-bold text-white">{card.value}</p>
                <p className="mt-1 text-sm text-[#525252]">{card.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent users */}
        <div className="animate-slide-up delay-3 rounded-xl border border-[#262626] bg-[#141414] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-400/10">
                <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Recent Signups</h2>
            </div>
            <Link href="/admin/users" className="text-[#525252] hover:text-[#10B981] transition-colors">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {activity.recentUsers.length === 0 && (
              <p className="text-sm text-[#525252] text-center py-4">No users yet</p>
            )}
            {activity.recentUsers.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between py-1">
                <div className="min-w-0 flex-1">
                  <p className="text-base text-white truncate">{u.name}</p>
                  <p className="text-sm text-[#525252] truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  {!u.is_approved && u.role && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-yellow-500/10 px-1.5 py-0.5 text-xs font-medium text-yellow-400">
                      <span className="h-1 w-1 rounded-full bg-yellow-400" />
                      pending
                    </span>
                  )}
                  <span className="rounded-md bg-[#1A1A1A] px-1.5 py-0.5 text-xs font-medium text-[#737373]">
                    {roleLabel[u.role] ?? u.role ?? "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent listings */}
        <div className="animate-slide-up delay-4 rounded-xl border border-[#262626] bg-[#141414] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#10B981]/10">
                <Package className="h-3.5 w-3.5 text-[#10B981]" />
              </div>
              <h2 className="text-base font-semibold text-white">Recent Listings</h2>
            </div>
            <Link href="/admin/listings" className="text-[#525252] hover:text-[#10B981] transition-colors">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {activity.recentListings.length === 0 && (
              <p className="text-sm text-[#525252] text-center py-4">No listings yet</p>
            )}
            {activity.recentListings.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between py-1">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base text-white">{s.title}</p>
                  <p className="text-sm text-[#525252]">{(s.companies as any)?.name ?? "—"}</p>
                </div>
                <div className="flex gap-1.5 ml-2 shrink-0">
                  <span className="rounded-md bg-[#1A1A1A] px-1.5 py-0.5 text-xs font-medium text-[#737373]">{s.category}</span>
                  <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${
                    s.status === "live" ? "bg-green-500/10 text-green-400" : "bg-[#1A1A1A] text-[#525252]"
                  }`}>
                    <span className={`h-1 w-1 rounded-full ${s.status === "live" ? "bg-green-400" : "bg-[#525252]"}`} />
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent bids */}
        <div className="animate-slide-up delay-5 rounded-xl border border-[#262626] bg-[#141414] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-400/10">
                <Gavel className="h-3.5 w-3.5 text-purple-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Recent Bids</h2>
            </div>
            <Link href="/admin/bids" className="text-[#525252] hover:text-[#10B981] transition-colors">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {activity.recentBids.length === 0 && (
              <p className="text-sm text-[#525252] text-center py-4">No bids yet</p>
            )}
            {activity.recentBids.map((b: any) => {
              const bs = bidStatusConfig[b.status] ?? bidStatusConfig.withdrawn;
              return (
                <div key={b.id} className="flex items-center justify-between py-1">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base text-white">{(b.scraps as any)?.title ?? "—"}</p>
                    <p className="text-sm text-[#525252]">
                      by {(b.users as any)?.name ?? "—"} · ₹{b.offered_price?.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className={`ml-2 shrink-0 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${bs.bg} ${bs.text}`}>
                    <span className={`h-1 w-1 rounded-full ${bs.dot}`} />
                    {b.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
