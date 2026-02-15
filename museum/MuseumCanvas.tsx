import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr } from '@react-three/drei';
import { MuseumScene } from './MuseumScene';
import { Project } from '../types';

interface MuseumCanvasProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  touchInput?: { x: number; y: number };
}

export const MuseumCanvas: React.FC<MuseumCanvasProps> = ({
  projects,
  onSelectProject,
  touchInput = { x: 0, y: 0 },
}) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 10, 15], fov: 60 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ background: '#0f172a' }}
    >
      <AdaptiveDpr pixelated />
      <color attach="background" args={['#0f172a']} />
      <fog attach="fog" args={['#0f172a', 30, 60]} />

      <Suspense fallback={null}>
        <MuseumScene
          projects={projects}
          onSelectProject={onSelectProject}
          touchInput={touchInput}
        />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};
