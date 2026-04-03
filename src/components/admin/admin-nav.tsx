"use client";

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

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(item: { href: string; exact?: boolean }) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  // Show first 5 in desktop nav, rest in overflow
  const primaryItems = navItems.slice(0, 6);
  const secondaryItems = navItems.slice(6);

  return (
    <>
      {/* Desktop header */}
      <header className="sticky top-0 z-40 border-b border-[#262626] bg-brand-dark">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="/logos/ScrapKart White Logo.png"
                alt="ScrapKart"
                width={110}
                height={32}
                priority
              />
              <span className="hidden rounded-md border border-brand-accent/30 bg-brand-accent/10 px-2 py-0.5 text-xs font-semibold text-brand-accent sm:inline">
                Admin
              </span>
            </Link>
            <nav className="hidden items-center gap-0.5 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                    isActive(item)
                      ? "text-brand-accent"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive(item) && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 rounded-full bg-brand-accent" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent/10">
                <ShieldCheck className="h-4 w-4 text-brand-accent" />
              </div>
              <span className="text-sm text-white/60">Admin</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white/40 hover:bg-white/[0.06] hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav — show primary items */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#262626] bg-brand-dark md:hidden">
        <div className="flex justify-around py-2 overflow-x-auto">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors shrink-0 ${
                  active ? "text-brand-accent" : "text-white/40"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
        {/* Secondary items row */}
        <div className="flex justify-around py-1 border-t border-white/[0.04]">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors shrink-0 ${
                  active ? "text-brand-accent" : "text-white/30"
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
