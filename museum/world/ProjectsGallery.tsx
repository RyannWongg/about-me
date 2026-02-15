import React from 'react';
import { Text } from '@react-three/drei';
import { ProjectFrame } from '../exhibits/ProjectFrame';
import { Project } from '../../types';

interface ProjectsGalleryProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({
  projects,
  onSelectProject,
}) => {
  // All projects on the east side - closer to center
  const eastWallX = 17;
  const spacing = 6;

  return (
    <group>
      {/* Gallery section title */}
      <Text
        position={[eastWallX + 1, 5.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.8}
        color="#39ff14"
        anchorX="center"
        anchorY="middle"
      >
        PROJECT GALLERY
      </Text>

      {/* Decorative line under title */}
      <mesh position={[eastWallX + 1.5, 4.8, 0]}>
        <boxGeometry args={[0.02, 0.05, 10]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* All 6 projects */}
      {projects.map((project, index) => (
        <ProjectFrame
          key={project.id}
          project={project}
          position={[eastWallX, 3, -12 + index * spacing]}
          rotation={[0, -Math.PI / 2, 0]} // Face west (into the room)
          onSelect={onSelectProject}
        />
      ))}

      {/* Floor markers/pedestals for visual guidance */}
      {projects.map((_, index) => (
        <mesh key={`pedestal-${index}`} position={[eastWallX - 3, 0.05, -12 + index * spacing]}>
          <cylinderGeometry args={[0.8, 1, 0.1, 16]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive="#39ff14"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}

      {/* Spotlights pointing at each frame - no shadows for performance */}
      {projects.map((_, index) => (
        <spotLight
          key={`spotlight-${index}`}
          position={[eastWallX - 4, 5.5, -12 + index * spacing]}
          target-position={[eastWallX, 3, -12 + index * spacing]}
          angle={0.4}
          penumbra={0.5}
          intensity={2}
          color="#ffffff"
        />
      ))}
    </group>
  );
};
