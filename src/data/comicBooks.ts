/**
 * comicBooks.ts
 * Jr_AstroCamp Official STEM Graphic Novel Series
 * Team Mysterio · NASA International Space Apps Challenge 2026
 *
 * SOURCE DOCUMENTS:
 *   Jr_AstroCamp_Curriculum.docx   — defines 6 curriculum modules
 *   Jr_AstroCamp_Comics_FactCheck.docx — corrected, verified comic scripts
 *
 * 6 issues based on real, verified NASA historical missions.
 * All panel scripts fact-checked against NASA primary/secondary sources.
 * "NASA verified" phrasing is intentionally avoided per the fact-check doc.
 */

export interface ComicPanelScene {
  id: string;
  panelNumber: number;
  layout: 'FULL_WIDTH' | 'HALF_LEFT' | 'HALF_RIGHT' | 'ACTION_POP';
  sceneType:
    | 'LAUNCH_PAD'
    | 'ROCKET_STAGING'
    | 'LUNAR_APPROACH'
    | 'SHACKLETON_BASE'
    | 'HYDROPONICS_LAB'
    | 'SOLAR_STORM'
    | 'MARS_DESCENT'
    | 'MOXIE_LAB'
    | 'ASTEROID_DEFENSE'
    | 'DEEP_SPACE_ANTENNA';
  caption?: string;
  sfx?: {
    text: string;
    color: string;
    position: 'top-right' | 'top-left' | 'center' | 'bottom-right';
  };
  speaker: 'CADET_MAYA' | 'COMMANDER_DADU' | 'HOUSTON_CAPCOM' | 'ASTRO_BOT' | 'DR_ELENA';
  dialogue: string;
  speechType: 'SPEECH' | 'THOUGHT' | 'RADIO' | 'ALARM';
  mood: 'curious' | 'excited' | 'heroic' | 'worried' | 'determined';
  stemFactHotspot?: {
    title: string;
    fact: string;
    formula?: string;
  };
}

