// ============================================================
// RoverScene — Phaser 3 top-down rover navigation mini-game
// Covers: Viking, Pathfinder, Spirit/Opportunity, Curiosity, Perseverance
// ============================================================
import Phaser from 'phaser';
import type { RoverParams } from '../missionGameData';

export interface RoverSceneConfig {
  missionId: string;
  missionName: string;
  params: RoverParams;
  onSuccess: (score: number) => void;
  onFailure: (reason: string) => void;
}

type TileType = 'clear' | 'crater' | 'rock' | 'sand' | 'waypoint' | 'collected';

export class RoverScene extends Phaser.Scene {
  private cfg!: RoverSceneConfig;

  // Grid
  private grid: TileType[][] = [];
  private tileSize = 52;
  private offsetX = 0;
  private offsetY = 0;

  // Rover
  private roverX = 0;
  private roverY = 0;
  private roverAngle = 0;
  private roverContainer!: Phaser.GameObjects.Container;
  private roverGfx!: Phaser.GameObjects.Graphics;
  private isMoving = false;
  private moveQueue: { tx: number; ty: number }[] = [];
  private moveProgress = 0;
  private fromX = 0;
  private fromY = 0;

  // Waypoints
  private waypoints: { gx: number; gy: number; collected: boolean }[] = [];
  private waypointsCollected = 0;

  // Resources
  private battery = 100;
  private timeElapsed = 0;
  private done = false;
  private sandstormActive = false;
  private sandstormTimer = 0;
  private dustAlpha = 0;

