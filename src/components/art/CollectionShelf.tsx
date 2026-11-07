import Link from "next/link";
import { CopyText } from "@/components/ui/CopyText";
import { ArtMedia } from "@/components/ui/ArtMedia";
import type { CollectionSummary } from "@/lib/content/artworks";
import { cn } from "@/lib/cn";
import { EmptyFrame } from "./EmptyFrame";

/** Asymmetric spans so the five collections read as a curated shelf, not a grid of tiles. */
const span = [
  "lg:col-span-5 lg:row-span-2",
  "lg:col-span-4",
  "lg:col-span-3",
  "lg:col-span-4",
  "lg:col-span-3",
];

/**
 * Every collection, each with its first work as a cover, or the pencil
 * outline of its object while photographs are being prepared.
 */
export function CollectionShelf({
  collections,
}: {
  collections: CollectionSummary[];
}) {
  return (
    <ul
      aria-label="Collections"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-6"
    >
      {collections.map((c, i) => (
        <li key={c.slug} className={cn("flex", span[i])} data-reveal>
          <Link
            href={`/artworks/${c.slug}`}
            className="group flex w-full flex-col border border-line bg-surface-raised transition-[box-shadow,translate] duration-500 ease-brush hover:-translate-y-1 hover:shadow-lift"
          >
            {/* A definite box; the cover is fitted inside (never cropped, never resized on load). */}
            <div
              className={cn(
                "relative",
                i === 0
                  ? "aspect-[4/3] lg:aspect-auto lg:min-h-80 lg:flex-1"
                  : "aspect-[4/3]",
              )}
            >
              <div className="absolute inset-6 flex items-center justify-center md:inset-8">
                {c.cover ? (
                  <ArtMedia
                    media={c.cover}
                    sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 45vw, 90vw"
                    decorative
                    fit="contain"
                    className="drop-shadow-[0_6px_10px_rgb(27_26_23/0.18)]"
                  />
                ) : (
                  <EmptyFrame
                    collection={c.style}
                    className="h-full w-auto max-w-[70%] text-ink-faint"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 border-t border-line p-5 md:p-6">
              <div className="flex items-baseline justify-between gap-4">
                <span className="eyebrow text-ink-muted tabular-nums">
                  {c.number}
                </span>
                <span className="eyebrow text-ink-muted">
                  {c.count > 0
                    ? `${c.count} ${c.count === 1 ? "work" : "works"}`
                    : "Being prepared"}
                </span>
              </div>
              <span className="font-display text-title transition-colors duration-300 group-hover:text-accent-ink">
                {c.title}
              </span>
              <CopyText
                copy={c.summary}
                className="text-caption text-ink-muted"
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
