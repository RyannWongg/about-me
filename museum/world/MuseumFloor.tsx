import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Grid } from '@react-three/drei';

export const MuseumFloor: React.FC = () => {
  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Floor collider - thin box */}
      <CuboidCollider args={[25, 0.1, 30]} position={[0, -0.1, 0]} />

      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 60]} />
        <meshStandardMaterial
          color="#0a0f1a"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Floor grid */}
      <Grid
        position={[0, 0.01, 0]}
        args={[50, 60]}
        cellSize={2}
        cellThickness={0.5}
        cellColor="#39ff14"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#00ffff"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />


      {/* Lobby area highlight */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 2]} receiveShadow>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.08}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Outer ring around lobby */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 2]}>
        <ringGeometry args={[3.8, 4.2, 64]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>


    </RigidBody>
  );
};
