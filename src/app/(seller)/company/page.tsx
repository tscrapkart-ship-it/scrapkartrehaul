import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isMockMode, mockCompanies } from "@/lib/mock-data";
import { Building2, MapPin, Pencil } from "lucide-react";

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
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Company Profile</h1>
        <Link href="/company/edit">
          <Button className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <Card className="border-white/[0.06] bg-white/[0.03]">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            {company.logo_url ? (
              <Image
                src={company.logo_url}
                alt={company.name}
                width={80}
                height={80}
                className="rounded-lg object-cover ring-1 ring-white/[0.06]"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-brand-secondary/20 text-2xl font-bold text-brand-accent ring-1 ring-white/[0.06]">
                {company.name.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {company.name}
              </h2>
              {company.industry_type && (
                <p className="text-sm text-brand-accent">
                  {company.industry_type}
                </p>
              )}
            </div>
          </div>

          {company.description && (
            <p className="mt-4 text-sm text-white/40">
              {company.description}
            </p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-y-3 text-sm">
            {company.address && (
              <>
                <span className="flex items-center gap-2 text-white/40">
                  <MapPin className="h-3.5 w-3.5" />
                  Address
                </span>
                <span className="text-white/80">{company.address}</span>
              </>
            )}
            {company.city && (
              <>
                <span className="text-white/40">City</span>
                <span className="text-white/80">{company.city}</span>
              </>
            )}
            {company.state && (
              <>
                <span className="text-white/40">State</span>
                <span className="text-white/80">{company.state}</span>
              </>
            )}
            {company.pincode && (
              <>
                <span className="text-white/40">Pincode</span>
                <span className="text-white/80">{company.pincode}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
