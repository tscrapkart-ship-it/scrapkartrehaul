"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/shared/image-upload";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import type { Scrap, ScrapCategory } from "@/types";

const categories: ScrapCategory[] = [
  "Metal",
  "E-waste",
  "Plastic",
  "Paper",
  "Glass",
  "Mixed Scrap",
];
const units = ["kg", "ton", "pieces", "lots"];

export default function EditScrapPage() {
  const router = useRouter();
  const params = useParams();
  const [scrap, setScrap] = useState<Scrap | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ScrapCategory>("Metal");

  useEffect(() => {
    async function fetchScrap() {
      const supabase = createClient();
      const { data } = await supabase
        .from("scraps")
        .select("*")
        .eq("id", params.id as string)
        .single();

      if (data) {
        setScrap(data);
        setImages(data.images ?? []);
        setSelectedCategory(data.category as ScrapCategory);
      }
      setFetching(false);
    }
    fetchScrap();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!scrap) return;
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error } = await supabase
      .from("scraps")
      .update({
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
      })
      .eq("id", scrap.id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/scraps");
    router.refresh();
  }

  async function handleDelete() {
    if (!scrap || !confirm("Delete this listing?")) return;
    const supabase = createClient();
    await supabase.from("scraps").delete().eq("id", scrap.id);
    router.push("/scraps");
    router.refresh();
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-accent" />
        <span className="ml-2 text-white/40">Loading...</span>
      </div>
    );
  }

  if (!scrap) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-white/40">Listing not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10">
            <Pencil className="h-5 w-5 text-brand-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white">Edit Listing</h1>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
      <Card className="border-white/[0.06] bg-white/[0.03]">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white/60">Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={scrap.title}
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
                  defaultValue={scrap.price}
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
                  defaultValue={scrap.quantity}
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
                defaultValue={scrap.unit}
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
                defaultValue={scrap.description ?? ""}
                className="flex w-full rounded-md border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-white ring-offset-background placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
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
                    defaultValue={scrap.address ?? ""}
                    className="border-white/[0.06] bg-white/[0.04] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white/60">City</Label>
                  <Input
                    id="city"
                    name="city"
                    defaultValue={scrap.city ?? ""}
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
                    defaultValue={scrap.state ?? ""}
                    className="border-white/[0.06] bg-white/[0.04] text-white placeholder:text-white/30 focus-visible:ring-brand-accent/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-white/60">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    defaultValue={scrap.pincode ?? ""}
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
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
