import Link from "next/link";
import { RevealScope } from "@/components/motion/RevealScope";
import { ArtMedia } from "@/components/ui/ArtMedia";
import { CopyText } from "@/components/ui/CopyText";
import { Crescent } from "@/components/ui/Crescent";
import { Handnote } from "@/components/ui/Handnote";
import { pagesCopy } from "@/content/copy/pages";
import { getAbout } from "@/lib/content/about";
import { getCollections } from "@/lib/content/artworks";
import { RichText } from "@/components/ui/RichText";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description:
    "About ArtbyMoon, an artist who paints mainly with acrylics on canvas and makes small handmade bookmarks.",
  path: "/about",
});

/** Short list of confirmed facts (materials, inspirations). */
function FactList({ label, items }: { label: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="border-t border-line pt-4">
      <h3 className="eyebrow text-ink-muted">{label}</h3>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-display text-title">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * An intimate profile, driven entirely by the artist profile (CMS, or
 * content/artist/about.ts in local mode). Sections
 * without confirmed content are left out rather than filled in.
 */
export default async function AboutPage() {
  const [collections, about] = await Promise.all([
    getCollections(),
    getAbout(),
  ]);
  const copy = pagesCopy.about;
  const { practice } = about;
  const hasPractice = Boolean(
    practice.summary ||
    practice.materials?.length ||
    practice.inspirations?.length ||
    practice.approach,
  );

  const rooms = [
    ...collections.map((c) => ({
      href: `/artworks/${c.slug}`,
      eyebrow: `Collection ${c.number}`,
      title: c.title,
    })),
    { href: "/photography", eyebrow: "Visual journal", title: "Photography" },
    { href: "/workshops", eyebrow: "Join in", title: "Paint with Moon" },
    { href: "/contact", eyebrow: "Say hello", title: "Contact" },
  ];

  return (
    <>
      <RevealScope
        aria-labelledby="about-title"
        className="page-x pt-32 pb-section md:pt-40"
      >
        <div className="mx-auto grid max-w-page gap-x-6 gap-y-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow text-ink-muted" data-reveal>
              About
            </p>
            <CopyText
              as="h1"
              id="about-title"
              copy={copy.title}
              className="mt-4 font-display text-display-l"
              data-reveal="lines"
            />
            {about.intro && (
              <CopyText
                as="p"
                copy={about.intro}
                className="mt-8 max-w-xl text-lede"
                data-reveal
              />
            )}
            <div
              className="mt-8 flex max-w-prose flex-col gap-5 text-ink-muted"
              data-reveal
            >
              {about.biographyBlocks ? (
                <RichText
                  value={about.biographyBlocks}
                  className="flex flex-col gap-5"
                />
              ) : about.biography.length > 0 ? (
                about.biography.map((paragraph, i) => (
                  <CopyText key={i} as="p" copy={paragraph} />
                ))
              ) : (
                <CopyText
                  as="p"
                  copy={copy.bioPending}
                  className="text-caption"
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            {about.portrait ? (
              <figure data-reveal="unveil" className="overflow-hidden">
                <ArtMedia
                  media={{ kind: "image", image: about.portrait.image }}
                  sizes="(min-width: 64rem) 30vw, 90vw"
                  preload
                />
                {about.portrait.caption && (
                  <figcaption className="mt-3 text-caption text-ink-muted">
                    {about.portrait.caption}
                  </figcaption>
                )}
              </figure>
            ) : (
              <div className="relative mx-auto w-48 md:w-64" data-reveal="draw">
                <Crescent
                  variant="line"
                  className="aspect-square w-full text-ink"
                />
                <Handnote className="absolute top-full right-1/2 mt-2 whitespace-nowrap">
                  @{site.instagram.handle}
                </Handnote>
              </div>
            )}
          </div>
        </div>
      </RevealScope>

      {hasPractice && (
        <RevealScope
          aria-labelledby="practice-title"
          className="page-x pb-section"
        >
          <div className="mx-auto grid max-w-page gap-x-6 gap-y-10 border-t border-line pt-section lg:grid-cols-12">
            <div className="lg:col-span-4">
              <CopyText
                as="h2"
                id="practice-title"
                copy={copy.practiceTitle}
                className="font-display text-display-m"
                data-reveal="lines"
              />
            </div>
            <div
              className="flex flex-col gap-8 lg:col-span-7 lg:col-start-6"
              data-reveal
            >
              {practice.summary && (
                <CopyText
                  as="p"
                  copy={practice.summary}
                  className="text-lede"
                />
              )}
              <FactList label="Materials" items={practice.materials} />
              <FactList label="Inspirations" items={practice.inspirations} />
              {practice.approach && (
                <figure className="border-l-2 border-accent pl-5">
                  <figcaption className="eyebrow text-ink-muted">
                    In her words
                  </figcaption>
                  <CopyText
                    as="blockquote"
                    copy={practice.approach}
                    className="mt-2 font-display text-lede italic"
                  />
                </figure>
              )}
            </div>
          </div>
        </RevealScope>
      )}

      <RevealScope
        aria-labelledby="explore-about-title"
        className="page-x pb-section"
      >
        <div className="mx-auto max-w-page border-t border-line pt-section">
          <CopyText
            as="h2"
            id="explore-about-title"
            copy={copy.exploreTitle}
            className="font-display text-display-m"
            data-reveal="lines"
          />
          <ul
            className="mt-12 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4"
            data-reveal
          >
            {rooms.map((room) => (
              <li
                key={room.href}
                className="border-b border-line sm:odd:border-r lg:border-r lg:[&:nth-child(4n)]:border-r-0"
              >
                <Link
                  href={room.href}
                  className="group flex h-full flex-col gap-2 p-6 transition-colors duration-300 hover:bg-surface-raised"
                >
                  <span className="eyebrow text-ink-muted">{room.eyebrow}</span>
                  <span className="font-display text-title group-hover:text-accent-ink">
                    {room.title}
                    <span aria-hidden="true" className="ml-2 text-accent">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </RevealScope>
    </>
  );
}
