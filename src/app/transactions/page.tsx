import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, IndianRupee, CalendarDays, ArrowRight } from "lucide-react";

const statusConfig: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  in_progress: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  completed: "bg-green-500/10 text-green-400 border border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
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
    <div className="mx-auto max-w-4xl py-8 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Deals</h1>
        <p className="mt-1 text-sm text-white/40">
          All confirmed transactions — accepted bids that turned into deals
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.06] bg-[#002a47] py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] mb-3">
            <ArrowLeftRight className="h-6 w-6 text-white/30" />
          </div>
          <p className="text-lg font-medium text-white/60">No deals yet</p>
          <p className="text-sm text-white/30 mt-1">
            Deals are created when a bid gets accepted.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
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

            return (
              <Link key={tx.id} href={`/transactions/${tx.id}`}>
                <Card className="border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all cursor-pointer">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded-full bg-brand-accent/10 px-2.5 py-0.5 text-xs font-medium text-brand-accent">
                            {scrap?.category}
                          </span>
                          <span className="text-xs text-white/30">
                            {isProducer ? "sold to" : "bought from"}{" "}
                            <span className="text-white/50">{counterpart}</span>
                          </span>
                        </div>
                        <p className="font-semibold text-white truncate">{scrap?.title}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge className={statusConfig[tx.status] ?? "bg-white/[0.06] text-white/40"}>
                          {tx.status.replace("_", " ")}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-white/20" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-white/[0.04]">
                      <div className="flex items-center gap-1 text-brand-accent">
                        <IndianRupee className="h-3.5 w-3.5" />
                        <span className="font-bold">
                          ₹{tx.final_price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      {tx.pickup_date && (
                        <div className="flex items-center gap-1 text-xs text-white/40">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(tx.pickup_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      )}
                      <span className="text-xs text-white/25 ml-auto">
                        {new Date(tx.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
