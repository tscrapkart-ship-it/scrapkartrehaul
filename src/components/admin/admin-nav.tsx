"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Package,
  Gavel,
  Building2,
  Recycle,
  ArrowLeftRight,
  MessageSquare,
  BookOpen,
  LogOut,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: BarChart3, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/listings", label: "Listings", icon: Package },
  { href: "/admin/bids", label: "Bids", icon: Gavel },
  { href: "/admin/transactions", label: "Deals", icon: ArrowLeftRight },
  { href: "/admin/companies", label: "Producers", icon: Building2 },
  { href: "/admin/recyclers", label: "Recyclers", icon: Recycle },
  { href: "/admin/contact", label: "Contact", icon: MessageSquare },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(item: { href: string; exact?: boolean }) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const primaryItems = navItems.slice(0, 6);
  const secondaryItems = navItems.slice(6);

  return (
    <>
      {/* Desktop header */}
      <header className="sticky top-0 z-40 border-b border-[#262626] bg-[#0A0A0A]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5">
              <Image
                src="/logos/ScrapKart White Logo.png"
                alt="ScrapKart"
                width={110}
                height={32}
                priority
              />
              <span className="hidden rounded-md border border-[#10B981]/30 bg-[#10B981]/10 px-2 py-0.5 text-sm font-semibold text-[#10B981] sm:inline">
                Admin
              </span>
            </Link>
            <nav className="hidden items-center gap-0.5 overflow-x-auto md:flex">
              {navItems.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative shrink-0 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors lg:px-3 lg:text-base ${
                      active
                        ? "text-[#10B981] bg-[#10B981]/[0.06]"
                        : "text-[#737373] hover:text-white hover:bg-[#1A1A1A]"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#10B981]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981]/10 border border-[#10B981]/20">
                <ShieldCheck className="h-4 w-4 text-[#10B981]" />
              </div>
              <span className="text-base text-[#737373]">Admin</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-[#525252] hover:bg-[#1A1A1A] hover:text-white"
            >
              {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#262626] bg-[#0A0A0A]/95 backdrop-blur-sm md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="flex justify-around py-2 overflow-x-auto">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors shrink-0 ${
                  active ? "text-[#10B981]" : "text-[#525252]"
                }`}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  active ? "bg-[#10B981]/10" : ""
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex justify-around py-1 border-t border-[#1A1A1A]">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors shrink-0 ${
                  active ? "text-[#10B981]" : "text-[#3F3F3F]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
