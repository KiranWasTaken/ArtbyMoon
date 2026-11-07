import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CollectionEmpty } from "@/components/art/CollectionEmpty";
import { CollectionShelf } from "@/components/art/CollectionShelf";
import { GalleryWall, type GalleryItem } from "@/components/art/GalleryWall";
import type { Frame } from "@/components/art/presentation";
import { RevealScope } from "@/components/motion/RevealScope";
import { CopyText } from "@/components/ui/CopyText";
import { artworksCopy } from "@/content/copy/artworks";
import type { CollectionStyle } from "@/content/types";
import {
  artworkName,
  getArtworks,
  getCollections,
} from "@/lib/content/artworks";

export const metadata: Metadata = pageMetadata({
  title: "Artworks",
  description:
    "Paintings on canvas, abstract work, polaroids, sketches and hand-painted bookmarks by ArtbyMoon.",
  path: "/artworks",
});

/** On the mixed wall every work keeps a neutral frame; collection pages carry the character. */
const overviewFrame: Record<CollectionStyle, Frame> = {
  canvas: "mount",
  abstract: "edge",
  polaroids: "edge",
  sketches: "tape",
  bookmarks: "edge",
};

export default async function ArtworksPage() {
  const [collections, artworks] = await Promise.all([
    getCollections(),
    getArtworks(),
  ]);
  const copy = artworksCopy;
  const bySlug = new Map(collections.map((c) => [c.slug, c]));

  const items: GalleryItem[] = artworks.map((artwork) => {
    const collection = bySlug.get(artwork.collection)!;
    const siblings = artworks.filter(
      (a) => a.collection === artwork.collection,
    );
    return {
      artwork,
      frame: overviewFrame[collection.style],
      label: artwork.title
        ? `${artwork.title}, ${collection.singular.toLowerCase()}`
        : `${artworkName(artwork, collection)}, ${siblings.indexOf(artwork) + 1} of ${siblings.length}`,
    };
  });

  return (
    <>
      <RevealScope
        aria-labelledby="artworks-title"
        className="page-x pt-32 pb-section md:pt-40"
      >
        <div className="mx-auto grid max-w-page gap-x-6 gap-y-8 lg:grid-cols-12">
          <p
            className="eyebrow text-ink-muted lg:col-span-3 lg:pt-6"
            data-reveal
          >
            Artworks
          </p>
          <div className="lg:col-span-9">
            <CopyText
              as="h1"
              copy={copy.overview.title}
              id="artworks-title"
              className="font-display text-display-l"
              data-reveal="lines"
            />
            <CopyText
              as="p"
              copy={copy.overview.intro}
              className="mt-8 max-w-xl text-lede text-ink-muted"
              data-reveal
            />
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-page lg:mt-24">
          <CollectionShelf collections={collections} />
        </div>
      </RevealScope>

      <RevealScope
        aria-labelledby="all-work-title"
        className="page-x pb-section"
      >
        <div className="mx-auto max-w-page border-t border-line pt-section">
          <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 lg:mb-20">
            <CopyText
              as="h2"
              copy={copy.overview.galleryTitle}
              id="all-work-title"
              className="font-display text-display-m"
              data-reveal="lines"
            />
            {items.length > 0 && (
              <p className="eyebrow text-ink-muted tabular-nums">
                {items.length} {items.length === 1 ? "work" : "works"}
              </p>
            )}
          </div>
          {items.length > 0 ? (
            <GalleryWall
              id="all-work"
              items={items}
              layout="wall"
              aria-label="All artworks"
            />
          ) : (
            <CollectionEmpty
              collection="canvas"
              title={copy.empty.galleryTitle}
              text={copy.empty.galleryText}
              headingLevel="h3"
            />
          )}
        </div>
      </RevealScope>
    </>
  );
}
