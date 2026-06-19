import Phaser from 'phaser';
import { TitleScene } from './scenes/TitleScene';
import { MainScene } from './scenes/MainScene';
import { EndScene } from './scenes/EndScene';

export const GAME_WIDTH = 256;
export const GAME_HEIGHT = 240;

export const PhaserGameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#5C94FC',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 1200 },
      debug: false,
    },
  },
  scene: [TitleScene, MainScene, EndScene],
};