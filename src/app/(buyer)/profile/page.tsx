"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { isMockMode } from "@/lib/mock-data";
import type { User } from "@/types";
import { Save } from "lucide-react";

const mockProfile: User = {
  id: "demo",
  email: "demo@scrapkart.app",
  name: "Demo User",
  phone: "+91 98765 43210",
  role: "recycler",
  is_approved: true,
  onboarding_completed: true,
  created_at: "2026-01-01T00:00:00Z",
};

export default function BuyerProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mock = isMockMode();

  useEffect(() => {
    if (mock) {
      setProfile(mockProfile);
      return;
    }

    async function fetchProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data);
    }
    fetchProfile();
  }, [mock]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile || mock) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error } = await supabase
      .from("users")
      .update({
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
      })
      .eq("id", profile.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (!profile) return <p className="text-white/40">Loading...</p>;

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-white">Profile</h1>

      {/* Avatar */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-accent/10 text-2xl font-bold text-brand-accent">
          {initials}
        </div>
      </div>

      <Card className="border-white/[0.06] bg-[#002a47]">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/40 text-xs uppercase tracking-wider">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="border-white/[0.06] bg-white/[0.03] text-white/50 disabled:opacity-60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/40 text-xs uppercase tracking-wider">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={profile.name}
                required
                className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-white/20 focus:border-brand-accent focus:ring-brand-accent/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/40 text-xs uppercase tracking-wider">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={profile.phone ?? ""}
                className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-white/20 focus:border-brand-accent focus:ring-brand-accent/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/40 text-xs uppercase tracking-wider">Role</Label>
              <Input
                value={
                  profile.role === "recycler" ? "Recycler (Buyer)" : "Waste Producer (Seller)"
                }
                disabled
                className="border-white/[0.06] bg-white/[0.03] text-white/50 disabled:opacity-60"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && (
              <p className="text-sm text-brand-accent">Profile updated successfully.</p>
            )}
            <Button
              type="submit"
              className="w-full bg-brand-accent text-brand-dark font-semibold hover:bg-brand-accent/90"
              disabled={loading || mock}
            >
              {mock ? (
                "Sign up to edit profile"
              ) : loading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
