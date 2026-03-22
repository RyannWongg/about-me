import React, { useState, useCallback, useEffect } from 'react';
import { PokemonGameProvider, usePokemonGame } from './context/PokemonGameContext';
import { PokemonCanvas } from './PokemonCanvas';
import { DialogBox } from './ui/DialogBox';
import { PixelMinimap } from './ui/PixelMinimap';
import { GameHUD } from './ui/GameHUD';
import { AchievementPopup } from './ui/AchievementPopup';
import { GameMenu } from './ui/GameMenu';
import { GameBoyShell } from './ui/GameBoyShell';
import { SkillBattle } from './minigames/SkillBattle';
import { Project, Skill, TimelineEvent } from '../types';

interface PokemonProps {
  projects: Project[];
  skills: Skill[];
  timelineEvents: TimelineEvent[];
  onExit: () => void;
}

// Inner component that has access to context
const PokemonInner: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { state, clearBattleRequest } = usePokemonGame();
  const [showBattle, setShowBattle] = useState(false);

  // Watch for battle request from NPC interaction
  useEffect(() => {
    if (state.battleRequested && state.gameState === 'exploring') {
      setShowBattle(true);
      clearBattleRequest();
    }
  }, [state.battleRequested, state.gameState, clearBattleRequest]);

  const handleStartBattle = useCallback(() => {
    setShowBattle(true);
  }, []);

  const handleCloseBattle = useCallback(() => {
    setShowBattle(false);
  }, []);

  const handleBattleVictory = useCallback(() => {
    // Victory handled in SkillBattle component
  }, []);

  return (
    <GameBoyShell onExit={onExit}>
      {/* Game Screen Content */}
      <div className="relative">
        {/* Canvas */}
        <PokemonCanvas />

        {/* HUD Overlay */}
        <GameHUD />

        {/* Minimap */}
        <PixelMinimap />

        {/* Dialog Box */}
        <DialogBox />

        {/* Achievement Popup */}
        <AchievementPopup />

        {/* Game Menu */}
        <GameMenu onStartBattle={handleStartBattle} onExit={onExit} />

        {/* Skill Battle Mini-game */}
        {showBattle && (
          <SkillBattle
            onClose={handleCloseBattle}
            onVictory={handleBattleVictory}
          />
        )}
      </div>
    </GameBoyShell>
  );
};

export const Pokemon: React.FC<PokemonProps> = ({
  projects,
  skills,
  timelineEvents,
  onExit,
}) => {
  return (
    <PokemonGameProvider
      projects={projects}
      skills={skills}
      timelineEvents={timelineEvents}
    >
      <PokemonInner onExit={onExit} />
    </PokemonGameProvider>
  );
};

export default Pokemon;
