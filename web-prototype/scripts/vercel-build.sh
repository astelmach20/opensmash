#!/bin/bash
# Vercel build: fetch the packaged wasm engine (built ROM-free by
# .github/workflows/build-engine.yml), build the Vite app, and assemble the
# static output directory. The app shell (index.html) is deliberately left out
# of the static output so the function serves it with the embedded roster.
set -euo pipefail
cd "$(dirname "$0")/.."

ENGINE_TARBALL_URL="${ENGINE_TARBALL_URL:-https://github.com/astelmach20/opensmash/releases/download/engine-latest/engine-web-dist.tar.gz}"
rm -rf engine-dist && mkdir -p engine-dist
echo "Fetching engine: $ENGINE_TARBALL_URL"
curl -fsSL --retry 3 "$ENGINE_TARBALL_URL" | tar -xz -C engine-dist
test -f engine-dist/BattleShip.wasm
test -f engine-dist/torch/torch.wasm
test ! -e engine-dist/files/BattleShip.o2r
echo "Engine: $(cat engine-dist/BATTLESHIP_COMMIT 2>/dev/null || echo unknown)"

npx vite build

rm -rf public-out && mkdir -p public-out
cp -R dist/. public-out/
rm -f public-out/index.html
cp -R engine-dist public-out/engine
cp -R visual/assets public-out/assets
du -sh public-out engine-dist dist
