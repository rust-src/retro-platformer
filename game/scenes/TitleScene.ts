import Phaser from 'phaser';
import { AudioManager } from '../AudioManager';

export class TitleScene extends Phaser.Scene {
  private audio!: AudioManager;
  constructor() { super('TitleScene'); }

  create() {
    this.game.events.emit('showHUD', false);
    this.cameras.main.setBackgroundColor('#000000');
    
    this.audio = new AudioManager();
    this.audio.startMusic('title');
    
    this.add.text(128, 80, 'RETRO PLATFORMER', { fontFamily: 'monospace', fontSize: '16px', color: '#FFFFFF' }).setOrigin(0.5);
    this.add.text(128, 120, '1 PLAYER GAME', { fontFamily: 'monospace', fontSize: '12px', color: '#FFFFFF' }).setOrigin(0.5);
    
    const startText = this.add.text(128, 160, 'PRESS ENTER TO START', { fontFamily: 'monospace', fontSize: '12px', color: '#FFFFFF' }).setOrigin(0.5);
    
    this.time.addEvent({
      delay: 500,
      callback: () => startText.setVisible(!startText.visible),
      loop: true
    });

    const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    enterKey.on('down', () => {
      this.audio.stopMusic();
      this.registry.set('level', 1);
      this.scene.start('MainScene');
    });
  }
}