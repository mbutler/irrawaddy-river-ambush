# Irrawaddy River Ambush — Phoenix Command Scenario

Complete tabletop-to-simulation conversion for the motion-graphics playthrough. All EAL values are computed via `phoenix-functions` (`resolveFromWeapon` in `remotion/src/data/scenario.ts`).

---

## 1. Historical Summary

**When:** July 1944, monsoon season  
**Where:** Irrawaddy River, south of Myitkyina, northern Burma  
**Duration:** 5–10 minutes of combat (~150–300 Phoenix Command Phases at full resolution; **video uses 20 Phases / 8 beats**)

**Context:** Allied siege of Myitkyina (falls 3 August 1944). Japanese 15th Army elements retreat/resupply by troop-carrying bamboo rafts. OSS Detachment 101 Kachin Rangers ambush from concealed jungle positions on the near bank.

---

## 2. Scale & Map

### Phoenix Command standard
- **1 hex/inch = 2 yards (1.83 m)**
- **Phase = 2 seconds** | **4 Impulses per Phase** (0.5 s each)

### Video abstract kill zone
Historically the river is 800–1500 m wide. The motion-graphics map compresses to an **engagement zone** of ~140 m river width (70 hexes) so ranges and tokens remain readable.

| Map element | Hex value | Real-world note |
|-------------|-----------|-----------------|
| River width (frame) | 35 hexes | ~64 m shown; narrate full width historically |
| Bravo to lead raft | 40 hexes | ~73 m — Thompson / M1 Carbine sweet spot |
| Alpha to lead raft | 120 hexes | ~220 m — BAR / Bren effective |
| Charlie M1919 | 200 hexes | ~366 m — long enfilade |
| Raft drift | 0.5 hex/Impulse | ~2–3 knots downstream |

**On-screen disclaimer (Hybrid mode):**  
*"Map shows the engagement zone where rafts entered effective range. Historically, up to a kilometer of open water exposed them."*

---

## 3. Order of Battle

### Kachin Rangers / OSS (18 fighters on screen = 4 squads)

| Squad | Leader | Personnel | Skill | Key weapons |
|-------|--------|-----------|-------|-------------|
| **Alpha** | Lt. James Carter (OSS) | 5 | SL 5 (Crack) | 1× BAR A2, 1× Bren Mk1, 2× M1 Carbine, 1× Thompson |
| **Bravo** | Naw San | 5 | SL 4–5 | 3× Thompson M1928A1, 2× M1 Carbine |
| **Charlie** | MG section | 5 | SL 4 | M1919 A6, BAR A2, Bren Mk1, Thompson, M1 Carbine |
| **Delta** | Flank/withdrawal | 4 | SL 4 | 3× M1 Carbine, 1× Thompson |

**Research note:** OSS air-drop and Det 101 histories document Thompsons, Brens, and M1919s; recent research also places **M1918A2 BAR** and **M1 Carbine** in guerrilla hands during the Myitkyina campaign. This OOB keeps the earlier weapons and adds BAR/carbine in plausible squad proportions.

**Pregenerated stats (Crack example — Carter):**
- SL 5 → SAL 11, CA 6, KV 35 (WIL 14)
- Encumbrance ~40 lb (BAR A2 + kit)

**Pregenerated stats (Green Japanese example — Yamada):**
- SL 2 → SAL 7, CA 4, KV 10 (WIL 10)

### Japanese 15th Army (30 troops, 3 rafts)

| Raft | Troops | Skill mix | Weapons |
|------|--------|-----------|---------|
| **Raft 1 (lead)** | 12 | SL 2–3 | 8× Type 99 (Arisaka proxy), 1× LMG (Bren proxy = Type 96), 1× officer |
| **Raft 2** | 10 | SL 2–3 | 7× rifle, 1× LMG, 2× grenades |
| **Raft 3 (rear)** | 8 | SL 2 | 6× rifle, 1× LMG |

