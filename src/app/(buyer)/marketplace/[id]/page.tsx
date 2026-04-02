import { notFound } from "next/navigation";
import Link from "next/link";
import { ImageGallery } from "@/components/shared/image-gallery";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubmitBidDialog } from "@/components/buyer/submit-bid-dialog";
import { BidsList } from "@/components/seller/listing-bids";
import { createClient } from "@/lib/supabase/server";
import { ChevronRight, MapPin, Package, Scale, Tag } from "lucide-react";

const statusConfig: Record<string, { label: string; class: string }> = {
  live: { label: "Accepting Bids", class: "bg-green-500/10 text-green-400 border border-green-500/20" },
  matched: { label: "Bid Accepted", class: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  picked: { label: "Pickup Scheduled", class: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
  completed: { label: "Completed", class: "bg-white/10 text-white/50 border border-white/10" },
  cancelled: { label: "Cancelled", class: "bg-red-500/10 text-red-400 border border-red-500/20" },
};

export default async function ScrapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("users").select("role").eq("id", user.id).single()
    : { data: null };

  const { data: scrap } = await supabase
    .from("scraps")
    .select("*, companies(id, name, logo_url, industry_type, city, state, waste_categories)")
    .eq("id", id)
    .single();

  if (!scrap) notFound();

  const isOwner = user?.id === scrap.seller_id;
  const isRecycler = profile?.role === "recycler" || profile?.role === "both";

  // Fetch current user's bid if they're a recycler
  let userBid = null;
  if (user && isRecycler && !isOwner) {
    const { data } = await supabase
      .from("listing_bids")
      .select("*")
      .eq("listing_id", id)
      .eq("recycler_id", user.id)
      .single();
    userBid = data;
  }

  const statusInfo = statusConfig[scrap.status] ?? { label: scrap.status, class: "bg-white/[0.06] text-white/50" };
  const images = [...(scrap.photos ?? []), ...(scrap.images ?? [])].filter(Boolean);

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
        <ImageGallery images={images} />

        {/* Right: Details card */}
        <div className="md:sticky md:top-6 md:self-start space-y-4">
          <Card className="border-white/[0.06] bg-[#002a47]">
            <CardContent className="space-y-5 pt-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium text-brand-accent">
                    {scrap.category}
                    {scrap.sub_type ? ` — ${scrap.sub_type}` : ""}
                  </span>
                  <h1 className="mt-2 text-2xl font-bold text-white">{scrap.title}</h1>
                </div>
                <Badge className={statusInfo.class}>{statusInfo.label}</Badge>
              </div>

              {/* Price expectation */}
              {(scrap.price_expectation || scrap.price) && (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-brand-accent">
                    ₹{(scrap.price_expectation ?? scrap.price).toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-white/40">asking price</span>
                </div>
              )}

              {scrap.description && (
                <p className="text-sm leading-relaxed text-white/50">{scrap.description}</p>
              )}

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-y-3 rounded-lg border border-white/[0.06] bg-white/[0.03] p-4 text-sm">
                <span className="flex items-center gap-1.5 text-white/40">
                  <Scale className="h-3.5 w-3.5" />
                  Quantity
                </span>
                <span className="font-medium text-white/80">
                  {scrap.quantity} {scrap.unit}
                </span>

                {scrap.city && (
                  <>
                    <span className="flex items-center gap-1.5 text-white/40">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                    </span>
                    <span className="text-white/70">
                      {scrap.city}{scrap.state ? `, ${scrap.state}` : ""}
                    </span>
                  </>
                )}

                {scrap.pincode && (
                  <>
                    <span className="flex items-center gap-1.5 text-white/40">
                      <Tag className="h-3.5 w-3.5" />
                      Pincode
                    </span>
                    <span className="text-white/70">{scrap.pincode}</span>
                  </>
                )}
              </div>

              {/* Bid / Action area */}
              {!user && (
                <Link href="/signup" className="block">
                  <button className="w-full rounded-xl bg-brand-accent py-3 font-semibold text-brand-dark hover:bg-brand-accent/90 transition-colors">
                    Sign Up to Submit a Bid
                  </button>
                </Link>
              )}

              {user && isRecycler && !isOwner && (
                <SubmitBidDialog
                  listingId={scrap.id}
                  listingTitle={scrap.title}
                  existingBid={userBid}
                  listingStatus={scrap.status}
                />
              )}

              {isOwner && (
                <div className="rounded-lg border border-brand-accent/20 bg-brand-accent/5 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-brand-accent" />
                    <p className="text-sm text-brand-accent font-medium">Your listing</p>
                  </div>
                  <p className="text-xs text-white/40 mt-1">Review and manage bids below.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Company info */}
      {scrap.companies && (
        <Card className="border-white/[0.06] bg-[#002a47]">
          <CardContent className="pt-5">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
              Listed by
            </h3>
            <Link href={`/companies/${scrap.companies.id}`} className="group">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10 text-sm font-bold text-brand-accent">
                  {scrap.companies.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={scrap.companies.logo_url} alt="" className="h-full w-full rounded-lg object-cover" />
                  ) : (
                    scrap.companies.name.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white group-hover:text-brand-accent transition-colors">
                    {scrap.companies.name}
                  </p>
                  {scrap.companies.city && (
                    <p className="text-xs text-white/40">
                      {scrap.companies.city}{scrap.companies.state ? `, ${scrap.companies.state}` : ""}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-brand-accent transition-colors" />
              </div>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Bids section — visible to listing owner */}
      {isOwner && (
        <BidsList listingId={scrap.id} listingStatus={scrap.status} />
      )}
    </div>
  );
}
