// `pnpm preview:sample`: builds and serves the sample-content preview on
// http://localhost:3000. Watermarked sample images, a red banner, noindex.
// For reviewing layouts only. Never deploy this build. Cross-platform.
import { spawnSync } from "node:child_process";

const env = { ...process.env, ARTBYMOON_SAMPLE_CONTENT: "1" };
delete env.ARTBYMOON_PRODUCTION;
const run = (args) => {
  const r = spawnSync("pnpm", args, {
    stdio: "inherit",
    env,
    shell: process.platform === "win32",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

run(["exec", "next", "build"]);
run(["exec", "next", "start"]);
