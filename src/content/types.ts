/**
 * Content model. Mirrors the schema the CMS will expose (docs/03-architecture.md)
 * so swapping local data for Sanity queries does not touch components.
 *
 * Rules:
 * - Every descriptive field is optional. If ArtbyMoon has not supplied a fact
 *   (title, year, dimensions, price…), it stays undefined and the UI omits it.
 * - Placeholder material is marked `source: "placeholder"` and lives in
 *   src/content/placeholder/. Genuine artist-supplied content lives in
 *   src/content/artist/.
 * - Marketing and biography copy carries a `status`, so drafts stay
 *   identifiable until ArtbyMoon approves them (visible with `?review`).
 *   Text entered in the CMS by ArtbyMoon counts as approved.
 * - The same shapes come from either source (src/lib/content/source.ts):
 *   the local files, or Sanity via src/sanity/map.ts.
 */

/** URL segment of a collection. Open-ended: new collections can be added in the CMS. */
export type CollectionSlug = string;

/**
 * The five presentation presets (layout, frame, surface; see
 * components/art/presentation.ts). Every collection uses one of them, so a
 * new collection needs no new code.
 */
export type CollectionStyle =
  "canvas" | "abstract" | "polaroids" | "sketches" | "bookmarks";

/** Rich text from the CMS (Portable Text blocks), rendered on the server. */
export type RichText = {
  _type: string;
  _key?: string;
  [key: string]: unknown;
}[];

/** Accent pigments sampled from ArtbyMoon's own palette (see globals.css). */
export type Pigment =
  | "vermilion"
  | "cobalt"
  | "indigo"
  | "turquoise"
  | "lavender"
  | "rose"
  | "sap"
  | "ochre";

/** Width / height, e.g. 4/5 = 0.8 for a portrait canvas. */
export interface AspectRatio {
  w: number;
  h: number;
}

export type PlaceholderKind =
  "canvas" | "abstract" | "polaroid" | "sketch" | "bookmark" | "photo";

/** Where a piece of content came from. Only "artist" may ship at launch. */
export type Source = "artist" | "placeholder";

/** A piece of interface copy and whether ArtbyMoon has approved it. */
export interface Copy {
  text: string;
  status: "draft" | "approved";
}

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  /** Required. Describes what is depicted, written or approved by ArtbyMoon. */
  alt: string;
  /** 0–1 coordinates; used only when a crop is unavoidable (photography, covers). */
  focalPoint?: { x: number; y: number };
  /** Base64 LQIP generated at build/CMS time. */
  blurDataURL?: string;
  /** Dominant colour sampled from the image, shown while it loads. */
  dominantColor?: string;
  /**
   * Optional full-resolution master when `src` is a downsized web master.
   * Used by the full-screen viewer. Keep originals ≥ 3000px on the long edge
   * (docs/04-image-strategy.md); next/image derives every smaller size.
   */
  original?: { src: string; width: number; height: number };
}

export type Media =
  | { kind: "image"; image: ImageAsset }
  | {
      kind: "placeholder";
      placeholder: PlaceholderKind;
      aspect: AspectRatio;
      pigment?: Pigment;
    };

export type Availability =
  "available" | "sold" | "not-for-sale" | "commission-only";

/** An extra view of an artwork (detail, in context, back of a bookmark). */
export interface ArtworkView {
  media: Media;
  /** Short label supplied with the photo, e.g. "Detail" or "Back". */
  caption?: string;
}

export interface Artwork {
  id: string;
  /** Stable URL segment: /artworks/[collection]/[slug]. Never reuse a slug. */
  slug: string;
  collection: CollectionSlug;
  media: Media;
  /** Additional views: detail macro, in-context, back of bookmark. */
  gallery?: ArtworkView[];
  /** Position within its collection (ascending). Unordered works follow, in file order. */
  order?: number;
  title?: string;
  year?: number;
  medium?: string;
  dimensions?: {
    width: number;
    height: number;
    depth?: number;
    unit: "cm" | "in";
  };
  /** Subject tags within a collection, e.g. "landscapes". */
  subjects?: string[];
  /** Cross-collection series, e.g. "Autumn Love" (doc 03). */
  series?: string[];
  availability?: Availability;
  /** Polaroids: the handwritten caption, transcribed by ArtbyMoon. */
  caption?: string;
  /** Factual description supplied with the work. */
  description?: string;
  /** ArtbyMoon's own words: a note or the story behind the piece. Never ghost-written. */
  note?: string;
  /** Feature on the homepage. */
  featured?: boolean;
  /** Overrides for search results and social previews (CMS). */
  seoTitle?: string;
  seoDescription?: string;
}

