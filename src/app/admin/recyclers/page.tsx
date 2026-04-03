import { Recycle } from "lucide-react";
import { VerifyRecyclerButton } from "./verify-recycler-button";

async function getRecyclerProfiles(status?: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("recycler_profiles")
    .select("*, users!recycler_profiles_user_id_fkey(name, email)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("verification_status", status);
  }

  const { data } = await query;
  return data ?? [];
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  verified: "bg-green-500/10 text-green-400",
  rejected: "bg-red-500/10 text-red-400",
};

export default async function AdminRecyclersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const profiles = await getRecyclerProfiles(params.status);
  const activeStatus = params.status ?? "all";

  const tabs = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending Verification" },
    { value: "verified", label: "Verified" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Recycler Verification</h1>
        <p className="mt-1 text-sm text-white/40">
          Review recycler profiles and compliance documents
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={tab.value === "all" ? "/admin/recyclers" : `/admin/recyclers?status=${tab.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeStatus === tab.value
                ? "bg-brand-accent text-brand-dark"
                : "border border-white/10 text-white/60 hover:border-brand-accent/30 hover:text-white"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {profiles.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#262626] py-16 text-center">
          <Recycle className="h-8 w-8 text-white/20" />
          <p className="text-sm text-white/40">No recycler profiles found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile: any) => (
            <div key={profile.id} className="rounded-xl border border-[#262626] bg-card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{profile.users?.name ?? "Unknown"}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[profile.verification_status]}`}>
                      {profile.verification_status}
                    </span>
                  </div>
                  <p className="text-sm text-white/40">{profile.users?.email}</p>
                </div>
                {profile.verification_status === "pending" && (
                  <VerifyRecyclerButton profileId={profile.id} userId={profile.user_id} />
                )}
              </div>

              {profile.waste_types_accepted?.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 mb-2">Waste Types Accepted</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.waste_types_accepted.map((t: string) => (
                      <span key={t} className="rounded-full bg-brand-accent/10 px-2.5 py-0.5 text-xs text-brand-accent">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                {profile.service_radius_km && (
                  <div>
                    <p className="text-xs text-white/30">Service Radius</p>
                    <p className="text-white/70">{profile.service_radius_km} km</p>
                  </div>
                )}
                {profile.pricing_model && (
                  <div>
                    <p className="text-xs text-white/30">Pricing Model</p>
                    <p className="text-white/70 capitalize">{profile.pricing_model}</p>
                  </div>
                )}
              </div>

              {/* Compliance docs */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  { label: "CPCB License", url: profile.cpcb_license_url },
                  { label: "EPR Authorization", url: profile.epr_authorization_url },
                  { label: "ISO Certificate", url: profile.iso_certificate_url },
                ].map((doc) => (
                  <div key={doc.label} className="rounded-lg border border-[#262626] bg-[#141414] px-3 py-2">
                    <p className="text-xs text-white/40">{doc.label}</p>
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-accent hover:underline truncate block mt-0.5"
                      >
                        View Document →
                      </a>
                    ) : (
                      <p className="text-xs text-white/25 mt-0.5">Not provided</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
