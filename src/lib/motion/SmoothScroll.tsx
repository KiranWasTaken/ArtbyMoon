"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { media } from "./tokens";

type GetLenis = () => Lenis | null;

const LenisContext = createContext<GetLenis>(() => null);

/** Returns a getter for the active Lenis instance (null when motion is reduced). */
export function useLenis(): GetLenis {
  return useContext(LenisContext);
}

/**
 * Smooth scrolling, driven by GSAP's ticker so Lenis and ScrollTrigger share
 * one animation frame. Not started at all for reduced-motion visitors, who
 * keep native scrolling. Touch devices keep native scrolling too (Lenis only
 * smooths wheel input unless syncTouch is enabled, which we avoid).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia(media.reducedMotion);
    const tick = (time: number) => lenisRef.current?.raf(time * 1000);

    const start = () => {
      // Reduced motion keeps native scrolling; the Studio manages its own.
      if (reduced.matches || window.location.pathname.startsWith("/studio"))
        return;
      const lenis = new Lenis({
        lerp: 0.1,
        autoRaf: false,
        anchors: true,
        stopInertiaOnNavigate: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      lenisRef.current = lenis;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      gsap.ticker.remove(tick);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
    const restart = () => {
      stop();
      start();
      ScrollTrigger.refresh();
    };

    gsap.ticker.lagSmoothing(0);
    start();
    reduced.addEventListener("change", restart);
    return () => {
      reduced.removeEventListener("change", restart);
      stop();
    };
  }, []);

  // New route content changes the document height: re-measure after paint.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      lenisRef.current?.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const getLenis = useCallback(() => lenisRef.current, []);

  return <LenisContext value={getLenis}>{children}</LenisContext>;
}
