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

/**
 * Stylized Burma, hand-projected from rough lon/lat (92–101.5°E, 9.5–28.5°N).
 * Documentary-grade simplification — replace with a QGIS export for survey accuracy.
 */
const BURMA_OUTLINE =
  'M 568 95 L 627 124 L 645 201 L 636 249 L 681 303 L 727 395 L 754 424 L 709 477 ' +
  'L 700 506 L 631 574 L 599 608 L 622 675 L 654 767 L 686 879 L 638 975 L 636 903 ' +
  'L 613 830 L 595 758 L 595 670 L 563 666 L 531 661 L 490 700 L 440 690 L 431 612 ' +
  'L 408 540 L 381 482 L 354 448 L 372 404 L 404 346 L 399 288 L 445 235 L 486 196 ' +
  'L 531 138 Z';

/** Irrawaddy: confluence above Myitkyina south through Mandalay to the delta */
const IRRAWADDY_PATH =
  'M 595 206 L 585 231 L 581 254 L 578 285 L 538 289 L 526 396 L 490 424 L 481 491 L 486 588 L 486 627 L 477 685';

const CITIES = [
  { name: 'Myitkyina', x: 585, y: 231, note: 'Falls 3 Aug 1944', dx: 14, dy: -2 },
  { name: 'Bhamo', x: 578, y: 285, dx: 14, dy: 4 },
  { name: 'Mandalay', x: 526, y: 396, dx: 14, dy: 4 },
  { name: 'Rangoon', x: 531, y: 661, dx: 8, dy: 18 },
];

const AMBUSH = { x: 581, y: 254 };

