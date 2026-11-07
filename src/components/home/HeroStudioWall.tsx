"use client";

import Link from "next/link";
import { useRef } from "react";
import type { PreviewItem } from "@/content/types";
import { ArtMedia } from "@/components/ui/ArtMedia";
import { BrushStroke } from "@/components/ui/BrushStroke";
import { CopyText } from "@/components/ui/CopyText";
import { Crescent } from "@/components/ui/Crescent";
import { Handnote } from "@/components/ui/Handnote";
import { LinkButton } from "@/components/ui/LinkButton";
import type { HomeContent } from "@/lib/content/home";
import { cn, cssVars } from "@/lib/cn";
import { gsap, SplitText, useGSAP } from "@/lib/motion/gsap";
import { media, stagger } from "@/lib/motion/tokens";

/**
 * Where each piece hangs on the desktop wall, in % of the 16:9 wall box
 * (x, y, width), its resting tilt, how strongly it drifts on scroll, the
 * `sizes` hint for real photographs, and its place in the mobile grid.
 * Order matches `studioWallPlaceholders`. `shape` is the slot's designed
 * width/height; a real photograph keeps that height and takes the width its
 * own proportions need, up to `maxW` (growLeft: it widens towards the
 * free wall on its left, so it never overlaps its neighbour).
 */
const slots: readonly {
  x: number;
  y: number;
  w: number;
  tilt: number;
  depth: number;
  sizes: string;
  mobile: string;
  shape: number;
  maxW: number;
  growLeft?: boolean;
  mobileReal?: string;
}[] = [
  {
    x: 75,
    y: 8,
    w: 19,
    tilt: -2.5,
    depth: 0.18,
    sizes: "(min-width: 64rem) 19vw, 40vw",
    mobile: "col-span-5",
    shape: 4 / 5,
    maxW: 23,
  },
  {
    x: 66.5,
    y: 4,
    w: 4.6,
    tilt: 4,
    depth: 0.34,
    sizes: "(min-width: 64rem) 5vw, 15vw",
    mobile: "col-span-2 self-start",
    shape: 1 / 3.4,
    maxW: 12,
    growLeft: true,
    mobileReal: "col-span-4 self-start",
  },
  {
    x: 44,
    y: 5,
    w: 10,
    tilt: 2.5,
    depth: 0.1,
    sizes: "(min-width: 64rem) 10vw, 40vw",
    mobile: "col-span-5",
    shape: 0.82,
    maxW: 12,
  },
  {
    x: 44,
    y: 70,
    w: 12,
    tilt: -1.5,
    depth: 0.26,
    sizes: "(min-width: 64rem) 12vw, 33vw",
    mobile: "col-span-4",
    shape: 1,
    maxW: 14,
  },
  {
    x: 61,
    y: 62,
    w: 24,
    tilt: 1.2,
    depth: 0.14,
    sizes: "(min-width: 64rem) 24vw, 66vw",
    mobile: "col-span-8",
    shape: 4 / 3,
    maxW: 27,
  },
];

/** Position and width for a piece: placeholders as designed, photographs by their proportions. */
function fit(slot: (typeof slots)[number], media: PreviewItem["media"]) {
  if (media.kind !== "image")
    return { x: slot.x, w: slot.w, sizes: slot.sizes, mobile: slot.mobile };
  const ratio = media.image.width / media.image.height;
  const w =
    Math.round(Math.min((slot.w / slot.shape) * ratio, slot.maxW) * 100) / 100;
  return {
    x: slot.growLeft ? slot.x + slot.w - w : slot.x,
    w,
    sizes: `(min-width: 64rem) ${Math.ceil(w)}vw, 40vw`,
    mobile: slot.mobileReal ?? slot.mobile,
  };
}

const collectionNames: Record<string, string> = {
  "/artworks/canvas": "Canvas paintings",
  "/artworks/abstract": "Abstract",
  "/artworks/polaroids": "Polaroids",
  "/artworks/sketches": "Sketches",
  "/artworks/bookmarks": "Bookmarks",
};

