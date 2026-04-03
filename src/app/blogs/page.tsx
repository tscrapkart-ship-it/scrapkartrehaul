import Link from "next/link";
import { BookOpen } from "lucide-react";

async function getBlogs() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, cover_image, is_featured, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">ScrapKart Blog</h1>
          <p className="mt-3 text-white/50">Insights on industrial scrap, recycling, and the circular economy</p>
        </div>

        {blogs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <BookOpen className="h-10 w-10 text-white/20" />
            <p className="text-white/40">No posts published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {blogs.map((blog: any) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="group rounded-xl border border-[#262626] bg-card overflow-hidden hover:border-brand-accent/30 transition-colors"
              >
                {blog.cover_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5 space-y-2">
                  {blog.is_featured && (
                    <span className="rounded-full bg-brand-accent/10 px-2.5 py-0.5 text-xs text-brand-accent">Featured</span>
                  )}
                  <h2 className="font-semibold text-white group-hover:text-brand-accent transition-colors leading-snug">
                    {blog.title}
                  </h2>
                  {blog.excerpt && (
                    <p className="text-sm text-white/50 line-clamp-2">{blog.excerpt}</p>
                  )}
                  <p className="text-xs text-white/30 pt-1">
                    {blog.published_at
                      ? new Date(blog.published_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
