import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fonts, layout } from '../lib/theme';
import { TacticalMap } from '../components/TacticalMap';

const LAYERS = [
  { id: 'stilwell', label: 'Stilwell advance on Myitkyina', color: colors.alliedPrimary, delay: 30 },
  { id: 'japanese', label: 'Japanese 15th Army retreat routes', color: colors.japanesePrimary, delay: 60 },
  { id: 'oss', label: 'OSS Detachment 101 operating areas', color: colors.jungleAccent, delay: 90 },
  { id: 'river', label: 'Irrawaddy resupply / evacuation by raft', color: colors.riverCurrent, delay: 120 },
];

export const HistoricalMap: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.bgDark }}>
      {/* Stylized Burma outline — placeholder SVG; replace with QGIS export in production */}
      <svg
        width={layout.width}
        height={layout.height}
        style={{ position: 'absolute', inset: 0 }}
      >
        <rect width="100%" height="100%" fill={colors.jungleDeep} opacity={0.3} />
        <path
          d="M 200 800 Q 400 600 600 500 T 1200 300 L 1400 400 L 1300 900 L 300 950 Z"
          fill={colors.jungleDeep}
          stroke={colors.jungleAccent}
          strokeWidth={2}
          opacity={0.8}
        />
        <path
          d="M 500 200 Q 700 500 800 700 T 900 950"
          fill="none"
          stroke={colors.riverCurrent}
          strokeWidth={8}
          opacity={interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp' })}
        />
        <circle
          cx={850}
          cy={420}
          r={24}
          fill={colors.alliedPrimary}
          opacity={interpolate(frame, [100, 130], [0, 1], { extrapolateRight: 'clamp' })}
        />
        <text x={880} y={428} fill={colors.textPrimary} fontSize={18} fontFamily={fonts.headline}>
          Myitkyina
        </text>
        <text x={820} y={480} fill={colors.textSecondary} fontSize={12} fontFamily={fonts.body}>
          Falls 3 Aug 1944
        </text>
      </svg>
      <div
        style={{
          position: 'absolute',
          top: layout.safeMargin,
          right: layout.safeMargin,
          width: 380,
          fontFamily: fonts.body,
        }}
      >
        <div style={{ fontFamily: fonts.headline, fontSize: 32, color: colors.textPrimary, marginBottom: 24 }}>
          CBI Theater — July 1944
        </div>
        {LAYERS.map((layer) => {
          const on = frame >= layer.delay;
          return (
            <div
              key={layer.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                opacity: on ? 1 : 0.25,
                fontSize: 14,
                color: colors.textPrimary,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: 2, background: layer.color }} />
              {layer.label}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: layout.safeMargin,
          left: layout.safeMargin,
          maxWidth: 600,
          fontFamily: fonts.historical,
          fontSize: 18,
          color: colors.textSecondary,
          fontStyle: 'italic',
          opacity: interpolate(frame, [150, 180], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        The Allies needed Myitkyina&apos;s airfield. The Japanese needed the river. The Kachin needed neither to stay alive.
      </div>
    </AbsoluteFill>
  );
};

export const PhoenixPrimer: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    { t: 'PHASE = 2 seconds', d: 0 },
    { t: '4 IMPULSES × 0.5s', d: 40 },
    { t: 'COMBAT ACTIONS per impulse', d: 80 },
    { t: 'EAL = sum of all ALMs', d: 120 },
    { t: 'Roll d100 ≤ Odds → HIT', d: 160 },
    { t: 'PD vs KV → shock?', d: 200 },
  ];
  const active = steps.filter((s) => frame >= s.d).length - 1;

  return (
    <AbsoluteFill style={{ background: colors.bgDark, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontFamily: fonts.headline, fontSize: 48, color: colors.hudPhosphor, marginBottom: 48 }}>
        PHOENIX COMMAND
      </div>
      {steps.map((step, i) => (
        <div
          key={step.t}
          style={{
            fontFamily: fonts.data,
            fontSize: i === active ? 28 : 18,
            color: i <= active ? colors.textPrimary : colors.textMuted,
            padding: '12px 0',
            fontWeight: i === active ? 700 : 400,
          }}
        >
          {i <= active ? '▸ ' : '  '}
          {step.t}
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const TacticalSetup: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: colors.bgDark,
        justifyContent: 'center',
        alignItems: 'center',
        padding: layout.safeMargin,
      }}
    >
      <TacticalMap
        size="hero"
        phase={1}
        activeSquads={[]}
        activeRafts={['raft-1', 'raft-2', 'raft-3']}
        startFrame={0}
      />
    </AbsoluteFill>
  );
};
