#!/usr/bin/env bash
# Link phoenix-functions into repo-root src/ for Remotion and log-beats.mjs.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PHOENIX="${PHOENIX_FUNCTIONS_PATH:-$REPO_ROOT/../phoenix-functions}"

if [[ ! -d "$PHOENIX/src" ]]; then
  echo "phoenix-functions not found at: $PHOENIX"
  echo "Clone it alongside this repo, or set PHOENIX_FUNCTIONS_PATH."
  echo "  git clone https://github.com/mbutler/phoenix-functions \"$PHOENIX\""
  exit 1
fi

ln -sfn "$PHOENIX/src" "$REPO_ROOT/src"
echo "Linked $REPO_ROOT/src -> $PHOENIX/src"

if [[ ! -d "$PHOENIX/node_modules" ]]; then
  echo "Installing phoenix-functions dependencies..."
  (cd "$PHOENIX" && npm install)
fi

if [[ ! -f "$PHOENIX/dist/phoenix-functions.js" ]]; then
  echo "Building phoenix-functions bundle (for log-beats.mjs)..."
  (cd "$PHOENIX" && NODE_OPTIONS=--openssl-legacy-provider npm run build)
fi

echo "Done. Run: cd remotion && npm install && npm start"
