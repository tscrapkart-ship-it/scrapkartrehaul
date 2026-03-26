"use client";

import Link from "next/link";
import { ScrapCard } from "@/components/shared/scrap-card";
import { Package } from "lucide-react";
import type { Scrap } from "@/types";

interface ScrapWithCompany extends Scrap {
  companies: { name: string; logo_url: string | null } | null;
}

export function ScrapGrid({ scraps }: { scraps: ScrapWithCompany[] }) {
  if (scraps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#002a47] py-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/10">
          <Package className="h-6 w-6 text-brand-accent" />
        </div>
        <p className="mt-4 text-lg font-medium text-white/60">
          No scrap listings found
        </p>
        <p className="mt-1 text-sm text-white/30">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {scraps.map((scrap) => (
        <Link key={scrap.id} href={`/marketplace/${scrap.id}`}>
          <ScrapCard scrap={scrap} companyName={scrap.companies?.name} />
        </Link>
      ))}
    </div>
  );
}
