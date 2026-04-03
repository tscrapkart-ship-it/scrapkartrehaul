"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/shared/image-upload";
import { Building2, MapPin, Loader2 } from "lucide-react";

export default function CompanySetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("companies").insert({
      owner_id: user.id,
      name: formData.get("name") as string,
      industry_type: formData.get("industry_type") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      description: formData.get("description") as string,
      logo_url: logoUrl[0] || null,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
          <Building2 className="h-5 w-5 text-[#10B981]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Set Up Your Company</h1>
          <p className="text-base text-[#737373]">Create your company profile to start posting listings.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#262626] bg-[#141414] p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-5">
            <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
              Company Information
            </p>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#A3A3A3] text-base">Company Name *</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Your company name"
                className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry_type" className="text-[#A3A3A3] text-base">Industry Type</Label>
              <Input
                id="industry_type"
                name="industry_type"
                placeholder="e.g., Manufacturing, Construction"
                className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#A3A3A3] text-base">Company Logo</Label>
              <ImageUpload
                bucket="company-logos"
                path="logos"
                value={logoUrl}
                onChange={setLogoUrl}
                maxImages={1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#A3A3A3] text-base">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="flex w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-base text-white placeholder:text-[#525252] focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 resize-none"
                placeholder="Brief description of your company"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-5 border-t border-[#262626] pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#525252]" />
              <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
                Location
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-[#A3A3A3] text-base">Address</Label>
                <Input
                  id="address"
                  name="address"
                  className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-[#A3A3A3] text-base">City</Label>
                <Input
                  id="city"
                  name="city"
                  className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-[#A3A3A3] text-base">State</Label>
                <Input
                  id="state"
                  name="state"
                  className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-[#A3A3A3] text-base">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  maxLength={6}
                  className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-base text-red-400">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#10B981] text-black hover:bg-[#059669] font-semibold h-12 text-base transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Company"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
