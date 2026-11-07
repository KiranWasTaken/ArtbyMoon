import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { ImageAsset } from "@/content/types";
import { isSanityImage, sanityOgImage } from "@/sanity/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArtworkEnquiry,
  ArtworkFacts,
  ArtworkHero,
  ArtworkPager,
  ArtworkStory,
  ArtworkViews,
} from "@/components/art/ArtworkDetail";
import { GalleryWall } from "@/components/art/GalleryWall";
import { presentation } from "@/components/art/presentation";
import { RevealScope } from "@/components/motion/RevealScope";
import {
  artworkHref,
  artworkName,
  getArtworkPage,
  getArtworkParams,
} from "@/lib/content/artworks";
import { site } from "@/lib/site";

/**
 * Everything on this page depends on the URL, so it renders as one piece
 * (not behind <Suspense>): the prerendered HTML contains the full page, it
 * works without JavaScript, and the thumbnail → artwork morph has its target.
 * Navigations may wait for this page's payload (links prefetch it); this
 * opts the route out of Next.js's instant-navigation check, as documented
 * for routes that are allowed to block.
 */
export const instant = false;

/** Placeholder param while no artworks exist: Cache Components needs at least one (renders a 404). */
const NO_ARTWORKS = { collection: "canvas", slug: "_" };

export async function generateStaticParams() {
  const params = await getArtworkParams();
  return params.length ? params : [NO_ARTWORKS];
}

export async function generateMetadata({
  params,
}: PageProps<"/artworks/[collection]/[slug]">): Promise<Metadata> {
  const { collection, slug } = await params;
  const page = await getArtworkPage(collection, slug);
  if (!page) return {};
  const name = artworkName(page.artwork, page.collection);
  const media = page.artwork.media;
  return pageMetadata({
    title: page.artwork.seoTitle ?? `${name} · ${page.collection.title}`,
    description:
      page.artwork.seoDescription ??
      page.artwork.description ??
      `${page.collection.singular} by ${site.name}.`,
    path: artworkHref(page.artwork),
    // The artwork's own photograph when there is one; otherwise the site
    // default. Sanity images are requested as a 1200px JPEG for crawlers.
    images: media.kind === "image" ? [ogImage(media.image)] : undefined,
  });
}

function ogImage(image: ImageAsset) {
  if (!isSanityImage(image.src)) {
    return {
      url: image.src,
      width: image.width,
      height: image.height,
      alt: image.alt,
    };
  }
  const width = Math.min(1200, image.width);
  return {
    url: sanityOgImage(image.src, width),
    width,
    height: Math.round((image.height / image.width) * width),
    alt: image.alt,
  };
}

/** schema.org VisualArtwork with supplied facts only. */
function jsonLd(page: NonNullable<Awaited<ReturnType<typeof getArtworkPage>>>) {
  const { artwork, collection } = page;
  const d = artwork.dimensions;
  const data = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    ...(artwork.title && { name: artwork.title }),
    artform: collection.singular,
    creator: { "@type": "Person", name: site.name, sameAs: site.instagram.url },
    url: new URL(artworkHref(artwork), site.url).toString(),
    ...(artwork.media.kind === "image" && {
      image: new URL(artwork.media.image.src, site.url).toString(),
    }),
    ...(artwork.medium && { artMedium: artwork.medium }),
    ...(artwork.year && { dateCreated: String(artwork.year) }),
    ...(d && {
      width: { "@type": "Distance", name: `${d.width} ${d.unit}` },
      height: { "@type": "Distance", name: `${d.height} ${d.unit}` },
    }),
    ...(artwork.description && { description: artwork.description }),
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function ArtworkPage({
  params,
}: PageProps<"/artworks/[collection]/[slug]">) {
  const { collection: collectionSlug, slug } = await params;
  const page = await getArtworkPage(collectionSlug, slug);
  if (!page) notFound();

  const { artwork, collection, previous, next, related, position } = page;
  const look = presentation[collection.style];
  const name = artworkName(artwork, collection);

  return (
    <>
      <article
        aria-labelledby="artwork-title"
        className="page-x pt-28 md:pt-32"
      >
        <div className="mx-auto max-w-page">
          <nav aria-label="Breadcrumb" className="eyebrow text-ink-muted">
            <Link href="/artworks" className="ink-link">
              Artworks
            </Link>
            <span aria-hidden="true" className="mx-3">
              /
            </span>
            <Link href={`/artworks/${collection.slug}`} className="ink-link">
              {collection.title}
            </Link>
          </nav>

          <div className="mt-10 grid gap-x-10 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ArtworkHero artwork={artwork} name={name} frame={look.frame} />
              <ArtworkViews artwork={artwork} name={name} />
            </div>

            <RevealScope aria-label="About this work" className="lg:col-span-4">
              <div className="flex flex-col gap-10 lg:sticky lg:top-28">
                <header data-reveal>
                  <p className="eyebrow text-ink-muted">
                    Collection {collection.number} · {collection.title}
                  </p>
                  <h1
                    id="artwork-title"
                    className="mt-4 font-display text-display-m text-balance"
                  >
                    {name}
                  </h1>
                </header>
                <div data-reveal className="empty:hidden">
                  <ArtworkFacts artwork={artwork} />
                </div>
                <div data-reveal className="empty:hidden">
                  <ArtworkStory artwork={artwork} />
                </div>
                <div data-reveal className="empty:hidden">
                  <ArtworkEnquiry
                    artwork={artwork}
                    name={name}
                    collection={collection}
                  />
                </div>
              </div>
            </RevealScope>
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(page) }}
        />
      </article>

      <div className="page-x pt-section">
        <div className="mx-auto max-w-page">
          <ArtworkPager
            previous={previous}
            next={next}
            collection={collection}
            position={position}
          />
        </div>
      </div>

      {related.length > 0 && (
        <RevealScope
          aria-labelledby="related-title"
          className="page-x py-section"
        >
          <div className="mx-auto max-w-page">
            <div className="mb-12 flex flex-wrap items-baseline justify-between gap-4 lg:mb-16">
              <h2
                id="related-title"
                className="font-display text-display-m"
                data-reveal="lines"
              >
                More from {collection.title}
              </h2>
              <Link
                href={`/artworks/${collection.slug}`}
                className="ink-link eyebrow"
              >
                All {collection.title.toLowerCase()} →
              </Link>
            </div>
            <GalleryWall
              id="related"
              layout={
                look.layout === "line" || look.layout === "table"
                  ? look.layout
                  : "wall"
              }
              aria-label={`More from ${collection.title}`}
              items={related.map((a) => ({
                artwork: a,
                frame: look.frame,
                label: artworkName(a, collection),
              }))}
            />
          </div>
        </RevealScope>
      )}
    </>
  );
}
