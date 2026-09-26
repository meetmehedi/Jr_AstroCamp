// ============================================================
// DeepSpaceScene — Phaser 3 scene for Gravity Assist Slingshots
// Covers: Voyager 1/2, Cassini, New Horizons, Pioneer, Galileo, Juno
// ============================================================
import Phaser from 'phaser';
import type { DeepSpaceParams } from '../missionGameData';

export interface DeepSpaceSceneConfig {
  missionId: string;
  missionName: string;
  params: DeepSpaceParams;
  onSuccess: (score: number) => void;
  onFailure: (reason: string) => void;
}

interface CelestialBody {
  x: number;
  y: number;
  radius: number;
  gravityRadius: number;
  mass: number;
  name: string;
  color: number;
  visited: boolean;
  isTarget?: boolean;
}

export class DeepSpaceScene extends Phaser.Scene {
  private cfg!: DeepSpaceSceneConfig;

  // Probe state
  private probeX = 100;
  private probeY = 500;
  private probeVx = 70;
  private probeVy = -110;
  private probeAngle = 0;
  private fuel = 100;

  private trail: { x: number; y: number }[] = [];
  private swingbysCompleted = 0;
  private isGameOver = false;
  private timeRemaining = 60;

  // Bodies in system
  private bodies: CelestialBody[] = [];
  private targetBody!: CelestialBody;

  // Graphics
  private bgGfx!: Phaser.GameObjects.Graphics;
  private orbitGfx!: Phaser.GameObjects.Graphics;
  private bodyGfx!: Phaser.GameObjects.Graphics;
  private probeGfx!: Phaser.GameObjects.Graphics;
  private hudGfx!: Phaser.GameObjects.Graphics;

  // HUD text
  private statText!: Phaser.GameObjects.Text;

