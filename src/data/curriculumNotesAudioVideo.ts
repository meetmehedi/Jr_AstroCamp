/**
 * curriculumNotesAudioVideo.ts
 * Jr_AstroCamp Companion Curriculum: Handwritten Notes, Audio Lessons & Video Modules
 * Team Mysterio · NASA International Space Apps Challenge 2026
 *
 * Source: Jr_AstroCamp_Notes_Audio_Video.docx
 * Fact-checked against verified mission scripts and NASA primary sources.
 */

export interface NotebookKeyIdea {
  id: string;
  title: string;
  explanation: string;
  sketchType: 'ROCKET_FORCES' | 'STAGING_DROP' | 'ORBIT_FALLING' | 'RELATIVE_SPEED' | 'THRUSTER_BURSTS' | 'DOCKING_ALIGN' | 'GRAVITY_COMPARE' | 'DESCENT_FUEL' | 'INERTIA_BRAKING' | 'ROVER_ROUTES' | 'SAMPLE_GEOLOGY' | 'ROVER_LIMITS' | 'ATMOSPHERE_TURBULENCE' | 'EM_SPECTRUM' | 'SPHERICAL_ABERRATION' | 'GRAVITY_SLINGSHOT' | 'COURSE_CORRECTIONS' | 'RADIATION_SHIELDING';
  fillInPrompt: string; // e.g. "Thrust must be greater than ________ to lift off."
  correctAnswer: string;
  hint: string;
}

export interface NotebookPageData {
  moduleId: number;
  moduleTitle: string;
  subtitle: string;
  nasaMission: string;
  gradeLevel: string;
  bigQuestion: string;
  keyIdeas: NotebookKeyIdea[];
  predictionPrompt: string; // "If I drop a stage earlier, I think..."
  vocabulary: Array<{ term: string; definition: string }>;
  debriefPrompt: string; // "After flying in the sim, what happened to your fuel/trajectory?"
  nasaCitation: string;
}

export interface AudioLessonBeat {
  timestamp: string;
  speaker: 'CAPCOM' | 'CADET_MAYA';
  text: string;
}

export interface AudioLessonData {
  moduleId: number;
  title: string;
  duration: string; // "4:15"
  hook: string;
  storyBeats: {
    beat1Title: string;
    beat2Title: string;
    beat3Title: string;
    transcript: AudioLessonBeat[];
  };
  simChallenge: {
    title: string;
    instruction: string;
    targetMissionId: string;
  };
  recap: string;
}

export interface VideoLessonStep {
  stepNumber: number;
  title: string;
  type: 'HOOK' | 'ANIMATION' | 'STORY' | 'SIM_TIE_IN' | 'CHALLENGE';
  caption: string;
  nasaMediaCredit: string;
  interactiveAction?: string;
}

export interface VideoLessonData {
  moduleId: number;
  title: string;
  duration: string; // "2:45"
  concept: string;
  nasaMediaCredit: string;
  steps: VideoLessonStep[];
  oneLineChallenge: string;
}

export interface CurriculumModulePackage {
  id: number;
  name: string;
  themeColor: string;
  badge: string;
  notebook: NotebookPageData;
  audio: AudioLessonData;
  video: VideoLessonData;
}

