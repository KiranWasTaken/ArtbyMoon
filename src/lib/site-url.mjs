// Shared by next.config.ts (build-time checks) and src/lib/site.ts.
// Plain ESM so the config can import it without a TypeScript step.

const PLACEHOLDER_HOSTS =
  /(^|\.)example\.(com|org|net)$|^localhost$|^127\.|^0\.0\.0\.0$|\.local$|\.test$|\.example$/;

/**
 * Returns the normalised origin if `value` is a usable production origin
 * (absolute https URL, not a placeholder or local host), otherwise null.
 */
export function productionOrigin(value) {
  if (!value) return null;
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || PLACEHOLDER_HOSTS.test(url.hostname))
    return null;
  return url.origin;
}
