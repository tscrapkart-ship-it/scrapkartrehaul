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
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#262626] bg-[#141414] py-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#10B981]/10">
          <Package className="h-7 w-7 text-[#10B981]" />
        </div>
        <p className="mt-5 text-lg font-semibold text-[#D4D4D4]">
          No listings found
        </p>
        <p className="mt-1 text-sm text-[#737373]">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {scraps.map((scrap) => (
        <Link key={scrap.id} href={`/marketplace/${scrap.id}`}>
          <ScrapCard scrap={scrap} companyName={scrap.companies?.name} />
        </Link>
      ))}
    </div>
  );
}
