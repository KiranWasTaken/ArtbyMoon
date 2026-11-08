"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArtMedia } from "@/components/ui/ArtMedia";
import { CopyText } from "@/components/ui/CopyText";
import { Handnote } from "@/components/ui/Handnote";
import type { HomeContent } from "@/lib/content/home";
import { cn, cssVars } from "@/lib/cn";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { media } from "@/lib/motion/tokens";
import { useReveal } from "@/lib/motion/useReveal";

/** Below this many bookmarks the line fits on screen: no pinning, a plain row. */
const MIN_TRAVEL = 6;

/** Thread lengths (rem) so the line doesn't read as a uniform product shelf. */
const threads = [2.5, 4, 3, 5, 2.75, 3.75, 4.5, 2.5, 3.5];

/**
 * Bookmarks pegged to a studio drying line. With a mouse or trackpad on a wide
 * screen (motion allowed) the section pins and the line travels sideways;
 * scroll velocity sways the bookmarks. Touch devices and everything else get a native swipe row.
 * With only a few bookmarks there is nothing to travel through, so the
 * section stays an ordinary row (no full-height pinned stage).
 */
export function BookmarkLine({
  bookmarks,
}: {
  bookmarks: HomeContent["bookmarks"];
}) {
  const { collection, items } = bookmarks;
  const travel = items.length >= MIN_TRAVEL;
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      if (!travel) return;
      const mm = gsap.matchMedia();
      mm.add(media.pinnable, () => {
        const el = track.current;
        if (!el) return;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);

        const hangers = gsap.utils.toArray<HTMLElement>("[data-hanger]", el);
        const sway = hangers.map((h) =>
          gsap.quickTo(h, "rotation", { duration: 0.9, ease: "power3" }),
        );
        const settle = gsap
          .delayedCall(0.15, () => sway.forEach((s) => s(0)))
          .pause();

        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            // Transform pinning: no position:fixed toggle, so no layout shift
            // (CLS). Safe because this branch only runs with Lenis active,
            // which moves scroll and ScrollTrigger in the same frame.
            pinType: "transform",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self: ScrollTrigger) => {
              const angle = gsap.utils.clamp(-6, 6, self.getVelocity() / -300);
              sway.forEach((s, i) => s(angle * (0.7 + (i % 3) * 0.15)));
              settle.restart(true);
            },
          },
        });
      });
    },
    { scope: root, dependencies: [travel] },
  );

  return (
    <section
      ref={root}
      id="bookmarks"
      aria-labelledby="bookmarks-title"
      className={cn(
        "overflow-hidden py-section",
        travel &&
          "pinned:flex pinned:h-svh pinned:flex-col pinned:justify-center pinned:py-0",
      )}
    >
      <div className="page-x">
        <div className="mx-auto grid max-w-page gap-6 lg:grid-cols-12 lg:items-end">
          <p className="eyebrow text-ink-muted lg:col-span-3" data-reveal>
            Collection {collection.number}
          </p>
          <div className="lg:col-span-5">
            <h2
              id="bookmarks-title"
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
              <Handnote>placeholders, real bookmarks to come</Handnote>
            )}
            <Link href="/artworks/bookmarks" className="ink-link eyebrow">
              All bookmarks →
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mt-12">
        {/* The line itself */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-3 h-px bg-line-strong/40"
        />
        <ul
          ref={track}
          aria-label="Bookmarks"
          className={cn(
            "page-x flex snap-x snap-mandatory scroll-px-(--spacing-gutter) [scrollbar-width:none] gap-6 overflow-x-auto pb-6 md:gap-10",
            travel &&
              "pinned:w-max pinned:snap-none pinned:overflow-visible pinned:pr-[30vw]",
          )}
        >
          {items.map((item, i) => {
            // A photograph of a bookmark on a background (about 3:4) needs
            // more width than a slim strip: a placeholder, or a photo
            // cropped to the bookmark itself (narrower than 1:2).
            const photo =
              item.media.kind === "image" &&
              item.media.image.width / item.media.image.height >= 0.5;
            return (
              <li key={item.id} className="shrink-0 snap-start">
                <div
                  data-hanger
                  className="flex origin-top flex-col items-center"
                >
                  {/* peg */}
                  <span
                    aria-hidden="true"
                    className="relative z-10 mt-1 h-5 w-2 rounded-[1px] bg-ochre/80 shadow-rest"
                  />
                  <span
                    aria-hidden="true"
                    className="h-(--thread) w-px bg-line-strong/50"
                    style={cssVars({
                      "--thread": `${threads[i % threads.length]}rem`,
                    })}
                  />
                  <Link
                    href={item.href}
                    aria-label={`${item.label} ${i + 1}. View bookmarks`}
                    className={cn(
                      "block shadow-rest transition-[translate,box-shadow] duration-500 ease-brush hover:-translate-y-1 hover:shadow-lift",
                      // Width only, so every image keeps its own proportions.
                      // On phones about two photographs show at a time
                      // (swipe for more).
                      // On the pinned full-screen line the width is also
                      // capped by screen height so tall pieces never clip.
                      photo
                        ? "w-[clamp(11.5rem,17vw,16rem)] pinned:w-[min(clamp(11.5rem,17vw,16rem),32svh)]"
                        : "w-[clamp(8rem,10vw,11rem)] pinned:w-[min(clamp(8rem,10vw,11rem),12svh)]",
                    )}
                  >
                    <ArtMedia
                      media={item.media}
                      sizes={
                        photo
                          ? "(min-width: 64rem) 16rem, 12rem"
                          : "(min-width: 64rem) 11rem, 8rem"
                      }
                    />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
