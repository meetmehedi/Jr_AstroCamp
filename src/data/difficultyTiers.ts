/**
 * Progressive Difficulty System
 * "Outpost Command: 30 Sols to Science"
 * NASA Space Apps Challenge 2026
 *
 * Design philosophy: Universal accessibility from age 3 to age 80+.
 * Each tier adds scientific depth while preserving emotional engagement.
 *
 * SCIENTIFIC REFERENCES:
 * All numerical constants are sourced from peer-reviewed NASA documentation.
 * References are embedded inline at the point of use.
 */

// ─── TIER DEFINITIONS ────────────────────────────────────────────────────────

/**
 * EXPLORER   → Ages 3–7     (preschool/early childhood)
 * CADET      → Ages 8–12    (middle school)
 * ENGINEER   → Ages 13–17   (high school)
 * SCIENTIST  → Ages 18–35   (undergraduate/early career)
 * COMMANDER  → Ages 36–80+  (professionals, educators, lifelong learners)
 *
 * Key pedagogical principles:
 *  • Explorer    → Fully icon-driven, zero text required, audio narration all
 *  • Cadet       → Short sentences, visual analogies, qualitative gauges
 *  • Engineer    → Real SI units, cause-effect chains, simplified equations
 *  • Scientist   → Full stoichiometry, reference citations, quantitative trade-offs
 *  • Commander   → Integrated systems analysis, mission architecture decisions
 */
export type DifficultyTier =
  | 'EXPLORER'
  | 'CADET'
  | 'ENGINEER'
  | 'SCIENTIST'
  | 'COMMANDER';

export interface TierProfile {
  id: DifficultyTier;
  label: string;
  ageRange: string;
  tagline: string;
  color: string;
  features: TierFeatures;
}

export interface TierFeatures {
  // Display
  showUnits: boolean;          // Show SI units (kW, L, mSv, kPa)
  showEquations: boolean;      // Show stoichiometric equations
  showCitations: boolean;      // Show NASA document citations
  showSankeyDiagram: boolean;  // Show energy flux diagram
  showRadarChart: boolean;     // Show system health radar
  audioNarration: boolean;     // Automatic Web Speech API read-aloud
  comicBubbles: boolean;       // Large comic-style speech bubbles
  // Mechanics
  eventCount: number;          // Number of crisis events per game
  choicesPerEvent: number;     // Branching factor of each dilemma
  resourceCount: number;       // How many resource meters are visible
  ticksPerSol: number;         // Physics simulation fidelity (updates per sol)
  failureGrace: boolean;       // Extra warning before resource hits 0
  chainAutopsy: boolean;       // Show full root-cause chain on failure
  // Content
  scienceGoal: number;         // Research Points target
  descriptionDepth: 'SIMPLE' | 'MODERATE' | 'FULL';
}

export const TIER_PROFILES: Record<DifficultyTier, TierProfile> = {
  EXPLORER: {
    id: 'EXPLORER',
    label: '🚀 Explorer',
    ageRange: 'Ages 3–7',
    tagline: 'Tap & learn — zero reading needed!',
    color: '#38bdf8',   // Bright sky-blue — warm, inviting
    features: {
      showUnits: false,
      showEquations: false,
      showCitations: false,
      showSankeyDiagram: false,
      showRadarChart: false,
      audioNarration: true,
      comicBubbles: true,
      eventCount: 4,
      choicesPerEvent: 2,
      resourceCount: 3,    // Only: ☀️ Power, 💧 Water, 🌱 Food
      ticksPerSol: 1,
      failureGrace: true,
      chainAutopsy: false,
      scienceGoal: 60,
      descriptionDepth: 'SIMPLE',
    },
  },

  CADET: {
    id: 'CADET',
    label: '👨‍🚀 Cadet',
    ageRange: 'Ages 8–12',
    tagline: 'Keep the outpost alive for 30 sols!',
    color: '#43ffa0',   // NASA green
    features: {
      showUnits: false,
      showEquations: false,
      showCitations: false,
      showSankeyDiagram: false,
      showRadarChart: false,
      audioNarration: true,
      comicBubbles: true,
      eventCount: 6,
      choicesPerEvent: 2,
      resourceCount: 5,    // Power, Water, O2, Food, Radiation
      ticksPerSol: 1,
      failureGrace: true,
      chainAutopsy: false,
      scienceGoal: 150,
      descriptionDepth: 'SIMPLE',
    },
  },

  ENGINEER: {
    id: 'ENGINEER',
    label: '🔧 Engineer',
    ageRange: 'Ages 13–17',
    tagline: 'Master coupled systems — every decision has a chain reaction.',
    color: '#ffb454',   // Amber / amber-gold
    features: {
      showUnits: true,
      showEquations: false,
      showCitations: false,
      showSankeyDiagram: false,
      showRadarChart: true,
      audioNarration: false,
      comicBubbles: true,
      eventCount: 8,
      choicesPerEvent: 3,
      resourceCount: 6,    // + Crew Health
      ticksPerSol: 2,
      failureGrace: false,
      chainAutopsy: true,
      scienceGoal: 200,
      descriptionDepth: 'MODERATE',
    },
  },

  SCIENTIST: {
    id: 'SCIENTIST',
    label: '🔬 Scientist',
    ageRange: 'Ages 18–35',
    tagline: 'Full stoichiometry. Real NASA baselines. No hand-holding.',
    color: '#c084fc',   // Purple / science violet
    features: {
      showUnits: true,
      showEquations: true,
      showCitations: true,
      showSankeyDiagram: false,
      showRadarChart: true,
      audioNarration: false,
      comicBubbles: false,
      eventCount: 10,
      choicesPerEvent: 3,
      resourceCount: 7,    // All meters
      ticksPerSol: 4,
      failureGrace: false,
      chainAutopsy: true,
      scienceGoal: 250,
      descriptionDepth: 'FULL',
    },
  },

  COMMANDER: {
    id: 'COMMANDER',
    label: '🎖️ Commander',
    ageRange: 'Ages 36–80+',
    tagline: 'Mission architecture. Integrated systems. You are the Flight Director.',
    color: '#f43f5e',   // Rose-red / authority
    features: {
      showUnits: true,
      showEquations: true,
      showCitations: true,
      showSankeyDiagram: true,
      showRadarChart: true,
      audioNarration: false,
      comicBubbles: false,
      eventCount: 12,
      choicesPerEvent: 3,
      resourceCount: 7,
      ticksPerSol: 6,
      failureGrace: false,
      chainAutopsy: true,
      scienceGoal: 300,
      descriptionDepth: 'FULL',
    },
  },
};
