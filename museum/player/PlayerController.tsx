import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { Vector3, Group, Color, Mesh } from 'three';
import { Sparkles } from '@react-three/drei';
import { useGame } from '../context/GameContext';

// Wave ring component for expanding ripple effect
const WaveRing: React.FC<{ offset: number }> = ({ offset }) => {
  const ringRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    const time = state.clock.elapsedTime;

    // Create a looping wave effect with offset for staggering
    const cycleTime = 2; // seconds per cycle
    const progress = ((time + offset) % cycleTime) / cycleTime;

    // Scale from 0.3 to 1.5 as it expands
    const scale = 0.3 + progress * 1.2;
    ringRef.current.scale.set(scale, scale, 1);

    // Fade out as it expands
    const opacity = Math.max(0, 0.6 * (1 - progress));
    (ringRef.current.material as any).opacity = opacity;
  });

  return (
    <mesh ref={ringRef} position={[0, -0.79, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.8, 0.9, 32]} />
      <meshBasicMaterial color="#39ff14" transparent opacity={0.6} />
    </mesh>
  );
};

interface PlayerControllerProps {
  speed?: number;
  touchInput?: { x: number; y: number };
}

export const PlayerController: React.FC<PlayerControllerProps> = ({
  speed = 5,
  touchInput = { x: 0, y: 0 },
}) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const characterRef = useRef<Group>(null);
  const { camera } = useThree();
  const { setPlayerPosition } = useGame();

  // Refs for animated parts
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const leftLegRef = useRef<Group>(null);
  const rightLegRef = useRef<Group>(null);
  const antennaRef = useRef<Group>(null);
  const leftEyeRef = useRef<Group>(null);
  const rightEyeRef = useRef<Group>(null);
  const backpackRef = useRef<Group>(null);

  // Animation state
  const blinkTimer = useRef(0);
  const isBlinking = useRef(false);
  const nextBlinkTime = useRef(Math.random() * 3 + 2);

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const cameraOffset = new Vector3(0, 8, 12);
  const playerPosition = useRef(new Vector3(0, 1, 0));
  const isMoving = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    let velocityX = 0;
    let velocityZ = 0;

    // Keyboard input
    if (keys.current.forward) velocityZ -= speed;
    if (keys.current.backward) velocityZ += speed;
    if (keys.current.left) velocityX -= speed;
    if (keys.current.right) velocityX += speed;

    // Touch input (adds to keyboard input)
    velocityX += touchInput.x * speed;
    velocityZ += touchInput.y * speed;

    // Check if moving
    isMoving.current = velocityX !== 0 || velocityZ !== 0;

    // Apply velocity to rigidbody
    rigidBodyRef.current.setLinvel({ x: velocityX, y: 0, z: velocityZ }, true);

    // Get player position
    const position = rigidBodyRef.current.translation();
    playerPosition.current.set(position.x, position.y, position.z);

    // Update game context with player position (throttled)
    if (Math.floor(state.clock.elapsedTime * 10) % 2 === 0) {
      setPlayerPosition({ x: position.x, y: position.y, z: position.z });
    }

    // Smoothly follow player with camera (third-person)
    const targetCameraPos = playerPosition.current.clone().add(cameraOffset);
    camera.position.lerp(targetCameraPos, 5 * delta);
    camera.lookAt(playerPosition.current);

    const time = state.clock.elapsedTime;

    // Character animation
    if (characterRef.current) {

      // Breathing/pulsing animation
      const breathScale = 1 + Math.sin(time * 2) * 0.02;
      characterRef.current.scale.set(breathScale, breathScale, breathScale);

      // Idle floating animation when not moving
      if (!isMoving.current) {
        characterRef.current.position.y = Math.sin(time * 2) * 0.05;
      } else {
        // Bobbing when moving
        characterRef.current.position.y = Math.sin(time * 12) * 0.08;
      }

      // Rotate character to face movement direction
      if (velocityX !== 0 || velocityZ !== 0) {
        const targetRotation = Math.atan2(velocityX, velocityZ);
        // Normalize angle difference to take shortest path
        let angleDiff = targetRotation - characterRef.current.rotation.y;
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        characterRef.current.rotation.y += angleDiff * 5 * delta;
      }
    }

    // Arm and leg swing animation
    const limbSwing = isMoving.current ? Math.sin(time * 12) * 0.6 : Math.sin(time * 2) * 0.1;

    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = limbSwing;
      rightArmRef.current.rotation.x = -limbSwing;
      // Subtle side sway
      leftArmRef.current.rotation.z = Math.sin(time * 3) * 0.05 - 0.1;
      rightArmRef.current.rotation.z = -Math.sin(time * 3) * 0.05 + 0.1;
    }

    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = -limbSwing;
      rightLegRef.current.rotation.x = limbSwing;
    }

    // Antenna sway animation
    if (antennaRef.current) {
      antennaRef.current.rotation.x = Math.sin(time * 3) * 0.15;
      antennaRef.current.rotation.z = Math.sin(time * 2.5) * 0.1;
    }

    // Eye blinking animation
    blinkTimer.current += delta;
    if (blinkTimer.current > nextBlinkTime.current) {
      isBlinking.current = true;
      if (blinkTimer.current > nextBlinkTime.current + 0.15) {
        isBlinking.current = false;
        blinkTimer.current = 0;
        nextBlinkTime.current = Math.random() * 3 + 2;
      }
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeScale = isBlinking.current ? 0.1 : 1;
      leftEyeRef.current.scale.y = eyeScale;
      rightEyeRef.current.scale.y = eyeScale;
    }

    // Backpack glow pulse
    if (backpackRef.current) {
      const glowIntensity = 0.5 + Math.sin(time * 4) * 0.3;
      backpackRef.current.children.forEach((child: any) => {
        if (child.material?.emissiveIntensity !== undefined) {
          child.material.emissiveIntensity = glowIntensity;
        }
      });
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders="ball"
      position={[0, 1, 0]}
      enabledRotations={[false, false, false]}
      linearDamping={5}
    >
      {/* Character group for animations */}
      <group ref={characterRef}>
        {/* Particle effects - sparkles around player */}
        <Sparkles
          count={30}
          scale={2}
          size={2}
          speed={0.4}
          color="#39ff14"
          opacity={0.6}
        />

        {/* Energy aura particles */}
        <Sparkles
          count={15}
          scale={1.2}
          size={3}
          speed={0.8}
          color="#00ffff"
          opacity={0.4}
        />

        {/* Main body - fat round sphere */}
        <mesh castShadow position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.6, 24, 24]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.4}
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>

        {/* Body inner core (darker) */}
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.5, 24, 24]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#39ff14"
            emissiveIntensity={0.1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Belly button / center detail */}
        <mesh position={[0, 0.55, 0.55]}>
          <circleGeometry args={[0.12, 16]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0.55, 0.56]}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Body accent ring around belly */}
        <mesh position={[0, 0.55, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.55, 0.04, 8, 32]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>

        {/* Top body accent ring */}
        <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.03, 8, 24]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.4} />
        </mesh>

        {/* Bottom body accent ring */}
        <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.03, 8, 24]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.4} />
        </mesh>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.65, 0.7, 0]}>
          {/* Shoulder joint */}
          <mesh castShadow>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.3} />
          </mesh>
          {/* Upper arm */}
          <mesh castShadow position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
            <meshStandardMaterial color="#0f172a" emissive="#39ff14" emissiveIntensity={0.1} />
          </mesh>
          {/* Elbow */}
          <mesh position={[0, -0.4, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.4} />
          </mesh>
          {/* Lower arm */}
          <mesh castShadow position={[0, -0.55, 0]}>
            <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
            <meshStandardMaterial color="#0f172a" emissive="#39ff14" emissiveIntensity={0.1} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.72, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.65, 0.7, 0]}>
          {/* Shoulder joint */}
          <mesh castShadow>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.3} />
          </mesh>
          {/* Upper arm */}
          <mesh castShadow position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
            <meshStandardMaterial color="#0f172a" emissive="#39ff14" emissiveIntensity={0.1} />
          </mesh>
          {/* Elbow */}
          <mesh position={[0, -0.4, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.4} />
          </mesh>
          {/* Lower arm */}
          <mesh castShadow position={[0, -0.55, 0]}>
            <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
            <meshStandardMaterial color="#0f172a" emissive="#39ff14" emissiveIntensity={0.1} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.72, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.25, 0, 0]}>
          {/* Hip joint */}
          <mesh castShadow>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.3} />
          </mesh>
          {/* Upper leg */}
          <mesh castShadow position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.07, 0.25, 4, 8]} />
            <meshStandardMaterial color="#0f172a" emissive="#39ff14" emissiveIntensity={0.1} />
          </mesh>
          {/* Knee */}
          <mesh position={[0, -0.4, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.4} />
          </mesh>
          {/* Lower leg */}
          <mesh castShadow position={[0, -0.55, 0]}>
            <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
            <meshStandardMaterial color="#0f172a" emissive="#39ff14" emissiveIntensity={0.1} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -0.75, 0.05]}>
            <boxGeometry args={[0.12, 0.08, 0.18]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.25, 0, 0]}>
          {/* Hip joint */}
          <mesh castShadow>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.3} />
          </mesh>
          {/* Upper leg */}
          <mesh castShadow position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.07, 0.25, 4, 8]} />
            <meshStandardMaterial color="#0f172a" emissive="#39ff14" emissiveIntensity={0.1} />
          </mesh>
          {/* Knee */}
          <mesh position={[0, -0.4, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.4} />
          </mesh>
          {/* Lower leg */}
          <mesh castShadow position={[0, -0.55, 0]}>
            <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
            <meshStandardMaterial color="#0f172a" emissive="#39ff14" emissiveIntensity={0.1} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -0.75, 0.05]}>
            <boxGeometry args={[0.12, 0.08, 0.18]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Head */}
        <mesh castShadow position={[0, 1.35, 0]}>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.5}
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>

        {/* Head inner */}
        <mesh position={[0, 1.35, 0]}>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#39ff14"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Eyes - facing forward (+Z direction) with blink support */}
        <group ref={leftEyeRef} position={[-0.12, 1.4, 0.26]}>
          <mesh>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.045]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          {/* Eye highlight */}
          <mesh position={[-0.018, 0.018, 0.05]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        <group ref={rightEyeRef} position={[0.12, 1.4, 0.26]}>
          <mesh>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.045]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          {/* Eye highlight */}
          <mesh position={[0.018, 0.018, 0.05]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Antenna group with sway animation */}
        <group ref={antennaRef} position={[0, 1.67, 0]}>
          {/* Antenna base */}
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
            <meshStandardMaterial color="#0f172a" emissive="#39ff14" emissiveIntensity={0.2} />
          </mesh>
          {/* Antenna stem */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.025, 0.3, 8]} />
            <meshStandardMaterial
              color="#39ff14"
              emissive="#39ff14"
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Antenna orb */}
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.8}
            />
          </mesh>
          {/* Antenna glow ring */}
          <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.1, 0.015, 8, 16]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
          </mesh>
        </group>

        {/* Backpack / Energy Core */}
        <group ref={backpackRef} position={[0, 0.55, -0.55]}>
          {/* Main pack */}
          <mesh castShadow>
            <boxGeometry args={[0.35, 0.5, 0.18]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive="#39ff14"
              emissiveIntensity={0.2}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          {/* Energy core center */}
          <mesh position={[0, 0, -0.05]}>
            <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.6}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Core inner glow */}
          <mesh position={[0, 0, -0.05]}>
            <cylinderGeometry args={[0.06, 0.06, 0.32, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
          </mesh>
          {/* Top vent */}
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.25, 0.04, 0.12]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.4} />
          </mesh>
          {/* Bottom vent */}
          <mesh position={[0, -0.28, 0]}>
            <boxGeometry args={[0.25, 0.04, 0.12]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.4} />
          </mesh>
          {/* Side details */}
          <mesh position={[-0.15, 0, -0.06]}>
            <boxGeometry args={[0.04, 0.35, 0.06]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0.15, 0, -0.06]}>
            <boxGeometry args={[0.04, 0.35, 0.06]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.3} />
          </mesh>
        </group>

        {/* Center glow disc at feet */}
        <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.35, 32]} />
          <meshBasicMaterial
            color="#39ff14"
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Expanding wave rings - staggered for continuous ripple effect */}
        <WaveRing offset={0} />
        <WaveRing offset={0.66} />
        <WaveRing offset={1.33} />

        {/* Floating energy orbs around feet */}
        <Sparkles
          count={8}
          scale={[1.5, 0.3, 1.5]}
          size={4}
          speed={1}
          color="#00ffff"
          opacity={0.8}
          position={[0, -0.7, 0]}
        />
      </group>
    </RigidBody>
  );
};
