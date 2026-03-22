import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import {
  Direction,
  Position,
  PokemonGameState,
  PokemonCollectible,
  PokemonAchievement,
  DialogMessage,
  NPC,
  Project,
  Skill,
  TimelineEvent
} from '../../types';

// Map types
export type MapId = 'overworld' | 'projects' | 'skills' | 'about';

// Game state interface
interface GameState {
  // Player state
  playerPosition: Position;
  playerDirection: Direction;
  isMoving: boolean;

  // Map state
  currentMap: MapId;
  isTransitioning: boolean;
  savedOverworldPosition: Position | null;

  // Game state
  gameState: PokemonGameState;

  // Dialog
  currentDialog: DialogMessage[] | null;
  dialogIndex: number;
  currentSpeaker: string | null;

  // Collectibles & Achievements
  collectibles: PokemonCollectible[];
  achievements: PokemonAchievement[];

  // Viewed content tracking
  viewedProjects: string[];
  viewedSkills: string[];
  viewedTimeline: string[];

  // UI state
  showMinimap: boolean;
  showMenu: boolean;

  // Battle state
  battleRequested: boolean;
}

// Initial collectibles - positioned on walkable grass/path tiles
const initialCollectibles: PokemonCollectible[] = [
  { id: 'starter', name: 'Starter Badge', position: { tileX: 22, tileY: 13 }, collected: false, sprite: 'badge-starter' },
  { id: 'explorer', name: 'Explorer Badge', position: { tileX: 3, tileY: 20 }, collected: false, sprite: 'badge-explorer' },
  { id: 'coder', name: 'Coder Badge', position: { tileX: 37, tileY: 10 }, collected: false, sprite: 'badge-coder' },
  { id: 'scholar', name: 'Scholar Badge', position: { tileX: 15, tileY: 3 }, collected: false, sprite: 'badge-scholar' },
  { id: 'master', name: 'Master Badge', position: { tileX: 37, tileY: 25 }, collected: false, sprite: 'badge-master' },
  { id: 'rare-candy', name: 'Rare Candy', position: { tileX: 3, tileY: 10 }, collected: false, sprite: 'rare-candy' },
];

// Initial achievements
const initialAchievements: PokemonAchievement[] = [
  { id: 'first-steps', name: 'First Steps', description: 'Start exploring the world', icon: '👟', unlocked: false },
  { id: 'project-viewer', name: 'Project Viewer', description: 'View all 6 projects', icon: '📁', unlocked: false },
  { id: 'skill-master', name: 'Skill Master', description: 'Check out all skills', icon: '⚡', unlocked: false },
  { id: 'historian', name: 'Historian', description: 'View entire timeline', icon: '📜', unlocked: false },
  { id: 'social-butterfly', name: 'Social Butterfly', description: 'Talk to all NPCs', icon: '🦋', unlocked: false },
  { id: 'collector', name: 'Collector', description: 'Find all hidden badges', icon: '🏆', unlocked: false },
  { id: 'speedrunner', name: 'Speedrunner', description: 'View everything in 2 minutes', icon: '⏱️', unlocked: false },
  { id: 'battle-master', name: 'Battle Master', description: 'Win the skill battle', icon: '⚔️', unlocked: false },
];

// Initial state - spawn at center of map (tile 20, 15)
// SCALED_TILE = 16 * 3 = 48, so pixelX = 20 * 48 = 960, pixelY = 15 * 48 = 720
const initialState: GameState = {
  playerPosition: { tileX: 20, tileY: 15, pixelX: 960, pixelY: 720 },
  playerDirection: 'down',
  isMoving: false,
  currentMap: 'overworld',
  isTransitioning: false,
  savedOverworldPosition: null,
  gameState: 'exploring',
  currentDialog: null,
  dialogIndex: 0,
  currentSpeaker: null,
  collectibles: initialCollectibles,
  achievements: initialAchievements,
  viewedProjects: [],
  viewedSkills: [],
  viewedTimeline: [],
  showMinimap: true,
  showMenu: false,
  battleRequested: false,
};

