import { redirect } from "next/navigation";

export default async function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role === "admin") redirect("/");

  return <>{children}</>;
}
