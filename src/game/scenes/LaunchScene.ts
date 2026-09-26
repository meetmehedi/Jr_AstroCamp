// ============================================================
// LaunchScene — Phaser 3 scene for rocket ascent mini-games
// Covers: Mercury, Gemini tests, Shuttle launches
// ============================================================
import Phaser from 'phaser';
import type { LaunchParams } from '../missionGameData';

export interface LaunchSceneConfig {
  missionId: string;
  missionName: string;
  params: LaunchParams;
  onSuccess: (score: number) => void;
  onFailure: (reason: string) => void;
}

export class LaunchScene extends Phaser.Scene {
  private cfg!: LaunchSceneConfig;

  // Rocket physics
  private rocket!: Phaser.GameObjects.Container;
  private rocketBody!: Phaser.GameObjects.Graphics;
  private flameParticles!: Phaser.GameObjects.Graphics;
  private trailPoints: { x: number; y: number }[] = [];

  // Guidance
  private guidanceLine!: Phaser.GameObjects.Graphics;
  private guidanceAngle = -80; // degrees from horizontal (target: straight up-ish)
  private currentAngle = -80;

  // State
  private fuel = 100;
  private altitude = 0;
  private velocity = 0;
  private throttle = 0;
  private timeElapsed = 0;
  private phase: 'countdown' | 'ascent' | 'staging' | 'orbit' | 'done' = 'countdown';
  private countdown = 3;
  private stagesSeparated = false;
  private successRegistered = false;

  // UI elements
  private altitudeBar!: Phaser.GameObjects.Graphics;
  private fuelBar!: Phaser.GameObjects.Graphics;
  private velBar!: Phaser.GameObjects.Graphics;
  private hud!: Phaser.GameObjects.Container;
  private hudText!: Phaser.GameObjects.Text;
  private phaseText!: Phaser.GameObjects.Text;
  private countdownText!: Phaser.GameObjects.Text;
  private targetZone!: Phaser.GameObjects.Graphics;

  // Stars background
  private stars: { x: number; y: number; size: number; speed: number }[] = [];
  private starsGfx!: Phaser.GameObjects.Graphics;

