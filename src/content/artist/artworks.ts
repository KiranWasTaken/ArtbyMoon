import type { Artwork } from "../types";

/**
 * Real artworks, added as individual photographs and ArtbyMoon's metadata
 * arrive (docs/04-image-strategy.md). Empty until then: every homepage slot
 * falls back to a labelled placeholder.
 *
 * Example shape (do not uncomment with invented values):
 * {
 *   id: "canvas-…", slug: "…", collection: "canvas", featured: true,
 *   subjects: ["landscapes"],
 *   media: { kind: "image", image: { src: "/images/artworks/canvas-…-flat.jpg", width: 3000, height: 3750, alt: "…" } },
 * }
 */
export const artworks: Artwork[] = [];
