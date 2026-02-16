import React, { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Text } from '@react-three/drei';
import { Mesh, Group, Vector3 } from 'three';
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
  const [inSpotlight, setInSpotlight] = useState(false);
  const groupRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);
  const frameGroupRef = useRef<Group>(null);
  const { camera } = useThree();

  // Load project image as texture
  const imagePath = project.image
    ? `${import.meta.env.BASE_URL}${project.image}`
    : `${import.meta.env.BASE_URL}profile.png`;

  const texture = useTexture(imagePath);

  // Spotlight detection radius (player standing on pedestal)
  const spotlightRadius = 1.5;

  // Combined active state for hover or spotlight
  const isActive = hovered || inSpotlight;

  // Animate glow and rotation on hover or in spotlight
  useFrame((state, delta) => {
    // Pedestal position is 3 units in front of the frame (towards negative X from frame perspective)
    // Offset Z by -1 to better align with the visual spotlight
    const pedestalWorldPos = new Vector3(position[0] - 3, 0, position[2] + 1);

    // Get player position from camera (camera offset is [0, 8, 12] from player)
    const playerPos = new Vector3(
      camera.position.x,
      0,
      camera.position.z - 12
    );

    // Check if player is near the pedestal
    const distanceToPedestal = playerPos.distanceTo(pedestalWorldPos);
    const nowInSpotlight = distanceToPedestal < spotlightRadius;

    // Only update state if changed to avoid unnecessary re-renders
    if (nowInSpotlight !== inSpotlight) {
      setInSpotlight(nowInSpotlight);
    }

    const currentlyActive = hovered || nowInSpotlight;

    if (glowRef.current) {
      const scale = currentlyActive ? 1.05 + Math.sin(state.clock.elapsedTime * 3) * 0.02 : 1;
      glowRef.current.scale.setScalar(scale);
    }

    // Rotate to face camera on hover or in spotlight (90 degrees = Math.PI / 2)
    if (frameGroupRef.current) {
      const targetRotation = currentlyActive ? Math.PI / 2 : 0;
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
            opacity={isActive ? 0.3 : 0}
          />
        </mesh>

        {/* Frame border */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[frameWidth + borderWidth * 2, frameHeight + borderWidth * 2, frameDepth]} />
          <meshStandardMaterial
            color={isActive ? '#39ff14' : '#334155'}
            metalness={0.8}
            roughness={0.2}
            emissive={isActive ? '#39ff14' : '#000000'}
            emissiveIntensity={isActive ? 0.3 : 0}
          />
        </mesh>

        {/* Project image or In Progress placeholder */}
        {project.status === 'Completed' && project.image ? (
          <mesh position={[0, 0, frameDepth / 2 + 0.01]}>
            <planeGeometry args={[frameWidth, frameHeight]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.5}
              metalness={0.1}
            />
          </mesh>
        ) : (
          <group position={[0, 0, frameDepth / 2 + 0.01]}>
            {/* Dark background */}
            <mesh>
              <planeGeometry args={[frameWidth, frameHeight]} />
              <meshStandardMaterial
                color="#1e293b"
                roughness={0.8}
                metalness={0.2}
              />
            </mesh>
            {/* In Progress text */}
            <Text
              position={[0, 0.2, 0.01]}
              fontSize={0.35}
              color="#f59e0b"
              anchorX="center"
              anchorY="middle"
            >
              IN PROGRESS
            </Text>
            {/* Decorative icon/symbol */}
            <Text
              position={[0, -0.3, 0.01]}
              fontSize={0.5}
              color="#f59e0b"
              anchorX="center"
              anchorY="middle"
            >
              🚧
            </Text>
          </group>
        )}

        {/* Project title label - 3D text box */}
        <group position={[0, -frameHeight / 2 - 0.8, 0]}>
          {/* Background box */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[frameWidth + 0.5, 1.2, 0.1]} />
            <meshStandardMaterial
              color={isActive ? '#39ff14' : '#0f172a'}
              emissive={isActive ? '#39ff14' : '#000000'}
              emissiveIntensity={isActive ? 0.2 : 0}
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>

          {/* Project title */}
          <Text
            position={[0, 0.25, 0.06]}
            fontSize={0.18}
            color={isActive ? '#0f172a' : '#ffffff'}
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
            color={isActive ? '#1e293b' : '#94a3b8'}
            anchorX="center"
            anchorY="middle"
          >
            {project.category}
          </Text>

          {/* Click hint when active */}
          {isActive && project.status === 'Completed' && (
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
