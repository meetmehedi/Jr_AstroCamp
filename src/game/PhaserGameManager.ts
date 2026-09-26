// ============================================================
// PhaserGameManager — Lifecycle orchestrator for NASA Mission Games
// Mounts, runs, and unmounts Phaser 3 game scenes dynamically
// ============================================================
import Phaser from 'phaser';
import type { MissionGameConfig } from './missionGameData';
import { LaunchScene } from './scenes/LaunchScene';
import { DockingScene } from './scenes/DockingScene';
import { LunarLandingScene } from './scenes/LunarLandingScene';
import { RoverScene } from './scenes/RoverScene';
import { TelescopeScene } from './scenes/TelescopeScene';
import { DeepSpaceScene } from './scenes/DeepSpaceScene';

export interface GameCallbacks {
  onSuccess: (score: number) => void;
  onFailure: (reason: string) => void;
}

export function startPhaserMissionGame(
  parent: HTMLElement | string,
  mission: MissionGameConfig,
  callbacks: GameCallbacks
): Phaser.Game {
  let SceneClass: any;
  let sceneKey = '';

  switch (mission.gameType) {
    case 'launch':
      SceneClass = LaunchScene;
      sceneKey = 'LaunchScene';
      break;
    case 'docking':
      SceneClass = DockingScene;
      sceneKey = 'DockingScene';
      break;
    case 'lunar_landing':
      SceneClass = LunarLandingScene;
      sceneKey = 'LunarLandingScene';
      break;
    case 'rover':
      SceneClass = RoverScene;
      sceneKey = 'RoverScene';
      break;
    case 'telescope':
      SceneClass = TelescopeScene;
      sceneKey = 'TelescopeScene';
      break;
    case 'deep_space':
      SceneClass = DeepSpaceScene;
      sceneKey = 'DeepSpaceScene';
      break;
    default:
      SceneClass = LaunchScene;
      sceneKey = 'LaunchScene';
      break;
  }

  const sceneInstance = new SceneClass();

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: 800,
    height: 600,
    backgroundColor: '#020617',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [sceneInstance],
  };

  const game = new Phaser.Game(config);

  // Start the scene once game is booted with data payload
  game.events.once('ready', () => {
    game.scene.start(sceneKey, {
      missionId: mission.id,
      missionName: mission.missionName,
      params: mission.params,
      onSuccess: (score: number) => {
        callbacks.onSuccess(score);
      },
      onFailure: (reason: string) => {
        callbacks.onFailure(reason);
      },
    });
  });

  return game;
}

export function destroyPhaserGame(game: Phaser.Game | null | undefined) {
  if (!game) return;
  try {
    game.destroy(true);
  } catch (err) {
    console.warn('Phaser game destruction notice:', err);
  }
}
