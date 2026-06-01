import React from 'react';
import { CombatResolution } from '../components/CombatResolution';

export const Phase1Ambush: React.FC = () => <CombatResolution beatId="beat-02" />;
export const Phase2ReturnFire: React.FC = () => <CombatResolution beatId="beat-05" />;
export const BeatThompsonVolley: React.FC = () => <CombatResolution beatId="beat-01" />;
export const BeatM1919: React.FC = () => <CombatResolution beatId="beat-03" />;
export const BeatWithdrawal: React.FC = () => <CombatResolution beatId="beat-08" />;

// Previously orphaned beats — now registered
export const BeatSecondVolley: React.FC = () => <CombatResolution beatId="beat-04" />;
export const BeatLMGSuppression: React.FC = () => <CombatResolution beatId="beat-06" />;
export const BeatMoraleCollapse: React.FC = () => <CombatResolution beatId="beat-07" />;
