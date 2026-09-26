export interface NasaCatalogMission {
  id: string;
  program: string;
  name: string;
  launchYear: string;
  type: string;
  status: "Completed" | "Active" | "Planned" | "Tragic Failure" | "Completed (Abort)" | string;
  objective: string;
  operationalGuide: string;
}

export const NASA_MISSIONS_CATALOG: NasaCatalogMission[] = [
  {
    "id": "NASA-M001",
    "program": "Project Mercury",
    "name": "Mercury-Redstone 3 (Freedom 7)",
    "launchYear": "1961",
    "type": "Human Spaceflight / Suborbital",
    "status": "Completed",
    "objective": "First U.S. crewed suborbital spaceflight flown by Alan Shepard.",
    "operationalGuide": "Manual Protocol: Redstone rocket launch; suborbital trajectory reaching 116 miles altitude; manual hand-attitude control testing in microgravity; splashdown recovery."
  },
  {
    "id": "NASA-M002",
    "program": "Project Mercury",
    "name": "Mercury-Redstone 4 (Liberty Bell 7)",
    "launchYear": "1961",
    "type": "Human Spaceflight / Suborbital",
    "status": "Completed",
    "objective": "Second U.S. suborbital mission flown by Virgil 'Gus' Grissom.",
    "operationalGuide": "Manual Protocol: Suborbital flight path; manual attitude control maneuvers; evaluation of spacecraft cabin environmental control; explosive hatch deployment post-landing."
  },
  {
    "id": "NASA-M003",
    "program": "Project Mercury",
    "name": "Mercury-Atlas 6 (Friendship 7)",
    "launchYear": "1962",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "First U.S. crewed orbital flight flown by John Glenn.",
    "operationalGuide": "Manual Protocol: Atlas launch vehicle insertion; 3 full Earth orbits; manual fly-by-wire attitude override following autopilot malfunction; retro-rocket burn and reentry thermal shield protection."
  },
  {
    "id": "NASA-M004",
    "program": "Project Mercury",
    "name": "Mercury-Atlas 7 (Aurora 7)",
    "launchYear": "1962",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "5-hour orbital science mission flown by Scott Carpenter.",
    "operationalGuide": "Manual Protocol: Horizon tracking and celestial observation experiments; fuel management for attitude control thrusters; retrofire execution."
  },
  {
    "id": "NASA-M005",
    "program": "Project Mercury",
    "name": "Mercury-Atlas 8 (Sigma 7)",
    "launchYear": "1962",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "6-orbit engineering evaluation flown by Walter Schirra.",
    "operationalGuide": "Manual Protocol: Strict reaction control system fuel conservation; suit cooling loop assessment; orbital trajectory navigation."
  },
  {
    "id": "NASA-M006",
    "program": "Project Mercury",
    "name": "Mercury-Atlas 9 (Faith 7)",
    "launchYear": "1963",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "Final Mercury mission, 22 orbits over 34 hours flown by Gordon Cooper.",
    "operationalGuide": "Manual Protocol: Extended day-long spaceflight endurance protocols; manual reentry alignment after electrical power failure."
  },
  {
    "id": "NASA-M007",
    "program": "Project Gemini",
    "name": "Gemini 1 & 2",
    "launchYear": "1964-1965",
    "type": "Human Spaceflight / Test Flights",
    "status": "Completed",
    "objective": "Uncrewed orbital and suborbital spacecraft and Titan II launch vehicle tests.",
    "operationalGuide": "Manual Protocol: Structural integrity verification, automated launch guidance, heat shield reentry performance."
  },
  {
    "id": "NASA-M008",
    "program": "Project Gemini",
    "name": "Gemini 3",
    "launchYear": "1965",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "First crewed Gemini flight with Gus Grissom and John Young.",
    "operationalGuide": "Manual Protocol: First orbital plane change maneuvers using Orbit Attitude and Maneuvering System (OAMS); manual spacecraft translation."
  },
  {
    "id": "NASA-M009",
    "program": "Project Gemini",
    "name": "Gemini 4",
    "launchYear": "1965",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "First American spacewalk (EVA) performed by Ed White with James McDivitt.",
    "operationalGuide": "Manual Protocol: 22-minute EVA tethered protocol using Hand-Held Maneuvering Unit (HHMU); 4-day flight endurance tracking."
  },
  {
    "id": "NASA-M010",
    "program": "Project Gemini",
    "name": "Gemini 5",
    "launchYear": "1965",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "8-day long-duration flight evaluating fuel cell technology.",
    "operationalGuide": "Manual Protocol: Fuel cell power generation monitoring; radar evaluation pods rendezvous maneuvers; long-term crew physiology tracking."
  },
  {
    "id": "NASA-M011",
    "program": "Project Gemini",
    "name": "Gemini 7",
    "launchYear": "1965",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "14-day long-duration endurance mission and rendezvous target.",
    "operationalGuide": "Manual Protocol: Extended microgravity habitation; shirt-sleeve environment testing; passive target station keeping."
  },
  {
    "id": "NASA-M012",
    "program": "Project Gemini",
    "name": "Gemini 6A",
    "launchYear": "1965",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "First space rendezvous with Gemini 7 flown by Schirra and Stafford.",
    "operationalGuide": "Manual Protocol: Active station-keeping within 1 foot of target; radar navigation and orbital phasing thrust burns."
  },
  {
    "id": "NASA-M013",
    "program": "Project Gemini",
    "name": "Gemini 8",
    "launchYear": "1966",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "First docking in space with Agena Target Vehicle (Armstrong and Scott).",
    "operationalGuide": "Manual Protocol: Precision orbital docking; immediate emergency undocking and Reentry Control System (RCS) thruster abort following stuck thruster spin."
  },
  {
    "id": "NASA-M014",
    "program": "Project Gemini",
    "name": "Gemini 9A",
    "launchYear": "1966",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "Rendezvous and complex EVA maneuvers with Augmented Target Docking Adapter.",
    "operationalGuide": "Manual Protocol: Work-load evaluation during EVA; visual rendezvous techniques; Astronaut Maneuvering Unit (AMU) flight testing."
  },
  {
    "id": "NASA-M015",
    "program": "Project Gemini",
    "name": "Gemini 10",
    "launchYear": "1966",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "Dual rendezvous with two separate Agena vehicles.",
    "operationalGuide": "Manual Protocol: Agena secondary propulsion engine burns for orbital altitude boosting; retrieval of micrometeorite collector from passive target."
  },
  {
    "id": "NASA-M016",
    "program": "Project Gemini",
    "name": "Gemini 11",
    "launchYear": "1966",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "First-orbit direct ascent rendezvous and tethered artificial gravity test.",
    "operationalGuide": "Manual Protocol: High-apogee orbit burn (1,374 km); tethered station-keeping rotation generating artificial gravity."
  },
  {
    "id": "NASA-M017",
    "program": "Project Gemini",
    "name": "Gemini 12",
    "launchYear": "1966",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "Final Gemini mission mastering underwater-trained EVA procedures (Aldrin and Lovell).",
    "operationalGuide": "Manual Protocol: Body-restraint foot restraints and handholds during 5.5 hours of successful EVA; total solar eclipse photography."
  },
  {
    "id": "NASA-M018",
    "program": "Apollo Program",
    "name": "Apollo 1",
    "launchYear": "1967",
    "type": "Human Spaceflight / Launch Pad Test",
    "status": "Tragic Failure",
    "objective": "Pre-flight test crewed by Grissom, White, and Chaffee.",
    "operationalGuide": "Manual Protocol: High-pressure 100% oxygen cabin atmosphere; electrical arcing triggered cabin fire leading to redesign of Apollo hatch and materials."
  },
  {
    "id": "NASA-M019",
    "program": "Apollo Program",
    "name": "Apollo 4, 5, 6",
    "launchYear": "1967-1968",
    "type": "Human Spaceflight / Uncrewed Tests",
    "status": "Completed",
    "objective": "Uncrewed qualification of Saturn V rocket and Lunar Module.",
    "operationalGuide": "Manual Protocol: Saturn V S-IC, S-II, S-IVB staging; heat shield reentry qualification at lunar return velocities."
  },
  {
    "id": "NASA-M020",
    "program": "Apollo Program",
    "name": "Apollo 7",
    "launchYear": "1968",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "First crewed Apollo orbital test flight in Command and Service Module (CSM).",
    "operationalGuide": "Manual Protocol: Service Propulsion System (SPS) engine burn firings; live TV broadcasts; rendezvous with Saturn S-IVB stage."
  },
  {
    "id": "NASA-M021",
    "program": "Apollo Program",
    "name": "Apollo 8",
    "launchYear": "1968",
    "type": "Human Spaceflight / Lunar Orbit",
    "status": "Completed",
    "objective": "First human flight to and orbit around the Moon (Borman, Lovell, Anders).",
    "operationalGuide": "Manual Protocol: Trans-Lunar Injection (TLI) burn; 10 lunar orbits; Lunar Orbit Insertion (LOI) and Trans-Earth Injection (TEI) engine maneuvers."
  },
  {
    "id": "NASA-M022",
    "program": "Apollo Program",
    "name": "Apollo 9",
    "launchYear": "1969",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "First crewed flight testing of complete Apollo spacecraft including Lunar Module.",
    "operationalGuide": "Manual Protocol: Active LM extraction, docking, descent/ascent engine firings, and crew transfer via docking tunnel in Earth orbit."
  },
  {
    "id": "NASA-M023",
    "program": "Apollo Program",
    "name": "Apollo 10",
    "launchYear": "1969",
    "type": "Human Spaceflight / Lunar Orbit",
    "status": "Completed",
    "objective": "Full dress rehearsal for lunar landing in lunar orbit.",
    "operationalGuide": "Manual Protocol: LM separation and descent to within 8.4 nautical miles of lunar surface; ascent stage staging and rendezvous with CSM."
  },
  {
    "id": "NASA-M024",
    "program": "Apollo Program",
    "name": "Apollo 11",
    "launchYear": "1969",
    "type": "Human Spaceflight / Lunar Landing",
    "status": "Completed",
    "objective": "First crewed lunar landing (Armstrong, Aldrin, Collins) at Sea of Tranquility.",
    "operationalGuide": "Manual Protocol: Semi-manual lunar descent override avoiding boulders; surface EVA (2 hrs 31 min); solar wind & moon rock collection; LM ascent and lunar orbit rendezvous."
  },
  {
    "id": "NASA-M025",
    "program": "Apollo Program",
    "name": "Apollo 12",
    "launchYear": "1969",
    "type": "Human Spaceflight / Lunar Landing",
    "status": "Completed",
    "objective": "Precision lunar landing at Ocean of Storms near Surveyor 3.",
    "operationalGuide": "Manual Protocol: Pinpoint landing radar navigation; retrieval of Surveyor 3 components; deployment of Apollo Lunar Surface Experiments Package (ALSEP)."
  },
  {
    "id": "NASA-M026",
    "program": "Apollo Program",
    "name": "Apollo 13",
    "launchYear": "1970",
    "type": "Human Spaceflight / Lunar Flyby Abort",
    "status": "Completed (Abort)",
    "objective": "Successful crew rescue following SM oxygen tank explosion (Lovell, Swigert, Haise).",
    "operationalGuide": "Manual Protocol: LM 'Aquarius' utilized as lifeboat; manual alignment burns using Sun/Earth terminator sight lines; free-return trajectory around Moon."
  },
  {
    "id": "NASA-M027",
    "program": "Apollo Program",
    "name": "Apollo 14",
    "launchYear": "1971",
    "type": "Human Spaceflight / Lunar Landing",
    "status": "Completed",
    "objective": "Lunar landing at Fra Mauro formation (Shepard, Mitchell, Roosa).",
    "operationalGuide": "Manual Protocol: Modular Equipment Transporter (MET) handcart deployment; active seismic experiments; surface geology sampling."
  },
  {
    "id": "NASA-M028",
    "program": "Apollo Program",
    "name": "Apollo 15",
    "launchYear": "1971",
    "type": "Human Spaceflight / Lunar Landing",
    "status": "Completed",
    "objective": "First J-series extended scientific mission at Hadley-Apennine.",
    "operationalGuide": "Manual Protocol: Lunar Roving Vehicle (LRV) operations; subsatellite deployment in lunar orbit; deep-core drilling."
  },
  {
    "id": "NASA-M029",
    "program": "Apollo Program",
    "name": "Apollo 16",
    "launchYear": "1972",
    "type": "Human Spaceflight / Lunar Landing",
    "status": "Completed",
    "objective": "Lunar highlands exploration at Descartes crater.",
    "operationalGuide": "Manual Protocol: LRV traverse across rugged terrain; UV camera/spectrograph astronomy; 95 kg regolith sample collection."
  },
  {
    "id": "NASA-M030",
    "program": "Apollo Program",
    "name": "Apollo 17",
    "launchYear": "1972",
    "type": "Human Spaceflight / Lunar Landing",
    "status": "Completed",
    "objective": "Final Apollo crewed lunar landing at Taurus-Littrow with scientist-astronaut Harrison Schmitt.",
    "operationalGuide": "Manual Protocol: 22-hour total EVA duration; LRV fender field repair; discovery of orange volcanic glass soil."
  },
  {
    "id": "NASA-M031",
    "program": "Skylab Program",
    "name": "Skylab 1, 2, 3, 4",
    "launchYear": "1973-1974",
    "type": "Human Spaceflight / Space Station",
    "status": "Completed",
    "objective": "America's first space station accommodating three long-duration crews.",
    "operationalGuide": "Manual Protocol: EVA thermal parasol deployment and solar array un-jamming repairs; solar astrophysics via Apollo Telescope Mount; 84-day record flight."
  },
  {
    "id": "NASA-M032",
    "program": "Apollo-Soyuz",
    "name": "Apollo-Soyuz Test Project",
    "launchYear": "1975",
    "type": "Human Spaceflight / Joint International",
    "status": "Completed",
    "objective": "First international crewed spaceflight docking between US Apollo and Soviet Soyuz.",
    "operationalGuide": "Manual Protocol: Universal Docking Module operations; dual-language joint science experiments; crew exchange and orbital handshake."
  },
  {
    "id": "NASA-M033",
    "program": "Space Shuttle Program",
    "name": "STS-1 (Columbia)",
    "launchYear": "1981",
    "type": "Human Spaceflight / Reusable Shuttle",
    "status": "Completed",
    "objective": "First flight of the Space Shuttle system piloted by Young and Crippen.",
    "operationalGuide": "Manual Protocol: Solid Rocket Booster (SRB) separation; thermal protection tile inspection; unpowered unpowered glide approach and lakebed landing at Edwards AFB."
  },
  {
    "id": "NASA-M034",
    "program": "Space Shuttle Program",
    "name": "STS-6 (Challenger)",
    "launchYear": "1983",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "Maiden flight of Challenger and first Shuttle Extravehicular Activity (EVA).",
    "operationalGuide": "Manual Protocol: Deployment of Tracking and Data Relay Satellite (TDRS-1); Extravehicular Mobility Unit (EMU) suit qualification spacewalk."
  },
  {
    "id": "NASA-M035",
    "program": "Space Shuttle Program",
    "name": "STS-7 (Challenger)",
    "launchYear": "1983",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Completed",
    "objective": "First spaceflight of an American woman (Sally Ride).",
    "operationalGuide": "Manual Protocol: Shuttle Remote Manipulator System (RMS) robot arm operations; deployment and retrieval of SPAS-01 satellite."
  },
  {
    "id": "NASA-M036",
    "program": "Space Shuttle Program",
    "name": "STS-41C (Challenger)",
    "launchYear": "1984",
    "type": "Human Spaceflight / Satellite Repair",
    "status": "Completed",
    "objective": "First in-orbit repair of a satellite (Solar Maximum Mission).",
    "operationalGuide": "Manual Protocol: Manned Maneuvering Unit (MMU) jetpack untethered spacewalk capture; payload bay servicing and redeployment."
  },
  {
    "id": "NASA-M037",
    "program": "Space Shuttle Program",
    "name": "STS-51L (Challenger)",
    "launchYear": "1986",
    "type": "Human Spaceflight / Low Earth Orbit",
    "status": "Tragic Failure",
    "objective": "Tragic loss of Challenger crew 73 seconds post-launch due to SRB O-ring seal failure.",
    "operationalGuide": "Manual Protocol: Launch destruction investigation leading to complete SRB joint redesign and two-year flight grounding."
  },
  {
    "id": "NASA-M038",
    "program": "Space Shuttle Program",
    "name": "STS-26 (Discovery)",
    "launchYear": "1988",
    "type": "Human Spaceflight / Return to Flight",
    "status": "Completed",
    "objective": "Post-Challenger return-to-flight safety validation mission.",
    "operationalGuide": "Manual Protocol: Launch escape pressure suit qualification; TDRS deployment; advanced flight control system testing."
  },
  {
    "id": "NASA-M039",
    "program": "Space Shuttle Program",
    "name": "STS-31 (Discovery)",
    "launchYear": "1990",
    "type": "Human Spaceflight / Space Observatory",
    "status": "Completed",
    "objective": "Deployment of the Hubble Space Telescope.",
    "operationalGuide": "Manual Protocol: RMS robot arm high-altitude release (612 km); solar array deployment monitoring; secondary payload operations."
  },
  {
    "id": "NASA-M040",
    "program": "Space Shuttle Program",
    "name": "STS-71 (Atlantis)",
    "launchYear": "1995",
    "type": "Human Spaceflight / Joint Shuttle-Mir",
    "status": "Completed",
    "objective": "First docking of Space Shuttle with Russian Space Station Mir.",
    "operationalGuide": "Manual Protocol: Precision orbital proximity operations and soft docking with Kristall module; Mir crew rotation exchange."
  },
  {
    "id": "NASA-M041",
    "program": "Space Shuttle Program",
    "name": "STS-88 (Endeavour)",
    "launchYear": "1998",
    "type": "Human Spaceflight / ISS Assembly",
    "status": "Completed",
    "objective": "First International Space Station assembly flight.",
    "operationalGuide": "Manual Protocol: Mating of Unity node with Russian Zarya module using RMS arm; 3 assembly EVAs connecting external cables and antennas."
  },
  {
    "id": "NASA-M042",
    "program": "Space Shuttle Program",
    "name": "STS-107 (Columbia)",
    "launchYear": "2003",
    "type": "Human Spaceflight / Microgravity Research",
    "status": "Tragic Failure",
    "objective": "Tragic loss of Columbia during reentry due to left-wing foam strike damage.",
    "operationalGuide": "Manual Protocol: 16-day microgravity science mission; foam impact investigation leading to mandatory boom sensor inspections on future flights."
  },
  {
    "id": "NASA-M043",
    "program": "Space Shuttle Program",
    "name": "STS-125 (Atlantis)",
    "launchYear": "2009",
    "type": "Human Spaceflight / Observatory Servicing",
    "status": "Completed",
    "objective": "Final servicing mission to the Hubble Space Telescope.",
    "operationalGuide": "Manual Protocol: 5 complex EVAs installing Wide Field Camera 3, Cosmic Origins Spectrograph, and replacing gyroscopes/batteries."
  },
  {
    "id": "NASA-M044",
    "program": "Space Shuttle Program",
    "name": "STS-135 (Atlantis)",
    "launchYear": "2011",
    "type": "Human Spaceflight / Program Finale",
    "status": "Completed",
    "objective": "135th and final flight of the Space Shuttle Program.",
    "operationalGuide": "Manual Protocol: Delivery of Multi-Purpose Logistics Module (MPLM) Raffaello to ISS; final shuttle landing and transition to commercial crew."
  },
  {
    "id": "NASA-M045",
    "program": "ISS Expeditions",
    "name": "International Space Station (Expedition 1 - Present)",
    "launchYear": "2000-Present",
    "type": "Human Spaceflight / Space Station",
    "status": "Active",
    "objective": "Continuous human research laboratory orbiting Earth since November 2000.",
    "operationalGuide": "Manual Protocol: Microgravity biological/physical experiments; station attitude control; spacewalk maintenance; commercial/international crew rotation."
  },
  {
    "id": "NASA-M046",
    "program": "Commercial Crew",
    "name": "SpaceX Demo-2 & Crew-1 to Crew-13",
    "launchYear": "2020-Present",
    "type": "Human Spaceflight / Commercial Transportation",
    "status": "Active",
    "objective": "US commercial crew launches transporting astronauts to ISS aboard Dragon.",
    "operationalGuide": "Manual Protocol: Autonomous Falcon 9 launch and Dragon docking; manual touch-screen control backup; soft-water splashdown recovery."
  },
  {
    "id": "NASA-M047",
    "program": "Artemis Program",
    "name": "Artemis I",
    "launchYear": "2022",
    "type": "Deep Space / Uncrewed Test",
    "status": "Completed",
    "objective": "Uncrewed test flight of Space Launch System (SLS) and Orion spacecraft around the Moon.",
    "operationalGuide": "Manual Protocol: SLS Block 1 core stage firing; Trans-Lunar Injection; distant retrograde lunar orbit entry (DRO); high-speed skip reentry heat shield test."
  },
  {
    "id": "NASA-M048",
    "program": "Artemis Program",
    "name": "Artemis II",
    "launchYear": "2026",
    "type": "Human Spaceflight / Lunar Flyby",
    "status": "Planned",
    "objective": "First crewed Artemis flight carrying 4 astronauts on a lunar free-return trajectory.",
    "operationalGuide": "Manual Protocol: Proximity operations demonstration in LEO; lunar flyby trajectory alignment; deep-space life support and communication verification."
  },
  {
    "id": "NASA-M049",
    "program": "Artemis Program",
    "name": "Artemis III",
    "launchYear": "2027",
    "type": "Human Spaceflight / Lunar Landing",
    "status": "Planned",
    "objective": "First crewed lunar south pole landing under Artemis.",
    "operationalGuide": "Manual Protocol: Orion docking with Human Landing System (HLS) in lunar orbit; descent to lunar South Pole; surface EVAs collecting polar water ice."
  },
  {
    "id": "NASA-M050",
    "program": "Robotic Lunar",
    "name": "Ranger & Surveyor Programs",
    "launchYear": "1961-1968",
    "type": "Robotic / Lunar Probes",
    "status": "Completed",
    "objective": "Pioneering impactor and soft-lander lunar surface exploration.",
    "operationalGuide": "Manual Protocol: High-speed crash imaging (Ranger); touchdown shock absorber telemetry and surface soil mechanics (Surveyor)."
  },
  {
    "id": "NASA-M051",
    "program": "Robotic Lunar",
    "name": "Lunar Reconnaissance Orbiter (LRO)",
    "launchYear": "2009-Present",
    "type": "Robotic / Lunar Orbiter",
    "status": "Active",
    "objective": "High-resolution mapping and resource identification of the Moon.",
    "operationalGuide": "Manual Protocol: Polar mapping orbit; narrow-angle camera imaging for 50cm surface resolution; laser altimetry for polar crater shade mapping."
  },
  {
    "id": "NASA-M052",
    "program": "Robotic Mars",
    "name": "Mariner 4, 9",
    "launchYear": "1964-1971",
    "type": "Robotic / Mars Flyby & Orbiter",
    "status": "Completed",
    "objective": "First successful Mars flyby (Mariner 4) and first spacecraft to orbit another planet (Mariner 9).",
    "operationalGuide": "Manual Protocol: TV camera digital tape recorder telemetry; orbital insertion burn firing; mapping major dust storms, volcanoes, and canyons."
  },
  {
    "id": "NASA-M053",
    "program": "Robotic Mars",
    "name": "Viking 1 & Viking 2",
    "launchYear": "1975-1976",
    "type": "Robotic / Mars Orbiter & Lander",
    "status": "Completed",
    "objective": "First successful soft landings and life-detection biology experiments on Mars.",
    "operationalGuide": "Manual Protocol: Aeroshell heat shield reentry, parachute deployment, terminal retro-rocket firing; automated soil arm scoop sampling."
  },
  {
    "id": "NASA-M054",
    "program": "Robotic Mars",
    "name": "Mars Pathfinder & Sojourner Rover",
    "launchYear": "1996",
    "type": "Robotic / Mars Lander & Rover",
    "status": "Completed",
    "objective": "First robotic Mars rover pathfinder testing airbag landing system.",
    "operationalGuide": "Manual Protocol: Direct atmospheric entry with deceleration airbags; ramp deployment; autonomous hazard avoidance rove navigation."
  },
  {
    "id": "NASA-M055",
    "program": "Robotic Mars",
    "name": "Mars Exploration Rovers (Spirit & Opportunity)",
    "launchYear": "2003",
    "type": "Robotic / Mars Rovers",
    "status": "Completed",
    "objective": "Geological exploration proving ancient surface liquid water on Mars.",
    "operationalGuide": "Manual Protocol: Airbag bouncing touchdown; solar array cleaning by dust devils; rock abrasion tool (RAT) grinding and Moessbauer spectrometer analysis."
  },
  {
    "id": "NASA-M056",
    "program": "Robotic Mars",
    "name": "Mars Science Laboratory (Curiosity Rover)",
    "launchYear": "2011-Present",
    "type": "Robotic / Mars Rover",
    "status": "Active",
    "objective": "Exploring Gale Crater to assess past habitability.",
    "operationalGuide": "Manual Protocol: Sky Crane powered descent landing system; SAM mass spectrometer sample analysis; nuclear RTG power management."
  },
  {
    "id": "NASA-M057",
    "program": "Robotic Mars",
    "name": "Mars 2020 (Perseverance & Ingenuity)",
    "launchYear": "2020-Present",
    "type": "Robotic / Mars Rover & Helicopter",
    "status": "Active",
    "objective": "Searching for signs of ancient biosignatures and first powered flight on another planet.",
    "operationalGuide": "Manual Protocol: Terrain-Relative Navigation landing; sample caching tube drill sealing; Ingenuity rotorcraft autonomous flight control."
  },
  {
    "id": "NASA-M058",
    "program": "Robotic Venus",
    "name": "Pioneer Venus & Magellan",
    "launchYear": "1978-1989",
    "type": "Robotic / Venus Probes",
    "status": "Completed",
    "objective": "Atmospheric probes and synthetic aperture radar mapping of Venus.",
    "operationalGuide": "Manual Protocol: High-temperature atmospheric probe drops; radar altimetry through dense cloud deck; aerobraking orbit shaping."
  },
  {
    "id": "NASA-M059",
    "program": "Robotic Mercury",
    "name": "MESSENGER",
    "launchYear": "2004-2015",
    "type": "Robotic / Mercury Orbiter",
    "status": "Completed",
    "objective": "First spacecraft to orbit Mercury.",
    "operationalGuide": "Manual Protocol: Complex gravity assists (1 Earth, 2 Venus, 3 Mercury); sunshade thermal management; orbital insertion burn."
  },
  {
    "id": "NASA-M060",
    "program": "Outer Planets",
    "name": "Pioneer 10 & 11",
    "launchYear": "1972-1973",
    "type": "Robotic / Planetary Flybys",
    "status": "Completed",
    "objective": "First flybys of Jupiter and Saturn and first probes to achieve solar escape velocity.",
    "operationalGuide": "Manual Protocol: Asteroid belt traversal; intense Jovian radiation belt measurement; spin-stabilized navigation."
  },
  {
    "id": "NASA-M061",
    "program": "Outer Planets",
    "name": "Voyager 1 & Voyager 2",
    "launchYear": "1977-Present",
    "type": "Robotic / Interstellar Probes",
    "status": "Active",
    "objective": "Grand Tour of Jupiter, Saturn, Uranus, Neptune, and exploration of interstellar space.",
    "operationalGuide": "Manual Protocol: Multi-planet planetary gravity assist maneuvers; Golden Record playback payload; interstellar plasma density measurement."
  },
  {
    "id": "NASA-M062",
    "program": "Outer Planets",
    "name": "Galileo",
    "launchYear": "1989-2003",
    "type": "Robotic / Jupiter Orbiter & Probe",
    "status": "Completed",
    "objective": "Detailed study of Jupiter and discovery of subsurface ocean on Europa.",
    "operationalGuide": "Manual Protocol: Descent probe release into Jovian atmosphere (160 km drop); high-gain antenna failure workaround via tape recorder; intentional impact into Jupiter."
  },
  {
    "id": "NASA-M063",
    "program": "Outer Planets",
    "name": "Cassini-Huygens",
    "launchYear": "1997-2017",
    "type": "Robotic / Saturn Orbiter & Titan Probe",
    "status": "Completed",
    "objective": "13-year exploration of Saturn, its rings, and landing Huygens on Titan.",
    "operationalGuide": "Manual Protocol: Huygens probe atmospheric entry and landing on Titan; icy plume flybys of Enceladus; 'Grand Finale' diving orbits between Saturn and rings."
  },
  {
    "id": "NASA-M064",
    "program": "Outer Planets",
    "name": "New Horizons",
    "launchYear": "2006-Present",
    "type": "Robotic / Pluto & Kuiper Belt",
    "status": "Active",
    "objective": "First flyby of Pluto and Kuiper Belt object Arrokoth.",
    "operationalGuide": "Manual Protocol: Hibernation flight mode; high-speed Pluto flyby (13,700 km); optical navigation to target Kuiper Belt objects."
  },
  {
    "id": "NASA-M065",
    "program": "Outer Planets",
    "name": "Juno & Europa Clipper",
    "launchYear": "2011-2024+",
    "type": "Robotic / Jovian System",
    "status": "Active",
    "objective": "Probing Jupiter's interior (Juno) and assessing habitability of moon Europa (Europa Clipper).",
    "operationalGuide": "Manual Protocol: Highly elliptical polar orbits minimizing radiation exposure; titanium radiation vault shielding; ice-penetrating radar scans."
  },
  {
    "id": "NASA-M066",
    "program": "Asteroid Exploration",
    "name": "NEAR Shoemaker, Stardust, Deep Impact",
    "launchYear": "1996-2005",
    "type": "Robotic / Sample Return & Impact",
    "status": "Completed",
    "objective": "Asteroid 433 Eros landing, comet Wild 2 dust sample return, and comet Tempel 1 impact.",
    "operationalGuide": "Manual Protocol: Precision asteroid orbit/landing; aerogel collection grid deployment; hypervelocity copper projectile impact navigation."
  },
  {
    "id": "NASA-M067",
    "program": "Asteroid Exploration",
    "name": "Dawn",
    "launchYear": "2007-2018",
    "type": "Robotic / Dwarf Planet Orbiter",
    "status": "Completed",
    "objective": "First spacecraft to orbit two extraterrestrial destinations (Vesta and Ceres).",
    "operationalGuide": "Manual Protocol: Xenon ion propulsion cruise; low-altitude mapping orbit transfers; surface mineralogy classification."
  },
  {
    "id": "NASA-M068",
    "program": "Asteroid Exploration",
    "name": "OSIRIS-REx / OSIRIS-APEX",
    "launchYear": "2016-Present",
    "type": "Robotic / Asteroid Sample Return",
    "status": "Active",
    "objective": "Asteroid Bennu sample collection and return to Earth in 2023.",
    "operationalGuide": "Manual Protocol: Touch-And-Go (TAG) nitrogen gas sample collection arm actuation; sample return capsule Earth reentry landing; extended mission to Apophis."
  },
  {
    "id": "NASA-M069",
    "program": "Asteroid Exploration",
    "name": "DART (Double Asteroid Redirection Test)",
    "launchYear": "2021-2022",
    "type": "Robotic / Planetary Defense",
    "status": "Completed",
    "objective": "First planetary defense kinetic impactor demonstration on asteroid Dimorphos.",
    "operationalGuide": "Manual Protocol: Autonomous Real-time Navigation (SMART Nav) impact guidance; hypervelocity collision at 6.6 km/s; orbital period change verification."
  },
  {
    "id": "NASA-M070",
    "program": "Heliophysics",
    "name": "SOHO, SDO, Parker Solar Probe",
    "launchYear": "1995-Present",
    "type": "Robotic / Solar Observatories",
    "status": "Active",
    "objective": "Continuous monitoring of solar flares, magnetic field, and flying into the Sun's corona.",
    "operationalGuide": "Manual Protocol: Carbon-composite heat shield thermal protection at 1,400°C; extreme ultraviolet solar imaging; coronal mass ejection warning systems."
  },
  {
    "id": "NASA-M071",
    "program": "Great Observatories",
    "name": "Hubble Space Telescope",
    "launchYear": "1990-Present",
    "type": "Robotic / Space Observatory",
    "status": "Active",
    "objective": "Revolutionary optical and UV astronomy observing deep universe.",
    "operationalGuide": "Manual Protocol: Fine Guidance Sensor pointing control (0.007 arcsec accuracy); low Earth orbit servicing interfaces; deep field multi-exposure exposures."
  },
  {
    "id": "NASA-M072",
    "program": "Great Observatories",
    "name": "Chandra & Spitzer Space Telescopes",
    "launchYear": "1999-2020",
    "type": "Robotic / X-ray & Infrared Observatories",
    "status": "Active / Completed",
    "objective": "High-energy X-ray and infrared cosmic imaging.",
    "operationalGuide": "Manual Protocol: Grazing incidence X-ray mirrors; liquid helium cryogenic cooling loop monitoring; exoplanet infrared light curve tracking."
  },
  {
    "id": "NASA-M073",
    "program": "Astrophysics",
    "name": "Kepler & TESS Exoplanet Telescopes",
    "launchYear": "2009-Present",
    "type": "Robotic / Exoplanet Hunters",
    "status": "Completed / Active",
    "objective": "Discovering thousands of exoplanets using the transit photometry method.",
    "operationalGuide": "Manual Protocol: Continuous wide-field star brightness monitoring; reaction wheel momentum dumping; sky sector survey stepping."
  },
  {
    "id": "NASA-M074",
    "program": "Great Observatories",
    "name": "James Webb Space Telescope (JWST)",
    "launchYear": "2021-Present",
    "type": "Robotic / Infrared Space Observatory",
    "status": "Active",
    "objective": "Premier deep-space infrared observatory stationed at Sun-Earth L2.",
    "operationalGuide": "Manual Protocol: Ariane 5 launch to L2; 5-layer sunshield automated deployment; 18-segment beryllium mirror hexagonal alignment to nanometer accuracy."
  },
  {
    "id": "NASA-M075",
    "program": "Earth Science",
    "name": "Landsat Program (Landsat 1 to 9)",
    "launchYear": "1972-Present",
    "type": "Robotic / Earth Remote Sensing",
    "status": "Active",
    "objective": "50+ year continuous satellite imagery record of Earth's surface.",
    "operationalGuide": "Manual Protocol: Sun-synchronous polar orbits; Operational Land Imager (OLI) multispectral band scanning; environmental land cover change tracking."
  },
  {
    "id": "NASA-M076",
    "program": "Earth Science",
    "name": "Terra, Aqua, Aura & NISAR",
    "launchYear": "1999-Present",
    "type": "Robotic / Earth Observing System",
    "status": "Active",
    "objective": "Comprehensive satellite monitoring of Earth's atmosphere, oceans, ice, and land.",
    "operationalGuide": "Manual Protocol: MODIS/AIRS Earth remote sensing suite; SAR dual-frequency radar interferometry; climate feedback data telemetry."
  }
];
