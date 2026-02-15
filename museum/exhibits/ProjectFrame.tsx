import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Text } from '@react-three/drei';
import { Mesh, Group } from 'three';
import { Project } from '../../types';

interface ProjectFrameProps {
  project: Project;
  position: [number, number, number];
  rotation?: [number, number, number];
  onSelect: (project: Project) => void;
}

export const ProjectFrame: React.FC<ProjectFrameProps> = ({
  project,
  position,
  rotation = [0, 0, 0],
  onSelect,
}) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);
  const frameGroupRef = useRef<Group>(null);

  // Load project image as texture
  const imagePath = project.image
    ? `${import.meta.env.BASE_URL}${project.image}`
    : `${import.meta.env.BASE_URL}profile.png`;

  const texture = useTexture(imagePath);

  // Animate glow and rotation on hover
  useFrame((state, delta) => {
    if (glowRef.current) {
      const scale = hovered ? 1.05 + Math.sin(state.clock.elapsedTime * 3) * 0.02 : 1;
      glowRef.current.scale.setScalar(scale);
    }

    // Rotate to face camera on hover (90 degrees = Math.PI / 2)
    if (frameGroupRef.current) {
      const targetRotation = hovered ? Math.PI / 2 : 0;
      frameGroupRef.current.rotation.y += (targetRotation - frameGroupRef.current.rotation.y) * 5 * delta;
    }
  });

  const frameWidth = 3;
  const frameHeight = 2;
  const frameDepth = 0.15;
  const borderWidth = 0.15;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (project.status === 'Completed') {
          onSelect(project);
        }
      }}
    >
      {/* Inner group that rotates on hover */}
      <group ref={frameGroupRef}>
        {/* Glow effect behind frame */}
        <mesh ref={glowRef} position={[0, 0, -0.1]}>
          <planeGeometry args={[frameWidth + 0.5, frameHeight + 0.5]} />
          <meshBasicMaterial
            color="#39ff14"
            transparent
            opacity={hovered ? 0.3 : 0}
          />
        </mesh>

        {/* Frame border */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[frameWidth + borderWidth * 2, frameHeight + borderWidth * 2, frameDepth]} />
          <meshStandardMaterial
            color={hovered ? '#39ff14' : '#334155'}
            metalness={0.8}
            roughness={0.2}
            emissive={hovered ? '#39ff14' : '#000000'}
            emissiveIntensity={hovered ? 0.3 : 0}
          />
        </mesh>

        {/* Project image */}
        <mesh position={[0, 0, frameDepth / 2 + 0.01]}>
          <planeGeometry args={[frameWidth, frameHeight]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>

        {/* Project title label - 3D text box */}
        <group position={[0, -frameHeight / 2 - 0.8, 0]}>
          {/* Background box */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[frameWidth + 0.5, 1.2, 0.1]} />
            <meshStandardMaterial
              color={hovered ? '#39ff14' : '#0f172a'}
              emissive={hovered ? '#39ff14' : '#000000'}
              emissiveIntensity={hovered ? 0.2 : 0}
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>

          {/* Project title */}
          <Text
            position={[0, 0.25, 0.06]}
            fontSize={0.18}
            color={hovered ? '#0f172a' : '#ffffff'}
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            maxWidth={frameWidth}
          >
            {project.title}
          </Text>

          {/* Category */}
          <Text
            position={[0, -0.15, 0.06]}
            fontSize={0.12}
            color={hovered ? '#1e293b' : '#94a3b8'}
            anchorX="center"
            anchorY="middle"
          >
            {project.category}
          </Text>

          {/* Click hint when hovered */}
          {hovered && project.status === 'Completed' && (
            <Text
              position={[0, -0.4, 0.06]}
              fontSize={0.1}
              color="#39ff14"
              anchorX="center"
              anchorY="middle"
            >
              [Click to view]
            </Text>
          )}

          {/* In Progress indicator */}
          {project.status === 'In Progress' && (
            <Text
              position={[0, -0.4, 0.06]}
              fontSize={0.1}
              color="#f59e0b"
              anchorX="center"
              anchorY="middle"
            >
              In Progress
            </Text>
          )}
        </group>

        {/* Status indicator */}
        <mesh position={[frameWidth / 2 + 0.1, frameHeight / 2 + 0.1, 0.1]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color={project.status === 'Completed' ? '#39ff14' : '#f59e0b'}
            emissive={project.status === 'Completed' ? '#39ff14' : '#f59e0b'}
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </group>
  );
};
