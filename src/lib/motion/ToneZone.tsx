"use client";

import { useRef, type ReactNode } from "react";
import { ScrollTrigger, useGSAP } from "./gsap";
import { useReveal } from "./useReveal";

interface ToneZoneProps {
  children: ReactNode;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
  /** Set "darkroom" to give the section its own dark tokens as well. */
  "data-tone"?: "darkroom";
}

/**
 * A section that switches the whole page into the darkroom tone while it
 * occupies the middle of the viewport. Colour changes are CSS transitions on
 * semantic tokens, so this costs one attribute write per crossing.
 */
export function ToneZone({ children, ...props }: ToneZoneProps) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  useGSAP(
    () => {
      const root = document.documentElement;
      const setDark = (on: boolean) =>
        on
          ? root.setAttribute("data-tone", "darkroom")
          : root.removeAttribute("data-tone");

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => setDark(self.isActive),
      });

      // Runs when the route is hidden (Activity) or unmounted.
      return () => setDark(false);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}
