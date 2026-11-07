import type { NextConfig } from "next";

import { productionOrigin } from "./src/lib/site-url.mjs";
import { leakedSecretNames, readSanityEnv } from "./src/sanity/env.mjs";

/**
 * Build-time safety checks.
 * - Production builds (`pnpm build:production`, which sets
 *   ARTBYMOON_PRODUCTION=1, or a Vercel production deployment) FAIL unless
 *   NEXT_PUBLIC_SITE_URL is a real https origin and sample content is off.
 * - Any other build without a real origin still works but is marked
 *   noindex everywhere (src/lib/site.ts), with a warning here.
 * - Sanity: a NEXT_PUBLIC_ variable that looks like a token/secret, or a
 *   malformed project ID, always fails the build. Production builds also
 *   need SANITY_REVALIDATE_SECRET when Sanity is used, and refuse the
 *   test-only SANITY_API_HOST.
 */
const isBuild = process.argv.includes("build");
const strict =
  process.env.ARTBYMOON_PRODUCTION === "1" ||
  process.env.VERCEL_ENV === "production";
const origin = productionOrigin(process.env.NEXT_PUBLIC_SITE_URL);
const sample = process.env.ARTBYMOON_SAMPLE_CONTENT === "1";

const sanityEnv = readSanityEnv();
const leaked = leakedSecretNames();

if (isBuild && (leaked.length || sanityEnv.error)) {
  throw new Error(
    `Build refused:\n- ${[
      ...leaked.map(
        (k) =>
          `${k} would be exposed to every visitor's browser. Secrets must not start with NEXT_PUBLIC_.`,
      ),
      sanityEnv.error,
    ]
      .filter(Boolean)
      .join("\n- ")}`,
  );
}

if (isBuild && strict) {
  const problems = [
    sanityEnv.configured &&
      !process.env.SANITY_REVALIDATE_SECRET &&
      "SANITY_REVALIDATE_SECRET is required with Sanity, or published changes would never refresh the site (see docs/08-cms-guide.md).",
    process.env.SANITY_API_HOST && "SANITY_API_HOST is for local testing only.",
    !origin &&
      `NEXT_PUBLIC_SITE_URL must be the real https production origin (got ${JSON.stringify(process.env.NEXT_PUBLIC_SITE_URL ?? "")}). Placeholder, local and .test/.example hosts are rejected.`,
    sample &&
      "ARTBYMOON_SAMPLE_CONTENT=1 is set: sample content can never be deployed to production.",
  ].filter(Boolean);
  if (problems.length) {
    throw new Error(
      `Production build refused:\n- ${problems.join("\n- ")}\nSee .env.example and README.md › Deployment.`,
    );
  }
} else if (isBuild && !sanityEnv.configured) {
  console.info(
    "ℹ Content source: local files (NEXT_PUBLIC_SANITY_PROJECT_ID is not set).",
  );
}
if (isBuild && !strict && (!origin || sample)) {
  console.warn(
    `\n⚠ Non-production build: ${sample ? "sample content is on" : "NEXT_PUBLIC_SITE_URL is not a real https origin"}. Every page is noindex, robots.txt disallows all and the sitemap is empty. Use \`pnpm build:production\` for a deployable build.\n`,
  );
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Sample-content mode is decided at build time and inlined everywhere, so
  // `next build` and `next start` can never disagree (src/lib/content/artworks.ts).
  env: {
    ARTBYMOON_SAMPLE_CONTENT:
      process.env.ARTBYMOON_SAMPLE_CONTENT === "1" ? "1" : "0",
  },
  // The embedded Studio is one static page; it handles /studio/… itself.
  async rewrites() {
    return [{ source: "/studio/:path+", destination: "/studio" }];
  },
  images: {
    // AVIF first for artwork (smaller at equal quality), WebP fallback.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
