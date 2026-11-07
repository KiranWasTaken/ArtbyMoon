import Link from "next/link";
import { RevealScope } from "@/components/motion/RevealScope";
import { ArtMedia } from "@/components/ui/ArtMedia";
import { CopyText } from "@/components/ui/CopyText";
import { Handnote } from "@/components/ui/Handnote";
import type { Copy } from "@/content/types";
import type { HomeContent } from "@/lib/content/home";
import { cn } from "@/lib/cn";

/**
 * Magazine-spread placement for the four subjects, each at the proportion
 * its paintings tend to use: a wide landscape across the top, portrait and
 * animal side by side (offset), a square flower study below.
 */
const placement = [
  { li: "col-span-2 lg:col-span-7", sizes: "(min-width: 64rem) 52vw, 100vw" },
  { li: "col-span-1 lg:col-span-4", sizes: "(min-width: 64rem) 30vw, 50vw" },
  {
    li: "col-span-1 mt-16 lg:col-span-3 lg:col-start-6 lg:mt-36",
    sizes: "(min-width: 64rem) 22vw, 50vw",
  },
  {
    li: "col-span-2 mx-auto w-4/5 lg:col-span-3 lg:col-start-2 lg:mx-0 lg:-mt-8 lg:w-full",
    sizes: "(min-width: 64rem) 30vw, 80vw",
  },
];

interface CanvasEditorialProps {
  canvas: HomeContent["canvas"];
  note: Copy;
}

/**
 * The first "gallery" moment after the informal hero: no tape, true
 * proportions, each subject mounted with a paper margin and hairline. The
 * text column is CSS-sticky on desktop (no scroll pinning).
 */
export function CanvasEditorial({ canvas, note }: CanvasEditorialProps) {
  const { collection, subjects } = canvas;
  return (
    <RevealScope
      id="canvas"
      aria-labelledby="canvas-title"
      className="page-x py-section"
    >
      <div className="mx-auto grid max-w-page gap-16 lg:grid-cols-12 lg:gap-x-6">
        <header className="flex flex-col items-start gap-6 lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <p className="eyebrow text-ink-muted" data-reveal>
            Collection {collection.number}
          </p>
          <h2
            id="canvas-title"
            className="font-display text-display-l"
            data-reveal="lines"
          >
            {collection.title}
          </h2>
          <CopyText
            as="p"
            copy={collection.summary}
            className="max-w-sm text-lede text-ink-muted"
            data-reveal
          />
          <span data-reveal>
            <Handnote arrow="down">
              <CopyText copy={note} />
            </Handnote>
          </span>
          <Link
            href="/artworks/canvas"
            className="ink-link eyebrow"
            data-reveal
          >
            All canvas paintings →
          </Link>
        </header>

        <ol
          aria-label="Canvas paintings by subject"
          className="grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-6 lg:col-span-8 lg:grid-cols-8 lg:gap-y-20"
        >
          {subjects.map((subject, i) => {
            const place = placement[i] ?? placement[0]!;
            return (
              <li key={subject.slug} className={cn(place.li)}>
                <Link
                  href={subject.preview.href}
                  className="group block"
                  aria-label={`${subject.title}: ${subject.preview.label}`}
                >
                  <figure>
                    <div className="border border-line bg-surface-raised p-[5%] shadow-rest transition-[box-shadow,translate] duration-500 ease-brush group-hover:-translate-y-1 group-hover:shadow-lift">
                      <div data-reveal="unveil" className="overflow-hidden">
                        <div data-reveal-inner>
                          <ArtMedia
                            media={subject.preview.media}
                            sizes={place.sizes}
                          />
                        </div>
                      </div>
                    </div>
                    <figcaption className="mt-4 flex items-baseline justify-between gap-3">
                      <span className="flex items-baseline gap-3">
                        <span className="eyebrow text-ink-muted tabular-nums">
                          {String.fromCharCode(97 + i)}.
                        </span>
                        <span className="font-display text-title transition-colors duration-300 group-hover:text-accent-ink">
                          {subject.title}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="eyebrow hidden text-ink-muted sm:inline"
                      >
                        View →
                      </span>
                    </figcaption>
                  </figure>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </RevealScope>
  );
}
