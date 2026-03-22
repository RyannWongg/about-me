import React from 'react';
import { usePokemonGame } from '../context/PokemonGameContext';

export const GameHUD: React.FC = () => {
  const { state } = usePokemonGame();

  // Calculate progress
  const collectedCount = state.collectibles.filter(c => c.collected).length;
  const totalCollectibles = state.collectibles.length;

  const unlockedAchievements = state.achievements.filter(a => a.unlocked).length;
  const totalAchievements = state.achievements.length;

  const viewedProjectsCount = state.viewedProjects.length;
  const viewedSkillsCount = state.viewedSkills.length;
  const viewedTimelineCount = state.viewedTimeline.length;

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
      {/* Collectibles counter */}
      <div className="bg-slate-900/90 backdrop-blur-sm border-2 border-slate-600 rounded-lg px-3 py-2 shadow-xl">
        <div className="flex items-center gap-3">
          {/* Badges */}
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🏅</span>
            <span className="font-mono text-xs text-white font-bold">
              {collectedCount}/{totalCollectibles}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-slate-600" />

          {/* Achievements */}
          <div className="flex items-center gap-1.5">
            <span className="text-lg">⭐</span>
            <span className="font-mono text-xs text-white font-bold">
              {unlockedAchievements}/{totalAchievements}
            </span>
          </div>
        </div>
      </div>

      {/* Exploration progress */}
      <div className="bg-slate-900/90 backdrop-blur-sm border-2 border-slate-600 rounded-lg px-3 py-2 shadow-xl">
        <div className="font-mono text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider">
          Explored
        </div>
        <div className="flex gap-2">
          {/* Projects */}
          <div className="flex items-center gap-1">
            <span className="text-xs">📁</span>
            <span className="font-mono text-[10px] text-slate-300">
              {viewedProjectsCount}/6
            </span>
          </div>
          {/* Skills */}
          <div className="flex items-center gap-1">
            <span className="text-xs">⚡</span>
            <span className="font-mono text-[10px] text-slate-300">
              {viewedSkillsCount}/18
            </span>
          </div>
          {/* Timeline */}
          <div className="flex items-center gap-1">
            <span className="text-xs">📜</span>
            <span className="font-mono text-[10px] text-slate-300">
              {viewedTimelineCount}/3
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#39ff14] to-emerald-400 transition-all duration-500"
            style={{
              width: `${((viewedProjectsCount + viewedSkillsCount + viewedTimelineCount) / 27) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Current area indicator */}
      <div className="bg-slate-900/90 backdrop-blur-sm border-2 border-[#39ff14]/50 rounded-lg px-3 py-2 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#39ff14] rounded-full animate-pulse" />
          <span className="font-mono text-xs text-[#39ff14] font-bold">
            {getAreaName(state.playerPosition.tileX, state.playerPosition.tileY)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper to determine current area
function getAreaName(tileX: number, tileY: number): string {
  // About House
  if (tileX >= 5 && tileX <= 12 && tileY >= 3 && tileY <= 8) {
    return 'ABOUT HOUSE';
  }
  // Timeline Area
  if (tileX >= 28 && tileX <= 35 && tileY >= 3 && tileY <= 10) {
    return 'TIMELINE PATH';
  }
  // Projects Building
  if (tileX >= 5 && tileX <= 15 && tileY >= 20 && tileY <= 26) {
    return 'PROJECTS BUILDING';
  }
  // Skills Lab
  if (tileX >= 25 && tileX <= 35 && tileY >= 20 && tileY <= 26) {
    return 'SKILLS LAB';
  }
  // Main paths
  if (
    (tileX >= 18 && tileX <= 22 && tileY >= 5 && tileY <= 25) ||
    (tileY >= 14 && tileY <= 16 && tileX >= 5 && tileX <= 35)
  ) {
    return 'MAIN PATH';
  }
  // Near water
  if (
    (tileX >= 2 && tileX <= 4 && tileY >= 12 && tileY <= 18) ||
    (tileX >= 36 && tileX <= 38 && tileY >= 12 && tileY <= 18)
  ) {
    return 'LAKESIDE';
  }

  return 'OPEN FIELD';
}

export default GameHUD;
