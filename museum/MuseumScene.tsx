import React, { Suspense } from 'react';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import { MuseumFloor } from './world/MuseumFloor';
import { MuseumWalls } from './world/MuseumWalls';
import { MuseumLighting } from './world/MuseumLighting';
import { ProjectsGallery } from './world/ProjectsGallery';
import { SkillsRoom } from './world/SkillsRoom';
import { TimelineHallway } from './world/TimelineHallway';
import { AboutArea } from './world/AboutArea';
import { PlayerController } from './player/PlayerController';
import { Jukebox } from './exhibits/Jukebox';
import { Project } from '../types';

interface MuseumSceneProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  touchInput?: { x: number; y: number };
}

export const MuseumScene: React.FC<MuseumSceneProps> = ({
  projects,
  onSelectProject,
  touchInput = { x: 0, y: 0 },
}) => {
  return (
    <Physics gravity={[0, -20, 0]}>
      <MuseumLighting />
      <MuseumFloor />
      <MuseumWalls />

      {/* Project Gallery - East & North walls */}
      <Suspense fallback={null}>
        <ProjectsGallery projects={projects} onSelectProject={onSelectProject} />
      </Suspense>

      {/* Skills Room - South section */}
      <Suspense fallback={null}>
        <SkillsRoom />
      </Suspense>

      {/* Timeline Hallway - West wall */}
      <Suspense fallback={null}>
        <TimelineHallway />
      </Suspense>

      {/* About Area - North section */}
      <Suspense fallback={null}>
        <AboutArea />
      </Suspense>

      {/* About Area Collision Boxes */}
      {/* Left pedestal collision */}
      <RigidBody type="fixed" position={[-2, 1.5, -14]} colliders={false}>
        <CuboidCollider args={[1.2, 2, 1.2]} />
      </RigidBody>

      {/* Right pedestal collision */}
      <RigidBody type="fixed" position={[2, 2, -14]} colliders={false}>
        <CuboidCollider args={[1.2, 2.5, 1.2]} />
      </RigidBody>

      {/* Right panels collision */}
      <RigidBody type="fixed" position={[6, 2, -12]} rotation={[0, -Math.PI / 6, 0]} colliders={false}>
        <CuboidCollider args={[2.5, 2, 0.3]} />
      </RigidBody>

      {/* Left contact buttons collision */}
      <RigidBody type="fixed" position={[-5.5, 1.5, -12]} rotation={[0, Math.PI / 6, 0]} colliders={false}>
        <CuboidCollider args={[1.5, 2, 0.3]} />
      </RigidBody>


      {/* Welcome Sign */}
      <group position={[0, 0, 2]}>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[5, 0.8, 0.1]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
        <mesh position={[0, 1.2, 0.06]}>
          <boxGeometry args={[5.1, 0.85, 0.01]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.15}
          />
        </mesh>
        <Text
          position={[0, 1.2, 0.08]}
          fontSize={0.28}
          color="#39ff14"
          anchorX="center"
          anchorY="middle"
        >
          WELCOME TO MY PORTFOLIO
        </Text>
        <Text
          position={[0, 0.85, 0.08]}
          fontSize={0.12}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          Use WASD to explore
        </Text>
      </group>

      {/* Jukebox - right side of welcome lobby */}
      <Suspense fallback={null}>
        <Jukebox position={[6, 0, 2]} />
      </Suspense>

      {/* Player */}
      <PlayerController touchInput={touchInput} />
    </Physics>
  );
};
