import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts } from '../lib/theme';
import { EALPanel } from '../components/EALPanel';
import { DiceRoller } from '../components/DiceRoller';
import { resolveFromWeapon } from '../lib/phoenix';
import { TitleCard } from '../components/VictoryDashboard';
import { VictoryDashboard } from '../components/VictoryDashboard';

// Demo beat: BAR A2 burst at 120 hexes — beat-02 (Alpha hero shot)
const DEMO_WEAPON = 'BAR A2';
const DEMO_MODS = {
  sal: 11,
  shotType: 'Burst' as const,
  targetSpeed: 0.5,
  shooterSpeed: 0,
  range: 120,
  situational: ['Bipod Mounted Weapon'],
  visibility: ['Good Visibility'],
  targetSize: ['Standing Exposed'],
};

/** Standalone 90s EAL tutorial showing how Phoenix Command resolves a shot */
export const EALDemo: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const demo = resolveFromWeapon(DEMO_WEAPON, 6, DEMO_MODS);

  // Title: 0-3s
  const titleOpacity = interpolate(frame, [0, fps * 0.5, fps * 2.5, fps * 3], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });

  // EAL panel: fades in at 3s, persists for the rest of the demo
  const panelOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Dice: appears at 8s, persists
  const diceOpacity = interpolate(frame, [fps * 8, fps * 9], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Step annotations that appear one at a time
  const steps = [
    { label: '① Aim Time + SAL', t: fps * 4 },
    { label: '② Range ALM', t: fps * 5 },
    { label: '③ Movement ALM', t: fps * 6 },
    { label: '④ Situation & Target', t: fps * 6.5 },
    { label: '⑤ Roll d100 ≤ Odds', t: fps * 8 },
  ];

  return (
    <AbsoluteFill style={{ background: colors.bgDark }}>

      {/* Title overlay */}
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
        <TitleCard
          line1="HOW PHOENIX COMMAND"
          line2="CALCULATES A SHOT"
          subtitle={`${DEMO_WEAPON} · 6-Action Burst · 120 hex (220m)`}
        />
      </div>

      {/* EAL Panel — visible from 3s onwards */}
      <div style={{ opacity: panelOpacity }}>
        <EALPanel
          modifiers={demo.modifiers}
          eal={demo.eal}
          odds={demo.odds}
          weaponName={demo.weaponName}
          rangeMeters={demo.rangeMeters}
          shotType="Burst"
          startFrame={fps * 3}
        />
      </div>

      {/* Dice roller — visible from 8s onwards */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          marginLeft: -180,
          opacity: diceOpacity,
        }}
      >
        <DiceRoller targetRoll={22} odds={demo.odds} lockFrame={fps * 10 - fps * 8} />
      </div>

      {/* Step-by-step annotations */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: fonts.data,
          fontSize: 14,
          color: colors.textPrimary,
          opacity: panelOpacity,
        }}
      >
        {steps.map((step, i) => {
          const visible = frame >= step.t;
          return (
            <div
              key={step.label}
              style={{
                padding: '10px 16px',
                marginBottom: 6,
                borderLeft: `3px solid ${visible ? colors.hudPhosphor : colors.bgPanelBorder}`,
                color: visible ? colors.textPrimary : colors.textMuted,
                opacity: interpolate(frame, [step.t, step.t + 15], [visible ? 0 : 0.3, visible ? 1 : 0.3], {
                  extrapolateRight: 'clamp',
                }),
                fontWeight: visible ? 600 : 400,
              }}
            >
              {step.label}
            </div>
          );
        })}
      </div>

      {/* Bottom caption */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: fonts.historical,
          fontSize: 16,
          fontStyle: 'italic',
          color: colors.textMuted,
          opacity: panelOpacity,
        }}
      >
        Every modifier is drawn from the Phoenix Command rulebook and computed by phoenix-functions.
      </div>
    </AbsoluteFill>
  );
};

export const OutcomeDashboard: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: colors.bgDark,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: fonts.body,
      }}
    >
      <VictoryDashboard startFrame={0} />
    </AbsoluteFill>
  );
};
