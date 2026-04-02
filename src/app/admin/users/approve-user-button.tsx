"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ApproveUserButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleApprove() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update({ is_approved: true })
      .eq("id", userId);

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("User approved.");
      setDone(true);
    }
  }

  if (done) {
    return (
      <span className="flex items-center gap-1 text-xs text-green-400">
        <CheckCircle className="h-3.5 w-3.5" />
        Approved
      </span>
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleApprove}
      disabled={loading}
      className="bg-brand-accent/15 text-brand-accent border border-brand-accent/25 hover:bg-brand-accent/25 h-7 px-3 text-xs"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Approve"}
    </Button>
  );
}
