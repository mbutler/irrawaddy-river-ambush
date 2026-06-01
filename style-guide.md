# Irrawaddy River Ambush — Visual Style Guide

Design system for motion-graphics-only production. All frames, Remotion components, and NLE overlays must conform to this document.

---

## 1. Design Philosophy

**Dual-layer storytelling:** Every scene exists on a spectrum from documentary reality to tactical simulation. Visual treatment signals which layer is dominant.

| Mode | Dominant elements | When to use |
|------|-------------------|-------------|
| **Historical** | Maps, archival photos, serif quotes, muted palette | Acts 1–3, Act 7 |
| **Hybrid** | Stylized geography + unit tokens + range arcs | Force intro, setup, withdrawal |
| **Simulation** | HUD panels, monospace data, dice, phase clock | Rules primer, all combat beats |

**Principles:**
1. Data is beautiful — tables and modifiers are hero graphics, not footnotes.
2. Restraint — one focal animation per beat; avoid simultaneous competing motion.
3. Accuracy — numbers on screen must match `phoenix-functions` output.
4. Legibility — all text readable at 1080p YouTube compression.

---

## 2. Color System

### Core palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `bg-dark` | `#0d1117` | 13, 17, 23 | Primary background |
| `bg-panel` | `#161b22` | 22, 27, 34 | Cards, HUD panels |
| `bg-panel-border` | `#30363d` | 48, 54, 61 | Panel borders, dividers |
| `jungle-deep` | `#1a3c34` | 26, 60, 52 | Near bank, historical land |
| `jungle-accent` | `#8fbc8f` | 143, 188, 143 | Kachin territory highlights |
| `river-deep` | `#2c4a6e` | 44, 74, 110 | River fill |
| `river-foam` | `#a8c8e8` | 168, 200, 232 | Current highlights, spray |
| `river-current` | `#4a7ab0` | 74, 122, 176 | Current arrows, water motion |
| `allied-primary` | `#e8a838` | 232, 168, 56 | Kachin/OSS tracers, accents |
| `allied-tracer` | `#ffc857` | 255, 200, 87 | Muzzle flash, hit sparks |
| `allied-glow` | `rgba(232,168,56,0.4)` | — | Allied element glow |
| `japanese-primary` | `#8b3a3a` | 139, 58, 58 | Japanese units, rafts |
| `japanese-accent` | `#c45c5c` | 196, 92, 92 | Raft outlines, damage |
| `hud-phosphor` | `#c9a227` | 201, 162, 39 | Simulation titles, EAL headers |
| `hud-green` | `#3dd68c` | 61, 214, 140 | Hit, positive modifiers |
| `hud-red` | `#f85149` | 248, 81, 73 | Miss, negative modifiers, wounds |
| `hud-amber` | `#d4a72c` | 212, 167, 44 | KV warnings, odds ring |
| `text-primary` | `#e6edf3` | 230, 237, 243 | Body text on dark |
| `text-secondary` | `#8b949e` | 139, 148, 158 | Labels, captions |
| `text-muted` | `#6e7681` | 110, 118, 129 | Footnotes, disabled |
| `neutral-blue` | `#58a6ff` | 88, 166, 255 | Historical map overlays |

### Modifier category colors (EAL panel)

| Category | Color |
|----------|-------|
| Aim Time + SAL | `hud-phosphor` |
| Range | `neutral-blue` |
| Movement | `river-current` |
| Situation / Stance | `jungle-accent` |
| Visibility | `text-secondary` |
| Target Size | `allied-primary` |
| SAB (Burst) | `japanese-accent` |

### Do not use
- Pure white `#ffffff` for large areas (halation on video)
- Saturated neon greens (reads as "matrix" not "tactical")
- More than 3 accent colors in one frame

---

## 3. Typography

### Font stack

| Role | Family | Weight | Size range | Case |
|------|--------|--------|------------|------|
| **Headline** | Barlow Condensed | 600–800 | 32–72px | ALL CAPS for titles |
| **Body** | Source Sans 3 | 400–600 | 14–22px | Sentence case |
| **Data / HUD** | JetBrains Mono | 400–700 | 11–32px | As needed |
| **Historical** | Source Serif 4 | 400 italic | 16–24px | Sentence case |

**Google Fonts import:**
```
https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=JetBrains+Mono:wght@400;600;700&family=Source+Sans+3:wght@400;600&family=Source+Serif+4:ital@0;1&display=swap
```

### Type rules
- **Headlines:** letter-spacing `0.05em`–`0.15em` when ALL CAPS
- **HUD labels:** letter-spacing `0.2em`, 11px, `text-secondary`
- **Numbers in combat:** always monospace, tabular lining figures
- **Minimum size at 1080p:** 11px data labels, 14px body

---

## 4. Layout & Grid

### Canvas
- **Master:** 3840×2160 (4K)
- **Delivery:** 1920×1080
- **Safe margin:** 80px all sides (40px at 1080p scale)
- **Grid:** 12-column, 80px gutters at 1920 width

### Z-index layers (bottom to top)
1. Background (map, river, jungle)
2. Terrain annotations (current arrows, range bands)
3. Unit tokens (squads, rafts)
4. Effects (tracers, splashes, muzzle flash)
5. HUD panels (EAL, character cards)
6. Phase clock (bottom center)
7. Mode badge (top left)
8. Title / lower-thirds

---

## 5. UI Components

