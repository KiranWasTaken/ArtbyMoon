import { cacheLife, cacheTag } from "next/cache";
import { getArtworkParams, getCollectionParams } from "./artworks";
import { getJournalPosts } from "./journal";
import type { RouteManifest } from "./route-match";

/**
 * Every content URL that exists: collections, artworks ("collection/slug")
 * and journal posts. src/proxy.ts uses it (via /api/routes) to answer
 * unknown URLs with a real 404 before rendering.
 */
async function build(): Promise<RouteManifest> {
  const [collections, artworks, posts] = await Promise.all([
    getCollectionParams(),
    getArtworkParams(),
    getJournalPosts(),
  ]);
  return {
    collections: collections.map((c) => c.collection),
    artworks: artworks.map((a) => `${a.collection}/${a.slug}`),
    journal: posts.map((p) => p.slug),
  };
}

/**
 * Published routes, cached with the same tags as the content. The webhook
 * expires those tags immediately, so a new, renamed or removed artwork,
 * collection or post is reflected on the very next request, on every server.
 */
export async function getPublishedRoutes(): Promise<RouteManifest> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 31_536_000 });
  cacheTag("artwork", "collection", "journal");
  return build();
}

/** Routes including unpublished drafts. Call only when Draft Mode is enabled. */
export function getPreviewRoutes(): Promise<RouteManifest> {
  // The content functions re-run with the drafts perspective in Draft Mode
  // and their results are not cached (src/sanity/fetch.ts).
  return build();
}
