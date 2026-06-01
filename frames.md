# Irrawaddy River Ambush — Frame Specifications

Figma-style specifications for every infographic frame. Frame IDs match `storyboard.md`. Canvas default: **1920×1080**, safe margin **80px**.

---

## Global Components (Figma library)

Create as **Components** with variants:

| Component | Variants | Size |
|-----------|----------|------|
| `LayerBadge` | historical / hybrid / simulation | auto×32 |
| `PhaseClock` | phase 1–20, impulse 1–4 | 600×56 |
| `EALPanel` | empty / populating / complete | 420×auto |
| `DiceDigit` | rolling / locked-hit / locked-miss | 80×100 |
| `WeaponCard` | allied / japanese | 320×auto |
| `CharacterCard` | allied / japanese | 280×auto |
| `RaftToken` | normal / active / sinking | 56×24 |
| `SquadToken` | hidden / active / firing | 28×28 |
| `KVGauge` | empty / filling / fail / pass | 300×80 |
| `LowerThird` | default | 800×64 |

---

## ACT 1 — COLD OPEN

### FR-001 · River Establishing
**Storyboard:** SB-001  
**Duration:** 8s  
**Mode:** Hybrid  

| Layer | Element | Spec |
|-------|---------|------|
| BG | Full bleed river gradient | `#2c4a6e` → `#4a7ab0`, 35%–65% viewport height |
| L3 | Jungle bank left 22% | `#1a3c34` solid |
| L4 | Current arrows ×4 | `#4a7ab0`, 14px ↓, 50% opacity, drift anim 2s loop |
| L5 | Raft tokens ×3 | Component `RaftToken`, stagger fade Y from 42%→55% |
| L6 | Vignette | radial, 15% edge `#0d1117` |

**Animation:** 0–2s fade from black; 2–8s rafts drift downstream.

---

### FR-002 · Title Card
**Storyboard:** SB-002  
**Duration:** 7s  

| Element | Spec |
|---------|------|
| Line 1 | `IRRAWADDY RIVER AMBUSH` — Barlow Condensed 72px 800, `#e6edf3`, center |
| Line 2 | `JULY 1944` — 48px 600, `#c9a227`, 8px below |
| Subtitle | `Every bullet calculated.` — Source Serif 4 italic 22px, `#8b949e`, 24px below |
| Entry | slide up 30px + fade, 0.8s ease-out |

---

### FR-003 · Phase Slam
**Storyboard:** SB-003  
**Duration:** 5s  
**Mode:** Simulation  

| Element | Spec |
|---------|------|
| Center text | `PHASE 1 · IMPULSE 1` — Barlow 64px, `#c9a227`, letter-spacing 6px |
| Component | `PhaseClock` phase=1 impulse=1 |
| Component | `LayerBadge` simulation |
| BG | dim river `#0d1117` 85% overlay |

---

## ACT 2 — HISTORICAL

### FR-010 · CBI Theater Map Base
**Storyboard:** SB-013  
**Duration:** 15s  
**Mode:** Historical  

| Element | Spec |
|---------|------|
| BG | `#1a3c34` at 30% over `#0d1117` |
| Map | Burma outline SVG — replace with QGIS export; stroke `#8fbc8f` 2px |
| Title | `CBI THEATER — JULY 1944` — top-right 380px panel |
| Component | `LayerBadge` historical |

---

### FR-011 · Map Layer — Stilwell Advance
**Storyboard:** SB-018  

| Element | Spec |
|---------|------|
| Arrow | `#e8a838`, 6px stroke, from Ledo → Myitkyina |
| Label | `Stilwell's advance` — 14px Source Sans, `#e6edf3` |
| Toggle row | dot `#e8a838` + label, opacity 0→1 |

---

### FR-012 · Map Layer — Japanese Retreat
**Storyboard:** SB-022  

| Element | Spec |
|---------|------|
| Route | dashed `#8b3a3a`, river path along Irrawaddy |
| Label | `15th Army retreat / resupply` |

---

### FR-013 · Map Layer — OSS Detachment 101
**Storyboard:** SB-026  

| Element | Spec |
|---------|------|
| Zones | `#8fbc8f` 20% fill circles in Kachin hills north |
| Label | `OSS Det 101 operating areas` |

---

### FR-014 · Myitkyina Objective
**Storyboard:** SB-030  

| Element | Spec |
|---------|------|
| Marker | circle 24px `#e8a838` pulse |
| Callout | `Myitkyina — Falls 3 Aug 1944` |
| Quote | Source Serif italic bottom-left |

---

### FR-015 · Archival Photo — Kachin Rangers
**Storyboard:** SB-034  

| Element | Spec |
|---------|------|
| Photo | duotone jungle-deep / river-foam, 2px border |
| Caption | `OSS-trained Kachin Rangers, northern Burma` — 12px serif |
| Ken Burns | 3% scale, 8s |

---

### FR-016 · Archival Photo — Merrill's Marauders Context
**Storyboard:** SB-038  

