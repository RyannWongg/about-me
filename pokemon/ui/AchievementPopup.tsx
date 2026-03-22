import React, { useState, useEffect, useCallback } from 'react';
import { usePokemonGame } from '../context/PokemonGameContext';
import { PokemonAchievement } from '../../types';
import { SoundManager } from '../audio/SoundManager';

interface AchievementNotification {
  achievement: PokemonAchievement;
  id: number;
}

export const AchievementPopup: React.FC = () => {
  const { state } = usePokemonGame();
  const [notifications, setNotifications] = useState<AchievementNotification[]>([]);
  const [lastUnlocked, setLastUnlocked] = useState<Set<string>>(new Set());

  // Track newly unlocked achievements
  useEffect(() => {
    const currentUnlocked = new Set(
      state.achievements.filter(a => a.unlocked).map(a => a.id)
    );

    // Find newly unlocked achievements
    currentUnlocked.forEach(id => {
      if (!lastUnlocked.has(id)) {
        const achievement = state.achievements.find(a => a.id === id);
        if (achievement) {
          const notification: AchievementNotification = {
            achievement,
            id: Date.now() + Math.random(),
          };
          setNotifications(prev => [...prev, notification]);
          SoundManager.playAchievement();

          // Auto-remove after 4 seconds
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
          }, 4000);
        }
      }
    });

    setLastUnlocked(currentUnlocked);
  }, [state.achievements]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex flex-col gap-2 pointer-events-none">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="animate-slide-down bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 border-4 border-yellow-600 rounded-lg px-6 py-3 shadow-lg"
          style={{
            animation: 'slideDown 0.5s ease-out, pulse 1s ease-in-out 0.5s infinite',
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.5), 4px 4px 0 #92400e',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-bounce">
              {notification.achievement.icon}
            </div>
            <div>
              <div className="font-mono text-[10px] text-yellow-900 font-bold tracking-wider">
                ACHIEVEMENT UNLOCKED!
              </div>
              <div className="font-mono text-sm text-slate-900 font-bold">
                {notification.achievement.name}
              </div>
              <div className="font-mono text-[10px] text-slate-700">
                {notification.achievement.description}
              </div>
            </div>
            <div className="text-2xl">🏆</div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AchievementPopup;