**Raft properties:**
- Armor PF: 0 (open)
- Cover: none — `Standing Exposed` for burst elevation
- Hit points (scenario rule): 1 HP small arms sustained / 2 HP cumulative; Bren, BAR, or M1919 instant sink (narrative)

---

## 4. Weapon Table (Phoenix Command)

| Scenario weapon | PC entry | @ engagement range | PEN | DC |
|-----------------|----------|-------------------|-----|-----|
| M1A1 Thompson | Thompson M1928A1 | 40 hex | 1.3 | 2 |
| M1 Carbine | M1 Carbine | 40 hex | 5.8 | 5 |
| M1 Carbine (withdrawal) | M1 Carbine | 180 hex | 2.4 | 2 |
| BAR M1918A2 | BAR A2 | 120 hex | 15 | 7 |
| Bren Mk I | Bren Mk1 | 120 hex | 13 | 7 |
| M1919 LMG | M1919 A6 | 200 hex | 13 | 7 |
| Type 99 rifle | Arisaka Type 99 | 200 hex | 15 | 7 |
| Type 96/99 LMG | Bren Mk1 (proxy) | 130 hex | 13 | 7 |

Full weapon data: `src/weapons.js`

---

## 5. Special Scenario Rules → Phoenix Command

| PDF / historical rule | PC implementation |
|----------------------|-------------------|
| Surprise (Turn 1) | Japanese **hold fire** Phase 1 entirely; Kachin squads begin with 6 Actions pre-aimed |
| Kachin jungle cover | Shooters: `Fire Over/Around` target size for return fire; bank = hard cover (Table 7C) |
| Kachin hidden start | Japanese target `Fire Over/Around` until muzzle flash spotted (Phase 2+) |
| Monsoon rain | Optional: `Smoke, Haze, Fog` ALM beyond 100 hexes (−2 per visibility table) |
| M1919 jam 1%/Phase | d100 roll **01** = jam for that Phase; narrate wet monsoon |
| Raft instability | On raft hit: d6 ≥4 → 1D6 troops overboard (scenario flavor) |
| Low Japanese morale | At 50% raft casualties: incapacitation checks at −1 narrative penalty |
| Kachin terrain move | Ignore difficult terrain on withdrawal |
| Intelligence | 1 turn adjacent to beached raft = 1 VP (optional epilogue) |

---

## 6. Victory Conditions

### Kachin Rangers
- **Major:** Sink/destroy 75%+ rafts OR eliminate 75%+ troops (23+ of 30)
- **Minor:** 50%+ (15+ troops or 2 rafts)
- **Bonus:** +1 VP per intelligence item (max 2)

### Japanese
- **Major:** 75%+ rafts exit downstream with 50%+ troops alive
- **Minor:** 50%+ rafts escape with 50%+ troops

### Scripted video outcome
**Major Kachin victory** — 2/3 rafts sunk, 24/30 Japanese KIA, 1 Kachin KIA, 2 WIA, ~6.7 minutes (20 Phases)

---

## 7. Character Status Sheets

### Lt. James Carter (OSS) — k-01

| Stat | Value |
|------|-------|
| STR 12, INT 13, WIL 14, HLT 12, AGI 11 |
| Gun Combat SL | 5 |
| SAL | 11 |
| ISF | 23 |
| CA | 5 (2-1-1-1 per impulse) |
| KV | 35 |
| Weapon | BAR A2 |
| Encumbrance | 40 |

### Naw San — k-03

| Stat | Value |
|------|-------|
| STR 12, INT 12, WIL 14, HLT 12, AGI 12 |
| SL 5, SAL 11, CA 5 (2-1-1-1), KV 35 |
| Weapon | Thompson M1928A1 |

### MG Gunner Chen — k-08

| Stat | Value |
|------|-------|
| STR 14, INT 11, WIL 13, HLT 12, AGI 10 |
| SL 4, SAL 10, CA 5, KV 26 |
| Weapon | M1919 A6 |

### Pvt. Yamada — j-03