Same treatment as FR-015. Caption: `Myitkyina campaign — combined Allied pressure`.

---

## ACT 3 — FORCES

### FR-020 · Order of Battle Overview
**Storyboard:** SB-046  

| Column | Content |
|--------|---------|
| Left | KACHIN RANGERS — 4 squads, 18 fighters (icons) |
| Right | JAPANESE — 3 rafts, 30 troops |
| Center divider | 1px `#30363d` |

---

### FR-021 · Weapon Card — Thompson M1928A1
**Storyboard:** SB-050  
**Component:** `WeaponCard` allied  

| Field | Value |
|-------|-------|
| Name | Thompson M1928A1 |
| Caliber | .45 ACP |
| PEN / DC | 1.3 / 2 @ 40 hex |
| ROF | 7 AC |
| SAB | 3 |
| Role | Primary ambush weapon — close range saturation |

---

### FR-022 · Weapon Card — Bren Mk1
**Storyboard:** SB-054  

| Field | Value |
|-------|-------|
| PEN / DC | 13 / 7 @ 120 hex |
| Role | Suppressive fire — pins rafts in open water |

---

### FR-023 · Weapon Card — M1919 A6
**Storyboard:** SB-058  

| Field | Value |
|-------|-------|
| PEN / DC | 13 / 7 @ 200 hex |
| Role | Long-range enfilade — entire river lane |

---

### FR-024 · Weapon Card — Arisaka Type 99
**Storyboard:** SB-062  
**Component:** `WeaponCard` japanese  

| Field | Value |
|-------|-------|
| PEN / DC | 15 / 7 @ 200 hex |
| Role | Bolt-action return fire — unstable platform |

---

### FR-025 · Kachin Loadout Donut
**Storyboard:** SB-066  

| Segment | % | Color |
|---------|---|-------|
| Thompson / SMG | 60 | `#e8a838` |
| Bren LMG | 25 | `#8fbc8f` |
| M1919 HMG | 10 | `#58a6ff` |
| Other | 5 | `#6e7681` |

Center label: `KACHIN LOADOUT` mono 12px.

---

### FR-026 · Japanese Raft Cross-Section
**Storyboard:** SB-070  

| Element | Spec |
|---------|------|
| Raft | 400×80px bamboo texture (brown `#5c4033` + green vine) |
| Soldiers | 12 dots `#8b3a3a` standing |
| Cover bar | empty — label `COVER: 0` red |
| LMG icon | one dot larger |

---

### FR-027 · Terrain Cross-Section
**Storyboard:** SB-074  

Side view: jungle bank (hard cover +2 narrative) | river 1000m annotation | far bank sparse.  
Monsoon rain overlay: diagonal lines `#a8c8e8` 10% opacity.

---

## ACT 4 — PHOENIX COMMAND PRIMER

### FR-030 · Phase Timeline
**Storyboard:** SB-079  

| Element | Spec |
|---------|------|
| Bar | 800×40px, 4 segments, each labeled Impulse 1–4 |
| Label | `1 PHASE = 2 SECONDS` — 32px headline |
| Fill | phosphor left-to-right over 2s |

---

### FR-031 · Combat Actions Bar
**Storyboard:** SB-083  

Character example Carter CA=6: segments `[2][2][1][1]` per impulse.  
Label: `Combat Actions per Impulse (Table 1E)`

---

### FR-032 · EAL Stack (Empty)
**Storyboard:** SB-087  
**Component:** `EALPanel` empty state  

Header only: `EFFECTIVE ACCURACY LEVEL` — rows ghosted.

---

### FR-033 · EAL Stack (Populated) — Bren Example
**Storyboard:** SB-091  
**Component:** `EALPanel` complete  

Use live values from `resolveFromWeapon('Bren Mk1', 6, ...)`.

---

### FR-034 · Odds Ring
**Storyboard:** SB-095  

SVG ring 160px, stroke 12px, fill to odds %, center text mono 28px.

---

### FR-035 · Dice Roll Hit
**Storyboard:** SB-099  

Two `DiceDigit` → `22` → green `HIT` → subtext `22 ≤ 58%`.

---

### FR-036 · Dice Roll Miss
**Storyboard:** SB-103  

Roll `78` → red `MISS` → scatter arrow optional.

---

### FR-037 · Hit Location Silhouette
**Storyboard:** SB-107  

Human silhouette 200px, zone highlight (thigh flesh example), PD callout `16 PD — Disabling`.

---

### FR-038 · KV Gauge
**Storyboard:** SB-111  
**Component:** `KVGauge`  

PD 56 vs KV 35, roll 18, FAIL state.

---

## ACT 5 — TACTICAL SETUP

### FR-040 · Tactical Map — Initial State
**Storyboard:** SB-121  

Full `TacticalMap`: 3 rafts upstream, 4 squad tokens hidden (50% opacity), current arrows.

---

### FR-041 · Character Card — Lt. Carter
**Storyboard:** SB-125  

Full stats per scenario-pc.md.

---

