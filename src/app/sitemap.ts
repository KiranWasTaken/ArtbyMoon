import type { MetadataRoute } from "next";
import {
  getCollectionParams,
  getPublishedArtworkParams,
} from "@/lib/content/artworks";
import { getJournalPosts } from "@/lib/content/journal";
import { site } from "@/lib/site";

/**
 * Real, public routes only: published content from the active source. No
 * internal pages (/design-system, /studio), no 404 helpers, no sample
 * content, no drafts. lastModified only where a real date exists (journal
 * publication dates); none are invented. Refreshed by the same cache tags
 * as the pages, so new content appears after a webhook.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.indexable) return [];
  const url = (path: string) => new URL(path, site.url).toString();
  const [collections, artworks, posts] = await Promise.all([
    getCollectionParams(),
    getPublishedArtworkParams(),
    getJournalPosts(),
  ]);

  return [
    { url: url("/"), priority: 1 },
    { url: url("/artworks"), priority: 0.9 },
    ...collections.map((c) => ({
      url: url(`/artworks/${c.collection}`),
      priority: 0.8,
    })),
    ...artworks.map((a) => ({
      url: url(`/artworks/${a.collection}/${a.slug}`),
      priority: 0.7,
    })),
    { url: url("/photography"), priority: 0.8 },
    { url: url("/workshops"), priority: 0.6 },
    ...(posts.length
      ? [
          { url: url("/journal"), priority: 0.6 },
          ...posts.map((p) => ({
            url: url(`/journal/${p.slug}`),
            lastModified: p.publishedAt,
            priority: 0.5,
          })),
        ]
      : []),
    { url: url("/about"), priority: 0.6 },
    { url: url("/contact"), priority: 0.5 },
  ];
}
