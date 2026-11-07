"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export const STUDIO_PATH = "/studio";

/**
 * The public site's frame (skip link, header, main, footer). The embedded
 * Sanity Studio at /studio is a separate application and gets none of it.
 * Header and footer are rendered on the server and passed in as props.
 */
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith(STUDIO_PATH))
    return <div data-studio>{children}</div>;
  return (
    <>
      <a
        href="#content"
        className="eyebrow fixed top-3 left-3 z-[70] -translate-y-24 bg-ink px-4 py-3 text-surface focus:translate-y-0"
      >
        Skip to content
      </a>
      {header}
      <main id="content">{children}</main>
      {footer}
    </>
  );
}
