import { apiVersion, readSanityEnv } from "./env.mjs";

/**
 * Public Sanity settings for the website and Studio. `sanityConfigured`
 * decides the content source (src/lib/content/source.ts): when false, the
 * site keeps using the local files in src/content/artist/.
 */
const env = readSanityEnv();

export const sanityConfigured = env.configured;
export const projectId = env.projectId;
export const dataset = env.dataset;
export { apiVersion };

/**
 * TESTING ONLY: points the client at a local mock of the Sanity HTTP API.
 * Production builds refuse it (next.config.ts). Not part of normal setup.
 */
export const testApiHost = process.env.SANITY_API_HOST || undefined;
