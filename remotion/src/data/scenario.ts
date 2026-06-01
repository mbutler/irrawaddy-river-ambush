/**
 * Scenario data for Irrawaddy River Ambush.
 * EAL values computed at import time via phoenix-functions.
 */
import {
  resolveFromWeapon,
  buildCharacter,
  hexToMeters,
  type ResolvedShot,
  type CharacterStats,
} from '../lib/phoenix';

// ─── Map geometry (abstract kill zone) ───────────────────────────────────────

export const MAP = {
  widthHexes: 80,
  riverWidthHexes: 35,
  nearBankX: 8,
  farBankX: 72,
  upstreamY: 10,
  downstreamY: 90,
  currentKnots: 2.5,
  hexesPerImpulse: 0.5,
  note: 'Historically ~800–1500m river width; map shows ~140m engagement zone (70 hexes × 2yd).',
};

// ─── Characters ──────────────────────────────────────────────────────────────

export const KACHIN: CharacterStats[] = [
  buildCharacter('k-01', 'Lt. James Carter (OSS)', 'kachin', 5, 14, 12, 11, 13, 35, 'Bren Mk1', 'Squad Alpha CO / Bren'),
  buildCharacter('k-02', 'Kachin Bren Gunner A', 'kachin', 5, 13, 13, 11, 12, 35, 'Bren Mk1', 'Squad Alpha Bren'),
  buildCharacter('k-03', 'Naw San', 'kachin', 5, 14, 12, 12, 12, 30, 'Thompson M1928A1', 'Squad Bravo leader'),
  buildCharacter('k-04', 'Kachin SMG 1', 'kachin', 4, 12, 11, 12, 11, 30, 'Thompson M1928A1', 'Squad Bravo'),
  buildCharacter('k-05', 'Kachin SMG 2', 'kachin', 4, 12, 11, 12, 11, 30, 'Thompson M1928A1', 'Squad Bravo'),
  buildCharacter('k-06', 'Kachin SMG 3', 'kachin', 4, 12, 11, 12, 11, 30, 'Thompson M1928A1', 'Squad Bravo'),
  buildCharacter('k-07', 'Kachin SMG 4', 'kachin', 4, 12, 11, 12, 11, 30, 'Thompson M1928A1', 'Squad Bravo'),
  buildCharacter('k-08', 'MG Gunner Chen', 'kachin', 4, 13, 14, 10, 11, 45, 'M1919 A6', 'Squad Charlie M1919'),
  buildCharacter('k-09', 'Kachin AG', 'kachin', 4, 12, 13, 11, 11, 35, 'Thompson M1928A1', 'Squad Charlie assistant'),
  buildCharacter('k-10', 'Flank Guard 1', 'kachin', 4, 12, 11, 12, 11, 30, 'M1 Garand', 'Squad Delta'),
];

export const JAPANESE: CharacterStats[] = [
  buildCharacter('j-01', 'Lt. Watanabe', 'japanese', 3, 11, 10, 10, 11, 25, 'Arisaka Type 99', 'Raft 1 officer'),
  buildCharacter('j-02', 'LMG Gunner Raft 1', 'japanese', 2, 10, 11, 10, 10, 25, 'Bren Mk1', 'Raft 1 LMG (Type 96 proxy)'),
  buildCharacter('j-03', 'Pvt Yamada', 'japanese', 2, 10, 10, 10, 10, 25, 'Arisaka Type 99', 'Raft 1 rifleman'),
  buildCharacter('j-04', 'Raft 1 Rifleman 2', 'japanese', 2, 9, 10, 10, 9, 25, 'Arisaka Type 99', 'Raft 1'),
  buildCharacter('j-05', 'Raft 2 LMG', 'japanese', 2, 10, 11, 10, 10, 25, 'Bren Mk1', 'Raft 2 LMG'),
  buildCharacter('j-06', 'Raft 2 NCO', 'japanese', 3, 10, 11, 10, 10, 25, 'Arisaka Type 99', 'Raft 2'),
  buildCharacter('j-07', 'Raft 3 Officer', 'japanese', 3, 9, 10, 10, 10, 25, 'Arisaka Type 99', 'Raft 3'),
];

export interface RaftUnit {
  id: string;
  label: string;
  troops: number;
  startY: number;
  startX: number;
  lmg: boolean;
}

export const RAFTS: RaftUnit[] = [
  { id: 'raft-1', label: 'Raft 1 (Lead)', troops: 12, startY: 12, startX: 42, lmg: true },
  { id: 'raft-2', label: 'Raft 2', troops: 10, startY: 8, startX: 48, lmg: true },
  { id: 'raft-3', label: 'Raft 3 (Rear)', troops: 8, startY: 16, startX: 38, lmg: false },
];

