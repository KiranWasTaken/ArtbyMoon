import Link from "next/link";
import { ArtMedia } from "@/components/ui/ArtMedia";
import { CopyText } from "@/components/ui/CopyText";
import type { JournalCategoryInfo, JournalPost } from "@/content/types";
import { cn } from "@/lib/cn";
import { formatCalendarDate } from "@/lib/format";

/** Latest entries: the first one leads, the rest are compact rows. */
export function JournalList({
  posts,
  categories,
  headingLevel: H = "h3",
}: {
  posts: JournalPost[];
  categories: JournalCategoryInfo[];
  headingLevel?: "h2" | "h3" | "h4";
}) {
  const categoryTitle = (slug: JournalPost["category"]) =>
    categories.find((c) => c.slug === slug)?.title ?? slug;
  return (
    <ol className="flex flex-col">
      {posts.map((post, i) => (
        <li key={post.slug} className="border-t border-line last:border-b">
          <article
            className={cn(
              "group relative grid gap-3 py-6",
              i === 0 && "py-8 md:grid-cols-[1fr_12rem] md:gap-8",
            )}
          >
            <div className="flex flex-col gap-3">
              <p className="eyebrow flex flex-wrap gap-x-3 text-ink-muted">
                <time dateTime={post.publishedAt}>
                  {formatCalendarDate(post.publishedAt)}
                </time>
                <span aria-hidden="true">·</span>
                <span>{categoryTitle(post.category)}</span>
              </p>
              <H
                className={cn(
                  "font-display",
                  i === 0 ? "text-display-m" : "text-title",
                )}
              >
                <Link
                  href={`/journal/${post.slug}`}
                  className="group-hover:text-accent-ink after:absolute after:inset-0"
                >
                  {post.title}
                </Link>
              </H>
              {i === 0 && post.excerpt && (
                <p className="max-w-prose text-ink-muted">{post.excerpt}</p>
              )}
            </div>
            {i === 0 && post.cover && (
              <div className="row-start-1 md:row-start-auto">
                <ArtMedia media={post.cover} sizes="12rem" decorative />
              </div>
            )}
          </article>
        </li>
      ))}
    </ol>
  );
}

/**
 * Nothing published yet: show the journal's contents page instead of
 * invented articles. Each section reads "No entries yet" against a dotted
 * leader, like an index in a notebook.
 */
export function JournalContents({
  categories,
}: {
  categories: JournalCategoryInfo[];
}) {
  return (
    <ol className="flex flex-col">
      {categories.map((category) => (
        <li
          key={category.slug}
          className="border-t border-line py-5 last:border-b"
        >
          <div className="flex items-baseline gap-3">
            <span className="font-display text-title">{category.title}</span>
            <span
              aria-hidden="true"
              className="min-w-6 flex-1 border-b border-dotted border-ink-faint"
            />
            <span className="eyebrow shrink-0 text-ink-muted">
              No entries yet
            </span>
          </div>
          <CopyText
            as="p"
            copy={category.description}
            className="mt-1 text-caption text-ink-muted"
          />
        </li>
      ))}
    </ol>
  );
}
