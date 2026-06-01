import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, layout } from '../lib/theme';
import { WeaponCard } from '../components/WeaponCard';
import { LayerBadge } from '../components/VictoryDashboard';
import { weapons as _weapons } from '../lib/phoenix';

// Runtime access via string keys — weapons dict is untyped
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const weapons = _weapons as Record<string, any>;

const WEAPON_SPECS = [
  {
    key: 'Thompson M1928A1',
    caliber: '.45 ACP',
    side: 'kachin' as const,
    role: 'Primary ambush weapon — close-range saturation fire',
    rangeHex: 40,
    delay: 0,
  },
  {
    key: 'Bren Mk1',
    caliber: '.303 British',
    side: 'kachin' as const,
    role: 'Suppressive fire — pins rafts in open water',
    rangeHex: 120,
    delay: 60,
  },
  {
    key: 'M1919 A6',
    caliber: '.30-06 Springfield',
    side: 'kachin' as const,
    role: 'Long-range enfilade — entire river lane',
    rangeHex: 200,
    delay: 120,
  },
  {
    key: 'Arisaka Type 99',
    caliber: '7.7×58mm Arisaka',
    side: 'japanese' as const,
    role: 'Bolt-action return fire — unstable raft platform',
    rangeHex: 200,
    delay: 180,
  },
];

export const ForcesInfographic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: colors.bgDark,
        padding: layout.safeMargin,
        paddingTop: layout.safeMargin + 20,
      }}
    >
      <LayerBadge mode="hybrid" />

      <div
        style={{
          fontFamily: fonts.headline,
          fontSize: 40,
          fontWeight: 700,
          color: colors.textPrimary,
          letterSpacing: '0.06em',
          marginBottom: 32,
          marginTop: 20,
        }}
      >
        FORCES &amp; ARMAMENT
      </div>

      {/* Weapon cards — stagger in, then PERSIST for the rest of the composition */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {WEAPON_SPECS.map((spec) => {
          const w = weapons[spec.key];
          const band = w[String(spec.rangeHex)] ?? w['100'];
          const fmj = band?.FMJ ?? band?.AP ?? {};

          // Fade in on stagger delay, then stay visible
          const cardOpacity = interpolate(frame, [spec.delay, spec.delay + 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div key={spec.key} style={{ opacity: cardOpacity }}>
              <WeaponCard
                name={spec.key}
                caliber={spec.caliber}
                type={w.Type ?? ''}
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

      {/* Kachin loadout bar — fades in last */}
      <div
        style={{
          position: 'absolute',
          bottom: layout.safeMargin + 40,
          right: layout.safeMargin,
          width: 380,
          opacity: interpolate(frame, [fps * 7, fps * 9], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        <div
          style={{
            fontFamily: fonts.data,
            color: colors.textSecondary,
            fontSize: 10,
            letterSpacing: '0.2em',
            marginBottom: 10,
          }}
        >
          KACHIN RANGER LOADOUT
        </div>
        <div
          style={{
            height: 22,
            display: 'flex',
            borderRadius: 4,
            overflow: 'hidden',
            border: `1px solid ${colors.bgPanelBorder}`,
          }}
        >
          {[
            { pct: 55, color: colors.alliedPrimary, label: '55% SMG' },
            { pct: 28, color: colors.jungleAccent, label: '28% LMG' },
            { pct: 12, color: colors.neutral, label: '12% HMG' },
            { pct: 5, color: colors.textMuted, label: '5%' },
          ].map((seg) => (
            <div
              key={seg.label}
              style={{
                width: `${seg.pct}%`,
                background: seg.color,
                opacity: 0.85,
              }}
              title={seg.label}
            />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            color: colors.textMuted,
            marginTop: 6,
            fontFamily: fonts.data,
          }}
        >
          <span>55% Thompson SMG</span>
          <span>28% Bren LMG</span>
          <span>12% M1919</span>
          <span>5% Garand</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
