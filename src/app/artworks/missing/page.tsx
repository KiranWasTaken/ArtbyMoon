import { notFound } from "next/navigation";

/**
 * Static 404 target for src/proxy.ts. Because notFound() runs at prerender
 * time, this route is served as a true 404 from the very first request
 * (rewriting to a dynamic route returned 200 on a cold server).
 */
export default function MissingArtwork() {
  notFound();
}
