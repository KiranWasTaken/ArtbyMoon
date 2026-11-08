import Link from "next/link";
import { RevealScope } from "@/components/motion/RevealScope";
import { ArtMedia } from "@/components/ui/ArtMedia";
import { CopyText } from "@/components/ui/CopyText";
import { Handnote } from "@/components/ui/Handnote";
import type { Copy } from "@/content/types";
import type { HomeContent } from "@/lib/content/home";
import { cn, cssVars } from "@/lib/cn";

/**
 * Two loosely overlapping rows on desktop, like prints dropped on a desk;
 * a staggered two-column scatter on phones.
 */
const placement = [
  { li: "lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:mt-8", tilt: -4 },
  { li: "mt-10 lg:col-span-3 lg:col-start-5 lg:row-start-1 lg:mt-0", tilt: 3 },
  { li: "lg:col-span-3 lg:col-start-9 lg:row-start-1 lg:mt-16", tilt: -2 },
  {
    li: "mt-10 lg:col-span-3 lg:col-start-2 lg:row-start-2 lg:-mt-10",
    tilt: 5,
  },
  { li: "lg:col-span-3 lg:col-start-6 lg:row-start-2 lg:-mt-4", tilt: -3 },
  {
    li: "mt-10 lg:col-span-3 lg:col-start-10 lg:row-start-2 lg:-mt-14",
    tilt: 2,
  },
];

/**
 * With only a few prints, one centred row instead of the two-row scatter, so
 * the table never looks half-empty (production shows real work only).
 */
const fewPlacement: Record<number, typeof placement> = {
  1: [
    {
      li: "col-span-2 mx-auto w-1/2 sm:col-span-1 sm:col-start-2 sm:w-full lg:col-span-3 lg:col-start-5",
      tilt: -3,
    },
  ],
  2: [
    { li: "lg:col-span-3 lg:col-start-3 lg:mt-8", tilt: -4 },
    { li: "mt-10 lg:col-span-3 lg:col-start-8 lg:mt-0", tilt: 3 },
  ],
  3: placement.slice(0, 3),
};

interface PolaroidTableProps {
  polaroids: HomeContent["polaroids"];
  note: Copy;
}

export function PolaroidTable({ polaroids, note }: PolaroidTableProps) {
  const { collection, items } = polaroids;
  return (
    <RevealScope
      id="polaroids"
      aria-labelledby="polaroids-title"
      className="notebook overflow-x-clip border-y border-line py-section"
    >
      <div className="page-x">
        <div className="mx-auto max-w-page">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <p className="eyebrow text-ink-muted lg:col-span-3" data-reveal>
              Collection {collection.number}
            </p>
            <div className="lg:col-span-5">
              <h2
                id="polaroids-title"
                className="font-display text-display-l"
                data-reveal="lines"
              >
                {collection.title}
              </h2>
              <CopyText
                as="p"
                copy={collection.summary}
                className="mt-5 max-w-prose text-ink-muted"
                data-reveal
              />
            </div>
            <div
              className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-end"
              data-reveal
            >
              {items.some((item) => item.source === "placeholder") && (
                <Handnote>
                  <CopyText copy={note} />
                </Handnote>
              )}
              <Link href="/artworks/polaroids" className="ink-link eyebrow">
                All polaroids →
              </Link>
            </div>
          </div>

          <ul
            aria-label="Polaroids"
            data-reveal="deal"
            className="mt-16 grid grid-cols-2 gap-x-5 sm:grid-cols-3 sm:gap-x-8 lg:mt-24 lg:grid-cols-12 lg:gap-x-6"
          >
            {items.map((item, i) => {
              const layout = fewPlacement[items.length] ?? placement;
              const place = layout[i % layout.length]!;
              return (
                <li
                  key={item.id}
                  className={cn(
                    "relative focus-within:z-10 hover:z-10",
                    place.li,
                  )}
                >
                  <Link
                    href={item.href}
                    aria-label={`${item.label}. View polaroids`}
                    className="block rotate-(--tilt) shadow-rest transition-[rotate,translate,box-shadow] duration-500 ease-brush hover:-translate-y-2 hover:rotate-0 hover:shadow-lift focus-visible:rotate-0"
                    style={cssVars({ "--tilt": `${place.tilt}deg` })}
                  >
                    <ArtMedia
                      media={item.media}
                      sizes="(min-width: 64rem) 22vw, (min-width: 40rem) 30vw, 45vw"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </RevealScope>
  );
}
