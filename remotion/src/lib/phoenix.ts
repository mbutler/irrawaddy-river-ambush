/**
 * Wrapper around phoenix-functions for Remotion compositions.
 * Resolves combat beats with the same math as the rulebook.
 *
 * The parent src/ files are plain CommonJS JS modules. We import them via
 * webpack extensionAlias (remotion.config.ts) which resolves .js → .ts/.tsx.
 * We use `any` casts on the weapons/tables objects because they are large
 * dynamic runtime structures not worth duplicating as TS interfaces here.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — parent package is plain JS; types inferred at runtime
import {
  effectiveAccuracyLevel,
  oddsOfHitting,
  rangeALM,
  movingALM,
  shotAccuracyALM,
  situationALM,
  visibilityALM,
  targetSizeALM,
  skillAccuracyLevel,
  knockoutValue,
  combatActionsPerImpulse,
  damageClass,
  penetration,
  hitDamage,
  hitLocation,
  incapacitationChance,
  burstFire,
} from '../../../../src/functions.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { weapons as _weapons } from '../../../../src/weapons.js';

// Typed access to the weapons dictionary
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const weapons: Record<string, any> = _weapons;

export type ShotType = 'Single Shot' | 'Burst';

export interface EALModifier {
  label: string;
  value: number;
  category: 'aim' | 'range' | 'movement' | 'situation' | 'visibility' | 'target' | 'sab' | 'other';
}

export interface CombatMods {
  sal: number;
  shotType: ShotType;
  targetSpeed: number;
  shooterSpeed: number;
  range: number;
  weaponAimMod: number;
  situational: string[];
  visibility: string[];
  targetSize: string[];
  sab: number;
  salm?: number;
  targetDiameter?: number;
}

export interface ResolvedShot {
  mods: CombatMods;
  modifiers: EALModifier[];
  eal: number;
  odds: number;
  weaponName: string;
  aimActions: number;
  rangeHexes: number;
  rangeMeters: number;
}

export interface CharacterStats {
  id: string;
  name: string;
  side: 'kachin' | 'japanese';
  skillLevel: number;
  sal: number;
  will: number;
  kv: number;
  combatActions: number;
  capi: Record<string, number>;
  weapon: string;
  role: string;
}

const HEX_TO_METERS = 1.8288; // 2 yards per hex

export function hexToMeters(hexes: number): number {
  return Math.round(hexes * HEX_TO_METERS);
}

export function getWeapon(name: string) {
  return weapons[name];
}

export function buildEALBreakdown(mods: CombatMods): ResolvedShot & { modifiers: EALModifier[] } {
  const aimComponent = shotAccuracyALM(mods.weaponAimMod, mods.sal);
  const rangeComponent = rangeALM(mods.range);
  const moveComponent = movingALM(mods.targetSpeed, mods.shooterSpeed, mods.range);
  const sitComponent = situationALM(mods.situational);
  const visComponent = visibilityALM(mods.visibility);
  // targetDiameter is optional; the JS impl handles undefined internally
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targetComponent = (targetSizeALM as any)(
    mods.targetSize,
    mods.shotType,
    mods.targetDiameter
  );
  const sabComponent = 0 - mods.sab;

  const modifiers: EALModifier[] = [
    { label: 'Aim Time + SAL', value: aimComponent, category: 'aim' },
    { label: `Range (${hexToMeters(mods.range)}m)`, value: rangeComponent, category: 'range' },
    { label: 'Movement', value: moveComponent, category: 'movement' },
    { label: 'Situation / Stance', value: sitComponent, category: 'situation' },
    { label: 'Visibility', value: visComponent, category: 'visibility' },
    { label: 'Target Size', value: targetComponent, category: 'target' },
    { label: 'SAB (Burst)', value: sabComponent, category: 'sab' },
  ];

  const eal = effectiveAccuracyLevel({
    ...mods,
    salm: mods.salm ?? 0,
  });
  const odds = oddsOfHitting(eal, mods.shotType);

  return {
    mods,
    modifiers,
    eal,
    odds,
    weaponName: '',
    aimActions: 0,
    rangeHexes: mods.range,
    rangeMeters: hexToMeters(mods.range),
  };
}

export function resolveFromWeapon(
  weaponName: string,
  aimActions: number,
  partialMods: Omit<CombatMods, 'weaponAimMod' | 'sab'>
): ResolvedShot {
  const weapon = weapons[weaponName];
  const aimMod = weapon['Aim Time'][String(aimActions)] ?? weapon['Aim Time']['1'];
  const sab = weapon.SAB ?? 0;
  const fullMods: CombatMods = {
    ...partialMods,
    weaponAimMod: aimMod,
    sab,
  };
  const result = buildEALBreakdown(fullMods);
  return {
    ...result,
    weaponName,
    aimActions,
  };
}

export function rollHit(odds: number, seed?: number): { roll: number; hit: boolean } {
  const roll = seed !== undefined ? seed : Math.floor(Math.random() * 100);
  return { roll, hit: roll <= odds };
}

export function resolveDamage(
  weaponName: string,
  rangeHexes: number,
  hitRoll: number,
  cover = false
) {
  const w = weapons[weaponName];
  const pen: number = penetration(w, rangeHexes, 'FMJ');
  const dc: number = damageClass(w, rangeHexes, 'FMJ');
  const epf = 0;
  const pd: number = hitDamage(hitRoll, cover, dc, pen, epf);
  const location: string = hitLocation(hitRoll, cover);
  return { pen, dc, pd, location };
}

export function buildCharacter(
  id: string,
  name: string,
  side: 'kachin' | 'japanese',
  skillLevel: number,
  will: number,
  str: number,
  agi: number,
  int: number,
  encumbrance: number,
  weapon: string,
  role: string
): CharacterStats {
  const sal: number = skillAccuracyLevel(skillLevel);
  const kv: number = knockoutValue(will, skillLevel);
  const capiRaw = combatActionsPerImpulse(str, agi, int, skillLevel, encumbrance);
  const capi: Record<string, number> = capiRaw as Record<string, number>;
  const ca = Object.values(capi).reduce((a: number, b: number) => a + b, 0);
  return { id, name, side, skillLevel, sal, will, kv, combatActions: ca, capi, weapon, role };
}

export {
  effectiveAccuracyLevel,
  oddsOfHitting,
  rangeALM,
  burstFire,
  incapacitationChance,
  skillAccuracyLevel,
  knockoutValue,
  weapons,
};
