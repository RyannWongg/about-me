import React, { useRef, useEffect, useCallback, useState } from 'react';
import { usePokemonGame } from './context/PokemonGameContext';
import { MapId } from './context/PokemonGameContext';
import { Direction, Position, NPC, DialogMessage, PokemonCollectible } from '../types';
import { SoundManager } from './audio/SoundManager';

// Constants
const TILE_SIZE = 16;
const SCALE = 3;
const SCALED_TILE = TILE_SIZE * SCALE;
const PLAYER_SPEED = 4;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

// Tile types
const TILE_GRASS = 0;
const TILE_PATH = 1;
const TILE_WATER = 2;
const TILE_WALL = 3;
const TILE_BUILDING = 4;
const TILE_DOOR = 5;
const TILE_TREE = 6;
const TILE_FLOWER = 7;
const TILE_MONUMENT = 8;
const TILE_SIGN = 9;
// Interior tiles
const TILE_FLOOR = 10;
const TILE_EXIT_MAT = 11;
const TILE_EXHIBIT = 12;
const TILE_RUG = 13;
const TILE_BOOKSHELF = 14;
const TILE_DESK = 15;

// Color palette
const COLORS = {
  grass: '#4ade80',
  grassDark: '#22c55e',
  path: '#d4a574',
  pathDark: '#b8956e',
  water: '#60a5fa',
  waterDark: '#3b82f6',
  wall: '#6b7280',
  wallInterior: '#475569',
  building: '#78716c',
  buildingDark: '#57534e',
  door: '#92400e',
  tree: '#166534',
  treeTrunk: '#7c2d12',
  flower: '#f472b6',
  monument: '#a78bfa',
  monumentDark: '#7c3aed',
  sign: '#fbbf24',
  floor: '#64748b',
  floorDark: '#475569',
  exitMat: '#dc2626',
  exhibit: '#8b5cf6',
  rug: '#b91c1c',
  bookshelf: '#78350f',
  desk: '#a16207',
};

// Map dimensions
const MAP_WIDTH = 40;
const MAP_HEIGHT = 30;
const INTERIOR_WIDTH = 15;
const INTERIOR_HEIGHT = 12;

// Interior exhibit data
interface Exhibit {
  id: string;
  position: { tileX: number; tileY: number };
  title: string;
  dialog: DialogMessage[];
}

// ============ OVERWORLD DATA ============

const OVERWORLD_NPCS: NPC[] = [
  {
    id: 'guide',
    name: 'Guide Ryan',
    position: { tileX: 20, tileY: 12 },
    direction: 'down',
    sprite: 'guide',
    dialogs: [
      { speaker: 'Guide Ryan', text: "Welcome to Ryan's World! I'm your guide.", avatar: '🧑‍💼' },
      { speaker: 'Guide Ryan', text: "Explore the buildings - walk into the doors to enter!", avatar: '🧑‍💼' },
      { speaker: 'Guide Ryan', text: "PROJECTS building is southwest, SKILLS LAB is southeast!", avatar: '🧑‍💼' },
    ]
  },
  {
    id: 'prof',
    name: 'Professor',
    position: { tileX: 8, tileY: 10 },
    direction: 'down',
    sprite: 'professor',
    dialogs: [
      { speaker: 'Professor', text: "Ryan studies at University of Toronto.", avatar: '👨‍🏫' },
      { speaker: 'Professor', text: "Math & Statistics specialist with CS major!", avatar: '👨‍🏫' },
    ]
  },
  {
    id: 'battle-trainer',
    name: 'Bug Hunter',
    position: { tileX: 25, tileY: 15 },
    direction: 'left',
    sprite: 'scientist',
    dialogs: [
      { speaker: 'Bug Hunter', text: "Hey there! Think you know your stuff?", avatar: '🐛' },
      { speaker: 'Bug Hunter', text: "Let's battle! Answer coding questions to defeat the bug!", avatar: '⚔️' },
    ]
  },
];

interface InteractiveSign {
  id: string;
  position: { tileX: number; tileY: number };
  dialog: DialogMessage[];
}

const OVERWORLD_SIGNS: InteractiveSign[] = [
  {
    id: 'projects-sign',
    position: { tileX: 8, tileY: 19 },
    dialog: [
      { speaker: 'Sign', text: "📁 PROJECTS BUILDING - Walk into the door to enter!", avatar: '🪧' },
    ]
  },
  {
    id: 'skills-sign',
    position: { tileX: 32, tileY: 19 },
    dialog: [
      { speaker: 'Sign', text: "⚡ SKILLS LAB - Walk into the door to enter!", avatar: '🪧' },
    ]
  },
  {
    id: 'about-sign',
    position: { tileX: 10, tileY: 9 },
    dialog: [
      { speaker: 'Sign', text: "🏠 RYAN'S HOUSE - Walk into the door to enter!", avatar: '🪧' },
    ]
  },
];

interface TimelineMonument {
  id: string;
  position: { tileX: number; tileY: number };
  year: string;
  dialog: DialogMessage[];
}

