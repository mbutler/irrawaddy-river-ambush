import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, layout } from '../lib/theme';
import { EALPanel } from './EALPanel';
import { DiceRoller } from './DiceRoller';
import { PhaseClock } from './PhaseClock';
import { TacticalMap } from './TacticalMap';
import { CharacterCard, KVGauge } from './CharacterCard';
import { getBeat, KACHIN, JAPANESE } from '../data/scenario';
import { resolveDamage } from '../lib/phoenix';
import type { CombatBeat } from '../data/scenario';

interface CombatResolutionProps {
  beatId: string;
}

/** Secondary volley labels — on-screen rep differs from full squad fire */
const BEAT_OVERLAYS: Partial<Record<string, string>> = {
  'beat-01': '+ 2× M1 Carbine @ 40 hex (off-screen volley)',
  'beat-08': 'Delta: 3× M1 Carbine covering fire',
};

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

const CONTENT_TOP = 128;
const BOTTOM_RESERVE = 168;
const LEFT_COL_W = 900;
const RIGHT_COL_W = 420;
const RIGHT_COL_X = layout.width - layout.safeMargin - RIGHT_COL_W;
const CENTER_X = layout.safeMargin + LEFT_COL_W + (RIGHT_COL_X - layout.safeMargin - LEFT_COL_W) / 2;

interface BeatOutcomePanelProps {
  beat: CombatBeat;
  hit: boolean;
  damage: ReturnType<typeof resolveDamage> | null;
  overlayLabel?: string;
  opacity: number;
  resultOpacity: number;
  damageOpacity: number;
}

const BeatOutcomePanel: React.FC<BeatOutcomePanelProps> = ({
  beat,
  hit,
  damage,
  overlayLabel,
  opacity,
  resultOpacity,
  damageOpacity,
}) => {
  const resultColor =
    beat.beatType === 'morale' ? colors.hudAmber : hit ? colors.hudGreen : colors.hudRed;

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 148,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: colors.bgPanel,
        border: `1px solid ${colors.bgPanelBorder}`,
        borderRadius: layout.panelRadius,
        padding: '12px 16px',
        opacity,
      }}
    >
      {overlayLabel && (
        <div
          style={{
            fontFamily: fonts.data,
            fontSize: 10,
            letterSpacing: '0.08em',
            color: colors.riverFoam,
          }}
        >
          {overlayLabel}
        </div>
      )}

      <div
        style={{
          fontFamily: fonts.historical,
          fontSize: 13,
          fontStyle: 'italic',
          color: colors.textSecondary,
          lineHeight: 1.4,
        }}
      >
        {beat.narration}
      </div>

      {beat.notes.length > 0 && (
        <div
          style={{
            fontFamily: fonts.data,
            fontSize: 12,
            letterSpacing: '0.03em',
            color: resultColor,
            lineHeight: 1.4,
            fontWeight: 700,
            opacity: resultOpacity,
            paddingTop: 6,
            borderTop: `1px solid ${colors.bgPanelBorder}`,
          }}
        >
          {beat.notes[0]}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginTop: 'auto', flexWrap: 'wrap' }}>
        {damage && hit && beat.beatType === 'fire' && (
          <div
            style={{
              display: 'flex',
              gap: 20,
              paddingTop: 8,
              borderTop: `1px solid ${colors.hudRed}`,
              opacity: damageOpacity,
              flex: '1 1 auto',
            }}
          >
            <DamageStat label="Location" value={damage.location} />
            <DamageStat label="PEN" value={String(damage.pen)} accent={colors.hudAmber} />
            <DamageStat label="DC" value={String(damage.dc)} accent={colors.hudAmber} />
            <DamageStat
              label="PD"
              value={String(damage.pd)}
              accent={damage.pd > 10 ? colors.hudRed : colors.hudGreen}
            />
          </div>
        )}

        {beat.notes.length > 1 && (
          <div
            style={{
              fontFamily: fonts.data,
              fontSize: 10,
              color: colors.textMuted,
              letterSpacing: '0.05em',
              opacity: resultOpacity,
              flex: '1 1 200px',
            }}
          >
            {beat.notes[1]}
          </div>
        )}
      </div>
    </div>
  );
};

