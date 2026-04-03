"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight, ArrowLeft, Recycle, Shield } from "lucide-react";

const WASTE_TYPES = [
  "Metal",
  "E-waste",
  "Plastic",
  "Paper",
  "Glass",
  "Mixed Scrap",
  "Organic",
  "Hazardous",
];

const PROCESSING_TYPES = [
  "Shredding",
  "Melting / Smelting",
  "Pelletizing",
  "Manual Dismantling",
  "Chemical Processing",
  "Composting",
  "Sorting / Segregation",
  "Refurbishment",
];

const steps = ["Capabilities", "Compliance Docs"];

export default function RecyclerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wasteTypes, setWasteTypes] = useState<string[]>([]);
  const [processingTypes, setProcessingTypes] = useState<string[]>([]);

  const [form, setForm] = useState({
    service_radius_km: "50",
    min_quantity_kg: "0",
    max_quantity_kg: "",
    pricing_model: "negotiable",
    cpcb_license_url: "",
    epr_authorization_url: "",
    iso_certificate_url: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleItem(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  async function handleNext() {
    if (wasteTypes.length === 0) {
      setError("Please select at least one waste type you accept.");
      return;
    }
    setError(null);
    setStep(2);
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated"); setLoading(false); return; }

    // Upsert recycler profile
    const { error: profileError } = await supabase.from("recycler_profiles").upsert({
      user_id: user.id,
      waste_types_accepted: wasteTypes,
      service_radius_km: parseInt(form.service_radius_km) || 50,
      min_quantity_kg: parseFloat(form.min_quantity_kg) || 0,
      max_quantity_kg: form.max_quantity_kg ? parseFloat(form.max_quantity_kg) : null,
      processing_types: processingTypes,
      pricing_model: form.pricing_model as "fixed" | "negotiable" | "market_rate",
      cpcb_license_url: form.cpcb_license_url || null,
      epr_authorization_url: form.epr_authorization_url || null,
      iso_certificate_url: form.iso_certificate_url || null,
      verification_status: "pending",
    }, { onConflict: "user_id" });

    if (profileError) { setError(profileError.message); setLoading(false); return; }

    // Mark onboarding complete
    const { error: userError } = await supabase
      .from("users")
      .update({ onboarding_completed: true })
      .eq("id", user.id);

    if (userError) { setError(userError.message); setLoading(false); return; }

    router.push("/pending-approval");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10">
            <Recycle className="h-5 w-5 text-brand-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Recycler Onboarding</h1>
            <p className="text-sm text-white/40">Step {step} of {steps.length}</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mt-4">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  i + 1 < step
                    ? "bg-brand-accent text-brand-dark"
                    : i + 1 === step
                    ? "bg-brand-accent/20 border border-brand-accent text-brand-accent"
                    : "bg-white/[0.06] text-white/30"
                }`}
              >
                {i + 1 < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`text-xs ${i + 1 === step ? "text-white" : "text-white/30"}`}>{s}</span>
              {i < steps.length - 1 && (
                <div className={`h-px w-8 ${i + 1 < step ? "bg-brand-accent/50" : "bg-white/[0.06]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="border-[#262626] bg-[#141414]">
        <CardContent className="pt-6 space-y-6">
          {/* Step 1: Capabilities */}
          {step === 1 && (
            <>
              <div>
                <h3 className="font-medium text-white mb-1">Waste Types You Accept *</h3>
                <p className="text-sm text-white/40 mb-3">Select all material types you can process.</p>
                <div className="flex flex-wrap gap-2">
                  {WASTE_TYPES.map((type) => {
                    const sel = wasteTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleItem(wasteTypes, setWasteTypes, type)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                          sel
                            ? "bg-brand-accent text-brand-dark"
                            : "border border-[#262626] bg-[#1A1A1A] text-white/60 hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        {sel && <Check className="inline h-3 w-3 mr-1" />}
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-white mb-1">Processing Methods</h3>
                <p className="text-sm text-white/40 mb-3">What processing do you perform? (optional)</p>
                <div className="flex flex-wrap gap-2">
                  {PROCESSING_TYPES.map((type) => {
                    const sel = processingTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleItem(processingTypes, setProcessingTypes, type)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                          sel
                            ? "bg-brand-secondary/50 text-white border border-brand-accent/40"
                            : "border border-[#262626] bg-[#1A1A1A] text-white/50 hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/60">Service Radius (km)</Label>
                  <Input
                    name="service_radius_km"
                    type="number"
                    min="1"
                    value={form.service_radius_km}
                    onChange={handleChange}
                    className="border-[#262626] bg-[#1A1A1A] text-white focus-visible:ring-brand-accent/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">Pricing Model</Label>
                  <select
                    name="pricing_model"
                    value={form.pricing_model}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-[#262626] bg-[#1A1A1A] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
                  >
                    <option value="negotiable" className="bg-card">Negotiable</option>
                    <option value="market_rate" className="bg-card">Market Rate</option>
                    <option value="fixed" className="bg-card">Fixed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/60">Min Quantity (kg)</Label>
                  <Input
                    name="min_quantity_kg"
                    type="number"
                    min="0"
                    value={form.min_quantity_kg}
                    onChange={handleChange}
                    className="border-[#262626] bg-[#1A1A1A] text-white focus-visible:ring-brand-accent/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">Max Quantity (kg) <span className="text-white/30">optional</span></Label>
                  <Input
                    name="max_quantity_kg"
                    type="number"
                    min="0"
                    value={form.max_quantity_kg}
                    onChange={handleChange}
                    placeholder="No limit"
                    className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Compliance Docs */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 rounded-lg border border-brand-accent/20 bg-brand-accent/5 p-3">
                <Shield className="h-4 w-4 text-brand-accent shrink-0" />
                <p className="text-xs text-brand-accent/80">
                  Compliance docs are reviewed by our admin team. Upload URLs to your documents (Google Drive, etc.) or paste direct links. All fields are optional but help speed up verification.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-white/60">CPCB License URL <span className="text-white/30">(optional)</span></Label>
                <Input
                  name="cpcb_license_url"
                  value={form.cpcb_license_url}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                  className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                />
                <p className="text-xs text-white/30">Central Pollution Control Board authorization</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white/60">EPR Authorization URL <span className="text-white/30">(optional)</span></Label>
                <Input
                  name="epr_authorization_url"
                  value={form.epr_authorization_url}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                  className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                />
                <p className="text-xs text-white/30">Extended Producer Responsibility authorization</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white/60">ISO Certificate URL <span className="text-white/30">(optional)</span></Label>
                <Input
                  name="iso_certificate_url"
                  value={form.iso_certificate_url}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                  className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                />
                <p className="text-xs text-white/30">ISO 14001 or relevant certification</p>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => { setError(null); setStep(step - 1); }}
            className="border-[#262626] text-white/60 hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}

        {step < steps.length ? (
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-[#059669] to-[#10B981] text-white font-semibold hover:from-[#047857] hover:to-[#34D399]"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#059669] to-[#10B981] text-white font-semibold hover:from-[#047857] hover:to-[#34D399] disabled:opacity-40"
          >
            {loading ? "Saving..." : "Complete Setup"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
