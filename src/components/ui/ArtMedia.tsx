import Image from "next/image";
import type { Media } from "@/content/types";
import { cn, cssVars } from "@/lib/cn";
import { isSanityImage } from "@/sanity/image";
import { PlaceholderArt } from "./PlaceholderArt";
import { SanityImage } from "./SanityImage";

interface ArtMediaProps {
  media: Media;
  /** Required for real images so next/image can pick the right srcset width. */
  sizes: string;
  className?: string;
  decorative?: boolean;
  /** Only for the page's main (LCP) image. */
  preload?: boolean;
  /** 75 for thumbnails (default), 85 for detail views. Must be in next.config qualities. */
  quality?: 75 | 85;
  /**
   * "intrinsic" (default): width fills the box, height follows the photo.
   * "contain": fit inside a box sized by the caller (the full-screen viewer);
   * uses the high-resolution original when one is supplied.
   */
  fit?: "intrinsic" | "contain";
}

/**
 * The one way artwork imagery is rendered. A real photograph or its
 * placeholder at the same aspect ratio, so layouts never change when content
 * arrives. Real images are never cropped: the box carries the photo's own
 * ratio (no layout shift), shows its dominant colour or blur preview while
 * loading, and next/image serves AVIF/WebP at the width `sizes` asks for.
 */
export function ArtMedia({
  media,
  sizes,
  className,
  decorative,
  preload,
  quality = 75,
  fit = "intrinsic",
}: ArtMediaProps) {
  if (media.kind === "placeholder") {
    return (
      <PlaceholderArt
        kind={media.placeholder}
        aspect={media.aspect}
        pigment={media.pigment}
        className={className}
        decorative={decorative}
      />
    );
  }

  const { image } = media;
  const source = fit === "contain" && image.original ? image.original : image;
  // Sanity images are resized by Sanity's CDN; local files by next/image.
  const Img = isSanityImage(source.src) ? SanityImage : Image;
  return (
    <Img
      src={source.src}
      width={source.width}
      height={source.height}
      alt={decorative ? "" : image.alt}
      sizes={sizes}
      quality={quality}
      preload={preload}
      placeholder={image.blurDataURL ? "blur" : "empty"}
      blurDataURL={image.blurDataURL}
      style={cssVars({
        "--tint": image.dominantColor ?? "var(--color-paper-200)",
      })}
      className={cn(
        "block",
        fit === "contain"
          ? cn("h-full w-full object-contain", className)
          : cn("bg-(--tint)", className ?? "h-auto w-full"),
      )}
    />
  );
}
