#!/usr/bin/env node
/**
 * Print resolved EAL/odds for all combat beats.
 * Run from repo root: node scripts/log-beats.mjs
 * Requires repo-root src/ linked to phoenix-functions (see scripts/link-phoenix.sh).
 */
import { createRequire } from 'module';
import { existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

function resolvePhoenixBundle() {
  const viaLink = resolve(repoRoot, 'src/../dist/phoenix-functions.js');
  const sibling = resolve(repoRoot, '../phoenix-functions/dist/phoenix-functions.js');
  const path = [viaLink, sibling].find(existsSync);
  if (!path) {
    console.error('phoenix-functions bundle not found. Run ./scripts/link-phoenix.sh');
    process.exit(1);
  }
  return path;
}

const bundlePath = resolvePhoenixBundle();
const require = createRequire(bundlePath);
const {
  effectiveAccuracyLevel,
  oddsOfHitting,
  skillAccuracyLevel,
  knockoutValue,
  incapacitationChance,
  getAllWeapons,
} = require(bundlePath);
const weapons = getAllWeapons();

const beats = [
  {
    id: 'beat-01',
    weapon: 'Thompson M1928A1',
    aim: 1,
    roll: 12,
    mods: { sal: 11, shotType: 'Burst', targetSpeed: 0.5, shooterSpeed: 0, range: 40,
      situational: ['Kneeling & Braced'], visibility: ['Good Visibility'], targetSize: ['Standing Exposed'] },
  },
  {
    id: 'beat-02',
    weapon: 'BAR A2',
    aim: 6,
    roll: 22,
    mods: { sal: 11, shotType: 'Burst', targetSpeed: 0.5, shooterSpeed: 0, range: 120,
      situational: ['Bipod Mounted Weapon'], visibility: ['Good Visibility'], targetSize: ['Standing Exposed'] },
  },
  {
    id: 'beat-03',
    weapon: 'M1919 A6',
    aim: 6,
    roll: 18,
    mods: { sal: 10, shotType: 'Burst', targetSpeed: 0.5, shooterSpeed: 0, range: 200,
      situational: ['Bipod Mounted Weapon'], visibility: ['Good Visibility'], targetSize: ['Standing Exposed'] },
  },
  {
    id: 'beat-04',
    weapon: 'Thompson M1928A1',
    aim: 1,
    roll: 71,
    mods: { sal: 10, shotType: 'Burst', targetSpeed: 0.5, shooterSpeed: 0, range: 35,
      situational: ['Kneeling & Braced'], visibility: ['Good Visibility'], targetSize: ['Standing Exposed'] },
  },
  {
    id: 'beat-05',
    weapon: 'Arisaka Type 99',
    aim: 4,
    roll: 78,
    mods: { sal: 7, shotType: 'Single Shot', targetSpeed: 0, shooterSpeed: 0.5, range: 200,
      situational: ['Firing from the Hip'], visibility: ['Good Visibility'], targetSize: ['Fire Over/Around'] },
  },
  {
    id: 'beat-06',
    weapon: 'Bren Mk1',
    aim: 2,
    roll: 91,
    mods: { sal: 7, shotType: 'Burst', targetSpeed: 0, shooterSpeed: 0.5, range: 130,
      situational: ['Firing from the Hip'], visibility: ['Good Visibility'], targetSize: ['Fire Over/Around'] },
  },
  {
    id: 'beat-08',
    weapon: 'M1 Carbine',
    aim: 6,
    roll: 6,
    mods: { sal: 10, shotType: 'Single Shot', targetSpeed: 0.5, shooterSpeed: 0, range: 180,
      situational: ['Kneeling & Braced'], visibility: ['Good Visibility'], targetSize: ['Standing Exposed'] },
  },
];

for (const b of beats) {
  const w = weapons[b.weapon];
  const full = {
    ...b.mods,
    weaponAimMod: w['Aim Time'][String(b.aim)],
    sab: b.mods.shotType === 'Burst' ? (w.SAB ?? 0) : 0,
    salm: 0,
  };
  const eal = effectiveAccuracyLevel(full);
  const odds = oddsOfHitting(eal, b.mods.shotType);
  const hit = b.roll <= odds ? 'HIT' : 'MISS';
  console.log(`${b.id} | ${b.weapon} | EAL ${eal} | ${odds}% | roll ${b.roll} → ${hit}`);
}

console.log('\nCarter KV:', knockoutValue(14, 5), 'SAL:', skillAccuracyLevel(5));
console.log('Beat-07 incap PD18 KV10 IC:', incapacitationChance(18, 10) + '%', 'roll 18 →', 18 < incapacitationChance(18, 10) ? 'FAIL' : 'PASS');
console.log('SC-022 example PD56 KV35 IC:', incapacitationChance(56, 35) + '%', 'roll 18 →', 18 < incapacitationChance(56, 35) ? 'FAIL' : 'PASS');
