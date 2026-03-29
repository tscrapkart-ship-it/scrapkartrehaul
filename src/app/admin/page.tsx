import { Users, Package, CalendarDays, Building2, TrendingUp } from "lucide-react";

async function getStats() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalSellers },
    { count: totalBuyers },
    { count: totalListings },
    { count: availableListings },
    { count: bookedListings },
    { count: totalBookings },
    { count: pendingBookings },
    { count: confirmedBookings },
    { count: totalCompanies },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "waste_producer"),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "recycler"),
    supabase.from("scraps").select("*", { count: "exact", head: true }),
    supabase.from("scraps").select("*", { count: "exact", head: true }).eq("status", "available"),
    supabase.from("scraps").select("*", { count: "exact", head: true }).eq("status", "booked"),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("companies").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    totalSellers: totalSellers ?? 0,
    totalBuyers: totalBuyers ?? 0,
    totalListings: totalListings ?? 0,
    availableListings: availableListings ?? 0,
    bookedListings: bookedListings ?? 0,
    totalBookings: totalBookings ?? 0,
    pendingBookings: pendingBookings ?? 0,
    confirmedBookings: confirmedBookings ?? 0,
    totalCompanies: totalCompanies ?? 0,
  };
}

async function getRecentActivity() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const [{ data: recentUsers }, { data: recentListings }, { data: recentBookings }] =
    await Promise.all([
      supabase
        .from("users")
        .select("id, name, email, role, created_at")
        .neq("role", "admin")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("scraps")
        .select("id, title, category, status, created_at, companies(name)")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("bookings")
        .select("id, status, created_at, scraps(title), buyer:users!bookings_buyer_id_fkey(name)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return {
    recentUsers: recentUsers ?? [],
    recentListings: recentListings ?? [],
    recentBookings: recentBookings ?? [],
  };
}

const roleLabel: Record<string, string> = {
  recycler: "Buyer",
  waste_producer: "Seller",
};

const bookingStatusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-green-500/10 text-green-400",
  collected: "bg-brand-accent/10 text-brand-accent",
  cancelled: "bg-red-500/10 text-red-400",
};

export default async function AdminOverviewPage() {
  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()]);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      sub: `${stats.totalSellers} sellers · ${stats.totalBuyers} buyers`,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Scrap Listings",
      value: stats.totalListings,
      sub: `${stats.availableListings} available · ${stats.bookedListings} booked`,
      icon: Package,
      color: "text-brand-accent",
      bg: "bg-brand-accent/10",
    },
    {
      label: "Bookings",
      value: stats.totalBookings,
      sub: `${stats.pendingBookings} pending · ${stats.confirmedBookings} confirmed`,
      icon: CalendarDays,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Companies",
      value: stats.totalCompanies,
      sub: "Registered seller companies",
      icon: Building2,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="mt-1 text-sm text-white/40">Platform-wide activity at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-white/[0.06] bg-[#002a47] p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/50">{card.label}</p>
                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
              <p className="mt-1 text-xs text-white/30">{card.sub}</p>
            </div>
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
                <div>
                  <p className="text-sm text-white">{u.name}</p>
                  <p className="text-xs text-white/40">{u.email}</p>
                </div>
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-white/50">
                  {roleLabel[u.role] ?? u.role}
                </span>
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
                <span className="ml-2 shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-white/50">
                  {s.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="rounded-xl border border-white/[0.06] bg-[#002a47] p-5">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-brand-accent" />
            <h2 className="text-sm font-semibold text-white">Recent Bookings</h2>
          </div>
          <div className="space-y-3">
            {activity.recentBookings.length === 0 && (
              <p className="text-xs text-white/30">No bookings yet</p>
            )}
            {activity.recentBookings.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">{(b.scraps as any)?.title ?? "—"}</p>
                  <p className="text-xs text-white/40">by {(b.buyer as any)?.name ?? "—"}</p>
                </div>
                <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${bookingStatusColor[b.status]}`}>
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
