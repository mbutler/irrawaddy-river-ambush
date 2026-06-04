# Designer RFP — Irrawaddy River Ambush Motion Graphics

**Project:** ~42-minute YouTube documentary / Phoenix Command tutorial  
**Client handles:** voiceover, sound design, editing, archival photo research & licensing  
**Designer handles:** static and layered graphic assets only (no animation, no video edit, no VO)

Send proposals to: *[your email]*  
Proposal deadline: *[date]*  
Target delivery: *[date]*

---

## 1. Project summary

This video combines **historical documentary** (maps, context) with a **Phoenix Command simulation playthrough** (EAL panels, dice, combat beats). The script, storyboard, and rule-accurate data are complete. Current on-screen graphics are **programmer placeholders** (CSS divs, triangle trees, blob maps). We need **professional illustration and UI design** replaced via export files the client will integrate in **Remotion** (React) and **DaVinci Resolve**.

**Reference repo:** [irrawaddy-river-ambush](https://github.com/mbutler/irrawaddy-river-ambush)  
**Read first:** `style-guide.md`, `frames.md`, `storyboard.md`

**Visual tone:** Restrained military documentary meets tactical HUD — not sci-fi, not generic AI map, not game UI chrome. Think *Perun* / *Neo* clarity with Phoenix Command table gravitas.

---

## 2. Scope — what we need from you

### In scope
- Illustration and infographic design at **1920×1080** (master art at **3840×2160** preferred)
- **SVG** (preferred) or **PNG @2x** with **named, separated layers**
- **Figma source file** with components matching frame IDs below
- Icon/token library (rafts, squads, tracers, effects)
- Static card layouts (weapons, characters, rules, OOB)
- Map artwork (CBI theater + tactical kill-zone)
- UI **visual shells** for simulation HUD (panels, clocks, dice boxes) — see §5

### Out of scope (client provides)
- Voiceover recording and mix
- Music, SFX, ambient beds
- Final edit, color grade, chapter markers
- Archival photograph **sourcing** (client finds PD/licensed images)
- Remotion/React implementation (client or separate dev)
- Animation keyframes, video renders, Lottie (unless quoted as add-on)
- Phoenix Command rules accuracy (client verifies numbers against `scenario.ts`)

### Optional add-on (quote separately)
- **Photo treatment template** for archival inserts (duotone LUT + caption bar + vignette per `style-guide.md` §9)
- **YouTube thumbnail** FR-900 (1280×720)
- **1 revision pass** after client integrates assets into Remotion

---

## 3. Creative direction (non-negotiable)

| Rule | Detail |
|------|--------|
| **Color tokens** | Use exact hex values from `style-guide.md` — do not invent a new palette |
| **Typography** | Barlow Condensed (headlines), Source Sans 3 (body), JetBrains Mono (data), Source Serif 4 (historical quotes) |
| **Safe margin** | 80px on all sides at 1920×1080 |
| **Modes** | Three visual modes: Historical / Hybrid / Simulation — badge treatment differs |
| **No emoji** | Custom SVG icons only |
| **No pure white** | Max highlight `#e6edf3` — avoid `#ffffff` large fills |
| **Legibility** | All labels readable after YouTube H.264 compression at 1080p |

---

## 4. Deliverable packages

Quote **Tier 1 required**, **Tier 2 recommended**, and **Tier 3 optional** separately.

### Tier 1 — Hero assets (required)

These replace the worst placeholder art and appear repeatedly on screen.

| ID | Asset | Description | Format |
|----|-------|-------------|--------|
| **FR-001** | River establishing plate | Full-bleed Irrawaddy: near jungle bank (left ~22%), river center, muted monsoon palette, subtle current texture. **No title text baked in** — client overlays FR-002 in Remotion | SVG layers or PNG @2x: `bg`, `near_bank`, `river`, `far_bank`, `vignette` |
| **FR-040** | **Tactical kill-zone map** | Hero asset. Abstract top-down ambush map: near bank jungle, river lane (~60% width), far bank, 3 raft positions upstream, 4 hidden squad positions (Alpha/Bravo/Charlie/Delta). Designed for **940×540** map area within 1920×1080 frame (see `style-guide.md` §5.7). Must feel like a designed wargame map, not clip art | **SVG** with layers: `near_bank`, `river`, `far_bank`, `grid_optional`, `labels` |
| **TOKENS** | Unit token library | `RaftToken` (normal / active / sinking), `SquadToken` (hidden / active / firing), troop count badge, LMG dot indicator | SVG components, 56×24 raft, 28–32px squad |
| **FR-010** | CBI theater map base | Northern Burma / Irrawaddy context — stylized, not Google Maps screenshot. Coastline + river path as editable strokes | SVG: `land`, `river`, `labels` |
| **FR-011–014** | Map overlay layers | Separate files or Figma variants: Stilwell arrow (amber), Japanese retreat route (crimson dashed), OSS zones (green fill 20%), Myitkyina marker + callout | SVG layers toggled in edit/Remotion |
| **FR-021–026** | Weapon card **templates** | Allied (×5) + Japanese (×1): Thompson, Bren, M1919, BAR A2, M1 Carbine, Arisaka. Layout per `style-guide.md` §5.5. **Leave stat areas as editable text** or provide sample + separate text layer — stats must remain updatable | Figma component + SVG/PNG export |
| **FR-041–042** | Character card **templates** | Carter (allied) + Yamada (japanese). Stat slots: SL, SAL, CA, KV + CA per impulse I1–I4 | Figma component + export |

**Tier 1 deliverable count:** ~12 frame groups + token library

---

### Tier 2 — Supporting infographics (strongly recommended)

| ID | Asset | Description |
|----|-------|-------------|
| **FR-002** | Title card layout | Typography spec only OR static comp — client may animate in Remotion |
| **FR-020** | Order of battle split | Kachin 4 squads / 18 fighters vs Japanese 3 rafts / 30 troops |
| **FR-027** | Loadout donut | 28% Thompson / 44% M1 Carbine / 11% Bren / 11% BAR / 6% M1919 — segment colors in `frames.md` |
| **FR-028** | Raft cross-section | Bamboo raft, 12 troop silhouettes, `COVER: 0` callout |
| **FR-029** | Terrain cross-section | Bank hard cover \| river \| far bank + monsoon rain overlay layer |
| **FR-043** | Range bands overlay | Close / medium / long hex bands for tactical map; weapon sweet-spot labels |
| **FR-044** | Surprise rule card | `SPECIAL RULE: SURPRISE` — Japanese hold fire Phase 1; Kachin 6 Actions pre-aimed |
| **FR-059** | Casualty tracker HUD | Persistent bar: Kachin losses, Japanese 24/30, rafts 2 sunk |
| **FR-063** | End card | Title, subtitle, link placeholders (GitHub, scenario PDF) — no QR required |
| **FX** | Combat effect sprites | Tracer line (amber, glow), scatter splash (×3 circles), `PANIC` stamp, jam-check inset panel shell (`d100: __ — CLEAR/JAM`), `MAJOR KACHIN VICTORY` stamp (FR-061) |
| **FR-062** | Epilogue map variant | FR-010 base + Myitkyina marker in allied color + date callout |

---

### Tier 3 — Simulation HUD visual system (optional but valuable)

Remotion already renders **live numbers** (EAL, odds, dice rolls) from code. We need **visual chrome** that matches your design — not flat CSS boxes.

Design as **Figma component library**; export SVG/PNG **9-slice or layer shells** where numbers sit in masked areas.

| Component | Variants | Notes |
|-----------|----------|-------|
| `LayerBadge` | historical / hybrid / simulation | 32px height, top-left |
| `PhaseClock` | phase 1–20, impulse 1–4 | Bottom center; 4 impulse bars + phase label area |
| `EALPanel` | empty / populated shell | **Do not bake in final EAL numbers** — client binds live data. Design row layout, header, odds bar track |
| `DiceDigit` | neutral / hit / miss | 80×100px digit box |
| `DiceResult` | HIT / MISS lockup | Green / red |
| `KVGauge` | empty / fail / pass shell | PD vs KV bar — client binds values |
| `DamagePanel` | hit resolution shell | Location, PEN, DC, PD fields |
| `OddsRing` | 0–100% ring track | Center text area empty |
| **FR-030–031** | Rules primer graphics | Phase timeline bar (4 impulses); Carter CA bar **2-1-1-1** (5 CA total — not 6) |
| **FR-037–038** | Tutorial stills | Hit-location silhouette; KV fail example layout |

---

## 5. Critical: static art vs. dynamic data

Many frames show **numbers that change per combat beat**. Designer delivers **layout and style**; client injects data in Remotion.

| Element | Designer provides | Client/code provides |
|---------|-------------------|----------------------|
| Weapon cards | Layout, icons, side accent | PEN, DC, ROF, SAB text |
| Character cards | Layout, portrait optional | SL, SAL, CA, KV, impulse breakdown |
| EAL panel | Panel chrome, row styling, odds bar **track** | Modifier labels, values, EAL total, odds % |
| Dice | Digit boxes, HIT/MISS styling | Roll digits (e.g. 12, 22, 18) |
| Tactical map | Geography, tokens, range arcs | Token positions, tracer paths (may animate in code) |
| Victory dashboard | Column layout, title treatment | Final tally numbers from scenario |

**Sample numbers for mockups only** (use these in comps — they are rulebook-verified):

| Beat | Weapon | EAL | Odds | Roll | Result |
|------|--------|-----|------|------|--------|
| 01 | Thompson @ 40 hex | 3 | 15% | 12 | HIT |
| 02 | BAR A2 @ 120 hex | 12 | 43% | 22 | HIT |
| 03 | M1919 @ 200 hex | 7 | 24% | 18 | HIT |
| 04 | Thompson @ 35 hex | 3 | 15% | 71 | MISS |
| 05 | Arisaka @ 200 hex | −10 | 0% | 78 | MISS |

Carter stats: SL 5, SAL 11, **CA 5** (2-1-1-1), KV 35. Yamada: SL 2, SAL 7, CA 4, KV 10.

---

## 6. Technical requirements

### Master dimensions
| Use | Size |
|-----|------|
| Primary comp | 1920 × 1080 px |
| Preferred master | 3840 × 2160 px (scale down in export) |
| Thumbnail FR-900 | 1280 × 720 px |
| Safe margin | 80 px all sides |

### File formats (in order of preference)
1. **SVG** — vector, grouped layers, named paths, no embedded raster unless noted
2. **PNG** — @2x, sRGB, transparent background where applicable
3. **Figma** — shared link + `.fig` archive, components named by frame ID
4. **PDF** — print reference only, not a substitute for production exports

### Naming convention
```
exports/
  FR-040-tactical-map/
    FR-040-near-bank.svg
    FR-040-river.svg
    FR-040-far-bank.svg
  tokens/
    raft-normal.svg
    raft-active.svg
    raft-sinking.svg
    squad-hidden.svg
    squad-active.svg
  FR-021-weapon-card-thompson-template.fig
```

Prefix every file with frame ID. Use **kebab-case**. No spaces.

### Layer requirements (SVG)
- Group layers logically (`river`, `tokens`, `labels`, `effects`)
- Convert text to outlines **and** provide editable Figma source with live text
- Stroke widths scale cleanly at 1080p
- Avoid clipping masks that break in Remotion `<Img>` imports

### Color
- Document hex for every fill/stroke
- Match `style-guide.md` tokens exactly
- Provide a 1-page **swatch sheet** PDF or Figma page

### Fonts
- Use Google Fonts listed in style guide (client loads same faces in Remotion)
- If you substitute, document equivalent and get approval **before** final delivery

---

## 7. What we are replacing (current state)

So you know what "bad" looks like — do **not** match this:

- Triangle tree silhouettes and rectangle rafts drawn in CSS
- Single Bézier blob as "Burma map"
- 840×480 tactical map centered in empty 1920×1080 frame
- Generic dark GitHub-style panels with 1px borders

**Target:** Illustrated river/jungle, credible military map aesthetic, designed infographic cards, cohesive token set.

---

## 8. Acceptance criteria

Delivery is accepted when:

- [ ] All Tier 1 assets delivered in agreed formats with named layers
- [ ] Colors match `style-guide.md` swatches (spot-check 10 tokens)
- [ ] Typography matches spec (or approved substitutes documented)
- [ ] FR-040 tactical map readable at 1080p YouTube — troop counts and squad labels legible
- [ ] Token library includes all variants listed in §4 Tier 1
- [ ] No emoji, no watermarks, no stock asset license conflicts
- [ ] Figma file organized with pages per Act or tier
- [ ] Client can import at least **FR-040 + FR-001 + one weapon card** into Remotion without redesign

One round of **minor revisions** (alignment, color tweak, label spacing) included in base quote unless otherwise stated.

---

## 9. Proposal format

Please include:

1. **Portfolio links** — military/history infographics, maps, UI dashboards, or documentary motion work (not only brand logos)
2. **Tier pricing** — Tier 1 / Tier 2 / Tier 3 / optional add-ons
3. **Timeline** — milestones (e.g. tokens + map week 2, cards week 3, HUD week 4)
4. **Revision policy** — rounds included, hourly rate for scope creep
5. **Tools** — Figma / Illustrator / Affinity; experience exporting SVG for dev handoff
6. **Questions** — list any ambiguities before quoting

**Budget guidance:** *[optional — insert your range, e.g. "Tier 1 budget: $X–Y"]*

---

## 10. Reference checklist for designers

Before starting, read these repo files:

| File | Purpose |
|------|---------|
| `style-guide.md` | Colors, type, component specs |
| `frames.md` | Per-frame layout specs (frame IDs match deliverables) |
| `storyboard.md` | When each asset appears on timeline |
| `scenario-pc.md` | OOB, character stats, weapon stats |
| `motion-script.md` | Narration context (what VO says while asset on screen) |

**Preview current placeholders:** clone repo, run `./scripts/link-phoenix.sh`, `cd remotion && npm start`, open http://localhost:3000

---

## 11. Suggested phasing (if splitting work)

| Phase | Deliverables | Unblocks |
|-------|--------------|----------|
| **A** | FR-040 map + token library + FR-001 river plate | Intro + tactical setup + all combat beats |
| **B** | FR-010–014 CBI map layers + FR-021–024 weapon cards | Acts 1–2 historical/forces |
| **C** | Tier 2 infographics + FX sprites | VO holds, NLE inserts |
| **D** | Tier 3 HUD chrome | Polish simulation UI in Remotion |

Phase A alone transforms perceived production quality.

---

## 12. Contact & questions

*[Your name]*  
*[Email]*  
*[Optional: Calendly / Discord]*

Questions welcome before quoting. Proposals that reference specific frame IDs (FR-040, FR-021, etc.) will be prioritized.

---

*Document version: 2026-06-01 — aligned with corrected Phoenix Command beat data in `scenario.ts` and `motion-script.md`.*