// Action types
type GameAction =
  | { type: 'MOVE_PLAYER'; position: Position; direction: Direction }
  | { type: 'SET_MOVING'; isMoving: boolean }
  | { type: 'SET_DIRECTION'; direction: Direction }
  | { type: 'START_DIALOG'; dialog: DialogMessage[]; speaker?: string }
  | { type: 'ADVANCE_DIALOG' }
  | { type: 'END_DIALOG' }
  | { type: 'COLLECT_ITEM'; itemId: string }
  | { type: 'UNLOCK_ACHIEVEMENT'; achievementId: string }
  | { type: 'VIEW_PROJECT'; projectId: string }
  | { type: 'VIEW_SKILL'; skillId: string }
  | { type: 'VIEW_TIMELINE'; eventId: string }
  | { type: 'SET_GAME_STATE'; state: PokemonGameState }
  | { type: 'TOGGLE_MINIMAP' }
  | { type: 'TOGGLE_MENU' }
  | { type: 'RESET_GAME' }
  | { type: 'START_TRANSITION' }
  | { type: 'ENTER_BUILDING'; mapId: MapId; spawnPosition: Position }
  | { type: 'EXIT_BUILDING' }
  | { type: 'REQUEST_BATTLE' }
  | { type: 'CLEAR_BATTLE_REQUEST' };

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MOVE_PLAYER':
      return {
        ...state,
        playerPosition: action.position,
        playerDirection: action.direction,
      };

    case 'SET_MOVING':
      return { ...state, isMoving: action.isMoving };

    case 'SET_DIRECTION':
      return { ...state, playerDirection: action.direction };

    case 'START_DIALOG':
      return {
        ...state,
        gameState: 'dialog',
        currentDialog: action.dialog,
        dialogIndex: 0,
        currentSpeaker: action.speaker || null,
      };

    case 'ADVANCE_DIALOG':
      if (state.currentDialog && state.dialogIndex < state.currentDialog.length - 1) {
        return { ...state, dialogIndex: state.dialogIndex + 1 };
      }
      return state;

    case 'END_DIALOG':
      return {
        ...state,
        gameState: 'exploring',
        currentDialog: null,
        dialogIndex: 0,
        currentSpeaker: null,
      };

    case 'COLLECT_ITEM':
      return {
        ...state,
        collectibles: state.collectibles.map(item =>
          item.id === action.itemId ? { ...item, collected: true } : item
        ),
      };

    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(achievement =>
          achievement.id === action.achievementId ? { ...achievement, unlocked: true } : achievement
        ),
      };

    case 'VIEW_PROJECT':
      if (state.viewedProjects.includes(action.projectId)) return state;
      return {
        ...state,
        viewedProjects: [...state.viewedProjects, action.projectId],
      };

    case 'VIEW_SKILL':
      if (state.viewedSkills.includes(action.skillId)) return state;
      return {
        ...state,
        viewedSkills: [...state.viewedSkills, action.skillId],
      };

    case 'VIEW_TIMELINE':
      if (state.viewedTimeline.includes(action.eventId)) return state;
      return {
        ...state,
        viewedTimeline: [...state.viewedTimeline, action.eventId],
      };

    case 'SET_GAME_STATE':
      return { ...state, gameState: action.state };

    case 'TOGGLE_MINIMAP':
      return { ...state, showMinimap: !state.showMinimap };

    case 'TOGGLE_MENU':
      return {
        ...state,
        showMenu: !state.showMenu,
        gameState: state.showMenu ? 'exploring' : 'menu',
      };

    case 'RESET_GAME':
      return initialState;

    case 'START_TRANSITION':
      return { ...state, isTransitioning: true, gameState: 'paused' };

    case 'ENTER_BUILDING':
      return {
        ...state,
        currentMap: action.mapId,
        savedOverworldPosition: state.currentMap === 'overworld' ? state.playerPosition : state.savedOverworldPosition,
        playerPosition: action.spawnPosition,
        playerDirection: 'up',
        isTransitioning: false,
        gameState: 'exploring',
      };

    case 'EXIT_BUILDING':
      return {
        ...state,
        currentMap: 'overworld',
        playerPosition: state.savedOverworldPosition || initialState.playerPosition,
        playerDirection: 'down',
        isTransitioning: false,
        gameState: 'exploring',
      };

    case 'REQUEST_BATTLE':
      return { ...state, battleRequested: true };

    case 'CLEAR_BATTLE_REQUEST':
      return { ...state, battleRequested: false };

    default:
      return state;
  }
}

