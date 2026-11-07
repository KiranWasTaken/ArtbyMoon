import { defineCliConfig } from "sanity/cli";
import { readSanityEnv } from "./src/sanity/env.mjs";

/** For `pnpm exec sanity …` commands (CORS, schema deploy, datasets). */
const { projectId, dataset } = readSanityEnv();

export default defineCliConfig({ api: { projectId, dataset } });
