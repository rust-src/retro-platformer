import Phaser from 'phaser';
import { AssetGenerator } from '../AssetGenerator';
import { AudioManager } from '../AudioManager';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private enemies!: Phaser.Physics.Arcade.Group;
  private powerups!: Phaser.Physics.Arcade.Group;
  private solidBlocks!: Phaser.Physics.Arcade.StaticGroup;
  private flag!: Phaser.Physics.Arcade.Sprite | null;
  private boss!: Phaser.Physics.Arcade.Sprite | null;
  private button!: Phaser.Physics.Arcade.Sprite | null;
  private audio!: AudioManager;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;

  private bgClouds!: Phaser.GameObjects.TileSprite;
  private bgHills!: Phaser.GameObjects.TileSprite;

  private readonly ACCEL = 1200;
  private readonly MAX_SPEED = 120;
  private readonly DECEL = 1500;
  private readonly JUMP_VEL = -420;
  private readonly DOUBLE_JUMP_VEL = -360;
  private coyoteTime = 80;
  private coyoteCounter = 0;
  private jumpBuffer = 100;
  private jumpBufferCounter = 0;
  private jumpsRemaining = 0;
  private readonly MAX_JUMPS = 2;

  private isBig = false;
  private isInvincible = false;
  private levelFinished = false;
  private isDead = false;

  private playerWalkTimer = 0;
  private playerWalkFrame = false;

  private currentLevel = 1;
  private score = 0;
  private coins = 0;
  private levelData: string[][] = [];
  private bossTriggered = false;

  constructor() { super('MainScene'); }

  create(): void {
    AssetGenerator.generateTextures(this);
    this.audio = new AudioManager();
    
    this.currentLevel = this.registry.get('level') || 1;
    this.score = this.registry.get('score') || 0;
    this.coins = this.registry.get('coins') || 0;
    this.isBig = this.registry.get('isBig') || false;
    
    this.game.events.emit('showHUD', true);
    this.game.events.emit('updateHUD', { score: this.score, coins: this.coins, level: this.currentLevel });

    this.levelFinished = false;
    this.isDead = false;
    this.flag = null;
    this.boss = null;
    this.button = null;
    this.bossTriggered = false;

    if (this.currentLevel === 1) {
      this.cameras.main.setBackgroundColor('#5C94FC');
      this.audio.startMusic('overworld');
      this.bgClouds = this.add.tileSprite(0, 40, 256, 80, 'cloud').setOrigin(0, 0).setScrollFactor(0);
      this.bgHills = this.add.tileSprite(0, 112, 256, 48, 'hill').setOrigin(0, 0).setScrollFactor(0);
    } else if (this.currentLevel === 2) {
      this.cameras.main.setBackgroundColor('#000000');
      this.audio.startMusic('underground');
    } else if (this.currentLevel === 3) {
      this.cameras.main.setBackgroundColor('#333333');
      this.audio.startMusic('castle');
    }

    this.solidBlocks = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();
    this.powerups = this.physics.add.group();

    this.buildLevel();

    this.player = this.physics.add.sprite(40, 192, 'player');
    this.player.setCollideWorldBounds(true);
    this.applyPlayerSize();

    this.physics.add.collider(this.player, this.solidBlocks, this.handleBlockHit, undefined, this);
    this.physics.add.collider(this.enemies, this.solidBlocks);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.player, this.enemies, this.handleEnemyCollision, undefined, this);
    this.physics.add.collider(this.powerups, this.solidBlocks);
    this.physics.add.overlap(this.player, this.powerups, this.handlePowerupCollect, undefined, this);
    
    if (this.flag) this.physics.add.overlap(this.player, this.flag, this.handleFlagTouch, undefined, this);
    
    // Use overlap for boss so it's an instant kill trigger
    if (this.boss) this.physics.add.overlap(this.player, this.boss, this.handleBossCollision, undefined, this);
    if (this.button) this.physics.add.overlap(this.player, this.button, this.handleButtonTouch, undefined, this);

    const levelWidth = this.levelData[0].length * 16;
    this.physics.world.setBounds(0, 0, levelWidth, 240);
    this.physics.world.setBoundsCollision(true, false, true, false);
    this.cameras.main.setBounds(0, 0, levelWidth, 240);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
  }

  private applyPlayerSize() {
    if (this.isBig) {
      this.player.setTexture('bigPlayer');
      this.player.setSize(12, 28);
      this.player.setOffset(2, 2);
    } else {
      this.player.setTexture('player');
      this.player.setSize(12, 14);
      this.player.setOffset(2, 2);
    }
  }

  private buildLevel() {
    const MAP_WIDTH = 300; // Extended map length
    const MAP_HEIGHT = 15;
    const map: string[][] = Array(MAP_HEIGHT).fill(0).map(() => Array(MAP_WIDTH).fill(' '));

    for (let x = 0; x < MAP_WIDTH; x++) {
      map[13][x] = 'G';
      map[14][x] = 'G';
    }

    if (this.currentLevel === 1) {
      const pits = [20, 45, 70, 95, 120, 150, 180, 210, 240];
      pits.forEach(p => { for (let i = 0; i < 3; i++) { map[13][p + i] = ' '; map[14][p + i] = ' '; } });
      [10, 35, 60, 85, 110, 135, 160, 190, 220].forEach(x => { map[11][x] = 'P'; map[12][x] = 'P'; });
      map[9][15] = 'Q'; map[9][16] = 'B'; map[9][17] = 'M';
      map[9][50] = 'Q'; map[9][51] = 'M';
      map[9][80] = 'B'; map[9][81] = 'B';
      map[9][140] = 'M'; map[9][200] = 'M';
      
      [5, 8, 12, 25, 30, 33, 40, 48, 55, 62, 68, 75, 82, 90, 98, 105, 112, 120, 125, 135, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270].forEach(x => { if (map[13][x] === 'G') map[12][x] = 'E'; });
      
      [8, 9, 10, 11, 12].forEach(y => map[y][280] = 'F');
    } else if (this.currentLevel === 2) {
      for (let x = 0; x < MAP_WIDTH; x++) { map[0][x] = 'B'; map[1][x] = 'B'; }
      const pits = [15, 40, 65, 90, 115, 140, 165, 190, 215, 240];
      pits.forEach(p => { for (let i = 0; i < 4; i++) { map[13][p + i] = ' '; map[14][p + i] = ' '; } });
      [10, 30, 50, 80, 100, 130, 160, 200, 230].forEach(x => { map[11][x] = 'P'; map[12][x] = 'P'; });
      
      for (let i = 0; i < 4; i++) map[6][20 + i] = 'B';
      for (let i = 0; i < 4; i++) map[6][45 + i] = 'B';
      map[6][46] = 'M'; map[6][47] = 'Q';
      for (let i = 0; i < 6; i++) map[5][70 + i] = 'B';
      for (let i = 0; i < 4; i++) map[6][120 + i] = 'B'; map[6][121] = 'M';
      for (let i = 0; i < 4; i++) map[6][180 + i] = 'B'; map[6][181] = 'M';
      
      [5, 12, 20, 28, 35, 42, 50, 58, 65, 72, 80, 88, 95, 102, 110, 118, 125, 132, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270].forEach(x => { if (map[13][x] === 'G') map[12][x] = 'E'; });
      
      [8, 9, 10, 11, 12].forEach(y => map[y][280] = 'F');
    } else if (this.currentLevel === 3) {
      for (let x = 0; x < MAP_WIDTH; x++) { map[0][x] = 'B'; map[1][x] = 'B'; }
      
      // Lots of pits and obstacles
      const pits = [30, 60, 90, 120, 150, 180, 210];
      pits.forEach(p => { for (let i = 0; i < 3; i++) { map[13][p + i] = ' '; map[14][p + i] = ' '; } });
      
      // Mushroom blocks scattered everywhere
      for(let i=0; i<5; i++) map[9][20+i] = 'B'; map[9][22] = 'M';
      for(let i=0; i<5; i++) map[9][50+i] = 'B'; map[9][52] = 'M';
      for(let i=0; i<5; i++) map[9][80+i] = 'B'; map[9][82] = 'M';
      for(let i=0; i<5; i++) map[9][110+i] = 'B'; map[9][112] = 'M';
      for(let i=0; i<5; i++) map[9][140+i] = 'B'; map[9][142] = 'M';
      for(let i=0; i<5; i++) map[9][170+i] = 'B'; map[9][172] = 'M';
      for(let i=0; i<5; i++) map[9][200+i] = 'B'; map[9][202] = 'M';

      [10, 15, 25, 40, 45, 55, 70, 75, 85, 100, 105, 115, 130, 135, 145, 160, 165, 175, 190, 195, 205, 220, 230, 240].forEach(x => { if (map[13][x] === 'G') map[12][x] = 'E'; });
    }

    this.levelData = map;

    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tile = map[y][x];
        const px = x * 16 + 8;
        const py = y * 16 + 8;
        
        if (tile === 'G' || tile === 'P' || tile === 'B' || tile === 'Q' || tile === 'M' || tile === 'R') {
          let key = 'ground';
          if (tile === 'P') key = 'pipe';
          if (tile === 'B') key = 'brick';
          if (tile === 'Q' || tile === 'M') key = 'qBlock';
          if (tile === 'R') key = 'bridge';
          this.solidBlocks.create(px, py, key).setData('type', tile).refreshBody();
        } else if (tile === 'E') {
          const e = this.enemies.create(px, py, 'enemy') as Phaser.Physics.Arcade.Sprite;
          e.setVelocityX(-30);
          e.setData('walkTimer', 0);
          e.setData('walkFrame', false);
        } else if (tile === 'F') {
          if (!this.flag) {
            this.flag = this.physics.add.sprite(px, 200, 'flag');
            if (this.flag.body) {
              (this.flag.body as Phaser.Physics.Arcade.Body).setSize(16, 200);
              (this.flag.body as Phaser.Physics.Arcade.Body).setOffset(0, -184);
              (this.flag.body as Phaser.Physics.Arcade.Body).allowGravity = false;
            }
            this.flag.setImmovable(true);
          }
        }
      }
    }

    if (this.currentLevel === 3) {
      // Create Bridge dynamically
      const bridgeStart = 250;
      for (let i = 0; i < 15; i++) {
        const px = (bridgeStart + i) * 16 + 8;
        this.solidBlocks.create(px, 13 * 16 + 8, 'bridge').setData('type', 'R').refreshBody();
      }

      this.boss = this.physics.add.sprite(258 * 16, 192, 'boss');
      this.boss.setVelocityX(-40);
      this.boss.setCollideWorldBounds(true);
      this.physics.add.collider(this.boss, this.solidBlocks);

      this.button = this.physics.add.sprite(264 * 16, 192, 'button');
      if (this.button.body) {
        // Make the button hitbox 240px tall so you CANNOT jump over it
        (this.button.body as Phaser.Physics.Arcade.Body).setSize(32, 240);
        (this.button.body as Phaser.Physics.Arcade.Body).setOffset(-8, -224);
        (this.button.body as Phaser.Physics.Arcade.Body).allowGravity = false;
      }
      this.button.setImmovable(true);
    }
  }

  private handleBlockHit(player: any, block: any) {
    const pBody = player.body as Phaser.Physics.Arcade.Body;
    const bBody = block.body as Phaser.Physics.Arcade.Body;
    if (pBody.blocked.up && bBody.touching.down) {
      const type = block.getData('type');
      if (type === 'Q' || type === 'M') {
        this.audio.playCoin();
        this.coins++;
        this.score += 200;
        this.game.events.emit('updateHUD', { score: this.score, coins: this.coins, level: this.currentLevel });
        block.setData('type', 'B').setTexture('brick');
        const mush = this.powerups.create(block.x, block.y - 16, 'mushroom') as Phaser.Physics.Arcade.Sprite;
        mush.setVelocityX(40).setBounce(1, 0);
      } else if (type === 'B') {
        if (this.isBig) { 
          this.audio.playStomp(); 
          block.destroy(); 
          this.score += 50;
          this.game.events.emit('updateHUD', { score: this.score, coins: this.coins, level: this.currentLevel });
        } else { 
          this.tweens.add({ targets: block, y: block.y - 4, duration: 80, yoyo: true }); 
        }
      }
    }
  }

  private handleEnemyCollision(player: any, enemy: any) {
    if (this.isDead) return;
    
    const pBody = player.body as Phaser.Physics.Arcade.Body;
    const eBody = enemy.body as Phaser.Physics.Arcade.Body;

    if (pBody.y + pBody.height <= eBody.y + 6) {
      enemy.destroy();
      player.setVelocityY(this.JUMP_VEL * 0.6);
      this.audio.playStomp();
      this.score += 100;
      this.game.events.emit('updateHUD', { score: this.score, coins: this.coins, level: this.currentLevel });
    } else {
      if (!this.isInvincible) {
        if (this.isBig) this.shrinkPlayer(); 
        else this.die();
      }
    }
  }

  private handleBossCollision(player: any, boss: any) {
    if (this.isDead || this.levelFinished) return;
    // Boss kills you instantly if you touch him
    this.die();
  }

  private handlePowerupCollect(player: any, powerup: any) {
    powerup.destroy();
    this.audio.playPowerup();
    if (!this.isBig) this.growPlayer();
  }

  private growPlayer() {
    this.isBig = true;
    this.player.body.checkCollision.none = true;
    this.player.y -= 14;
    this.player.setTexture('bigPlayer');
    this.player.setSize(12, 28);
    this.player.setOffset(2, 2);
    this.time.delayedCall(50, () => { this.player.body.checkCollision.none = false; });
    this.isInvincible = true;
    this.player.setAlpha(0.6);
    this.time.delayedCall(2000, () => { this.isInvincible = false; this.player.setAlpha(1); });
  }

  private shrinkPlayer() {
    this.isBig = false;
    this.player.setTexture('player');
    this.player.setSize(12, 14);
    this.player.setOffset(2, 2);
    this.isInvincible = true;
    this.player.setAlpha(0.6);
    this.time.delayedCall(2000, () => { this.isInvincible = false; this.player.setAlpha(1); });
  }

  private handleFlagTouch(player: any, flag: any) {
    if (this.levelFinished) return;
    this.levelFinished = true;
    this.audio.stopMusic();
    this.audio.playFlag();
    this.player.setVelocity(0, 0);
    this.player.setCollideWorldBounds(false);
    (this.player.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    
    this.tweens.add({
      targets: this.player,
      y: 192,
      duration: 800,
      onComplete: () => {
        (this.player.body as Phaser.Physics.Arcade.Body).allowGravity = true;
        this.player.setVelocityX(60);
        this.time.delayedCall(2000, () => {
          this.registry.set('level', this.currentLevel + 1);
          this.registry.set('score', this.score);
          this.registry.set('coins', this.coins);
          this.registry.set('isBig', this.isBig);
          this.scene.restart();
        });
      }
    });
  }

  private handleButtonTouch(player: any, button: any) {
    if (this.levelFinished) return;
    this.levelFinished = true;
    this.audio.stopMusic();
    this.audio.playPowerup();
    button.destroy();

    // Destroy bridge sequentially so it looks like it's collapsing
    this.solidBlocks.getChildren().forEach((block) => {
      const b = block as Phaser.Physics.Arcade.Sprite;
      if (b.getData('type') === 'R') {
        this.time.delayedCall(100 * (b.x / 16), () => b.destroy());
      }
    });

    if (this.boss) this.boss.setCollideWorldBounds(false);

    // Auto-walk player to the right
    (this.player.body as Phaser.Physics.Arcade.Body).allowGravity = true;
    this.player.setVelocityX(80);
    this.player.setFlipX(false);
    
    this.time.delayedCall(3000, () => {
      this.scene.start('EndScene');
    });
  }

  private die() {
    if (this.isDead) return;
    this.isDead = true;
    this.levelFinished = true; 
    this.audio.stopMusic();
    this.audio.playDeath();
    
    this.player.setVelocity(0, -300);
    (this.player.body as Phaser.Physics.Arcade.Body).allowGravity = true;
    this.player.setCollideWorldBounds(false);
    
    this.time.delayedCall(1500, () => { 
      this.registry.set('isBig', false);
      this.scene.restart(); 
    });
  }

  update(time: number, delta: number): void {
    if (!this.player || !this.cursors || this.levelFinished) return;

    if (this.bgClouds) this.bgClouds.tilePositionX = this.cameras.main.scrollX * 0.2;
    if (this.bgHills) this.bgHills.tilePositionX = this.cameras.main.scrollX * 0.5;

    if (this.player.y > 240) { this.die(); return; }

    // Boss Intro & AI
    if (this.currentLevel === 3 && this.boss && this.boss.body) {
      // Trigger Boss Music & Text
      if (!this.bossTriggered && this.player.x > 255 * 16) {
        this.bossTriggered = true;
        this.audio.stopMusic();
        this.audio.startMusic('boss');
        const bossText = this.add.text(this.cameras.main.worldView.centerX, 60, 'LORD GOOMBRIDGE', { fontFamily: 'monospace', fontSize: '16px', color: '#FF0000', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5).setScrollFactor(0);
        this.tweens.add({ targets: bossText, alpha: 0, duration: 2000, delay: 1500, onComplete: () => bossText.destroy() });
      }

      const bossBody = this.boss.body as Phaser.Physics.Arcade.Body;
      if (this.boss.x < 250 * 16) this.boss.setVelocityX(40);
      else if (this.boss.x > 263 * 16) this.boss.setVelocityX(-40);
      
      const dist = Math.abs(this.player.x - this.boss.x);
      if (dist < 120) {
        this.boss.setVelocityX(this.player.x < this.boss.x ? -60 : 60);
      } else {
        if (bossBody.blocked.left || this.boss.x <= 250 * 16) this.boss.setVelocityX(40);
        else if (bossBody.blocked.right || this.boss.x >= 263 * 16) this.boss.setVelocityX(-40);
      }
    }

    // Enemy AI & Ledge Detection
    this.enemies.getChildren().forEach((e) => {
      const enemy = e as Phaser.Physics.Arcade.Sprite;
      const body = enemy.body as Phaser.Physics.Arcade.Body;
      if (!body) return;
      
      if (body.blocked.left || body.touching.left) {
        enemy.setVelocityX(30).setFlipX(true);
      } else if (body.blocked.right || body.touching.right) {
        enemy.setVelocityX(-30).setFlipX(false);
      }
      
      const isMovingLeft = body.velocity.x < 0;
      const frontX = isMovingLeft ? enemy.x - 8 : enemy.x + 8;
      const tileX = Math.floor(frontX / 16);
      const tileY = Math.floor((enemy.y + 8) / 16) + 1; 
      
      if (this.levelData[tileY] && this.levelData[tileY][tileX] === ' ') {
        if (isMovingLeft) {
          enemy.setVelocityX(30).setFlipX(true);
        } else {
          enemy.setVelocityX(-30).setFlipX(false);
        }
      }

      let walkTimer = enemy.getData('walkTimer') + delta;
      if (walkTimer > 150) {
        walkTimer = 0;
        const walkFrame = !enemy.getData('walkFrame');
        enemy.setData('walkFrame', walkFrame);
        enemy.setTexture(walkFrame ? 'enemy_walk' : 'enemy');
      }
      enemy.setData('walkTimer', walkTimer);
    });

    const onGround = this.player.body?.blocked.down || this.player.body?.touching.down;
    if (onGround) {
      this.coyoteCounter = this.coyoteTime;
      this.jumpsRemaining = this.MAX_JUMPS;
    } else {
      this.coyoteCounter -= delta;
    }

    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.keySpace) || Phaser.Input.Keyboard.JustDown(this.keyW) || Phaser.Input.Keyboard.JustDown(this.cursors.up);
    if (jumpPressed) {
      this.jumpBufferCounter = this.jumpBuffer;
      if (this.coyoteCounter > 0) {
        this.executeJump(this.JUMP_VEL);
        this.coyoteCounter = 0;
      } else if (this.jumpsRemaining > 0) {
        this.executeJump(this.DOUBLE_JUMP_VEL);
      }
    } else {
      this.jumpBufferCounter -= delta;
    }

    if (this.jumpBufferCounter > 0 && this.coyoteCounter > 0) {
      this.executeJump(this.JUMP_VEL);
      this.jumpBufferCounter = 0; this.coyoteCounter = 0;
    }

    const jumpReleased = Phaser.Input.Keyboard.JustUp(this.keySpace) || Phaser.Input.Keyboard.JustUp(this.keyW) || Phaser.Input.Keyboard.JustUp(this.cursors.up);
    if (jumpReleased && this.player.body!.velocity.y < 0) this.player.setVelocityY(this.player.body!.velocity.y * 0.4);

    const leftDown = this.cursors.left.isDown || this.keyA.isDown;
    const rightDown = this.cursors.right.isDown || this.keyD.isDown;

    if (leftDown) {
      this.player.setAccelerationX(-this.ACCEL);
      this.player.setFlipX(true);
    } else if (rightDown) {
      this.player.setAccelerationX(this.ACCEL);
      this.player.setFlipX(false);
    } else {
      this.player.setAccelerationX(0);
      this.player.setDragX(this.DECEL);
    }

    if (!this.isBig) {
      if (leftDown || rightDown) {
        if (onGround) {
          this.playerWalkTimer += delta;
          if (this.playerWalkTimer > 100) {
            this.playerWalkTimer = 0;
            this.playerWalkFrame = !this.playerWalkFrame;
            this.player.setTexture(this.playerWalkFrame ? 'player_walk' : 'player');
          }
        }
      } else {
        this.playerWalkTimer = 0;
        this.player.setTexture('player');
      }
    }

    if (this.player.body!.velocity.x > this.MAX_SPEED) this.player.setVelocityX(this.MAX_SPEED);
    else if (this.player.body!.velocity.x < -this.MAX_SPEED) this.player.setVelocityX(-this.MAX_SPEED);
  }

  private executeJump(velocity: number) {
    this.player.setVelocityY(velocity);
    this.jumpsRemaining--;
    this.audio.playJump();
  }
}