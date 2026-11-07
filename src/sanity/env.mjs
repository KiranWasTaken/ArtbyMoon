// Sanity environment, validated once. Plain ESM so next.config.ts, the
// Studio and scripts can import it without a TypeScript step.
//
// Public (safe in the browser):  NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
// Server only (never NEXT_PUBLIC): SANITY_API_READ_TOKEN, SANITY_API_WRITE_TOKEN, SANITY_REVALIDATE_SECRET

/** API version pinned to a date, as Sanity recommends. */
export const apiVersion = "2026-10-01";

const PROJECT_ID = /^[a-z0-9]{1,64}$/;
const DATASET = /^[a-z0-9][a-z0-9_-]{0,63}$/;

/**
 * Reads and validates the public Sanity settings.
 * - Neither set: `configured: false` (the site uses local content files).
 * - Set but malformed: `error` explains why; treated as not configured.
 */
export function readSanityEnv(
  // Literal `process.env.NEXT_PUBLIC_…` reads are required: Next.js inlines
  // them into browser code (sanity.config.ts runs in the browser for the
  // embedded Studio). A lookup through a variable (`env = process.env`) is
  // NOT inlined, so the browser would see an empty project ID.
  env = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
) {
  const projectId = (env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "").trim();
  const dataset = (env.NEXT_PUBLIC_SANITY_DATASET ?? "").trim() || "production";
  if (!projectId)
    return { configured: false, projectId: "", dataset, error: null };
  if (!PROJECT_ID.test(projectId)) {
    return {
      configured: false,
      projectId,
      dataset,
      error: `NEXT_PUBLIC_SANITY_PROJECT_ID "${projectId}" is not a valid Sanity project ID (lowercase letters and digits).`,
    };
  }
  if (!DATASET.test(dataset)) {
    return {
      configured: false,
      projectId,
      dataset,
      error: `NEXT_PUBLIC_SANITY_DATASET "${dataset}" is not a valid dataset name (lowercase letters, digits, _ and -).`,
    };
  }
  return { configured: true, projectId, dataset, error: null };
}

/** Names that must never be exposed to the browser via NEXT_PUBLIC_. */
export function leakedSecretNames(env = process.env) {
  return Object.keys(env).filter(
    (k) =>
      k.startsWith("NEXT_PUBLIC_") &&
      /TOKEN|SECRET|PASSWORD|PRIVATE/i.test(k) &&
      env[k],
  );
}
