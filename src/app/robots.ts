import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Public pages are open to crawlers. Internal pages stay crawlable so their
 * noindex tag is seen (the design system). A build that is not indexable
 * (sample content, or no real NEXT_PUBLIC_SITE_URL) blocks everything.
 */
export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
