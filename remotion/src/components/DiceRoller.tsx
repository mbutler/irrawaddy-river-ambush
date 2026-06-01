import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts } from '../lib/theme';

interface DiceRollerProps {
  targetRoll: number;
  odds: number;
  lockFrame?: number;
  label?: string;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  targetRoll,
  odds,
  lockFrame = 45,
  label = 'TO HIT — d100',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isLocked = frame >= lockFrame;
  const hit = targetRoll <= odds;

  // Independent digit scramble — tens and ones advance at slightly different rates
  const scrambleTens = isLocked
    ? Math.floor(targetRoll / 10)
    : Math.floor((frame * 13 + 7) % 10);
  const scrambleOnes = isLocked
    ? targetRoll % 10
    : Math.floor((frame * 19 + 3) % 10);

  const lockSpring = spring({
    frame: Math.max(0, frame - lockFrame),
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const scale = isLocked ? interpolate(lockSpring, [0, 1], [1.35, 1.0]) : 1;

  const resultColor = hit ? colors.hit : colors.miss;
  const resultText = hit ? 'HIT' : 'MISS';

  // Result label entrance
  const resultOpacity = spring({
    frame: Math.max(0, frame - lockFrame - 2),
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  // Background glow on lock (for hit)
  const glowOpacity = hit && isLocked
    ? interpolate(lockSpring, [0, 1], [0.5, 0.15])
    : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: fonts.data,
        position: 'relative',
      }}
    >
      {/* Ambient glow on hit */}
      {isLocked && hit && (
        <div
          style={{
            position: 'absolute',
            inset: -40,
            background: `radial-gradient(ellipse at 50% 50%, ${colors.hudGreen}, transparent 70%)`,
            opacity: glowOpacity,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          color: colors.textSecondary,
          fontSize: 10,
          letterSpacing: '0.3em',
          marginBottom: 16,
          position: 'relative',
        }}
      >
        {label}
      </div>

      {/* Digit boxes */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          transform: `scale(${scale})`,
          position: 'relative',
        }}
      >
        {[scrambleTens, scrambleOnes].map((digit, i) => (
          <div
            key={i}
            style={{
              width: 84,
              height: 106,
              background: colors.bgDark,
              border: `2px solid ${isLocked ? resultColor : colors.hudPhosphor}`,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 60,
              fontWeight: 800,
              color: isLocked ? resultColor : colors.hudPhosphor,
              boxShadow: isLocked
                ? `0 0 28px ${resultColor}55, inset 0 0 12px ${resultColor}18`
                : `0 0 8px rgba(201,162,39,0.2)`,
              // Slight flicker when scrambling
              opacity: isLocked ? 1 : 0.85 + (frame % 3 === 0 ? 0.15 : 0),
            }}
          >
            {digit}
          </div>
        ))}
      </div>

      {/* Threshold label (always visible after a moment) */}
      <div
        style={{
          marginTop: 14,
          color: colors.textMuted,
          fontSize: 12,
          opacity: interpolate(frame, [8, 18], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        Need ≤ {odds}%
      </div>

      {/* HIT / MISS result */}
      {isLocked && (
        <div
          style={{
            marginTop: 12,
            fontSize: 40,
            fontWeight: 800,
            color: resultColor,
            letterSpacing: '0.2em',
            opacity: resultOpacity,
            textShadow: `0 0 20px ${resultColor}88`,
            position: 'relative',
          }}
        >
          {resultText}
        </div>
      )}

      {/* Roll vs threshold detail */}
      {isLocked && (
        <div
          style={{
            marginTop: 6,
            color: colors.textMuted,
            fontSize: 13,
            opacity: resultOpacity,
          }}
        >
          {String(targetRoll).padStart(2, '0')} {hit ? '≤' : '>'} {odds}% threshold
        </div>
      )}
    </div>
  );
};
