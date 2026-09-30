# 🛰️ NASA Data & Resource Attribution

**Jr_AstroCamp · Team Mysterio**  
**NASA International Space Apps Challenge 2026**

This document details the NASA open datasets, mission telemetry bounds, historical archives, and scientific models integrated into **Jr_AstroCamp**.

---

## 1. NASA Mission Catalog & Historical Datasets
* **Mission Dataset:** 76 historical NASA missions compiled in [`nasa_missions_catalog.csv`](file:///Users/md.mehedihasan/Documents/NASAC-2026/nasa_missions_catalog.csv) and [`nasaMissionCatalog.ts`](file:///Users/md.mehedihasan/Documents/NASAC-2026/src/data/nasaMissionCatalog.ts).
* **Programs Covered:**
  - **Project Mercury:** Freedom 7, Liberty Bell 7, Friendship 7, Aurora 7, Sigma 7, Faith 7.
  - **Project Gemini:** Gemini 3 through Gemini 12 (Orbital rendezvous, EVAs, docking).
  - **Apollo Program:** Apollo 1 through Apollo 17 (Saturn V launch trajectories, lunar descent, CSM docking).
  - **Skylab & Apollo-Soyuz:** Space station solar observations, international docking.
  - **Space Transportation System (Shuttle):** STS-1, STS-7, STS-31 (Hubble deployment), STS-51-L, STS-107, STS-135.
  - **Artemis Program:** Artemis I, Artemis II (Orion deep space trajectory), Artemis III lunar south pole landing.
  - **Mars Exploration:** Viking 1 & 2, Pathfinder / Sojourner, Spirit, Opportunity, Curiosity, Perseverance / Ingenuity.
  - **Lagrange & Deep Space Observatories:** Hubble Space Telescope, James Webb Space Telescope (JWST), Nancy Grace Roman, Parker Solar Probe, New Horizons, Voyager 1 & 2.

---

## 2. Scientific Constants & Planetary Physics Models
The environmental parameters and physical constants used across the Pygame and Three.js engines are grounded in published NASA Glenn Research Center and JPL planetary ephemerides:
* **Gravity Models:** Earth ($9.81 \text{ m/s}^2$), Moon ($1.62 \text{ m/s}^2$), Mars ($3.72 \text{ m/s}^2$), Titan ($1.35 \text{ m/s}^2$), Europa ($1.315 \text{ m/s}^2$).
* **Atmospheric Drag & Scale Heights:** NASA Earth Atmosphere Model (US Standard Atmosphere 1976) and Mars atmospheric density profiles.
* **Thermal & Radiation Environmental Telemetry:** Lunar day/night surface temperature ranges ($-130^\circ\text{C}$ to $+120^\circ\text{C}$), Solar Particle Event (SPE) fluxes, and Galactic Cosmic Radiation (GCR) dosimetric constants (sourced from NASA LRO CRaTER and MSL RAD data).

---

## 3. NASA Media & Archival Assets
* **Audio & Communications:** Quindar tones, Houston CapCom transcripts, and launch cadence audio cues synthesized based on Apollo and Shuttle historical air-to-ground voice recordings.
* **Mission Imagery & Diagrams:** Public-domain mission diagrams, patch designs, and technical schematics from NASA Technical Reports Server (NTRS) and NASA Image and Video Library (`images.nasa.gov`).

---

## 4. Open-Source Data Flow Architecture
```
NASA NTRS & Open APIs (data.nasa.gov / api.nasa.gov)
          │
          ▼
nasa_missions_catalog.csv (76 Historical Records)
     ┌────┴─────────────────────────────┐
     ▼                                  ▼
Python/Pygame 60 FPS Sim         React 19 Web Companion
• Trajectory & Staging Math       • Outpost Life Support Sim
• Real-time Telemetry Loop        • Digital Mission Notebooks
• Debrief & Causal Autopsy        • Multimodal Audio & Comics
```
