/**
 * missionScenarioEngine.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Dynamically synthesizes custom flight scenarios, comic dialogues, and
 * educational trade-offs for all 76 real NASA missions.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { MissionEvent } from '../types/game';
import type { DifficultyTier } from '../data/difficultyTiers';
import type { NasaMission } from '../data/nasaMissions';
import { getEventDeck } from '../data/tierEvents';

export function getMissionScenarioDeck(mission: NasaMission, tier: DifficultyTier): MissionEvent[] {
  // Start with the standard balanced physics deck
  const baseDeck = getEventDeck(tier);

  // Customize Event 1 (Mission Insertion / Touchdown) specifically for this mission
  const event1: MissionEvent = {
    ...baseDeck[0],
    id: `${mission.id}-sol-01`,
    sol: 1,
    title: `Sol 1: ${mission.name} — Insertion & System Deployment`,
    weatherNotice: `${mission.destinationName} · ${mission.coordinates} · Gravity: ${mission.gravityG}g · Temp: ${mission.surfaceTempC}`,
    nasaCitation: {
      title: mission.nasaCitation.title,
      docNumber: mission.nasaCitation.docNumber,
      description: `${mission.name} (${mission.nasaProgram}, ${mission.launchYear}): ${mission.tagline}. Primary Instrument: ${mission.primaryInstrument}.`
    },
    comicPanels: [
      {
        speaker: 'CADET_MAYA',
        dialogue: `Commander Dadu, we are on station for ${mission.name}! Telemetry confirms our position at ${mission.targetLocation}. All primary sensors online!`,
        mood: 'excited',
        illustrationType: 'ROVER_SURVEY'
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: `Welcome to the console, Maya. Remember the NASA flight manual protocol: "${mission.operationalGuide}". Our first duty is balancing power and life support before deploying scientific payloads!`,
        mood: 'heroic',
        illustrationType: 'AIRLOCK'
      }
    ],
    options: [
      {
        id: `${mission.id}-opt-deploy-primary`,
        title: `Execute Flight Protocol: ${mission.primaryInstrument.split('+')[0].trim()}`,
        description: `Deploy the primary instrumentation suite: ${mission.primaryInstrument}.`,
        tradeOffText: 'High science output, but draws heavy initial battery power.',
        resourceDelta: { science: +35, power: -15, crewHealth: +5 },
        consequenceNarrative: `The ${mission.primaryInstrument} deploys flawlessly according to NASA protocol, beaming prime telemetry to Houston.`,
        educationalInsight: `Under NASA flight rules, primary mission instruments undergo diagnostic BIT (Built-In Test) sequences before full operational load.`
      },
      {
        id: `${mission.id}-opt-secure-grid`,
        title: `Secure Life Support & Atmospheric Seals`,
        description: `Verify cabin pressure, thermal cooling loops, and life support against ${mission.atmosphere}.`,
        tradeOffText: 'Maximizes crew safety and environmental stability; modest science yield.',
        resourceDelta: { oxygen: +15, power: -10, crewHealth: +12, water: +5 },
        consequenceNarrative: `Atmospheric seals verified. Cabin environment stabilized for ${mission.name} flight crew.`,
        educationalInsight: `Extraterrestrial operations require maintaining strict atmospheric equilibrium against ambient external vacuum and thermal extremes.`
      },
      {
        id: `${mission.id}-opt-telemetry-downlink`,
        title: `Establish Deep Space Network (DSN) High-Gain Downlink`,
        description: `Lock dish antenna onto Earth tracking stations for continuous telemetry and trajectory tracking.`,
        tradeOffText: 'Provides balanced science, power telemetry, and Houston CapCom coordination.',
        resourceDelta: { science: +20, power: +10, water: -5 },
        consequenceNarrative: `High-gain tracking locked. Houston CapCom confirms clear data carrier link across the Deep Space Network.`,
        educationalInsight: `NASA's Deep Space Network (Goldstone, Madrid, Canberra) provides continuous 360-degree interplanetary communications.`
      }
    ]
  };

  // Customize Sol 4 (Mid-mission hazard / operational dilemma)
  const event4: MissionEvent = {
    ...baseDeck[1],
    id: `${mission.id}-sol-04`,
    sol: 4,
    title: `Sol 4: ${mission.name} — Operational Flight Anomaly`,
    weatherNotice: `Radiation monitor alert · Operational protocol: ${mission.operationalGuide.slice(0, 75)}...`,
    comicPanels: [
      {
        speaker: 'CADET_MAYA',
        dialogue: `Dadu, warning light on the console! We have a telemetry deviation during our primary ${mission.name} science run!`,
        mood: 'warning',
        illustrationType: 'SUN_FLARE'
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: `Stay calm, Cadet. Consult the ${mission.nasaProgram} manual. Every space flight hazard has an engineering procedure. Let's make our decision!`,
        mood: 'curious',
        illustrationType: 'AIRLOCK'
      }
    ],
    options: [
      {
        id: `${mission.id}-opt-protocol-manual`,
        title: `Manual Fly-By-Wire Override / Protocol Intervention`,
        description: `Apply the manual procedure: ${mission.operationalGuide.split(';')[1] || mission.operationalGuide}.`,
        tradeOffText: 'Demands crew focus and thruster propellant; restores perfect operational trajectory.',
        resourceDelta: { power: -12, crewHealth: -5, science: +30 },
        consequenceNarrative: `Manual intervention succeeds! The spacecraft recovers nominal flight attitude and telemetry stabilizes.`,
        educationalInsight: `Manual fly-by-wire overrides were proven in Mercury, Gemini, and Apollo when autopilots drifted or encountered unexpected thruster lockouts.`
      },
      {
        id: `${mission.id}-opt-conserve-margins`,
        title: `Enter Safe-Mode & Conserve Resource Margins`,
        description: `Power down non-essential sensors, orient solar arrays for maximum charging, and wait for Houston ground analysis.`,
        tradeOffText: 'Safeguards power and oxygen; pauses scientific measurements.',
        resourceDelta: { power: +25, oxygen: +10, science: -5, crewHealth: +10 },
        consequenceNarrative: `Safe-mode maintains safe margins. The battery capacitors recharge while mission control reviews telemetry logs.`,
        educationalInsight: `NASA spacecraft enter autonomous safe-hold modes to protect sensitive detectors and prevent battery depletion during anomalies.`
      }
    ]
  };

  // Customize Final Sol (Victory & Certification)
  const lastIndex = baseDeck.length - 1;
  const finalBase = baseDeck[lastIndex];
  const eventFinal: MissionEvent = {
    ...finalBase,
    id: `${mission.id}-final`,
    title: `Sol ${finalBase.sol}: ${mission.name} — Mission Objectives Complete!`,
    comicPanels: [
      {
        speaker: 'HOUSTON_CAPCOM',
        dialogue: `${mission.name}, this is Houston. You have fulfilled all primary flight objectives under the ${mission.nasaProgram}! Flight Director confirms mission success!`,
        mood: 'heroic',
        illustrationType: 'MISSION_VICTORY'
      },
      {
        speaker: 'CADET_MAYA',
        dialogue: `We did it, Commander! All scientific data gathered, life support held nominal, and our flight log is in the history books!`,
        mood: 'excited',
        illustrationType: 'MISSION_VICTORY'
      }
    ]
  };

  // Build composite deck
  const composite = [...baseDeck];
  composite[0] = event1;
  if (composite.length > 1) composite[1] = event4;
  composite[lastIndex] = eventFinal;

  return composite;
}
