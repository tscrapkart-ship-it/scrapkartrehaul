import Link from "next/link";
import {
  ArrowLeftRight,
  IndianRupee,
  CalendarDays,
  ChevronRight,
  Package,
} from "lucide-react";

const statusConfig: Record<string, { dot: string; text: string; bg: string }> = {
  scheduled: {
    dot: "bg-blue-400",
    text: "text-blue-400",
    bg: "bg-blue-400/10 border border-blue-400/20",
  },
  in_progress: {
    dot: "bg-purple-400",
    text: "text-purple-400",
    bg: "bg-purple-400/10 border border-purple-400/20",
  },
  completed: {
    dot: "bg-[#10B981]",
    text: "text-[#10B981]",
    bg: "bg-[#10B981]/10 border border-[#10B981]/20",
  },
  cancelled: {
    dot: "bg-red-400",
    text: "text-red-400",
    bg: "bg-red-400/10 border border-red-400/20",
  },
};

const defaultStatus = {
  dot: "bg-[#525252]",
  text: "text-[#525252]",
  bg: "bg-[#1A1A1A] border border-[#262626]",
};

async function getTransactions() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { transactions: [], userId: "" };

  const { data } = await supabase
    .from("transactions")
    .select(`
      *,
      scraps(title, category, quantity, unit),
      producer:users!transactions_producer_id_fkey(name),
      recycler:users!transactions_recycler_id_fkey(name)
    `)
    .or(`producer_id.eq.${user.id},recycler_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  return { transactions: data ?? [], userId: user.id };
}

export default async function TransactionsPage() {
  const { transactions, userId } = await getTransactions();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        {/* Page Header */}
        <div className="animate-fade-in">
          <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
            Transactions
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">My Deals</h1>
          <p className="mt-2 text-sm text-[#737373] max-w-md">
            All confirmed transactions from accepted bids. Track status, pickup dates, and payment details.
          </p>
        </div>

        {/* Summary bar */}
        {transactions.length > 0 && (
          <div className="flex items-center gap-6 animate-slide-up delay-1">
            <div className="flex items-center gap-2 text-sm text-[#737373]">
              <div className="h-2 w-2 rounded-full bg-[#10B981]" />
              <span>{transactions.filter((t) => t.status === "completed").length} completed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#737373]">
              <div className="h-2 w-2 rounded-full bg-purple-400" />
              <span>{transactions.filter((t) => t.status === "in_progress").length} in progress</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#737373]">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <span>{transactions.filter((t) => t.status === "scheduled").length} scheduled</span>
            </div>
          </div>
        )}

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#262626] bg-[#141414] py-20 animate-fade-in delay-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A1A1A] border border-[#262626]">
              <ArrowLeftRight className="h-6 w-6 text-[#525252]" />
            </div>
            <p className="mt-4 text-base font-medium text-[#A3A3A3]">No deals yet</p>
            <p className="mt-1 text-sm text-[#525252]">
              Deals are created when a bid gets accepted.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, index) => {
              const isProducer = tx.producer_id === userId;
              const counterpart = isProducer
                ? (tx.recycler as { name: string } | null)?.name
                : (tx.producer as { name: string } | null)?.name;
              const scrap = tx.scraps as {
                title: string;
                category: string;
                quantity: number;
                unit: string;
              } | null;
              const status = statusConfig[tx.status] ?? defaultStatus;

              return (
                <Link
                  key={tx.id}
                  href={`/transactions/${tx.id}`}
                  className={`animate-slide-up delay-${Math.min(index + 1, 6)}`}
                  style={{ display: "block" }}
                >
                  <div className="group rounded-xl border border-[#262626] bg-[#141414] p-5 transition-all duration-200 hover:border-[#333] hover:bg-[#1A1A1A]">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: scrap info */}
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
                          <Package className="h-4.5 w-4.5 text-[#10B981]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="rounded-full bg-[#1A1A1A] border border-[#262626] px-2.5 py-0.5 text-xs font-medium text-[#A3A3A3]">
                              {scrap?.category}
                            </span>
                            <span className="text-xs text-[#525252]">
                              {isProducer ? "sold to" : "bought from"}{" "}
                              <span className="text-[#737373]">{counterpart}</span>
                            </span>
                          </div>
                          <p className="font-semibold text-white truncate group-hover:text-[#10B981] transition-colors">
                            {scrap?.title}
                          </p>
                          <p className="text-xs text-[#525252] mt-0.5">
                            {scrap?.quantity} {scrap?.unit}
                          </p>
                        </div>
                      </div>

                      {/* Right: status badge + arrow */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bg} ${status.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {tx.status.replace("_", " ")}
                        </span>
                        <ChevronRight className="h-4 w-4 text-[#333] group-hover:text-[#525252] transition-colors" />
                      </div>
                    </div>

                    {/* Bottom row: price + dates */}
                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-3.5 border-t border-[#1A1A1A]">
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="h-3.5 w-3.5 text-[#10B981]" />
                        <span className="font-bold text-[#10B981]">
                          {"\u20B9"}{tx.final_price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      {tx.pickup_date && (
                        <div className="flex items-center gap-1.5 text-xs text-[#525252]">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(tx.pickup_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      )}
                      <span className="text-xs text-[#333] ml-auto">
                        {new Date(tx.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
