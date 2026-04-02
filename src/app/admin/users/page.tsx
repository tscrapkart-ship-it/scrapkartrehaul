import { Users } from "lucide-react";
import { ApproveUserButton } from "./approve-user-button";

async function getUsers(filter?: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("users")
    .select("id, name, email, role, is_approved, onboarding_completed, created_at")
    .neq("role", "admin")
    .order("created_at", { ascending: false });

  if (filter === "pending") {
    query = query.eq("is_approved", false).not("role", "is", null);
  }

  const { data } = await query;
  return data ?? [];
}

const roleLabel: Record<string, string> = {
  recycler: "Recycler",
  waste_producer: "Producer",
  both: "Both",
};

const roleColor: Record<string, string> = {
  recycler: "bg-blue-500/10 text-blue-400",
  waste_producer: "bg-green-500/10 text-green-400",
  both: "bg-purple-500/10 text-purple-400",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const users = await getUsers(params.filter);
  const activeFilter = params.filter ?? "all";

  const tabs = [
    { value: "all", label: "All Users" },
    { value: "pending", label: "Pending Approval" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="mt-1 text-sm text-white/40">
          Manage and approve registered users
        </p>
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={tab.value === "all" ? "/admin/users" : `/admin/users?filter=${tab.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeFilter === tab.value
                ? "bg-brand-accent text-brand-dark"
                : "border border-white/10 text-white/60 hover:border-brand-accent/30 hover:text-white"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#002a47] overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Users className="h-8 w-8 text-white/20" />
            <p className="text-sm text-white/40">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Joined</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-xs font-semibold text-brand-accent">
                          {user.name?.slice(0, 2).toUpperCase() ?? "??"}
                        </div>
                        <span className="font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/60">{user.email}</td>
                    <td className="px-5 py-4">
                      {user.role ? (
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleColor[user.role] ?? "bg-white/10 text-white/60"}`}>
                          {roleLabel[user.role] ?? user.role}
                        </span>
                      ) : (
                        <span className="text-xs text-white/30">No role</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {!user.onboarding_completed ? (
                        <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-white/40">Onboarding</span>
                      ) : user.is_approved ? (
                        <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs text-green-400">Approved</span>
                      ) : (
                        <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs text-yellow-400">Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-white/40">
                      {new Date(user.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      {!user.is_approved && user.onboarding_completed && (
                        <ApproveUserButton userId={user.id} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-white/20">{users.length} user{users.length !== 1 ? "s" : ""} shown</p>
    </div>
  );
}
