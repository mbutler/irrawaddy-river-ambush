import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, layout } from '../lib/theme';
import { WeaponCard } from '../components/WeaponCard';
import { weapons as _weapons } from '../lib/phoenix';

// Runtime access via string keys — weapons dict is untyped
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const weapons = _weapons as Record<string, any>;

interface WeaponSpec {
  /** Lookup key in the phoenix-functions weapons dict */
  key: string;
  /** On-screen name when it differs from the stats key (e.g. proxied weapons) */
  displayName?: string;
  caliber: string;
  /** Historically accurate class — the engine's Type field is game-mechanical */
  typeLabel: string;
  side: 'kachin' | 'japanese';
  role: string;
  rangeHex: number;
  delay: number;
}

const KACHIN_WEAPONS: WeaponSpec[] = [
  {
    key: 'Thompson M1928A1',
    caliber: '.45 ACP',
    typeLabel: 'Submachine Gun',
    side: 'kachin',
    role: 'Primary ambush weapon — close-range saturation fire',
    rangeHex: 40,
    delay: 0,
  },
  {
    key: 'Bren Mk1',
    caliber: '.303 British',
    typeLabel: 'Light Machine Gun',
    side: 'kachin',
    role: 'Suppressive fire — pins rafts in open water',
    rangeHex: 120,
    delay: 36,
  },
  {
    key: 'M1919 A6',
    caliber: '.30-06 Springfield',
    typeLabel: 'Medium Machine Gun',
    side: 'kachin',
    role: 'Long-range enfilade — entire river lane',
    rangeHex: 200,
    delay: 72,
  },
  {
    key: 'BAR A2',
    caliber: '.30-06 Springfield',
    typeLabel: 'Automatic Rifle',
    side: 'kachin',
    role: 'Squad automatic rifle — Carter hero shot @ 120 hex',
    rangeHex: 120,
    delay: 108,
  },
  {
    key: 'M1 Carbine',
    caliber: '.30 Carbine',
    typeLabel: 'Semi-Auto Carbine',
    side: 'kachin',
    role: 'Light rifle — close bank @ 40 hex; withdrawal cover @ 180 hex',
    rangeHex: 40,
    delay: 144,
  },
];

const JAPANESE_WEAPONS: WeaponSpec[] = [
  {
    key: 'Arisaka Type 99',
    caliber: '7.7×58mm Arisaka',
    typeLabel: 'Bolt-Action Rifle',
    side: 'japanese',
    role: 'Return fire from an unstable raft platform',
    rangeHex: 200,
    delay: 180,
  },
  {
    key: 'Bren Mk1',
    displayName: 'Type 96 LMG',
    caliber: '6.5×50mm Arisaka',
    typeLabel: 'Light Machine Gun',
    side: 'japanese',
    role: 'Raft defensive fire — modeled with Bren Mk1 stats',
    rangeHex: 120,
    delay: 216,
  },
];

const LOADOUT_SEGMENTS = [
  { pct: 28, color: colors.alliedPrimary, label: '28% Thompson' },
  { pct: 44, color: colors.riverFoam, label: '44% M1 Carbine' },
  { pct: 11, color: colors.jungleAccent, label: '11% Bren' },
  { pct: 11, color: colors.hudPhosphor, label: '11% BAR' },
  { pct: 6, color: colors.neutral, label: '6% M1919' },
];

const SectionLabel: React.FC<{ text: string; accent: string; opacity: number }> = ({
  text,
  accent,
  opacity,
}) => (
  <div
    style={{
      fontFamily: fonts.data,
      color: colors.textSecondary,
      fontSize: 12,
      letterSpacing: '0.25em',
      marginBottom: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      opacity,
    }}
  >
    <div style={{ width: 24, height: 3, background: accent }} />
    {text}
  </div>
);

const WeaponRow: React.FC<{ specs: WeaponSpec[]; frame: number }> = ({ specs, frame }) => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
    {specs.map((spec) => {
      const w = weapons[spec.key];
      const band = w[String(spec.rangeHex)] ?? w['100'];
      const fmj = band?.FMJ ?? band?.AP ?? {};

      const cardOpacity = interpolate(frame, [spec.delay, spec.delay + 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

      return (
        <div key={spec.displayName ?? spec.key} style={{ opacity: cardOpacity, flex: '0 0 320px' }}>
          <WeaponCard
            name={spec.displayName ?? spec.key}
            caliber={spec.caliber}
            type={spec.typeLabel}
            pen={fmj.PEN ?? 0}
            dc={fmj.DC ?? 0}
            rangeLabel={`@ ${spec.rangeHex} hex · ${Math.round(spec.rangeHex * 1.83)}m`}
            rof={w.ROF ?? 0}
            sab={w.SAB ?? 0}
            role={spec.role}
            side={spec.side}
            startFrame={spec.delay}
          />
        </div>
      );
    })}
  </div>
);

export const ForcesInfographic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kachinLabelOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const japaneseLabelOpacity = interpolate(frame, [168, 184], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const loadoutOpacity = interpolate(frame, [fps * 8, fps * 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.bgDark,
        padding: layout.safeMargin,
      }}
    >
      <div
        style={{
          fontFamily: fonts.headline,
          fontSize: 44,
          fontWeight: 700,
          color: colors.textPrimary,
          letterSpacing: '0.06em',
          marginBottom: 28,
        }}
      >
        FORCES &amp; ARMAMENT
      </div>

      <SectionLabel
        text="KACHIN RANGERS · OSS DETACHMENT 101 — 18 FIGHTERS"
        accent={colors.alliedPrimary}
        opacity={kachinLabelOpacity}
      />
      <WeaponRow specs={KACHIN_WEAPONS} frame={frame} />

      <div style={{ marginTop: 36 }}>
        <SectionLabel
          text="JAPANESE ESCORT · 15th ARMY — 30 TROOPS ON 3 RAFTS"
          accent={colors.japanesePrimary}
          opacity={japaneseLabelOpacity}
        />
        <WeaponRow specs={JAPANESE_WEAPONS} frame={frame} />
      </div>

      {/* Kachin loadout mix — appears once both rows are in */}
      <div
        style={{
          position: 'absolute',
          bottom: layout.safeMargin,
          right: layout.safeMargin,
          width: 560,
          opacity: loadoutOpacity,
        }}
      >
        <div
          style={{
            fontFamily: fonts.data,
            color: colors.textSecondary,
            fontSize: 12,
            letterSpacing: '0.2em',
            marginBottom: 12,
          }}
        >
          KACHIN RANGER LOADOUT · 18 FIGHTERS
        </div>
        <div
          style={{
            height: 26,
            display: 'flex',
            borderRadius: 4,
            overflow: 'hidden',
            border: `1px solid ${colors.bgPanelBorder}`,
          }}
        >
          {LOADOUT_SEGMENTS.map((seg) => (
            <div
              key={seg.label}
              style={{
                width: `${seg.pct}%`,
                background: seg.color,
                opacity: 0.85,
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 16px',
            fontSize: 12,
            color: colors.textMuted,
            marginTop: 8,
            fontFamily: fonts.data,
          }}
        >
          {LOADOUT_SEGMENTS.map((seg) => (
            <span key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: seg.color,
                  display: 'inline-block',
                }}
              />
              {seg.label}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
