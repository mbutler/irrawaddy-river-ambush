import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, layout, categoryColors, motion } from '../lib/theme';
import type { EALModifier } from '../lib/phoenix';

interface EALPanelProps {
  modifiers: EALModifier[];
  eal: number;
  odds: number;
  weaponName: string;
  rangeMeters: number;
  shotType: string;
  startFrame?: number;
}

export const EALPanel: React.FC<EALPanelProps> = ({
  modifiers,
  eal,
  odds,
  weaponName,
  rangeMeters,
  shotType,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - startFrame);

  const slideIn = spring({ frame: local, fps, config: { damping: 20, stiffness: 80 } });
  const translateX = interpolate(slideIn, [0, 1], [motion.panelSlidePx, 0]);

  // Animate the odds bar width using interpolate (NOT css transition — Remotion renders each frame)
  const barProgress = interpolate(
    local,
    [0, 35],
    [0, odds],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Running EAL sum — build up as rows appear
  const rowsVisible = modifiers.filter((_, i) => local >= i * 4 + 8).length;
  const runningEAL = modifiers
    .slice(0, rowsVisible)
    .reduce((sum, m) => sum + m.value, 0);

  return (
    <div
      style={{
        position: 'absolute',
        top: layout.safeMargin,
        right: layout.safeMargin,
        width: 420,
        fontFamily: fonts.data,
        transform: `translateX(${translateX}px)`,
        opacity: slideIn,
      }}
    >
      <div
        style={{
          background: colors.bgPanel,
          border: `1px solid ${colors.hudPhosphor}`,
          borderRadius: layout.panelRadius,
          overflow: 'hidden',
          boxShadow: `0 0 32px rgba(201,162,39,0.15), 0 8px 32px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(90deg, ${colors.bgDark}, ${colors.jungleDeep})`,
            padding: '14px 20px',
            borderBottom: `1px solid ${colors.bgPanelBorder}`,
          }}
        >
          <div
            style={{
              color: colors.hudPhosphor,
              fontSize: 10,
              letterSpacing: '0.3em',
              fontWeight: 600,
            }}
          >
            EFFECTIVE ACCURACY LEVEL
          </div>
          <div
            style={{
              color: colors.textPrimary,
              fontSize: 15,
              marginTop: 5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <span>{weaponName}</span>
            <span style={{ color: colors.textSecondary, fontSize: 12 }}>
              {shotType} · {rangeMeters}m
            </span>
          </div>
        </div>

        {/* Modifier rows with stagger + running sum column */}
        <div style={{ padding: `16px 20px 0` }}>
          {modifiers.map((mod, i) => {
            const rowDelay = i * 4;
            const rowOpacity = interpolate(local, [rowDelay, rowDelay + 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const sign = mod.value >= 0 ? '+' : '';
            const rowSum = modifiers.slice(0, i + 1).reduce((s, m) => s + m.value, 0);

            return (
              <div
                key={mod.label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  columnGap: 16,
                  alignItems: 'center',
                  padding: '5px 0',
                  borderBottom: `1px solid ${colors.bgPanelBorder}`,
                  opacity: rowOpacity,
                  fontSize: 12,
                }}
              >
                <span style={{ color: categoryColors[mod.category] ?? colors.textSecondary }}>
                  {mod.label}
                </span>
                <span
                  style={{
                    color: mod.value >= 0 ? colors.hudGreen : colors.hudRed,
                    fontWeight: 700,
                    minWidth: 32,
                    textAlign: 'right',
                  }}
                >
                  {sign}{mod.value}
                </span>
                {/* Running sum (shows as each row appears) */}
                <span
                  style={{
                    color: colors.textMuted,
                    fontSize: 10,
                    minWidth: 28,
                    textAlign: 'right',
                    opacity: rowOpacity,
                  }}
                >
                  Σ{rowSum >= 0 ? '+' : ''}{rowSum}
                </span>
              </div>
            );
          })}
        </div>

        {/* EAL footer */}
        <div style={{ padding: '14px 20px 16px' }}>
          <div
            style={{
              paddingTop: 14,
              borderTop: `2px solid ${colors.hudPhosphor}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 600 }}>
              EFFECTIVE ACCURACY LEVEL
            </span>
            <span
              style={{
                color: colors.hudPhosphor,
                fontSize: 36,
                fontWeight: 800,
                textShadow: `0 0 16px rgba(201,162,39,0.5)`,
              }}
            >
              {eal}
            </span>
          </div>

          {/* Odds row */}
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <span style={{ color: colors.textSecondary, fontSize: 11, letterSpacing: '0.15em' }}>
              ODDS OF HITTING (4G)
            </span>
            <span
              style={{
                color: odds >= 50 ? colors.hudGreen : colors.hudAmber,
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              {odds}%
            </span>
          </div>

          {/* Animated odds bar (Remotion-safe: uses interpolate, not CSS transition) */}
          <div
            style={{
              marginTop: 8,
              height: 8,
              background: colors.bgDark,
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${colors.bgPanelBorder}`,
            }}
          >
            <div
              style={{
                width: `${barProgress}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${colors.hudAmber}, ${barProgress >= 50 ? colors.hudGreen : colors.hudAmber})`,
                borderRadius: 4,
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 4,
              fontSize: 9,
              color: colors.textMuted,
            }}
          >
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
