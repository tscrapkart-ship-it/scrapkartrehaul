"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    is_featured: false,
    is_published: false,
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("blogs").select("*").eq("id", blogId).single();
      if (data) {
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          cover_image: data.cover_image ?? "",
          is_featured: data.is_featured ?? false,
          is_published: data.is_published ?? false,
        });
      }
      setFetching(false);
    }
    load();
  }, [blogId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) {
      toast.error("Title, slug, and content are required.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("blogs")
      .update({
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content,
        cover_image: form.cover_image || null,
        is_featured: form.is_featured,
        is_published: form.is_published,
        published_at: form.is_published ? new Date().toISOString() : null,
      })
      .eq("id", blogId);

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Post updated!");
      router.push("/admin/blog");
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/blog">
          <Button size="sm" variant="outline" className="border-[#262626] text-white/60 hover:bg-[#1A1A1A] h-8 px-3">
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Post</h1>
          <p className="mt-0.5 text-base text-white/40">Update this blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label className="text-white/70">Title</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Post title"
            className="bg-card border-[#262626] text-white placeholder:text-white/30"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white/70">Slug</Label>
          <Input
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="post-url-slug"
            className="bg-card border-[#262626] text-white placeholder:text-white/30 font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white/70">Excerpt</Label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
            placeholder="Short summary shown in listings..."
            rows={2}
            className="w-full rounded-md border border-[#262626] bg-card px-3 py-2 text-base text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/50 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white/70">Content (Markdown or plain text)</Label>
          <textarea
            value={form.content}
            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            placeholder="Write your post content here..."
            rows={12}
            className="w-full rounded-md border border-[#262626] bg-card px-3 py-2 text-base text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/50 resize-y font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white/70">Cover Image URL</Label>
          <Input
            value={form.cover_image}
            onChange={(e) => setForm((p) => ({ ...p, cover_image: e.target.value }))}
            placeholder="https://..."
            className="bg-card border-[#262626] text-white placeholder:text-white/30"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))}
              className="rounded border-white/20 bg-card accent-brand-accent"
            />
            <span className="text-base text-white/70">Featured post</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))}
              className="rounded border-white/20 bg-card accent-brand-accent"
            />
            <span className="text-base text-white/70">Published</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
          <Link href="/admin/blog">
            <Button type="button" variant="outline" className="border-[#262626] text-white/60 hover:bg-[#1A1A1A]">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