/** Full intro once per visit; later visits (Activity restore, back nav) get a short fade. */
let introPlayed = false;

interface HeroProps {
  /** One entry per wall slot; null leaves that slot empty (production, no work yet). */
  items: (PreviewItem | null)[];
  copy: HomeContent["copy"]["hero"];
}

export function HeroStudioWall({ items, copy }: HeroProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        { motionOk: media.motionOk, desktop: media.desktop },
        (context) => {
          const { motionOk, desktop } = context.conditions as {
            motionOk: boolean;
            desktop: boolean;
          };
          if (!motionOk) return; // CSS keeps everything visible.

          const containers = q("[data-intro='container']");
          const pieces = q("[data-intro='piece']");

          if (introPlayed) {
            gsap.set(containers, { autoAlpha: 1 });
            if (pieces.length)
              gsap.from(pieces, { autoAlpha: 0, duration: 0.6, stagger: 0.04 });
          } else {
            introPlayed = true;
            const name = q("[data-hero-name]")[0];
            const split = name
              ? SplitText.create(name, {
                  type: "chars",
                  mask: "chars",
                  aria: "none",
                })
              : null;

            const intro = gsap
              .timeline({ delay: 0.15 })
              .set(containers, { autoAlpha: 1 })
              .from(
                split?.chars ?? [],
                { yPercent: 115, duration: 1.3, stagger: stagger.chars },
                0,
              )
              .from(
                q("[data-hero-moon]"),
                { autoAlpha: 0, yPercent: 90, rotation: -35, duration: 1.4 },
                0.75,
              )
              .from(
                q("[data-hero-eyebrow]"),
                { autoAlpha: 0, y: 12, duration: 0.8 },
                0.35,
              )
              .from(
                q("[data-hero-brush] [data-draw]"),
                { drawSVG: "0%", duration: 0.9, ease: "ink" },
                0.8,
              );
            // The wall can be empty in production before any work is published.
            const works = q("[data-hero-work]");
            if (works.length)
              intro
                .from(
                  works,
                  {
                    autoAlpha: 0,
                    y: -40,
                    rotation: (i: number) => (i % 2 ? 5 : -5),
                    duration: 1.2,
                    stagger: stagger.items,
                  },
                  0.55,
                )
                .from(
                  q(".tape"),
                  {
                    scaleX: 0,
                    duration: 0.45,
                    stagger: stagger.items,
                    ease: "ink",
                  },
                  1.05,
                );
            intro
              .from(
                q("[data-hero-copy] > *"),
                { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.08 },
                1.1,
              )
              .from(
                q("[data-hero-note] > span > span"),
                { clipPath: "inset(0 100% 0 0)", duration: 0.9, ease: "ink" },
                1.35,
              )
              .from(
                q("[data-hero-note] [data-draw]"),
                { drawSVG: "0%", duration: 0.5, stagger: 0.15 },
                1.75,
              );
          }

          if (!desktop) return;

          // Depth: pieces drift upward at different rates as the hero leaves.
          const scrollTrigger = {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          };
          for (const el of q("[data-hero-work]")) {
            gsap.to(el, {
              yPercent: -Number(el.dataset.depth) * 100,
              ease: "none",
              scrollTrigger,
            });
          }
          gsap.to(q("[data-hero-title]"), {
            y: 70,
            ease: "none",
            scrollTrigger,
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="page-x pt-24 pb-16 md:pt-28 lg:pt-20 lg:pb-12"
    >
      <div className="relative mx-auto flex max-w-page flex-col gap-10 lg:@container lg:block lg:aspect-[16/9]">
        {/* Title block */}
        <div data-intro="container" className="lg:contents">
          <CopyText
            as="p"
            copy={copy.eyebrow}
            data-hero-eyebrow
            className="eyebrow text-ink-muted lg:absolute lg:top-[21%] lg:left-[0.6%]"
          />
          <h1
            id="hero-title"
            data-hero-title
            className="relative z-10 mt-3 font-display text-display-xl text-[clamp(3.5rem,1.2rem+11.7vw,11.7rem)] lg:absolute lg:top-[32%] lg:left-0 lg:mt-0 lg:text-[12.5cqi] lg:leading-[0.84]"
          >
            <span className="sr-only">ArtbyMoon</span>
            {/* Visual name, with her crescent moon (@art.by.moon_) as a mark after it. */}
            <span aria-hidden="true" className="relative inline-block">
              <span data-hero-name>ArtbyMoon</span>
              <Crescent
                data-hero-moon
                className="absolute top-[0.035em] -right-[0.2em] w-[0.17em] text-accent"
              />
            </span>
          </h1>
          <BrushStroke
            data-hero-brush
            className="-mt-2 w-[70%] lg:absolute lg:top-[50%] lg:left-[1%] lg:mt-0 lg:w-[56%]"
          />
          <span
            data-hero-note
            className="mt-2 block lg:absolute lg:top-[56%] lg:left-[47%] lg:mt-0"
          >
            <Handnote arrow="right">
              <CopyText copy={copy.note} />
            </Handnote>
          </span>
        </div>

        {/* Pieces on the wall */}
        {items.some(Boolean) && (
          <ul
            aria-label="Work from the studio"
            className="order-2 grid grid-cols-12 items-end gap-x-3 gap-y-6 md:max-w-xl lg:contents"
          >
            {items.map((item, i) => {
              const slot = slots[i];
              if (!slot || !item) return null;
              const place = fit(slot, item.media);
              const name =
                collectionNames[item.href.split("?")[0] ?? ""] ?? "Artworks";
              const isBookmark =
                item.media.kind === "placeholder" &&
                item.media.placeholder === "bookmark";
              return (
                <li
                  key={item.id}
                  data-intro="piece"
                  data-hero-work
                  data-depth={slot.depth}
                  className={cn(
                    place.mobile,
                    "lg:absolute lg:top-(--y) lg:left-(--x) lg:z-20 lg:w-(--w)",
                  )}
                  style={cssVars({
                    "--x": `${place.x}%`,
                    "--y": `${slot.y}%`,
                    "--w": `${place.w}%`,
                    "--tilt": `${slot.tilt}deg`,
                  })}
                >
                  <Link
                    href={item.href}
                    aria-label={`${item.label}. View ${name}`}
                    className="group relative block rotate-(--tilt) shadow-rest transition-[rotate,translate,box-shadow] duration-500 ease-brush hover:-translate-y-1.5 hover:rotate-0 hover:shadow-lift focus-visible:rotate-0"
                  >
                    <ArtMedia media={item.media} sizes={place.sizes} />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "tape -top-2 left-1/2 -translate-x-1/2",
                        i % 2 ? "rotate-3" : "-rotate-2",
                        isBookmark && "w-[130%]",
                      )}
                    />
                    <span
                      aria-hidden="true"
                      className="eyebrow pointer-events-none absolute top-full left-0 mt-3 hidden whitespace-nowrap text-ink-muted opacity-0 transition-opacity duration-(--duration-ui) group-hover:opacity-100 group-focus-visible:opacity-100 lg:block"
                    >
                      {name} →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Introduction */}
        <div
          data-intro="container"
          data-hero-copy
          className="order-3 flex max-w-md flex-col gap-6 lg:absolute lg:top-[66%] lg:left-[0.6%] lg:w-[34%] lg:max-w-none"
        >
          <CopyText
            as="p"
            copy={copy.intro}
            className="text-lede text-ink-muted lg:text-body"
          />
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/artworks" variant="solid">
              View the artworks
            </LinkButton>
            <LinkButton href="/workshops">Workshops</LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
