"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

export function DeleteListingButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("scraps").delete().eq("id", id);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-white/40 hover:text-white"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1 text-xs text-white/30 hover:text-red-400 transition-colors"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Remove
    </button>
  );
}
