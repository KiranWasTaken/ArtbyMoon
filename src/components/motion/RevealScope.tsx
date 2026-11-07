"use client";

import { useRef, type ReactNode } from "react";
import { useReveal } from "@/lib/motion/useReveal";

interface RevealScopeProps {
  children: ReactNode;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
}

/** A <section> whose [data-reveal] descendants animate in on scroll. */
export function RevealScope({ children, ...props }: RevealScopeProps) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}
