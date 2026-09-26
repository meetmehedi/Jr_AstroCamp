/**
 * allNasaMissions.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Complete roster of 76 real NASA flight missions from Mercury to Artemis III.
 * Generated from nasa_missions_catalog.csv for Astro Camp / Outpost Command.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type MissionEra =
  | "PIONEERS"          // Project Mercury & Gemini (1961-1966)
  | "LUNAR_APOLLO"       // Apollo Program & Skylab (1967-1975)
  | "SHUTTLE_ISS"        // Space Shuttle, Mir, ISS, Commercial Crew (1981-Present)
  | "ARTEMIS_ERA"        // Artemis Program & Robotic Lunar (2009-2027+)
  | "MARS_FLEET"         // Robotic Mars Armada (1964-Present)
  | "DEEP_WORLDS"        // Outer Planets, Venus, Mercury (1972-Present)
  | "COSMIC_SENTINELS";   // Great Observatories, Asteroids, Heliophysics, Earth Science (1972-Present)

export interface PlayableNasaMission {
  id: string;
  number: number;
  era: MissionEra;
  destination: string;
  destinationName: string;
  name: string;
  tagline: string;
  nasaProgram: string;
  launchYear: string;
  missionType: string;
  status: string;
  targetLocation: string;
  coordinates: string;
  gravityG: number;
  atmosphere: string;
  surfaceTempC: string;
  missionPatchEmoji: string;
  primaryInstrument: string;
  scientificProblem: {
    title: string;
    summary: string;
    astronautPOV: string;
    briefingAudio: string;
  };
  nasaCitation: {
    title: string;
    docNumber: string;
    linkTitle: string;
  };
  operationalGuide: string;
  visualPreset: {
    terrainColor: number;
    skyColor: number;
    fogColor: number;
    celestialBody: string;
    ambientIntensity: number;
    sunColor: number;
    sunIntensity: number;
  };
}

export const ALL_76_NASA_MISSIONS: PlayableNasaMission[] = [
  {
    "id": "NASA-M001",
    "number": 1,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Mercury Suborbital / LEO",
    "name": "Mercury-Redstone 3 (Freedom 7)",
    "tagline": "First U.S. crewed suborbital spaceflight flown by Alan Shepard.",
    "nasaProgram": "Project Mercury",
    "launchYear": "1961",
    "missionType": "Human Spaceflight / Suborbital",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "Mercury-Redstone 3 (Freedom 7) Operational Flight Challenge",
      "summary": "First U.S. crewed suborbital spaceflight flown by Alan Shepard.",
      "astronautPOV": "Commander, you are on console for Mercury-Redstone 3 (Freedom 7). Manual Protocol: Redstone rocket launch; suborbital trajectory reaching 116 miles altitude; manual hand-attitude control testing in microgravity; splashdown recovery.",
      "briefingAudio": "Flight Director to all stations: We are GO for Mercury-Redstone 3 (Freedom 7) under the Project Mercury. Review primary objective: First U.S. crewed suborbital spaceflight flown by Alan Shepard.. Operational procedure: Manual Protocol: Redstone rocket launch; suborbital trajectory reaching 116 miles altitude; manual hand-attitude control testing in microgravity; splashdown recovery."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Mercury-Redstone 3 (Freedom 7)",
      "docNumber": "NASA-M001-NASA-HIST",
      "linkTitle": "Project Mercury Official Record"
    },
    "operationalGuide": "Manual Protocol: Redstone rocket launch; suborbital trajectory reaching 116 miles altitude; manual hand-attitude control testing in microgravity; splashdown recovery.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M002",
    "number": 2,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Mercury Suborbital / LEO",
    "name": "Mercury-Redstone 4 (Liberty Bell 7)",
    "tagline": "Second U.S. suborbital mission flown by Virgil 'Gus' Grissom.",
    "nasaProgram": "Project Mercury",
    "launchYear": "1961",
    "missionType": "Human Spaceflight / Suborbital",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "Mercury-Redstone 4 (Liberty Bell 7) Operational Flight Challenge",
      "summary": "Second U.S. suborbital mission flown by Virgil 'Gus' Grissom.",
      "astronautPOV": "Commander, you are on console for Mercury-Redstone 4 (Liberty Bell 7). Manual Protocol: Suborbital flight path; manual attitude control maneuvers; evaluation of spacecraft cabin environmental control; explosive hatch deployment post-landing.",
      "briefingAudio": "Flight Director to all stations: We are GO for Mercury-Redstone 4 (Liberty Bell 7) under the Project Mercury. Review primary objective: Second U.S. suborbital mission flown by Virgil 'Gus' Grissom.. Operational procedure: Manual Protocol: Suborbital flight path; manual attitude control maneuvers; evaluation of spacecraft cabin environmental control; explosive hatch deployment post-landing."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Mercury-Redstone 4 (Liberty Bell 7)",
      "docNumber": "NASA-M002-NASA-HIST",
      "linkTitle": "Project Mercury Official Record"
    },
    "operationalGuide": "Manual Protocol: Suborbital flight path; manual attitude control maneuvers; evaluation of spacecraft cabin environmental control; explosive hatch deployment post-landing.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M003",
    "number": 3,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Mercury Suborbital / LEO",
    "name": "Mercury-Atlas 6 (Friendship 7)",
    "tagline": "First U.S. crewed orbital flight flown by John Glenn.",
    "nasaProgram": "Project Mercury",
    "launchYear": "1962",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "Mercury-Atlas 6 (Friendship 7) Operational Flight Challenge",
      "summary": "First U.S. crewed orbital flight flown by John Glenn.",
      "astronautPOV": "Commander, you are on console for Mercury-Atlas 6 (Friendship 7). Manual Protocol: Atlas launch vehicle insertion; 3 full Earth orbits; manual fly-by-wire attitude override following autopilot malfunction; retro-rocket burn and reentry thermal shield protection.",
      "briefingAudio": "Flight Director to all stations: We are GO for Mercury-Atlas 6 (Friendship 7) under the Project Mercury. Review primary objective: First U.S. crewed orbital flight flown by John Glenn.. Operational procedure: Manual Protocol: Atlas launch vehicle insertion; 3 full Earth orbits; manual fly-by-wire attitude override following autopilot malfunction; retro-rocket burn and reentry thermal shield protection."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Mercury-Atlas 6 (Friendship 7)",
      "docNumber": "NASA-M003-NASA-HIST",
      "linkTitle": "Project Mercury Official Record"
    },
    "operationalGuide": "Manual Protocol: Atlas launch vehicle insertion; 3 full Earth orbits; manual fly-by-wire attitude override following autopilot malfunction; retro-rocket burn and reentry thermal shield protection.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M004",
    "number": 4,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Mercury Suborbital / LEO",
    "name": "Mercury-Atlas 7 (Aurora 7)",
    "tagline": "5-hour orbital science mission flown by Scott Carpenter.",
    "nasaProgram": "Project Mercury",
    "launchYear": "1962",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "Mercury-Atlas 7 (Aurora 7) Operational Flight Challenge",
      "summary": "5-hour orbital science mission flown by Scott Carpenter.",
      "astronautPOV": "Commander, you are on console for Mercury-Atlas 7 (Aurora 7). Manual Protocol: Horizon tracking and celestial observation experiments; fuel management for attitude control thrusters; retrofire execution.",
      "briefingAudio": "Flight Director to all stations: We are GO for Mercury-Atlas 7 (Aurora 7) under the Project Mercury. Review primary objective: 5-hour orbital science mission flown by Scott Carpenter.. Operational procedure: Manual Protocol: Horizon tracking and celestial observation experiments; fuel management for attitude control thrusters; retrofire execution."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Mercury-Atlas 7 (Aurora 7)",
      "docNumber": "NASA-M004-NASA-HIST",
      "linkTitle": "Project Mercury Official Record"
    },
    "operationalGuide": "Manual Protocol: Horizon tracking and celestial observation experiments; fuel management for attitude control thrusters; retrofire execution.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M005",
    "number": 5,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Mercury Suborbital / LEO",
    "name": "Mercury-Atlas 8 (Sigma 7)",
    "tagline": "6-orbit engineering evaluation flown by Walter Schirra.",
    "nasaProgram": "Project Mercury",
    "launchYear": "1962",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "Mercury-Atlas 8 (Sigma 7) Operational Flight Challenge",
      "summary": "6-orbit engineering evaluation flown by Walter Schirra.",
      "astronautPOV": "Commander, you are on console for Mercury-Atlas 8 (Sigma 7). Manual Protocol: Strict reaction control system fuel conservation; suit cooling loop assessment; orbital trajectory navigation.",
      "briefingAudio": "Flight Director to all stations: We are GO for Mercury-Atlas 8 (Sigma 7) under the Project Mercury. Review primary objective: 6-orbit engineering evaluation flown by Walter Schirra.. Operational procedure: Manual Protocol: Strict reaction control system fuel conservation; suit cooling loop assessment; orbital trajectory navigation."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Mercury-Atlas 8 (Sigma 7)",
      "docNumber": "NASA-M005-NASA-HIST",
      "linkTitle": "Project Mercury Official Record"
    },
    "operationalGuide": "Manual Protocol: Strict reaction control system fuel conservation; suit cooling loop assessment; orbital trajectory navigation.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M006",
    "number": 6,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Mercury Suborbital / LEO",
    "name": "Mercury-Atlas 9 (Faith 7)",
    "tagline": "Final Mercury mission, 22 orbits over 34 hours flown by Gordon Cooper.",
    "nasaProgram": "Project Mercury",
    "launchYear": "1963",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "Mercury-Atlas 9 (Faith 7) Operational Flight Challenge",
      "summary": "Final Mercury mission, 22 orbits over 34 hours flown by Gordon Cooper.",
      "astronautPOV": "Commander, you are on console for Mercury-Atlas 9 (Faith 7). Manual Protocol: Extended day-long spaceflight endurance protocols; manual reentry alignment after electrical power failure.",
      "briefingAudio": "Flight Director to all stations: We are GO for Mercury-Atlas 9 (Faith 7) under the Project Mercury. Review primary objective: Final Mercury mission, 22 orbits over 34 hours flown by Gordon Cooper.. Operational procedure: Manual Protocol: Extended day-long spaceflight endurance protocols; manual reentry alignment after electrical power failure."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Mercury-Atlas 9 (Faith 7)",
      "docNumber": "NASA-M006-NASA-HIST",
      "linkTitle": "Project Mercury Official Record"
    },
    "operationalGuide": "Manual Protocol: Extended day-long spaceflight endurance protocols; manual reentry alignment after electrical power failure.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M007",
    "number": 7,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Gemini Orbit (160–1,374 km)",
    "name": "Gemini 1 & 2",
    "tagline": "Uncrewed orbital and suborbital spacecraft and Titan II launch vehicle tests.",
    "nasaProgram": "Project Gemini",
    "launchYear": "1964-1965",
    "missionType": "Human Spaceflight / Test Flights",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "OAMS Thrusters + Agena Docking Collar",
    "scientificProblem": {
      "title": "Gemini 1 & 2 Operational Flight Challenge",
      "summary": "Uncrewed orbital and suborbital spacecraft and Titan II launch vehicle tests.",
      "astronautPOV": "Commander, you are on console for Gemini 1 & 2. Manual Protocol: Structural integrity verification, automated launch guidance, heat shield reentry performance.",
      "briefingAudio": "Flight Director to all stations: We are GO for Gemini 1 & 2 under the Project Gemini. Review primary objective: Uncrewed orbital and suborbital spacecraft and Titan II launch vehicle tests.. Operational procedure: Manual Protocol: Structural integrity verification, automated launch guidance, heat shield reentry performance."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Gemini 1 & 2",
      "docNumber": "NASA-M007-NASA-HIST",
      "linkTitle": "Project Gemini Official Record"
    },
    "operationalGuide": "Manual Protocol: Structural integrity verification, automated launch guidance, heat shield reentry performance.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M008",
    "number": 8,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Gemini Orbit (160–1,374 km)",
    "name": "Gemini 3",
    "tagline": "First crewed Gemini flight with Gus Grissom and John Young.",
    "nasaProgram": "Project Gemini",
    "launchYear": "1965",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "OAMS Thrusters + Agena Docking Collar",
    "scientificProblem": {
      "title": "Gemini 3 Operational Flight Challenge",
      "summary": "First crewed Gemini flight with Gus Grissom and John Young.",
      "astronautPOV": "Commander, you are on console for Gemini 3. Manual Protocol: First orbital plane change maneuvers using Orbit Attitude and Maneuvering System (OAMS); manual spacecraft translation.",
      "briefingAudio": "Flight Director to all stations: We are GO for Gemini 3 under the Project Gemini. Review primary objective: First crewed Gemini flight with Gus Grissom and John Young.. Operational procedure: Manual Protocol: First orbital plane change maneuvers using Orbit Attitude and Maneuvering System (OAMS); manual spacecraft translation."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Gemini 3",
      "docNumber": "NASA-M008-NASA-HIST",
      "linkTitle": "Project Gemini Official Record"
    },
    "operationalGuide": "Manual Protocol: First orbital plane change maneuvers using Orbit Attitude and Maneuvering System (OAMS); manual spacecraft translation.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M009",
    "number": 9,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Gemini Orbit (160–1,374 km)",
    "name": "Gemini 4",
    "tagline": "First American spacewalk (EVA) performed by Ed White with James McDivitt.",
    "nasaProgram": "Project Gemini",
    "launchYear": "1965",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "OAMS Thrusters + Agena Docking Collar",
    "scientificProblem": {
      "title": "Gemini 4 Operational Flight Challenge",
      "summary": "First American spacewalk (EVA) performed by Ed White with James McDivitt.",
      "astronautPOV": "Commander, you are on console for Gemini 4. Manual Protocol: 22-minute EVA tethered protocol using Hand-Held Maneuvering Unit (HHMU); 4-day flight endurance tracking.",
      "briefingAudio": "Flight Director to all stations: We are GO for Gemini 4 under the Project Gemini. Review primary objective: First American spacewalk (EVA) performed by Ed White with James McDivitt.. Operational procedure: Manual Protocol: 22-minute EVA tethered protocol using Hand-Held Maneuvering Unit (HHMU); 4-day flight endurance tracking."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Gemini 4",
      "docNumber": "NASA-M009-NASA-HIST",
      "linkTitle": "Project Gemini Official Record"
    },
    "operationalGuide": "Manual Protocol: 22-minute EVA tethered protocol using Hand-Held Maneuvering Unit (HHMU); 4-day flight endurance tracking.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M010",
    "number": 10,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Gemini Orbit (160–1,374 km)",
    "name": "Gemini 5",
    "tagline": "8-day long-duration flight evaluating fuel cell technology.",
    "nasaProgram": "Project Gemini",
    "launchYear": "1965",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "OAMS Thrusters + Agena Docking Collar",
    "scientificProblem": {
      "title": "Gemini 5 Operational Flight Challenge",
      "summary": "8-day long-duration flight evaluating fuel cell technology.",
      "astronautPOV": "Commander, you are on console for Gemini 5. Manual Protocol: Fuel cell power generation monitoring; radar evaluation pods rendezvous maneuvers; long-term crew physiology tracking.",
      "briefingAudio": "Flight Director to all stations: We are GO for Gemini 5 under the Project Gemini. Review primary objective: 8-day long-duration flight evaluating fuel cell technology.. Operational procedure: Manual Protocol: Fuel cell power generation monitoring; radar evaluation pods rendezvous maneuvers; long-term crew physiology tracking."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Gemini 5",
      "docNumber": "NASA-M010-NASA-HIST",
      "linkTitle": "Project Gemini Official Record"
    },
    "operationalGuide": "Manual Protocol: Fuel cell power generation monitoring; radar evaluation pods rendezvous maneuvers; long-term crew physiology tracking.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M011",
    "number": 11,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Gemini Orbit (160–1,374 km)",
    "name": "Gemini 7",
    "tagline": "14-day long-duration endurance mission and rendezvous target.",
    "nasaProgram": "Project Gemini",
    "launchYear": "1965",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "OAMS Thrusters + Agena Docking Collar",
    "scientificProblem": {
      "title": "Gemini 7 Operational Flight Challenge",
      "summary": "14-day long-duration endurance mission and rendezvous target.",
      "astronautPOV": "Commander, you are on console for Gemini 7. Manual Protocol: Extended microgravity habitation; shirt-sleeve environment testing; passive target station keeping.",
      "briefingAudio": "Flight Director to all stations: We are GO for Gemini 7 under the Project Gemini. Review primary objective: 14-day long-duration endurance mission and rendezvous target.. Operational procedure: Manual Protocol: Extended microgravity habitation; shirt-sleeve environment testing; passive target station keeping."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Gemini 7",
      "docNumber": "NASA-M011-NASA-HIST",
      "linkTitle": "Project Gemini Official Record"
    },
    "operationalGuide": "Manual Protocol: Extended microgravity habitation; shirt-sleeve environment testing; passive target station keeping.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M012",
    "number": 12,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Gemini Orbit (160–1,374 km)",
    "name": "Gemini 6A",
    "tagline": "First space rendezvous with Gemini 7 flown by Schirra and Stafford.",
    "nasaProgram": "Project Gemini",
    "launchYear": "1965",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "OAMS Thrusters + Agena Docking Collar",
    "scientificProblem": {
      "title": "Gemini 6A Operational Flight Challenge",
      "summary": "First space rendezvous with Gemini 7 flown by Schirra and Stafford.",
      "astronautPOV": "Commander, you are on console for Gemini 6A. Manual Protocol: Active station-keeping within 1 foot of target; radar navigation and orbital phasing thrust burns.",
      "briefingAudio": "Flight Director to all stations: We are GO for Gemini 6A under the Project Gemini. Review primary objective: First space rendezvous with Gemini 7 flown by Schirra and Stafford.. Operational procedure: Manual Protocol: Active station-keeping within 1 foot of target; radar navigation and orbital phasing thrust burns."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Gemini 6A",
      "docNumber": "NASA-M012-NASA-HIST",
      "linkTitle": "Project Gemini Official Record"
    },
    "operationalGuide": "Manual Protocol: Active station-keeping within 1 foot of target; radar navigation and orbital phasing thrust burns.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M013",
    "number": 13,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Gemini Orbit (160–1,374 km)",
    "name": "Gemini 8",
    "tagline": "First docking in space with Agena Target Vehicle (Armstrong and Scott).",
    "nasaProgram": "Project Gemini",
    "launchYear": "1966",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "OAMS Thrusters + Agena Docking Collar",
    "scientificProblem": {
      "title": "Gemini 8 Operational Flight Challenge",
      "summary": "First docking in space with Agena Target Vehicle (Armstrong and Scott).",
      "astronautPOV": "Commander, you are on console for Gemini 8. Manual Protocol: Precision orbital docking; immediate emergency undocking and Reentry Control System (RCS) thruster abort following stuck thruster spin.",
      "briefingAudio": "Flight Director to all stations: We are GO for Gemini 8 under the Project Gemini. Review primary objective: First docking in space with Agena Target Vehicle (Armstrong and Scott).. Operational procedure: Manual Protocol: Precision orbital docking; immediate emergency undocking and Reentry Control System (RCS) thruster abort following stuck thruster spin."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Gemini 8",
      "docNumber": "NASA-M013-NASA-HIST",
      "linkTitle": "Project Gemini Official Record"
    },
    "operationalGuide": "Manual Protocol: Precision orbital docking; immediate emergency undocking and Reentry Control System (RCS) thruster abort following stuck thruster spin.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M014",
    "number": 14,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Gemini Orbit (160–1,374 km)",
    "name": "Gemini 9A",
    "tagline": "Rendezvous and complex EVA maneuvers with Augmented Target Docking Adapter.",
    "nasaProgram": "Project Gemini",
    "launchYear": "1966",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "OAMS Thrusters + Agena Docking Collar",
    "scientificProblem": {
      "title": "Gemini 9A Operational Flight Challenge",
      "summary": "Rendezvous and complex EVA maneuvers with Augmented Target Docking Adapter.",
      "astronautPOV": "Commander, you are on console for Gemini 9A. Manual Protocol: Work-load evaluation during EVA; visual rendezvous techniques; Astronaut Maneuvering Unit (AMU) flight testing.",
      "briefingAudio": "Flight Director to all stations: We are GO for Gemini 9A under the Project Gemini. Review primary objective: Rendezvous and complex EVA maneuvers with Augmented Target Docking Adapter.. Operational procedure: Manual Protocol: Work-load evaluation during EVA; visual rendezvous techniques; Astronaut Maneuvering Unit (AMU) flight testing."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Gemini 9A",
      "docNumber": "NASA-M014-NASA-HIST",
      "linkTitle": "Project Gemini Official Record"
    },
    "operationalGuide": "Manual Protocol: Work-load evaluation during EVA; visual rendezvous techniques; Astronaut Maneuvering Unit (AMU) flight testing.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M015",
    "number": 15,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Gemini Orbit (160–1,374 km)",
    "name": "Gemini 10",
    "tagline": "Dual rendezvous with two separate Agena vehicles.",
    "nasaProgram": "Project Gemini",
    "launchYear": "1966",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "OAMS Thrusters + Agena Docking Collar",
    "scientificProblem": {
      "title": "Gemini 10 Operational Flight Challenge",
      "summary": "Dual rendezvous with two separate Agena vehicles.",
      "astronautPOV": "Commander, you are on console for Gemini 10. Manual Protocol: Agena secondary propulsion engine burns for orbital altitude boosting; retrieval of micrometeorite collector from passive target.",
      "briefingAudio": "Flight Director to all stations: We are GO for Gemini 10 under the Project Gemini. Review primary objective: Dual rendezvous with two separate Agena vehicles.. Operational procedure: Manual Protocol: Agena secondary propulsion engine burns for orbital altitude boosting; retrieval of micrometeorite collector from passive target."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Gemini 10",
      "docNumber": "NASA-M015-NASA-HIST",
      "linkTitle": "Project Gemini Official Record"
    },
    "operationalGuide": "Manual Protocol: Agena secondary propulsion engine burns for orbital altitude boosting; retrieval of micrometeorite collector from passive target.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M016",
    "number": 16,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Gemini Orbit (160–1,374 km)",
    "name": "Gemini 11",
    "tagline": "First-orbit direct ascent rendezvous and tethered artificial gravity test.",
    "nasaProgram": "Project Gemini",
    "launchYear": "1966",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "OAMS Thrusters + Agena Docking Collar",
    "scientificProblem": {
      "title": "Gemini 11 Operational Flight Challenge",
      "summary": "First-orbit direct ascent rendezvous and tethered artificial gravity test.",
      "astronautPOV": "Commander, you are on console for Gemini 11. Manual Protocol: High-apogee orbit burn (1,374 km); tethered station-keeping rotation generating artificial gravity.",
      "briefingAudio": "Flight Director to all stations: We are GO for Gemini 11 under the Project Gemini. Review primary objective: First-orbit direct ascent rendezvous and tethered artificial gravity test.. Operational procedure: Manual Protocol: High-apogee orbit burn (1,374 km); tethered station-keeping rotation generating artificial gravity."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Gemini 11",
      "docNumber": "NASA-M016-NASA-HIST",
      "linkTitle": "Project Gemini Official Record"
    },
    "operationalGuide": "Manual Protocol: High-apogee orbit burn (1,374 km); tethered station-keeping rotation generating artificial gravity.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M017",
    "number": 17,
    "era": "PIONEERS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Gemini Orbit (160–1,374 km)",
    "name": "Gemini 12",
    "tagline": "Final Gemini mission mastering underwater-trained EVA procedures (Aldrin and Lovell).",
    "nasaProgram": "Project Gemini",
    "launchYear": "1966",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "OAMS Thrusters + Agena Docking Collar",
    "scientificProblem": {
      "title": "Gemini 12 Operational Flight Challenge",
      "summary": "Final Gemini mission mastering underwater-trained EVA procedures (Aldrin and Lovell).",
      "astronautPOV": "Commander, you are on console for Gemini 12. Manual Protocol: Body-restraint foot restraints and handholds during 5.5 hours of successful EVA; total solar eclipse photography.",
      "briefingAudio": "Flight Director to all stations: We are GO for Gemini 12 under the Project Gemini. Review primary objective: Final Gemini mission mastering underwater-trained EVA procedures (Aldrin and Lovell).. Operational procedure: Manual Protocol: Body-restraint foot restraints and handholds during 5.5 hours of successful EVA; total solar eclipse photography."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Gemini 12",
      "docNumber": "NASA-M017-NASA-HIST",
      "linkTitle": "Project Gemini Official Record"
    },
    "operationalGuide": "Manual Protocol: Body-restraint foot restraints and handholds during 5.5 hours of successful EVA; total solar eclipse photography.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M018",
    "number": 18,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Orbit (LOI)",
    "name": "Apollo 1",
    "tagline": "Pre-flight test crewed by Grissom, White, and Chaffee.",
    "nasaProgram": "Apollo Program",
    "launchYear": "1967",
    "missionType": "Human Spaceflight / Launch Pad Test",
    "status": "Tragic Failure",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo 1 Operational Flight Challenge",
      "summary": "Pre-flight test crewed by Grissom, White, and Chaffee.",
      "astronautPOV": "Commander, you are on console for Apollo 1. Manual Protocol: High-pressure 100% oxygen cabin atmosphere; electrical arcing triggered cabin fire leading to redesign of Apollo hatch and materials.",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo 1 under the Apollo Program. Review primary objective: Pre-flight test crewed by Grissom, White, and Chaffee.. Operational procedure: Manual Protocol: High-pressure 100% oxygen cabin atmosphere; electrical arcing triggered cabin fire leading to redesign of Apollo hatch and materials."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo 1",
      "docNumber": "NASA-M018-NASA-HIST",
      "linkTitle": "Apollo Program Official Record"
    },
    "operationalGuide": "Manual Protocol: High-pressure 100% oxygen cabin atmosphere; electrical arcing triggered cabin fire leading to redesign of Apollo hatch and materials.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M019",
    "number": 19,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Orbit (LOI)",
    "name": "Apollo 4, 5, 6",
    "tagline": "Uncrewed qualification of Saturn V rocket and Lunar Module.",
    "nasaProgram": "Apollo Program",
    "launchYear": "1967-1968",
    "missionType": "Human Spaceflight / Uncrewed Tests",
    "status": "Completed",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo 4, 5, 6 Operational Flight Challenge",
      "summary": "Uncrewed qualification of Saturn V rocket and Lunar Module.",
      "astronautPOV": "Commander, you are on console for Apollo 4, 5, 6. Manual Protocol: Saturn V S-IC, S-II, S-IVB staging; heat shield reentry qualification at lunar return velocities.",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo 4, 5, 6 under the Apollo Program. Review primary objective: Uncrewed qualification of Saturn V rocket and Lunar Module.. Operational procedure: Manual Protocol: Saturn V S-IC, S-II, S-IVB staging; heat shield reentry qualification at lunar return velocities."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo 4, 5, 6",
      "docNumber": "NASA-M019-NASA-HIST",
      "linkTitle": "Apollo Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Saturn V S-IC, S-II, S-IVB staging; heat shield reentry qualification at lunar return velocities.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M020",
    "number": 20,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Orbit (LOI)",
    "name": "Apollo 7",
    "tagline": "First crewed Apollo orbital test flight in Command and Service Module (CSM).",
    "nasaProgram": "Apollo Program",
    "launchYear": "1968",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo 7 Operational Flight Challenge",
      "summary": "First crewed Apollo orbital test flight in Command and Service Module (CSM).",
      "astronautPOV": "Commander, you are on console for Apollo 7. Manual Protocol: Service Propulsion System (SPS) engine burn firings; live TV broadcasts; rendezvous with Saturn S-IVB stage.",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo 7 under the Apollo Program. Review primary objective: First crewed Apollo orbital test flight in Command and Service Module (CSM).. Operational procedure: Manual Protocol: Service Propulsion System (SPS) engine burn firings; live TV broadcasts; rendezvous with Saturn S-IVB stage."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo 7",
      "docNumber": "NASA-M020-NASA-HIST",
      "linkTitle": "Apollo Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Service Propulsion System (SPS) engine burn firings; live TV broadcasts; rendezvous with Saturn S-IVB stage.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M021",
    "number": 21,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Orbit (LOI)",
    "name": "Apollo 8",
    "tagline": "First human flight to and orbit around the Moon (Borman, Lovell, Anders).",
    "nasaProgram": "Apollo Program",
    "launchYear": "1968",
    "missionType": "Human Spaceflight / Lunar Orbit",
    "status": "Completed",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo 8 Operational Flight Challenge",
      "summary": "First human flight to and orbit around the Moon (Borman, Lovell, Anders).",
      "astronautPOV": "Commander, you are on console for Apollo 8. Manual Protocol: Trans-Lunar Injection (TLI) burn; 10 lunar orbits; Lunar Orbit Insertion (LOI) and Trans-Earth Injection (TEI) engine maneuvers.",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo 8 under the Apollo Program. Review primary objective: First human flight to and orbit around the Moon (Borman, Lovell, Anders).. Operational procedure: Manual Protocol: Trans-Lunar Injection (TLI) burn; 10 lunar orbits; Lunar Orbit Insertion (LOI) and Trans-Earth Injection (TEI) engine maneuvers."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo 8",
      "docNumber": "NASA-M021-NASA-HIST",
      "linkTitle": "Apollo Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Trans-Lunar Injection (TLI) burn; 10 lunar orbits; Lunar Orbit Insertion (LOI) and Trans-Earth Injection (TEI) engine maneuvers.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M022",
    "number": 22,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Orbit (LOI)",
    "name": "Apollo 9",
    "tagline": "First crewed flight testing of complete Apollo spacecraft including Lunar Module.",
    "nasaProgram": "Apollo Program",
    "launchYear": "1969",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo 9 Operational Flight Challenge",
      "summary": "First crewed flight testing of complete Apollo spacecraft including Lunar Module.",
      "astronautPOV": "Commander, you are on console for Apollo 9. Manual Protocol: Active LM extraction, docking, descent/ascent engine firings, and crew transfer via docking tunnel in Earth orbit.",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo 9 under the Apollo Program. Review primary objective: First crewed flight testing of complete Apollo spacecraft including Lunar Module.. Operational procedure: Manual Protocol: Active LM extraction, docking, descent/ascent engine firings, and crew transfer via docking tunnel in Earth orbit."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo 9",
      "docNumber": "NASA-M022-NASA-HIST",
      "linkTitle": "Apollo Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Active LM extraction, docking, descent/ascent engine firings, and crew transfer via docking tunnel in Earth orbit.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M023",
    "number": 23,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Orbit (LOI)",
    "name": "Apollo 10",
    "tagline": "Full dress rehearsal for lunar landing in lunar orbit.",
    "nasaProgram": "Apollo Program",
    "launchYear": "1969",
    "missionType": "Human Spaceflight / Lunar Orbit",
    "status": "Completed",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo 10 Operational Flight Challenge",
      "summary": "Full dress rehearsal for lunar landing in lunar orbit.",
      "astronautPOV": "Commander, you are on console for Apollo 10. Manual Protocol: LM separation and descent to within 8.4 nautical miles of lunar surface; ascent stage staging and rendezvous with CSM.",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo 10 under the Apollo Program. Review primary objective: Full dress rehearsal for lunar landing in lunar orbit.. Operational procedure: Manual Protocol: LM separation and descent to within 8.4 nautical miles of lunar surface; ascent stage staging and rendezvous with CSM."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo 10",
      "docNumber": "NASA-M023-NASA-HIST",
      "linkTitle": "Apollo Program Official Record"
    },
    "operationalGuide": "Manual Protocol: LM separation and descent to within 8.4 nautical miles of lunar surface; ascent stage staging and rendezvous with CSM.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M024",
    "number": 24,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Surface",
    "name": "Apollo 11",
    "tagline": "First crewed lunar landing (Armstrong, Aldrin, Collins) at Sea of Tranquility.",
    "nasaProgram": "Apollo Program",
    "launchYear": "1969",
    "missionType": "Human Spaceflight / Lunar Landing",
    "status": "Completed",
    "targetLocation": "Sea of Tranquility",
    "coordinates": "0.67°N, 23.47°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo 11 Operational Flight Challenge",
      "summary": "First crewed lunar landing (Armstrong, Aldrin, Collins) at Sea of Tranquility.",
      "astronautPOV": "Commander, you are on console for Apollo 11. Manual Protocol: Semi-manual lunar descent override avoiding boulders; surface EVA (2 hrs 31 min); solar wind & moon rock collection; LM ascent and lunar orbit rendezvous.",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo 11 under the Apollo Program. Review primary objective: First crewed lunar landing (Armstrong, Aldrin, Collins) at Sea of Tranquility.. Operational procedure: Manual Protocol: Semi-manual lunar descent override avoiding boulders; surface EVA (2 hrs 31 min); solar wind & moon rock collection; LM ascent and lunar orbit rendezvous."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo 11",
      "docNumber": "NASA-M024-NASA-HIST",
      "linkTitle": "Apollo Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Semi-manual lunar descent override avoiding boulders; surface EVA (2 hrs 31 min); solar wind & moon rock collection; LM ascent and lunar orbit rendezvous.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M025",
    "number": 25,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Surface",
    "name": "Apollo 12",
    "tagline": "Precision lunar landing at Ocean of Storms near Surveyor 3.",
    "nasaProgram": "Apollo Program",
    "launchYear": "1969",
    "missionType": "Human Spaceflight / Lunar Landing",
    "status": "Completed",
    "targetLocation": "Ocean of Storms",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo 12 Operational Flight Challenge",
      "summary": "Precision lunar landing at Ocean of Storms near Surveyor 3.",
      "astronautPOV": "Commander, you are on console for Apollo 12. Manual Protocol: Pinpoint landing radar navigation; retrieval of Surveyor 3 components; deployment of Apollo Lunar Surface Experiments Package (ALSEP).",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo 12 under the Apollo Program. Review primary objective: Precision lunar landing at Ocean of Storms near Surveyor 3.. Operational procedure: Manual Protocol: Pinpoint landing radar navigation; retrieval of Surveyor 3 components; deployment of Apollo Lunar Surface Experiments Package (ALSEP)."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo 12",
      "docNumber": "NASA-M025-NASA-HIST",
      "linkTitle": "Apollo Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Pinpoint landing radar navigation; retrieval of Surveyor 3 components; deployment of Apollo Lunar Surface Experiments Package (ALSEP).",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M026",
    "number": 26,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Orbit (LOI)",
    "name": "Apollo 13",
    "tagline": "Successful crew rescue following SM oxygen tank explosion (Lovell, Swigert, Haise).",
    "nasaProgram": "Apollo Program",
    "launchYear": "1970",
    "missionType": "Human Spaceflight / Lunar Flyby Abort",
    "status": "Completed (Abort)",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo 13 Operational Flight Challenge",
      "summary": "Successful crew rescue following SM oxygen tank explosion (Lovell, Swigert, Haise).",
      "astronautPOV": "Commander, you are on console for Apollo 13. Manual Protocol: LM 'Aquarius' utilized as lifeboat; manual alignment burns using Sun/Earth terminator sight lines; free-return trajectory around Moon.",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo 13 under the Apollo Program. Review primary objective: Successful crew rescue following SM oxygen tank explosion (Lovell, Swigert, Haise).. Operational procedure: Manual Protocol: LM 'Aquarius' utilized as lifeboat; manual alignment burns using Sun/Earth terminator sight lines; free-return trajectory around Moon."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo 13",
      "docNumber": "NASA-M026-NASA-HIST",
      "linkTitle": "Apollo Program Official Record"
    },
    "operationalGuide": "Manual Protocol: LM 'Aquarius' utilized as lifeboat; manual alignment burns using Sun/Earth terminator sight lines; free-return trajectory around Moon.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M027",
    "number": 27,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Surface",
    "name": "Apollo 14",
    "tagline": "Lunar landing at Fra Mauro formation (Shepard, Mitchell, Roosa).",
    "nasaProgram": "Apollo Program",
    "launchYear": "1971",
    "missionType": "Human Spaceflight / Lunar Landing",
    "status": "Completed",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo 14 Operational Flight Challenge",
      "summary": "Lunar landing at Fra Mauro formation (Shepard, Mitchell, Roosa).",
      "astronautPOV": "Commander, you are on console for Apollo 14. Manual Protocol: Modular Equipment Transporter (MET) handcart deployment; active seismic experiments; surface geology sampling.",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo 14 under the Apollo Program. Review primary objective: Lunar landing at Fra Mauro formation (Shepard, Mitchell, Roosa).. Operational procedure: Manual Protocol: Modular Equipment Transporter (MET) handcart deployment; active seismic experiments; surface geology sampling."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo 14",
      "docNumber": "NASA-M027-NASA-HIST",
      "linkTitle": "Apollo Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Modular Equipment Transporter (MET) handcart deployment; active seismic experiments; surface geology sampling.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M028",
    "number": 28,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Surface",
    "name": "Apollo 15",
    "tagline": "First J-series extended scientific mission at Hadley-Apennine.",
    "nasaProgram": "Apollo Program",
    "launchYear": "1971",
    "missionType": "Human Spaceflight / Lunar Landing",
    "status": "Completed",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo 15 Operational Flight Challenge",
      "summary": "First J-series extended scientific mission at Hadley-Apennine.",
      "astronautPOV": "Commander, you are on console for Apollo 15. Manual Protocol: Lunar Roving Vehicle (LRV) operations; subsatellite deployment in lunar orbit; deep-core drilling.",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo 15 under the Apollo Program. Review primary objective: First J-series extended scientific mission at Hadley-Apennine.. Operational procedure: Manual Protocol: Lunar Roving Vehicle (LRV) operations; subsatellite deployment in lunar orbit; deep-core drilling."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo 15",
      "docNumber": "NASA-M028-NASA-HIST",
      "linkTitle": "Apollo Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Lunar Roving Vehicle (LRV) operations; subsatellite deployment in lunar orbit; deep-core drilling.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M029",
    "number": 29,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Surface",
    "name": "Apollo 16",
    "tagline": "Lunar highlands exploration at Descartes crater.",
    "nasaProgram": "Apollo Program",
    "launchYear": "1972",
    "missionType": "Human Spaceflight / Lunar Landing",
    "status": "Completed",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo 16 Operational Flight Challenge",
      "summary": "Lunar highlands exploration at Descartes crater.",
      "astronautPOV": "Commander, you are on console for Apollo 16. Manual Protocol: LRV traverse across rugged terrain; UV camera/spectrograph astronomy; 95 kg regolith sample collection.",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo 16 under the Apollo Program. Review primary objective: Lunar highlands exploration at Descartes crater.. Operational procedure: Manual Protocol: LRV traverse across rugged terrain; UV camera/spectrograph astronomy; 95 kg regolith sample collection."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo 16",
      "docNumber": "NASA-M029-NASA-HIST",
      "linkTitle": "Apollo Program Official Record"
    },
    "operationalGuide": "Manual Protocol: LRV traverse across rugged terrain; UV camera/spectrograph astronomy; 95 kg regolith sample collection.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M030",
    "number": 30,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Surface",
    "name": "Apollo 17",
    "tagline": "Final Apollo crewed lunar landing at Taurus-Littrow with scientist-astronaut Harrison Schmitt.",
    "nasaProgram": "Apollo Program",
    "launchYear": "1972",
    "missionType": "Human Spaceflight / Lunar Landing",
    "status": "Completed",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo 17 Operational Flight Challenge",
      "summary": "Final Apollo crewed lunar landing at Taurus-Littrow with scientist-astronaut Harrison Schmitt.",
      "astronautPOV": "Commander, you are on console for Apollo 17. Manual Protocol: 22-hour total EVA duration; LRV fender field repair; discovery of orange volcanic glass soil.",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo 17 under the Apollo Program. Review primary objective: Final Apollo crewed lunar landing at Taurus-Littrow with scientist-astronaut Harrison Schmitt.. Operational procedure: Manual Protocol: 22-hour total EVA duration; LRV fender field repair; discovery of orange volcanic glass soil."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo 17",
      "docNumber": "NASA-M030-NASA-HIST",
      "linkTitle": "Apollo Program Official Record"
    },
    "operationalGuide": "Manual Protocol: 22-hour total EVA duration; LRV fender field repair; discovery of orange volcanic glass soil.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M031",
    "number": 31,
    "era": "LUNAR_APOLLO",
    "destination": "EARTH_ORBIT",
    "destinationName": "Low Earth Orbit",
    "name": "Skylab 1, 2, 3, 4",
    "tagline": "America's first space station accommodating three long-duration crews.",
    "nasaProgram": "Skylab Program",
    "launchYear": "1973-1974",
    "missionType": "Human Spaceflight / Space Station",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "Skylab 1, 2, 3, 4 Operational Flight Challenge",
      "summary": "America's first space station accommodating three long-duration crews.",
      "astronautPOV": "Commander, you are on console for Skylab 1, 2, 3, 4. Manual Protocol: EVA thermal parasol deployment and solar array un-jamming repairs; solar astrophysics via Apollo Telescope Mount; 84-day record flight.",
      "briefingAudio": "Flight Director to all stations: We are GO for Skylab 1, 2, 3, 4 under the Skylab Program. Review primary objective: America's first space station accommodating three long-duration crews.. Operational procedure: Manual Protocol: EVA thermal parasol deployment and solar array un-jamming repairs; solar astrophysics via Apollo Telescope Mount; 84-day record flight."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Skylab 1, 2, 3, 4",
      "docNumber": "NASA-M031-NASA-HIST",
      "linkTitle": "Skylab Program Official Record"
    },
    "operationalGuide": "Manual Protocol: EVA thermal parasol deployment and solar array un-jamming repairs; solar astrophysics via Apollo Telescope Mount; 84-day record flight.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M032",
    "number": 32,
    "era": "LUNAR_APOLLO",
    "destination": "MOON",
    "destinationName": "Lunar Orbit (LOI)",
    "name": "Apollo-Soyuz Test Project",
    "tagline": "First international crewed spaceflight docking between US Apollo and Soviet Soyuz.",
    "nasaProgram": "Apollo-Soyuz",
    "launchYear": "1975",
    "missionType": "Human Spaceflight / Joint International",
    "status": "Completed",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Apollo-Soyuz Test Project Operational Flight Challenge",
      "summary": "First international crewed spaceflight docking between US Apollo and Soviet Soyuz.",
      "astronautPOV": "Commander, you are on console for Apollo-Soyuz Test Project. Manual Protocol: Universal Docking Module operations; dual-language joint science experiments; crew exchange and orbital handshake.",
      "briefingAudio": "Flight Director to all stations: We are GO for Apollo-Soyuz Test Project under the Apollo-Soyuz. Review primary objective: First international crewed spaceflight docking between US Apollo and Soviet Soyuz.. Operational procedure: Manual Protocol: Universal Docking Module operations; dual-language joint science experiments; crew exchange and orbital handshake."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Apollo-Soyuz Test Project",
      "docNumber": "NASA-M032-NASA-HIST",
      "linkTitle": "Apollo-Soyuz Official Record"
    },
    "operationalGuide": "Manual Protocol: Universal Docking Module operations; dual-language joint science experiments; crew exchange and orbital handshake.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M033",
    "number": 33,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Space Shuttle LEO (300–600 km)",
    "name": "STS-1 (Columbia)",
    "tagline": "First flight of the Space Shuttle system piloted by Young and Crippen.",
    "nasaProgram": "Space Shuttle Program",
    "launchYear": "1981",
    "missionType": "Human Spaceflight / Reusable Shuttle",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Remote Manipulator System (RMS Arm) + Payload Bay",
    "scientificProblem": {
      "title": "STS-1 (Columbia) Operational Flight Challenge",
      "summary": "First flight of the Space Shuttle system piloted by Young and Crippen.",
      "astronautPOV": "Commander, you are on console for STS-1 (Columbia). Manual Protocol: Solid Rocket Booster (SRB) separation; thermal protection tile inspection; unpowered unpowered glide approach and lakebed landing at Edwards AFB.",
      "briefingAudio": "Flight Director to all stations: We are GO for STS-1 (Columbia) under the Space Shuttle Program. Review primary objective: First flight of the Space Shuttle system piloted by Young and Crippen.. Operational procedure: Manual Protocol: Solid Rocket Booster (SRB) separation; thermal protection tile inspection; unpowered unpowered glide approach and lakebed landing at Edwards AFB."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: STS-1 (Columbia)",
      "docNumber": "NASA-M033-NASA-HIST",
      "linkTitle": "Space Shuttle Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Solid Rocket Booster (SRB) separation; thermal protection tile inspection; unpowered unpowered glide approach and lakebed landing at Edwards AFB.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M034",
    "number": 34,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Space Shuttle LEO (300–600 km)",
    "name": "STS-6 (Challenger)",
    "tagline": "Maiden flight of Challenger and first Shuttle Extravehicular Activity (EVA).",
    "nasaProgram": "Space Shuttle Program",
    "launchYear": "1983",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Remote Manipulator System (RMS Arm) + Payload Bay",
    "scientificProblem": {
      "title": "STS-6 (Challenger) Operational Flight Challenge",
      "summary": "Maiden flight of Challenger and first Shuttle Extravehicular Activity (EVA).",
      "astronautPOV": "Commander, you are on console for STS-6 (Challenger). Manual Protocol: Deployment of Tracking and Data Relay Satellite (TDRS-1); Extravehicular Mobility Unit (EMU) suit qualification spacewalk.",
      "briefingAudio": "Flight Director to all stations: We are GO for STS-6 (Challenger) under the Space Shuttle Program. Review primary objective: Maiden flight of Challenger and first Shuttle Extravehicular Activity (EVA).. Operational procedure: Manual Protocol: Deployment of Tracking and Data Relay Satellite (TDRS-1); Extravehicular Mobility Unit (EMU) suit qualification spacewalk."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: STS-6 (Challenger)",
      "docNumber": "NASA-M034-NASA-HIST",
      "linkTitle": "Space Shuttle Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Deployment of Tracking and Data Relay Satellite (TDRS-1); Extravehicular Mobility Unit (EMU) suit qualification spacewalk.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M035",
    "number": 35,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Space Shuttle LEO (300–600 km)",
    "name": "STS-7 (Challenger)",
    "tagline": "First spaceflight of an American woman (Sally Ride).",
    "nasaProgram": "Space Shuttle Program",
    "launchYear": "1983",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Remote Manipulator System (RMS Arm) + Payload Bay",
    "scientificProblem": {
      "title": "STS-7 (Challenger) Operational Flight Challenge",
      "summary": "First spaceflight of an American woman (Sally Ride).",
      "astronautPOV": "Commander, you are on console for STS-7 (Challenger). Manual Protocol: Shuttle Remote Manipulator System (RMS) robot arm operations; deployment and retrieval of SPAS-01 satellite.",
      "briefingAudio": "Flight Director to all stations: We are GO for STS-7 (Challenger) under the Space Shuttle Program. Review primary objective: First spaceflight of an American woman (Sally Ride).. Operational procedure: Manual Protocol: Shuttle Remote Manipulator System (RMS) robot arm operations; deployment and retrieval of SPAS-01 satellite."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: STS-7 (Challenger)",
      "docNumber": "NASA-M035-NASA-HIST",
      "linkTitle": "Space Shuttle Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Shuttle Remote Manipulator System (RMS) robot arm operations; deployment and retrieval of SPAS-01 satellite.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M036",
    "number": 36,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Space Shuttle LEO (300–600 km)",
    "name": "STS-41C (Challenger)",
    "tagline": "First in-orbit repair of a satellite (Solar Maximum Mission).",
    "nasaProgram": "Space Shuttle Program",
    "launchYear": "1984",
    "missionType": "Human Spaceflight / Satellite Repair",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Remote Manipulator System (RMS Arm) + Payload Bay",
    "scientificProblem": {
      "title": "STS-41C (Challenger) Operational Flight Challenge",
      "summary": "First in-orbit repair of a satellite (Solar Maximum Mission).",
      "astronautPOV": "Commander, you are on console for STS-41C (Challenger). Manual Protocol: Manned Maneuvering Unit (MMU) jetpack untethered spacewalk capture; payload bay servicing and redeployment.",
      "briefingAudio": "Flight Director to all stations: We are GO for STS-41C (Challenger) under the Space Shuttle Program. Review primary objective: First in-orbit repair of a satellite (Solar Maximum Mission).. Operational procedure: Manual Protocol: Manned Maneuvering Unit (MMU) jetpack untethered spacewalk capture; payload bay servicing and redeployment."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: STS-41C (Challenger)",
      "docNumber": "NASA-M036-NASA-HIST",
      "linkTitle": "Space Shuttle Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Manned Maneuvering Unit (MMU) jetpack untethered spacewalk capture; payload bay servicing and redeployment.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M037",
    "number": 37,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Space Shuttle LEO (300–600 km)",
    "name": "STS-51L (Challenger)",
    "tagline": "Tragic loss of Challenger crew 73 seconds post-launch due to SRB O-ring seal failure.",
    "nasaProgram": "Space Shuttle Program",
    "launchYear": "1986",
    "missionType": "Human Spaceflight / Low Earth Orbit",
    "status": "Tragic Failure",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Remote Manipulator System (RMS Arm) + Payload Bay",
    "scientificProblem": {
      "title": "STS-51L (Challenger) Operational Flight Challenge",
      "summary": "Tragic loss of Challenger crew 73 seconds post-launch due to SRB O-ring seal failure.",
      "astronautPOV": "Commander, you are on console for STS-51L (Challenger). Manual Protocol: Launch destruction investigation leading to complete SRB joint redesign and two-year flight grounding.",
      "briefingAudio": "Flight Director to all stations: We are GO for STS-51L (Challenger) under the Space Shuttle Program. Review primary objective: Tragic loss of Challenger crew 73 seconds post-launch due to SRB O-ring seal failure.. Operational procedure: Manual Protocol: Launch destruction investigation leading to complete SRB joint redesign and two-year flight grounding."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: STS-51L (Challenger)",
      "docNumber": "NASA-M037-NASA-HIST",
      "linkTitle": "Space Shuttle Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Launch destruction investigation leading to complete SRB joint redesign and two-year flight grounding.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M038",
    "number": 38,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Space Shuttle LEO (300–600 km)",
    "name": "STS-26 (Discovery)",
    "tagline": "Post-Challenger return-to-flight safety validation mission.",
    "nasaProgram": "Space Shuttle Program",
    "launchYear": "1988",
    "missionType": "Human Spaceflight / Return to Flight",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Remote Manipulator System (RMS Arm) + Payload Bay",
    "scientificProblem": {
      "title": "STS-26 (Discovery) Operational Flight Challenge",
      "summary": "Post-Challenger return-to-flight safety validation mission.",
      "astronautPOV": "Commander, you are on console for STS-26 (Discovery). Manual Protocol: Launch escape pressure suit qualification; TDRS deployment; advanced flight control system testing.",
      "briefingAudio": "Flight Director to all stations: We are GO for STS-26 (Discovery) under the Space Shuttle Program. Review primary objective: Post-Challenger return-to-flight safety validation mission.. Operational procedure: Manual Protocol: Launch escape pressure suit qualification; TDRS deployment; advanced flight control system testing."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: STS-26 (Discovery)",
      "docNumber": "NASA-M038-NASA-HIST",
      "linkTitle": "Space Shuttle Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Launch escape pressure suit qualification; TDRS deployment; advanced flight control system testing.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M039",
    "number": 39,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Space Shuttle LEO (300–600 km)",
    "name": "STS-31 (Discovery)",
    "tagline": "Deployment of the Hubble Space Telescope.",
    "nasaProgram": "Space Shuttle Program",
    "launchYear": "1990",
    "missionType": "Human Spaceflight / Space Observatory",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Remote Manipulator System (RMS Arm) + Payload Bay",
    "scientificProblem": {
      "title": "STS-31 (Discovery) Operational Flight Challenge",
      "summary": "Deployment of the Hubble Space Telescope.",
      "astronautPOV": "Commander, you are on console for STS-31 (Discovery). Manual Protocol: RMS robot arm high-altitude release (612 km); solar array deployment monitoring; secondary payload operations.",
      "briefingAudio": "Flight Director to all stations: We are GO for STS-31 (Discovery) under the Space Shuttle Program. Review primary objective: Deployment of the Hubble Space Telescope.. Operational procedure: Manual Protocol: RMS robot arm high-altitude release (612 km); solar array deployment monitoring; secondary payload operations."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: STS-31 (Discovery)",
      "docNumber": "NASA-M039-NASA-HIST",
      "linkTitle": "Space Shuttle Program Official Record"
    },
    "operationalGuide": "Manual Protocol: RMS robot arm high-altitude release (612 km); solar array deployment monitoring; secondary payload operations.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M040",
    "number": 40,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Space Shuttle LEO (300–600 km)",
    "name": "STS-71 (Atlantis)",
    "tagline": "First docking of Space Shuttle with Russian Space Station Mir.",
    "nasaProgram": "Space Shuttle Program",
    "launchYear": "1995",
    "missionType": "Human Spaceflight / Joint Shuttle-Mir",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Remote Manipulator System (RMS Arm) + Payload Bay",
    "scientificProblem": {
      "title": "STS-71 (Atlantis) Operational Flight Challenge",
      "summary": "First docking of Space Shuttle with Russian Space Station Mir.",
      "astronautPOV": "Commander, you are on console for STS-71 (Atlantis). Manual Protocol: Precision orbital proximity operations and soft docking with Kristall module; Mir crew rotation exchange.",
      "briefingAudio": "Flight Director to all stations: We are GO for STS-71 (Atlantis) under the Space Shuttle Program. Review primary objective: First docking of Space Shuttle with Russian Space Station Mir.. Operational procedure: Manual Protocol: Precision orbital proximity operations and soft docking with Kristall module; Mir crew rotation exchange."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: STS-71 (Atlantis)",
      "docNumber": "NASA-M040-NASA-HIST",
      "linkTitle": "Space Shuttle Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Precision orbital proximity operations and soft docking with Kristall module; Mir crew rotation exchange.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M041",
    "number": 41,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Space Shuttle LEO (300–600 km)",
    "name": "STS-88 (Endeavour)",
    "tagline": "First International Space Station assembly flight.",
    "nasaProgram": "Space Shuttle Program",
    "launchYear": "1998",
    "missionType": "Human Spaceflight / ISS Assembly",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Remote Manipulator System (RMS Arm) + Payload Bay",
    "scientificProblem": {
      "title": "STS-88 (Endeavour) Operational Flight Challenge",
      "summary": "First International Space Station assembly flight.",
      "astronautPOV": "Commander, you are on console for STS-88 (Endeavour). Manual Protocol: Mating of Unity node with Russian Zarya module using RMS arm; 3 assembly EVAs connecting external cables and antennas.",
      "briefingAudio": "Flight Director to all stations: We are GO for STS-88 (Endeavour) under the Space Shuttle Program. Review primary objective: First International Space Station assembly flight.. Operational procedure: Manual Protocol: Mating of Unity node with Russian Zarya module using RMS arm; 3 assembly EVAs connecting external cables and antennas."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: STS-88 (Endeavour)",
      "docNumber": "NASA-M041-NASA-HIST",
      "linkTitle": "Space Shuttle Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Mating of Unity node with Russian Zarya module using RMS arm; 3 assembly EVAs connecting external cables and antennas.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M042",
    "number": 42,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Space Shuttle LEO (300–600 km)",
    "name": "STS-107 (Columbia)",
    "tagline": "Tragic loss of Columbia during reentry due to left-wing foam strike damage.",
    "nasaProgram": "Space Shuttle Program",
    "launchYear": "2003",
    "missionType": "Human Spaceflight / Microgravity Research",
    "status": "Tragic Failure",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Remote Manipulator System (RMS Arm) + Payload Bay",
    "scientificProblem": {
      "title": "STS-107 (Columbia) Operational Flight Challenge",
      "summary": "Tragic loss of Columbia during reentry due to left-wing foam strike damage.",
      "astronautPOV": "Commander, you are on console for STS-107 (Columbia). Manual Protocol: 16-day microgravity science mission; foam impact investigation leading to mandatory boom sensor inspections on future flights.",
      "briefingAudio": "Flight Director to all stations: We are GO for STS-107 (Columbia) under the Space Shuttle Program. Review primary objective: Tragic loss of Columbia during reentry due to left-wing foam strike damage.. Operational procedure: Manual Protocol: 16-day microgravity science mission; foam impact investigation leading to mandatory boom sensor inspections on future flights."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: STS-107 (Columbia)",
      "docNumber": "NASA-M042-NASA-HIST",
      "linkTitle": "Space Shuttle Program Official Record"
    },
    "operationalGuide": "Manual Protocol: 16-day microgravity science mission; foam impact investigation leading to mandatory boom sensor inspections on future flights.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M043",
    "number": 43,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Space Shuttle LEO (300–600 km)",
    "name": "STS-125 (Atlantis)",
    "tagline": "Final servicing mission to the Hubble Space Telescope.",
    "nasaProgram": "Space Shuttle Program",
    "launchYear": "2009",
    "missionType": "Human Spaceflight / Observatory Servicing",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Remote Manipulator System (RMS Arm) + Payload Bay",
    "scientificProblem": {
      "title": "STS-125 (Atlantis) Operational Flight Challenge",
      "summary": "Final servicing mission to the Hubble Space Telescope.",
      "astronautPOV": "Commander, you are on console for STS-125 (Atlantis). Manual Protocol: 5 complex EVAs installing Wide Field Camera 3, Cosmic Origins Spectrograph, and replacing gyroscopes/batteries.",
      "briefingAudio": "Flight Director to all stations: We are GO for STS-125 (Atlantis) under the Space Shuttle Program. Review primary objective: Final servicing mission to the Hubble Space Telescope.. Operational procedure: Manual Protocol: 5 complex EVAs installing Wide Field Camera 3, Cosmic Origins Spectrograph, and replacing gyroscopes/batteries."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: STS-125 (Atlantis)",
      "docNumber": "NASA-M043-NASA-HIST",
      "linkTitle": "Space Shuttle Program Official Record"
    },
    "operationalGuide": "Manual Protocol: 5 complex EVAs installing Wide Field Camera 3, Cosmic Origins Spectrograph, and replacing gyroscopes/batteries.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M044",
    "number": 44,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Space Shuttle LEO (300–600 km)",
    "name": "STS-135 (Atlantis)",
    "tagline": "135th and final flight of the Space Shuttle Program.",
    "nasaProgram": "Space Shuttle Program",
    "launchYear": "2011",
    "missionType": "Human Spaceflight / Program Finale",
    "status": "Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🚀",
    "primaryInstrument": "Remote Manipulator System (RMS Arm) + Payload Bay",
    "scientificProblem": {
      "title": "STS-135 (Atlantis) Operational Flight Challenge",
      "summary": "135th and final flight of the Space Shuttle Program.",
      "astronautPOV": "Commander, you are on console for STS-135 (Atlantis). Manual Protocol: Delivery of Multi-Purpose Logistics Module (MPLM) Raffaello to ISS; final shuttle landing and transition to commercial crew.",
      "briefingAudio": "Flight Director to all stations: We are GO for STS-135 (Atlantis) under the Space Shuttle Program. Review primary objective: 135th and final flight of the Space Shuttle Program.. Operational procedure: Manual Protocol: Delivery of Multi-Purpose Logistics Module (MPLM) Raffaello to ISS; final shuttle landing and transition to commercial crew."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: STS-135 (Atlantis)",
      "docNumber": "NASA-M044-NASA-HIST",
      "linkTitle": "Space Shuttle Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Delivery of Multi-Purpose Logistics Module (MPLM) Raffaello to ISS; final shuttle landing and transition to commercial crew.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M045",
    "number": 45,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "ISS Orbit (408 km)",
    "name": "International Space Station (Expedition 1 - Present)",
    "tagline": "Continuous human research laboratory orbiting Earth since November 2000.",
    "nasaProgram": "ISS Expeditions",
    "launchYear": "2000-Present",
    "missionType": "Human Spaceflight / Space Station",
    "status": "Active",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🛰️",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "International Space Station (Expedition 1 - Present) Operational Flight Challenge",
      "summary": "Continuous human research laboratory orbiting Earth since November 2000.",
      "astronautPOV": "Commander, you are on console for International Space Station (Expedition 1 - Present). Manual Protocol: Microgravity biological/physical experiments; station attitude control; spacewalk maintenance; commercial/international crew rotation.",
      "briefingAudio": "Flight Director to all stations: We are GO for International Space Station (Expedition 1 - Present) under the ISS Expeditions. Review primary objective: Continuous human research laboratory orbiting Earth since November 2000.. Operational procedure: Manual Protocol: Microgravity biological/physical experiments; station attitude control; spacewalk maintenance; commercial/international crew rotation."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: International Space Station (Expedition 1 - Present)",
      "docNumber": "NASA-M045-NASA-HIST",
      "linkTitle": "ISS Expeditions Official Record"
    },
    "operationalGuide": "Manual Protocol: Microgravity biological/physical experiments; station attitude control; spacewalk maintenance; commercial/international crew rotation.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M046",
    "number": 46,
    "era": "SHUTTLE_ISS",
    "destination": "EARTH_ORBIT",
    "destinationName": "ISS Orbit (408 km)",
    "name": "SpaceX Demo-2 & Crew-1 to Crew-13",
    "tagline": "US commercial crew launches transporting astronauts to ISS aboard Dragon.",
    "nasaProgram": "Commercial Crew",
    "launchYear": "2020-Present",
    "missionType": "Human Spaceflight / Commercial Transportation",
    "status": "Active",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🛰️",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "SpaceX Demo-2 & Crew-1 to Crew-13 Operational Flight Challenge",
      "summary": "US commercial crew launches transporting astronauts to ISS aboard Dragon.",
      "astronautPOV": "Commander, you are on console for SpaceX Demo-2 & Crew-1 to Crew-13. Manual Protocol: Autonomous Falcon 9 launch and Dragon docking; manual touch-screen control backup; soft-water splashdown recovery.",
      "briefingAudio": "Flight Director to all stations: We are GO for SpaceX Demo-2 & Crew-1 to Crew-13 under the Commercial Crew. Review primary objective: US commercial crew launches transporting astronauts to ISS aboard Dragon.. Operational procedure: Manual Protocol: Autonomous Falcon 9 launch and Dragon docking; manual touch-screen control backup; soft-water splashdown recovery."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: SpaceX Demo-2 & Crew-1 to Crew-13",
      "docNumber": "NASA-M046-NASA-HIST",
      "linkTitle": "Commercial Crew Official Record"
    },
    "operationalGuide": "Manual Protocol: Autonomous Falcon 9 launch and Dragon docking; manual touch-screen control backup; soft-water splashdown recovery.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M047",
    "number": 47,
    "era": "ARTEMIS_ERA",
    "destination": "MOON",
    "destinationName": "Lunar Orbit (LOI)",
    "name": "Artemis I",
    "tagline": "Uncrewed test flight of Space Launch System (SLS) and Orion spacecraft around the Moon.",
    "nasaProgram": "Artemis Program",
    "launchYear": "2022",
    "missionType": "Deep Space / Uncrewed Test",
    "status": "Completed",
    "targetLocation": "Shackleton Crater Rim",
    "coordinates": "89.9°S, 0.0°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Artemis I Operational Flight Challenge",
      "summary": "Uncrewed test flight of Space Launch System (SLS) and Orion spacecraft around the Moon.",
      "astronautPOV": "Commander, you are on console for Artemis I. Manual Protocol: SLS Block 1 core stage firing; Trans-Lunar Injection; distant retrograde lunar orbit entry (DRO); high-speed skip reentry heat shield test.",
      "briefingAudio": "Flight Director to all stations: We are GO for Artemis I under the Artemis Program. Review primary objective: Uncrewed test flight of Space Launch System (SLS) and Orion spacecraft around the Moon.. Operational procedure: Manual Protocol: SLS Block 1 core stage firing; Trans-Lunar Injection; distant retrograde lunar orbit entry (DRO); high-speed skip reentry heat shield test."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Artemis I",
      "docNumber": "NASA-M047-NASA-HIST",
      "linkTitle": "Artemis Program Official Record"
    },
    "operationalGuide": "Manual Protocol: SLS Block 1 core stage firing; Trans-Lunar Injection; distant retrograde lunar orbit entry (DRO); high-speed skip reentry heat shield test.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M048",
    "number": 48,
    "era": "ARTEMIS_ERA",
    "destination": "MOON",
    "destinationName": "Lunar Orbit (LOI)",
    "name": "Artemis II",
    "tagline": "First crewed Artemis flight carrying 4 astronauts on a lunar free-return trajectory.",
    "nasaProgram": "Artemis Program",
    "launchYear": "2026",
    "missionType": "Human Spaceflight / Lunar Flyby",
    "status": "Planned",
    "targetLocation": "Shackleton Crater Rim",
    "coordinates": "89.9°S, 0.0°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Artemis II Operational Flight Challenge",
      "summary": "First crewed Artemis flight carrying 4 astronauts on a lunar free-return trajectory.",
      "astronautPOV": "Commander, you are on console for Artemis II. Manual Protocol: Proximity operations demonstration in LEO; lunar flyby trajectory alignment; deep-space life support and communication verification.",
      "briefingAudio": "Flight Director to all stations: We are GO for Artemis II under the Artemis Program. Review primary objective: First crewed Artemis flight carrying 4 astronauts on a lunar free-return trajectory.. Operational procedure: Manual Protocol: Proximity operations demonstration in LEO; lunar flyby trajectory alignment; deep-space life support and communication verification."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Artemis II",
      "docNumber": "NASA-M048-NASA-HIST",
      "linkTitle": "Artemis Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Proximity operations demonstration in LEO; lunar flyby trajectory alignment; deep-space life support and communication verification.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M049",
    "number": 49,
    "era": "ARTEMIS_ERA",
    "destination": "MOON",
    "destinationName": "Lunar Surface",
    "name": "Artemis III",
    "tagline": "First crewed lunar south pole landing under Artemis.",
    "nasaProgram": "Artemis Program",
    "launchYear": "2027",
    "missionType": "Human Spaceflight / Lunar Landing",
    "status": "Planned",
    "targetLocation": "Shackleton Crater Rim",
    "coordinates": "89.9°S, 0.0°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Artemis III Operational Flight Challenge",
      "summary": "First crewed lunar south pole landing under Artemis.",
      "astronautPOV": "Commander, you are on console for Artemis III. Manual Protocol: Orion docking with Human Landing System (HLS) in lunar orbit; descent to lunar South Pole; surface EVAs collecting polar water ice.",
      "briefingAudio": "Flight Director to all stations: We are GO for Artemis III under the Artemis Program. Review primary objective: First crewed lunar south pole landing under Artemis.. Operational procedure: Manual Protocol: Orion docking with Human Landing System (HLS) in lunar orbit; descent to lunar South Pole; surface EVAs collecting polar water ice."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Artemis III",
      "docNumber": "NASA-M049-NASA-HIST",
      "linkTitle": "Artemis Program Official Record"
    },
    "operationalGuide": "Manual Protocol: Orion docking with Human Landing System (HLS) in lunar orbit; descent to lunar South Pole; surface EVAs collecting polar water ice.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M050",
    "number": 50,
    "era": "ARTEMIS_ERA",
    "destination": "MOON",
    "destinationName": "Lunar Orbit (LOI)",
    "name": "Ranger & Surveyor Programs",
    "tagline": "Pioneering impactor and soft-lander lunar surface exploration.",
    "nasaProgram": "Robotic Lunar",
    "launchYear": "1961-1968",
    "missionType": "Robotic / Lunar Probes",
    "status": "Completed",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Ranger & Surveyor Programs Operational Flight Challenge",
      "summary": "Pioneering impactor and soft-lander lunar surface exploration.",
      "astronautPOV": "Commander, you are on console for Ranger & Surveyor Programs. Manual Protocol: High-speed crash imaging (Ranger); touchdown shock absorber telemetry and surface soil mechanics (Surveyor).",
      "briefingAudio": "Flight Director to all stations: We are GO for Ranger & Surveyor Programs under the Robotic Lunar. Review primary objective: Pioneering impactor and soft-lander lunar surface exploration.. Operational procedure: Manual Protocol: High-speed crash imaging (Ranger); touchdown shock absorber telemetry and surface soil mechanics (Surveyor)."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Ranger & Surveyor Programs",
      "docNumber": "NASA-M050-NASA-HIST",
      "linkTitle": "Robotic Lunar Official Record"
    },
    "operationalGuide": "Manual Protocol: High-speed crash imaging (Ranger); touchdown shock absorber telemetry and surface soil mechanics (Surveyor).",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M051",
    "number": 51,
    "era": "ARTEMIS_ERA",
    "destination": "MOON",
    "destinationName": "Lunar Orbit (LOI)",
    "name": "Lunar Reconnaissance Orbiter (LRO)",
    "tagline": "High-resolution mapping and resource identification of the Moon.",
    "nasaProgram": "Robotic Lunar",
    "launchYear": "2009-Present",
    "missionType": "Robotic / Lunar Orbiter",
    "status": "Active",
    "targetLocation": "Lunar Highland Basin",
    "coordinates": "20.19°N, 30.77°E",
    "gravityG": 0.166,
    "atmosphere": "Hard Vacuum (< 10⁻¹² Pa)",
    "surfaceTempC": "-130°C to +120°C",
    "missionPatchEmoji": "🌕",
    "primaryInstrument": "Lunar Module Descent Engine + ALSEP Scientific Package",
    "scientificProblem": {
      "title": "Lunar Reconnaissance Orbiter (LRO) Operational Flight Challenge",
      "summary": "High-resolution mapping and resource identification of the Moon.",
      "astronautPOV": "Commander, you are on console for Lunar Reconnaissance Orbiter (LRO). Manual Protocol: Polar mapping orbit; narrow-angle camera imaging for 50cm surface resolution; laser altimetry for polar crater shade mapping.",
      "briefingAudio": "Flight Director to all stations: We are GO for Lunar Reconnaissance Orbiter (LRO) under the Robotic Lunar. Review primary objective: High-resolution mapping and resource identification of the Moon.. Operational procedure: Manual Protocol: Polar mapping orbit; narrow-angle camera imaging for 50cm surface resolution; laser altimetry for polar crater shade mapping."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Lunar Reconnaissance Orbiter (LRO)",
      "docNumber": "NASA-M051-NASA-HIST",
      "linkTitle": "Robotic Lunar Official Record"
    },
    "operationalGuide": "Manual Protocol: Polar mapping orbit; narrow-angle camera imaging for 50cm surface resolution; laser altimetry for polar crater shade mapping.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 198418,
      "fogColor": 329745,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.7,
      "sunColor": 16776171,
      "sunIntensity": 2.2
    }
  },
  {
    "id": "NASA-M052",
    "number": 52,
    "era": "MARS_FLEET",
    "destination": "MARS",
    "destinationName": "Martian Surface / Orbit",
    "name": "Mariner 4, 9",
    "tagline": "First successful Mars flyby (Mariner 4) and first spacecraft to orbit another planet (Mariner 9).",
    "nasaProgram": "Robotic Mars",
    "launchYear": "1964-1971",
    "missionType": "Robotic / Mars Flyby & Orbiter",
    "status": "Completed",
    "targetLocation": "Martian Basin",
    "coordinates": "19.3°N, 33.6°W",
    "gravityG": 0.379,
    "atmosphere": "Carbon Dioxide (95.3%, 610 Pa)",
    "surfaceTempC": "-125°C to +20°C",
    "missionPatchEmoji": "🔴",
    "primaryInstrument": "Panoramic Stereo Imaging + Alpha Particle X-Ray Spectrometer",
    "scientificProblem": {
      "title": "Mariner 4, 9 Operational Flight Challenge",
      "summary": "First successful Mars flyby (Mariner 4) and first spacecraft to orbit another planet (Mariner 9).",
      "astronautPOV": "Commander, you are on console for Mariner 4, 9. Manual Protocol: TV camera digital tape recorder telemetry; orbital insertion burn firing; mapping major dust storms, volcanoes, and canyons.",
      "briefingAudio": "Flight Director to all stations: We are GO for Mariner 4, 9 under the Robotic Mars. Review primary objective: First successful Mars flyby (Mariner 4) and first spacecraft to orbit another planet (Mariner 9).. Operational procedure: Manual Protocol: TV camera digital tape recorder telemetry; orbital insertion burn firing; mapping major dust storms, volcanoes, and canyons."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Mariner 4, 9",
      "docNumber": "NASA-M052-NASA-HIST",
      "linkTitle": "Robotic Mars Official Record"
    },
    "operationalGuide": "Manual Protocol: TV camera digital tape recorder telemetry; orbital insertion burn firing; mapping major dust storms, volcanoes, and canyons.",
    "visualPreset": {
      "terrainColor": 10105874,
      "skyColor": 4396039,
      "fogColor": 8138002,
      "celestialBody": "PHOBOS",
      "ambientIntensity": 0.85,
      "sunColor": 16772565,
      "sunIntensity": 1.8
    }
  },
  {
    "id": "NASA-M053",
    "number": 53,
    "era": "MARS_FLEET",
    "destination": "MARS",
    "destinationName": "Martian Surface / Orbit",
    "name": "Viking 1 & Viking 2",
    "tagline": "First successful soft landings and life-detection biology experiments on Mars.",
    "nasaProgram": "Robotic Mars",
    "launchYear": "1975-1976",
    "missionType": "Robotic / Mars Orbiter & Lander",
    "status": "Completed",
    "targetLocation": "Martian Basin",
    "coordinates": "19.3°N, 33.6°W",
    "gravityG": 0.379,
    "atmosphere": "Carbon Dioxide (95.3%, 610 Pa)",
    "surfaceTempC": "-125°C to +20°C",
    "missionPatchEmoji": "🔴",
    "primaryInstrument": "Panoramic Stereo Imaging + Alpha Particle X-Ray Spectrometer",
    "scientificProblem": {
      "title": "Viking 1 & Viking 2 Operational Flight Challenge",
      "summary": "First successful soft landings and life-detection biology experiments on Mars.",
      "astronautPOV": "Commander, you are on console for Viking 1 & Viking 2. Manual Protocol: Aeroshell heat shield reentry, parachute deployment, terminal retro-rocket firing; automated soil arm scoop sampling.",
      "briefingAudio": "Flight Director to all stations: We are GO for Viking 1 & Viking 2 under the Robotic Mars. Review primary objective: First successful soft landings and life-detection biology experiments on Mars.. Operational procedure: Manual Protocol: Aeroshell heat shield reentry, parachute deployment, terminal retro-rocket firing; automated soil arm scoop sampling."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Viking 1 & Viking 2",
      "docNumber": "NASA-M053-NASA-HIST",
      "linkTitle": "Robotic Mars Official Record"
    },
    "operationalGuide": "Manual Protocol: Aeroshell heat shield reentry, parachute deployment, terminal retro-rocket firing; automated soil arm scoop sampling.",
    "visualPreset": {
      "terrainColor": 10105874,
      "skyColor": 4396039,
      "fogColor": 8138002,
      "celestialBody": "PHOBOS",
      "ambientIntensity": 0.85,
      "sunColor": 16772565,
      "sunIntensity": 1.8
    }
  },
  {
    "id": "NASA-M054",
    "number": 54,
    "era": "MARS_FLEET",
    "destination": "MARS",
    "destinationName": "Martian Surface / Orbit",
    "name": "Mars Pathfinder & Sojourner Rover",
    "tagline": "First robotic Mars rover pathfinder testing airbag landing system.",
    "nasaProgram": "Robotic Mars",
    "launchYear": "1996",
    "missionType": "Robotic / Mars Lander & Rover",
    "status": "Completed",
    "targetLocation": "Ares Vallis",
    "coordinates": "19.3°N, 33.6°W",
    "gravityG": 0.379,
    "atmosphere": "Carbon Dioxide (95.3%, 610 Pa)",
    "surfaceTempC": "-125°C to +20°C",
    "missionPatchEmoji": "🔴",
    "primaryInstrument": "Panoramic Stereo Imaging + Alpha Particle X-Ray Spectrometer",
    "scientificProblem": {
      "title": "Mars Pathfinder & Sojourner Rover Operational Flight Challenge",
      "summary": "First robotic Mars rover pathfinder testing airbag landing system.",
      "astronautPOV": "Commander, you are on console for Mars Pathfinder & Sojourner Rover. Manual Protocol: Direct atmospheric entry with deceleration airbags; ramp deployment; autonomous hazard avoidance rove navigation.",
      "briefingAudio": "Flight Director to all stations: We are GO for Mars Pathfinder & Sojourner Rover under the Robotic Mars. Review primary objective: First robotic Mars rover pathfinder testing airbag landing system.. Operational procedure: Manual Protocol: Direct atmospheric entry with deceleration airbags; ramp deployment; autonomous hazard avoidance rove navigation."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Mars Pathfinder & Sojourner Rover",
      "docNumber": "NASA-M054-NASA-HIST",
      "linkTitle": "Robotic Mars Official Record"
    },
    "operationalGuide": "Manual Protocol: Direct atmospheric entry with deceleration airbags; ramp deployment; autonomous hazard avoidance rove navigation.",
    "visualPreset": {
      "terrainColor": 10105874,
      "skyColor": 4396039,
      "fogColor": 8138002,
      "celestialBody": "PHOBOS",
      "ambientIntensity": 0.85,
      "sunColor": 16772565,
      "sunIntensity": 1.8
    }
  },
  {
    "id": "NASA-M055",
    "number": 55,
    "era": "MARS_FLEET",
    "destination": "MARS",
    "destinationName": "Martian Surface / Orbit",
    "name": "Mars Exploration Rovers (Spirit & Opportunity)",
    "tagline": "Geological exploration proving ancient surface liquid water on Mars.",
    "nasaProgram": "Robotic Mars",
    "launchYear": "2003",
    "missionType": "Robotic / Mars Rovers",
    "status": "Completed",
    "targetLocation": "Martian Basin",
    "coordinates": "19.3°N, 33.6°W",
    "gravityG": 0.379,
    "atmosphere": "Carbon Dioxide (95.3%, 610 Pa)",
    "surfaceTempC": "-125°C to +20°C",
    "missionPatchEmoji": "🔴",
    "primaryInstrument": "Panoramic Stereo Imaging + Alpha Particle X-Ray Spectrometer",
    "scientificProblem": {
      "title": "Mars Exploration Rovers (Spirit & Opportunity) Operational Flight Challenge",
      "summary": "Geological exploration proving ancient surface liquid water on Mars.",
      "astronautPOV": "Commander, you are on console for Mars Exploration Rovers (Spirit & Opportunity). Manual Protocol: Airbag bouncing touchdown; solar array cleaning by dust devils; rock abrasion tool (RAT) grinding and Moessbauer spectrometer analysis.",
      "briefingAudio": "Flight Director to all stations: We are GO for Mars Exploration Rovers (Spirit & Opportunity) under the Robotic Mars. Review primary objective: Geological exploration proving ancient surface liquid water on Mars.. Operational procedure: Manual Protocol: Airbag bouncing touchdown; solar array cleaning by dust devils; rock abrasion tool (RAT) grinding and Moessbauer spectrometer analysis."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Mars Exploration Rovers (Spirit & Opportunity)",
      "docNumber": "NASA-M055-NASA-HIST",
      "linkTitle": "Robotic Mars Official Record"
    },
    "operationalGuide": "Manual Protocol: Airbag bouncing touchdown; solar array cleaning by dust devils; rock abrasion tool (RAT) grinding and Moessbauer spectrometer analysis.",
    "visualPreset": {
      "terrainColor": 10105874,
      "skyColor": 4396039,
      "fogColor": 8138002,
      "celestialBody": "PHOBOS",
      "ambientIntensity": 0.85,
      "sunColor": 16772565,
      "sunIntensity": 1.8
    }
  },
  {
    "id": "NASA-M056",
    "number": 56,
    "era": "MARS_FLEET",
    "destination": "MARS",
    "destinationName": "Martian Surface / Orbit",
    "name": "Mars Science Laboratory (Curiosity Rover)",
    "tagline": "Exploring Gale Crater to assess past habitability.",
    "nasaProgram": "Robotic Mars",
    "launchYear": "2011-Present",
    "missionType": "Robotic / Mars Rover",
    "status": "Active",
    "targetLocation": "Gale Crater",
    "coordinates": "4.6°S, 137.4°E",
    "gravityG": 0.379,
    "atmosphere": "Carbon Dioxide (95.3%, 610 Pa)",
    "surfaceTempC": "-125°C to +20°C",
    "missionPatchEmoji": "🔴",
    "primaryInstrument": "Panoramic Stereo Imaging + Alpha Particle X-Ray Spectrometer",
    "scientificProblem": {
      "title": "Mars Science Laboratory (Curiosity Rover) Operational Flight Challenge",
      "summary": "Exploring Gale Crater to assess past habitability.",
      "astronautPOV": "Commander, you are on console for Mars Science Laboratory (Curiosity Rover). Manual Protocol: Sky Crane powered descent landing system; SAM mass spectrometer sample analysis; nuclear RTG power management.",
      "briefingAudio": "Flight Director to all stations: We are GO for Mars Science Laboratory (Curiosity Rover) under the Robotic Mars. Review primary objective: Exploring Gale Crater to assess past habitability.. Operational procedure: Manual Protocol: Sky Crane powered descent landing system; SAM mass spectrometer sample analysis; nuclear RTG power management."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Mars Science Laboratory (Curiosity Rover)",
      "docNumber": "NASA-M056-NASA-HIST",
      "linkTitle": "Robotic Mars Official Record"
    },
    "operationalGuide": "Manual Protocol: Sky Crane powered descent landing system; SAM mass spectrometer sample analysis; nuclear RTG power management.",
    "visualPreset": {
      "terrainColor": 10105874,
      "skyColor": 4396039,
      "fogColor": 8138002,
      "celestialBody": "PHOBOS",
      "ambientIntensity": 0.85,
      "sunColor": 16772565,
      "sunIntensity": 1.8
    }
  },
  {
    "id": "NASA-M057",
    "number": 57,
    "era": "MARS_FLEET",
    "destination": "MARS",
    "destinationName": "Martian Surface / Orbit",
    "name": "Mars 2020 (Perseverance & Ingenuity)",
    "tagline": "Searching for signs of ancient biosignatures and first powered flight on another planet.",
    "nasaProgram": "Robotic Mars",
    "launchYear": "2020-Present",
    "missionType": "Robotic / Mars Rover & Helicopter",
    "status": "Active",
    "targetLocation": "Jezero Crater",
    "coordinates": "18.4°N, 77.5°E",
    "gravityG": 0.379,
    "atmosphere": "Carbon Dioxide (95.3%, 610 Pa)",
    "surfaceTempC": "-125°C to +20°C",
    "missionPatchEmoji": "🔴",
    "primaryInstrument": "Mastcam-Z + SuperCam + MOXIE",
    "scientificProblem": {
      "title": "Mars 2020 (Perseverance & Ingenuity) Operational Flight Challenge",
      "summary": "Searching for signs of ancient biosignatures and first powered flight on another planet.",
      "astronautPOV": "Commander, you are on console for Mars 2020 (Perseverance & Ingenuity). Manual Protocol: Terrain-Relative Navigation landing; sample caching tube drill sealing; Ingenuity rotorcraft autonomous flight control.",
      "briefingAudio": "Flight Director to all stations: We are GO for Mars 2020 (Perseverance & Ingenuity) under the Robotic Mars. Review primary objective: Searching for signs of ancient biosignatures and first powered flight on another planet.. Operational procedure: Manual Protocol: Terrain-Relative Navigation landing; sample caching tube drill sealing; Ingenuity rotorcraft autonomous flight control."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Mars 2020 (Perseverance & Ingenuity)",
      "docNumber": "NASA-M057-NASA-HIST",
      "linkTitle": "Robotic Mars Official Record"
    },
    "operationalGuide": "Manual Protocol: Terrain-Relative Navigation landing; sample caching tube drill sealing; Ingenuity rotorcraft autonomous flight control.",
    "visualPreset": {
      "terrainColor": 10105874,
      "skyColor": 4396039,
      "fogColor": 8138002,
      "celestialBody": "PHOBOS",
      "ambientIntensity": 0.85,
      "sunColor": 16772565,
      "sunIntensity": 1.8
    }
  },
  {
    "id": "NASA-M058",
    "number": 58,
    "era": "DEEP_WORLDS",
    "destination": "VENUS",
    "destinationName": "Venusian Atmosphere",
    "name": "Pioneer Venus & Magellan",
    "tagline": "Atmospheric probes and synthetic aperture radar mapping of Venus.",
    "nasaProgram": "Robotic Venus",
    "launchYear": "1978-1989",
    "missionType": "Robotic / Venus Probes",
    "status": "Completed",
    "targetLocation": "Aphrodite Terra / Maxwell Montes",
    "coordinates": "0.0°N, 100.0°E",
    "gravityG": 0.904,
    "atmosphere": "Supercritical CO₂ + H₂SO₄ (92 bar)",
    "surfaceTempC": "+464°C",
    "missionPatchEmoji": "🟡",
    "primaryInstrument": "Synthetic Aperture Radar (SAR) + Pyroxene Altimeter",
    "scientificProblem": {
      "title": "Pioneer Venus & Magellan Operational Flight Challenge",
      "summary": "Atmospheric probes and synthetic aperture radar mapping of Venus.",
      "astronautPOV": "Commander, you are on console for Pioneer Venus & Magellan. Manual Protocol: High-temperature atmospheric probe drops; radar altimetry through dense cloud deck; aerobraking orbit shaping.",
      "briefingAudio": "Flight Director to all stations: We are GO for Pioneer Venus & Magellan under the Robotic Venus. Review primary objective: Atmospheric probes and synthetic aperture radar mapping of Venus.. Operational procedure: Manual Protocol: High-temperature atmospheric probe drops; radar altimetry through dense cloud deck; aerobraking orbit shaping."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Pioneer Venus & Magellan",
      "docNumber": "NASA-M058-NASA-HIST",
      "linkTitle": "Robotic Venus Official Record"
    },
    "operationalGuide": "Manual Protocol: High-temperature atmospheric probe drops; radar altimetry through dense cloud deck; aerobraking orbit shaping.",
    "visualPreset": {
      "terrainColor": 7421714,
      "skyColor": 4528643,
      "fogColor": 7877903,
      "celestialBody": "SUN",
      "ambientIntensity": 0.6,
      "sunColor": 16707722,
      "sunIntensity": 1.5
    }
  },
  {
    "id": "NASA-M059",
    "number": 59,
    "era": "PIONEERS",
    "destination": "MERCURY",
    "destinationName": "Hermian Low Orbit",
    "name": "MESSENGER",
    "tagline": "First spacecraft to orbit Mercury.",
    "nasaProgram": "Robotic Mercury",
    "launchYear": "2004-2015",
    "missionType": "Robotic / Mercury Orbiter",
    "status": "Completed",
    "targetLocation": "Caloris Basin Overflight",
    "coordinates": "30.5°N, 189.8°W",
    "gravityG": 0.378,
    "atmosphere": "Surface Boundary Exosphere (< 10⁻¹⁴ bar)",
    "surfaceTempC": "-180°C to +430°C",
    "missionPatchEmoji": "🪐",
    "primaryInstrument": "Mercury Dual Imaging System (MDIS) + Magnetometer",
    "scientificProblem": {
      "title": "MESSENGER Operational Flight Challenge",
      "summary": "First spacecraft to orbit Mercury.",
      "astronautPOV": "Commander, you are on console for MESSENGER. Manual Protocol: Complex gravity assists (1 Earth, 2 Venus, 3 Mercury); sunshade thermal management; orbital insertion burn.",
      "briefingAudio": "Flight Director to all stations: We are GO for MESSENGER under the Robotic Mercury. Review primary objective: First spacecraft to orbit Mercury.. Operational procedure: Manual Protocol: Complex gravity assists (1 Earth, 2 Venus, 3 Mercury); sunshade thermal management; orbital insertion burn."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: MESSENGER",
      "docNumber": "NASA-M059-NASA-HIST",
      "linkTitle": "Robotic Mercury Official Record"
    },
    "operationalGuide": "Manual Protocol: Complex gravity assists (1 Earth, 2 Venus, 3 Mercury); sunshade thermal management; orbital insertion burn.",
    "visualPreset": {
      "terrainColor": 5395035,
      "skyColor": 592139,
      "fogColor": 1579035,
      "celestialBody": "SUN",
      "ambientIntensity": 0.9,
      "sunColor": 16772565,
      "sunIntensity": 3.5
    }
  },
  {
    "id": "NASA-M060",
    "number": 60,
    "era": "DEEP_WORLDS",
    "destination": "OUTER_PLANETS",
    "destinationName": "Outer Solar System / Interstellar",
    "name": "Pioneer 10 & 11",
    "tagline": "First flybys of Jupiter and Saturn and first probes to achieve solar escape velocity.",
    "nasaProgram": "Outer Planets",
    "launchYear": "1972-1973",
    "missionType": "Robotic / Planetary Flybys",
    "status": "Completed",
    "targetLocation": "Heliopause Boundary / Kuiper Belt",
    "coordinates": "150+ AU from Sun",
    "gravityG": 0,
    "atmosphere": "Interstellar Medium Plasma",
    "surfaceTempC": "-240°C (33 K)",
    "missionPatchEmoji": "🌌",
    "primaryInstrument": "Plasma Wave Sensor + Cosmic Ray Subsystem + Golden Record",
    "scientificProblem": {
      "title": "Pioneer 10 & 11 Operational Flight Challenge",
      "summary": "First flybys of Jupiter and Saturn and first probes to achieve solar escape velocity.",
      "astronautPOV": "Commander, you are on console for Pioneer 10 & 11. Manual Protocol: Asteroid belt traversal; intense Jovian radiation belt measurement; spin-stabilized navigation.",
      "briefingAudio": "Flight Director to all stations: We are GO for Pioneer 10 & 11 under the Outer Planets. Review primary objective: First flybys of Jupiter and Saturn and first probes to achieve solar escape velocity.. Operational procedure: Manual Protocol: Asteroid belt traversal; intense Jovian radiation belt measurement; spin-stabilized navigation."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Pioneer 10 & 11",
      "docNumber": "NASA-M060-NASA-HIST",
      "linkTitle": "Outer Planets Official Record"
    },
    "operationalGuide": "Manual Protocol: Asteroid belt traversal; intense Jovian radiation belt measurement; spin-stabilized navigation.",
    "visualPreset": {
      "terrainColor": 988970,
      "skyColor": 132631,
      "fogColor": 0,
      "celestialBody": "SUN",
      "ambientIntensity": 0.3,
      "sunColor": 9684477,
      "sunIntensity": 0.4
    }
  },
  {
    "id": "NASA-M061",
    "number": 61,
    "era": "DEEP_WORLDS",
    "destination": "OUTER_PLANETS",
    "destinationName": "Outer Solar System / Interstellar",
    "name": "Voyager 1 & Voyager 2",
    "tagline": "Grand Tour of Jupiter, Saturn, Uranus, Neptune, and exploration of interstellar space.",
    "nasaProgram": "Outer Planets",
    "launchYear": "1977-Present",
    "missionType": "Robotic / Interstellar Probes",
    "status": "Active",
    "targetLocation": "Heliopause Boundary / Kuiper Belt",
    "coordinates": "150+ AU from Sun",
    "gravityG": 0,
    "atmosphere": "Interstellar Medium Plasma",
    "surfaceTempC": "-240°C (33 K)",
    "missionPatchEmoji": "🌌",
    "primaryInstrument": "Plasma Wave Sensor + Cosmic Ray Subsystem + Golden Record",
    "scientificProblem": {
      "title": "Voyager 1 & Voyager 2 Operational Flight Challenge",
      "summary": "Grand Tour of Jupiter, Saturn, Uranus, Neptune, and exploration of interstellar space.",
      "astronautPOV": "Commander, you are on console for Voyager 1 & Voyager 2. Manual Protocol: Multi-planet planetary gravity assist maneuvers; Golden Record playback payload; interstellar plasma density measurement.",
      "briefingAudio": "Flight Director to all stations: We are GO for Voyager 1 & Voyager 2 under the Outer Planets. Review primary objective: Grand Tour of Jupiter, Saturn, Uranus, Neptune, and exploration of interstellar space.. Operational procedure: Manual Protocol: Multi-planet planetary gravity assist maneuvers; Golden Record playback payload; interstellar plasma density measurement."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Voyager 1 & Voyager 2",
      "docNumber": "NASA-M061-NASA-HIST",
      "linkTitle": "Outer Planets Official Record"
    },
    "operationalGuide": "Manual Protocol: Multi-planet planetary gravity assist maneuvers; Golden Record playback payload; interstellar plasma density measurement.",
    "visualPreset": {
      "terrainColor": 988970,
      "skyColor": 132631,
      "fogColor": 0,
      "celestialBody": "SUN",
      "ambientIntensity": 0.3,
      "sunColor": 9684477,
      "sunIntensity": 0.4
    }
  },
  {
    "id": "NASA-M062",
    "number": 62,
    "era": "DEEP_WORLDS",
    "destination": "EUROPA",
    "destinationName": "Jovian System / Europa",
    "name": "Galileo",
    "tagline": "Detailed study of Jupiter and discovery of subsurface ocean on Europa.",
    "nasaProgram": "Outer Planets",
    "launchYear": "1989-2003",
    "missionType": "Robotic / Jupiter Orbiter & Probe",
    "status": "Completed",
    "targetLocation": "Chaos Terrain (Conamara Chaos)",
    "coordinates": "9.0°N, 274.0°W",
    "gravityG": 0.134,
    "atmosphere": "Trace Molecular Oxygen (< 10⁻¹¹ bar)",
    "surfaceTempC": "-220°C to -160°C",
    "missionPatchEmoji": "🧊",
    "primaryInstrument": "REASON Ice-Penetrating Radar + MASPEX Spectrometer",
    "scientificProblem": {
      "title": "Galileo Operational Flight Challenge",
      "summary": "Detailed study of Jupiter and discovery of subsurface ocean on Europa.",
      "astronautPOV": "Commander, you are on console for Galileo. Manual Protocol: Descent probe release into Jovian atmosphere (160 km drop); high-gain antenna failure workaround via tape recorder; intentional impact into Jupiter.",
      "briefingAudio": "Flight Director to all stations: We are GO for Galileo under the Outer Planets. Review primary objective: Detailed study of Jupiter and discovery of subsurface ocean on Europa.. Operational procedure: Manual Protocol: Descent probe release into Jovian atmosphere (160 km drop); high-gain antenna failure workaround via tape recorder; intentional impact into Jupiter."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Galileo",
      "docNumber": "NASA-M062-NASA-HIST",
      "linkTitle": "Outer Planets Official Record"
    },
    "operationalGuide": "Manual Protocol: Descent probe release into Jovian atmosphere (160 km drop); high-gain antenna failure workaround via tape recorder; intentional impact into Jupiter.",
    "visualPreset": {
      "terrainColor": 9684477,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "JUPITER",
      "ambientIntensity": 0.7,
      "sunColor": 14742270,
      "sunIntensity": 0.7
    }
  },
  {
    "id": "NASA-M063",
    "number": 63,
    "era": "DEEP_WORLDS",
    "destination": "TITAN",
    "destinationName": "Saturnian System / Titan",
    "name": "Cassini-Huygens",
    "tagline": "13-year exploration of Saturn, its rings, and landing Huygens on Titan.",
    "nasaProgram": "Outer Planets",
    "launchYear": "1997-2017",
    "missionType": "Robotic / Saturn Orbiter & Titan Probe",
    "status": "Completed",
    "targetLocation": "Kraken Mare / Shangri-La Dunes",
    "coordinates": "10.0°S, 160.0°W",
    "gravityG": 0.138,
    "atmosphere": "Nitrogen-Methane Dense Atmosphere (1.45 bar)",
    "surfaceTempC": "-179°C",
    "missionPatchEmoji": "🪐",
    "primaryInstrument": "DraMS Mass Spectrometer + Radar Altimetry",
    "scientificProblem": {
      "title": "Cassini-Huygens Operational Flight Challenge",
      "summary": "13-year exploration of Saturn, its rings, and landing Huygens on Titan.",
      "astronautPOV": "Commander, you are on console for Cassini-Huygens. Manual Protocol: Huygens probe atmospheric entry and landing on Titan; icy plume flybys of Enceladus; 'Grand Finale' diving orbits between Saturn and rings.",
      "briefingAudio": "Flight Director to all stations: We are GO for Cassini-Huygens under the Outer Planets. Review primary objective: 13-year exploration of Saturn, its rings, and landing Huygens on Titan.. Operational procedure: Manual Protocol: Huygens probe atmospheric entry and landing on Titan; icy plume flybys of Enceladus; 'Grand Finale' diving orbits between Saturn and rings."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Cassini-Huygens",
      "docNumber": "NASA-M063-NASA-HIST",
      "linkTitle": "Outer Planets Official Record"
    },
    "operationalGuide": "Manual Protocol: Huygens probe atmospheric entry and landing on Titan; icy plume flybys of Enceladus; 'Grand Finale' diving orbits between Saturn and rings.",
    "visualPreset": {
      "terrainColor": 14251782,
      "skyColor": 4528643,
      "fogColor": 7877903,
      "celestialBody": "SATURN",
      "ambientIntensity": 0.75,
      "sunColor": 16708551,
      "sunIntensity": 0.6
    }
  },
  {
    "id": "NASA-M064",
    "number": 64,
    "era": "DEEP_WORLDS",
    "destination": "OUTER_PLANETS",
    "destinationName": "Outer Solar System / Interstellar",
    "name": "New Horizons",
    "tagline": "First flyby of Pluto and Kuiper Belt object Arrokoth.",
    "nasaProgram": "Outer Planets",
    "launchYear": "2006-Present",
    "missionType": "Robotic / Pluto & Kuiper Belt",
    "status": "Active",
    "targetLocation": "Heliopause Boundary / Kuiper Belt",
    "coordinates": "150+ AU from Sun",
    "gravityG": 0,
    "atmosphere": "Interstellar Medium Plasma",
    "surfaceTempC": "-240°C (33 K)",
    "missionPatchEmoji": "🌌",
    "primaryInstrument": "Plasma Wave Sensor + Cosmic Ray Subsystem + Golden Record",
    "scientificProblem": {
      "title": "New Horizons Operational Flight Challenge",
      "summary": "First flyby of Pluto and Kuiper Belt object Arrokoth.",
      "astronautPOV": "Commander, you are on console for New Horizons. Manual Protocol: Hibernation flight mode; high-speed Pluto flyby (13,700 km); optical navigation to target Kuiper Belt objects.",
      "briefingAudio": "Flight Director to all stations: We are GO for New Horizons under the Outer Planets. Review primary objective: First flyby of Pluto and Kuiper Belt object Arrokoth.. Operational procedure: Manual Protocol: Hibernation flight mode; high-speed Pluto flyby (13,700 km); optical navigation to target Kuiper Belt objects."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: New Horizons",
      "docNumber": "NASA-M064-NASA-HIST",
      "linkTitle": "Outer Planets Official Record"
    },
    "operationalGuide": "Manual Protocol: Hibernation flight mode; high-speed Pluto flyby (13,700 km); optical navigation to target Kuiper Belt objects.",
    "visualPreset": {
      "terrainColor": 988970,
      "skyColor": 132631,
      "fogColor": 0,
      "celestialBody": "SUN",
      "ambientIntensity": 0.3,
      "sunColor": 9684477,
      "sunIntensity": 0.4
    }
  },
  {
    "id": "NASA-M065",
    "number": 65,
    "era": "DEEP_WORLDS",
    "destination": "EUROPA",
    "destinationName": "Jovian System / Europa",
    "name": "Juno & Europa Clipper",
    "tagline": "Probing Jupiter's interior (Juno) and assessing habitability of moon Europa (Europa Clipper).",
    "nasaProgram": "Outer Planets",
    "launchYear": "2011-2024+",
    "missionType": "Robotic / Jovian System",
    "status": "Active",
    "targetLocation": "Chaos Terrain (Conamara Chaos)",
    "coordinates": "9.0°N, 274.0°W",
    "gravityG": 0.134,
    "atmosphere": "Trace Molecular Oxygen (< 10⁻¹¹ bar)",
    "surfaceTempC": "-220°C to -160°C",
    "missionPatchEmoji": "🧊",
    "primaryInstrument": "REASON Ice-Penetrating Radar + MASPEX Spectrometer",
    "scientificProblem": {
      "title": "Juno & Europa Clipper Operational Flight Challenge",
      "summary": "Probing Jupiter's interior (Juno) and assessing habitability of moon Europa (Europa Clipper).",
      "astronautPOV": "Commander, you are on console for Juno & Europa Clipper. Manual Protocol: Highly elliptical polar orbits minimizing radiation exposure; titanium radiation vault shielding; ice-penetrating radar scans.",
      "briefingAudio": "Flight Director to all stations: We are GO for Juno & Europa Clipper under the Outer Planets. Review primary objective: Probing Jupiter's interior (Juno) and assessing habitability of moon Europa (Europa Clipper).. Operational procedure: Manual Protocol: Highly elliptical polar orbits minimizing radiation exposure; titanium radiation vault shielding; ice-penetrating radar scans."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Juno & Europa Clipper",
      "docNumber": "NASA-M065-NASA-HIST",
      "linkTitle": "Outer Planets Official Record"
    },
    "operationalGuide": "Manual Protocol: Highly elliptical polar orbits minimizing radiation exposure; titanium radiation vault shielding; ice-penetrating radar scans.",
    "visualPreset": {
      "terrainColor": 9684477,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "JUPITER",
      "ambientIntensity": 0.7,
      "sunColor": 14742270,
      "sunIntensity": 0.7
    }
  },
  {
    "id": "NASA-M066",
    "number": 66,
    "era": "COSMIC_SENTINELS",
    "destination": "ASTEROID",
    "destinationName": "Near-Earth / Asteroid Belt",
    "name": "NEAR Shoemaker, Stardust, Deep Impact",
    "tagline": "Asteroid 433 Eros landing, comet Wild 2 dust sample return, and comet Tempel 1 impact.",
    "nasaProgram": "Asteroid Exploration",
    "launchYear": "1996-2005",
    "missionType": "Robotic / Sample Return & Impact",
    "status": "Completed",
    "targetLocation": "Asteroid Surface",
    "coordinates": "Heliocentric Orbit",
    "gravityG": 0.0001,
    "atmosphere": "Ultra-High Vacuum",
    "surfaceTempC": "-100°C to +80°C",
    "missionPatchEmoji": "☄️",
    "primaryInstrument": "DRACO Kinetic Nav Camera + TAGSAM Nitrogen Arm",
    "scientificProblem": {
      "title": "NEAR Shoemaker, Stardust, Deep Impact Operational Flight Challenge",
      "summary": "Asteroid 433 Eros landing, comet Wild 2 dust sample return, and comet Tempel 1 impact.",
      "astronautPOV": "Commander, you are on console for NEAR Shoemaker, Stardust, Deep Impact. Manual Protocol: Precision asteroid orbit/landing; aerogel collection grid deployment; hypervelocity copper projectile impact navigation.",
      "briefingAudio": "Flight Director to all stations: We are GO for NEAR Shoemaker, Stardust, Deep Impact under the Asteroid Exploration. Review primary objective: Asteroid 433 Eros landing, comet Wild 2 dust sample return, and comet Tempel 1 impact.. Operational procedure: Manual Protocol: Precision asteroid orbit/landing; aerogel collection grid deployment; hypervelocity copper projectile impact navigation."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: NEAR Shoemaker, Stardust, Deep Impact",
      "docNumber": "NASA-M066-NASA-HIST",
      "linkTitle": "Asteroid Exploration Official Record"
    },
    "operationalGuide": "Manual Protocol: Precision asteroid orbit/landing; aerogel collection grid deployment; hypervelocity copper projectile impact navigation.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 132631,
      "fogColor": 593174,
      "celestialBody": "SUN",
      "ambientIntensity": 0.4,
      "sunColor": 16777215,
      "sunIntensity": 1.5
    }
  },
  {
    "id": "NASA-M067",
    "number": 67,
    "era": "COSMIC_SENTINELS",
    "destination": "ASTEROID",
    "destinationName": "Near-Earth / Asteroid Belt",
    "name": "Dawn",
    "tagline": "First spacecraft to orbit two extraterrestrial destinations (Vesta and Ceres).",
    "nasaProgram": "Asteroid Exploration",
    "launchYear": "2007-2018",
    "missionType": "Robotic / Dwarf Planet Orbiter",
    "status": "Completed",
    "targetLocation": "Asteroid Surface",
    "coordinates": "Heliocentric Orbit",
    "gravityG": 0.0001,
    "atmosphere": "Ultra-High Vacuum",
    "surfaceTempC": "-100°C to +80°C",
    "missionPatchEmoji": "☄️",
    "primaryInstrument": "DRACO Kinetic Nav Camera + TAGSAM Nitrogen Arm",
    "scientificProblem": {
      "title": "Dawn Operational Flight Challenge",
      "summary": "First spacecraft to orbit two extraterrestrial destinations (Vesta and Ceres).",
      "astronautPOV": "Commander, you are on console for Dawn. Manual Protocol: Xenon ion propulsion cruise; low-altitude mapping orbit transfers; surface mineralogy classification.",
      "briefingAudio": "Flight Director to all stations: We are GO for Dawn under the Asteroid Exploration. Review primary objective: First spacecraft to orbit two extraterrestrial destinations (Vesta and Ceres).. Operational procedure: Manual Protocol: Xenon ion propulsion cruise; low-altitude mapping orbit transfers; surface mineralogy classification."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Dawn",
      "docNumber": "NASA-M067-NASA-HIST",
      "linkTitle": "Asteroid Exploration Official Record"
    },
    "operationalGuide": "Manual Protocol: Xenon ion propulsion cruise; low-altitude mapping orbit transfers; surface mineralogy classification.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 132631,
      "fogColor": 593174,
      "celestialBody": "SUN",
      "ambientIntensity": 0.4,
      "sunColor": 16777215,
      "sunIntensity": 1.5
    }
  },
  {
    "id": "NASA-M068",
    "number": 68,
    "era": "COSMIC_SENTINELS",
    "destination": "ASTEROID",
    "destinationName": "Near-Earth / Asteroid Belt",
    "name": "OSIRIS-REx / OSIRIS-APEX",
    "tagline": "Asteroid Bennu sample collection and return to Earth in 2023.",
    "nasaProgram": "Asteroid Exploration",
    "launchYear": "2016-Present",
    "missionType": "Robotic / Asteroid Sample Return",
    "status": "Active",
    "targetLocation": "Asteroid Surface",
    "coordinates": "Heliocentric Orbit",
    "gravityG": 0.0001,
    "atmosphere": "Ultra-High Vacuum",
    "surfaceTempC": "-100°C to +80°C",
    "missionPatchEmoji": "☄️",
    "primaryInstrument": "DRACO Kinetic Nav Camera + TAGSAM Nitrogen Arm",
    "scientificProblem": {
      "title": "OSIRIS-REx / OSIRIS-APEX Operational Flight Challenge",
      "summary": "Asteroid Bennu sample collection and return to Earth in 2023.",
      "astronautPOV": "Commander, you are on console for OSIRIS-REx / OSIRIS-APEX. Manual Protocol: Touch-And-Go (TAG) nitrogen gas sample collection arm actuation; sample return capsule Earth reentry landing; extended mission to Apophis.",
      "briefingAudio": "Flight Director to all stations: We are GO for OSIRIS-REx / OSIRIS-APEX under the Asteroid Exploration. Review primary objective: Asteroid Bennu sample collection and return to Earth in 2023.. Operational procedure: Manual Protocol: Touch-And-Go (TAG) nitrogen gas sample collection arm actuation; sample return capsule Earth reentry landing; extended mission to Apophis."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: OSIRIS-REx / OSIRIS-APEX",
      "docNumber": "NASA-M068-NASA-HIST",
      "linkTitle": "Asteroid Exploration Official Record"
    },
    "operationalGuide": "Manual Protocol: Touch-And-Go (TAG) nitrogen gas sample collection arm actuation; sample return capsule Earth reentry landing; extended mission to Apophis.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 132631,
      "fogColor": 593174,
      "celestialBody": "SUN",
      "ambientIntensity": 0.4,
      "sunColor": 16777215,
      "sunIntensity": 1.5
    }
  },
  {
    "id": "NASA-M069",
    "number": 69,
    "era": "COSMIC_SENTINELS",
    "destination": "ASTEROID",
    "destinationName": "Near-Earth / Asteroid Belt",
    "name": "DART (Double Asteroid Redirection Test)",
    "tagline": "First planetary defense kinetic impactor demonstration on asteroid Dimorphos.",
    "nasaProgram": "Asteroid Exploration",
    "launchYear": "2021-2022",
    "missionType": "Robotic / Planetary Defense",
    "status": "Completed",
    "targetLocation": "Didymos-Dimorphos System",
    "coordinates": "Heliocentric Orbit",
    "gravityG": 0.0001,
    "atmosphere": "Ultra-High Vacuum",
    "surfaceTempC": "-100°C to +80°C",
    "missionPatchEmoji": "☄️",
    "primaryInstrument": "DRACO Kinetic Nav Camera + TAGSAM Nitrogen Arm",
    "scientificProblem": {
      "title": "DART (Double Asteroid Redirection Test) Operational Flight Challenge",
      "summary": "First planetary defense kinetic impactor demonstration on asteroid Dimorphos.",
      "astronautPOV": "Commander, you are on console for DART (Double Asteroid Redirection Test). Manual Protocol: Autonomous Real-time Navigation (SMART Nav) impact guidance; hypervelocity collision at 6.6 km/s; orbital period change verification.",
      "briefingAudio": "Flight Director to all stations: We are GO for DART (Double Asteroid Redirection Test) under the Asteroid Exploration. Review primary objective: First planetary defense kinetic impactor demonstration on asteroid Dimorphos.. Operational procedure: Manual Protocol: Autonomous Real-time Navigation (SMART Nav) impact guidance; hypervelocity collision at 6.6 km/s; orbital period change verification."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: DART (Double Asteroid Redirection Test)",
      "docNumber": "NASA-M069-NASA-HIST",
      "linkTitle": "Asteroid Exploration Official Record"
    },
    "operationalGuide": "Manual Protocol: Autonomous Real-time Navigation (SMART Nav) impact guidance; hypervelocity collision at 6.6 km/s; orbital period change verification.",
    "visualPreset": {
      "terrainColor": 4674921,
      "skyColor": 132631,
      "fogColor": 593174,
      "celestialBody": "SUN",
      "ambientIntensity": 0.4,
      "sunColor": 16777215,
      "sunIntensity": 1.5
    }
  },
  {
    "id": "NASA-M070",
    "number": 70,
    "era": "COSMIC_SENTINELS",
    "destination": "LAGRANGE",
    "destinationName": "Solar Corona (Inner Heliopause)",
    "name": "SOHO, SDO, Parker Solar Probe",
    "tagline": "Continuous monitoring of solar flares, magnetic field, and flying into the Sun's corona.",
    "nasaProgram": "Heliophysics",
    "launchYear": "1995-Present",
    "missionType": "Robotic / Solar Observatories",
    "status": "Active",
    "targetLocation": "Perihelion at 3.8 Million Miles",
    "coordinates": "Lagrange Point L2 (1.5M km)",
    "gravityG": 0,
    "atmosphere": "Interplanetary Vacuum",
    "surfaceTempC": "+1,400°C Thermal Shield",
    "missionPatchEmoji": "☀️",
    "primaryInstrument": "FIELDS Electrometer + Solar Wind SWEAP",
    "scientificProblem": {
      "title": "SOHO, SDO, Parker Solar Probe Operational Flight Challenge",
      "summary": "Continuous monitoring of solar flares, magnetic field, and flying into the Sun's corona.",
      "astronautPOV": "Commander, you are on console for SOHO, SDO, Parker Solar Probe. Manual Protocol: Carbon-composite heat shield thermal protection at 1,400°C; extreme ultraviolet solar imaging; coronal mass ejection warning systems.",
      "briefingAudio": "Flight Director to all stations: We are GO for SOHO, SDO, Parker Solar Probe under the Heliophysics. Review primary objective: Continuous monitoring of solar flares, magnetic field, and flying into the Sun's corona.. Operational procedure: Manual Protocol: Carbon-composite heat shield thermal protection at 1,400°C; extreme ultraviolet solar imaging; coronal mass ejection warning systems."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: SOHO, SDO, Parker Solar Probe",
      "docNumber": "NASA-M070-NASA-HIST",
      "linkTitle": "Heliophysics Official Record"
    },
    "operationalGuide": "Manual Protocol: Carbon-composite heat shield thermal protection at 1,400°C; extreme ultraviolet solar imaging; coronal mass ejection warning systems.",
    "visualPreset": {
      "terrainColor": 1976635,
      "skyColor": 0,
      "fogColor": 329744,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.5,
      "sunColor": 16707722,
      "sunIntensity": 2
    }
  },
  {
    "id": "NASA-M071",
    "number": 71,
    "era": "COSMIC_SENTINELS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Low Earth Orbit",
    "name": "Hubble Space Telescope",
    "tagline": "Revolutionary optical and UV astronomy observing deep universe.",
    "nasaProgram": "Great Observatories",
    "launchYear": "1990-Present",
    "missionType": "Robotic / Space Observatory",
    "status": "Active",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "Hubble Space Telescope Operational Flight Challenge",
      "summary": "Revolutionary optical and UV astronomy observing deep universe.",
      "astronautPOV": "Commander, you are on console for Hubble Space Telescope. Manual Protocol: Fine Guidance Sensor pointing control (0.007 arcsec accuracy); low Earth orbit servicing interfaces; deep field multi-exposure exposures.",
      "briefingAudio": "Flight Director to all stations: We are GO for Hubble Space Telescope under the Great Observatories. Review primary objective: Revolutionary optical and UV astronomy observing deep universe.. Operational procedure: Manual Protocol: Fine Guidance Sensor pointing control (0.007 arcsec accuracy); low Earth orbit servicing interfaces; deep field multi-exposure exposures."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Hubble Space Telescope",
      "docNumber": "NASA-M071-NASA-HIST",
      "linkTitle": "Great Observatories Official Record"
    },
    "operationalGuide": "Manual Protocol: Fine Guidance Sensor pointing control (0.007 arcsec accuracy); low Earth orbit servicing interfaces; deep field multi-exposure exposures.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M072",
    "number": 72,
    "era": "COSMIC_SENTINELS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Low Earth Orbit",
    "name": "Chandra & Spitzer Space Telescopes",
    "tagline": "High-energy X-ray and infrared cosmic imaging.",
    "nasaProgram": "Great Observatories",
    "launchYear": "1999-2020",
    "missionType": "Robotic / X-ray & Infrared Observatories",
    "status": "Active / Completed",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "Chandra & Spitzer Space Telescopes Operational Flight Challenge",
      "summary": "High-energy X-ray and infrared cosmic imaging.",
      "astronautPOV": "Commander, you are on console for Chandra & Spitzer Space Telescopes. Manual Protocol: Grazing incidence X-ray mirrors; liquid helium cryogenic cooling loop monitoring; exoplanet infrared light curve tracking.",
      "briefingAudio": "Flight Director to all stations: We are GO for Chandra & Spitzer Space Telescopes under the Great Observatories. Review primary objective: High-energy X-ray and infrared cosmic imaging.. Operational procedure: Manual Protocol: Grazing incidence X-ray mirrors; liquid helium cryogenic cooling loop monitoring; exoplanet infrared light curve tracking."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Chandra & Spitzer Space Telescopes",
      "docNumber": "NASA-M072-NASA-HIST",
      "linkTitle": "Great Observatories Official Record"
    },
    "operationalGuide": "Manual Protocol: Grazing incidence X-ray mirrors; liquid helium cryogenic cooling loop monitoring; exoplanet infrared light curve tracking.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M073",
    "number": 73,
    "era": "COSMIC_SENTINELS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Low Earth Orbit",
    "name": "Kepler & TESS Exoplanet Telescopes",
    "tagline": "Discovering thousands of exoplanets using the transit photometry method.",
    "nasaProgram": "Astrophysics",
    "launchYear": "2009-Present",
    "missionType": "Robotic / Exoplanet Hunters",
    "status": "Completed / Active",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "Kepler & TESS Exoplanet Telescopes Operational Flight Challenge",
      "summary": "Discovering thousands of exoplanets using the transit photometry method.",
      "astronautPOV": "Commander, you are on console for Kepler & TESS Exoplanet Telescopes. Manual Protocol: Continuous wide-field star brightness monitoring; reaction wheel momentum dumping; sky sector survey stepping.",
      "briefingAudio": "Flight Director to all stations: We are GO for Kepler & TESS Exoplanet Telescopes under the Astrophysics. Review primary objective: Discovering thousands of exoplanets using the transit photometry method.. Operational procedure: Manual Protocol: Continuous wide-field star brightness monitoring; reaction wheel momentum dumping; sky sector survey stepping."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Kepler & TESS Exoplanet Telescopes",
      "docNumber": "NASA-M073-NASA-HIST",
      "linkTitle": "Astrophysics Official Record"
    },
    "operationalGuide": "Manual Protocol: Continuous wide-field star brightness monitoring; reaction wheel momentum dumping; sky sector survey stepping.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M074",
    "number": 74,
    "era": "COSMIC_SENTINELS",
    "destination": "LAGRANGE",
    "destinationName": "Sun-Earth L2 Halo Orbit",
    "name": "James Webb Space Telescope (JWST)",
    "tagline": "Premier deep-space infrared observatory stationed at Sun-Earth L2.",
    "nasaProgram": "Great Observatories",
    "launchYear": "2021-Present",
    "missionType": "Robotic / Infrared Space Observatory",
    "status": "Active",
    "targetLocation": "1.5 Million km Anti-Sun Direction",
    "coordinates": "Lagrange Point L2 (1.5M km)",
    "gravityG": 0,
    "atmosphere": "Interplanetary Vacuum",
    "surfaceTempC": "-233°C (40 K Cryo)",
    "missionPatchEmoji": "🔭",
    "primaryInstrument": "NIRCam + MIRI Infrared Detectors",
    "scientificProblem": {
      "title": "James Webb Space Telescope (JWST) Operational Flight Challenge",
      "summary": "Premier deep-space infrared observatory stationed at Sun-Earth L2.",
      "astronautPOV": "Commander, you are on console for James Webb Space Telescope (JWST). Manual Protocol: Ariane 5 launch to L2; 5-layer sunshield automated deployment; 18-segment beryllium mirror hexagonal alignment to nanometer accuracy.",
      "briefingAudio": "Flight Director to all stations: We are GO for James Webb Space Telescope (JWST) under the Great Observatories. Review primary objective: Premier deep-space infrared observatory stationed at Sun-Earth L2.. Operational procedure: Manual Protocol: Ariane 5 launch to L2; 5-layer sunshield automated deployment; 18-segment beryllium mirror hexagonal alignment to nanometer accuracy."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: James Webb Space Telescope (JWST)",
      "docNumber": "NASA-M074-NASA-HIST",
      "linkTitle": "Great Observatories Official Record"
    },
    "operationalGuide": "Manual Protocol: Ariane 5 launch to L2; 5-layer sunshield automated deployment; 18-segment beryllium mirror hexagonal alignment to nanometer accuracy.",
    "visualPreset": {
      "terrainColor": 1976635,
      "skyColor": 0,
      "fogColor": 329744,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.5,
      "sunColor": 16707722,
      "sunIntensity": 2
    }
  },
  {
    "id": "NASA-M075",
    "number": 75,
    "era": "COSMIC_SENTINELS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Low Earth Orbit",
    "name": "Landsat Program (Landsat 1 to 9)",
    "tagline": "50+ year continuous satellite imagery record of Earth's surface.",
    "nasaProgram": "Earth Science",
    "launchYear": "1972-Present",
    "missionType": "Robotic / Earth Remote Sensing",
    "status": "Active",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "Landsat Program (Landsat 1 to 9) Operational Flight Challenge",
      "summary": "50+ year continuous satellite imagery record of Earth's surface.",
      "astronautPOV": "Commander, you are on console for Landsat Program (Landsat 1 to 9). Manual Protocol: Sun-synchronous polar orbits; Operational Land Imager (OLI) multispectral band scanning; environmental land cover change tracking.",
      "briefingAudio": "Flight Director to all stations: We are GO for Landsat Program (Landsat 1 to 9) under the Earth Science. Review primary objective: 50+ year continuous satellite imagery record of Earth's surface.. Operational procedure: Manual Protocol: Sun-synchronous polar orbits; Operational Land Imager (OLI) multispectral band scanning; environmental land cover change tracking."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Landsat Program (Landsat 1 to 9)",
      "docNumber": "NASA-M075-NASA-HIST",
      "linkTitle": "Earth Science Official Record"
    },
    "operationalGuide": "Manual Protocol: Sun-synchronous polar orbits; Operational Land Imager (OLI) multispectral band scanning; environmental land cover change tracking.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  },
  {
    "id": "NASA-M076",
    "number": 76,
    "era": "COSMIC_SENTINELS",
    "destination": "EARTH_ORBIT",
    "destinationName": "Low Earth Orbit",
    "name": "Terra, Aqua, Aura & NISAR",
    "tagline": "Comprehensive satellite monitoring of Earth's atmosphere, oceans, ice, and land.",
    "nasaProgram": "Earth Science",
    "launchYear": "1999-Present",
    "missionType": "Robotic / Earth Observing System",
    "status": "Active",
    "targetLocation": "Low Earth Orbit Corridor",
    "coordinates": "28.5°N, 80.6°W (28.5° Inclination)",
    "gravityG": 0,
    "atmosphere": "Exosphere (< 10⁻⁷ Pa)",
    "surfaceTempC": "-100°C to +120°C",
    "missionPatchEmoji": "🌍",
    "primaryInstrument": "Reaction Control System Thrusters",
    "scientificProblem": {
      "title": "Terra, Aqua, Aura & NISAR Operational Flight Challenge",
      "summary": "Comprehensive satellite monitoring of Earth's atmosphere, oceans, ice, and land.",
      "astronautPOV": "Commander, you are on console for Terra, Aqua, Aura & NISAR. Manual Protocol: MODIS/AIRS Earth remote sensing suite; SAR dual-frequency radar interferometry; climate feedback data telemetry.",
      "briefingAudio": "Flight Director to all stations: We are GO for Terra, Aqua, Aura & NISAR under the Earth Science. Review primary objective: Comprehensive satellite monitoring of Earth's atmosphere, oceans, ice, and land.. Operational procedure: Manual Protocol: MODIS/AIRS Earth remote sensing suite; SAR dual-frequency radar interferometry; climate feedback data telemetry."
    },
    "nasaCitation": {
      "title": "NASA History & Mission Archive: Terra, Aqua, Aura & NISAR",
      "docNumber": "NASA-M076-NASA-HIST",
      "linkTitle": "Earth Science Official Record"
    },
    "operationalGuide": "Manual Protocol: MODIS/AIRS Earth remote sensing suite; SAR dual-frequency radar interferometry; climate feedback data telemetry.",
    "visualPreset": {
      "terrainColor": 1981066,
      "skyColor": 132631,
      "fogColor": 988970,
      "celestialBody": "EARTH",
      "ambientIntensity": 0.8,
      "sunColor": 16777215,
      "sunIntensity": 2.5
    }
  }
];
