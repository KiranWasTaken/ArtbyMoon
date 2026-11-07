import type { Metadata, Viewport } from "next";
import { NextStudio } from "next-sanity/studio";
import { Suspense } from "react";
import config from "../../../sanity.config";
import { sanityConfigured } from "@/sanity/config";

/**
 * Sanity Studio, embedded at /studio. Deeper Studio URLs (/studio/…) are
 * rewritten to this page (next.config.ts); the Studio routes itself in the
 * browser. It is a separate client application:
 * its JavaScript loads only on this route, never on public pages, and the
 * site's header, footer and smooth scrolling are left out (SiteChrome).
 * Editors log in with their Sanity account; the page is noindex.
 */
/** Same values as next-sanity/studio exports, defined here because that module is client-only. */
export const metadata: Metadata = {
  title: "Studio",
  referrer: "same-origin",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      // Inline spacing: the Studio's own unlayered CSS resets margins and
      // padding on this route, which would beat Tailwind's layered utilities.
      <main
        className="font-sans"
        style={{ maxWidth: "36rem", margin: "0 auto", padding: "6rem 1.5rem" }}
      >
        <h1 className="font-display text-display-m">Studio not set up yet</h1>
        <p className="text-ink-muted" style={{ marginTop: "1rem" }}>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code>, then restart. Step-by-step
          instructions are in <code>docs/08-cms-guide.md</code>.
        </p>
      </main>
    );
  }
  // The Studio renders only in the browser, which needs a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <NextStudio config={config} />
    </Suspense>
  );
}
