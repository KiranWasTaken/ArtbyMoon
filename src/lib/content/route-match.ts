/**
 * The list of content URLs that exist (from /api/routes). Kept free of
 * imports so src/proxy.ts stays tiny: no content code runs in the proxy.
 */
export interface RouteManifest {
  collections: string[];
  artworks: string[];
  journal: string[];
}

export function routeExists(
  manifest: RouteManifest,
  section: "artworks" | "journal",
  first: string,
  second?: string,
): boolean {
  if (section === "journal") return !second && manifest.journal.includes(first);
  if (!second) return manifest.collections.includes(first);
  return manifest.artworks.includes(`${first}/${second}`);
}
