import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isMockMode, mockCompanies } from "@/lib/mock-data";
import { Building2, MapPin, Pencil, Factory, CheckCircle, Clock, ChevronRight } from "lucide-react";

async function getCompany() {
  if (isMockMode()) return mockCompanies[0];

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!data) redirect("/company/setup");
  return data;
}

export default async function CompanyPage() {
  const company = await getCompany();

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Company Profile</h1>
        <Link href="/company/edit" className="shrink-0">
          <Button className="bg-[#10B981] text-black hover:bg-[#059669] font-semibold transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Company card */}
      <div className="rounded-xl border border-[#262626] bg-[#141414] p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          {company.logo_url ? (
            <Image
              src={company.logo_url}
              alt={company.name}
              width={80}
              height={80}
              className="h-16 w-16 shrink-0 rounded-xl border border-[#262626] object-cover sm:h-20 sm:w-20"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-xl font-bold text-[#10B981] sm:h-20 sm:w-20 sm:text-2xl">
              {company.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white truncate sm:text-2xl">{company.name}</h2>
            {company.industry_type && (
              <p className="mt-1 flex items-center gap-1.5 text-base text-[#10B981]">
                <Factory className="h-3.5 w-3.5" />
                {company.industry_type}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium ${
                company.verification_status === "verified"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-yellow-500/10 text-yellow-400"
              }`}>
                {company.verification_status === "verified" ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                {company.verification_status === "verified" ? "Verified" : "Pending Review"}
              </span>
            </div>
          </div>
        </div>

        {company.description && (
          <p className="mt-5 text-base leading-relaxed text-[#A3A3A3] border-t border-[#262626] pt-5">
            {company.description}
          </p>
        )}

        {/* Location details */}
        {(company.address || company.city || company.state || company.pincode) && (
          <div className="mt-5 rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] p-4">
            <div className="flex items-center gap-1.5 text-[#525252] mb-3">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-xs font-medium uppercase tracking-wider">Location</span>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2.5 text-sm sm:text-base">
              {company.address && (
                <>
                  <span className="text-[#525252] shrink-0">Address</span>
                  <span className="text-[#D4D4D4] break-words">{company.address}</span>
                </>
              )}
              {company.city && (
                <>
                  <span className="text-[#525252] shrink-0">City</span>
                  <span className="text-[#D4D4D4] break-words">{company.city}</span>
                </>
              )}
              {company.state && (
                <>
                  <span className="text-[#525252] shrink-0">State</span>
                  <span className="text-[#D4D4D4] break-words">{company.state}</span>
                </>
              )}
              {company.pincode && (
                <>
                  <span className="text-[#525252] shrink-0">Pincode</span>
                  <span className="text-[#D4D4D4] break-words">{company.pincode}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
