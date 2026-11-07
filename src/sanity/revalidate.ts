import type { ContentTag } from "./fetch";

/**
 * What a Sanity change affects. Pure: no Next.js APIs, easy to test.
 * The webhook projection (docs/08-cms-guide.md) sends:
 *   { _id, _type, "slug": slug.current, "collection": collection->slug.current }
 * For deletions and unpublishing, Sanity sends the same projection of the
 * document as it was, so its pages are refreshed too.
 */
export interface WebhookPayload {
  _id?: string;
  _type?: string;
  slug?: string | null;
  collection?: string | null;
}

export interface RevalidationPlan {
  /** Data to refetch from Sanity on next use. */
  tags: ContentTag[];
  /** Pages that show this content: expired, then requested once to rebuild them. */
  paths: string[];
  /**
   * Every existing page of these sections may show it (neighbouring and
   * related works; a renamed item's old address). The webhook expands this
   * to concrete URLs from the current route list.
   */
  sections?: ("artworks" | "journal")[];
}

const SAFE_SEGMENT = /^[a-z0-9][a-z0-9-]{0,95}$/;
const seg = (v: string | null | undefined) =>
  v && SAFE_SEGMENT.test(v) ? v : null;

export function planRevalidation(
  body: WebhookPayload,
): RevalidationPlan | null {
  // Drafts never reach public pages, so draft edits need no revalidation.
  if (!body._type || body._id?.startsWith("drafts.")) return null;
  const slug = seg(body.slug);
  const collection = seg(body.collection);

  switch (body._type) {
    case "artwork":
      return {
        tags: ["artwork"],
        paths: [
          "/",
          "/artworks",
          ...(collection ? [`/artworks/${collection}`] : []),
          ...(collection && slug ? [`/artworks/${collection}/${slug}`] : []),
          "/about",
          "/sitemap.xml",
        ],
        // Neighbouring and related works appear on other artwork pages too.
        sections: ["artworks"],
      };
    case "collection":
      return {
        tags: ["collection"],
        paths: [
          "/",
          "/artworks",
          ...(slug ? [`/artworks/${slug}`] : []),
          "/about",
          "/sitemap.xml",
        ],
        sections: ["artworks"],
      };
    case "photograph":
      return { tags: ["photograph"], paths: ["/", "/photography"] };
    case "workshop":
      return { tags: ["workshop"], paths: ["/", "/workshops"] };
    case "journalPost":
      return {
        tags: ["journal", ...(slug ? [`journal:${slug}` as const] : [])],
        paths: [
          "/",
          "/journal",
          ...(slug ? [`/journal/${slug}`] : []),
          "/sitemap.xml",
        ],
        // A renamed post keeps no stale copy at its old address.
        sections: ["journal"],
      };
    case "artistProfile":
      return { tags: ["profile"], paths: ["/about", "/contact"] };
    default:
      return null;
  }
}

/** Every tag, for a manual "refresh everything" (scripts/revalidate.mjs --all). */
export const ALL_TAGS: ContentTag[] = [
  "artwork",
  "collection",
  "photograph",
  "workshop",
  "journal",
  "profile",
];
