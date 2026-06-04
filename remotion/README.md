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

Open Remotion Studio to preview compositions. Export with `npm run render:intro` etc.

## Compositions

| ID | File | Purpose |
|----|------|---------|
| `IrrawaddyIntro` | `compositions/IrrawaddyIntro.tsx` | Cold open — river, rafts, title |
| `HistoricalMap` | `compositions/HistoricalMap.tsx` | CBI theater animated map layers |
| `ForcesInfographic` | `compositions/ForcesInfographic.tsx` | Weapon cards + loadout chart |
| `PhoenixPrimer` | `compositions/HistoricalMap.tsx` | Phase/Impulse/EAL steps |
| `TacticalSetup` | `compositions/HistoricalMap.tsx` | Pre-ambush map state |
| `Beat-ThompsonVolley` | `compositions/CombatBeats.tsx` | beat-01 |
| `Phase1Ambush` | `compositions/CombatBeats.tsx` | beat-02 BAR A2 |
| `Beat-M1919` | `compositions/CombatBeats.tsx` | beat-03 |
| `Phase2ReturnFire` | `compositions/CombatBeats.tsx` | beat-05 Yamada |
| `Beat-Withdrawal` | `compositions/CombatBeats.tsx` | beat-08 |
| `EALDemo` | `compositions/EALDemo.tsx` | 90s standalone tutorial |
| `OutcomeDashboard` | `compositions/EALDemo.tsx` | Victory infographic |

## Components

- `PhaseClock` — Phase/Impulse timeline bar
- `EALPanel` — Animated modifier stack + odds bar
- `DiceRoller` — d100 odometer with HIT/MISS
- `WeaponCard` / `CharacterCard` — Unit stat cards
- `TacticalMap` — Abstract kill-zone SVG map
- `CombatResolution` — Full beat layout (map + EAL + dice + damage)
- `VictoryDashboard` — End-screen tally

## Scenario Data

`src/data/scenario.ts` — OOB, positions, 8 combat beats with scripted rolls. EAL computed at import via `resolveFromWeapon()`.

To add a beat: extend `COMBAT_BEATS` and register a composition if needed.

## Fonts

Load in `public/` or via Google Fonts in a wrapper composition:

- Barlow Condensed (headlines)
- Source Sans 3 (body)
- JetBrains Mono (data)
- Source Serif 4 (historical quotes)

## Replacing Placeholder Map

Replace SVG in `HistoricalMap.tsx` with exported path from QGIS/Mapbox. Keep layer toggle UI; swap path `d=` attribute only.
