#!/usr/bin/env node
/**
 * Print resolved EAL/odds for all combat beats.
 * Run from repo root: node video/scripts/log-beats.mjs
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load compiled or source via dynamic import path
const { effectiveAccuracyLevel, oddsOfHitting, skillAccuracyLevel, knockoutValue } = await import('../../src/functions.js');
const { weapons } = await import('../../src/weapons.js');

const beats = [
  {
    id: 'beat-01',
    weapon: 'Thompson M1928A1',
    aim: 1,
    mods: { sal: 11, shotType: 'Burst', targetSpeed: 0.5, shooterSpeed: 0, range: 40,
      situational: ['Kneeling & Braced'], visibility: ['Good Visibility'], targetSize: ['Standing Exposed'] },
    roll: 34,
  },
  {
    id: 'beat-02',
    weapon: 'Bren Mk1',
    aim: 6,
    mods: { sal: 11, shotType: 'Burst', targetSpeed: 0.5, shooterSpeed: 0, range: 120,
      situational: ['Bipod Mounted Weapon'], visibility: ['Good Visibility'], targetSize: ['Standing Exposed'] },
    roll: 22,
  },
  {
    id: 'beat-03',
    weapon: 'M1919 A6',
    aim: 6,
    mods: { sal: 10, shotType: 'Burst', targetSpeed: 0.5, shooterSpeed: 0, range: 200,
      situational: ['Bipod Mounted Weapon'], visibility: ['Good Visibility'], targetSize: ['Standing Exposed'] },
    roll: 55,
  },
  {
    id: 'beat-05',
    weapon: 'Arisaka Type 99',
    aim: 4,
    mods: { sal: 7, shotType: 'Single Shot', targetSpeed: 0, shooterSpeed: 0.5, range: 200,
      situational: ['Firing from the Hip'], visibility: ['Good Visibility'], targetSize: ['Fire Over/Around'] },
    roll: 78,
  },
];

for (const b of beats) {
  const w = weapons[b.weapon];
  const full = {
    ...b.mods,
    weaponAimMod: w['Aim Time'][String(b.aim)],
    sab: w.SAB ?? 0,
    salm: 0,
  };
  const eal = effectiveAccuracyLevel(full);
  const odds = oddsOfHitting(eal, b.mods.shotType);
  const hit = b.roll <= odds ? 'HIT' : 'MISS';
  console.log(`${b.id} | ${b.weapon} | EAL ${eal} | ${odds}% | roll ${b.roll} → ${hit}`);
}

console.log('\nCarter KV:', knockoutValue(14, 5), 'SAL:', skillAccuracyLevel(5));
