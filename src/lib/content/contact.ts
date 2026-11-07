import { site } from "@/lib/site";
import { getAbout } from "./about";

export interface InstagramLink {
  handle: string;
  url: string;
  /** Opens a direct message. */
  messageUrl: string;
}

export interface ContactLine {
  label: string;
  value: string;
  href?: string;
}

const PROFILE_URL =
  /^https:\/\/(?:www\.)?instagram\.com\/([A-Za-z0-9._]{1,30})\/?(?:\?.*)?$/;

/** A profile link such as https://www.instagram.com/art.by.moon_/ → handle and DM link. Anything else → null. */
export function instagramFromUrl(url?: string): InstagramLink | null {
  const handle = url?.trim().match(PROFILE_URL)?.[1];
  if (!handle || /^(p|reel|reels|stories|explore|accounts)$/i.test(handle))
    return null;
  return {
    handle,
    url: `https://www.instagram.com/${handle}/`,
    messageUrl: `https://ig.me/m/${handle}`,
  };
}

/** Only links a visitor can safely follow. */
const safeHref = (href?: string) =>
  href && /^(https:\/\/|mailto:)/i.test(href) ? href : undefined;

/**
 * Contact details for /contact, from the published artist profile (Sanity
 * or local files). Falls back to the site's Instagram account when the
 * profile has no valid Instagram link. Extra lines appear only if published.
 */
export async function getContact(): Promise<{
  instagram: InstagramLink;
  lines: ContactLine[];
}> {
  const about = await getAbout();
  return {
    instagram: instagramFromUrl(about.instagramUrl) ?? site.instagram,
    lines: (about.contact ?? []).map((line) => ({
      ...line,
      href: safeHref(line.href),
    })),
  };
}
