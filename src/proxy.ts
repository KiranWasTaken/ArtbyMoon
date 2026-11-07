import { NextResponse, type NextRequest } from "next/server";
import { routeExists, type RouteManifest } from "@/lib/content/route-match";

/**
 * Real 404 status for unknown collections, artworks and journal posts.
 * Under Cache Components these routes stream a static shell first, so a
 * notFound() thrown while rendering arrives with status 200 (plus noindex).
 * Checking the path here, before rendering, lets the response carry a true
 * 404 (as the Next.js docs recommend). The page still calls notFound()
 * itself, so the styled 404 UI is the same.
 *
 * The answer comes from /api/routes: a small, static, tag-cached list of
 * published URLs that the Sanity webhook expires on every publish, so new,
 * renamed and removed content is reflected immediately on every server
 * (no per-server memory to go stale). Works with both content sources.
 *
 * Draft Mode: if the draft-mode cookie is present and the URL isn't
 * published, /api/routes/preview is asked with the visitor's cookies. Only a
 * genuine session (validated by Next.js) gets the draft list; a hand-made
 * cookie gets 401 there, so the URL is a normal 404.
 *
 * If the list can't be fetched (e.g. a brief outage), the request is let
 * through and the page decides, so real pages never turn into 404s.
 */
const TIMEOUT_MS = 2000;

async function manifest(
  url: URL,
  headers: Record<string, string>,
  cookie?: string,
): Promise<RouteManifest | null> {
  try {
    const res = await fetch(url, {
      headers: cookie ? { ...headers, cookie } : headers,
      cache: cookie ? "no-store" : "default",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as RouteManifest;
  } catch (error) {
    console.error(`[proxy] could not read ${url.pathname}`, error);
    return null;
  }
}

/**
 * `next dev` only: a hard reload (Cache-Control: no-cache) makes Next.js
 * refetch cached data for the page; pass it on so the route list is
 * refetched too and the page and its 404 decision agree. Production ignores
 * this header for cached data, so it is not forwarded there.
 */
function devCacheHeaders(request: NextRequest): Record<string, string> {
  return process.env.NODE_ENV === "development" &&
    request.headers.get("cache-control") === "no-cache"
    ? { "cache-control": "no-cache" }
    : {};
}

export async function proxy(request: NextRequest) {
  const [, section, first, second, ...rest] =
    request.nextUrl.pathname.split("/");
  if (section !== "artworks" && section !== "journal")
    return NextResponse.next();
  if (!first || first === "missing") return NextResponse.next();

  let exists = false;
  if (!rest.length) {
    const headers = devCacheHeaders(request);
    const published = await manifest(
      new URL("/api/routes", request.url),
      headers,
    );
    if (!published) return NextResponse.next();
    exists = routeExists(published, section, first, second);

    if (!exists && request.cookies.has("__prerender_bypass")) {
      const drafts = await manifest(
        new URL("/api/routes/preview", request.url),
        headers,
        request.headers.get("cookie") ?? undefined,
      );
      exists = drafts ? routeExists(drafts, section, first, second) : false;
    }
  }

  if (exists) return NextResponse.next();
  return NextResponse.rewrite(
    new URL(
      section === "journal" ? "/journal/missing" : "/artworks/missing",
      request.url,
    ),
    { status: 404 },
  );
}

export const config = {
  matcher: ["/artworks/:path+", "/journal/:path+"],
};
