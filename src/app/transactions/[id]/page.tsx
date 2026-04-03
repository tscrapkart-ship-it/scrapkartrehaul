"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  User,
  CalendarDays,
  IndianRupee,
  ShieldCheck,
  MessageCircle,
  Loader2,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  in_progress: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  completed: "bg-green-500/10 text-green-400 border border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
};

interface TransactionDetail {
  id: string;
  listing_id: string;
  producer_id: string;
  recycler_id: string;
  final_price: number;
  final_quantity_kg: number | null;
  pickup_date: string | null;
  pickup_otp: string | null;
  otp_verified_at: string | null;
  status: string;
  created_at: string;
  scraps: { title: string; category: string; quantity: number; unit: string } | null;
  producer: { name: string; email: string } | null;
  recycler: { name: string; email: string } | null;
}

export default function TransactionDetailPage() {
  const params = useParams();
  const [tx, setTx] = useState<TransactionDetail | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpInput, setOtpInput] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      const { data } = await supabase
        .from("transactions")
        .select(`
          *,
          scraps(title, category, quantity, unit),
          producer:users!transactions_producer_id_fkey(name, email),
          recycler:users!transactions_recycler_id_fkey(name, email)
        `)
        .eq("id", params.id as string)
        .single();

      setTx(data as TransactionDetail);
      setLoading(false);
    }
    load();
  }, [params.id]);

  async function handleVerifyOtp() {
    if (!tx || !otpInput.trim()) return;
    setOtpLoading(true);

    if (otpInput.trim() !== tx.pickup_otp) {
      toast.error("Invalid OTP. Please check with the producer.");
      setOtpLoading(false);
      return;
    }

    const supabase = createClient();
    await supabase
      .from("transactions")
      .update({
        otp_verified_at: new Date().toISOString(),
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", tx.id);

    await supabase
      .from("scraps")
      .update({ status: "completed" })
      .eq("id", tx.listing_id);

    toast.success("OTP verified! Deal marked as completed.");
    setTx({ ...tx, otp_verified_at: new Date().toISOString(), status: "completed" });
    setOtpLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen bg-brand-dark">
        <Loader2 className="h-6 w-6 animate-spin text-brand-accent" />
        <span className="ml-2 text-white/40">Loading deal...</span>
      </div>
    );
  }

  if (!tx) return <div className="text-center py-20 text-white/40 bg-brand-dark min-h-screen">Deal not found.</div>;

  const isProducer = userId === tx.producer_id;
  const isRecycler = userId === tx.recycler_id;
  const counterpart = isProducer ? tx.recycler : tx.producer;
  const counterpartLabel = isProducer ? "Recycler" : "Producer";

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-white/40">
          <Link href="/transactions" className="hover:text-brand-accent transition-colors">Deals</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white/60">Deal Details</span>
        </nav>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Deal Details</h1>
          <Badge className={statusConfig[tx.status] ?? "bg-white/[0.06] text-white/40"}>
            {tx.status.replace("_", " ")}
          </Badge>
        </div>

        {/* Main info card */}
        <Card className="border-[#262626] bg-[#141414]">
          <CardContent className="pt-6 space-y-5">
            {/* Listing */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10">
                <Package className="h-4 w-4 text-brand-accent" />
              </div>
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-white/30">Scrap Item</h3>
                <p className="mt-1 font-semibold text-white">{tx.scraps?.title}</p>
                <p className="text-sm text-white/50">
                  {tx.scraps?.category} — {tx.scraps?.quantity} {tx.scraps?.unit}
                </p>
              </div>
            </div>

            <div className="border-t border-[#262626]" />

            {/* Price */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10">
                <IndianRupee className="h-4 w-4 text-brand-accent" />
              </div>
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-white/30">Agreed Price</h3>
                <p className="mt-1 text-2xl font-bold text-brand-accent">
                  ₹{tx.final_price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="border-t border-[#262626]" />

            {/* Counterpart */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/20">
                <User className="h-4 w-4 text-brand-accent" />
              </div>
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-white/30">{counterpartLabel}</h3>
                <p className="mt-1 font-medium text-white">{counterpart?.name}</p>
                <p className="text-sm text-white/40">{counterpart?.email}</p>
              </div>
            </div>

            {tx.pickup_date && (
              <>
                <div className="border-t border-[#262626]" />
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                    <CalendarDays className="h-4 w-4 text-white/40" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-wider text-white/30">Pickup Date</h3>
                    <p className="mt-1 text-white/80">
                      {new Date(tx.pickup_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* OTP Section */}
        {tx.status !== "completed" && tx.status !== "cancelled" && (
          <Card className="border-[#262626] bg-[#141414]">
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-accent" />
                <h3 className="font-semibold text-white">Pickup OTP</h3>
              </div>

              {isProducer && tx.pickup_otp && (
                <div>
                  <p className="text-sm text-white/50 mb-3">
                    Share this OTP with the recycler at the time of pickup. They&apos;ll use it to confirm collection.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-xl border border-brand-accent/20 bg-brand-accent/5 px-5 py-3 text-center">
                      <p className="text-2xl font-mono font-bold tracking-[0.3em] text-brand-accent">
                        {showOtp ? tx.pickup_otp : "• • • • • •"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowOtp(!showOtp)}
                      className="border-[#262626] text-white/60 hover:bg-white/[0.06]"
                    >
                      {showOtp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {isRecycler && (
                <div>
                  <p className="text-sm text-white/50 mb-3">
                    Ask the producer for the 6-digit OTP. Enter it below to confirm pickup and complete the deal.
                  </p>
                  <div className="flex gap-3">
                    <Input
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50 text-center font-mono text-lg tracking-widest"
                    />
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={otpInput.length !== 6 || otpLoading}
                      className="bg-brand-accent text-brand-dark font-semibold hover:bg-brand-accent/90 disabled:opacity-40"
                    >
                      {otpLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                    </Button>
                  </div>
                </div>
              )}

              {tx.otp_verified_at && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <ShieldCheck className="h-4 w-4" />
                  Pickup confirmed on{" "}
                  {new Date(tx.otp_verified_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Chat button */}
        <Link href={`/transactions/${tx.id}/chat`}>
          <Button className="w-full bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold">
            <MessageCircle className="mr-2 h-4 w-4" />
            Open Chat
          </Button>
        </Link>
      </div>
    </div>
  );
}
