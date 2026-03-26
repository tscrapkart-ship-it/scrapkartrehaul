import { notFound } from "next/navigation";
import Link from "next/link";
import { ImageGallery } from "@/components/shared/image-gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookScrapDialog } from "@/components/buyer/book-scrap-dialog";
import { isMockMode, mockScraps, mockCompanies } from "@/lib/mock-data";
import { ChevronRight, MapPin, Building2 } from "lucide-react";

async function getScrap(id: string) {
  if (isMockMode()) {
    const scrap = mockScraps.find((s) => s.id === id);
    if (!scrap) return null;
    const company = mockCompanies.find((c) => c.id === scrap.company_id);
    return {
      ...scrap,
      companies: company
        ? {
            id: company.id,
            name: company.name,
            logo_url: company.logo_url,
            industry_type: company.industry_type,
            city: company.city,
            state: company.state,
          }
        : null,
    };
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("scraps")
    .select("*, companies(id, name, logo_url, industry_type, city, state)")
    .eq("id", id)
    .single();
  return data;
}

const statusConfig: Record<string, string> = {
  available: "text-green-400",
  booked: "text-amber-400",
  collected: "text-white/40",
};

export default async function ScrapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scrap = await getScrap(id);
  if (!scrap) notFound();

  const mock = isMockMode();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-white/40">
        <Link href="/marketplace" className="hover:text-brand-accent transition-colors">
          Marketplace
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-white/60 truncate">{scrap.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left: Images */}
        <ImageGallery images={scrap.images ?? []} />

        {/* Right: Price card (sticky) */}
        <div className="md:sticky md:top-6 md:self-start">
          <Card className="border-white/[0.06] bg-[#002a47]">
            <CardContent className="space-y-5 pt-6">
              <div>
                <span className="inline-block rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium text-brand-accent">
                  {scrap.category}
                </span>
                <h1 className="mt-3 text-2xl font-bold text-white">
                  {scrap.title}
                </h1>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-brand-accent">
                  ₹{scrap.price.toLocaleString("en-IN")}
                </span>
                <span className="text-white/40">
                  / {scrap.quantity} {scrap.unit}
                </span>
              </div>

              {scrap.description && (
                <p className="text-sm leading-relaxed text-white/50">{scrap.description}</p>
              )}

              <div className="grid grid-cols-2 gap-y-3 rounded-lg border border-white/[0.06] bg-white/[0.03] p-4 text-sm">
                <span className="text-white/40">Status</span>
                <span className={`font-medium ${statusConfig[scrap.status] ?? "text-white/40"}`}>
                  {scrap.status.charAt(0).toUpperCase() + scrap.status.slice(1)}
                </span>
                {scrap.city && (
                  <>
                    <span className="text-white/40">Location</span>
                    <span className="flex items-center gap-1 text-white/70">
                      <MapPin className="h-3.5 w-3.5 text-white/30" />
                      {scrap.city}
                      {scrap.state ? `, ${scrap.state}` : ""}
                    </span>
                  </>
                )}
              </div>

              {scrap.status === "available" && !mock && (
                <BookScrapDialog
                  scrapId={scrap.id}
                  scrapTitle={scrap.title}
                  sellerId={scrap.seller_id}
                />
              )}

              {scrap.status === "available" && mock && (
                <Link href="/signup">
                  <Button
                    className="w-full bg-brand-accent text-brand-dark font-semibold hover:bg-brand-accent/90"
                    size="lg"
                  >
                    Sign Up to Book
                  </Button>
                </Link>
              )}

              {scrap.status !== "available" && (
                <Button disabled className="w-full bg-white/[0.06] text-white/40 border-white/[0.06]">
                  {scrap.status === "booked" ? "Already Booked" : "Collected"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Company info card */}
      {scrap.companies && (
        <Card className="border-white/[0.06] bg-[#002a47]">
          <CardContent className="pt-5">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
              Listed by
            </h3>
            <Link href={`/companies/${scrap.companies.id}`} className="group">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10 text-sm font-bold text-brand-accent">
                  {scrap.companies.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white group-hover:text-brand-accent transition-colors">
                    {scrap.companies.name}
                  </p>
                  {scrap.companies.city && (
                    <p className="text-xs text-white/40">
                      {scrap.companies.city}
                      {scrap.companies.state
                        ? `, ${scrap.companies.state}`
                        : ""}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-brand-accent transition-colors" />
              </div>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
