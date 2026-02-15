import React from 'react';
import { RigidBody } from '@react-three/rapier';

interface WallProps {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
}

const Wall: React.FC<WallProps> = ({ position, size, rotation = [0, 0, 0] }) => {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh position={position} rotation={rotation} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      {/* Neon edge accent at the top */}
      <mesh position={[position[0], position[1] + size[1] / 2 - 0.05, position[2]]} rotation={rotation}>
        <boxGeometry args={[size[0], 0.1, size[2] + 0.02]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.5}
        />
      </mesh>
    </RigidBody>
  );
};

export const MuseumWalls: React.FC = () => {
  const wallHeight = 7;
  const wallThickness = 0.5;
  const roomWidth = 60; // X axis
  const roomDepth = 70; // Z axis

  return (
    <group>
      {/* Outer Walls */}

      {/* North Wall */}
      <Wall
        position={[0, wallHeight / 2, -roomDepth / 2]}
        size={[roomWidth, wallHeight, wallThickness]}
      />

      {/* South Wall */}
      <Wall
        position={[0, wallHeight / 2, roomDepth / 2]}
        size={[roomWidth, wallHeight, wallThickness]}
      />

      {/* East Wall */}
      <Wall
        position={[roomWidth / 2, wallHeight / 2, 0]}
        size={[wallThickness, wallHeight, roomDepth]}
      />

      {/* West Wall */}
      <Wall
        position={[-roomWidth / 2, wallHeight / 2, 0]}
        size={[wallThickness, wallHeight, roomDepth]}
      />

    </group>
  );
};
