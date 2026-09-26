// ============================================================
// TelescopeScene — Phaser 3 scene for Space Telescope Calibration
// Covers: Hubble, JWST, Chandra, Kepler, Spitzer, Roman, TESS
// ============================================================
import Phaser from 'phaser';
import type { TelescopeParams } from '../missionGameData';

export interface TelescopeSceneConfig {
  missionId: string;
  missionName: string;
  params: TelescopeParams;
  onSuccess: (score: number) => void;
  onFailure: (reason: string) => void;
}

interface CelestialTarget {
  x: number;
  y: number;
  name: string;
  type: string;
  magnitude: number;
  solved: boolean;
  color: number;
}

export class TelescopeScene extends Phaser.Scene {
  private cfg!: TelescopeSceneConfig;

  // Visuals & Objects
  private reticleX = 400;
  private reticleY = 300;
  private targetReticleX = 400;
  private targetReticleY = 300;

  private targets: CelestialTarget[] = [];
  private currentTargetIndex = 0;
  private lockProgress = 0; // 0 to 1
  private isGameOver = false;

  private timeRemaining = 60;
  private targetsCalibrated = 0;

  // Graphics layers
  private bgGfx!: Phaser.GameObjects.Graphics;
  private starGfx!: Phaser.GameObjects.Graphics;
  private nebulaGfx!: Phaser.GameObjects.Graphics;
  private targetGfx!: Phaser.GameObjects.Graphics;
  private reticleGfx!: Phaser.GameObjects.Graphics;
  private hudGfx!: Phaser.GameObjects.Graphics;

  // HUD text
  private timerText!: Phaser.GameObjects.Text;
  private targetInfoText!: Phaser.GameObjects.Text;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  // Shimmer noise simulation
  private noiseOffset = 0;

  constructor() {
    super({ key: 'TelescopeScene' });
  }

  init(data: TelescopeSceneConfig) {
    this.cfg = data;
    this.timeRemaining = data.params.timeLimitSec || 45;
    this.lockProgress = 0;
    this.targetsCalibrated = 0;
    this.isGameOver = false;
    this.reticleX = 400;
    this.reticleY = 300;
    this.targetReticleX = 400;
    this.targetReticleY = 300;
    this.noiseOffset = Math.random() * 1000;

    // Generate targets
    const targetPool = [
      { name: 'M31 Andromeda Core', type: 'Spiral Galaxy', color: 0x60a5fa },
      { name: 'Kepler-452b Primary', type: 'G2V Exoplanet Host', color: 0xfacc15 },
      { name: 'Eagle Nebula Pillars', type: 'Star-forming Region', color: 0xec4899 },
      { name: 'Sgr A* Accretion Disk', type: 'Supermassive Black Hole', color: 0xf97316 },
      { name: 'Trappist-1 System', type: 'Ultra-cool Red Dwarf', color: 0xef4444 },
      { name: 'Crab Pulsar Wind', type: 'Neutron Star Remnant', color: 0x06b6d4 },
      { name: 'Deep Field Candidate 09', type: 'High-Redshift Galaxy z=11', color: 0xa855f7 },
    ];

    Phaser.Utils.Array.Shuffle(targetPool);
    const count = Math.min(this.cfg.params.numTargets || 3, targetPool.length);

    this.targets = [];
    for (let i = 0; i < count; i++) {
      const margin = 120;
      const x = Phaser.Math.Between(margin, 800 - margin);
      const y = Phaser.Math.Between(margin, 600 - margin);
      this.targets.push({
        x,
        y,
        name: targetPool[i].name,
        type: targetPool[i].type,
        magnitude: parseFloat((Math.random() * 8 + 4).toFixed(1)),
        solved: false,
        color: targetPool[i].color,
      });
    }
    this.currentTargetIndex = 0;
  }

  create() {
    const { width, height } = this.scale;

    this.bgGfx = this.add.graphics();
    this.nebulaGfx = this.add.graphics();
    this.starGfx = this.add.graphics();
    this.targetGfx = this.add.graphics();
    this.reticleGfx = this.add.graphics();
    this.hudGfx = this.add.graphics();

    // Render static deep space background
    this.renderSpaceBackdrop(width, height);

    // Setup HUD text elements
    this.add.text(24, 20, `${this.cfg.missionName.toUpperCase()} — SENSOR CALIBRATION`, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#38bdf8',
      fontStyle: 'bold',
    });

    this.timerText = this.add.text(width - 24, 20, `TIME: ${this.timeRemaining.toFixed(1)}s`, {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: '#facc15',
      fontStyle: 'bold',
    }).setOrigin(1, 0);

