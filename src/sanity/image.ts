/**
 * Sanity image CDN helpers (no server-only code: used by the image loader in
 * the browser). Sanity asset URLs look like
 *   https://cdn.sanity.io/images/<project>/<dataset>/<hash>-<w>x<h>.<ext>
 * and accept resizing parameters, so every width is produced by Sanity's
 * CDN, never downloaded or re-encoded by the Next.js server.
 */
const SANITY_ASSET = /^\/images\/[a-z0-9]+\/[a-z0-9_-]+\/\w+-\d+x\d+\.[a-z]+$/i;

export function isSanityImage(src: string) {
  try {
    const url = new URL(src);
    return url.hostname === "cdn.sanity.io" && SANITY_ASSET.test(url.pathname);
  } catch {
    return false;
  }
}

/**
 * next/image loader: the requested width at the requested quality, in the
 * best format the browser accepts (auto=format serves AVIF/WebP), never
 * upscaled (fit=max).
 */
export function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}

/** A fixed-size JPEG for social previews (crawlers may not accept AVIF). */
export function sanityOgImage(src: string, width = 1200) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", "80");
  url.searchParams.set("fm", "jpg");
  url.searchParams.set("fit", "max");
  return url.toString();
}