const TIMELINE_MONUMENTS: TimelineMonument[] = [
  {
    id: 'timeline-1',
    position: { tileX: 29, tileY: 5 },
    year: '2022',
    dialog: [
      { speaker: '📜 2022 - Present', text: "Bachelor of Arts & Science at UofT", avatar: '🎓' },
      { speaker: '📜 Focus', text: "Math/Stats Specialist, CS Major", avatar: '🎓' },
    ]
  },
  {
    id: 'timeline-2',
    position: { tileX: 32, tileY: 5 },
    year: '2025',
    dialog: [
      { speaker: '📜 2025', text: "IT Support & Software Testing at SJM Macau", avatar: '💼' },
    ]
  },
  {
    id: 'timeline-3',
    position: { tileX: 35, tileY: 5 },
    year: '2020',
    dialog: [
      { speaker: '📜 2020-2021', text: "Website Developer - iGEM Research Portal", avatar: '🌐' },
    ]
  },
];

// ============ INTERIOR DATA ============

const PROJECTS_EXHIBITS: Exhibit[] = [
  { id: 'p1', position: { tileX: 3, tileY: 3 }, title: 'Lakers Analytics', dialog: [
    { speaker: '🏀 Lakers Analytics', text: "LA Lakers Performance Analytics Dashboard", avatar: '📊' },
    { speaker: '🏀 Tech', text: "Python, Data Viz, Analytics", avatar: '💻' },
  ]},
  { id: 'p2', position: { tileX: 7, tileY: 3 }, title: 'House of Data', dialog: [
    { speaker: '📈 House of Data', text: "NBA Player Evolution & Clustering Analysis", avatar: '📊' },
    { speaker: '📈 Tech', text: "Statistical Modeling, K-Means, PCA", avatar: '💻' },
  ]},
  { id: 'p3', position: { tileX: 11, tileY: 3 }, title: 'Java Solitaire', dialog: [
    { speaker: '🃏 Java Solitaire', text: "OOP Card Game Engine with MVC Pattern", avatar: '🎮' },
    { speaker: '🃏 Tech', text: "Java, OOP, Event System", avatar: '💻' },
  ]},
  { id: 'p4', position: { tileX: 5, tileY: 7 }, title: 'Assembly Tetris', dialog: [
    { speaker: '🧱 Assembly Tetris', text: "Tetris clone in < 2KB Assembly!", avatar: '🎮' },
    { speaker: '🧱 Tech', text: "Assembly, Low-level Optimization", avatar: '💻' },
  ]},
  { id: 'p5', position: { tileX: 9, tileY: 7 }, title: 'Travel Planner', dialog: [
    { speaker: '✈️ Smart Travel Planner', text: "Cross-platform travel companion app", avatar: '📱' },
    { speaker: '✈️ Status', text: "In Progress - React Native, Firebase", avatar: '🚧' },
  ]},
];

const SKILLS_EXHIBITS: Exhibit[] = [
  { id: 's1', position: { tileX: 3, tileY: 3 }, title: 'Frontend', dialog: [
    { speaker: '💻 Frontend Skills', text: "React (85%), TypeScript (80%), Tailwind (85%)", avatar: '⚡' },
    { speaker: '💻 More', text: "HTML/CSS (90%), Three.js (65%)", avatar: '⚡' },
  ]},
  { id: 's2', position: { tileX: 7, tileY: 3 }, title: 'Backend', dialog: [
    { speaker: '⚙️ Backend Skills', text: "Python (90%), Java (75%), Node.js (75%)", avatar: '⚡' },
    { speaker: '⚙️ More', text: "C (70%), SQL (75%), Assembly (60%)", avatar: '⚡' },
  ]},
  { id: 's3', position: { tileX: 11, tileY: 3 }, title: 'Tools', dialog: [
    { speaker: '🛠️ Tools & Libraries', text: "Git (85%), Pandas (85%), NumPy (80%)", avatar: '⚡' },
    { speaker: '🛠️ More', text: "Matplotlib (80%), R (70%)", avatar: '⚡' },
  ]},
];

const ABOUT_EXHIBITS: Exhibit[] = [
  { id: 'a1', position: { tileX: 3, tileY: 3 }, title: 'About Me', dialog: [
    { speaker: '👤 Ryan Wong', text: "Software Developer & Data Enthusiast", avatar: '👨‍💻' },
    { speaker: '📍 Location', text: "Toronto, Canada", avatar: '🌍' },
  ]},
  { id: 'a2', position: { tileX: 7, tileY: 3 }, title: 'Education', dialog: [
    { speaker: '🎓 University of Toronto', text: "B.A.Sc in Math/Stats & Computer Science", avatar: '🎓' },
    { speaker: '📚 Focus', text: "Data Analysis, Statistical Modeling", avatar: '📊' },
  ]},
  { id: 'a3', position: { tileX: 11, tileY: 3 }, title: 'Contact', dialog: [
    { speaker: '📧 Get in Touch', text: "Check the main portfolio for contact links!", avatar: '✉️' },
    { speaker: '🔗 Links', text: "GitHub, LinkedIn, Email available", avatar: '🌐' },
  ]},
];

