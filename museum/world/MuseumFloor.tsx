import React from 'react';
import { RigidBody } from '@react-three/rapier';

export const MuseumFloor: React.FC = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 80]} />
        <meshStandardMaterial
          color="#0a0f1a"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>


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
