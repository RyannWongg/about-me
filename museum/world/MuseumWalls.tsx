import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { MeshStandardMaterial } from 'three';

interface WallProps {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
}

const Wall: React.FC<WallProps> = ({ position, size, rotation = [0, 0, 0] }) => {
  return (
    <>
      <mesh position={position} rotation={rotation} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      {/* Neon edge accent at the top */}
      <mesh position={[position[0], position[1] + size[1] / 2 + 0.1, position[2]]} rotation={rotation}>
        <boxGeometry args={[size[0], 0.1, size[2] + 0.02]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.5}
        />
      </mesh>
    </>
  );
};

interface TransparentWallProps {
  position: [number, number, number];
  size: [number, number, number];
  fadeDistance?: number;
}

const TransparentWall: React.FC<TransparentWallProps> = ({ position, size, fadeDistance = 15 }) => {
  const wallMatRef = useRef<MeshStandardMaterial>(null);
  const accentMatRef = useRef<MeshStandardMaterial>(null);
  const { camera } = useThree();

  useFrame(() => {
    // Get player position from camera (camera offset is [0, 8, 12] from player)
    const playerZ = camera.position.z - 12;

    // Calculate distance to wall (wall is at position[2])
    const distanceToWall = Math.abs(position[2] - playerZ);

    // Calculate opacity based on distance (fade when closer than fadeDistance)
    const opacity = Math.min(1, distanceToWall / fadeDistance);

    if (wallMatRef.current) {
      wallMatRef.current.opacity = opacity;
      wallMatRef.current.transparent = true;
    }
    if (accentMatRef.current) {
      accentMatRef.current.opacity = opacity;
      accentMatRef.current.transparent = true;
    }
  });

  return (
    <>
      <mesh position={position} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          ref={wallMatRef}
          color="#1e293b"
          roughness={0.9}
          metalness={0.1}
          transparent
        />
      </mesh>
      {/* Neon edge accent at the top */}
      <mesh position={[position[0], position[1] + size[1] / 2 + 0.1, position[2]]}>
        <boxGeometry args={[size[0], 0.1, size[2] + 0.02]} />
        <meshStandardMaterial
          ref={accentMatRef}
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.5}
          transparent
        />
      </mesh>
    </>
  );
};

export const MuseumWalls: React.FC = () => {
  const wallHeight = 7;
  const wallThickness = 0.5;
  const roomWidth = 50; // X axis
  const roomDepth = 60; // Z axis

  return (
    <>
      {/* Wall Colliders */}
      {/* North Wall Collider */}
      <RigidBody type="fixed" position={[0, wallHeight / 2, -roomDepth / 2]} colliders={false}>
        <CuboidCollider args={[roomWidth / 2, wallHeight / 2, wallThickness / 2]} />
      </RigidBody>

      {/* South Wall Collider */}
      <RigidBody type="fixed" position={[0, wallHeight / 2, roomDepth / 2]} colliders={false}>
        <CuboidCollider args={[roomWidth / 2, wallHeight / 2, wallThickness / 2]} />
      </RigidBody>

      {/* East Wall Collider */}
      <RigidBody type="fixed" position={[roomWidth / 2, wallHeight / 2, 0]} colliders={false}>
        <CuboidCollider args={[wallThickness / 2, wallHeight / 2, roomDepth / 2]} />
      </RigidBody>

      {/* West Wall Collider */}
      <RigidBody type="fixed" position={[-roomWidth / 2, wallHeight / 2, 0]} colliders={false}>
        <CuboidCollider args={[wallThickness / 2, wallHeight / 2, roomDepth / 2]} />
      </RigidBody>

      {/* Visual Walls */}
      {/* North Wall */}
      <Wall
        position={[0, wallHeight / 2, -roomDepth / 2]}
        size={[roomWidth, wallHeight, wallThickness]}
      />

      {/* South Wall - fades when player is near */}
      <TransparentWall
        position={[0, wallHeight / 2, roomDepth / 2]}
        size={[roomWidth, wallHeight, wallThickness]}
        fadeDistance={15}
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
    </>
  );
};