const INTERIOR_NPCS: Record<MapId, NPC[]> = {
  overworld: [],
  projects: [
    { id: 'curator', name: 'Curator', position: { tileX: 7, tileY: 5 }, direction: 'down', sprite: 'developer', dialogs: [
      { speaker: 'Curator', text: "Welcome to the Projects Gallery!", avatar: '🎨' },
      { speaker: 'Curator', text: "Walk up to each exhibit to learn more.", avatar: '🎨' },
    ]},
  ],
  skills: [
    { id: 'trainer', name: 'Trainer', position: { tileX: 7, tileY: 5 }, direction: 'down', sprite: 'scientist', dialogs: [
      { speaker: 'Skill Trainer', text: "This lab showcases Ryan's technical skills!", avatar: '🔬' },
      { speaker: 'Skill Trainer', text: "Each display shows proficiency levels.", avatar: '🔬' },
    ]},
  ],
  about: [
    { id: 'host', name: 'Host', position: { tileX: 7, tileY: 5 }, direction: 'down', sprite: 'guide', dialogs: [
      { speaker: 'Ryan', text: "Welcome to my house! Make yourself at home.", avatar: '🏠' },
      { speaker: 'Ryan', text: "Feel free to look around!", avatar: '🏠' },
    ]},
  ],
};

// ============ MAP GENERATION ============

function generateOverworldMap(): number[][] {
  const map: number[][] = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
        row.push(TILE_TREE);
      } else if (
        (x >= 18 && x <= 22 && y >= 5 && y <= 25) ||
        (y >= 14 && y <= 16 && x >= 5 && x <= 35)
      ) {
        row.push(TILE_PATH);
      } else if (x >= 5 && x <= 12 && y >= 3 && y <= 8) {
        if (y === 8 && x >= 7 && x <= 10) row.push(TILE_DOOR);
        else if (y === 3 || x === 5 || x === 12) row.push(TILE_WALL);
        else row.push(TILE_BUILDING);
      } else if (x >= 27 && x <= 37 && y >= 3 && y <= 8) {
        if (y === 5 && (x === 29 || x === 32 || x === 35)) row.push(TILE_MONUMENT);
        else row.push(TILE_PATH);
      } else if (x >= 5 && x <= 15 && y >= 20 && y <= 26) {
        if (y === 20 && x >= 8 && x <= 12) row.push(TILE_DOOR);
        else if (y === 20 || y === 26 || x === 5 || x === 15) row.push(TILE_WALL);
        else row.push(TILE_BUILDING);
      } else if (x >= 25 && x <= 35 && y >= 20 && y <= 26) {
        if (y === 20 && x >= 28 && x <= 32) row.push(TILE_DOOR);
        else if (y === 20 || y === 26 || x === 25 || x === 35) row.push(TILE_WALL);
        else row.push(TILE_BUILDING);
      } else if (
        (x >= 9 && x <= 11 && y >= 16 && y <= 19) ||
        (x >= 29 && x <= 31 && y >= 16 && y <= 19) ||
        (x >= 8 && x <= 9 && y >= 9 && y <= 14)
      ) {
        row.push(TILE_PATH);
      } else if (
        (x === 8 && y === 19) ||
        (x === 32 && y === 19) ||
        (x === 10 && y === 9)
      ) {
        row.push(TILE_SIGN);
      } else if (
        (x >= 2 && x <= 4 && y >= 12 && y <= 18) ||
        (x >= 36 && x <= 38 && y >= 12 && y <= 18)
      ) {
        row.push(TILE_WATER);
      } else {
        row.push(TILE_GRASS);
      }
    }
    map.push(row);
  }
  return map;
}

function generateInteriorMap(exhibits: Exhibit[]): number[][] {
  const map: number[][] = [];
  for (let y = 0; y < INTERIOR_HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < INTERIOR_WIDTH; x++) {
      // Walls around edges
      if (x === 0 || x === INTERIOR_WIDTH - 1 || y === 0) {
        row.push(TILE_WALL);
      }
      // Exit mat at bottom center
      else if (y === INTERIOR_HEIGHT - 1 && x >= 6 && x <= 8) {
        row.push(TILE_EXIT_MAT);
      }
      // Bottom wall with exit
      else if (y === INTERIOR_HEIGHT - 1) {
        row.push(TILE_WALL);
      }
      // Exhibits
      else if (exhibits.some(e => e.position.tileX === x && e.position.tileY === y)) {
        row.push(TILE_EXHIBIT);
      }
      // Decorative rug in center
      else if (x >= 5 && x <= 9 && y >= 5 && y <= 7) {
        row.push(TILE_RUG);
      }
      // Floor
      else {
        row.push(TILE_FLOOR);
      }
    }
    map.push(row);
  }
  return map;
}

