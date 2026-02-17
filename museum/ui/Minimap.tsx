import React from 'react';
import { useGame } from '../context/GameContext';

interface Waypoint {
  id: string;
  name: string;
  position: [number, number];
  color: string;
  icon: string;
}

const waypoints: Waypoint[] = [
  { id: 'entrance', name: 'Entrance', position: [0, 2], color: '#39ff14', icon: '🚪' },
  { id: 'projects', name: 'Projects', position: [15, -10], color: '#00ffff', icon: '💼' },
  { id: 'skills', name: 'Skills', position: [0, 20], color: '#ff6b6b', icon: '⚡' },
  { id: 'timeline', name: 'Timeline', position: [-18, 0], color: '#ffd93d', icon: '📅' },
  { id: 'about', name: 'About Me', position: [0, -20], color: '#c084fc', icon: '👤' },
];

export const Minimap: React.FC = () => {
  const { playerPosition } = useGame();

  // Scale factor for minimap (museum is 50x60, minimap is ~120x144)
  const scale = 2.4;
  const mapWidth = 120;
  const mapHeight = 144;

  // Convert world position to minimap position
  const worldToMap = (x: number, z: number) => ({
    x: (x + 25) * scale,
    y: (z + 30) * scale,
  });

  const playerMapPos = worldToMap(playerPosition.x, playerPosition.z);

  return (
    <div className="fixed top-4 left-4 z-[9999]">
      {/* Minimap container */}
      <div
        className="relative bg-slate-900/90 backdrop-blur-sm border-2 border-[#39ff14]/50 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(57,255,20,0.2)]"
        style={{ width: mapWidth + 16, height: mapHeight + 40 }}
      >
        {/* Header */}
        <div className="bg-slate-800/80 px-3 py-1.5 border-b border-[#39ff14]/30">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse" />
            <span className="text-[10px] font-mono text-[#39ff14] uppercase tracking-wider">
              Map
            </span>
          </div>
        </div>

        {/* Map area */}
        <div className="relative p-2" style={{ width: mapWidth + 16, height: mapHeight + 8 }}>
          {/* Room outline */}
          <svg
            width={mapWidth}
            height={mapHeight}
            className="absolute top-2 left-2"
          >
            {/* Floor */}
            <rect
              x="0"
              y="0"
              width={mapWidth}
              height={mapHeight}
              fill="#0a0f1a"
              stroke="#39ff14"
              strokeWidth="1"
              opacity="0.5"
            />

            {/* Grid lines */}
            {[...Array(6)].map((_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={i * 24}
                x2={mapWidth}
                y2={i * 24}
                stroke="#39ff14"
                strokeWidth="0.5"
                opacity="0.15"
              />
            ))}
            {[...Array(5)].map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 24}
                y1="0"
                x2={i * 24}
                y2={mapHeight}
                stroke="#39ff14"
                strokeWidth="0.5"
                opacity="0.15"
              />
            ))}

            {/* Area labels */}
            <text x={mapWidth / 2} y="13" fill="#39ff14" fontSize="8" textAnchor="middle" opacity="0.5">
              ABOUT
            </text>
            <text x={mapWidth / 2} y={mapHeight - 10} fill="#39ff14" fontSize="8" textAnchor="middle" opacity="0.5">
              SKILLS
            </text>
            <text x="15" y={mapHeight / 2 -13} fill="#39ff14" fontSize="8" textAnchor="middle" opacity="0.5">
              TIME
            </text>
            <text x={mapWidth - 25} y={mapHeight / 2-5} fill="#39ff14" fontSize="8" textAnchor="middle" opacity="0.5">
              PROJECTS
            </text>
          </svg>

          {/* Waypoints */}
          {waypoints.map((wp) => {
            const pos = worldToMap(wp.position[0], wp.position[1]);

            // Custom tooltip positions for different waypoints
            let tooltipClass = "absolute hidden group-hover:block bg-slate-800 px-2 py-1 rounded text-[9px] text-white whitespace-nowrap z-10";
            if (wp.id === 'about') {
              // Bottom of point
              tooltipClass += " top-4 left-1/2 -translate-x-1/2";
            } else if (wp.id === 'projects') {
              // Left of point
              tooltipClass += " right-4 top-1/2 -translate-y-1/2";
            } else {
              // Default: right of point
              tooltipClass += " left-4 top-1/2 -translate-y-1/2";
            }

            return (
              <div
                key={wp.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: pos.x + 8, top: pos.y + 8 }}
              >
                <div
                  className="w-3 h-3 rounded-full border-2 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ borderColor: wp.color, backgroundColor: `${wp.color}33` }}
                />
                {/* Tooltip */}
                <div className={tooltipClass}>
                  {wp.icon} {wp.name}
                </div>
              </div>
            );
          })}

          {/* Player indicator */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150"
            style={{ left: playerMapPos.x + 8, top: playerMapPos.y + 8 }}
          >
            {/* Pulse ring */}
            <div className="absolute inset-0 w-5 h-5 -m-1 rounded-full bg-[#39ff14]/30 animate-ping" />
            {/* Player dot */}
            <div className="relative w-3 h-3 bg-[#39ff14] rounded-full shadow-[0_0_10px_#39ff14] border-2 border-white" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2">
        <div className="flex items-center gap-3 text-[9px] text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#39ff14] rounded-full" />
            <span>You</span>
          </div>
        </div>
      </div>
    </div>
  );
};
