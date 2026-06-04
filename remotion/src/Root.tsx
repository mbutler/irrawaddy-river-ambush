import React from 'react';
import { Composition } from 'remotion';
import { IrrawaddyIntro } from './compositions/IrrawaddyIntro';
import { HistoricalMap, PhoenixPrimer, TacticalSetup } from './compositions/HistoricalMap';
import { ForcesInfographic } from './compositions/ForcesInfographic';
import { EALDemo, OutcomeDashboard } from './compositions/EALDemo';
import {
  Phase1Ambush,
  Phase2ReturnFire,
  BeatThompsonVolley,
  BeatM1919,
  BeatWithdrawal,
  BeatSecondVolley,
  BeatLMGSuppression,
  BeatMoraleCollapse,
} from './compositions/CombatBeats';
import { layout } from './lib/theme';

const FPS = 30;

// Non-blocking font load — delayRender caused timeouts on long batch renders
if (typeof document !== 'undefined' && !document.querySelector('link[data-irrawaddy-fonts]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.dataset.irrawaddyFonts = 'true';
  link.href =
    'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=JetBrains+Mono:wght@400;600;700&family=Source+Sans+3:wght@400;600&family=Source+Serif+4:ital,wght@0,400;1,400&display=swap';
  document.head.appendChild(link);
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Opening sequence ──────────────────────────────────────────── */}
      <Composition
        id="IrrawaddyIntro"
        component={IrrawaddyIntro}
        durationInFrames={FPS * 45}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />

      {/* ── Historical context ────────────────────────────────────────── */}
      <Composition
        id="HistoricalMap"
        component={HistoricalMap}
        durationInFrames={FPS * 360}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />
      <Composition
        id="ForcesInfographic"
        component={ForcesInfographic}
        durationInFrames={FPS * 360}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />

      {/* ── Phoenix Command rules primer ─────────────────────────────── */}
      <Composition
        id="PhoenixPrimer"
        component={PhoenixPrimer}
        durationInFrames={FPS * 360}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />
      <Composition
        id="TacticalSetup"
        component={TacticalSetup}
        durationInFrames={FPS * 360}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />

      {/* ── Combat beats — Phase 1 (Kachin ambush) ───────────────────── */}
      <Composition
        id="Beat-ThompsonVolley"
        component={BeatThompsonVolley}
        durationInFrames={FPS * 12}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />
      <Composition
        id="Phase1Ambush"
        component={Phase1Ambush}
        durationInFrames={FPS * 12}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />
      <Composition
        id="Beat-M1919"
        component={BeatM1919}
        durationInFrames={FPS * 12}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />
      <Composition
        id="Beat-SecondVolley"
        component={BeatSecondVolley}
        durationInFrames={FPS * 12}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />

      {/* ── Combat beats — Phase 2 (Japanese return fire) ────────────── */}
      <Composition
        id="Phase2ReturnFire"
        component={Phase2ReturnFire}
        durationInFrames={FPS * 12}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />
      <Composition
        id="Beat-LMGSuppression"
        component={BeatLMGSuppression}
        durationInFrames={FPS * 12}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />

      {/* ── Combat beats — Late phases ────────────────────────────────── */}
      <Composition
        id="Beat-MoraleCollapse"
        component={BeatMoraleCollapse}
        durationInFrames={FPS * 12}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />
      <Composition
        id="Beat-Withdrawal"
        component={BeatWithdrawal}
        durationInFrames={FPS * 12}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />

      {/* ── EAL tutorial and outcome ─────────────────────────────────── */}
      <Composition
        id="EALDemo"
        component={EALDemo}
        durationInFrames={FPS * 90}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />
      <Composition
        id="OutcomeDashboard"
        component={OutcomeDashboard}
        durationInFrames={FPS * 30}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />
    </>
  );
};
