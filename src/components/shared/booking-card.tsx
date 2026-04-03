import { Badge } from "@/components/ui/badge";
import { ChevronRight, Calendar } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
  collected: "bg-[#1A1A1A] text-[#737373] border-[#262626]",
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

export function BookingCard({
  booking,
  counterpartyName,
  role,
}: BookingCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-[#262626] bg-[#141414] p-5 transition-all duration-300 hover:border-[#10B981]/20 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.08)]">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-[#F5F5F5] group-hover:text-white transition-colors">
            {booking.scraps?.title ?? "Scrap Item"}
          </h3>
          {counterpartyName && (
            <p className="mt-0.5 text-sm text-[#737373]">
              {role === "buyer" ? "Seller" : "Buyer"}: {counterpartyName}
            </p>
          )}
          {booking.scraps?.price && (
            <p className="mt-1.5 text-base font-bold text-[#10B981]">
              ₹{booking.scraps.price.toLocaleString("en-IN")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2.5 shrink-0 ml-4">
          <Badge
            className={`border capitalize ${
              statusColors[booking.status] ??
              "bg-[#1A1A1A] text-[#737373] border-[#262626]"
            }`}
          >
            {booking.status}
          </Badge>
          <ChevronRight className="h-4 w-4 text-[#525252] group-hover:text-[#10B981] transition-colors" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 border-t border-[#262626] pt-3">
        <Calendar className="h-3.5 w-3.5 text-[#525252]" />
        <span className="text-xs text-[#737373]">
          {new Date(booking.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
