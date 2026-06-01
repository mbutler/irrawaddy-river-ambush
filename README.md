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

1. **Read** `scenario-pc.md` — understand forces, scale, and pre-scripted combat beats.
2. **Design** static frames in Figma using `style-guide.md` + `frames.md` as specs.
3. **Record** voiceover from `motion-script.md` (or record section-by-section aligned to storyboard).
4. **Animate** in Remotion (`cd remotion && npm install && npm start`) — compositions match storyboard IDs.
5. **Composite** in your NLE (DaVinci, Premiere) — VO bed + Remotion exports + archival B-roll.

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
npm start               # Remotion Studio at http://localhost:3000
npm run render:intro    # Export IrrawaddyIntro composition
npm run render:ambush   # Export Phase1Ambush composition
npm run render:all      # Batch export all compositions
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
