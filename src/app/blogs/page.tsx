import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 animate-fade-in">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 px-3 py-1.5 text-xs font-medium text-[#10B981] mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            Blog
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">ScrapKart Blog</h1>
          <p className="mt-3 text-[#737373] max-w-lg mx-auto text-lg">
            Insights on industrial scrap, recycling, and the circular economy
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#262626] bg-[#141414]/50 py-20">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A1A1A] border border-[#262626] mb-4">
              <BookOpen className="h-7 w-7 text-[#525252]" />
            </div>
            <p className="text-lg text-[#D4D4D4] font-semibold">No posts yet</p>
            <p className="text-base text-[#525252] mt-1">Check back soon for new articles.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {blogs.map((blog: any, i: number) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className={`animate-slide-up delay-${Math.min(i + 1, 6)} group rounded-xl border border-[#262626] bg-[#141414] overflow-hidden transition-all hover:border-[#333] hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.08)]`}
              >
                {blog.cover_image && (
                  <div className="aspect-video overflow-hidden bg-[#0A0A0A]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2">
                    {blog.is_featured && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#10B981]/10 px-2 py-0.5 text-xs font-medium text-[#10B981]">
                        <span className="h-1 w-1 rounded-full bg-[#10B981]" />
                        Featured
                      </span>
                    )}
                    <span className="text-sm text-[#3F3F3F]">
                      {blog.published_at
                        ? new Date(blog.published_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white group-hover:text-[#10B981] transition-colors leading-snug">
                    {blog.title}
                  </h2>
                  {blog.excerpt && (
                    <p className="text-base text-[#737373] line-clamp-2">{blog.excerpt}</p>
                  )}
                  <div className="flex items-center gap-1 text-sm text-[#525252] group-hover:text-[#10B981] transition-colors pt-1">
                    Read more
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
