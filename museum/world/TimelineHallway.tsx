import React from 'react';
import { Text } from '@react-three/drei';
import { TimelineMarker } from '../exhibits/TimelineMarker';
import { TimelineEvent } from '../../types';

// Timeline data extracted from Timeline.tsx
const events: TimelineEvent[] = [
  {
    id: '3',
    year: '2022 - Present',
    title: 'Bachelor of Arts & Science',
    subtitle: 'University of Toronto',
    description: [
      'Specialist in Mathematics & Statistics',
      'Major in Computer Science',
    ],
    type: 'education',
  },
  {
    id: '1',
    year: '2025.07 - 2025.08',
    title: 'IT Support & Software Testing',
    subtitle: 'SJM Macau',
    description: [
      'Software QA Testing & Bug Documentation',
      'Hardware/software system support',
    ],
    type: 'experience',
  },
  {
    id: '2',
    year: '2020.10 - 2021.03',
    title: 'Website Developer',
    subtitle: 'Macau Pui Ching Middle School',
    description: [
      'Built iGEM Research Portal',
      'Front-end optimization',
    ],
    type: 'experience',
  },
];

export const TimelineHallway: React.FC = () => {
  // Position along the west wall
  const hallwayX = -20;
  const startZ = -10;
  const spacing = 8;

  return (
    <group>
      {/* Hallway title */}
      <Text
        position={[-24, 5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.8}
        color="#39ff14"
        anchorX="center"
        anchorY="middle"
      >
        CAREER TIMELINE
      </Text>

      {/* Decorative line */}
      <mesh position={[-24.5, 4.3, 0]}>
        <boxGeometry args={[0.02, 0.05, 12]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Timeline path on floor */}
      <mesh position={[hallwayX + 5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 25]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Dashed lines effect */}
      {[...Array(12)].map((_, i) => (
        <mesh
          key={i}
          position={[hallwayX + 5, 0.02, -11 + i * 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.15, 1]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Timeline markers */}
      {events.map((event, index) => (
        <TimelineMarker
          key={event.id}
          event={event}
          position={[hallwayX, 0, startZ + index * spacing]}
          isFirst={index === 0}
          index={index}
          totalCount={events.length}
        />
      ))}

      {/* Arrow indicating direction (past to present) */}
      <group position={[hallwayX + 5, 0.1, -13]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.3, 0.8, 3]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.3}
          />
        </mesh>
        <Text
          position={[0, 0, -1]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.25}
          color="#39ff14"
        >
          PRESENT
        </Text>
      </group>

      <group position={[hallwayX + 5, 0.1, 13]}>
        <mesh rotation={[-Math.PI / 2, 0, Math.PI]}>
          <coneGeometry args={[0.3, 0.8, 3]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.3}
          />
        </mesh>
        <Text
          position={[0, 0, 1]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.25}
          color="#39ff14"
        >
          PAST
        </Text>
      </group>
    </group>
  );
};
