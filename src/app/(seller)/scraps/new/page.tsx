"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/shared/image-upload";
import { PackagePlus, Loader2 } from "lucide-react";
import type { ScrapCategory } from "@/types";

const categories: ScrapCategory[] = [
  "Metal",
  "E-waste",
  "Plastic",
  "Paper",
  "Glass",
  "Mixed Scrap",
];

const SUB_TYPES: Record<ScrapCategory, string[]> = {
  Metal: ["HMS Grade A", "HMS Grade B", "Aluminium", "Copper", "Stainless Steel", "Iron", "Other"],
  "E-waste": ["Computers / Laptops", "Phones", "Circuit Boards", "Batteries", "Cables", "Other"],
  Plastic: ["PET", "HDPE", "PVC", "PP", "PS", "Mixed", "Other"],
  Paper: ["OCC Cardboard", "Newspaper", "Office Paper", "Mixed Paper", "Books", "Other"],
  Glass: ["Clear Glass", "Coloured Glass", "Mixed Glass", "Other"],
  "Mixed Scrap": ["Industrial Mixed", "Commercial Mixed", "Other"],
};

const units = ["kg", "ton", "pieces", "lots"];

export default function NewScrapPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ScrapCategory>("Metal");
  const [selectedSubType, setSelectedSubType] = useState<string>("");

  useEffect(() => {
    async function fetchCompany() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();
      if (data) setCompanyId(data.id);
    }
    fetchCompany();
  }, []);

  function handleCategoryChange(cat: ScrapCategory) {
    setSelectedCategory(cat);
    setSelectedSubType("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!companyId) {
      setError("Please set up your company profile first.");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("scraps").insert({
      seller_id: user.id,
      company_id: companyId,
      title: formData.get("title") as string,
      category: selectedCategory,
      sub_type: selectedSubType || null,
      quantity: parseFloat(formData.get("quantity") as string),
      unit: formData.get("unit") as string,
      price: parseFloat(formData.get("price_expectation") as string) || 0,
      price_expectation: parseFloat(formData.get("price_expectation") as string) || null,
      description: formData.get("description") as string,
      images,
      photos: images,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      status: "live",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/scraps");
    router.refresh();
  }

  if (companyId === null) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-[#262626] bg-[#141414]">
          <CardContent className="flex items-center justify-center gap-2 pt-6">
            <Loader2 className="h-5 w-5 animate-spin text-brand-accent" />
            <p className="text-white/40">Loading company info...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (companyId === undefined) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="pt-6 text-center">
            <p className="text-yellow-400 font-medium">Company profile required</p>
            <p className="text-sm text-white/40 mt-1">Set up your company before posting listings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10">
          <PackagePlus className="h-5 w-5 text-brand-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">New Scrap Listing</h1>
          <p className="text-sm text-white/40">Recyclers will bid on your listing.</p>
        </div>
      </div>

      <Card className="border-[#262626] bg-[#141414]">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white/60">Listing Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., 500kg HMS Grade A Steel Scrap"
                required
                className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-white/60">Category *</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-brand-accent text-brand-dark"
                        : "border border-[#262626] bg-[#1A1A1A] text-white/60 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-type */}
            <div className="space-y-2">
              <Label className="text-white/60">Sub-type <span className="text-white/30">(optional)</span></Label>
              <div className="flex flex-wrap gap-2">
                {SUB_TYPES[selectedCategory].map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubType(sub === selectedSubType ? "" : sub)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selectedSubType === sub
                        ? "bg-brand-secondary/50 text-white border border-brand-accent/40"
                        : "border border-[#262626] bg-[#1A1A1A] text-white/50 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-white/60">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-white/60">Unit *</Label>
                <select
                  id="unit"
                  name="unit"
                  required
                  className="flex h-10 w-full rounded-md border border-[#262626] bg-[#1A1A1A] px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
                >
                  {units.map((u) => (
                    <option key={u} value={u} className="bg-card text-white">{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price expectation */}
            <div className="space-y-2">
              <Label htmlFor="price_expectation" className="text-white/60">
                Expected Price (₹) <span className="text-white/30">— asking / floor price, optional</span>
              </Label>
              <Input
                id="price_expectation"
                name="price_expectation"
                type="number"
                min="0"
                step="1"
                placeholder="Recyclers will bid against this"
                className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
              />
              <p className="text-xs text-white/30">This is a reference price. Recyclers submit their own bid offers.</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/60">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="flex w-full rounded-md border border-[#262626] bg-[#1A1A1A] px-3 py-2 text-sm text-white ring-offset-background placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
                placeholder="Condition, grade, any relevant details..."
              />
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label className="text-white/60">Images</Label>
              <ImageUpload
                bucket="scrap-images"
                path="scraps"
                value={images}
                onChange={setImages}
                maxImages={5}
              />
            </div>

            {/* Pickup Location */}
            <div className="border-t border-[#262626] pt-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/30">Pickup Location</p>
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
                  <Label htmlFor="city" className="text-white/60">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white/60">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    required
                    className="border-[#262626] bg-[#1A1A1A] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-white/60">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    maxLength={6}
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
              {loading ? "Publishing..." : "Publish Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
