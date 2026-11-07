import type { Copy } from "../types";

const draft = (text: string): Copy => ({ text, status: "draft" });

/**
 * Copy for /artworks, collection pages and artwork pages. All DRAFT until
 * ArtbyMoon approves or rewrites it (visible with ?review). Empty states speak
 * to visitors, never in development terms.
 */
export const artworksCopy = {
  overview: {
    title: draft("Work from the studio"),
    intro: draft(
      "Paintings on canvas, abstract studies, polaroids, sketches and hand-painted bookmarks, gathered by collection.",
    ),
    galleryTitle: draft("All work"),
  },
  empty: {
    galleryTitle: draft("The gallery is being hung"),
    galleryText: draft(
      "Photographs of the work are being prepared for this page. New pieces appear on Instagram first.",
    ),
    collectionTitle: draft("This collection is being prepared"),
    collectionText: draft(
      "Photographs of these pieces are on their way. In the meantime, new work appears on Instagram first.",
    ),
    note: draft("photographs on their way"),
  },
  enquiry: {
    title: draft("Interested in this piece?"),
    body: draft(
      "Send ArtbyMoon a message on Instagram and mention the work by name.",
    ),
    sold: draft(
      "This piece has found a home. You're welcome to ask about similar work or a commission.",
    ),
  },
} as const;
