"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { Media, Photograph } from "@/content/types";
import { packRows } from "@/components/art/presentation";
import { ArtMedia } from "@/components/ui/ArtMedia";
import { cn, cssVars } from "@/lib/cn";
import { formatCalendarDate } from "@/lib/format";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { useLenis } from "@/lib/motion/SmoothScroll";
import { media as mq } from "@/lib/motion/tokens";
import { useReveal } from "@/lib/motion/useReveal";

const toMedia = (p: Photograph): Media => ({ kind: "image", image: p.image });

/** Page scroll is locked while the viewer is open (Lenis is stopped separately). */
function lockPageScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** "2099-03" → "March 2099"; "2099-03-14" → "14 March 2099". */
function formatTaken(value: string) {
  if (/^\d{4}-\d{2}$/.test(value)) {
    return new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${value}-01T00:00:00Z`));
  }
  return formatCalendarDate(value);
}

const hasMeta = (p: Photograph) =>
  Boolean(p.title || p.caption || p.location || p.takenAt);

/** Title, caption, place and date: each only when supplied. */
function Meta({ photo }: { photo: Photograph }) {
  const bits = [
    photo.location,
    photo.takenAt && formatTaken(photo.takenAt),
  ].filter(Boolean);
  return (
    <>
      {photo.title && (
        <span className="font-display text-[1.0625rem] leading-snug text-ink">
          {photo.title}
        </span>
      )}
      {photo.caption && (
        <span className="text-caption text-ink-muted">{photo.caption}</span>
      )}
      {bits.length > 0 && (
        <span className="eyebrow text-ink-muted">{bits.join(" · ")}</span>
      )}
    </>
  );
}

const nameOf = (p: Photograph, i: number, total: number) =>
  p.title ?? `Photograph ${i + 1} of ${total}`;

interface PhotoJournalProps {
  photographs: Photograph[];
  /** Pre-computed: empty when filtering wouldn't be useful. */
  categories: string[];
}

/**
 * The visual journal: an editorial grid at each photograph's natural ratio,
 * an optional category filter, and a full-screen viewer (native <dialog>)
 * with previous/next buttons, arrow keys, swipe, Escape, and focus returned
 * to the photograph that opened it.
 */
export function PhotoJournal({ photographs, categories }: PhotoJournalProps) {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const direction = useRef(0);
  const getLenis = useLenis();

  const [category, setCategory] = useState<string | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  useReveal(root);

  const visible = category
    ? photographs.filter((p) => p.category === category)
    : photographs;
  const current = index === null ? null : (visible[index] ?? null);
  const packed = packRows(
    visible,
    (p) => p.image.width / p.image.height,
    "bold",
  );

  // Filtering changes the layout: re-measure scroll-driven reveals.
  useGSAP(
    () => {
      const id = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(id);
    },
    { dependencies: [category] },
  );

  // Viewer transition: a short slide-and-fade in the direction of travel.
  useGSAP(
    () => {
      if (index === null || !window.matchMedia(mq.motionOk).matches) return;
      gsap.fromTo(
        "[data-viewer-image]",
        { autoAlpha: 0, x: direction.current * 28 },
        { autoAlpha: 1, x: 0, duration: 0.45, ease: "brush" },
      );
    },
    { dependencies: [index], scope: stage },
  );

  const open = (i: number, trigger: HTMLElement) => {
    opener.current = trigger;
    direction.current = 0;
    setIndex(i);
    dialog.current?.showModal();
    getLenis()?.stop();
    lockPageScroll(true);
  };
  const step = (delta: 1 | -1) => {
    if (index === null || visible.length < 2) return;
    direction.current = delta;
    setIndex((index + delta + visible.length) % visible.length);
  };
  const onClose = () => {
    setIndex(null);
    getLenis()?.start();
    lockPageScroll(false);
    opener.current?.focus({ preventScroll: true });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  };
  const onPointerDown = (e: ReactPointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      step(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div ref={root}>
      {categories.length > 0 && (
        <div className="mb-12 lg:mb-16">
          <div
            role="group"
            aria-label="Filter by category"
            className="flex flex-wrap gap-2"
          >
            {[null, ...categories].map((c) => (
              <button
                key={c ?? "all"}
                type="button"
                aria-pressed={category === c}
                onClick={() => {
                  dialog.current?.close();
                  setCategory(c);
                }}
                className={cn(
                  "eyebrow inline-flex min-h-10 items-center rounded-full border px-4 transition-colors duration-(--duration-ui)",
                  category === c
                    ? "border-ink bg-ink text-surface"
                    : "border-line text-ink-muted hover:border-line-strong hover:text-ink",
                )}
              >
                {c ?? "All"}
              </button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {category
              ? `Showing ${category}, ${visible.length} photographs`
              : `Showing all ${visible.length} photographs`}
          </p>
        </div>
      )}

      <ul
        aria-label="Photographs"
        className="grid grid-cols-2 items-center gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-12 lg:gap-y-20"
      >
        {packed.map(({ item: photo, span, mobileSpan, start }, i) => (
          <li
            key={photo.id}
            className="col-span-(--m) lg:col-span-(--s) lg:col-start-(--c)"
            style={cssVars({
              "--s": String(span),
              "--m": String(mobileSpan),
              "--c": start ? String(start) : "auto",
            })}
          >
            <figure>
              <button
                type="button"
                onClick={(e) => open(i, e.currentTarget)}
                aria-haspopup="dialog"
                aria-label={`${nameOf(photo, i, visible.length)}: view full screen`}
                className="group block w-full cursor-zoom-in focus-visible:outline-offset-6"
              >
                <span data-reveal="unveil" className="block overflow-hidden">
                  <span data-reveal-inner className="block">
                    <ArtMedia
                      media={toMedia(photo)}
                      sizes={`(min-width: 64rem) ${Math.round((span / 12) * 100)}vw, ${mobileSpan * 50}vw`}
                      className="h-auto w-full transition-[filter] duration-500 group-hover:brightness-110"
                    />
                  </span>
                </span>
              </button>
              {hasMeta(photo) && (
                <figcaption className="mt-3 flex flex-col gap-1">
                  <Meta photo={photo} />
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={onClose}
        onKeyDown={onKeyDown}
        aria-label="Photograph viewer"
        data-tone="darkroom"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-surface p-0 text-ink opacity-100 transition-opacity duration-(--duration-ui) backdrop:bg-black/85 starting:opacity-0"
      >
        <div className="flex h-full flex-col">
          <div className="page-x flex h-16 shrink-0 items-center justify-between gap-6">
            <p
              className="eyebrow text-ink-muted tabular-nums"
              aria-live="polite"
            >
              {current && index !== null && (
                <>
                  <span className="sr-only">
                    {nameOf(current, index, visible.length)},{" "}
                  </span>
                  {index + 1} / {visible.length}
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="eyebrow -mr-3 min-h-12 px-3"
              autoFocus
            >
              Close
            </button>
          </div>

          <div
            ref={stage}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              swipe.current = null;
            }}
            className="relative flex min-h-0 flex-1 touch-pan-y touch-pinch-zoom items-center justify-center px-14 md:px-24"
          >
            {current && (
              <div
                key={current.id}
                data-viewer-image
                className="flex h-full w-full items-center justify-center"
              >
                <ArtMedia
                  media={toMedia(current)}
                  sizes="100vw"
                  quality={85}
                  fit="contain"
                  className="max-h-full"
                />
              </div>
            )}
            {visible.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photograph"
                  className="absolute top-1/2 left-1 flex size-12 -translate-y-1/2 items-center justify-center text-title text-ink-muted transition-colors hover:text-ink md:left-6"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photograph"
                  className="absolute top-1/2 right-1 flex size-12 -translate-y-1/2 items-center justify-center text-title text-ink-muted transition-colors hover:text-ink md:right-6"
                >
                  →
                </button>
              </>
            )}
          </div>

          <div className="page-x flex min-h-16 shrink-0 flex-col justify-center gap-1 py-3 text-center">
            {current && <Meta photo={current} />}
          </div>
        </div>
      </dialog>
    </div>
  );
}
