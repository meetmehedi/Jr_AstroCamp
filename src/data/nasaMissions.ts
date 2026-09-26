/**
 * nasaMissions.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Complete roster of 76 real NASA flight missions across all eras.
 * Grounded in peer-reviewed NASA mission history and flight manuals.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type { PlayableNasaMission, MissionEra } from './allNasaMissions';
export { ALL_76_NASA_MISSIONS } from './allNasaMissions';
import { ALL_76_NASA_MISSIONS, type PlayableNasaMission } from './allNasaMissions';

export type NasaMission = PlayableNasaMission;
export const NASA_MISSIONS: NasaMission[] = ALL_76_NASA_MISSIONS;
