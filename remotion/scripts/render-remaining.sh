#!/usr/bin/env bash
# Resume batch render after intro (skip IrrawaddyIntro if already present).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out

render() {
  local id="$1"
  local out_file="$2"
  echo "=== Rendering $id → $out_file ==="
  npx remotion render src/index.ts "$id" "$out_file"
}

# render:all chain (skip intro)
render HistoricalMap out/HistoricalMap.mp4
render ForcesInfographic out/ForcesInfographic.mp4
render PhoenixPrimer out/PhoenixPrimer.mp4
render TacticalSetup out/TacticalSetup.mp4
render Phase1Ambush out/Phase1Ambush.mp4
render Phase2ReturnFire out/Phase2ReturnFire.mp4
render Beat-ThompsonVolley out/Beat-ThompsonVolley.mp4
render Beat-M1919 out/Beat-M1919.mp4
render Beat-SecondVolley out/Beat-SecondVolley.mp4
render Beat-LMGSuppression out/Beat-LMGSuppression.mp4
render Beat-MoraleCollapse out/Beat-MoraleCollapse.mp4
render Beat-Withdrawal out/Beat-Withdrawal.mp4
render EALDemo out/EALDemo.mp4
render OutcomeDashboard out/OutcomeDashboard.mp4

echo "=== All renders complete ==="
ls -lh out/*.mp4
