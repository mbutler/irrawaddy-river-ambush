import React from 'react';
import { interpolate, staticFile, useCurrentFrame } from 'remotion';
import { colors, fonts, layout as screenLayout } from '../lib/theme';
import { MAP, RAFTS, KACHIN_POSITIONS } from '../data/scenario';
import {
  ARTWORK_MAP,
  artworkBoatSize,
  DEBUG_RIVER_PATH,
  positionAlongRiverPath,
  raftPathProgress,
  RIVER_PATH,
  tacticalMapHeroScale,
} from '../data/mapLayout';

interface TacticalMapProps {
  phase: number;
  activeSquads?: string[];
  activeRafts?: string[];
  tracerFrom?: string;
  tracerTo?: string;
  raftCasualties?: Record<string, number>;
  sunkRafts?: string[];
  startFrame?: number;
  /** `panel` = compact for combat beats; `hero` = fill frame for TacticalSetup */
  size?: 'panel' | 'hero';
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
  size = 'panel',
}) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startFrame);
  const fadeIn = interpolate(local, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const isHero = size === 'hero';
  const mapScale = isHero ? tacticalMapHeroScale(screenLayout) : 1;
  const baseW = ARTWORK_MAP.width;
  const baseH = ARTWORK_MAP.height;
  const W = baseW * mapScale;
  const H = baseH * mapScale;
  const pad = isHero ? 16 : 20;
  const boatSize = artworkBoatSize();

  const raftPosition = (raftId: string) => {
    const t = raftPathProgress(raftId, phase, local);
    return positionAlongRiverPath(t);
  };

  const squadPosition = (squadId: string) => {
    const pos = ARTWORK_MAP.squads[squadId as keyof typeof ARTWORK_MAP.squads];
    return pos ? { x: pos.x, y: pos.y } : { x: 0, y: 0 };
  };

  const fromSq = tracerFrom ? squadPosition(tracerFrom) : null;
  const toRf = tracerTo ? raftPosition(tracerTo) : null;

  let tracerProgress = 0;
  if (fromSq && toRf && local > 8) {
    tracerProgress = interpolate(local, [8, 22], [0, 1], { extrapolateRight: 'clamp' });
  }

  const fromX = fromSq?.x ?? 0;
  const fromY = fromSq?.y ?? 0;
  const toX = toRf?.x ?? 0;
  const toY = toRf?.y ?? 0;

  const tracerLength = fromSq && toRf ? Math.hypot(toX - fromX, toY - fromY) : 0;

  const riverBg = staticFile('assets/river-graphic.png');
  const boatImg = staticFile('assets/boat.png');

  return (
    <div
      style={{
        width: W + pad * 2,
        padding: pad,
        background: colors.bgPanel,
        border: `1px solid ${colors.bgPanelBorder}`,
        borderRadius: isHero ? 10 : 8,
        opacity: fadeIn,
        fontFamily: fonts.data,
      }}
    >
      <div
        style={{
          color: colors.textSecondary,
          fontSize: isHero ? 12 : 10,
          letterSpacing: '0.2em',
          marginBottom: isHero ? 10 : 8,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>TACTICAL MAP — IRRAWADDY KILL ZONE</span>
        <span style={{ color: colors.textMuted }}>
          Phase {phase} · {MAP.currentKnots.toFixed(1)} kt current
        </span>
      </div>

      <svg width={W} height={H} style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="tracerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="tokenGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="boatShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.45" />
          </filter>
        </defs>

        <g transform={`scale(${mapScale})`}>
        {/* River map artwork */}
        <image
          href={riverBg}
          x={0}
          y={0}
          width={baseW}
          height={baseH}
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Subtle vignette so HUD tokens read clearly */}
        <rect x={0} y={0} width={baseW} height={baseH} fill="#0d1117" opacity={0.12} />

        {/* Debug: river centerline — enable DEBUG_RIVER_PATH in mapLayout.ts while calibrating */}
        {DEBUG_RIVER_PATH && (
          <>
            <polyline
              points={RIVER_PATH.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#00e5ff"
              strokeWidth={2}
              strokeDasharray="8 6"
              opacity={0.9}
            />
            {RIVER_PATH.map((p, i) => (
              <g key={`wp-${i}`}>
                <circle cx={p.x} cy={p.y} r={4} fill="#00e5ff" />
                <text x={p.x + 6} y={p.y - 6} fill="#00e5ff" fontSize={8} fontFamily={fonts.data}>
                  {i}
                </text>
              </g>
            ))}
          </>
        )}

        {/* Kachin squad tokens */}
        {KACHIN_POSITIONS.map((sq) => {
          const pos = squadPosition(sq.id);
          const layout = ARTWORK_MAP.squads[sq.id as keyof typeof ARTWORK_MAP.squads];
          const active = activeSquads.includes(sq.id);
          const cx = pos.x;
          const cy = pos.y;
          const r = active ? 11 : 8;
          const fill = active ? colors.alliedPrimary : colors.jungleAccent;
          const opacity = active ? 1 : 0.82;

          return (
            <g key={sq.id} opacity={opacity} filter={active ? 'url(#tokenGlow)' : undefined}>
              <circle cx={cx} cy={cy} r={r + 3} fill={colors.bgDark} opacity={0.55} />
              <circle cx={cx} cy={cy} r={r} fill={fill} stroke={colors.bgDark} strokeWidth={1.5} />
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
              <text
                x={cx + r + 6}
                y={cy - 10}
                fill={active ? colors.alliedTracer : colors.textPrimary}
                fontSize={9}
                fontFamily={fonts.data}
                fontWeight={active ? 700 : 400}
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
              >
                {layout?.label ?? sq.label}
              </text>
              {active && (
                <text
                  x={cx + r + 6}
                  y={cy + 4}
                  fill={colors.riverFoam}
                  fontSize={8}
                  fontFamily={fonts.data}
                >
                  {layout?.rangeToRiverHexes ?? sq.rangeToRiverHexes} hex /{' '}
                  {Math.round((layout?.rangeToRiverHexes ?? sq.rangeToRiverHexes) * 1.83)}m
                </text>
              )}
            </g>
          );
        })}

        {/* Range arc */}
        {fromSq && toRf && (
          <path
            d={`M ${fromX} ${fromY} C ${fromX + (toX - fromX) * 0.35} ${fromY} ${fromX + (toX - fromX) * 0.65} ${toY} ${toX} ${toY}`}
            fill="none"
            stroke={colors.alliedPrimary}
            strokeWidth={1.5}
            strokeDasharray="6 6"
            opacity={interpolate(local, [0, 15], [0, 0.55], { extrapolateRight: 'clamp' })}
          />
        )}

        {/* Tracer */}
        {fromSq && toRf && tracerLength > 0 && (
          <>
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
            <line
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke={colors.alliedTracer}
              strokeWidth={2}
              strokeDasharray={`${tracerLength} ${tracerLength}`}
              strokeDashoffset={tracerLength * (1 - tracerProgress)}
              opacity={0.95}
            />
          </>
        )}

        {/* Raft boats */}
        {RAFTS.map((raft) => {
          const sunk = sunkRafts.includes(raft.id);
          const cas = raftCasualties[raft.id] ?? 0;
          const active = activeRafts.includes(raft.id);
          const { x: rx, y: cy, angleDeg } = raftPosition(raft.id);
          const layout = ARTWORK_MAP.rafts[raft.id as keyof typeof ARTWORK_MAP.rafts];
          const bw = boatSize.width;
          const bh = boatSize.height;

          return (
            <g key={raft.id} opacity={sunk ? 0.4 : 1}>
              {active && !sunk && (
                <ellipse
                  cx={rx}
                  cy={cy}
                  rx={bh * 0.35}
                  ry={bw * 0.85}
                  fill="none"
                  stroke={colors.alliedTracer}
                  strokeWidth={2}
                  opacity={0.75}
                  filter="url(#tokenGlow)"
                  transform={`rotate(${angleDeg}, ${rx}, ${cy})`}
                />
              )}

              <image
                href={boatImg}
                x={-bw / 2}
                y={-bh / 2}
                width={bw}
                height={bh}
                preserveAspectRatio="xMidYMid meet"
                filter={sunk ? undefined : 'url(#boatShadow)'}
                opacity={sunk ? 0.55 : 1}
                transform={`translate(${rx}, ${cy}) rotate(${angleDeg})`}
              />

              {sunk && (
                <g transform={`translate(${rx}, ${cy}) rotate(${angleDeg})`}>
                  <line
                    x1={-bw / 2}
                    y1={-bh / 2}
                    x2={bw / 2}
                    y2={bh / 2}
                    stroke={colors.hudRed}
                    strokeWidth={2.5}
                    opacity={0.9}
                  />
                  <line
                    x1={bw / 2}
                    y1={-bh / 2}
                    x2={-bw / 2}
                    y2={bh / 2}
                    stroke={colors.hudRed}
                    strokeWidth={2.5}
                    opacity={0.9}
                  />
                </g>
              )}

              <rect
                x={rx - 18}
                y={cy + bh * 0.35 + 2}
                width={36}
                height={14}
                rx={3}
                fill={colors.bgDark}
                opacity={0.72}
              />
              <text
                x={rx}
                y={cy + bh * 0.35 + 12}
                fill={sunk ? colors.textMuted : colors.textPrimary}
                fontSize={9}
                textAnchor="middle"
                fontFamily={fonts.data}
                fontWeight={600}
              >
                {raft.troops - cas}/{raft.troops}
              </text>

              <text
                x={rx}
                y={cy - bh * 0.35 - 6}
                fill={active ? colors.alliedTracer : colors.textPrimary}
                fontSize={8}
                textAnchor="middle"
                fontFamily={fonts.data}
                fontWeight={active ? 600 : 400}
              >
                {layout?.label ?? raft.label}
              </text>

              {raft.lmg && !sunk && (
                <circle
                  cx={rx + Math.cos((angleDeg * Math.PI) / 180) * (bh * 0.35)}
                  cy={cy + Math.sin((angleDeg * Math.PI) / 180) * (bh * 0.35)}
                  r={4}
                  fill={colors.japaneseAccent}
                />
              )}
            </g>
          );
        })}
        </g>
      </svg>

      <div
        style={{
          color: colors.textMuted,
          fontSize: isHero ? 10 : 9,
          marginTop: isHero ? 8 : 6,
          letterSpacing: '0.05em',
        }}
      >
        {MAP.note}
      </div>
    </div>
  );
};
