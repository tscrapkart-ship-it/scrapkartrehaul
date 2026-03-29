import { Building2 } from "lucide-react";

async function getCompanies() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data } = await supabase
    .from("companies")
    .select(`
      id, name, industry_type, city, state, description, created_at,
      owner:users!companies_owner_id_fkey(name, email)
    `)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminCompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Companies</h1>
        <p className="mt-1 text-sm text-white/40">All seller company profiles on the platform</p>
      </div>

      {companies.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-[#002a47] py-16 text-center">
          <Building2 className="h-8 w-8 text-white/20" />
          <p className="text-sm text-white/40">No companies yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company: any) => (
            <div
              key={company.id}
              className="rounded-xl border border-white/[0.06] bg-[#002a47] p-5 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10 text-sm font-bold text-brand-accent">
                  {company.name?.slice(0, 2).toUpperCase() ?? "??"}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{company.name}</p>
                  <p className="text-xs text-white/40">{company.industry_type ?? "—"}</p>
                </div>
              </div>

              {company.description && (
                <p className="line-clamp-2 text-xs text-white/50">{company.description}</p>
              )}

              <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                <div>
                  <p className="text-xs font-medium text-white">{(company.owner as any)?.name ?? "—"}</p>
                  <p className="text-xs text-white/40">{(company.owner as any)?.email ?? ""}</p>
                </div>
                <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-white/50">
                  {company.city}, {company.state}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-white/20">{companies.length} compan{companies.length !== 1 ? "ies" : "y"} shown</p>
    </div>
  );
}
