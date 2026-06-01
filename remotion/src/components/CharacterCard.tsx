import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors, fonts, layout } from '../lib/theme';
import type { CharacterStats } from '../lib/phoenix';

interface CharacterCardProps {
  character: CharacterStats;
  startFrame?: number;
  showWeapon?: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  startFrame = 0,
  showWeapon = true,
}) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startFrame);
  const opacity = interpolate(local, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const accent = character.side === 'kachin' ? colors.alliedPrimary : colors.japanesePrimary;

  return (
    <div
      style={{
        width: 280,
        background: colors.bgPanel,
        border: `1px solid ${colors.bgPanelBorder}`,
        borderTop: `3px solid ${accent}`,
        borderRadius: layout.panelRadius,
        padding: 20,
        fontFamily: fonts.body,
        opacity,
      }}
    >
      <div style={{ fontFamily: fonts.headline, fontSize: 18, color: colors.textPrimary, fontWeight: 700 }}>
        {character.name}
      </div>
      <div style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>{character.role}</div>
      <div
        style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
          fontFamily: fonts.data,
          fontSize: 12,
        }}
      >
        <Stat label="SL" value={character.skillLevel} />
        <Stat label="SAL" value={character.sal} />
        <Stat label="CA" value={character.combatActions} />
        <Stat label="KV" value={character.kv} highlight />
      </div>
      {showWeapon && (
        <div
          style={{
            marginTop: 12,
            padding: '8px 10px',
            background: colors.bgDark,
            borderRadius: 4,
            fontSize: 12,
            color: colors.hudPhosphor,
            fontFamily: fonts.data,
          }}
        >
          {character.weapon}
        </div>
      )}
      <div style={{ marginTop: 10, display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4].map((imp) => (
          <div key={imp} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ color: colors.textMuted, fontSize: 9 }}>I{imp}</div>
            <div style={{ color: colors.textPrimary, fontFamily: fonts.data, fontSize: 14 }}>
              {character.capi[String(imp)]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: number; highlight?: boolean }> = ({
  label,
  value,
  highlight,
}) => (
  <div>
    <span style={{ color: colors.textMuted }}>{label} </span>
    <span style={{ color: highlight ? colors.hudAmber : colors.textPrimary, fontWeight: 600 }}>
      {value}
    </span>
  </div>
);

interface KVGaugeProps {
  currentPD: number;
  kv: number;
  roll: number;
  startFrame?: number;
}

export const KVGauge: React.FC<KVGaugeProps> = ({ currentPD, kv, roll, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startFrame);
  const fill = interpolate(local, [0, 20], [0, Math.min(100, (currentPD / kv) * 100)], {
    extrapolateRight: 'clamp',
  });
  const failed = currentPD > kv && roll <= 99;
  const barColor = failed ? colors.hudRed : colors.hudGreen;

  return (
    <div style={{ width: 300, fontFamily: fonts.data }}>
      <div style={{ color: colors.textSecondary, fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>
        INCAPACITATION CHECK
      </div>
      <div style={{ color: colors.textPrimary, fontSize: 14, marginBottom: 8 }}>
        PD Total {currentPD} vs KV {kv}
      </div>
      <div style={{ height: 10, background: colors.bgDark, borderRadius: 5, overflow: 'hidden' }}>
        <div style={{ width: `${fill}%`, height: '100%', background: barColor }} />
      </div>
      {local > 25 && (
        <div style={{ marginTop: 12, color: barColor, fontSize: 16, fontWeight: 700 }}>
          Roll {roll} — {failed ? 'FAIL — OUT OF FIGHT' : 'PASS — FIGHTS ON'}
        </div>
      )}
    </div>
  );
};