### FR-042 · Character Card — Pvt. Yamada
**Storyboard:** SB-129  

---

### FR-043 · Range Bands Overlay
**Storyboard:** SB-133  

| Band | Hex | Color |
|------|-----|-------|
| Close | 0–50 | `#e8a838` 15% |
| Medium | 50–150 | `#ffc857` 10% |
| Long | 150–250 | `#58a6ff` 10% |

Labels: Thompson / Bren / M1919 sweet spots.

---

### FR-044 · Surprise Rule Card
**Storyboard:** SB-137  

| Text | Style |
|------|-------|
| `SPECIAL RULE: SURPRISE` | headline 24px |
| `Japanese hold fire — Phase 1` | body |
| `Kachin: 6 Actions pre-aimed` | mono highlight |

---

## ACT 6 — PLAYTHROUGH

### FR-050 · Combat Beat Layout (Master)
**Storyboard:** SB-141+  
**Used for all beats 01–08**

| Region | Content |
|--------|---------|
| Top-left | `LayerBadge` simulation |
| Top-center | Beat title 28px |
| Left 50% | `TacticalMap` with tracer |
| Bottom-left | `CharacterCard` shooter |
| Top-right | `EALPanel` |
| Center | `DiceRoller` |
| Bottom-right | Damage panel (on hit) |
| Bottom-center | `PhaseClock` |

---

### FR-051 · Beat 01 — Thompson Volley
**Storyboard:** SB-145  
**Remotion:** `Beat-ThompsonVolley`  
Raft 1 active, Bravo active, casualties +3 after resolve.

---

### FR-052 · Beat 02 — Bren Hero Shot
**Storyboard:** SB-152  
**Remotion:** `Phase1Ambush`  
Primary thumbnail frame: EAL visible, dice mid-lock, tracer to Raft 1.

---

### FR-053 · Beat 03 — M1919 Enfilade
**Storyboard:** SB-159  
Jam check inset: small panel `d100: 47 — CLEAR`.

---

### FR-054 · Beat 04 — Scatter Miss
**Storyboard:** SB-166  
Scatter vector into water, splash particles ×3.

---

### FR-055 · Beat 05 — Yamada Return Fire
**Storyboard:** SB-173  
**Remotion:** `Phase2ReturnFire`  
Reverse tracer japanese→bank, `Fire Over/Around` callout on target.

---

### FR-056 · Beat 06 — LMG Duel
**Storyboard:** SB-178  
Split: Alpha Bren position vs Raft 2 LMG, both EAL panels (sequential).

---

### FR-057 · Beat 07 — Morale Collapse
**Storyboard:** SB-182  
`KVGauge` + Raft 1 `sinking` variant + stamp `PANIC` crimson 48px rotated −5°.

---

### FR-058 · Beat 08 — Withdrawal
**Storyboard:** SB-185  
Squads fade into jungle (opacity 1→0), Delta tracer, whistle icon optional.

---

### FR-059 · Casualty Tracker (Persistent HUD)
**Storyboard:** SB-188  

| Side | Display |
|------|---------|
| Kachin | 1 KIA, 2 WIA |
| Japanese | 24/30 eliminated |
| Rafts | 2 sunk, 1 escaping |

Position: top-right below EAL when space, or bottom bar.

---

## ACT 7 — OUTCOME

### FR-060 · Victory Dashboard
**Storyboard:** SB-211  
**Remotion:** `OutcomeDashboard`  

Full two-column tally per scenario-pc.md.

---

### FR-061 · Result Stamp
**Storyboard:** SB-215  

`MAJOR KACHIN VICTORY` — 48px phosphor, scale 0→1 spring.

---

### FR-062 · Historical Epilogue Map
**Storyboard:** SB-219  

Zoom out to FR-010 map, Myitkyina marker turns allied color, date `3 AUG 1944`.

---

### FR-063 · End Card
**Storyboard:** SB-223  

| Element | Content |
|---------|---------|
| Title | `IRRAWADDY RIVER AMBUSH` |
| Sub | Phoenix Command playthrough |
| Links | GitHub, scenario PDF |
| QR | optional phoenix-functions repo |

---

## THUMBNAIL

### FR-900 · YouTube Thumbnail
**Size:** 1280×720  

| Left 50% | Right 50% |
|----------|------------|
| Historical river map, raft icons | EAL panel `58%` + dice `34` |
| Text top: `2 SECONDS` red | Text bottom: `PHOENIX COMMAND` |

High contrast, readable at 120px height.

---

## SOCIAL CLIPS

### FR-901 · EAL Demo Vertical
**Size:** 1080×1920  
**Remotion:** `EALDemo` crop center  
30–60s loop for Shorts.

---

## Export Checklist

- [ ] All frames use color tokens from style-guide.md  
- [ ] All combat numbers verified against `scenario.ts`  
- [ ] Font files embedded or documented  
- [ ] SVG map asset replaced from placeholder  
- [ ] Archival photos licensed / public domain verified  
- [ ] No emoji in final renders (icons only)
