"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, Mail, Phone, MapPin, ArrowLeft, Check, Send } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      message: form.message,
      status: "new",
    });
    setLoading(false);
    if (!error) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="animate-fade-in max-w-md w-full text-center space-y-6">
          <div className="animate-scale-in mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#10B981]/20 bg-[#10B981]/10">
            <CheckCircle className="h-10 w-10 text-[#10B981]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Message Sent!</h2>
            <p className="text-[#737373] text-base leading-relaxed">
              Thanks for reaching out. Our team will get back to you within 24 hours.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-2 text-[#10B981] hover:text-[#34D399] text-base font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-grid-pattern">
      {/* Top bar */}
      <div className="border-b border-[#262626]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#737373] hover:text-white text-base transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </div>

      <div className="animate-fade-in mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Header */}
        <div className="mb-14 animate-slide-up">
          <p className="text-xs font-medium uppercase tracking-widest text-[#525252] mb-3">
            Contact Us
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Get in Touch
          </h1>
          <p className="mt-4 text-[#737373] max-w-lg text-lg leading-relaxed">
            Have a question or want to partner with ScrapKart? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          {/* Left info section */}
          <div className="space-y-6 animate-slide-up delay-1">
            <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
              Reach Out
            </p>

            {/* Email card */}
            <div className="group rounded-xl border border-[#262626] bg-[#141414] p-5 transition-all duration-300 hover:border-[#333] hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10">
                  <Mail className="h-5 w-5 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-xs text-[#525252] mb-1 font-medium uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-white font-medium">support@scrapkart.in</p>
                </div>
              </div>
            </div>

            {/* Phone card */}
            <div className="group rounded-xl border border-[#262626] bg-[#141414] p-5 transition-all duration-300 hover:border-[#333] hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10">
                  <Phone className="h-5 w-5 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-xs text-[#525252] mb-1 font-medium uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="text-white font-medium">+91 98765 43210</p>
                </div>
              </div>
            </div>

            {/* Location card */}
            <div className="group rounded-xl border border-[#262626] bg-[#141414] p-5 transition-all duration-300 hover:border-[#333] hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10">
                  <MapPin className="h-5 w-5 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-xs text-[#525252] mb-1 font-medium uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-white font-medium">Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>

            {/* Why ScrapKart box */}
            <div className="rounded-xl border border-[#262626] bg-[#141414] p-6 space-y-4 animate-slide-up delay-2">
              <h3 className="font-semibold text-white text-base">Why ScrapKart?</h3>
              <ul className="space-y-3">
                {[
                  "Verified recycler network across India",
                  "Competitive bidding — get the best price",
                  "Compliance-first (CPCB, EPR certified partners)",
                  "End-to-end pickup tracking with OTP verification",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-[#A3A3A3]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10">
                      <Check className="h-3 w-3 text-green-400" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="animate-slide-up delay-2">
            <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Send a Message</h2>
                <p className="text-base text-[#525252] mt-1">Fill in the details below and we&apos;ll respond promptly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-base font-medium text-[#A3A3A3]">
                      Name <span className="text-[#10B981]">*</span>
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Your full name"
                      required
                      className="h-11 w-full rounded-xl border border-[#262626] bg-[#0A0A0A] px-4 text-base text-white placeholder:text-[#525252] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-base font-medium text-[#A3A3A3]">
                      Email <span className="text-[#10B981]">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="h-11 w-full rounded-xl border border-[#262626] bg-[#0A0A0A] px-4 text-base text-white placeholder:text-[#525252] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-base font-medium text-[#A3A3A3]">Phone</label>
                    <input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="h-11 w-full rounded-xl border border-[#262626] bg-[#0A0A0A] px-4 text-base text-white placeholder:text-[#525252] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-base font-medium text-[#A3A3A3]">Subject</label>
                    <input
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                      placeholder="How can we help?"
                      className="h-11 w-full rounded-xl border border-[#262626] bg-[#0A0A0A] px-4 text-base text-white placeholder:text-[#525252] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-[#A3A3A3]">
                    Message <span className="text-[#10B981]">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us more about your requirement..."
                    rows={5}
                    required
                    className="w-full rounded-xl border border-[#262626] bg-[#0A0A0A] px-4 py-3 text-sm text-white placeholder:text-[#525252] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-xl bg-[#10B981] text-black font-semibold text-base transition-all duration-300 hover:bg-[#059669] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
