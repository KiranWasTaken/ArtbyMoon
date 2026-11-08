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
 * (Sanity or local files; published content only, drafts only in an editor's
 * Draft Mode). Per collection, featured works are shown first; with none
 * featured, the newest works. Where placeholders are shown (see
 * showPlaceholders) they fill the remaining slots; in production, sections
 * show real work only.
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

/**
 * Labelled placeholders fill empty homepage slots in `next dev` and in the
 * sample-content preview, so layouts can be judged before content exists.
 * Production builds show only real, published work: empty slots are left
 * out and sections with nothing real are hidden (src/app/page.tsx).
 * Compared inline so the bundler can drop the unused branch.
 */
const showPlaceholders =
  process.env.NODE_ENV !== "production" ||
  process.env.ARTBYMOON_SAMPLE_CONTENT === "1";

/**
 * Real works first; placeholders fill the remaining slots where they are
 * shown, otherwise the list holds real works only (never more than the
 * section is designed for).
 */
function fillSlots(
  real: PreviewItem[],
  placeholders: PreviewItem[],
): PreviewItem[] {
  const items = showPlaceholders
    ? [...real, ...placeholders.slice(real.length)]
    : real;
  return items.slice(0, placeholders.length);
}

/** Newest first by creation date; works without a date keep their given order. */
function newestFirst(works: Artwork[]): Artwork[] {
  return works
    .map((work, index) => ({ work, index }))
    .toSorted((a, b) => {
      const ad = a.work.createdAt ?? "";
      const bd = b.work.createdAt ?? "";
      if (ad && bd && ad !== bd) return bd.localeCompare(ad);
      return a.index - b.index;
    })
    .map((x) => x.work);
}

/**
 * Which works a homepage section shows from a list (already published-only
 * and in display order): the featured ones, in display order; if none are
 * featured, the newest ones. Used per collection and per canvas subject.
 */
function homepageWorks(works: Artwork[]): Artwork[] {
  const featured = works.filter((a) => a.featured);
  return featured.length ? featured : newestFirst(works);
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
  const worksIn = (style: CollectionStyle) => {
    const c = byStyle(style);
    return c ? artworks.filter((a) => a.collection === c.slug) : [];
  };
  /** Featured works of a collection, or its newest if none is featured. */
  const selectedIn = (style: CollectionStyle) => homepageWorks(worksIn(style));

  // Each wall slot is shaped for one collection (a slim bookmark slot, a
  // polaroid slot…), so it only takes a work from that collection, and a
  // work appears on the wall once. In production an unfilled slot stays
  // empty (null) so the other pieces keep their places.
  const used = new Set<string>();
  const studioWall: (PreviewItem | null)[] = studioWallPlaceholders.map(
    (slot) => {
      const style = slot.href.split("/")[2] as CollectionStyle;
      const real = selectedIn(style).find((a) => !used.has(a.id));
      if (!real) return showPlaceholders ? relink(slot) : null;
      used.add(real.id);
      return toPreview(real);
    },
  );

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
      title: "Paint with Moon",
      summary: {
        text: "Painting sessions with ArtbyMoon. New dates will be announced here.",
        status: "draft",
      },
      preview: placeholderMedia("sketch", 4, 3, "vermilion"),
    },
  ];

  // Canvas cards are per subject: each takes a work with that subject
  // (featured first, otherwise newest), never the same work twice.
  const canvasWorks = worksIn("canvas");
  const canvasUsed = new Set<string>();
  const canvasSubjects = canvasSubjectPlaceholders.flatMap((subject) => {
    const real = homepageWorks(
      canvasWorks.filter(
        (a) => a.subjects?.includes(subject.slug) && !canvasUsed.has(a.id),
      ),
    )[0];
    if (real) {
      canvasUsed.add(real.id);
      return [{ ...subject, preview: toPreview(real) }];
    }
    return showPlaceholders
      ? [{ ...subject, preview: relink(subject.preview) }]
      : [];
  });
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
      subjects: canvasSubjects,
    },
    polaroids: {
      collection: sectionCollection("polaroids"),
      items: fillSlots(
        selectedIn("polaroids").map(toPreview),
        polaroidPlaceholders.map(relink),
      ),
    },
    bookmarks: {
      collection: sectionCollection("bookmarks"),
      items: fillSlots(
        selectedIn("bookmarks").map(toPreview),
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
