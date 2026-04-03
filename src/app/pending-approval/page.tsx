"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Mail, LogOut, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#262626] px-6 py-4 flex items-center justify-between">
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
          className="text-[#737373] hover:text-white hover:bg-[#1A1A1A] transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full animate-fade-in">

          {/* Icon block */}
          <div className="flex justify-center mb-8 animate-scale-in delay-1">
            <div className="relative">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-2xl bg-[#10B981]/10 animate-pulse" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-[#262626] bg-[#141414]">
                <Clock className="h-11 w-11 text-[#10B981]" />
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#0A0A0A] border-2 border-[#262626]">
                <CheckCircle className="h-5 w-5 text-[#10B981]" />
              </div>
            </div>
          </div>

          {/* Greeting */}
          <div className="text-center space-y-3 mb-8 animate-slide-up delay-2">
            <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
              Account under review
            </p>
            <h1 className="text-3xl font-bold text-white">
              {userName ? `Thanks, ${userName.split(" ")[0]}!` : "We're on it"}
            </h1>
            <p className="text-[#A3A3A3] leading-relaxed max-w-sm mx-auto">
              Your{" "}
              <span className="text-[#10B981] font-medium">
                {role === "waste_producer"
                  ? "producer"
                  : role === "recycler"
                  ? "recycler"
                  : "account"}
              </span>{" "}
              profile has been submitted and is pending verification by our team.
            </p>
          </div>

          {/* Status card */}
          <div className="rounded-xl border border-[#262626] bg-[#141414] p-6 mb-6 animate-slide-up delay-3">
            <h3 className="text-xs font-medium uppercase tracking-widest text-[#525252] mb-5">
              What happens next
            </h3>
            <div className="space-y-4">
              {[
                { text: "Our team reviews your profile and documents", done: true },
                { text: "We verify your compliance information if submitted", done: false },
                { text: "You receive email confirmation when approved", done: false },
                { text: "Full platform access is granted immediately", done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold mt-0.5 transition-colors ${
                    step.done
                      ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20"
                      : "bg-[#1A1A1A] text-[#525252] border border-[#262626]"
                  }`}>
                    {step.done ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed ${step.done ? "text-white" : "text-[#737373]"}`}>
                      {step.text}
                    </p>
                  </div>
                  {i === 0 && (
                    <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full border border-[#10B981]/20">
                      In progress
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline + ETA */}
          <div className="rounded-xl border border-[#262626] bg-[#141414] p-5 mb-6 flex items-center gap-4 animate-slide-up delay-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1A1A1A] border border-[#262626]">
              <Clock className="h-5 w-5 text-[#737373]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">Estimated review time</p>
              <p className="text-xs text-[#737373]">
                Typically <span className="text-[#A3A3A3] font-medium">24-48 hours</span>. Faster for profiles with complete compliance documents.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center space-y-4 animate-slide-up delay-5">
            <a
              href="mailto:support@scrapkart.in"
              className="inline-flex items-center gap-2 text-sm text-[#10B981] hover:text-[#34D399] transition-colors font-medium group"
            >
              <Mail className="h-4 w-4" />
              support@scrapkart.in
              <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </a>
          </div>

          {/* Logout button at bottom */}
          <div className="mt-10 flex justify-center animate-fade-in delay-6">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-[#262626] bg-transparent text-[#737373] hover:text-white hover:bg-[#1A1A1A] hover:border-[#333] transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out of ScrapKart
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
