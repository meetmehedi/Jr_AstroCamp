import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import type { ResourceState, OutpostModules, ChoiceOption } from '../types/game';
import type { NasaMission } from '../data/nasaMissions';
import { soundFx } from '../utils/audioEffects';
import { OutpostMap } from './OutpostMap';

interface Outpost3DViewProps {
  currentSol: number;
  modules: OutpostModules;
  resources: ResourceState;
  activeEventId?: string;
  isShieldActive?: boolean;
  mission?: NasaMission;
  // Among Us-style: task choices injected from game state
  taskChoices?: ChoiceOption[];
  onSelectChoice?: (choice: ChoiceOption) => void;
  activeEventTitle?: string;
}

// ─── TASK ZONE DEFINITIONS ───────────────────────────────────────────────────
interface TaskZone {
  id: string;
  label: string;
  icon: string;
  color: string;
  position: THREE.Vector3;
  radius: number;
}

const TASK_ZONES: TaskZone[] = [
  { id: 'habitat',   label: 'Habitat Core',     icon: '🏠', color: '#38bdf8', position: new THREE.Vector3(0, 0, 0),    radius: 8 },
  { id: 'solar',     label: 'Solar Array',      icon: '⚡', color: '#fbbf24', position: new THREE.Vector3(-15, 0, -10), radius: 7 },
  { id: 'reactor',   label: 'Kilopower Reactor',icon: '☢️', color: '#f97316', position: new THREE.Vector3(-18, 0, 14),  radius: 7 },
  { id: 'rover',     label: 'Rover Garage',     icon: '🚜', color: '#10b981', position: new THREE.Vector3(18, 0, 12),   radius: 7 },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROCEDURAL PHOTOREALISTIC TEXTURE GENERATORS
// ─────────────────────────────────────────────────────────────────────────────

function createLunarRegolithTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#3f4756';
  ctx.fillRect(0, 0, 1024, 1024);

  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 55;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise + 4));
  }
  ctx.putImageData(imgData, 0, 0);

  for (let c = 0; c < 160; c++) {
    const cx = Math.random() * 1024;
    const cy = Math.random() * 1024;
    const r = 2 + Math.random() * 22;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, '#111827');
    grad.addColorStop(0.65, '#1f2937');
    grad.addColorStop(0.88, '#94a3b8');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Circular rover wheel tread path
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.lineWidth = 5;
  ctx.setLineDash([3, 5]);
  ctx.beginPath();
  ctx.arc(512, 512, 340, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

function createGoldFoilTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#fbbf24');
  grad.addColorStop(0.25, '#d97706');
  grad.addColorStop(0.5, '#fef08a');
  grad.addColorStop(0.75, '#b45309');
  grad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 90; i++) {
    ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(120, 53, 15, 0.45)';
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    const sx = Math.random() * 512;
    const sy = Math.random() * 512;
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + (Math.random() - 0.5) * 90, sy + (Math.random() - 0.5) * 90);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

function createSolarCellTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 512, 512);

  const cellSize = 32;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
  ctx.lineWidth = 1;

  for (let x = 2; x < 512; x += cellSize) {
    for (let y = 2; y < 512; y += cellSize) {
      ctx.fillStyle = '#111827';
      ctx.fillRect(x, y, cellSize - 3, cellSize - 3);

      const shimmer = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
      shimmer.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      shimmer.addColorStop(0.5, 'rgba(79, 70, 229, 0.2)');
      shimmer.addColorStop(1, 'transparent');
      ctx.fillStyle = shimmer;
      ctx.fillRect(x, y, cellSize - 3, cellSize - 3);

      ctx.strokeRect(x, y, cellSize - 3, cellSize - 3);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const ocean = ctx.createLinearGradient(0, 0, 0, 512);
  ocean.addColorStop(0, '#0a192f');
  ocean.addColorStop(0.5, '#1e3a8a');
  ocean.addColorStop(1, '#0a192f');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = '#059669';
  ctx.beginPath();
  ctx.ellipse(280, 180, 95, 65, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(340, 330, 60, 95, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.ellipse(680, 160, 160, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.ellipse(560, 270, 75, 90, 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1024, 32);
  ctx.fillRect(0, 480, 1024, 32);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for (let i = 0; i < 45; i++) {
    const cx = Math.random() * 1024;
    const cy = 60 + Math.random() * 390;
    const rw = 50 + Math.random() * 110;
    const rh = 12 + Math.random() * 30;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rw, rh, (Math.random() - 0.5) * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// ─────────────────────────────────────────────────────────────────────────────
function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const Outpost3DView: React.FC<Outpost3DViewProps> = ({
  currentSol,
  modules,
  resources,
  activeEventId,
  isShieldActive = false,
  mission,
  taskChoices = [],
  onSelectChoice,
  activeEventTitle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Play Modes: TPS_ASTRONAUT (PUBG Player), ROVER (Vehicle), ORBIT (Cinematic Flyby), EARTHRISE
  const [cameraMode, setCameraMode] = useState<'TPS_ASTRONAUT' | 'ROVER' | 'ORBIT' | 'EARTHRISE'>('TPS_ASTRONAUT');
  const [isSprinting, setIsSprinting] = useState(false);
  const [isHeadlampOn, setIsHeadlampOn] = useState(true);
  const [interactiveTarget, setInteractiveTarget] = useState<string | null>(null);
  const [scannedMessage, setScannedMessage] = useState<string | null>(null);

  // ── AMONG US TASK SYSTEM STATE ──
  const [nearbyZone, setNearbyZone] = useState<TaskZone | null>(null);       // zone player is currently near
  const [activeTaskZone, setActiveTaskZone] = useState<TaskZone | null>(null); // opened task panel
  const [completedZones, setCompletedZones] = useState<Set<string>>(new Set()); // zones that have been used
  const lastZoneCheckRef = useRef<string | null>(null);

  // Joystick state for touch/drag control
  const joystickRef = useRef<{ active: boolean; dx: number; dy: number }>({ active: false, dx: 0, dy: 0 });
  const [joystickThumbPos, setJoystickThumbPos] = useState({ x: 0, y: 0 });
  const [webglError, setWebglError] = useState(() => !checkWebGLSupport());
  const [stamina, setStamina] = useState(100);
  const [compassDeg, setCompassDeg] = useState(0);

  // Driveable Rover physics state
  const roverPosRef = useRef(new THREE.Vector3(18, 0.6, 12));
  const roverAngleRef = useRef(0);
  const roverSpeedRef = useRef(0);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const roverRef = useRef<THREE.Group | null>(null);
  const astronautRef = useRef<THREE.Group | null>(null);
  const headlampRef = useRef<THREE.SpotLight | null>(null);
  const solarPanelsRef = useRef<THREE.Group | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | THREE.Group | null>(null);

  // Player physics state
  const playerPosRef = useRef(new THREE.Vector3(0, 0.4, 12));
  const playerVelRef = useRef(new THREE.Vector3(0, 0, 0));
  const playerAngleRef = useRef(0);
  const isGroundedRef = useRef(true);

  // Camera third-person orbit angles
  const cameraYawRef = useRef(0);
  const cameraPitchRef = useRef(0.25);
  const isMouseDownRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Keystrokes state
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // Limbs animation references
  const leftLegRef = useRef<THREE.Group | null>(null);
  const rightLegRef = useRef<THREE.Group | null>(null);
  const leftArmRef = useRef<THREE.Group | null>(null);
  const rightArmRef = useRef<THREE.Group | null>(null);

  const isNight = currentSol >= 16 && currentSol < 28;
  const isSolarStorm = activeEventId === 'sol-12-solar-flare';

  // Heightmap calculation function for realistic crater rim surface
  const getTerrainHeight = useCallback((x: number, z: number) => {
    const dist = Math.sqrt(x * x + z * z);
    let y = Math.sin(x * 0.12) * Math.cos(z * 0.12) * 1.2;
    if (dist > 16 && dist < 40) {
      y += Math.sin(((dist - 16) / 24) * Math.PI) * 3.4;
    }
    const c1 = Math.exp(-((x - 14) ** 2 + (z + 12) ** 2) / 30) * -2.4;
    const c2 = Math.exp(-((x + 18) ** 2 + (z - 16) ** 2) / 40) * -2.8;
    return y + c1 + c2;
  }, []);

  // Keyboard Event Listeners (WASD, Space, Shift, F, E)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs/modals
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;

      keysRef.current[e.code] = true;
      if (e.key) keysRef.current[e.key.toLowerCase()] = true;

      // Space: Jump
      if (e.code === 'Space' || e.key === ' ') {
        if (isGroundedRef.current) {
          playerVelRef.current.y = 5.2; // floaty lunar leap
          isGroundedRef.current = false;
          soundFx.playThruster();
        }
      }

      // Shift: Sprint
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'Shift') {
        setIsSprinting(true);
      }

      // F: Headlamp toggle
      if (e.code === 'KeyF' || e.key === 'f' || e.key === 'F') {
        setIsHeadlampOn((prev) => {
          const next = !prev;
          if (headlampRef.current) headlampRef.current.intensity = next ? 5.0 : 0;
          soundFx.playClick(900);
          return next;
        });
      }

      // E: Interact
      if (e.code === 'KeyE' || e.key === 'e' || e.key === 'E') {
        triggerInteraction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
      if (e.key) keysRef.current[e.key.toLowerCase()] = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'Shift') {
        setIsSprinting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // ── AMONG US TASK INTERACTION HANDLER ──
  const triggerInteraction = useCallback(() => {
    const p = playerPosRef.current;

    // Find closest task zone
    let closest: TaskZone | null = null;
    let closestDist = Infinity;
    for (const zone of TASK_ZONES) {
      const dist = p.distanceTo(zone.position);
      if (dist < zone.radius && dist < closestDist) {
        closest = zone;
        closestDist = dist;
      }
    }

    if (closest) {
      // If we have task choices → open Among Us task panel
      if (taskChoices.length > 0 && onSelectChoice) {
        soundFx.playScan();
        setActiveTaskZone(closest);
      } else {
        // Fallback: show telemetry scan
        soundFx.playScan();
        const msgs: Record<string, string> = {
          habitat: 'HABITAT CORE & ECLSS: Nominal 98% O2 · Pressure 101.3 kPa · 4 Crew Cabins Active',
          solar:   'VSAT SOLAR TOWER: 28 kW Generation · Sun Elevation 1.8° · Tracking Engaged',
          reactor: 'KILOPOWER NUCLEAR STIRLING: Core Temp 920 K · Heat Pipes Stable · 40 kW Baseline',
          rover:   'ARTEMIS ROVER SEV: Battery 94% · Range 45 km · Rocker-Bogie Suspension Calibrated',
        };
        setScannedMessage(msgs[closest.id] || 'MODULE SCAN COMPLETE');
        setTimeout(() => setScannedMessage(null), 5000);
      }
    }
  }, [taskChoices, onSelectChoice]);

  // Handle task choice selection (Among Us complete-task)
  const handleTaskChoiceSelect = useCallback((choice: ChoiceOption) => {
    if (!onSelectChoice) return;
    soundFx.playShieldHum();
    if (activeTaskZone) {
      setCompletedZones(prev => new Set([...prev, activeTaskZone.id]));
    }
    setActiveTaskZone(null);
    onSelectChoice(choice);
  }, [onSelectChoice, activeTaskZone]);

  // 3D Scene Initialization
  useEffect(() => {
    if (webglError || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 440;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x02040a);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 3, 17);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn('WebGL context creation failed in Outpost3DView, falling back to 2D view:', err);
      setWebglError(true);
      return;
    }
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.replaceChildren(renderer.domElement);

    // Textures
    const regolithTex = createLunarRegolithTexture();
    const goldFoilTex = createGoldFoilTexture();
    const solarCellTex = createSolarCellTexture();
    const earthTex = createEarthTexture();

    // Lighting (Shackleton low-angle sun)
    const ambientLight = new THREE.AmbientLight(isNight ? 0x0f172a : 0x1e293b, isNight ? 0.35 : 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(isNight ? 0x38bdf8 : 0xfffbeb, isNight ? 0.4 : 3.0);
    sunLight.position.set(65, 7, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 160;
    const d = 45;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    const baseFlood = new THREE.PointLight(resources.power < 25 ? 0xf59e0b : 0x38bdf8, 2.5, 45);
    baseFlood.position.set(0, 10, 0);
    scene.add(baseFlood);

    // Terrain
    const terrainGeo = new THREE.PlaneGeometry(120, 120, 96, 96);
    terrainGeo.rotateX(-Math.PI / 2);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, getTerrainHeight(x, z));
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      map: regolithTex,
      roughness: 0.96,
      metalness: 0.12,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Boulders
    const rockGeo = new THREE.DodecahedronGeometry(0.6, 1);
    const rockMat = new THREE.MeshStandardMaterial({ map: regolithTex, roughness: 0.98 });
    for (let i = 0; i < 45; i++) {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      const angle = Math.random() * Math.PI * 2;
      const r = 8 + Math.random() * 36;
      const rx = Math.cos(angle) * r;
      const rz = Math.sin(angle) * r;
      rock.position.set(rx, getTerrainHeight(rx, rz) + 0.3, rz);
      const s = 0.4 + Math.random() * 1.4;
      rock.scale.set(s, s * (0.6 + Math.random() * 0.7), s);
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rock.castShadow = true;
      rock.receiveShadow = true;
      scene.add(rock);
    }

    // Stars
    const starCount = 3000;
    const starGeo = new THREE.BufferGeometry();
    const starCoords = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 320;
      starCoords[i] = dist * Math.sin(phi) * Math.cos(theta);
      starCoords[i + 1] = Math.abs(dist * Math.cos(phi)) + 6;
      starCoords[i + 2] = dist * Math.sin(phi) * Math.sin(theta);
      const rand = Math.random();
      starColors[i] = rand > 0.8 ? 0.65 : 1.0;
      starColors[i + 1] = rand > 0.8 ? 0.82 : rand > 0.4 ? 0.96 : 0.75;
      starColors[i + 2] = rand > 0.8 ? 1.0 : rand > 0.4 ? 0.88 : 0.45;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 1.4, vertexColors: true, transparent: true, opacity: 0.9 })));

    // Earth in the sky
    const earthGroup = new THREE.Group();
    earthGroup.position.set(-60, 36, -80);
    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(9, 48, 48), new THREE.MeshStandardMaterial({
      map: earthTex, roughness: 0.5, metalness: 0.15, emissive: 0x1d4ed8, emissiveIntensity: 0.35,
    }));
    earthGroup.add(earthMesh);
    const haloMesh = new THREE.Mesh(new THREE.SphereGeometry(9.8, 48, 48), new THREE.MeshBasicMaterial({
      color: 0x38bdf8, transparent: true, opacity: 0.32, side: THREE.BackSide,
    }));
    earthMesh.add(haloMesh);
    scene.add(earthGroup);
    earthMeshRef.current = earthMesh;

    // ── 🧑‍🚀 PLAYER ASTRONAUT 3D CHARACTER (PUBG Mobile Player) ──
    const astronaut = new THREE.Group();
    astronaut.position.copy(playerPosRef.current);
    astronautRef.current = astronaut;

    // Torso / Chest
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.2 });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.45), torsoMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    astronaut.add(torso);

    // PLSS Backpack (Life Support & Thrusters)
    const plssMat = new THREE.MeshStandardMaterial({ map: goldFoilTex, roughness: 0.3, metalness: 0.8 });
    const plss = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 0.32), plssMat);
    plss.position.set(0, 1.18, -0.32);
    plss.castShadow = true;
    astronaut.add(plss);

    // Status LED on PLSS
    const plssLed = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    plssLed.position.set(0.18, 1.45, -0.48);
    astronaut.add(plssLed);

    // Helmet with Golden Visor
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 16), helmetMat);
    helmet.position.y = 1.75;
    helmet.castShadow = true;
    astronaut.add(helmet);

    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24, roughness: 0.1, metalness: 0.95, emissive: 0xd97706, emissiveIntensity: 0.2,
    });
    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12, 0, Math.PI, 0, Math.PI * 0.7), visorMat);
    visor.rotation.y = -Math.PI / 2;
    visor.position.set(0, 1.75, 0.12);
    astronaut.add(visor);

    // High-Intensity Headlamp Spotlight (PUBG Flashlight)
    const headlamp = new THREE.SpotLight(0xffffff, 5.0, 30, Math.PI / 5, 0.3);
    headlamp.position.set(0, 1.85, 0.35);
    headlamp.target.position.set(0, 1.0, 15);
    astronaut.add(headlamp);
    astronaut.add(headlamp.target);
    headlampRef.current = headlamp;

    // Articulated Legs for walking animation
    const legGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.75, 12);
    const bootGeo = new THREE.BoxGeometry(0.24, 0.18, 0.35);

    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.2, 0.75, 0);
    const leftLeg = new THREE.Mesh(legGeo, torsoMat);
    leftLeg.position.y = -0.35;
    leftLeg.castShadow = true;
    leftLegGroup.add(leftLeg);
    const leftBoot = new THREE.Mesh(bootGeo, new THREE.MeshStandardMaterial({ color: 0x334155 }));
    leftBoot.position.set(0, -0.7, 0.06);
    leftBoot.castShadow = true;
    leftLegGroup.add(leftBoot);
    astronaut.add(leftLegGroup);
    leftLegRef.current = leftLegGroup;

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.2, 0.75, 0);
    const rightLeg = new THREE.Mesh(legGeo, torsoMat);
    rightLeg.position.y = -0.35;
    rightLeg.castShadow = true;
    rightLegGroup.add(rightLeg);
    const rightBoot = new THREE.Mesh(bootGeo, new THREE.MeshStandardMaterial({ color: 0x334155 }));
    rightBoot.position.set(0, -0.7, 0.06);
    rightBoot.castShadow = true;
    rightLegGroup.add(rightBoot);
    astronaut.add(rightLegGroup);
    rightLegRef.current = rightLegGroup;

    // Articulated Arms
    const armGeo = new THREE.CylinderGeometry(0.1, 0.11, 0.65, 10);
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.45, 1.4, 0);
    const leftArm = new THREE.Mesh(armGeo, torsoMat);
    leftArm.position.y = -0.3;
    leftArm.castShadow = true;
    leftArmGroup.add(leftArm);
    astronaut.add(leftArmGroup);
    leftArmRef.current = leftArmGroup;

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.45, 1.4, 0);
    const rightArm = new THREE.Mesh(armGeo, torsoMat);
    rightArm.position.y = -0.3;
    rightArm.castShadow = true;
    rightArmGroup.add(rightArm);
    astronaut.add(rightArmGroup);
    rightArmRef.current = rightArmGroup;

    scene.add(astronaut);

    // ── BASE MODULES (Habitat, VSAT, Kilopower, Rover) ──
    // Habitat Hub
    const habGroup = new THREE.Group();
    habGroup.position.set(0, 0, 0);
    const lowerStage = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.8, 3.2, 24), new THREE.MeshStandardMaterial({
      map: goldFoilTex, metalness: 0.85, roughness: 0.3,
    }));
    lowerStage.position.y = 1.6;
    lowerStage.castShadow = true;
    habGroup.add(lowerStage);

    const upperDome = new THREE.Mesh(new THREE.SphereGeometry(5.0, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), new THREE.MeshStandardMaterial({
      color: 0xf8fafc, metalness: 0.3, roughness: 0.25,
    }));
    upperDome.position.y = 3.2;
    upperDome.castShadow = true;
    habGroup.add(upperDome);

    const cupola = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 1.0, 16), new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8, emissive: 0xf59e0b, emissiveIntensity: 0.85, roughness: 0.1, transmission: 0.6, transparent: true, opacity: 0.9,
    }));
    cupola.position.y = 8.1;
    habGroup.add(cupola);

    const airlock = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 3.6, 16), new THREE.MeshStandardMaterial({
      color: 0x64748b, metalness: 0.7, roughness: 0.35,
    }));
    airlock.geometry.rotateZ(Math.PI / 2);
    airlock.position.set(5.2, 1.5, 0);
    airlock.castShadow = true;
    habGroup.add(airlock);
    scene.add(habGroup);

    // VSAT Solar Tower
    const solarGroup = new THREE.Group();
    solarGroup.position.set(-15, 0, -10);
    solarPanelsRef.current = solarGroup;
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 11, 8), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85 }));
    mast.position.y = 5.5;
    mast.castShadow = true;
    solarGroup.add(mast);

    const wingGeo = new THREE.BoxGeometry(7.5, 3.5, 0.15);
    const wingMat = new THREE.MeshStandardMaterial({ map: solarCellTex, metalness: 0.9, roughness: 0.2 });
    const wingBackMat = new THREE.MeshStandardMaterial({ map: goldFoilTex, metalness: 0.8, roughness: 0.4 });
    const leftWing = new THREE.Mesh(wingGeo, [wingMat, wingMat, wingMat, wingMat, wingMat, wingBackMat]);
    leftWing.position.set(-4.2, 9.5, 0);
    leftWing.castShadow = true;
    solarGroup.add(leftWing);
    const rightWing = new THREE.Mesh(wingGeo, [wingMat, wingMat, wingMat, wingMat, wingMat, wingBackMat]);
    rightWing.position.set(4.2, 9.5, 0);
    rightWing.castShadow = true;
    solarGroup.add(rightWing);
    scene.add(solarGroup);

    // Kilopower Nuclear Reactor
    const kiloGroup = new THREE.Group();
    kiloGroup.position.set(-18, 0, 14);
    const berm = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.8, 1.8, 16), new THREE.MeshStandardMaterial({ map: regolithTex, roughness: 0.95 }));
    berm.position.y = 0.9;
    kiloGroup.add(berm);
    const reactorCore = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, 2.5, 16), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 }));
    reactorCore.position.y = 2.8;
    reactorCore.castShadow = true;
    kiloGroup.add(reactorCore);
    scene.add(kiloGroup);

    // Rover SEV
    const roverGroup = new THREE.Group();
    roverGroup.position.set(18, 0.6, 12);
    roverRef.current = roverGroup;
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.1, 1.8), new THREE.MeshStandardMaterial({ map: goldFoilTex, metalness: 0.85, roughness: 0.3 }));
    chassis.position.y = 0.9;
    chassis.castShadow = true;
    roverGroup.add(chassis);
    scene.add(roverGroup);

    // ── ANIMATION & PUBG TPS PLAYER PHYSICS LOOP ──
    let animationFrameId: number;
    let lastTime = performance.now();
    let walkCycle = 0;
    let footstepCooldown = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Earth rotation
      if (earthMeshRef.current) earthMeshRef.current.rotation.y += delta * 0.04;

      // VSAT subtle sun oscillation
      if (solarPanelsRef.current && !isNight) solarPanelsRef.current.rotation.y = Math.sin(now * 0.0001) * 0.15;

      // 1. CALCULATE PLAYER MOVEMENT VECTOR FROM KEYS OR JOYSTICK
      const keys = keysRef.current;
      let moveX = 0;
      let moveZ = 0;

      if (keys['KeyW'] || keys['ArrowUp']) moveZ -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) moveZ += 1;
      if (keys['KeyA'] || keys['ArrowLeft']) moveX -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) moveX += 1;

      // Add Virtual Joystick input
      if (joystickRef.current.active) {
        moveX += joystickRef.current.dx;
        moveZ += joystickRef.current.dy;
      }

      const isMoving = Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05;
      const speed = isSprinting ? 9.5 : 5.0;

      // Stamina & Compass Update
      if (isSprinting && isMoving) {
        setStamina((prev) => {
          const next = Math.max(0, prev - delta * 24);
          if (next <= 0) setIsSprinting(false);
          return next;
        });
      } else {
        setStamina((prev) => Math.min(100, prev + delta * 16));
      }

      const currentCompass = Math.round(((cameraYawRef.current * 180 / Math.PI) % 360 + 360) % 360);
      setCompassDeg(currentCompass);

      if (isMoving) {
        // Normalize direction relative to camera yaw
        const inputAngle = Math.atan2(moveX, moveZ);
        const targetWorldAngle = cameraYawRef.current + inputAngle;

        playerAngleRef.current = targetWorldAngle;
        if (astronautRef.current) {
          astronautRef.current.rotation.y = playerAngleRef.current + Math.PI;
        }

        const vx = Math.sin(targetWorldAngle) * speed;
        const vz = Math.cos(targetWorldAngle) * speed;

        playerPosRef.current.x += vx * delta;
        playerPosRef.current.z += vz * delta;

        // Limb swing animation
        walkCycle += delta * (isSprinting ? 16 : 9);
        const swing = Math.sin(walkCycle) * 0.55;

        if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
        if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.8;
        if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.8;

        // Footstep audio
        footstepCooldown -= delta;
        if (footstepCooldown <= 0 && isGroundedRef.current) {
          soundFx.playFootstep();
          footstepCooldown = isSprinting ? 0.28 : 0.45;
        }
      } else {
        // Reset idle limbs
        if (leftLegRef.current) leftLegRef.current.rotation.x *= 0.85;
        if (rightLegRef.current) rightLegRef.current.rotation.x *= 0.85;
        if (leftArmRef.current) leftArmRef.current.rotation.x *= 0.85;
        if (rightArmRef.current) rightArmRef.current.rotation.x *= 0.85;
      }

      // 2. LUNAR GRAVITY & GROUND COLLISION
      const groundY = getTerrainHeight(playerPosRef.current.x, playerPosRef.current.z);
      playerVelRef.current.y -= 9.8 * 0.25 * delta; // 1/4th Earth gravity for high lunar leap
      playerPosRef.current.y += playerVelRef.current.y * delta;

      if (playerPosRef.current.y <= groundY) {
        playerPosRef.current.y = groundY;
        playerVelRef.current.y = 0;
        isGroundedRef.current = true;
      }

      if (astronautRef.current) {
        astronautRef.current.position.copy(playerPosRef.current);
      }

      // 3. AMONG US-STYLE ZONE PROXIMITY DETECTION
      let closestZone: TaskZone | null = null;
      let closestZoneDist = Infinity;
      for (const zone of TASK_ZONES) {
        const d = playerPosRef.current.distanceTo(zone.position);
        if (d < zone.radius && d < closestZoneDist) {
          closestZone = zone;
          closestZoneDist = d;
        }
      }

      // Only call setState when zone changes (avoid re-render spam)
      const newZoneId = closestZone?.id ?? null;
      if (newZoneId !== lastZoneCheckRef.current) {
        lastZoneCheckRef.current = newZoneId;
        setNearbyZone(closestZone);
        setInteractiveTarget(closestZone ? closestZone.label : null);
      }

      // 4. CAMERA MODES (TPS PUBG OVER-THE-SHOULDER & DRIVEABLE ROVER)
      if (cameraMode === 'TPS_ASTRONAUT') {
        const p = playerPosRef.current;
        const camDist = 5.2;
        const shoulderOffset = 0.7; // slight over-the-right-shoulder offset

        const camX = p.x - Math.sin(cameraYawRef.current) * camDist + Math.cos(cameraYawRef.current) * shoulderOffset;
        const camZ = p.z - Math.cos(cameraYawRef.current) * camDist - Math.sin(cameraYawRef.current) * shoulderOffset;
        const camY = p.y + 1.8 + Math.sin(cameraPitchRef.current) * 2.2;

        camera.position.lerp(new THREE.Vector3(camX, Math.max(camY, groundY + 0.8), camZ), 0.12);

        // Look slightly above astronaut's head at crosshair target
        const lookTarget = new THREE.Vector3(
          p.x + Math.sin(cameraYawRef.current) * 12,
          p.y + 1.6 - Math.sin(cameraPitchRef.current) * 4,
          p.z + Math.cos(cameraYawRef.current) * 12
        );
        camera.lookAt(lookTarget);
      } else if (cameraMode === 'ROVER') {
        // Driveable Rover Mechanics
        let rSteer = 0;
        let rThrottle = 0;
        if (keys['KeyW'] || keys['ArrowUp']) rThrottle += 1;
        if (keys['KeyS'] || keys['ArrowDown']) rThrottle -= 1;
        if (keys['KeyA'] || keys['ArrowLeft']) rSteer -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) rSteer += 1;

        if (joystickRef.current.active) {
          rSteer += joystickRef.current.dx;
          rThrottle -= joystickRef.current.dy;
        }

        roverAngleRef.current += rSteer * 1.8 * delta;
        const maxSpd = 14.0;
        roverSpeedRef.current += rThrottle * 16.0 * delta;
        roverSpeedRef.current *= (1.0 - delta * 1.5);
        roverSpeedRef.current = Math.max(-maxSpd * 0.5, Math.min(maxSpd, roverSpeedRef.current));

        const rPos = roverPosRef.current;
        rPos.x += Math.sin(roverAngleRef.current) * roverSpeedRef.current * delta;
        rPos.z += Math.cos(roverAngleRef.current) * roverSpeedRef.current * delta;
        rPos.y = getTerrainHeight(rPos.x, rPos.z) + 0.6;

        if (roverRef.current) {
          roverRef.current.position.copy(rPos);
          roverRef.current.rotation.y = roverAngleRef.current + Math.PI;
        }

        // Chase Cam behind Rover
        const rCamDist = 9.0;
        const rCamX = rPos.x - Math.sin(roverAngleRef.current) * rCamDist;
        const rCamZ = rPos.z - Math.cos(roverAngleRef.current) * rCamDist;
        const rCamY = rPos.y + 3.8;
        camera.position.lerp(new THREE.Vector3(rCamX, Math.max(rCamY, getTerrainHeight(rCamX, rCamZ) + 1.2), rCamZ), 0.15);
        camera.lookAt(new THREE.Vector3(rPos.x, rPos.y + 1.2, rPos.z));
      } else if (cameraMode === 'ORBIT') {
        cameraYawRef.current += delta * 0.08;
        camera.position.set(Math.cos(cameraYawRef.current) * 40, 18, Math.sin(cameraYawRef.current) * 40);
        camera.lookAt(0, 2.5, 0);
      } else if (cameraMode === 'EARTHRISE') {
        camera.position.lerp(new THREE.Vector3(30, 4, 35), 0.05);
        camera.lookAt(-60, 36, -80);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 440;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [currentSol, isNight, isSolarStorm, isShieldActive, resources.power, resources.oxygen, getTerrainHeight]);

  // Mouse Drag Camera Look (PUBG Look controls)
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    cameraYawRef.current -= dx * 0.006;
    cameraPitchRef.current = Math.max(-0.6, Math.min(0.8, cameraPitchRef.current + dy * 0.005));
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  // Universal Pointer, Mouse & Touch Virtual Joystick Handlers
  const updateJoystickPos = (clientX: number, clientY: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxR = 34;

    let dx = (clientX - centerX) / maxR;
    let dy = (clientY - centerY) / maxR;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }

    joystickRef.current.dx = dx;
    joystickRef.current.dy = dy;
    setJoystickThumbPos({ x: dx * maxR, y: dy * maxR });
  };

  const handleJoystickPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    joystickRef.current.active = true;
    updateJoystickPos(e.clientX, e.clientY, e.currentTarget);
  };

  const handleJoystickPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!joystickRef.current.active) return;
    updateJoystickPos(e.clientX, e.clientY, e.currentTarget);
  };

  const handleJoystickPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    joystickRef.current.active = false;
    joystickRef.current.dx = 0;
    joystickRef.current.dy = 0;
    setJoystickThumbPos({ x: 0, y: 0 });
  };

  const moveDirectly = (dirX: number, dirZ: number) => {
    joystickRef.current.dx = dirX;
    joystickRef.current.dy = dirZ;
    joystickRef.current.active = true;
    setTimeout(() => {
      joystickRef.current.active = false;
      joystickRef.current.dx = 0;
      joystickRef.current.dy = 0;
    }, 320);
  };

  const rotateCamera = (deltaYaw: number) => {
    cameraYawRef.current += deltaYaw;
  };

  if (webglError) {
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '460px', backgroundColor: '#02040a', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
        <div style={{
          padding: '8px 16px',
          background: 'rgba(56, 189, 248, 0.1)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
          fontSize: '0.75rem',
          color: '#38bdf8',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📡</span>
          <span><strong>Tactical 2D Sensor Mode Active</strong> · Hardware WebGL acceleration unavailable on this device. Telemetry & outpost controls fully operational.</span>
        </div>
        <OutpostMap currentSol={currentSol} modules={modules} resources={resources} />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '460px',
        backgroundColor: '#02040a',
        borderRadius: '0 0 12px 12px',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: isMouseDownRef.current ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* ── PUBG MOBILE TACTICAL HUD OVERLAY ── */}

      {/* 1. Tactical Crosshair in Center of Screen */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '26px',
          height: '26px',
          pointerEvents: 'none',
          opacity: 0.75,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: '12px', width: '2px', height: '6px', backgroundColor: '#38bdf8' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '12px', width: '2px', height: '6px', backgroundColor: '#38bdf8' }} />
        <div style={{ position: 'absolute', top: '12px', left: 0, width: '6px', height: '2px', backgroundColor: '#38bdf8' }} />
        <div style={{ position: 'absolute', top: '12px', right: 0, width: '6px', height: '2px', backgroundColor: '#38bdf8' }} />
        <div style={{ position: 'absolute', top: '11px', left: '11px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
      </div>

      {/* 2. Top-Left Telemetry & Mission Coordinates */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(3, 7, 18, 0.85)',
          padding: '5px 12px',
          borderRadius: '6px',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          backdropFilter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9.5px', color: '#38bdf8', letterSpacing: '0.08em', fontWeight: 700 }}>
          {mission ? `${mission.name.toUpperCase()} · ${mission.destination.toUpperCase()}` : 'SHACKLETON RIM 89.9°S'} · ELEV 1840m · EVA SUIT ACTIVE
        </span>
      </div>

      {/* 2b. PUBG Mobile Dynamic Compass Ribbon Tape (Top Center) */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '280px',
          height: '32px',
          background: 'rgba(3, 7, 18, 0.88)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '8px',
          boxShadow: '0 0 16px rgba(0,0,0,0.8), 0 0 8px rgba(56, 189, 248, 0.2)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <div style={{
          width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: '4px solid #38bdf8',
          marginBottom: '2px',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
            {compassDeg}° {compassDeg >= 337 || compassDeg < 23 ? 'N' : compassDeg < 68 ? 'NE' : compassDeg < 113 ? 'E' : compassDeg < 158 ? 'SE' : compassDeg < 203 ? 'S' : compassDeg < 248 ? 'SW' : compassDeg < 293 ? 'W' : 'NW'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px' }}>
            <span title="Habitat Core">🏠</span>
            <span title="Solar Tower">⚡</span>
            <span title="Kilopower">☢️</span>
            <span title="Rover Garage">🚜</span>
          </div>
        </div>
      </div>

      {/* 3. Top-Right Tactical Radar (PUBG Mobile Minimap) */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '14px',
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15, 23, 42, 0.85) 0%, rgba(3, 7, 18, 0.95) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 0 16px rgba(0,0,0,0.8), 0 0 8px rgba(56, 189, 248, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Radar concentric rings */}
        <div style={{ position: 'absolute', width: '56px', height: '56px', borderRadius: '50%', border: '1px dashed rgba(56, 189, 248, 0.25)' }} />
        <div style={{ position: 'absolute', width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(56, 189, 248, 0.25)' }} />

        {/* Player arrow in center */}
        <div
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: '#38bdf8',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            transform: `rotate(${-(playerAngleRef.current - cameraYawRef.current) * (180 / Math.PI)}deg)`,
            boxShadow: '0 0 6px #38bdf8',
          }}
        />

        {/* Base Hub ping */}
        <div style={{ position: 'absolute', top: '22px', left: '38px', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
        {/* Rover ping */}
        <div style={{ position: 'absolute', bottom: '26px', right: '22px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />

        {/* Radar Label */}
        <span style={{ position: 'absolute', bottom: '2px', fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color: '#64748b' }}>
          RADAR 50m
        </span>
      </div>

      {/* 4. AMONG US TASK ZONE ENTRY PROMPT — glows when player walks near a task station */}
      {nearbyZone && !activeTaskZone && (
        <div
          style={{
            position: 'absolute',
            top: '38%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            animation: 'characterSlideIn 0.2s ease-out',
            zIndex: 30,
          }}
          onClick={triggerInteraction}
        >
          {/* Zone Glow Ring (Among Us task shine) */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${nearbyZone.color}44 0%, transparent 70%)`,
            border: `2px solid ${nearbyZone.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: `0 0 24px ${nearbyZone.color}88, 0 0 48px ${nearbyZone.color}44`,
            animation: 'pulse 1.2s ease-in-out infinite',
            cursor: 'pointer',
          }}>
            {nearbyZone.icon}
          </div>

          {/* Task label chip */}
          <div style={{
            background: 'rgba(3, 7, 18, 0.94)',
            border: `1.5px solid ${nearbyZone.color}`,
            borderRadius: '20px',
            padding: '4px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: `0 0 16px ${nearbyZone.color}55`,
          }}>
            <span style={{
              background: nearbyZone.color,
              color: '#030712',
              fontWeight: 800,
              fontSize: '10px',
              padding: '2px 7px',
              borderRadius: '10px',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.06em',
            }}>
              {completedZones.has(nearbyZone.id) ? '✓ DONE' : '[E] USE'}
            </span>
            <span style={{
              color: '#f8fafc',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
            }}>
              {nearbyZone.label}
              {taskChoices.length > 0 && !completedZones.has(nearbyZone.id) && (
                <span style={{ color: nearbyZone.color, marginLeft: '6px', fontSize: '10px' }}>
                  {taskChoices.length} TASK{taskChoices.length > 1 ? 'S' : ''} AVAILABLE
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Scanned Telemetry Toast (no-task fallback) */}
      {scannedMessage && (
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(3, 7, 18, 0.95)',
            border: '1px solid #38bdf8',
            borderRadius: '8px',
            padding: '8px 18px',
            color: '#38bdf8',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            boxShadow: '0 0 24px rgba(56, 189, 248, 0.4)',
            maxWidth: '85%',
            textAlign: 'center',
            zIndex: 30,
          }}
        >
          📡 {scannedMessage}
        </div>
      )}

      {/* AMONG US TASK PANEL — full choice popup when player enters a task zone and presses E */}
      {activeTaskZone && taskChoices.length > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.88)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            animation: 'characterSlideIn 0.25s ease-out',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setActiveTaskZone(null); }}
        >
          <div style={{
            background: 'linear-gradient(180deg, rgba(7, 11, 20, 0.98) 0%, rgba(3, 7, 18, 1) 100%)',
            border: `1.5px solid ${activeTaskZone.color}`,
            borderRadius: '14px',
            padding: '20px 22px',
            maxWidth: '520px',
            width: '90%',
            boxShadow: `0 0 0 1px ${activeTaskZone.color}22, 0 24px 64px rgba(0,0,0,0.95)`,
          }}>
            {/* Panel Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: `${activeTaskZone.color}22`,
                border: `1.5px solid ${activeTaskZone.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                boxShadow: `0 0 16px ${activeTaskZone.color}55`,
                flexShrink: 0,
              }}>
                {activeTaskZone.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '9px',
                  color: activeTaskZone.color,
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  marginBottom: '3px',
                }}>
                  🎯 TASK STATION · {activeTaskZone.label.toUpperCase()}
                </div>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#f8fafc',
                }}>
                  {activeEventTitle || 'SELECT YOUR ACTION'}
                </div>
              </div>
              <button
                onClick={() => setActiveTaskZone(null)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  fontSize: '12px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                ✕ ESC
              </button>
            </div>

            {/* Choice Buttons (Among Us Task options) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {taskChoices.map((choice, idx) => (
                <button
                  key={choice.id}
                  onClick={() => handleTaskChoiceSelect(choice)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(8, 14, 26, 0.98) 100%)',
                    border: `1px solid ${activeTaskZone.color}44`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.18s ease',
                    boxShadow: `0 2px 12px rgba(0,0,0,0.5)`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = activeTaskZone.color;
                    (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(180deg, ${activeTaskZone.color}18 0%, rgba(8,14,26,0.98) 100%)`;
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 16px ${activeTaskZone.color}44`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = `${activeTaskZone.color}44`;
                    (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(8, 14, 26, 0.98) 100%)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.5)';
                  }}
                >
                  {/* Option Number Badge */}
                  <span style={{
                    background: activeTaskZone.color,
                    color: '#030712',
                    fontWeight: 800,
                    fontSize: '11px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>
                    {idx + 1}
                  </span>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#f1f5f9',
                      marginBottom: '4px',
                    }}>
                      {choice.title}
                    </div>
                    <div style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '11px',
                      color: '#94a3b8',
                      lineHeight: 1.5,
                      marginBottom: '5px',
                    }}>
                      {choice.description}
                    </div>
                    {/* Resource Delta Chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {Object.entries(choice.resourceDelta).map(([key, val]) =>
                        val !== 0 ? (
                          <span key={key} style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '9.5px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: (val ?? 0) > 0 ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                            color: (val ?? 0) > 0 ? '#10b981' : '#ef4444',
                            border: `1px solid ${(val ?? 0) > 0 ? '#10b98144' : '#ef444444'}`,
                          }}>
                            {(val ?? 0) > 0 ? '+' : ''}{val} {key.toUpperCase()}
                          </span>
                        ) : null
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{
              marginTop: '12px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              color: '#475569',
              textAlign: 'center',
            }}>
              CLICK OUTSIDE OR ESC TO CANCEL · PRESS [E] TO OPEN TASK STATIONS
            </div>
          </div>
        </div>
      )}

      {/* 5. PUBG Mobile Virtual Joystick & Directional D-Pad (Bottom Left) */}
      {cameraMode === 'TPS_ASTRONAUT' && (
        <div
          style={{
            position: 'absolute',
            bottom: '54px',
            left: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 25,
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Universal Joystick Knob */}
          <div
            style={{
              width: '82px',
              height: '82px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(15, 23, 42, 0.75) 0%, rgba(3, 7, 18, 0.9) 100%)',
              border: '2px solid rgba(56, 189, 248, 0.45)',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.25)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'none',
              cursor: 'grab',
              position: 'relative',
            }}
            onPointerDown={handleJoystickPointerDown}
            onPointerMove={handleJoystickPointerMove}
            onPointerUp={handleJoystickPointerUp}
            onPointerCancel={handleJoystickPointerUp}
            title="Drag with Mouse or Touch to Move"
          >
            {/* Joystick Thumb Knob */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #38bdf8 0%, #0284c7 100%)',
                boxShadow: '0 0 14px rgba(56, 189, 248, 0.8)',
                transform: `translate(${joystickThumbPos.x}px, ${joystickThumbPos.y}px)`,
                pointerEvents: 'none',
              }}
            />
            <span style={{ position: 'absolute', bottom: '-15px', fontSize: '8px', color: '#94a3b8', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
              DRAG JOYSTICK
            </span>
          </div>

          {/* Quick Directional Click D-Pad (for 1-click movement on desktop/trackpad) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 24px)',
              gridTemplateRows: 'repeat(2, 24px)',
              gap: '4px',
              alignItems: 'center',
            }}
          >
            <div />
            <button
              onClick={() => moveDirectly(0, -1)}
              style={{
                width: '24px',
                height: '24px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '4px',
                color: '#38bdf8',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              title="Step Forward [W]"
            >
              ▲
            </button>
            <div />
            <button
              onClick={() => moveDirectly(-1, 0)}
              style={{
                width: '24px',
                height: '24px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '4px',
                color: '#38bdf8',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              title="Step Left [A]"
            >
              ◀
            </button>
            <button
              onClick={() => moveDirectly(0, 1)}
              style={{
                width: '24px',
                height: '24px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '4px',
                color: '#38bdf8',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              title="Step Backward [S]"
            >
              ▼
            </button>
            <button
              onClick={() => moveDirectly(1, 0)}
              style={{
                width: '24px',
                height: '24px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '4px',
                color: '#38bdf8',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              title="Step Right [D]"
            >
              ▶
            </button>
          </div>
        </div>
      )}

      {/* 6. PUBG Action Buttons (Bottom Right: JUMP, SPRINT, HEADLAMP, CAMERA ROTATE) */}
      {cameraMode === 'TPS_ASTRONAUT' && (
        <div
          style={{
            position: 'absolute',
            bottom: '54px',
            right: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
            zIndex: 25,
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Top Row: Camera Rotate helpers */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => rotateCamera(-0.45)}
              style={{
                padding: '3px 8px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px',
                color: '#94a3b8',
                fontSize: '9px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Turn Camera Left"
            >
              ⟲ TURN L
            </button>
            <button
              onClick={() => rotateCamera(0.45)}
              style={{
                padding: '3px 8px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px',
                color: '#94a3b8',
                fontSize: '9px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Turn Camera Right"
            >
              ⟳ TURN R
            </button>
          </div>

          {/* Main Jump Button (Lunar low-G leap) */}
          <button
            onClick={() => {
              if (isGroundedRef.current) {
                playerVelRef.current.y = 5.2;
                isGroundedRef.current = false;
                soundFx.playThruster();
              }
            }}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #0284c7 0%, #0369a1 100%)',
              border: '2px solid #38bdf8',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.5)',
            }}
            title="Jump / Lunar Jetpack Leap [SPACE]"
          >
            <span>🦘</span>
            <span style={{ fontSize: '8px', letterSpacing: '0.04em' }}>JUMP</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Sprint Button */}
            <button
              onClick={() => {
                setIsSprinting((prev) => !prev);
                soundFx.playClick(800);
              }}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: isSprinting ? 'rgba(16, 185, 129, 0.35)' : 'rgba(15, 23, 42, 0.75)',
                border: `1.5px solid ${isSprinting ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
                color: isSprinting ? '#10b981' : '#cbd5e1',
                fontSize: '9px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Sprint / Run faster [SHIFT]"
            >
              <span>⚡</span>
              <span style={{ fontSize: '7px' }}>RUN</span>
            </button>

            {/* Headlamp Toggle Button */}
            <button
              onClick={() => {
                setIsHeadlampOn((prev) => {
                  const next = !prev;
                  if (headlampRef.current) headlampRef.current.intensity = next ? 5.0 : 0;
                  soundFx.playClick(900);
                  return next;
                });
              }}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: isHeadlampOn ? 'rgba(251, 191, 36, 0.3)' : 'rgba(15, 23, 42, 0.75)',
                border: `1.5px solid ${isHeadlampOn ? '#fbbf24' : 'rgba(255,255,255,0.2)'}`,
                color: isHeadlampOn ? '#fbbf24' : '#cbd5e1',
                fontSize: '9px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Toggle Suit Headlamp [F]"
            >
              <span>🔦</span>
              <span style={{ fontSize: '7px' }}>LIGHT</span>
            </button>

            {/* Proximity Action Button */}
            {interactiveTarget && (
              <button
                onClick={triggerInteraction}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.35)',
                  border: '1.5px solid #38bdf8',
                  color: '#38bdf8',
                  fontSize: '9px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulse 1.5s infinite',
                }}
                title="Inspect / Interact [E]"
              >
                <span>🔍</span>
                <span style={{ fontSize: '7px' }}>SCAN</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── PUBG TACTICAL VITALS PANEL (BOTTOM LEFT) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '115px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          background: 'rgba(3, 7, 18, 0.90)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '8px',
          padding: '6px 12px',
          backdropFilter: 'blur(8px)',
          pointerEvents: 'none',
          zIndex: 24,
          minWidth: '190px',
        }}
      >
        {/* Suit Integrity (Health) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#94a3b8' }}>HEALTH</span>
          <div style={{ flex: 1, height: '6px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${resources.crewHealth}%`, height: '100%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#10b981' }}>{resources.crewHealth}%</span>
        </div>

        {/* Stamina Boost Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#94a3b8' }}>BOOST</span>
          <div style={{ flex: 1, height: '6px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${stamina}%`, height: '100%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#f59e0b' }}>{Math.round(stamina)}%</span>
        </div>

        {/* O2 Oxygen Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#94a3b8' }}>OXYGEN</span>
          <div style={{ flex: 1, height: '6px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${resources.oxygen}%`, height: '100%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#38bdf8' }}>{resources.oxygen}%</span>
        </div>
      </div>

      {/* 7. Bottom Navigation Mode Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(3, 7, 18, 0.92)',
          padding: '5px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'TPS_ASTRONAUT', label: '🧑‍🚀 Player Mode (PUBG TPS)', desc: 'Move astronaut with WASD / Joystick' },
            { id: 'ROVER', label: '🚜 Drive Rover SEV', desc: 'Drive exploration vehicle with WASD' },
            { id: 'ORBIT', label: '🎬 Cinematic Flyby', desc: 'Sweeping crater establishing view' },
            { id: 'EARTHRISE', label: '🌍 Earthrise Cam', desc: 'Earth hanging over crater ridge' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={(e) => {
                e.stopPropagation();
                setCameraMode(mode.id as any);
                soundFx.playClick(850);
              }}
              style={{
                background: cameraMode === mode.id ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                border: `1.5px solid ${cameraMode === mode.id ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
                color: cameraMode === mode.id ? '#38bdf8' : '#94a3b8',
                borderRadius: '5px',
                padding: '3px 9px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title={mode.desc}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#64748b' }}>
            [WASD: MOVE · MOUSE: LOOK · SPACE: JUMP]
          </span>
        </div>
      </div>
    </div>
  );
};
