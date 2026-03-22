import React, { useEffect, useCallback } from 'react';
import { usePokemonGame } from '../context/PokemonGameContext';
import { SoundManager } from '../audio/SoundManager';

interface GameMenuProps {
  onStartBattle: () => void;
  onExit: () => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({ onStartBattle, onExit }) => {
  const { state, dispatch } = usePokemonGame();

  const handleClose = useCallback(() => {
    SoundManager.playMenuClose();
    dispatch({ type: 'TOGGLE_MENU' });
  }, [dispatch]);

  // Keyboard handling
  useEffect(() => {
    if (!state.showMenu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.showMenu, handleClose]);

  if (!state.showMenu) {
    return null;
  }

  const unlockedAchievements = state.achievements.filter(a => a.unlocked).length;
  const collectedItems = state.collectibles.filter(c => c.collected).length;

  const menuItems = [
    { label: 'Resume', icon: '▶️', action: handleClose },
    { label: 'Skill Battle', icon: '⚔️', action: onStartBattle },
    {
      label: `Achievements (${unlockedAchievements}/${state.achievements.length})`,
      icon: '🏆',
      action: () => {}
    },
    {
      label: `Collectibles (${collectedItems}/${state.collectibles.length})`,
      icon: '💎',
      action: () => {}
    },
    { label: 'Exit to Dashboard', icon: '🚪', action: onExit },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Menu Panel */}
      <div
        className="relative bg-slate-900 border-4 border-slate-600 rounded-lg p-6 min-w-[320px] shadow-2xl"
        style={{
          boxShadow: '8px 8px 0 rgba(0,0,0,0.3), 0 0 40px rgba(57, 255, 20, 0.2)',
        }}
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="font-mono text-xl font-bold text-[#39ff14] tracking-wider">
            PAUSE MENU
          </h2>
          <div className="text-slate-500 font-mono text-[10px] mt-1">
            Press ESC to close
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-[#39ff14] rounded-lg transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="font-mono text-sm text-slate-200 group-hover:text-[#39ff14] transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="font-mono text-[10px] text-slate-500">PROJECTS VIEWED</div>
              <div className="font-mono text-lg text-[#39ff14]">
                {state.viewedProjects.length}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-slate-500">SKILLS VIEWED</div>
              <div className="font-mono text-lg text-[#39ff14]">
                {state.viewedSkills.length}
              </div>
            </div>
          </div>
        </div>

        {/* Achievement List (if any unlocked) */}
        {unlockedAchievements > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="font-mono text-[10px] text-slate-500 mb-2">UNLOCKED ACHIEVEMENTS</div>
            <div className="flex flex-wrap gap-2">
              {state.achievements.filter(a => a.unlocked).map(achievement => (
                <div
                  key={achievement.id}
                  className="bg-amber-500/20 border border-amber-500/50 rounded px-2 py-1"
                  title={achievement.description}
                >
                  <span className="text-sm">{achievement.icon}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collectibles Display */}
        {collectedItems > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="font-mono text-[10px] text-slate-500 mb-2">COLLECTED ITEMS</div>
            <div className="flex flex-wrap gap-2">
              {state.collectibles.filter(c => c.collected).map(item => (
                <div
                  key={item.id}
                  className="bg-purple-500/20 border border-purple-500/50 rounded px-2 py-1"
                >
                  <span className="font-mono text-[10px] text-purple-300">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameMenu;
