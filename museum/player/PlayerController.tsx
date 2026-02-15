import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { Vector3, Group } from 'three';

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

    // Smoothly follow player with camera (third-person)
    const targetCameraPos = playerPosition.current.clone().add(cameraOffset);
    camera.position.lerp(targetCameraPos, 5 * delta);
    camera.lookAt(playerPosition.current);

    // Character animation
    if (characterRef.current) {
      const time = state.clock.elapsedTime;

      // Idle floating animation when not moving
      if (!isMoving.current) {
        characterRef.current.position.y = Math.sin(time * 2) * 0.05;
      } else {
        // Bobbing when moving
        characterRef.current.position.y = Math.sin(time * 8) * 0.08;
      }

      // Rotate character to face movement direction
      if (velocityX !== 0 || velocityZ !== 0) {
        const targetRotation = Math.atan2(-velocityX, -velocityZ);
        // Normalize angle difference to take shortest path
        let angleDiff = targetRotation - characterRef.current.rotation.y;
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        characterRef.current.rotation.y += angleDiff * 5 * delta;
      }
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
        {/* Main body - glowing capsule */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <capsuleGeometry args={[0.35, 0.9, 8, 16]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.4}
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>

        {/* Body inner core (darker) */}
        <mesh position={[0, 0.5, 0]}>
          <capsuleGeometry args={[0.25, 0.7, 8, 16]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#39ff14"
            emissiveIntensity={0.1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Head */}
        <mesh castShadow position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.5}
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>

        {/* Head inner */}
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#39ff14"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Eyes - facing forward (-Z direction) */}
        <mesh position={[0.1, 1.45, -0.22]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.1, 1.45, -0.22]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Eye pupils */}
        <mesh position={[0.1, 1.45, -0.26]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[-0.1, 1.45, -0.26]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 1.75, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0, 1.9, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#39ff14"
            emissive="#39ff14"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Glow ring at feet */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.6, 32]} />
          <meshBasicMaterial
            color="#39ff14"
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Outer glow ring */}
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.8, 32]} />
          <meshBasicMaterial
            color="#39ff14"
            transparent
            opacity={0.15}
          />
        </mesh>
      </group>
    </RigidBody>
  );
};
