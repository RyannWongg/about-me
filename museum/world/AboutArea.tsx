import React, { useState } from 'react';
import { Text, useGLTF } from '@react-three/drei';

interface ContactButtonProps {
  position: [number, number, number];
  label: string;
  href: string;
  color: string;
}

const ContactButton: React.FC<ContactButtonProps> = ({
  position,
  label,
  href,
  color,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      onPointerEnter={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={() => window.open(href, '_blank')}
    >
      <mesh>
        <boxGeometry args={[3, 0.8, 0.2]} />
        <meshStandardMaterial
          color={hovered ? color : '#1e293b'}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.1}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.25}
        color={hovered ? '#0f172a' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

export const AboutArea: React.FC = () => {
  // Load the GLB statue model
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}statue.glb`);

  return (
    <group position={[0, 0, -12]}>
      {/* Section title */}
      <Text
        position={[0, 5.5, -2]}
        fontSize={1}
        color="#39ff14"
        anchorX="center"
        anchorY="middle"
      >
        ABOUT ME
      </Text>

      {/* Decorative line */}
      <mesh position={[0, 4.9, -2]}>
        <boxGeometry args={[8, 0.05, 0.02]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* === LEFT STATUE PEDESTAL === */}
      <group position={[-2, 0, -2]}>
        {/* Pedestal base */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[1.3, 1.5, 0.3, 32]} />
          <meshStandardMaterial
            color="#e8e8e8"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Pedestal middle section */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[1.1, 1.3, 0.6, 32]} />
          <meshStandardMaterial
            color="#e8e8e8"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Pedestal top platform */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.1, 0.4, 32]} />
          <meshStandardMaterial
            color="#e8e8e8"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Decorative ring on pedestal */}
        <mesh position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.05, 8, 32]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* STYLIZED BUST STATUE */}
        <group position={[0, 1.3, 0]}>
          {/* Torso/Chest base - wider at shoulders */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.9, 1.2, 1.2, 32]} />
            <meshStandardMaterial
              color="#1e3a5f"
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>

          {/* Shoulder left */}
          <mesh position={[-0.9, 0.9, 0]} castShadow>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial
              color="#1e3a5f"
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>

          {/* Shoulder right */}
          <mesh position={[0.9, 0.9, 0]} castShadow>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial
              color="#1e3a5f"
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>

          {/* Collar/Shirt collar detail */}
          <mesh position={[0, 1.1, 0.1]} castShadow>
            <boxGeometry args={[0.8, 0.25, 0.3]} />
            <meshStandardMaterial
              color="#f0f0f0"
              metalness={0.2}
              roughness={0.6}
            />
          </mesh>

          {/* Neck */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.35, 0.5, 16]} />
            <meshStandardMaterial
              color="#d4a574"
              metalness={0.2}
              roughness={0.7}
            />
          </mesh>

          {/* Head - main shape */}
          <mesh position={[0, 2, 0]} castShadow>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshStandardMaterial
              color="#d4a574"
              metalness={0.2}
              roughness={0.7}
            />
          </mesh>

          {/* Hair - top */}
          <mesh position={[0, 2.35, -0.05]} castShadow>
            <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.3}
              roughness={0.8}
            />
          </mesh>

          {/* Hair - front bangs */}
          <mesh position={[0, 2.25, 0.4]} castShadow>
            <boxGeometry args={[0.9, 0.3, 0.2]} />
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.3}
              roughness={0.8}
            />
          </mesh>

          {/* Glasses - left lens */}
          <mesh position={[-0.22, 2, 0.55]} castShadow>
            <torusGeometry args={[0.15, 0.02, 8, 16]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Glasses - right lens */}
          <mesh position={[0.22, 2, 0.55]} castShadow>
            <torusGeometry args={[0.15, 0.02, 8, 16]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Glasses - bridge */}
          <mesh position={[0, 2, 0.55]} castShadow>
            <boxGeometry args={[0.12, 0.02, 0.02]} />
            <meshStandardMaterial
              color="#4a4a4a"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Subtle glow effect around statue */}
          <pointLight
            position={[0, 1.5, 1]}
            intensity={0.5}
            color="#39ff14"
            distance={4}
          />
        </group>

        {/* Spotlight from above */}
        <spotLight
          position={[0, 6, 2]}
          angle={0.4}
          penumbra={0.5}
          intensity={3}
          color="#ffffff"
        />
      </group>

      {/* === RIGHT STATUE PEDESTAL (GLB) === */}
      <group position={[2, 0, -2]}>
        {/* Pedestal base */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[1.3, 1.5, 0.3, 32]} />
          <meshStandardMaterial
            color="#e8e8e8"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Pedestal middle section */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[1.1, 1.3, 0.6, 32]} />
          <meshStandardMaterial
            color="#e8e8e8"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Pedestal top platform */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.1, 0.4, 32]} />
          <meshStandardMaterial
            color="#e8e8e8"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Decorative ring on pedestal */}
        <mesh position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.05, 8, 32]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* GLB STATUE */}
        <group position={[0, 2.5, 0]}>
          <primitive
            object={scene.clone()}
            scale={[1.5, 1.5, 1.5]}
            rotation={[0, 0, 0]}
          />
          {/* Subtle glow effect around GLB statue */}
          <pointLight
            position={[0, 1.5, 1]}
            intensity={0.5}
            color="#39ff14"
            distance={4}
          />
        </group>

        {/* Spotlight from above */}
        <spotLight
          position={[0, 6, 2]}
          angle={0.4}
          penumbra={0.5}
          intensity={3}
          color="#ffffff"
        />
      </group>

      {/* === COMBINED FLOOR PLAQUE (CENTER) === */}
      <group position={[0, 0.3, 0]} rotation={[Math.PI / 6, 0, 0]}>
        {/* Plaque base */}
        <mesh castShadow>
          <boxGeometry args={[4, 0.1, 1.5]} />
          <meshStandardMaterial
            color="#78716c"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Title text */}
        <Text
          position={[0, 0.06, -0.35]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.25}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          FOUNDER & DEVELOPER
        </Text>
        {/* Location text */}
        <Text
          position={[0, 0.06, 0.25]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.2}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          Toronto, Canada
        </Text>
      </group>

      {/* Name panel - floating 3D style - RIGHT SIDE */}
      <group position={[6.2, 3.1, 0]} rotation={[0, -Math.PI / 6, 0]}>
        <mesh>
          <boxGeometry args={[5.9, 1.2, 0.2]} />
          <meshStandardMaterial
            color="#06003a"
            emissive="#070150"
            emissiveIntensity={0.1}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
        <Text
          position={[0, 0, 0.15]}
          fontSize={0.45}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Ip Fong Wong (Ryan)
        </Text>
      </group>

      {/* Title panel - floating 3D style - RIGHT SIDE */}
      <group position={[6.2, 2.1, 0]} rotation={[0, -Math.PI / 6, 0]}>
        <mesh>
          <boxGeometry args={[5.9, 0.8, 0.2]} />
          <meshStandardMaterial
            color="#06003a"
            emissive="#070150"
            emissiveIntensity={0.1}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
        <Text
          position={[0, 0, 0.15]}
          fontSize={0.3}
          color="#39ff14"
          anchorX="center"
          anchorY="middle"
        >
          Math, Statistics & CS @ UofT
        </Text>
      </group>

      {/* Description panel - floating 3D style - RIGHT SIDE */}
      <group position={[6.2, 1, 0]} rotation={[0, -Math.PI / 6, 0]}>
        <mesh>
          <boxGeometry args={[5.9, 1.5, 0.2]} />
          <meshStandardMaterial
            color="#06003a"
            emissive="#070150"
            emissiveIntensity={0.1}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
        <Text
          position={[0, 0.25, 0.15]}
          fontSize={0.22}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          maxWidth={7}
        >
          Merging statistical rigor with creative software design.
        </Text>
        <Text
          position={[0, -0.25, 0.15]}
          fontSize={0.22}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          maxWidth={7}
        >
          Building tools that turn complex data into clear insights.
        </Text>
      </group>

      {/* Contact buttons - ALL ON LEFT SIDE */}
      <group position={[-5.5, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
        <ContactButton
          position={[0, 3, 0]}
          label="GitHub"
          href="https://github.com/RyannWongg"
          color="#39ff14"
        />

        <ContactButton
          position={[0, 2.1, 0]}
          label="LinkedIn"
          href="https://www.linkedin.com/in/ip-fong-wong-ryan/"
          color="#0077b5"
        />

        <ContactButton
          position={[0, 1.2, 0]}
          label="Email"
          href="mailto:fong20040311@gmail.com"
          color="#ea580c"
        />

        <ContactButton
          position={[0, 0.3, 0]}
          label="Resume"
          href={`${import.meta.env.BASE_URL}resume.pdf`}
          color="#8b5cf6"
        />
      </group>

      {/* Decorative elements */}
      <pointLight position={[0, 4, 0]} intensity={1} color="#39ff14" distance={10} />

    </group>
  );
};

// Preload the GLB model for better performance
useGLTF.preload(`${import.meta.env.BASE_URL}statue.glb`);
