import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import { Group, Mesh } from 'three';

interface SkillCategory {
  name: string;
  color: string;
  skills: { name: string; proficiency: number }[];
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Languages',
    color: '#39ff14',
    skills: [
      { name: 'Python', proficiency: 90 },
      { name: 'C', proficiency: 80 },
      { name: 'Java', proficiency: 85 },
      { name: 'SQL', proficiency: 85 },
      { name: 'Assembly', proficiency: 70 },
      { name: 'TypeScript', proficiency: 75 },
    ],
  },
  {
    name: 'Web & Tools',
    color: '#3b82f6',
    skills: [
      { name: 'React', proficiency: 80 },
      { name: 'JavaScript', proficiency: 85 },
      { name: 'HTML5', proficiency: 90 },
      { name: 'CSS3', proficiency: 85 },
      { name: 'Git', proficiency: 80 },
      { name: 'D3.js', proficiency: 70 },
    ],
  },
  {
    name: 'Libraries & AI',
    color: '#a855f7',
    skills: [
      { name: 'Pandas', proficiency: 85 },
      { name: 'NumPy', proficiency: 80 },
      { name: 'OpenCV', proficiency: 70 },
      { name: 'OpenAI API', proficiency: 75 },
    ],
  },
  {
    name: 'Cloud & Infra',
    color: '#f59e0b',
    skills: [
      { name: 'GCP', proficiency: 65 },
      { name: 'Firebase', proficiency: 70 },
    ],
  },
];

interface SkillOrbProps {
  category: SkillCategory;
  angle: number;
  radius: number;
  baseY: number;
  onHover: (isHovered: boolean) => void;
  parentGroupRef: React.RefObject<Group>;
  index: number;
}

const SkillOrb: React.FC<SkillOrbProps> = ({ category, angle, radius, baseY, onHover, parentGroupRef, index }) => {
  const [hovered, setHovered] = useState(false);
  const labelGroupRef = useRef<Group>(null);
  const orbGroupRef = useRef<Group>(null);

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  // Calculate average proficiency for the category
  const avgProficiency = category.skills.reduce((sum, s) => sum + s.proficiency, 0) / category.skills.length;
  const orbSize = 0.4 + (avgProficiency / 100) * 0.4;

  // Counter-rotate the labels to always face south + individual bobbing
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (labelGroupRef.current && parentGroupRef.current) {
      labelGroupRef.current.rotation.y = -parentGroupRef.current.rotation.y;
    }

    // Individual bobbing with phase offset based on index (stop when hovered)
    if (orbGroupRef.current && !hovered) {
      const phaseOffset = (index / 4) * Math.PI * 2;
      orbGroupRef.current.position.y = baseY + Math.sin(time * 0.8 + phaseOffset) * 0.3;
    }
  });

  return (
    <group
      ref={orbGroupRef}
      position={[x, baseY, z]}
      onPointerEnter={() => {
        setHovered(true);
        onHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHover(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Main orb */}
      <mesh>
        <sphereGeometry args={[orbSize, 32, 32]} />
        <meshStandardMaterial
          color={category.color}
          emissive={category.color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[orbSize * 0.6, 16, 16]} />
        <meshBasicMaterial
          color={category.color}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Labels group - counter-rotated to face south */}
      <group ref={labelGroupRef}>
        {/* Category label */}
        <Text
          position={[0, orbSize + 0.5, 0]}
          fontSize={0.25}
          color={category.color}
          anchorX="center"
          anchorY="bottom"
        >
          {category.name}
        </Text>

        {/* Skill count - under category name */}
        <Text
          position={[0, orbSize + 0.25, 0]}
          fontSize={0.15}
          color="#94a3b8"
          anchorX="center"
          anchorY="bottom"
        >
          {category.skills.length} skills
        </Text>
      </group>

      {/* Expanded skill list on hover */}
      {hovered && (
        <Html position={[0, 0, orbSize + 0.5]} center distanceFactor={8}>
          <div
            className="p-4 rounded-xl min-w-[180px]"
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: `2px solid ${category.color}`,
              boxShadow: `0 0 30px ${category.color}50`,
            }}
          >
            <h3
              className="font-bold text-sm mb-3 pb-2 border-b"
              style={{ color: category.color, borderColor: `${category.color}40` }}
            >
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: `${category.color}20`,
                    color: category.color,
                    border: `1px solid ${category.color}50`,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export const HolographicDisplay: React.FC = () => {
  const groupRef = useRef<Group>(null);
  const ringsRef = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);
  const [isAnyOrbHovered, setIsAnyOrbHovered] = useState(false);

  // Rotate the entire display slowly (pause when hovering)
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current && !isAnyOrbHovered) {
      // Slower rotation
      groupRef.current.rotation.y += 0.001;
    }
    if (ringsRef.current && !isAnyOrbHovered) {
      ringsRef.current.rotation.z += 0.002;
    }
    if (coreRef.current) {
      if (!isAnyOrbHovered) {
        coreRef.current.rotation.y -= 0.005;
      }
      // Pulsing effect (always active)
      const scale = 1 + Math.sin(time * 2) * 0.1;
      coreRef.current.scale.setScalar(scale);
    }
  });

  const orbitRadius = 3;
  const baseY = 2.5;

  return (
    <group>
      {/* Base pedestal */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[2, 2.5, 0.6, 32]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Pedestal top ring */}
      <mesh position={[0, 0.65, 0]}>
        <torusGeometry args={[2, 0.08, 8, 32]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Holographic projection beam */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 1.5, 2, 32, 1, true]} />
        <meshBasicMaterial
          color="#39ff14"
          transparent
          opacity={0.1}
          side={2}
        />
      </mesh>

      {/* Central core */}
      <mesh ref={coreRef} position={[0, baseY, 0]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.6}
          wireframe
        />
      </mesh>

      {/* Orbiting rings */}
      <group position={[0, baseY, 0]}>
        <mesh ref={ringsRef} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.8, 0.02, 8, 64]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.4}
            transparent
            opacity={0.6}
          />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[2.2, 0.015, 8, 64]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.4}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>

      {/* Skill category orbs - rotating */}
      <group ref={groupRef} position={[0, 0, 0]}>
        {skillCategories.map((category, index) => {
          const angle = (index / skillCategories.length) * Math.PI * 2;
          return (
            <SkillOrb
              key={category.name}
              category={category}
              angle={angle}
              radius={orbitRadius}
              baseY={baseY}
              onHover={setIsAnyOrbHovered}
              parentGroupRef={groupRef}
              index={index}
            />
          );
        })}
      </group>

      {/* Connecting lines from core to orbs */}
      {skillCategories.map((category, index) => {
        const angle = (index / skillCategories.length) * Math.PI * 2;
        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * orbitRadius;
        const length = Math.sqrt(x * x + z * z);

        return (
          <mesh
            key={`line-${category.name}`}
            position={[x / 2, baseY, z / 2]}
            rotation={[0, -angle + Math.PI / 2, 0]}
          >
            <boxGeometry args={[length, 0.02, 0.02]} />
            <meshBasicMaterial
              color={category.color}
              transparent
              opacity={0.3}
            />
          </mesh>
        );
      })}

      {/* Floor glow effect */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshBasicMaterial
          color="#39ff14"
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Point light for the hologram */}
      <pointLight
        position={[0, baseY, 0]}
        intensity={2}
        color="#39ff14"
        distance={8}
      />
    </group>
  );
};
