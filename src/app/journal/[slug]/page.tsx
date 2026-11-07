import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtMedia } from "@/components/ui/ArtMedia";
import { RichText } from "@/components/ui/RichText";
import {
  getJournalPost,
  getJournalPosts,
  journalCategories,
} from "@/lib/content/journal";
import { formatCalendarDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { isSanityImage, sanityOgImage } from "@/sanity/image";

export async function generateStaticParams() {
  const posts = await getJournalPosts();
  // Cache Components needs at least one param; "_" renders the 404.
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const post = await getJournalPost((await params).slug);
  if (!post) return {};
  const cover = post.cover?.kind === "image" ? post.cover.image : null;
  return pageMetadata({
    title: post.seoTitle ?? post.title,
    description:
      post.seoDescription ?? post.excerpt ?? `A journal entry by ArtbyMoon.`,
    path: `/journal/${post.slug}`,
    images: cover
      ? [
          {
            url: isSanityImage(cover.src)
              ? sanityOgImage(cover.src)
              : cover.src,
            alt: cover.alt,
          },
        ]
      : undefined,
  });
}

export default async function JournalPostPage({
  params,
}: PageProps<"/journal/[slug]">) {
  const post = await getJournalPost((await params).slug);
  if (!post) notFound();
  const category = journalCategories.find(
    (c) => c.slug === post.category,
  )?.title;

  return (
    <article
      aria-labelledby="post-title"
      className="page-x pt-32 pb-section md:pt-40"
    >
      <div className="mx-auto max-w-prose">
        <nav aria-label="Breadcrumb" className="eyebrow text-ink-muted">
          <Link href="/journal" className="ink-link">
            Journal
          </Link>
        </nav>
        <p className="eyebrow mt-10 flex flex-wrap gap-x-3 text-ink-muted">
          <time dateTime={post.publishedAt}>
            {formatCalendarDate(post.publishedAt)}
          </time>
          {category && (
            <>
              <span aria-hidden="true">·</span>
              <span>{category}</span>
            </>
          )}
        </p>
        <h1
          id="post-title"
          className="mt-4 font-display text-display-m text-balance"
        >
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-6 text-lede text-ink-muted">{post.excerpt}</p>
        )}
        {post.cover && (
          <div className="mt-10">
            <ArtMedia
              media={post.cover}
              sizes="(min-width: 40rem) 38rem, 100vw"
              preload
            />
          </div>
        )}
        {post.body && (
          <RichText value={post.body} className="mt-10 flex flex-col gap-5" />
        )}
      </div>
    </article>
  );
}
