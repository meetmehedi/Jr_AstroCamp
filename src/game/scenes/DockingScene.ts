// ============================================================
// DockingScene — Phaser 3 scene for orbital docking mini-games
// Covers: Gemini rendezvous, Apollo CSM, Shuttle-ISS, OSIRIS-REx
// ============================================================
import Phaser from 'phaser';
import type { DockingParams } from '../missionGameData';

export interface DockingSceneConfig {
  missionId: string;
  missionName: string;
  params: DockingParams;
  onSuccess: (score: number) => void;
  onFailure: (reason: string) => void;
}

export class DockingScene extends Phaser.Scene {
  private cfg!: DockingSceneConfig;

  // Objects
  private probe!: Phaser.GameObjects.Container;
  private probeGfx!: Phaser.GameObjects.Graphics;
  private targetStation!: Phaser.GameObjects.Container;
  private targetGfx!: Phaser.GameObjects.Graphics;
  private portIndicator!: Phaser.GameObjects.Graphics;

  // Physics (manual)
  private vx = 0;
  private vy = 0;
  private angularVel = 0;
  private probeAngle = 0;
  private px = 0;
  private py = 0;
  private targetX = 0;
  private targetY = 0;

  // State
  private distanceToPort = 0;
  private relativeSpeed = 0;
  private lockTimer = 0;
  private isDocked = false;
  private timeElapsed = 0;
  private successRegistered = false;

  // UI
  private hud!: Phaser.GameObjects.Container;
  private hudText!: Phaser.GameObjects.Text;
  private approachBar!: Phaser.GameObjects.Graphics;
  private speedBar!: Phaser.GameObjects.Graphics;
  private alignBar!: Phaser.GameObjects.Graphics;
  private dockRing!: Phaser.GameObjects.Graphics;
  private warningText!: Phaser.GameObjects.Text;
  private starsGfx!: Phaser.GameObjects.Graphics;

