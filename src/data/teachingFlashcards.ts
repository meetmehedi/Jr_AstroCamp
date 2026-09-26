/**
 * teachingFlashcards.ts
 * STEM Science Teaching Flashcard Database
 * Audio-narrated educational cards for intergenerational learning (ages 3 to 80+)
 */

import type { DifficultyTier } from './difficultyTiers';

export interface TeachingFlashcard {
  id: string;
  title: string;
  category: 'LIFE_SUPPORT' | 'RADIATION' | 'ENERGY' | 'GEOLOGY' | 'PROPULSION' | 'ASTROBIOLOGY';
  emoji: string;
  equationOrFormula?: string;
  shortSummary: string;
  audioScript: string;
  ageAdaptations: Record<DifficultyTier, {
    text: string;
    keyTakeaway: string;
  }>;
  nasaDocReference: string;
}

export const TEACHING_FLASHCARDS: TeachingFlashcard[] = [
  {
    id: 'card-sabatier',
    title: 'Sabatier Methanation (CO2 to Water)',
    category: 'LIFE_SUPPORT',
    emoji: '💧',
    equationOrFormula: 'CO₂ + 4H₂ ➔ CH₄ + 2H₂O  (ΔH = -165 kJ/mol at 400°C)',
    shortSummary: 'Recycles exhaled carbon dioxide into drinkable water and methane rocket fuel.',
    audioScript: 'Did you know astronauts can turn their exhaled breath into pure water? Inside the Sabatier reactor, carbon dioxide mixes with hydrogen at 400 degrees Celsius to create pure water and methane fuel!',
    ageAdaptations: {
      EXPLORER: {
        text: 'When you breathe out, the air goes into a magic warm box that makes fresh clean water for you to drink!',
        keyTakeaway: 'Your breath makes water in space!'
      },
      CADET: {
        text: 'The Sabatier machine takes exhaled CO2 from astronauts, mixes it with hydrogen gas, and uses high heat to create fresh water and methane.',
        keyTakeaway: 'Closed-loop recycling turns waste gas into drinking water.'
      },
      ENGINEER: {
        text: 'A nickel-catalyst exothermic reactor operated at 400°C. Hydrogen from electrolysis reduces metabolic CO2 to produce water at 81.8% theoretical yield.',
        keyTakeaway: 'Closes ~50% of the oxygen loop when paired with water electrolysis.'
      },
      SCIENTIST: {
        text: 'CO2 + 4H2 → CH4 + 2H2O. Nickel or ruthenium catalyst supported on alumina. Exothermic reaction (ΔH = -165 kJ/mol). Product water is electrolyzed (2H2O → 2H2 + O2) to supply metabolic oxygen.',
        keyTakeaway: 'Recovers oxygen locked in metabolic CO2 with Carter (2009) ISS flight heritage.'
      },
      COMMANDER: {
        text: 'ISS Sabatier EDU recovers 0.818 kg H2O per kg CO2 scrubbed by CDRA. Eliminates up to 540 kg of water resupply mass annually for a 4-person expedition (Abney et al. 2012, AIAA-2012-3518).',
        keyTakeaway: 'ECLSS loop closure architecture critical for Mars transit.'
      }
    },
    nasaDocReference: 'NASA/TP-2015-218570 (BVAD) Sect. 4.3 + Abney (AIAA-2012-3518)'
  },
  {
    id: 'card-regolith-shielding',
    title: 'Lunar Regolith Radiation Attenuation',
    category: 'RADIATION',
    emoji: '🛡️',
    equationOrFormula: 'I = I₀ · e^(-μ·x)  |  ρ ≈ 1.8 g/cm³  |  x = 200 cm',
    shortSummary: 'Natural lunar soil blocks dangerous galactic cosmic rays and solar storm protons.',
    audioScript: 'The Moon has no thick atmosphere like Earth. But lunar dirt, called regolith, is full of minerals! Two meters of compacted regolith shields astronauts just like a two-foot concrete bomb shelter.',
    ageAdaptations: {
      EXPLORER: {
        text: 'Moon dirt is super-strong armor! When the sun gets angry, we hide under 2 meters of dirt and stay 100% safe!',
        keyTakeaway: 'Moon soil protects us from space rays!'
      },
      CADET: {
        text: 'Earth has an atmosphere and magnetic field to protect us. On the Moon, astronauts bury their habitats under 2 meters of moon soil to block solar radiation.',
        keyTakeaway: '2 meters of regolith reduces radiation by 95%.'
      },
      ENGINEER: {
        text: 'Compacted lunar regolith (bulk density 1.8 g/cm³) provides an areal density of 360 g/cm² at 2m depth. Attenuates solar energetic protons up to 300 MeV via nuclear fragmentation.',
        keyTakeaway: 'Passive mass shielding eliminates electrical power dependency during storms.'
      },
      SCIENTIST: {
        text: 'Radiation dose equivalent rate drops from 0.67 mSv/day (unshielded GCR) to <0.04 mSv/day under 2m sintered regolith. Bragg peak energy absorption protects blood-forming organs per NASA-STD-3001 Table 6.1.',
        keyTakeaway: 'Complies with NCRP Report 132 career limits.'
      },
      COMMANDER: {
        text: 'Trade study: Active superconducting magnets (500 kW, TRL 3) vs passive regolith burial (zero power, TRL 9). Regolith burial dominates on reliability, cost, and micrometeoroid mitigation (Townsend & Wilson 1992).',
        keyTakeaway: 'Standardize habitat architecture on in-situ regolith overburden.'
      }
    },
    nasaDocReference: 'Townsend & Wilson (1992) Health Physics 62:273 + NASA-STD-3001 Vol 1'
  },
  {
    id: 'card-kilopower',
    title: 'Kilopower Fission Surface Power',
    category: 'ENERGY',
    emoji: '⚛️',
    equationOrFormula: '²³⁵U + n ➔ Fission Fragments + 2.5n + 200 MeV',
    shortSummary: 'Compact nuclear fission reactor supplying 10 kilowatts of continuous 24/7 power.',
    audioScript: 'When the 14-day lunar night arrives, solar panels go completely dark. NASA’s Kilopower reactor splits uranium atoms to generate heat, which Stirling engines turn into electricity non-stop for 10 years.',
    ageAdaptations: {
      EXPLORER: {
        text: 'A tiny machine that splits special warm rocks to make electricity all night long, even when the sun goes to sleep!',
        keyTakeaway: 'Power that works in the dark!'
      },
      CADET: {
        text: 'Kilopower uses uranium nuclear fuel to make heat, which drives a Stirling engine piston to produce continuous electricity during the 354-hour lunar night.',
        keyTakeaway: '10 kilowatts of reliable power day and night.'
      },
      ENGINEER: {
        text: 'U-235 molybdenum alloy core operating at 800°C. Passive sodium heat pipes transport thermal energy to dual Stirling convertors at 22% thermal-to-electric efficiency.',
        keyTakeaway: 'High specific power: 107 W/kg with zero moving fluid pumps.'
      },
      SCIENTIST: {
        text: 'Ground-tested as KRUSTY in 2018 (Gibson et al. NASA/TM-2018-219801). Self-regulating reactor physics via negative reactivity feedback coefficients guarantees passive safety without human intervention.',
        keyTakeaway: 'Validated TRL 6 nuclear surface power for Moon and Mars.'
      },
      COMMANDER: {
        text: 'Energy density comparison: 10 kWe for 354h requires 93 kg of Kilopower hardware vs 5,400 kg of Li-ion battery arrays. Mass savings of 5.3 tonnes per unit directly enables long-duration surface architecture.',
        keyTakeaway: 'Essential baseline power source for Artemis Base Camp.'
      }
    },
    nasaDocReference: 'Gibson et al. (2018) NASA/TM-2018-219801 (KRUSTY Test Results)'
  },
  {
    id: 'card-moxie',
    title: 'MOXIE: Solid Oxide Electrolysis on Mars',
    category: 'PROPULSION',
    emoji: '🔴',
    equationOrFormula: '2CO₂ ➔ 2CO + O₂  (at 800°C Solid Oxide Electrolyzer)',
    shortSummary: 'Breathes in Mars carbon dioxide and breathes out pure breathable oxygen.',
    audioScript: 'Mars has plenty of air, but it is 95 percent carbon dioxide! NASA’s MOXIE experiment on the Perseverance rover heats CO2 to 800 degrees Celsius, stripping away carbon to produce pure breathable oxygen.',
    ageAdaptations: {
      EXPLORER: {
        text: 'Mars air is tickly and yucky for our lungs. MOXIE is a robot baker that bakes the air into fresh clean oxygen!',
        keyTakeaway: 'Making fresh air on Mars!'
      },
      CADET: {
        text: 'MOXIE heats Martian carbon dioxide to 800°C and uses electricity to separate carbon monoxide from pure oxygen gas.',
        keyTakeaway: 'Produces 6 grams of oxygen per hour right on Mars.'
      },
      ENGINEER: {
        text: 'Scandium-stabilized zirconia (YSZ) solid oxide electrolysis cells (SOEC). Compresses Martian atmosphere from 6 Torr to 1 atm and splits CO2 at 800°C with 99.6% purity.',
        keyTakeaway: 'First demonstration of extraterrestrial In-Situ Resource Utilization.'
      },
      SCIENTIST: {
        text: 'Hecht et al. Science Advances (2021). Scaled-up human Mars Ascent Vehicle (MAV) requires 25 metric tons of liquid oxygen (LOX) for return launch. Full-scale MOXIE (25 kW) produces this in 14 months in-situ.',
        keyTakeaway: 'Saves 25,000 kg of launch mass from Earth.'
      },
      COMMANDER: {
        text: 'ISRU propellant economics: Launching 25 tonnes of LOX from Earth to Mars surface requires a 500-tonne rocket at LEO. MOXIE reduces Earth departure stack mass by over 60% (NASA DRA 5.0).',
        keyTakeaway: 'Cornerstone technology for human Mars exploration.'
      }
    },
    nasaDocReference: 'Hecht et al. (2021) Science Advances 7(50):eabj6322'
  },
  {
    id: 'card-ocean-habitability',
    title: 'Europa Subsurface Ocean Hydrothermal Systems',
    category: 'ASTROBIOLOGY',
    emoji: '🧊',
    equationOrFormula: 'Tidal Flexing: Q = (21/2) · (ρ · n⁵ · R⁷ · e² / μ)',
    shortSummary: 'Gravitational tidal tugging from Jupiter heats a warm global ocean beneath 20km ice.',
    audioScript: 'How can an ocean stay liquid 500 million miles from the Sun? Jupiter’s immense gravity constantly squeezes and flexes Europa like a rubber ball, creating hydrothermal vents at the ocean floor!',
    ageAdaptations: {
      EXPLORER: {
        text: 'Giant Jupiter plays tug-of-war with Europa! The squeezing makes deep underwater warm hot tubs where alien fish might swim!',
        keyTakeaway: 'Warm oceans hiding under ice!'
      },
      CADET: {
        text: 'Europa is squeezed by Jupiter’s gravity every 3.5 days. This friction creates underwater volcanoes and hydrothermal vents that keep a global ocean liquid beneath the ice.',
        keyTakeaway: 'More water than all of Earth’s oceans combined.'
      },
      ENGINEER: {
        text: 'Tidal dissipation in Europa’s silicate mantle generates 10¹² Watts of geothermal heat flux. Combined with radiogenic heating, this sustains a 100km-deep liquid water ocean beneath a 15–25km ice shell.',
        keyTakeaway: 'REASON ice-penetrating radar measures ice-ocean boundary.'
      },
      SCIENTIST: {
        text: 'Europa Clipper MASPEX spectrometry targets salt ions (NaCl, MgSO4) and organics entrained in cryovolcanic plumes. Ocean salinity estimated at 30–150 g/kg with pH 7–11, analogous to Earth’s serpentinizing Lost City hydrothermal field.',
        keyTakeaway: 'Meets all four astrobiological criteria for life.'
      },
      COMMANDER: {
        text: 'Europa planetary protection category IVb: Spacecraft trajectory designed to prevent forward contamination of subsurface ocean (P < 10⁻⁴ over 1,000 years). End-of-mission disposal impact into Jupiter.',
        keyTakeaway: 'Strict adherence to COSPAR planetary protection guidelines.'
      }
    },
    nasaDocReference: 'Europa Clipper Science Plan (2024) + Kivelson et al. Science (2000)'
  },
  {
    id: 'card-laser-comm',
    title: 'Deep Space Optical Communications (DSOC)',
    category: 'ENERGY',
    emoji: '📡',
    equationOrFormula: 'Data Rate ∝ (1/λ²)  |  λ = 1550 nm (Near-Infrared)',
    shortSummary: 'Beams gigabits of space data using near-infrared lasers instead of radio waves.',
    audioScript: 'Old radio antennas take hours to download high-definition space video. NASA’s deep space optical communications uses invisible infrared lasers to stream 4K video from beyond Mars in minutes!',
    ageAdaptations: {
      EXPLORER: {
        text: 'We shoot super-fast laser beam lights from the Moon to Earth! They send video in the blink of an eye!',
        keyTakeaway: 'Flashlight beams carrying space movies!'
      },
      CADET: {
        text: 'Instead of slow radio waves, NASA DSOC pulses a 1550nm laser beam to transmit data 10 to 100 times faster across millions of miles.',
        keyTakeaway: 'Streamed high-definition cat video from 19 million miles away!'
      },
      ENGINEER: {
        text: 'Near-infrared laser at 1550nm achieves 267 Mbps at 0.22 AU (Mars distance). Narrow beam divergence (<10 microradians) requires sub-arcsecond flight terminal pointing stability.',
        keyTakeaway: 'Photon-counting superconducting nanowire detector arrays on Earth.'
      },
      SCIENTIST: {
        text: 'Tested on NASA Psyche mission (2023–2024). Downlink speed of 25 Mbps achieved at 1.5 AU (226 million km). Photon efficiency: >1 bit/photon via Pulse Position Modulation (PPM).',
        keyTakeaway: 'Eliminates deep-space telemetry bottleneck for human expeditions.'
      },
      COMMANDER: {
        text: 'Optical comms architecture: 22cm flight laser transceiver consumes 75W vs 200W for Deep Space Network X-band radio, delivering 10x higher data volume. Enables real-time telemedicine and autonomous rover telemetry.',
        keyTakeaway: 'Standardize on NASA SCaN optical terminal architecture.'
      }
    },
    nasaDocReference: 'NASA DSOC Flight Demonstration (2024) + Edwards et al. IEEE Aerospace'
  }
];