### 5.1 Layer Badge
- **Position:** top-left, safe margin
- **Size:** auto × 32px
- **Border:** 1px solid mode accent
- **Text:** 11px mono, letter-spacing 3px
- **Modes:** HISTORICAL MODE | HYBRID MODE | SIMULATION MODE

### 5.2 Phase Clock
- **Position:** bottom center
- **Structure:** `[PHOENIX COMMAND] [impulse bars ×4] [PHASE N IMP M] [T+Xs]`
- **Impulse bars:** 48×8px; active = phosphor; inactive = border color
- **Pulse:** scale 1→1.05 on each new Phase (0.3s ease)

### 5.3 EAL Panel
- **Size:** 420×auto
- **Position:** top-right, safe margin
- **Header:** gradient `bg-dark` → `jungle-deep`, phosphor title
- **Rows:** modifier label (left) | value (right, green/red)
- **Footer:** EAL large (32px), odds % + horizontal bar fill
- **Entry animation:** slide from right 40px, 0.5s spring

### 5.4 Dice Roller
- **Digits:** two boxes 80×100px, mono 56px
- **Lock animation:** scale 1.3→1.0 on lock frame
- **Result:** HIT (green) / MISS (red), 36px, letter-spacing 8px
- **Subtext:** `XX ≤ YY% threshold`

### 5.5 Weapon Card
- **Size:** 320×auto
- **Left border:** 4px side accent (allied/japanese)
- **Grid:** PEN, DC, ROF, SAB in 2×2 mono grid
- **Role box:** dark inset panel at bottom

### 5.6 Character Card
- **Size:** 280×auto
- **Top border:** 3px side accent
- **Stats:** SL, SAL, CA, KV (KV in amber)
- **CA per impulse:** I1–I4 mini row

### 5.7 Tactical Map
- **Size:** 940×540 (including padding)
- **Near bank:** left 15% jungle fill
- **River:** center 60%
- **Raft token:** 56×24px rounded rect + troop count
- **Squad token:** circle r=10–14px
- **Tracer:** dashed amber line, fade in 0.5s

### 5.8 Victory Dashboard
- **Title:** 48px phosphor, centered
- **Two columns:** Kachin (amber top border) | Japanese (crimson top border)

---

## 6. Motion Principles

### Timing
| Action | Duration | Easing |
|--------|----------|--------|
| Panel slide-in | 0.4–0.6s | `cubic-bezier(0.16, 1, 0.3, 1)` |
| EAL row stagger | 80ms per row | linear opacity |
| Dice scramble | until lockFrame | random 8-frame cycle |
| Dice lock | 0.2s | spring damping 12 |
| Map layer toggle | 0.5s | ease in-out |
| Tracer draw | 0.5s | opacity 0→0.9 |
| Casualty dot fade | 0.3s | opacity + scale down |
| Mode transition | 0.8s | cross-dissolve + color grade shift |

### Stagger rules
- EAL modifiers: top to bottom, 80ms apart
- Weapon cards in Forces sequence: 2s apart
- Historical map layers: 1s apart

### Avoid
- Bouncy UI (undermines tactical seriousness)
- Camera shake except on M1919 beat (single 2-frame jitter max)
- Rotating 3D unless showing map globe

---

## 7. Iconography

| Icon | Meaning | Style |
|------|---------|-------|
| ↓ arrow | River current | river-current, 50% opacity |
| ▲ triangle | Squad position | filled circle, side color |
| ▬ rectangle | Raft | rounded 4px |
| ⊘ | Sunk raft | 30% opacity + X overlay |
| ⚡ | Muzzle flash | 1-frame amber bloom |
| 💧 | Man overboard | splash particle (3 circles) |
| 🛡 (custom SVG) | Hard cover | jungle panel icon on bank |
| ◷ | Phase clock | impulse bars |

Use custom SVG icons — no emoji in final render.

---

## 8. Audio Design Notes

| Event | SFX suggestion | Level |
|-------|----------------|-------|
| Dice lock | Mechanical odometer click | −18 dBFS |
| HIT | Subtle low thud + green flash | −16 dBFS |
| MISS | Soft whoosh | −20 dBFS |
| Tracer | Short ricochet zip | −22 dBFS |
| M1919 burst | Layered .30 cal (short) | −14 dBFS |
| Phase advance | Single tone 440Hz 50ms | −24 dBFS |
| Ambient bed | Rain + distant river | −28 dBFS constant |

VO recorded dry; room tone added in post.

---

## 9. Archival & Photo Treatment

- **Duotone:** jungle-deep shadows, river-foam highlights
- **Vignette:** 15% edge darkening
- **Border:** 2px `bg-panel-border`, 4px radius
- **Caption:** Source Serif italic, bottom-left on photo, 12px
- **Ken Burns:** max 3% scale over 8s, slow pan only

---

## 10. Export Specs

| Deliverable | Format | Codec |
|-------------|--------|-------|
| Master motion segments | ProRes 422 or PNG seq | Remotion export |
| YouTube upload | H.264 1080p | 20+ Mbps |
| Thumbnail | PNG 1280×720 | sRGB |
| Social clips | 1080×1920 crop from EALDemo | H.264 |

---

## 11. Remotion Token Mapping

All tokens live in `remotion/src/lib/theme.ts`:

```typescript
colors.bgDark, colors.alliedPrimary, fonts.headline, layout.safeMargin, motion.easeOut
```

When updating this guide, update `theme.ts` to match.
