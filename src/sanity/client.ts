import "server-only";
import { createClient, type SanityClient } from "next-sanity";
import {
  apiVersion,
  dataset,
  projectId,
  sanityConfigured,
  testApiHost,
} from "./config";

/**
 * Server-side Sanity clients. Never imported by client components
 * (`server-only` makes that a build error), so tokens stay on the server.
 *
 * useCdn is false: Next.js caches every query result itself ('use cache' +
 * tags, purged by the webhook), so the live API is hit rarely and always
 * returns just-published content.
 */
function make(config: Parameters<typeof createClient>[0]): SanityClient | null {
  if (!sanityConfigured) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    stega: false,
    // Bounded: a slow or failing request must not hold up page rebuilds (Next
    // shares one in-flight fetch between concurrent requests). Fail fast and
    // keep serving the cached page instead.
    maxRetries: 2,
    timeout: 10_000,
    ...(testApiHost && { apiHost: testApiHost, useProjectHostname: false }),
    ...config,
  });
}

/** Published content only. No token: the dataset must be public. */
export const publishedClient = make({ perspective: "published" });

const readToken = process.env.SANITY_API_READ_TOKEN;

/** Drafts and unpublished changes, for Draft Mode only. Needs a Viewer token. */
export const draftClient = readToken
  ? make({ perspective: "drafts", token: readToken })
  : null;

/** Client used by the draft-mode enable route to validate preview secrets. */
export const previewSecretClient = readToken
  ? make({ token: readToken })
  : null;
