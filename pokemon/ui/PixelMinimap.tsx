import React from 'react';
import { usePokemonGame } from '../context/PokemonGameContext';

const MAP_WIDTH = 40;
const MAP_HEIGHT = 30;
const MINIMAP_SCALE = 4;

// Area definitions for labels
const AREAS = [
  { name: 'About', x: 5, y: 3, w: 8, h: 6 },
  { name: 'Timeline', x: 28, y: 3, w: 8, h: 8 },
  { name: 'Projects', x: 5, y: 20, w: 11, h: 7 },
  { name: 'Skills', x: 25, y: 20, w: 11, h: 7 },
];

export const PixelMinimap: React.FC = () => {
  const { state } = usePokemonGame();

  if (!state.showMinimap) return null;

  const playerX = (state.playerPosition.tileX / MAP_WIDTH) * 100;
  const playerY = (state.playerPosition.tileY / MAP_HEIGHT) * 100;

  return (
    <div className="absolute top-4 right-4 z-20">
      <div className="bg-slate-900/90 backdrop-blur-sm border-2 border-slate-600 rounded-lg p-2 shadow-xl">
        {/* Minimap title */}
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
            Map
          </span>
          <span className="font-mono text-[10px] text-[#39ff14]">
            {state.playerPosition.tileX}, {state.playerPosition.tileY}
          </span>
        </div>

        {/* Minimap canvas */}
        <div
          className="relative border border-slate-700 rounded overflow-hidden"
          style={{
            width: MAP_WIDTH * MINIMAP_SCALE,
            height: MAP_HEIGHT * MINIMAP_SCALE,
            imageRendering: 'pixelated',
          }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-[#4ade80]" />

          {/* Paths */}
          <div
            className="absolute bg-[#d4a574]"
            style={{
              left: `${(18 / MAP_WIDTH) * 100}%`,
              top: `${(5 / MAP_HEIGHT) * 100}%`,
              width: `${(5 / MAP_WIDTH) * 100}%`,
              height: `${(21 / MAP_HEIGHT) * 100}%`,
            }}
          />
          <div
            className="absolute bg-[#d4a574]"
            style={{
              left: `${(5 / MAP_WIDTH) * 100}%`,
              top: `${(14 / MAP_HEIGHT) * 100}%`,
              width: `${(31 / MAP_WIDTH) * 100}%`,
              height: `${(3 / MAP_HEIGHT) * 100}%`,
            }}
          />

          {/* About House */}
          <div
            className="absolute bg-slate-500 border border-slate-600"
            style={{
              left: `${(5 / MAP_WIDTH) * 100}%`,
              top: `${(3 / MAP_HEIGHT) * 100}%`,
              width: `${(8 / MAP_WIDTH) * 100}%`,
              height: `${(6 / MAP_HEIGHT) * 100}%`,
            }}
          />

          {/* Timeline Area */}
          <div
            className="absolute bg-[#fbbf24]/50 border border-[#fbbf24]"
            style={{
              left: `${(28 / MAP_WIDTH) * 100}%`,
              top: `${(3 / MAP_HEIGHT) * 100}%`,
              width: `${(8 / MAP_WIDTH) * 100}%`,
              height: `${(8 / MAP_HEIGHT) * 100}%`,
            }}
          />

          {/* Projects Building */}
          <div
            className="absolute bg-blue-500/50 border border-blue-400"
            style={{
              left: `${(5 / MAP_WIDTH) * 100}%`,
              top: `${(20 / MAP_HEIGHT) * 100}%`,
              width: `${(11 / MAP_WIDTH) * 100}%`,
              height: `${(7 / MAP_HEIGHT) * 100}%`,
            }}
          />

          {/* Skills Lab */}
          <div
            className="absolute bg-purple-500/50 border border-purple-400"
            style={{
              left: `${(25 / MAP_WIDTH) * 100}%`,
              top: `${(20 / MAP_HEIGHT) * 100}%`,
              width: `${(11 / MAP_WIDTH) * 100}%`,
              height: `${(7 / MAP_HEIGHT) * 100}%`,
            }}
          />

          {/* Water */}
          <div
            className="absolute bg-blue-400"
            style={{
              left: `${(2 / MAP_WIDTH) * 100}%`,
              top: `${(12 / MAP_HEIGHT) * 100}%`,
              width: `${(3 / MAP_WIDTH) * 100}%`,
              height: `${(7 / MAP_HEIGHT) * 100}%`,
            }}
          />
          <div
            className="absolute bg-blue-400"
            style={{
              left: `${(36 / MAP_WIDTH) * 100}%`,
              top: `${(12 / MAP_HEIGHT) * 100}%`,
              width: `${(3 / MAP_WIDTH) * 100}%`,
              height: `${(7 / MAP_HEIGHT) * 100}%`,
            }}
          />

          {/* Player marker */}
          <div
            className="absolute w-2 h-2 bg-red-500 rounded-full border border-white shadow-lg animate-pulse"
            style={{
              left: `${playerX}%`,
              top: `${playerY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Spawn point marker */}
          <div
            className="absolute w-1.5 h-1.5 bg-[#39ff14] rounded-full"
            style={{
              left: `${(20 / MAP_WIDTH) * 100}%`,
              top: `${(15 / MAP_HEIGHT) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* Legend */}
        <div className="mt-2 grid grid-cols-2 gap-1 text-[8px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>You</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-slate-500" />
            <span>About</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500/50" />
            <span>Projects</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500/50" />
            <span>Skills</span>
          </div>
        </div>

        {/* Toggle hint */}
        <div className="mt-2 text-center">
          <span className="font-mono text-[8px] text-slate-500">
            Press M to toggle
          </span>
        </div>
      </div>
    </div>
  );
};

export default PixelMinimap;
