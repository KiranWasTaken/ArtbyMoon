"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Copy, ExploreRoom, Media } from "@/content/types";
import { ArtMedia } from "@/components/ui/ArtMedia";
import { CopyText } from "@/components/ui/CopyText";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { media } from "@/lib/motion/tokens";
import { useReveal } from "@/lib/motion/useReveal";

/** Thumbnails fit a fixed square: landscape by width, portrait by height. */
function isLandscape(media: Media) {
  return media.kind === "placeholder"
    ? media.aspect.w >= media.aspect.h
    : media.image.width >= media.image.height;
}

interface ExploreIndexProps {
  rooms: ExploreRoom[];
  title: Copy;
}

/**
 * The studio's table of contents.
 * - Desktop with a fine pointer: a preview of each room trails the cursor;
 *   pointer moves go through gsap.quickTo so React never re-renders on move.
 * - Touch and narrow screens: each row carries a small thumbnail instead, so
 *   nothing depends on hover.
 * - Keyboard: rows are plain links in reading order; the trailing preview is
 *   hidden on focus because there is no pointer position to show it at.
 */
export function ExploreIndex({ rooms, title }: ExploreIndexProps) {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${media.desktop} and ${media.finePointer}`, () => {
        const el = preview.current;
        if (!el) return;
        const toX = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
        const toY = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
        const move = (e: PointerEvent) => {
          toX(e.clientX);
          toY(e.clientY);
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="explore"
      aria-labelledby="explore-title"
      className="page-x py-section"
    >
      <div className="mx-auto max-w-page">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="eyebrow text-ink-muted lg:col-span-3" data-reveal>
            Index
          </p>
          <CopyText
            as="h2"
            copy={title}
            id="explore-title"
            className="font-display text-display-l lg:col-span-9"
            data-reveal="lines"
          />
        </div>

        <ol className="mt-16 lg:mt-24" onPointerLeave={() => setActive(null)}>
          {rooms.map((room, i) => (
            <li key={room.href}>
              <span className="rule" data-reveal="rule" />
              <Link
                href={room.href}
                onPointerEnter={(e) =>
                  e.pointerType === "mouse" && setActive(i)
                }
                onFocus={() => setActive(null)}
                className="group grid grid-cols-[2rem_1fr_auto] items-center gap-x-4 gap-y-2 py-6 md:grid-cols-[2.5rem_1fr_auto] md:py-8 lg:grid-cols-12 lg:items-baseline lg:gap-x-6"
              >
                <span className="eyebrow col-start-1 row-start-1 self-start pt-3 text-ink-muted tabular-nums lg:col-span-1 lg:pt-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-start-2 row-start-1 font-display text-display-m transition-[translate,color] duration-500 ease-brush group-hover:translate-x-3 group-hover:text-accent-ink lg:col-span-5">
                  {room.title}
                </span>
                {/* Narrow screens: a thumbnail in place of the hover preview. */}
                <span className="col-start-3 row-span-2 row-start-1 flex size-14 items-center justify-center self-start lg:hidden">
                  <ArtMedia
                    media={room.preview}
                    sizes="56px"
                    decorative
                    className={cn(
                      "shadow-rest",
                      isLandscape(room.preview)
                        ? "h-auto w-full"
                        : "h-full w-auto",
                    )}
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="hidden text-title text-ink-muted transition-transform duration-500 ease-brush group-hover:-rotate-45 lg:col-span-1 lg:col-start-12 lg:row-start-1 lg:block lg:justify-self-end"
                >
                  →
                </span>
                <CopyText
                  copy={room.summary}
                  className="col-start-2 row-start-2 max-w-sm text-ink-muted lg:col-span-4 lg:col-start-8 lg:row-start-1"
                />
              </Link>
            </li>
          ))}
          <li aria-hidden="true">
            <span className="rule" data-reveal="rule" />
          </li>
        </ol>
      </div>

      {/* Cursor-trailing preview (desktop, fine pointer only). */}
      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 hidden lg:pointer-fine:block"
      >
        <div
          className={cn(
            "relative w-56 -translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] duration-500 ease-brush",
            active === null ? "scale-90 opacity-0" : "scale-100 opacity-100",
          )}
        >
          {rooms.map((room, i) => {
            const slim =
              room.preview.kind === "placeholder" &&
              room.preview.placeholder === "bookmark";
            return (
              <div
                key={room.href}
                className={cn(
                  "absolute inset-x-0 top-1/2 mx-auto -translate-y-1/2 -rotate-2 shadow-lift transition-opacity duration-300",
                  slim ? "w-16" : "w-full",
                  active === i ? "opacity-100" : "opacity-0",
                )}
              >
                <ArtMedia media={room.preview} sizes="224px" decorative />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
