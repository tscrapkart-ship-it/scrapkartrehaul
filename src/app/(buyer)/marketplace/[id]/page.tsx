import { notFound } from "next/navigation";
import Link from "next/link";
import { ImageGallery } from "@/components/shared/image-gallery";
import { Badge } from "@/components/ui/badge";
import { SubmitBidDialog } from "@/components/buyer/submit-bid-dialog";
import { BidsList } from "@/components/seller/listing-bids";
import { createClient } from "@/lib/supabase/server";
import {
  ChevronRight,
  MapPin,
  Scale,
  Tag,
  Package,
  Building2,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

const statusConfig: Record<string, { label: string; class: string }> = {
  live: { label: "Accepting Bids", class: "bg-green-500/10 text-green-400 border border-green-500/20" },
  matched: { label: "Bid Accepted", class: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  picked: { label: "Pickup Scheduled", class: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
  completed: { label: "Completed", class: "bg-[#1A1A1A] text-[#525252] border border-[#262626]" },
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

  const statusInfo = statusConfig[scrap.status] ?? { label: scrap.status, class: "bg-[#1A1A1A] text-[#525252]" };
  const images = [...(scrap.photos ?? []), ...(scrap.images ?? [])].filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-base text-[#525252]">
        <Link href="/marketplace" className="hover:text-[#10B981] transition-colors">
          Marketplace
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[#A3A3A3] truncate max-w-[300px] text-base">{scrap.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Left: Images */}
        <div className="animate-slide-up delay-1">
          <ImageGallery images={images} />
        </div>

        {/* Right: Details */}
        <div className="lg:sticky lg:top-6 lg:self-start space-y-5 animate-slide-up delay-2">
          {/* Main details card */}
          <div className="rounded-xl border border-[#262626] bg-[#141414] p-6 space-y-5">
            {/* Category + Status */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#10B981]/10 px-2.5 py-1 text-sm font-semibold text-[#10B981]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                    {scrap.category}
                    {scrap.sub_type ? ` — ${scrap.sub_type}` : ""}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-white leading-tight">{scrap.title}</h1>
              </div>
              <Badge className={`shrink-0 ${statusInfo.class}`}>{statusInfo.label}</Badge>
            </div>

            {/* Price */}
            {(scrap.price_expectation || scrap.price) && (
              <div className="flex items-baseline gap-2 pb-1">
                <span className="text-4xl font-bold text-[#10B981]">
                  ₹{(scrap.price_expectation ?? scrap.price).toLocaleString("en-IN")}
                </span>
                <span className="text-base text-[#525252]">asking price</span>
              </div>
            )}

            {/* Description */}
            {scrap.description && (
              <p className="text-base leading-relaxed text-[#A3A3A3] border-t border-[#262626] pt-4">
                {scrap.description}
              </p>
            )}

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#525252]">
                  <Scale className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wider">Quantity</span>
                </div>
                <p className="font-semibold text-white pl-5">
                  {scrap.quantity} {scrap.unit}
                </p>
              </div>

              {scrap.city && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[#525252]">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wider">Location</span>
                  </div>
                  <p className="font-medium text-[#D4D4D4] pl-5">
                    {scrap.city}{scrap.state ? `, ${scrap.state}` : ""}
                  </p>
                </div>
              )}

              {scrap.pincode && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[#525252]">
                    <Tag className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wider">Pincode</span>
                  </div>
                  <p className="font-medium text-[#D4D4D4] pl-5">{scrap.pincode}</p>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#525252]">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wider">Listed</span>
                </div>
                <p className="font-medium text-[#D4D4D4] pl-5">
                  {new Date(scrap.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Bid / Action area */}
            {!user && (
              <Link href="/signup" className="block">
                <button className="w-full rounded-xl bg-[#10B981] py-3.5 font-semibold text-black hover:bg-[#059669] transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
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
              <div className="rounded-xl border border-[#10B981]/20 bg-[#10B981]/[0.04] px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#10B981]" />
                  <p className="text-base text-[#10B981] font-semibold">Your listing</p>
                </div>
                <p className="text-sm text-[#737373] mt-1 pl-6">Review and manage bids below.</p>
              </div>
            )}
          </div>

          {/* Company info card */}
          {scrap.companies && (
            <Link href={`/companies/${scrap.companies.id}`} className="group block">
              <div className="rounded-xl border border-[#262626] bg-[#141414] p-5 transition-all hover:border-[#333] hover:bg-[#1A1A1A]">
                <p className="text-xs font-medium uppercase tracking-widest text-[#525252] mb-3">
                  Listed by
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-sm font-bold text-[#10B981] shrink-0">
                    {scrap.companies.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={scrap.companies.logo_url} alt="" className="h-full w-full rounded-xl object-cover" />
                    ) : (
                      <Building2 className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white group-hover:text-[#10B981] transition-colors truncate">
                      {scrap.companies.name}
                    </p>
                    {scrap.companies.city && (
                      <p className="text-sm text-[#525252] mt-0.5">
                        {scrap.companies.city}{scrap.companies.state ? `, ${scrap.companies.state}` : ""}
                      </p>
                    )}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#525252] group-hover:text-[#10B981] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Bids section — visible to listing owner */}
      {isOwner && (
        <div className="mt-8 animate-slide-up delay-3">
          <BidsList listingId={scrap.id} listingStatus={scrap.status} />
        </div>
      )}
    </div>
  );
}
