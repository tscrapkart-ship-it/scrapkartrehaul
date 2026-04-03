"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight, ArrowLeft, Recycle, Shield, Cog, FileCheck } from "lucide-react";

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

const steps = [
  { label: "Capabilities", icon: Cog },
  { label: "Compliance Docs", icon: FileCheck },
];

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

    router.push("/marketplace");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slide-up delay-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
            <Recycle className="h-5 w-5 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Recycler Onboarding</h1>
            <p className="text-sm text-[#525252]">Tell us about your processing capabilities</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 w-full">
          {steps.map((s, i) => {
            const StepIcon = s.icon;
            const isComplete = i + 1 < step;
            const isCurrent = i + 1 === step;

            return (
              <div key={s.label} className="flex items-center gap-1 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                      isComplete
                        ? "bg-[#10B981] text-black"
                        : isCurrent
                        ? "bg-[#10B981]/15 border border-[#10B981]/50 text-[#10B981]"
                        : "bg-[#1A1A1A] border border-[#262626] text-[#525252]"
                    }`}
                  >
                    {isComplete ? <Check className="h-4 w-4" /> : <StepIcon className="h-3.5 w-3.5" />}
                  </div>
                  <span className={`text-xs font-medium truncate ${
                    isCurrent ? "text-white" : isComplete ? "text-[#A3A3A3]" : "text-[#525252]"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 mx-2 transition-colors ${isComplete ? "bg-[#10B981]/40" : "bg-[#262626]"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-[#262626] bg-[#141414] overflow-hidden animate-slide-up delay-2">
        <div className="p-6 space-y-6">

          {/* Step 1: Capabilities */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Waste Types */}
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[#525252] mb-3">
                  Materials Accepted
                </p>
                <h3 className="font-semibold text-white text-lg mb-1">Waste Types You Accept <span className="text-[#10B981]">*</span></h3>
                <p className="text-base text-[#737373] mb-4">Select all material types you can process.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WASTE_TYPES.map((type) => {
                    const sel = wasteTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleItem(wasteTypes, setWasteTypes, type)}
                        className={`flex items-center gap-2.5 rounded-lg px-4 py-3 text-base font-medium transition-all text-left ${
                          sel
                            ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 ring-1 ring-[#10B981]/20"
                            : "border border-[#262626] bg-[#0A0A0A] text-[#A3A3A3] hover:bg-[#1A1A1A] hover:border-[#333] hover:text-white"
                        }`}
                      >
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded transition-all ${
                          sel
                            ? "bg-[#10B981] text-black"
                            : "border border-[#333] bg-transparent"
                        }`}>
                          {sel && <Check className="h-3 w-3" />}
                        </div>
                        {type}
                      </button>
                    );
                  })}
                </div>
                {wasteTypes.length > 0 && (
                  <p className="text-xs text-[#10B981]/70 font-medium mt-2">
                    {wasteTypes.length} type{wasteTypes.length === 1 ? "" : "s"} selected
                  </p>
                )}
              </div>

              <div className="h-px bg-[#262626]" />

              {/* Processing Methods */}
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[#525252] mb-3">
                  Processing Capabilities
                </p>
                <h3 className="font-semibold text-white text-lg mb-1">Processing Methods</h3>
                <p className="text-base text-[#737373] mb-4">What processing do you perform? (optional)</p>
                <div className="flex flex-wrap gap-2">
                  {PROCESSING_TYPES.map((type) => {
                    const sel = processingTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleItem(processingTypes, setProcessingTypes, type)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                          sel
                            ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
                            : "border border-[#262626] bg-[#0A0A0A] text-[#737373] hover:bg-[#1A1A1A] hover:border-[#333] hover:text-white"
                        }`}
                      >
                        {sel && <Check className="inline h-3 w-3 mr-1" />}
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-[#262626]" />

              {/* Operational Details */}
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[#525252] mb-4">
                  Operational Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#A3A3A3] text-base">Service Radius (km)</Label>
                    <Input
                      name="service_radius_km"
                      type="number"
                      min="1"
                      value={form.service_radius_km}
                      onChange={handleChange}
                      className="h-11 border-[#262626] bg-[#0A0A0A] text-white focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#A3A3A3] text-base">Pricing Model</Label>
                    <select
                      name="pricing_model"
                      value={form.pricing_model}
                      onChange={handleChange}
                      className="flex h-11 w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                    >
                      <option value="negotiable" className="bg-[#141414]">Negotiable</option>
                      <option value="market_rate" className="bg-[#141414]">Market Rate</option>
                      <option value="fixed" className="bg-[#141414]">Fixed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-[#A3A3A3] text-base">Min Quantity (kg)</Label>
                    <Input
                      name="min_quantity_kg"
                      type="number"
                      min="0"
                      value={form.min_quantity_kg}
                      onChange={handleChange}
                      className="h-11 border-[#262626] bg-[#0A0A0A] text-white focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#A3A3A3] text-base">Max Quantity (kg) <span className="text-[#525252] text-xs font-normal">optional</span></Label>
                    <Input
                      name="max_quantity_kg"
                      type="number"
                      min="0"
                      value={form.max_quantity_kg}
                      onChange={handleChange}
                      placeholder="No limit"
                      className="h-11 border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Compliance Docs */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
                Compliance Documents
              </p>

              <div className="flex items-start gap-3 rounded-lg border border-[#10B981]/20 bg-[#10B981]/5 p-4">
                <Shield className="h-5 w-5 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <p className="text-base text-[#10B981] font-medium mb-1">Verification speeds up approval</p>
                  <p className="text-sm text-[#737373] leading-relaxed">
                    Upload URLs to your documents (Google Drive, etc.) or paste direct links. All fields are optional but help speed up verification.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[#A3A3A3] text-base">CPCB License URL <span className="text-[#525252] text-xs font-normal">(optional)</span></Label>
                  <Input
                    name="cpcb_license_url"
                    value={form.cpcb_license_url}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/..."
                    className="h-11 border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                  />
                  <p className="text-xs text-[#525252]">Central Pollution Control Board authorization</p>
                </div>

                <div className="h-px bg-[#1A1A1A]" />

                <div className="space-y-2">
                  <Label className="text-[#A3A3A3] text-base">EPR Authorization URL <span className="text-[#525252] text-xs font-normal">(optional)</span></Label>
                  <Input
                    name="epr_authorization_url"
                    value={form.epr_authorization_url}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/..."
                    className="h-11 border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                  />
                  <p className="text-xs text-[#525252]">Extended Producer Responsibility authorization</p>
                </div>

                <div className="h-px bg-[#1A1A1A]" />

                <div className="space-y-2">
                  <Label className="text-[#A3A3A3] text-base">ISO Certificate URL <span className="text-[#525252] text-xs font-normal">(optional)</span></Label>
                  <Input
                    name="iso_certificate_url"
                    value={form.iso_certificate_url}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/..."
                    className="h-11 border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                  />
                  <p className="text-xs text-[#525252]">ISO 14001 or relevant certification</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-base text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 flex items-center gap-2 animate-scale-in">
              <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 animate-slide-up delay-3">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => { setError(null); setStep(step - 1); }}
            className="border-[#262626] bg-transparent text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white hover:border-[#333] transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}

        {step < steps.length ? (
          <Button
            onClick={handleNext}
            className="flex-1 h-11 bg-[#10B981] text-black hover:bg-[#059669] font-semibold transition-colors"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 h-11 bg-[#10B981] text-black hover:bg-[#059669] font-semibold disabled:opacity-40 transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <>
                Complete Setup
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Step count footer */}
      <p className="text-center text-xs text-[#525252]">
        Step {step} of {steps.length}
      </p>
    </div>
  );
}