  // Controls
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'DeepSpaceScene' });
  }

  init(data: DeepSpaceSceneConfig) {
    this.cfg = data;
    this.timeRemaining = data.params.timeLimitSec || 50;
    this.fuel = data.params.fuelBudget || 100;
    this.swingbysCompleted = 0;
    this.isGameOver = false;
    this.trail = [];

    // Probe initial condition
    this.probeX = 120;
    this.probeY = 480;
    this.probeVx = 100;
    this.probeVy = -80;

    // Build planetary system based on params
    this.bodies = [];
    const gravityMult = data.params.gravityStrength || 1.0;

    // Intermediate gravity-assist planets
    const planetTemplates = [
      { name: 'Jupiter', color: 0xf59e0b, radius: 26, gravR: 110, mass: 6500 * gravityMult },
      { name: 'Saturn', color: 0xeab308, radius: 22, gravR: 95, mass: 5000 * gravityMult },
      { name: 'Mars', color: 0xef4444, radius: 16, gravR: 75, mass: 3500 * gravityMult },
    ];

    const numPlanets = Math.min(data.params.numPlanets || 2, planetTemplates.length);
    for (let i = 0; i < numPlanets; i++) {
      const template = planetTemplates[i];
      const px = 280 + i * 220;
      const py = 250 + (i % 2 === 0 ? -40 : 40);
      this.bodies.push({
        x: px,
        y: py,
        radius: template.radius,
        gravityRadius: template.gravR,
        mass: template.mass,
        name: template.name,
        color: template.color,
        visited: false,
      });
    }

    // Target Destination (e.g., Pluto / Interstellar Heliopause / Kuiper Encounter)
    const targetX = 700;
    const targetY = 160;
    this.targetBody = {
      x: targetX,
      y: targetY,
      radius: 18,
      gravityRadius: data.params.targetOrbitalRadius || 50,
      mass: 2000 * gravityMult,
      name: 'Destination Encounter',
      color: 0x38bdf8,
      visited: false,
      isTarget: true,
    };
    this.bodies.push(this.targetBody);
  }

  create() {
    const { width, height } = this.scale;

    this.bgGfx = this.add.graphics();
    this.orbitGfx = this.add.graphics();
    this.bodyGfx = this.add.graphics();
    this.probeGfx = this.add.graphics();
    this.hudGfx = this.add.graphics();

    // Render static backdrop
    this.bgGfx.fillStyle(0x020617, 1);
    this.bgGfx.fillRect(0, 0, width, height);

    // Distant stars
    for (let i = 0; i < 180; i++) {
      const sx = Math.random() * width;
      const sy = Math.random() * height;
      const sa = Math.random() * 0.7 + 0.3;
      this.bgGfx.fillStyle(0xffffff, sa);
      this.bgGfx.fillCircle(sx, sy, Math.random() < 0.9 ? 1 : 1.5);
    }

    // Initial HUD
    this.add.text(24, 20, `${this.cfg.missionName.toUpperCase()} — INTERPLANETARY SLINGSHOT`, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#38bdf8',
      fontStyle: 'bold',
    });

    this.statText = this.add.text(24, 48, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#cbd5e1',
      lineSpacing: 4,
    });

    this.add.text(width / 2, height - 28, 'W/A/S/D or ARROWS: Fire RCS Maneuver Thrusters (Consumes Fuel) | SLINGSHOT PAST PLANETS', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#64748b',
    }).setOrigin(0.5, 0.5);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    // Pointer impulse support for mobile/mouse
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.fuel > 0 && !this.isGameOver) {
        const angle = Phaser.Math.Angle.Between(this.probeX, this.probeY, pointer.x, pointer.y);
        const thrust = 35;
        this.probeVx += Math.cos(angle) * thrust;
        this.probeVy += Math.sin(angle) * thrust;
        this.fuel = Math.max(0, this.fuel - 10);
      }
    });
  }

  update(_time: number, delta: number) {
    if (this.isGameOver) return;
    const dt = Math.min(delta / 1000, 0.05);

    // Timer countdown
    this.timeRemaining -= dt;
    if (this.timeRemaining <= 0) {
      this.isGameOver = true;
      this.cfg.onFailure('Trajectory expired — probe exhausted orbital timeline.');
      return;
    }

    // RCS Thruster burns
    const thrustPower = 110;
    let fired = false;

    if ((this.cursors.left.isDown || this.keyA?.isDown) && this.fuel > 0) {
      this.probeVx -= thrustPower * dt;
      fired = true;
    }
    if ((this.cursors.right.isDown || this.keyD?.isDown) && this.fuel > 0) {
      this.probeVx += thrustPower * dt;
      fired = true;
    }
    if ((this.cursors.up.isDown || this.keyW?.isDown) && this.fuel > 0) {
      this.probeVy -= thrustPower * dt;
      fired = true;
    }
    if ((this.cursors.down.isDown || this.keyS?.isDown) && this.fuel > 0) {
      this.probeVy += thrustPower * dt;
      fired = true;
    }

    if (fired) {
      this.fuel = Math.max(0, this.fuel - dt * 25);
    }

    // Gravity calculations for all celestial bodies
    for (const body of this.bodies) {
      const dx = body.x - this.probeX;
      const dy = body.y - this.probeY;
      const distSq = Math.max(dx * dx + dy * dy, 400);
      const dist = Math.sqrt(distSq);

      // Check crash condition
      if (dist < body.radius + 6) {
        this.isGameOver = true;
        this.cfg.onFailure(`Catastrophic surface impact with ${body.name}!`);
        return;
      }

      // Check gravity assist zone
      if (!body.isTarget && dist < body.gravityRadius && !body.visited) {
        body.visited = true;
        this.swingbysCompleted++;
        this.triggerAssistEffect(body.x, body.y, body.color);
      }

      // Check arrival at target destination
      if (body.isTarget && dist < body.gravityRadius) {
        const required = this.cfg.params.requiredSwingbys || 1;
        if (this.swingbysCompleted >= required) {
          this.isGameOver = true;
          const score = Math.round(1000 + this.fuel * 8 + this.timeRemaining * 30);
          this.triggerAssistEffect(body.x, body.y, 0x10b981);
          this.time.delayedCall(900, () => {
            this.cfg.onSuccess(score);
          });
          return;
        }
      }

      // Newtonian gravity force = G * M / r^2
      const force = body.mass / distSq;
      this.probeVx += (dx / dist) * force * dt;
      this.probeVy += (dy / dist) * force * dt;
    }

    // Probe motion integration
    this.probeX += this.probeVx * dt;
    this.probeY += this.probeVy * dt;
    this.probeAngle = Math.atan2(this.probeVy, this.probeVx);

    // Trail recording
    if (this.trail.length === 0 || Phaser.Math.Distance.Between(this.probeX, this.probeY, this.trail[this.trail.length - 1].x, this.trail[this.trail.length - 1].y) > 8) {
      this.trail.push({ x: this.probeX, y: this.probeY });
      if (this.trail.length > 90) this.trail.shift();
    }

    // Out of bounds check
    if (this.probeX < -150 || this.probeX > 950 || this.probeY < -150 || this.probeY > 750) {
      this.isGameOver = true;
      this.cfg.onFailure('Probe ejected on hyperbolic escape velocity without target intercept.');
      return;
    }

    // Render everything
    this.renderOrbitsAndTrail();
    this.renderBodies();
    this.renderProbe();
    this.updateHUD();
  }

  private triggerAssistEffect(x: number, y: number, color: number) {
    const ring = this.add.graphics();
    ring.lineStyle(2, color, 1);
    ring.strokeCircle(x, y, 30);
    this.tweens.add({
      targets: ring,
      scale: 3,
      alpha: 0,
      duration: 700,
      onComplete: () => ring.destroy(),
    });
  }

  private renderOrbitsAndTrail() {
    this.orbitGfx.clear();

    // Gravity influence zones
    for (const b of this.bodies) {
      this.orbitGfx.lineStyle(1, b.color, b.isTarget ? 0.4 : 0.2);
      this.orbitGfx.strokeCircle(b.x, b.y, b.gravityRadius);
    }

    // Flight trajectory trail
    if (this.trail.length > 1) {
      for (let i = 0; i < this.trail.length - 1; i++) {
        const alpha = (i / this.trail.length) * 0.8;
        this.orbitGfx.lineStyle(2, 0x38bdf8, alpha);
        this.orbitGfx.lineBetween(this.trail[i].x, this.trail[i].y, this.trail[i + 1].x, this.trail[i + 1].y);
      }
    }
  }

  private renderBodies() {
    this.bodyGfx.clear();

    for (const b of this.bodies) {
      // Body halo
      this.bodyGfx.fillStyle(b.color, 0.25);
      this.bodyGfx.fillCircle(b.x, b.y, b.radius + 6);

      // Body core
      this.bodyGfx.fillStyle(b.color, 1);
      this.bodyGfx.fillCircle(b.x, b.y, b.radius);

      // Visited or target ring
      if (b.visited) {
        this.bodyGfx.lineStyle(2, 0x10b981, 0.9);
        this.bodyGfx.strokeCircle(b.x, b.y, b.radius + 12);
      } else if (b.isTarget) {
        const pulse = 1 + Math.sin(this.time.now * 0.006) * 0.15;
        this.bodyGfx.lineStyle(2, 0x38bdf8, 0.9);
        this.bodyGfx.strokeCircle(b.x, b.y, (b.gravityRadius - 10) * pulse);
      }
    }
  }

  private renderProbe() {
    this.probeGfx.clear();

    const px = this.probeX;
    const py = this.probeY;

    // Probe icon / satellite shape
    this.probeGfx.fillStyle(0xffffff, 1);
    this.probeGfx.fillCircle(px, py, 5);

    // Direction heading line
    const hx = px + Math.cos(this.probeAngle) * 14;
    const hy = py + Math.sin(this.probeAngle) * 14;
    this.probeGfx.lineStyle(2, 0xfacc15, 1);
    this.probeGfx.lineBetween(px, py, hx, hy);

    // Solar panels
    const perpAngle = this.probeAngle + Math.PI / 2;
    const span = 9;
    this.probeGfx.lineStyle(2, 0x0284c7, 0.9);
    this.probeGfx.lineBetween(
      px + Math.cos(perpAngle) * span,
      py + Math.sin(perpAngle) * span,
      px - Math.cos(perpAngle) * span,
      py - Math.sin(perpAngle) * span
    );
  }

  private updateHUD() {
    const required = this.cfg.params.requiredSwingbys || 1;
    const currentSpeed = Math.round(Math.sqrt(this.probeVx * this.probeVx + this.probeVy * this.probeVy));

    this.statText.setText(
      `VELOCITY: ${currentSpeed} km/s | FUEL: ${Math.round(this.fuel)}% | TIME: ${this.timeRemaining.toFixed(1)}s\n` +
      `GRAVITY ASSISTS: ${this.swingbysCompleted}/${required} COMPLETED | TARGET: ${this.targetBody.name}`
    );

    // Fuel bar indicator
    this.hudGfx.clear();
    const barX = 760;
    const barY = 120;
    const barH = 180;
    this.hudGfx.fillStyle(0x0f172a, 0.85);
    this.hudGfx.fillRect(barX, barY, 12, barH);
    this.hudGfx.lineStyle(1, 0x334155, 1);
    this.hudGfx.strokeRect(barX, barY, 12, barH);

    const fuelFraction = this.fuel / (this.cfg.params.fuelBudget || 100);
    const fillH = barH * fuelFraction;
    const fuelColor = fuelFraction > 0.3 ? 0x10b981 : 0xef4444;
    this.hudGfx.fillStyle(fuelColor, 1);
    this.hudGfx.fillRect(barX + 2, barY + barH - fillH, 8, fillH);
  }
}
