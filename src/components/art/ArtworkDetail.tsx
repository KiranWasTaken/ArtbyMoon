import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { ArtMedia } from "@/components/ui/ArtMedia";
import { CopyText } from "@/components/ui/CopyText";
import { LinkButton } from "@/components/ui/LinkButton";
import { artworksCopy } from "@/content/copy/artworks";
import type { Artwork, Availability, Collection } from "@/content/types";
import { artworkHref, artworkName, subjectLabel } from "@/lib/content/artworks";
import { cn, cssVars } from "@/lib/cn";
import { site } from "@/lib/site";
import { morphName } from "./ArtworkThumb";
import { ArtworkViewer } from "./ArtworkViewer";
import { type Frame, ratioOf } from "./presentation";

/**
 * The work at its natural ratio, as large as the screen allows: width is
 * capped so the height never exceeds ~76% of the viewport. Mounted when the
 * collection uses mounts. Carries the shared-element name so a gallery
 * thumbnail morphs into it.
 */
export function ArtworkHero({
  artwork,
  name,
  frame,
}: {
  artwork: Artwork;
  name: string;
  frame: Frame;
}) {
  const mounted = frame === "mount" || frame === "tape";
  return (
    <figure className="flex flex-col items-center gap-5">
      <div
        className={cn(
          "w-[min(100%,calc(76svh*var(--r)+2*var(--pad)))] p-(--pad)",
          mounted && "border border-line bg-surface-raised shadow-rest",
        )}
        style={cssVars({
          "--r": String(ratioOf(artwork.media)),
          "--pad": mounted ? "clamp(0.75rem, 2.5vw, 2.25rem)" : "0px",
        })}
      >
        <ViewTransition name={morphName(artwork)} share="morph" default="none">
          <ArtMedia
            media={artwork.media}
            sizes="(min-width: 64rem) 62vw, 100vw"
            quality={85}
            preload
            className={cn("h-auto w-full", !mounted && "shadow-rest")}
          />
        </ViewTransition>
      </div>
      {artwork.media.kind === "image" && (
        <figcaption>
          <ArtworkViewer media={artwork.media} name={name} />
        </figcaption>
      )}
    </figure>
  );
}

