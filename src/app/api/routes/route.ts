import { getPublishedRoutes } from "@/lib/content/routes";

/**
 * Published content URLs, read by src/proxy.ts for real 404 status codes.
 * Static and tag-cached: the Sanity webhook expires it on publish, so the
 * next request regenerates it. Contains only public URLs (nothing secret).
 */
export async function GET() {
  return Response.json(await getPublishedRoutes());
}
