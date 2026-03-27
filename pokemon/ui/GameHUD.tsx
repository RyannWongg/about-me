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

// Helper to determine current area based on actual map layout
function getAreaName(tileX: number, tileY: number): string {
  // About House (x:5-12, y:3-9)
  if (tileX >= 5 && tileX <= 12 && tileY >= 3 && tileY <= 9) {
    return 'ABOUT HOUSE';
  }
  // Timeline/Statue Area (x:27-36, y:3-9)
  if (tileX >= 27 && tileX <= 36 && tileY >= 3 && tileY <= 9) {
    return 'CAREER STATUES';
  }
  // Projects Building (x:7-15, y:18-22)
  if (tileX >= 7 && tileX <= 15 && tileY >= 18 && tileY <= 22) {
    return 'PROJECTS GALLERY';
  }
  // Skills Lab (x:25-33, y:18-22)
  if (tileX >= 25 && tileX <= 33 && tileY >= 18 && tileY <= 22) {
    return 'SKILLS LAB';
  }
  // Left pond area (x:2-5, y:11-19)
  if (tileX >= 2 && tileX <= 5 && tileY >= 11 && tileY <= 19) {
    return 'WEST POND';
  }
  // Right pond area (x:35-38, y:11-19)
  if (tileX >= 35 && tileX <= 38 && tileY >= 11 && tileY <= 19) {
    return 'EAST POND';
  }
  // Main vertical path (x:19-21)
  if (tileX >= 19 && tileX <= 21 && tileY >= 3 && tileY <= 26) {
    return 'MAIN PATH';
  }
  // East-west path near about (y:10)
  if (tileY >= 9 && tileY <= 11 && tileX >= 5 && tileX <= 26) {
    return 'NORTH PATH';
  }
  // Building entrance paths
  if (tileY >= 23 && tileY <= 25) {
    if (tileX >= 8 && tileX <= 14) return 'PROJECTS ENTRANCE';
    if (tileX >= 26 && tileX <= 32) return 'SKILLS ENTRANCE';
  }
  // Southern area
  if (tileY >= 24 && tileY <= 28) {
    return 'SOUTH FIELD';
  }
  // Northern corners
  if (tileY <= 5) {
    if (tileX <= 4) return 'NW CORNER';
    if (tileX >= 37) return 'NE CORNER';
  }

  return 'OPEN FIELD';
}

export default GameHUD;
