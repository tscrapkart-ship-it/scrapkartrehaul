import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { Scrap } from "@/types";

const categoryColors: Record<string, string> = {
  Metal: "bg-blue-500/10 text-blue-400",
  "E-waste": "bg-purple-500/10 text-purple-400",
  Plastic: "bg-yellow-500/10 text-yellow-400",
  Paper: "bg-green-500/10 text-green-400",
  Glass: "bg-cyan-500/10 text-cyan-400",
  "Mixed Scrap": "bg-gray-500/10 text-gray-400",
};

export function ScrapCard({
  scrap,
  companyName,
}: {
  scrap: Scrap;
  companyName?: string | null;
}) {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[#002a47] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-accent/30 hover:shadow-lg hover:shadow-brand-accent/5">
      <div className="relative aspect-video bg-brand-dark">
        {scrap.images?.[0] ? (
          <Image
            src={scrap.images[0]}
            alt={scrap.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/20">
            No Image
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            categoryColors[scrap.category] ?? "bg-brand-accent/10 text-brand-accent"
          }`}
        >
          {scrap.category}
        </span>
        {scrap.status && scrap.status !== "available" && (
          <span className="absolute right-3 top-3 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium capitalize text-white/60 backdrop-blur-sm">
            {scrap.status}
          </span>
        )}
      </div>
      <CardContent className="pt-4">
        <h3 className="line-clamp-1 font-semibold text-white">
          {scrap.title}
        </h3>
        {companyName && (
          <p className="mt-0.5 text-xs text-white/40">{companyName}</p>
        )}
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-lg font-bold text-brand-accent">
            ₹{scrap.price.toLocaleString("en-IN")}
          </span>
          <span className="text-sm text-white/40">
            {scrap.quantity} {scrap.unit}
          </span>
        </div>
        {scrap.city && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-white/40">
            <MapPin className="h-3 w-3" />
            {scrap.city}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
