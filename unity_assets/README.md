# Jr_AstroCamp 3D — Unity Setup Guide (Free Fire / PUBG TPS Mode)

This folder contains the complete, production-ready C# gameplay scripts for building the high-fidelity 3D TPS game in **Unity 6 / 2022 LTS (URP)**.

---

## 📁 C# Script Roster

All scripts reside in [`unity_assets/Scripts/`](./Scripts/):
1. **[`AstronautController.cs`](./Scripts/AstronautController.cs)**:
   - Third-person character movement aligned to camera yaw.
   - Low-gravity physics (configurable for Moon `1.62 m/s²` or Mars `3.72 m/s²`).
   - Sprint and stamina system.
   - Jetpack flight thrusters with vertical thrust boost, particle flares, and audio.
2. **[`ThirdPersonCombatController.cs`](./Scripts/ThirdPersonCombatController.cs)**:
   - Right-click Aim Down Sights (ADS) camera zoom.
   - Hitscan mining laser raycasting with `LineRenderer` neon beam.
   - Impact spark particle instancing.
   - Hitmarker (`✕`) flash on target hit.
3. **[`MineableCrystal.cs`](./Scripts/MineableCrystal.cs)**:
   - Interactive mineral clusters (Helium-3, Water Ice, Titanium Regolith).
   - Health, dynamic emissive damage flash, audio feedback, and fracture explosion.
4. **[`TacticalSpaceHUD.cs`](./Scripts/TacticalSpaceHUD.cs)**:
   - Free Fire 360° top sliding compass ribbon.
   - Health, Armor, Jetpack Fuel, and Science points telemetry.
   - Action / Loot feed notifications (`💎 Mined Helium-3 (+25 Science)`).

---

## 🛠️ Step-by-Step Setup in Unity

### 1. Create the Project
1. Open **Unity Hub**.
2. Click **New Project** $\rightarrow$ select **3D (URP)** (Universal Render Pipeline).
3. Name it `Jr_AstroCamp_3D` and create.

### 2. Import Character & Camera Assets (Free)
1. In Unity, go to **Window $\rightarrow$ Package Manager**.
2. Install **Cinemachine** and **Input System**.
3. Open the **Unity Asset Store** and download:
   - **Starter Assets - Third Person Character Controller** (Official Unity package with pre-rigged humanoid model, idle/walk/sprint animations, and over-the-shoulder follow camera).
   - Import into your project.

### 3. Add the Scripts
1. Drag the `unity_assets/Scripts/` folder into your Unity project's `Assets/` window.
2. Attach `AstronautController.cs` and `ThirdPersonCombatController.cs` to your player character GameObject.
3. Place a few 3D cubes/crystals on the terrain and attach `MineableCrystal.cs`.
4. Hit **Play**! You now have a true 60+ FPS, high-fidelity Free Fire-style 3D TPS space game!
