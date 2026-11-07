import { collections as localCollections } from "@/content/artist/collections";
import type {
  AboutContent,
  Artwork,
  Availability,
  Collection,
  CollectionStyle,
  Copy,
  ImageAsset,
  JournalCategory,
  JournalPost,
  Media,
  Photograph,
  Pigment,
  RichText,
  Workshop,
  WorkshopStatus,
} from "@/content/types";

/**
 * Sanity results → the site's domain types (src/content/types.ts), so pages
 * and components are identical whichever source is active. Text written in
 * the CMS is ArtbyMoon's own, so it is marked approved. Missing fields stay
 * missing: nothing is filled in.
 */

export interface RawImage {
  alt?: string | null;
  url?: string | null;
  width?: number | null;
  height?: number | null;
  lqip?: string | null;
  color?: string | null;
}

const approved = (text: string): Copy => ({ text, status: "approved" });
const opt = <T>(v: T | null | undefined): T | undefined =>
  v === null ? undefined : v;
const clean = (s?: string | null) => (s && s.trim() ? s.trim() : undefined);

export function mapImage(
  raw: RawImage | null | undefined,
  fallbackAlt = "",
): ImageAsset | null {
  if (!raw?.url || !raw.width || !raw.height) return null;
  return {
    src: raw.url,
    width: raw.width,
    height: raw.height,
    alt: clean(raw.alt) ?? fallbackAlt,
    blurDataURL: opt(raw.lqip),
    dominantColor: opt(raw.color),
    // Sanity's CDN serves any width from the original, so the full-screen
    // viewer can request the original resolution through the same loader.
    original: { src: raw.url, width: raw.width, height: raw.height },
  };
}

const toMedia = (image: ImageAsset | null): Media | undefined =>
  image ? { kind: "image", image } : undefined;

// Collections ------------------------------------------------------------

const STYLES: CollectionStyle[] = [
  "canvas",
  "abstract",
  "polaroids",
  "sketches",
  "bookmarks",
];
const PIGMENT: Record<CollectionStyle, Pigment> = {
  canvas: "vermilion",
  abstract: "cobalt",
  polaroids: "turquoise",
  sketches: "ochre",
  bookmarks: "rose",
};

export interface RawCollection {
  slug: string;
  title?: string | null;
  singular?: string | null;
  style?: string | null;
  intro?: string | null;
  featured?: boolean | null;
  cover?: RawImage | null;
}

export function mapCollection(raw: RawCollection): Collection {
  const local = localCollections.find((c) => c.slug === raw.slug);
  const style: CollectionStyle = STYLES.includes(raw.style as CollectionStyle)
    ? (raw.style as CollectionStyle)
    : (local?.style ?? "canvas");
  const title = clean(raw.title) ?? local?.title ?? raw.slug;
  const intro = clean(raw.intro);
  return {
    slug: raw.slug,
    style,
    title,
    singular: clean(raw.singular) ?? local?.singular ?? title,
    // Her own introduction when written; until then the existing draft line
    // for the five original collections (still flagged in ?review mode).
    summary: intro ? approved(intro) : (local?.summary ?? approved("")),
    pigment: PIGMENT[style],
    coverImage: toMedia(mapImage(raw.cover, title)),
    featured: raw.featured === true,
  };
}

// Artworks ---------------------------------------------------------------

const AVAILABILITY: Availability[] = [
  "available",
  "sold",
  "not-for-sale",
  "commission-only",
];

export interface RawArtwork {
  id: string;
  slug: string;
  collection: string;
  title?: string | null;
  year?: number | null;
  medium?: string | null;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    unit?: string;
  } | null;
  subjects?: string[] | null;
  series?: string[] | null;
  availability?: string | null;
  featured?: boolean | null;
  order?: number | null;
  caption?: string | null;
  description?: string | null;
  note?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  image?: RawImage | null;
  gallery?: { caption?: string | null; image?: RawImage | null }[] | null;
}

export function mapArtwork(raw: RawArtwork): Artwork | null {
  const title = clean(raw.title);
  const image = mapImage(raw.image, title ?? "Artwork by ArtbyMoon");
  if (!image) return null;
  const d = raw.dimensions;
  return {
    id: raw.id,
    slug: raw.slug,
    collection: raw.collection,
    media: { kind: "image", image },
    gallery: raw.gallery
      ?.map((g) => ({
        media: toMedia(mapImage(g.image, title ?? "")),
        caption: clean(g.caption),
      }))
      .filter((g): g is { media: Media; caption: string | undefined } =>
        Boolean(g.media),
      ),
    order: opt(raw.order),
    title,
    year: opt(raw.year),
    medium: clean(raw.medium),
    dimensions:
      d?.width && d.height && (d.unit === "cm" || d.unit === "in")
        ? {
            width: d.width,
            height: d.height,
            depth: d.depth || undefined,
            unit: d.unit,
          }
        : undefined,
    subjects: raw.subjects?.length ? raw.subjects : undefined,
    series: raw.series?.length ? raw.series : undefined,
    availability: AVAILABILITY.includes(raw.availability as Availability)
      ? (raw.availability as Availability)
      : undefined,
    caption: clean(raw.caption),
    description: clean(raw.description),
    note: clean(raw.note),
    featured: raw.featured === true,
    seoTitle: clean(raw.seoTitle),
    seoDescription: clean(raw.seoDescription),
  };
}

// Photography ------------------------------------------------------------

export interface RawPhotograph {
  id: string;
  slug?: string | null;
  title?: string | null;
  caption?: string | null;
  location?: string | null;
  takenAt?: string | null;
  category?: string | null;
  featured?: boolean | null;
  order?: number | null;
  image?: RawImage | null;
  gallery?: RawImage[] | null;
}

