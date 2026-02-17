import React from 'react';
import { Html } from '@react-three/drei';
import { TimelineEvent } from '../../types';

interface TimelineMarkerProps {
  event: TimelineEvent;
  position: [number, number, number];
  isFirst?: boolean;
}

export const TimelineMarker: React.FC<TimelineMarkerProps> = ({
  event,
  position,
  isFirst = false,
}) => {
  const iconColor = event.type === 'education' ? '#39ff14' : '#3b82f6';

  return (
    <group position={position}>
      {/* Vertical pillar */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[0.15, 4, 0.15]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Glowing top sphere */}
      <mesh position={[0, 4.2, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={iconColor}
          emissive={iconColor}
          emissiveIntensity={isFirst ? 0.8 : 0.4}
        />
      </mesh>

      {/* Horizontal arm */}
      <mesh position={[0.6, 3, 0]} castShadow>
        <boxGeometry args={[1.2, 0.1, 0.1]} />
        <meshStandardMaterial
          color={iconColor}
          emissive={iconColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Info panel backing */}
      <mesh position={[2.5, 3, 0]}>
        <boxGeometry args={[3, 2.2, 0.1]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Panel border */}
      <mesh position={[2.5, 3, 0.06]}>
        <boxGeometry args={[3.1, 2.3, 0.02]} />
        <meshStandardMaterial
          color={iconColor}
          emissive={iconColor}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Content via HTML */}
      <Html
        position={[2.5, 3, 0.2]}
        center
        distanceFactor={6}
        transform
        zIndexRange={[0, 5000]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="w-[280px] p-4 rounded-lg"
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: `2px solid ${iconColor}`,
          }}
        >
          {/* Year badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-sm font-mono font-bold px-3 py-1 rounded"
              style={{
                background: `${iconColor}20`,
                color: iconColor,
                border: `1px solid ${iconColor}40`,
              }}
            >
              {event.year}
            </span>
            {isFirst && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded uppercase">
                Current
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="text-lg font-bold text-white mb-1">
            {event.title}
          </h4>

          {/* Subtitle */}
          <p className="text-sm text-slate-400 mb-3">
            {event.subtitle}
          </p>

          {/* Description */}
          <ul className="space-y-2">
            {event.description.map((item, i) => (
              <li
                key={i}
                className="text-sm text-slate-500 flex items-start gap-2"
              >
                <span style={{ color: iconColor }}>▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Html>

      {/* Floor marker */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 16]} />
        <meshStandardMaterial
          color={iconColor}
          emissive={iconColor}
          emissiveIntensity={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};
