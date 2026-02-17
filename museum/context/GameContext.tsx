import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PlayerPosition {
  x: number;
  y: number;
  z: number;
}

interface Collectible {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  collected: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface NearbyExhibit {
  id: string;
  name: string;
  description: string;
  type: 'project' | 'skill' | 'about' | 'timeline';
}

interface GameContextType {
  // Player
  playerPosition: PlayerPosition;
  setPlayerPosition: (pos: PlayerPosition) => void;

  // Collectibles
  collectibles: Collectible[];
  collectItem: (id: string) => void;
  collectedCount: number;

  // Achievements
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;

  // Nearby exhibits
  nearbyExhibit: NearbyExhibit | null;
  setNearbyExhibit: (exhibit: NearbyExhibit | null) => void;

  // Sound
  isMusicPlaying: boolean;
  setIsMusicPlaying: (playing: boolean) => void;
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
}

const defaultCollectibles: Collectible[] = [
  { id: 'star1', name: 'Hidden Star', description: 'Found near the entrance', position: [8, 1, 5], collected: false },
  { id: 'star2', name: 'Secret Gem', description: 'Hidden in the skills area', position: [-15, 1, 15], collected: false },
  { id: 'star3', name: 'Golden Cube', description: 'Near the timeline', position: [-20, 1, -10], collected: false },
  { id: 'star4', name: 'Crystal Orb', description: 'Behind the projects', position: [20, 1, -15], collected: false },
  { id: 'star5', name: 'Rare Diamond', description: 'A truly hidden treasure', position: [0, 1, -25], collected: false },
];

const defaultAchievements: Achievement[] = [
  { id: 'explorer', name: 'Explorer', description: 'Visit all areas of the museum', icon: '🗺️', unlocked: false },
  { id: 'collector', name: 'Collector', description: 'Find all hidden collectibles', icon: '⭐', unlocked: false },
  { id: 'music_lover', name: 'Music Lover', description: 'Play the jukebox', icon: '🎵', unlocked: false },
  { id: 'curious', name: 'Curious Mind', description: 'View 3 project details', icon: '🔍', unlocked: false },
  { id: 'speed_runner', name: 'Speed Runner', description: 'Explore the entire museum quickly', icon: '⚡', unlocked: false },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>({ x: 0, y: 1, z: 0 });
  const [collectibles, setCollectibles] = useState<Collectible[]>(defaultCollectibles);
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const [nearbyExhibit, setNearbyExhibit] = useState<NearbyExhibit | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);

  const collectItem = useCallback((id: string) => {
    setCollectibles(prev => prev.map(c =>
      c.id === id ? { ...c, collected: true } : c
    ));
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prev => prev.map(a =>
      a.id === id ? { ...a, unlocked: true } : a
    ));
  }, []);

  const collectedCount = collectibles.filter(c => c.collected).length;

  return (
    <GameContext.Provider value={{
      playerPosition,
      setPlayerPosition,
      collectibles,
      collectItem,
      collectedCount,
      achievements,
      unlockAchievement,
      nearbyExhibit,
      setNearbyExhibit,
      isMusicPlaying,
      setIsMusicPlaying,
      musicVolume,
      setMusicVolume,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
