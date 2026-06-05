# Remotion — Irrawaddy River Ambush Motion Graphics

React/Remotion project wired to repo-root `src/functions.js` (phoenix-functions) for live Phoenix Command calculations.

## Setup

From the repo root, link phoenix-functions first (once):

```bash
./scripts/link-phoenix.sh
```

Then:

```bash
cd remotion
npm install
npm start
```

Open Remotion Studio at http://localhost:3000 to preview compositions.

## Export scripts

| Script | Purpose |
|--------|---------|
| `npm run render:intro` | `IrrawaddyIntro` |
| `npm run render:ambush` | `Phase1Ambush` (BAR hero beat) |
| `npm run render:all` | Original batch (intro + long comps) |
| `./scripts/render-tactical.sh` | All tactical-map compositions |
| `./scripts/render-remaining.sh` | Batch without intro |

Outputs land in `remotion/out/`.

## Compositions

| ID | File | Purpose |
|----|------|---------|
| `IrrawaddyIntro` | `compositions/IrrawaddyIntro.tsx` | Cold open — river, rafts, title |
| `HistoricalMap` | `compositions/HistoricalMap.tsx` | CBI theater animated map layers |
| `ForcesInfographic` | `compositions/ForcesInfographic.tsx` | Weapon cards (incl. BAR, M1 Carbine) + loadout |
| `PhoenixPrimer` | `compositions/HistoricalMap.tsx` | Phase/Impulse/EAL steps |
| `TacticalSetup` | `compositions/HistoricalMap.tsx` | Pre-ambush tactical map |
| `Beat-ThompsonVolley` | `compositions/CombatBeats.tsx` | beat-01 |
| `Phase1Ambush` | `compositions/CombatBeats.tsx` | beat-02 BAR A2 |
| `Beat-M1919` | `compositions/CombatBeats.tsx` | beat-03 |
| `Beat-SecondVolley` | `compositions/CombatBeats.tsx` | beat-04 |
| `Phase2ReturnFire` | `compositions/CombatBeats.tsx` | beat-05 |
| `Beat-LMGSuppression` | `compositions/CombatBeats.tsx` | beat-06 |
| `Beat-MoraleCollapse` | `compositions/CombatBeats.tsx` | beat-07 |
| `Beat-Withdrawal` | `compositions/CombatBeats.tsx` | beat-08 |
| `EALDemo` | `compositions/EALDemo.tsx` | 90s tutorial (BAR @ 120 hex) |
| `OutcomeDashboard` | `compositions/EALDemo.tsx` | Victory infographic |

## Components

- `PhaseClock` — Phase/Impulse timeline bar
- `EALPanel` — Animated modifier stack + odds bar
- `DiceRoller` — d100 odometer with HIT/MISS
- `WeaponCard` / `CharacterCard` — Unit stat cards
- `TacticalMap` — `river-graphic.png` background, `boat.png` rafts on `RIVER_PATH`, squad tokens, tracers
- `CombatResolution` — Full beat layout (map + EAL + dice + damage + optional volley subtitles)
- `VictoryDashboard` — End-screen tally

## Scenario Data

`src/data/scenario.ts` — OOB, 8 combat beats with scripted rolls. EAL via `resolveFromWeapon()`.

`src/data/mapLayout.ts` — Artwork map layout, `RIVER_PATH`, raft `pathStart`, drift. Set `DEBUG_RIVER_PATH = true` to preview centerline in Studio.

## Tactical map calibration

1. Open `public/calibrate-river-path.html` in a browser
2. Click/drag waypoints along the river centerline
3. Copy output into `RIVER_PATH` in `mapLayout.ts`
4. Re-run `./scripts/render-tactical.sh`

Source artwork: repo-root `river-graphic.png`, `boat.png` (copied to `public/assets/`).

## Fonts

Loaded non-blocking in `Root.tsx` (Google Fonts CDN). Fallbacks in `theme.ts` if offline during render.

## Replacing placeholder maps

- **Tactical kill zone:** update `river-graphic.png` + `mapLayout.ts` (not SVG bands)
- **CBI theater map:** replace SVG paths in `HistoricalMap.tsx` (QGIS/Mapbox export)
