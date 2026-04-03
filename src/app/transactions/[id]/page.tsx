"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
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
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<string, { dot: string; text: string; bg: string; label: string }> = {
  scheduled: {
    dot: "bg-blue-400",
    text: "text-blue-400",
    bg: "bg-blue-400/10 border border-blue-400/20",
    label: "Scheduled",
  },
  in_progress: {
    dot: "bg-purple-400",
    text: "text-purple-400",
    bg: "bg-purple-400/10 border border-purple-400/20",
    label: "In Progress",
  },
  completed: {
    dot: "bg-[#10B981]",
    text: "text-[#10B981]",
    bg: "bg-[#10B981]/10 border border-[#10B981]/20",
    label: "Completed",
  },
  cancelled: {
    dot: "bg-red-400",
    text: "text-red-400",
    bg: "bg-red-400/10 border border-red-400/20",
    label: "Cancelled",
  },
};

const defaultStatus = {
  dot: "bg-[#525252]",
  text: "text-[#525252]",
  bg: "bg-[#1A1A1A] border border-[#262626]",
  label: "Unknown",
};

// Timeline steps
const timelineSteps = [
  { key: "scheduled", label: "Scheduled", icon: Clock },
  { key: "in_progress", label: "In Progress", icon: Truck },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
];

function getStepState(stepKey: string, currentStatus: string) {
  const order = ["scheduled", "in_progress", "completed"];
  const currentIdx = order.indexOf(currentStatus);
  const stepIdx = order.indexOf(stepKey);

  if (currentStatus === "cancelled") return "cancelled";
  if (stepIdx < currentIdx) return "done";
  if (stepIdx === currentIdx) return "active";
  return "upcoming";
}

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
      <div className="flex flex-col items-center justify-center py-32 min-h-screen bg-[#0A0A0A]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#141414] border border-[#262626]">
          <Loader2 className="h-5 w-5 animate-spin text-[#10B981]" />
        </div>
        <span className="mt-3 text-base text-[#525252]">Loading deal...</span>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="flex flex-col items-center justify-center py-32 min-h-screen bg-[#0A0A0A]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#141414] border border-[#262626]">
          <XCircle className="h-6 w-6 text-[#525252]" />
        </div>
        <p className="mt-4 text-base text-[#737373]">Deal not found</p>
        <Link href="/transactions" className="mt-3 text-sm text-[#10B981] hover:underline">
          Back to deals
        </Link>
      </div>
    );
  }

  const isProducer = userId === tx.producer_id;
  const isRecycler = userId === tx.recycler_id;
  const counterpart = isProducer ? tx.recycler : tx.producer;
  const counterpartLabel = isProducer ? "Recycler" : "Producer";
  const status = statusConfig[tx.status] ?? defaultStatus;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-base text-[#525252] animate-fade-in">
          <Link href="/transactions" className="flex items-center gap-1 hover:text-[#10B981] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Deals
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#737373]">Deal Details</span>
        </nav>

        {/* Page header */}
        <div className="flex items-center justify-between animate-slide-up delay-1">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
              Transaction
            </p>
            <h1 className="mt-1 text-3xl font-bold text-white">Deal Details</h1>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${status.bg} ${status.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Status Timeline */}
        {tx.status !== "cancelled" && (
          <div className="rounded-xl border border-[#262626] bg-[#141414] p-5 animate-slide-up delay-2">
            <p className="text-xs font-medium uppercase tracking-widest text-[#525252] mb-4">
              Progress
            </p>
            <div className="flex items-center justify-between">
              {timelineSteps.map((step, i) => {
                const state = getStepState(step.key, tx.status);
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                          state === "done"
                            ? "bg-[#10B981] text-black"
                            : state === "active"
                            ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 ring-4 ring-[#10B981]/10"
                            : "bg-[#1A1A1A] text-[#525252] border border-[#262626]"
                        }`}
                      >
                        {state === "done" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          state === "done" || state === "active"
                            ? "text-[#A3A3A3]"
                            : "text-[#525252]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < timelineSteps.length - 1 && (
                      <div className="flex-1 mx-2 mb-5">
                        <div
                          className={`h-0.5 rounded-full ${
                            getStepState(timelineSteps[i + 1].key, tx.status) === "done" ||
                            getStepState(timelineSteps[i + 1].key, tx.status) === "active"
                              ? "bg-[#10B981]"
                              : "bg-[#262626]"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main info cards */}
        <div className="grid gap-4 animate-slide-up delay-3">
          {/* Scrap Item card */}
          <div className="rounded-xl border border-[#262626] bg-[#141414] p-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
                <Package className="h-4.5 w-4.5 text-[#10B981]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">Scrap Item</p>
                <p className="mt-1.5 font-semibold text-white">{tx.scraps?.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full bg-[#1A1A1A] border border-[#262626] px-2 py-0.5 text-xs text-[#A3A3A3]">
                    {tx.scraps?.category}
                  </span>
                  <span className="text-xs text-[#525252]">
                    {tx.scraps?.quantity} {tx.scraps?.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price + Counterpart row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Agreed Price */}
            <div className="rounded-xl border border-[#262626] bg-[#141414] p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
                  <IndianRupee className="h-4.5 w-4.5 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">Agreed Price</p>
                  <p className="mt-1.5 text-3xl font-bold text-[#10B981]">
                    {"\u20B9"}{tx.final_price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Counterpart */}
            <div className="rounded-xl border border-[#262626] bg-[#141414] p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <User className="h-4.5 w-4.5 text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">{counterpartLabel}</p>
                  <p className="mt-1.5 font-medium text-white truncate">{counterpart?.name}</p>
                  <p className="text-xs text-[#525252] truncate">{counterpart?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Date */}
          {tx.pickup_date && (
            <div className="rounded-xl border border-[#262626] bg-[#141414] p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1A1A1A] border border-[#262626]">
                  <CalendarDays className="h-4.5 w-4.5 text-[#737373]" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">Pickup Date</p>
                  <p className="mt-1.5 font-medium text-white">
                    {new Date(tx.pickup_date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* OTP Section */}
        {tx.status !== "completed" && tx.status !== "cancelled" && (
          <div className="rounded-xl border border-[#262626] bg-[#141414] p-5 space-y-4 animate-slide-up delay-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981]/10">
                <ShieldCheck className="h-4 w-4 text-[#10B981]" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Pickup Verification</h3>
                <p className="text-sm text-[#525252]">OTP-based confirmation</p>
              </div>
            </div>

            {isProducer && tx.pickup_otp && (
              <div className="space-y-3">
                <p className="text-base text-[#737373]">
                  Share this OTP with the recycler at pickup. They will use it to confirm collection.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-xl border border-[#10B981]/20 bg-[#10B981]/5 px-5 py-4 text-center">
                    <p className="text-2xl font-mono font-bold tracking-[0.3em] text-[#10B981]">
                      {showOtp ? tx.pickup_otp : "\u2022 \u2022 \u2022 \u2022 \u2022 \u2022"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOtp(!showOtp)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#262626] bg-[#1A1A1A] text-[#737373] hover:bg-[#262626] hover:text-white transition-all"
                  >
                    {showOtp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {isRecycler && (
              <div className="space-y-3">
                <p className="text-base text-[#737373]">
                  Ask the producer for the 6-digit OTP. Enter it below to confirm pickup and complete the deal.
                </p>
                <div className="flex gap-3">
                  <input
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="h-11 flex-1 rounded-xl border border-[#262626] bg-[#0A0A0A] px-4 text-center font-mono text-lg tracking-widest text-white placeholder:text-[#525252] outline-none transition-colors focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/20"
                  />
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={otpInput.length !== 6 || otpLoading}
                    className="h-11 bg-[#10B981] text-black font-semibold hover:bg-[#059669] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {otpLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                  </Button>
                </div>
              </div>
            )}

            {tx.otp_verified_at && (
              <div className="flex items-center gap-2 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 px-3 py-2.5 text-base text-[#10B981]">
                <ShieldCheck className="h-4 w-4" />
                Pickup confirmed on{" "}
                {new Date(tx.otp_verified_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            )}
          </div>
        )}

        {/* Completed OTP confirmation (shown when deal is completed) */}
        {tx.status === "completed" && tx.otp_verified_at && (
          <div className="rounded-xl border border-[#10B981]/20 bg-[#10B981]/5 p-4 animate-slide-up delay-4">
            <div className="flex items-center gap-2.5 text-base text-[#10B981]">
              <ShieldCheck className="h-4.5 w-4.5" />
              <span className="font-medium">
                Pickup verified on{" "}
                {new Date(tx.otp_verified_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        )}

        {/* Chat button */}
        <div className="animate-slide-up delay-5">
          <Link href={`/transactions/${tx.id}/chat`}>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] px-5 py-3 text-base font-semibold text-black transition-all hover:bg-[#059669] active:scale-[0.98] shadow-lg shadow-[#10B981]/20">
              <MessageCircle className="h-4 w-4" />
              Open Chat
            </button>
          </Link>
        </div>

        {/* Transaction metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[#333] pt-2 animate-fade-in delay-6">
          <span className="break-all">Transaction ID: {tx.id.slice(0, 8)}...</span>
          <span>
            Created{" "}
            {new Date(tx.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
