import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors, fonts, layout } from '../lib/theme';
import { VICTORY } from '../data/scenario';

interface VictoryDashboardProps {
  startFrame?: number;
}

export const VictoryDashboard: React.FC<VictoryDashboardProps> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startFrame);
  const v = VICTORY.kachin;

  const rows = [
    { label: 'Rafts sunk', kachin: `${v.raftsSunk}/${v.raftsTotal}`, japanese: `${v.raftsTotal - v.raftsSunk} escaped` },
    { label: 'Troops eliminated', kachin: `${v.japaneseKIA} KIA`, japanese: `${v.japaneseTotal - v.japaneseKIA} survived` },
    { label: 'Kachin losses', kachin: `${v.kachinKIA} KIA, ${v.kachinWounded} WIA`, japanese: '—' },
    { label: 'Duration', kachin: `${v.durationPhases} phases (${v.durationMinutes.toFixed(1)} min)`, japanese: '—' },
    { label: 'Intelligence', kachin: `${v.intelRecovered} item recovered`, japanese: '—' },
  ];

  return (
    <div
      style={{
        width: layout.width - layout.safeMargin * 2,
        margin: '0 auto',
        fontFamily: fonts.body,
        opacity: interpolate(local, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
      }}
    >
      <div
        style={{
          textAlign: 'center',
          fontFamily: fonts.headline,
          fontSize: 48,
          color: colors.hudPhosphor,
          letterSpacing: 4,
          marginBottom: 32,
        }}
      >
        {v.result}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <SidePanel title="KACHIN RANGERS" accent={colors.alliedPrimary} rows={rows.map((r) => ({ label: r.label, value: r.kachin }))} delay={10} />
        <SidePanel title="JAPANESE 15th ARMY" accent={colors.japanesePrimary} rows={rows.map((r) => ({ label: r.label, value: r.japanese }))} delay={20} />
      </div>
    </div>
  );
};

const SidePanel: React.FC<{
  title: string;
  accent: string;
  rows: { label: string; value: string }[];
  delay: number;
}> = ({ title, accent, rows, delay }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - delay);
  return (
    <div
      style={{
        background: colors.bgPanel,
        border: `1px solid ${colors.bgPanelBorder}`,
        borderTop: `4px solid ${accent}`,
        borderRadius: layout.panelRadius,
        padding: layout.panelPadding,
        opacity: interpolate(local, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}
    >
      <div style={{ fontFamily: fonts.headline, fontSize: 22, color: accent, marginBottom: 20 }}>{title}</div>
      {rows.map((row) => (
        <div
          key={row.label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: `1px solid ${colors.bgPanelBorder}`,
            fontSize: 14,
          }}
        >
          <span style={{ color: colors.textSecondary }}>{row.label}</span>
          <span style={{ color: colors.textPrimary, fontFamily: fonts.data }}>{row.value}</span>
        </div>
      ))}
    </div>
  );
};

interface TitleCardProps {
  line1: string;
  line2?: string;
  subtitle?: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({ line1, line2, subtitle }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const slide = interpolate(frame, [0, 25], [30, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        opacity,
        transform: `translateY(${slide}px)`,
        fontFamily: fonts.headline,
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 800, color: colors.textPrimary, letterSpacing: 2, textAlign: 'center' }}>
        {line1}
      </div>
      {line2 && (
        <div style={{ fontSize: 48, fontWeight: 600, color: colors.hudPhosphor, marginTop: 8, textAlign: 'center' }}>
          {line2}
        </div>
      )}
      {subtitle && (
        <div style={{ fontFamily: fonts.historical, fontSize: 22, color: colors.textSecondary, marginTop: 24, fontStyle: 'italic' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