export interface ComicIssue {
  id: string;
  issueNumber: number;
  title: string;
  subtitle: string;
  coverBadge: string;
  coverThemeColor: string;
  curriculumCategory: 'PROPULSION' | 'LUNAR_GEOLOGY' | 'LIFE_SUPPORT' | 'RADIATION_PHYSICS' | 'AERODYNAMICS' | 'ISRU_CHEMISTRY' | 'ORBITAL_MECHANICS' | 'TELECOMMUNICATIONS';
  gradeLevel: 'Cadet (Ages 3-7)' | 'Explorer (Ages 8-13)' | 'Commander (Ages 14-19)' | 'All Ages';
  synopsis: string;
  curriculumStandards: string[];
  nasaMissionTieIn: string;
  nasaDocumentCitation: string;
  pages: {
    pageNumber: number;
    pageTitle: string;
    panels: ComicPanelScene[];
  }[];
  comprehensionQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  handsOnExperiment: {
    title: string;
    materials: string[];
    instructions: string;
    whyItWorks: string;
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// ISSUE 1 — Module 1: Launch · "Friendship 7" (February 20, 1962)
// Sources: NASA Mercury-Atlas 6 mission page; EBSCO Research Starters
// ─────────────────────────────────────────────────────────────────────────────
export const COMIC_BOOK_ISSUES: ComicIssue[] = [

  // ── ISSUE 1 ──
  {
    id: 'issue-01-friendship-7',
    issueNumber: 1,
    title: 'Friendship 7',
    subtitle: 'Thrust, Drag, Staging & Orbit · Module 1: Launch',
    coverBadge: 'ISSUE #1 · LAUNCH',
    coverThemeColor: '#38bdf8',
    curriculumCategory: 'PROPULSION',
    gradeLevel: 'All Ages',
    synopsis: 'February 20, 1962. John Glenn climbs aboard Friendship 7 atop an Atlas rocket at Cape Canaveral. He will become the first American to orbit Earth — but a clogged thruster and a faulty sensor reading will force the crew and Mission Control to make hard decisions at 17,500 mph.',
    curriculumStandards: [
      'MS-PS2-1: Newton Third Law — action and reaction forces',
      'MS-PS2-2: Motion depends on the sum of forces and the object mass',
      'MS-PS3-1: Kinetic energy increases with speed',
      'Rocket staging: shedding empty mass to increase velocity',
      'Orbit defined: moving fast enough horizontally to keep falling around Earth',
    ],
    nasaMissionTieIn: 'Mercury-Atlas 6 — John Glenn three-orbit flight, Feb 20 1962',
    nasaDocumentCitation: 'NASA Mercury-Atlas 6 mission page (nasa.gov/missions/mercury/mercury-atlas-6/); EBSCO Research Starters, John Glenn Friendship 7',
    pages: [
      {
        pageNumber: 1,
        pageTitle: 'On the Pad at Cape Canaveral',
        panels: [
          {
            id: 'f7-p1-1',
            panelNumber: 1,
            layout: 'FULL_WIDTH',
            sceneType: 'LAUNCH_PAD',
            caption: 'Cape Canaveral, Florida. February 20, 1962. John Glenn straps into Friendship 7 — a capsule barely bigger than a phone booth — on top of a thin-walled Atlas rocket.',
            speaker: 'HOUSTON_CAPCOM',
            dialogue: 'Glenn, you are go for launch. Godspeed, John Glenn.',
            speechType: 'RADIO',
            mood: 'heroic',
            stemFactHotspot: {
              title: 'The Atlas Rocket',
              fact: 'The Atlas had no rigid frame — its thin steel skin was pressurised like a balloon to stay rigid. It burned liquid oxygen and RP-1 kerosene to produce 360,000 pounds of thrust.',
              formula: 'Thrust (F) = mass-flow-rate x exhaust-velocity',
            },
          },
          {
            id: 'f7-p1-2',
            panelNumber: 2,
            layout: 'HALF_LEFT',
            sceneType: 'LAUNCH_PAD',
            sfx: { text: 'ROOAAR!', color: '#f59e0b', position: 'top-right' },
            speaker: 'CADET_MAYA',
            dialogue: 'Dadu, imagine sitting on top of that! Why not just use a bigger plane instead?',
            speechType: 'SPEECH',
            mood: 'curious',
            stemFactHotspot: {
              title: 'Why Not a Plane?',
              fact: 'Planes fly by pushing air under their wings — there is no air in space. A rocket carries its own oxygen so it can burn fuel in the vacuum of space and push itself by throwing exhaust mass backwards.',
            },
          },
          {
            id: 'f7-p1-3',
            panelNumber: 3,
            layout: 'HALF_RIGHT',
            sceneType: 'ROCKET_STAGING',
            speaker: 'COMMANDER_DADU',
            dialogue: 'Because a plane needs air to fly, Maya. Glenn must reach 17,500 miles per hour — fast enough that Earth curves away beneath him as fast as gravity pulls him down. That is what an orbit is.',
            speechType: 'SPEECH',
            mood: 'determined',
            stemFactHotspot: {
              title: 'What Is Orbit?',
              fact: 'Orbit is not escaping gravity. It is falling around Earth so fast that the ground curves away beneath you as quickly as you fall. At 7.9 km/s (about 17,500 mph), you keep missing Earth forever.',
            },
          },
        ],
      },
      {
        pageNumber: 2,
        pageTitle: 'Trouble in Orbit — Manual Control',
        panels: [
          {
            id: 'f7-p2-1',
            panelNumber: 4,
            layout: 'FULL_WIDTH',
            sceneType: 'ROCKET_STAGING',
            caption: 'The Atlas booster cuts off and separates. Friendship 7 is in orbit — three planned circuits of Earth. But minutes later, a clogged yaw thruster forces Glenn onto manual control.',
            speaker: 'HOUSTON_CAPCOM',
            dialogue: 'Glenn, we show a yaw jet problem. Switch to manual and hold attitude yourself.',
            speechType: 'RADIO',
            mood: 'worried',
            sfx: { text: 'CLANK!', color: '#38bdf8', position: 'top-left' },
          },
          {
            id: 'f7-p2-2',
            panelNumber: 5,
            layout: 'HALF_LEFT',
            sceneType: 'LAUNCH_PAD',
            caption: 'A faulty sensor suggests the heat-shield latch may be loose. Engineers decide: keep the retropack strapped on during re-entry as a precaution.',
            speaker: 'HOUSTON_CAPCOM',
            dialogue: 'We want you to leave the retropack on through re-entry. Do not jettison it.',
            speechType: 'RADIO',
            mood: 'worried',
            stemFactHotspot: {
              title: 'Why Keep the Retropack On?',
              fact: 'The retropack straps held the retrograde rockets at the base of the heat shield. Engineers hoped the straps would hold the shield on if the latch was truly loose. The sensor turned out to be faulty — the shield was fine.',
            },
          },
          {
            id: 'f7-p2-3',
            panelNumber: 6,
            layout: 'HALF_RIGHT',
            sceneType: 'SOLAR_STORM',
            caption: 'Re-entry. Chunks of burning retropack peel away outside the window. Glenn radios calmly. Splashdown in the Atlantic. The heat shield held.',
            speaker: 'CADET_MAYA',
            dialogue: 'So he flew three orbits, dealt with a broken thruster AND a scary heat shield warning, and still came home safely? That is what a real astronaut does.',
            speechType: 'SPEECH',
            mood: 'heroic',
            stemFactHotspot: {
              title: 'Re-entry Heating',
              fact: 'Compressing air at orbital speed generates temperatures of about 1,650 degrees Celsius. The blunt heat shield ablated — burned away layer by layer — to carry that heat away from the capsule.',
            },
          },
        ],
      },
    ],
    comprehensionQuiz: [
      {
        question: 'John Glenn flew three orbits aboard Friendship 7. What does orbit mean?',
        options: [
          'Flying straight up until gravity stops',
          'Moving so fast sideways that Earth curves away beneath you as quickly as you fall',
          'Floating weightless above the clouds',
          'Circling the Moon at high speed',
        ],
        correctIndex: 1,
        explanation: 'Orbit is continuous free-fall around Earth. At about 17,500 mph, the surface curves away as fast as gravity pulls you down, so you keep going around without hitting the ground.',
      },
      {
        question: 'Why did Mission Control tell Glenn to keep his retropack attached during re-entry?',
        options: [
          'To slow down using extra rocket thrust',
          'To look good on camera during re-entry',
          'As a precaution because a sensor suggested the heat-shield latch might be loose',
          'Because the retropack provided oxygen for the crew',
        ],
        correctIndex: 2,
        explanation: 'A faulty sensor suggested the heat-shield latch was loose. Engineers hoped the retropack straps would hold the shield on. The sensor was wrong — the shield was fine — but keeping the pack on was the right call given what they knew.',
      },
      {
        question: 'What forced Glenn to switch to manual attitude control during his orbit?',
        options: [
          'Houston wanted to test his piloting skills',
          'A clogged yaw thruster made the automatic system unable to hold attitude',
          'The radio signal broke',
          'He was low on fuel and had to save it',
        ],
        correctIndex: 1,
        explanation: 'A clogged yaw thruster stopped working. Glenn flew the rest of the mission by hand, keeping the capsule pointed correctly through re-entry.',
      },
    ],
    handsOnExperiment: {
      title: 'Balloon Rocket Staging',
      materials: ['Two long balloons', '3 metres of string', 'Two drinking straws', 'Tape'],
      instructions: 'Thread string through both straws and tie it taut across a room. Inflate each balloon and hold without tying. Tape balloon A to straw 1 and balloon B to straw 2, end to end. Release balloon A. When it deflates and stops, release balloon B — the lighter remaining vehicle surges forward again. This is staging.',
      whyItWorks: 'An empty balloon is dead weight. Releasing it lets the still-inflated stage accelerate a much lighter vehicle. Real rockets drop empty fuel tanks for the same reason — dramatically improving the mass ratio and allowing much higher final speed.',
    },
  },

  // ── ISSUE 2 ──
  {
    id: 'issue-02-gemini-8',
    issueNumber: 2,
    title: 'The Slow Dance',
    subtitle: 'Relative Velocity, Docking & Saving Gemini 8 · Module 2: Docking',
    coverBadge: 'ISSUE #2 · DOCKING',
    coverThemeColor: '#a78bfa',
    curriculumCategory: 'ORBITAL_MECHANICS',
    gradeLevel: 'All Ages',
    synopsis: 'March 16, 1966. Neil Armstrong and Dave Scott complete the world first spacecraft docking — connecting Gemini 8 to an unmanned Agena target vehicle. Then a stuck thruster turns the mission into a life-or-death fight to stop the spinning spacecraft.',
    curriculumStandards: [
      'MS-PS2-2: Motion depends on all forces and mass',
      'Relative velocity: speed of one object compared to another in the same frame',
      'Angular momentum and spin control using thrusters',
      'Emergency decision-making: when to use re-entry thrusters',
    ],
    nasaMissionTieIn: 'Gemini 8 · Neil Armstrong and Dave Scott · March 16 1966',
    nasaDocumentCitation: 'Spaceline Gemini 8 fact sheet (spaceline.org); Space.com, Gemini 8 Achieved First Space Docking 50 Years Ago. NOTE: confirm against NASA Gemini 8 mission transcripts before print.',
    pages: [
      {
        pageNumber: 1,
        pageTitle: 'The Approach — Slow and Steady',
        panels: [
          {
            id: 'g8-p1-1',
            panelNumber: 1,
            layout: 'FULL_WIDTH',
            sceneType: 'ROCKET_STAGING',
            caption: 'Earth orbit, March 16, 1966. Neil Armstrong pilots Gemini 8 toward the unmanned Agena target vehicle — a metal cylinder about the size of a car.',
            speaker: 'CADET_MAYA',
            dialogue: 'Dadu, the Agena is right there! Why does Armstrong not just fly straight at it?',
            speechType: 'SPEECH',
            mood: 'curious',
            stemFactHotspot: {
              title: 'Relative Velocity',
              fact: 'Both spacecraft are already moving at roughly 17,500 mph. Approaching means Armstrong must match the Agena exact speed and direction — if he is going even slightly faster, a collision becomes inevitable.',
              formula: 'Closing speed = velocity-Gemini minus velocity-Agena',
            },
          },
          {
            id: 'g8-p1-2',
            panelNumber: 2,
            layout: 'HALF_LEFT',
            sceneType: 'ROCKET_STAGING',
            speaker: 'COMMANDER_DADU',
            dialogue: 'Both ships are already doing 17,500 miles per hour. Armstrong must match the Agena exact speed and angle — centimetre by centimetre — or he hits it like a car crash.',
            speechType: 'SPEECH',
            mood: 'determined',
          },
          {
            id: 'g8-p1-3',
            panelNumber: 3,
            layout: 'HALF_RIGHT',
            sceneType: 'ROCKET_STAGING',
            sfx: { text: 'CLUNK!', color: '#43ffa0', position: 'top-right' },
            caption: 'After a careful approach, Armstrong slides Gemini 8 nose into the Agena docking collar.',
            speaker: 'HOUSTON_CAPCOM',
            dialogue: 'Flight, we are docked. It is really smooth — no noticeable oscillations at all.',
            speechType: 'RADIO',
            mood: 'excited',
            stemFactHotspot: {
              title: 'First Space Docking',
              fact: 'Gemini 8 achieved the first crewed spacecraft docking in history. Docking technology is fundamental to the ISS, the Moon landings, and every crewed spacecraft since.',
            },
          },
        ],
      },
      {
        pageNumber: 2,
        pageTitle: 'Stuck Thruster — The Spin Gets Worse',
        panels: [
          {
            id: 'g8-p2-1',
            panelNumber: 4,
            layout: 'FULL_WIDTH',
            sceneType: 'SOLAR_STORM',
            caption: 'About 27 minutes after docking, the combined craft begins to roll. Thruster 8 on Gemini is stuck open, firing continuously without command.',
            speaker: 'HOUSTON_CAPCOM',
            dialogue: 'Gemini 8, we show an unexpected roll rate. Can you confirm?',
            speechType: 'RADIO',
            mood: 'worried',
            sfx: { text: 'ZZZT!', color: '#ef4444', position: 'top-left' },
            stemFactHotspot: {
              title: 'Why Undocking Made It Worse',
              fact: 'Armstrong and Scott first thought the Agena thrusters were causing the spin, so they undocked. But the Agena was fine — Gemini own thruster 8 was stuck. After undocking, the lighter Gemini capsule spun even faster, reaching about one full revolution per second.',
            },
          },
          {
            id: 'g8-p2-2',
            panelNumber: 5,
            layout: 'HALF_LEFT',
            sceneType: 'SOLAR_STORM',
            caption: 'They undock. The spin accelerates — nearly one revolution per second. The crew are approaching blackout.',
            speaker: 'CADET_MAYA',
            dialogue: 'Wait — undocking made it WORSE?! How is that possible?',
            speechType: 'SPEECH',
            mood: 'worried',
          },
          {
            id: 'g8-p2-3',
            panelNumber: 6,
            layout: 'HALF_RIGHT',
            sceneType: 'SOLAR_STORM',
            caption: 'Armstrong switches to the re-entry control thrusters — normally saved for the final descent — and fires them in short bursts to cancel the spin.',
            speaker: 'COMMANDER_DADU',
            dialogue: 'The spin was in Gemini all along. Armstrong used the re-entry thrusters — their last resort — to stop it. The mission ended early, but both astronauts came home alive. That is a win.',
            speechType: 'SPEECH',
            mood: 'heroic',
            stemFactHotspot: {
              title: 'Using Re-entry Thrusters as Emergency Brakes',
              fact: 'Mission rules required the crew to land immediately after using the re-entry control thrusters, because those same jets were needed for the de-orbit burn. Armstrong decision saved them — and the mission rules protected the mission.',
            },
          },
        ],
      },
    ],
    comprehensionQuiz: [
      {
        question: 'Why must astronauts approach a docking target so slowly and carefully?',
        options: [
          'Because the target is fragile and made of glass',
          'To take photographs on the way in',
          'Both spacecraft are moving at orbital speed — any velocity mismatch becomes a high-speed collision',
          'Space law requires a slow approach',
        ],
        correctIndex: 2,
        explanation: 'Both spacecraft orbit at about 17,500 mph. Closing speed is the difference in their velocities — even a few mph mismatch can damage docking hardware or cause a collision.',
      },
      {
        question: 'What happened when Armstrong undocked from the Agena to stop the spin?',
        options: [
          'The spin stopped immediately',
          'Gemini 8 spun faster — the stuck thruster was on Gemini, not the Agena',
          'The Agena took over and guided them home',
          'Houston remotely shut down the thruster',
        ],
        correctIndex: 1,
        explanation: 'The fault was thruster 8 on Gemini itself. Removing the Agena mass made the lighter Gemini spin faster — up to about one full revolution per second — until Armstrong used the re-entry thrusters to stop the rotation.',
      },
      {
        question: 'Why did using the re-entry thrusters mean the mission had to end early?',
        options: [
          'The re-entry thrusters use the same fuel as the main engine',
          'Mission rules required them to land immediately after using those thrusters, since the same jets are needed for a precise de-orbit burn',
          'The thrusters were too weak to reach the landing zone otherwise',
          'Armstrong was too tired to continue',
        ],
        correctIndex: 1,
        explanation: 'The re-entry control thrusters were reserved for the de-orbit burn. Once used for emergency spin control, mission rules required immediate landing to ensure enough propellant remained for a safe re-entry.',
      },
    ],
    handsOnExperiment: {
      title: 'Thruster Timing — The Precision Game',
      materials: ['Balloon', 'Open floor space', 'Stopwatch'],
      instructions: 'Inflate a balloon and release it without tying. Watch how the air pushes the balloon in the opposite direction (Newton Third Law). Now try to guide a released balloon to a floor target using only short taps — representing thruster bursts — before it deflates. This shows how short, precise inputs — not one big push — control spacecraft attitude.',
      whyItWorks: 'Spacecraft attitude thrusters fire in short bursts because a continuous burn overshoots. Matching velocity to a target requires many small corrections in the right direction at the right moment — exactly what Armstrong did to save Gemini 8.',
    },
  },

  // ── ISSUE 3 ──
  {
    id: 'issue-03-eagle-landing',
    issueNumber: 3,
    title: 'Eagle Is Landing',
    subtitle: 'Gravity, Descent and Deciding Under Pressure · Module 3: Lander',
    coverBadge: 'ISSUE #3 · LANDER',
    coverThemeColor: '#f59e0b',
    curriculumCategory: 'AERODYNAMICS',
    gradeLevel: 'All Ages',
    synopsis: 'July 20, 1969. Neil Armstrong and Buzz Aldrin guide the Eagle lunar module toward the Sea of Tranquility. Computer alarms fire. The automatic landing target is a crater full of boulders. The fuel clock is running. Every second counts.',
    curriculumStandards: [
      'MS-PS2-4: Gravitational interactions — Moon gravity is 1/6 of Earth',
      'Descent rate, fuel margin, and touchdown: balancing speed against remaining propellant',
      'Decision-making under uncertainty: the 1202 computer alarm',
      'Engineering trade-offs: abort criteria and go/no-go decisions',
    ],
    nasaMissionTieIn: 'Apollo 11 · Neil Armstrong and Buzz Aldrin · July 20 1969',
    nasaDocumentCitation: 'NASA SP-350 Apollo Expeditions to the Moon ch. 11; WFAE/NPR Apollo 11 descent transcript; MIT News, Landing Apollo via Cambridge. NOTE: Fuel at touchdown reconstructed at 17 to 45 seconds in different analyses — this comic uses under a minute to remain accurate.',
    pages: [
      {
        pageNumber: 1,
        pageTitle: 'Descent Begins — The 1202 Alarm',
        panels: [
          {
            id: 'e11-p1-1',
            panelNumber: 1,
            layout: 'FULL_WIDTH',
            sceneType: 'MARS_DESCENT',
            caption: 'Sea of Tranquility, July 20, 1969. The Eagle lunar module separates from Columbia and begins its powered descent. Fuel is limited — there is no second chance.',
            speaker: 'HOUSTON_CAPCOM',
            dialogue: 'Eagle, Houston. You are go for powered descent initiation. Good luck.',
            speechType: 'RADIO',
            mood: 'heroic',
            stemFactHotspot: {
              title: 'Moon Gravity vs Earth Gravity',
              fact: 'The Moon gravity is about 1/6 of Earth (1.62 m/s squared vs 9.8 m/s squared). The same descent engine that would barely slow a car on Earth can gently lower the 15-tonne Eagle to the surface — but fuel is still finite.',
              formula: 'g-Moon equals g-Earth divided by 6, approximately 1.62 m/s-squared',
            },
          },
          {
            id: 'e11-p1-2',
            panelNumber: 2,
            layout: 'HALF_LEFT',
            sceneType: 'MARS_DESCENT',
            sfx: { text: 'ALARM!', color: '#ef4444', position: 'top-right' },
            caption: 'A 1202 alarm flashes on the guidance computer. It has never appeared in training.',
            speaker: 'CADET_MAYA',
            dialogue: 'Dadu, what is a 1202 alarm? It sounds really bad.',
            speechType: 'SPEECH',
            mood: 'worried',
            stemFactHotspot: {
              title: 'The 1202 Alarm',
              fact: 'The 1202 was an executive overflow — the guidance computer was being given more tasks than it could finish in one cycle and was dropping the lowest-priority jobs. MIT engineers had tested this in training and told Houston it was safe to continue as long as it did not recur continuously.',
            },
          },
          {
            id: 'e11-p1-3',
            panelNumber: 3,
            layout: 'HALF_RIGHT',
            sceneType: 'MARS_DESCENT',
            speaker: 'HOUSTON_CAPCOM',
            dialogue: 'We are go on that alarm, Eagle. We are go.',
            speechType: 'RADIO',
            mood: 'determined',
            stemFactHotspot: {
              title: 'Go or No-Go Decision',
              fact: 'Mission Control had pre-planned go/no-go criteria for every alarm type. Flight Director Gene Kranz polled each console in seconds. The 1202 had been tested at MIT — it was safe to continue. This is engineering: prepare in advance for every failure mode you can think of.',
            },
          },
        ],
      },
      {
        pageNumber: 2,
        pageTitle: 'Boulder Field — Armstrong Takes Manual Control',
        panels: [
          {
            id: 'e11-p2-1',
            panelNumber: 4,
            layout: 'FULL_WIDTH',
            sceneType: 'MARS_DESCENT',
            caption: 'Armstrong looks out the window. The computer is guiding Eagle straight toward a football-field-sized crater rimmed with car-sized boulders.',
            speaker: 'COMMANDER_DADU',
            dialogue: 'The automatic system was doing its job — but it did not know the ground below was littered with boulders. Armstrong had to decide in seconds: trust the computer, or take control.',
            speechType: 'SPEECH',
            mood: 'worried',
            stemFactHotspot: {
              title: 'West Crater — Boulder Field',
              fact: 'The automatic target was the rim of a 180-metre crater. Armstrong extended the descent manually, skimming past the crater to find a flatter patch of ground. Every second of flight used fuel from a rapidly shrinking supply.',
            },
          },
          {
            id: 'e11-p2-2',
            panelNumber: 5,
            layout: 'HALF_LEFT',
            sceneType: 'MARS_DESCENT',
            speaker: 'HOUSTON_CAPCOM',
            dialogue: '60 seconds. Sixty seconds of fuel remaining.',
            speechType: 'RADIO',
            mood: 'worried',
          },
          {
            id: 'e11-p2-3',
            panelNumber: 6,
            layout: 'HALF_RIGHT',
            sceneType: 'SHACKLETON_BASE',
            sfx: { text: 'CONTACT!', color: '#43ffa0', position: 'bottom-right' },
            caption: 'Eagle settles gently onto the surface. Dust drifts sideways in the thin silence.',
            speaker: 'HOUSTON_CAPCOM',
            dialogue: 'Tranquility Base here. The Eagle has landed. We copy you on the ground.',
            speechType: 'RADIO',
            mood: 'heroic',
            stemFactHotspot: {
              title: 'Fuel at Touchdown',
              fact: 'Reconstructions of the fuel remaining when Eagle touched down range from about 17 to 45 seconds depending on the method used. Armstrong flew with under a minute of fuel left — the closest call of the entire mission.',
            },
          },
        ],
      },
    ],
    comprehensionQuiz: [
      {
        question: 'Why could not the Apollo 11 crew simply fly faster to save fuel during the landing?',
        options: [
          'Flying faster uses more fuel for descent braking, not less',
          'Faster flight was against mission rules',
          'The engine could not produce more thrust on the Moon',
          'Houston would not allow it',
        ],
        correctIndex: 0,
        explanation: 'To land softly you must slow down from orbital speed to zero. The faster you descend, the more fuel you burn decelerating. Every extra second Armstrong spent flying past the boulder field cost precious propellant.',
      },
      {
        question: 'What did the 1202 computer alarm actually mean?',
        options: [
          'The computer had crashed and stopped working',
          'The computer was overloaded and dropping low-priority tasks, but was still safe to continue',
          'Armstrong had entered the wrong coordinates',
          'The fuel tank was almost empty',
        ],
        correctIndex: 1,
        explanation: 'A 1202 executive overflow meant the guidance computer had more tasks than it could complete in one cycle and was discarding lower-priority ones. The critical navigation tasks kept running, so the mission could safely continue.',
      },
      {
        question: 'Why did Armstrong take manual control instead of letting the computer land Eagle?',
        options: [
          'The computer had shut down completely',
          'He wanted to prove he was a better pilot than the computer',
          'The automatic target was heading for a crater with boulders — he had to fly past it to find safe ground',
          'Houston ordered him to switch to manual',
        ],
        correctIndex: 2,
        explanation: 'The computer was guiding Eagle toward a 180-metre crater rimmed with boulders. Armstrong looked out the window, recognised the danger, and extended the flight manually to find a flat patch — a decision made in seconds with under a minute of fuel.',
      },
    ],
    handsOnExperiment: {
      title: 'The Fuel Budget Landing Game',
      materials: ['Sheet of paper', 'Pencil', 'Stopwatch'],
      instructions: 'Draw a target circle on paper. Stand 3 metres away. You have exactly 20 fuel units — each step forward costs 1 unit. Your goal: reach the circle and stop exactly on it, spending no more than 20 units. Play twice: first aiming at the target directly, then aiming at a slightly wrong spot and correcting mid-approach. Compare fuel used each time.',
      whyItWorks: 'The exercise shows that correcting a wrong trajectory mid-flight uses extra fuel, and that every delay has a cost. Apollo 11 real margin was under a minute of propellant — a direct consequence of having to fly past the boulder crater.',
    },
  },

  // ── ISSUE 4 ──
  {
    id: 'issue-04-sojourner',
    issueNumber: 4,
    title: 'First Wheels on Mars',
    subtitle: 'Risk, Reward and Reading the Ground · Module 4: Rover',
    coverBadge: 'ISSUE #4 · ROVER',
    coverThemeColor: '#ef4444',
    curriculumCategory: 'ISRU_CHEMISTRY',
    gradeLevel: 'All Ages',
    synopsis: 'July 4, 1997. The Mars Pathfinder spacecraft bounces to a landing on the Ares Vallis plain, cushioned by airbags. On Sol 2, the Sojourner rover rolls down its ramp — the first wheeled vehicle ever to drive on another planet. Scientists must choose where to drive, knowing battery power and mission time are both finite.',
    curriculumStandards: [
      'MS-ETS1: Engineering design — weighing criteria and trade-offs',
      'Power budgeting: solar panels and battery life on Mars',
      'Science sampling strategy: choosing where a rover goes based on geology',
      'Risk versus reward: a dangerous shortcut versus a longer safe route',
    ],
    nasaMissionTieIn: 'Mars Pathfinder and Sojourner rover · JPL · July 1997',
    nasaDocumentCitation: 'NASA/JPL Photojournal PIA00660 (photojournal.jpl.nasa.gov/catalog/PIA00660); NASA Science image page Sojourner, Barnacle Bill, and Yogi; Space.com, Sojourner: The first successful Mars rover.',
    pages: [
      {
        pageNumber: 1,
        pageTitle: 'Touchdown on Ares Vallis',
        panels: [
          {
            id: 'soj-p1-1',
            panelNumber: 1,
            layout: 'FULL_WIDTH',
            sceneType: 'MARS_DESCENT',
            caption: 'July 4, 1997. Mars Pathfinder enters the Martian atmosphere at 7.6 km/s — then deploys parachutes, fires retrorockets, and inflates giant airbags. The spacecraft bounces across the plain like a beach ball.',
            speaker: 'CADET_MAYA',
            dialogue: 'It bounced? They landed a spacecraft on Mars by letting it bounce around like a ball?!',
            speechType: 'SPEECH',
            mood: 'excited',
            stemFactHotspot: {
              title: 'Airbag Landing System',
              fact: 'The airbags were a lighter solution than retrorocket legs alone. The spacecraft bounced up to 15 metres high and travelled nearly a kilometre before coming to rest on the Ares Vallis flood plain.',
            },
          },
          {
            id: 'soj-p1-2',
            panelNumber: 2,
            layout: 'HALF_LEFT',
            sceneType: 'MARS_DESCENT',
            caption: 'The airbags deflate. The petals unfold. Sojourner — the size of a microwave oven — sits on the ramp.',
            speaker: 'COMMANDER_DADU',
            dialogue: 'At the end of Sol 2, Sojourner rolls off the ramp and onto Martian soil. Six wheels. Eleven kilograms. The first rover on another planet.',
            speechType: 'SPEECH',
            mood: 'heroic',
            stemFactHotspot: {
              title: 'Sol 2 — First Drive',
              fact: 'Sojourner first stop was a rock scientists named Barnacle Bill, where its Alpha Proton X-ray Spectrometer measured the rock composition, confirming volcanic basalt — similar to rocks found on Earth.',
            },
          },
          {
            id: 'soj-p1-3',
            panelNumber: 3,
            layout: 'HALF_RIGHT',
            sceneType: 'MOXIE_LAB',
            sfx: { text: 'SCAN!', color: '#43ffa0', position: 'top-right' },
            speaker: 'ASTRO_BOT',
            dialogue: 'Barnacle Bill chemical scan complete. Composition: andesite silicate — volcanic rock. Similar to some Earth lavas. Transmitting to JPL.',
            speechType: 'RADIO',
            mood: 'determined',
            stemFactHotspot: {
              title: 'Alpha Proton X-ray Spectrometer',
              fact: 'Sojourner APXS bombarded rocks with alpha particles and measured what bounced back. The pattern of detected particles reveals chemical composition — how scientists read a rock story without bringing it home.',
            },
          },
        ],
      },
      {
        pageNumber: 2,
        pageTitle: 'Choosing the Route — Risk vs Reward',
        panels: [
          {
            id: 'soj-p2-1',
            panelNumber: 4,
            layout: 'FULL_WIDTH',
            sceneType: 'MOXIE_LAB',
            caption: 'The planned seven-day mission stretched to 83 days. But battery power and solar energy were always limited. Every drive was a trade-off between science value and rover risk.',
            speaker: 'CADET_MAYA',
            dialogue: 'If the safe path and the interesting rock are in different directions, how do you decide which way to drive?',
            speechType: 'SPEECH',
            mood: 'curious',
            stemFactHotspot: {
              title: '83 Days Instead of 7',
              fact: 'Sojourner design life was 7 days, but it operated for 83 days, returning 550 images and analysing 16 rock and soil targets — ending only when the Pathfinder lander lost contact, cutting off the communication relay.',
            },
          },
          {
            id: 'soj-p2-2',
            panelNumber: 5,
            layout: 'HALF_LEFT',
            sceneType: 'MOXIE_LAB',
            speaker: 'COMMANDER_DADU',
            dialogue: 'You weigh the science value of the target against the terrain hazard, the battery charge remaining, and whether you can still make it back to a safe spot before night. That is engineering: choosing the best option, not the perfect one.',
            speechType: 'SPEECH',
            mood: 'determined',
          },
          {
            id: 'soj-p2-3',
            panelNumber: 6,
            layout: 'HALF_RIGHT',
            sceneType: 'MARS_DESCENT',
            caption: 'Mission ends after 83 days — not because Sojourner failed, but because its radio link through Pathfinder was lost.',
            speaker: 'CADET_MAYA',
            dialogue: 'So the rover was fine — it just could not talk to Earth anymore? That means the plan matters as much as the machine.',
            speechType: 'SPEECH',
            mood: 'heroic',
            stemFactHotspot: {
              title: 'Why Communication Architecture Matters',
              fact: 'Sojourner communicated through Pathfinder, not directly to Earth. When Pathfinder batteries failed, Sojourner lost its voice. Later rovers like Curiosity and Perseverance can relay through multiple orbiters, reducing this single-point-of-failure risk.',
            },
          },
        ],
      },
    ],
    comprehensionQuiz: [
      {
        question: 'How did Pathfinder land safely on Mars in 1997?',
        options: [
          'It had rocket legs that fired just before touchdown',
          'It entered the atmosphere very slowly using only a parachute',
          'It deployed airbags, bounced across the plain, and came to rest',
          'A robotic arm grabbed the ground at the last second',
        ],
        correctIndex: 2,
        explanation: 'After parachutes slowed its descent, retrorockets fired, airbags inflated, and Pathfinder bounced up to 15 metres high before rolling to a stop on the Ares Vallis plain.',
      },
      {
        question: 'Sojourner planned mission was 7 days. How long did it actually last?',
        options: ['3 days', '21 days', '83 days', '7 years'],
        correctIndex: 2,
        explanation: 'Sojourner operated for 83 days, far beyond its 7-day design life. It ended when the Pathfinder lander lost power, cutting off the communication relay to Earth.',
      },
      {
        question: 'When choosing where to drive, what must a rover team weigh against science value?',
        options: [
          'The colour of the rock',
          'How photogenic the landscape is',
          'Terrain hazards, remaining battery power, and whether the rover can safely return before nightfall',
          'The distance from Earth',
        ],
        correctIndex: 2,
        explanation: 'Every rover drive is an engineering trade-off. Scientists want the most interesting rocks. Engineers must ensure the rover can survive the terrain, has enough power, and can reach a safe charging position before the Martian night drains the battery.',
      },
    ],
    handsOnExperiment: {
      title: 'The Rover Route Trade-off',
      materials: ['Sheet of paper with a map drawn on it', 'Pencil', 'Coins representing battery units'],
      instructions: 'Draw a start point, three rock targets at different distances, and obstacles in between. Each step costs 1 battery unit. Each rock scan earns 3 science points. You start with 20 battery units and must return to start before running out. Plan two routes: one safe and short, one risky and long. Compare science points against battery cost for each route.',
      whyItWorks: 'Real rover missions use exactly this cost-benefit analysis every sol. The exercise teaches that the best route is not always the shortest or the most scientifically rich — it is the one that maximises science within the engineering constraints.',
    },
  },

  // ── ISSUE 5 ──
  {
    id: 'issue-05-hubble-blurry-start',
    issueNumber: 5,
    title: 'A Blurry Start',
    subtitle: 'Waves, Optics and Fixing Hubble in Space · Module 5: Telescope',
    coverBadge: 'ISSUE #5 · TELESCOPE',
    coverThemeColor: '#38bdf8',
    curriculumCategory: 'TELECOMMUNICATIONS',
    gradeLevel: 'All Ages',
    synopsis: 'April 24, 1990. The Hubble Space Telescope launches aboard Discovery — the most advanced telescope ever built. Two months later, NASA discovers the primary mirror was ground to the wrong shape. Every image is blurred. A team of engineers must design a fix and then install it in space.',
    curriculumStandards: [
      'MS-PS4-2: Waves are reflected, absorbed, or transmitted through materials',
      'Spherical aberration: how a shape error in a mirror scatters light',
      'Why space telescopes see more clearly: no atmosphere to scatter or absorb light',
      'Engineering design iteration: diagnosing a failure and building a targeted fix',
      'Different wavelengths (infrared, ultraviolet, visible) reveal different information',
    ],
    nasaMissionTieIn: 'Hubble Space Telescope · Launch April 24 1990 · Servicing Mission 1 December 1993',
    nasaDocumentCitation: 'NASA, Hubble Mirror Flaw (science.nasa.gov/mission/hubble/overview/hubbles-mirror-flaw); NASA Goddard Hubble Servicing Mission 1 archive.',
    pages: [
      {
        pageNumber: 1,
        pageTitle: 'Launch Day — and a Hidden Flaw',
        panels: [
          {
            id: 'hub-p1-1',
            panelNumber: 1,
            layout: 'FULL_WIDTH',
            sceneType: 'LAUNCH_PAD',
            caption: 'April 24, 1990. Space Shuttle Discovery carries the Hubble Space Telescope into orbit — 559 km above Earth, above every cloud and every shimmer of atmosphere.',
            speaker: 'CADET_MAYA',
            dialogue: 'Dadu, why put a telescope all the way up in space? We have really big ones on mountains.',
            speechType: 'SPEECH',
            mood: 'curious',
            stemFactHotspot: {
              title: 'Why Space Beats a Mountain',
              fact: 'Earth atmosphere blurs starlight the way heat shimmer blurs a road. Even the best mountain-top observatory looks through hundreds of kilometres of moving air. Above the atmosphere, Hubble sees stars as sharp points — and it can detect ultraviolet and infrared light that the atmosphere blocks entirely.',
            },
          },
          {
            id: 'hub-p1-2',
            panelNumber: 2,
            layout: 'HALF_LEFT',
            sceneType: 'DEEP_SPACE_ANTENNA',
            caption: 'June 27, 1990. NASA announces Hubble first images are blurred. The 2.4-metre primary mirror was polished to the wrong shape — spherical aberration.',
            speaker: 'COMMANDER_DADU',
            dialogue: 'The mirror was ground 2.2 micrometres too flat at the edge — about 1/50th the width of a human hair. That tiny error scattered light and blurred every single image.',
            speechType: 'SPEECH',
            mood: 'worried',
            stemFactHotspot: {
              title: 'Spherical Aberration',
              fact: 'Spherical aberration occurs when different zones of a mirror focus light at slightly different distances. Hubble mirror error of 2.2 micrometres was enough to make every image look like a star reflected in a spoon.',
            },
          },
          {
            id: 'hub-p1-3',
            panelNumber: 3,
            layout: 'HALF_RIGHT',
            sceneType: 'DEEP_SPACE_ANTENNA',
            sfx: { text: 'CLICK-CLICK', color: '#94a3b8', position: 'top-right' },
            speaker: 'CADET_MAYA',
            dialogue: 'So the most expensive telescope ever built had blurry vision? Could they bring it back down and fix it?',
            speechType: 'SPEECH',
            mood: 'worried',
            stemFactHotspot: {
              title: 'Built to Be Serviced',
              fact: 'Hubble was intentionally designed with handrails, modular instruments, and replaceable components — so astronauts in spacesuits could service it in orbit. This design decision saved the mission entirely.',
            },
          },
        ],
      },
      {
        pageNumber: 2,
        pageTitle: 'Servicing Mission 1 — COSTAR and the New Camera',
        panels: [
          {
            id: 'hub-p2-1',
            panelNumber: 4,
            layout: 'FULL_WIDTH',
            sceneType: 'DEEP_SPACE_ANTENNA',
            caption: 'December 1993. Space Shuttle Endeavour carries seven astronauts to Hubble. Five spacewalks. Two key instruments installed: COSTAR (corrective optics) and WFPC2 (a new camera with the correction built in).',
            speaker: 'COMMANDER_DADU',
            dialogue: 'Engineers designed COSTAR — tiny mirrors that bent light by exactly 2.2 micrometres in the opposite direction, cancelling the flaw. Like prescription glasses for a space telescope.',
            speechType: 'SPEECH',
            mood: 'heroic',
            stemFactHotspot: {
              title: 'COSTAR — Corrective Optics',
              fact: 'COSTAR contained five pairs of small mirrors, each ground to correct for Hubble specific mirror error. The fix worked — the first post-servicing images were razor-sharp.',
            },
          },
          {
            id: 'hub-p2-2',
            panelNumber: 5,
            layout: 'HALF_LEFT',
            sceneType: 'DEEP_SPACE_ANTENNA',
            speaker: 'CADET_MAYA',
            dialogue: 'So they built glasses for a space telescope and installed them by hand, in spacesuits, while orbiting Earth at 17,000 mph? That is the most intense optician appointment ever.',
            speechType: 'SPEECH',
            mood: 'excited',
          },
          {
            id: 'hub-p2-3',
            panelNumber: 6,
            layout: 'HALF_RIGHT',
            sceneType: 'DEEP_SPACE_ANTENNA',
            sfx: { text: 'SHARP!', color: '#38bdf8', position: 'bottom-right' },
            caption: 'January 1994. The first corrected images arrive. Pillars of gas and dust, galaxies billions of light-years away — all perfectly sharp.',
            speaker: 'COMMANDER_DADU',
            dialogue: 'The lesson is not that it went wrong. It is that the designers built Hubble to be fixed — and that made all the difference.',
            speechType: 'SPEECH',
            mood: 'heroic',
            stemFactHotspot: {
              title: 'Different Light, Different Science',
              fact: 'Hubble sees in ultraviolet, visible, and near-infrared light. Ultraviolet reveals hot young stars. Infrared pierces dust clouds. Visible shows what our eyes would see — if they were 100 times more powerful.',
            },
          },
        ],
      },
    ],
    comprehensionQuiz: [
      {
        question: 'What was wrong with Hubble primary mirror?',
        options: [
          'It was cracked during launch',
          'It was pointed in the wrong direction',
          'It was ground to the wrong shape — 2.2 micrometres too flat at the edge — causing spherical aberration',
          'It was too small to collect enough light',
        ],
        correctIndex: 2,
        explanation: 'Hubble 2.4-metre mirror was polished with extreme precision but to the wrong shape — a 2.2-micrometre error at the edge. This caused spherical aberration: different zones of the mirror focused light at different distances, blurring every image.',
      },
      {
        question: 'Why can Hubble see more clearly than the best ground-based telescopes?',
        options: [
          'It is bigger than any ground telescope',
          'It uses a different colour of light',
          'It orbits above the atmosphere, avoiding the blurring effect of moving air',
          'It is closer to the stars',
        ],
        correctIndex: 2,
        explanation: 'Earth atmosphere scatters and absorbs light, blurring even the sharpest ground-based images. Above the atmosphere, Hubble also detects ultraviolet and infrared wavelengths that are blocked by the air below.',
      },
      {
        question: 'How did engineers fix Hubble mirror without bringing it back to Earth?',
        options: [
          'They replaced the entire primary mirror from the Shuttle',
          'They installed COSTAR — a set of small corrective mirrors that cancelled the shape error — plus a new camera with the correction built in',
          'They polished the existing mirror using robotic arms',
          'They pointed the telescope at brighter objects to compensate',
        ],
        correctIndex: 1,
        explanation: 'COSTAR contained tiny mirrors ground to introduce the exact opposite of Hubble aberration, cancelling it optically. The Wide Field Planetary Camera 2 had the correction built into its optics. Both were installed by spacewalking astronauts in December 1993.',
      },
    ],
    handsOnExperiment: {
      title: 'Atmosphere Blur vs Space Clarity',
      materials: ['A torch or phone flashlight', 'A glass of water', 'A piece of white card', 'A clear plastic bag'],
      instructions: 'In a dimly lit room, shine the torch through the clear bag onto the card — this represents light from space reaching a space telescope (minimal scattering). Now fill the bag with water and hold it in the light path. Gently squeeze and move the water to simulate atmospheric turbulence. Notice how the light pattern on the card blurs and shifts.',
      whyItWorks: 'Water causes refraction (bending of light) just as air density variations do in Earth atmosphere. The twinkling of stars is atmospheric turbulence bending starlight millions of times per second — what astronomers call seeing. Above the atmosphere, Hubble has perfect seeing at all times.',
    },
  },

  // ── ISSUE 6 ──
  {
    id: 'issue-06-voyager-grand-tour',
    issueNumber: 6,
    title: 'The Grand Tour',
    subtitle: 'Gravity Assists, Deep Space and Borrowing a Planet Speed · Module 6: Deep Space',
    coverBadge: 'ISSUE #6 · DEEP SPACE',
    coverThemeColor: '#a78bfa',
    curriculumCategory: 'ORBITAL_MECHANICS',
    gradeLevel: 'Explorer (Ages 8-13)',
    synopsis: 'In the early 1960s, a young engineer named Gary Flandro makes a remarkable discovery: a rare alignment of the outer planets — occurring roughly once every 176 years — would allow a single spacecraft to visit Jupiter, Saturn, Uranus, and Neptune using gravity assists. Two spacecraft launch in 1977. Voyager will travel further than any human-made object in history.',
    curriculumStandards: [
      'MS-ESS1-2: The role of gravity in the solar system',
      'MS-PS2-4: Gravitational interactions depend on mass and distance',
      'Gravity assist (slingshot): using a planet gravity to change speed and direction without burning fuel',
      'Early vs late course corrections: why small early changes are cheaper than large late ones',
      'Signal travel time: at the edge of the solar system, signals take hours to arrive',
    ],
    nasaMissionTieIn: 'Voyager 1 (launched Sep 5 1977) and Voyager 2 (launched Aug 20 1977) · NASA/JPL',
    nasaDocumentCitation: 'Scientific American, Record-Breaking Voyager Spacecraft Begin to Power Down; American Museum of Natural History, Voyager 1 Launched 40 Years Ago Today. NOTE: Confirm current signal travel time at NASA Voyager mission status page (voyager.jpl.nasa.gov) before print.',
    pages: [
      {
        pageNumber: 1,
        pageTitle: 'Flandro Discovery — The Grand Tour Window',
        panels: [
          {
            id: 'voy-p1-1',
            panelNumber: 1,
            layout: 'FULL_WIDTH',
            sceneType: 'DEEP_SPACE_ANTENNA',
            caption: 'Early 1960s. Jet Propulsion Laboratory, California. Gary Flandro, a young aerospace engineer, is calculating planetary positions for a possible mission to the outer solar system.',
            speaker: 'DR_ELENA',
            dialogue: 'Flandro realised that Jupiter, Saturn, Uranus, and Neptune were lining up in a way that happens only about once every 176 years. If you launched in 1977, you could visit all four using gravity assists.',
            speechType: 'SPEECH',
            mood: 'excited',
            stemFactHotspot: {
              title: 'The Planetary Alignment',
              fact: 'The outer planets align favourably for a multi-planet gravity assist trajectory only about once every 176 years. The next usable window after 1977 would not occur until the 2150s. NASA had to act on a very tight launch window.',
            },
          },
          {
            id: 'voy-p1-2',
            panelNumber: 2,
            layout: 'HALF_LEFT',
            sceneType: 'DEEP_SPACE_ANTENNA',
            speaker: 'CADET_MAYA',
            dialogue: 'But what is a gravity assist? Can a planet actually pull a spacecraft faster?',
            speechType: 'SPEECH',
            mood: 'curious',
          },
          {
            id: 'voy-p1-3',
            panelNumber: 3,
            layout: 'HALF_RIGHT',
            sceneType: 'DEEP_SPACE_ANTENNA',
            sfx: { text: 'SLINGSHOT!', color: '#a78bfa', position: 'top-right' },
            speaker: 'COMMANDER_DADU',
            dialogue: 'Imagine rolling a marble past a spinning basketball. The marble curves around it and comes out faster — it borrowed some of the basketball momentum. A gravity assist does the same thing with a planet orbital speed.',
            speechType: 'SPEECH',
            mood: 'heroic',
            stemFactHotspot: {
              title: 'The Gravity Assist',
              fact: 'A spacecraft approaching a planet is accelerated by the planet gravity. If timed correctly, the spacecraft leaves the encounter at a higher speed in a new direction — having transferred a tiny amount of the planet orbital momentum to itself.',
              formula: 'Delta-v approximately equals 2 times planet-velocity times sin(theta divided by 2)',
            },
          },
        ],
      },
      {
        pageNumber: 2,
        pageTitle: 'The Journey — Course Corrections and Interstellar Space',
        panels: [
          {
            id: 'voy-p2-1',
            panelNumber: 4,
            layout: 'FULL_WIDTH',
            sceneType: 'DEEP_SPACE_ANTENNA',
            caption: 'Voyager 2 launches August 20, 1977. Voyager 1 launches September 5, 1977, on a faster trajectory. Both use Jupiter gravity as their first slingshot.',
            speaker: 'ASTRO_BOT',
            dialogue: 'Without gravity assists, reaching Neptune would take 30 years on fuel alone. With them: 12 years. Voyager 2 arrived at Neptune in August 1989.',
            speechType: 'RADIO',
            mood: 'determined',
            stemFactHotspot: {
              title: '30 Years vs 12 Years',
              fact: 'A direct trajectory to Neptune would require far more fuel and take about 30 years. By chaining gravity assists — Jupiter to Saturn to Uranus to Neptune — Voyager 2 cut the trip to 12 years.',
            },
          },
          {
            id: 'voy-p2-2',
            panelNumber: 5,
            layout: 'HALF_LEFT',
            sceneType: 'DEEP_SPACE_ANTENNA',
            speaker: 'DR_ELENA',
            dialogue: 'And here is what makes deep space hard: by the time Voyager sends a signal home, it takes hours to arrive. If something goes wrong, the spacecraft must handle it alone — you cannot radio for help in real time.',
            speechType: 'SPEECH',
            mood: 'worried',
            stemFactHotspot: {
              title: 'Signal Travel Time',
              fact: 'Radio signals travel at the speed of light (about 300,000 km/s). At Voyager 1 current distance, signals take many hours each way. Check the NASA Voyager mission status page for the current exact figure. This is why deep space probes must be highly autonomous.',
            },
          },
          {
            id: 'voy-p2-3',
            panelNumber: 6,
            layout: 'HALF_RIGHT',
            sceneType: 'DEEP_SPACE_ANTENNA',
            sfx: { text: 'SIGNAL...', color: '#38bdf8', position: 'bottom-right' },
            caption: 'Voyager 1 has now travelled beyond the edge of the solar system — in interstellar space — and is still transmitting.',
            speaker: 'CADET_MAYA',
            dialogue: 'So we can still hear it? A spacecraft launched in 1977 is still out there talking to us?',
            speechType: 'SPEECH',
            mood: 'heroic',
            stemFactHotspot: {
              title: 'Into Interstellar Space',
              fact: 'Voyager 1 crossed the heliopause — the boundary where the Sun solar wind gives way to interstellar space — in August 2012. It is the first human-made object to enter interstellar space. As of 2024, it operates on a nuclear power generator (RTG) and continues transmitting scientific data.',
            },
          },
        ],
      },
    ],
    comprehensionQuiz: [
      {
        question: 'How often does the planetary alignment needed for Voyager Grand Tour occur?',
        options: ['Every 20 years', 'Every 50 years', 'About once every 176 years', 'Once in a million years'],
        correctIndex: 2,
        explanation: 'The alignment of Jupiter, Saturn, Uranus, and Neptune favourable for a chained gravity-assist tour occurs approximately once every 176 years. The 1977 launch window was the only one available in the 20th century.',
      },
      {
        question: 'How does a gravity assist add speed to a spacecraft without burning fuel?',
        options: [
          'The planet pushes the spacecraft with a magnetic field',
          'The spacecraft fires its engines while close to the planet',
          'The spacecraft curves around a planet gravitational field and exits faster, transferring a tiny fraction of the planet orbital momentum',
          'The planet atmosphere slows the spacecraft and then launches it forward',
        ],
        correctIndex: 2,
        explanation: 'In a gravity assist, a spacecraft approaches a planet, is accelerated by its gravity, curves around it, and exits faster in a new direction — having borrowed a tiny fraction of the planet orbital momentum.',
      },
      {
        question: 'Why must deep-space probes like Voyager be largely autonomous?',
        options: [
          'Engineers cannot afford staff to monitor them',
          'Radio signals travel at light speed — at Voyager distance they take many hours each way, so real-time remote control is impossible',
          'The probes move too fast for radio contact',
          'Interstellar space blocks all radio signals',
        ],
        correctIndex: 1,
        explanation: 'Radio signals travel at light speed — about 300,000 km/s. At billions of kilometres away, the round-trip communication time is measured in hours. If something goes wrong, the spacecraft must detect and handle the problem entirely on its own.',
      },
    ],
    handsOnExperiment: {
      title: 'Early vs Late Course Correction — The Marble Race',
      materials: ['A long sheet of paper or corridor floor', 'A marble', 'Tape to mark a target'],
      instructions: 'Mark a start line, a midpoint line at half the length, and a target circle at the end. Roll the marble toward the target. Note where it misses. Now correct its path with a gentle sideways push immediately after launch — compare how much correction was needed versus trying to correct the marble when it is already halfway there. Repeat several times and measure the nudge force needed at each stage.',
      whyItWorks: 'Early in a trajectory, a small angle error only puts you slightly off-course at the end — a tiny correction fixes it. The same angular error left until later translates into a much larger positional error, requiring a bigger and more expensive correction burn. This is why real missions correct trajectory immediately after launch.',
    },
  },

];
