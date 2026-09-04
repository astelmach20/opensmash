#!/usr/bin/env node
// Pack the listed files (paths relative to web-prototype/) into
// api/runtime-files.json as { "<relative path>": "<base64>" }.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = {};
for (const relative of process.argv.slice(2)) {
  files[relative] = readFileSync(path.join(appRoot, relative)).toString("base64");
}
const out = path.join(appRoot, "api", "runtime-files.json");
writeFileSync(out, JSON.stringify(files));
console.log(`Packed ${Object.keys(files).length} runtime files into ${path.relative(appRoot, out)}`);
