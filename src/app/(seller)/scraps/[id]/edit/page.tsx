"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/shared/image-upload";
import { Pencil, Trash2, Loader2, MapPin, Save } from "lucide-react";
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
  const [deleting, setDeleting] = useState(false);
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
    setDeleting(true);
    try {
      const supabase = createClient();
      await supabase.from("scraps").delete().eq("id", scrap.id);
      router.push("/scraps");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20 text-[#525252]">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-[#10B981]" />
        Loading...
      </div>
    );
  }

  if (!scrap) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-[#737373] text-base">Listing not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
            <Pencil className="h-5 w-5 text-[#10B981]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Edit Listing</h1>
            <p className="text-sm text-[#737373] sm:text-base">Update your scrap listing details</p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="shrink-0 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
        >
          {deleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </>
          )}
        </Button>
      </div>

      <div className="rounded-xl border border-[#262626] bg-[#141414] p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-5">
            <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
              Listing Details
            </p>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#A3A3A3] text-base">Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={scrap.title}
                required
                className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
              />
            </div>

            <div className="space-y-2.5">
              <Label className="text-[#A3A3A3] text-base">Category *</Label>
              <input type="hidden" name="category" value={selectedCategory} />
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
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
          </div>

          {/* Quantity & Price */}
          <div className="space-y-5 border-t border-[#262626] pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-[#525252]">
              Quantity & Price
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-[#A3A3A3] text-base">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={scrap.price}
                  min="0"
                  step="0.01"
                  required
                  className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-[#A3A3A3] text-base">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  defaultValue={scrap.quantity}
                  min="0"
                  step="0.01"
                  required
                  className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="text-[#A3A3A3] text-base">Unit *</Label>
              <select
                id="unit"
                name="unit"
                defaultValue={scrap.unit}
                required
                className="flex h-11 w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2 text-base text-white focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              >
                {units.map((u) => (
                  <option key={u} value={u} className="bg-[#141414] text-white">
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description & Images */}
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
                defaultValue={scrap.description ?? ""}
                className="flex w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2.5 text-base text-white placeholder:text-[#525252] focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 resize-none"
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

          {/* Location */}
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
                  defaultValue={scrap.address ?? ""}
                  className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-[#A3A3A3] text-base">City</Label>
                <Input
                  id="city"
                  name="city"
                  defaultValue={scrap.city ?? ""}
                  className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-[#A3A3A3] text-base">State</Label>
                <Input
                  id="state"
                  name="state"
                  defaultValue={scrap.state ?? ""}
                  className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-[#A3A3A3] text-base">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  defaultValue={scrap.pincode ?? ""}
                  className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
                />
              </div>
            </div>
          </div>

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
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