export interface Collection {
  slug: CollectionSlug;
  /** Which of the five presentation presets this collection uses. */
  style: CollectionStyle;
  title: string;
  /** One work from the collection, e.g. "Canvas painting". Used when a title is unknown. */
  singular: string;
  summary: Copy;
  pigment: Pigment;
  /** Cover chosen in the CMS; otherwise the first artwork is used. */
  coverImage?: Media;
  /** Listed first in the homepage index. */
  featured?: boolean;
}

/** A thumbnail that links somewhere: the unit of every homepage preview. */
export interface PreviewItem {
  id: string;
  href: `/${string}`;
  /** Accessible name. The artwork title when known. */
  label: string;
  media: Media;
  source: Source;
}

/** A subject within the canvas collection, previewed on the homepage. */
export interface CanvasSubject {
  slug: "landscapes" | "portraits" | "animals" | "flowers";
  title: string;
  preview: PreviewItem;
}

/** One row of the homepage "Explore the work" index. */
export interface ExploreRoom {
  href: `/${string}`;
  title: string;
  summary: Copy;
  preview: Media;
}

export type WorkshopStatus =
  "to-be-announced" | "open" | "waitlist" | "full" | "past";

export interface Workshop {
  slug: string;
  status: WorkshopStatus;
  title?: string;
  /** ISO 8601 with offset. */
  startsAt?: string;
  /** IANA zone the workshop happens in, so times never shift with the server. */
  timeZone?: string;
  durationMinutes?: number;
  location?: string;
  /** Free text so currency and inclusions stay in ArtbyMoon's wording. */
  priceLabel?: string;
  seats?: number;
  /** External booking/registration page (no in-house payments in v1). */
  bookingUrl?: string;
  /** How to book when there is no link, in ArtbyMoon's words. */
  bookingNote?: string;
  /** ISO 8601: last moment to register. */
  registrationDeadline?: string;
  summary?: string;
  cover?: Media;
}

export type JournalCategory =
  "story" | "process" | "announcement" | "exhibition" | "workshop";

export interface JournalPost {
  slug: string;
  title: string;
  category: JournalCategory;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  excerpt?: string;
  cover?: Media;
  /** Full post body (CMS only). Local posts have none. */
  body?: RichText;
  seoTitle?: string;
  seoDescription?: string;
}

export interface JournalCategoryInfo {
  slug: JournalCategory;
  title: string;
  description: Copy;
}

/** A photograph in the visual journal (/photography). */
export interface Photograph {
  /** Stable id; never reuse. */
  id: string;
  image: ImageAsset;
  /** Each optional field renders only when supplied. */
  title?: string;
  caption?: string;
  /** ISO date (YYYY-MM-DD) or year-month (YYYY-MM). */
  takenAt?: string;
  location?: string;
  /** Free-form category, e.g. "Behind the scenes". Filters appear only when there are enough photographs. */
  category?: string;
  /** Extra frames from the same moment, shown after the main image in the viewer. */
  gallery?: ImageAsset[];
  /** Show in the homepage photography preview. */
  featured?: boolean;
  order?: number;
}

/** The About page: every field is ArtbyMoon's own (or approved) wording. */
export interface AboutContent {
  /** Display name; the site name stays fixed in code. */
  name?: string;
  intro?: Copy;
  biography: Copy[];
  /** Rich biography from the CMS (links, emphasis); preferred over `biography`. */
  biographyBlocks?: RichText;
  instagramUrl?: string;
  /** Extra contact lines she chooses to publish, e.g. an email. */
  contact?: { label: string; value: string; href?: string }[];
  /** A portrait or studio photograph she supplies. Never a stand-in. */
  portrait?: { image: ImageAsset; caption?: string };
  practice: {
    /** What she makes: confirmed context only. */
    summary?: Copy;
    materials?: string[];
    inspirations?: string[];
    /** Her own words on how she works. */
    approach?: Copy;
  };
}
