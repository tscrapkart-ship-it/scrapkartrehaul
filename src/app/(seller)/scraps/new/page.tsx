"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/shared/image-upload";
import { PackagePlus, Loader2, MapPin, Info } from "lucide-react";
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
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="rounded-xl border border-[#262626] bg-[#141414] p-8 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-[#10B981]" />
          <p className="text-[#737373] text-base">Loading company info...</p>
        </div>
      </div>
    );
  }

  if (companyId === undefined) {
    return (
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/[0.04] p-8 text-center">
          <p className="text-yellow-400 font-semibold text-lg">Company profile required</p>
          <p className="text-base text-[#737373] mt-1">Set up your company before posting listings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
          <PackagePlus className="h-5 w-5 text-[#10B981]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">New Scrap Listing</h1>
          <p className="text-base text-[#737373]">Recyclers will bid on your listing.</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#262626] bg-[#141414] p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Info */}
          <div className="space-y-5">
            <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
              Listing Details
            </p>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#A3A3A3] text-base">Listing Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., 500kg HMS Grade A Steel Scrap"
                required
                className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
              />
            </div>

            {/* Category */}
            <div className="space-y-2.5">
              <Label className="text-[#A3A3A3] text-base">Category *</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`rounded-lg px-4 py-2 text-base font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-[#10B981] text-black shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                        : "border border-[#262626] bg-[#0A0A0A] text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white hover:border-[#333]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-type */}
            <div className="space-y-2.5">
              <Label className="text-[#A3A3A3] text-base">
                Sub-type <span className="text-[#525252]">(optional)</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {SUB_TYPES[selectedCategory].map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubType(sub === selectedSubType ? "" : sub)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      selectedSubType === sub
                        ? "bg-[#059669]/30 text-[#34D399] border border-[#10B981]/30"
                        : "border border-[#262626] bg-[#0A0A0A] text-[#737373] hover:bg-[#1A1A1A] hover:text-white hover:border-[#333]"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Quantity & Price */}
          <div className="space-y-5 border-t border-[#262626] pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
              Quantity & Price
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-[#A3A3A3] text-base">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-[#A3A3A3] text-base">Unit *</Label>
                <select
                  id="unit"
                  name="unit"
                  required
                  className="flex h-11 w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2 text-base text-white focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                >
                  {units.map((u) => (
                    <option key={u} value={u} className="bg-[#141414] text-white">{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_expectation" className="text-[#A3A3A3] text-base">
                Expected Price (₹)
              </Label>
              <Input
                id="price_expectation"
                name="price_expectation"
                type="number"
                min="0"
                step="1"
                placeholder="Recyclers will bid against this"
                className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
              />
              <p className="flex items-center gap-1.5 text-sm text-[#525252]">
                <Info className="h-3 w-3" />
                This is a reference price. Recyclers submit their own bid offers.
              </p>
            </div>
          </div>

          {/* Section: Description & Images */}
          <div className="space-y-5 border-t border-[#262626] pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
              Description & Images
            </p>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#A3A3A3] text-base">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="flex w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-base text-white placeholder:text-[#525252] focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 resize-none"
                placeholder="Condition, grade, any relevant details..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#A3A3A3] text-base">Images</Label>
              <ImageUpload
                bucket="scrap-images"
                path="scraps"
                value={images}
                onChange={setImages}
                maxImages={5}
              />
            </div>
          </div>

          {/* Section: Location */}
          <div className="space-y-5 border-t border-[#262626] pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#525252]" />
              <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
                Pickup Location
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-[#A3A3A3] text-base">Address</Label>
                <Input
                  id="address"
                  name="address"
                  className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-[#A3A3A3] text-base">City *</Label>
                <Input
                  id="city"
                  name="city"
                  required
                  className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-[#A3A3A3] text-base">State *</Label>
                <Input
                  id="state"
                  name="state"
                  required
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

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-[#10B981] text-black hover:bg-[#059669] font-semibold h-12 text-base transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Listing"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
