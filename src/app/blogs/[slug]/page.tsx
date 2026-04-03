import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, User } from "lucide-react";

async function getBlog(slug: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("*, author:users!blogs_author_id_fkey(name)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 animate-fade-in">
        {/* Back link */}
        <Link
          href="/blogs"
          className="mb-8 inline-flex items-center gap-1 text-base text-[#525252] hover:text-[#10B981] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          All Posts
        </Link>

        {/* Cover image */}
        {blog.cover_image && (
          <div className="mb-8 aspect-video overflow-hidden rounded-2xl border border-[#262626]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blog.cover_image} alt={blog.title} className="h-full w-full object-cover" />
          </div>
        )}

        {/* Header */}
        <div className="space-y-4 animate-slide-up delay-1">
          {blog.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#10B981]/10 px-2.5 py-1 text-xs font-medium text-[#10B981]">
              <span className="h-1 w-1 rounded-full bg-[#10B981]" />
              Featured
            </span>
          )}

          <h1 className="text-4xl font-bold text-white leading-tight">{blog.title}</h1>

          <div className="flex items-center gap-3 text-base text-[#737373]">
            {(blog.author as any)?.name && (
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {(blog.author as any).name}
              </span>
            )}
            {blog.published_at && (
              <>
                <span className="text-[#3F3F3F]">·</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(blog.published_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="mt-6 text-xl text-[#A3A3A3] leading-relaxed border-l-2 border-[#10B981]/40 pl-4">
            {blog.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="mt-8 animate-slide-up delay-2">
          <div className="whitespace-pre-wrap text-[#D4D4D4] leading-relaxed text-lg">
            {blog.content}
          </div>
        </div>
      </div>
    </div>
  );
}
