import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors, fonts, layout } from '../lib/theme';

interface OddsRingProps {
  odds: number;
  size?: number;
  startFrame?: number;
}

export const OddsRing: React.FC<OddsRingProps> = ({ odds, size = 160, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startFrame);
  const progress = interpolate(local, [0, 30], [0, odds / 100], {
    extrapolateRight: 'clamp',
  });
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={colors.bgPanelBorder}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={colors.hudGreen}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={colors.textPrimary}
        fontSize={28}
        fontFamily={fonts.data}
        fontWeight={700}
        transform={`rotate(90 ${size / 2} ${size / 2})`}
      >
        {Math.round(progress * 100)}%
      </text>
    </svg>
  );
};

interface WeaponCardProps {
  name: string;
  caliber: string;
  type: string;
  pen: number;
  dc: number;
  rangeLabel: string;
  rof: number;
  sab: number;
  role: string;
  side: 'kachin' | 'japanese';
  startFrame?: number;
}

export const WeaponCard: React.FC<WeaponCardProps> = ({
  name,
  caliber,
  type,
  pen,
  dc,
  rangeLabel,
  rof,
  sab,
  role,
  side,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startFrame);
  const opacity = interpolate(local, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const accent = side === 'kachin' ? colors.alliedPrimary : colors.japanesePrimary;

  return (
    <div
      style={{
        width: 320,
        background: colors.bgPanel,
        border: `1px solid ${colors.bgPanelBorder}`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: layout.panelRadius,
        padding: layout.panelPadding,
        fontFamily: fonts.body,
        opacity,
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ fontFamily: fonts.headline, fontSize: 24, color: colors.textPrimary, fontWeight: 700 }}>
        {name}
      </div>
      <div style={{ color: accent, fontSize: 13, marginTop: 4, letterSpacing: 1 }}>{caliber}</div>
      <div style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>{type}</div>
      <div
        style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          fontFamily: fonts.data,
          fontSize: 13,
        }}
      >
        <div>
          <span style={{ color: colors.textMuted }}>PEN </span>
          <span style={{ color: colors.hudPhosphor }}>{pen}</span>
        </div>
        <div>
          <span style={{ color: colors.textMuted }}>DC </span>
          <span style={{ color: colors.hudPhosphor }}>{dc}</span>
        </div>
        <div>
          <span style={{ color: colors.textMuted }}>ROF </span>
          <span style={{ color: colors.textPrimary }}>{rof} AC</span>
        </div>
        <div>
          <span style={{ color: colors.textMuted }}>SAB </span>
          <span style={{ color: colors.textPrimary }}>{sab}</span>
        </div>
      </div>
      <div style={{ marginTop: 12, color: colors.textSecondary, fontSize: 12 }}>{rangeLabel}</div>
      <div
        style={{
          marginTop: 12,
          padding: '8px 12px',
          background: colors.bgDark,
          borderRadius: 4,
          color: colors.textPrimary,
          fontSize: 13,
        }}
      >
        {role}
      </div>
    </div>
  );
};
