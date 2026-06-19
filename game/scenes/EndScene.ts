import Phaser from 'phaser';
import { AudioManager } from '../AudioManager';

export class EndScene extends Phaser.Scene {
  private audio!: AudioManager;
  constructor() { super('EndScene'); }

  create() {
    this.game.events.emit('showHUD', false);
    this.cameras.main.setBackgroundColor('#000000');
    
    this.audio = new AudioManager();
    this.audio.startMusic('end');
    
    this.add.text(128, 100, 'THANK YOU FOR PLAYING', { fontFamily: 'monospace', fontSize: '14px', color: '#FFFFFF' }).setOrigin(0.5);
    this.add.text(128, 140, 'PRESS ENTER TO RETURN', { fontFamily: 'monospace', fontSize: '12px', color: '#FFFFFF' }).setOrigin(0.5);

    const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    enterKey.on('down', () => {
      this.audio.stopMusic();
      this.scene.start('TitleScene');
    });
  }
}