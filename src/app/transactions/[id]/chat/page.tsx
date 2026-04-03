import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChatInterface } from "@/components/shared/chat-interface";
import { ChevronLeft, MessageCircle } from "lucide-react";

export default async function TransactionChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tx } = await supabase
    .from("transactions")
    .select("*, scraps(title), producer:users!transactions_producer_id_fkey(name), recycler:users!transactions_recycler_id_fkey(name)")
    .eq("id", id)
    .single();

  if (!tx) notFound();

  const isProducer = user.id === tx.producer_id;
  const isRecycler = user.id === tx.recycler_id;

  if (!isProducer && !isRecycler) redirect("/transactions");

  const otherUserId = isProducer ? tx.recycler_id : tx.producer_id;
  const otherName = isProducer
    ? (tx.recycler as { name: string } | null)?.name
    : (tx.producer as { name: string } | null)?.name;
  const scrapTitle = (tx.scraps as { title: string } | null)?.title;

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/transactions/${id}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#262626] text-white/40 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent/10">
              <MessageCircle className="h-4 w-4 text-brand-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{otherName ?? "Counterpart"}</p>
              <p className="text-xs text-white/40 truncate max-w-[200px]">{scrapTitle}</p>
            </div>
          </div>
        </div>

        <ChatInterface
          transactionId={id}
          currentUserId={user.id}
          otherUserId={otherUserId}
        />
      </div>
    </div>
  );
}
