import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isMockMode, mockScraps, mockCompanies } from "@/lib/mock-data";
import { Package, CheckCircle, BookMarked, Building2, Plus, ArrowRight } from "lucide-react";

async function getDashboardData() {
  if (isMockMode()) {
    const company = mockCompanies[0];
    const myScraps = mockScraps.filter((s) => s.seller_id === "u2");
    return {
      company,
      scrapCount: myScraps.length,
      activeCount: myScraps.filter((s) => s.status === "available").length,
      bookedCount: myScraps.filter((s) => s.status === "booked").length,
    };
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user!.id)
    .single();

  const { count: scrapCount } = await supabase
    .from("scraps")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", user!.id);

  const { count: activeCount } = await supabase
    .from("scraps")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", user!.id)
    .eq("status", "available");

  const { count: bookedCount } = await supabase
    .from("scraps")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", user!.id)
    .eq("status", "booked");

  return {
    company,
    scrapCount: scrapCount ?? 0,
    activeCount: activeCount ?? 0,
    bookedCount: bookedCount ?? 0,
  };
}

export default async function SellerDashboard() {
  const { company, scrapCount, activeCount, bookedCount } =
    await getDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Seller Dashboard</h1>
        <Link href="/scraps/new">
          <Button className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            New Listing
          </Button>
        </Link>
      </div>

      {!company && (
        <Card className="border-brand-accent/30 bg-brand-accent/5">
          <CardContent className="flex items-center justify-between pt-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10">
                <Building2 className="h-5 w-5 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Set up your company profile
                </h3>
                <p className="text-sm text-white/40">
                  Create your company profile to start listing scrap materials.
                </p>
              </div>
            </div>
            <Link href="/company/setup">
              <Button className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold">
                Setup Company
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-white/[0.06] bg-white/[0.03]">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/40">Total Listings</p>
              <Package className="h-5 w-5 text-white/20" />
            </div>
            <p className="mt-2 text-3xl font-bold text-brand-accent">{scrapCount}</p>
          </CardContent>
        </Card>
        <Card className="border-white/[0.06] bg-white/[0.03]">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/40">Available</p>
              <CheckCircle className="h-5 w-5 text-white/20" />
            </div>
            <p className="mt-2 text-3xl font-bold text-brand-accent">
              {activeCount}
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/[0.06] bg-white/[0.03]">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/40">Booked</p>
              <BookMarked className="h-5 w-5 text-white/20" />
            </div>
            <p className="mt-2 text-3xl font-bold text-brand-accent">
              {bookedCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {company && (
        <Card className="border-white/[0.06] bg-white/[0.03]">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-secondary/20">
                  <Building2 className="h-5 w-5 text-brand-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {company.name}
                  </h3>
                  <p className="text-sm text-white/40">
                    {company.industry_type}
                    {company.city ? ` — ${company.city}` : ""}
                  </p>
                </div>
              </div>
              <Link href="/company/edit">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/[0.06] text-white/60 hover:bg-white/[0.06] hover:text-white"
                >
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
