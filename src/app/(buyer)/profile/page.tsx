"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isMockMode } from "@/lib/mock-data";
import type { User } from "@/types";
import { Save, Mail, Phone, Shield, Calendar, Loader2, CheckCircle } from "lucide-react";

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
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  }

  if (!profile)
    return (
      <div className="flex items-center justify-center py-20 text-[#525252]">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading profile...
      </div>
    );

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleLabel =
    profile.role === "recycler"
      ? "Recycler"
      : profile.role === "waste_producer"
      ? "Waste Producer"
      : profile.role === "both"
      ? "Both"
      : profile.role ?? "—";

  return (
    <div className="mx-auto max-w-lg animate-fade-in">
      <h1 className="mb-8 text-2xl font-bold text-white">Profile</h1>

      {/* Avatar + quick info */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-[#262626] bg-[#141414] p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 text-xl font-bold text-[#10B981] shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-white truncate">{profile.name}</h2>
          <p className="text-sm text-[#737373] truncate">{profile.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#10B981]/10 px-2 py-0.5 text-xs font-medium text-[#10B981]">
              <Shield className="h-3 w-3" />
              {roleLabel}
            </span>
            {profile.is_approved && (
              <span className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                <CheckCircle className="h-3 w-3" />
                Approved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Account details */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#262626] bg-[#141414] p-4">
          <div className="flex items-center gap-1.5 text-[#525252] mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">Member since</span>
          </div>
          <p className="text-sm font-medium text-[#D4D4D4]">
            {new Date(profile.created_at).toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="rounded-xl border border-[#262626] bg-[#141414] p-4">
          <div className="flex items-center gap-1.5 text-[#525252] mb-1">
            <Mail className="h-3.5 w-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">Email</span>
          </div>
          <p className="text-sm font-medium text-[#D4D4D4] truncate">{profile.email}</p>
        </div>
      </div>

      {/* Edit form */}
      <div className="rounded-xl border border-[#262626] bg-[#141414] p-6">
        <h3 className="text-xs font-medium uppercase tracking-widest text-[#525252] mb-5">
          Edit Profile
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#A3A3A3] text-sm">Full Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={profile.name}
              required
              className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#A3A3A3] text-sm flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={profile.phone ?? ""}
              placeholder="+91 98765 43210"
              className="border-[#262626] bg-[#0A0A0A] text-white placeholder:text-[#525252] h-11 focus:border-[#10B981] focus:ring-[#10B981]/20"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2 text-sm text-green-400">
              <CheckCircle className="h-4 w-4" />
              Profile updated successfully.
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#10B981] text-black font-semibold hover:bg-[#059669] h-11 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            disabled={loading || mock}
          >
            {mock ? (
              "Sign up to edit profile"
            ) : loading ? (
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
