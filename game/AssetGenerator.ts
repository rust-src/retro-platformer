import Phaser from 'phaser';

export class AssetGenerator {
  static generateTextures(scene: Phaser.Scene): void {
    // Ground
    if (!scene.textures.exists('ground')) {
      const g = scene.textures.createCanvas('ground', 16, 16)!;
      const ctx = g.getContext();
      ctx.fillStyle = '#E45A25'; ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, 16, 1); ctx.fillRect(0, 15, 16, 1);
      ctx.fillStyle = '#B24218'; ctx.fillRect(0, 4, 16, 1); ctx.fillRect(0, 11, 16, 1);
      ctx.fillRect(4, 0, 1, 4); ctx.fillRect(11, 4, 1, 7); ctx.fillRect(4, 11, 1, 4);
      g.refresh();
    }

    // Brick
    if (!scene.textures.exists('brick')) {
      const b = scene.textures.createCanvas('brick', 16, 16)!;
      const ctx = b.getContext();
      ctx.fillStyle = '#C84C0C'; ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#000000'; ctx.strokeRect(0.5, 0.5, 15, 15);
      ctx.fillRect(0, 7, 16, 1); ctx.fillRect(7, 0, 1, 8); ctx.fillRect(3, 8, 1, 8); ctx.fillRect(11, 8, 1, 8);
      b.refresh();
    }

    // QBlock
    if (!scene.textures.exists('qBlock')) {
      const q = scene.textures.createCanvas('qBlock', 16, 16)!;
      const ctx = q.getContext();
      ctx.fillStyle = '#FBBF24'; ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#000000'; ctx.strokeRect(0.5, 0.5, 15, 15);
      ctx.fillRect(1, 1, 14, 1); ctx.fillRect(1, 14, 14, 1);
      ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', 8, 9);
      q.refresh();
    }

    // Player Idle (Classic Humanoid Look)
    if (!scene.textures.exists('player')) {
      const p = scene.textures.createCanvas('player', 16, 16)!;
      const ctx = p.getContext();
      ctx.fillStyle = '#7B2D8B'; ctx.fillRect(5, 2, 6, 1); ctx.fillRect(4, 3, 8, 2); ctx.fillRect(3, 5, 10, 1); // Hat & Brim
      ctx.fillStyle = '#FFCCAA'; ctx.fillRect(5, 6, 6, 3); // Face
      ctx.fillStyle = '#000000'; ctx.fillRect(6, 7, 1, 1); ctx.fillRect(9, 7, 1, 1); ctx.fillRect(5, 8, 6, 1); // Eyes & Mustache
      ctx.fillStyle = '#F1C40F'; ctx.fillRect(4, 9, 8, 1); // Shirt Shoulders
      ctx.fillStyle = '#7B2D8B'; ctx.fillRect(4, 10, 8, 1); ctx.fillRect(3, 11, 4, 4); ctx.fillRect(9, 11, 4, 4); // Overalls/Pants
      ctx.fillStyle = '#2C1B1B'; ctx.fillRect(3, 15, 4, 1); ctx.fillRect(9, 15, 4, 1); // Shoes
      p.refresh();
    }

    // Player Walk
    if (!scene.textures.exists('player_walk')) {
      const p = scene.textures.createCanvas('player_walk', 16, 16)!;
      const ctx = p.getContext();
      ctx.fillStyle = '#7B2D8B'; ctx.fillRect(5, 2, 6, 1); ctx.fillRect(4, 3, 8, 2); ctx.fillRect(3, 5, 10, 1);
      ctx.fillStyle = '#FFCCAA'; ctx.fillRect(5, 6, 6, 3);
      ctx.fillStyle = '#000000'; ctx.fillRect(6, 7, 1, 1); ctx.fillRect(9, 7, 1, 1); ctx.fillRect(5, 8, 6, 1);
      ctx.fillStyle = '#F1C40F'; ctx.fillRect(4, 9, 8, 1);
      ctx.fillStyle = '#7B2D8B'; ctx.fillRect(4, 10, 8, 1); ctx.fillRect(2, 11, 4, 4); ctx.fillRect(10, 11, 4, 4); // Legs Spread
      ctx.fillStyle = '#2C1B1B'; ctx.fillRect(2, 15, 4, 1); ctx.fillRect(10, 15, 4, 1);
      p.refresh();
    }

    // Big Player
    if (!scene.textures.exists('bigPlayer')) {
      const bp = scene.textures.createCanvas('bigPlayer', 16, 32)!;
      const ctx = bp.getContext();
      ctx.fillStyle = '#7B2D8B'; ctx.fillRect(5, 2, 6, 2); ctx.fillRect(4, 4, 8, 3); ctx.fillRect(3, 7, 10, 1); // Hat
      ctx.fillStyle = '#FFCCAA'; ctx.fillRect(5, 8, 6, 5); // Face
      ctx.fillStyle = '#000000'; ctx.fillRect(6, 9, 1, 1); ctx.fillRect(9, 9, 1, 1); ctx.fillRect(5, 11, 6, 1); // Eyes & Mustache
      ctx.fillStyle = '#F1C40F'; ctx.fillRect(3, 13, 10, 3); // Shoulders
      ctx.fillStyle = '#7B2D8B'; ctx.fillRect(4, 16, 8, 2); ctx.fillRect(3, 18, 4, 9); ctx.fillRect(9, 18, 4, 9); // Pants
      ctx.fillStyle = '#2C1B1B'; ctx.fillRect(2, 27, 5, 4); ctx.fillRect(9, 27, 5, 4); // Shoes
      bp.refresh();
    }