| Stat | Value |
|------|-------|
| STR 10, INT 10, WIL 10, HLT 10, AGI 10 |
| SL 2, SAL 7, CA 4, KV 10 |
| Weapon | Arisaka Type 99 |

---

## 8. Combat Beats — Full EAL Walkthrough

Each beat matches `COMBAT_BEATS` in `scenario.ts`. Values below are computed at import time.

---

### BEAT 01 — Phase 1, Impulse 1  
**Bravo — Thompson Snap Burst vs Raft 1** (on-screen representative)

| Parameter | Value |
|-----------|-------|
| Shooter | Naw San (SAL 11) |
| Weapon | Thompson M1928A1, 1 Action aim, Burst |
| Range | 40 hex (73 m) |
| Situation | Kneeling & Braced |
| Target | Standing Exposed, raft moving 0.5 hex/Imp |
| Visibility | Good |

**Bravo fires this Impulse:** 3× Thompson M1928A1 + 2× M1 Carbine (OOB). Only the Thompson is rolled on screen.

**Computed (on-screen):** EAL 3, odds 15%  

**Scripted roll:** 12 → **HIT** (EAL 3, odds 15%)  
**Damage @ 40 hex:** PEN 1.3, DC 2 (Thompson)  
**Off-screen comparison @ 40 hex (not rolled):** M1 Carbine snap single shot → EAL 4, odds 3%; if hit → PEN 5.8, DC 5. Use Thompson as rep because burst fire dominates the half-second volley.  
**Notes:** Narrate parallel carbine fire; optional UI label `+ 2× M1 Carbine @ 40 hex`. Raft instability check d6 ≥4.

---

### BEAT 02 — Phase 1, Impulse 2  
**Alpha — BAR 6-Action Burst vs Raft 1** ⭐ Hero shot

| Parameter | Value |
|-----------|-------|
| Shooter | Lt. Carter (SAL 11) |
| Weapon | BAR A2, 6 Actions, Burst |
| Range | 120 hex (220 m) |
| Situation | Bipod Mounted Weapon (+3) |
| Target | Standing Exposed |

**Computed:** EAL 12, odds 43%  

**Scripted roll:** 22 → **HIT** (EAL 12, odds 43%)  
**Damage @ 120 hex:** PEN 15, DC 7 — lethal hits  
**Notes:** Table 5A burst distribution; primary Remotion composition `Phase1Ambush`. Alpha Bren gunner fires parallel volley off-screen (same EAL band @ 120 hex).

---

### BEAT 03 — Phase 1, Impulse 3  
**Charlie — M1919 A6 vs Raft 2**

| Parameter | Value |
|-----------|-------|
| Shooter | Chen (SAL 10) |
| Weapon | M1919 A6, 6 Actions, Burst |
| Range | 200 hex (366 m) |
| Situation | Bipod Mounted Weapon |

**Computed:** EAL 7, odds 24%  

**Jam check:** d100 = 47 (not 01 — clear)  
**Scripted roll:** 18 → **HIT** (EAL 7, odds 24%)  
**Notes:** Enfilade narrative; raft 2 casualties

---

### BEAT 04 — Phase 1, Impulse 4  
**Bravo — Second volley** (Thompson representative)

| Range | 35 hex (drifted closer) |
| Off-screen | 3× Thompson + 2× Carbine again; same rep weapon |
| EAL / odds | 3 / 15% |
| Scripted roll | 71 → **MISS** — show scatter into water |

---

### BEAT 05 — Phase 2, Impulse 1  
**Yamada return fire vs Alpha**

| Parameter | Value |
|-----------|-------|
| Weapon | Arisaka Type 99, 4 Actions, Single Shot |
| Range | 200 hex |
| Situation | Firing from the Hip (−6) |
| Shooter speed | 0.5 (unstable raft) |
| Target | Fire Over/Around (concealed Kachin) |

**Scripted roll:** 78 → **MISS** (EAL −10, odds 0%)  
**Notes:** Composition `Phase2ReturnFire`

