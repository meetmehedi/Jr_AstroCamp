// ============================================================
// ThreeMissionSimulator — High-Fidelity 3D WebGL Flight Simulator
// Built with Three.js for NASA Space Apps Challenge 2026
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import {
  Rocket,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { MissionGameConfig, LaunchParams, DockingParams, LunarLandingParams } from '../game/missionGameData';
import { soundFx } from '../utils/audioEffects';

interface ThreeMissionSimulatorProps {
  mission: MissionGameConfig;
  onSuccess: (score: number) => void;
  onFailure: (reason: string) => void;
  onExit: () => void;
}

type CameraMode = 'chase' | 'pad' | 'cockpit';

export const ThreeMissionSimulator: React.FC<ThreeMissionSimulatorProps> = ({
  mission,
  onSuccess,
  onFailure,
  onExit,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>('chase');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Telemetry HUD States
  const [telemetry, setTelemetry] = useState({
    altitudeKm: 0,
    velocityKms: 0,
    throttle: 0,
    propellantPct: 100,
    pitchDeg: 90,
    timeRemaining: 120,
    statusText: 'FLIGHT COMPUTER ONLINE · READY FOR LAUNCH',
    statusColor: '#38bdf8',
  });

  // Simulation Refs
  const simStateRef = useRef({
    altitudeKm: 0,
    velocityKms: 0,
    throttle: 0,
    propellant: 100,
    pitchDeg: 90,
    stage: 1,
    timeRemaining: (mission.params as LaunchParams).timeWindowSec || 120,
    statusText: 'FLIGHT COMPUTER ONLINE · READY FOR LAUNCH',
    statusColor: '#38bdf8',
    isFinished: false,
    keys: {} as Record<string, boolean>,
    distanceM: (mission.params as DockingParams).approachDistanceM || 500,
    samples: 0,
    telescopeFocus: 20,
  });

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      simStateRef.current.keys[e.key.toLowerCase()] = true;
      simStateRef.current.keys[e.code] = true;

      // Staging on Space
      if (e.code === 'Space' && mission.gameType === 'launch') {
        const state = simStateRef.current;
        if (state.stage === 1 && (mission.params as LaunchParams).hasStageSeparation && state.altitudeKm > 25) {
          state.stage = 2;
          state.statusText = 'STAGE 1 SEPARATION CONFIRMED · S-II IGNITION';
          state.statusColor = '#f59e0b';
          soundFx.playRadioChirp();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      simStateRef.current.keys[e.key.toLowerCase()] = false;
      simStateRef.current.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [mission]);

  // Main Three.js Scene Setup & Simulation Loop
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 960;
    const height = container.clientHeight || 600;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.FogExp2(0x030712, 0.0003);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 10000);
    camera.position.set(0, 10, 45);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(200, 400, 150);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 1000;
    scene.add(sunLight);

    // Earth Curve in Background (Visible in Ascent/Orbit)
    const earthRadius = 6371;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.8,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.set(0, -earthRadius, 0);
    scene.add(earthMesh);

    // Atmospheric Rayleigh Scattering Glow Shield
    const atmoGeo = new THREE.SphereGeometry(earthRadius + 80, 64, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.25,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    atmoMesh.position.set(0, -earthRadius, 0);
    scene.add(atmoMesh);

    // Stars Skybox
    const starCount = 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 3000 + Math.random() * 2000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPos[i] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // ─────────────────────────────────────────────────────────
    // 3. BUILD 3D MISSION OBJECTS BASED ON GAME TYPE
    // ─────────────────────────────────────────────────────────
    const playerVehicle = new THREE.Group();
    let targetObject = new THREE.Group();
    let stage1Mesh: THREE.Group | null = null;
    let stage2Mesh: THREE.Group | null = null;
    let exhaustFlame: THREE.Mesh | null = null;
    const groundPadGroup = new THREE.Group();

    // Setup Mission Environments
    if (mission.gameType === 'launch') {
      // 3.1 LAUNCH PAD 39A
      const padGeo = new THREE.CylinderGeometry(20, 24, 4, 32);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
      const padMesh = new THREE.Mesh(padGeo, padMat);
      padMesh.position.y = 2;
      padMesh.receiveShadow = true;
      groundPadGroup.add(padMesh);

      // Gantry Tower
      const towerGeo = new THREE.BoxGeometry(4, 50, 4);
      const towerMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, wireframe: true });
      const towerMesh = new THREE.Mesh(towerGeo, towerMat);
      towerMesh.position.set(-12, 27, 0);
      groundPadGroup.add(towerMesh);

      // Swing arm
      const armGeo = new THREE.BoxGeometry(10, 1.5, 1.5);
      const armMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
      const armMesh = new THREE.Mesh(armGeo, armMat);
      armMesh.position.set(-6, 38, 0);
      groundPadGroup.add(armMesh);

      scene.add(groundPadGroup);

      // 3.2 DETAILED MULTI-STAGE 3D ROCKET
      // Stage 1
      stage1Mesh = new THREE.Group();
      const s1BodyGeo = new THREE.CylinderGeometry(2, 2, 18, 32);
      const s1BodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4, metalness: 0.3 });
      const s1Body = new THREE.Mesh(s1BodyGeo, s1BodyMat);
      s1Body.position.y = 9;
      s1Body.castShadow = true;
      stage1Mesh.add(s1Body);

      // Stage 1 Black Bands & Decals
      const bandGeo = new THREE.CylinderGeometry(2.02, 2.02, 3, 32);
      const bandMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
      const bandMesh = new THREE.Mesh(bandGeo, bandMat);
      bandMesh.position.y = 12;
      stage1Mesh.add(bandMesh);

      // 4 Aerodynamic Fins
      for (let f = 0; f < 4; f++) {
        const finGeo = new THREE.BoxGeometry(0.2, 3, 2);
        const finMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
        const fin = new THREE.Mesh(finGeo, finMat);
        const angle = (f * Math.PI) / 2;
        fin.position.set(Math.cos(angle) * 2.6, 2, Math.sin(angle) * 2.6);
        fin.rotation.y = angle;
        stage1Mesh.add(fin);
      }

      // Engine Nozzles Cluster
      for (let e = 0; e < 5; e++) {
        const nozGeo = new THREE.ConeGeometry(0.5, 1.5, 16);
        const nozMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
        const noz = new THREE.Mesh(nozGeo, nozMat);
        noz.rotation.x = Math.PI;
        if (e === 0) {
          noz.position.set(0, -0.2, 0);
        } else {
          const a = (e * Math.PI) / 2;
          noz.position.set(Math.cos(a) * 1.1, -0.2, Math.sin(a) * 1.1);
        }
        stage1Mesh.add(noz);
      }
      playerVehicle.add(stage1Mesh);

      // Stage 2 (Upper Stage + Capsule)
      stage2Mesh = new THREE.Group();
      stage2Mesh.position.y = 18;
      const s2BodyGeo = new THREE.CylinderGeometry(1.9, 1.9, 12, 32);
      const s2BodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const s2Body = new THREE.Mesh(s2BodyGeo, s2BodyMat);
      s2Body.position.y = 6;
      s2Body.castShadow = true;
      stage2Mesh.add(s2Body);

      // Spacecraft Nosecone / Command Capsule
      const capGeo = new THREE.ConeGeometry(1.9, 5, 32);
      const capMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.5 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 14.5;
      stage2Mesh.add(cap);

      // Launch Escape Tower (LES)
      const lesGeo = new THREE.CylinderGeometry(0.15, 0.15, 6, 8);
      const lesMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
      const les = new THREE.Mesh(lesGeo, lesMat);
      les.position.y = 19;
      stage2Mesh.add(les);

      playerVehicle.add(stage2Mesh);
      playerVehicle.position.set(0, 4, 0);
      scene.add(playerVehicle);

      // Dynamic 3D Volumetric Exhaust Plume
      const flameGeo = new THREE.ConeGeometry(2.4, 18, 24);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
      });
      exhaustFlame = new THREE.Mesh(flameGeo, flameMat);
      exhaustFlame.position.y = -9;
      exhaustFlame.visible = false;
      playerVehicle.add(exhaustFlame);
    } else if (mission.gameType === 'lunar_landing') {
      // 3.3 LUNAR SURFACE & APOLLO LANDER
      const moonTerrainGeo = new THREE.PlaneGeometry(600, 600, 64, 64);
      const moonTerrainMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.95,
        metalness: 0.05,
      });
      textureLoader.load('/assets/moon_texture.jpg', (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(8, 8);
        moonTerrainMat.map = tex;
        moonTerrainMat.needsUpdate = true;
      });
      const moonTerrain = new THREE.Mesh(moonTerrainGeo, moonTerrainMat);
      moonTerrain.rotation.x = -Math.PI / 2;
      moonTerrain.receiveShadow = true;
      scene.add(moonTerrain);

      // Landing Beacon Target Ring
      const ringGeo = new THREE.RingGeometry(8, 10, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.2;
      scene.add(ring);

      // Apollo Lunar Module (LEM) 3D Model
      const lemDescentGeo = new THREE.CylinderGeometry(3.5, 4, 2.5, 8);
      const lemDescentMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.8 });
      const lemDescent = new THREE.Mesh(lemDescentGeo, lemDescentMat);
      lemDescent.position.y = 2.5;
      lemDescent.castShadow = true;
      playerVehicle.add(lemDescent);

      // 4 Landing Legs
      for (let l = 0; l < 4; l++) {
        const legGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.5, 8);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6 });
        const leg = new THREE.Mesh(legGeo, legMat);
        const a = (l * Math.PI) / 2 + Math.PI / 4;
        leg.position.set(Math.cos(a) * 3.8, 1.2, Math.sin(a) * 3.8);
        leg.rotation.z = Math.PI / 6;
        leg.rotation.y = a;
        playerVehicle.add(leg);

        const footGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16);
        const foot = new THREE.Mesh(footGeo, lemDescentMat);
        foot.position.set(Math.cos(a) * 4.8, 0.1, Math.sin(a) * 4.8);
        playerVehicle.add(foot);
      }

      // Silver Ascent Stage Cockpit
      const lemAscentGeo = new THREE.DodecahedronGeometry(2.4);
      const lemAscentMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.7 });
      const lemAscent = new THREE.Mesh(lemAscentGeo, lemAscentMat);
      lemAscent.position.y = 4.8;
      lemAscent.castShadow = true;
      playerVehicle.add(lemAscent);

      playerVehicle.position.set(0, 100, 0);
      scene.add(playerVehicle);

      // Thruster Flame
      const landerFlameGeo = new THREE.ConeGeometry(1.2, 5, 16);
      const landerFlameMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
      exhaustFlame = new THREE.Mesh(landerFlameGeo, landerFlameMat);
      exhaustFlame.position.y = 0.5;
      exhaustFlame.visible = false;
      playerVehicle.add(exhaustFlame);
    } else if (mission.gameType === 'docking') {
      // 3.4 INTERNATIONAL SPACE STATION (ISS) / GATEWAY DOCKING TARGET
      targetObject = new THREE.Group();

      const trussGeo = new THREE.BoxGeometry(40, 1.5, 1.5);
      const trussMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
      const truss = new THREE.Mesh(trussGeo, trussMat);
      targetObject.add(truss);

      for (let s = -1; s <= 1; s += 2) {
        const wingGeo = new THREE.BoxGeometry(16, 0.1, 7);
        const wingMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.1 });
        const wing = new THREE.Mesh(wingGeo, wingMat);
        wing.position.set(s * 15, 0, 0);
        targetObject.add(wing);
      }

      const modGeo = new THREE.CylinderGeometry(2.5, 2.5, 16, 24);
      const modMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.5, roughness: 0.3 });
      const mod = new THREE.Mesh(modGeo, modMat);
      mod.rotation.x = Math.PI / 2;
      targetObject.add(mod);

      const portGeo = new THREE.TorusGeometry(1.4, 0.25, 16, 32);
      const portMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const port = new THREE.Mesh(portGeo, portMat);
      port.position.set(0, 0, 8.5);
      targetObject.add(port);

      targetObject.position.set(0, 0, -60);
      scene.add(targetObject);

      const dragonGeo = new THREE.ConeGeometry(2, 4.5, 24);
      const dragonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.4, roughness: 0.2 });
      const dragon = new THREE.Mesh(dragonGeo, dragonMat);
      dragon.rotation.x = Math.PI / 2;
      playerVehicle.add(dragon);

      playerVehicle.position.set(0, 0, 40);
      scene.add(playerVehicle);
    } else if (mission.gameType === 'rover') {
      // 3.5 MARS ROVER & JEZERO CRATER RED TERRAIN
      const marsGeo = new THREE.PlaneGeometry(600, 600, 64, 64);
      const marsMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 });
      textureLoader.load('/assets/mars_texture.jpg', (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(10, 10);
        marsMat.map = tex;
        marsMat.needsUpdate = true;
      });
      const marsTerrain = new THREE.Mesh(marsGeo, marsMat);
      marsTerrain.rotation.x = -Math.PI / 2;
      scene.add(marsTerrain);

      scene.fog = new THREE.FogExp2(0x9a3412, 0.002);

      const chassisGeo = new THREE.BoxGeometry(3, 1.2, 4.5);
      const chassisMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4, metalness: 0.3 });
      const chassis = new THREE.Mesh(chassisGeo, chassisMat);
      chassis.position.y = 1.8;
      playerVehicle.add(chassis);

      for (let w = 0; w < 6; w++) {
        const side = w % 2 === 0 ? -1 : 1;
        const row = Math.floor(w / 2) - 1;
        const wheelGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.5, 24);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(side * 2.2, 0.65, row * 1.8);
        playerVehicle.add(wheel);
      }

      const mastGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.5, 8);
      const mastMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.set(0.6, 3.2, 1.4);
      playerVehicle.add(mast);

      const mastHeadGeo = new THREE.BoxGeometry(0.8, 0.5, 0.6);
      const mastHeadMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const mastHead = new THREE.Mesh(mastHeadGeo, mastHeadMat);
      mastHead.position.set(0.6, 4.5, 1.4);
      playerVehicle.add(mastHead);

      playerVehicle.position.set(0, 0, 0);
      scene.add(playerVehicle);

      for (let s = 0; s < 3; s++) {
        const rockGeo = new THREE.DodecahedronGeometry(1.5 + Math.random() * 0.8);
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.95 });
        const rock = new THREE.Mesh(rockGeo, rockMat);
        const a = (s * Math.PI * 2) / 3 + 0.5;
        const dist = 30 + s * 25;
        rock.position.set(Math.cos(a) * dist, 1, Math.sin(a) * dist);
        scene.add(rock);

        const light = new THREE.PointLight(0x38bdf8, 2, 20);
        light.position.set(rock.position.x, 3, rock.position.z);
        scene.add(light);
      }
    } else {
      // 3.6 JAMES WEBB SPACE TELESCOPE / DEEP SPACE PROBE
      const mirrorGroup = new THREE.Group();
      for (let m = 0; m < 18; m++) {
        const hexGeo = new THREE.CircleGeometry(1.2, 6);
        const hexMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.98, roughness: 0.05 });
        const hex = new THREE.Mesh(hexGeo, hexMat);
        const ring = m < 6 ? 1 : 2;
        const angle = (m * Math.PI) / (m < 6 ? 3 : 6);
        hex.position.set(Math.cos(angle) * (ring * 1.8), Math.sin(angle) * (ring * 1.8), 0);
        mirrorGroup.add(hex);
      }
      playerVehicle.add(mirrorGroup);

      const shieldGeo = new THREE.PlaneGeometry(16, 10);
      const shieldMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1, side: THREE.DoubleSide });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      shield.position.z = -2;
      playerVehicle.add(shield);

      scene.add(playerVehicle);
    }

    // ─────────────────────────────────────────────────────────
    // 4. ANIMATION & PHYSICS SIMULATION LOOP
    // ─────────────────────────────────────────────────────────
    let lastTime = performance.now();
    let animationFrameId: number;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const state = simStateRef.current;

      // Dynamic Planetary Earth & Atmospheric Cloud Rotation (visible from ascent & orbit)
      if (earthMesh) {
        earthMesh.rotation.y += dt * 0.015 + (state.velocityKms > 0 ? state.velocityKms * 0.002 * dt : 0);
      }
      if (atmoMesh) {
        atmoMesh.rotation.y += dt * 0.018 + (state.velocityKms > 0 ? state.velocityKms * 0.0025 * dt : 0);
      }

      if (state.isFinished) {
        renderer.render(scene, camera);
        return;
      }

      state.timeRemaining = Math.max(0, state.timeRemaining - dt);

      // --- 4.1 LAUNCH SIMULATION PHYSICS ---
      if (mission.gameType === 'launch') {
        const p = mission.params as LaunchParams;

        // Throttle Input
        if (state.keys['w'] || state.keys['arrowup']) {
          state.throttle = Math.min(1.0, state.throttle + dt * 1.5);
          if (state.altitudeKm < 1) {
            state.statusText = 'LIFTOFF CONFIRMED! TOWER CLEARED // CLIMB NOMINAL';
            state.statusColor = '#10b981';
          }
        } else if (state.keys['s'] || state.keys['arrowdown']) {
          state.throttle = Math.max(0.0, state.throttle - dt * 1.5);
        }

        // Pitch Gimbal Input
        if (state.keys['a'] || state.keys['arrowleft']) {
          state.pitchDeg = Math.min(90, state.pitchDeg + dt * 25);
        } else if (state.keys['d'] || state.keys['arrowright']) {
          state.pitchDeg = Math.max(10, state.pitchDeg - dt * 25);
        }

        // Propellant consumption & thrust
        if (state.throttle > 0.01 && state.propellant > 0) {
          const burnRate = 0.85 * (state.stage === 1 ? 1.0 : 0.6);
          state.propellant = Math.max(0, state.propellant - state.throttle * burnRate * dt);

          const thrust = state.throttle * (state.stage === 1 ? 95 : 65);
          const rad = (state.pitchDeg * Math.PI) / 180;
          const vertThrust = thrust * Math.sin(rad);
          const horizThrust = thrust * Math.cos(rad);

          state.velocityKms += (horizThrust * 0.08 + (vertThrust - 9.81) * 0.04) * dt;
          state.velocityKms = Math.max(0, state.velocityKms);

          state.altitudeKm += (vertThrust * 0.06 + state.velocityKms * 0.8) * dt;

          if (exhaustFlame) {
            exhaustFlame.visible = true;
            exhaustFlame.scale.set(
              1 + Math.random() * 0.2,
              (state.throttle * 1.5) * (1 + Math.random() * 0.3),
              1 + Math.random() * 0.2
            );
          }
        } else {
          state.throttle = 0;
          if (exhaustFlame) exhaustFlame.visible = false;
        }

        // Rocket 3D Position & Attitude
        const radRoll = ((90 - state.pitchDeg) * Math.PI) / 180;
        playerVehicle.rotation.z = -radRoll;
        playerVehicle.position.y = 4 + Math.min(state.altitudeKm * 25, 400);

        // Ground pad moves away realistically
        groundPadGroup.position.y = -Math.min(state.altitudeKm * 25, 1000);

        // Telemetry Callouts
        if (state.altitudeKm > 15 && state.altitudeKm < 30 && !state.statusText.includes('MAX-Q')) {
          state.statusText = 'TELEMETRY: MAX-Q TRANSIT · DYNAMIC PRESSURE NOMINAL';
          state.statusColor = '#f59e0b';
        } else if (state.altitudeKm >= 100 && !state.statusText.includes('KARMAN')) {
          state.statusText = 'TELEMETRY: KARMAN LINE TRANSIT · REACHED SPACE';
          state.statusColor = '#10b981';
        }

        // Win / Loss check
        if (state.altitudeKm >= p.targetAltitudeKm && state.velocityKms >= p.targetVelocityKms * 0.85) {
          state.isFinished = true;
          soundFx.playRadioChirp();
          confetti({ particleCount: 150, spread: 90 });
          onSuccess(1000);
        } else if (state.timeRemaining <= 0 || (state.propellant <= 0 && state.altitudeKm < p.targetAltitudeKm * 0.7)) {
          state.isFinished = true;
          soundFx.playAlarm();
          onFailure(`Trajectory profile missed. Final Altitude: ${state.altitudeKm.toFixed(1)} km`);
        }
      }

      // --- 4.2 LUNAR LANDING PHYSICS ---
      else if (mission.gameType === 'lunar_landing') {
        const p = mission.params as LunarLandingParams;
        if (state.keys['w'] || state.keys['arrowup'] || state.keys['space']) {
          state.throttle = Math.min(1.0, state.throttle + dt * 2);
          state.propellant = Math.max(0, state.propellant - dt * 2.2);
          state.velocityKms -= 3.8 * dt;
          if (exhaustFlame) exhaustFlame.visible = true;
        } else {
          state.throttle = Math.max(0.0, state.throttle - dt * 2);
          state.velocityKms += p.gravity * 0.8 * dt;
          if (exhaustFlame) exhaustFlame.visible = false;
        }

        // Lateral RCS
        if (state.keys['a'] || state.keys['arrowleft']) {
          playerVehicle.position.x -= 15 * dt;
          playerVehicle.rotation.z = 0.15;
        } else if (state.keys['d'] || state.keys['arrowright']) {
          playerVehicle.position.x += 15 * dt;
          playerVehicle.rotation.z = -0.15;
        } else {
          playerVehicle.rotation.z = 0;
        }

        playerVehicle.position.y = Math.max(0, playerVehicle.position.y - state.velocityKms * dt * 2);
        state.altitudeKm = playerVehicle.position.y;

        if (playerVehicle.position.y <= 0.1) {
          state.isFinished = true;
          if (Math.abs(state.velocityKms) < 4.5 && Math.abs(playerVehicle.position.x) < 15) {
            soundFx.playRadioChirp();
            confetti({ particleCount: 160, spread: 80 });
            onSuccess(980);
          } else {
            soundFx.playAlarm();
            onFailure(`Touchdown hard landing: descent speed ${Math.abs(state.velocityKms).toFixed(1)} m/s exceeded landing gear limit.`);
          }
        }
      }

      // --- 4.3 DOCKING PHYSICS ---
      else if (mission.gameType === 'docking') {
        if (state.keys['w'] || state.keys['arrowup']) playerVehicle.position.z -= 12 * dt;
        if (state.keys['s'] || state.keys['arrowdown']) playerVehicle.position.z += 12 * dt;
        if (state.keys['a'] || state.keys['arrowleft']) playerVehicle.position.x -= 10 * dt;
        if (state.keys['d'] || state.keys['arrowright']) playerVehicle.position.x += 10 * dt;

        state.distanceM = Math.max(0, playerVehicle.position.z - (targetObject.position.z + 8.5));
        const alignmentPct = Math.max(0, 100 - Math.abs(playerVehicle.position.x) * 10);

        if (state.distanceM <= 0.5) {
          state.isFinished = true;
          if (alignmentPct > 75) {
            soundFx.playRadioChirp();
            confetti({ particleCount: 140, spread: 70 });
            onSuccess(950);
          } else {
            soundFx.playAlarm();
            onFailure('Docking latch missed: alignment deviation outside IDA capture cone.');
          }
        }
      }

      // --- 4.4 MARS ROVER EXPEDITION ---
      else if (mission.gameType === 'rover') {
        if (state.keys['w'] || state.keys['arrowup']) {
          playerVehicle.translateZ(-14 * dt);
        }
        if (state.keys['s'] || state.keys['arrowdown']) {
          playerVehicle.translateZ(8 * dt);
        }
        if (state.keys['a'] || state.keys['arrowleft']) {
          playerVehicle.rotation.y += 1.8 * dt;
        }
        if (state.keys['d'] || state.keys['arrowright']) {
          playerVehicle.rotation.y -= 1.8 * dt;
        }

        // Proximity to science samples
        state.samples = Math.min(3, Math.floor(playerVehicle.position.length() / 25));
        if (state.samples >= 3) {
          state.isFinished = true;
          soundFx.playRadioChirp();
          confetti({ particleCount: 150, spread: 85 });
          onSuccess(900);
        }
      }

      // --- 4.5 TELESCOPE & DEEP SPACE ---
      else {
        playerVehicle.rotation.y += 0.2 * dt;
        if (state.keys['w'] || state.keys['arrowup']) state.telescopeFocus = Math.min(100, state.telescopeFocus + dt * 25);
        if (state.keys['s'] || state.keys['arrowdown']) state.telescopeFocus = Math.max(0, state.telescopeFocus - dt * 25);

        if (state.telescopeFocus >= 95) {
          state.isFinished = true;
          soundFx.playRadioChirp();
          confetti({ particleCount: 150, spread: 80 });
          onSuccess(920);
        }
      }

      // Update Camera Position based on Mode
      if (cameraMode === 'chase') {
        camera.position.lerp(playerVehicle.position.clone().add(new THREE.Vector3(0, 10, 36)), 0.1);
        camera.lookAt(playerVehicle.position.clone().add(new THREE.Vector3(0, 4, 0)));
      } else if (cameraMode === 'pad') {
        camera.position.set(0, 2, 45);
        camera.lookAt(playerVehicle.position);
      } else if (cameraMode === 'cockpit') {
        camera.position.copy(playerVehicle.position).add(new THREE.Vector3(0, 12, 1.5));
        camera.lookAt(playerVehicle.position.clone().add(new THREE.Vector3(0, 30, 0)));
      }

      // Sync React state
      setTelemetry({
        altitudeKm: state.altitudeKm,
        velocityKms: state.velocityKms,
        throttle: state.throttle,
        propellantPct: state.propellant,
        pitchDeg: state.pitchDeg,
        timeRemaining: state.timeRemaining,
        statusText: state.statusText,
        statusColor: state.statusColor,
      });

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mission, cameraMode]);

  return (
    <div className="relative w-full h-[620px] bg-slate-950 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl flex flex-col select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-crosshair" />

      {/* TOP NASA GLASS COCKPIT TELEMETRY BAR */}
      <div className="absolute top-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-cyan-500/30 text-xs font-mono shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Rocket className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="font-bold text-slate-100 tracking-wide flex items-center gap-2">
              <span>{mission.missionName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                3D SIMULATOR
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              PROGRAM: {mission.programName} // {mission.year}
            </div>
          </div>
        </div>

        {/* Dynamic Telemetry Stats */}
        <div className="flex items-center gap-6 text-slate-200">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Altitude</div>
            <div className="text-sm font-bold text-cyan-400">{telemetry.altitudeKm.toFixed(1)} km</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Velocity</div>
            <div className="text-sm font-bold text-emerald-400">{telemetry.velocityKms.toFixed(2)} km/s</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Propellant</div>
            <div className={`text-sm font-bold ${telemetry.propellantPct < 25 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
              {telemetry.propellantPct.toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Timeline</div>
            <div className="text-sm font-bold text-slate-100">{telemetry.timeRemaining.toFixed(1)}s</div>
          </div>
        </div>

        {/* Camera Selector & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950/80 p-1 rounded-lg border border-slate-700">
            {(['chase', 'pad', 'cockpit'] as CameraMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setCameraMode(mode)}
                className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded transition-colors ${
                  cameraMode === mode ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Toggle Audio"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* CENTER CALLOUT / STATUS BANNER */}
      <div className="absolute top-18 left-4 z-20 max-w-md bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-cyan-500/30 text-xs font-mono">
        <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-0.5">Avionics Flight Advisory</div>
        <div className="text-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: telemetry.statusColor }} />
          <span>{telemetry.statusText}</span>
        </div>
      </div>

      {/* BOTTOM CONTROL & KEYBOARD GUIDANCE HUD */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between gap-4 bg-slate-900/85 backdrop-blur-md px-4 py-3 rounded-xl border border-cyan-500/30 text-xs font-mono shadow-lg">
        {/* Throttle Gauge */}
        <div className="flex items-center gap-3">
          <div className="w-28 bg-slate-950 h-5 rounded overflow-hidden border border-slate-700 relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-75"
              style={{ width: `${telemetry.throttle * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-100">
              THRUST {Math.round(telemetry.throttle * 100)}%
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            PITCH: <span className="text-cyan-300 font-bold">{telemetry.pitchDeg.toFixed(0)}°</span>
          </div>
        </div>

        {/* Flight Keys Helper */}
        <div className="flex items-center gap-3 text-slate-300 text-[11px]">
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-cyan-400 font-bold">W / S</span>
          <span>Throttle Up/Down</span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-cyan-400 font-bold">A / D</span>
          <span>Gimbal Turn</span>
          <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-amber-400 font-bold">SPACE</span>
          <span>Stage Separation</span>
        </div>

        {/* Exit / Abort Button */}
        <button
          onClick={onExit}
          className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors"
        >
          ABORT MISSION
        </button>
      </div>
    </div>
  );
};
