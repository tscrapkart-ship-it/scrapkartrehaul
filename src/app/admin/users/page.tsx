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
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="mt-1 text-base text-white/40">
          Manage and approve registered users
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
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

      <div className="rounded-xl border border-[#262626] bg-card overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Users className="h-8 w-8 text-white/20" />
            <p className="text-base text-white/40">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-base">
              <thead>
                <tr className="border-b border-[#262626]">
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/40 sm:px-5">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/40 sm:px-5">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/40 sm:px-5">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/40 sm:px-5">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/40 sm:px-5">Joined</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/40 sm:px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-sm font-semibold text-brand-accent">
                          {user.name?.slice(0, 2).toUpperCase() ?? "??"}
                        </div>
                        <span className="max-w-[120px] truncate font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-4 text-white/60 sm:px-5">{user.email}</td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                      {user.role ? (
                        <span className={`rounded-full px-2.5 py-1 text-sm font-medium ${roleColor[user.role] ?? "bg-white/10 text-white/60"}`}>
                          {roleLabel[user.role] ?? user.role}
                        </span>
                      ) : (
                        <span className="text-sm text-white/30">No role</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                      {!user.onboarding_completed ? (
                        <span className="rounded-full bg-[#1A1A1A] px-2.5 py-1 text-sm text-white/40">Onboarding</span>
                      ) : user.is_approved ? (
                        <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-sm text-green-400">Approved</span>
                      ) : (
                        <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-sm text-yellow-400">Pending</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-white/40 sm:px-5">
                      {new Date(user.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4 sm:px-5">
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

      <p className="text-sm text-white/20">{users.length} user{users.length !== 1 ? "s" : ""} shown</p>
    </div>
  );
}