/** Extra photographs supplied with the work (detail, in context, back). */
export function ArtworkViews({
  artwork,
  name,
}: {
  artwork: Artwork;
  name: string;
}) {
  if (!artwork.gallery?.length) return null;
  return (
    <section aria-label={`More views of ${name}`} className="mt-16">
      <ul className="grid gap-6 sm:grid-cols-2">
        {artwork.gallery.map((view, i) => (
          <li key={i}>
            <figure>
              <div data-reveal="unveil" className="overflow-hidden">
                <ArtMedia
                  media={view.media}
                  sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 50vw, 100vw"
                />
              </div>
              {view.caption && (
                <figcaption className="mt-3 text-caption text-ink-muted">
                  {view.caption}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

const availabilityLabel: Record<Availability, string> = {
  available: "Available",
  sold: "Sold",
  "not-for-sale": "Not for sale",
  "commission-only": "By commission",
};

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-line py-3">
      <dt className="eyebrow pt-1 text-ink-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** Wall label: only facts that were supplied. Nothing is shown "to be confirmed" here. */
export function ArtworkFacts({ artwork }: { artwork: Artwork }) {
  const { medium, dimensions, year, subjects, series, availability } = artwork;
  const size =
    dimensions &&
    `${dimensions.width} × ${dimensions.height}${dimensions.depth ? ` × ${dimensions.depth}` : ""} ${dimensions.unit}`;
  if (
    !medium &&
    !size &&
    !year &&
    !subjects?.length &&
    !series?.length &&
    !availability
  )
    return null;
  return (
    <dl className="border-b border-line">
      {medium && <Fact label="Medium">{medium}</Fact>}
      {size && <Fact label="Size">{size}</Fact>}
      {year && <Fact label="Year">{year}</Fact>}
      {subjects?.length ? (
        <Fact label="Subject">
          <ul className="flex flex-wrap gap-x-3">
            {subjects.map((s) => (
              <li key={s}>
                <Link
                  href={`/artworks/${artwork.collection}?subject=${s}`}
                  className="ink-link"
                >
                  {subjectLabel(s)}
                </Link>
              </li>
            ))}
          </ul>
        </Fact>
      ) : null}
      {series?.length ? <Fact label="Series">{series.join(", ")}</Fact> : null}
      {availability && (
        <Fact label="Availability">{availabilityLabel[availability]}</Fact>
      )}
    </dl>
  );
}

/** Story: caption (polaroids), description, and ArtbyMoon's own note, each only when supplied. */
export function ArtworkStory({ artwork }: { artwork: Artwork }) {
  const { caption, description, note } = artwork;
  if (!caption && !description && !note) return null;
  return (
    <div className="flex flex-col gap-8">
      {caption && (
        <figure>
          <blockquote className="font-display text-title italic">
            “{caption}”
          </blockquote>
          <figcaption className="eyebrow mt-2 text-ink-muted">
            Caption on the polaroid
          </figcaption>
        </figure>
      )}
      {description && <p className="text-ink-muted">{description}</p>}
      {note && (
        <figure className="border-l-2 border-accent pl-5">
          <figcaption className="eyebrow text-ink-muted">
            From ArtbyMoon
          </figcaption>
          <blockquote className="mt-2 font-display text-lede italic">
            {note}
          </blockquote>
        </figure>
      )}
    </div>
  );
}

/**
 * How to ask about the work. Today that is a direct message on Instagram
 * (her own "DM for order"). Never implies the work is for sale unless
 * availability says so.
 */
export function ArtworkEnquiry({
  artwork,
  name,
  collection,
}: {
  artwork: Artwork;
  name: string;
  collection: Collection;
}) {
  const copy = artworksCopy.enquiry;
  return (
    <section
      aria-labelledby="enquiry-title"
      className="bg-surface-raised p-6 shadow-rest md:p-8"
    >
      <CopyText
        as="h2"
        id="enquiry-title"
        copy={copy.title}
        className="font-display text-title"
      />
      <CopyText
        as="p"
        copy={artwork.availability === "sold" ? copy.sold : copy.body}
        className="mt-3 text-ink-muted"
      />
      <LinkButton
        href={site.instagram.messageUrl}
        variant="solid"
        className="mt-6"
      >
        Message @{site.instagram.handle}
      </LinkButton>
      <p className="mt-4 text-caption text-ink-muted">
        Mention:{" "}
        <span className="text-ink">{artwork.title ? `“${name}”` : name}</span>,{" "}
        {collection.title.toLowerCase()}{" "}
        <span className="tabular-nums">({artwork.slug})</span>
      </p>
      <Link href="/contact" className="ink-link eyebrow mt-5 inline-block">
        How to get in touch →
      </Link>
    </section>
  );
}

/** Previous / next within the collection, with small thumbnails. */
export function ArtworkPager({
  previous,
  next,
  collection,
  position,
}: {
  previous: Artwork | null;
  next: Artwork | null;
  collection: Collection;
  position: { index: number; total: number };
}) {
  const cell = (artwork: Artwork | null, dir: "Previous" | "Next") =>
    artwork ? (
      <Link
        href={artworkHref(artwork)}
        className={cn(
          "group flex items-center gap-4 p-5 transition-colors duration-300 hover:bg-surface-raised md:p-6",
          dir === "Next" && "flex-row-reverse text-right",
        )}
      >
        <span className="w-14 shrink-0">
          <ArtMedia
            media={artwork.media}
            sizes="56px"
            decorative
            className="h-auto max-h-20 w-full object-contain"
          />
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="eyebrow text-ink-muted">
            {dir === "Previous" ? "← Previous" : "Next →"}
          </span>
          <span className="truncate font-display text-title group-hover:text-accent-ink">
            {artworkName(artwork, collection)}
          </span>
        </span>
      </Link>
    ) : (
      <span className="hidden sm:block" />
    );

  return (
    <nav
      aria-label={`More in ${collection.title}`}
      className="border-y border-line"
    >
      <div className="grid sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        {cell(previous, "Previous")}
        <p className="eyebrow order-first border-b border-line p-4 text-center text-ink-muted tabular-nums sm:order-none sm:border-b-0">
          {position.index} / {position.total}
        </p>
        {cell(next, "Next")}
      </div>
    </nav>
  );
}
