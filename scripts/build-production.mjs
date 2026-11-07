// `pnpm build:production`: a production build with strict checks.
// Fails unless NEXT_PUBLIC_SITE_URL is a real https origin and sample content
// is off (see next.config.ts), then verifies the output (check-build.mjs).
// Cross-platform: sets the environment here instead of in the npm script.
import { spawnSync } from "node:child_process";

const env = { ...process.env, ARTBYMOON_PRODUCTION: "1" };
const run = (args) => {
  const r = spawnSync("pnpm", args, {
    stdio: "inherit",
    env,
    shell: process.platform === "win32",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

run(["exec", "next", "build"]);
run(["run", "check:build"]);