export function mapPhotograph(raw: RawPhotograph): Photograph | null {
  const title = clean(raw.title);
  const image = mapImage(raw.image, title ?? "Photograph by ArtbyMoon");
  if (!image) return null;
  return {
    id: raw.id,
    image,
    title,
    caption: clean(raw.caption),
    location: clean(raw.location),
    takenAt: clean(raw.takenAt),
    category: clean(raw.category),
    gallery: raw.gallery
      ?.map((g) => mapImage(g, title ?? ""))
      .filter((g): g is ImageAsset => Boolean(g)),
    featured: raw.featured === true,
    order: opt(raw.order),
  };
}

// Workshops --------------------------------------------------------------

const WORKSHOP_STATUS: WorkshopStatus[] = [
  "to-be-announced",
  "open",
  "waitlist",
  "full",
  "past",
];

export interface RawWorkshop {
  slug: string;
  title?: string | null;
  status?: string | null;
  description?: string | null;
  startsAt?: string | null;
  timeZone?: string | null;
  durationMinutes?: number | null;
  venue?: string | null;
  price?: number | null;
  currency?: string | null;
  priceNote?: string | null;
  maxSeats?: number | null;
  registrationDeadline?: string | null;
  bookingUrl?: string | null;
  bookingNote?: string | null;
  cover?: RawImage | null;
}

function priceLabel(raw: RawWorkshop) {
  const note = clean(raw.priceNote);
  let amount: string | undefined;
  if (typeof raw.price === "number" && raw.currency) {
    try {
      amount = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: raw.currency,
      }).format(raw.price);
    } catch {
      amount = `${raw.price} ${raw.currency}`;
    }
  }
  return [amount, note].filter(Boolean).join(" · ") || undefined;
}

export function mapWorkshop(raw: RawWorkshop): Workshop {
  const title = clean(raw.title);
  return {
    slug: raw.slug,
    status: WORKSHOP_STATUS.includes(raw.status as WorkshopStatus)
      ? (raw.status as WorkshopStatus)
      : "to-be-announced",
    title,
    summary: clean(raw.description),
    startsAt: clean(raw.startsAt),
    timeZone: clean(raw.timeZone),
    durationMinutes: opt(raw.durationMinutes),
    location: clean(raw.venue),
    priceLabel: priceLabel(raw),
    seats: opt(raw.maxSeats),
    registrationDeadline: clean(raw.registrationDeadline),
    bookingUrl: clean(raw.bookingUrl),
    bookingNote: clean(raw.bookingNote),
    cover: toMedia(mapImage(raw.cover, title ?? "")),
  };
}

// Journal ----------------------------------------------------------------

const JOURNAL_CATEGORIES: JournalCategory[] = [
  "story",
  "process",
  "announcement",
  "exhibition",
  "workshop",
];

export interface RawJournalPost {
  slug: string;
  title?: string | null;
  categories?: string[] | null;
  publishedAt: string;
  excerpt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  cover?: RawImage | null;
  body?: RichText | null;
}

export function mapJournalPost(raw: RawJournalPost): JournalPost {
  const title = clean(raw.title) ?? "Untitled entry";
  const category = raw.categories?.find((c): c is JournalCategory =>
    JOURNAL_CATEGORIES.includes(c as JournalCategory),
  );
  return {
    slug: raw.slug,
    title,
    category: category ?? "story",
    publishedAt: raw.publishedAt.slice(0, 10),
    excerpt: clean(raw.excerpt),
    cover: toMedia(mapImage(raw.cover, "")),
    body: raw.body ?? undefined,
    seoTitle: clean(raw.seoTitle),
    seoDescription: clean(raw.seoDescription),
  };
}

// Artist profile ---------------------------------------------------------

export interface RawProfile {
  name?: string | null;
  intro?: string | null;
  biography?: RichText | null;
  instagramUrl?: string | null;
  practice?: string | null;
  materials?: string[] | null;
  inspirations?: string[] | null;
  approach?: string | null;
  contact?:
    | { label?: string | null; value?: string | null; href?: string | null }[]
    | null;
  portrait?:
    (RawImage & { caption?: string | null; image?: RawImage | null }) | null;
}

/** Profile from the CMS. Fields she has not filled in fall back to `fallback` (the local file). */
export function mapProfile(
  raw: RawProfile | null,
  fallback: AboutContent,
): AboutContent {
  if (!raw) return fallback;
  const intro = clean(raw.intro);
  const practice = clean(raw.practice);
  const approach = clean(raw.approach);
  const portrait = mapImage(
    raw.portrait?.image,
    clean(raw.name) ?? "ArtbyMoon",
  );
  return {
    name: clean(raw.name),
    intro: intro ? approved(intro) : fallback.intro,
    biography: [],
    biographyBlocks: raw.biography?.length ? raw.biography : undefined,
    instagramUrl: clean(raw.instagramUrl),
    contact: raw.contact
      ?.filter((c) => clean(c.label) && clean(c.value))
      .map((c) => ({
        label: clean(c.label)!,
        value: clean(c.value)!,
        href: clean(c.href),
      })),
    portrait: portrait
      ? { image: portrait, caption: clean(raw.portrait?.caption) }
      : undefined,
    practice: {
      summary: practice ? approved(practice) : fallback.practice.summary,
      materials: raw.materials?.length ? raw.materials : undefined,
      inspirations: raw.inspirations?.length ? raw.inspirations : undefined,
      approach: approach ? approved(approach) : undefined,
    },
  };
}
