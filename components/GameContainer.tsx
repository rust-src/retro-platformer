'use client';

import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { PhaserGameConfig } from '@/game/config';

export default function GameContainer() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hud, setHud] = useState({ score: 0, coins: 0, level: 1 });
  const [showHud, setShowHud] = useState(false);

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    if (containerRef.current && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        ...PhaserGameConfig,
        parent: containerRef.current,
      };
      gameRef.current = new Phaser.Game(config);

      gameRef.current.events.on('updateHUD', (data: { score: number, coins: number, level: number }) => {
        setHud(data);
      });
      
      gameRef.current.events.on('showHUD', (show: boolean) => {
        setShowHud(show);
      });
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {showHud && (
        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)' }} className="text-white font-mono text-sm sm:text-xl bg-black/50 px-4 py-2 rounded-md flex gap-6 pointer-events-none whitespace-nowrap z-10">
          <span className="mx-2">WORLD 1-{hud.level}</span>
          <span className="mx-2">COINS: x{hud.coins.toString().padStart(2, '0')}</span>
          <span className="mx-2">SCORE: {hud.score.toString().padStart(6, '0')}</span>
        </div>
      )}
    </div>
  );
}