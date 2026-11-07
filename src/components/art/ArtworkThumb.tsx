import Link from "next/link";
import { ViewTransition } from "react";
import type { Artwork } from "@/content/types";
import { ArtMedia } from "@/components/ui/ArtMedia";
import { artworkHref } from "@/lib/content/artworks";
import { cn, cssVars } from "@/lib/cn";
import type { Frame } from "./presentation";

interface ArtworkThumbProps {
  artwork: Artwork;
  /** Accessible name: the title, or e.g. "Canvas painting, 3 of 5". */
  label: string;
  frame: Frame;
  sizes: string;
  /** Resting tilt in degrees, for prints on the table. */
  tilt?: number;
  /** Thread length in rem, for hanging bookmarks. */
  thread?: number;
}

const frameClass: Record<Frame, string> = {
  mount:
    "border border-line bg-surface-raised p-[6%] shadow-rest group-hover:shadow-lift",
  edge: "shadow-rest ring-1 ring-line group-hover:shadow-lift",
  print:
    "rotate-(--tilt) shadow-rest group-hover:rotate-0 group-hover:shadow-lift group-focus-visible:rotate-0",
  tape: "relative shadow-rest group-hover:shadow-lift",
  hang: "shadow-rest group-hover:shadow-lift",
};

/** Shared-element name: the same artwork's thumbnail and detail image morph. */
export const morphName = (artwork: Pick<Artwork, "id">) =>
  `artwork-${artwork.id}`;

/**
 * One artwork in a gallery. The caption sits below the image (never over it)
 * and only appears when a real title exists. The image reveals once on
 * scroll and lifts slightly on hover.
 */
export function ArtworkThumb({
  artwork,
  label,
  frame,
  sizes,
  tilt = 0,
  thread = 3,
}: ArtworkThumbProps) {
  return (
    <Link
      href={artworkHref(artwork)}
      aria-label={label}
      className="group block focus-visible:outline-offset-8"
    >
      <figure className="flex flex-col items-center">
        {frame === "hang" && (
          <span aria-hidden="true" className="flex flex-col items-center">
            <span className="relative z-10 h-5 w-2 rounded-[1px] bg-ochre/80 shadow-rest" />
            <span
              className="h-(--thread) w-px bg-line-strong/50"
              style={cssVars({ "--thread": `${thread}rem` })}
            />
          </span>
        )}
        <div
          className={cn(
            "w-full transition-[translate,rotate,box-shadow] duration-500 ease-brush group-hover:-translate-y-1",
            frameClass[frame],
          )}
          style={cssVars({ "--tilt": `${tilt}deg` })}
        >
          {frame === "tape" && (
            <span
              aria-hidden="true"
              className="tape -top-2 left-1/2 z-10 -translate-x-1/2 -rotate-2"
            />
          )}
          <div data-reveal="unveil" className="overflow-hidden">
            <div data-reveal-inner>
              <ViewTransition
                name={morphName(artwork)}
                share="morph"
                default="none"
              >
                <ArtMedia media={artwork.media} sizes={sizes} />
              </ViewTransition>
            </div>
          </div>
        </div>
        {artwork.title && (
          <figcaption className="mt-4 flex w-full items-baseline justify-between gap-3">
            <span className="font-display text-[1.0625rem] leading-snug transition-colors duration-300 group-hover:text-accent-ink">
              {artwork.title}
            </span>
            {artwork.year && (
              <span className="eyebrow shrink-0 text-ink-muted tabular-nums">
                {artwork.year}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    </Link>
  );
}
