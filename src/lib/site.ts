import { profile } from "@/content/artist/profile";
import { productionOrigin } from "./site-url.mjs";

/**
 * Site origin for canonical URLs, Open Graph and the sitemap, from
 * NEXT_PUBLIC_SITE_URL (see .env.example). Any value is used in tags, so a
 * local test domain can be checked; the site is only *indexable* when the
 * value is a real https production origin and sample mode is off. Otherwise
 * every page is noindex, robots.txt disallows all and the sitemap is empty,
 * so a placeholder domain can never become a live canonical.
 * Production builds (pnpm build:production) refuse to run without a real
 * origin (next.config.ts).
 */
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
const sampleBuild = process.env.ARTBYMOON_SAMPLE_CONTENT === "1";

export const site = {
  name: profile.name,
  description:
    "Acrylic paintings on canvas, abstract work, polaroid-style paintings, sketches, hand-painted bookmarks and photography by ArtbyMoon, and Paint with Moon, her painting sessions.",
  url: rawUrl || "https://example.com",
  /** True only for a real https origin in a non-sample build. */
  indexable: productionOrigin(rawUrl) !== null && !sampleBuild,
  instagram: profile.instagram,
} as const;

export interface NavItem {
  href: `/${string}`;
  label: string;
}

/**
 * Public navigation. Only routes that exist; internal pages (design system,
 * review mode, sample content) never appear here. The journal joins once it
 * has a page of its own.
 */
export const primaryNav: NavItem[] = [
  { href: "/artworks", label: "Artworks" },
  { href: "/photography", label: "Photography" },
  { href: "/workshops", label: "Paint with Moon" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Footer adds Home, so every main page is one link away from anywhere. */
export const footerNav: NavItem[] = [
  { href: "/", label: "Home" },
  ...primaryNav,
];
