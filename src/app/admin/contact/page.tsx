import { MessageSquare } from "lucide-react";
import { MarkReadButton } from "./mark-read-button";

async function getSubmissions(status?: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (status === "new") {
    query = query.eq("status", "new");
  } else if (status === "read") {
    query = query.neq("status", "new");
  }

  const { data } = await query;
  return data ?? [];
}

const statusColor: Record<string, string> = {
  new: "bg-brand-accent/10 text-brand-accent",
  read: "bg-white/[0.06] text-white/40",
  replied: "bg-green-500/10 text-green-400",
  archived: "bg-[#1A1A1A] text-white/25",
};

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const submissions = await getSubmissions(params.status);
  const activeStatus = params.status ?? "all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
        <p className="mt-1 text-sm text-white/40">Messages from the public contact form</p>
      </div>

      <div className="flex gap-2">
        {[
          { value: "all", label: "All" },
          { value: "new", label: "Unread" },
          { value: "read", label: "Read" },
        ].map((tab) => (
          <a
            key={tab.value}
            href={tab.value === "all" ? "/admin/contact" : `/admin/contact?status=${tab.value}`}
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

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#262626] py-16 text-center">
          <MessageSquare className="h-8 w-8 text-white/20" />
          <p className="text-sm text-white/40">No submissions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub: any) => (
            <div
              key={sub.id}
              className={`rounded-xl border bg-card p-5 space-y-3 ${sub.status === "new" ? "border-brand-accent/20" : "border-[#262626]"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{sub.name}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[sub.status]}`}>
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-sm text-white/50">{sub.email}{sub.phone ? ` · ${sub.phone}` : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-white/30">
                    {new Date(sub.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {sub.status === "new" && <MarkReadButton submissionId={sub.id} />}
                </div>
              </div>

              {sub.subject && (
                <p className="text-sm font-medium text-white/70">{sub.subject}</p>
              )}

              <p className="text-sm text-white/60 leading-relaxed">{sub.message}</p>

              <a
                href={`mailto:${sub.email}?subject=Re: ${sub.subject ?? "Your message to ScrapKart"}`}
                className="inline-block text-xs text-brand-accent hover:text-brand-accent/80 transition-colors"
              >
                Reply via email →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
