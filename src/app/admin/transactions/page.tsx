import { ArrowLeftRight } from "lucide-react";

const statusColor: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-400",
  in_progress: "bg-purple-500/10 text-purple-400",
  completed: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

async function getTransactions() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data } = await supabase
    .from("transactions")
    .select(`
      *,
      scraps(title, category),
      producer:users!transactions_producer_id_fkey(name),
      recycler:users!transactions_recycler_id_fkey(name)
    `)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminTransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Deals / Transactions</h1>
        <p className="mt-1 text-sm text-white/40">All confirmed deals created from accepted bids</p>
      </div>

      <div className="rounded-xl border border-[#262626] bg-card overflow-hidden">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <ArrowLeftRight className="h-8 w-8 text-white/20" />
            <p className="text-sm text-white/40">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#262626]">
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Listing</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Producer</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Recycler</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Price</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Pickup</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {transactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-white truncate max-w-[180px]">{tx.scraps?.title ?? "—"}</p>
                      <p className="text-xs text-white/40">{tx.scraps?.category}</p>
                    </td>
                    <td className="px-5 py-4 text-white/70">{tx.producer?.name ?? "—"}</td>
                    <td className="px-5 py-4 text-white/70">{tx.recycler?.name ?? "—"}</td>
                    <td className="px-5 py-4 font-semibold text-brand-accent">
                      ₹{tx.final_price?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-4 text-white/40">
                      {tx.pickup_date
                        ? new Date(tx.pickup_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[tx.status] ?? "bg-white/10 text-white/50"}`}>
                        {tx.status?.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-white/20">{transactions.length} transaction{transactions.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
