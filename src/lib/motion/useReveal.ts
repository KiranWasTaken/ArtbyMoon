"use client";

import type { RefObject } from "react";
import { gsap, SplitText, useGSAP } from "./gsap";
import { duration, media, stagger } from "./tokens";

/**
 * Scroll reveals for any element inside `scope` carrying a data-reveal
 * attribute. Markup stays server-rendered; this only adds motion.
 *
 *   data-reveal="lines"   heading/paragraph lines rise out of a mask
 *   data-reveal="unveil"  image is uncovered top-down (like lifting a cover
 *                         sheet); an optional [data-reveal-inner] child settles
 *                         from a slight zoom
 *   data-reveal="rule"    hairline is drawn left to right
 *   data-reveal="draw"    [data-draw] paths inside are drawn like a pencil line
 *   data-reveal="deal"    direct children are dealt onto the table one by one
 *                         (alternating tilt), e.g. polaroids
 *   data-reveal="fade"    (default) soft rise and fade
 *
 * Reduced motion: nothing is registered, so content is simply present.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motionOk, () => {
        const targets = gsap.utils.toArray<HTMLElement>(
          "[data-reveal]",
          scope.current,
        );

        for (const el of targets) {
          const scrollTrigger = { trigger: el, start: "top 88%", once: true };

          switch (el.dataset.reveal) {
            case "lines":
              SplitText.create(el, {
                type: "lines",
                mask: "lines",
                autoSplit: true,
                onSplit: (split) =>
                  gsap.from(split.lines, {
                    yPercent: 130,
                    stagger: stagger.lines,
                    duration: duration.reveal,
                    scrollTrigger,
                  }),
              });
              break;
            case "unveil": {
              const tl = gsap.timeline({ scrollTrigger });
              tl.from(el, {
                clipPath: "inset(100% 0% 0% 0%)",
                duration: 1.4,
                ease: "ink",
              });
              const inner = el.querySelector("[data-reveal-inner]");
              if (inner) tl.from(inner, { scale: 1.12, duration: 1.8 }, 0);
              break;
            }
            case "draw":
              gsap.from(el.querySelectorAll("[data-draw]"), {
                drawSVG: "0%",
                duration: 1.8,
                ease: "ink",
                stagger: 0.2,
                scrollTrigger,
              });
              break;
            case "deal":
              gsap.from(el.children, {
                autoAlpha: 0,
                y: 70,
                rotation: (i: number) => (i % 2 ? 9 : -7),
                duration: 1.1,
                stagger: stagger.items,
                scrollTrigger: { ...scrollTrigger, start: "top 80%" },
              });
              break;
            case "rule":
              gsap.from(el, {
                scaleX: 0,
                duration: 1.2,
                ease: "ink",
                scrollTrigger,
              });
              break;
            default:
              gsap.from(el, {
                autoAlpha: 0,
                y: 24,
                duration: duration.reveal,
                scrollTrigger,
              });
          }
        }
      });
    },
    { scope },
  );
}
