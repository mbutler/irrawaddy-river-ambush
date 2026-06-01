import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, layout } from '../lib/theme';
import { EALPanel } from './EALPanel';
import { DiceRoller } from './DiceRoller';
import { PhaseClock } from './PhaseClock';
import { TacticalMap } from './TacticalMap';
import { CharacterCard, KVGauge } from './CharacterCard';
import { LayerBadge } from './VictoryDashboard';
import { getBeat, KACHIN, JAPANESE } from '../data/scenario';
import { resolveDamage } from '../lib/phoenix';

interface CombatResolutionProps {
  beatId: string;
}

// Map character IDs to squad/position IDs for tracer routing
const CHAR_TO_SQUAD: Record<string, string> = {
  'k-01': 'alpha',
  'k-02': 'alpha',
  'k-03': 'bravo',
  'k-04': 'bravo',
  'k-05': 'bravo',
  'k-06': 'bravo',
  'k-07': 'bravo',
  'k-08': 'charlie',
  'k-09': 'charlie',
  'k-10': 'delta',
  'j-03': 'raft-1',
  'j-05': 'raft-2',
  'j-07': 'raft-3',
};

/** Full-screen combat beat: two-column layout — map+character left, EAL+dice right */
export const CombatResolution: React.FC<CombatResolutionProps> = ({ beatId }) => {
  const beat = getBeat(beatId);
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  if (!beat) {
    return (
      <AbsoluteFill
        style={{
          background: colors.bgDark,
          color: colors.hudRed,
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: fonts.data,
          fontSize: 24,
        }}
      >
        Beat not found: {beatId}
      </AbsoluteFill>
    );
  }

  const shooter =
    KACHIN.find((c) => c.id === beat.shooterId) ??
    JAPANESE.find((c) => c.id === beat.shooterId);

  const hit = beat.scriptedRoll <= beat.shot.odds;
  const damage =
    hit && beat.beatType === 'fire' && beat.shot.rangeHexes > 0
      ? resolveDamage(beat.shot.weaponName, beat.shot.rangeHexes, beat.scriptedHitRoll)
      : null;

  const tracerFrom =
    shooter?.side === 'kachin' ? CHAR_TO_SQUAD[beat.shooterId] : beat.targetRaftId;
  const tracerTo =
    shooter?.side === 'kachin' ? beat.targetRaftId : CHAR_TO_SQUAD[beat.shooterId] ?? 'alpha';

  // Title slide-in
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 15], [-12, 0], { extrapolateRight: 'clamp' });

  // Narration fade-in (lower third, delayed)
  const narrationOpacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Notes fade-in (after narration)
  const notesOpacity = interpolate(frame, [fps * 4, fps * 5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: colors.bgDark, fontFamily: fonts.body }}>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <LayerBadge mode="simulation" />

      {/* Beat title – centered in the top bar */}
      <div
        style={{
          position: 'absolute',
          top: layout.safeMargin - 8,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: fonts.headline,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: colors.textPrimary,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          pointerEvents: 'none',
        }}
      >
        {beat.title.toUpperCase()}
      </div>

      {/* ── Left column: Tactical Map (top) ─────────────────────────────── */}
      <div style={{ position: 'absolute', left: layout.safeMargin, top: 130 }}>
        <TacticalMap
          phase={beat.phase}
          activeSquads={shooter?.side === 'kachin' ? [CHAR_TO_SQUAD[beat.shooterId]] : []}
          activeRafts={[beat.targetRaftId]}
          tracerFrom={shooter?.side === 'kachin' ? tracerFrom : undefined}
          tracerTo={shooter?.side === 'kachin' ? beat.targetRaftId : undefined}
          sunkRafts={beat.beatType === 'morale' ? ['raft-1'] : []}
        />
      </div>

      {/* ── Left column: Shooter character card (below map) ─────────────── */}
      {shooter && (
        <div style={{ position: 'absolute', left: layout.safeMargin, top: 700 }}>
          <CharacterCard character={shooter} startFrame={8} showWeapon />
        </div>
      )}

      {/* ── Center gap: Dice Roller (fire beat) or KV Gauge (morale beat) ─ */}
      <div
        style={{
          position: 'absolute',
          left: 1080,
          top: 420,
          transform: 'translateX(-50%)',
        }}
      >
        {beat.beatType === 'fire' ? (
          <Sequence from={fps * 2} durationInFrames={fps * 8}>
            <DiceRoller targetRoll={beat.scriptedRoll} odds={beat.shot.odds} lockFrame={30} />
          </Sequence>
        ) : (
          /* Morale beat: show KV incapacitation gauge instead */
          <Sequence from={fps * 1} durationInFrames={fps * 9}>
            <KVGauge
              currentPD={beat.pdTotal ?? 0}
              kv={shooter?.kv ?? 10}
              roll={beat.scriptedRoll}
              startFrame={0}
            />
          </Sequence>
        )}
      </div>

      {/* ── Right column: EAL panel ─────────────────────────────────────── */}
      <Sequence from={15} durationInFrames={fps * 10}>
        <EALPanel
          modifiers={beat.shot.modifiers}
          eal={beat.shot.eal}
          odds={beat.shot.odds}
          weaponName={beat.shot.weaponName}
          rangeMeters={beat.shot.rangeMeters}
          shotType={beat.shot.mods.shotType}
          startFrame={0}
        />
      </Sequence>

      {/* ── Bottom right: Damage readout (fire beat, on hit) ─────────────── */}
      {damage && hit && beat.beatType === 'fire' && (
        <Sequence from={fps * 5}>
          <div
            style={{
              position: 'absolute',
              right: layout.safeMargin,
              bottom: 160,
              width: 320,
              fontFamily: fonts.data,
              color: colors.textPrimary,
              background: colors.bgPanel,
              padding: '14px 18px',
              borderRadius: layout.panelRadius,
              border: `1px solid ${colors.hudRed}`,
              boxShadow: `0 0 20px rgba(248,81,73,0.25)`,
            }}
          >
            <div
              style={{ color: colors.hudRed, fontSize: 10, letterSpacing: 3, marginBottom: 10 }}
            >
              DAMAGE RESOLUTION
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px 16px',
                fontSize: 14,
              }}
            >
              <span style={{ color: colors.textMuted }}>Location</span>
              <span style={{ color: colors.textPrimary, fontWeight: 600 }}>{damage.location}</span>
              <span style={{ color: colors.textMuted }}>PEN</span>
              <span style={{ color: colors.hudAmber }}>{damage.pen}</span>
              <span style={{ color: colors.textMuted }}>DC</span>
              <span style={{ color: colors.hudAmber }}>{damage.dc}</span>
              <span style={{ color: colors.textMuted }}>PD</span>
              <span
                style={{
                  color: damage.pd > (shooter?.kv ?? 99) ? colors.hudRed : colors.hudGreen,
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {damage.pd}
              </span>
            </div>
          </div>
        </Sequence>
      )}

      {/* ── Lower third: narration ───────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          left: layout.safeMargin,
          bottom: 160,
          width: 860,
          fontFamily: fonts.historical,
          fontSize: 16,
          fontStyle: 'italic',
          color: colors.textSecondary,
          lineHeight: 1.6,
          opacity: narrationOpacity,
        }}
      >
        {beat.narration}
      </div>

      {/* Beat notes */}
      {beat.notes.length > 0 && (
        <div
          style={{
            position: 'absolute',
            left: layout.safeMargin,
            bottom: 110,
            width: 860,
            fontFamily: fonts.data,
            fontSize: 11,
            letterSpacing: '0.08em',
            color: beat.beatType === 'morale' ? colors.hudAmber : (hit ? colors.hudGreen : colors.hudRed),
            opacity: notesOpacity,
          }}
        >
          {beat.notes[0]}
        </div>
      )}

      {/* ── Phase clock ─────────────────────────────────────────────────── */}
      <PhaseClock phase={beat.phase} impulse={beat.impulse} />
    </AbsoluteFill>
  );
};