export interface SquadPosition {
  id: string;
  label: string;
  x: number;
  y: number;
  rangeToRiverHexes: number;
  hidden: boolean;
}

export const KACHIN_POSITIONS: SquadPosition[] = [
  { id: 'alpha', label: 'Squad Alpha', x: 6, y: 40, rangeToRiverHexes: 120, hidden: true },
  { id: 'bravo', label: 'Squad Bravo', x: 5, y: 25, rangeToRiverHexes: 40, hidden: true },
  { id: 'charlie', label: 'Squad Charlie', x: 7, y: 55, rangeToRiverHexes: 200, hidden: true },
  { id: 'delta', label: 'Squad Delta', x: 4, y: 70, rangeToRiverHexes: 180, hidden: true },
];

// ─── Pre-resolved combat beats (film these in Remotion) ──────────────────────

export interface CombatBeat {
  id: string;
  phase: number;
  impulse: number;
  title: string;
  narration: string;
  shooterId: string;
  targetRaftId: string;
  shot: ResolvedShot;
  /** Fixed d100 for reproducible renders; change for alternate outcomes */
  scriptedRoll: number;
  /** Hit location roll 00-99 */
  scriptedHitRoll: number;
  /** On hit: PD result description */
  notes: string[];
  /**
   * 'fire'   = standard hit/miss roll display (DiceRoller)
   * 'morale' = KV incapacitation check display (KVGauge)
   */
  beatType: 'fire' | 'morale';
  /** For morale beats: accumulated Physical Damage on the target character */
  pdTotal?: number;
}

function beat(
  id: string,
  phase: number,
  impulse: number,
  title: string,
  narration: string,
  shooterId: string,
  targetRaftId: string,
  weapon: string,
  aimActions: number,
  range: number,
  partial: Parameters<typeof resolveFromWeapon>[2],
  scriptedRoll: number,
  scriptedHitRoll: number,
  notes: string[],
  beatType: 'fire' | 'morale' = 'fire',
  pdTotal?: number
): CombatBeat {
  const shot = resolveFromWeapon(weapon, aimActions, partial);
  return {
    id,
    phase,
    impulse,
    title,
    narration,
    shooterId,
    targetRaftId,
    shot,
    scriptedRoll,
    scriptedHitRoll,
    notes,
    beatType,
    pdTotal,
  };
}

