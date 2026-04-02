"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteBlogButton({ blogId }: { blogId: string }) {
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("blogs").delete().eq("id", blogId);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Post deleted.");
      setDeleted(true);
    }
  }

  if (deleted) return null;

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleDelete}
      disabled={loading}
      className="border-red-500/25 text-red-400 hover:bg-red-500/10 h-7 px-3 text-xs"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
    </Button>
  );
}
