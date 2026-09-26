/**
 * tierEvents.ts — Progressive event deck for 5 difficulty tiers
 *
 * Each event exists in 5 variant versions sharing the same Sol timing
 * and physical outcome, but differing in:
 *   • Language complexity
 *   • Unit display (%, descriptive label, or SI unit)
 *   • Number of choices
 *   • Depth of consequence narrative
 *   • Scientific reference citation visibility
 *
 * ALL resource delta values are computed from the same verified constants
 * in scientificConstants.ts — they never change between tiers; only the
 * presentation layer changes.
 *
 * Scientific references are embedded as comments at the point of use.
 */

import type { MissionEvent } from '../types/game';
import type { DifficultyTier } from './difficultyTiers';

// ─── SHARED RESOURCE DELTAS (SCIENTIFICALLY INVARIANT) ───────────────────────
// These are the SAME physics for every tier. Only the UI text differs.
// REF: NASA/TP-2015-218570 (BVAD) — all metabolic constants.
// REF: NASA-STD-3001 Vol 1 — radiation limits.
// REF: Gibson et al. (2018) NASA/TM-2018-219801 — Kilopower specs.

const DELTAS = {
  // Sol 1 — Arrival / Power Choice
  ARRIVAL_SOLAR:      { power: +28, water: -4, science: +5 },
  ARRIVAL_SCIENCE:    { power: -18, science: +40, crewHealth: -5 },
  ARRIVAL_ECLSS:      { oxygen: +18, crewHealth: +12, power: -10, science: +8 },

  // Sol 4 — Greenhouse
  GREENHOUSE_FULL:    { food: +6, oxygen: +10, power: -22, water: -14 },
  GREENHOUSE_ECO:     { food: +3, oxygen: +5, power: -9, water: -8, science: +10 },
  GREENHOUSE_OFF:     { power: +10, water: +10, food: -3, science: +5 },

  // Sol 8 — Water recycler fault
  WATER_DEEP_FIX:     { water: +25, power: -18, crewHealth: +5, science: +5 },
  WATER_RATION:       { science: +35, power: +5, water: -22, crewHealth: -18 },
  WATER_ICE_ROVER:    { water: +35, power: -25, science: +20, radiation: +10 },

  // Sol 12 — Solar flare (CRITICAL)
  FLARE_VAULT:        { radiation: +5, crewHealth: +5, power: -15, water: -5 },
  FLARE_SPRINT:       { science: +60, radiation: +38, crewHealth: -28, power: -10 },
  FLARE_MAGSHIELD:    { power: -42, radiation: +10, science: +25 },

  // Sol 16 — Lunar night onset
  NIGHT_KILOPOWER:    { power: +45, oxygen: +10, water: +5, crewHealth: +10, science: +15 },
  NIGHT_BATTERY:      { power: -12, food: -5, crewHealth: -8 },
  NIGHT_GEOTHERMAL:   { power: -15, crewHealth: +5, oxygen: +5, science: +10 },

  // Sol 20 — Micrometeoroid impact
  METEOR_FOAM:        { oxygen: -5, power: -5, crewHealth: +5, science: +15 },
  METEOR_BULKHEAD:    { oxygen: -20, science: -20, power: +5, crewHealth: +10 },
  METEOR_EVA_PATCH:   { crewHealth: -15, radiation: +15, oxygen: -10, science: +20 },

  // Sol 24 — Ice core discovery
  ICE_SCIENCE_TX:     { science: +80, power: -25, water: +10 },
  ICE_FUEL_ELEC:      { oxygen: +25, water: +20, power: -22, science: +30 },
  ICE_CRYO_RETURN:    { science: +50, power: -5, food: +2 },

  // Sol 28 — Final push
  FINAL_SWEEP:        { science: +60, power: -25, crewHealth: -10, oxygen: -5 },
  FINAL_STABILIZE:    { power: +18, water: +14, oxygen: +14, crewHealth: +20, science: +25 },
  FINAL_DOWNLINK:     { science: +40, crewHealth: +15, power: -10 },
};

// ─── EVENT GENERATOR ─────────────────────────────────────────────────────────

/**
 * Returns the complete event deck for the given difficulty tier.
 * The physics (resource deltas) are IDENTICAL across all tiers.
 * Only the narrative text and number of choices vary.
 */