  // Touch / keyboard
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyQ!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'DockingScene' });
  }

  init(data: DockingSceneConfig) {
    this.cfg = data;
    this.vx = 0; this.vy = 0; this.angularVel = 0;
    this.probeAngle = 0;
    this.lockTimer = 0;
    this.isDocked = false;
    this.timeElapsed = 0;
    this.successRegistered = false;
  }

  create() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    this.cameras.main.setBackgroundColor('#020617');

    // Stars
    this.starsGfx = this.add.graphics().setDepth(0);
    this.drawStars();

    // Target station (docking port side)
    this.targetX = W * 0.72;
    this.targetY = H * 0.5;
    this.targetStation = this.add.container(this.targetX, this.targetY).setDepth(3);
    this.targetGfx = this.add.graphics();
    this.drawTargetStation();
    this.targetStation.add(this.targetGfx);

    // Docking port indicator ring
    this.dockRing = this.add.graphics().setDepth(4);
    this.drawDockPort();

    // Probe (player spacecraft)
    this.px = W * 0.18;
    this.py = H * 0.5;
    // Approach speed initial
    this.vx = this.cfg.params.maxApproachSpeedMs * 0.3;
    this.vy = 0;

    this.probe = this.add.container(this.px, this.py).setDepth(5);
    this.probeGfx = this.add.graphics();
    this.drawProbe(this.probeGfx, 0);
    this.probe.add(this.probeGfx);

    // Port indicator
    this.portIndicator = this.add.graphics().setDepth(6);

    // HUD
    this.buildHUD(W, H);

    // Warning text
    this.warningText = this.add.text(W / 2, H - 50, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ef4444',
    }).setOrigin(0.5).setDepth(20);

    // Controls hint
    this.add.text(W / 2, H - 22, 'W/S — Forward/Back  |  A/D — Left/Right  |  Q/E — Roll  |  ←/→ — Lateral', {
      fontFamily: 'monospace', fontSize: '11px', color: '#475569',
    }).setOrigin(0.5).setDepth(20);

    // Keys
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyQ = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyE = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.buildTouchControls(W, H);
  }

  private drawStars() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    this.starsGfx.clear();
    this.starsGfx.fillStyle(0xffffff, 1);
    for (let i = 0; i < 200; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H);
      const r = Math.random() * 1.5 + 0.3;
      const alpha = Math.random() * 0.7 + 0.3;
      this.starsGfx.fillStyle(0xffffff, alpha);
      this.starsGfx.fillCircle(x, y, r);
    }
  }

  private drawTargetStation() {
    this.targetGfx.clear();
    // Main body
    this.targetGfx.fillStyle(0x94a3b8, 1);
    this.targetGfx.fillRect(-30, -15, 60, 30);
    // Solar arrays
    this.targetGfx.fillStyle(0x1e40af, 0.9);
    this.targetGfx.fillRect(-80, -8, 45, 16);
    this.targetGfx.fillRect(35, -8, 45, 16);
    // Module dome
    this.targetGfx.fillStyle(0xc0c0c0, 1);
    this.targetGfx.fillCircle(-30, 0, 14);
    // Docking collar (left side — where probe approaches from)
    this.targetGfx.fillStyle(0xfbbf24, 1);
    this.targetGfx.fillRect(-42, -6, 12, 12);
  }

  private drawDockPort() {
    this.dockRing.clear();
    const r = this.cfg.params.portDiameterPx / 2;
    // Outer ring
    this.dockRing.lineStyle(3, 0xfbbf24, 0.8);
    this.dockRing.strokeCircle(this.targetX - 42, this.targetY, r);
    // Inner crosshair
    this.dockRing.lineStyle(1, 0xfbbf24, 0.5);
    this.dockRing.lineBetween(this.targetX - 42 - r, this.targetY, this.targetX - 42 + r, this.targetY);
    this.dockRing.lineBetween(this.targetX - 42, this.targetY - r, this.targetX - 42, this.targetY + r);
  }

  private drawProbe(g: Phaser.GameObjects.Graphics, _angle?: number) {
    g.clear();
    // Body
    g.fillStyle(0xe2e8f0, 1);
    g.fillRect(-12, -10, 35, 20);
    // Nose / docking probe tip
    g.fillStyle(0xfbbf24, 1);
    g.fillRect(23, -4, 14, 8);
    g.fillTriangle(37, -4, 37, 12, 48, 4);
    // Solar panels
    g.fillStyle(0x2563eb, 0.9);
    g.fillRect(-18, -22, 10, 18);
    g.fillRect(-18, 4, 10, 18);
    // Thruster nozzles
    g.fillStyle(0x475569, 1);
    g.fillRect(-16, -10, 6, 5);
    g.fillRect(-16, 5, 6, 5);
  }

  private buildHUD(W: number, _H: number) {
    this.hud = this.add.container(0, 0).setDepth(20);
    const panel = this.add.graphics();
    panel.fillStyle(0x0f172a, 0.85);
    panel.fillRoundedRect(10, 10, 220, 150, 8);
    this.hud.add(panel);

    this.hudText = this.add.text(20, 18, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#94a3b8',
      lineSpacing: 5,
    }).setDepth(21);

    // Approach bar labels
    this.add.text(W - 120, 10, 'APPROACH', { fontFamily: 'monospace', fontSize: '10px', color: '#64748b' }).setDepth(21);
    this.add.text(W - 120, 60, 'SPEED', { fontFamily: 'monospace', fontSize: '10px', color: '#64748b' }).setDepth(21);
    this.add.text(W - 120, 110, 'ALIGN', { fontFamily: 'monospace', fontSize: '10px', color: '#64748b' }).setDepth(21);

    this.approachBar = this.add.graphics().setDepth(21);
    this.speedBar = this.add.graphics().setDepth(21);
    this.alignBar = this.add.graphics().setDepth(21);
  }

  private buildTouchControls(W: number, H: number) {
    const makeBtn = (x: number, y: number, label: string, cb: (active: boolean) => void) => {
      const g = this.add.graphics().setDepth(30);
      g.fillStyle(0x1e293b, 0.8);
      g.fillRoundedRect(x - 28, y - 28, 56, 56, 8);
      this.add.text(x, y, label, { fontFamily: 'monospace', fontSize: '20px', color: '#ffffff' }).setOrigin(0.5).setDepth(31);
      const zone = this.add.zone(x, y, 56, 56).setInteractive().setDepth(32);
      zone.on('pointerdown', () => cb(true));
      zone.on('pointerup', () => cb(false));
    };
    makeBtn(W - 180, H - 100, '▲', (a) => { if (a) this.vx += this.cfg.params.thrusterStrength * 0.3; });
    makeBtn(W - 180, H - 40, '▼', (a) => { if (a) this.vx -= this.cfg.params.thrusterStrength * 0.3; });
    makeBtn(W - 250, H - 70, '◄', (a) => { if (a) this.vy -= this.cfg.params.thrusterStrength * 0.3; });
    makeBtn(W - 110, H - 70, '►', (a) => { if (a) this.vy += this.cfg.params.thrusterStrength * 0.3; });
  }

  update(_time: number, delta: number) {
    if (this.successRegistered) return;
    const dt = delta / 1000;
    this.timeElapsed += dt;

    this.handleInput(dt);
    this.applyPhysics(dt);
    this.checkDocking();
    this.updateVisuals();
    this.updateHUD();

    // Time limit
    if (this.timeElapsed > this.cfg.params.timeLimitSec && !this.isDocked) {
      this.fail('Time limit exceeded — failed to dock in time.');
    }
  }

  private handleInput(dt: number) {
    const t = this.cfg.params.thrusterStrength;
    if (this.keyW.isDown || this.cursors.up!.isDown) this.vx += t * dt;
    if (this.keyS.isDown || this.cursors.down!.isDown) this.vx -= t * dt;
    if (this.keyA.isDown) this.vy -= t * dt;
    if (this.keyD.isDown) this.vy += t * dt;
    if (this.cursors.left!.isDown) this.vy -= t * 0.5 * dt;
    if (this.cursors.right!.isDown) this.vy += t * 0.5 * dt;
    if (this.cfg.params.hasRollAxis) {
      if (this.keyQ.isDown) this.angularVel -= 20 * dt;
      if (this.keyE.isDown) this.angularVel += 20 * dt;
    }
  }

  private applyPhysics(dt: number) {
    const d = this.cfg.params.damping;
    this.vx *= Math.pow(d, dt * 60);
    this.vy *= Math.pow(d, dt * 60);
    this.angularVel *= Math.pow(d, dt * 60);

    this.px += this.vx * dt * 60;
    this.py += this.vy * dt * 60;
    this.probeAngle += this.angularVel * dt;

    // Clamp to screen
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    this.px = Phaser.Math.Clamp(this.px, 20, W - 20);
    this.py = Phaser.Math.Clamp(this.py, 20, H - 20);

    this.probe.setPosition(this.px, this.py);
    this.probe.setAngle(this.probeAngle);
  }

  private checkDocking() {
    const portX = this.targetX - 42;
    const portY = this.targetY;
    const dx = this.px + 48 * Math.cos(Phaser.Math.DegToRad(this.probeAngle)) - portX;
    const dy = this.py + 48 * Math.sin(Phaser.Math.DegToRad(this.probeAngle)) - portY;
    this.distanceToPort = Math.sqrt(dx * dx + dy * dy);
    this.relativeSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

    const portR = this.cfg.params.portDiameterPx / 2;
    const maxSpeed = this.cfg.params.maxApproachSpeedMs;

    if (this.distanceToPort < portR) {
      if (this.relativeSpeed > maxSpeed * 3) {
        // Hard dock / crash
        this.fail(`Approach speed too high (${this.relativeSpeed.toFixed(2)} m/s) — docking collar damaged.`);
        return;
      }
      // Soft approach
      const dt = 0.016;
      this.lockTimer += dt;
      if (this.lockTimer > 1.5) {
        this.successRegistered = true;
        const score = Math.round(100 - (this.relativeSpeed / maxSpeed) * 40 + (1 - this.timeElapsed / this.cfg.params.timeLimitSec) * 30);
        this.showResult(true, `DOCKED! ✅  Speed: ${this.relativeSpeed.toFixed(3)} m/s`);
        this.cfg.onSuccess(Math.max(10, score));
      }
    } else {
      this.lockTimer = 0;
    }
  }

  private updateVisuals() {
    const W = this.cameras.main.width;

    // Redraw probe with current angle
    this.drawProbe(this.probeGfx, this.probeAngle);

    // Port indicator line
    this.portIndicator.clear();
    const portX = this.targetX - 42;
    const portY = this.targetY;
    const col = this.distanceToPort < this.cfg.params.portDiameterPx ? 0x22c55e : 0x3b82f6;
    this.portIndicator.lineStyle(1, col, 0.4);
    this.portIndicator.lineBetween(this.px, this.py, portX, portY);

    // Distance rings around dock port
    this.dockRing.clear();
    this.drawDockPort();
    const r = this.cfg.params.portDiameterPx / 2;
    if (this.distanceToPort < r * 4) {
      this.dockRing.lineStyle(1, 0x06b6d4, 0.3);
      this.dockRing.strokeCircle(portX, portY, r * 3);
    }

    // Approach bars
    const approachPct = Math.max(0, 1 - this.distanceToPort / 300);
    const speedPct = Math.min(1, this.relativeSpeed / (this.cfg.params.maxApproachSpeedMs * 4));
    const alignDeg = Math.abs(this.probeAngle % 360);
    const alignPct = Math.max(0, 1 - alignDeg / 45);

    this.drawBar(this.approachBar, W - 110, 22, 95, 14, approachPct, 0x22c55e);
    this.drawBar(this.speedBar, W - 110, 72, 95, 14, 1 - speedPct, speedPct > 0.5 ? 0xef4444 : 0x22c55e);
    this.drawBar(this.alignBar, W - 110, 122, 95, 14, alignPct, 0x06b6d4);

    // Warnings
    if (this.relativeSpeed > this.cfg.params.maxApproachSpeedMs * 2) {
      this.warningText.setText('⚠ APPROACH SPEED TOO HIGH — BRAKE NOW');
    } else if (this.lockTimer > 0.2) {
      this.warningText.setText('🟢 CAPTURE IN PROGRESS — HOLD STEADY');
    } else {
      this.warningText.setText('');
    }
  }

  private drawBar(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, pct: number, color: number) {
    g.clear();
    g.fillStyle(0x1e293b, 1);
    g.fillRoundedRect(x, y, w, h, 4);
    g.fillStyle(color, 1);
    g.fillRoundedRect(x + 1, y + 1, Math.max(0, (w - 2) * pct), h - 2, 3);
  }

  private updateHUD() {
    const dist = this.distanceToPort.toFixed(1);
    const speed = this.relativeSpeed.toFixed(3);
    const tLeft = Math.max(0, this.cfg.params.timeLimitSec - this.timeElapsed).toFixed(0);
    this.hudText.setText([
      `RANGE: ${dist} m  (target: <${this.cfg.params.portDiameterPx / 2}m)`,
      `SPEED: ${speed} m/s  (max: ${this.cfg.params.maxApproachSpeedMs})`,
      `VX: ${this.vx.toFixed(3)}  VY: ${this.vy.toFixed(3)}`,
      this.cfg.params.hasRollAxis ? `ROLL: ${this.probeAngle.toFixed(1)}°` : '',
      `TIME LEFT: ${tLeft}s`,
      `LOCK: ${(this.lockTimer / 1.5 * 100).toFixed(0)}%`,
    ].filter(Boolean).join('\n'));
  }

  private fail(reason: string) {
    if (this.successRegistered) return;
    this.successRegistered = true;
    this.showResult(false, reason);
    this.cfg.onFailure(reason);
  }

  private showResult(success: boolean, msg: string) {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const bg = this.add.graphics().setDepth(50);
    bg.fillStyle(0x000000, 0.75);
    bg.fillRect(0, 0, W, H);
    this.add.text(W / 2, H / 2 - 40, success ? '✅ DOCKED!' : '❌ DOCKING FAILED', {
      fontFamily: 'monospace', fontSize: '32px', color: success ? '#22c55e' : '#ef4444',
    }).setOrigin(0.5).setDepth(51);
    this.add.text(W / 2, H / 2 + 20, msg, {
      fontFamily: 'monospace', fontSize: '13px', color: '#cbd5e1',
      wordWrap: { width: W - 80 }, align: 'center',
    }).setOrigin(0.5).setDepth(51);
  }
}
