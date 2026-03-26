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

const units = ["kg", "ton", "pieces", "lots"];

export default function NewScrapPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ScrapCategory>("Metal");

  useEffect(() => {
    async function fetchCompany() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("scraps").insert({
      seller_id: user.id,
      company_id: companyId,
      title: formData.get("title") as string,
      category: selectedCategory,
      quantity: parseFloat(formData.get("quantity") as string),
      unit: formData.get("unit") as string,
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      images,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      status: "available",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/scraps");
    router.refresh();
  }

  if (companyId === null) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-white/[0.06] bg-white/[0.03]">
          <CardContent className="flex items-center justify-center gap-2 pt-6">
            <Loader2 className="h-5 w-5 animate-spin text-brand-accent" />
            <p className="text-white/40">Loading company info...</p>
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
        <h1 className="text-2xl font-bold text-white">
          New Scrap Listing
        </h1>
      </div>
      <Card className="border-white/[0.06] bg-white/[0.03]">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white/60">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., 500kg Steel Scrap"
                required
                className="border-white/[0.06] bg-white/[0.04] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/60">Category *</Label>
              <input type="hidden" name="category" value={selectedCategory} />
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-brand-accent text-brand-dark"
                        : "border border-white/[0.06] bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white/60">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="border-white/[0.06] bg-white/[0.04] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-white/60">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="border-white/[0.06] bg-white/[0.04] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="text-white/60">Unit *</Label>
              <select
                id="unit"
                name="unit"
                required
                className="flex h-10 w-full rounded-md border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
              >
                {units.map((u) => (
                  <option key={u} value={u} className="bg-[#002a47] text-white">
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/60">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="flex w-full rounded-md border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-white ring-offset-background placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
                placeholder="Describe the scrap material, condition, etc."
              />
            </div>

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

            <div className="border-t border-white/[0.06] pt-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/30">Pickup Location</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white/60">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    className="border-white/[0.06] bg-white/[0.04] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white/60">City</Label>
                  <Input
                    id="city"
                    name="city"
                    className="border-white/[0.06] bg-white/[0.04] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white/60">State</Label>
                  <Input
                    id="state"
                    name="state"
                    className="border-white/[0.06] bg-white/[0.04] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-white/60">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    className="border-white/[0.06] bg-white/[0.04] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
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
              {loading ? "Creating..." : "Create Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
