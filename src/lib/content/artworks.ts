import type { Artwork, Collection, Media } from "@/content/types";
import { contentSource, localSource, source } from "./source";

/**
 * Artwork data access for galleries, collection pages and detail pages.
 * Content comes from the active source (Sanity or the local files, see
 * ./source.ts); all ordering and page logic lives here, once.
 */

/** Inlined at build time via next.config.ts. Never on by default. */
export const sampleMode = process.env.ARTBYMOON_SAMPLE_CONTENT === "1";

async function load() {
  const s = await source();
  const [collections, artworks] = await Promise.all([
    s.collections(),
    s.artworks(),
  ]);
  const index = new Map(collections.map((c, i) => [c.slug, i]));
  // Only works whose collection exists; collection order first, then
  // `order`, then source order (stable sort).
  const sorted = artworks
    .filter((a) => index.has(a.collection))
    .toSorted(
      (a, b) =>
        index.get(a.collection)! - index.get(b.collection)! ||
        (a.order ?? Infinity) - (b.order ?? Infinity),
    );
  return { collections, artworks: sorted, index };
}

export async function getArtworks(): Promise<Artwork[]> {
  return (await load()).artworks;
}

export interface CollectionSummary extends Collection {
  number: string;
  count: number;
  /** First artwork's media, used as the collection's cover. */
  cover: Media | null;
  /** Subject tags present in this collection, in order of first appearance. */
  subjects: string[];
}

function summarise(
  collection: Collection,
  index: number,
  all: Artwork[],
): CollectionSummary {
  const works = all.filter((a) => a.collection === collection.slug);
  return {
    ...collection,
    number: String(index + 1).padStart(2, "0"),
    count: works.length,
    cover: collection.coverImage ?? works[0]?.media ?? null,
    subjects: [...new Set(works.flatMap((a) => a.subjects ?? []))],
  };
}

export async function getCollections(): Promise<CollectionSummary[]> {
  const { collections, artworks } = await load();
  return collections.map((c, i) => summarise(c, i, artworks));
}

export async function getCollectionPage(slug: string) {
  const { collections, artworks, index } = await load();
  const i = index.get(slug);
  if (i === undefined) return null;
  const collection = summarise(collections[i]!, i, artworks);
  return {
    collection,
    artworks: artworks.filter((a) => a.collection === slug),
    neighbours: {
      previous: collections[i - 1] ?? null,
      next: collections[i + 1] ?? null,
    },
  };
}

export async function getArtworkPage(collectionSlug: string, slug: string) {
  const page = await getCollectionPage(collectionSlug);
  if (!page) return null;
  const index = page.artworks.findIndex((a) => a.slug === slug);
  const artwork = page.artworks[index];
  if (!artwork) return null;
  return {
    artwork,
    collection: page.collection,
    position: { index: index + 1, total: page.artworks.length },
    previous: page.artworks[index - 1] ?? null,
    next: page.artworks[index + 1] ?? null,
    related: page.artworks.filter((a) => a.id !== artwork.id).slice(0, 4),
  };
}

/** Every artwork route for prerendering (includes samples in a sample build). */
export async function getArtworkParams() {
  return (await getArtworks()).map((a) => ({
    collection: a.collection,
    slug: a.slug,
  }));
}

/** Collection routes for prerendering. */
export async function getCollectionParams() {
  return (await load()).collections.map((c) => ({ collection: c.slug }));
}

/**
 * Artworks that may be advertised to search engines: published artist
 * content only, never sample content (even in a sample-content build).
 */
export async function getPublishedArtworkParams() {
  const artworks =
    contentSource === "sanity" ? await getArtworks() : await localPublished();
  return artworks.map((a) => ({ collection: a.collection, slug: a.slug }));
}

async function localPublished() {
  const { artworks } = await import("@/content/artist/artworks");
  const slugs = new Set((await localSource.collections()).map((c) => c.slug));
  return artworks.filter((a) => slugs.has(a.collection));
}

export function artworkHref(
  artwork: Pick<Artwork, "collection" | "slug">,
): `/${string}` {
  return `/artworks/${artwork.collection}/${artwork.slug}`;
}

/** The visible name: the supplied title, or the collection's singular (never an invented title). */
export function artworkName(
  artwork: Artwork,
  collection: Pick<Collection, "singular">,
) {
  return artwork.title ?? collection.singular;
}

export function subjectLabel(subject: string) {
  return (
    subject.charAt(0).toUpperCase() + subject.slice(1).replaceAll("-", " ")
  );
}
