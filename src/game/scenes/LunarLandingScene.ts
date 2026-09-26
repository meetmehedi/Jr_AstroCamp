// ============================================================
// LunarLandingScene — Phaser 3 scene for lunar/surface landing
// Covers: Apollo 10–17, Artemis III, Ranger/Surveyor
// ============================================================
import Phaser from 'phaser';
import type { LunarLandingParams } from '../missionGameData';

export interface LunarLandingSceneConfig {
  missionId: string;
  missionName: string;
  params: LunarLandingParams;
  onSuccess: (score: number) => void;
  onFailure: (reason: string) => void;
}

export class LunarLandingScene extends Phaser.Scene {
  private cfg!: LunarLandingSceneConfig;

  // Lander state
  private lx = 0;
  private ly = 0;
  private vx = 0;
  private vy = 0;
  private fuel = 100;
  private angle = 0; // degrees
  private angularVel = 0;
  private isThrusting = false;
  private timeElapsed = 0;
  private done = false;

  // Terrain
  private terrainPoints: { x: number; y: number }[] = [];
  private targetX = 0;
  private groundY = 0;
  private hazardZones: { x: number; w: number }[] = [];

  // Graphics
  private terrainGfx!: Phaser.GameObjects.Graphics;
  private landerGfx!: Phaser.GameObjects.Graphics;
  private landerContainer!: Phaser.GameObjects.Container;
  private flameGfx!: Phaser.GameObjects.Graphics;
  private targetMarker!: Phaser.GameObjects.Graphics;
  private particleTrail: { x: number; y: number; life: number }[] = [];
  private particleGfx!: Phaser.GameObjects.Graphics;

  // HUD
  private hudText!: Phaser.GameObjects.Text;
  private warningText!: Phaser.GameObjects.Text;

