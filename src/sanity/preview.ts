/**
 * A readable (not httpOnly) marker set alongside Next.js's draft-mode cookie.
 * It carries no secret and grants nothing: it only tells the page to show
 * the "Previewing unpublished changes" banner and a noindex tag. Access to
 * drafts is controlled by Next.js's httpOnly draft-mode cookie alone.
 */
export const PREVIEW_HINT_COOKIE = "artbymoon-preview";

/** Same attributes as Next.js's draft-mode cookie, so it also works inside the Studio's iframe. */
export const previewHintCookie = {
  path: "/",
  sameSite: "none",
  secure: true,
  partitioned: true,
} as const;
