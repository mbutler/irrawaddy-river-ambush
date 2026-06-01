import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, layout } from '../lib/theme';
import { TitleCard, LayerBadge } from '../components/VictoryDashboard';
import { PhaseClock } from '../components/PhaseClock';
import { RAFTS } from '../data/scenario';

// Raft drift constants — each raft moves at a slightly different rate
const RAFT_DRIFT = [
  { speedY: 0.018, speedX: 0.004 },
  { speedY: 0.022, speedX: -0.003 },
  { speedY: 0.015, speedX: 0.006 },
];

export const IrrawaddyIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const W = layout.width;   // 1920
  const H = layout.height;  // 1080

  // Near bank: left 18%, River: 18–84%, Far bank: 84–100%
  const nearBankW = W * 0.18;
  const farBankX = W * 0.84;
  const riverW = farBankX - nearBankW;

  // Animated river current offset (scrolling stripes)
  const currentOffset = -(frame * 1.8) % 52;

  // Title fade-out starts at frame 105, gone by 130
  const titleOpacity = interpolate(frame, [0, 20, 105, 130], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Simulation layer elements fade in starting at frame 115
  const simOpacity = interpolate(frame, [115, 140], [0, 1], { extrapolateRight: 'clamp' });

  // Phase 1 title slam — slides up from bottom
  const phaseY = interpolate(frame, [125, 145], [30, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bgDark, overflow: 'hidden' }}>

      {/* ── Far bank (right) ──────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: W - farBankX,
          background: colors.jungleDeep,
          opacity: 0.65,
        }}
      />
      {/* Far bank tree silhouettes */}
      <svg
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        width={W}
        height={H}
      >
        {[0.06, 0.14, 0.23, 0.33, 0.43, 0.53, 0.63, 0.73, 0.83, 0.93].map((t, i) => {
          const bx = farBankX + 16 + (i % 3) * 18;
          const by = H * t;
          const scale = 0.8 + (i % 3) * 0.2;
          return (
            <g key={`fartree-${i}`} opacity={0.55}>
              <polygon
                points={`${bx},${by + 32 * scale} ${bx - 18 * scale},${by - 20 * scale} ${bx + 18 * scale},${by - 20 * scale}`}
                fill={colors.jungleDeep}
              />
              <polygon
                points={`${bx},${by + 18 * scale} ${bx - 13 * scale},${by - 30 * scale} ${bx + 13 * scale},${by - 30 * scale}`}
                fill={colors.jungleAccent}
                opacity={0.3}
              />
            </g>
          );
        })}
      </svg>

      {/* ── River animated layers ────────────────────────────────────── */}
      {/* Base river fill */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: nearBankW,
          width: riverW,
          background: `linear-gradient(180deg, ${colors.riverDeep} 0%, ${colors.riverCurrent} 50%, ${colors.riverDeep} 100%)`,
          opacity: 0.9,
        }}
      />
      {/* Animated current stripes */}
      <svg
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        width={W}
        height={H}
      >
        {/* Diagonal current lines */}
        {[0.06, 0.14, 0.22, 0.30, 0.38, 0.46, 0.54, 0.62, 0.70, 0.78, 0.86, 0.94].map(
          (yFrac, i) => (
            <line
              key={`river-line-${i}`}
              x1={nearBankW + 10}
              y1={H * yFrac}
              x2={farBankX - 10}
              y2={H * yFrac}
              stroke={colors.riverCurrent}
              strokeWidth={1.5}
              strokeDasharray="32 20"
              strokeDashoffset={currentOffset + i * 8}
              opacity={0.18 + (i % 4) * 0.03}
            />
          )
        )}
        {/* River foam highlights near banks */}
        <rect
          x={nearBankW}
          y={0}
          width={riverW * 0.04}
          height={H}
          fill={colors.riverFoam}
          opacity={0.08}
        />
        <rect
          x={farBankX - riverW * 0.04}
          y={0}
          width={riverW * 0.04}
          height={H}
          fill={colors.riverFoam}
          opacity={0.06}
        />
      </svg>

      {/* ── Near bank jungle ────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: nearBankW,
          background: `linear-gradient(90deg, ${colors.bgDark} 0%, ${colors.jungleDeep} 100%)`,
          opacity: 0.97,
        }}
      />
      {/* Near bank tree silhouettes */}
      <svg
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        width={W}
        height={H}
      >
        {[0.05, 0.12, 0.20, 0.29, 0.38, 0.47, 0.56, 0.65, 0.74, 0.82, 0.91].map((t, i) => {
          const tx = nearBankW - 22 - (i % 4) * 14;
          const ty = H * t;
          const s = 0.75 + (i % 4) * 0.18;
          return (
            <g key={`neartree-${i}`} opacity={0.55 + (i % 3) * 0.1}>
              {/* Trunk */}
              <rect
                x={tx - 3}
                y={ty + 10}
                width={6}
                height={20}
                fill={colors.jungleDeep}
                opacity={0.8}
              />
              {/* Canopy */}
              <polygon
                points={`${tx},${ty - 30 * s} ${tx - 18 * s},${ty + 12} ${tx + 18 * s},${ty + 12}`}
                fill={colors.jungleDeep}
              />
              <polygon
                points={`${tx},${ty - 48 * s} ${tx - 12 * s},${ty - 8 * s} ${tx + 12 * s},${ty - 8 * s}`}
                fill={colors.jungleAccent}
                opacity={0.25 + (i % 3) * 0.08}
              />
            </g>
          );
        })}
        {/* Bank edge */}
        <line
          x1={nearBankW}
          y1={0}
          x2={nearBankW}
          y2={H}
          stroke={colors.jungleAccent}
          strokeWidth={2}
          opacity={0.35}
        />
      </svg>

      {/* ── Japanese rafts ───────────────────────────────────────────── */}
      {RAFTS.map((raft, i) => {
        const drift = RAFT_DRIFT[i];
        const enterDelay = 20 + i * 15;
        const raftOpacity = interpolate(frame, [enterDelay, enterDelay + 20], [0, 0.92], {
          extrapolateRight: 'clamp',
        });
        // Position: distributed across the river vertically
        const baseY = 0.25 + i * 0.22;
        const currentY = baseY + drift.speedY * Math.max(0, frame - enterDelay);
        const currentX = 0.38 + i * 0.12 + drift.speedX * Math.max(0, frame - enterDelay);

        const raftW = 100;
        const raftH = 40;
        const rx = W * currentX - raftW / 2;
        const ry = H * currentY - raftH / 2;

        return (
          <div
            key={raft.id}
            style={{
              position: 'absolute',
              left: rx,
              top: ry,
              width: raftW,
              height: raftH,
              background: colors.japanesePrimary,
              borderRadius: 6,
              opacity: raftOpacity,
              boxShadow: `0 4px 24px rgba(139,58,58,0.5), 0 0 8px rgba(139,58,58,0.3)`,
              border: `1px solid ${colors.japaneseAccent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fonts.data,
              fontSize: 13,
              fontWeight: 700,
              color: colors.textPrimary,
            }}
          >
            {raft.troops}
          </div>
        );
      })}

      {/* ── Title card (fades out) ───────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: titleOpacity,
          pointerEvents: 'none',
        }}
      >
        {/* Backdrop vignette for legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(13,17,23,0.65) 0%, rgba(13,17,23,0) 100%)',
          }}
        />
        <div
          style={{
            fontFamily: fonts.headline,
            fontSize: 86,
            fontWeight: 800,
            color: colors.textPrimary,
            letterSpacing: '0.06em',
            textAlign: 'center',
            lineHeight: 1,
            position: 'relative',
            textShadow: '0 4px 32px rgba(0,0,0,0.8)',
          }}
        >
          IRRAWADDY RIVER
          <br />
          AMBUSH
        </div>
        <div
          style={{
            fontFamily: fonts.headline,
            fontSize: 42,
            fontWeight: 600,
            color: colors.hudPhosphor,
            letterSpacing: '0.12em',
            marginTop: 16,
            position: 'relative',
          }}
        >
          JULY 1944
        </div>
        <div
          style={{
            fontFamily: fonts.historical,
            fontSize: 22,
            fontStyle: 'italic',
            color: colors.textSecondary,
            marginTop: 28,
            position: 'relative',
          }}
        >
          Every bullet calculated.
        </div>
      </div>

      {/* ── Simulation mode elements (fade in at transition) ─────────── */}
      <div style={{ opacity: simOpacity }}>
        <LayerBadge mode="simulation" />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fonts.headline,
            fontSize: 64,
            fontWeight: 800,
            color: colors.hudPhosphor,
            letterSpacing: '0.1em',
            transform: `translateY(${phaseY}px)`,
            textShadow: `0 0 40px rgba(201,162,39,0.4)`,
          }}
        >
          PHASE 1 · IMPULSE 1
        </div>
        <PhaseClock phase={1} impulse={1} />
      </div>
    </AbsoluteFill>
  );
};
