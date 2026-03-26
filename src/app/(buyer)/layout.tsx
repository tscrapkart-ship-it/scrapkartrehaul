import { redirect } from "next/navigation";
import { BuyerNav } from "@/components/buyer/buyer-nav";
import { isMockMode } from "@/lib/mock-data";

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userName = "Demo User";

  if (!isMockMode()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "recycler") redirect("/dashboard");
    userName = profile.name;
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <BuyerNav userName={userName} />
      <main className="mx-auto max-w-7xl px-4 py-6 pb-20 sm:px-6 md:pb-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
