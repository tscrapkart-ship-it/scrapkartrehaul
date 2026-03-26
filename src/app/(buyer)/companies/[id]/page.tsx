import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ScrapCard } from "@/components/shared/scrap-card";
import { isMockMode, mockCompanies, mockScraps } from "@/lib/mock-data";
import { MapPin, Factory, Package } from "lucide-react";

async function getCompanyWithScraps(id: string) {
  if (isMockMode()) {
    const company = mockCompanies.find((c) => c.id === id);
    if (!company) return null;
    const scraps = mockScraps.filter(
      (s) => s.company_id === id && s.status === "available"
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
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Company hero card */}
      <Card className="overflow-hidden border-white/[0.06] bg-gradient-to-br from-[#002a47] to-[#001C30]">
        <CardContent className="pt-6">
          <div className="flex items-start gap-5">
            {company.logo_url ? (
              <Image
                src={company.logo_url}
                alt={company.name}
                width={80}
                height={80}
                className="rounded-xl border border-white/[0.06] object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-brand-accent/10 text-2xl font-bold text-brand-accent">
                {company.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-white">
                {company.name}
              </h1>
              {company.industry_type && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-accent">
                  <Factory className="h-3.5 w-3.5" />
                  {company.industry_type}
                </p>
              )}
              {company.city && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/40">
                  <MapPin className="h-3.5 w-3.5" />
                  {company.city}
                  {company.state ? `, ${company.state}` : ""}
                </p>
              )}
            </div>
          </div>
          {company.description && (
            <p className="mt-5 text-sm leading-relaxed text-white/50 border-t border-white/[0.06] pt-5">
              {company.description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Available listings */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Package className="h-4 w-4 text-brand-accent" />
          <h2 className="text-lg font-semibold text-white">
            Available Listings
          </h2>
          <span className="ml-1 rounded-full bg-brand-accent/10 px-2.5 py-0.5 text-xs font-medium text-brand-accent">
            {scraps.length}
          </span>
        </div>
        {scraps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.06] bg-[#002a47] py-12 text-center">
            <p className="text-sm text-white/40">
              No available listings from this company.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
