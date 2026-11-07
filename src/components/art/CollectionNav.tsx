import Link from "next/link";
import type { Collection, CollectionSlug } from "@/content/types";
import type { CollectionSummary } from "@/lib/content/artworks";
import { cn } from "@/lib/cn";

/** All collections as a row of links; the current one is marked. Scrolls sideways on narrow screens. */
export function CollectionSwitcher({
  collections,
  current,
}: {
  collections: CollectionSummary[];
  current?: CollectionSlug;
}) {
  return (
    <nav aria-label="Collections">
      <ul className="-mx-gutter flex snap-x scroll-px-gutter [scrollbar-width:none] gap-2 overflow-x-auto px-gutter pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        <li className="shrink-0 snap-start">
          <Link
            href="/artworks"
            aria-current={current ? undefined : "page"}
            className={cn(
              "eyebrow inline-flex min-h-10 items-center rounded-full border px-4",
              current
                ? "border-line text-ink-muted hover:text-ink"
                : "border-ink bg-ink text-surface",
            )}
          >
            All
          </Link>
        </li>
        {collections.map((c) => (
          <li key={c.slug} className="shrink-0 snap-start">
            <Link
              href={`/artworks/${c.slug}`}
              aria-current={c.slug === current ? "page" : undefined}
              className={cn(
                "eyebrow inline-flex min-h-10 items-center gap-2 rounded-full border px-4 transition-colors duration-(--duration-ui)",
                c.slug === current
                  ? "border-ink bg-ink text-surface"
                  : "border-line text-ink-muted hover:border-line-strong hover:text-ink",
              )}
            >
              {c.title}
              {c.count > 0 && (
                <span className="tabular-nums opacity-60">{c.count}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Previous / next collection at the foot of a collection page. */
export function CollectionPager({
  previous,
  next,
}: {
  previous: Collection | null;
  next: Collection | null;
}) {
  return (
    <nav
      aria-label="More collections"
      className="grid border-y border-line sm:grid-cols-2 sm:divide-x sm:divide-line"
    >
      {[
        { c: previous, dir: "Previous collection", arrow: "←" },
        { c: next, dir: "Next collection", arrow: "→" },
      ].map(({ c, dir, arrow }, i) =>
        c ? (
          <Link
            key={dir}
            href={`/artworks/${c.slug}`}
            className={cn(
              "group flex flex-col gap-2 p-6 transition-colors duration-300 hover:bg-surface-raised md:p-8",
              i === 1 &&
                "border-t border-line sm:items-end sm:border-t-0 sm:text-right",
            )}
          >
            <span className="eyebrow text-ink-muted">
              {i === 0 && `${arrow} `}
              {dir}
              {i === 1 && ` ${arrow}`}
            </span>
            <span className="font-display text-title group-hover:text-accent-ink">
              {c.title}
            </span>
          </Link>
        ) : (
          <Link
            key={dir}
            href="/artworks"
            className={cn(
              "group flex flex-col gap-2 p-6 transition-colors duration-300 hover:bg-surface-raised md:p-8",
              i === 1 &&
                "border-t border-line sm:items-end sm:border-t-0 sm:text-right",
            )}
          >
            <span className="eyebrow text-ink-muted">Back to</span>
            <span className="font-display text-title group-hover:text-accent-ink">
              All collections
            </span>
          </Link>
        ),
      )}
    </nav>
  );
}