  // Scroll
  private scrollY = 0;
  private groundY = 0;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'LaunchScene' });
  }

  init(data: LaunchSceneConfig) {
    this.cfg = data;
    this.fuel = this.cfg.params.fuelCapacity;
    this.altitude = 0;
    this.velocity = 0;
    this.throttle = 0;
    this.timeElapsed = 0;
    this.phase = 'countdown';
    this.countdown = 3;
    this.stagesSeparated = false;
    this.successRegistered = false;
    this.trailPoints = [];
    this.scrollY = 0;
  }

  create() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    this.groundY = H - 80;

    // Star field
    this.starsGfx = this.add.graphics();
    for (let i = 0; i < 180; i++) {
      this.stars.push({
        x: Phaser.Math.Between(0, W),
        y: Phaser.Math.Between(0, H),
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
      });
    }

    // Target zone line (altitude indicator)
    this.targetZone = this.add.graphics();
    this.drawTargetZone();

    // Guidance arc
    this.guidanceLine = this.add.graphics();

    // Rocket container
    this.rocket = this.add.container(W / 2, this.groundY - 30);
    this.rocketBody = this.add.graphics();
    this.flameParticles = this.add.graphics();
    this.drawRocket(this.rocketBody);
    this.rocket.add([this.rocketBody, this.flameParticles]);

    // HUD overlay
    this.buildHUD();

    // Countdown text
    this.countdownText = this.add.text(W / 2, H / 2, 'T-3', {
      fontFamily: 'monospace',
      fontSize: '64px',
      color: '#f97316',
      stroke: '#000',
      strokeThickness: 6,
    }).setOrigin(0.5).setDepth(20);

    // Phase banner
    this.phaseText = this.add.text(W / 2, 24, 'AWAITING LAUNCH', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#94a3b8',
    }).setOrigin(0.5).setDepth(20);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Mobile touch buttons
    this.buildTouchControls();

    // Instructions
    this.add.text(W / 2, H - 20, 'W/↑ Throttle Up  |  S/↓ Throttle Down  |  A/D ← → Steer', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#64748b',
    }).setOrigin(0.5).setDepth(20);
  }

  private drawRocket(g: Phaser.GameObjects.Graphics) {
    g.clear();
    // Body
    g.fillStyle(0xc0c0c0, 1);
    g.fillRect(-8, -40, 16, 60);
    // Nose cone
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(-8, -40, 8, -40, 0, -70);
    // Fins
    g.fillStyle(0xdc2626, 1);
    g.fillTriangle(-8, 10, -22, 30, -8, 30);
    g.fillTriangle(8, 10, 22, 30, 8, 30);
    // Stage separator (if applicable)
    if (this.cfg.params.hasStageSeparation && !this.stagesSeparated) {
      g.lineStyle(2, 0xfbbf24, 1);
      g.lineBetween(-8, -5, 8, -5);
    }
  }

  private drawFlame(g: Phaser.GameObjects.Graphics) {
    g.clear();
    if (this.throttle < 0.05 || this.phase === 'countdown') return;
    const flameH = 20 + this.throttle * 60;
    const alpha = 0.6 + this.throttle * 0.4;
    // Outer flame
    g.fillStyle(0xf97316, alpha * 0.7);
    g.fillTriangle(-10, 30, 10, 30, 0, 30 + flameH * 1.2);
    // Inner flame
    g.fillStyle(0xfef08a, alpha);
    g.fillTriangle(-5, 30, 5, 30, 0, 30 + flameH * 0.7);
    // Core
    g.fillStyle(0xffffff, alpha);
    g.fillTriangle(-2, 30, 2, 30, 0, 30 + flameH * 0.3);
  }

  private drawTargetZone() {
    this.targetZone.clear();
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const targetNorm = Math.min(this.cfg.params.targetAltitudeKm / 400, 1);
    const y = H - 60 - targetNorm * (H - 100);
    this.targetZone.lineStyle(2, 0x22c55e, 0.6);
    this.targetZone.lineBetween(0, y, W, y);
    this.targetZone.fillStyle(0x22c55e, 0.15);
    this.targetZone.fillRect(0, y - 20, W, 40);
    this.targetZone.setDepth(5);
  }

  private buildHUD() {
    this.hud = this.add.container(0, 0).setDepth(20);

    // Background panel
    const panel = this.add.graphics();
    panel.fillStyle(0x0f172a, 0.85);
    panel.fillRoundedRect(10, 10, 200, 130, 8);
    this.hud.add(panel);

    this.hudText = this.add.text(20, 20, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#94a3b8',
      lineSpacing: 6,
    });
    this.hud.add(this.hudText);

    // Bars
    this.altitudeBar = this.add.graphics();
    this.fuelBar = this.add.graphics();
    this.velBar = this.add.graphics();
    this.hud.add([this.altitudeBar, this.fuelBar, this.velBar]);
  }

  private buildTouchControls() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const btnStyle = { fontFamily: 'monospace', fontSize: '24px', color: '#ffffff' };

    const makeBtn = (x: number, y: number, label: string, cb: () => void) => {
      const g = this.add.graphics().setDepth(30);
      g.fillStyle(0x1e293b, 0.8);
      g.fillRoundedRect(-30, -30, 60, 60, 8);
      g.lineStyle(1, 0x334155, 1);
      g.strokeRoundedRect(-30, -30, 60, 60, 8);
      const t = this.add.text(0, 0, label, btnStyle).setOrigin(0.5).setDepth(31);
      const zone = this.add.zone(x, y, 60, 60).setInteractive().setDepth(32);
      zone.on('pointerdown', cb);
      g.x = x; g.y = y; t.x = x; t.y = y;
    };

    makeBtn(W - 60, H - 120, '▲', () => { this.throttle = Math.min(1, this.throttle + 0.3); });
    makeBtn(W - 60, H - 50, '▼', () => { this.throttle = Math.max(0, this.throttle - 0.3); });
    makeBtn(W - 130, H - 85, '◄', () => { this.currentAngle -= 3; });
    makeBtn(W - 130 + 140, H - 85, '►', () => { this.currentAngle += 3; });
  }

  update(_time: number, delta: number) {
    const dt = delta / 1000;
    this.timeElapsed += dt;

    if (this.phase === 'countdown') {
      this.updateCountdown(dt);
      return;
    }

    if (this.phase === 'done') return;

    this.handleInput(dt);
    this.updatePhysics(dt);
    this.updateVisuals();
    this.checkWinLose();
    this.updateHUD();
  }

  private updateCountdown(dt: number) {
    this.countdown -= dt;
    const n = Math.ceil(this.countdown);
    if (this.countdown > 0) {
      this.countdownText.setText(n <= 0 ? 'IGNITION' : `T-${n}`);
    } else {
      this.countdownText.setText('LIFTOFF!');
      this.time.delayedCall(800, () => {
        this.countdownText.setVisible(false);
        this.phase = 'ascent';
        this.phaseText.setText('ASCENT PHASE — THROTTLE UP');
      });
    }
  }

  private handleInput(dt: number) {
    const steerRate = 30 * dt;

    if (Phaser.Input.Keyboard.JustDown(this.keyW) || Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
      this.throttle = Math.min(1, this.throttle + 0.1);
    }
    if (this.keyW.isDown || this.cursors.up!.isDown) {
      this.throttle = Math.min(1, this.throttle + 0.5 * dt);
    }
    if (this.keyS.isDown || this.cursors.down!.isDown) {
      this.throttle = Math.max(0, this.throttle - 0.8 * dt);
    }
    if (this.keyA.isDown || this.cursors.left!.isDown) {
      this.currentAngle = Math.max(-88, this.currentAngle - steerRate);
    }
    if (this.keyD.isDown || this.cursors.right!.isDown) {
      this.currentAngle = Math.min(-10, this.currentAngle + steerRate);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      if (this.cfg.params.hasStageSeparation && !this.stagesSeparated && this.altitude > this.cfg.params.targetAltitudeKm * 0.25) {
        this.triggerStageSeparation();
      }
    }
  }

  private triggerStageSeparation() {
    this.stagesSeparated = true;
    this.fuel = Math.min(this.fuel + 30, this.cfg.params.fuelCapacity);
    this.phaseText.setText('STAGE SEPARATION ✓ — UPPER STAGE IGNITION');
    this.drawRocket(this.rocketBody);
    // Flash effect
    this.cameras.main.flash(300, 255, 200, 100);
  }

  private updatePhysics(dt: number) {
    const thrustAccel = this.throttle * 120; // km/s²-ish scaled
    const gravity = 9.8 * 0.05; // scaled
    const drag = this.velocity * 0.02;

    // Wind
    if (this.cfg.params.windEnabled) {
      const windForce = Math.sin(this.timeElapsed * 0.5) * 3;
      this.currentAngle += windForce * dt;
    }

    // Velocity increase
    this.velocity = Math.max(0, this.velocity + (thrustAccel - gravity - drag) * dt);
    this.altitude += this.velocity * dt;

    // Fuel consumption
    if (this.throttle > 0) {
      this.fuel = Math.max(0, this.fuel - this.throttle * 8 * dt);
    }

    if (this.fuel <= 0) {
      this.throttle = 0;
    }

    // Scroll the world
    this.scrollY = (this.altitude / this.cfg.params.targetAltitudeKm) * (this.cameras.main.height - 150);

    // Stage auto-separation at 40% altitude
    if (this.cfg.params.hasStageSeparation && !this.stagesSeparated &&
      this.altitude > this.cfg.params.targetAltitudeKm * 0.4) {
      this.triggerStageSeparation();
    }
  }

  private updateVisuals() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // Draw stars (parallax)
    this.starsGfx.clear();
    const spaceAlpha = Math.min(this.altitude / (this.cfg.params.targetAltitudeKm * 0.5), 1);
    const col1 = new Phaser.Display.Color(14, 120, 200);
    const col2 = new Phaser.Display.Color(2, 6, 23);
    const skyColor = Phaser.Display.Color.Interpolate.ColorWithColor(
      col1, col2, 100, Math.floor(spaceAlpha * 100)
    );
    this.cameras.main.setBackgroundColor(`rgb(${skyColor.r},${skyColor.g},${skyColor.b})`);

    this.starsGfx.fillStyle(0xffffff, spaceAlpha);
    for (const s of this.stars) {
      const sy = (s.y - this.scrollY * s.speed * 0.3) % H;
      this.starsGfx.fillCircle(s.x, (sy + H) % H, s.size);
    }

    // Ground
    const gfx = this.guidanceLine;
    gfx.clear();
    const groundPosY = this.groundY + this.scrollY;
    if (groundPosY < H + 200) {
      gfx.fillStyle(0x1a3a1a, 1);
      gfx.fillRect(0, groundPosY, W, H);
    }

    // Guidance line
    gfx.lineStyle(2, 0x22c55e, 0.5);
    const guideRad = (this.guidanceAngle * Math.PI) / 180;
    const guideLen = 120;
    const rx = this.rocket.x;
    const ry = this.rocket.y;
    gfx.lineBetween(rx, ry, rx + Math.cos(guideRad) * guideLen, ry + Math.sin(guideRad) * guideLen);

    // Rocket position (stays at 60% from bottom while world scrolls)
    this.rocket.y = H * 0.6;
    this.rocket.angle = this.currentAngle + 90;

    // Flame
    this.drawFlame(this.flameParticles);

    // Trail
    this.trailPoints.push({ x: rx, y: this.rocket.y });
    if (this.trailPoints.length > 40) this.trailPoints.shift();
    for (let i = 1; i < this.trailPoints.length; i++) {
      const alpha = i / this.trailPoints.length * 0.4;
      gfx.fillStyle(0xf97316, alpha);
      gfx.fillCircle(this.trailPoints[i].x, this.trailPoints[i].y, 2);
    }

    // Deviation indicator
    const dev = Math.abs(this.currentAngle - this.guidanceAngle);
    const devColor = dev < this.cfg.params.trajectoryWindowDeg ? 0x22c55e : 0xef4444;
    gfx.lineStyle(3, devColor, 0.8);
    gfx.strokeRect(W - 30, 20, 20, H - 40);
    const fillH = ((this.currentAngle + 90) / 90) * (H - 44);
    gfx.fillStyle(devColor, 0.7);
    gfx.fillRect(W - 28, 22, 16, Math.max(0, fillH));
  }

  private checkWinLose() {
    if (this.successRegistered) return;
    const p = this.cfg.params;

    // Check success: reached target altitude with enough velocity
    const altOk = this.altitude >= p.targetAltitudeKm * 0.9 && this.altitude <= p.targetAltitudeKm * 1.2;
    const velOk = this.velocity >= p.targetVelocityKms * 0.8;
    const devOk = Math.abs(this.currentAngle - this.guidanceAngle) <= p.trajectoryWindowDeg;

    if (altOk && velOk && devOk) {
      this.successRegistered = true;
      this.phase = 'done';
      const score = Math.round(100 - (Math.abs(this.currentAngle - this.guidanceAngle) / p.trajectoryWindowDeg) * 30 + (this.fuel / p.fuelCapacity) * 20);
      this.showResult(true, `ORBIT ACHIEVED! Score: ${score}`);
      this.cfg.onSuccess(score);
      return;
    }

    // Check failure conditions
    if (this.fuel <= 0 && this.velocity < 1) {
      this.failAndEnd('Fuel depleted — insufficient velocity to reach orbit.');
      return;
    }
    if (this.timeElapsed > p.timeWindowSec * 2) {
      this.failAndEnd('Mission clock expired — trajectory window missed.');
    }
  }

  private failAndEnd(reason: string) {
    if (this.successRegistered) return;
    this.successRegistered = true;
    this.phase = 'done';
    this.showResult(false, reason);
    this.cfg.onFailure(reason);
  }

  private showResult(success: boolean, msg: string) {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const bg = this.add.graphics().setDepth(50);
    bg.fillStyle(0x000000, 0.7);
    bg.fillRect(0, 0, W, H);
    this.add.text(W / 2, H / 2 - 40, success ? '✅ MISSION SUCCESS' : '❌ MISSION FAILED', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: success ? '#22c55e' : '#ef4444',
    }).setOrigin(0.5).setDepth(51);
    this.add.text(W / 2, H / 2 + 20, msg, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#cbd5e1',
      wordWrap: { width: W - 80 },
      align: 'center',
    }).setOrigin(0.5).setDepth(51);
  }

  private updateHUD() {
    const p = this.cfg.params;
    const pctAlt = Math.min((this.altitude / p.targetAltitudeKm) * 100, 100).toFixed(1);
    const pctVel = Math.min((this.velocity / p.targetVelocityKms) * 100, 100).toFixed(1);
    const dev = (this.currentAngle - this.guidanceAngle).toFixed(1);
    const devColor = Math.abs(this.currentAngle - this.guidanceAngle) < p.trajectoryWindowDeg ? '#22c55e' : '#ef4444';
    this.hudText.setText([
      `ALT: ${this.altitude.toFixed(1)} / ${p.targetAltitudeKm} km  (${pctAlt}%)`,
      `VEL: ${this.velocity.toFixed(2)} / ${p.targetVelocityKms} km/s  (${pctVel}%)`,
      `FUEL: ${this.fuel.toFixed(1)} / ${p.fuelCapacity}`,
      `THROTTLE: ${(this.throttle * 100).toFixed(0)}%`,
      `DEVIATION: ${dev}° (±${p.trajectoryWindowDeg}°)`,
      `T+${this.timeElapsed.toFixed(1)}s`,
    ].join('\n'));
    this.hudText.setStyle({ color: devColor });
    this.phaseText.setText(this.phase.toUpperCase().replace('_', ' '));
  }
}
