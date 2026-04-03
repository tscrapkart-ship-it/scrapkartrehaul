import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Company } from "@/types";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#262626] bg-[#141414] p-5 transition-all duration-300 hover:border-[#10B981]/20 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.08)]">
      <div className="flex items-start gap-4">
        {/* Logo */}
        {company.logo_url ? (
          <Image
            src={company.logo_url}
            alt={company.name}
            width={48}
            height={48}
            className="rounded-xl border border-[#262626] object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#262626] bg-[#1A1A1A] text-lg font-bold text-[#10B981]">
            {company.name.charAt(0)}
          </div>
        )}

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-semibold text-[#F5F5F5] group-hover:text-white transition-colors">
              {company.name}
            </h3>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#1A1A1A] text-[#525252] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-[#10B981]">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {company.industry_type && (
            <span className="mt-1.5 inline-block rounded-md bg-[#10B981]/10 px-2 py-0.5 text-xs font-medium text-[#10B981]">
              {company.industry_type}
            </span>
          )}

          {company.city && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-[#737373]">
              <MapPin className="h-3 w-3" />
              {company.city}
              {company.state ? `, ${company.state}` : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
