"use client";

/**
 * Single entry point for GSAP. Import gsap, plugins and useGSAP from here so
 * plugins are registered exactly once and eases are shared.
 */
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { duration, easeCurves } from "./tokens";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  CustomEase,
);

CustomEase.create("brush", easeCurves.brush);
CustomEase.create("ink", easeCurves.ink);

gsap.defaults({ ease: "brush", duration: duration.reveal });

export { gsap, ScrollTrigger, SplitText, useGSAP };
