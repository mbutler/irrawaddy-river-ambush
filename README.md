# Irrawaddy River Ambush — Motion Graphics Production Package

Complete production assets for a YouTube documentary/playthrough of the July 1944 Irrawaddy River ambush, resolved with Phoenix Command, rendered entirely as infographics and motion graphics (no physical miniatures).

## Contents

| File / Folder | Purpose |
|---------------|---------|
| [motion-script.md](./motion-script.md) | Full voiceover script (~42 min) with `[ANIM:]` cues for every beat |
| [storyboard.md](./storyboard.md) | Frame-by-frame shot list with durations, layers, and transitions |
| [style-guide.md](./style-guide.md) | Colors, typography, UI components, motion principles |
| [frames.md](./frames.md) | Figma-style frame specifications for every infographic card |
| [scenario-pc.md](./scenario-pc.md) | Phoenix Command OOB, status sheets, special rules, 8-beat turn script with EAL math |
| [remotion/](./remotion/) | Remotion/React project — live EAL, dice, phase clock, tactical map components |

## Recommended Workflow

### Primary path (full VO + rough cut)

1. **Read** `scenario-pc.md` — forces, scale, pre-scripted combat beats.
2. **Record** the full voiceover from `motion-script.md` (~42 min). Numbers and beats are verified against `scenario.ts`.
3. **Rough edit** in your NLE — lay VO bed first, drop in Remotion exports and placeholders where needed.
4. **Drill down** — re-record VO pickups, re-render individual compositions, swap sections as you refine.
5. **Animate** in Remotion (`cd remotion && npm start`) — preview compositions; export with scripts below.

**Act boundaries** (for drilling into sections after the rough cut):

| Act | Time | Content |
|-----|------|---------|
| 1 | 0:00–4:30 | Cold open |
| 2 | 4:30–16:00 | Scenario, forces, weapons |
| 3 | 16:00–22:30 | Phoenix Command primer |
| 4 | 22:30–28:00 | Tactical setup |
| 5 | 28:00–40:00 | Playthrough (8 beats) |
| 6 | 40:00–42:30 | Outcome & epilogue |

Vertical-slice editing (one act at a time) also works; see `storyboard.md` for shot IDs.

### Visual assets (tactical map)

| Asset | Location | Used by |
|-------|----------|---------|
| `river-graphic.png` | repo root + `remotion/public/assets/` | `TacticalMap` background |
| `boat.png` | repo root + `remotion/public/assets/` | Raft tokens on river path |
| River path waypoints | `remotion/src/data/mapLayout.ts` | Boat drift along `RIVER_PATH` |
| Path calibrator | `remotion/public/calibrate-river-path.html` | Click-to-trace; paste into `mapLayout.ts` |

Hex ranges in VO and Phoenix Command math are **simulation distances** — not pixel positions on the artwork.

## Video Specs

- **Resolution:** 3840×2160 (4K master), deliver 1920×1080
- **Frame rate:** 30 fps (Remotion default)
- **Target runtime:** 42 minutes (single video) or split at Act 4 (~22 min) / Act 5–7 (~20 min)
- **Audio:** VO @ −3 dBFS peak; UI SFX −18 dBFS; ambient bed −24 dBFS

## Visual Modes (see style-guide.md)

1. **Historical Mode** — documentary maps, archival photos, campaign context
2. **Hybrid Mode** — real geography morphs into tactical tokens and range arcs
3. **Simulation Mode** — Phoenix Command HUD (EAL panel, dice, phase clock, damage)

## Development Setup

Combat math comes from [phoenix-functions](https://github.com/mbutler/phoenix-functions). Clone it next to this repo, then link its `src/` here:

```bash
git clone https://github.com/mbutler/phoenix-functions ../phoenix-functions
./scripts/link-phoenix.sh
```

Override the path with `PHOENIX_FUNCTIONS_PATH` if needed. The script creates `src/` → `../phoenix-functions/src`, installs dependencies, and builds `dist/phoenix-functions.js` (used by `log-beats.mjs`). Remotion imports source files directly from `src/` via webpack.

## Remotion Quick Start

```bash
cd remotion
npm install
npm start                    # Remotion Studio at http://localhost:3000
npm run render:intro         # IrrawaddyIntro
npm run render:ambush        # Phase1Ambush (BAR hero beat)
./scripts/render-tactical.sh # All tactical-map compositions
./scripts/render-remaining.sh # Full batch minus intro (after link-phoenix)
npm run render:all           # Original batch script
```

Compositions are registered in `remotion/src/Root.tsx`. All combat math uses repo-root `src/functions.js` (from phoenix-functions) via the local `phoenix` wrapper — numbers on screen match the rulebook.

Verify beat EAL offline: `node scripts/log-beats.mjs`

## Source Material

- Scenario: [`Irrawaddy River Ambush.pdf`](./Irrawaddy%20River%20Ambush.pdf)
- Rules: [`phoenix-command.md`](./phoenix-command.md)
- Lookup engine: `src/functions.js`, `src/weapons.js`, `src/tables.js` (phoenix-functions, linked above)

## Composition ↔ Storyboard Map

| Remotion ID | Storyboard Section | Duration |
|-------------|-------------------|----------|
| `IrrawaddyIntro` | SB-001 – SB-012 | 45s |
| `HistoricalMap` | SB-013 – SB-045 | 6 min |
| `ForcesInfographic` | SB-046 – SB-078 | 6 min |
| `PhoenixPrimer` | SB-079 – SB-120 | 6 min |
| `TacticalSetup` | SB-121 – SB-140 | 6 min |
| `Phase1Ambush` | SB-141 – SB-185 | 12 min |
| `Phase2ReturnFire` | SB-186 – SB-210 | 6 min |
| `WithdrawalAndOutcome` | SB-211 – SB-235 | 6 min |
| `EALDemo` | Standalone tutorial loop | 90s |
| `WeaponCard-Thompson` etc. | Per frames.md | 8s each |

## License

Production docs: same as repository (MIT). Archival imagery: verify public-domain status before publish.