const DamageStat: React.FC<{ label: string; value: string; accent?: string }> = ({
  label,
  value,
  accent,
}) => (
  <div>
    <div style={{ fontFamily: fonts.data, fontSize: 9, color: colors.textMuted, letterSpacing: '0.12em' }}>
      {label}
    </div>
    <div
      style={{
        fontFamily: fonts.data,
        fontSize: 13,
        fontWeight: 700,
        color: accent ?? colors.textPrimary,
        marginTop: 2,
      }}
    >
      {value}
    </div>
  </div>
);

/** Broadcast layout: map on top-left, outcome strip under map, EAL right, dice in center gap */
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

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 15], [-12, 0], { extrapolateRight: 'clamp' });

  const outcomeOpacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const resultOpacity = interpolate(frame, [fps * 4, fps * 5], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const damageOpacity = interpolate(frame, [fps * 5, fps * 5.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const overlayLabel = BEAT_OVERLAYS[beatId];

  return (
    <AbsoluteFill style={{ background: colors.bgDark, fontFamily: fonts.body }}>
      <div
        style={{
          position: 'absolute',
          top: layout.safeMargin - 8,
          left: layout.safeMargin,
          right: layout.safeMargin,
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

      {/* Left: map on top, shooter + outcome strip underneath */}
      <div
        style={{
          position: 'absolute',
          left: layout.safeMargin,
          top: CONTENT_TOP,
          width: LEFT_COL_W,
          bottom: BOTTOM_RESERVE,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <TacticalMap
          phase={beat.phase}
          activeSquads={shooter?.side === 'kachin' ? [CHAR_TO_SQUAD[beat.shooterId]] : []}
          activeRafts={[beat.targetRaftId]}
          tracerFrom={shooter?.side === 'kachin' ? tracerFrom : undefined}
          tracerTo={shooter?.side === 'kachin' ? beat.targetRaftId : undefined}
          sunkRafts={beat.beatType === 'morale' ? ['raft-1'] : []}
        />

        <div style={{ display: 'flex', gap: 32, alignItems: 'stretch', flex: 1, minHeight: 0 }}>
          {shooter && (
            <div style={{ flexShrink: 0, width: 260 }}>
              <CharacterCard character={shooter} startFrame={8} showWeapon />
            </div>
          )}
          <BeatOutcomePanel
            beat={beat}
            hit={hit}
            damage={damage}
            overlayLabel={overlayLabel}
            opacity={outcomeOpacity}
            resultOpacity={resultOpacity}
            damageOpacity={damageOpacity}
          />
        </div>
      </div>

      {/* Center gap: dice / KV gauge */}
      <div
        style={{
          position: 'absolute',
          left: CENTER_X,
          top: CONTENT_TOP + 140,
          transform: 'translateX(-50%)',
        }}
      >
        {beat.beatType === 'fire' ? (
          <Sequence from={fps * 2} durationInFrames={fps * 8}>
            <DiceRoller targetRoll={beat.scriptedRoll} odds={beat.shot.odds} lockFrame={30} />
          </Sequence>
        ) : (
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

      {/* Right: EAL only — outcome text lives under the map */}
      <div
        style={{
          position: 'absolute',
          right: layout.safeMargin,
          top: CONTENT_TOP,
          width: RIGHT_COL_W,
        }}
      >
        <Sequence from={15} durationInFrames={fps * 10}>
          <EALPanel
            modifiers={beat.shot.modifiers}
            eal={beat.shot.eal}
            odds={beat.shot.odds}
            weaponName={beat.shot.weaponName}
            rangeMeters={beat.shot.rangeMeters}
            shotType={beat.shot.mods.shotType}
            startFrame={0}
            layout="embedded"
          />
        </Sequence>
      </div>

      <PhaseClock phase={beat.phase} impulse={beat.impulse} />
    </AbsoluteFill>
  );
};
