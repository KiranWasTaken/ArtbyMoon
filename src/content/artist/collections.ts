import type { Collection } from "../types";

/**
 * Collections from the brief, plus Polaroids (added in Phase 2: one of
 * ArtbyMoon's own Instagram highlights). Order sets the "Collection 0n" numbers
 * used across the homepage. Summaries restate the brief and are drafts until
 * ArtbyMoon rewrites them.
 */
export const collections: Collection[] = [
  {
    slug: "canvas",
    style: "canvas",
    singular: "Canvas painting",
    title: "Canvas paintings",
    summary: {
      text: "Acrylic on canvas: landscapes, portraits, animals, flowers and expressive subjects.",
      status: "draft",
    },
    pigment: "vermilion",
  },
  {
    slug: "abstract",
    style: "abstract",
    singular: "Abstract work",
    title: "Abstract",
    summary: { text: "Abstract compositions in acrylic.", status: "draft" },
    pigment: "cobalt",
  },
  {
    slug: "polaroids",
    style: "polaroids",
    singular: "Polaroid",
    title: "Polaroids",
    summary: {
      text: "Small paintings in white polaroid-style frames, each finished with a handwritten caption.",
      status: "draft",
    },
    pigment: "turquoise",
  },
  {
    slug: "sketches",
    style: "sketches",
    singular: "Sketch",
    title: "Sketches",
    summary: {
      text: "Sketches, greeting cards, seasonal pieces and creative experiments.",
      status: "draft",
    },
    pigment: "ochre",
  },
  {
    slug: "bookmarks",
    style: "bookmarks",
    singular: "Bookmark",
    title: "Bookmarks",
    summary: {
      text: "Small handmade bookmarks with paintings, calligraphy, quotations and illustrations.",
      status: "draft",
    },
    pigment: "rose",
  },
];

export function getCollection(
  slug: Collection["slug"],
): Collection & { number: string } {
  const index = collections.findIndex((c) => c.slug === slug);
  const collection = collections[index];
  if (!collection) throw new Error(`Unknown collection: ${slug}`);
  return { ...collection, number: String(index + 1).padStart(2, "0") };
}
