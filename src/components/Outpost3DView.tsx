import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
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

  // ── PUBG / FREE FIRE TACTICAL TPS STATE ──
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isAiming, setIsAiming] = useState(false);
  const [activeTool, setActiveTool] = useState<'LASER' | 'SCANNER' | 'FLAG'>('LASER');
  const [jetpackFuel, setJetpackFuel] = useState(100);
  const [lootCount, setLootCount] = useState(0);
  const [hitmarker, setHitmarker] = useState(false);
  const [targetRange, setTargetRange] = useState<number | null>(null);
  const [actionFeed, setActionFeed] = useState<Array<{ id: number; text: string; type: 'loot' | 'scan' | 'flag' | 'info' }>>([
    { id: 1, text: 'TACTICAL RADAR & EVA SUIT ONLINE', type: 'info' },
    { id: 2, text: 'MINING LASER EQUIPPED [SLOT 1]', type: 'info' }
  ]);

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

  // Tactical PUBG / Free Fire 3D refs
  const weaponMeshRef = useRef<THREE.Group | null>(null);
  const laserBeamRef = useRef<THREE.Line | null>(null);
  const sparkParticlesRef = useRef<THREE.Points | null>(null);
  const sonarRingRef = useRef<THREE.Mesh | null>(null);
  const jetpackFlamesRef = useRef<THREE.Mesh[]>([]);
  const crystalsRef = useRef<Array<{ id: string; mesh: THREE.Group; hp: number; maxHp: number; type: string; pos: THREE.Vector3; name: string }>>([]);
  const isRightMouseDownRef = useRef(false);

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

      // ── PUBG / FREE FIRE TACTICAL HOTKEYS ──
      // [1] Mining Laser
      if (e.code === 'Digit1' || e.key === '1') {
        setActiveTool('LASER');
        soundFx.playClick(950);
        pushActionFeed('SLOT [1]: PLASMA MINING LASER ARMED', 'info');
      }
      // [2] Sonar Scanner
      if (e.code === 'Digit2' || e.key === '2') {
        setActiveTool('SCANNER');
        soundFx.playClick(1050);
        pushActionFeed('SLOT [2]: TERRAIN RADAR SCANNER ARMED', 'scan');
      }
      // [3] NASA Flag
      if (e.code === 'Digit3' || e.key === '3') {
        setActiveTool('FLAG');
        soundFx.playClick(1150);
        pushActionFeed('SLOT [3]: NASA MISSION FLAG ARMED', 'flag');
      }
      // [R] Toggle Aim Down Sights (ADS)
      if (e.code === 'KeyR' || e.key === 'r' || e.key === 'R') {
        setIsAiming(prev => {
          const next = !prev;
          soundFx.playClick(next ? 1200 : 700);
          return next;
        });
      }
      // [Q] Quick Radar Scan
      if (e.code === 'KeyQ' || e.key === 'q' || e.key === 'Q') {
        soundFx.playScan();
        pushActionFeed('📡 Quick Sonar Pulse Dispatched', 'scan');
      }

      // Space: Jump & Jetpack
      if (e.code === 'Space' || e.key === ' ') {
        if (isGroundedRef.current) {
          playerVelRef.current.y = 5.4; // floaty lunar leap
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

  const pushActionFeed = useCallback((text: string, type: 'loot' | 'scan' | 'flag' | 'info' = 'info') => {
    setActionFeed(prev => [{ id: Date.now() + Math.random(), text, type }, ...prev.slice(0, 4)]);
  }, []);

  // ── FIRE ACTIVE TOOL (LEFT CLICK ACTION) ──
  const fireActiveTool = useCallback(() => {
    if (cameraMode !== 'TPS_ASTRONAUT' || !sceneRef.current || !cameraRef.current) return;
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    if (activeTool === 'LASER') {
      soundFx.playMiningLaser();
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      let hitPoint = new THREE.Vector3().addVectors(camera.position, raycaster.ray.direction.clone().multiplyScalar(35));

      if (intersects.length > 0) {
        const hit = intersects[0];
        hitPoint = hit.point;

        for (let i = 0; i < crystalsRef.current.length; i++) {
          const c = crystalsRef.current[i];
          if (c.hp > 0 && hit.point.distanceTo(c.pos) < 2.8) {
            c.hp -= 1;
            setHitmarker(true);
            setTimeout(() => setHitmarker(false), 140);

            c.mesh.traverse((child) => {
              if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mat.emissive) mat.emissiveIntensity = 2.4;
                setTimeout(() => { if (mat.emissive) mat.emissiveIntensity = 0.6; }, 120);
              }
            });

            if (c.hp <= 0) {
              soundFx.playLootPickup();
              scene.remove(c.mesh);
              setLootCount(prev => prev + 1);
              pushActionFeed(`💎 ${c.name} Extracted (+25 Science)`, 'loot');
            } else {
              pushActionFeed(`🎯 Mining Hit: ${c.name} [${c.hp}/${c.maxHp} HP]`, 'info');
            }
            break;
          }
        }
      }

      // Flash laser line
      if (laserBeamRef.current && astronautRef.current) {
        const startPoint = new THREE.Vector3().copy(playerPosRef.current);
        startPoint.y += 1.3;
        startPoint.x += Math.cos(cameraYawRef.current) * 0.45;
        startPoint.z -= Math.sin(cameraYawRef.current) * 0.45;

        const positions = laserBeamRef.current.geometry.attributes.position as THREE.BufferAttribute;
        positions.setXYZ(0, startPoint.x, startPoint.y, startPoint.z);
        positions.setXYZ(1, hitPoint.x, hitPoint.y, hitPoint.z);
        positions.needsUpdate = true;
        (laserBeamRef.current.material as THREE.LineBasicMaterial).opacity = 0.95;
        setTimeout(() => {
          if (laserBeamRef.current) {
            (laserBeamRef.current.material as THREE.LineBasicMaterial).opacity = 0;
          }
        }, 90);
      }

      // Sparks
      if (sparkParticlesRef.current) {
        const pAttr = sparkParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < 40; i++) {
          pAttr.setXYZ(
            i,
            hitPoint.x + (Math.random() - 0.5) * 0.8,
            hitPoint.y + Math.random() * 0.8,
            hitPoint.z + (Math.random() - 0.5) * 0.8
          );
        }
        pAttr.needsUpdate = true;
        (sparkParticlesRef.current.material as THREE.PointsMaterial).opacity = 1.0;
        setTimeout(() => {
          if (sparkParticlesRef.current) {
            (sparkParticlesRef.current.material as THREE.PointsMaterial).opacity = 0;
          }
        }, 160);
      }
    } else if (activeTool === 'SCANNER') {
      soundFx.playScan();
      if (sonarRingRef.current) {
        sonarRingRef.current.position.copy(playerPosRef.current);
        sonarRingRef.current.position.y += 0.2;
        sonarRingRef.current.scale.set(1, 1, 1);
        (sonarRingRef.current.material as THREE.MeshBasicMaterial).opacity = 0.85;
      }
      pushActionFeed('📡 Terrain Radar Sweep: Outpost & Mineral Grid Tagged', 'scan');
    } else if (activeTool === 'FLAG') {
      soundFx.playFlagPlant();
      const flagGroup = new THREE.Group();
      flagGroup.position.copy(playerPosRef.current);
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 2.6, 8),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 })
      );
      pole.position.y = 1.3;
      flagGroup.add(pole);

      const flagCanvas = document.createElement('canvas');
      flagCanvas.width = 256; flagCanvas.height = 160;
      const fCtx = flagCanvas.getContext('2d')!;
      fCtx.fillStyle = '#1e3a8a';
      fCtx.fillRect(0, 0, 256, 160);
      fCtx.fillStyle = '#dc2626';
      fCtx.beginPath();
      fCtx.arc(128, 80, 48, 0, Math.PI * 2);
      fCtx.fill();
      fCtx.fillStyle = '#ffffff';
      fCtx.font = 'bold 34px monospace';
      fCtx.textAlign = 'center';
      fCtx.fillText('NASA', 128, 92);
      const flagTex = new THREE.CanvasTexture(flagCanvas);
      const flagMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 0.75),
        new THREE.MeshStandardMaterial({ map: flagTex, side: THREE.DoubleSide })
      );
      flagMesh.position.set(0.62, 2.1, 0);
      flagGroup.add(flagMesh);
      scene.add(flagGroup);

      confetti({ particleCount: 65, spread: 75, origin: { y: 0.55 } });
      pushActionFeed('🚩 NASA Mission Flag Planted on Shackleton Crater!', 'flag');
    }
  }, [activeTool, cameraMode, pushActionFeed]);

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

    // ── MINEABLE CELESTIAL CRYSTAL FORMATIONS ──
    const crystalGeo = new THREE.OctahedronGeometry(0.7, 0);
    const crystalDefs = [
      { type: 'he3', color: 0x38bdf8, emissive: 0x0284c7, name: 'Helium-3 Fusion Node' },
      { type: 'ice', color: 0x67e8f9, emissive: 0x0891b2, name: 'Lunar Water Ice Core' },
      { type: 'titanium', color: 0xf59e0b, emissive: 0xb45309, name: 'Titanium Regolith Ore' },
    ];
    crystalsRef.current = [];
    for (let i = 0; i < 14; i++) {
      const def = crystalDefs[i % crystalDefs.length];
      const crystalGroup = new THREE.Group();
      const angle = (i / 14) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const r = 11 + (i % 4) * 6 + Math.random() * 4;
      const cx = Math.cos(angle) * r;
      const cz = Math.sin(angle) * r;
      const cy = getTerrainHeight(cx, cz) + 0.4;
      crystalGroup.position.set(cx, cy, cz);

      const cMat = new THREE.MeshStandardMaterial({
        color: def.color,
        emissive: def.emissive,
        emissiveIntensity: 0.65,
        roughness: 0.18,
        metalness: 0.9,
      });

      for (let k = 0; k < 3; k++) {
        const shard = new THREE.Mesh(crystalGeo, cMat);
        shard.scale.set(0.5 + Math.random() * 0.4, 0.9 + Math.random() * 0.8, 0.5 + Math.random() * 0.4);
        shard.position.set((k - 1) * 0.35, Math.random() * 0.3, (k === 1 ? 0.25 : -0.2));
        shard.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
        shard.castShadow = true;
        crystalGroup.add(shard);
      }

      const pLight = new THREE.PointLight(def.color, 0.9, 5);
      pLight.position.y = 0.8;
      crystalGroup.add(pLight);

      scene.add(crystalGroup);
      crystalsRef.current.push({
        id: `crystal_${i}`,
        mesh: crystalGroup,
        hp: 3,
        maxHp: 3,
        type: def.type,
        pos: new THREE.Vector3(cx, cy, cz),
        name: def.name,
      });
    }

    // Laser Beam Line
    const laserGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);
    const laserMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 3, transparent: true, opacity: 0 });
    const laserLine = new THREE.Line(laserGeo, laserMat);
    scene.add(laserLine);
    laserBeamRef.current = laserLine;

    // Sparks Points
    const sparkCount = 40;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.35, transparent: true, opacity: 0 });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkPoints);
    sparkParticlesRef.current = sparkPoints;

    // Sonar Wave Ring
    const sonarGeo = new THREE.RingGeometry(0.5, 1.4, 32);
    sonarGeo.rotateX(-Math.PI / 2);
    const sonarMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0 });
    const sonarRing = new THREE.Mesh(sonarGeo, sonarMat);
    sonarRing.position.y = 0.15;
    scene.add(sonarRing);
    sonarRingRef.current = sonarRing;

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

    // Twin PLSS Jetpack Exhaust Flame Cones
    const flameGeo = new THREE.ConeGeometry(0.12, 0.55, 8);
    flameGeo.rotateX(Math.PI);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 });
    const flameL = new THREE.Mesh(flameGeo, flameMat);
    flameL.position.set(-0.18, 0.76, -0.32);
    flameL.scale.set(0.001, 0.001, 0.001);
    astronaut.add(flameL);

    const flameR = new THREE.Mesh(flameGeo, flameMat);
    flameR.position.set(0.18, 0.76, -0.32);
    flameR.scale.set(0.001, 0.001, 0.001);
    astronaut.add(flameR);
    jetpackFlamesRef.current = [flameL, flameR];

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

    // ── PUBG / FREE FIRE TACTICAL MULTI-TOOL (Plasma Mining Blaster) ──
    const toolGroup = new THREE.Group();
    const toolBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.16, 0.52),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.85 })
    );
    toolBody.position.set(0, -0.32, 0.26);
    toolBody.castShadow = true;
    toolGroup.add(toolBody);

    const powerCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.22, 10),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.2 })
    );
    powerCore.position.set(0, -0.22, 0.24);
    powerCore.rotation.x = Math.PI / 2;
    toolGroup.add(powerCore);

    const muzzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.055, 0.14, 8),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.95, roughness: 0.15 })
    );
    muzzle.rotation.x = Math.PI / 2;
    muzzle.position.set(0, -0.32, 0.54);
    toolGroup.add(muzzle);

    const diode = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.1, 6),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    diode.rotation.x = Math.PI / 2;
    diode.position.set(0.06, -0.25, 0.46);
    toolGroup.add(diode);

    rightArmGroup.add(toolGroup);
    weaponMeshRef.current = toolGroup;

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

      // 2. LUNAR GRAVITY, JETPACK BOOST & GROUND COLLISION
      const groundY = getTerrainHeight(playerPosRef.current.x, playerPosRef.current.z);
      
      // Jetpack Thruster Burn
      if ((keys['Space'] || keys[' ']) && !isGroundedRef.current && jetpackFuel > 2) {
        playerVelRef.current.y = Math.min(playerVelRef.current.y + delta * 13.0, 6.8);
        setJetpackFuel((prev) => Math.max(0, prev - delta * 32));
        jetpackFlamesRef.current.forEach((f) => f.scale.set(1.0, 1.3 + Math.random() * 0.5, 1.0));
      } else {
        jetpackFlamesRef.current.forEach((f) => f.scale.set(0.001, 0.001, 0.001));
        if (isGroundedRef.current) {
          setJetpackFuel((prev) => Math.min(100, prev + delta * 22));
        }
      }

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

      // Sonar Wave Animation
      if (sonarRingRef.current && (sonarRingRef.current.material as THREE.MeshBasicMaterial).opacity > 0.05) {
        sonarRingRef.current.scale.x += delta * 34;
        sonarRingRef.current.scale.y += delta * 34;
        (sonarRingRef.current.material as THREE.MeshBasicMaterial).opacity -= delta * 1.3;
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
        const camDist = isAiming ? 2.4 : 5.2;
        const shoulderOffset = isAiming ? 0.85 : 0.7; // tighter over-shoulder during ADS

        // Smooth FOV transition for ADS zoom
        camera.fov = THREE.MathUtils.lerp(camera.fov, isAiming ? 32 : 50, 0.16);
        camera.updateProjectionMatrix();

        // Aim weapon arm towards crosshair pitch
        if (rightArmRef.current) {
          if (isAiming) {
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
              rightArmRef.current.rotation.x,
              -Math.PI / 2 + cameraPitchRef.current * 0.7,
              0.25
            );
          } else if (!isMoving) {
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.12);
          }
        }

        const camX = p.x - Math.sin(cameraYawRef.current) * camDist + Math.cos(cameraYawRef.current) * shoulderOffset;
        const camZ = p.z - Math.cos(cameraYawRef.current) * camDist - Math.sin(cameraYawRef.current) * shoulderOffset;
        const camY = p.y + (isAiming ? 1.6 : 1.8) + Math.sin(cameraPitchRef.current) * (isAiming ? 1.4 : 2.2);

        camera.position.lerp(new THREE.Vector3(camX, Math.max(camY, groundY + 0.8), camZ), 0.14);

        // Look slightly above astronaut's head at crosshair target
        const lookTarget = new THREE.Vector3(
          p.x + Math.sin(cameraYawRef.current) * 12,
          p.y + 1.6 - Math.sin(cameraPitchRef.current) * 4,
          p.z + Math.cos(cameraYawRef.current) * 12
        );
        camera.lookAt(lookTarget);

        // Tactical ADS Rangefinder Raycast
        if (isAiming) {
          const ray = new THREE.Raycaster();
          ray.setFromCamera(new THREE.Vector2(0, 0), camera);
          const hits = ray.intersectObjects(scene.children, true);
          if (hits.length > 0) {
            setTargetRange(Math.round(hits[0].distance * 10) / 10);
          } else {
            setTargetRange(null);
          }
        } else {
          setTargetRange(null);
        }
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

  // Pointer Lock & Mouse Look (True FPS/TPS PUBG Free Fire Controls)
  useEffect(() => {
    const handlePointerLockChange = () => {
      const canvas = containerRef.current?.querySelector('canvas');
      const locked = !!canvas && document.pointerLockElement === canvas;
      setIsPointerLocked(locked);
    };

    const handlePointerLockMove = (e: MouseEvent) => {
      if (document.pointerLockElement && cameraMode === 'TPS_ASTRONAUT') {
        const sens = isAiming ? 0.0016 : 0.0024;
        cameraYawRef.current += e.movementX * sens;
        cameraPitchRef.current = Math.max(-0.55, Math.min(0.75, cameraPitchRef.current + e.movementY * sens));
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('mousemove', handlePointerLockMove);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', handlePointerLockMove);
    };
  }, [cameraMode, isAiming]);

  // Mouse Click & Drag (Supports both Pointer Lock and Fallback Drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      // Right-click: Aim Down Sights (ADS)
      e.preventDefault();
      setIsAiming(true);
      isRightMouseDownRef.current = true;
      soundFx.playClick(1200);
      return;
    }
    if (e.button === 0) {
      // Left-click: Fire active weapon/tool
      fireActiveTool();
    }
    isMouseDownRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || isPointerLocked) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    cameraYawRef.current -= dx * 0.006;
    cameraPitchRef.current = Math.max(-0.6, Math.min(0.8, cameraPitchRef.current + dy * 0.005));
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 2) {
      setIsAiming(false);
      isRightMouseDownRef.current = false;
      return;
    }
    isMouseDownRef.current = false;
  };

  const handleContainerClick = () => {
    if (cameraMode === 'TPS_ASTRONAUT' && containerRef.current) {
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas && document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
      }
    }
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
        cursor: isPointerLocked ? 'crosshair' : (isMouseDownRef.current ? 'grabbing' : 'grab'),
      }}
      onClick={handleContainerClick}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* ── PUBG MOBILE / FREE FIRE TACTICAL HUD OVERLAY ── */}

      {/* 1. Tactical Dynamic Crosshair in Center of Screen */}
      {cameraMode === 'TPS_ASTRONAUT' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isAiming ? '18px' : isSprinting ? '32px' : '22px',
            height: isAiming ? '18px' : isSprinting ? '32px' : '22px',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'width 0.15s ease, height 0.15s ease',
            zIndex: 20,
          }}
        >
          {/* Crosshair Wings */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '2px', height: isAiming ? '4px' : '6px', backgroundColor: isAiming ? '#38bdf8' : 'rgba(56, 189, 248, 0.75)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '2px', height: isAiming ? '4px' : '6px', backgroundColor: isAiming ? '#38bdf8' : 'rgba(56, 189, 248, 0.75)' }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', width: isAiming ? '4px' : '6px', height: '2px', backgroundColor: isAiming ? '#38bdf8' : 'rgba(56, 189, 248, 0.75)' }} />
          <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', width: isAiming ? '4px' : '6px', height: '2px', backgroundColor: isAiming ? '#38bdf8' : 'rgba(56, 189, 248, 0.75)' }} />

          {/* Center Precision Dot */}
          <div
            style={{
              width: isAiming ? '4px' : '3px',
              height: isAiming ? '4px' : '3px',
              borderRadius: '50%',
              backgroundColor: isAiming ? '#ef4444' : '#38bdf8',
              boxShadow: isAiming ? '0 0 8px #ef4444' : '0 0 6px #38bdf8',
            }}
          />

          {/* Hitmarker Flash (✕) */}
          {hitmarker && (
            <div
              style={{
                position: 'absolute',
                fontSize: '18px',
                fontWeight: 900,
                color: '#ef4444',
                textShadow: '0 0 8px #ef4444',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              ✕
            </div>
          )}

          {/* Range / ADS Meter Tag */}
          {isAiming && (
            <div
              style={{
                position: 'absolute',
                bottom: '-22px',
                fontSize: '8px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
                color: '#38bdf8',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
                background: 'rgba(3, 7, 18, 0.75)',
                padding: '1px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(56, 189, 248, 0.4)',
              }}
            >
              ADS 32° · {targetRange !== null ? `${targetRange}m` : 'SCANNING'}
            </div>
          )}
        </div>
      )}

      {/* 2. Top-Left Telemetry & Mission Coordinates */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(3, 7, 18, 0.88)',
          padding: '5px 12px',
          borderRadius: '6px',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          backdropFilter: 'blur(8px)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9.5px', color: '#38bdf8', letterSpacing: '0.08em', fontWeight: 700 }}>
          {mission ? `${mission.name.toUpperCase()} · ${mission.destination.toUpperCase()}` : 'SHACKLETON RIM 89.9°S'} · ELEV 1840m · EVA SUIT ACTIVE
        </span>
      </div>

      {/* 2b. PUBG Dynamic Compass Ribbon Tape (Top Center) */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '290px',
          height: '32px',
          background: 'rgba(3, 7, 18, 0.90)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
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
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
            {compassDeg}° {compassDeg >= 337 || compassDeg < 23 ? 'N' : compassDeg < 68 ? 'NE' : compassDeg < 113 ? 'E' : compassDeg < 158 ? 'SE' : compassDeg < 203 ? 'S' : compassDeg < 248 ? 'SW' : compassDeg < 293 ? 'W' : 'NW'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px' }}>
            <span title="Habitat Core">🏠</span>
            <span title="Solar Tower">⚡</span>
            <span title="Kilopower">☢️</span>
            <span title="Rover Garage">🚜</span>
            <span title="Mineral Node" style={{ color: '#38bdf8' }}>💎</span>
          </div>
        </div>
      </div>

      {/* 2c. Pointer Lock Status Pill */}
      {cameraMode === 'TPS_ASTRONAUT' && (
        <div
          onClick={handleContainerClick}
          style={{
            position: 'absolute',
            top: '46px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: isPointerLocked ? 'rgba(16, 185, 129, 0.25)' : 'rgba(3, 7, 18, 0.92)',
            border: `1px solid ${isPointerLocked ? '#10b981' : 'rgba(56, 189, 248, 0.5)'}`,
            borderRadius: '20px',
            padding: '3px 12px',
            fontSize: '9px',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            color: isPointerLocked ? '#10b981' : '#38bdf8',
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 22,
          }}
        >
          {isPointerLocked ? (
            <span>🟢 MOUSE AIM LOCKED · [ESC TO FREE]</span>
          ) : (
            <>
              <span>🎯 CLICK SCREEN TO LOCK MOUSE AIM</span>
              <span style={{ color: '#64748b' }}>·</span>
              <span style={{ color: '#f59e0b' }}>RIGHT-CLICK ADS</span>
            </>
          )}
        </div>
      )}

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
          zIndex: 20,
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
        {/* Crystal pings */}
        <div style={{ position: 'absolute', top: '30px', right: '26px', width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
        <div style={{ position: 'absolute', bottom: '34px', left: '24px', width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#67e8f9' }} />

        {/* Radar Label */}
        <span style={{ position: 'absolute', bottom: '2px', fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color: '#64748b' }}>
          RADAR 50m
        </span>
      </div>

      {/* 3b. Free Fire Style Combat & Discovery Action Feed */}
      <div
        style={{
          position: 'absolute',
          top: '102px',
          right: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          alignItems: 'flex-end',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        {actionFeed.map((item) => (
          <div
            key={item.id}
            style={{
              background: 'rgba(3, 7, 18, 0.90)',
              borderLeft: `3px solid ${item.type === 'loot' ? '#10b981' : item.type === 'flag' ? '#f59e0b' : '#38bdf8'}`,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '9px',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              color: item.type === 'loot' ? '#34d399' : item.type === 'flag' ? '#fbbf24' : '#e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
              maxWidth: '220px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.text}
          </div>
        ))}
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

      {/* ── PUBG / FREE FIRE TACTICAL VITALS PANEL (BOTTOM LEFT) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '48px',
          left: '115px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          background: 'rgba(3, 7, 18, 0.92)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '8px',
          padding: '6px 12px',
          backdropFilter: 'blur(8px)',
          pointerEvents: 'none',
          zIndex: 24,
          minWidth: '200px',
        }}
      >
        {/* Suit Integrity (Health) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', fontWeight: 700, color: '#94a3b8' }}>ARMOR</span>
          <div style={{ flex: 1, height: '5px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${resources.crewHealth}%`, height: '100%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', fontWeight: 700, color: '#10b981' }}>{resources.crewHealth}%</span>
        </div>

        {/* Sprint Boost (Stamina) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', fontWeight: 700, color: '#94a3b8' }}>BOOST</span>
          <div style={{ flex: 1, height: '5px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${stamina}%`, height: '100%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', fontWeight: 700, color: '#f59e0b' }}>{Math.round(stamina)}%</span>
        </div>

        {/* Jetpack Thruster Fuel */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', fontWeight: 700, color: '#94a3b8' }}>JETPACK</span>
          <div style={{ flex: 1, height: '5px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${jetpackFuel}%`, height: '100%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', fontWeight: 700, color: '#38bdf8' }}>{Math.round(jetpackFuel)}%</span>
        </div>

        {/* O2 Oxygen Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', fontWeight: 700, color: '#94a3b8' }}>OXYGEN</span>
          <div style={{ flex: 1, height: '5px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${resources.oxygen}%`, height: '100%', background: '#06b6d4', boxShadow: '0 0 6px #06b6d4' }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', fontWeight: 700, color: '#06b6d4' }}>{resources.oxygen}%</span>
        </div>

        {/* Science Loot Nodes Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '2px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', color: '#f59e0b' }}>💎 SAMPLES MINED</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#fbbf24' }}>{lootCount} NODES</span>
        </div>
      </div>

      {/* ── PUBG / FREE FIRE TACTICAL WEAPON & TOOL WHEEL (BOTTOM CENTER) ── */}
      {cameraMode === 'TPS_ASTRONAUT' && (
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(3, 7, 18, 0.94)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '10px',
            padding: '4px 8px',
            backdropFilter: 'blur(8px)',
            zIndex: 25,
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {[
            { id: 'LASER', slot: '1', name: 'MINING LASER', icon: '⚡' },
            { id: 'SCANNER', slot: '2', name: 'RADAR SCAN', icon: '📡' },
            { id: 'FLAG', slot: '3', name: 'NASA FLAG', icon: '🚩' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTool(t.id as any);
                soundFx.playClick(900);
                pushActionFeed(`EQUIPPED [${t.slot}]: ${t.name}`, 'info');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 9px',
                borderRadius: '6px',
                background: activeTool === t.id ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                border: `1.5px solid ${activeTool === t.id ? '#38bdf8' : 'rgba(255, 255, 255, 0.12)'}`,
                color: activeTool === t.id ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '9.5px',
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                transition: 'all 0.15s ease',
              }}
              title={`Switch tool [Key ${t.slot}] · Left Click to use`}
            >
              <span style={{
                background: activeTool === t.id ? '#38bdf8' : '#475569',
                color: '#030712',
                borderRadius: '3px',
                padding: '1px 4px',
                fontSize: '8.5px',
                fontWeight: 800,
              }}>
                {t.slot}
              </span>
              <span>{t.icon}</span>
              <span style={{ display: 'inline-block' }}>{t.name}</span>
            </button>
          ))}

          {/* ADS Aim Button */}
          <button
            onClick={() => {
              setIsAiming((prev) => !prev);
              soundFx.playClick(1100);
            }}
            style={{
              padding: '4px 9px',
              borderRadius: '6px',
              background: isAiming ? 'rgba(245, 158, 11, 0.35)' : 'rgba(255, 255, 255, 0.05)',
              border: `1.5px solid ${isAiming ? '#f59e0b' : 'rgba(255, 255, 255, 0.12)'}`,
              color: isAiming ? '#f59e0b' : '#94a3b8',
              fontSize: '9.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: "'JetBrains Mono', monospace",
            }}
            title="Toggle ADS Aim Down Sights [Right-Click or R]"
          >
            <span>🎯</span>
            <span>{isAiming ? 'ADS ON' : 'AIM ADS'}</span>
          </button>
        </div>
      )}

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
