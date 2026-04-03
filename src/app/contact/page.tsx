"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, Mail, Phone, MapPin } from "lucide-react";
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
      <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Message Sent!</h2>
          <p className="text-white/50">
            Thanks for reaching out. Our team will get back to you within 24 hours.
          </p>
          <Link href="/" className="inline-block mt-2 text-brand-accent hover:text-brand-accent/80 text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">Get in Touch</h1>
          <p className="mt-3 text-white/50">Have a question or want to partner with ScrapKart? We'd love to hear from you.</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10">
                    <Mail className="h-4 w-4 text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Email</p>
                    <p className="text-white/80">support@scrapkart.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10">
                    <Phone className="h-4 w-4 text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Phone</p>
                    <p className="text-white/80">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10">
                    <MapPin className="h-4 w-4 text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Location</p>
                    <p className="text-white/80">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#262626] bg-card p-5 space-y-3">
              <h3 className="font-semibold text-white text-sm">Why ScrapKart?</h3>
              <ul className="space-y-2 text-sm text-white/50">
                <li>✓ Verified recycler network across India</li>
                <li>✓ Competitive bidding — get the best price</li>
                <li>✓ Compliance-first (CPCB, EPR certified partners)</li>
                <li>✓ End-to-end pickup tracking with OTP verification</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/70">Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                  required
                  className="bg-card border-[#262626] text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="bg-card border-[#262626] text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/70">Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="bg-card border-[#262626] text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Subject</Label>
                <Input
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="How can we help?"
                  className="bg-card border-[#262626] text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">Message *</Label>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell us more about your requirement..."
                rows={5}
                required
                className="w-full rounded-md border border-[#262626] bg-card px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/50 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold w-full sm:w-auto px-8"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
