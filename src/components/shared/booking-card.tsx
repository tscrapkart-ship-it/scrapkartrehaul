import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Calendar } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  collected: "bg-white/[0.06] text-white/40 border-white/10",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface BookingCardProps {
  booking: {
    id: string;
    status: string;
    created_at: string;
    scraps?: { title: string; category: string; price: number } | null;
  };
  counterpartyName?: string;
  role: "buyer" | "seller";
}

export function BookingCard({ booking, counterpartyName, role }: BookingCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#002a47] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-accent/30 hover:shadow-lg hover:shadow-brand-accent/5">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-white">
              {booking.scraps?.title ?? "Scrap Item"}
            </h3>
            {counterpartyName && (
              <p className="mt-0.5 text-sm text-white/40">
                {role === "buyer" ? "Seller" : "Buyer"}: {counterpartyName}
              </p>
            )}
            {booking.scraps?.price && (
              <p className="mt-1 text-sm font-medium text-brand-accent">
                ₹{booking.scraps.price.toLocaleString("en-IN")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`border capitalize ${
                statusColors[booking.status] ?? "bg-white/[0.06] text-white/40 border-white/10"
              }`}
            >
              {booking.status}
            </Badge>
            <ChevronRight className="h-4 w-4 text-white/20" />
          </div>
        </div>
        <p className="mt-2 flex items-center gap-1 text-xs text-white/40">
          <Calendar className="h-3 w-3" />
          {new Date(booking.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </CardContent>
    </Card>
  );
}