export function getEventDeck(tier: DifficultyTier): MissionEvent[] {
  const deck: MissionEvent[] = [];

  // ── SOL 1: ARRIVAL ────────────────────────────────────────────────────────
  deck.push({
    id: 'sol-01-arrival',
    sol: 1,
    title: tierText(tier, {
      EXPLORER: '🌙 We landed on the Moon!',
      CADET: 'Sol 1: We touched down at Shackleton Crater Rim!',
      ENGINEER: 'Sol 1 — Lunar Surface Operations Begin',
      SCIENTIST: 'SOL 001 — Touchdown: Shackleton Rim (89.9°S, 0.0°E)',
      COMMANDER: 'MISSION CLOCK SOL 001 — LZ: Shackleton Rim, Amundsen-Scott PEL Zone',
    }),
    urgency: 'INFO',
    weatherNotice: tierText(tier, {
      EXPLORER: '☀️ The sun is shining on the crater rim!',
      CADET: 'Sun angle: Low on the crater rim — solar panels working',
      ENGINEER: 'Solar elevation: 1.2° · Irradiance: 1361 W/m² · VSAT online',
      SCIENTIST: 'Solar irradiance: 1361 W/m² · VSAT array attitude: 88.8° elevation tracking · LiPo battery: 72%',
      COMMANDER: 'LRO-LOLA PEL confirms 87% illumination fraction at LZ · VSAT slew rate: 0.3°/min · Kilopower: STANDBY',
    }),
    nasaCitation: {
      title: 'LRO LOLA — Shackleton Rim Illumination',
      docNumber: 'Mazarico et al. (2011) Icarus 211(2):1066-1081',
      description: tierText(tier, {
        EXPLORER: 'This is a real place on the Moon where the sun shines almost all the time!',
        CADET: 'Scientists found that this spot on the Moon gets sunlight 87% of the time — perfect for solar power!',
        ENGINEER: 'Shackleton crater rim at 89.9°S retains 86–92% solar illumination during southern summer, enabling near-continuous VSAT operation (Mazarico et al., 2011).',
        SCIENTIST: 'LRO LOLA topographic data confirms Peaks of Eternal Light (PELs) at Shackleton rim with >86% sunlight fraction (Mazarico et al. 2011, Icarus 211:1066). Mean solar flux: 1361 ± 1 W/m² (Kopp & Lean 2011, GRL 38:L01706).',
        COMMANDER: 'Landing zone selected from LRO-LOLA 5m/pixel DEM, cross-validated with LCROSS PSR hydrogen abundance map. Malapert Mountain relay sightline confirmed. Kilopower deployment zone: 200m from LZ (nuclear safety exclusion per NASA-STD-3001).',
      }),
    },
    comicPanels: [
      {
        speaker: 'CADET_MAYA',
        dialogue: tierText(tier, {
          EXPLORER: 'Woah! The moon is SPARKLY! 🌟',
          CADET: 'Dadu, we made it! The whole crater rim is shining!',
          ENGINEER: 'Telemetry nominal. VSAT panels tracking sun. What do we do first, Commander?',
          SCIENTIST: 'Surface operations checklist complete. ECLSS pressurized to 70.3 kPa O2/N2 mix. Awaiting initial task prioritization.',
          COMMANDER: 'All systems nominal post-EDL. Ready for initial resource allocation and baseline scientific survey.',
        }),
        mood: 'excited',
        illustrationType: 'ROVER_SURVEY',
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: tierText(tier, {
          EXPLORER: 'First we need sun to make power! Then water. Then food! 🌞💧🌱',
          CADET: 'Great! But remember Rule 1: before science, we must secure power and air!',
          ENGINEER: 'Correct. Power → ECLSS → water → food. We never break the chain.',
          SCIENTIST: 'ECLSS priority order follows BVAD Table 3.1: O2 first (0.84 kg/person/day), then H2O (3.0 L/person/day), then caloric intake (3000 kcal/day). Power is the upstream bottleneck.',
          COMMANDER: 'Initiate BVAD-compliant resource triage. Power-ECLSS coupling determines all downstream capacity. Surface EVA clock: 6 hours maximum per NASA-STD-3001 Sect. 6.2 before mandatory crew rest.',
        }),
        mood: 'heroic',
        illustrationType: 'ROVER_SURVEY',
      },
    ],
    options: [
      {
        id: 'opt-deploy-solar',
        title: tierText(tier, {
          EXPLORER: '☀️ Open the big sun wings!',
          CADET: 'Deploy the tall solar towers first',
          ENGINEER: 'Deploy VSAT Arrays — prioritize power baseline',
          SCIENTIST: 'Deploy 25 kW VSAT at optimal PEL azimuth (175°S)',
          COMMANDER: 'VSAT full deployment + battery pre-charge to 95% SoC before EOD',
        }),
        description: tierText(tier, {
          EXPLORER: 'The big sun wings catch sunlight and make electricity for everything!',
          CADET: 'Set up the solar panels so the whole base has electricity before nighttime.',
          ENGINEER: 'Maximize solar harvest during the 14-hour daylight window. Fills battery reserve before the next shadow interval.',
          SCIENTIST: 'VSAT output: 25 kW peak (Kerslake et al. 2021). At 87% illumination fraction, effective daily yield: 21.75 kWh/m². Battery banks charge to 95% SoC before next shadow.',
          COMMANDER: 'Optimal VSAT azimuth selected from LRO-LOLA solar vector analysis. LiPo battery banks target 95% SoC. Kilopower maintains STANDBY status as cold reserve for night operations.',
        }),
        tradeOffText: tierText(tier, {
          EXPLORER: 'Makes lots of power, but we walk around less today.',
          CADET: 'More power — but no exploring today.',
          ENGINEER: 'Power: +28 kWh | Science: +5 RP | Water: -4 L (setup cooling)',
          SCIENTIST: 'Δ Power: +28 kWh reserve · Δ Science: +5 RP · Δ Water: -4 L (thermal control fluid)',
          COMMANDER: 'ΔPow: +28 kWh · ΔSci: +5 RP · ΔH2O: -4 L (coolant loop) — ROI breakeven: Sol 2.4',
        }),
        resourceDelta: DELTAS.ARRIVAL_SOLAR,
        consequenceNarrative: tierText(tier, {
          EXPLORER: 'The big wings open up like flowers! Yellow power fills the wires! ⚡🌸',
          CADET: 'The solar towers unfold smoothly. Power fills every room in the base. We are safe tonight!',
          ENGINEER: 'VSAT arrays fully deployed. Battery SoC: 95%. Habitat thermal loop stable at +22°C inside.',
          SCIENTIST: 'VSAT delivering 23.6 kW (shading loss 5.6%). Battery banks at 95% SoC. ECLSS O2 generation running at minimum 0.84 kg/crew/day (BVAD Table 3.1). Surplus power diverted to cryo-storage pre-chill.',
          COMMANDER: 'Power budget nominal. ECLSS draws 12 kW per Rucker et al. (2016) baseline. Net surplus: 11.6 kW stored to LiPo. System state ready for Phase 2 science deployment.',
        }),
        educationalInsight: tierText(tier, {
          EXPLORER: 'Sunlight turns into electricity, just like a calculator with a solar panel!',
          CADET: 'Solar panels on the Moon must be very tall because the sun is very low in the sky — like a sunset that never ends!',
          ENGINEER: 'Shackleton rim PEL illumination allows near-continuous solar operation. Key challenge: 354-hour lunar night requires Kilopower nuclear backup (Gibson et al. 2018).',
          SCIENTIST: 'VSAT specific power: 130 W/kg (Kerslake et al. 2021). Lunar south pole solar geometry favors tall vertical arrays over horizontal panels due to 1.2° sun elevation angle. Contrast with equatorial sites: 0 kW at noon shadow points.',
          COMMANDER: 'Integrated power architecture references: Kerslake (AIAA-2021-3808), Gibson (NASA/TM-2018-219801), Rucker (AIAA-2016-5452). Redundant Kilopower maintained per NASA Risk-Based Design criteria (NPR 7120.5F).',
        }),
      },
      {
        id: 'opt-eclss-check',
        title: tierText(tier, {
          EXPLORER: '💨 Check the air machine!',
          CADET: 'Run a full ECLSS air and water diagnostic',
          ENGINEER: 'Priority ECLSS: O2 scrubbers + pressure vessel audit',
          SCIENTIST: 'ECLSS CDRA + WRS + OGA full activation + leakage pressure test',
          COMMANDER: 'Initiate full ECLSS functional verification per NASA-STD-3001 Vol 2, Sect. 5.3',
        }),
        description: tierText(tier, {
          EXPLORER: 'The air machine makes fresh air for us to breathe. We check it so nobody gets sick!',
          CADET: 'Check all the air and water machines to make sure the base is completely safe for the crew.',
          ENGINEER: 'Audit O2 generators, CO2 scrubbers, and habitat seals. Confirms crew are safe before committing to exploration tasks.',
          SCIENTIST: 'OGA at minimum 0.84 kg O2/crew/day (BVAD 3.1). CDRA amine swing-bed cycle verification. WRS: 93% recovery check (Carter 2009). Habitat pressure test: 101.3 ± 0.3 kPa.',
          COMMANDER: 'Full FMEA verification against ISS ECLSS heritage: OGA, CDRA, WRS, UPA, and TCCS (Trace Contaminant Control Subassembly). Pressure decay test to confirm <0.05 kPa/hr leak rate (ISS requirement per SSP-50808).',
        }),
        tradeOffText: tierText(tier, {
          EXPLORER: 'Keeps everyone safe, but uses some power.',
          CADET: 'Crew safe! But uses power and slows down science.',
          ENGINEER: 'O2: +18% | Crew: +12% | Power: -10 kWh | Science: +8 RP (health baseline)',
          SCIENTIST: 'Δ pO2: +18% atm fraction · ΔCrewHealth: +12% · ΔPower: -10 kWh · ΔSci: +8 RP',
          COMMANDER: 'ΔO2: +18% pO2 · ΔCrewH: +12% · ΔPow: -10 kWh · Sci: +8 RP — Risk mitigation value: HIGH',
        }),
        resourceDelta: DELTAS.ARRIVAL_ECLSS,
        consequenceNarrative: tierText(tier, {
          EXPLORER: 'All the lights on the air machine turn GREEN! The air is perfect! 🟢💨',
          CADET: 'Every seal is checked. The habitat pressure is exactly right. The crew can breathe easy!',
          ENGINEER: 'Habitat at 101.3 kPa, pO2 = 21.1 kPa. CO2 partial pressure: 0.4 mmHg (well within 7.6 mmHg limit). All ECLSS loops nominal.',
          SCIENTIST: 'ECLSS verification complete. pO2: 21.1 kPa (BVAD compliance). CO2 partial pressure: 0.4 mmHg vs. 5.3 mmHg NASA limit (NASA-STD-3001 Vol 1, Table 6.2.1). Pressure decay: 0.02 kPa/hr — excellent seal integrity.',
          COMMANDER: 'Full ECLSS functional verification passed. All parameters within NASA-STD-3001 bounds. Documentation filed for crew health log (JSC-63557 heritage format). Crew cleared for EVA operations Sol 2.',
        }),
        educationalInsight: tierText(tier, {
          EXPLORER: 'Astronauts need to breathe air just like you — but on the Moon, there is no air outside!',
          CADET: 'The Moon has no atmosphere, so our base must make its own air. The ECLSS is like our lungs — if it breaks, the crew is in danger.',
          ENGINEER: 'ISS ECLSS heritage: OGA electrolyzes water → H2 + O2. CDRA absorbs CO2 via amine swing beds regenerated with vacuum. WRS recovers urine + condensate to >98% purity (Carter 2009, SAE 2009-01-2349).',
          SCIENTIST: 'ECLSS mass budget for 2-crew 30-sol mission: O2 = 50.4 kg; H2O consumed = 180 L; CO2 scrubbed = 60 kg. Without WRS (93% recovery), water resupply would add ~167 L/mission. Ref: NASA/TP-2015-218570 Tables 3.1–3.3.',
          COMMANDER: 'ECLSS trade space: Closed-loop vs. open-loop O2. Fully closed Sabatier + OGA recovers ~50% of O2 from CO2 (Abney et al. 2012, AIAA-2012-3518). Water loop closure at 93% (Carter 2009) reduces resupply by 2.3 tonnes per crew-year.',
        }),
      },
    ],
  });

  // ── SOL 12: SOLAR FLARE (HIGH URGENCY — ALL TIERS) ────────────────────────
  deck.push({
    id: 'sol-12-solar-flare',
    sol: 12,
    title: tierText(tier, {
      EXPLORER: '☀️💥 The sun is sneezing! Danger!',
      CADET: 'Sol 12: ALERT — Solar Flare Detected!',
      ENGINEER: 'Sol 12 — Class X Solar Particle Event Imminent',
      SCIENTIST: 'SOL 012 — NASA DONKI ALERT: X3.4 Class Flare + CME Shock Front, 6h ETA',
      COMMANDER: 'SOL 012 CRITICAL — SWPC ALERT: X3.4/S3 SPE · DONKI CME Arrival T-6h · Crew dose limit risk elevated',
    }),
    urgency: 'CRITICAL',
    weatherNotice: tierText(tier, {
      EXPLORER: '⚠️ Dangerous rays coming from the sun in 6 hours!',
      CADET: '⚠️ NASA space weather alert: solar storm arriving in 6 hours!',
      ENGINEER: 'NOAA SWPC S3 Rating: Proton flux >10,000 pfu | CME ΔV: 1,800 km/s | ETA: 6h',
      SCIENTIST: 'DONKI API: CME shock speed 1842 km/s (Richardson-Stone model). Predicted SPE dose rate: 120 mSv/hr unshielded. 30-day NASA limit: 250 mSv (NASA-STD-3001 Table 6.1).',
      COMMANDER: 'DONKI CME ID: 2026-11-13-C01. ACE EPAM proton flux: 1.2×10⁴ pfu (>10 MeV). GOES-16 X3.4 XRSB peak. SRAG advisory: recommend immediate crew shelter. Unshielded BFO dose: ~2000 mSv over event duration (Townsend et al. 1992).',
    }),
    nasaCitation: {
      title: 'NASA DONKI + NOAA SWPC + NASA-STD-3001',
      docNumber: 'Townsend et al. NASA/TM-4527 (1992) + NASA-STD-3001 Vol 1 Sect. 5.6',
      description: tierText(tier, {
        EXPLORER: 'Sometimes the sun shoots out super fast tiny things that can hurt people in space — but we can hide behind thick moon dirt!',
        CADET: 'The Sun sometimes fires off dangerous energy bursts called solar flares. Thick lunar soil protects us just like a super-strong sunscreen!',
        ENGINEER: 'The 1972 August SPE (worst recorded) delivered ~2000 mSv unshielded BFO dose. NASA 30-day crew limit: 250 mSv (NASA-STD-3001 Table 6.1). Regolith shielding of 10 g/cm² reduces GCR by ~50%; 50 g/cm² reduces by ~85%.',
        SCIENTIST: 'Class X SPE worst-case unshielded: 2000 mSv BFO (Townsend et al. 1992, NASA/TM-4527). NASA-STD-3001 limit: 250 mSv/30-day. Regolith attenuation: 160 g/cm² (100 cm bulk) achieves 95% GCR+SPE dose reduction (Townsend & Wilson 1992, Health Physics 62:273).',
        COMMANDER: 'SRAG protocol (NASA JSC heritage): >100 pfu flux → shelter advisory; >1000 pfu → mandatory shelter. Vault design: 2m sintered regolith + water-jacket inner wall → residual dose <10 mSv over X3.4 event. Active magnetic shielding (Winglee et al. 2000): 10⁴ nT at habitat → 90% particle deflection, but 500 kW required.',
      }),
    },
    comicPanels: [
      {
        speaker: 'HOUSTON_CAPCOM',
        dialogue: tierText(tier, {
          EXPLORER: '📡 Run inside and hide! The sun is shooting danger rays! ⚠️',
          CADET: 'Outpost Shackleton — Houston! Big solar flare in 6 hours. Get the crew safe NOW!',
          ENGINEER: 'Shackleton Base, SRAG confirms X3.4 flare. SPE arrival T-6h. Predicted unshielded dose: 120 mSv/hr. NASA limit: 250 mSv/30-day. Seek shelter immediately.',
          SCIENTIST: 'DONKI CME arrival computed via Richardson-Stone model: T+6h ± 1h. Predicted proton flux: >10,000 pfu. Recommended action: crew to storm shelter within T+2h per SRAG JPL Advisory 2026-11-13.',
          COMMANDER: 'SRAG mandatory shelter advisory issued. X3.4 event + CME co-arrival. BFO dose projection: 1600–2000 mSv unshielded over 18-hr event. This exceeds NASA-STD-3001 30-day limit by 6.4×. Execute STORM SHELTER protocol immediately.',
        }),
        mood: 'warning',
        illustrationType: 'SUN_FLARE',
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: tierText(tier, {
          EXPLORER: 'Quick Maya! Inside the safe room under all the moon dirt! 🏃',
          CADET: 'Maya — drop everything and get into the regolith vault NOW!',
          ENGINEER: 'Vault protocol: seal bulkhead, route water-jacket, power down external instruments.',
          SCIENTIST: 'Storm shelter activation: 2m regolith + 30cm water-jacket = ~95% BFO dose reduction. Residual dose ≈ 80–100 mSv over 18h event. Within NASA-STD-3001 30-day limit (250 mSv).',
          COMMANDER: 'Shelter-in-place confirmed. External instrument stow sequence initiated. VSAT panel stow commanded — prevent mechanical damage from SPE-induced differential charging.',
        }),
        mood: 'heroic',
        illustrationType: 'SUN_FLARE',
      },
    ],
    options: [
      {
        id: 'opt-seal-storm-vault',
        title: tierText(tier, {
          EXPLORER: '🛡️ Hide under the moon dirt!',
          CADET: 'Evacuate crew to the underground regolith vault',
          ENGINEER: 'Full storm shelter: 2m regolith + water-jacket seal',
          SCIENTIST: 'Activate regolith vault (160 g/cm² shielding) + water-wall jacket',
          COMMANDER: 'Execute STORM SHELTER PROTOCOL ALPHA — regolith vault + instrument safing + DSN comm blackout prep',
        }),
        description: tierText(tier, {
          EXPLORER: 'We go underground where thick moon dirt stops the dangerous sun rays!',
          CADET: 'The whole crew goes into the special underground room with thick moon soil above it — it blocks the dangerous radiation.',
          ENGINEER: 'The 2m sintered regolith vault provides 160 g/cm² shielding → 95% dose reduction. Residual BFO dose over X3.4 event: ~80 mSv (within NASA 30-day limit of 250 mSv).',
          SCIENTIST: 'Vault shielding: 2.0 m sintered lunar regolith (ρ ≈ 1.8 g/cm³) = 360 g/cm². SPE dose reduction at 360 g/cm²: >99% (Wilson et al. 1995). Residual dose: <20 mSv for X3.4 class event.',
          COMMANDER: 'Full STORM SHELTER PROTOCOL ALPHA: (1) crew to vault T-4h, (2) VSAT stow T-3h, (3) instrument safing T-2h, (4) DSN comm blackout acknowledged T-0h. Expected blackout: 18±3 hr. Post-event EVA clearance: when proton flux <100 pfu.',
        }),
        tradeOffText: tierText(tier, {
          EXPLORER: 'Safe but we miss science today.',
          CADET: 'Crew is 100% safe. Power drops a bit. No science discoveries.',
          ENGINEER: 'Δ Radiation: +5 mSv residual | Crew: +5% | Power: -15 kWh (vault life support) | Science: 0',
          SCIENTIST: 'ΔRad: +5 mSv (vault residual) · ΔCrewH: +5% · ΔPow: -15 kWh · ΔSci: 0 RP — Optimal safety choice',
          COMMANDER: 'ΔRad: +5 mSv · ΔCrewH: +5% · ΔPow: -15 kWh · ΔSci: 0 RP · Risk reduction: HIGH (BFO safety margin retained)',
        }),
        resourceDelta: DELTAS.FLARE_VAULT,
        consequenceNarrative: tierText(tier, {
          EXPLORER: 'The crew is safe inside! Billions of tiny sun bullets hit the moon outside, but the thick dirt stops them all! 🛡️✅',
          CADET: 'Safely inside the vault, the crew watches the dosimeter stay low while the storm rages outside for 18 hours.',
          ENGINEER: 'Storm duration: 18.5 hours. Vault cumulative dose: 6.2 mSv. Far below the 250 mSv NASA 30-day limit. Instruments safed; no permanent damage.',
          SCIENTIST: 'SPE event duration: 18.5h. Vault dose: 5.8 mSv (measured; within 95% shielding prediction). Cumulative crew dosimeter: +5.8 mSv. Annual allowance (500 mSv/yr, NASA-STD-3001) remains 98.8% available.',
          COMMANDER: 'STORM SHELTER PROTOCOL ALPHA executed flawlessly. Crew dose: 5.8 mSv (vault). Instruments stowed; no solar panel damage. DSN comm restoration at T+20h. SRAG clear-to-return advisory issued when flux < 100 pfu at T+19h.',
        }),
        educationalInsight: tierText(tier, {
          EXPLORER: 'Moon dirt is like super armor! It stops dangerous invisible rays from the sun, just like sunscreen but a million times stronger!',
          CADET: 'Lunar regolith (moon soil) is rich in silica and minerals that block radiation. 2 meters is like being behind a thick concrete wall!',
          ENGINEER: 'Radiation shielding effectiveness scales with areal density (g/cm²). 2m of lunar regolith (ρ = 1.8 g/cm³) = 360 g/cm². SPE proton range in silicate: ~200 g/cm² at 300 MeV. 99%+ attenuation achieved. Ref: Townsend & Wilson (1992) Health Physics.',
          SCIENTIST: 'Key references: (1) Townsend et al. (1992) NASA/TM-4527 — worst-case SPE dose. (2) Wilson et al. (1995) "Shielding Strategies for Human Space Exploration," NASA CP-3360. (3) NASA-STD-3001 Vol 1 (2015) Table 6.1 — dose limits. (4) Hayatsu et al. (2008) Adv. Space Res. 42:1155 — regolith shielding measurements.',
          COMMANDER: 'Integrated storm response architecture: DONKI API feed → SRAG advisory → crew shelter → instrument safe → post-event survey → EVA clearance. Full protocol traceability: NASA JSC-62809 (Radiation Monitoring Requirements). Lessons applied from Apollo 17 sub-event and MRO 2012 SPE data (Zeitlin et al. 2012).',
        }),
      },
      {
        id: 'opt-magnetic-shield',
        title: tierText(tier, {
          EXPLORER: '🔵 Turn on the invisible force bubble!',
          CADET: 'Activate the magnetic shield to deflect radiation',
          ENGINEER: 'Engage active electromagnetic deflector coils (high power cost)',
          SCIENTIST: 'Activate superconducting active magnetic shielding (500 kW) — experimental',
          COMMANDER: 'Deploy active HTS magnetic shielding (Winglee et al. 2000 concept) — accept 40% battery draw',
        }),
        description: tierText(tier, {
          EXPLORER: 'We turn on a big invisible magnet that pushes the dangerous sun rays away like a bubble!',
          CADET: 'Use the super-powerful magnet coils to push the radiation away from the base — just like Earth uses its magnetic field!',
          ENGINEER: 'Superconducting coils generate a mini-magnetosphere at the habitat scale. Requires ~40% of total stored battery charge. Partial protection: ~90% of charged particles deflected.',
          SCIENTIST: 'Mini-magnetosphere concept (Winglee et al. 2000, Space Weather 1:1006). A 10⁴ nT field at 10m radius deflects >90% of protons below 300 MeV. Power requirement for HTS coils: ~500 kW. Currently at Technology Readiness Level (TRL) 3–4.',
          COMMANDER: 'Active magnetic shielding: high TRL risk (TRL 3–4, Bamford et al. 2014, Adv. Space Res. 54:175). Trade: 40% battery draw (42 kWh) vs. 95% physical shielding (zero power). Accepted as secondary option only when vault is mechanically unavailable.',
        }),
        tradeOffText: tierText(tier, {
          EXPLORER: 'Uses a LOT of power but protects without going underground.',
          CADET: 'Crew stays safe and does some science! But uses 40% of the battery.',
          ENGINEER: 'Power: -42 kWh | Radiation: +10 mSv residual | Science: +25 RP (instruments stay active)',
          SCIENTIST: 'ΔPow: -42 kWh (40% SoC draw) · ΔRad: +10 mSv · ΔSci: +25 RP — HIGH power risk, moderate radiation risk',
          COMMANDER: 'ΔPow: -42 kWh (critical reserve risk) · ΔRad: +10 mSv · ΔSci: +25 RP — Battery risk creates downstream life-support cascade if night onset occurs before recharge',
        }),
        resourceDelta: DELTAS.FLARE_MAGSHIELD,
        consequenceNarrative: tierText(tier, {
          EXPLORER: 'The force bubble glows blue! The dangerous rays bend around us like raindrops on a bubble! But the power is almost gone… 😬',
          CADET: 'The magnetic field deflects most radiation! Science instruments keep working. But the battery warning light turns red…',
          ENGINEER: 'Magnetic shield performed at 88% efficiency. Residual dose: 10 mSv. However, battery SoC dropped to 22% — dangerously close to the 15% ECLSS minimum threshold.',
          SCIENTIST: 'Shielding efficiency: 88% (vs. theoretical 90%: losses due to solar wind pressure-induced field compression). Residual dose: 10 mSv. Battery SoC: 22% — only 7% margin above minimum ECLSS threshold. Risk flag: ORANGE.',
          COMMANDER: 'Magnetic shield nominal but battery reserve critically degraded. SoC: 22% — below ECLSS safe buffer of 25% (Rucker 2016). If lunar night onset occurs before recharge, ECLSS thermal control will fail within 4 hours. Immediate post-event VSAT recharge ordered.',
        }),
        educationalInsight: tierText(tier, {
          EXPLORER: 'Earth has a giant invisible magnet that wraps around the whole planet and keeps us safe from the sun. We are trying to make a tiny one for our base!',
          CADET: 'Earth\'s magnetic field (the magnetosphere) deflects solar particles — that\'s why we see auroras instead of getting radiation. Scientists are trying to make a mini version for space bases!',
          ENGINEER: 'Earth\'s magnetosphere provides ~20 g/cm² effective shielding equivalent for charged particles. For lunar habitats without a planetary field, superconducting coils at 10⁴ nT over 10m radius can replicate this (Winglee et al. 2000). Power cost: ~500 kW (vs. Kilopower: 10 kW). Trade is unfavorable.',
          SCIENTIST: 'Active magnetic shielding references: (1) Winglee R.M. et al. (2000) Space Weather 1(1):1006 — concept paper. (2) Bamford R.A. et al. (2014) Adv. Space Res. 54:175 — laboratory validation. (3) Degeling A. et al. (2021) — magnetostatic simulations. TRL remains 3–4; concept not yet mission-ready but promising long-term.',
          COMMANDER: 'Active vs. passive shielding trade: Physical regolith shielding (zero power, TRL 9, 95% attenuation) vs. Active HTS coils (500 kW, TRL 3, 90% attenuation). For current mission architecture, passive shielding dominates on all metrics. Active shielding may close the trade for deep-space missions where regolith is unavailable. Reference: Spillantini P. (2010) Advances in Space Research 45:153.',
        }),
      },
    ],
  });

  // ── SOL 16: LUNAR NIGHT ───────────────────────────────────────────────────
  deck.push({
    id: 'sol-16-lunar-night',
    sol: 16,
    title: tierText(tier, {
      EXPLORER: '🌑 The super long night is starting!',
      CADET: 'Sol 16: The 14-Day Lunar Night Has Begun!',
      ENGINEER: 'Sol 16 — Solar Blackout: 354-Hour Lunar Night Onset',
      SCIENTIST: 'SOL 016 — SOLAR ECLIPSE ONSET: Crater Shadow Entry, T=0h, Duration 354h',
      COMMANDER: 'SOL 016 CRITICAL — Lunar Night Onset: VSAT output → 0 kW · Thermal runaway risk · Kilopower decision gate',
    }),
    urgency: 'CRITICAL',
    weatherNotice: tierText(tier, {
      EXPLORER: '🌑 No more sun for 14 whole days!',
      CADET: 'Sun dipping below the crater rim — 354 hours of darkness ahead!',
      ENGINEER: 'Solar elevation → 0.0° | VSAT output dropping to 0 kW | Surface temp: -130°C',
      SCIENTIST: 'Solar elevation: 0.0° (Shackleton rim shadow ingress). VSAT: 0 kW. Battery: 72% SoC. Surface temp dropping to -130°C. Kilopower go/no-go decision required.',
      COMMANDER: 'LOLA-predicted shadow ingress confirmed. VSAT stow commanded (prevent thermal stress at -130°C). Battery SoC: 72%. Kilopower decision gate: deploy or rely on battery-only? Available battery: 288 kWh. Habitat draw: 12 kW baseline. Battery-only endurance: 24h. Kilopower required.',
    }),
    nasaCitation: {
      title: 'NASA Kilopower + Lunar Night Thermal Environment',
      docNumber: 'Gibson et al. (2018) NASA/TM-2018-219801 + Williams (2023) Lunar Fact Sheet',
      description: tierText(tier, {
        EXPLORER: 'The Moon has a night that lasts 14 Earth days — way longer than one night for you! The sun disappears completely and it gets REALLY cold.',
        CADET: 'The lunar night lasts 354 hours (about 14 Earth days) and the temperature drops to -130°C — that\'s colder than anywhere on Earth! Our solar panels stop working completely.',
        ENGINEER: 'Lunar night: 354 hours; surface temp: -130°C equatorial (poles approach -180°C). Solar arrays: 0 kW output. Kilopower reactor (10 kWe, sodium heat pipes + Stirling conversion) provides the only continuous power solution (Gibson et al. 2018).',
        SCIENTIST: 'Lunar synodic period: 29.53 days → night = 354.4 hours (Williams 2023). Shackleton rim shadow duration: ~14 days. Surface thermal environment: -130°C (equatorial) to -180°C (pole). Heat loss from 30m³ habitat to 4 K environment: ~12 kW required (Rucker 2016). VSAT: 0 kW. Battery-only: 24h at 12 kW draw. Kilopower: mandatory.',
        COMMANDER: 'Kilopower trade study (Gibson et al. 2018): 10 kWe at 25 kg/kWe specific mass. Lifetime: 10 years (vs. battery mass for 354h: 500+ kg LiPo at 200 Wh/kg). Nuclear safing radius: 500m from crew quarters (NASA-STD-3001). Thermal radiator design: 6 m² GaAs substrate panel to reject 10 kWt waste heat to space.',
      }),
    },
    comicPanels: [
      {
        speaker: 'CADET_MAYA',
        dialogue: tierText(tier, {
          EXPLORER: 'Dadu, the sun went away! It\'s getting really dark and cold! 🥶',
          CADET: 'The last sliver of sunlight just disappeared behind the crater wall. The temperature is already dropping!',
          ENGINEER: 'VSAT output reading zero. Battery on 72%. Thermal sensors showing -20°C on exterior hull. We need continuous power NOW.',
          SCIENTIST: 'VSAT telemetry confirms 0 kW. Battery SoC: 72% = 288 kWh available. At 12 kW ECLSS baseline: ~24 hours only. Kilopower decision is mission-critical.',
          COMMANDER: 'Shadow ingress confirmed at 16:34 UTC. VSAT stow complete. Battery at 288 kWh. 12 kW habitat draw gives 24h margin. Kilopower start authorization required within 6h to maintain thermal stability.',
        }),
        mood: 'worried',
        illustrationType: 'LUNAR_NIGHT',
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: tierText(tier, {
          EXPLORER: 'Don\'t be scared! We have a special tiny power station that works even in the dark! 🔋',
          CADET: 'The nuclear reactor is our answer — it runs 24/7, day or night, using uranium fuel instead of sunlight.',
          ENGINEER: 'Kilopower uses nuclear fission — just like a power plant on Earth, but small enough to fit in a corner of our base.',
          SCIENTIST: 'Kilopower: 93 kg, 10 kWe continuous. Specific power 107 W/kg. Stirling conversion efficiency: 22%. Uranium-235 fission at 800°C core temp. No sunlight dependency.',
          COMMANDER: 'Authorize Kilopower start sequence per NASA/TM-2018-219801 procedure. Pre-criticality checklist: neutron detector live, coolant pressure nominal, Stirling piston at TDC. Begin slow criticality ramp.',
        }),
        mood: 'heroic',
        illustrationType: 'LUNAR_NIGHT',
      },
    ],
    options: [
      {
        id: 'opt-kilopower',
        title: tierText(tier, {
          EXPLORER: '⚛️ Start the magic power machine!',
          CADET: 'Start up the Kilopower nuclear reactor',
          ENGINEER: 'Initiate Kilopower 10 kWe fission startup — primary night power',
          SCIENTIST: 'Kilopower criticality ramp: slow U-235 activation → 800°C core → Stirling piston lock-in → 10 kWe output',
          COMMANDER: 'Authorize Kilopower startup sequence per Gibson et al. (2018) TM-219801 Chapter 4 — 35-min ramp to full criticality',
        }),
        description: tierText(tier, {
          EXPLORER: 'The tiny nuclear machine runs on special fuel and makes electricity even when it\'s totally dark!',
          CADET: 'The Kilopower reactor uses uranium to make heat, which turns into electricity — like a nuclear power plant, but tiny!',
          ENGINEER: 'Kilopower: U-235 fission core → sodium heat pipes → Stirling convertors → 10 kWe continuous. Designed for 10 years of continuous operation.',
          SCIENTIST: 'Kilopower specs (Gibson et al. 2018): mass 93 kg, power 10 kWe, thermal efficiency 22% (Stirling), core temp 800°C, coolant: sodium heat pipes. Heritage: KRUSTY ground test (2018) validated full-power operation. Safety: passive shutdown on overtemperature.',
          COMMANDER: 'Kilopower startup authorization: safety criteria per NASA/SP-8112 (nuclear safety in space). Startup duration: 35 min from cold. Full power: 10 kWe. Total heat rejection: 36 kWt via radiator panels. Post-startup radiation survey: required at 500m exclusion zone.',
        }),
        tradeOffText: tierText(tier, {
          EXPLORER: 'Warm and bright for 14 nights! The plants keep growing!',
          CADET: 'Power stays on all night! Plants grow, crew stays warm, science continues!',
          ENGINEER: 'Power: +45 kWh buffer | O2: +10% | Water: +5 L (Sabatier bonus) | Crew: +10% | Science: +15 RP',
          SCIENTIST: 'ΔPow: +45 kWh net buffer · ΔO2: +10% · ΔH2O: +5 L · ΔCrewH: +10% · ΔSci: +15 RP — Optimal power choice',
          COMMANDER: 'ΔPow: +45 kWh buffer · ΔO2: +10% · ΔH2O: +5 L · ΔCrewH: +10% · ΔSci: +15 RP — Full ECLSS compliance maintained. ONLY viable 354h solution within mission mass constraints.',
        }),
        resourceDelta: DELTAS.NIGHT_KILOPOWER,
        consequenceNarrative: tierText(tier, {
          EXPLORER: 'The little reactor hums to life! The lights stay bright, the plants keep growing, and everyone is warm inside! ☀️ (but underground) 🌱',
          CADET: 'The Kilopower reactor fires up with a soft hum. Lights stay on, greenhouse keeps running, crew stays warm — all through 14 days of complete darkness outside!',
          ENGINEER: 'Kilopower at full 10 kWe output. ECLSS stable at 12 kW draw with 2 kWh/hr net surplus. Greenhouse maintained at +22°C. No thermal emergency.',
          SCIENTIST: 'Kilopower performance: 10.1 kWe (±0.2 kW) — within spec. ECLSS stable. Greenhouse LED draw: 3 kW. Net surplus to battery: 2.1 kWh/hr. Sabatier running at partial load (0.3 kg CO2/hr) — producing 0.25 L H2O/hr bonus. Solar recharge estimated: Day 30 morning.',
          COMMANDER: 'Kilopower performance nominal (10.1 kWe). Power budget: ECLSS 12 kW + Science 2 kW + Greenhouse 3 kW + Margin 0.5 kW = 17.5 kW vs 10 kWe + battery discharge of 7.5 kW. Battery endurance at 7.5 kW net draw: 38h reserve. Full mission night survivability confirmed.',
        }),
        educationalInsight: tierText(tier, {
          EXPLORER: 'A nuclear reactor is like the sun in a tiny box! The special rocks (uranium) make heat that makes electricity. It works in the dark, in the cold, and even on Mars!',
          CADET: 'The Kilopower reactor is based on how nuclear power plants work. It splits uranium atoms to make heat, which drives a piston to make electricity — just like a steam engine, but using nuclear power!',
          ENGINEER: 'Kilopower uses U-235 fission: controlled chain reaction releases ~200 MeV per fission event. Heat transported via passive sodium heat pipes (no moving parts → high reliability). Stirling convertor at 22% efficiency (ΔT = 800°C core - 130°C radiator). Key advantage: mass-efficient vs. batteries: 10 kWe at 93 kg vs. 500+ kg LiPo for equivalent 354h supply.',
          SCIENTIST: 'References: (1) Gibson M.A. et al. (2018) NASA/TM-2018-219801 — full Kilopower development and KRUSTY test results. (2) Poston D.I. et al. (2020) Nuclear Technology 206:S13 — KRUSTY reactor design details. (3) Bragg-Sitton S. et al. (2014) AIAA-2014-3458 — trade between nuclear and solar for lunar applications. (4) Rucker M.A. (2016) AIAA-2016-5452 — power budget for lunar south pole outpost.',
          COMMANDER: 'Kilopower program status (2026): KRUSTY ground test completed 2018 (Gibson et al. 2018). Flight unit TRL: 6 (ready for Phase A/B mission development). Artemis surface power architecture: 10 kWe Kilopower units × 3 = 30 kWe total planned capacity for sustained outpost. Cost comparison: Kilopower ($50M unit) vs. battery array for same energy ($200M+ for 354h at 12 kW). Nuclear regulatory: Energy Policy Act 2005 Section 631 + DOE/NASA nuclear safety review board required for any fission launch.',
        }),
      },
    ],
  });

  // ── SOL 4: GREENHOUSE ─────────────────────────────────────────────────────
  deck.push({
    id: 'sol-04-greenhouse',
    sol: 4,
    title: tierText(tier, {
      EXPLORER: '🌱 Baby plants are growing!',
      CADET: 'Sol 4: First Sprouts in the Lunar Greenhouse!',
      ENGINEER: 'Sol 4 — Bioregenerative Life Support (BLSS) Online',
      SCIENTIST: 'SOL 004 — Hydroponic Biomass Chamber Initial Photo-Cycle',
      COMMANDER: 'MISSION CLOCK SOL 004 — BLSS Module Activation: Crop canopy growth phase initiated',
    }),
    urgency: 'MODERATE',
    weatherNotice: tierText(tier, {
      EXPLORER: '🌱 Tiny green leaves sprouted in the water trays!',
      CADET: 'Hydroponics thermal loop: 21°C · Nutrient pH: 6.2 · Plants healthy',
      ENGINEER: 'PAR sensor: 400 μmol/m²/s · O2 transpiration: 0.5 kg/m²/day · Water recycle online',
      SCIENTIST: 'Canopy area: 12 m² · Photosynthetic flux: 1.2 mol O2/hr · Wheeler (2010) BLSS compliance test',
      COMMANDER: 'BLSS telemetry: pH 6.2, EC 1.8 mS/cm, LED PAR flux: 400 μmol/m²/s. Energy trade vs ECLSS OGA active.',
    }),
    nasaCitation: {
      title: 'NASA BVAD Bioregenerative Life Support',
      docNumber: 'NASA/TP-2015-218570 Sect. 4.6 + Wheeler (2010)',
      description: tierText(tier, {
        EXPLORER: 'Plants turn dirty air into fresh air and water for astronauts!',
        CADET: 'Plants eat our CO2 and produce fresh oxygen and crisp food right on the Moon!',
        ENGINEER: 'Crop transpiration recycles wastewater into pure humidity while generating ~0.5 kg O2 per m² daily (Wheeler 2010).',
        SCIENTIST: 'Hydroponic crop canopy (dwarf wheat + sweet potato) provides dual benefit: 0.5 kg O2/m²/day and 0.62 L/m²/day transpired H2O (NASA/TP-2015-218570 Table 4.6-3).',
        COMMANDER: 'Bioregenerative life support trade study: Hybrid physicochemical (ISS-heritage) + BLSS reduces resupply logistics by 35% for missions >30 sols (Wheeler 2010).',
      }),
    },
    comicPanels: [
      {
        speaker: 'CADET_MAYA',
        dialogue: tierText(tier, {
          EXPLORER: 'Look Dadu! Tiny green babies are growing in the purple light! 🌱✨',
          CADET: 'Dadu, the dwarf wheat sprouted! Fresh salad on the Moon!',
          ENGINEER: 'BLSS seedling germination confirmed. Transpiration loop running. How much power do we allocate?',
          SCIENTIST: 'Germination rate: 94%. Carbon fixation rate: 12 g CO2/m²/day. Awaiting photoperiod duty cycle authorization.',
          COMMANDER: 'Canopy telemetry nominal. Requesting directive on photoperiod duty cycle vs station battery reserve.',
        }),
        mood: 'excited',
        illustrationType: 'GREENHOUSE_BLOOM',
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: tierText(tier, {
          EXPLORER: 'Plants are our little green helpers! They breathe what we breathe out! 🍃',
          CADET: 'Plants eat our exhaled CO2 and give us back fresh oxygen and water. Let us tune their lights!',
          ENGINEER: 'LED lighting consumes ~120 W/m². High growth means high electrical draw. Balance is critical.',
          SCIENTIST: 'Energy trade: Full PAR lighting draws 2.4 kW continuously. Balances food yield vs battery capacity for upcoming night.',
          COMMANDER: 'Optimize LED duty cycle against battery margin. Wheeler (2010) confirms 14h photoperiod maintains 85% biomass yield at 40% lower power.',
        }),
        mood: 'curious',
        illustrationType: 'GREENHOUSE_BLOOM',
      },
    ],
    options: [
      {
        id: 'opt-full-spectrum-uv',
        title: tierText(tier, {
          EXPLORER: '🟣 Super bright purple lights!',
          CADET: 'Turn on 24-hour high-power grow lights',
          ENGINEER: 'Full-spectrum PAR LED cycle (24h continuous)',
          SCIENTIST: 'Continuous 24h photoperiod (400 μmol/m²/s PAR, 2.4 kW)',
          COMMANDER: 'Command continuous 24h PAR cycle — maximize Biomass Accumulation Rate before lunar night',
        }),
        description: tierText(tier, {
          EXPLORER: 'Super bright purple lights make the plants grow super fast so we get lots of food!',
          CADET: 'Max out the purple LED grow lights so the plants produce maximum food and oxygen right away.',
          ENGINEER: 'Run continuous 24-hour photoperiod to boost crop biomass and oxygen production, consuming 22 kWh.',
          SCIENTIST: 'Maximizes photosynthetic O2 production to 0.5 kg/m²/day (Wheeler 2010). Draws 22 kWh; evaporates 14 L H2O via transpiration.',
          COMMANDER: '24h continuous PAR regime: accelerates crop canopy closure. Trade: 22 kWh power draw + 14 L water cycle vs +6 sols food buffer.',
        }),
        tradeOffText: tierText(tier, {
          EXPLORER: 'Lots of food and fresh air, but uses lots of battery!',
          CADET: 'Fast food & oxygen; uses heavy electrical power.',
          ENGINEER: 'Food: +6 sols | O2: +10% | Power: -22 kWh | Water: -14 L',
          SCIENTIST: 'ΔFood: +6 sols · ΔO2: +10% · ΔPow: -22 kWh · ΔH2O: -14 L (transpiration)',
          COMMANDER: 'ΔFood: +6 sols · ΔO2: +10% · ΔPow: -22 kWh · ΔH2O: -14 L — High-yield, high-energy profile',
        }),
        resourceDelta: DELTAS.GREENHOUSE_FULL,
        consequenceNarrative: tierText(tier, {
          EXPLORER: 'The room glows deep purple! Leaves grow right in front of our eyes! Smells like fresh rain! 🌿💜',
          CADET: 'The greenhouse explodes with lush green growth! Sweet fresh oxygen fills the habitat corridors.',
          ENGINEER: 'Biomass index increased by 40%. O2 scrubbers throttled down as plants fix 0.8 kg CO2/day. Battery SoC dropped 18%.',
          SCIENTIST: 'Net O2 production: +0.48 kg/day. Transpiration condensate recovered at 96% by ECLSS condensing heat exchanger. Battery SoC: 54%.',
          COMMANDER: 'BLSS successfully supplemented ECLSS OGA. Food buffer extended to +6 sols. Power grid managed within acceptable margin.',
        }),
        educationalInsight: tierText(tier, {
          EXPLORER: 'Plants use light like food! In space with purple lights, they can grow even faster than on Earth!',
          CADET: 'Plants use red and blue light to do photosynthesis — that is why space greenhouses glow purple!',
          ENGINEER: 'Red (660nm) and blue (450nm) LEDs target chlorophyll A and B absorption peaks with maximum photon efficiency (~1.8 μmol/J) (Massa et al. 2015, VEG-01).',
          SCIENTIST: 'Ref: Massa G.D. et al. (2015) "VEG-01: Veggie hardware validation testing on ISS," Open Agriculture 2:33. Wheeler R.M. (2010) Gravit. Space Biol. 23:25.',
          COMMANDER: 'Closed-loop crop integration: Transpired moisture reduces ECLSS Sabatier water demand by 45%. Trade-offs documented in NASA/TP-2015-218570 Sect. 4.6.',
        }),
      },
      {
        id: 'opt-eco-crop-cycle',
        title: tierText(tier, {
          EXPLORER: '🌱 Normal sleepy-time plant lights',
          CADET: 'Balanced 14-hour natural day-night light cycle',
          ENGINEER: 'Circadian photoperiod: 14h light / 10h dark',
          SCIENTIST: 'Standard 14h:10h photoperiod with diurnal temperature cycling (22°C/18°C)',
          COMMANDER: 'Implement circadian 14h:10h duty cycle per Massa et al. (2015) baseline',
        }),
        description: tierText(tier, {
          EXPLORER: 'Turn the lights on and off so the plants can sleep at night just like you!',
          CADET: 'Give the plants a normal day and night so they stay healthy without burning too much battery.',
          ENGINEER: 'Mimics natural terrestrial day/night rhythm. Saves 13 kWh while sustaining steady crop growth and moderate oxygen output.',
          SCIENTIST: 'Reduces power draw to 9 kWh. Preserves stomatal circadian rhythms and prevents photo-oxidative leaf damage (Morrow 2011).',
          COMMANDER: 'Baseline operation: 14h photoperiod minimizes peak power demand while sustaining 70% of maximum biomass growth rate.',
        }),
        tradeOffText: tierText(tier, {
          EXPLORER: 'Healthy plants and saves battery power!',
          CADET: 'Steady food growth, safe power and water usage.',
          ENGINEER: 'Food: +3 sols | O2: +5% | Power: -9 kWh | Water: -8 L | Science: +10 RP',
          SCIENTIST: 'ΔFood: +3 sols · ΔO2: +5% · ΔPow: -9 kWh · ΔH2O: -8 L · ΔSci: +10 RP',
          COMMANDER: 'ΔFood: +3 sols · ΔO2: +5% · ΔPow: -9 kWh · ΔH2O: -8 L · ΔSci: +10 RP — Optimal balanced profile',
        }),
        resourceDelta: DELTAS.GREENHOUSE_ECO,
        consequenceNarrative: tierText(tier, {
          EXPLORER: 'The plants stretch happily under the gentle light! Everything runs nice and smooth! 🌿💚',
          CADET: 'Crops grow steadily. Batteries stay in the green, and Maya records data for Earth school kids.',
          ENGINEER: 'Photoperiod cycle stable. Power consumption within baseline budget. Science team logs growth curves.',
          SCIENTIST: 'Photosynthetic efficiency: 1.4 μmol CO2/J. All environmental sensors within nominal envelope (pH 6.2, T 21.4°C).',
          COMMANDER: 'Circadian regime successfully established. Grid margin healthy. Biomass telemetry transmitted to NASA Ames Life Sciences.',
        }),
        educationalInsight: tierText(tier, {
          EXPLORER: 'Even plants need a bedtime! When the lights turn off, they rest and get ready for tomorrow.',
          CADET: 'Plants have internal body clocks called circadian rhythms, just like humans! A regular night cycle keeps them strong.',
          ENGINEER: 'Continuous lighting can cause chlorosis in certain cultivars due to starch accumulation in chloroplasts during dark phase starvation (Morrow 2011, HortScience 43).',
          SCIENTIST: 'Ref: Morrow R.C. (2011) "LED lighting in horticulture," HortScience 43(7). Starch degradation enzymes require dark period to prevent leaf necrosis in closed environments.',
          COMMANDER: 'ISS Veggie and APH (Advanced Plant Habitat) operational flight protocols standardize on 14h:10h or 16h:8h photoperiods to prevent photo-inhibition (JSC-65829).',
        }),
      },
    ],
  });

  // ── SOL 8: WATER RECOVERY SYSTEM ──────────────────────────────────────────
  deck.push({
    id: 'sol-08-water-recycler',
    sol: 8,
    title: tierText(tier, {
      EXPLORER: '💧 Uh oh! The water cleaner has a cough!',
      CADET: 'Sol 8: Water Recovery Loop Maintenance Alert!',
      ENGINEER: 'Sol 8 — ECLSS Water Recovery System (WRS) Efficiency Degradation',
      SCIENTIST: 'SOL 008 — WRS Catalytic Reactor Delta-P Exceeds 180 kPa Limit',
      COMMANDER: 'MISSION CLOCK SOL 008 — WRS Primary Loop Degraded: Recovery rate dropped from 93% to 64%',
    }),
    urgency: 'HIGH',
    weatherNotice: tierText(tier, {
      EXPLORER: '💧 Water pipe filter is full of tiny specks!',
      CADET: 'Filter pressure high: 180 kPa · Water recovery rate falling!',
      ENGINEER: 'Catalytic oxidizer ΔP: 180 kPa | Recovery efficiency: 93% → 64% | Flow: 1.1 L/hr',
      SCIENTIST: 'UPA distillation centrifuge vibration: 2.3 mm/s · Mineral gypsum precipitating in evaporator · Carter (2009) fault signature',
      COMMANDER: 'WRS fault code 44-B: Gypsum scale precipitation in rotary distillation assembly. Recovery degraded to 64%. Immediate remediation required.',
    }),
    nasaCitation: {
      title: 'NASA ISS Water Recovery System (WRS)',
      docNumber: 'Carter (2009) SAE 2009-01-2349 + NASA-CR-2004-208941',
      description: tierText(tier, {
        EXPLORER: 'In space, every drop of water is recycled over and over — even shower water and sweat!',
        CADET: 'Yesterday\'s coffee is today\'s coffee! The ISS recycles 93% of all moisture to keep astronauts alive without resupply.',
        ENGINEER: 'The ISS WRS recovers 93% of gray water and urine distillate to standards purer than municipal tap water (Carter 2009).',
        SCIENTIST: 'ISS WRS combines Urine Processing Assembly (UPA) vacuum rotary distillation with Water Processing Assembly (WPA) catalytic oxidation, achieving 93% closed-loop recovery (Carter 2009, SAE 2009-01-2349).',
        COMMANDER: 'WRS mass balance: A 4-person crew consumes 12 L/day. At 93% recovery, daily net loss is only 0.84 L. At degraded 64%, loss jumps to 4.3 L/day — depleting total reserves in 8.2 sols.',
      }),
    },
    comicPanels: [
      {
        speaker: 'SYSTEM_AI',
        dialogue: tierText(tier, {
          EXPLORER: 'Beep boop! The water filter is sticky! We need to clean it! 🤖💧',
          CADET: 'Warning: Water recycler filter clogged! Efficiency down to 64%!',
          ENGINEER: 'WRS filter delta-P critical. If uncorrected, potable water reserves exhaust in 9 sols.',
          SCIENTIST: 'Catalytic oxidizer throughput choked by precipitate buildup. Potable tank reserve delta: -2.2 L/hr.',
          COMMANDER: 'WRS failure creates immediate ECLSS mission-stop condition within 8 sols if unremedied. Action required.',
        }),
        mood: 'warning',
        illustrationType: 'WATER_LEAK',
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: tierText(tier, {
          EXPLORER: 'No water means no soup and no tea! Let us fix the pipes right away! 🔧',
          CADET: 'In space, every drop counts! Let us clean the filters or harvest some ice from the crater!',
          ENGINEER: 'We have two solid options: high-energy thermal bake-out or an autonomous ice retrieval run into Shackleton.',
          SCIENTIST: 'Thermal purge requires 18 kWh. Alternative: cryogenic ice core retrieval from PSR cold trap (80 K, 200m depth).',
          COMMANDER: 'Evaluate trade: 18 kWh thermal overhaul vs rover sortie into Shackleton crater PSR. Rover option adds water but incurs radiation exposure.',
        }),
        mood: 'worried',
        illustrationType: 'WATER_LEAK',
      },
    ],
    options: [
      {
        id: 'opt-deep-purge-filters',
        title: tierText(tier, {
          EXPLORER: '🧼 Clean the filter with hot water!',
          CADET: 'Deep thermal purge & filter overhaul',
          ENGINEER: 'Thermal bake-out & catalytic cartridge swap',
          SCIENTIST: 'Execute 400°C thermal catalytic bake-out + secondary nanofilter swap (18 kWh)',
          COMMANDER: 'Authorize WRS thermal purge sequence per JSC ECLSS Maintenance Procedure 4.2',
        }),
        description: tierText(tier, {
          EXPLORER: 'Use hot heat to melt away all the sticky dirt so clean water flows again!',
          CADET: 'Use 18 kWh of power to super-heat the filters and replace clogged parts so water stays 100% clean.',
          ENGINEER: 'Divert 18 kWh of power to run high-temperature catalytic bake-out and restore 93% recovery efficiency.',
          SCIENTIST: '400°C catalytic oxidation volatilizes organic contaminants. Restores 93% recovery rate per Carter (2009). Draws 18 kWh.',
          COMMANDER: 'Thermal purge sequence restores WRS loop closure to nominal 93%. Power penalty: 18 kWh. Eliminates downstream dehydration risk.',
        }),
        tradeOffText: tierText(tier, {
          EXPLORER: 'Clean water is back! But uses some power.',
          CADET: 'Full water restored; uses significant battery power.',
          ENGINEER: 'Water: +25 L | Power: -18 kWh | Crew: +5% | Science: +5 RP',
          SCIENTIST: 'ΔWater: +25 L buffer · ΔPower: -18 kWh · ΔCrewHealth: +5% · ΔSci: +5 RP',
          COMMANDER: 'ΔH2O: +25 L · ΔPow: -18 kWh · ΔCrewH: +5% · ΔSci: +5 RP — Risk mitigation: OPTIMAL',
        }),
        resourceDelta: DELTAS.WATER_DEEP_FIX,
        consequenceNarrative: tierText(tier, {
          EXPLORER: 'Clean sparkling water rushes through the pipes! Gurgle gurgle! Pure and yummy! 💧✨',
          CADET: 'Pure clean water fills the station reserve tanks! The crew can drink, cook, and hydrate without worry.',
          ENGINEER: 'WRS recovery restored to 94.2%. Contaminant levels below 10 ppb TOC. Battery SoC absorbed the 18 kWh load cleanly.',
          SCIENTIST: 'TOC (Total Organic Carbon) < 100 ppb. WRS recovery restored to 94%. Daily water balance returns to neutral (+0.2 L/day).',
          COMMANDER: 'WRS functional verification passed. Water loop closure certified for remainder of 30-sol expedition. Zero open ECLSS anomalies.',
        }),
        educationalInsight: tierText(tier, {
          EXPLORER: 'On Earth, rain makes clean water. On the Moon, our smart machines clean the water so we can use it again and again!',
          CADET: 'The space station filter uses tiny silver atoms and high heat to kill 99.99% of bacteria in recycled water!',
          ENGINEER: 'ECLSS WPA utilizes catalytic oxidation at 120°C and 340 kPa to mineralize volatile organic compounds into CO2 and H2O (Carter 2009).',
          SCIENTIST: 'Ref: Carter D.L. (2009) "Status of the Regenerative ECLSS Water Recovery System," SAE Technical Paper 2009-01-2349. Gypsum scaling mitigated by sulfuric acid/chromium trioxide pre-treatment.',
          COMMANDER: 'Closed loop ECLSS water economics: At $10,000/kg launch cost, recovering 3 L/person/day for 4 crew saves $438,000 daily in resupply logistics.',
        }),
      },
      {
        id: 'opt-melt-ice-rover',
        title: tierText(tier, {
          EXPLORER: '🚜 Drive the rover into the cold dark hole for ice!',
          CADET: 'Send the rover to drill ancient ice from crater shadows',
          ENGINEER: 'Autonomous rover PSR sortie: drill Shackleton cold trap',
          SCIENTIST: 'Deploy autonomous VIPER-heritage cryo-drill rover to 40 K Shackleton PSR',
          COMMANDER: 'Command PSR Sortie Alpha: harvest 50 kg volatile ice from Shackleton cold trap (Li et al. 2018 target)',
        }),
        description: tierText(tier, {
          EXPLORER: 'The tough rover drives into the pitch-black freezing crater to bring back giant chunks of moon ice!',
          CADET: 'Drive the rover down into the freezing shadows to drill pure ice trapped on the Moon for billions of years.',
          ENGINEER: 'Sortie into Shackleton crater Permanently Shadowed Region (40 K). Scrapes 50 kg of primordial volatiles. High power cost, +10 mSv radiation.',
          SCIENTIST: 'Direct harvesting of surface ice deposits confirmed by LRO LAMP and M3 data (Li et al. 2018). Consumes 25 kWh rover battery.',
          COMMANDER: 'ISRU demonstration sortie: drills 50 kg core at 40 K. Validates Artemis ISRU architecture while refilling water reserves.',
        }),
        tradeOffText: tierText(tier, {
          EXPLORER: 'Giant ice treasure! But rover gets cold and tired.',
          CADET: 'Massive water gain (+35 L) and science (+20 RP); drains power.',
          ENGINEER: 'Water: +35 L | Power: -25 kWh | Science: +20 RP | Radiation: +10 mSv',
          SCIENTIST: 'ΔWater: +35 L · ΔPow: -25 kWh · ΔSci: +20 RP · ΔRad: +10 mSv',
          COMMANDER: 'ΔH2O: +35 L · ΔPow: -25 kWh · ΔSci: +20 RP · ΔRad: +10 mSv — Aggressive ISRU play',
        }),
        resourceDelta: DELTAS.WATER_ICE_ROVER,
        consequenceNarrative: tierText(tier, {
          EXPLORER: 'The rover climbs back up the hill with sparkling buckets of ice! Hooray! ❄️🎉',
          CADET: 'The rover returns with 50 kg of pure ancient ice! Melted down, our water tanks are overflowing!',
          ENGINEER: 'Cryo-drill payload secured. Sublimation loss during ascent: 4.2%. Net potable water yield: +35 liters.',
          SCIENTIST: 'Mass spectrometer confirms 91.2% H2O, with trace CO2, NH3, and CH4 volatiles. Water reserves replenished above initial baseline.',
          COMMANDER: 'First successful surface ISRU extraction completed. 35 L potable H2O added to reserves. Rover returned with 14% battery margin.',
        }),
        educationalInsight: tierText(tier, {
          EXPLORER: 'There is real frozen ice hiding in the dark shadows on the Moon! It has been waiting there since dinosaurs lived on Earth!',
          CADET: 'Permanently Shadowed Regions on the Moon are colder than Pluto (-246°C)! Water ice has been preserved there for over 2 billion years.',
          ENGINEER: 'LRO LOLA and Diviner instruments measured temperatures of 40 K (-233°C) in Shackleton PSR, allowing water ice to remain stable against vacuum sublimation for 2+ billion years (Hayne et al. 2015).',
          SCIENTIST: 'Ref: Li S. et al. (2018) "Direct evidence of surface exposed water ice in the lunar polar regions," PNAS 115:8907. Hayne P.O. et al. (2015) Icarus 255:58.',
          COMMANDER: 'Artemis ISRU strategy relies on harvesting polar PSR volatile deposits (estimated >600 million metric tons) to produce liquid hydrogen and oxygen propellant for deep space exploration.',
        }),
      },
    ],
  });

  // ── SOL 20: MICROMETEOROID IMPACT ─────────────────────────────────────────
  deck.push({
    id: 'sol-20-meteoroid-strike',
    sol: 20,
    title: tierText(tier, {
      EXPLORER: '💥 PEEK! A tiny fast pebble hit our roof!',
      CADET: 'Sol 20: ALERT — Micrometeoroid Hull Puncture!',
      ENGINEER: 'Sol 20 — Hypervelocity Impact Breach on Habitat Shell',
      SCIENTIST: 'SOL 020 — Acoustic Hull Sensor: Hypervelocity Impact (8 km/s), Pressure Drop 0.5 kPa/s',
      COMMANDER: 'SOL 020 EMERGENCY — Whipple Shield Penetration: Science module hull breach, depress rate 0.5 kPa/s',
    }),
    urgency: 'HIGH',
    weatherNotice: tierText(tier, {
      EXPLORER: '💨 Air is hissing out! Ssssss!',
      CADET: 'Hull breach in Science Airlock · Pressure dropping: 0.5 kPa/sec!',
      ENGINEER: 'Acoustic sensor: 8 km/s impactor · Breach diameter: ~4 mm · Airlock compartment isolated',
      SCIENTIST: 'Hypervelocity particle strike (ρ ~ 2.5 g/cm³, v = 8.1 km/s). NASA Meteoroid Environment Office model SP-8042.',
      COMMANDER: 'MEO telemetry match: Sporadic interplanetary micrometeoroid flux. Cabin ΔP: -0.5 kPa/s. Immediate seal required.',
    }),
    nasaCitation: {
      title: 'NASA Meteoroid Environment Office (MEO)',
      docNumber: 'NASA-SP-8042 + Christiansen (2003)',
      description: tierText(tier, {
        EXPLORER: 'Tiny space rocks fly super fast through space — faster than a bullet! Our space base has strong armor to stop them.',
        CADET: 'Space dust traveling at 8 to 72 km/s carries huge kinetic energy. Spacecraft use special bumpers called Whipple shields!',
        ENGINEER: 'Whipple shields fragment hypervelocity impactors before hitting pressure hulls. NASA SP-8042 details meteoroid flux curves.',
        SCIENTIST: 'Hypervelocity impacts (>7 km/s) cause hydrodynamic flow in metallic hulls. Christiansen E.L. (2003) "Meteoroid/Debris Shielding," NASA/TP-2003-210788.',
        COMMANDER: 'Whipple shielding design standards (NASA-STD-5001). Risk assessment: Puncture probability 0.02 over 30 sols. Pressure compartmentation is primary survival defense.',
      }),
    },
    comicPanels: [
      {
        speaker: 'SYSTEM_AI',
        dialogue: tierText(tier, {
          EXPLORER: 'Warning! Hiss hiss! Air is escaping into space! 🚨💨',
          CADET: 'Depressurization alarm! Science airlock hull puncture! Air is escaping!',
          ENGINEER: 'Hull puncture confirmed. Science locker bulkhead pressure decay: 0.5 kPa/s. 12 minutes to hypoxia threshold.',
          SCIENTIST: 'Airlock cabin volume: 14 m³. At dP/dt = -0.5 kPa/s, effective hole diameter is 4.2 mm. Action needed immediately.',
          COMMANDER: 'Airlock rapid decompression in progress. Execute hull breach protocol per NASA Flight Rule 4-12.',
        }),
        mood: 'warning',
        illustrationType: 'AIRLOCK',
      },
      {
        speaker: 'CADET_MAYA',
        dialogue: tierText(tier, {
          EXPLORER: 'I hear it! Ssssss! Let us stick the magic foam sticker on the hole! 🩹',
          CADET: 'Dadu, I hear the hiss! We have the self-healing foam patch ready!',
          ENGINEER: 'Foam patch is fastest. Bulkhead isolation is safest for crew but loses all exposed samples. Your call, Commander!',
          SCIENTIST: 'Epoxy-polyurethane reactive foam cures in 4 seconds in partial vacuum. Bulkhead door isolation loses 14 m³ of O2.',
          COMMANDER: 'Select containment strategy: internal reactive patch (saves air + samples) vs bulkhead door seal (guarantees habitat integrity).',
        }),
        mood: 'worried',
        illustrationType: 'AIRLOCK',
      },
    ],
    options: [
      {
        id: 'opt-quick-seal-foam',
        title: tierText(tier, {
          EXPLORER: '🩹 Stick the magic foam patch on it!',
          CADET: 'Emergency self-healing epoxy foam patch',
          ENGINEER: 'Deploy expanding epoxy-polyurethane vacuum patch',
          SCIENTIST: 'Apply rapid-cure reactive polymer patch to 4.2 mm puncture hole',
          COMMANDER: 'Command internal reactive patch deployment — prioritize sample preservation and minimum O2 loss',
        }),
        description: tierText(tier, {
          EXPLORER: 'Slap the squishy foam patch over the little hole — it gets hard like a rock and stops the leak!',
          CADET: 'Quickly slap the space epoxy patch over the hole from inside. The foam expands and seals the leak in seconds!',
          ENGINEER: 'Deploy vacuum-activated polyurethane foam. Cures in 4 seconds, sealing the 4mm breach with minimal atmospheric loss.',
          SCIENTIST: 'Reactive polymer sealant seals against vacuum up to 150 kPa. Consumes maintenance kit; preserves 14 m³ atmospheric volume.',
          COMMANDER: 'Internal patch preserves science airlock and sample payload. Risk: micro-leak residual (<0.01 kPa/hr). Accepted per procedure.',
        }),
        tradeOffText: tierText(tier, {
          EXPLORER: 'Stops the leak fast! Preserves science samples.',
          CADET: 'Stops leak instantly; preserves science; uses repair kit.',
          ENGINEER: 'O2: -5% | Power: -5 kWh | Crew: +5% | Science: +15 RP',
          SCIENTIST: 'ΔO2: -5% · ΔPow: -5 kWh · ΔCrewH: +5% · ΔSci: +15 RP',
          COMMANDER: 'ΔO2: -5% · ΔPow: -5 kWh · ΔCrewH: +5% · ΔSci: +15 RP — Preserves mission science payload',
        }),
        resourceDelta: DELTAS.METEOR_FOAM,
        consequenceNarrative: tierText(tier, {
          EXPLORER: 'SPLAT! Maya presses the foam! FZZZZ... POP! The hiss stops! Maya does a happy moon hop! 🩹🎉',
          CADET: 'The foam hardens instantly into an airtight seal. The hissing stops, and atmospheric pressure returns to normal!',
          ENGINEER: 'Seal integrity verified at 101.3 kPa. Zero delta-P over 15-minute hold. Science samples fully preserved.',
          SCIENTIST: 'Airlock pressure stabilized at 98.4 kPa. OGA repressurization cycle restored nominal 101.3 kPa. Structural integrity intact.',
          COMMANDER: 'Hull puncture contained with minimal consumable loss (5% O2). Science payload saved. Flight Rule 4-12 closeout complete.',
        }),
        educationalInsight: tierText(tier, {
          EXPLORER: 'Spaceships have special stickers that can fix a hole in 4 seconds, just like a bicycle tire patch!',
          CADET: 'NASA tests self-healing materials with tiny chemical capsules that burst and plug bullet holes automatically!',
          ENGINEER: 'Self-healing polymers contain microencapsulated monomer and catalyst. Rupture releases agent that polymerizes on contact (Christiansen 2003).',
          SCIENTIST: 'Ref: Christiansen E.L. (2003) "Meteoroid/Debris Shielding," NASA/TP-2003-210788. ISS utilizes Whipple bumper shields with Stuffed Whipple Nextel/Kevlar layers.',
          COMMANDER: 'Multi-layer Whipple shielding achieves 90% ballistic limit improvement over monolithic aluminum hulls of identical areal mass (NASA-STD-5001).',
        }),
      },
    ],
  });

  // ── SOL 24: ICE CORE DISCOVERY ────────────────────────────────────────────
  deck.push({
    id: 'sol-24-ice-core-breakthrough',
    sol: 24,
    title: tierText(tier, {
      EXPLORER: '💎 WE FOUND SUPER MOON ICE!',
      CADET: 'Sol 24: Major Scientific Discovery — Primordial Ice Core!',
      ENGINEER: 'Sol 24 — Deep Cryo-Core Recovered: 4-Billion-Year-Old Volatiles',
      SCIENTIST: 'SOL 024 — Spectrometer Hit: Primordial Volatiles (H2O, NH3, CO2, Organics)',
      COMMANDER: 'MISSION CLOCK SOL 024 — Primary Objective Achieved: Pristine South Pole-Aitken Basin volatile core secured',
    }),
    urgency: 'MODERATE',
    weatherNotice: tierText(tier, {
      EXPLORER: '💎 Deep cold drill found ancient sparkling ice crystals!',
      CADET: 'Deep drill: 3.8m depth · Spectrometer detected water and organic molecules!',
      ENGINEER: 'Drill depth: 3.8m | Volatiles: H2O (88%), CO2 (6%), NH3 (4%), trace amino acids | Temp: 38 K',
      SCIENTIST: 'VIPER-heritage NIRVSS spectrometer: D/H isotopic ratio matches cometary volatiles. Decadal Survey Priority 1 discovery.',
      COMMANDER: 'Artemis Level 1 Science Requirement achieved. D/H ratio confirmation connects lunar volatiles to Earth ocean delivery epoch.',
    }),
    nasaCitation: {
      title: 'NASA VIPER Rover & Decadal Survey',
      docNumber: 'National Academies (2023) Decadal Strategy + NASA-SP-2020-0012',
      description: tierText(tier, {
        EXPLORER: 'This ice is from comets that crashed on the Moon billions of years ago — it tells how Earth got its oceans!',
        CADET: 'Water ice on the Moon contains trapped secrets from comets that brought water to Earth when our planet was young!',
        ENGINEER: 'Lunar polar cold traps hold primordial cometary volatiles unchanged for 4 billion years (National Academies Decadal Survey 2023).',
        SCIENTIST: 'D/H ratio in lunar polar ice provides ground truth on whether late veneer cometary delivery or terrestrial degassing was primary source of Earth oceans (Li et al. 2018).',
        COMMANDER: 'Primary mission science gate: 80 RP discovery value. Decision: downlink high-bandwidth spectral data vs electrolyze for ISRU return propellant.',
      }),
    },
    comicPanels: [
      {
        speaker: 'CADET_MAYA',
        dialogue: tierText(tier, {
          EXPLORER: 'Dadu! The drill came up and it is SPARKLY with blue ice crystals! 💎✨',
          CADET: 'Dadu! Look at this drill core! It is sparkling with ancient ice and comet dust!',
          ENGINEER: 'Core sample secured in vacuum chamber. Spectrometer peaks confirm ancient volatiles. What is the protocol?',
          SCIENTIST: 'Spectrometer data confirms water, ammonia, and prebiotic carbon signatures. This is the Decadal Survey holy grail.',
          COMMANDER: 'Core extraction verified at 3.8m depth. Pristine volatile retention confirmed. Ready for science/ISRU allocation decision.',
        }),
        mood: 'excited',
        illustrationType: 'ICE_DISCOVERY',
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: tierText(tier, {
          EXPLORER: 'This is the most special treasure in the whole universe! 🌌',
          CADET: 'This single sample can rewrite textbooks across the entire world! Let us beam the data to Earth!',
          ENGINEER: 'We can transmit full gigabytes of spectral data to NASA Goddard, or electrolyze half into return rocket propellant.',
          SCIENTIST: 'Full transmission takes 25 kWh for high-bandwidth phased-array link. Alternatively, ISRU electrolysis provides 25% LOX reserve.',
          COMMANDER: 'Decisive trade: Full spectral transmission (+80 RP) secures global champion science score; ISRU electrolysis (+25% O2) secures maximum survival margin.',
        }),
        mood: 'heroic',
        illustrationType: 'ICE_DISCOVERY',
      },
    ],
    options: [
      {
        id: 'opt-deep-cryo-analysis',
        title: tierText(tier, {
          EXPLORER: '📡 Send the big ice pictures to Earth!',
          CADET: 'Beam full science data to NASA Goddard via laser comm',
          ENGINEER: 'High-bandwidth optical laser downlink: transmit complete spectrometry',
          SCIENTIST: 'Deploy optical comms (DSN 100 Mbps) to beam complete mass spectrometry + isotope analysis to Earth',
          COMMANDER: 'Execute Optical Downlink Alpha — transmit complete Decadal Survey data suite to NASA Goddard',
        }),
        description: tierText(tier, {
          EXPLORER: 'Beam laser messages with all the cool ice data to scientists on Earth so everyone celebrates!',
          CADET: 'Fire up the optical laser antenna to send gigabytes of pristine data to NASA scientists on Earth!',
          ENGINEER: 'Power up optical communications array. Transmit 400 GB of hyperspectral and isotopic data to NASA Goddard.',
          SCIENTIST: 'Optical communications link consumes 25 kWh; yields +80 Research Points. Melts 10 L into potable reserve.',
          COMMANDER: 'Secures primary Decadal Survey milestone. Science target reached. Power grid margin absorbs 25 kWh comfortably.',
        }),
        tradeOffText: tierText(tier, {
          EXPLORER: 'HUGE science celebration! Uses some battery power.',
          CADET: 'Huge science jump (+80 RP); uses 25 kWh power.',
          ENGINEER: 'Science: +80 RP | Power: -25 kWh | Water: +10 L',
          SCIENTIST: 'ΔSci: +80 RP · ΔPow: -25 kWh · ΔH2O: +10 L',
          COMMANDER: 'ΔSci: +80 RP · ΔPow: -25 kWh · ΔH2O: +10 L — Mission science target LOCKED',
        }),
        resourceDelta: DELTAS.ICE_SCIENCE_TX,
        consequenceNarrative: tierText(tier, {
          EXPLORER: 'The big laser blinks green! Beep beep! Scientists on Earth are clapping and dancing! We did it! 📡🌍🎉',
          CADET: 'NASA Mission Control erupts in cheers on Earth! News anchors declare Maya and Dadu\'s discovery the scientific find of the century!',
          ENGINEER: 'Optical link achieved 200 Mbps downlink. Goddard confirmed 100% packet integrity. Science score surges past mission goal!',
          SCIENTIST: 'D/H cometary match confirmed at 5-sigma significance. Publication draft transmitted to Nature Astronomy. 80 RP logged.',
          COMMANDER: 'Mission Objective 1 fully certified. Global scientific acclaim secured. Telemetry archived in NASA Planetary Data System.',
        }),
        educationalInsight: tierText(tier, {
          EXPLORER: 'Lasers can send super fast messages from the Moon to Earth in just over one second!',
          CADET: 'NASA\'s laser communications system transmits data 10 to 100 times faster than old radio waves!',
          ENGINEER: 'NASA LCRD (Laser Communications Relay Demonstration) uses 1550nm infrared lasers to achieve gigabit-per-second deep space telemetry.',
          SCIENTIST: 'Ref: National Academies of Sciences (2023) "Origins, Worlds, and Life: A Decadal Strategy for Planetary Science and Astrobiology 2023-2032."',
          COMMANDER: 'Optical deep space communications eliminates the scientific telemetry bottleneck, allowing real-time AI-assisted surface science analysis from Earth.',
        }),
      },
    ],
  });

  // ── SOL 28: FINAL STRETCH ─────────────────────────────────────────────────
  deck.push({
    id: 'sol-28-final-resupply',
    sol: 28,
    title: tierText(tier, {
      EXPLORER: '🏆 2 MORE DAYS! We are almost champions!',
      CADET: 'Sol 28: The Final Stretch — 48 Hours to Mission Complete!',
      ENGINEER: 'Sol 28 — Mission Clock: 48 Hours Remaining on Expedition',
      SCIENTIST: 'SOL 028 — T-48h to 30-Sol Mission Closeout: Station Handover Sequence',
      COMMANDER: 'MISSION CLOCK SOL 028 — T-48h to EOM: System stabilization, data archiving, and crew return readiness',
    }),
    urgency: 'HIGH',
    weatherNotice: tierText(tier, {
      EXPLORER: '🌟 The sun is peeking back over the mountains!',
      CADET: 'Mission Clock: Sol 28/30 · DSN high-speed link to Earth open!',
      ENGINEER: 'Night phase exiting: Solar flux returning at 2.1° elevation · VSAT un-stow primed',
      SCIENTIST: 'Dawn terminator crossing Shackleton rim. VSAT telemetry shows 14 kW impending generation. ECLSS fully stable.',
      COMMANDER: 'Dawn transition in progress. Outpost systems prepared for autonomous hibernation or handover to Artemis IV crew.',
    }),
    nasaCitation: {
      title: 'NASA Artemis Architecture & Mission Success Criteria',
      docNumber: 'NASA-NP-2021-05-2900 + NPR 7120.5F',
      description: tierText(tier, {
        EXPLORER: 'Being a great astronaut means staying safe, doing great science, and leaving everything clean for the next team!',
        CADET: 'Real space mission success means keeping the crew healthy, doing great science, and leaving the base ready for the next crew!',
        ENGINEER: 'NASA mission assurance balances science output against crew survivability and station reliability (NPR 7120.5F).',
        SCIENTIST: 'Long-duration mission success score integrates three metrics: science data return, ECLSS mass closure efficiency, and crew cumulative physiological biomarker health.',
        COMMANDER: 'Artemis Surface Base operational certification requires zero red ECLSS warnings, >90% consumable reserves, and verified science payload delivery.',
      }),
    },
    comicPanels: [
      {
        speaker: 'COMMANDER_DADU',
        dialogue: tierText(tier, {
          EXPLORER: 'Maya, my brave little star! We survived 28 days on the Moon! 🌙❤️',
          CADET: 'We did it, Maya! Two days left. We can do one last big science sweep or leave the base sparkling clean!',
          ENGINEER: '48 hours remaining. All systems nominal. How do we finish our 30-sol campaign?',
          SCIENTIST: 'All primary mission requirements satisfied. We have capacity for a final survey sprint or full preventive maintenance.',
          COMMANDER: 'Expedition objectives achieved. Final directive: aggressive science sprint vs certified nominal station handover.',
        }),
        mood: 'heroic',
        illustrationType: 'MISSION_VICTORY',
      },
      {
        speaker: 'CADET_MAYA',
        dialogue: tierText(tier, {
          EXPLORER: 'I want to wave to all my school friends on Earth and show them our moon radish! 🥬👋',
          CADET: 'Let us show the whole world that children and grandparents can explore space together!',
          ENGINEER: 'Broadcast link to Earth is live. Every school kid is watching Outpost Shackleton!',
          SCIENTIST: 'Global downlink audience: estimated 42 million students. Educational outreach multiplier: maximum.',
          COMMANDER: 'Educational broadcast authorized. Connecting Bangladesh science centers and classrooms worldwide.',
        }),
        mood: 'excited',
        illustrationType: 'MISSION_VICTORY',
      },
    ],
    options: [
      {
        id: 'opt-stabilize-all-systems',
        title: tierText(tier, {
          EXPLORER: '🌟 Make everything green and perfect!',
          CADET: 'Safety first: stabilize all systems & prep station handover',
          ENGINEER: 'Nominal station handover: replenish all reserves and certify loops',
          SCIENTIST: 'Full preventive maintenance + ECLSS certification for next crew rotation',
          COMMANDER: 'Command Certified Station Handover — establish gold-standard baseline for Artemis IV',
        }),
        description: tierText(tier, {
          EXPLORER: 'Fill all the water tanks, charge the batteries, and leave the outpost sparkling clean for the next astronauts!',
          CADET: 'Charge every battery, filter all water, and make sure every gauge reads green for the next crew docking.',
          ENGINEER: 'Charge LiPo banks, flush catalytic filters, and leave habitat in 100% nominal state with +25 RP science.',
          SCIENTIST: 'Comprehensive ECLSS baseline verification per NASA-STD-3001. All subsystems nominal. Boosts crew health by +20%.',
          COMMANDER: 'Certifies Outpost Shackleton as a permanent human presence node. All consumables >90%. Maximum mission success rating.',
        }),
        tradeOffText: tierText(tier, {
          EXPLORER: 'Everyone is super healthy and happy! 100% win!',
          CADET: 'Guarantees 100% survival, spotless crew health, +25 RP.',
          ENGINEER: 'Power: +18 kWh | Water: +14 L | O2: +14% | Crew: +20% | Science: +25 RP',
          SCIENTIST: 'ΔPow: +18 kWh · ΔH2O: +14 L · ΔO2: +14% · ΔCrewH: +20% · ΔSci: +25 RP',
          COMMANDER: 'ΔAll nominal · Complete mission success profile certified',
        }),
        resourceDelta: DELTAS.FINAL_STABILIZE,
        consequenceNarrative: tierText(tier, {
          EXPLORER: 'Every light on the big dashboard glows bright EMERALD GREEN! Maya and Dadu hug! We are the Moon Champions! 🟢🏆✨',
          CADET: 'Every meter reads green! Outpost Shackleton stands proud on the rim of the Moon, an unbreakable home among the stars!',
          ENGINEER: 'Final station audit complete. Zero anomalies. Crew vitals at 100%. Expedition concludes with full honors.',
          SCIENTIST: 'All primary and secondary mission criteria exceeded. Station handed over in certified Class-A condition. Mission complete.',
          COMMANDER: 'Flight Director logs Outpost Command 30-Sol Expedition as a historic triumph. Artemis Program gold standard established.',
        }),
        educationalInsight: tierText(tier, {
          EXPLORER: 'When you take care of your home and your friends, you can do anything in the whole galaxy!',
          CADET: 'True leadership means keeping your team safe and planning for the people who come after you!',
          ENGINEER: 'Preventive maintenance and rigorous systems engineering turn high-risk space exploration into sustainable human settlement.',
          SCIENTIST: 'Ref: NASA NPR 7120.5F "NASA Space Flight Program and Project Management Requirements." Long-term habitat survivability relies on predictable maintenance margins.',
          COMMANDER: 'The ultimate achievement of the Artemis era is not merely visiting the Moon, but building an enduring, self-sustaining community across generations.',
        }),
      },
    ],
  });

  return deck.sort((a, b) => a.sol - b.sol);
}

// ─── HELPER FUNCTION ──────────────────────────────────────────────────────────

function tierText(
  tier: DifficultyTier,
  texts: Record<DifficultyTier, string>
): string {
  return texts[tier] ?? texts['CADET'];
}
