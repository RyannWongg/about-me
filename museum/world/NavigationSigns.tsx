import React from 'react';
import { Text } from '@react-three/drei';

interface DirectionSignProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  labels: { text: string; direction: 'left' | 'right' | 'forward' | 'back' }[];
}

const DirectionSign: React.FC<DirectionSignProps> = ({
  position,
  rotation = [0, 0, 0],
  labels,
}) => {
  const arrowSymbol = {
    left: '←',
    right: '→',
    forward: '↑',
    back: '↓',
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Sign post */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 3, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Sign boards */}
      {labels.map((label, index) => (
        <group key={label.text} position={[0, 2.8 - index * 0.5, 0]}>
          <mesh>
            <boxGeometry args={[2.5, 0.4, 0.08]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <boxGeometry args={[2.55, 0.45, 0.01]} />
            <meshStandardMaterial
              color="#39ff14"
              emissive="#39ff14"
              emissiveIntensity={0.2}
            />
          </mesh>
          <Text
            position={[-0.9, 0, 0.06]}
            fontSize={0.15}
            color="#39ff14"
            anchorX="left"
            anchorY="middle"
          >
            {arrowSymbol[label.direction]} {label.text}
          </Text>
        </group>
      ))}

      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};

export const NavigationSigns: React.FC = () => {
  return (
    <group>
      {/* Center lobby sign */}
      <DirectionSign
        position={[0, 0, 5]}
        labels={[
          { text: 'PROJECTS', direction: 'right' },
          { text: 'TIMELINE', direction: 'left' },
          { text: 'ABOUT', direction: 'forward' },
        ]}
      />

      {/* South direction sign */}
      <DirectionSign
        position={[0, 0, 10]}
        rotation={[0, Math.PI, 0]}
        labels={[
          { text: 'SKILLS', direction: 'forward' },
          { text: 'LOBBY', direction: 'back' },
        ]}
      />

      {/* Welcome sign at spawn */}
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
          font={undefined}
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
          Use WASD to explore • Click exhibits to view
        </Text>
      </group>
    </group>
  );
};
