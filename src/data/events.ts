import type { MissionEvent } from '../types/game';

export const MISSION_EVENTS: MissionEvent[] = [
  {
    id: 'sol-01-arrival',
    sol: 1,
    title: 'Touchdown at Shackleton Rim',
    urgency: 'INFO',
    weatherNotice: 'Solar irradiance 1361 W/m² · Horizon altitude 1.2°',
    nasaCitation: {
      title: 'NASA Lunar Reconnaissance Orbiter (LOLA)',
      docNumber: 'LRO-LOLA-DEM-2021',
      description: 'Shackleton crater rim features Peaks of Eternal Light with 86–92% continuous sunlight during lunar summer.'
    },
    comicPanels: [
      {
        speaker: 'CADET_MAYA',
        dialogue: "Dadu, look out the window! The lunar dust is glowing under the sun, and the crater rim stretches forever!",
        mood: 'excited',
        illustrationType: 'ROVER_SURVEY'
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: "Welcome to our new home, Maya! But remember Rule 1 of spaceflight: Before we unpack our science tools, we must secure our power grid and life support.",
        mood: 'heroic',
        illustrationType: 'ROVER_SURVEY'
      }
    ],
    options: [
      {
        id: 'opt-deploy-solar',
        title: 'Deploy Tall Vertical Solar Towers (VSAT)',
        description: 'Maximize daytime solar harvesting to charge battery reserves for the base.',
        tradeOffText: 'High power gain, but delays rover exploration.',
        resourceDelta: { power: +30, science: +10, water: -5 },
        consequenceNarrative: 'The solar arrays unfold smoothly into the sunlight, filling the battery capacitors with clean energy.',
        educationalInsight: 'Vertical solar towers catch low-angle lunar sunlight even when the sun is right on the horizon.'
      },
      {
        id: 'opt-quick-science',
        title: 'Immediate Surface Sample Core Drilling',
        description: 'Take the rover out to grab fresh regolith samples before setting up the full grid.',
        tradeOffText: 'High science jump, but leaves outpost on temporary emergency batteries.',
        resourceDelta: { science: +40, power: -15, crewHealth: -5 },
        consequenceNarrative: 'Maya retrieves pristine basalt and volcanic glass samples, but the base batteries run uncomfortably low.',
        educationalInsight: 'Scientific exploration without a secured power buffer puts life support systems at immediate risk.'
      },
      {
        id: 'opt-pressurize-hab',
        title: 'ECLSS Diagnostics & Air Leak Sweep',
        description: 'Run 100% diagnostic check on the oxygen scrubbers and nitrogen pressure vessels.',
        tradeOffText: 'Boosts crew safety and oxygen reserve; modest science gain.',
        resourceDelta: { oxygen: +15, crewHealth: +10, power: -10, science: +5 },
        consequenceNarrative: 'The habitat atmospheric seals are verified at 101.3 kPa with zero microscopic leaks.',
        educationalInsight: 'NASA spacesuit and habitat airlocks use two-stage seals to prevent rapid vacuum decompression.'
      }
    ]
  },
  {
    id: 'sol-04-greenhouse-seed',
    sol: 4,
    title: 'First Sprouts in the Lunar Greenhouse',
    urgency: 'MODERATE',
    weatherNotice: 'Hydroponics thermal loop: 21°C · Nutrient pH: 6.2',
    nasaCitation: {
      title: 'NASA BVAD Bioregenerative Life Support',
      docNumber: 'NASA/TP-2015-218570',
      description: 'Crop transpiration recycles wastewater into ultra-pure drinkable humidity while generating 0.5 kg O2 per m² daily.'
    },
    comicPanels: [
      {
        speaker: 'CADET_MAYA',
        dialogue: "Look Dadu! The dwarf wheat and space radishes have sprouted green tiny leaves in the hydro-trays!",
        mood: 'excited',
        illustrationType: 'GREENHOUSE_BLOOM'
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: "Plants are our best crewmates, Maya. They eat our exhaled CO2 and give us back fresh water and air. How much power should we give them?",
        mood: 'curious',
        illustrationType: 'GREENHOUSE_BLOOM'
      }
    ],
    options: [
      {
        id: 'opt-full-spectrum-uv',
        title: 'Full-Spectrum High-Intensity LED Cycle',
        description: 'Run intense 24-hour grow lights to accelerate food production and oxygen recycling.',
        tradeOffText: 'Produces rapid food and oxygen, but consumes heavy electrical power.',
        resourceDelta: { food: +6, oxygen: +10, power: -20, water: -15 },
        consequenceNarrative: 'The greenhouse glows bright purple. Leaves double in size overnight, filling the air with fresh oxygen.',
        educationalInsight: 'High-intensity LED farming speeds plant growth but demands up to 30% of total habitat electrical load.'
      },
      {
        id: 'opt-eco-crop-cycle',
        title: 'Standard Photoperiod Energy Saving',
        description: 'Run 14-hour lighting cycle balanced with regular habitat operations.',
        tradeOffText: 'Moderate growth; safe, sustainable power and water drain.',
        resourceDelta: { food: +3, oxygen: +5, power: -8, water: -8, science: +10 },
        consequenceNarrative: 'Crops grow steadily at a steady pace without overloading the station power grid.',
        educationalInsight: 'Balanced lighting mimics natural circadian rhythms, preserving plant health without electrical spikes.'
      },
      {
        id: 'opt-dry-rations',
        title: 'Throttle Greenhouse to Dormant Mode',
        description: 'Keep plants alive on minimal water and power while relying on pre-packed freeze-dried rations.',
        tradeOffText: 'Saves critical water and power, but provides zero fresh food or oxygen surplus.',
        resourceDelta: { power: +10, water: +10, food: -2, science: +5 },
        consequenceNarrative: 'Plants enter slow hibernation. You save energy, but the crew is eating freeze-dried pouch paste again.',
        educationalInsight: 'Relying solely on packaged resupply leaves outposts vulnerable if cargo resupply ships are delayed.'
      }
    ]
  },
  {
    id: 'sol-08-water-recycler',
    sol: 8,
    title: 'Water Recovery Loop Maintenance',
    urgency: 'HIGH',
    weatherNotice: 'Urine Processing Assembly (UPA) filter delta-pressure: 180 kPa',
    nasaCitation: {
      title: 'NASA ISS Environmental Control (ECLSS)',
      docNumber: 'NASA-CR-2004-208941',
      description: 'The Water Recovery System purifies gray water and perspiration condensate to >98% purity, exceeding municipal tap water.'
    },
    comicPanels: [
      {
        speaker: 'SYSTEM_AI',
        dialogue: "Warning: Particulate buildup detected in Catalytic Oxidation reactor. Water recovery efficiency dropping from 93% to 64%.",
        mood: 'warning',
        illustrationType: 'WATER_LEAK'
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: "In space, every single drop of water must be reused—yesterday's coffee is tomorrow's coffee! We need to fix this loop immediately.",
        mood: 'worried',
        illustrationType: 'WATER_LEAK'
      }
    ],
    options: [
      {
        id: 'opt-deep-purge-filters',
        title: 'Deep Thermal Purge & Filter Overhaul',
        description: 'Divert 18 kW of battery power to bake out contaminants and replace nanofilters.',
        tradeOffText: 'Restores 100% water recycling; costs significant power and crew labor.',
        resourceDelta: { water: +25, power: -18, crewHealth: +5, science: +5 },
        consequenceNarrative: 'After 4 hours of wrenching, pure crystal water fills the reserve tanks at maximum flow.',
        educationalInsight: 'Closed-loop water recycling on the ISS recovers over 98% of all moisture, saving tons in rocket payload.'
      },
      {
        id: 'opt-water-ration',
        title: 'Ration Water & Run on Low Flow',
        description: 'Postpone filter repair to keep power available for the telescope instruments.',
        tradeOffText: 'Saves power for science, but crew must ration water and hygiene.',
        resourceDelta: { science: +35, power: +5, water: -20, crewHealth: -15 },
        consequenceNarrative: 'Science data flows back to Earth, but the crew is thirsty, fatigued, and water reserves are shrinking fast.',
        educationalInsight: 'Water dehydration rapidly degrades astronaut cognition, motor skills, and reaction speed.'
      },
      {
        id: 'opt-melt-ice-rover',
        title: 'Emergency Cryo-Drill Rover Trip to Shackleton Floor',
        description: 'Drive the rover down into the permanent dark crater floor to scrape ice chunks.',
        tradeOffText: 'Huge water payoff, but high battery drain and dangerous steep terrain.',
        resourceDelta: { water: +35, power: -22, science: +20, radiation: +10 },
        consequenceNarrative: 'The rover ascends with 50 kg of pure primordial lunar ice! Water reserves are saved, but rover batteries are drained.',
        educationalInsight: 'Permanently Shadowed Regions (PSRs) on the Moon remain at -246°C and trap billions of tons of water ice.'
      }
    ]
  },
  {
    id: 'sol-12-solar-flare',
    sol: 12,
    title: 'SPACE WEATHER ALERT: Class X Solar Flare',
    urgency: 'CRITICAL',
    weatherNotice: 'NASA DONKI Alert: Coronal Mass Ejection impact in 6 hours · Solar flux > 10,000 pfu',
    nasaCitation: {
      title: 'NASA DONKI & Space Radiation Analysis Group (SRAG)',
      docNumber: 'NASA-SP-2009-3401',
      description: 'Solar Energetic Particle (SEP) events can deliver lethal radiation doses without 1–2 meters of regolith or water shielding.'
    },
    comicPanels: [
      {
        speaker: 'HOUSTON_CAPCOM',
        dialogue: "Outpost Shackleton, Houston here. SOHO satellite detects a major X3.4 flare erupting from Active Region 3842. Take cover!",
        mood: 'warning',
        illustrationType: 'SUN_FLARE'
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: "Maya, drop the outside tools right now! The Sun just sneezed high-energy protons straight at us. We have 6 hours to bunker down!",
        mood: 'heroic',
        illustrationType: 'SUN_FLARE'
      }
    ],
    options: [
      {
        id: 'opt-seal-storm-vault',
        title: 'Full Evacuation to the Underground Regolith Vault',
        description: 'Huddle crew in the water-jacketed storm shelter under 2 meters of sintered lunar regolith.',
        tradeOffText: 'Zero radiation damage to crew; halts exterior science and drains shelter life support.',
        resourceDelta: { radiation: +5, crewHealth: +5, science: 0, power: -15, water: -5 },
        consequenceNarrative: 'The blast of protons peppers the outer shell, but inside the dense regolith vault, the crew is 100% safe.',
        educationalInsight: 'Lunar regolith (soil) is rich in silica and alumina, serving as a natural shield against cosmic rays.'
      },
      {
        id: 'opt-finish-rover-run',
        title: 'Rush the Rover to Finish the Seismic Sensor Array',
        description: 'Keep the rover outside for 90 minutes to deploy the final deep-lunar earthquake sensor.',
        tradeOffText: 'Massive science breakthrough, but crew absorbs a severe radiation dose.',
        resourceDelta: { science: +60, radiation: +35, crewHealth: -25, power: -10 },
        consequenceNarrative: 'The seismic sensor is deployed! But Maya and Dadu emerge with dosimeter alarms blaring at dangerous levels.',
        educationalInsight: 'Acute radiation exposure causes nausea and immune suppression; astronauts must balance bravery with health limits.'
      },
      {
        id: 'opt-magnetic-shield',
        title: 'Activate Experimental Active Magnetic Deflector',
        description: 'Route maximum capacitor charge into superconducting magnetic coils to deflect charged particles.',
        tradeOffText: 'Protects entire habitat without bunkering, but consumes 40% of outpost battery storage.',
        resourceDelta: { power: -40, radiation: +10, science: +25, crewHealth: 0 },
        consequenceNarrative: 'A shimmering magnetic aura deflects the solar wind like a mini-Earth magnetosphere! The power grid barely survives.',
        educationalInsight: 'Active electromagnetic shielding mimics Earth’s magnetic field to bend incoming solar protons away from habitats.'
      }
    ]
  },
  {
    id: 'sol-16-lunar-sunset',
    sol: 16,
    title: 'The Great Lunar Night Approaches',
    urgency: 'CRITICAL',
    weatherNotice: 'Solar elevation dropping to 0.0° · Surface temp dropping to -130°C',
    nasaCitation: {
      title: 'NASA Kilopower & Surface Power Architecture',
      docNumber: 'NASA-TM-2018-219801',
      description: 'A lunar night lasts 354 hours (14 Earth days). Solar panels produce 0 kW, requiring fission reactors or massive battery mass.'
    },
    comicPanels: [
      {
        speaker: 'CADET_MAYA',
        dialogue: "Dadu, the sun is dipping below the mountain rim! The shadows are stretching like giant black rivers. Are we going to freeze?",
        mood: 'worried',
        illustrationType: 'LUNAR_NIGHT'
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: "Don't be afraid, Maya. Space is cold, but good engineering keeps us warm. It's time to choose how we survive the two-week darkness.",
        mood: 'heroic',
        illustrationType: 'LUNAR_NIGHT'
      }
    ],
    options: [
      {
        id: 'opt-spin-up-kilopower',
        title: 'Ignite 10 kWe Kilopower Fission Core',
        description: 'Deploy the Stirling nuclear reactor to provide uninterrupted 24/7 electricity and radiant heat.',
        tradeOffText: 'Abundant continuous power through the night; requires cooling radiator management.',
        resourceDelta: { power: +45, oxygen: +10, water: +5, crewHealth: +10, science: +15 },
        consequenceNarrative: 'The sodium heat pipes hum to life. Warmth spreads through every module while the outside plummets to -130°C.',
        educationalInsight: 'NASA Kilopower uses Stirling engines with solid uranium cores to supply reliable power through years of darkness.'
      },
      {
        id: 'opt-conserve-batteries',
        title: 'Emergency Battery Power-Save Mode',
        description: 'Shut off external floodlights, greenhouse grow lights, and scientific instruments to hoard battery charge.',
        tradeOffText: 'Saves batteries; zero science progress and greenhouse crops freeze into dormancy.',
        resourceDelta: { power: -10, food: -5, science: 0, crewHealth: -5 },
        consequenceNarrative: 'The outpost dims to red emergency mood lights. The crew huddles in thermal sleeping bags, counting every watt.',
        educationalInsight: 'Relying purely on batteries for 354 hours of night requires tons of heavy lithium mass on resupply rockets.'
      },
      {
        id: 'opt-subsurface-thermal-well',
        title: 'Tap Geothermal Core Regolith Heat Well',
        description: 'Pump heated glycol through deep drilled holes to circulate trapped subsurface warmth.',
        tradeOffText: 'Moderately sustains thermal life support; drains pump power.',
        resourceDelta: { power: -15, crewHealth: +5, oxygen: +5, science: +10 },
        consequenceNarrative: 'Regolith heat exchangers keep the living habitat cozy at +20°C with steady moderate power draw.',
        educationalInsight: 'Just 1–2 meters below the lunar surface, temperatures stabilize at a constant -20°C, insulating against outer extremes.'
      }
    ]
  },
  {
    id: 'sol-20-meteoroid-strike',
    sol: 20,
    title: 'Micrometeoroid Hull Impact',
    urgency: 'HIGH',
    weatherNotice: 'Hull Acoustic Sensor: Hypervelocity particle strike (8 km/s) on Habitat Module B',
    nasaCitation: {
      title: 'NASA Meteoroid Environment Office (MEO)',
      docNumber: 'NASA-SP-8042',
      description: 'Dust grains traveling at 11 to 72 km/s carry kinetic energy capable of penetrating unshielded thin aluminum hulls.'
    },
    comicPanels: [
      {
        speaker: 'SYSTEM_AI',
        dialogue: "Depressurization alarm! Hull breach detected in Science Airlock. Pressure drop: 0.5 kPa per second!",
        mood: 'warning',
        illustrationType: 'AIRLOCK'
      },
      {
        speaker: 'CADET_MAYA',
        dialogue: "I hear the hissing air! It's leaking near the telescope sample locker! What do we do?!",
        mood: 'worried',
        illustrationType: 'AIRLOCK'
      }
    ],
    options: [
      {
        id: 'opt-quick-seal-foam',
        title: 'Emergency Self-Healing Epoxy Foam Seal',
        description: 'Deploy expandable polyurethane sealant over the puncture hole from inside.',
        tradeOffText: 'Stops air loss instantly; preserves science samples; consumes spare maintenance kit.',
        resourceDelta: { oxygen: -5, power: -5, crewHealth: +5, science: +15 },
        consequenceNarrative: 'Maya slaps the magnetic foam patch onto the puncture. The foam expands and hardens instantly—the hissing stops!',
        educationalInsight: 'Modern spacecraft use multi-layer Whipple shields and reactive polymer sealants to stop micro-punctures.'
      },
      {
        id: 'opt-bulkhead-vent',
        title: 'Seal Bulkhead Doors & Vent Airlock to Vacuum',
        description: 'Sacrifice the unpressurized module to protect the central habitat quarters.',
        tradeOffText: '100% crew safety, but destroys unsealed science samples and loses trapped air.',
        resourceDelta: { oxygen: -20, science: -20, power: +5, crewHealth: +10 },
        consequenceNarrative: 'The heavy steel bulkhead slams shut. The outer airlock vents into space—safe, but valuable samples are lost.',
        educationalInsight: 'Subdividing spacecraft into sealed pressure compartments prevents a single hole from destroying the entire base.'
      },
      {
        id: 'opt-eva-exterior-patch',
        title: 'Immediate Spacewalk EVA Regolith Sintering Repair',
        description: 'Suit up immediately and 3D-melt regolith over the exterior hull to reinforce structural armor.',
        tradeOffText: 'Strong permanent fix; burns crew stamina and raises radiation dosimeter count.',
        resourceDelta: { crewHealth: -15, radiation: +15, oxygen: -10, science: +20 },
        consequenceNarrative: 'Working in the dark, Dadu uses the solar thermal lance to melt lunar soil into basalt glass over the hole.',
        educationalInsight: 'Microwave and laser sintering transforms loose lunar dirt into solid rock stronger than concrete.'
      }
    ]
  },
  {
    id: 'sol-24-ice-core-breakthrough',
    sol: 24,
    title: 'Major Scientific Breakthrough: Primordial Ice Core',
    urgency: 'MODERATE',
    weatherNotice: 'Deep Drill Rig: 3.8 meters depth · Volatiles spectrometer: H2O, NH3, CO2 signatures',
    nasaCitation: {
      title: 'NASA VIPER Rover & Artemis Science Plan',
      docNumber: 'NASA-SP-2020-0012',
      description: 'Lunar polar cold traps hold billions-of-years-old water ice that reveals the primordial history of the inner Solar System.'
    },
    comicPanels: [
      {
        speaker: 'CADET_MAYA',
        dialogue: "Dadu! The mass spectrometer is singing! Look at this drill core: it's sparkling with ancient ice and amino acid building blocks!",
        mood: 'excited',
        illustrationType: 'ICE_DISCOVERY'
      },
      {
        speaker: 'COMMANDER_DADU',
        dialogue: "This is what we came for, Maya. This single core sample could rewrite textbooks across the entire world! How do we process it?",
        mood: 'heroic',
        illustrationType: 'ICE_DISCOVERY'
      }
    ],
    options: [
      {
        id: 'opt-deep-cryo-analysis',
        title: 'Comprehensive Mass Spectrometry & Earth Transmission',
        description: 'Power up every scientific laser and beam high-bandwidth telemetry to NASA Goddard.',
        tradeOffText: 'Huge research milestone; requires heavy antenna transmission power.',
        resourceDelta: { science: +80, power: -25, water: +10 },
        consequenceNarrative: 'NASA mission control erupts in cheers on Earth! Data confirms 4-billion-year-old comet volatiles.',
        educationalInsight: 'Water ice on the Moon contains trapped isotopic clues from comets that brought water to early Earth.'
      },
      {
        id: 'opt-fuel-electrolysis',
        title: 'Electrolyze Half the Ice into Rocket Propellant',
        description: 'Melt the core and split water into liquid Hydrogen (LH2) and Oxygen (LOX) for our return lander.',
        tradeOffText: 'Secures return rocket propellant and emergency oxygen; moderate science gain.',
        resourceDelta: { oxygen: +25, water: +20, power: -20, science: +30 },
        consequenceNarrative: 'The fuel tanks fill with cryogenic rocket propellant. Our mission safety margin just doubled!',
        educationalInsight: 'In-Situ Resource Utilization (ISRU) makes space exploration sustainable by making rocket fuel on the Moon.'
      },
      {
        id: 'opt-safe-storage',
        title: 'Seal in Cryo-Vault for Sample Return to Earth',
        description: 'Store the core at -200°C without melting to bring it back physically for laboratory study.',
        tradeOffText: 'Balanced science gain; minimal immediate power draw.',
        resourceDelta: { science: +50, power: -5, food: +2 },
        consequenceNarrative: 'The sample is sealed into an insulated vacuum container ready for the Artemis return capsule.',
        educationalInsight: 'Pristine samples brought back to Earth can be examined with microscopes and instruments too large to launch to space.'
      }
    ]
  },
  {
    id: 'sol-28-final-resupply-or-endurance',
    sol: 28,
    title: 'The Final Stretch: 48 Hours to Science Target',
    urgency: 'HIGH',
    weatherNotice: 'Mission Clock: Sol 28/30 · Earth Comm Window: High Bandwidth DSN Link Open',
    nasaCitation: {
      title: 'NASA Artemis Accord & Lunar Architecture',
      docNumber: 'NASA-NP-2021-05-2900',
      description: 'Long-duration space expedition success is defined by closed-loop recycling, low mission loss, and high science return.'
    },
    comicPanels: [
      {
        speaker: 'COMMANDER_DADU',
        dialogue: "We have only two days left in our 30-sol expedition, Maya. We're close to our science target, but our systems are stretched thin.",
        mood: 'heroic',
        illustrationType: 'MISSION_VICTORY'
      },
      {
        speaker: 'CADET_MAYA',
        dialogue: "We've faced dark nights, flying space dirt, and leaky pipes—and we're still standing! Let's finish strong, Commander!",
        mood: 'excited',
        illustrationType: 'MISSION_VICTORY'
      }
    ],
    options: [
      {
        id: 'opt-final-science-push',
        title: 'All-Out Autonomous Planetary Survey Sweep',
        description: 'Run all rover cameras, radar arrays, and greenhouse spectroscopy simultaneously.',
        tradeOffText: 'Huge final science score jump; risks draining remaining power reserves to critical.',
        resourceDelta: { science: +60, power: -25, crewHealth: -10, oxygen: -5 },
        consequenceNarrative: 'Instruments work overtime! Terabytes of lunar discoveries beam through the Deep Space Network to Earth.',
        educationalInsight: 'Mission final sprints maximize data collection before scientific spacecraft enter hibernation.'
      },
      {
        id: 'opt-stabilize-all-systems',
        title: 'Safety-First System Conservation & Station Handover',
        description: 'Charge all batteries, flush water filters, and leave the outpost fully nominal for the next crew.',
        tradeOffText: 'Ensures 100% survival; guarantees spotless crew health score; moderate science gain.',
        resourceDelta: { power: +20, water: +15, oxygen: +15, crewHealth: +20, science: +25 },
        consequenceNarrative: 'Every meter reads green. Outpost Shackleton stands as a beacon of human resilience, ready for the next crew.',
        educationalInsight: 'Leaving a lunar base in a certified nominal state allows future astronaut missions to dock and survive safely.'
      },
      {
        id: 'opt-live-classroom-downlink',
        title: 'Live High-Definition Downlink to Earth Classrooms',
        description: 'Broadcast Maya and Dadu’s interactive tour directly to millions of school students in Bangladesh and worldwide.',
        tradeOffText: 'Boosts global educational inspiration score; moderate science jump.',
        resourceDelta: { science: +40, crewHealth: +15, power: -10 },
        consequenceNarrative: 'Millions of children watch Maya demonstrate growing radishes in lunar regolith. The next generation of scientists is born!',
        educationalInsight: 'NASA missions prioritize public engagement and STEM education to inspire the engineers and astronauts of tomorrow.'
      }
    ]
  }
];
