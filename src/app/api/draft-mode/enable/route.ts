import { cookies, draftMode } from "next/headers";
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { previewSecretClient } from "@/sanity/client";
import { PREVIEW_HINT_COOKIE, previewHintCookie } from "@/sanity/preview";

/**
 * Turns on Draft Mode for an editor. Called by the Studio's Preview tool
 * with a short-lived secret that Sanity creates for a logged-in editor;
 * defineEnableDraftMode checks that secret against the dataset using the
 * server-only Viewer token. Without a valid secret it answers 401 and
 * nothing is enabled. Only same-site paths are used as the destination.
 */
const handler = previewSecretClient
  ? defineEnableDraftMode({ client: previewSecretClient })
  : null;

export async function GET(request: Request) {
  if (!handler) {
    return new Response("Preview is not configured (SANITY_API_READ_TOKEN).", {
      status: 501,
    });
  }
  try {
    return await handler.GET(request);
  } finally {
    // On success the handler enables Draft Mode and redirects (by throwing).
    // Only then add the non-secret hint that shows the "Previewing" banner.
    if ((await draftMode()).isEnabled) {
      (await cookies()).set(PREVIEW_HINT_COOKIE, "1", previewHintCookie);
    }
  }
}
