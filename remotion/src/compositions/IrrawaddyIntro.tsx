import React from 'react';
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { colors, fonts, layout } from '../lib/theme';
import { PhaseClock } from '../components/PhaseClock';
import { KACHIN_POSITIONS, RAFTS } from '../data/scenario';
import {
  ARTWORK_MAP,
  artworkBoatSize,
  positionAlongRiverPath,
} from '../data/mapLayout';

const INTRO_DRIFT_PER_FRAME = 0.00038;
const INTRO_UPSTREAM_OFFSET = 0.1;

function introRaftProgress(raftId: string, frame: number, raftIndex: number): number {
  const raft = ARTWORK_MAP.rafts[raftId as keyof typeof ARTWORK_MAP.rafts];
  if (!raft) return 0;
  const enterDelay = 18 + raftIndex * 14;
  const local = Math.max(0, frame - enterDelay);
  const drift = local * INTRO_DRIFT_PER_FRAME;
  return Math.max(0, Math.min(1, raft.pathStart - INTRO_UPSTREAM_OFFSET + drift));
}

export const IrrawaddyIntro: React.FC = () => {
  const frame = useCurrentFrame();

  const mapScale = Math.max(
    layout.width / ARTWORK_MAP.width,
    layout.height / ARTWORK_MAP.height
  );
  const mapW = ARTWORK_MAP.width * mapScale;
  const mapH = ARTWORK_MAP.height * mapScale;
  const mapX = (layout.width - mapW) / 2;
  const mapY = (layout.height - mapH) / 2;

  const boatSize = artworkBoatSize();
  const riverBg = staticFile('assets/river-graphic.png');
  const boatImg = staticFile('assets/boat.png');

  const fadeFromBlack = interpolate(frame, [0, 50], [1, 0], {
    extrapolateRight: 'clamp',
  });

  const titleOpacity = interpolate(frame, [0, 20, 105, 130], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const simOpacity = interpolate(frame, [115, 140], [0, 1], { extrapolateRight: 'clamp' });

  // Big phase callout holds ~4s, then hands off to the phase clock at the bottom
  const phaseTextOpacity = interpolate(frame, [115, 140, 250, 280], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const phaseY = interpolate(frame, [125, 145], [30, 0], { extrapolateRight: 'clamp' });

  const squadPulse = interpolate(frame, [52, 72, 92, 112], [0, 0.32, 0.32, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: colors.bgDark, overflow: 'hidden' }}>
      <svg
        width={layout.width}
        height={layout.height}
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <radialGradient id="introVignette" cx="50%" cy="45%" r="72%">
            <stop offset="0%" stopColor="#0d1117" stopOpacity={0} />
            <stop offset="100%" stopColor="#0d1117" stopOpacity={1} />
          </radialGradient>
          <filter id="introBoatGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="introBoatShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        <g transform={`translate(${mapX}, ${mapY}) scale(${mapScale})`}>
          <image
            href={riverBg}
            x={0}
            y={0}
            width={ARTWORK_MAP.width}
            height={ARTWORK_MAP.height}
            preserveAspectRatio="xMidYMid slice"
          />

          <rect
            x={0}
            y={0}
            width={ARTWORK_MAP.width}
            height={ARTWORK_MAP.height}
            fill="#0d1117"
            opacity={0.14}
          />

          {/* Hidden squad pulse — near bank */}
          {KACHIN_POSITIONS.map((sq) => {
            const pos = ARTWORK_MAP.squads[sq.id as keyof typeof ARTWORK_MAP.squads];
            if (!pos) return null;
            return (
              <g key={sq.id} opacity={squadPulse}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={9}
                  fill={colors.alliedPrimary}
                  opacity={0.55}
                  filter="url(#introBoatGlow)"
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={5}
                  fill={colors.jungleAccent}
                  opacity={0.4}
                />
              </g>
            );
          })}

          {/* Japanese rafts drifting downstream */}
          {RAFTS.map((raft, i) => {
            const enterDelay = 18 + i * 14;
            const raftOpacity = interpolate(frame, [enterDelay, enterDelay + 22], [0, 1], {
              extrapolateRight: 'clamp',
            });
            const progress = introRaftProgress(raft.id, frame, i);
            const { x: rx, y: cy, angleDeg } = positionAlongRiverPath(progress);
            const bw = boatSize.width;
            const bh = boatSize.height;

            return (
              <g key={raft.id} opacity={raftOpacity}>
                <ellipse
                  cx={rx}
                  cy={cy}
                  rx={bh * 0.4}
                  ry={bw * 0.9}
                  fill={colors.japaneseAccent}
                  opacity={0.22}
                  filter="url(#introBoatGlow)"
                  transform={`rotate(${angleDeg}, ${rx}, ${cy})`}
                />
                <image
                  href={boatImg}
                  x={-bw / 2}
                  y={-bh / 2}
                  width={bw}
                  height={bh}
                  preserveAspectRatio="xMidYMid meet"
                  filter="url(#introBoatShadow)"
                  transform={`translate(${rx}, ${cy}) rotate(${angleDeg})`}
                />
                <rect
                  x={rx - 16}
                  y={cy + bh * 0.34 + 2}
                  width={32}
                  height={13}
                  rx={3}
                  fill={colors.bgDark}
                  opacity={0.75}
                />
                <text
                  x={rx}
                  y={cy + bh * 0.34 + 11}
                  fill={colors.textPrimary}
                  fontSize={8}
                  textAnchor="middle"
                  fontFamily={fonts.data}
                  fontWeight={600}
                >
                  {raft.troops}
                </text>
              </g>
            );
          })}
        </g>

        {/* Edge vignette for legibility */}
        <rect
          x={0}
          y={0}
          width={layout.width}
          height={layout.height}
          fill="url(#introVignette)"
          opacity={0.55}
          pointerEvents="none"
        />
      </svg>

      {/* Title card */}
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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(13,17,23,0.72) 0%, rgba(13,17,23,0) 100%)',
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

      {/* Simulation mode transition */}
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
          opacity: phaseTextOpacity,
          transform: `translateY(${phaseY}px)`,
          textShadow: '0 0 40px rgba(201,162,39,0.4)',
        }}
      >
        PHASE 1 · IMPULSE 1
      </div>
      <div style={{ opacity: simOpacity }}>
        <PhaseClock phase={1} impulse={1} />
      </div>

      {/* Cold open fade from black */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: colors.bgDark,
          opacity: fadeFromBlack,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
