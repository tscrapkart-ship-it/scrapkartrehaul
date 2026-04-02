import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-brand-dark">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href="/blogs"
          className="mb-8 flex items-center gap-1.5 text-sm text-white/50 hover:text-brand-accent transition-colors w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Posts
        </Link>

        {blog.cover_image && (
          <div className="mb-8 aspect-video overflow-hidden rounded-xl">
            <img src={blog.cover_image} alt={blog.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="space-y-4">
          {blog.is_featured && (
            <span className="rounded-full bg-brand-accent/10 px-3 py-1 text-sm text-brand-accent">Featured</span>
          )}

          <h1 className="text-3xl font-bold text-white leading-tight">{blog.title}</h1>

          <div className="flex items-center gap-3 text-sm text-white/40">
            {(blog.author as any)?.name && (
              <span>By {(blog.author as any).name}</span>
            )}
            {blog.published_at && (
              <>
                <span>·</span>
                <span>
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

        {blog.excerpt && (
          <p className="mt-6 text-lg text-white/60 leading-relaxed border-l-2 border-brand-accent/40 pl-4">
            {blog.excerpt}
          </p>
        )}

        <div className="mt-8 prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-white/80 leading-relaxed text-base">
            {blog.content}
          </div>
        </div>
      </div>
    </div>
  );
}
