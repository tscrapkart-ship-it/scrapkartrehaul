import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ScrapCard } from "@/components/shared/scrap-card";
import { isMockMode, mockCompanies, mockScraps } from "@/lib/mock-data";
import { MapPin, Factory, Package, ChevronLeft, CheckCircle } from "lucide-react";

async function getCompanyWithScraps(id: string) {
  if (isMockMode()) {
    const company = mockCompanies.find((c) => c.id === id);
    if (!company) return null;
    const scraps = mockScraps.filter(
      (s) => s.company_id === id && s.status === "live"
    );
    return { company, scraps };
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();
  if (!company) return null;

  const { data: scraps } = await supabase
    .from("scraps")
    .select("*")
    .eq("company_id", id)
    .eq("status", "available")
    .order("created_at", { ascending: false });

  return { company, scraps: scraps ?? [] };
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCompanyWithScraps(id);
  if (!result) notFound();

  const { company, scraps } = result;

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      {/* Back link */}
      <Link href="/companies" className="inline-flex items-center gap-1 text-base text-[#525252] hover:text-[#10B981] transition-colors">
        <ChevronLeft className="h-4 w-4" />
        All Companies
      </Link>

      {/* Company hero card */}
      <div className="rounded-xl border border-[#262626] bg-[#141414] p-6 animate-slide-up delay-1">
        <div className="flex items-start gap-5">
          {company.logo_url ? (
            <Image
              src={company.logo_url}
              alt={company.name}
              width={80}
              height={80}
              className="rounded-xl border border-[#262626] object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-2xl font-bold text-[#10B981]">
              {company.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white">
                {company.name}
              </h1>
              {company.verification_status === "verified" && (
                <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
              )}
            </div>
            {company.industry_type && (
              <p className="mt-1 flex items-center gap-1.5 text-base text-[#10B981]">
                <Factory className="h-3.5 w-3.5" />
                {company.industry_type}
              </p>
            )}
            {company.city && (
              <p className="mt-1 flex items-center gap-1.5 text-base text-[#737373]">
                <MapPin className="h-3.5 w-3.5" />
                {company.city}
                {company.state ? `, ${company.state}` : ""}
              </p>
            )}
          </div>
        </div>
        {company.description && (
          <p className="mt-5 text-base leading-relaxed text-[#A3A3A3] border-t border-[#262626] pt-5">
            {company.description}
          </p>
        )}
      </div>

      {/* Available listings */}
      <div className="animate-slide-up delay-2">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#10B981]/10">
            <Package className="h-3.5 w-3.5 text-[#10B981]" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Available Listings
          </h2>
          <span className="rounded-md bg-[#1A1A1A] border border-[#262626] px-2 py-0.5 text-xs font-medium text-[#737373]">
            {scraps.length}
          </span>
        </div>
        {scraps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#262626] bg-[#141414]/50 py-12 text-center">
            <p className="text-base text-[#525252]">
              No available listings from this company.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {scraps.map((scrap) => (
              <Link key={scrap.id} href={`/marketplace/${scrap.id}`}>
                <ScrapCard scrap={scrap} companyName={company.name} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
