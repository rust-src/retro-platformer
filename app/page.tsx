'use client';

import dynamic from 'next/dynamic';

// Disable Server-Side Rendering for the game canvas
const GameContainer = dynamic(() => import('@/components/GameContainer'), { 
  ssr: false,
  loading: () => <p className="text-white text-center mt-10">Loading Game Engine...</p>
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">
      <GameContainer />
    </main>
  );
}