export const HistoricalMap: React.FC = () => {
  const frame = useCurrentFrame();

  const layerOpacity = (delay: number) =>
    interpolate(frame, [delay, delay + 25], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const outlineDraw = interpolate(frame, [0, 45], [0, 1], { extrapolateRight: 'clamp' });
  const ambushPulse = 1 + 0.25 * Math.sin((frame / 30) * Math.PI * 2);

  return (
    <AbsoluteFill style={{ background: colors.bgDark }}>
      <svg
        width={layout.width}
        height={layout.height}
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor={colors.jungleDeep} stopOpacity={0.55} />
            <stop offset="100%" stopColor={colors.jungleDeep} stopOpacity={0} />
          </radialGradient>
          <marker id="arrowAllied" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.alliedPrimary} />
          </marker>
          <marker id="arrowJapanese" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.japaneseAccent} />
          </marker>
          <filter id="ambushGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft glow behind the landmass */}
        <ellipse cx={560} cy={480} rx={520} ry={560} fill="url(#mapGlow)" />

        {/* Burma landmass */}
        <path
          d={BURMA_OUTLINE}
          fill={colors.jungleDeep}
          stroke={colors.jungleAccent}
          strokeWidth={2}
          strokeLinejoin="round"
          opacity={0.55 * outlineDraw}
        />

        {/* Neighbor labels for orientation */}
        <g fontFamily={fonts.data} fontSize={14} fill={colors.textMuted} letterSpacing="0.3em" opacity={outlineDraw * 0.9}>
          <text x={370} y={160}>INDIA</text>
          <text x={700} y={170}>CHINA</text>
          <text x={760} y={560}>SIAM</text>
          <text x={330} y={700} fontStyle="italic" letterSpacing="0.15em">BAY OF BENGAL</text>
        </g>

        {/* Irrawaddy */}
        <path
          d={IRRAWADDY_PATH}
          fill="none"
          stroke={colors.riverCurrent}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={interpolate(frame, [10, 50], [0, 0.9], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />
        <text
          x={455}
          y={540}
          fill={colors.riverFoam}
          fontSize={15}
          fontFamily={fonts.historical}
          fontStyle="italic"
          opacity={interpolate(frame, [40, 70], [0, 0.85], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
          transform="rotate(-78 455 540)"
        >
          Irrawaddy
        </text>

        {/* Layer 1 — Stilwell / NCAC advance from Ledo toward Myitkyina */}
        <g opacity={layerOpacity(30)}>
          <circle cx={511} cy={138} r={5} fill={colors.alliedPrimary} opacity={0.9} />
          <text x={496} y={122} fill={colors.textSecondary} fontSize={14} fontFamily={fonts.body}>
            Ledo
          </text>
          <path
            d="M 517 146 Q 545 175 574 216"
            fill="none"
            stroke={colors.alliedPrimary}
            strokeWidth={3.5}
            strokeDasharray="10 6"
            markerEnd="url(#arrowAllied)"
            opacity={0.9}
          />
        </g>

        {/* Layer 2 — Japanese 15th Army retreat east from Imphal/Kohima */}
        <g opacity={layerOpacity(60)}>
          <circle cx={429} cy={259} r={5} fill={colors.japaneseAccent} opacity={0.9} />
          <text x={372} y={252} fill={colors.textSecondary} fontSize={14} fontFamily={fonts.body}>
            Imphal
          </text>
          <path
            d="M 437 266 Q 462 300 478 330"
            fill="none"
            stroke={colors.japaneseAccent}
            strokeWidth={3}
            strokeDasharray="8 6"
            markerEnd="url(#arrowJapanese)"
            opacity={0.85}
          />
          <path
            d="M 445 240 Q 480 262 505 285"
            fill="none"
            stroke={colors.japaneseAccent}
            strokeWidth={3}
            strokeDasharray="8 6"
            markerEnd="url(#arrowJapanese)"
            opacity={0.85}
          />
        </g>

        {/* Layer 3 — OSS Detachment 101 operating area in the Kachin hills */}
        <g opacity={layerOpacity(90)}>
          <ellipse
            cx={610}
            cy={205}
            rx={78}
            ry={62}
            fill={colors.jungleAccent}
            opacity={0.12}
          />
          <ellipse
            cx={610}
            cy={205}
            rx={78}
            ry={62}
            fill="none"
            stroke={colors.jungleAccent}
            strokeWidth={1.5}
            strokeDasharray="6 6"
            opacity={0.8}
          />
          <text x={648} y={158} fill={colors.jungleAccent} fontSize={13} fontFamily={fonts.data} letterSpacing="0.1em">
            DET 101
          </text>
        </g>

        {/* Layer 4 — raft evacuation route + ambush site */}
        <g opacity={layerOpacity(120)}>
          <path
            d="M 585 231 L 578 285"
            fill="none"
            stroke={colors.riverFoam}
            strokeWidth={7}
            strokeLinecap="round"
            opacity={0.55}
          />
          <g filter="url(#ambushGlow)">
            <circle cx={AMBUSH.x} cy={AMBUSH.y} r={7 * ambushPulse} fill="none" stroke={colors.hudAmber} strokeWidth={2.5} />
            <circle cx={AMBUSH.x} cy={AMBUSH.y} r={3} fill={colors.hudAmber} />
          </g>
          <text
            x={AMBUSH.x + 22}
            y={AMBUSH.y + 26}
            fill={colors.hudAmber}
            fontSize={15}
            fontFamily={fonts.data}
            fontWeight={700}
            letterSpacing="0.08em"
          >
            AMBUSH · JULY 1944
          </text>
        </g>

        {/* Cities (above layers so labels stay legible) */}
        <g opacity={interpolate(frame, [20, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          {CITIES.map((c) => (
            <g key={c.name}>
              <circle cx={c.x} cy={c.y} r={4.5} fill={colors.textPrimary} stroke={colors.bgDark} strokeWidth={1.5} />
              <text
                x={c.x + c.dx}
                y={c.y + c.dy + 4}
                fill={colors.textPrimary}
                fontSize={16}
                fontFamily={fonts.headline}
                fontWeight={600}
                letterSpacing="0.04em"
              >
                {c.name}
              </text>
              {c.note && (
                <text x={c.x + c.dx} y={c.y + c.dy + 22} fill={colors.textSecondary} fontSize={12} fontFamily={fonts.body}>
                  {c.note}
                </text>
              )}
            </g>
          ))}
        </g>
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
      <div
        style={{
          fontFamily: fonts.headline,
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: colors.hudPhosphor,
          marginBottom: 48,
        }}
      >
        PHOENIX COMMAND
      </div>
      {/* Fixed-width rows + constant type size — highlight moves without reflowing the column */}
      <div style={{ width: 640 }}>
        {steps.map((step, i) => (
          <div
            key={step.t}
            style={{
              fontFamily: fonts.data,
              fontSize: 24,
              color: i === active ? colors.textPrimary : i < active ? colors.textSecondary : colors.textMuted,
              padding: '14px 20px',
              fontWeight: i === active ? 700 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              borderLeft: `3px solid ${i === active ? colors.hudPhosphor : 'transparent'}`,
              background: i === active ? 'rgba(201,162,39,0.07)' : 'transparent',
            }}
          >
            <span style={{ color: colors.hudPhosphor, opacity: i <= active ? 1 : 0, fontSize: 18 }}>
              ▸
            </span>
            {step.t}
          </div>
        ))}
      </div>
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
