import Link from "next/link";
import { CompanyCard } from "@/components/shared/company-card";
import { isMockMode, mockCompanies } from "@/lib/mock-data";
import { Building2 } from "lucide-react";

async function getCompanies() {
  if (isMockMode()) return mockCompanies;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase.from("companies").select("*").order("name");
  return data ?? [];
}

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
            <Building2 className="h-5 w-5 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Companies</h1>
            <p className="text-base text-[#737373]">
              Explore verified waste producers and their listings
            </p>
          </div>
        </div>
        {companies.length > 0 && (
          <span className="shrink-0 rounded-lg bg-[#1A1A1A] border border-[#262626] px-3 py-1.5 text-xs font-medium text-[#737373]">
            {companies.length} compan{companies.length !== 1 ? "ies" : "y"}
          </span>
        )}
      </div>

      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#262626] bg-[#141414]/50 py-16">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A1A1A] border border-[#262626]">
            <Building2 className="h-7 w-7 text-[#525252]" />
          </div>
          <p className="text-xl font-semibold text-[#D4D4D4]">
            No companies listed yet
          </p>
          <p className="mt-1 text-base text-[#525252]">
            Check back soon for new sellers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Link key={company.id} href={`/companies/${company.id}`}>
              <CompanyCard company={company} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
