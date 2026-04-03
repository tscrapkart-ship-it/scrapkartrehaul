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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Companies</h1>
        <p className="mt-1 text-sm text-white/40">
          Explore verified waste producers and their listings
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#262626] bg-card py-16">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]">
            <Building2 className="h-6 w-6 text-white/30" />
          </div>
          <p className="text-lg font-medium text-white/60">
            No companies listed yet
          </p>
          <p className="mt-1 text-sm text-white/30">
            Check back soon for new sellers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
