import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors, fonts } from '../lib/theme';
import { MAP, RAFTS, KACHIN_POSITIONS, type RaftUnit } from '../data/scenario';

interface TacticalMapProps {
  phase: number;
  activeSquads?: string[];
  activeRafts?: string[];
  tracerFrom?: string;
  tracerTo?: string;
  raftCasualties?: Record<string, number>;
  sunkRafts?: string[];
  startFrame?: number;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  phase,
  activeSquads = [],
  activeRafts = [],
  tracerFrom,
  tracerTo,
  raftCasualties = {},
  sunkRafts = [],
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startFrame);
  const fadeIn = interpolate(local, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const driftY = (raft: RaftUnit) =>
    raft.startY + (phase - 1) * MAP.hexesPerImpulse * 4 + local * 0.015;

  const W = 840;
  const H = 480;
  // Near bank = left 15%, river = next 70%, far bank = right 15%
  const nearBankPx = W * 0.15;
  const farBankStartPx = W * 0.85;
  const scaleX = (hex: number) => (hex / MAP.widthHexes) * W;
  const scaleY = (hex: number) => (hex / 100) * H;

  const fromSq = KACHIN_POSITIONS.find((s) => s.id === tracerFrom);
  const toRf = RAFTS.find((r) => r.id === tracerTo);

  // Animated river current: dashoffset moves downstream each frame
  const currentOffset = -(local * 1.6) % 40;

  // Tracer animation
  let tracerProgress = 0;
  if (fromSq && toRf && local > 8) {
    tracerProgress = interpolate(local, [8, 22], [0, 1], { extrapolateRight: 'clamp' });
  }

  const fromX = fromSq ? scaleX(fromSq.x) : 0;
  const fromY = fromSq ? scaleY(fromSq.y) : 0;
  const toX = toRf ? scaleX(toRf.startX) : 0;
  const toY = toRf && fromSq ? scaleY(driftY(toRf)) : 0;

  // Compute tracer line length for dashoffset animation
  const tracerLength = fromSq && toRf
    ? Math.hypot(toX - fromX, toY - fromY)
    : 0;

  return (
    <div
      style={{
        width: W + 40,
        padding: 20,
        background: colors.bgPanel,
        border: `1px solid ${colors.bgPanelBorder}`,
        borderRadius: 8,
        opacity: fadeIn,
        fontFamily: fonts.data,
      }}
    >
      <div
        style={{
          color: colors.textSecondary,
          fontSize: 10,
          letterSpacing: '0.2em',
          marginBottom: 8,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>TACTICAL MAP — KILL ZONE (ABSTRACT)</span>
        <span style={{ color: colors.textMuted }}>
          Phase {phase} · {(MAP.currentKnots).toFixed(1)} kt current
        </span>
      </div>

      <svg
        width={W}
        height={H}
        style={{ display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow filter for tracer */}
          <filter id="tracerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Subtle glow for active tokens */}
          <filter id="tokenGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Far bank (right) ───────────────────────────────────────────── */}
        <rect
          x={farBankStartPx}
          y={0}
          width={W - farBankStartPx}
          height={H}
          fill={colors.jungleDeep}
          opacity={0.5}
        />
        {/* Far bank tree silhouettes */}
        {[0.12, 0.25, 0.38, 0.52, 0.65, 0.78, 0.91].map((t, i) => {
          const bx = farBankStartPx + 8 + (i % 3) * 10;
          const by = H * t;
          return (
            <polygon
              key={`ftree-${i}`}
              points={`${bx},${by + 28} ${bx - 12},${by - 12} ${bx + 12},${by - 12}`}
              fill={colors.jungleDeep}
              opacity={0.55}
            />
          );
        })}

        {/* ── River fill ────────────────────────────────────────────────── */}
        <rect
          x={nearBankPx}
          y={0}
          width={farBankStartPx - nearBankPx}
          height={H}
          fill={colors.riverDeep}
        />
        {/* River depth gradient layers */}
        <rect
          x={nearBankPx}
          y={0}
          width={(farBankStartPx - nearBankPx) * 0.15}
          height={H}
          fill={colors.riverCurrent}
          opacity={0.18}
        />
        <rect
          x={farBankStartPx - (farBankStartPx - nearBankPx) * 0.15}
          y={0}
          width={(farBankStartPx - nearBankPx) * 0.15}
          height={H}
          fill={colors.riverCurrent}
          opacity={0.12}
        />

        {/* Animated current lines (scrolling downstream) */}
        {[0.1, 0.22, 0.34, 0.46, 0.58, 0.70, 0.82, 0.94].map((yFrac, i) => (
          <line
            key={`current-${i}`}
            x1={nearBankPx + 8}
            y1={H * yFrac}
            x2={farBankStartPx - 8}
            y2={H * yFrac}
            stroke={colors.riverCurrent}
            strokeWidth={1}
            strokeDasharray="24 16"
            strokeDashoffset={currentOffset + i * 5}
            opacity={0.22}
          />
        ))}

        {/* Current direction arrows (SVG path arrows) */}
        {[0.28, 0.55, 0.82].map((yFrac, i) => {
          const ax = W * 0.5;
          const ay = H * yFrac;
          return (
            <g key={`arrow-${i}`} opacity={0.45}>
              <line
                x1={ax}
                y1={ay - 16}
                x2={ax}
                y2={ay + 16}
                stroke={colors.riverCurrent}
                strokeWidth={1.5}
              />
              <polygon
                points={`${ax},${ay + 22} ${ax - 6},${ay + 8} ${ax + 6},${ay + 8}`}
                fill={colors.riverCurrent}
              />
              {i === 1 && (
                <text
                  x={ax + 14}
                  y={ay + 4}
                  fill={colors.riverCurrent}
                  fontSize={9}
                  fontFamily={fonts.data}
                  opacity={0.7}
                >
                  {MAP.currentKnots} kt
                </text>
              )}
            </g>
          );
        })}

        {/* ── Near bank jungle ─────────────────────────────────────────── */}
        <rect x={0} y={0} width={nearBankPx} height={H} fill={colors.jungleDeep} opacity={0.92} />
        {/* Jungle texture — horizontal bands */}
        {[0.08, 0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78, 0.88, 0.98].map((t, i) => (
          <rect
            key={`tex-${i}`}
            x={0}
            y={H * t - 1}
            width={nearBankPx}
            height={2}
            fill={colors.jungleAccent}
            opacity={0.07 + (i % 3) * 0.02}
          />
        ))}
        {/* Near bank tree silhouettes */}
        {[0.07, 0.18, 0.30, 0.42, 0.54, 0.66, 0.78, 0.90].map((t, i) => {
          const tx = nearBankPx - 14 - (i % 2) * 6;
          const ty = H * t;
          return (
            <polygon
              key={`ntree-${i}`}
              points={`${tx},${ty + 22} ${tx - 10},${ty - 14} ${tx + 10},${ty - 14}`}
              fill={colors.jungleAccent}
              opacity={0.3 + (i % 3) * 0.07}
            />
          );
        })}
        {/* Bank edge highlight */}
        <line
          x1={nearBankPx}
          y1={0}
          x2={nearBankPx}
          y2={H}
          stroke={colors.jungleAccent}
          strokeWidth={1.5}
          opacity={0.4}
        />

        {/* ── Kachin squad tokens ───────────────────────────────────────── */}
        {KACHIN_POSITIONS.map((sq) => {
          const active = activeSquads.includes(sq.id);
          const cx = scaleX(sq.x);
          const cy = scaleY(sq.y);
          const r = active ? 11 : 8;
          const fill = active ? colors.alliedPrimary : colors.jungleAccent;
          const opacity = active ? 1 : 0.65;

          return (
            <g key={sq.id} opacity={opacity} filter={active ? 'url(#tokenGlow)' : undefined}>
              {/* Squad circle */}
              <circle cx={cx} cy={cy} r={r} fill={fill} />
              {/* Rank/ID indicator inside */}
              <text
                x={cx}
                y={cy + 3.5}
                textAnchor="middle"
                fill={colors.bgDark}
                fontSize={7}
                fontFamily={fonts.data}
                fontWeight={700}
              >
                {sq.id.substring(0, 1).toUpperCase()}
              </text>
              {/* Label — offset right so it clears the bank */}
              <text
                x={cx + r + 4}
                y={cy - 10}
                fill={active ? colors.alliedTracer : colors.textSecondary}
                fontSize={9}
                fontFamily={fonts.data}
                fontWeight={active ? 700 : 400}
              >
                {sq.label}
              </text>
              {/* Range label below */}
              {active && (
                <text
                  x={cx + r + 4}
                  y={cy + 4}
                  fill={colors.textMuted}
                  fontSize={8}
                  fontFamily={fonts.data}
                >
                  {sq.rangeToRiverHexes} hex / {Math.round(sq.rangeToRiverHexes * 1.83)}m
                </text>
              )}
            </g>
          );
        })}

        {/* ── Range arc (active squad → active raft) ────────────────────── */}
        {fromSq && toRf && (
          <path
            d={`M ${fromX} ${fromY} C ${fromX + (toX - fromX) * 0.35} ${fromY} ${fromX + (toX - fromX) * 0.65} ${toY} ${toX} ${toY}`}
            fill="none"
            stroke={colors.alliedPrimary}
            strokeWidth={1}
            strokeDasharray="6 6"
            opacity={interpolate(local, [0, 15], [0, 0.35], { extrapolateRight: 'clamp' })}
          />
        )}

        {/* ── Tracer line (animated draw) ───────────────────────────────── */}
        {fromSq && toRf && tracerLength > 0 && (
          <>
            {/* Glow layer */}
            <line
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke={colors.alliedTracer}
              strokeWidth={5}
              strokeDasharray={`${tracerLength} ${tracerLength}`}
              strokeDashoffset={tracerLength * (1 - tracerProgress)}
              opacity={0.25}
              filter="url(#tracerGlow)"
            />
            {/* Core line */}
            <line
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke={colors.alliedTracer}
              strokeWidth={2}
              strokeDasharray={`${tracerLength} ${tracerLength}`}
              strokeDashoffset={tracerLength * (1 - tracerProgress)}
              opacity={0.9}
            />
          </>
        )}

        {/* ── Raft tokens ───────────────────────────────────────────────── */}
        {RAFTS.map((raft) => {
          const sunk = sunkRafts.includes(raft.id);
          const cas = raftCasualties[raft.id] ?? 0;
          const active = activeRafts.includes(raft.id);
          const cy = scaleY(driftY(raft));
          const rx = scaleX(raft.startX);

          return (
            <g key={raft.id} opacity={sunk ? 0.35 : 1}>
              {/* Active highlight ring */}
              {active && !sunk && (
                <rect
                  x={rx - 34}
                  y={cy - 16}
                  width={68}
                  height={32}
                  rx={6}
                  fill="none"
                  stroke={colors.alliedTracer}
                  strokeWidth={2}
                  opacity={0.7}
                  filter="url(#tokenGlow)"
                />
              )}
              {/* Raft body */}
              <rect
                x={rx - 28}
                y={cy - 12}
                width={56}
                height={24}
                rx={4}
                fill={sunk ? colors.bgPanelBorder : colors.japanesePrimary}
                stroke={active ? colors.alliedTracer : colors.japaneseAccent}
                strokeWidth={active ? 2 : 1}
              />
              {/* Sunk X overlay */}
              {sunk && (
                <>
                  <line
                    x1={rx - 28}
                    y1={cy - 12}
                    x2={rx + 28}
                    y2={cy + 12}
                    stroke={colors.hudRed}
                    strokeWidth={2}
                    opacity={0.8}
                  />
                  <line
                    x1={rx + 28}
                    y1={cy - 12}
                    x2={rx - 28}
                    y2={cy + 12}
                    stroke={colors.hudRed}
                    strokeWidth={2}
                    opacity={0.8}
                  />
                </>
              )}
              {/* Troop count */}
              <text
                x={rx}
                y={cy + 4}
                fill={sunk ? colors.textMuted : colors.textPrimary}
                fontSize={10}
                textAnchor="middle"
                fontFamily={fonts.data}
                fontWeight={600}
              >
                {raft.troops - cas}/{raft.troops}
              </text>
              {/* Raft label above */}
              <text
                x={rx}
                y={cy - 18}
                fill={active ? colors.alliedTracer : colors.textSecondary}
                fontSize={8}
                textAnchor="middle"
                fontFamily={fonts.data}
              >
                {raft.label}
              </text>
              {/* LMG indicator */}
              {raft.lmg && !sunk && (
                <circle
                  cx={rx + 26}
                  cy={cy - 10}
                  r={4}
                  fill={colors.japaneseAccent}
                  opacity={0.8}
                />
              )}
            </g>
          );
        })}
      </svg>

      <div style={{ color: colors.textMuted, fontSize: 9, marginTop: 6, letterSpacing: '0.05em' }}>
        {MAP.note}
      </div>
    </div>
  );
};
