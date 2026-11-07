"use client";

import { useRef, type ReactNode } from "react";
import { BrushStroke } from "@/components/ui/BrushStroke";
import { PlaceholderArt } from "@/components/ui/PlaceholderArt";
import { gsap, SplitText, useGSAP } from "@/lib/motion/gsap";
import { duration, easeCurves, stagger } from "@/lib/motion/tokens";

type Demo = "Lines rise" | "Unveil" | "Brush draw" | "Pinned arrival";

/** Plots a cubic-bezier "x1,y1,x2,y2" as an SVG path in a 100×100 box. */
function curvePath(curve: string) {
  const [x1, y1, x2, y2] = curve.split(",").map(Number) as [
    number,
    number,
    number,
    number,
  ];
  return `M0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`;
}

export function MotionLab() {
  const root = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: root });

  /** Each card passes its own element, so selectors stay local to that demo. */
  const play = contextSafe((demo: Demo, card: HTMLElement) => {
    const q = gsap.utils.selector(card);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    switch (demo) {
      case "Lines rise": {
        const el = q("[data-demo='lines']")[0];
        if (!el) return;
        const split = SplitText.create(el, { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 130,
          stagger: stagger.lines,
          duration: duration.reveal,
          onComplete: () => split.revert(),
        });
        break;
      }
      case "Unveil":
        gsap.fromTo(
          q("[data-demo='unveil']"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "ink" },
        );
        gsap.fromTo(
          q("[data-demo='unveil'] > *"),
          { scale: 1.12 },
          { scale: 1, duration: 1.8 },
        );
        break;
      case "Brush draw":
        gsap.fromTo(
          q("[data-demo='brush'] [data-draw]"),
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.9, ease: "ink" },
        );
        break;
      case "Pinned arrival":
        gsap.fromTo(
          q("[data-demo='pin']"),
          { autoAlpha: 0, y: -40, rotation: -5 },
          { autoAlpha: 1, y: 0, rotation: 0, duration: 1.2 },
        );
        gsap.fromTo(
          q("[data-demo='pin'] .tape"),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.45, delay: 0.5, ease: "ink" },
        );
        break;
    }
  });

  return (
    <div ref={root} className="grid gap-16">
      <div className="grid gap-6 sm:grid-cols-2">
        {(Object.keys(easeCurves) as Array<keyof typeof easeCurves>).map(
          (name) => (
            <figure key={name} className="border border-line p-6">
              <svg
                viewBox="-4 -4 108 108"
                className="h-32 w-32 overflow-visible"
                aria-hidden="true"
              >
                <path
                  d="M0 100 L100 0"
                  stroke="var(--line)"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={curvePath(easeCurves[name])}
                  stroke="var(--accent)"
                  strokeWidth="2"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <figcaption className="mt-4">
                <span className="font-display text-title">{name}</span>
                <code className="mt-1 block text-caption text-ink-muted">
                  cubic-bezier({easeCurves[name]})
                </code>
                <span className="mt-2 block text-caption text-ink-muted">
                  {name === "brush"
                    ? "Default. Fast start, long soft landing: reveals, entrances, hovers."
                    : "Symmetric. Wipes, tone changes, anything crossing the screen."}
                </span>
              </figcaption>
            </figure>
          ),
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DemoCard title="Lines rise" onPlay={play}>
          <p data-demo="lines" className="font-display text-title">
            Text arrives line by line from beneath a mask, never
            letter-by-letter on body copy.
          </p>
        </DemoCard>
        <DemoCard title="Unveil" onPlay={play}>
          <div data-demo="unveil" className="mx-auto w-32 overflow-hidden">
            <PlaceholderArt
              kind="canvas"
              aspect={{ w: 4, h: 5 }}
              pigment="sap"
            />
          </div>
        </DemoCard>
        <DemoCard title="Brush draw" onPlay={play}>
          <div data-demo="brush" className="pt-8">
            <span className="font-display text-display-m">Studio</span>
            <BrushStroke className="w-full" />
          </div>
        </DemoCard>
        <DemoCard title="Pinned arrival" onPlay={play}>
          <div
            data-demo="pin"
            className="relative mx-auto mt-3 w-24 shadow-rest"
          >
            <PlaceholderArt
              kind="abstract"
              aspect={{ w: 1, h: 1 }}
              pigment="cobalt"
            />
            <span
              aria-hidden="true"
              className="tape -top-2 left-1/2 -translate-x-1/2 -rotate-2"
            />
          </div>
        </DemoCard>
      </div>
    </div>
  );
}

function DemoCard({
  title,
  onPlay,
  children,
}: {
  title: Demo;
  onPlay: (d: Demo, card: HTMLElement) => void;
  children: ReactNode;
}) {
  return (
    <div
      data-card
      className="flex flex-col justify-between gap-8 border border-line p-6"
    >
      <div className="min-h-40">{children}</div>
      <div className="flex items-center justify-between border-t border-line pt-4">
        <span className="eyebrow">{title}</span>
        <button
          type="button"
          onClick={(e) =>
            onPlay(title, e.currentTarget.closest<HTMLElement>("[data-card]")!)
          }
          className="eyebrow ink-link"
        >
          Replay
        </button>
      </div>
    </div>
  );
}
