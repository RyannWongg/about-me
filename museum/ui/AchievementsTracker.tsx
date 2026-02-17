import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Star, ChevronUp, ChevronDown } from 'lucide-react';

export const AchievementsTracker: React.FC = () => {
  const { collectibles, collectedCount, achievements } = useGame();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [lastCollected, setLastCollected] = useState(0);

  const totalCollectibles = collectibles.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  // Show notification when collecting
  useEffect(() => {
    if (collectedCount > lastCollected && lastCollected > 0) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
    setLastCollected(collectedCount);
  }, [collectedCount]);

  return (
    <>
      {/* Collection notification */}
      <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          showNotification ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 rounded-xl px-6 py-3 flex items-center gap-3 shadow-[0_0_20px_rgba(255,217,61,0.3)]">
          <Star className="text-yellow-400" size={24} fill="#ffd93d" />
          <div>
            <p className="text-yellow-400 font-bold">Collectible Found!</p>
            <p className="text-yellow-200/70 text-sm">{collectedCount} / {totalCollectibles} collected</p>
          </div>
        </div>
      </div>

      {/* Main tracker */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-lg">
          {/* Header - always visible */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Trophy className="text-yellow-400" size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 font-mono uppercase">Progress</p>
                <p className="text-white font-bold">
                  {collectedCount}/{totalCollectibles}
                  <span className="text-slate-500 font-normal ml-2">
                    {unlockedAchievements}/{totalAchievements}
                  </span>
                </p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="text-slate-400" size={18} />
            ) : (
              <ChevronDown className="text-slate-400" size={18} />
            )}
          </button>

          {/* Expanded content */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Collectibles progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-mono uppercase">Collectibles</span>
                  <span className="text-xs text-yellow-400">{collectedCount}/{totalCollectibles}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                    style={{ width: `${(collectedCount / totalCollectibles) * 100}%` }}
                  />
                </div>
                <div className="flex gap-1 mt-2">
                  {collectibles.map((c) => (
                    <div
                      key={c.id}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                        c.collected
                          ? 'bg-yellow-500/30 text-yellow-400'
                          : 'bg-slate-800 text-slate-600'
                      }`}
                      title={c.name}
                    >
                      {c.collected ? '★' : '☆'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-mono uppercase">Achievements</span>
                  <span className="text-xs text-[#39ff14]">{unlockedAchievements}/{totalAchievements}</span>
                </div>
                <div className="space-y-2">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        achievement.unlocked
                          ? 'bg-[#39ff14]/10 border border-[#39ff14]/30'
                          : 'bg-slate-800/50'
                      }`}
                    >
                      <span className="text-xl">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          achievement.unlocked ? 'text-[#39ff14]' : 'text-slate-500'
                        }`}>
                          {achievement.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <div className="w-5 h-5 rounded-full bg-[#39ff14]/20 flex items-center justify-center">
                          <span className="text-[#39ff14] text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
