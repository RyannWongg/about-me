import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Group, Mesh } from 'three';
import { useGame } from '../context/GameContext';

interface JukeboxProps {
  position?: [number, number, number];
}

export const Jukebox: React.FC<JukeboxProps> = ({ position = [15, 0, 15] }) => {
  const groupRef = useRef<Group>(null);
  const discRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { isMusicPlaying, setIsMusicPlaying, unlockAchievement } = useGame();

  useFrame((state) => {
    // Rotate disc when playing
    if (discRef.current && isMusicPlaying) {
      discRef.current.rotation.y += 0.02;
    }

    // Hover animation
    if (groupRef.current) {
      const targetY = isHovered ? 0.05 : 0;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1;
    }
  });

  const handleClick = () => {
    setIsMusicPlaying(!isMusicPlaying);
    if (!isMusicPlaying) {
      unlockAchievement('music_lover');
    }
  };

  // Vintage color palette
  const woodDark = "#4a3728";
  const woodMedium = "#6b4423";
  const woodLight = "#8b5a2b";
  const brass = "#b8860b";
  const brassLight = "#daa520";
  const cream = "#f5f5dc";
  const warmGlow = "#ffaa00";

  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      {/* Collider */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.3, 0.5, 0.5]} position={[0, 0.9, 0]} />
      </RigidBody>

      <group
        ref={groupRef}
        onClick={handleClick}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        {/* Base/Cabinet - Main body */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.3, 1.5, 0.9]} />
          <meshStandardMaterial
            color={woodMedium}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Wood panel inset - front */}
        <mesh position={[0, 0.75, -0.4]}>
          <boxGeometry args={[1.1, 1.3, 0.05]} />
          <meshStandardMaterial
            color={woodDark}
            metalness={0.05}
            roughness={0.9}
          />
        </mesh>

        {/* Top curved dome */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={woodDark}
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>

        {/* Brass dome trim ring */}
        <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.03, 8, 32]} />
          <meshStandardMaterial
            color={brass}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Display window frame - brass */}
        <mesh position={[0, 1.1, -0.42]}>
          <boxGeometry args={[0.85, 0.55, 0.08]} />
          <meshStandardMaterial
            color={brass}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Display window - glass */}
        <mesh position={[0, 1.1, -0.44]}>
          <boxGeometry args={[0.75, 0.45, 0.02]} />
          <meshStandardMaterial
            color="#1a1a1a"
            emissive={isMusicPlaying ? warmGlow : "#2a1a0a"}
            emissiveIntensity={isMusicPlaying ? 0.4 : 0.1}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Vinyl disc */}
        <group position={[0, 1.1, -0.38]}>
          <mesh ref={discRef}>
            <cylinderGeometry args={[0.18, 0.18, 0.015, 32]} />
            <meshStandardMaterial
              color="#0a0a0a"
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          {/* Disc grooves */}
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.01, 32]} />
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.4}
              roughness={0.5}
            />
          </mesh>
          {/* Disc label */}
          <mesh position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.015, 16]} />
            <meshStandardMaterial
              color={isMusicPlaying ? "#cc3333" : "#8b0000"}
              emissive={isMusicPlaying ? "#ff4444" : "#330000"}
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>

        {/* Speaker section - fabric grill */}
        <mesh position={[0, 0.35, -0.42]}>
          <boxGeometry args={[0.9, 0.5, 0.05]} />
          <meshStandardMaterial
            color="#3d2817"
            metalness={0}
            roughness={1}
          />
        </mesh>

        {/* Speaker grill pattern - brass circles */}
        {[...Array(3)].map((_, row) =>
          [...Array(5)].map((_, col) => (
            <mesh
              key={`hole-${row}-${col}`}
              position={[-0.3 + col * 0.15, 0.22 + row * 0.13, -0.44]}
            >
              <circleGeometry args={[0.025, 12]} />
              <meshStandardMaterial
                color={brass}
                emissive={isMusicPlaying ? warmGlow : brass}
                emissiveIntensity={isMusicPlaying ? 0.3 : 0}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          ))
        )}

        {/* Control panel */}
        <mesh position={[0, 0.05, -0.42]}>
          <boxGeometry args={[0.9, 0.12, 0.06]} />
          <meshStandardMaterial
            color={woodLight}
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>

        {/* Control buttons */}
        <group position={[0, 0.05, -0.44]}>
          {/* Play/Pause button - center */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
            <meshStandardMaterial
              color={isMusicPlaying ? "#228b22" : "#8b0000"}
              emissive={isMusicPlaying ? "#33ff33" : "#ff3333"}
              emissiveIntensity={0.4}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>

          {/* Side buttons - brass */}
          <mesh position={[-0.2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.025, 16]} />
            <meshStandardMaterial color={brass} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.025, 16]} />
            <meshStandardMaterial color={brass} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-0.35, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.025, 16]} />
            <meshStandardMaterial color={brass} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0.35, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.025, 16]} />
            <meshStandardMaterial color={brass} metalness={0.8} roughness={0.3} />
          </mesh>
        </group>

        {/* Brass trim - top */}
        <mesh position={[0, 1.52, -0.42]}>
          <boxGeometry args={[1.2, 0.04, 0.08]} />
          <meshStandardMaterial
            color={brass}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Brass trim - bottom */}
        <mesh position={[0, 0.02, -0.42]}>
          <boxGeometry args={[1.2, 0.04, 0.08]} />
          <meshStandardMaterial
            color={brass}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Side brass strips */}
        <mesh position={[-0.6, 0.75, -0.42]}>
          <boxGeometry args={[0.04, 1.5, 0.06]} />
          <meshStandardMaterial
            color={brass}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0.6, 0.75, -0.42]}>
          <boxGeometry args={[0.04, 1.5, 0.06]} />
          <meshStandardMaterial
            color={brass}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Decorative corner pieces */}
        {[[-0.58, 1.48], [0.58, 1.48], [-0.58, 0.02], [0.58, 0.02]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, -0.44]}>
            <boxGeometry args={[0.08, 0.08, 0.04]} />
            <meshStandardMaterial
              color={brassLight}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        ))}

        {/* Legs */}
        {[[-0.5, 0, -0.3], [0.5, 0, -0.3], [-0.5, 0, 0.3], [0.5, 0, 0.3]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, -0.08, z]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.16, 8]} />
            <meshStandardMaterial
              color={woodDark}
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
        ))}

        {/* Brass leg caps */}
        {[[-0.5, -0.16, -0.3], [0.5, -0.16, -0.3], [-0.5, -0.16, 0.3], [0.5, -0.16, 0.3]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <cylinderGeometry args={[0.07, 0.07, 0.02, 8]} />
            <meshStandardMaterial
              color={brass}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        ))}

        {/* Label - vintage style */}
        <Text
          position={[0, 1.35, -0.46]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.1}
          color={brassLight}
          anchorX="center"
          anchorY="middle"
        >
          WURLITZER
        </Text>

        {/* Status text */}
        <Text
          position={[0, -0.22, -0.45]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.06}
          color={isMusicPlaying ? brassLight : "#5a4a3a"}
          anchorX="center"
          anchorY="middle"
        >
          {isMusicPlaying ? "NOW PLAYING" : "CLICK TO PLAY"}
        </Text>

        {/* Warm glow effect when playing */}
        {isMusicPlaying && (
          <>
            <pointLight
              position={[0, 1, -0.6]}
              color={warmGlow}
              intensity={0.6}
              distance={3}
            />
            <pointLight
              position={[0, 0.4, -0.6]}
              color={warmGlow}
              intensity={0.3}
              distance={2}
            />
          </>
        )}
      </group>

      {/* Floor shadow/glow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial
          color={isMusicPlaying ? warmGlow : woodDark}
          transparent
          opacity={isMusicPlaying ? 0.25 : 0.1}
        />
      </mesh>
    </group>
  );
};
