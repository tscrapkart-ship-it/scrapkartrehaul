import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { Company } from "@/types";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#002a47] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-accent/30 hover:shadow-lg hover:shadow-brand-accent/5">
      <CardContent className="flex items-start gap-4 pt-5">
        {company.logo_url ? (
          <Image
            src={company.logo_url}
            alt={company.name}
            width={48}
            height={48}
            className="rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent/10 text-lg font-bold text-brand-accent">
            {company.name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-white">{company.name}</h3>
          {company.industry_type && (
            <span className="mt-1 inline-block rounded-full bg-brand-accent/10 px-2 py-0.5 text-xs font-medium text-brand-accent">
              {company.industry_type}
            </span>
          )}
          {company.city && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-white/40">
              <MapPin className="h-3 w-3" />
              {company.city}
              {company.state ? `, ${company.state}` : ""}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
