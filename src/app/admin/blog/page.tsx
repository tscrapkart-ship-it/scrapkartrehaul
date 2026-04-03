import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteBlogButton } from "./delete-blog-button";

async function getBlogs() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("id, title, slug, is_published, is_featured, published_at, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminBlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="mt-1 text-sm text-white/40">Create and manage published blog posts</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#262626] py-16 text-center">
          <BookOpen className="h-8 w-8 text-white/20" />
          <p className="text-sm text-white/40">No blog posts yet</p>
          <Link href="/admin/blog/new">
            <Button className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90">Write First Post</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-[#262626] bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#262626]">
                <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Title</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Featured</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Created</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-white/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {blogs.map((blog: any) => (
                <tr key={blog.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{blog.title}</p>
                    <p className="text-xs text-white/30">/{blog.slug}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${blog.is_published ? "bg-green-500/10 text-green-400" : "bg-[#1A1A1A] text-white/40"}`}>
                      {blog.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {blog.is_featured && (
                      <span className="rounded-full bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent">Featured</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-white/40">
                    {new Date(blog.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/blog/${blog.id}/edit`}>
                        <Button size="sm" variant="outline" className="border-[#262626] text-white/60 hover:bg-[#1A1A1A] h-7 px-3 text-xs">
                          Edit
                        </Button>
                      </Link>
                      <DeleteBlogButton blogId={blog.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
