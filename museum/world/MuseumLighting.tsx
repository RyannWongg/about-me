import React from 'react';

export const MuseumLighting: React.FC = () => {
  return (
    <>
      {/* Ambient light for base visibility */}
      <ambientLight intensity={0.4} />

      {/* Main directional light - reduced shadow map for performance */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.7}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-far={50}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Central accent light */}
      <pointLight
        position={[0, 8, 0]}
        intensity={0.5}
        color="#39ff14"
        distance={25}
      />

      {/* Gallery light */}
      <pointLight
        position={[18, 6, 0]}
        intensity={0.4}
        color="#ffffff"
        distance={20}
      />

      {/* Timeline accent */}
      <pointLight
        position={[-18, 5, 0]}
        intensity={0.3}
        color="#3b82f6"
        distance={15}
      />

      {/* Hemisphere light for fill */}
      <hemisphereLight args={['#39ff14', '#0f172a', 0.15]} />
    </>
  );
};
