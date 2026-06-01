import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, layout } from '../lib/theme';

interface PhaseClockProps {
  phase: number;
  impulse: number;
  elapsedPhases?: number;
}

export const PhaseClock: React.FC<PhaseClockProps> = ({ phase, impulse, elapsedPhases }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase time: each phase = 2 seconds, each impulse = 0.5 seconds
  const seconds = (phase - 1) * 2 + (impulse - 1) * 0.5;

  // Individual impulse bar animations — each bar pulses only when it is the active bar
  const barPulse = interpolate(frame % fps, [0, fps / 2, fps], [1, 1.0, 1], {
    extrapolateRight: 'clamp',
  });

  // Fade in the clock on mount
  const clockOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: layout.safeMargin,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: clockOpacity,
      }}
    >
      <div
        style={{
          background: colors.bgPanel,
          border: `1px solid ${colors.bgPanelBorder}`,
          borderRadius: layout.panelRadius,
          padding: '14px 28px',
          display: 'flex',
          gap: 28,
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            color: colors.textSecondary,
            fontSize: 10,
            letterSpacing: '0.25em',
            fontFamily: fonts.data,
          }}
        >
          PHOENIX COMMAND
        </div>

        {/* Impulse bars — only active bar glows/pulses */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4].map((i) => {
            const isActive = i === impulse;
            const isPast = i < impulse;
            const barScale = isActive ? barPulse : 1;

            return (
              <div
                key={i}
                style={{
                  width: 44,
                  height: 8,
                  borderRadius: 4,
                  background: isPast || isActive ? colors.hudPhosphor : colors.bgPanelBorder,
                  opacity: isPast ? 0.5 : 1,
                  boxShadow:
                    isActive ? `0 0 14px ${colors.hudPhosphor}, 0 0 4px ${colors.hudPhosphor}` : undefined,
                  transform: `scaleY(${barScale})`,
                  transformOrigin: 'center',
                  transition: undefined, // no CSS transitions in Remotion
                }}
              />
            );
          })}
        </div>

        {/* Phase / Impulse counter */}
        <div
          style={{
            color: colors.textPrimary,
            fontSize: 24,
            fontWeight: 700,
            fontFamily: fonts.data,
          }}
        >
          PHASE{' '}
          <span style={{ color: colors.hudPhosphor, fontSize: 28, fontWeight: 800 }}>{phase}</span>
          <span style={{ color: colors.textSecondary, fontSize: 18, marginLeft: 10 }}>
            IMP {impulse}
          </span>
        </div>

        {/* Elapsed time */}
        <div style={{ color: colors.textMuted, fontSize: 13, fontFamily: fonts.data }}>
          T+{seconds.toFixed(1)}s
        </div>

        {/* Optional beat counter */}
        {elapsedPhases !== undefined && (
          <div
            style={{
              color: colors.textSecondary,
              fontSize: 11,
              fontFamily: fonts.data,
              borderLeft: `1px solid ${colors.bgPanelBorder}`,
              paddingLeft: 16,
            }}
          >
            Beat {elapsedPhases}/8
          </div>
        )}
      </div>
    </div>
  );
};
