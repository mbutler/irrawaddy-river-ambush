#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out

render() {
  echo "=== Rendering $1 → $2 ==="
  npx remotion render src/index.ts "$1" "$2"
}

render TacticalSetup out/TacticalSetup.mp4
render Beat-ThompsonVolley out/Beat-ThompsonVolley.mp4
render Phase1Ambush out/Phase1Ambush.mp4
render Beat-M1919 out/Beat-M1919.mp4
render Beat-SecondVolley out/Beat-SecondVolley.mp4
render Phase2ReturnFire out/Phase2ReturnFire.mp4
render Beat-LMGSuppression out/Beat-LMGSuppression.mp4
render Beat-MoraleCollapse out/Beat-MoraleCollapse.mp4
render Beat-Withdrawal out/Beat-Withdrawal.mp4

echo "=== Tactical renders complete ==="
ls -lh out/TacticalSetup.mp4 out/Beat-*.mp4 out/Phase*.mp4