  // Graphics
  private gridGfx!: Phaser.GameObjects.Graphics;
  private hudText!: Phaser.GameObjects.Text;
  private waypointGfx!: Phaser.GameObjects.Graphics;
  private minimapGfx!: Phaser.GameObjects.Graphics;
  private sandstormGfx!: Phaser.GameObjects.Graphics;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'RoverScene' });
  }

  init(data: RoverSceneConfig) {
    this.cfg = data;
    this.grid = [];
    this.waypoints = [];
    this.waypointsCollected = 0;
    this.battery = this.cfg.params.batteryCapacity;
    this.timeElapsed = 0;
    this.done = false;
    this.sandstormActive = false;
    this.sandstormTimer = 0;
    this.dustAlpha = 0;
    this.moveQueue = [];
    this.isMoving = false;
    this.roverAngle = 0;
  }

  create() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // Mars-reddish sky
    this.cameras.main.setBackgroundColor('#1a0a00');

    const cols = this.cfg.params.gridCols;
    const rows = this.cfg.params.gridRows;

    // Fit grid to screen
    const maxW = W - 200;
    const maxH = H - 100;
    this.tileSize = Math.min(Math.floor(maxW / cols), Math.floor(maxH / rows), 56);
    this.offsetX = (W - this.tileSize * cols) / 2;
    this.offsetY = 50;

    // Generate grid
    this.generateGrid(cols, rows);

    // Graphics layers
    this.gridGfx = this.add.graphics().setDepth(1);
    this.waypointGfx = this.add.graphics().setDepth(2);
    this.sandstormGfx = this.add.graphics().setDepth(8);
    this.minimapGfx = this.add.graphics().setDepth(20);

    // Rover start position
    this.roverX = 1; this.roverY = 1;
    this.fromX = this.roverX; this.fromY = this.roverY;
    this.grid[this.roverY][this.roverX] = 'clear';

    this.roverContainer = this.add.container(0, 0).setDepth(4);
    this.roverGfx = this.add.graphics();
    this.drawRover(this.roverGfx);
    this.roverContainer.add(this.roverGfx);
    this.updateRoverVisual();

    // HUD
    this.buildHUD(W, H);

    // Click to move
    this.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      const gx = Math.floor((ptr.x - this.offsetX) / this.tileSize);
      const gy = Math.floor((ptr.y - this.offsetY) / this.tileSize);
      if (this.isValidTile(gx, gy) && this.grid[gy][gx] !== 'crater' && this.grid[gy][gx] !== 'rock') {
        this.moveQueue = [{ tx: gx, ty: gy }];
      }
    });

    // Keyboard input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.drawGrid();

    // Instructions
    this.add.text(W / 2, H - 10, 'CLICK or WASD to move the rover  |  Collect all waypoints (★)', {
      fontFamily: 'monospace', fontSize: '11px', color: '#475569',
    }).setOrigin(0.5).setDepth(25);
  }

  private generateGrid(cols: number, rows: number) {
    // Initialize clear grid
    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        this.grid[y][x] = 'clear';
      }
    }

    // Place craters and rocks
    const numCraters = Math.floor(cols * rows * this.cfg.params.craterDensity);
    for (let i = 0; i < numCraters; i++) {
      const gx = Phaser.Math.Between(2, cols - 2);
      const gy = Phaser.Math.Between(2, rows - 2);
      this.grid[gy][gx] = Math.random() < 0.4 ? 'rock' : 'crater';
    }

    // Place waypoints
    for (let i = 0; i < this.cfg.params.numWaypoints; i++) {
      let gx: number, gy: number;
      let attempts = 0;
      do {
        gx = Phaser.Math.Between(2, cols - 2);
        gy = Phaser.Math.Between(2, rows - 2);
        attempts++;
      } while ((this.grid[gy][gx] !== 'clear' || (gx < 3 && gy < 3)) && attempts < 100);
      this.grid[gy][gx] = 'waypoint';
      this.waypoints.push({ gx, gy, collected: false });
    }
  }

  private drawGrid() {
    const g = this.gridGfx;
    g.clear();
    const rows = this.cfg.params.gridRows;
    const cols = this.cfg.params.gridCols;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = this.offsetX + x * this.tileSize;
        const py = this.offsetY + y * this.tileSize;
        const t = this.tileSize;

        switch (this.grid[y][x]) {
          case 'clear':
            g.fillStyle(0x3d1e0a, 1);
            g.fillRect(px, py, t, t);
            break;
          case 'sand':
            g.fillStyle(0x5c3010, 1);
            g.fillRect(px, py, t, t);
            break;
          case 'crater':
            g.fillStyle(0x1a0900, 1);
            g.fillRect(px, py, t, t);
            g.fillStyle(0x2d1205, 1);
            g.fillCircle(px + t / 2, py + t / 2, t * 0.42);
            g.lineStyle(1, 0x4a1e08, 0.8);
            g.strokeCircle(px + t / 2, py + t / 2, t * 0.42);
            break;
          case 'rock':
            g.fillStyle(0x3d1e0a, 1);
            g.fillRect(px, py, t, t);
            g.fillStyle(0x6b4420, 1);
            g.fillEllipse(px + t * 0.35, py + t * 0.42, t * 0.55, t * 0.42);
            break;
          case 'waypoint':
          case 'collected':
            g.fillStyle(0x3d1e0a, 1);
            g.fillRect(px, py, t, t);
            break;
        }
        // Grid lines
        g.lineStyle(1, 0x2d1205, 0.5);
        g.strokeRect(px, py, t, t);
      }
    }

    // Draw waypoints
    this.waypointGfx.clear();
    for (const wp of this.waypoints) {
      const px = this.offsetX + wp.gx * this.tileSize + this.tileSize / 2;
      const py = this.offsetY + wp.gy * this.tileSize + this.tileSize / 2;
      if (!wp.collected) {
        this.waypointGfx.fillStyle(0xfbbf24, 1);
        this.waypointGfx.fillCircle(px, py, this.tileSize * 0.22);
        this.waypointGfx.lineStyle(2, 0xf59e0b, 0.8);
        this.waypointGfx.strokeCircle(px, py, this.tileSize * 0.38);
      } else {
        this.waypointGfx.fillStyle(0x22c55e, 0.4);
        this.waypointGfx.fillCircle(px, py, this.tileSize * 0.35);
        this.waypointGfx.fillStyle(0x22c55e, 1);
        this.waypointGfx.fillCircle(px, py, this.tileSize * 0.15);
      }
    }

    this.updateRoverVisual();
  }

  private drawRover(g: Phaser.GameObjects.Graphics) {
    g.clear();
    const t = this.tileSize;
    // Body
    g.fillStyle(0xd4af37, 1);
    g.fillRoundedRect(-t * 0.32, -t * 0.22, t * 0.64, t * 0.44, 4);
    // Solar panel
    g.fillStyle(0x1e40af, 0.9);
    g.fillRect(-t * 0.28, -t * 0.36, t * 0.56, t * 0.12);
    // Wheels
    g.fillStyle(0x374151, 1);
    g.fillEllipse(-t * 0.36, -t * 0.12, t * 0.18, t * 0.24);
    g.fillEllipse(t * 0.36, -t * 0.12, t * 0.18, t * 0.24);
    g.fillEllipse(-t * 0.36, t * 0.12, t * 0.18, t * 0.24);
    g.fillEllipse(t * 0.36, t * 0.12, t * 0.18, t * 0.24);
    // Camera mast
    g.lineStyle(2, 0x9ca3af, 1);
    g.lineBetween(0, -t * 0.22, 0, -t * 0.42);
    g.fillStyle(0x4b5563, 1);
    g.fillCircle(0, -t * 0.42, 4);
  }

  private updateRoverVisual() {
    const px = this.offsetX + this.roverX * this.tileSize + this.tileSize / 2;
    const py = this.offsetY + this.roverY * this.tileSize + this.tileSize / 2;
    this.roverContainer.setPosition(px, py);
    this.roverContainer.setAngle(this.roverAngle);
  }

  update(_time: number, delta: number) {
    if (this.done) return;
    const dt = delta / 1000;
    this.timeElapsed += dt;

    this.handleKeyboardInput();
    this.updateMovement(dt);
    this.updateSandstorm(dt);
    this.updateMinimap();
    this.updateHUD();

    if (this.timeElapsed > this.cfg.params.timeLimitSec) {
      this.fail('Mission time limit exceeded.');
    }
    if (this.battery <= 0) {
      this.fail('Battery depleted — rover offline.');
    }
  }

  private handleKeyboardInput() {
    if (this.isMoving || this.moveQueue.length > 0) return;
    let tx = this.roverX, ty = this.roverY;
    if (Phaser.Input.Keyboard.JustDown(this.keyW) || Phaser.Input.Keyboard.JustDown(this.cursors.up!)) ty--;
    else if (Phaser.Input.Keyboard.JustDown(this.keyS) || Phaser.Input.Keyboard.JustDown(this.cursors.down!)) ty++;
    else if (Phaser.Input.Keyboard.JustDown(this.keyA) || Phaser.Input.Keyboard.JustDown(this.cursors.left!)) tx--;
    else if (Phaser.Input.Keyboard.JustDown(this.keyD) || Phaser.Input.Keyboard.JustDown(this.cursors.right!)) tx++;
    else return;

    if (this.isValidTile(tx, ty) && this.grid[ty][tx] !== 'crater' && this.grid[ty][tx] !== 'rock') {
      this.moveQueue = [{ tx, ty }];
    }
  }

  private updateMovement(dt: number) {
    if (this.isMoving) {
      this.moveProgress += dt * 4;
      if (this.moveProgress >= 1) {
        this.moveProgress = 1;
        this.roverX = this.moveQueue[0]?.tx ?? this.roverX;
        this.roverY = this.moveQueue[0]?.ty ?? this.roverY;
        this.fromX = this.roverX;
        this.fromY = this.roverY;
        this.moveQueue.shift();
        this.isMoving = false;
        this.moveProgress = 0;
        this.battery = Math.max(0, this.battery - (this.sandstormActive ? 3 : 1));
        this.checkWaypoint();
        this.drawGrid();
      }
      const nx = this.fromX + (((this.moveQueue[0]?.tx ?? this.roverX)) - this.fromX) * this.moveProgress;
      const ny = this.fromY + (((this.moveQueue[0]?.ty ?? this.roverY)) - this.fromY) * this.moveProgress;
      const px = this.offsetX + nx * this.tileSize + this.tileSize / 2;
      const py = this.offsetY + ny * this.tileSize + this.tileSize / 2;
      this.roverContainer.setPosition(px, py);
    } else if (this.moveQueue.length > 0) {
      const next = this.moveQueue[0];
      const dx = next.tx - this.roverX;
      const dy = next.ty - this.roverY;
      if (Math.abs(dx) + Math.abs(dy) > 0) {
        this.roverAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        this.fromX = this.roverX;
        this.fromY = this.roverY;
        this.isMoving = true;
        this.moveProgress = 0;
        this.roverContainer.setAngle(this.roverAngle + 90);
      } else {
        this.moveQueue.shift();
      }
    }
  }

  private checkWaypoint() {
    for (const wp of this.waypoints) {
      if (!wp.collected && wp.gx === this.roverX && wp.gy === this.roverY) {
        wp.collected = true;
        this.grid[wp.gy][wp.gx] = 'collected';
        this.waypointsCollected++;
        // Flash
        this.cameras.main.flash(200, 34, 197, 94);
        if (this.waypointsCollected >= this.cfg.params.numWaypoints) {
          this.done = true;
          const score = Math.round(
            80 + (this.battery / this.cfg.params.batteryCapacity) * 20 -
            (this.timeElapsed / this.cfg.params.timeLimitSec) * 30
          );
          this.showResult(true, `All samples collected! Score: ${Math.max(10, score)}`);
          this.cfg.onSuccess(Math.max(10, score));
        }
      }
    }
  }

  private updateSandstorm(dt: number) {
    this.sandstormTimer -= dt;
    if (this.sandstormTimer <= 0) {
      const prob = this.cfg.params.sandstormProbability;
      if (!this.sandstormActive && Math.random() < prob * dt * 0.3) {
        this.sandstormActive = true;
        this.sandstormTimer = Phaser.Math.Between(5, 15);
      } else {
        this.sandstormActive = false;
        this.sandstormTimer = Phaser.Math.Between(8, 25);
      }
    }

    const targetAlpha = this.sandstormActive ? 0.55 : 0;
    this.dustAlpha += (targetAlpha - this.dustAlpha) * 0.05;

    this.sandstormGfx.clear();
    if (this.dustAlpha > 0.01) {
      const W = this.cameras.main.width;
      const H = this.cameras.main.height;
      this.sandstormGfx.fillStyle(0xb45309, this.dustAlpha);
      this.sandstormGfx.fillRect(0, 0, W, H);
      // Dust streaks
      this.sandstormGfx.lineStyle(1, 0xd97706, this.dustAlpha * 0.5);
      for (let i = 0; i < 15; i++) {
        const sx = Phaser.Math.Between(0, W);
        const sy = Phaser.Math.Between(0, H);
        this.sandstormGfx.lineBetween(sx, sy, sx + Phaser.Math.Between(20, 80), sy + Phaser.Math.Between(-5, 5));
      }
    }
  }

  private updateMinimap() {
    const W = this.cameras.main.width;
    const mmW = 90, mmH = 70;
    const mmX = W - mmW - 10, mmY = 10;
    this.minimapGfx.clear();
    this.minimapGfx.fillStyle(0x0f172a, 0.9);
    this.minimapGfx.fillRoundedRect(mmX, mmY, mmW, mmH, 4);

    const cols = this.cfg.params.gridCols;
    const rows = this.cfg.params.gridRows;
    const tw = mmW / cols;
    const th = mmH / rows;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const t = this.grid[y][x];
        const col = t === 'crater' ? 0x1a0900 : t === 'rock' ? 0x4a2c0a :
          t === 'waypoint' ? 0xfbbf24 : t === 'collected' ? 0x22c55e : 0x3d1e0a;
        this.minimapGfx.fillStyle(col, 1);
        this.minimapGfx.fillRect(mmX + x * tw, mmY + y * th, tw, th);
      }
    }
    // Rover dot
    this.minimapGfx.fillStyle(0x60a5fa, 1);
    this.minimapGfx.fillCircle(mmX + this.roverX * tw + tw / 2, mmY + this.roverY * th + th / 2, 3);
  }

  private buildHUD(_W: number, _H: number) {
    const panel = this.add.graphics().setDepth(20);
    panel.fillStyle(0x0f172a, 0.85);
    panel.fillRoundedRect(10, 10, 200, 100, 8);

    this.hudText = this.add.text(20, 18, '', {
      fontFamily: 'monospace', fontSize: '12px', color: '#94a3b8', lineSpacing: 5,
    }).setDepth(21);
  }

  private updateHUD() {
    const remaining = this.cfg.params.numWaypoints - this.waypointsCollected;
    const tLeft = Math.max(0, this.cfg.params.timeLimitSec - this.timeElapsed).toFixed(0);
    const battPct = (this.battery / this.cfg.params.batteryCapacity * 100).toFixed(0);
    this.hudText.setText([
      `SAMPLES: ${this.waypointsCollected} / ${this.cfg.params.numWaypoints}  (${remaining} left)`,
      `BATTERY: ${battPct}% ${parseInt(battPct) < 25 ? '⚠' : ''}`,
      `TIME: ${tLeft}s`,
      this.sandstormActive ? '🌪 SANDSTORM — Battery ×3 drain' : 'Weather: Clear',
    ].join('\n'));
  }

  private isValidTile(gx: number, gy: number): boolean {
    return gx >= 0 && gy >= 0 && gx < this.cfg.params.gridCols && gy < this.cfg.params.gridRows;
  }

  private fail(reason: string) {
    this.done = true;
    this.showResult(false, reason);
    this.cfg.onFailure(reason);
  }

  private showResult(ok: boolean, msg: string) {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const bg = this.add.graphics().setDepth(50);
    bg.fillStyle(0x000000, 0.75);
    bg.fillRect(0, 0, W, H);
    this.add.text(W / 2, H / 2 - 40, ok ? '🤖 MISSION COMPLETE' : '❌ MISSION FAILED', {
      fontFamily: 'monospace', fontSize: '30px', color: ok ? '#22c55e' : '#ef4444',
    }).setOrigin(0.5).setDepth(51);
    this.add.text(W / 2, H / 2 + 20, msg, {
      fontFamily: 'monospace', fontSize: '13px', color: '#cbd5e1',
      wordWrap: { width: W - 80 }, align: 'center',
    }).setOrigin(0.5).setDepth(51);
  }
}