// Check walkability
function isWalkable(tile: number): boolean {
  return tile === TILE_GRASS || tile === TILE_PATH || tile === TILE_FLOWER ||
         tile === TILE_FLOOR || tile === TILE_RUG || tile === TILE_EXIT_MAT ||
         tile === TILE_DOOR;
}

// ============ MAIN COMPONENT ============

export const PokemonCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, movePlayer, dispatch, startDialog, enterBuilding, exitBuilding, collectItem, unlockAchievement, requestBattle, projects, skills } = usePokemonGame();
  const hasMovedRef = useRef(false);

  // Generate maps
  const overworldMapRef = useRef<number[][]>(generateOverworldMap());
  const projectsMapRef = useRef<number[][]>(generateInteriorMap(PROJECTS_EXHIBITS));
  const skillsMapRef = useRef<number[][]>(generateInteriorMap(SKILLS_EXHIBITS));
  const aboutMapRef = useRef<number[][]>(generateInteriorMap(ABOUT_EXHIBITS));

  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number>();
  const targetPositionRef = useRef<Position | null>(null);
  const walkFrameRef = useRef(0);
  const frameCountRef = useRef(0);

  // Transition overlay
  const [transitionOpacity, setTransitionOpacity] = useState(0);

  // Handle transition effect
  useEffect(() => {
    if (state.isTransitioning) {
      setTransitionOpacity(1);
    } else {
      const timer = setTimeout(() => setTransitionOpacity(0), 100);
      return () => clearTimeout(timer);
    }
  }, [state.isTransitioning]);

  // Get current map data
  const getCurrentMap = useCallback((): number[][] => {
    switch (state.currentMap) {
      case 'projects': return projectsMapRef.current;
      case 'skills': return skillsMapRef.current;
      case 'about': return aboutMapRef.current;
      default: return overworldMapRef.current;
    }
  }, [state.currentMap]);

  const getCurrentMapSize = useCallback(() => {
    if (state.currentMap === 'overworld') {
      return { width: MAP_WIDTH, height: MAP_HEIGHT };
    }
    return { width: INTERIOR_WIDTH, height: INTERIOR_HEIGHT };
  }, [state.currentMap]);

  const getCurrentNPCs = useCallback((): NPC[] => {
    if (state.currentMap === 'overworld') return OVERWORLD_NPCS;
    return INTERIOR_NPCS[state.currentMap] || [];
  }, [state.currentMap]);

  const getCurrentExhibits = useCallback((): Exhibit[] => {
    switch (state.currentMap) {
      case 'projects': return PROJECTS_EXHIBITS;
      case 'skills': return SKILLS_EXHIBITS;
      case 'about': return ABOUT_EXHIBITS;
      default: return [];
    }
  }, [state.currentMap]);

  // Check for interactions
  const checkInteraction = useCallback((playerX: number, playerY: number, direction: Direction) => {
    let checkX = playerX;
    let checkY = playerY;

    switch (direction) {
      case 'up': checkY--; break;
      case 'down': checkY++; break;
      case 'left': checkX--; break;
      case 'right': checkX++; break;
    }

    const currentNPCs = getCurrentNPCs();
    const currentExhibits = getCurrentExhibits();
    const map = getCurrentMap();

    // Check NPCs
    for (const npc of currentNPCs) {
      if (npc.position.tileX === checkX && npc.position.tileY === checkY) {
        startDialog(npc.dialogs, npc.name);
        // If it's the battle trainer, request battle after dialog
        if (npc.id === 'battle-trainer') {
          // Set a flag to trigger battle when dialog closes
          setTimeout(() => {
            requestBattle();
          }, 100);
        }
        return;
      }
    }

    // Check exhibits (interior only)
    for (const exhibit of currentExhibits) {
      if (exhibit.position.tileX === checkX && exhibit.position.tileY === checkY) {
        startDialog(exhibit.dialog);
        // Dispatch correct action based on current map
        if (state.currentMap === 'projects') {
          dispatch({ type: 'VIEW_PROJECT', projectId: exhibit.id });
        } else if (state.currentMap === 'skills') {
          dispatch({ type: 'VIEW_SKILL', skillId: exhibit.id });
        }
        return;
      }
    }

    // Check signs (overworld)
    if (state.currentMap === 'overworld') {
      for (const sign of OVERWORLD_SIGNS) {
        if (sign.position.tileX === checkX && sign.position.tileY === checkY) {
          startDialog(sign.dialog);
          return;
        }
      }

      // Check monuments
      for (const monument of TIMELINE_MONUMENTS) {
        if (monument.position.tileX === checkX && monument.position.tileY === checkY) {
          startDialog(monument.dialog);
          dispatch({ type: 'VIEW_TIMELINE', eventId: monument.id });
          return;
        }
      }
    }
  }, [state.currentMap, getCurrentNPCs, getCurrentExhibits, getCurrentMap, startDialog, dispatch, requestBattle]);

  // Check for door entry/exit
  const checkDoorTransition = useCallback((tileX: number, tileY: number) => {
    const map = getCurrentMap();
    const tile = map[tileY]?.[tileX];

    if (state.currentMap === 'overworld' && tile === TILE_DOOR) {
      SoundManager.playDoorEnter();
      // Check which building
      if (tileX >= 8 && tileX <= 12 && tileY === 20) {
        enterBuilding('projects', { tileX: 7, tileY: 10, pixelX: 7 * SCALED_TILE, pixelY: 10 * SCALED_TILE });
      } else if (tileX >= 28 && tileX <= 32 && tileY === 20) {
        enterBuilding('skills', { tileX: 7, tileY: 10, pixelX: 7 * SCALED_TILE, pixelY: 10 * SCALED_TILE });
      } else if (tileX >= 7 && tileX <= 10 && tileY === 8) {
        enterBuilding('about', { tileX: 7, tileY: 10, pixelX: 7 * SCALED_TILE, pixelY: 10 * SCALED_TILE });
      }
    } else if (state.currentMap !== 'overworld' && tile === TILE_EXIT_MAT) {
      SoundManager.playDoorExit();
      exitBuilding();
    }
  }, [state.currentMap, getCurrentMap, enterBuilding, exitBuilding]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameState !== 'exploring' || state.isTransitioning) return;

      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        keysPressed.current.add(key);
      }

      if (key === ' ' || key === 'enter') {
        e.preventDefault();
        checkInteraction(state.playerPosition.tileX, state.playerPosition.tileY, state.playerDirection);
      }

      if (key === 'm') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_MINIMAP' });
      }

      if (key === 'escape') {
        e.preventDefault();
        SoundManager.playMenuOpen();
        dispatch({ type: 'TOGGLE_MENU' });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state.gameState, state.isTransitioning, state.playerPosition, state.playerDirection, checkInteraction, dispatch]);

  const getDirectionFromKeys = useCallback((): Direction | null => {
    const keys = keysPressed.current;
    if (keys.has('w') || keys.has('arrowup')) return 'up';
    if (keys.has('s') || keys.has('arrowdown')) return 'down';
    if (keys.has('a') || keys.has('arrowleft')) return 'left';
    if (keys.has('d') || keys.has('arrowright')) return 'right';
    return null;
  }, []);

  // Draw tile
  const drawTile = useCallback((ctx: CanvasRenderingContext2D, tile: number, screenX: number, screenY: number, tileX: number, tileY: number) => {
    const x = screenX;
    const y = screenY;
    const size = SCALED_TILE;

    switch (tile) {
      case TILE_GRASS:
        ctx.fillStyle = COLORS.grass;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = COLORS.grassDark;
        const seed = (tileX * 7 + tileY * 13) % 5;
        for (let i = 0; i < seed; i++) {
          ctx.fillRect(x + ((tileX * 17 + i * 23) % size), y + ((tileY * 19 + i * 29) % size), 2, 4);
        }
        break;
      case TILE_PATH:
        ctx.fillStyle = COLORS.path;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = COLORS.pathDark;
        ctx.fillRect(x + 4, y + 4, 6, 6);
        ctx.fillRect(x + size - 12, y + size - 12, 6, 6);
        break;
      case TILE_WATER:
        ctx.fillStyle = COLORS.water;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = COLORS.waterDark;
        const waveOffset = Math.sin(frameCountRef.current * 0.05 + tileX) * 4;
        ctx.fillRect(x + 8 + waveOffset, y + 12, 16, 3);
        break;
      case TILE_WALL:
        ctx.fillStyle = state.currentMap === 'overworld' ? COLORS.wall : COLORS.wallInterior;
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 4, y + 4, size / 2 - 6, size / 2 - 6);
        ctx.strokeRect(x + size / 2 + 2, y + size / 2 + 2, size / 2 - 6, size / 2 - 6);
        break;
      case TILE_BUILDING:
        ctx.fillStyle = COLORS.building;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + size / 3, y + size / 3, size / 3, size / 3);
        break;
      case TILE_DOOR:
        ctx.fillStyle = COLORS.door;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(x + size - 14, y + size / 2, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      case TILE_TREE:
        ctx.fillStyle = COLORS.grass;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = COLORS.treeTrunk;
        ctx.fillRect(x + size / 3, y + size / 2, size / 3, size / 2);
        ctx.fillStyle = COLORS.tree;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 3, size / 2.2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case TILE_MONUMENT:
        ctx.fillStyle = COLORS.path;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#374151';
        ctx.fillRect(x + 6, y + size - 16, size - 12, 14);
        ctx.fillStyle = COLORS.monument;
        ctx.fillRect(x + 10, y + 8, size - 20, size - 22);
        const glowPulse = Math.sin(frameCountRef.current * 0.08) * 0.3 + 0.7;
        ctx.globalAlpha = glowPulse;
        ctx.fillStyle = COLORS.monumentDark;
        ctx.fillRect(x + 12, y + 10, size - 24, size - 26);
        ctx.globalAlpha = 1;
        const monument = TIMELINE_MONUMENTS.find(m => m.position.tileX === tileX && m.position.tileY === tileY);
        if (monument) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(monument.year, x + size / 2, y + size / 2 + 4);
        }
        break;
      case TILE_SIGN:
        ctx.fillStyle = COLORS.grass;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x + size / 2 - 3, y + size / 2, 6, size / 2);
        ctx.fillStyle = COLORS.sign;
        ctx.fillRect(x + 6, y + 8, size - 12, size / 2 - 4);
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('!', x + size / 2, y + size / 2 - 6);
        break;
      case TILE_FLOOR:
        ctx.fillStyle = COLORS.floor;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = COLORS.floorDark;
        ctx.fillRect(x, y, 2, size);
        ctx.fillRect(x, y, size, 2);
        break;
      case TILE_EXIT_MAT:
        ctx.fillStyle = COLORS.exitMat;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('EXIT', x + size / 2, y + size / 2 + 4);
        break;
      case TILE_EXHIBIT:
        ctx.fillStyle = COLORS.floor;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = COLORS.exhibit;
        ctx.fillRect(x + 4, y + 4, size - 8, size - 8);
        const pulse = Math.sin(frameCountRef.current * 0.1) * 0.2 + 0.8;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#c4b5fd';
        ctx.fillRect(x + 8, y + 8, size - 16, size - 16);
        ctx.globalAlpha = 1;
        break;
      case TILE_RUG:
        ctx.fillStyle = COLORS.rug;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(x + 4, y + 4, size - 8, size - 8);
        break;
      case TILE_FLOWER:
        ctx.fillStyle = COLORS.grass;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = COLORS.flower;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }, [state.currentMap]);

  // Draw NPC
  const drawNPC = useCallback((ctx: CanvasRenderingContext2D, npc: NPC, screenX: number, screenY: number) => {
    const x = screenX;
    const y = screenY;
    const size = SCALED_TILE;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x + size / 2, y + size - 4, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const bodyColors: Record<string, string> = {
      guide: '#3b82f6',
      professor: '#8b5cf6',
      developer: '#10b981',
      scientist: '#f59e0b',
    };

    ctx.fillStyle = bodyColors[npc.sprite] || '#6b7280';
    ctx.fillRect(x + 10, y + 18, size - 20, size - 24);

    ctx.fillStyle = '#fcd34d';
    ctx.beginPath();
    ctx.arc(x + size / 2, y + 16, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1f2937';
    const eyeOffsets = { up: [[-4, -2], [4, -2]], down: [[-4, 2], [4, 2]], left: [[-5, 0], [-1, 0]], right: [[1, 0], [5, 0]] };
    eyeOffsets[npc.direction].forEach(([ox, oy]) => {
      ctx.beginPath();
      ctx.arc(x + size / 2 + ox, y + 14 + oy, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    const playerDist = Math.abs(state.playerPosition.tileX - npc.position.tileX) + Math.abs(state.playerPosition.tileY - npc.position.tileY);
    if (playerDist <= 2) {
      const bob = Math.sin(frameCountRef.current * 0.1) * 2;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(x + size / 2, y - 8 + bob, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('...', x + size / 2, y - 4 + bob);
    }
  }, [state.playerPosition]);

  // Draw player
  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, screenX: number, screenY: number, direction: Direction, isMoving: boolean) => {
    const x = screenX;
    const y = screenY;
    const size = SCALED_TILE;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x + size / 2, y + size - 4, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 10, y + 18, size - 20, size - 24);

    ctx.fillStyle = '#fcd34d';
    ctx.beginPath();
    ctx.arc(x + size / 2, y + 16, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(x + size / 2, y + 10, 10, Math.PI, 0);
    ctx.fill();

    const eyeOffsets = { up: [[-4, -2], [4, -2]], down: [[-4, 2], [4, 2]], left: [[-5, 0], [-1, 0]], right: [[1, 0], [5, 0]] };
    eyeOffsets[direction].forEach(([ox, oy]) => {
      ctx.beginPath();
      ctx.arc(x + size / 2 + ox, y + 14 + oy, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#1e40af';
    if (isMoving) {
      const legOffset = Math.sin(walkFrameRef.current * 0.3) * 4;
      ctx.fillRect(x + 14 + legOffset, y + size - 10, 8, 10);
      ctx.fillRect(x + size - 22 - legOffset, y + size - 10, 8, 10);
    } else {
      ctx.fillRect(x + 16, y + size - 10, 8, 10);
      ctx.fillRect(x + size - 24, y + size - 10, 8, 10);
    }
  }, []);

  // Draw collectible
  const drawCollectible = useCallback((ctx: CanvasRenderingContext2D, collectible: PokemonCollectible, screenX: number, screenY: number, frameCount: number) => {
    const x = screenX;
    const y = screenY;
    const size = SCALED_TILE;
    const bounce = Math.sin(frameCount * 0.1) * 4;

    // Glow effect
    const glowIntensity = Math.sin(frameCount * 0.08) * 0.3 + 0.7;
    ctx.globalAlpha = glowIntensity * 0.4;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2 + bounce, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Badge/item sprite
    if (collectible.sprite.includes('badge')) {
      // Draw badge
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(x + size / 2, y + 8 + bounce);
      ctx.lineTo(x + size - 8, y + size / 2 + bounce);
      ctx.lineTo(x + size / 2, y + size - 8 + bounce);
      ctx.lineTo(x + 8, y + size / 2 + bounce);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2 + bounce, 8, 0, Math.PI * 2);
      ctx.fill();

      // Star
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★', x + size / 2, y + size / 2 + 4 + bounce);
    } else if (collectible.sprite === 'rare-candy') {
      // Draw rare candy (pokeball-like)
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2 + bounce, 12, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#f9a8d4';
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2 + bounce, 12, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2 + bounce, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  // Player position ref for smooth animation (persists across renders)
  const playerPosRef = useRef({ ...state.playerPosition });
  const playerDirRef = useRef(state.playerDirection);

  // Sync refs when state changes (e.g., after entering/exiting buildings)
  useEffect(() => {
    if (!state.isMoving && !targetPositionRef.current) {
      playerPosRef.current = { ...state.playerPosition };
      playerDirRef.current = state.playerDirection;
    }
  }, [state.playerPosition, state.playerDirection, state.isMoving]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      frameCountRef.current++;

      const map = getCurrentMap();
      const mapSize = getCurrentMapSize();
      const currentNPCs = getCurrentNPCs();
      const playerPos = playerPosRef.current;
      const isCurrentlyMoving = targetPositionRef.current !== null;

      if (state.gameState === 'exploring' && !state.isTransitioning) {
        const direction = getDirectionFromKeys();

        if (direction && !isCurrentlyMoving) {
          playerDirRef.current = direction;

          let targetX = playerPos.tileX;
          let targetY = playerPos.tileY;

          switch (direction) {
            case 'up': targetY--; break;
            case 'down': targetY++; break;
            case 'left': targetX--; break;
            case 'right': targetX++; break;
          }

          const npcCollision = currentNPCs.some(npc => npc.position.tileX === targetX && npc.position.tileY === targetY);
          const exhibitCollision = getCurrentExhibits().some(e => e.position.tileX === targetX && e.position.tileY === targetY);

          if (
            !npcCollision && !exhibitCollision &&
            targetX >= 0 && targetX < mapSize.width &&
            targetY >= 0 && targetY < mapSize.height &&
            isWalkable(map[targetY][targetX])
          ) {
            targetPositionRef.current = {
              tileX: targetX,
              tileY: targetY,
              pixelX: targetX * SCALED_TILE,
              pixelY: targetY * SCALED_TILE,
            };
            dispatch({ type: 'SET_MOVING', isMoving: true });
          } else {
            dispatch({ type: 'SET_DIRECTION', direction: playerDirRef.current });
          }
        }

        if (targetPositionRef.current) {
          const target = targetPositionRef.current;
          const dx = target.pixelX - playerPos.pixelX;
          const dy = target.pixelY - playerPos.pixelY;

          if (Math.abs(dx) > PLAYER_SPEED) {
            playerPos.pixelX += Math.sign(dx) * PLAYER_SPEED;
          } else {
            playerPos.pixelX = target.pixelX;
          }

          if (Math.abs(dy) > PLAYER_SPEED) {
            playerPos.pixelY += Math.sign(dy) * PLAYER_SPEED;
          } else {
            playerPos.pixelY = target.pixelY;
          }

          walkFrameRef.current++;

          if (playerPos.pixelX === target.pixelX && playerPos.pixelY === target.pixelY) {
            playerPos.tileX = target.tileX;
            playerPos.tileY = target.tileY;
            targetPositionRef.current = null;
            dispatch({ type: 'SET_MOVING', isMoving: false });
            movePlayer({ ...playerPos }, playerDirRef.current);

            // First steps achievement
            if (!hasMovedRef.current) {
              hasMovedRef.current = true;
              unlockAchievement('first-steps');
            }

            // Check for collectible pickup
            if (state.currentMap === 'overworld') {
              const collectible = state.collectibles.find(
                c => !c.collected && c.position.tileX === playerPos.tileX && c.position.tileY === playerPos.tileY
              );
              if (collectible) {
                collectItem(collectible.id);
                SoundManager.playCollect();
                startDialog([
                  { speaker: 'Item Found!', text: `You found ${collectible.name}!`, avatar: '🎁' }
                ]);

                // Check collector achievement
                const collectedCount = state.collectibles.filter(c => c.collected).length + 1;
                if (collectedCount >= state.collectibles.length) {
                  unlockAchievement('collector');
                }
              }
            }

            // Check for door transition after moving onto tile
            checkDoorTransition(playerPos.tileX, playerPos.tileY);
          }
        }
      }

      // Camera
      const cameraX = Math.max(0, Math.min(
        playerPos.pixelX - CANVAS_WIDTH / 2 + SCALED_TILE / 2,
        mapSize.width * SCALED_TILE - CANVAS_WIDTH
      ));
      const cameraY = Math.max(0, Math.min(
        playerPos.pixelY - CANVAS_HEIGHT / 2 + SCALED_TILE / 2,
        mapSize.height * SCALED_TILE - CANVAS_HEIGHT
      ));

      // For small interior maps, center them
      const offsetX = mapSize.width * SCALED_TILE < CANVAS_WIDTH ? (CANVAS_WIDTH - mapSize.width * SCALED_TILE) / 2 : 0;
      const offsetY = mapSize.height * SCALED_TILE < CANVAS_HEIGHT ? (CANVAS_HEIGHT - mapSize.height * SCALED_TILE) / 2 : 0;

      // Clear with appropriate background
      ctx.fillStyle = state.currentMap === 'overworld' ? '#1a1a2e' : '#0f172a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw tiles
      const startTileX = offsetX > 0 ? 0 : Math.floor(cameraX / SCALED_TILE);
      const startTileY = offsetY > 0 ? 0 : Math.floor(cameraY / SCALED_TILE);
      const endTileX = Math.min(startTileX + Math.ceil(CANVAS_WIDTH / SCALED_TILE) + 1, mapSize.width);
      const endTileY = Math.min(startTileY + Math.ceil(CANVAS_HEIGHT / SCALED_TILE) + 1, mapSize.height);

      for (let y = startTileY; y < endTileY; y++) {
        for (let x = startTileX; x < endTileX; x++) {
          const screenX = offsetX > 0 ? offsetX + x * SCALED_TILE : x * SCALED_TILE - cameraX;
          const screenY = offsetY > 0 ? offsetY + y * SCALED_TILE : y * SCALED_TILE - cameraY;
          drawTile(ctx, map[y][x], screenX, screenY, x, y);
        }
      }

      // Draw NPCs
      for (const npc of currentNPCs) {
        const npcScreenX = offsetX > 0 ? offsetX + npc.position.tileX * SCALED_TILE : npc.position.tileX * SCALED_TILE - cameraX;
        const npcScreenY = offsetY > 0 ? offsetY + npc.position.tileY * SCALED_TILE : npc.position.tileY * SCALED_TILE - cameraY;
        if (npcScreenX > -SCALED_TILE && npcScreenX < CANVAS_WIDTH && npcScreenY > -SCALED_TILE && npcScreenY < CANVAS_HEIGHT) {
          drawNPC(ctx, npc, npcScreenX, npcScreenY);
        }
      }

      // Draw collectibles (only in overworld)
      if (state.currentMap === 'overworld') {
        for (const collectible of state.collectibles) {
          if (!collectible.collected) {
            const collectScreenX = offsetX > 0 ? offsetX + collectible.position.tileX * SCALED_TILE : collectible.position.tileX * SCALED_TILE - cameraX;
            const collectScreenY = offsetY > 0 ? offsetY + collectible.position.tileY * SCALED_TILE : collectible.position.tileY * SCALED_TILE - cameraY;
            if (collectScreenX > -SCALED_TILE && collectScreenX < CANVAS_WIDTH && collectScreenY > -SCALED_TILE && collectScreenY < CANVAS_HEIGHT) {
              drawCollectible(ctx, collectible, collectScreenX, collectScreenY, frameCountRef.current);
            }
          }
        }
      }

      // Draw player
      const playerScreenX = offsetX > 0 ? offsetX + playerPos.pixelX : playerPos.pixelX - cameraX;
      const playerScreenY = offsetY > 0 ? offsetY + playerPos.pixelY : playerPos.pixelY - cameraY;
      drawPlayer(ctx, playerScreenX, playerScreenY, playerDirRef.current, isCurrentlyMoving);

      // Room label for interiors
      if (state.currentMap !== 'overworld') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(CANVAS_WIDTH / 2 - 80, 10, 160, 30);
        ctx.fillStyle = '#39ff14';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        const labels: Record<MapId, string> = { overworld: '', projects: '📁 PROJECTS GALLERY', skills: '⚡ SKILLS LAB', about: '🏠 ABOUT HOUSE' };
        ctx.fillText(labels[state.currentMap], CANVAS_WIDTH / 2, 30);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.gameState, state.currentMap, state.isTransitioning, state.playerPosition, state.playerDirection, state.collectibles, drawTile, drawPlayer, drawNPC, drawCollectible, getDirectionFromKeys, getCurrentMap, getCurrentMapSize, getCurrentNPCs, getCurrentExhibits, movePlayer, dispatch, checkDoorTransition, collectItem, unlockAchievement, startDialog]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-slate-700 rounded-lg shadow-2xl"
        style={{ imageRendering: 'pixelated' }}
      />
      {/* Transition overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500 rounded-lg"
        style={{ opacity: transitionOpacity }}
      />
    </div>
  );
};

export default PokemonCanvas;