export const COMBAT_BEATS: CombatBeat[] = [
  beat(
    'beat-01',
    1,
    1,
    'Bravo — Thompson Snap Burst',
    'Squad Bravo opens on the lead raft at forty hexes — seventy-three meters. Four Thompsons, snap burst from jungle cover.',
    'k-03',
    'raft-1',
    'Thompson M1928A1',
    1,
    40,
    {
      sal: 11,
      shotType: 'Burst',
      targetSpeed: 0.5,
      shooterSpeed: 0,
      range: 40,
      situational: ['Kneeling & Braced'],
      visibility: ['Good Visibility'],
      targetSize: ['Standing Exposed'],
    },
    12,
    67,
    ['HIT at 15% (roll 12 ≤ odds). EAL 3. DC 2 at 40 hex. Rep burst for 4× Thompson volley.', 'Raft instability check: 50% — roll d6 ≥4 → 2 troops in water.']
  ),
  beat(
    'beat-02',
    1,
    2,
    'Alpha — Bren Six-Action Burst',
    'Alpha Bren teams pre-aimed six Actions. Bipod mounted, hard cover on the bank. One hundred twenty hexes to Raft 1.',
    'k-01',
    'raft-1',
    'Bren Mk1',
    6,
    120,
    {
      sal: 11,
      shotType: 'Burst',
      targetSpeed: 0.5,
      shooterSpeed: 0,
      range: 120,
      situational: ['Bipod Mounted Weapon'],
      visibility: ['Good Visibility'],
      targetSize: ['Standing Exposed'],
    },
    22,
    41,
    ['Hit. PEN 13 DC 7 @ 120 hex. Lethal.', 'Table 5A: distribute burst rounds across raft cluster.']
  ),
  beat(
    'beat-03',
    1,
    3,
    'Charlie — M1919 Long Range Burst',
    'Charlie M1919 on bipod. Two hundred hexes — monsoon haze optional beyond one hundred. Jam check d100 ≠ 01.',
    'k-08',
    'raft-2',
    'M1919 A6',
    6,
    200,
    {
      sal: 10,
      shotType: 'Burst',
      targetSpeed: 0.5,
      shooterSpeed: 0,
      range: 200,
      situational: ['Bipod Mounted Weapon'],
      visibility: ['Good Visibility'],
      targetSize: ['Standing Exposed'],
    },
    18,
    88,
    ['HIT at 24% (roll 18 ≤ odds). EAL 7. Enfilade across river lane.', 'M1919 jam scenario roll: 47 — clear (need 01).']
  ),
  beat(
    'beat-04',
    1,
    4,
    'Bravo — Second Volley',
    'Impulse four. Raft 1 taking water. Second Thompson volley at thirty-five hexes as current drifts target.',
    'k-04',
    'raft-1',
    'Thompson M1928A1',
    1,
    35,
    {
      sal: 10,
      shotType: 'Burst',
      targetSpeed: 0.5,
      shooterSpeed: 0,
      range: 35,
      situational: ['Kneeling & Braced'],
      visibility: ['Good Visibility'],
      targetSize: ['Standing Exposed'],
    },
    71,
    52,
    ['Miss at this EAL — rounds scatter into river.', 'Show scatter vector on tactical map.']
  ),
  beat(
    'beat-05',
    2,
    1,
    'Yamada Return Fire',
    'Phase two — Japanese may fire. Yamada on Raft 1, hip fire, unstable raft, two hundred hexes to spotted muzzle flash.',
    'j-03',
    'alpha',
    'Arisaka Type 99',
    4,
    200,
    {
      sal: 7,
      shotType: 'Single Shot',
      targetSpeed: 0,
      shooterSpeed: 0.5,
      range: 200,
      situational: ['Firing from the Hip'],
      visibility: ['Good Visibility'],
      targetSize: ['Fire Over/Around'],
    },
    78,
    0,
    ['Miss. Wide river + cover = low EAL.', 'Kachin still concealed at Fire Over/Around.']
  ),
  beat(
    'beat-06',
    2,
    2,
    'Raft 2 LMG Suppression',
    'Raft 2 LMG gunner short burst at Alpha position. Green skill, rocking platform.',
    'j-05',
    'alpha',
    'Bren Mk1',
    2,
    130,
    {
      sal: 7,
      shotType: 'Burst',
      targetSpeed: 0,
      shooterSpeed: 0.5,
      range: 130,
      situational: ['Firing from the Hip'],
      visibility: ['Good Visibility'],
      targetSize: ['Fire Over/Around'],
    },
    91,
    0,
    ['Miss. Suppression narrative only — no PC suppression table in basic use.']
  ),
  beat(
    'beat-07',
    4,
    1,
    'Raft 1 Morale Collapse',
    'Raft 1 has taken 50%+ casualties. Yamada\'s accumulated Physical Damage exceeds his Knockout Value — incapacitation check fails. Panic and surrender follow.',
    'j-03',
    'raft-1',
    'Arisaka Type 99',
    1,
    36,
    {
      sal: 7,
      shotType: 'Single Shot',
      targetSpeed: 0,
      shooterSpeed: 0,
      range: 36,
      situational: ['Kneeling'],
      visibility: ['Good Visibility'],
      targetSize: ['Standing Exposed'],
    },
    18,
    0,
    ['Incapacitation check: PD 18 vs KV 10 — FAIL. Panic/surrender.', 'Raft 1 marked SINKING.'],
    'morale',
    18
  ),
  beat(
    'beat-08',
    10,
    1,
    'Kachin Withdrawal',
    'Phase ten. Whistle signal. Delta covers with M1 Garand — six Actions aim, one hundred eighty hexes.',
    'k-10',
    'raft-3',
    'M1 Garand',
    6,
    180,
    {
      sal: 10,
      shotType: 'Single Shot',
      targetSpeed: 0.5,
      shooterSpeed: 0,
      range: 180,
      situational: ['Kneeling & Braced'],
      visibility: ['Good Visibility'],
      targetSize: ['Standing Exposed'],
    },
    6,
    33,
    ['HIT at 7% (roll 6 ≤ odds). EAL 8 @ 180 hex, 6 Actions aim. Engagement ends.']
  ),
];

export function getBeat(id: string): CombatBeat | undefined {
  return COMBAT_BEATS.find((b) => b.id === id);
}

export const VICTORY = {
  kachin: {
    raftsSunk: 2,
    raftsTotal: 3,
    japaneseKIA: 24,
    japaneseTotal: 30,
    kachinKIA: 1,
    kachinWounded: 2,
    durationPhases: 20,
    durationMinutes: 6.67,
    result: 'MAJOR KACHIN VICTORY',
    intelRecovered: 1,
  },
  thresholds: {
    kachinMajor: '75% rafts sunk OR 75% troops eliminated',
    kachinMinor: '50% rafts sunk OR 50% troops eliminated',
    japaneseMajor: '75% rafts escape with 50%+ troops',
  },
};

export { hexToMeters };
