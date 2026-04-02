"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Mail, LogOut } from "lucide-react";

export default function PendingApprovalPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase
        .from("users")
        .select("name, role, is_approved")
        .eq("id", user.id)
        .single();
      if (!data) return;
      if (data.is_approved) {
        const dest = data.role === "waste_producer" || data.role === "both" ? "/dashboard" : "/marketplace";
        router.push(dest);
        return;
      }
      setUserName(data.name);
      setRole(data.role);
    }
    check();
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#001C30] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <Image
          src="/logos/ScrapKart White Logo.png"
          alt="ScrapKart"
          width={130}
          height={36}
          priority
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-white/40 hover:text-white hover:bg-white/[0.06]"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-accent/10 border border-brand-accent/20">
                <Clock className="h-10 w-10 text-brand-accent" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#001C30] border border-white/[0.06]">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-white">
              {userName ? `Thanks, ${userName.split(" ")[0]}!` : "Account Under Review"}
            </h1>
            <p className="text-white/50 leading-relaxed">
              Your{" "}
              <span className="text-brand-accent font-medium">
                {role === "waste_producer"
                  ? "producer"
                  : role === "recycler"
                  ? "recycler"
                  : "account"}
              </span>{" "}
              profile has been submitted and is under review by our team.
            </p>
          </div>

          {/* What happens next */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 text-left space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-white/40">
              What happens next
            </h3>
            <div className="space-y-3">
              {[
                "Our team reviews your profile and documents",
                "We verify your compliance information if submitted",
                "You receive email confirmation when approved",
                "Full platform access is granted immediately",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent text-xs font-bold mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-white/60">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline note */}
          <p className="text-sm text-white/30">
            Typically takes{" "}
            <span className="text-white/50 font-medium">24–48 hours</span>. Faster
            for profiles with complete compliance documents.
          </p>

          {/* Contact */}
          <a
            href="mailto:support@scrapkart.in"
            className="inline-flex items-center gap-2 text-sm text-brand-accent hover:text-brand-accent/80 transition-colors"
          >
            <Mail className="h-4 w-4" />
            support@scrapkart.in
          </a>
        </div>
      </main>
    </div>
  );
}
