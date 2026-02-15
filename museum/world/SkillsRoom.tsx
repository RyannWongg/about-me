import React from 'react';
import { Text } from '@react-three/drei';
import { HolographicDisplay } from '../exhibits/HolographicDisplay';

export const SkillsRoom: React.FC = () => {
  // Position in the south section of the museum
  const roomCenterZ = 20;
  const roomCenterX = 0;

  return (
    <group position={[roomCenterX, 0, roomCenterZ]}>
      {/* Room title - facing north (toward center/player) */}
      <Text
        position={[0, 4.5, -6]}
        rotation={[0, 0, 0]}
        fontSize={0.8}
        color="#39ff14"
        anchorX="center"
        anchorY="middle"
      >
        SKILL MATRIX
      </Text>

      {/* Subtitle */}
      <Text
        position={[0, 4, -6]}
        rotation={[0, 0, 0]}
        fontSize={0.25}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        Hover over orbs to view skills
      </Text>

      {/* Decorative line */}
      <mesh position={[0, 3.7, -6]}>
        <boxGeometry args={[8, 0.05, 0.02]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Central holographic display */}
      <HolographicDisplay />

      {/* Floor decoration - circular platform */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5, 8, 64]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#39ff14"
          emissiveIntensity={0.02}
        />
      </mesh>

      {/* Outer ring markers */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const x = Math.cos(angle) * 6;
        const z = Math.sin(angle) * 6;
        return (
          <mesh key={i} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.3, 16]} />
            <meshStandardMaterial
              color="#39ff14"
              emissive="#39ff14"
              emissiveIntensity={0.3}
              transparent
              opacity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};