export const CURRICULUM_MODULES: CurriculumModulePackage[] = [
  // ── MODULE 1: LAUNCH ────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Module 1: Launch — Escaping Earth',
    themeColor: '#f59e0b',
    badge: 'ROCKETRY',
    notebook: {
      moduleId: 1,
      moduleTitle: 'Module 1: Launch · Escaping Earth',
      subtitle: 'Thrust, Staging & Falling Around the Planet',
      nasaMission: 'Mercury-Atlas 6 (Friendship 7, 1962)',
      gradeLevel: 'Explorer (Ages 8–13) & All Ages',
      bigQuestion: 'How do we escape Earth\'s powerful gravity well without running out of fuel?',
      keyIdeas: [
        {
          id: 'm1-idea-1',
          title: 'Thrust vs Gravity & Atmospheric Drag',
          explanation: 'A rocket engine pushes hot gas downward, creating upward thrust (Newton\'s 3rd Law). To ascend, thrust must overcome both gravity (downward weight) and atmospheric drag (air friction pushing back).',
          sketchType: 'ROCKET_FORCES',
          fillInPrompt: 'To accelerate upward off Pad 14, total engine thrust must be greater than the sum of rocket weight and atmospheric ________.',
          correctAnswer: 'drag',
          hint: 'Think about the thick air pushing back against the rocket nose cone.'
        },
        {
          id: 'm1-idea-2',
          title: 'Why Stages Drop Away (Dead Weight)',
          explanation: 'Over 85% of a rocket\'s mass on the pad is propellant. Once fuel tanks empty, carrying heavy empty metal tanks wastes energy. Discarding empty stages lets the next engine accelerate far faster.',
          sketchType: 'STAGING_DROP',
          fillInPrompt: 'Empty fuel tanks are dead weight, so rockets drop them during ascent to drastically increase their ________ ratio.',
          correctAnswer: 'thrust-to-weight',
          hint: 'Two words joined by hyphens: thrust-to-weight.'
        },
        {
          id: 'm1-idea-3',
          title: 'What Is Orbit? (Falling and Missing Earth)',
          explanation: 'Being in orbit does NOT mean zero gravity! Orbit is falling toward Earth while moving sideways so fast (28,000 km/h) that the planet\'s surface curves away at the exact same rate you fall.',
          sketchType: 'ORBIT_FALLING',
          fillInPrompt: 'A spacecraft in orbit is in constant free-fall, travelling sideways fast enough to continually ________ the ground.',
          correctAnswer: 'miss',
          hint: 'Think of Newton\'s cannonball curving around the globe.'
        }
      ],
      predictionPrompt: 'If I drop my booster stage 10 seconds earlier than planned, I predict my rocket\'s acceleration will...',
      vocabulary: [
        { term: 'Thrust', definition: 'The upward reaction force generated by burning propellant and venting gas.' },
        { term: 'Drag', definition: 'Air resistance pushing back against the vehicle through the atmosphere.' },
        { term: 'Staging', definition: 'Jettisoning empty fuel tanks and booster engines to shed mass.' },
        { term: 'Orbital Velocity', definition: 'The speed needed (~7.8 km/s or 28,000 km/h) to remain in low Earth orbit.' },
        { term: 'Free-Fall', definition: 'Motion under the influence of gravity alone, creating the sensation of weightlessness.' }
      ],
      debriefPrompt: 'After flying the Launch mission in the simulator: Did you reach orbit before fuel depleted? How much fuel margin remained at main engine cutoff?',
      nasaCitation: 'NASA SP-4201 "This New Ocean: A History of Project Mercury"; NASA Glenn Educational Propulsion Guides.'
    },
    audio: {
      moduleId: 1,
      title: 'Friendship 7: The Manual Orbit of John Glenn',
      duration: '4:20',
      hook: 'T-minus 10 seconds at Cape Canaveral Pad 14. 360,000 pounds of thrust ignite beneath John Glenn. But getting into orbit is only half the battle—what happens when the automatic steering fails?',
      storyBeats: {
        beat1Title: 'Ignition, High Drag and Stage Separation',
        beat2Title: 'Orbit Insertion & The Yaw Thruster Malfunction',
        beat3Title: 'Segment 51: The Heat Shield Dilemma & Re-entry Plasma',
        transcript: [
          { timestamp: '00:00', speaker: 'CAPCOM', text: 'Attention Cadet. This is Houston CapCom. Today\'s flight lesson covers Module 1: Launch and Orbit Dynamics.' },
          { timestamp: '00:18', speaker: 'CADET_MAYA', text: 'CapCom, why don\'t we just launch straight up until we reach space?' },
          { timestamp: '00:26', speaker: 'CAPCOM', text: 'Good question Maya. If you shoot straight up, gravity pulls you straight back down once the fuel runs out. To stay in space, you must turn sideways!' },
          { timestamp: '00:48', speaker: 'CADET_MAYA', text: 'Sideways? Like falling around the curve of the Earth?' },
          { timestamp: '00:54', speaker: 'CAPCOM', text: 'Exactly. At 28,000 kilometers per hour, as gravity pulls you down, the Earth curves away at the exact same rate. You are in continuous free-fall.' },
          { timestamp: '01:22', speaker: 'CADET_MAYA', text: 'And that\'s what John Glenn did on Friendship 7 on February 20, 1962?' },
          { timestamp: '01:32', speaker: 'CAPCOM', text: 'Right. But on his second orbit, an automatic yaw thruster clogged. The capsule started drifting. Glenn had to switch to manual fly-by-wire stick control.' },
          { timestamp: '02:10', speaker: 'CADET_MAYA', text: 'And then ground telemetry showed a loose heat shield alarm!' },
          { timestamp: '02:22', speaker: 'CAPCOM', text: 'Segment 51 switch showed the heat shield unlatched. Mission control told Glenn to keep the retro-pack strapped on during re-entry to hold it in place.' },
          { timestamp: '03:00', speaker: 'CADET_MAYA', text: 'Through 3,000-degree plasma, burning chunks of the retro-pack flew past his window, but the heat shield held!' },
          { timestamp: '03:25', speaker: 'CAPCOM', text: 'It held. He splashed down safely in the Atlantic Ocean after three historic orbits.' }
        ]
      },
      simChallenge: {
        title: 'Simulator Challenge: Reach Orbit with >15% Fuel Margin',
        instruction: 'Execute pitch kick at 10,000 meters, stage the booster cleanly, and achieve a 180 km circular orbit with propellant to spare.',
        targetMissionId: 'NASA-M001'
      },
      recap: 'Recap: Thrust beats gravity and drag. Dropping empty stages sheds dead weight. Orbit is horizontal speed balancing gravitational fall.'
    },
    video: {
      moduleId: 1,
      title: 'Escaping Earth: Forces, Staging & The Gravity Curve',
      duration: '2:40',
      concept: 'Newton\'s Third Law, Atmospheric Drag & Orbital Insertion Velocity',
      nasaMediaCredit: 'NASA Kennedy Space Center Video Archives / Mercury-Atlas Footage (Public Domain)',
      steps: [
        {
          stepNumber: 1,
          title: 'Launch Pad Countdown',
          type: 'HOOK',
          caption: 'Watch the hold-down arms release as dual Rocketdyne engines build 360,000 pounds of thrust at Pad 14.',
          nasaMediaCredit: 'NASA Mercury-Atlas MA-6 Archives'
        },
        {
          stepNumber: 2,
          title: 'Newton\'s 3rd Law Balloon Demo',
          type: 'ANIMATION',
          caption: 'Action and reaction: high-pressure gas venting backward propels the mass forward with equal and opposite force.',
          nasaMediaCredit: 'NASA STEM Engagement Resources'
        },
        {
          stepNumber: 3,
          title: 'Stage Separation Sequence',
          type: 'STORY',
          caption: 'The booster section unlatches and drops away, leaving the sustainer engine to accelerate the lightweight upper vehicle into orbit.',
          nasaMediaCredit: 'NASA Glenn Research Center Educational Video'
        },
        {
          stepNumber: 4,
          title: 'The Gravity Turn into Orbit',
          type: 'SIM_TIE_IN',
          caption: 'Notice how the rocket tilts horizontally into the flight path—building horizontal speed instead of pure vertical height.',
          nasaMediaCredit: 'Team Mysterio 3D Mission Simulator'
        },
        {
          stepNumber: 5,
          title: 'Orbital Insertion Challenge',
          type: 'CHALLENGE',
          caption: 'Challenge: Pilot the Mercury-Atlas launch profile and reach orbit with 15% fuel margin!',
          nasaMediaCredit: 'Jr_AstroCamp Simulator Engine'
        }
      ],
      oneLineChallenge: 'Execute the gravity turn at T+60s and achieve 7.8 km/s velocity without burning into the red reserve.'
    }
  },

  // ── MODULE 2: DOCKING ───────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Module 2: Docking — The Slow Dance',
    themeColor: '#38bdf8',
    badge: 'ORBITAL',
    notebook: {
      moduleId: 2,
      moduleTitle: 'Module 2: Docking · The Slow Dance',
      subtitle: 'Relative Velocity, Thruster Timing & Emergency Recovery',
      nasaMission: 'Gemini 8 (Neil Armstrong & David Scott, 1966)',
      gradeLevel: 'Explorer (Ages 8–13) & All Ages',
      bigQuestion: 'Why is space docking called a "slow dance" instead of a high-speed chase?',
      keyIdeas: [
        {
          id: 'm2-idea-1',
          title: 'Relative Velocity (Two Cars on a Highway)',
          explanation: 'Both spacecraft orbit Earth at 28,000 km/h. But when approaching each other, their relative speed must be under 0.2 meters per second—slower than a gentle walking pace!',
          sketchType: 'RELATIVE_SPEED',
          fillInPrompt: 'Even though two spacecraft move at hypersonic orbital speed, their ________ speed relative to each other must be under 0.2 m/s.',
          correctAnswer: 'relative',
          hint: 'Think of two cars driving side-by-side on the freeway at 100 km/h.'
        },
        {
          id: 'm2-idea-2',
          title: 'Small Thruster Bursts (No Air Friction)',
          explanation: 'In the vacuum of space, there is no air friction to slow you down. If you fire a thruster forward, you will keep moving forward forever until an equal thruster burst fires backward to stop you.',
          sketchType: 'THRUSTER_BURSTS',
          fillInPrompt: 'Because space has zero air resistance, astronauts must use precise counter-firing thruster ________ to cancel momentum.',
          correctAnswer: 'bursts',
          hint: 'Short pulses of gas: b-u-r-s-t-s.'
        },
        {
          id: 'm2-idea-3',
          title: 'Matching Speed and Angle (Docking Latches)',
          explanation: 'The Gemini nose cone had to align within a few degrees of the Agena docking collar. Docking too fast would crush the latches; docking at an angle would bounce the craft apart into a tumbling spin.',
          sketchType: 'DOCKING_ALIGN',
          fillInPrompt: 'To successfully lock mechanical docking latches, pilots must match both closure speed and approach ________.',
          correctAnswer: 'angle',
          hint: 'The alignment direction measured in degrees.'
        }
      ],
      predictionPrompt: 'If I burn forward continuously when approaching the docking port, I predict my spacecraft will...',
      vocabulary: [
        { term: 'Relative Velocity', definition: 'The difference in velocity between two moving objects.' },
        { term: 'Rendezvous', definition: 'Bringing two spacecraft to the same orbit, location, and time.' },
        { term: 'Agena GATV', definition: 'The uncrewed target vehicle used by NASA for the first orbital docking.' },
        { term: 'RCS (Reaction Control)', definition: 'Small thrusters used to control attitude (roll, pitch, yaw) and translation.' },
        { term: 'Short Circuit', definition: 'An electrical failure causing a thruster valve to freeze in the open firing state.' }
      ],
      debriefPrompt: 'After flying the Gemini docking mission: What was your closure velocity at contact? Did you maintain 3-axis gyro stabilization?',
      nasaCitation: 'NASA SP-4203 "On the Shoulders of Titans: A History of Project Gemini"; Gemini 8 Mission Report (March 1966).'
    },
    audio: {
      moduleId: 2,
      title: 'Gemini 8: The Thruster Runaway & The Cool Head',
      duration: '4:45',
      hook: 'March 16, 1966. Neil Armstrong and Dave Scott accomplish humanity\'s first space docking. But 27 minutes later, the combined spacecraft begins spinning uncontrollably. What caused the spin, and how did they survive?',
      storyBeats: {
        beat1Title: 'The Rendezvous and Gentle Latch',
        beat2Title: 'Thruster #8 Stuck: Undocking Makes It Worse',
        beat3Title: '60 RPM Spin and the Emergency RCS Breakers',
        transcript: [
          { timestamp: '00:00', speaker: 'CAPCOM', text: 'Module 2: Orbital Docking and Spacecraft Recovery. CapCom online.' },
          { timestamp: '00:20', speaker: 'CADET_MAYA', text: 'CapCom, docking sounds easy if you have radar. Why was Gemini 8 so dangerous?' },
          { timestamp: '00:32', speaker: 'CAPCOM', text: 'Docking was completely untested in 1966. Armstrong eased Gemini 8 into the Agena collar at barely 8 centimeters per second. A perfect latch.' },
          { timestamp: '01:05', speaker: 'CADET_MAYA', text: 'And then the ship started rolling?' },
          { timestamp: '01:12', speaker: 'CAPCOM', text: 'Yes. Roll thruster #8 suffered an electrical short circuit and stuck open. At first, they thought it was the Agena. So they undocked.' },
          { timestamp: '01:40', speaker: 'CADET_MAYA', text: 'Did undocking stop the spin?' },
          { timestamp: '01:48', speaker: 'CAPCOM', text: 'No! Without the Agena\'s heavy mass to resist it, the Gemini rolled even faster—nearly one full revolution per second! The crew was on the verge of blacking out.' },
          { timestamp: '02:28', speaker: 'CADET_MAYA', text: 'How did Neil Armstrong stop it?' },
          { timestamp: '02:35', speaker: 'CAPCOM', text: 'He stayed completely calm. He turned off the entire orbital thruster system and activated the Re-entry Control System (RCS) to fire counter-burns.' },
          { timestamp: '03:15', speaker: 'CADET_MAYA', text: 'That saved their lives, but it forced an emergency landing!' },
          { timestamp: '03:22', speaker: 'CAPCOM', text: 'Using the re-entry thrusters meant mission rules required landing right away. They splashed down safely in the western Pacific. A masterclass in crisis management.' }
        ]
      },
      simChallenge: {
        title: 'Simulator Challenge: Soft Docking at <0.15 m/s',
        instruction: 'Approach the Agena target collar without exceeding 0.15 m/s relative speed, keeping lateral crosshairs centered.',
        targetMissionId: 'NASA-M002'
      },
      recap: 'Recap: Docking requires near-zero relative velocity. In vacuum, every motion needs a counter-burst. Staying calm under pressure saves missions.'
    },
    video: {
      moduleId: 2,
      title: 'The Slow Dance: Relative Vectors & Emergency Stabilization',
      duration: '2:55',
      concept: 'Relative Velocity, Docking Crosshairs & Thruster Runaway Recovery',
      nasaMediaCredit: 'NASA Project Gemini Historical Archives / National Archives (Public Domain)',
      steps: [
        {
          stepNumber: 1,
          title: 'Approach Through the Reticle',
          type: 'HOOK',
          caption: 'Watch Gemini 8 nose cone align with Agena target vehicle collar over Earth\'s blue limb.',
          nasaMediaCredit: 'NASA Gemini 8 Onboard 16mm Film'
        },
        {
          stepNumber: 2,
          title: 'Spinning Chair Angular Demo',
          type: 'ANIMATION',
          caption: 'Demonstrating moment of inertia: undocking the heavy Agena caused the Gemini capsule\'s spin rate to instantly surge.',
          nasaMediaCredit: 'NASA STEM Educational Demonstrations'
        },
        {
          stepNumber: 3,
          title: 'The Stuck Thruster #8 Incident',
          type: 'STORY',
          caption: 'Telemetry reconstructed: stuck valve continuously firing 25 pounds of hydrazine thrust into a catastrophic roll.',
          nasaMediaCredit: 'NASA SP-4203 Engineering Diagnostics'
        },
        {
          stepNumber: 4,
          title: 'RCS Emergency Counter-Burn',
          type: 'SIM_TIE_IN',
          caption: 'Watch the simulated gyro indicator freeze as pulsed RCS burns neutralize 60 RPM angular momentum.',
          nasaMediaCredit: 'Team Mysterio 3D Mission Simulator'
        },
        {
          stepNumber: 5,
          title: 'Precision Docking Challenge',
          type: 'CHALLENGE',
          caption: 'Dock with the target vehicle in the simulator with less than 2 degrees angular deviation!',
          nasaMediaCredit: 'Jr_AstroCamp Simulator Engine'
        }
      ],
      oneLineChallenge: 'Keep your relative velocity needle under 0.15 m/s while maintaining 3-axis alignment to latch.'
    }
  },

  // ── MODULE 3: LANDER ────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Module 3: Lander — Soft Touchdown',
    themeColor: '#10b981',
    badge: 'LUNAR',
    notebook: {
      moduleId: 3,
      moduleTitle: 'Module 3: Lander · Soft Touchdown',
      subtitle: 'Moon Gravity, Fuel Budgets & Deciding Under Pressure',
      nasaMission: 'Apollo 11 Lunar Module Eagle (Armstrong & Aldrin, 1969)',
      gradeLevel: 'Explorer (Ages 8–13) & All Ages',
      bigQuestion: 'How do you land softly on a world with no atmosphere to slow your parachute?',
      keyIdeas: [
        {
          id: 'm3-idea-1',
          title: 'Gravity Differs Between Worlds',
          explanation: 'On Earth, gravity pulls at 9.8 m/s². On the Moon, gravity is only 1.62 m/s² (about 1/6th of Earth). Mars is in between at 3.71 m/s² (about 38%). But with no air on the Moon, parachutes are useless—only rocket thrust can slow you down!',
          sketchType: 'GRAVITY_COMPARE',
          fillInPrompt: 'Because the Moon has no atmosphere, a lander cannot use parachutes and must rely 100% on ________ thrust to brake.',
          correctAnswer: 'rocket',
          hint: 'The powered descent engine bell.'
        },
        {
          id: 'm3-idea-2',
          title: 'Descent Speed vs Fuel Burn',
          explanation: 'Hovering burns hundreds of kilograms of precious fuel every few seconds. Every second spent searching for a landing spot drains the fuel tank toward the critical "dead man\'s line".',
          sketchType: 'DESCENT_FUEL',
          fillInPrompt: 'Hovering in place to inspect the ground consumes precious propellant at a fixed ________ rate without losing altitude.',
          correctAnswer: 'burn',
          hint: 'Propellant consumption rate.'
        },
        {
          id: 'm3-idea-3',
          title: 'Why You Can\'t Brake at the Last Second (Inertia)',
          explanation: 'A lander falling at 50 m/s has tremendous downward inertia. The throttle engine has a maximum thrust limit. If you wait too long to fire the engine, the rocket cannot overcome inertia in time, causing a crash.',
          sketchType: 'INERTIA_BRAKING',
          fillInPrompt: 'Because rocket engines have finite thrust limits, braking too late causes a catastrophic surface ________.',
          correctAnswer: 'impact',
          hint: 'A hard landing or collision.'
        }
      ],
      predictionPrompt: 'If I wait until 50 meters altitude to throttle up the descent engine, I predict...',
      vocabulary: [
        { term: 'Lunar Gravity', definition: '1.62 m/s² (~1/6th Earth\'s gravity), meaning objects fall more slowly but have identical mass.' },
        { term: '1202 Alarm', definition: 'Apollo guidance computer executive overflow alarm caused by radar CPU cycle overload.' },
        { term: 'Descent Engine (DPS)', definition: 'The throttleable rocket engine on the Apollo Lunar Module descent stage.' },
        { term: 'Fuel Margin', definition: 'The seconds of hover fuel remaining before the pilot must land or abort.' },
        { term: 'Contact Probe', definition: 'A 67-inch wire probe dangling beneath the landing pads to sense surface contact.' }
      ],
      debriefPrompt: 'After flying the Apollo 11 Lunar Landing: How many seconds of fuel remained at engine shutdown? Did you avoid boulders in West Crater?',
      nasaCitation: 'NASA SP-4029 "Apollo: The Definitive Sourcebook"; Apollo 11 Mission Operations Transcript (July 20, 1969).'
    },
    audio: {
      moduleId: 3,
      title: 'Apollo 11: 1202 Alarm and Seconds of Fuel in West Crater',
      duration: '4:50',
      hook: 'July 20, 1969. Three thousand feet above the Moon, the guidance computer flashes a 1202 alarm. Houston has five seconds to decide: abort the mission, or land on the Moon?',
      storyBeats: {
        beat1Title: 'The 1202 Program Alarm & Steve Bales\' "GO"',
        beat2Title: 'Armstrong\'s Window: Car-Sized Boulders in West Crater',
        beat3Title: 'Fuel Callouts: "60 Seconds... 30 Seconds... Contact Light"',
        transcript: [
          { timestamp: '00:00', speaker: 'CAPCOM', text: 'This is CapCom Charlie Duke in Mission Control. Descent monitoring active.' },
          { timestamp: '00:22', speaker: 'CADET_MAYA', text: 'CapCom, what does a 1202 alarm actually mean? Was the engine blowing up?' },
          { timestamp: '00:32', speaker: 'CAPCOM', text: 'Not the engine, Maya! The guidance computer was overloaded. The rendezvous radar was sending too much data, stealing processor cycles.' },
          { timestamp: '01:05', speaker: 'CADET_MAYA', text: 'And in Houston, a 26-year-old engineer said keep going?' },
          { timestamp: '01:14', speaker: 'CAPCOM', text: 'Steve Bales knew the software priority rules. As long as the alarm was intermittent, the computer was dropping low-priority tasks and still flying the ship. We gave the call: "We\'re GO on that alarm!"' },
          { timestamp: '01:50', speaker: 'CADET_MAYA', text: 'Then Armstrong looked out the triangular window and saw huge boulders!' },
          { timestamp: '02:00', speaker: 'CAPCOM', text: 'The computer was aiming them straight into West Crater, a boulder field full of rocks the size of cars. Neil took manual control, pitched forward, and flew over it.' },
          { timestamp: '02:40', speaker: 'CADET_MAYA', text: 'And fuel was running out!' },
          { timestamp: '02:48', speaker: 'CAPCOM', text: 'I called down: "60 seconds!" Then "30 seconds!" The propellant tanks were nearly dry. Dust was blowing everywhere.' },
          { timestamp: '03:25', speaker: 'CADET_MAYA', text: 'And then Aldrin called: "Contact light!"' },
          { timestamp: '03:32', speaker: 'CAPCOM', text: '"Engine stop." And Neil said: "Houston, Tranquility Base here. The Eagle has landed." We were turning blue holding our breath!' }
        ]
      },
      simChallenge: {
        title: 'Simulator Challenge: Touchdown at <1.2 m/s Vertical Speed',
        instruction: 'Guide the Lunar Module over the boulder field and touch down with at least 20 seconds of fuel remaining.',
        targetMissionId: 'NASA-M003'
      },
      recap: 'Recap: Moon gravity is 1/6th Earth. No air means rocket thrust alone can slow you. Managing descent rate preserves critical fuel.'
    },
    video: {
      moduleId: 3,
      title: 'Soft Touchdown: The Physics of Lunar Descent & Fuel Budgets',
      duration: '2:45',
      concept: 'Thrust-to-Weight Throttle, Descent Gravity Vectors & Propellant Margin',
      nasaMediaCredit: 'NASA Apollo 11 Lunar Surface Camera & Onboard 16mm DAC Film (Public Domain)',
      steps: [
        {
          stepNumber: 1,
          title: 'The Triangular Window View',
          type: 'HOOK',
          caption: 'Watch Neil Armstrong look down at the cratered lunar surface through Eagle\'s cockpit window.',
          nasaMediaCredit: 'NASA Apollo 11 Onboard Footage'
        },
        {
          stepNumber: 2,
          title: 'Descent Engine Cutaway Diagram',
          type: 'ANIMATION',
          caption: 'Throttleable hypergolic descent engine balancing lunar gravity ($1.62\\text{ m/s}^2$) against downward inertia.',
          nasaMediaCredit: 'NASA Apollo Technical Drawing Archive'
        },
        {
          stepNumber: 3,
          title: 'Decision Pause: 30 Seconds of Fuel',
          type: 'STORY',
          caption: 'Interactive Pause: The fuel light flashes. Do you land in the boulders now, or fly forward into unknown terrain?',
          nasaMediaCredit: 'Apollo 11 Mission Operations Transcript'
        },
        {
          stepNumber: 4,
          title: 'Radial Dust Sheet Touchdown',
          type: 'SIM_TIE_IN',
          caption: 'Watch surface contact probes touch regolith at 0.5 m/s vertical velocity as dust sheets blow radially outward.',
          nasaMediaCredit: 'Team Mysterio 3D Mission Simulator'
        },
        {
          stepNumber: 5,
          title: 'Tranquility Base Landing Challenge',
          type: 'CHALLENGE',
          caption: 'Touch down safely inside the safe landing circle before your fuel gauge reaches zero!',
          nasaMediaCredit: 'Jr_AstroCamp Simulator Engine'
        }
      ],
      oneLineChallenge: 'Touch down at under 1.2 m/s vertical speed with at least 15 seconds of fuel remaining.'
    }
  },

  // ── MODULE 4: ROVER ─────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Module 4: Rover — Reading the Ground',
    themeColor: '#ef4444',
    badge: 'ROVER',
    notebook: {
      moduleId: 4,
      moduleTitle: 'Module 4: Rover · Reading the Ground',
      subtitle: 'Airbags, Rocker-Bogie Mobility & Scientific Route Trade-Offs',
      nasaMission: 'Mars Pathfinder & Sojourner (July 4, 1997)',
      gradeLevel: 'Explorer (Ages 8–13) & All Ages',
      bigQuestion: 'How do scientists explore Mars when radio signals take up to 20 minutes to reach Earth?',
      keyIdeas: [
        {
          id: 'm4-idea-1',
          title: 'Risk vs Reward in Route Planning',
          explanation: 'A smooth flat plain is safe for the rover\'s wheels, but boring scientifically. High-value rocks and layered cliffs are dangerous (steep slopes, sharp rocks) but hold the geological secrets of ancient water and volcanoes.',
          sketchType: 'ROVER_ROUTES',
          fillInPrompt: 'Rover drivers must balance mission safety against scientific reward when selecting which ________ to visit.',
          correctAnswer: 'targets',
          hint: 'Science spots or rock samples.'
        },
        {
          id: 'm4-idea-2',
          title: 'Why Scientists Choose Sample Sites',
          explanation: 'Sojourner used an Alpha Proton X-ray Spectrometer (APXS) pressed against volcanic rocks like "Barnacle Bill" and "Yogi". By measuring elemental backscatter, scientists discovered that Martian rocks were rich in silica, proving volcanic history.',
          sketchType: 'SAMPLE_GEOLOGY',
          fillInPrompt: 'Sojourner placed its APXS sensor against rock surfaces to measure the elemental ________ of Mars.',
          correctAnswer: 'composition',
          hint: 'What the rock is made of.'
        },
        {
          id: 'm4-idea-3',
          title: 'Rover Limits: Power, Time & Terrain',
          explanation: 'Sojourner was only 10.6 kg and powered by a solar array producing barely 16 watts—less power than a nightlight! It could only drive a few meters each sol (Martian day) before its batteries needed recharging.',
          sketchType: 'ROVER_LIMITS',
          fillInPrompt: 'With only 16 watts of solar power, Sojourner had strict limits on driving distance and daily operation ________.',
          correctAnswer: 'time',
          hint: 'Hours or minutes per sol.'
        }
      ],
      predictionPrompt: 'If I drive the rover across a field of jagged rocks instead of the sand path, I predict...',
      vocabulary: [
        { term: 'Airbag Landing', definition: 'Surrounding the lander with pressurized spheres to bounce safely across rough terrain.' },
        { term: 'Rocker-Bogie', definition: 'A suspension mechanism without springs that keeps all 6 wheels on the ground over rough rocks.' },
        { term: 'APXS', definition: 'Alpha Proton X-ray Spectrometer: a sensor that bombards rocks with alpha particles to detect chemical elements.' },
        { term: 'Sol', definition: 'One solar day on Mars (24 hours, 39 minutes, and 35 seconds).' },
        { term: 'Light-Time Delay', definition: 'The 3 to 22-minute delay for radio signals to travel between Earth and Mars at the speed of light.' }
      ],
      debriefPrompt: 'After driving Sojourner on Ares Vallis in the simulator: Did you successfully deploy the APXS on Barnacle Bill without getting high-centered?',
      nasaCitation: 'NASA JPL Mars Pathfinder Science Results (Science, Vol. 278, 1997); JPL Sojourner Technical Archive.'
    },
    audio: {
      moduleId: 4,
      title: 'Sojourner: 83 Days on Ares Vallis Instead of Seven',
      duration: '4:15',
      hook: 'July 4, 1997. A metal pyramid bounces 40 feet into the Martian air encased in giant white airbags. Inside sits a rover no bigger than a microwave oven. How did Sojourner survive 83 days on a world where daytime is freezing?',
      storyBeats: {
        beat1Title: 'Airbags Deflate and Petals Unfold on Ares Vallis',
        beat2Title: 'Sol 2: The First Drive Down the Wire Ramp',
        beat3Title: 'Sniffing Rocks: Barnacle Bill, Yogi and 83 Days of Science',
        transcript: [
          { timestamp: '00:00', speaker: 'CAPCOM', text: 'JPL Mars Control. Pathfinder and Sojourner mission replay active.' },
          { timestamp: '00:15', speaker: 'CADET_MAYA', text: 'CapCom, Sojourner looks like a toy! Did people really drive it with a joystick from Pasadena?' },
          { timestamp: '00:25', speaker: 'CAPCOM', text: 'No joystick, Maya! Because of the distance between planets, radio signals took over 10 minutes to reach Mars. If you saw a boulder and sent a turn command, the rover would have crashed 10 minutes earlier!' },
          { timestamp: '01:00', speaker: 'CADET_MAYA', text: 'So it had to drive itself?' },
          { timestamp: '01:06', speaker: 'CAPCOM', text: 'Engineers sent a daily route plan once per sol. Sojourner used onboard laser hazard-detection sensors to autonomously steer around rocks taller than its wheels.' },
          { timestamp: '01:42', speaker: 'CADET_MAYA', text: 'And its first target was that strange rock Barnacle Bill?' },
          { timestamp: '01:50', speaker: 'CAPCOM', text: 'Yes! On Sol 3, Sojourner rolled up, pressed its APXS sensor against the rock, and proved it was an andesite volcanic rock—rich in silica, meaning Mars was geologically active!' },
          { timestamp: '02:30', speaker: 'CADET_MAYA', text: 'Wasn\'t the mission only supposed to last 7 days?' },
          { timestamp: '02:38', speaker: 'CAPCOM', text: 'Seven sols was the requirement. Sojourner kept driving for 83 days! It sent 550 photos and chemical data on 15 rocks until the Pathfinder base station battery finally died in the sub-zero cold.' }
        ]
      },
      simChallenge: {
        title: 'Simulator Challenge: Collect 3 Rock Spectra on Sol 2',
        instruction: 'Navigate the rocky terrain of Ares Vallis, avoid deep sand traps, and deploy the APXS on Barnacle Bill and Yogi.',
        targetMissionId: 'NASA-M004'
      },
      recap: 'Recap: Distance causes signal delay, requiring autonomous navigation. Rocker-bogie suspension keeps all 6 wheels on the ground. Science targets balance curiosity against rover safety.'
    },
    video: {
      moduleId: 4,
      title: 'Reading the Ground: Rocker-Bogie Mobility & Mars Science',
      duration: '2:35',
      concept: 'Airbag Landings, Rocker-Bogie Mechanics & Light-Time Delay Routing',
      nasaMediaCredit: 'NASA JPL-Caltech / Mars Pathfinder Image Archive (Public Domain)',
      steps: [
        {
          stepNumber: 1,
          title: 'Airbag Bounce Simulation',
          type: 'HOOK',
          caption: 'Watch the Pathfinder lander bounce across Ares Vallis at 50 km/h, cushioned by 24 pressurized Kevlar airbags.',
          nasaMediaCredit: 'NASA JPL Pathfinder Animation'
        },
        {
          stepNumber: 2,
          title: 'Rocker-Bogie Suspension Mechanics',
          type: 'ANIMATION',
          caption: 'Interactive cutaway showing how the differential rocker arm allows wheels to climb obstacles twice the wheel diameter without tipping.',
          nasaMediaCredit: 'NASA JPL Robotics Laboratory'
        },
        {
          stepNumber: 3,
          title: 'The Sol 2 Ramp Deployment',
          type: 'STORY',
          caption: 'Historic onboard camera view: Sojourner\'s cleated aluminum wheels rolling onto Mars soil for humanity\'s very first rover tracks.',
          nasaMediaCredit: 'NASA JPL Planetary Data System'
        },
        {
          stepNumber: 4,
          title: 'Route Planning in the Sim',
          type: 'SIM_TIE_IN',
          caption: 'Sim view: mapping waypoints around wheel-trap dunes toward rock targets Barnacle Bill and Yogi.',
          nasaMediaCredit: 'Team Mysterio 3D Mission Simulator'
        },
        {
          stepNumber: 5,
          title: 'Ares Vallis Science Run',
          type: 'CHALLENGE',
          caption: 'Drive the rover to rock Yogi within 15 minutes of simulated solar battery life!',
          nasaMediaCredit: 'Jr_AstroCamp Simulator Engine'
        }
      ],
      oneLineChallenge: 'Reach rock Yogi and capture APXS data before the battery charge drops below 20%.'
    }
  },

  // ── MODULE 5: TELESCOPE ────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Module 5: Telescope — Catching Light',
    themeColor: '#a78bfa',
    badge: 'OPTICS',
    notebook: {
      moduleId: 5,
      moduleTitle: 'Module 5: Telescope · Catching Light',
      subtitle: 'Atmospheric Turbulence, Spherical Aberration & Orbital Spacewalks',
      nasaMission: 'Hubble Space Telescope (STS-31 & STS-61, 1990–1993)',
      gradeLevel: 'Explorer (Ages 8–13) & All Ages',
      bigQuestion: 'Why spend billions launching a telescope into space when mountaintops are already so tall?',
      keyIdeas: [
        {
          id: 'm5-idea-1',
          title: 'Why Space Beats Mountaintops (Atmospheric Shimmer)',
          explanation: 'Earth\'s atmosphere is full of swirling warm and cold air pockets that refract light like looking through moving water. Even the highest mountaintop sees blurry stars. Space has zero atmosphere, giving crystal-clear diffraction-limited resolution.',
          sketchType: 'ATMOSPHERE_TURBULENCE',
          fillInPrompt: 'Ground telescopes suffer from atmospheric turbulence that causes stars to "twinkle" and blurs optical ________.',
          correctAnswer: 'resolution',
          hint: 'The clarity and sharpness of the image.'
        },
        {
          id: 'm5-idea-2',
          title: 'The Electromagnetic Spectrum',
          explanation: 'Visible light is only a tiny slice of the spectrum! Ground telescopes cannot see ultraviolet or far-infrared because Earth\'s ozone layer and water vapor block them. A space telescope sees ultraviolet starbursts and infrared hidden galaxies.',
          sketchType: 'EM_SPECTRUM',
          fillInPrompt: 'Earth\'s atmosphere absorbs most ultraviolet and infrared rays, hiding huge parts of the electromagnetic ________ from ground observatories.',
          correctAnswer: 'spectrum',
          hint: 'The full rainbow of wavelengths from radio to gamma rays.'
        },
        {
          id: 'm5-idea-3',
          title: 'The Hubble Flaw (Spherical Aberration)',
          explanation: 'When Hubble launched in 1990, its 2.4-meter primary mirror had a microscopic flaw: the outer edge was ground 2.2 microns too flat (1/50th the thickness of a human hair!). Light rays focused at different depths, creating blurry halos around stars.',
          sketchType: 'SPHERICAL_ABERRATION',
          fillInPrompt: 'Because light rays from the edge and center focused at different depths, Hubble suffered from spherical ________.',
          correctAnswer: 'aberration',
          hint: 'The optical defect term: a-b-e-r-r-a-t-i-o-n.'
        }
      ],
      predictionPrompt: 'If we put eyeglasses (corrective mirrors) into the optical path of a blurry telescope, I predict the light rays will...',
      vocabulary: [
        { term: 'Aperture', definition: 'The diameter of a telescope\'s primary mirror or lens that gathers incoming light.' },
        { term: 'Spherical Aberration', definition: 'An optical defect where rays passing through mirror edges focus at a different point than central rays.' },
        { term: 'COSTAR', definition: 'Corrective Optics Space Telescope Axial Replacement: the corrective mirror system installed during STS-61.' },
        { term: 'Diffraction Limit', definition: 'The theoretical maximum sharpness achievable by an optical system based on wavelength.' },
        { term: 'WFPC2', definition: 'Wide Field and Planetary Camera 2: the upgraded camera with built-in internal corrective optics.' }
      ],
      debriefPrompt: 'After installing COSTAR in the simulator: Did your galaxy image transform from a fuzzy halo into sharp spiral arms?',
      nasaCitation: 'NASA SP-4601 "The Hubble Space Telescope: Optical Operations and Servicing"; STS-61 Mission Log (Dec 1993).'
    },
    audio: {
      moduleId: 5,
      title: 'Hubble\'s New Eyes: The Spacewalk to Fix the Universe',
      duration: '4:35',
      hook: 'April 24, 1990. Space Shuttle Discovery launches Hubble. Two months later, astronomers reveal a devastating truth: the world\'s most expensive mirror is blurry. How did five spacewalkers fix a two-micron flaw in zero gravity?',
      storyBeats: {
        beat1Title: 'First Light Shock: The 2.2-Micron Polishing Error',
        beat2Title: 'COSTAR: Building Corrective "Eyeglasses" for a Space Telescope',
        beat3Title: 'STS-61 Spacewalk: 35 Hours Outside Endeavour',
        transcript: [
          { timestamp: '00:00', speaker: 'CAPCOM', text: 'Hubble Space Telescope Operations. Science lesson initialized.' },
          { timestamp: '00:18', speaker: 'CADET_MAYA', text: 'CapCom, how could scientists make a mistake on Hubble\'s mirror? It was polished for years!' },
          { timestamp: '00:28', speaker: 'CAPCOM', text: 'The reflective null corrector tool used during manufacturing had an optical spacer misplaced by 1.3 millimeters. The mirror was polished to the wrong curvature by 2.2 microns.' },
          { timestamp: '01:05', speaker: 'CADET_MAYA', text: 'Two microns? That\'s thinner than a single strand of silk!' },
          { timestamp: '01:12', speaker: 'CAPCOM', text: 'In optics, that was huge. Light rays from the perimeter focused 4 centimeters behind the central rays. Every star had a giant fuzzy halo.' },
          { timestamp: '01:45', speaker: 'CADET_MAYA', text: 'Did they have to bring Hubble back to Earth?' },
          { timestamp: '01:52', speaker: 'CAPCOM', text: 'No. Hubble was built from the start to be serviced in orbit! In December 1993, Space Shuttle Endeavour caught Hubble. Spacewalkers Story Musgrave and Jeffrey Hoffman opened the back shroud.' },
          { timestamp: '02:35', speaker: 'CADET_MAYA', text: 'And they slid in COSTAR?' },
          { timestamp: '02:42', speaker: 'CAPCOM', text: 'They removed the High Speed Photometer and inserted COSTAR—a telephone-booth-sized instrument that unfolded coin-sized mirrors to intercept the light beams and cancel the flaw.' },
          { timestamp: '03:20', speaker: 'CADET_MAYA', text: 'And when they took the first picture of Galaxy M100 in January 1994... crystal clear!' },
          { timestamp: '03:30', speaker: 'CAPCOM', text: 'Pinpoint stars and glowing nebulae across millions of light-years. Humanity\'s vision had been restored.' }
        ]
      },
      simChallenge: {
        title: 'Simulator Challenge: Align COSTAR Mirrors on Galaxy Target',
        instruction: 'Guide the spacewalker arm, align the corrective mirror tilt within 0.1 arcseconds, and capture a diffraction-limited galaxy image.',
        targetMissionId: 'NASA-M005'
      },
      recap: 'Recap: Space eliminates atmospheric turbulence and unlocks UV/infrared light. Precision optical errors can be corrected with inverse mirrors. Modular orbital servicing saves flagships.'
    },
    video: {
      moduleId: 5,
      title: 'Catching Light: Waves, Aberrations & Hubble\'s Orbital Repair',
      duration: '2:40',
      concept: 'Atmospheric Scintillation, Ray Tracing Optics & EVA Servicing',
      nasaMediaCredit: 'NASA Goddard Space Flight Center / STS-61 Archives (Public Domain)',
      steps: [
        {
          stepNumber: 1,
          title: 'Twinkling Atmosphere vs Crisp Space',
          type: 'HOOK',
          caption: 'Split comparison: ground telescope through turbulent atmosphere wavefronts vs pristine vacuum wavefront in orbit.',
          nasaMediaCredit: 'NASA Goddard Space Flight Center Science Visualizations'
        },
        {
          stepNumber: 2,
          title: 'Optical Ray Tracing Diagram',
          type: 'ANIMATION',
          caption: 'Animated rays reflecting from flawed primary mirror: showing the 2.2-micron edge error creating blurry focal planes.',
          nasaMediaCredit: 'STScI Optical Engineering Diagnostics'
        },
        {
          stepNumber: 3,
          title: 'STS-61 Spacewalk in Endeavour Payload Bay',
          type: 'STORY',
          caption: 'Astronaut Jeffrey Hoffman on the Canadarm sliding COSTAR into Hubble\'s axial instrument bay 350 miles above Earth.',
          nasaMediaCredit: 'NASA STS-61 Historical Spacewalk Video'
        },
        {
          stepNumber: 4,
          title: 'Galaxy M100 Before vs After Transformation',
          type: 'SIM_TIE_IN',
          caption: 'Watch the blurry donut stellar core transform into razor-sharp spiral arms in the interactive resolution comparison.',
          nasaMediaCredit: 'Team Mysterio 3D Mission Simulator'
        },
        {
          stepNumber: 5,
          title: 'Telescope Target Acquisition Challenge',
          type: 'CHALLENGE',
          caption: 'Lock onto Deep Field galaxy coordinates and achieve 99% optical alignment!',
          nasaMediaCredit: 'Jr_AstroCamp Simulator Engine'
        }
      ],
      oneLineChallenge: 'Align corrective optical tilt to resolve twin close-binary stars within 0.05 arcseconds.'
    }
  },

  // ── MODULE 6: DEEP SPACE ───────────────────────────────────────────────────
  {
    id: 6,
    name: 'Module 6: Deep Space — Borrowing Gravity',
    themeColor: '#ec4899',
    badge: 'INTERSTELLAR',
    notebook: {
      moduleId: 6,
      moduleTitle: 'Module 6: Deep Space · Borrowing Gravity',
      subtitle: 'Planetary Alignments, Gravity Assists & Signal Travel Delay',
      nasaMission: 'Voyager 1 & 2 (1977–Present)',
      gradeLevel: 'Explorer (Ages 8–13) & All Ages',
      bigQuestion: 'How can a spacecraft travel to the edge of the Solar System without carrying tons of fuel?',
      keyIdeas: [
        {
          id: 'm6-idea-1',
          title: 'The Gravity Assist (Stealing Orbital Momentum)',
          explanation: 'When a spacecraft flies behind a giant moving planet like Jupiter, Jupiter\'s immense gravity pulls the craft forward, adding orbital velocity to the probe while slowing Jupiter by an undetectable microscopic amount.',
          sketchType: 'GRAVITY_SLINGSHOT',
          fillInPrompt: 'A gravity assist slingshot adds orbital velocity to a spacecraft by stealing orbital momentum from a giant ________.',
          correctAnswer: 'planet',
          hint: 'Jupiter, Saturn, Uranus, or Neptune.'
        },
        {
          id: 'm6-idea-2',
          title: 'Early vs Late Course Corrections (Leverage)',
          explanation: 'Because space trajectories span billions of miles, a tiny 1 meter/second thruster burn done early near Earth shifts the probe\'s path by tens of thousands of miles at Jupiter. Waiting until you are near Jupiter requires hundreds of times more fuel!',
          sketchType: 'COURSE_CORRECTIONS',
          fillInPrompt: 'Course corrections made early in a trajectory require exponentially less ________ than corrections made late.',
          correctAnswer: 'fuel',
          hint: 'Propellant or energy.'
        },
        {
          id: 'm6-idea-3',
          title: 'Radiation Shielding & Deep Space Communication',
          explanation: 'Beyond Earth\'s magnetic field, cosmic rays and intense Jupiter radiation belts fry unshielded electronics. As distance grows to billions of miles, radio signals traveling at light speed take over 22 hours each way to reach the Deep Space Network.',
          sketchType: 'RADIATION_SHIELDING',
          fillInPrompt: 'Voyager 1 is so far away that its radio signals take over 22 ________ to travel one-way back to Earth.',
          correctAnswer: 'hours',
          hint: 'Light-time travel delay measured in h-o-u-r-s.'
        }
      ],
      predictionPrompt: 'If I perform a gravity assist in front of a planet instead of behind it, I predict the probe will...',
      vocabulary: [
        { term: 'Gravity Assist', definition: 'Using the gravitational pull and orbital motion of a planet to alter a spacecraft\'s path and speed.' },
        { term: 'Heliopause', definition: 'The boundary where the solar wind is turned back by the interstellar medium (~120+ AU).' },
        { term: '176-Year Alignment', definition: 'The rare geometric alignment of Jupiter, Saturn, Uranus, and Neptune allowing a 4-planet tour.' },
        { term: 'Deep Space Network (DSN)', definition: 'NASA\'s international array of giant 70-meter parabolic radio antennas in California, Spain, and Australia.' },
        { term: 'Golden Record', definition: 'A 12-inch gold-plated copper phonograph record carrying sounds and images of Earth into interstellar space.' }
      ],
      debriefPrompt: 'After executing the Jupiter slingshot in the simulator: What was your velocity boost ($\Delta v$)? Did you intersect Saturn\'s orbital path?',
      nasaCitation: 'NASA SP-4211 "Voyager: The Grand Tour of the Giant Planets"; JPL Voyager Interstellar Mission Status (2026).'
    },
    audio: {
      moduleId: 6,
      title: 'The Grand Tour: 176 Years in the Making',
      duration: '4:40',
      hook: 'In 1965, an intern at JPL discovered a celestial secret: once every 176 years, Jupiter, Saturn, Uranus, and Neptune line up in a spiral. A single probe could visit all four gas giants—if humanity launched before the window closed!',
      storyBeats: {
        beat1Title: 'Gary Flandro\'s Discovery & The Grand Tour Window',
        beat2Title: 'The Jupiter Slingshot: Slashing Transit from 30 Years to 12',
        beat3Title: 'Crossing the Heliopause: The Golden Record in Interstellar Space',
        transcript: [
          { timestamp: '00:00', speaker: 'CAPCOM', text: 'Voyager Flight Dynamics. Deep space mission telemetry active.' },
          { timestamp: '00:20', speaker: 'CADET_MAYA', text: 'CapCom, why did Voyager have to launch in 1977? Why not wait until we had faster rockets?' },
          { timestamp: '00:30', speaker: 'CAPCOM', text: 'Because of the planets, Maya! The four outer planets only align in that specific orbital geometry once every 176 years. If we missed 1977, we would have had to wait until the 22nd century!' },
          { timestamp: '01:08', speaker: 'CADET_MAYA', text: 'And how did gravity make them go faster without an engine?' },
          { timestamp: '01:16', speaker: 'CAPCOM', text: 'Think of throwing a tennis ball against the front of a speeding train. The ball bounces off with its own speed plus the train\'s speed! As Voyager dove behind Jupiter, it stole orbital energy from Jupiter\'s motion around the Sun.' },
          { timestamp: '02:00', speaker: 'CADET_MAYA', text: 'Did it slow Jupiter down?' },
          { timestamp: '02:06', speaker: 'CAPCOM', text: 'By about one trillionth of an inch over a billion years! But for Voyager, it doubled its speed and shaved 20 years off the journey to the outer planets.' },
          { timestamp: '02:45', speaker: 'CADET_MAYA', text: 'And now both Voyagers are beyond our Solar System?' },
          { timestamp: '02:52', speaker: 'CAPCOM', text: 'Voyager 1 entered interstellar space in 2012, and Voyager 2 in 2018. They crossed the heliopause where solar wind ends and cosmic rays begin. They are humanity\'s farthest messengers, carrying the Golden Record forever.' }
        ]
      },
      simChallenge: {
        title: 'Simulator Challenge: Time the Jupiter Periapsis Slingshot',
        instruction: 'Guide Voyager into Jupiter\'s hyperbolic gravity assist corridor to gain at least 12 km/s speed toward Saturn.',
        targetMissionId: 'NASA-M006'
      },
      recap: 'Recap: Rare planetary geometry opened a 176-year window. Gravity assists steal planetary momentum to accelerate deep space probes. Early trajectory corrections conserve vital fuel.'
    },
    video: {
      moduleId: 6,
      title: 'Borrowing Gravity: Planetary Assists & The Interstellar Journey',
      duration: '2:50',
      concept: 'Hyperbolic Trajectories, Conservation of Angular Momentum & Heliopause Crossing',
      nasaMediaCredit: 'NASA JPL-Caltech / Voyager Flight Video & Science Archive (Public Domain)',
      steps: [
        {
          stepNumber: 1,
          title: 'The 176-Year Planetary Clock',
          type: 'HOOK',
          caption: 'Watch the four outer planets line up in a rare alignment that occurs only once every 176 years.',
          nasaMediaCredit: 'NASA JPL Solar System Visualizer'
        },
        {
          stepNumber: 2,
          title: 'The Rolling Ball Slingshot Demo',
          type: 'ANIMATION',
          caption: 'Demonstrating hyperbolic deflection: a projectile diving behind a moving gravitational well accelerates forward.',
          nasaMediaCredit: 'NASA STEM Demonstration Physics Series'
        },
        {
          stepNumber: 3,
          title: 'Voyager Flight Past Jupiter & Saturn',
          type: 'STORY',
          caption: 'Real archival footage of Jupiter\'s swirling Great Red Spot and Saturn\'s brilliant rings captured during the 1979 flybys.',
          nasaMediaCredit: 'NASA JPL Voyager Imaging Team'
        },
        {
          stepNumber: 4,
          title: 'Deep Space Network Antenna Relay',
          type: 'SIM_TIE_IN',
          caption: 'Simulating the 22.5-hour speed-of-light radio delay between Voyager 1 and the Goldstone 70-meter antenna dish.',
          nasaMediaCredit: 'Team Mysterio 3D Mission Simulator'
        },
        {
          stepNumber: 5,
          title: 'The Interstellar Navigation Challenge',
          type: 'CHALLENGE',
          caption: 'Execute the Jupiter periapsis burn to slingshot out to interstellar space!',
          nasaMediaCredit: 'Jr_AstroCamp Simulator Engine'
        }
      ],
      oneLineChallenge: 'Intercept Jupiter\'s orbital shadow and gain $\Delta v \ge 12\\text{ km/s}$ toward interstellar space.'
    }
  }
];
