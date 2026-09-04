// Vercel entry: one Node function fronts the whole OpenSmash server.
// Static output (public-out/) is served by the CDN first — the Vite bundle,
// the packaged engine under /engine/, and /assets/ — and everything else is
// rewritten here (vercel.json). Play-only deployment defaults: the roster is
// served from the public GCS bucket via config/baked-assets.json, fighter
// creation is off, Firebase auth is off, and scratch dirs live in /tmp.
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaults = {
  NODE_ENV: "production",
  VERCEL: "1",
  ENGINE_ROOT: path.join(APP_ROOT, "engine-dist"),
  BAKED_ASSET_SOURCE: "remote",
  GCS_PUBLIC_BUCKET: "smash-the-weights-fighter-assets",
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