---

### BEAT 06 — Phase 2, Impulse 2  
**Raft 2 LMG vs Alpha** — EAL −10, odds 1%; roll 91 → **MISS**; suppression narrative only

---

### BEAT 07 — Phase 4, Impulse 1  
**Raft 1 morale collapse**

- Raft 1 at 50%+ casualties  
- Yamada PD total 18 > KV 10  
- Incapacitation Chance 25%; roll 18 < 25 → **FAIL** — panic/surrender  
- **Visual:** KV gauge, raft icon SINKING

---

### BEAT 08 — Phase 10, Impulse 1  
**Delta covering fire — withdrawal** (on-screen representative)

| Shooter | Flank Guard 1 (SAL 10) |
| **Delta fires:** | 3× M1 Carbine + 1× Thompson (OOB); carbine shot shown on screen |
| Weapon | M1 Carbine, 6 Actions, Single Shot |
| Range | 180 hex vs Raft 3 |
| EAL / odds | 9 / 9% |
| Roll | 6 → **HIT** |
| Damage @ 180 hex | PEN 2.4, DC 2 — suppresses pursuit, not Phase-1 lethal |
| Narrative | OSS whistle; Delta carbines keep Raft 3 heads down; Alpha/Bravo withdraw; engagement ends |
| **UI** | Optional label `Delta: 3× M1 Carbine covering fire` on `Beat-Withdrawal` |

---

## 9. Phase Summary (Video)

| Phase | Events |
|-------|--------|
| 1 | Surprise volley — all Kachin fire, Japanese silent |
| 2 | Return fire begins, poor odds |
| 3–4 | Raft 1 breaking up; water casualties |
| 5–6 | Raft 2 LMG duel; M1919 sustained |
| 7–8 | Raft 3 attempts far bank |
| 9 | Raft 1 sinks; morale break |
| 10 | Kachin withdrawal |

---

## 10. Aggregate Fire (Off-Screen Resolution)

For squads firing together, resolve **one representative EAL** per weapon type, then multiply casualties narratively:

| Volley | Rep weapon | Targets | Narrative casualties |
|--------|------------|---------|-------------------|
| Bravo 3× Thompson + 2× Carbine | 1 EAL @ 40 hex (Thompson rep; carbines narrated off-screen) | Raft 1 | 3–5 KIA |
| Alpha BAR + Bren | 1 EAL @ 120 hex (BAR rep on-screen) | Raft 1 | 4–6 KIA |
| Charlie M1919 | 1 EAL @ 200 hex | Raft 2 | 2–4 KIA |

Do not roll individually for all 18 Kachin — state aggregate on VO, show one representative dice roll on screen. **Exception for narration:** Bravo and Delta name all weapons firing; only the representative weapon gets a dice animation (Thompson @ 40 hex, BAR @ 120 hex, M1919 @ 200 hex, M1 Carbine @ 180 hex on withdrawal).

---

## 11. Research & Sources (from scenario PDF)

- arsof-history.org — Detachment 101, Myitkyina campaign  
- CIA — Irrawaddy Ambush  
- history.army.mil — Merrill's Marauders  
- Wikipedia — Burma Campaign 1944–45, OSS Detachment 101  

**Research gaps (acknowledge in VO):** Exact ambush coordinates unknown; per-squad BAR vs Bren allocation unconfirmed; Kachin grenade use unconfirmed; raft specs estimated.

**Research update (2026):** BAR A2 and M1 Carbine added to Kachin loadout per OSS supply patterns and campaign-period small-arms distribution studies.

---

## 12. File Cross-Reference

| Need | Location |
|------|----------|
| Live EAL | `remotion/src/lib/phoenix.ts` |
| Beat data | `remotion/src/data/scenario.ts` |
| Weapons | `src/weapons.js` |
| Rules text | `phoenix-command.md` |
| VO script | `motion-script.md` |
| Shot list | `storyboard.md` |
| Frame specs | `frames.md` |
