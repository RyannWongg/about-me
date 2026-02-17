import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { Group, Mesh } from 'three';
import { useGame } from '../context/GameContext';

interface CollectibleProps {
  id: string;
  position: [number, number, number];
  type?: 'star' | 'gem' | 'cube' | 'orb' | 'diamond';
}

export const Collectible: React.FC<CollectibleProps> = ({
  id,
  position,
  type = 'star',
}) => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const { collectibles, collectItem, playerPosition } = useGame();

  const collectible = collectibles.find(c => c.id === id);
  const isCollected = collectible?.collected || false;

  useFrame((state) => {
    if (!groupRef.current || isCollected) return;

    const time = state.clock.elapsedTime;

    // Floating animation
    groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.15;

    // Rotation
    groupRef.current.rotation.y += 0.02;

    // Check proximity to player
    const dx = playerPosition.x - position[0];
    const dz = playerPosition.z - position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 1.5 && !isCollecting) {
      setIsCollecting(true);
      setTimeout(() => {
        collectItem(id);
      }, 500);
    }

    // Collecting animation
    if (isCollecting && meshRef.current) {
      groupRef.current.scale.multiplyScalar(0.95);
      groupRef.current.position.y += 0.1;
    }
  });

  if (isCollected) return null;

  const renderShape = () => {
    switch (type) {
      case 'star':
        return (
          <mesh ref={meshRef}>
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial
              color="#ffd93d"
              emissive="#ffd93d"
              emissiveIntensity={0.8}
              metalness={0.5}
              roughness={0.2}
            />
          </mesh>
        );
      case 'gem':
        return (
          <mesh ref={meshRef}>
            <octahedronGeometry args={[0.25, 2]} />
            <meshStandardMaterial
              color="#ff6b6b"
              emissive="#ff6b6b"
              emissiveIntensity={0.6}
              metalness={0.8}
              roughness={0.1}
            />
          </mesh>
        );
      case 'cube':
        return (
          <mesh ref={meshRef}>
            <boxGeometry args={[0.35, 0.35, 0.35]} />
            <meshStandardMaterial
              color="#39ff14"
              emissive="#39ff14"
              emissiveIntensity={0.7}
              metalness={0.3}
              roughness={0.3}
            />
          </mesh>
        );
      case 'orb':
        return (
          <mesh ref={meshRef}>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.9}
            />
          </mesh>
        );
      case 'diamond':
        return (
          <mesh ref={meshRef} rotation={[0, 0, Math.PI / 4]}>
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial
              color="#c084fc"
              emissive="#c084fc"
              emissiveIntensity={0.7}
              metalness={0.9}
              roughness={0.05}
            />
          </mesh>
        );
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'star': return '#ffd93d';
      case 'gem': return '#ff6b6b';
      case 'cube': return '#39ff14';
      case 'orb': return '#00ffff';
      case 'diamond': return '#c084fc';
      default: return '#ffd93d';
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Main shape */}
      {renderShape()}

      {/* Inner glow */}
      <pointLight color={getColor()} intensity={0.5} distance={3} />

      {/* Sparkle particles */}
      <Sparkles
        count={10}
        scale={1}
        size={2}
        speed={0.5}
        color={getColor()}
        opacity={0.8}
      />

      {/* Ground indicator */}
      <mesh position={[0, -position[1] + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.5, 32]} />
        <meshBasicMaterial
          color={getColor()}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

// Component to render all collectibles
export const CollectiblesManager: React.FC = () => {
  const { collectibles } = useGame();

  const getType = (id: string): 'star' | 'gem' | 'cube' | 'orb' | 'diamond' => {
    if (id.includes('star')) return 'star';
    if (id.includes('gem') || id === 'star2') return 'gem';
    if (id.includes('cube') || id === 'star3') return 'cube';
    if (id.includes('orb') || id === 'star4') return 'orb';
    if (id.includes('diamond') || id === 'star5') return 'diamond';
    return 'star';
  };

  return (
    <>
      {collectibles.map((collectible) => (
        <Collectible
          key={collectible.id}
          id={collectible.id}
          position={collectible.position}
          type={getType(collectible.id)}
        />
      ))}
    </>
  );
};
