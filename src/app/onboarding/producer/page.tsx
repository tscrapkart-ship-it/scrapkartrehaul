"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/shared/image-upload";
import { Check, ArrowRight, ArrowLeft, Factory } from "lucide-react";

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

const steps = ["Company Info", "Location", "Waste Types"];

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
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10">
            <Factory className="h-5 w-5 text-brand-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Producer Onboarding</h1>
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
              <span className={`text-xs ${i + 1 === step ? "text-white" : "text-white/30"}`}>
                {s}
              </span>
              {i < steps.length - 1 && (
                <div className={`h-px w-8 ${i + 1 < step ? "bg-brand-accent/50" : "bg-white/[0.06]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="border-[#262626] bg-[#141414]">
        <CardContent className="pt-6 space-y-5">
          {/* Step 1: Company Info */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label className="text-white/60">Company Name *</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., Acme Steel Industries"
                  required
                  className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/60">Industry Type</Label>
                <Input
                  name="industry_type"
                  value={form.industry_type}
                  onChange={handleChange}
                  placeholder="e.g., Steel Manufacturing, Electronics"
                  className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/60">Contact Person *</Label>
                  <Input
                    name="contact_person"
                    value={form.contact_person}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                    className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">Phone *</Label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    required
                    className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/60">GST Number <span className="text-white/30">(optional)</span></Label>
                <Input
                  name="gst_number"
                  value={form.gst_number}
                  onChange={handleChange}
                  placeholder="22AAAAA0000A1Z5"
                  className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/60">Company Description <span className="text-white/30">(optional)</span></Label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Brief description of your business..."
                  className="flex w-full rounded-md border border-[#262626] bg-[#1A1A1A] px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/60">Company Logo <span className="text-white/30">(optional)</span></Label>
                <ImageUpload
                  bucket="company-logos"
                  path="logos"
                  value={logoUrl}
                  onChange={setLogoUrl}
                  maxImages={1}
                />
              </div>
            </>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label className="text-white/60">Street Address <span className="text-white/30">(optional)</span></Label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Building, street, area"
                  className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/60">City *</Label>
                  <Input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g., Mumbai"
                    required
                    className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">State *</Label>
                  <Input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="e.g., Maharashtra"
                    required
                    className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/60">Pincode <span className="text-white/30">(optional)</span></Label>
                <Input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                  maxLength={6}
                  className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                />
              </div>
            </>
          )}

          {/* Step 3: Waste Categories */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-white">What types of waste do you generate?</h3>
                <p className="text-sm text-white/40 mt-1">Select all that apply. This helps recyclers find your listings.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {WASTE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-brand-accent text-brand-dark"
                          : "border border-[#262626] bg-[#1A1A1A] text-white/60 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      {isSelected && <Check className="inline h-3 w-3 mr-1.5" />}
                      {cat}
                    </button>
                  );
                })}
              </div>
              {selectedCategories.length > 0 && (
                <p className="text-xs text-brand-accent/70">
                  {selectedCategories.length} categor{selectedCategories.length === 1 ? "y" : "ies"} selected
                </p>
              )}
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
            {loading ? "Saving..." : (userRole === "both" ? "Next: Recycler Profile" : "Complete Setup")}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