  // Camera scroll
  private worldOffsetY = 0;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'LunarLandingScene' });
  }

  init(data: LunarLandingSceneConfig) {
    this.cfg = data;
    this.fuel = this.cfg.params.fuelCapacity;
    this.vx = 0;
    this.vy = 0.5; // slight initial downward
    this.angle = 0;
    this.angularVel = 0;
    this.timeElapsed = 0;
    this.done = false;
    this.terrainPoints = [];
    this.particleTrail = [];
  }

  create() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    this.cameras.main.setBackgroundColor('#020617');
    this.groundY = H - 80;
    this.lx = W / 2;
    this.ly = 60;
    this.worldOffsetY = 0;

    // Build terrain
    this.buildTerrain(W);

    // Graphics layers
    this.terrainGfx = this.add.graphics().setDepth(2);
    this.particleGfx = this.add.graphics().setDepth(3);
    this.targetMarker = this.add.graphics().setDepth(3);

    // Lander
    this.landerContainer = this.add.container(this.lx, this.ly).setDepth(5);
    this.landerGfx = this.add.graphics();
    this.flameGfx = this.add.graphics();
    this.drawLander(this.landerGfx);
    this.landerContainer.add([this.flameGfx, this.landerGfx]);

    // Stars
    const starGfx = this.add.graphics().setDepth(0);
    starGfx.fillStyle(0xffffff, 1);
    for (let i = 0; i < 150; i++) {
      const a = Math.random() * 0.8 + 0.2;
      starGfx.fillStyle(0xffffff, a);
      starGfx.fillCircle(Phaser.Math.Between(0, W), Phaser.Math.Between(0, H * 0.7), Math.random() * 1.5 + 0.3);
    }

    // HUD
    this.buildHUD(W, H);

    // Warning text
    this.warningText = this.add.text(W / 2, H - 35, '', {
      fontFamily: 'monospace', fontSize: '13px', color: '#ef4444',
    }).setOrigin(0.5).setDepth(20);

    // Instructions
    this.add.text(W / 2, H - 18, '↑/SPACE — Main Thruster  |  ← → — Rotate  |  Land in the GREEN ZONE', {
      fontFamily: 'monospace', fontSize: '11px', color: '#475569',
    }).setOrigin(0.5).setDepth(20);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.buildTouchControls(W, H);
  }

  private buildTerrain(W: number) {
    const pts: { x: number; y: number }[] = [];
    const numPts = 20;
    const segW = W / (numPts - 1);

    // Find target zone center
    const tIdx = Math.floor(numPts * 0.55);
    this.targetX = tIdx * segW;

    for (let i = 0; i < numPts; i++) {
      let y = this.groundY;
      const isTarget = Math.abs(i - tIdx) <= 1;
      if (!isTarget) {
        const roughness = this.cfg.params.hasTerrainHazards ? Phaser.Math.Between(-40, 40) : Phaser.Math.Between(-15, 15);
        y += roughness;
      }
      pts.push({ x: i * segW, y });
    }
    this.terrainPoints = pts;

    // Hazards
    this.hazardZones = [];
    if (this.cfg.params.hasTerrainHazards) {
      for (let i = 0; i < 4; i++) {
        const hx = Phaser.Math.Between(20, W - 20);
        if (Math.abs(hx - this.targetX) > 80) {
          this.hazardZones.push({ x: hx, w: Phaser.Math.Between(20, 50) });
        }
      }
    }
  }

  private drawLander(g: Phaser.GameObjects.Graphics) {
    g.clear();
    // Descent stage
    g.fillStyle(0xd1d5db, 1);
    g.fillRect(-14, -5, 28, 16);
    // Ascent stage (cabin)
    g.fillStyle(0xe2e8f0, 1);
    g.fillRect(-9, -22, 18, 18);
    // Windows
    g.fillStyle(0x60a5fa, 1);
    g.fillCircle(-4, -15, 4);
    g.fillCircle(5, -15, 4);
    // Legs
    g.lineStyle(2, 0x9ca3af, 1);
    g.lineBetween(-14, 11, -22, 24);
    g.lineBetween(14, 11, 22, 24);
    // Footpads
    g.fillStyle(0x6b7280, 1);
    g.fillRect(-25, 23, 10, 4);
    g.fillRect(15, 23, 10, 4);
    // Nozzle
    g.fillStyle(0x374151, 1);
    g.fillRect(-6, 11, 12, 6);
  }

  private drawTerrain() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const g = this.terrainGfx;
    g.clear();

    // Sky gradient
    g.fillStyle(0x020617, 1);
    g.fillRect(0, 0, W, H);

    const pts = this.terrainPoints.map((p) => ({ x: p.x, y: p.y + this.worldOffsetY }));

    // Fill lunar surface
    g.fillStyle(0x94a3b8, 1);
    g.beginPath();
    g.moveTo(0, H);
    for (const p of pts) {
      g.lineTo(p.x, p.y);
    }
    g.lineTo(W, H);
    g.closePath();
    g.fillPath();

    // Terrain line
    g.lineStyle(2, 0xe2e8f0, 1);
    g.beginPath();
    g.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
    g.strokePath();

    // Hazard boulders
    for (const hz of this.hazardZones) {
      const groundPt = this.getGroundY(hz.x) + this.worldOffsetY;
      g.fillStyle(0x64748b, 1);
      g.fillEllipse(hz.x, groundPt - 8, hz.w, 16);
      g.fillStyle(0x475569, 1);
      g.fillEllipse(hz.x - 5, groundPt - 5, hz.w * 0.5, 10);
    }

    // Target zone
    this.targetMarker.clear();
    const tGround = this.getGroundY(this.targetX) + this.worldOffsetY;
    const tw = this.cfg.params.targetZoneWidthPx;
    const altM = Math.max(0, (this.ly - tGround + 24));
    const green = altM < 50;
    this.targetMarker.fillStyle(green ? 0x22c55e : 0x3b82f6, 0.3);
    this.targetMarker.fillRect(this.targetX - tw / 2, tGround - 10, tw, 14);
    this.targetMarker.lineStyle(2, green ? 0x22c55e : 0x3b82f6, 0.9);
    this.targetMarker.strokeRect(this.targetX - tw / 2, tGround - 10, tw, 14);
    this.targetMarker.lineStyle(1, 0x22c55e, 0.6);
    this.targetMarker.lineBetween(this.targetX, tGround - 10, this.targetX, tGround - 50);
  }

  private getGroundY(x: number): number {
    const pts = this.terrainPoints;
    for (let i = 0; i < pts.length - 1; i++) {
      if (x >= pts[i].x && x <= pts[i + 1].x) {
        const t = (x - pts[i].x) / (pts[i + 1].x - pts[i].x);
        return pts[i].y + t * (pts[i + 1].y - pts[i].y);
      }
    }
    return this.groundY;
  }

  private buildHUD(_W: number, _H: number) {
    const panel = this.add.graphics().setDepth(20);
    panel.fillStyle(0x0f172a, 0.85);
    panel.fillRoundedRect(10, 10, 210, 120, 8);

    this.hudText = this.add.text(20, 18, '', {
      fontFamily: 'monospace', fontSize: '12px', color: '#94a3b8', lineSpacing: 5,
    }).setDepth(21);
  }

  private buildTouchControls(W: number, H: number) {
    const makeBtn = (x: number, y: number, label: string, _key: string) => {
      const g = this.add.graphics().setDepth(30);
      g.fillStyle(0x1e293b, 0.8);
      g.fillRoundedRect(x - 30, y - 30, 60, 60, 8);
      this.add.text(x, y, label, { fontFamily: 'monospace', fontSize: '22px', color: '#fff' }).setOrigin(0.5).setDepth(31);
    };
    makeBtn(W / 2, H - 45, '▲', 'up');
    makeBtn(W / 2 - 70, H - 45, '◄', 'left');
    makeBtn(W / 2 + 70, H - 45, '►', 'right');
  }

  update(_time: number, delta: number) {
    if (this.done) return;
    const dt = delta / 1000;
    this.timeElapsed += dt;

    this.handleInput(dt);
    this.applyPhysics(dt);
    this.updateParticles(dt);
    this.drawTerrain();
    this.updateLander();
    this.checkLanding();
    this.updateHUD();

    if (this.timeElapsed > this.cfg.params.timeLimitSec) {
      this.fail('Mission time exceeded — fuel depleted before landing.');
    }
  }

  private handleInput(dt: number) {
    this.isThrusting = false;

    if (this.cursors.up!.isDown || this.cursors.space) {
      if (this.cursors.up!.isDown || this.input.keyboard!.checkDown(this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 0)) {
        this.isThrusting = true;
      }
    }
    if (this.cursors.up!.isDown) this.isThrusting = true;

    if (this.cursors.left!.isDown || this.keyA.isDown) {
      this.angularVel -= 60 * dt;
    }
    if (this.cursors.right!.isDown || this.keyD.isDown) {
      this.angularVel += 60 * dt;
    }

    this.angularVel *= Math.pow(0.85, dt * 60);
    this.angle += this.angularVel * dt;
  }

  private applyPhysics(dt: number) {
    const g = this.cfg.params.gravity;
    this.vy += g * dt;

    // Wind drift
    if (this.cfg.params.windDrift > 0) {
      this.vx += Math.sin(this.timeElapsed * 0.3) * this.cfg.params.windDrift * dt;
    }

    if (this.isThrusting && this.fuel > 0) {
      const thrust = 15; // m/s²
      const rad = Phaser.Math.DegToRad(this.angle - 90);
      this.vx += Math.cos(rad) * thrust * dt;
      this.vy += Math.sin(rad) * thrust * dt;
      this.fuel = Math.max(0, this.fuel - 12 * dt);

      // Particles
      const rad2 = Phaser.Math.DegToRad(this.angle + 90);
      for (let i = 0; i < 3; i++) {
        this.particleTrail.push({
          x: this.lx + Math.cos(rad2) * 28 + Phaser.Math.Between(-4, 4),
          y: this.ly + Math.sin(rad2) * 28 + Phaser.Math.Between(-4, 4),
          life: 1.0,
        });
      }
    }

    if (this.fuel <= 0) this.isThrusting = false;

    this.lx += this.vx * dt * 50;
    this.ly += this.vy * dt * 50;

    // Scroll world to keep lander in upper half
    const H = this.cameras.main.height;
    const targetY = H * 0.35;
    const diff = this.ly - targetY;
    if (diff > 0) {
      this.worldOffsetY -= diff * 0.05;
      this.ly -= diff * 0.05;
    }

    // Clamp horizontal
    const W = this.cameras.main.width;
    this.lx = Phaser.Math.Clamp(this.lx, 20, W - 20);
  }

  private updateParticles(dt: number) {
    for (let i = this.particleTrail.length - 1; i >= 0; i--) {
      this.particleTrail[i].life -= dt * 2;
      if (this.particleTrail[i].life <= 0) this.particleTrail.splice(i, 1);
    }
    this.particleGfx.clear();
    for (const p of this.particleTrail) {
      const col = p.life > 0.6 ? 0xfbbf24 : (p.life > 0.3 ? 0xf97316 : 0xef4444);
      this.particleGfx.fillStyle(col, p.life);
      this.particleGfx.fillCircle(p.x, p.y + this.worldOffsetY * 0.1, 3 * p.life);
    }
  }

  private updateLander() {
    this.landerContainer.setPosition(this.lx, this.ly);
    this.landerContainer.setAngle(this.angle);
    this.landerGfx.clear();
    this.drawLander(this.landerGfx);
    this.flameGfx.clear();
    if (this.isThrusting) {
      const fl = 20 + Math.random() * 15;
      this.flameGfx.fillStyle(0xfef08a, 0.9);
      this.flameGfx.fillTriangle(-4, 17, 4, 17, 0, 17 + fl);
      this.flameGfx.fillStyle(0xf97316, 0.6);
      this.flameGfx.fillTriangle(-6, 17, 6, 17, 0, 17 + fl * 1.4);
    }
  }

  private checkLanding() {
    const groundY = this.getGroundY(this.lx) + this.worldOffsetY;
    const landerBottom = this.ly + 26; // footpad bottom

    if (landerBottom >= groundY) {
      this.done = true;
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      const inZone = Math.abs(this.lx - this.targetX) < this.cfg.params.targetZoneWidthPx / 2;
      const angleSafe = Math.abs(this.angle % 360) < 20 || Math.abs(this.angle % 360) > 340;
      const crashSpeed = 3.5;

      if (speed > crashSpeed || !angleSafe) {
        this.fail(`Landing too hard! Impact speed: ${speed.toFixed(2)} m/s — lander destroyed.`);
      } else if (!inZone && this.cfg.params.targetZoneWidthPx > 0) {
        const offBy = Math.abs(this.lx - this.targetX).toFixed(0);
        this.fail(`Landed ${offBy}px off target zone. Required precision landing.`);
      } else {
        // Check hazard collision
        for (const hz of this.hazardZones) {
          if (Math.abs(this.lx - hz.x) < hz.w / 2 + 20) {
            this.fail('Landed on a boulder hazard — mission abort.');
            return;
          }
        }
        const score = Math.round(
          80 - speed * 10 +
          (this.fuel / this.cfg.params.fuelCapacity) * 20 -
          (Math.abs(this.lx - this.targetX) / (this.cfg.params.targetZoneWidthPx || 200)) * 10
        );
        this.success(Math.max(10, Math.min(100, score)));
      }
    }
  }

  private fail(reason: string) {
    this.done = true;
    this.cameras.main.shake(300, 0.025);
    this.showResult(false, reason);
    this.cfg.onFailure(reason);
  }

  private success(score: number) {
    this.showResult(true, `Landed! Score: ${score}  Fuel remaining: ${this.fuel.toFixed(1)}%`);
    this.cfg.onSuccess(score);
  }

  private showResult(ok: boolean, msg: string) {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const bg = this.add.graphics().setDepth(50);
    bg.fillStyle(0x000000, 0.75);
    bg.fillRect(0, 0, W, H);
    this.add.text(W / 2, H / 2 - 40, ok ? '🌑 TOUCHDOWN!' : '💥 CRASH LANDING', {
      fontFamily: 'monospace', fontSize: '30px', color: ok ? '#22c55e' : '#ef4444',
    }).setOrigin(0.5).setDepth(51);
    this.add.text(W / 2, H / 2 + 20, msg, {
      fontFamily: 'monospace', fontSize: '13px', color: '#cbd5e1',
      wordWrap: { width: W - 80 }, align: 'center',
    }).setOrigin(0.5).setDepth(51);
  }

  private updateHUD() {
    const groundY = this.getGroundY(this.lx) + this.worldOffsetY;
    const alt = Math.max(0, groundY - this.ly - 26);
    const altScaled = (alt / 400) * this.cfg.params.altitudeStartM;
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const tLeft = Math.max(0, this.cfg.params.timeLimitSec - this.timeElapsed).toFixed(0);
    const fuelPct = (this.fuel / this.cfg.params.fuelCapacity * 100).toFixed(0);
    const distToZone = Math.abs(this.lx - this.targetX).toFixed(0);

    this.hudText.setText([
      `ALT: ${altScaled.toFixed(0)}m`,
      `SPEED: ${speed.toFixed(2)} m/s ${speed > 3 ? '⚠' : '✓'}`,
      `FUEL: ${fuelPct}%`,
      `ANGLE: ${this.angle.toFixed(1)}°`,
      `DIST TO ZONE: ${distToZone}px`,
      `TIME: ${tLeft}s`,
    ].join('\n'));

    if (speed > 4) {
      this.warningText.setText('⚠ HIGH DESCENT RATE — BRAKE!');
    } else if (this.fuel < 15) {
      this.warningText.setText('⚠ LOW FUEL');
    } else {
      this.warningText.setText('');
    }
  }
}