    // Enemy
    if (!scene.textures.exists('enemy')) {
      const e = scene.textures.createCanvas('enemy', 16, 16)!;
      const ctx = e.getContext();
      ctx.fillStyle = '#8B4513'; ctx.fillRect(2, 4, 12, 8); ctx.fillRect(0, 8, 16, 4);
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(4, 6, 3, 3); ctx.fillRect(9, 6, 3, 3);
      ctx.fillStyle = '#000000'; ctx.fillRect(5, 7, 1, 1); ctx.fillRect(10, 7, 1, 1);
      ctx.fillRect(0, 12, 6, 3); ctx.fillRect(10, 12, 6, 3);
      e.refresh();
    }
    if (!scene.textures.exists('enemy_walk')) {
      const e = scene.textures.createCanvas('enemy_walk', 16, 16)!;
      const ctx = e.getContext();
      ctx.fillStyle = '#8B4513'; ctx.fillRect(2, 4, 12, 8); ctx.fillRect(0, 8, 16, 4);
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(4, 6, 3, 3); ctx.fillRect(9, 6, 3, 3);
      ctx.fillStyle = '#000000'; ctx.fillRect(5, 7, 1, 1); ctx.fillRect(10, 7, 1, 1);
      ctx.fillRect(2, 12, 6, 3); ctx.fillRect(8, 12, 6, 3);
      e.refresh();
    }

    // Boss
    if (!scene.textures.exists('boss')) {
      const b = scene.textures.createCanvas('boss', 32, 32)!;
      const ctx = b.getContext();
      ctx.fillStyle = '#00A800'; ctx.fillRect(2, 2, 28, 16);
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(8, 10, 4, 4); ctx.fillRect(20, 10, 4, 4);
      ctx.fillStyle = '#000000'; ctx.fillRect(9, 12, 2, 2); ctx.fillRect(21, 12, 2, 2);
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(4, 18, 24, 4);
      ctx.fillStyle = '#000000'; ctx.fillRect(6, 19, 4, 2); ctx.fillRect(14, 19, 4, 2); ctx.fillRect(22, 19, 4, 2);
      ctx.fillStyle = '#E45A25'; ctx.fillRect(6, 24, 4, 6); ctx.fillRect(22, 24, 4, 6);
      b.refresh();
    }

    // Bridge
    if (!scene.textures.exists('bridge')) {
      const b = scene.textures.createCanvas('bridge', 16, 16)!;
      const ctx = b.getContext();
      ctx.fillStyle = '#8B4513'; ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#000000'; ctx.fillRect(0, 5, 16, 1); ctx.fillRect(0, 10, 16, 1);
      b.refresh();
    }

    // Button
    if (!scene.textures.exists('button')) {
      const b = scene.textures.createCanvas('button', 16, 16)!;
      const ctx = b.getContext();
      ctx.fillStyle = '#FF0000'; ctx.fillRect(2, 2, 12, 12);
      ctx.fillStyle = '#000000'; ctx.strokeRect(2.5, 2.5, 11, 11);
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(6, 6, 4, 4);
      b.refresh();
    }

    // Mushroom
    if (!scene.textures.exists('mushroom')) {
      const m = scene.textures.createCanvas('mushroom', 16, 16)!;
      const ctx = m.getContext();
      ctx.fillStyle = '#FF0000'; ctx.fillRect(2, 2, 12, 6);
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(2, 8, 12, 6);
      ctx.fillStyle = '#000000'; ctx.strokeRect(2.5, 2.5, 11, 11);
      m.refresh();
    }

    // Pipe
    if (!scene.textures.exists('pipe')) {
      const pi = scene.textures.createCanvas('pipe', 16, 32)!;
      const ctx = pi.getContext();
      ctx.fillStyle = '#00A800'; ctx.fillRect(0, 0, 16, 32);
      ctx.fillStyle = '#00F800'; ctx.fillRect(2, 2, 4, 28);
      ctx.fillStyle = '#000000'; ctx.strokeRect(0.5, 0.5, 15, 31); ctx.fillRect(0, 12, 16, 2);
      pi.refresh();
    }

    // Flag
    if (!scene.textures.exists('flag')) {
      const f = scene.textures.createCanvas('flag', 16, 16)!;
      const ctx = f.getContext();
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(7, 0, 2, 16);
      ctx.fillStyle = '#00FF00'; ctx.fillRect(2, 1, 5, 6);
      f.refresh();
    }

    // Cloud
    if (!scene.textures.exists('cloud')) {
      const c = scene.textures.createCanvas('cloud', 32, 16)!;
      const ctx = c.getContext();
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(8, 4, 16, 8); ctx.fillRect(4, 6, 24, 4);
      c.refresh();
    }

    // Hill
    if (!scene.textures.exists('hill')) {
      const h = scene.textures.createCanvas('hill', 48, 16)!;
      const ctx = h.getContext();
      ctx.fillStyle = '#00A800'; ctx.beginPath(); ctx.moveTo(0, 16); ctx.lineTo(24, 0); ctx.lineTo(48, 16); ctx.fill();
      h.refresh();
    }
  }
}