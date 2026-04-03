import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/login");

  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-dark">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-4 py-6 pb-20 sm:px-6 md:pb-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
