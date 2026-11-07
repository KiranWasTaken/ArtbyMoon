import "server-only";
import { about as localAbout } from "@/content/artist/about";
import type { ContentSource } from "@/lib/content/source";
import { sanityFetch } from "./fetch";
import {
  mapArtwork,
  mapCollection,
  mapJournalPost,
  mapPhotograph,
  mapProfile,
  mapWorkshop,
  type RawArtwork,
  type RawCollection,
  type RawJournalPost,
  type RawPhotograph,
  type RawProfile,
  type RawWorkshop,
} from "./map";
import {
  artworksQuery,
  collectionsQuery,
  journalPostQuery,
  journalPostsQuery,
  photographsQuery,
  profileQuery,
  workshopsQuery,
} from "./queries";

const notNull = <T>(v: T | null): v is T => v !== null;

/**
 * Sanity implementation of ContentSource. Each method is one cached query,
 * tagged by document type for webhook revalidation (src/sanity/revalidate.ts).
 */
export const sanity: ContentSource = {
  async collections() {
    const raw = await sanityFetch<RawCollection[]>({
      query: collectionsQuery,
      tags: ["collection"],
    });
    return raw.map(mapCollection);
  },
  async artworks() {
    const raw = await sanityFetch<RawArtwork[]>({
      query: artworksQuery,
      tags: ["artwork", "collection"],
    });
    return raw.map(mapArtwork).filter(notNull);
  },
  async photographs() {
    const raw = await sanityFetch<RawPhotograph[]>({
      query: photographsQuery,
      tags: ["photograph"],
    });
    return raw.map(mapPhotograph).filter(notNull);
  },
  async workshops() {
    const raw = await sanityFetch<RawWorkshop[]>({
      query: workshopsQuery,
      tags: ["workshop"],
    });
    return raw.map(mapWorkshop);
  },
  async journalPosts() {
    const raw = await sanityFetch<RawJournalPost[]>({
      query: journalPostsQuery,
      tags: ["journal"],
      previewParam: true,
    });
    return raw.map(mapJournalPost);
  },
  async journalPost(slug) {
    const raw = await sanityFetch<RawJournalPost | null>({
      query: journalPostQuery,
      params: { slug },
      // "journal" too: a renamed or deleted post is refreshed even though
      // the webhook only knows its current slug.
      tags: ["journal", `journal:${slug}`],
      previewParam: true,
    });
    return raw ? mapJournalPost(raw) : null;
  },
  async about() {
    const raw = await sanityFetch<RawProfile | null>({
      query: profileQuery,
      tags: ["profile"],
    });
    return mapProfile(raw, localAbout);
  },
};
