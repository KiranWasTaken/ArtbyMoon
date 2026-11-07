import type { Metadata, Viewport } from "next";
import { InlineScript } from "@/components/layout/InlineScript";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SampleBanner } from "@/components/layout/SampleBanner";
import { PreviewBanner } from "@/components/layout/PreviewBanner";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { fontVariables } from "@/lib/fonts";
import { SmoothScroll } from "@/lib/motion/SmoothScroll";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Paintings, bookmarks, photography & workshops`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, locale: "en_GB" },
  twitter: { card: "summary_large_image" },
  // Only a real production origin in a non-sample build may be indexed
  // (site.indexable); robots.ts and sitemap.ts follow the same rule.
  ...(!site.indexable && { robots: { index: false, follow: false } }),
};

export const viewport: Viewport = {
  themeColor: "#f4efe6",
};

/** Before first paint: flag JS for the intro guard, and opt into ?review mode. */
const markJsReady =
  "var d=document.documentElement;d.classList.add('js');if(/[?&]review(=|&|$)/.test(location.search))d.dataset.review=''";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <InlineScript html={markJsReady} />
      </head>
      <body>
        <SmoothScroll>
          <SiteChrome header={<SiteHeader />} footer={<SiteFooter />}>
            {children}
          </SiteChrome>
        </SmoothScroll>
        <SampleBanner />
        <PreviewBanner />
      </body>
    </html>
  );
}
