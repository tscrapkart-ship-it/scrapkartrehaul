"use client";

import Image from "next/image";
import { useState } from "react";
import {
  MapPin,
  ArrowUpRight,
  Cog,
  Cpu,
  Recycle,
  FileText,
  GlassWater,
  Layers,
} from "lucide-react";
import type { Scrap, ScrapCategory } from "@/types";

const categoryConfig: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  Metal: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  "E-waste": {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    dot: "bg-purple-400",
  },
  Plastic: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  Paper: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    dot: "bg-green-400",
  },
  Glass: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    dot: "bg-cyan-400",
  },
  "Mixed Scrap": {
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    dot: "bg-gray-400",
  },
};

const categoryIcons: Record<ScrapCategory, React.ElementType> = {
  Metal: Cog,
  "E-waste": Cpu,
  Plastic: Recycle,
  Paper: FileText,
  Glass: GlassWater,
  "Mixed Scrap": Layers,
};

/* ── Skeleton / Loading Card ───────────────────────────────── */
export function ScrapCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#262626] bg-[#141414]">
      {/* Image placeholder */}
      <div className="relative aspect-[16/10] bg-[#0A0A0A]">
        <div className="absolute inset-0 animate-pulse bg-[#1A1A1A]" />
        {/* Category badge skeleton */}
        <div className="absolute left-3 top-3">
          <div className="h-6 w-20 animate-pulse rounded-md bg-[#1A1A1A]" />
        </div>
      </div>

      {/* Content placeholder */}
      <div className="p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-[#1A1A1A]" />
        <div className="mt-1.5 h-3 w-1/3 animate-pulse rounded bg-[#1A1A1A]" />

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="h-3 w-16 animate-pulse rounded bg-[#1A1A1A]" />
            <div className="mt-1.5 h-6 w-24 animate-pulse rounded bg-[#1A1A1A]" />
          </div>
          <div className="text-right">
            <div className="h-3 w-14 animate-pulse rounded bg-[#1A1A1A]" />
            <div className="mt-1.5 h-4 w-16 animate-pulse rounded bg-[#1A1A1A]" />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 border-t border-[#262626] pt-3">
          <div className="h-3.5 w-3.5 animate-pulse rounded bg-[#1A1A1A]" />
          <div className="h-3 w-20 animate-pulse rounded bg-[#1A1A1A]" />
        </div>
      </div>
    </div>
  );
}

/* ── Scrap Card ────────────────────────────────────────────── */
export function ScrapCard({
  scrap,
  companyName,
}: {
  scrap: Scrap;
  companyName?: string | null;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const cat = categoryConfig[scrap.category] ?? {
    bg: "bg-[#10B981]/10",
    text: "text-[#10B981]",
    dot: "bg-[#10B981]",
  };

  const FallbackIcon =
    categoryIcons[scrap.category as ScrapCategory] ?? Layers;
  const showFallback = !scrap.images?.[0] || imgError;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#262626] bg-[#141414] transition-all duration-300 hover:border-[#10B981]/20 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.08)]">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0A0A]">
        {showFallback ? (
          /* Category-appropriate fallback icon */
          <div className="flex h-full items-center justify-center bg-[#0A0A0A]">
            <div className="flex flex-col items-center gap-2">
              <FallbackIcon
                className={`h-12 w-12 ${cat.text} opacity-40`}
              />
              <span className="text-[11px] text-[#525252]">
                {scrap.category}
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Pulse loader while image is loading */}
            {!imgLoaded && (
              <div className="absolute inset-0 z-10 animate-pulse bg-[#1A1A1A]" />
            )}
            <Image
              src={scrap.images[0]}
              alt={scrap.title}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-60" />

        {/* Category badge */}
        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${cat.bg} ${cat.text} backdrop-blur-sm`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
            {scrap.category}
          </span>
        </div>

        {/* Status badge */}
        {scrap.status && scrap.status !== "live" && (
          <span className="absolute right-3 top-3 rounded-md bg-[#0A0A0A]/80 px-2.5 py-1 text-xs font-medium capitalize text-[#A3A3A3] backdrop-blur-sm">
            {scrap.status}
          </span>
        )}

        {/* Hover arrow */}
        <div className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981] text-black opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-1 text-[15px] font-semibold text-[#F5F5F5] group-hover:text-white transition-colors">
          {scrap.title}
        </h3>
        {companyName && (
          <p className="mt-0.5 text-xs text-[#737373]">{companyName}</p>
        )}

        {/* Price row */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-xs text-[#737373]">Asking price</p>
            <p className="text-lg font-bold text-[#10B981]">
              ₹{scrap.price.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#737373]">Quantity</p>
            <p className="text-sm font-medium text-[#D4D4D4]">
              {scrap.quantity} {scrap.unit}
            </p>
          </div>
        </div>

        {/* Footer */}
        {scrap.city && (
          <div className="mt-3 flex items-center gap-1.5 border-t border-[#262626] pt-3">
            <MapPin className="h-3.5 w-3.5 text-[#525252]" />
            <span className="text-xs text-[#737373]">{scrap.city}</span>
          </div>
        )}
      </div>
    </div>
  );
}
