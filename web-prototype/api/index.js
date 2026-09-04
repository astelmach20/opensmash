// Vercel entry: one Node function fronts the whole OpenSmash server.
// Static output (public-out/) is served by the CDN first — the Vite bundle,
// the packaged engine under /engine/, and /assets/ — and everything else is
// rewritten here (vercel.json). Play-only deployment defaults: the roster is
// served from the public GCS bucket via config/baked-assets.json, fighter
// creation is off, Firebase auth is off, and scratch dirs live in /tmp.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import runtimeFiles from "./runtime-files.json" with { type: "json" };

// The files the server reads at request time (roster config, app shell,
// engine manifest) are packed by scripts/vercel-build.sh and written out here
// once per cold start; OPENSMASH_APP_ROOT points the server at this tree.
const RUNTIME_ROOT = "/tmp/opensmash-runtime";
for (const [relative, base64] of Object.entries(runtimeFiles)) {
  const target = path.join(RUNTIME_ROOT, relative);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, Buffer.from(base64, "base64"));
}

const defaults = {
  NODE_ENV: "production",
  VERCEL: "1",
  OPENSMASH_APP_ROOT: RUNTIME_ROOT,
  ENGINE_ROOT: path.join(RUNTIME_ROOT, "engine-dist"),
  BAKED_ASSET_SOURCE: "remote",
  // The public bucket's CORS rule only admits smash.fun, so fighter files are
  // proxied through this origin: vercel.json rewrites /gcs/* to the bucket.
  ASSET_BASE_URL: "/gcs",
  CREATION_ENABLED: "0",
  FIGHTER_WORKER_DISABLED: "1",
  FIREBASE_AUTH_ENABLED: "0",
  JOB_DATABASE: "local",
  OBJECT_STORE: "local",
  FIGHTER_EXECUTION_MODE: "local",
  FIGHTER_JOBS_ROOT: "/tmp/opensmash/fighter-jobs",
  OBJECT_STORE_ROOT: "/tmp/opensmash/objects",
};
for (const [key, value] of Object.entries(defaults)) process.env[key] ??= value;

const { serverlessHandler } = await import("../server/index.js");
export default serverlessHandler;
