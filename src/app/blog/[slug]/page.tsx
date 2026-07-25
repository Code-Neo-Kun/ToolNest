import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog-data";
import { getToolBySlug } from "@/lib/tools-registry";
import { ArrowLeft, Calendar, Clock, User, Wrench } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — ToolNest Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedTool = post.relatedToolSlug ? getToolBySlug(post.relatedToolSlug) : undefined;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      <header className="mb-8">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          {post.category}
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl leading-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-6">
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" /> {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readTime}
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed">
        {post.content.split("\n\n").map((paragraph, i) => {
          if (paragraph.startsWith("### ")) {
            return (
              <h3 key={i} className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">
                {paragraph.replace("### ", "")}
              </h3>
            );
          }
          if (paragraph.startsWith("1. ") || paragraph.startsWith("- ")) {
            return (
              <div key={i} className="pl-4 border-l-2 border-indigo-500 my-3 space-y-1">
                {paragraph.split("\n").map((line, j) => (
                  <p key={j} className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {line}
                  </p>
                ))}
              </div>
            );
          }
          return (
            <p key={i} className="text-slate-600 dark:text-slate-300">
              {paragraph.trim()}
            </p>
          );
        })}
      </div>

      {/* Related Tool CTA */}
      {relatedTool && (
        <div className="mt-12 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6 dark:border-indigo-900/50 dark:bg-indigo-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Try Related Tool</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
              <span>{relatedTool.icon}</span> {relatedTool.name}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{relatedTool.description}</p>
          </div>
          <Link
            href={`/tools/${relatedTool.slug}`}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Wrench className="h-4 w-4" /> Open Tool
          </Link>
        </div>
      )}
    </article>
  );
}