    this.targetInfoText = this.add.text(24, 52, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#94a3b8',
      lineSpacing: 4,
    });

    this.add.text(width / 2, height - 32, 'MOUSE / ARROW KEYS: Align Reticle | HOLD ON TARGET TO LOCK & INTEGRATE SPECTRA', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#64748b',
    }).setOrigin(0.5, 0.5);

    // Input handlers
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown || true) {
        this.targetReticleX = pointer.x;
        this.targetReticleY = pointer.y;
      }
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.targetReticleX = pointer.x;
      this.targetReticleY = pointer.y;
    });
  }

  private renderSpaceBackdrop(width: number, height: number) {
    this.bgGfx.clear();
    this.bgGfx.fillStyle(0x030712, 1);
    this.bgGfx.fillRect(0, 0, width, height);

    // Deep space stars
    this.starGfx.clear();
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() < 0.9 ? 1 : 2;
      const alpha = Math.random() * 0.7 + 0.3;
      this.starGfx.fillStyle(0xffffff, alpha);
      this.starGfx.fillCircle(x, y, radius);
    }

    // Telescope grid lines / polar coordinate grid
    this.nebulaGfx.clear();
    this.nebulaGfx.lineStyle(1, 0x1e293b, 0.5);
    for (let r = 80; r <= 450; r += 80) {
      this.nebulaGfx.strokeCircle(width / 2, height / 2, r);
    }
    this.nebulaGfx.lineStyle(1, 0x1e293b, 0.3);
    this.nebulaGfx.lineBetween(width / 2, 0, width / 2, height);
    this.nebulaGfx.lineBetween(0, height / 2, width, height / 2);
  }

  update(_time: number, delta: number) {
    if (this.isGameOver) return;
    const dt = delta / 1000;

    // Countdown
    this.timeRemaining -= dt;
    this.timerText.setText(`TIME: ${Math.max(0, this.timeRemaining).toFixed(1)}s`);
    if (this.timeRemaining <= 10) {
      this.timerText.setColor('#ef4444');
    }

    if (this.timeRemaining <= 0) {
      this.isGameOver = true;
      this.cfg.onFailure('Observation window closed before all targets calibrated.');
      return;
    }

    // Keyboard movement
    const speed = 320;
    if (this.cursors.left.isDown || this.keyA?.isDown) this.targetReticleX -= speed * dt;
    if (this.cursors.right.isDown || this.keyD?.isDown) this.targetReticleX += speed * dt;
    if (this.cursors.up.isDown || this.keyW?.isDown) this.targetReticleY -= speed * dt;
    if (this.cursors.down.isDown || this.keyS?.isDown) this.targetReticleY += speed * dt;

    // Clamp
    this.targetReticleX = Phaser.Math.Clamp(this.targetReticleX, 60, 740);
    this.targetReticleY = Phaser.Math.Clamp(this.targetReticleY, 60, 540);

    // Apply shimmer jitter & drift if enabled
    this.noiseOffset += dt * 3;
    const shimmerAmp = (this.cfg.params.shimmerAmplitude || 0.2) * 16;
    const jitterX = Math.sin(this.noiseOffset) * shimmerAmp;
    const jitterY = Math.cos(this.noiseOffset * 1.3) * shimmerAmp;

    let driftX = 0;
    let driftY = 0;
    if (this.cfg.params.hasDrift) {
      driftX = Math.sin(this.noiseOffset * 0.4) * 8;
      driftY = Math.cos(this.noiseOffset * 0.3) * 6;
    }

    // Smooth reticle dampening
    this.reticleX += (this.targetReticleX + jitterX + driftX - this.reticleX) * 0.18;
    this.reticleY += (this.targetReticleY + jitterY + driftY - this.reticleY) * 0.18;

    // Active target
    const currentTarget = this.targets[this.currentTargetIndex];
    if (!currentTarget) return;

    const dist = Phaser.Math.Distance.Between(this.reticleX, this.reticleY, currentTarget.x, currentTarget.y);
    const lockRadius = this.cfg.params.targetSizePx || 45;

    if (dist <= lockRadius) {
      // Locking on!
      const lockRate = 1 / (this.cfg.params.lockTimeSec || 2.2);
      this.lockProgress = Math.min(1, this.lockProgress + dt * lockRate);

      if (this.lockProgress >= 1) {
        // Target solved!
        currentTarget.solved = true;
        this.targetsCalibrated++;
        this.lockProgress = 0;

        // Sparkle / burst effect
        this.triggerLockBurst(currentTarget.x, currentTarget.y, currentTarget.color);

        if (this.targetsCalibrated >= this.targets.length) {
          this.isGameOver = true;
          const score = Math.round(1000 + this.timeRemaining * 40);
          this.timeRemaining = 0;
          this.timerText.setText('COMPLETE!');
          this.timerText.setColor('#10b981');
          this.time.delayedCall(800, () => {
            this.cfg.onSuccess(score);
          });
          return;
        } else {
          this.currentTargetIndex++;
        }
      }
    } else {
      // Decay lock when off target
      this.lockProgress = Math.max(0, this.lockProgress - dt * 1.5);
    }

    this.renderReticle(lockRadius, dist);
    this.renderTargets();
    this.updateHUD(currentTarget, dist);
  }

  private triggerLockBurst(x: number, y: number, color: number) {
    const flash = this.add.graphics();
    flash.fillStyle(color, 0.7);
    flash.fillCircle(x, y, 40);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 2.2,
      duration: 500,
      onComplete: () => flash.destroy(),
    });
  }

  private renderReticle(lockRadius: number, dist: number) {
    this.reticleGfx.clear();
    const rx = this.reticleX;
    const ry = this.reticleY;

    const locked = dist <= lockRadius;
    const color = locked ? (this.lockProgress > 0.8 ? 0x10b981 : 0x38bdf8) : 0x94a3b8;

    // Crosshair rings
    this.reticleGfx.lineStyle(1.5, color, 0.85);
    this.reticleGfx.strokeCircle(rx, ry, lockRadius);
    this.reticleGfx.strokeCircle(rx, ry, 8);

    // Cross lines with gap
    this.reticleGfx.lineBetween(rx - lockRadius - 15, ry, rx - 14, ry);
    this.reticleGfx.lineBetween(rx + 14, ry, rx + lockRadius + 15, ry);
    this.reticleGfx.lineBetween(rx, ry - lockRadius - 15, rx, ry - 14);
    this.reticleGfx.lineBetween(rx, ry + 14, rx, ry + lockRadius + 15);

    // Lock progress arc
    if (this.lockProgress > 0) {
      this.reticleGfx.lineStyle(4, 0x10b981, 0.95);
      this.reticleGfx.beginPath();
      const startAngle = Phaser.Math.DegToRad(-90);
      const endAngle = startAngle + Phaser.Math.DegToRad(360 * this.lockProgress);
      this.reticleGfx.arc(rx, ry, lockRadius + 6, startAngle, endAngle, false);
      this.reticleGfx.strokePath();
    }
  }

  private renderTargets() {
    this.targetGfx.clear();

    this.targets.forEach((t, idx) => {
      const isCurrent = idx === this.currentTargetIndex;

      if (t.solved) {
        // Solved target marker
        this.targetGfx.lineStyle(2, 0x10b981, 0.7);
        this.targetGfx.strokeCircle(t.x, t.y, 14);
        this.targetGfx.fillStyle(0x10b981, 0.2);
        this.targetGfx.fillCircle(t.x, t.y, 14);
      } else if (isCurrent) {
        // Target glow & pulse
        const pulse = 1 + Math.sin(this.time.now * 0.005) * 0.15;
        this.targetGfx.fillStyle(t.color, 0.35);
        this.targetGfx.fillCircle(t.x, t.y, 22 * pulse);

        this.targetGfx.lineStyle(1.5, t.color, 0.9);
        this.targetGfx.strokeCircle(t.x, t.y, 18);
        this.targetGfx.fillStyle(0xffffff, 0.9);
        this.targetGfx.fillCircle(t.x, t.y, 3);

        // Dashed bracket box
        const s = 24;
        this.targetGfx.lineStyle(1, t.color, 0.6);
        this.targetGfx.strokeRect(t.x - s, t.y - s, s * 2, s * 2);
      } else {
        // Future targets dim
        this.targetGfx.fillStyle(0x475569, 0.5);
        this.targetGfx.fillCircle(t.x, t.y, 5);
      }
    });
  }

  private updateHUD(currentTarget: CelestialTarget, dist: number) {
    const lockPct = Math.round(this.lockProgress * 100);
    const targetStatus = dist <= (this.cfg.params.targetSizePx || 45)
      ? `[ INTEGRATING DATA: ${lockPct}% ]`
      : `[ OFF-TARGET: Δ${Math.round(dist)}px ]`;

    this.targetInfoText.setText(
      `TARGET [${this.currentTargetIndex + 1}/${this.targets.length}]: ${currentTarget.name}\n` +
      `TYPE: ${currentTarget.type} | MAG: +${currentTarget.magnitude}\n` +
      `STATUS: ${targetStatus}`
    );

    // Dynamic HUD alignment bars on side
    this.hudGfx.clear();
    const barX = 760;
    const barY = 120;
    const barH = 200;
    this.hudGfx.fillStyle(0x0f172a, 0.8);
    this.hudGfx.fillRect(barX, barY, 12, barH);
    this.hudGfx.lineStyle(1, 0x334155, 1);
    this.hudGfx.strokeRect(barX, barY, 12, barH);

    // Fill lock height
    const fillH = barH * this.lockProgress;
    this.hudGfx.fillStyle(this.lockProgress > 0.8 ? 0x10b981 : 0x0284c7, 1);
    this.hudGfx.fillRect(barX + 2, barY + barH - fillH, 8, fillH);
  }
}
