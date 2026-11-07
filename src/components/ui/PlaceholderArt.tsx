import type { AspectRatio, Pigment, PlaceholderKind } from "@/content/types";
import { cn, cssVars } from "@/lib/cn";

const kindLabel: Record<PlaceholderKind, string> = {
  canvas: "Canvas painting",
  abstract: "Abstract work",
  polaroid: "Polaroid",
  sketch: "Sketch",
  bookmark: "Bookmark",
  photo: "Photograph",
};

interface PlaceholderArtProps {
  kind: PlaceholderKind;
  aspect: AspectRatio;
  pigment?: Pigment;
  className?: string;
  /**
   * Thumbnail beside text that already names it: hide the visible label and
   * remove it from the accessibility tree.
   */
  decorative?: boolean;
}

/**
 * A deliberately un-artlike stand-in for a photograph of ArtbyMoon's work.
 * It reserves the real aspect ratio (no layout shift when the photo lands)
 * and is always labelled, so it can never be mistaken for her artwork.
 */
export function PlaceholderArt({
  kind,
  aspect,
  pigment = "ochre",
  className,
  decorative = false,
}: PlaceholderArtProps) {
  const ratio = `${aspect.w}:${aspect.h}`;
  return (
    <div
      {...(decorative
        ? { "aria-hidden": true }
        : {
            role: "img",
            "aria-label": `Placeholder for a ${kindLabel[kind].toLowerCase()}, ${ratio}. Photograph to come.`,
          })}
      data-placeholder={kind}
      className={cn("placeholder-art", className)}
      style={cssVars({
        "--pigment": `var(--color-${pigment})`,
        "--ratio": `${aspect.w} / ${aspect.h}`,
      })}
    >
      {!decorative && (
        <span className="placeholder-art__label" aria-hidden="true">
          <span>Placeholder</span>
          <span>
            {kind === "polaroid" ? "Polaroid" : `${kindLabel[kind]} · ${ratio}`}
          </span>
        </span>
      )}
    </div>
  );
}
