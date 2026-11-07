import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionEmpty } from "@/components/art/CollectionEmpty";
import {
  CollectionPager,
  CollectionSwitcher,
} from "@/components/art/CollectionNav";
import { GalleryWall } from "@/components/art/GalleryWall";
import { presentation, surfaceClass } from "@/components/art/presentation";
import {
  SubjectFilter,
  SubjectFilterLinks,
} from "@/components/art/SubjectFilter";
import { RevealScope } from "@/components/motion/RevealScope";
import { CopyText } from "@/components/ui/CopyText";
import { artworksCopy } from "@/content/copy/artworks";
import {
  artworkName,
  getCollectionParams,
  getCollectionPage,
  getCollections,
  subjectLabel,
} from "@/lib/content/artworks";
import { cn } from "@/lib/cn";

/**
 * Everything on this page depends on the URL, so it renders as one piece
 * (not behind <Suspense>): the prerendered HTML contains the full page, it
 * works without JavaScript, and the thumbnail → artwork morph has its target.
 * Navigations may wait for this page's payload (links prefetch it); this
 * opts the route out of Next.js's instant-navigation check, as documented
 * for routes that are allowed to block.
 */
export const instant = false;

export async function generateStaticParams() {
  const params = await getCollectionParams();
  // Cache Components needs at least one param; "_" renders the 404.
  return params.length ? params : [{ collection: "_" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/artworks/[collection]">): Promise<Metadata> {
  const page = await getCollectionPage((await params).collection);
  if (!page) return {};
  return pageMetadata({
    title: page.collection.title,
    description: page.collection.summary.text,
    path: `/artworks/${page.collection.slug}`,
  });
}

export default async function CollectionPage({
  params,
}: PageProps<"/artworks/[collection]">) {
  const { collection: slug } = await params;
  const [page, collections] = await Promise.all([
    getCollectionPage(slug),
    getCollections(),
  ]);
  if (!page) notFound();

  const { collection, artworks, neighbours } = page;
  const look = presentation[collection.style];
  const subjects = collection.subjects.map((s) => ({
    slug: s,
    label: subjectLabel(s),
  }));
  const galleryId = `gallery-${collection.slug}`;
  const items = artworks.map((artwork, i) => ({
    artwork,
    frame: look.frame,
    label:
      artwork.title ??
      `${artworkName(artwork, collection)}, ${i + 1} of ${artworks.length}`,
  }));

  return (
    <>
      <RevealScope
        aria-labelledby="collection-title"
        className="page-x pt-32 pb-14 md:pt-40 lg:pb-20"
      >
        <div className="mx-auto max-w-page">
          <nav
            aria-label="Breadcrumb"
            className="eyebrow text-ink-muted"
            data-reveal
          >
            <Link href="/artworks" className="ink-link">
              Artworks
            </Link>
            <span aria-hidden="true" className="mx-3">
              /
            </span>
            <span aria-current="page">{collection.title}</span>
          </nav>
          <div className="mt-10 grid gap-x-6 gap-y-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow text-ink-muted" data-reveal>
                Collection {collection.number}
              </p>
              <h1
                id="collection-title"
                className="mt-4 font-display text-display-l"
                data-reveal="lines"
              >
                {collection.title}
              </h1>
            </div>
            <div
              className="flex flex-col gap-3 lg:col-span-4 lg:col-start-9"
              data-reveal
            >
              <CopyText
                as="p"
                copy={collection.summary}
                className="text-lede text-ink-muted"
              />
              {artworks.length > 0 && (
                <p className="eyebrow text-ink-muted tabular-nums">
                  {artworks.length} {artworks.length === 1 ? "work" : "works"}
                </p>
              )}
            </div>
          </div>
          <div className="mt-12" data-reveal>
            <CollectionSwitcher
              collections={collections}
              current={collection.slug}
            />
          </div>
        </div>
      </RevealScope>

      <RevealScope
        aria-label={`${collection.title}: works`}
        className={cn(
          "page-x",
          // Plain paper continues the header; notebook and sketchbook surfaces need their own margin.
          look.surface === "paper" ? "pb-14 lg:pb-20" : "py-14 lg:py-20",
          surfaceClass[look.surface],
        )}
      >
        <div className="mx-auto max-w-page">
          {artworks.length > 0 ? (
            <>
              {subjects.length > 1 && (
                <div className="mb-12 lg:mb-16">
                  <Suspense
                    fallback={
                      <SubjectFilterLinks subjects={subjects} active={null} />
                    }
                  >
                    <SubjectFilter subjects={subjects} galleryId={galleryId} />
                  </Suspense>
                </div>
              )}
              <GalleryWall
                id={galleryId}
                items={items}
                layout={look.layout}
                aria-label={`${collection.title}`}
              />
            </>
          ) : (
            <CollectionEmpty
              collection={collection.style}
              title={artworksCopy.empty.collectionTitle}
              text={artworksCopy.empty.collectionText}
              showAllLink
            />
          )}
        </div>
      </RevealScope>

      <div className="page-x py-section">
        <div className="mx-auto max-w-page">
          <CollectionPager
            previous={neighbours.previous}
            next={neighbours.next}
          />
        </div>
      </div>
    </>
  );
}
