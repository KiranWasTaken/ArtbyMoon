"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PREVIEW_HINT_COOKIE } from "@/sanity/preview";

const hasHint = () =>
  document.cookie.split("; ").some((c) => c === `${PREVIEW_HINT_COOKIE}=1`);

/**
 * Shown only to editors previewing unpublished changes (Draft Mode). Public
 * pages stay fully static: nothing is read on the server. Visitors have no
 * hint cookie, so nothing is requested or rendered for them. When the hint
 * is present, the session is confirmed with /api/draft-mode/status first, so
 * a stale or hand-made cookie never shows the banner. Adds noindex.
 */
export function PreviewBanner() {
  const [previewing, setPreviewing] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!hasHint()) return;
    let active = true;
    fetch("/api/draft-mode/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((s: { enabled?: boolean }) => {
        if (active) setPreviewing(s.enabled === true);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pathname]);

  if (!previewing || pathname.startsWith("/studio")) return null;
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <div
        role="status"
        className="eyebrow fixed right-3 bottom-3 z-[75] flex items-center gap-4 bg-cobalt px-4 py-2 text-paper-50 shadow-lift"
      >
        Previewing unpublished changes
        <a
          href={`/api/draft-mode/disable?redirect=${encodeURIComponent(pathname)}`}
          className="underline underline-offset-4"
        >
          Exit preview
        </a>
      </div>
    </>
  );
}
