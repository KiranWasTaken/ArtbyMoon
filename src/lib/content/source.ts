import { about as localAbout } from "@/content/artist/about";
import { artworks as localArtworks } from "@/content/artist/artworks";
import { collections as localCollections } from "@/content/artist/collections";
import { journalPosts as localJournalPosts } from "@/content/artist/journal";
import { photographs as localPhotographs } from "@/content/artist/photographs";
import { workshops as localWorkshops } from "@/content/artist/workshops";
import type {
  AboutContent,
  Artwork,
  Collection,
  JournalPost,
  Photograph,
  Workshop,
} from "@/content/types";
import { sanityConfigured } from "@/sanity/config";

/**
 * The one switch between content sources. Everything else in
 * src/lib/content/ (sorting, numbering, featured slots, filters) is shared.
 *
 * - "sanity": NEXT_PUBLIC_SANITY_PROJECT_ID is set. Published CMS content,
 *   cached on the server and refreshed by the webhook.
 * - "local": the typed files in src/content/artist/ (development fallback,
 *   and today's content). Sample-content mode only ever adds to this source.
 */
export const contentSource: "sanity" | "local" = sanityConfigured
  ? "sanity"
  : "local";

export interface ContentSource {
  collections(): Promise<Collection[]>;
  artworks(): Promise<Artwork[]>;
  photographs(): Promise<Photograph[]>;
  workshops(): Promise<Workshop[]>;
  journalPosts(): Promise<JournalPost[]>;
  journalPost(slug: string): Promise<JournalPost | null>;
  about(): Promise<AboutContent>;
}

const local: ContentSource = {
  collections: async () => localCollections,
  // Sample checks compare process.env inline so normal builds drop the
  // sample modules (and their images) entirely.
  artworks: async () => {
    if (process.env.ARTBYMOON_SAMPLE_CONTENT !== "1") return localArtworks;
    const { sampleArtworks } =
      await import("@/content/placeholder/sample-artworks");
    return [...localArtworks, ...sampleArtworks];
  },
  photographs: async () => {
    if (process.env.ARTBYMOON_SAMPLE_CONTENT !== "1") return localPhotographs;
    const { samplePhotographs } =
      await import("@/content/placeholder/sample-photographs");
    return [...localPhotographs, ...samplePhotographs];
  },
  workshops: async () => localWorkshops,
  journalPosts: async () => localJournalPosts,
  journalPost: async (slug) =>
    localJournalPosts.find((p) => p.slug === slug) ?? null,
  about: async () => localAbout,
};

let sanitySource: Promise<ContentSource> | undefined;

/** Active source. The Sanity module is only loaded when Sanity is configured. */
export function source(): Promise<ContentSource> {
  if (contentSource === "local") return Promise.resolve(local);
  sanitySource ??= import("@/sanity/source").then((m) => m.sanity);
  return sanitySource;
}

/** Local data, for callers that must never reach the network (e.g. sample-only paths). */
export const localSource = local;
