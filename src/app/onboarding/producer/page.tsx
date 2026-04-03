"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/shared/image-upload";
import { Check, ArrowRight, ArrowLeft, Factory, Building2, MapPin, Layers } from "lucide-react";

const WASTE_CATEGORIES = [
  "Metal",
  "E-waste",
  "Plastic",
  "Paper",
  "Glass",
  "Mixed Scrap",
  "Organic",
  "Hazardous",
];

const steps = [
  { label: "Company Info", icon: Building2 },
  { label: "Location", icon: MapPin },
  { label: "Waste Types", icon: Layers },
];

export default function ProducerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    industry_type: "",
    gst_number: "",
    contact_person: "",
    phone: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    async function fetchRole() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("users").select("role").eq("id", user.id).single();
      setUserRole(data?.role ?? null);
    }
    fetchRole();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function handleNext() {
    if (step === 1) {
      if (!form.name.trim() || !form.contact_person.trim() || !form.phone.trim()) {
        setError("Company name, contact person, and phone are required.");
        return;
      }
      setError(null);
      setStep(2);
    } else if (step === 2) {
      if (!form.city.trim() || !form.state.trim()) {
        setError("City and state are required.");
        return;
      }
      setError(null);
      setStep(3);
    }
  }

  async function handleSubmit() {
    if (selectedCategories.length === 0) {
      setError("Please select at least one waste category.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated"); setLoading(false); return; }

    // Upsert company (producer profile)
    const { error: companyError } = await supabase.from("companies").upsert({
      owner_id: user.id,
      name: form.name,
      industry_type: form.industry_type || null,
      gst_number: form.gst_number || null,
      contact_person: form.contact_person,
      phone: form.phone,
      description: form.description || null,
      logo_url: logoUrl[0] ?? null,
      address: form.address || null,
      city: form.city,
      state: form.state,
      pincode: form.pincode || null,
      waste_categories: selectedCategories,
      verification_status: "pending",
    }, { onConflict: "owner_id" });

    if (companyError) { setError(companyError.message); setLoading(false); return; }

    // If role is "both", send to recycler onboarding next
    // Otherwise, mark onboarding complete
    if (userRole === "both") {
      router.push("/onboarding/recycler");
      router.refresh();
      return;
    }

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
      <div className="animate-slide-up delay-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
            <Factory className="h-5 w-5 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Producer Onboarding</h1>
            <p className="text-xs text-[#525252]">Set up your company profile to start listing</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 w-full">
          {steps.map((s, i) => {
            const StepIcon = s.icon;
            const isComplete = i + 1 < step;
            const isCurrent = i + 1 === step;
            const isFuture = i + 1 > step;

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
        <div className="p-6 space-y-5">

          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
                Company Details
              </p>

              <div className="space-y-2">
                <Label className="text-[#A3A3A3] text-sm">Company Name <span className="text-[#10B981]">*</span></Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., Acme Steel Industries"
                  required
                  className="h-11 border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#A3A3A3] text-sm">Industry Type</Label>
                <Input
                  name="industry_type"
                  value={form.industry_type}
                  onChange={handleChange}
                  placeholder="e.g., Steel Manufacturing, Electronics"
                  className="h-11 border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                />
              </div>

              <div className="h-px bg-[#262626] my-1" />
              <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
                Contact Information
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#A3A3A3] text-sm">Contact Person <span className="text-[#10B981]">*</span></Label>
                  <Input
                    name="contact_person"
                    value={form.contact_person}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                    className="h-11 border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A3A3A3] text-sm">Phone <span className="text-[#10B981]">*</span></Label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    required
                    className="h-11 border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#A3A3A3] text-sm">GST Number <span className="text-[#525252] text-xs font-normal">(optional)</span></Label>
                <Input
                  name="gst_number"
                  value={form.gst_number}
                  onChange={handleChange}
                  placeholder="22AAAAA0000A1Z5"
                  className="h-11 border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                />
              </div>

              <div className="h-px bg-[#262626] my-1" />
              <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
                Additional Info
              </p>

              <div className="space-y-2">
                <Label className="text-[#A3A3A3] text-sm">Company Description <span className="text-[#525252] text-xs font-normal">(optional)</span></Label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of your business..."
                  className="flex w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-sm text-white placeholder:text-[#525252] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#A3A3A3] text-sm">Company Logo <span className="text-[#525252] text-xs font-normal">(optional)</span></Label>
                <ImageUpload
                  bucket="company-logos"
                  path="logos"
                  value={logoUrl}
                  onChange={setLogoUrl}
                  maxImages={1}
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
                Business Location
              </p>

              <div className="space-y-2">
                <Label className="text-[#A3A3A3] text-sm">Street Address <span className="text-[#525252] text-xs font-normal">(optional)</span></Label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Building, street, area"
                  className="h-11 border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#A3A3A3] text-sm">City <span className="text-[#10B981]">*</span></Label>
                  <Input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g., Mumbai"
                    required
                    className="h-11 border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A3A3A3] text-sm">State <span className="text-[#10B981]">*</span></Label>
                  <Input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="e.g., Maharashtra"
                    required
                    className="h-11 border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#A3A3A3] text-sm">Pincode <span className="text-[#525252] text-xs font-normal">(optional)</span></Label>
                <Input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                  maxLength={6}
                  className="h-11 border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-[#10B981]/50 focus-visible:border-[#10B981]/30 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Step 3: Waste Categories */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[#525252] mb-3">
                  Waste Categories
                </p>
                <h3 className="font-semibold text-white text-base">What types of waste do you generate?</h3>
                <p className="text-sm text-[#737373] mt-1">Select all that apply. This helps recyclers find your listings.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {WASTE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium transition-all text-left ${
                        isSelected
                          ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 ring-1 ring-[#10B981]/20"
                          : "border border-[#262626] bg-[#0A0A0A] text-[#A3A3A3] hover:bg-[#1A1A1A] hover:border-[#333] hover:text-white"
                      }`}
                    >
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded transition-all ${
                        isSelected
                          ? "bg-[#10B981] text-black"
                          : "border border-[#333] bg-transparent"
                      }`}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      {cat}
                    </button>
                  );
                })}
              </div>
              {selectedCategories.length > 0 && (
                <p className="text-xs text-[#10B981]/70 font-medium">
                  {selectedCategories.length} categor{selectedCategories.length === 1 ? "y" : "ies"} selected
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 flex items-center gap-2 animate-scale-in">
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
                {userRole === "both" ? "Next: Recycler Profile" : "Complete Setup"}
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