// Context interface
interface PokemonGameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;

  // Helper functions
  movePlayer: (position: Position, direction: Direction) => void;
  startDialog: (dialog: DialogMessage[], speaker?: string) => void;
  advanceDialog: () => void;
  endDialog: () => void;
  collectItem: (itemId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  viewProject: (projectId: string) => void;
  viewSkill: (skillId: string) => void;
  viewTimeline: (eventId: string) => void;
  enterBuilding: (mapId: MapId, spawnPosition: Position) => void;
  exitBuilding: () => void;
  requestBattle: () => void;
  clearBattleRequest: () => void;

  // Portfolio data (passed from parent)
  projects: Project[];
  skills: Skill[];
  timelineEvents: TimelineEvent[];
}

const PokemonGameContext = createContext<PokemonGameContextType | null>(null);

// Provider props
interface PokemonGameProviderProps {
  children: ReactNode;
  projects: Project[];
  skills: Skill[];
  timelineEvents: TimelineEvent[];
}

// Provider component
export function PokemonGameProvider({
  children,
  projects,
  skills,
  timelineEvents
}: PokemonGameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const movePlayer = useCallback((position: Position, direction: Direction) => {
    dispatch({ type: 'MOVE_PLAYER', position, direction });
  }, []);

  const startDialog = useCallback((dialog: DialogMessage[], speaker?: string) => {
    dispatch({ type: 'START_DIALOG', dialog, speaker });
  }, []);

  const advanceDialog = useCallback(() => {
    dispatch({ type: 'ADVANCE_DIALOG' });
  }, []);

  const endDialog = useCallback(() => {
    dispatch({ type: 'END_DIALOG' });
  }, []);

  const collectItem = useCallback((itemId: string) => {
    dispatch({ type: 'COLLECT_ITEM', itemId });
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId });
  }, []);

  const viewProject = useCallback((projectId: string) => {
    dispatch({ type: 'VIEW_PROJECT', projectId });
  }, []);

  const viewSkill = useCallback((skillId: string) => {
    dispatch({ type: 'VIEW_SKILL', skillId });
  }, []);

  const viewTimeline = useCallback((eventId: string) => {
    dispatch({ type: 'VIEW_TIMELINE', eventId });
  }, []);

  const enterBuilding = useCallback((mapId: MapId, spawnPosition: Position) => {
    dispatch({ type: 'START_TRANSITION' });
    // Delay for transition effect
    setTimeout(() => {
      dispatch({ type: 'ENTER_BUILDING', mapId, spawnPosition });
    }, 500);
  }, []);

  const exitBuilding = useCallback(() => {
    dispatch({ type: 'START_TRANSITION' });
    setTimeout(() => {
      dispatch({ type: 'EXIT_BUILDING' });
    }, 500);
  }, []);

  const requestBattle = useCallback(() => {
    dispatch({ type: 'REQUEST_BATTLE' });
  }, []);

  const clearBattleRequest = useCallback(() => {
    dispatch({ type: 'CLEAR_BATTLE_REQUEST' });
  }, []);

  const value: PokemonGameContextType = {
    state,
    dispatch,
    movePlayer,
    startDialog,
    advanceDialog,
    endDialog,
    collectItem,
    unlockAchievement,
    viewProject,
    viewSkill,
    viewTimeline,
    enterBuilding,
    exitBuilding,
    requestBattle,
    clearBattleRequest,
    projects,
    skills,
    timelineEvents,
  };

  return (
    <PokemonGameContext.Provider value={value}>
      {children}
    </PokemonGameContext.Provider>
  );
}

// Hook to use the context
export function usePokemonGame() {
  const context = useContext(PokemonGameContext);
  if (!context) {
    throw new Error('usePokemonGame must be used within a PokemonGameProvider');
  }
  return context;
}

export default PokemonGameContext;
