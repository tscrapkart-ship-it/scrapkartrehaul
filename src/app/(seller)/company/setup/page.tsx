"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/shared/image-upload";
import { Building2 } from "lucide-react";

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
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10">
          <Building2 className="h-5 w-5 text-brand-accent" />
        </div>
        <h1 className="text-2xl font-bold text-white">
          Set Up Your Company
        </h1>
      </div>
      <Card className="border-[#262626] bg-[#141414]">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/60">Company Name *</Label>
              <Input
                id="name"
                name="name"
                required
                className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry_type" className="text-white/60">Industry Type</Label>
              <Input
                id="industry_type"
                name="industry_type"
                placeholder="e.g., Manufacturing, Construction"
                className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60">Company Logo</Label>
              <ImageUpload
                bucket="company-logos"
                path="logos"
                value={logoUrl}
                onChange={setLogoUrl}
                maxImages={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/60">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="flex w-full rounded-md border border-[#262626] bg-[#1A1A1A] px-3 py-2 text-sm text-white ring-offset-background placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
                placeholder="Brief description of your company"
              />
            </div>

            <div className="border-t border-[#262626] pt-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/30">Location</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white/60">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white/60">City</Label>
                  <Input
                    id="city"
                    name="city"
                    className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white/60">State</Label>
                  <Input
                    id="state"
                    name="state"
                    className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-white/60">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Company"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
