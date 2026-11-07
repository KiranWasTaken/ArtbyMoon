import { getCollection as localCollection } from "@/content/artist/collections";
import { profile } from "@/content/artist/profile";
import { homeCopy } from "@/content/copy/home";
import {
  bookmarkPlaceholders,
  canvasSubjectPlaceholders,
  photographPlaceholders,
  placeholderMedia,
  polaroidPlaceholders,
  studioWallPlaceholders,
} from "@/content/placeholder/artworks";
import type {
  Artwork,
  CollectionStyle,
  ExploreRoom,
  Media,
  Photograph,
  PreviewItem,
} from "@/content/types";
import {
  artworkHref,
  getArtworks,
  getCollections,
  type CollectionSummary,
} from "./artworks";
import { journalCategories, getJournalPosts } from "./journal";
import { getPhotographs } from "./photography";
import { getUpcomingWorkshops } from "./workshops";

/**
 * The homepage's single data source. Content comes from the active source
 * (Sanity or local files); real featured work replaces the labelled
 * placeholders slot by slot, so the design holds while content arrives.
 */

function toPreview(artwork: Artwork): PreviewItem {
  return {
    id: artwork.id,
    href: artworkHref(artwork),
    label: artwork.title ?? "Artwork, title to be confirmed",
    media: artwork.media,
    source: "artist",
  };
}

/** Real featured works first; placeholders fill whatever slots remain. */
function fillSlots(
  real: PreviewItem[],
  placeholders: PreviewItem[],
): PreviewItem[] {
  return [...real, ...placeholders.slice(real.length)].slice(
    0,
    placeholders.length,
  );
}

const PLACEHOLDER_PREVIEW: Record<CollectionStyle, Media> = {
  canvas: placeholderMedia("canvas", 4, 5, "sap"),
  abstract: placeholderMedia("abstract", 1, 1, "cobalt"),
  polaroids: placeholderMedia("polaroid", 0.82, 1, "turquoise"),
  sketches: placeholderMedia("sketch", 3, 4, "ochre"),
  bookmarks: placeholderMedia("bookmark", 1, 3.4, "rose"),
};

export async function getHomeContent() {
  const [artworks, collections, photographs, workshops, posts] =
    await Promise.all([
      getArtworks(),
      getCollections(),
      getPhotographs(),
      getUpcomingWorkshops(),
      getJournalPosts(),
    ]);

  // Homepage sections are designed around the five styles. Each finds its
  // collection by style, so collections renamed in the CMS still work.
  const byStyle = (style: CollectionStyle): CollectionSummary | null =>
    collections.find((c) => c.style === style) ?? null;
  const sectionCollection = (style: CollectionStyle) => {
    const c = byStyle(style);
    return c ? { ...c, number: c.number } : localCollection(style);
  };
  /** Placeholder links point at /artworks/<style>; rewrite to the real slug. */
  const relink = (item: PreviewItem): PreviewItem => {
    const [path, query] = item.href.split("?");
    const style = path?.split("/")[2] as CollectionStyle | undefined;
    if (!style || !path?.startsWith("/artworks/")) return item;
    const c = byStyle(style);
    const href = c
      ? `/artworks/${c.slug}${query ? `?${query}` : ""}`
      : "/artworks";
    return { ...item, href: href as `/${string}` };
  };
  const featuredIn = (style: CollectionStyle) => {
    const c = byStyle(style);
    return c
      ? artworks.filter((a) => a.collection === c.slug && a.featured)
      : [];
  };

  // Each wall slot is shaped for one collection (a slim bookmark slot, a
  // polaroid slot…), so it only takes a featured work from that collection.
  const used = new Set<string>();
  const studioWall = studioWallPlaceholders.map((slot) => {
    const style = slot.href.split("/")[2] as CollectionStyle;
    const real = featuredIn(style).find((a) => !used.has(a.id));
    if (!real) return relink(slot);
    used.add(real.id);
    return toPreview(real);
  });

  const explore: ExploreRoom[] = [
    // Featured collections first, otherwise display order.
    ...collections
      .toSorted(
        (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
      )
      .map((c) => ({
        href: `/artworks/${c.slug}` as const,
        title: c.title,
        summary: c.summary,
        preview: c.cover ?? PLACEHOLDER_PREVIEW[c.style],
      })),
    {
      href: "/photography",
      title: "Photography",
      summary: {
        text: "A separate visual journal, including behind-the-scenes work.",
        status: "draft",
      },
      preview: photographs[0]
        ? { kind: "image", image: photographs[0].image }
        : placeholderMedia("photo", 3, 2),
    },
    {
      href: "/workshops",
      title: "Workshops",
      summary: {
        text: "Art workshops. Future sessions will be announced here.",
        status: "draft",
      },
      preview: placeholderMedia("sketch", 4, 3, "vermilion"),
    },
  ];

  const canvasFeatured = featuredIn("canvas");
  const photoPreview = (p: Photograph): PreviewItem => ({
    id: p.id,
    href: "/photography",
    label: p.title ?? "Photograph",
    media: { kind: "image", image: p.image },
    source: "artist",
  });
  const featuredPhotos = photographs.filter((p) => p.featured);

  return {
    profile,
    copy: homeCopy,
    studioWall,
    explore,
    canvas: {
      collection: sectionCollection("canvas"),
      subjects: canvasSubjectPlaceholders.map((subject) => {
        const real = canvasFeatured.find((a) =>
          a.subjects?.includes(subject.slug),
        );
        return real
          ? { ...subject, preview: toPreview(real) }
          : { ...subject, preview: relink(subject.preview) };
      }),
    },
    polaroids: {
      collection: sectionCollection("polaroids"),
      items: fillSlots(
        featuredIn("polaroids").map(toPreview),
        polaroidPlaceholders.map(relink),
      ),
    },
    bookmarks: {
      collection: sectionCollection("bookmarks"),
      items: fillSlots(
        featuredIn("bookmarks").map(toPreview),
        bookmarkPlaceholders.map(relink),
      ),
    },
    // Featured photographs first; otherwise the most recent ones.
    photographs: fillSlots(
      (featuredPhotos.length ? featuredPhotos : photographs).map(photoPreview),
      photographPlaceholders,
    ),
    workshops,
    journal: {
      posts: posts.slice(0, 3),
      categories: journalCategories,
    },
  };
}

export type HomeContent = Awaited<ReturnType<typeof getHomeContent>>;
