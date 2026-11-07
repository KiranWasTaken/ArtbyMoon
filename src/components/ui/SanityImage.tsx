"use client";

import Image, { type ImageProps } from "next/image";
import { sanityImageLoader } from "@/sanity/image";

/**
 * next/image with the Sanity CDN loader. A client component only because
 * loader functions cannot be passed from server components; it renders the
 * same <img srcset> and adds no fetching.
 */
export function SanityImage({ alt, ...props }: Omit<ImageProps, "loader">) {
  return <Image {...props} alt={alt} loader={sanityImageLoader} />;
}
