import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { RichText as RichTextValue } from "@/content/types";
import { mapImage, type RawImage } from "@/sanity/map";
import { ArtMedia } from "./ArtMedia";

/** Only safe link targets: http(s), mailto and site-relative paths. */
const safeHref = (href: unknown) =>
  typeof href === "string" && /^(https?:\/\/|mailto:|\/)/.test(href)
    ? href
    : undefined;

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-6 font-display text-title">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-4 font-display text-lede">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent pl-5 font-display text-lede italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 marker:text-accent">{children}</ul>
    ),
    number: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = safeHref((value as { href?: unknown })?.href);
      if (!href) return <>{children}</>;
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className="ink-link"
          {...(external && { rel: "noopener", target: "_blank" })}
        >
          {children}
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const v = value as { image?: RawImage; caption?: string };
      const image = mapImage(v.image, "");
      if (!image) return null;
      return (
        <figure className="my-4">
          <ArtMedia
            media={{ kind: "image", image }}
            sizes="(min-width: 64rem) 40rem, 100vw"
          />
          {v.caption && (
            <figcaption className="mt-2 text-caption text-ink-muted">
              {v.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

/**
 * Rich text written in the CMS (biography, journal posts), rendered on the
 * server: no client JavaScript. Unknown block types are skipped quietly.
 */
export function RichText({
  value,
  className,
}: {
  value: RichTextValue;
  className?: string;
}) {
  return (
    <div className={className}>
      <PortableText
        value={value as Parameters<typeof PortableText>[0]["value"]}
        components={components}
        onMissingComponent={false}
      />
    </div>
  );
}
