import { existsSync } from "node:fs";
import path from "node:path";

export function resolveProjectPaths(appRoot, env = process.env) {
  const pipelineProjectRoot = path.resolve(appRoot, "..");
  const localEngineRoot = path.join(pipelineProjectRoot, "BattleShip", "web-dist");
  const workspaceRoot = existsSync(localEngineRoot)
    ? pipelineProjectRoot
    : path.resolve(pipelineProjectRoot, "..");

  // ENGINE_ROOT overrides the sibling-checkout lookup for deployments that
  // ship the packaged engine inside the app directory (e.g. Vercel).
  const engineRoot = env.ENGINE_ROOT
    ? path.resolve(appRoot, env.ENGINE_ROOT)
    : path.join(workspaceRoot, "BattleShip", "web-dist");

  return {
    pipelineProjectRoot,
    engineRoot,
    pipelineUiRoot: path.join(pipelineProjectRoot, "play", "ui"),
  };
}
