"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Building2,
  Gavel,
  ArrowLeftRight,
  User,
  LogOut,
  Loader2,
  ChevronDown,
} from "lucide-react";

const navItems = [
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/bookings", label: "My Bids", icon: Gavel },
  { href: "/transactions", label: "Deals", icon: ArrowLeftRight },
  { href: "/profile", label: "Profile", icon: User },
];

export function BuyerNav({ userName }: { userName: string }) {
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

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* Desktop header */}
      <header className="sticky top-0 z-40 border-b border-[#262626] bg-[#0A0A0A]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/marketplace" className="shrink-0">
              <Image
                src="/logos/ScrapKart White Logo.png"
                alt="ScrapKart"
                width={130}
                height={37}
                priority
              />
            </Link>
            <nav className="hidden items-center gap-0.5 md:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#10B981]/10 text-[#10B981]"
                        : "text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User section */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2.5 rounded-lg border border-[#262626] bg-[#141414] px-3 py-1.5 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10B981] text-xs font-bold text-black">
                {initials}
              </div>
              <span className="text-sm font-medium text-[#F5F5F5]">
                {userName}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[#A3A3A3]" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
              className="h-9 w-9 rounded-lg text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white"
            >
              {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#262626] bg-[#0A0A0A]/95 backdrop-blur-md md:hidden">
        <div className="flex justify-around py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] font-medium transition-all ${
                  isActive
                    ? "text-[#10B981]"
                    : "text-[#525252] active:text-white"
                }`}
              >
                <div
                  className={`rounded-lg p-1 transition-all ${
                    isActive ? "bg-[#10B981]/10" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
