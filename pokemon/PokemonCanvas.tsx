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
const TILE_PIXEL_TREE = 16;
const TILE_PORTAL = 17;
const TILE_FENCE = 18;
// Big Oak Tree (2 wide x 2 tall)
const TILE_OAK_CANOPY_L = 19;  // Top-left canopy
const TILE_OAK_CANOPY_R = 20;  // Top-right canopy
const TILE_OAK_TRUNK_L = 21;   // Bottom-left (trunk left side)
const TILE_OAK_TRUNK_R = 22;   // Bottom-right (trunk right side)
// Tall Pine Tree (1 wide x 2 tall)
const TILE_PINE_TOP = 23;      // Top canopy
const TILE_PINE_BOTTOM = 24;   // Bottom trunk + lower canopy
// Bush (for boundaries)
const TILE_BUSH = 25;
// Water edge tiles for natural pond borders
const TILE_WATER_EDGE_T = 26;   // Top edge
const TILE_WATER_EDGE_B = 27;   // Bottom edge
const TILE_WATER_EDGE_L = 28;   // Left edge
const TILE_WATER_EDGE_R = 29;   // Right edge
const TILE_WATER_CORNER_TL = 30; // Top-left corner
const TILE_WATER_CORNER_TR = 31; // Top-right corner
const TILE_WATER_CORNER_BL = 32; // Bottom-left corner
const TILE_WATER_CORNER_BR = 33; // Bottom-right corner
const TILE_LILYPAD = 34;        // Lily pad on water
// Decorative plants
const TILE_RED_FLOWER = 35;     // Red flower with yellow center
const TILE_BUSH_BERRIES = 36;   // Bush with red berries
const TILE_WHITE_FLOWER = 37;   // White daisy flower
const TILE_GREEN_BUSH = 38;     // Simple green bush
// Building components - House style (cream walls, orange roof)
const TILE_ROOF_L = 39;         // Left roof slope
const TILE_ROOF_R = 40;         // Right roof slope
const TILE_ROOF_M = 41;         // Middle roof / peak
const TILE_WALL_CREAM = 42;     // Cream colored wall
const TILE_WINDOW = 43;         // Window with blue frame
const TILE_CHIMNEY = 44;        // Chimney on roof
const TILE_PORCH = 45;          // Wooden porch/deck
const TILE_FLOWER_BOX = 46;     // Window with flower box
// Building components - Brick style (red brick walls, blue roof)
const TILE_ROOF_BLUE_L = 47;    // Blue roof left
const TILE_ROOF_BLUE_R = 48;    // Blue roof right
const TILE_ROOF_BLUE_M = 49;    // Blue roof middle
const TILE_WALL_BRICK = 50;     // Red brick wall
const TILE_WINDOW_BRICK = 51;   // Window on brick
const TILE_DOOR_BRICK = 65;     // Door on brick building
const TILE_FLOWER_BOX_BRICK = 66; // Flower box on brick
// Building components - Stone style (gray stone, brown roof)
const TILE_ROOF_BROWN_L = 52;   // Brown roof left
const TILE_ROOF_BROWN_R = 53;   // Brown roof right
const TILE_ROOF_BROWN_M = 54;   // Brown roof middle
const TILE_WALL_STONE = 55;     // Stone wall
const TILE_WINDOW_STONE = 67;   // Window on stone
const TILE_DOOR_STONE = 68;     // Door on stone building
const TILE_FLOWER_BOX_STONE = 69; // Flower box on stone
// 2.5D Isometric house tiles (About building)
const TILE_ROOF_25D_PEAK = 56;      // Roof peak/ridge
const TILE_ROOF_25D_FRONT = 57;     // Front-facing roof slope
const TILE_ROOF_25D_SIDE = 58;      // Side roof (right side visible)
const TILE_ROOF_25D_FRONT_L = 59;   // Front roof left edge
const TILE_ROOF_25D_FRONT_R = 60;   // Front roof right edge (meets side)
const TILE_WALL_25D_FRONT = 61;     // Front wall (cream)
const TILE_WALL_25D_SIDE = 62;      // Side wall (darker, shows depth)
const TILE_WINDOW_25D = 63;         // Window on front (angled look)
const TILE_DOOR_25D = 64;           // Door on front (angled look)
const TILE_DOOR_L = 70;             // Left door of double door
const TILE_DOOR_R = 71;             // Right door of double door
// Interior tiles - About (Cozy home) - Note: TILE_BOOKSHELF(14) and TILE_DESK(15) already exist
const TILE_PLANT_POT = 72;          // Potted plant
const TILE_COUCH = 73;              // Cozy couch/sofa
const TILE_CARPET = 74;             // Patterned carpet
const TILE_LAMP = 75;               // Floor lamp
const TILE_PICTURE_FRAME = 76;      // Picture on wall
// Interior tiles - Projects (Tech lab)
const TILE_COMPUTER = 77;           // Computer workstation
const TILE_SERVER_RACK = 78;        // Server rack
const TILE_MONITOR_WALL = 79;       // Wall-mounted monitors
const TILE_LAB_FLOOR = 80;          // Lab floor tiles
const TILE_DESK_TECH = 81;          // Tech desk with equipment
const TILE_CABLE_FLOOR = 82;        // Floor with cable management
// Interior tiles - Skills (Pokemon Center)
const TILE_COUNTER = 83;            // Reception counter
const TILE_HEALING_MACHINE = 84;    // Pokemon healing machine
const TILE_PC_STATION = 85;         // PC storage system
const TILE_POKEBALL_DISPLAY = 86;   // Pokeball display case
const TILE_TILE_FLOOR = 87;         // Checkered tile floor
const TILE_BENCH = 88;              // Waiting bench
// About building specific tiles
const TILE_WALL_HOME = 89;          // Cozy home wall with wallpaper
const TILE_FLOOR_WOOD = 90;         // Hardwood floor
// Projects building specific tiles
const TILE_WALL_LAB = 91;           // Dark industrial lab wall
const TILE_FLOOR_METAL = 92;        // Metallic floor with grating
// Skills building specific tiles
const TILE_WALL_POKECENTER = 93;    // Pokemon Center red/white wall
// Themed exhibit tiles
const TILE_EXHIBIT_FRAME = 94;      // About: Picture frame display
const TILE_EXHIBIT_MONITOR = 95;    // Projects: Monitor/screen display
const TILE_EXHIBIT_ORB = 96;        // Skills: Glowing skill orb

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
  // Pixel art tree colors
  pixelTreeLeafDark: '#1a5c2e',
  pixelTreeLeafMid: '#2d8a4e',
  pixelTreeLeafLight: '#4ade80',
  pixelTreeLeafHighlight: '#86efac',
  pixelTreeTrunkDark: '#4a2512',
  pixelTreeTrunkMid: '#7c4a1a',
  pixelTreeTrunkLight: '#a66832',
  // Portal colors
  portalOuter: '#7c3aed',
  portalMid: '#a78bfa',
  portalInner: '#c4b5fd',
  portalCore: '#ede9fe',
  portalGlow: '#8b5cf6',
  // Pixel mode colors (Pokemon GBA style palette)
  // Grass - rich greens like the reference
  pixelGrass1: '#2d5a1d',  // darkest grass
  pixelGrass2: '#4a8c38',  // medium grass
  pixelGrass3: '#6db356',  // light grass
  pixelGrass4: '#98d977',  // highlight grass
  // Path - warm earth tones
  pixelPath1: '#8b6914',   // dark dirt
  pixelPath2: '#c4a043',   // medium dirt
  pixelPath3: '#e8c99b',   // light dirt/sand
  // Water - clear blue tones
  pixelWater1: '#1a5c8a',  // deep water
  pixelWater2: '#3498db',  // medium water
  pixelWater3: '#7ec8e3',  // light water/highlights
  pixelWater4: '#a8e6cf',  // lily pad green
  // Wall/Stone - gray tones
  pixelWall1: '#4a5568',   // dark stone
  pixelWall2: '#718096',   // medium stone
  pixelWall3: '#a0aec0',   // light stone
  // Building - warm wood and cream
  pixelBuilding1: '#5c3a21', // dark wood
  pixelBuilding2: '#8b5a2b', // medium wood
  pixelBuilding3: '#c4956a', // light wood
  pixelBuildingWall: '#f5deb3', // cream wall
  // Roof tiles
  pixelRoof1: '#8b4513',   // dark roof
  pixelRoof2: '#cd6839',   // medium roof
  pixelRoof3: '#e8a87c',   // light roof
  // Fence
  pixelFence1: '#5c4033',  // dark fence
  pixelFence2: '#8b6914',  // medium fence
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
  { id: 'p4', position: { tileX: 3, tileY: 7 }, title: 'AI Grocery Assistant', dialog: [
    { speaker: '🛒 AI Grocery Assistant', text: "Smart shopping list with AI recommendations", avatar: '🤖' },
    { speaker: '🛒 Tech', text: "Python, OpenAI API, NLP", avatar: '💻' },
  ]},
  { id: 'p5', position: { tileX: 7, tileY: 7 }, title: 'Assembly Tetris', dialog: [
    { speaker: '🧱 Assembly Tetris', text: "Tetris clone in < 2KB Assembly!", avatar: '🎮' },
    { speaker: '🧱 Tech', text: "Assembly, Low-level Optimization", avatar: '💻' },
  ]},
  { id: 'p6', position: { tileX: 11, tileY: 7 }, title: 'Travel Planner', dialog: [
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
    { id: 'nurse', name: 'Nurse', position: { tileX: 6, tileY: 4 }, direction: 'down', sprite: 'scientist', dialogs: [
      { speaker: 'Skill Nurse', text: "Welcome to the Skill Center!", avatar: '💗' },
      { speaker: 'Skill Nurse', text: "Check out the skill displays around the room!", avatar: '💗' },
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


  // Big Oak Tree positions (2x2 - define top-left corner)
  // Each oak tree occupies: (x,y), (x+1,y), (x,y+1), (x+1,y+1)
  // Avoid: buildings, paths, water
  const bigOakPositions = [
    // Left side (away from buildings)
    { x: 2, y: 2 },
    { x: 2, y: 10 },
    { x: 2, y: 18 },
    // Right side (away from timeline area)
    { x: 37, y: 10 },
    { x: 37, y: 18 },
    // Bottom corners (away from buildings)
    { x: 2, y: 27 },
    { x: 37, y: 27 },
    // Scattered middle (away from paths)
    { x: 14, y: 9 },
    { x: 24, y: 9 },
  ];

  // Tall Pine Tree positions (1x2 - define top position)
  // Each pine occupies: (x,y), (x,y+1)
  const tallPinePositions = [
    // Left side (between water and buildings)
    { x: 3, y: 9 },
    { x: 3, y: 24 },
    // Right side
    { x: 37, y: 3 },
    { x: 37, y: 24 },
    // Bottom area (between buildings)
    { x: 17, y: 25 },
    { x: 23, y: 25 },
  ];

  // Check what type of big tree tile this position is
  const getBigTreeTile = (x: number, y: number): number | null => {
    // Check oak trees (2x2)
    for (const oak of bigOakPositions) {
      if (x === oak.x && y === oak.y) return TILE_OAK_CANOPY_L;
      if (x === oak.x + 1 && y === oak.y) return TILE_OAK_CANOPY_R;
      if (x === oak.x && y === oak.y + 1) return TILE_OAK_TRUNK_L;
      if (x === oak.x + 1 && y === oak.y + 1) return TILE_OAK_TRUNK_R;
    }
    // Check pine trees (1x2)
    for (const pine of tallPinePositions) {
      if (x === pine.x && y === pine.y) return TILE_PINE_TOP;
      if (x === pine.x && y === pine.y + 1) return TILE_PINE_BOTTOM;
    }
    return null;
  };

  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      // Portal at north end of main road
      if (x === 20 && y === 5) {
        row.push(TILE_PORTAL);
      // Check for big trees (oak and pine)
      } else if (getBigTreeTile(x, y) !== null) {
        row.push(getBigTreeTile(x, y)!);
      } else if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
        row.push(TILE_BUSH);
      } else if (
        // Main vertical path (north-south) - the original cross shape
        (x >= 18 && x <= 22 && y >= 5 && y <= 23) ||
        // Main horizontal path (east-west)
        (y >= 14 && y <= 16 && x >= 6 && x <= 34) ||
        // Path to about building (top-left)
        (x >= 7 && x <= 10 && y >= 9 && y <= 14) ||
        // Path from main vertical to projects building porch (bottom connection)
        (y >= 22 && y <= 23 && x >= 8 && x <= 18) ||
        // Path from main vertical to skills building porch (bottom connection)
        (y >= 22 && y <= 23 && x >= 22 && x <= 32)
      ) {
        row.push(TILE_PATH);
      // ========== ABOUT BUILDING (Top-left, cream house style) ==========
      // Building spans x:5-12, y:3-9
      } else if (x >= 5 && x <= 12 && y >= 3 && y <= 9) {
        // Roof row (y=3)
        if (y === 3) {
          if (x === 5) row.push(TILE_ROOF_L);
          else if (x === 12) row.push(TILE_ROOF_R);
          else if (x === 10) row.push(TILE_CHIMNEY);
          else row.push(TILE_ROOF_M);
        }
        // Upper wall with windows (y=4-5)
        else if (y === 4 || y === 5) {
          if (x === 5 || x === 12) row.push(TILE_WALL_CREAM);
          else if (x === 7 || x === 10) row.push(TILE_WINDOW);
          else row.push(TILE_WALL_CREAM);
        }
        // Middle wall (y=6-7)
        else if (y === 6 || y === 7) {
          if (x === 5 || x === 12) row.push(TILE_WALL_CREAM);
          else if (x === 7) row.push(TILE_FLOWER_BOX);
          else if (x === 10) row.push(TILE_FLOWER_BOX);
          else row.push(TILE_WALL_CREAM);
        }
        // Door row (y=8)
        else if (y === 8) {
          if (x === 8) row.push(TILE_DOOR_L);
          else if (x === 9) row.push(TILE_DOOR_R);
          else if (x === 5 || x === 12) row.push(TILE_WALL_CREAM);
          else row.push(TILE_WALL_CREAM);
        }
        // Porch (y=9)
        else if (y === 9) {
          if (x >= 6 && x <= 11) row.push(TILE_PORCH);
          else row.push(TILE_GRASS);
        }
        else row.push(TILE_WALL_CREAM);
      // ========== MONUMENT AREA (Top-right) ==========
      } else if (x >= 27 && x <= 37 && y >= 3 && y <= 8) {
        if (y === 5 && (x === 29 || x === 32 || x === 35)) row.push(TILE_MONUMENT);
        else row.push(TILE_PATH);
      // ========== PROJECTS BUILDING (Bottom-left, brick style) ==========
      // Building spans x:7-15, y:18-22 (narrower to avoid pond)
      } else if (x >= 7 && x <= 15 && y >= 18 && y <= 22) {
        // Roof row (y=18)
        if (y === 18) {
          if (x === 7) row.push(TILE_ROOF_BLUE_L);
          else if (x === 15) row.push(TILE_ROOF_BLUE_R);
          else row.push(TILE_ROOF_BLUE_M);
        }
        // Windows row (y=19)
        else if (y === 19) {
          if (x === 7 || x === 15) row.push(TILE_WALL_BRICK);
          else if (x === 9 || x === 13) row.push(TILE_WINDOW_BRICK);
          else row.push(TILE_WALL_BRICK);
        }
        // Wall with flower boxes (y=20)
        else if (y === 20) {
          if (x === 7 || x === 15) row.push(TILE_WALL_BRICK);
          else if (x === 9 || x === 13) row.push(TILE_FLOWER_BOX_BRICK);
          else row.push(TILE_WALL_BRICK);
        }
        // Door row (y=21)
        else if (y === 21) {
          if (x === 11) row.push(TILE_DOOR_BRICK);
          else row.push(TILE_WALL_BRICK);
        }
        // Porch (y=22)
        else if (y === 22) {
          if (x >= 8 && x <= 14) row.push(TILE_PORCH);
          else row.push(TILE_GRASS);
        }
        else row.push(TILE_WALL_BRICK);
      // ========== SKILLS BUILDING (Bottom-right, stone style) ==========
      // Building spans x:25-33, y:18-22 (narrower to avoid pond)
      } else if (x >= 25 && x <= 33 && y >= 18 && y <= 22) {
        // Roof row (y=18)
        if (y === 18) {
          if (x === 25) row.push(TILE_ROOF_BROWN_L);
          else if (x === 33) row.push(TILE_ROOF_BROWN_R);
          else if (x === 31) row.push(TILE_CHIMNEY);
          else row.push(TILE_ROOF_BROWN_M);
        }
        // Windows row (y=19)
        else if (y === 19) {
          if (x === 25 || x === 33) row.push(TILE_WALL_STONE);
          else if (x === 27 || x === 31) row.push(TILE_WINDOW_STONE);
          else row.push(TILE_WALL_STONE);
        }
        // Wall with flower boxes (y=20)
        else if (y === 20) {
          if (x === 25 || x === 33) row.push(TILE_WALL_STONE);
          else if (x === 27 || x === 31) row.push(TILE_FLOWER_BOX_STONE);
          else row.push(TILE_WALL_STONE);
        }
        // Door row (y=21)
        else if (y === 21) {
          if (x === 29) row.push(TILE_DOOR_STONE);
          else row.push(TILE_WALL_STONE);
        }
        // Porch (y=22)
        else if (y === 22) {
          if (x >= 26 && x <= 32) row.push(TILE_PORCH);
          else row.push(TILE_GRASS);
        }
        else row.push(TILE_WALL_STONE);
      // Signs near buildings
      } else if (
        (x === 6 && y === 10) ||   // About building sign
        (x === 8 && y === 23) ||   // Projects building sign (on path to entrance)
        (x === 32 && y === 23)     // Skills building sign (on path to entrance)
      ) {
        row.push(TILE_SIGN);
      // Left pond with natural borders (x: 2-5, y: 11-19)
      } else if (x === 2 && y === 11) {
        row.push(TILE_WATER_CORNER_TL);
      } else if (x === 5 && y === 11) {
        row.push(TILE_WATER_CORNER_TR);
      } else if (x === 2 && y === 19) {
        row.push(TILE_WATER_CORNER_BL);
      } else if (x === 5 && y === 19) {
        row.push(TILE_WATER_CORNER_BR);
      } else if (y === 11 && x >= 3 && x <= 4) {
        row.push(TILE_WATER_EDGE_T);
      } else if (y === 19 && x >= 3 && x <= 4) {
        row.push(TILE_WATER_EDGE_B);
      } else if (x === 2 && y >= 12 && y <= 18) {
        row.push(TILE_WATER_EDGE_L);
      } else if (x === 5 && y >= 12 && y <= 18) {
        row.push(TILE_WATER_EDGE_R);
      } else if (x >= 3 && x <= 4 && y >= 12 && y <= 18) {
        // Inner water - some with lily pads
        if ((x === 3 && y === 14) || (x === 4 && y === 17)) {
          row.push(TILE_LILYPAD);
        } else {
          row.push(TILE_WATER);
        }
      // Right pond with natural borders (x: 35-38, y: 11-19)
      } else if (x === 35 && y === 11) {
        row.push(TILE_WATER_CORNER_TL);
      } else if (x === 38 && y === 11) {
        row.push(TILE_WATER_CORNER_TR);
      } else if (x === 35 && y === 19) {
        row.push(TILE_WATER_CORNER_BL);
      } else if (x === 38 && y === 19) {
        row.push(TILE_WATER_CORNER_BR);
      } else if (y === 11 && x >= 36 && x <= 37) {
        row.push(TILE_WATER_EDGE_T);
      } else if (y === 19 && x >= 36 && x <= 37) {
        row.push(TILE_WATER_EDGE_B);
      } else if (x === 35 && y >= 12 && y <= 18) {
        row.push(TILE_WATER_EDGE_L);
      } else if (x === 38 && y >= 12 && y <= 18) {
        row.push(TILE_WATER_EDGE_R);
      } else if (x >= 36 && x <= 37 && y >= 12 && y <= 18) {
        // Inner water - some with lily pads
        if ((x === 36 && y === 15) || (x === 37 && y === 13)) {
          row.push(TILE_LILYPAD);
        } else {
          row.push(TILE_WATER);
        }
      // Berry bushes - near buildings
      } else if (
        // Near about building (x:5-12, y:3-9)
        (x === 13 && y === 5) || (x === 13 && y === 7) ||
        (x === 4 && y === 5) || (x === 4 && y === 7) ||
        // Near projects building (x:7-15, y:18-22)
        (x === 6 && y === 19) || (x === 16 && y === 19) ||
        (x === 6 && y === 21) || (x === 16 && y === 21) ||
        // Near skills building (x:25-33, y:18-22)
        (x === 24 && y === 19) || (x === 34 && y === 19) ||
        (x === 24 && y === 21) || (x === 34 && y === 21) ||
        // Along boundary edges
        (x === 2 && y === 5) || (x === 2 && y === 8)
      ) {
        row.push(TILE_BUSH_BERRIES);
      // Green bushes - scattered around
      } else if (
        // Near paths (avoid path tiles)
        (x === 17 && y === 11) || (x === 23 && y === 11) ||
        // Near monument area
        (x === 38 && y === 5) || (x === 38 && y === 7) ||
        // Near about building
        (x === 13 && y === 10) || (x === 4 && y === 10) ||
        // Near projects/skills buildings (above them)
        (x === 6 && y === 17) || (x === 16 && y === 17) ||
        (x === 24 && y === 17) || (x === 34 && y === 17) ||
        // Scattered in grass (below buildings)
        (x === 14 && y === 11) || (x === 26 && y === 11) ||
        (x === 10 && y === 25) || (x === 30 && y === 25) ||
        (x === 14 && y === 26) || (x === 26 && y === 26)
      ) {
        row.push(TILE_GREEN_BUSH);
      // Red flowers - near paths and ponds
      } else if (
        // Near main horizontal path
        (x === 17 && y === 13) || (x === 23 && y === 13) ||
        (x === 17 && y === 17) || (x === 23 && y === 17) ||
        // Near monument area
        (x === 26 && y === 5) || (x === 26 && y === 7) ||
        // Near ponds
        (x === 6 && y === 12) || (x === 6 && y === 18) ||
        (x === 34 && y === 12) || (x === 34 && y === 18) ||
        // Scattered accents
        (x === 15 && y === 12) || (x === 25 && y === 12) ||
        (x === 3 && y === 10) || (x === 37 && y === 10)
      ) {
        row.push(TILE_RED_FLOWER);
      // White flowers - scattered for variety
      } else if (
        // Near paths
        (x === 16 && y === 13) || (x === 24 && y === 13) ||
        (x === 16 && y === 17) || (x === 24 && y === 17) ||
        // Near about building
        (x === 14 && y === 5) || (x === 14 && y === 8) ||
        // Near ponds
        (x === 7 && y === 10) || (x === 7 && y === 20) ||
        (x === 33 && y === 10) || (x === 33 && y === 20) ||
        // Scattered in grass areas (avoid building areas)
        (x === 15 && y === 18) || (x === 25 && y === 18) ||
        (x === 17 && y === 19) || (x === 23 && y === 19) ||
        // Near boundary
        (x === 3 && y === 20) || (x === 37 && y === 20)
      ) {
        row.push(TILE_WHITE_FLOWER);
      } else {
        row.push(TILE_GRASS);
      }
    }
    map.push(row);
  }
  return map;
}

// ========== ABOUT INTERIOR - Cozy Home ==========
function generateAboutInterior(exhibits: Exhibit[]): number[][] {
  const map: number[][] = [];
  for (let y = 0; y < INTERIOR_HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < INTERIOR_WIDTH; x++) {
      // Top wall only (with decorations)
      if (y === 0) {
        if (x === 3 || x === 11) row.push(TILE_PICTURE_FRAME);
        else if (x === 7) row.push(TILE_PICTURE_FRAME);
        else row.push(TILE_WALL_HOME);
      }
      // Exit mat at bottom center
      else if (y === INTERIOR_HEIGHT - 1 && x >= 6 && x <= 8) {
        row.push(TILE_EXIT_MAT);
      }
      // Bookshelves along top (y=1)
      else if (y === 1 && (x === 2 || x === 3 || x === 11 || x === 12)) {
        row.push(TILE_BOOKSHELF);
      }
      // Desk area (left side)
      else if (y === 2 && x === 2) {
        row.push(TILE_DESK);
      }
      // Plants in corners
      else if ((y === 1 && x === 5) || (y === 1 && x === 9)) {
        row.push(TILE_PLANT_POT);
      }
      // Couch (center-right area)
      else if (y === 5 && x >= 9 && x <= 11) {
        row.push(TILE_COUCH);
      }
      // Floor lamp
      else if ((y === 5 && x === 12) || (y === 5 && x === 2)) {
        row.push(TILE_LAMP);
      }
      // Exhibits (picture frames for About)
      else if (exhibits.some(e => e.position.tileX === x && e.position.tileY === y)) {
        row.push(TILE_EXHIBIT_FRAME);
      }
      // Large carpet in center
      else if (x >= 4 && x <= 10 && y >= 6 && y <= 9) {
        row.push(TILE_CARPET);
      }
      // Rug near entrance
      else if (x >= 5 && x <= 9 && y === 10) {
        row.push(TILE_RUG);
      }
      // Wooden floor everywhere else
      else {
        row.push(TILE_FLOOR_WOOD);
      }
    }
    map.push(row);
  }
  return map;
}

// ========== PROJECTS INTERIOR - Tech Lab ==========
function generateProjectsInterior(exhibits: Exhibit[]): number[][] {
  const map: number[][] = [];
  for (let y = 0; y < INTERIOR_HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < INTERIOR_WIDTH; x++) {
      // Top wall only (with monitors)
      if (y === 0) {
        if (x >= 4 && x <= 10) row.push(TILE_MONITOR_WALL);
        else row.push(TILE_WALL_LAB);
      }
      // Exit mat at bottom center
      else if (y === INTERIOR_HEIGHT - 1 && x >= 6 && x <= 8) {
        row.push(TILE_EXIT_MAT);
      }
      // Server racks (left side, y=1-4)
      else if (x === 1 && y >= 1 && y <= 4) {
        row.push(TILE_SERVER_RACK);
      }
      // Server racks (right side)
      else if (x === 13 && y >= 1 && y <= 4) {
        row.push(TILE_SERVER_RACK);
      }
      // Project displays (monitor screens)
      else if (exhibits.some(e => e.position.tileX === x && e.position.tileY === y)) {
        row.push(TILE_EXHIBIT_MONITOR);
      }
      // Tech desks (under computers, y=4)
      else if (y === 4 && (x === 3 || x === 7 || x === 11)) {
        row.push(TILE_DESK_TECH);
      }
      // Cable management floor near servers
      else if ((x === 2 && y >= 1 && y <= 4) || (x === 12 && y >= 1 && y <= 4)) {
        row.push(TILE_CABLE_FLOOR);
      }
      // Metallic floor everywhere else
      else {
        row.push(TILE_FLOOR_METAL);
      }
    }
    map.push(row);
  }
  return map;
}

// ========== SKILLS INTERIOR - Pokemon Center ==========
function generateSkillsInterior(exhibits: Exhibit[]): number[][] {
  const map: number[][] = [];
  for (let y = 0; y < INTERIOR_HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < INTERIOR_WIDTH; x++) {
      // Top wall only
      if (y === 0) {
        row.push(TILE_WALL_POKECENTER);
      }
      // Exit mat at bottom center
      else if (y === INTERIOR_HEIGHT - 1 && x >= 6 && x <= 8) {
        row.push(TILE_EXIT_MAT);
      }
      // Reception counter (center top)
      else if (y === 2 && x >= 5 && x <= 9) {
        row.push(TILE_COUNTER);
      }
      // Healing machine (behind counter)
      else if (y === 1 && x === 7) {
        row.push(TILE_HEALING_MACHINE);
      }
      // PC stations (left side)
      else if (y === 1 && (x === 2 || x === 3)) {
        row.push(TILE_PC_STATION);
      }
      // Pokeball display (right side)
      else if (y === 1 && (x === 11 || x === 12)) {
        row.push(TILE_POKEBALL_DISPLAY);
      }
      // Waiting benches (sides)
      else if (y === 6 && (x === 2 || x === 12)) {
        row.push(TILE_BENCH);
      }
      else if (y === 8 && (x === 2 || x === 12)) {
        row.push(TILE_BENCH);
      }
      // Skill orbs (glowing skill displays)
      else if (exhibits.some(e => e.position.tileX === x && e.position.tileY === y)) {
        row.push(TILE_EXHIBIT_ORB);
      }
      // Checkered tile floor everywhere else
      else {
        row.push(TILE_TILE_FLOOR);
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
         tile === TILE_DOOR || tile === TILE_DOOR_L || tile === TILE_DOOR_R || tile === TILE_DOOR_25D || tile === TILE_DOOR_BRICK || tile === TILE_DOOR_STONE || tile === TILE_PORTAL ||
         // Flowers and small bushes are walkable
         tile === TILE_RED_FLOWER || tile === TILE_WHITE_FLOWER || tile === TILE_GREEN_BUSH ||
         // Tree canopy tiles are walkable (player walks under them)
         tile === TILE_OAK_CANOPY_L || tile === TILE_OAK_CANOPY_R || tile === TILE_PINE_TOP ||
         // Interior floor tiles
         tile === TILE_CARPET || tile === TILE_LAB_FLOOR || tile === TILE_TILE_FLOOR || tile === TILE_CABLE_FLOOR ||
         tile === TILE_FLOOR_WOOD || tile === TILE_FLOOR_METAL;
}

// Check if a tile is a plant that can be disturbed when walked over
function isDisturbablePlant(tile: number): boolean {
  return tile === TILE_FLOWER || tile === TILE_RED_FLOWER ||
         tile === TILE_WHITE_FLOWER || tile === TILE_GREEN_BUSH;
}

// Check if a tile is a tree canopy (for layering - render on top of player)
function isTreeCanopy(tile: number): boolean {
  return tile === TILE_OAK_CANOPY_L || tile === TILE_OAK_CANOPY_R || tile === TILE_PINE_TOP;
}

// ============ MAIN COMPONENT ============

export const PokemonCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, movePlayer, dispatch, startDialog, enterBuilding, exitBuilding, collectItem, unlockAchievement, requestBattle, togglePixelMode, projects, skills } = usePokemonGame();
  const hasMovedRef = useRef(false);

  // Generate maps
  const overworldMapRef = useRef<number[][]>(generateOverworldMap());
  const projectsMapRef = useRef<number[][]>(generateProjectsInterior(PROJECTS_EXHIBITS));
  const skillsMapRef = useRef<number[][]>(generateSkillsInterior(SKILLS_EXHIBITS));
  const aboutMapRef = useRef<number[][]>(generateAboutInterior(ABOUT_EXHIBITS));

  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number>();
  const targetPositionRef = useRef<Position | null>(null);
  const walkFrameRef = useRef(0);
  const frameCountRef = useRef(0);

  // Track disturbed plants for shake/leaf effects
  // Key: "x,y", Value: { startFrame, leaves: [{x, y, vx, vy, life}] }
  const disturbedPlantsRef = useRef<Map<string, {
    startFrame: number;
    leaves: Array<{ x: number; y: number; vx: number; vy: number; life: number; size: number }>;
  }>>(new Map());
  const lastPlayerTileRef = useRef<string>('');

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

    if (state.currentMap === 'overworld' && (tile === TILE_DOOR || tile === TILE_DOOR_L || tile === TILE_DOOR_R || tile === TILE_DOOR_25D || tile === TILE_DOOR_BRICK || tile === TILE_DOOR_STONE)) {
      SoundManager.playDoorEnter();
      // Check which building (doors at bottom of buildings)
      if (tileX >= 10 && tileX <= 12 && tileY === 21) {
        // Projects building - bottom-left
        enterBuilding('projects', { tileX: 7, tileY: 10, pixelX: 7 * SCALED_TILE, pixelY: 10 * SCALED_TILE });
      } else if (tileX >= 28 && tileX <= 30 && tileY === 21) {
        // Skills building - bottom-right
        enterBuilding('skills', { tileX: 7, tileY: 10, pixelX: 7 * SCALED_TILE, pixelY: 10 * SCALED_TILE });
      } else if (tileX >= 8 && tileX <= 9 && tileY === 8) {
        // About building - top-left
        enterBuilding('about', { tileX: 7, tileY: 10, pixelX: 7 * SCALED_TILE, pixelY: 10 * SCALED_TILE });
      }
    } else if (state.currentMap !== 'overworld' && tile === TILE_EXIT_MAT) {
      SoundManager.playDoorExit();
      exitBuilding();
    }
  }, [state.currentMap, getCurrentMap, enterBuilding, exitBuilding]);

  // Check for portal transition (toggle pixel mode)
  const checkPortalTransition = useCallback((tileX: number, tileY: number) => {
    const map = getCurrentMap();
    const tile = map[tileY]?.[tileX];

    if (tile === TILE_PORTAL) {
      SoundManager.playCollect(); // Use collect sound for portal
      togglePixelMode();
      startDialog([
        {
          speaker: state.isPixelMode ? '🌀 Portal' : '🎮 Portal',
          text: state.isPixelMode
            ? "Reality shifts... The world returns to normal!"
            : "Reality shifts... Welcome to the 8-bit dimension!",
          avatar: '🌀'
        }
      ]);
    }
  }, [getCurrentMap, togglePixelMode, startDialog, state.isPixelMode]);

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
  const drawTile = useCallback((ctx: CanvasRenderingContext2D, tile: number, screenX: number, screenY: number, tileX: number, tileY: number, map?: number[][], shakeOffset: number = 0) => {
    const x = screenX + shakeOffset;
    const y = screenY;
    const size = SCALED_TILE;

    switch (tile) {
      case TILE_GRASS:
        if (state.isPixelMode) {
          // Reference-style grass - uniform bright green, some with tufts
          const px = 3;

          // All grass uses same bright base color
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);

          // Grass blade tufts - only on ~20% of tiles
          const hasTuft = (tileX * 13 + tileY * 17) % 10 < 2;
          if (hasTuft) {
            const tuftX = ((tileX * 17 + tileY * 13) % 8) * px + px * 4;
            const tuftY = ((tileY * 19 + tileX * 11) % 6) * px + px * 6;

            // Dark green blade color
            ctx.fillStyle = '#3a7a30';

            // Draw 3 grass blades
            // Left blade (angled left)
            ctx.fillRect(x + tuftX - px, y + tuftY - px * 3, px, px);
            ctx.fillRect(x + tuftX, y + tuftY - px * 2, px, px * 2);

            // Middle blade (tallest)
            ctx.fillRect(x + tuftX + px, y + tuftY - px * 4, px, px * 4);

            // Right blade (angled right)
            ctx.fillRect(x + tuftX + px * 2, y + tuftY - px * 2, px, px * 2);
            ctx.fillRect(x + tuftX + px * 3, y + tuftY - px * 3, px, px);

            // Lighter highlight on middle blade
            ctx.fillStyle = '#4a9a40';
            ctx.fillRect(x + tuftX + px, y + tuftY - px * 2, px, px);
          }
        } else {
          ctx.fillStyle = COLORS.grass;
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = COLORS.grassDark;
          const seed = (tileX * 7 + tileY * 13) % 5;
          for (let i = 0; i < seed; i++) {
            ctx.fillRect(x + ((tileX * 17 + i * 23) % size), y + ((tileY * 19 + i * 29) % size), 2, 4);
          }
        }
        break;
      case TILE_PATH:
        if (state.isPixelMode) {
          // Reference-style dirt path with darker border edges
          const px = 3;
          const borderWidth = px * 2;  // 6 pixel border

          // Helper to check if adjacent tile is a path
          const isPathTile = (tx: number, ty: number): boolean => {
            if (!map || ty < 0 || ty >= map.length || tx < 0 || tx >= map[0].length) return false;
            const t = map[ty][tx];
            return t === TILE_PATH || t === TILE_DOOR || t === TILE_PORTAL;
          };

          // Check adjacent tiles for edge detection
          const hasPathAbove = isPathTile(tileX, tileY - 1);
          const hasPathBelow = isPathTile(tileX, tileY + 1);
          const hasPathLeft = isPathTile(tileX - 1, tileY);
          const hasPathRight = isPathTile(tileX + 1, tileY);

          // Base path color (warm sandy tan like reference)
          ctx.fillStyle = '#d4a855';
          ctx.fillRect(x, y, size, size);

          // Grass-colored edge where path meets grass (grass overlaps onto path)
          ctx.fillStyle = '#5eb040';  // Darker grass edge color
          const edgeWidth = px;  // Thin edge

          // Draw grass edge on sides where there's no adjacent path
          if (!hasPathAbove) {
            ctx.fillRect(x, y, size, edgeWidth);
          }
          if (!hasPathBelow) {
            ctx.fillRect(x, y + size - edgeWidth, size, edgeWidth);
          }
          if (!hasPathLeft) {
            ctx.fillRect(x, y, edgeWidth, size);
          }
          if (!hasPathRight) {
            ctx.fillRect(x + size - edgeWidth, y, edgeWidth, size);
          }

          // Darker corner where two grass edges meet
          ctx.fillStyle = '#4a9038';
          if (!hasPathAbove && !hasPathLeft) {
            ctx.fillRect(x, y, edgeWidth, edgeWidth);
          }
          if (!hasPathAbove && !hasPathRight) {
            ctx.fillRect(x + size - edgeWidth, y, edgeWidth, edgeWidth);
          }
          if (!hasPathBelow && !hasPathLeft) {
            ctx.fillRect(x, y + size - edgeWidth, edgeWidth, edgeWidth);
          }
          if (!hasPathBelow && !hasPathRight) {
            ctx.fillRect(x + size - edgeWidth, y + size - edgeWidth, edgeWidth, edgeWidth);
          }

          // Subtle path texture - small spots
          ctx.fillStyle = '#c49845';
          for (let py = px * 2; py < size - px * 2; py += px * 4) {
            for (let px2 = px * 2; px2 < size - px * 2; px2 += px * 4) {
              const hash = (tileX * 13 + tileY * 17 + px2 + py * 5) % 9;
              if (hash === 0) {
                ctx.fillRect(x + px2, y + py, px, px);
              }
            }
          }

          // Light sand highlights
          ctx.fillStyle = '#e8d088';
          for (let py = px * 2; py < size - px * 2; py += px * 5) {
            for (let px2 = px * 2; px2 < size - px * 2; px2 += px * 5) {
              const hash = (tileX * 19 + tileY * 23 + px2 + py * 7) % 11;
              if (hash < 2) {
                ctx.fillRect(x + px2, y + py, px, px);
              }
            }
          }
        } else {
          ctx.fillStyle = COLORS.path;
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = COLORS.pathDark;
          ctx.fillRect(x + 4, y + 4, 6, 6);
          ctx.fillRect(x + size - 12, y + size - 12, 6, 6);
        }
        break;
      case TILE_WATER:
        if (state.isPixelMode) {
          // Clean blue water - only some tiles have wave texture
          const px = 3;

          // Base water color - clean blue
          ctx.fillStyle = '#4a90d9';
          ctx.fillRect(x, y, size, size);

          // Only add wave marks on ~40% of tiles for variety
          const hasWaves = ((tileX * 7 + tileY * 11) % 10) < 4;
          if (hasWaves) {
            const waveTime = frameCountRef.current * 0.04;
            // Subtle dark wave lines
            ctx.fillStyle = '#3a7fc9';
            const waveY1 = 12 + Math.floor(Math.sin(waveTime + tileX) * 2) * px;
            const waveY2 = 30 + Math.floor(Math.sin(waveTime + tileX + 2) * 2) * px;
            ctx.fillRect(x + 6, y + waveY1, px * 4, px);
            ctx.fillRect(x + 24, y + waveY2, px * 4, px);

            // Light highlight
            ctx.fillStyle = '#6ab0f9';
            ctx.fillRect(x + 9, y + waveY1 - px, px * 2, px);
            ctx.fillRect(x + 27, y + waveY2 - px, px * 2, px);
          }
        } else {
          ctx.fillStyle = COLORS.water;
          ctx.fillRect(x, y, size, size);
        }
        break;

      // Water edge tiles - grass transitioning to water
      case TILE_WATER_EDGE_T:
      case TILE_WATER_EDGE_B:
      case TILE_WATER_EDGE_L:
      case TILE_WATER_EDGE_R:
      case TILE_WATER_CORNER_TL:
      case TILE_WATER_CORNER_TR:
      case TILE_WATER_CORNER_BL:
      case TILE_WATER_CORNER_BR:
        if (state.isPixelMode) {
          const px = 3;
          // Draw water base
          ctx.fillStyle = '#4a90d9';
          ctx.fillRect(x, y, size, size);

          // Draw grass border based on edge type
          ctx.fillStyle = '#7ec850';
          const edgeSize = px * 4; // 12px border

          if (tile === TILE_WATER_EDGE_T) {
            ctx.fillRect(x, y, size, edgeSize);
            // Grass texture dots
            ctx.fillStyle = '#6ab840';
            ctx.fillRect(x + 6, y + 3, px, px);
            ctx.fillRect(x + 24, y + 6, px, px);
            ctx.fillRect(x + 36, y + 3, px, px);
          } else if (tile === TILE_WATER_EDGE_B) {
            ctx.fillRect(x, y + size - edgeSize, size, edgeSize);
            ctx.fillStyle = '#6ab840';
            ctx.fillRect(x + 12, y + size - 9, px, px);
            ctx.fillRect(x + 30, y + size - 6, px, px);
          } else if (tile === TILE_WATER_EDGE_L) {
            ctx.fillRect(x, y, edgeSize, size);
            ctx.fillStyle = '#6ab840';
            ctx.fillRect(x + 3, y + 12, px, px);
            ctx.fillRect(x + 6, y + 30, px, px);
          } else if (tile === TILE_WATER_EDGE_R) {
            ctx.fillRect(x + size - edgeSize, y, edgeSize, size);
            ctx.fillStyle = '#6ab840';
            ctx.fillRect(x + size - 9, y + 18, px, px);
            ctx.fillRect(x + size - 6, y + 36, px, px);
          } else if (tile === TILE_WATER_CORNER_TL) {
            ctx.fillRect(x, y, size, edgeSize);
            ctx.fillRect(x, y, edgeSize, size);
            // Rounded corner effect
            ctx.fillRect(x + edgeSize, y + edgeSize, px * 2, px * 2);
          } else if (tile === TILE_WATER_CORNER_TR) {
            ctx.fillRect(x, y, size, edgeSize);
            ctx.fillRect(x + size - edgeSize, y, edgeSize, size);
            ctx.fillRect(x + size - edgeSize - px * 2, y + edgeSize, px * 2, px * 2);
          } else if (tile === TILE_WATER_CORNER_BL) {
            ctx.fillRect(x, y + size - edgeSize, size, edgeSize);
            ctx.fillRect(x, y, edgeSize, size);
            ctx.fillRect(x + edgeSize, y + size - edgeSize - px * 2, px * 2, px * 2);
          } else if (tile === TILE_WATER_CORNER_BR) {
            ctx.fillRect(x, y + size - edgeSize, size, edgeSize);
            ctx.fillRect(x + size - edgeSize, y, edgeSize, size);
            ctx.fillRect(x + size - edgeSize - px * 2, y + size - edgeSize - px * 2, px * 2, px * 2);
          }
        } else {
          ctx.fillStyle = COLORS.water;
          ctx.fillRect(x, y, size, size);
        }
        break;

      // Lily pad tile
      case TILE_LILYPAD:
        if (state.isPixelMode) {
          const px = 3;
          // Water base
          ctx.fillStyle = '#4a90d9';
          ctx.fillRect(x, y, size, size);

          // Lily pad - round shape
          ctx.fillStyle = '#2d8a4e';
          // Main circular pad
          ctx.fillRect(x + 12, y + 15, px * 6, px * 5);
          ctx.fillRect(x + 9, y + 18, px * 2, px * 3);
          ctx.fillRect(x + 30, y + 18, px * 2, px * 3);
          ctx.fillRect(x + 15, y + 12, px * 4, px);
          ctx.fillRect(x + 15, y + 30, px * 4, px);

          // Lily pad notch (V-shape cut)
          ctx.fillStyle = '#4a90d9';
          ctx.fillRect(x + 21, y + 12, px, px * 3);

          // Highlight
          ctx.fillStyle = '#3da85e';
          ctx.fillRect(x + 15, y + 18, px * 2, px * 2);
        } else {
          ctx.fillStyle = COLORS.water;
          ctx.fillRect(x, y, size, size);
        }
        break;

      // Red flower with yellow center
      case TILE_RED_FLOWER:
        if (state.isPixelMode) {
          const px = 3;
          // Grass background
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);

          // Flower petals (red)
          ctx.fillStyle = '#e53935';
          // Top petal
          ctx.fillRect(x + 18, y + 12, px * 4, px * 3);
          // Bottom petal
          ctx.fillRect(x + 18, y + 27, px * 4, px * 3);
          // Left petal
          ctx.fillRect(x + 9, y + 18, px * 3, px * 4);
          // Right petal
          ctx.fillRect(x + 30, y + 18, px * 3, px * 4);

          // Yellow center
          ctx.fillStyle = '#fdd835';
          ctx.fillRect(x + 18, y + 18, px * 4, px * 4);

          // Center highlight
          ctx.fillStyle = '#fff59d';
          ctx.fillRect(x + 21, y + 21, px, px);

          // Green stem
          ctx.fillStyle = '#388e3c';
          ctx.fillRect(x + 21, y + 33, px * 2, px * 5);
          // Leaves
          ctx.fillRect(x + 15, y + 36, px * 2, px * 2);
          ctx.fillRect(x + 27, y + 39, px * 2, px * 2);
        } else {
          ctx.fillStyle = COLORS.grass;
          ctx.fillRect(x, y, size, size);
        }
        break;

      // Bush with red berries
      case TILE_BUSH_BERRIES:
        if (state.isPixelMode) {
          const px = 3;
          // Grass background
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);

          // Bush body (dark green)
          ctx.fillStyle = '#2d6a30';
          ctx.fillRect(x + 6, y + 15, px * 10, px * 8);
          ctx.fillRect(x + 9, y + 12, px * 8, px);
          ctx.fillRect(x + 9, y + 39, px * 8, px);

          // Bush highlights (lighter green)
          ctx.fillStyle = '#3d8a40';
          ctx.fillRect(x + 9, y + 18, px * 3, px * 3);
          ctx.fillRect(x + 21, y + 24, px * 3, px * 3);
          ctx.fillRect(x + 12, y + 30, px * 2, px * 2);

          // Red berries
          ctx.fillStyle = '#e53935';
          ctx.fillRect(x + 12, y + 18, px * 2, px * 2);
          ctx.fillRect(x + 24, y + 21, px * 2, px * 2);
          ctx.fillRect(x + 18, y + 27, px * 2, px * 2);
          ctx.fillRect(x + 9, y + 30, px * 2, px * 2);
          ctx.fillRect(x + 27, y + 33, px * 2, px * 2);

          // Berry highlights
          ctx.fillStyle = '#ff7043';
          ctx.fillRect(x + 12, y + 18, px, px);
          ctx.fillRect(x + 24, y + 21, px, px);
          ctx.fillRect(x + 18, y + 27, px, px);
        } else {
          ctx.fillStyle = COLORS.grass;
          ctx.fillRect(x, y, size, size);
        }
        break;

      // White daisy flower
      case TILE_WHITE_FLOWER:
        if (state.isPixelMode) {
          const px = 3;
          // Grass background
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);

          // White petals
          ctx.fillStyle = '#ffffff';
          // Top petal
          ctx.fillRect(x + 18, y + 9, px * 4, px * 4);
          // Bottom petal
          ctx.fillRect(x + 18, y + 27, px * 4, px * 4);
          // Left petal
          ctx.fillRect(x + 6, y + 18, px * 4, px * 4);
          // Right petal
          ctx.fillRect(x + 30, y + 18, px * 4, px * 4);
          // Diagonal petals
          ctx.fillRect(x + 9, y + 12, px * 3, px * 3);
          ctx.fillRect(x + 30, y + 12, px * 3, px * 3);
          ctx.fillRect(x + 9, y + 27, px * 3, px * 3);
          ctx.fillRect(x + 30, y + 27, px * 3, px * 3);

          // Petal shadows
          ctx.fillStyle = '#e0e0e0';
          ctx.fillRect(x + 21, y + 12, px, px * 2);
          ctx.fillRect(x + 9, y + 21, px * 2, px);

          // Yellow center
          ctx.fillStyle = '#fdd835';
          ctx.fillRect(x + 15, y + 18, px * 5, px * 5);

          // Center highlight
          ctx.fillStyle = '#ffeb3b';
          ctx.fillRect(x + 18, y + 21, px * 2, px * 2);

          // Green stem
          ctx.fillStyle = '#388e3c';
          ctx.fillRect(x + 21, y + 36, px * 2, px * 4);
          // Leaf
          ctx.fillRect(x + 15, y + 39, px * 2, px * 2);
        } else {
          ctx.fillStyle = COLORS.grass;
          ctx.fillRect(x, y, size, size);
        }
        break;

      // Simple green bush (no berries)
      case TILE_GREEN_BUSH:
        if (state.isPixelMode) {
          const px = 3;
          // Grass background
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);

          // Bush body - round shape (dark green)
          ctx.fillStyle = '#2d6a30';
          ctx.fillRect(x + 9, y + 12, px * 8, px * 8);
          ctx.fillRect(x + 6, y + 15, px * 2, px * 5);
          ctx.fillRect(x + 33, y + 15, px * 2, px * 5);
          ctx.fillRect(x + 12, y + 9, px * 5, px);
          ctx.fillRect(x + 12, y + 36, px * 5, px);

          // Bush highlights (lighter green layers)
          ctx.fillStyle = '#3d8a40';
          ctx.fillRect(x + 12, y + 15, px * 4, px * 4);
          ctx.fillRect(x + 21, y + 21, px * 3, px * 3);

          // Light highlights
          ctx.fillStyle = '#4caf50';
          ctx.fillRect(x + 15, y + 18, px * 2, px * 2);
          ctx.fillRect(x + 24, y + 24, px, px);

          // Shadow underneath
          ctx.fillStyle = '#1b5e20';
          ctx.fillRect(x + 12, y + 33, px * 5, px);
        } else {
          ctx.fillStyle = COLORS.grass;
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== ORANGE ROOF TILES (House style - 3D look) ==========
      case TILE_ROOF_L:
      case TILE_ROOF_R:
      case TILE_ROOF_M:
        if (state.isPixelMode) {
          const px = 3;
          // Sky/transparent background
          ctx.fillStyle = '#7ec850'; // grass underneath
          ctx.fillRect(x, y, size, size);

          // 3D layered roof shingles - each row overlaps the next
          const roofColors = {
            dark: '#a63d15',    // darkest shadow
            mid: '#c4501f',     // mid tone
            main: '#d4652a',    // main orange
            light: '#e8783d',   // highlight
            bright: '#f59860',  // brightest highlight
          };

          if (tile === TILE_ROOF_L) {
            // Left slope with 3D depth
            for (let row = 0; row < 5; row++) {
              const startX = (4 - row) * px * 2.5;
              const rowY = y + row * px * 3;
              const rowWidth = size - startX + px * 2; // slight overhang

              // Shadow/depth at bottom of each shingle row
              ctx.fillStyle = roofColors.dark;
              ctx.fillRect(x + startX - px, rowY + px * 2, rowWidth, px);

              // Main shingle body
              ctx.fillStyle = roofColors.main;
              ctx.fillRect(x + startX - px, rowY, rowWidth, px * 2);

              // Highlight at top of shingle
              ctx.fillStyle = roofColors.light;
              ctx.fillRect(x + startX, rowY, rowWidth - px * 2, px);

              // Individual shingle separations
              ctx.fillStyle = roofColors.mid;
              for (let s = 0; s < 6; s++) {
                ctx.fillRect(x + startX + s * px * 3, rowY, px, px * 2);
              }
            }
            // Left edge trim
            ctx.fillStyle = roofColors.dark;
            for (let row = 0; row < 5; row++) {
              const startX = (4 - row) * px * 2.5;
              ctx.fillRect(x + startX - px * 2, y + row * px * 3, px * 2, px * 3);
            }
          } else if (tile === TILE_ROOF_R) {
            // Right slope with 3D depth
            for (let row = 0; row < 5; row++) {
              const endX = size - (4 - row) * px * 2.5;
              const rowY = y + row * px * 3;

              // Shadow/depth at bottom
              ctx.fillStyle = roofColors.dark;
              ctx.fillRect(x - px, rowY + px * 2, endX + px * 2, px);

              // Main shingle body
              ctx.fillStyle = roofColors.main;
              ctx.fillRect(x - px, rowY, endX + px * 2, px * 2);

              // Highlight
              ctx.fillStyle = roofColors.light;
              ctx.fillRect(x, rowY, endX - px, px);

              // Shingle separations
              ctx.fillStyle = roofColors.mid;
              for (let s = 0; s < 6; s++) {
                ctx.fillRect(x + s * px * 3, rowY, px, px * 2);
              }
            }
            // Right edge trim
            ctx.fillStyle = roofColors.dark;
            for (let row = 0; row < 5; row++) {
              const endX = size - (4 - row) * px * 2.5;
              ctx.fillRect(x + endX, y + row * px * 3, px * 2, px * 3);
            }
          } else {
            // Middle roof with 3D shingle rows
            for (let row = 0; row < 5; row++) {
              const rowY = y + row * px * 3;

              // Shadow at bottom of row
              ctx.fillStyle = roofColors.dark;
              ctx.fillRect(x, rowY + px * 2, size, px);

              // Main shingle
              ctx.fillStyle = roofColors.main;
              ctx.fillRect(x, rowY, size, px * 2);

              // Highlight
              ctx.fillStyle = roofColors.light;
              ctx.fillRect(x + px, rowY, size - px * 2, px);

              // Shingle separations (offset each row)
              ctx.fillStyle = roofColors.mid;
              const offset = (row % 2) * px * 2;
              for (let s = 0; s < 6; s++) {
                ctx.fillRect(x + offset + s * px * 3, rowY, px, px * 2);
              }
            }
          }
          // Extra highlights
          ctx.fillStyle = roofColors.bright;
          ctx.fillRect(x + px * 3, y + px, px * 2, px);
          ctx.fillRect(x + px * 8, y + px * 4, px, px);
        } else {
          ctx.fillStyle = '#d4652a';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== CHIMNEY (3D with smoke) ==========
      case TILE_CHIMNEY:
        if (state.isPixelMode) {
          const px = 3;

          // Draw 3D roof base first (same as middle roof)
          const roofColors = {
            dark: '#a63d15',
            mid: '#c4501f',
            main: '#d4652a',
            light: '#e8783d',
          };
          for (let row = 0; row < 5; row++) {
            const rowY = y + row * px * 3;
            ctx.fillStyle = roofColors.dark;
            ctx.fillRect(x, rowY + px * 2, size, px);
            ctx.fillStyle = roofColors.main;
            ctx.fillRect(x, rowY, size, px * 2);
            ctx.fillStyle = roofColors.light;
            ctx.fillRect(x + px, rowY, size - px * 2, px);
          }

          // Chimney base shadow
          ctx.fillStyle = '#4a2810';
          ctx.fillRect(x + px * 4, y + px * 2, px * 6, px * 10);

          // Chimney body (stone/brick)
          ctx.fillStyle = '#6b4423';
          ctx.fillRect(x + px * 4, y, px * 5, px * 10);

          // Chimney 3D side (right edge darker)
          ctx.fillStyle = '#5a3518';
          ctx.fillRect(x + px * 8, y, px, px * 10);

          // Chimney bricks/stones
          ctx.fillStyle = '#7a5533';
          ctx.fillRect(x + px * 5, y + px * 2, px * 2, px * 2);
          ctx.fillRect(x + px * 5, y + px * 5, px * 2, px * 2);
          ctx.fillRect(x + px * 6, y + px * 8, px * 2, px);

          // Chimney top cap
          ctx.fillStyle = '#4a2a15';
          ctx.fillRect(x + px * 3, y - px, px * 7, px * 2);
          ctx.fillStyle = '#5a3a25';
          ctx.fillRect(x + px * 3, y - px, px * 7, px);

          // Smoke (animated puffs)
          const smokeOffset = Math.sin(frameCountRef.current * 0.08) * 3;
          const smokeOffset2 = Math.cos(frameCountRef.current * 0.06) * 2;
          // Smoke puffs (multiple layers for depth)
          ctx.fillStyle = 'rgba(180, 180, 180, 0.7)';
          ctx.fillRect(x + px * 5 + smokeOffset, y - px * 3, px * 2, px * 2);
          ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
          ctx.fillRect(x + px * 4 + smokeOffset * 1.2, y - px * 5, px * 3, px * 2);
          ctx.fillStyle = 'rgba(220, 220, 220, 0.3)';
          ctx.fillRect(x + px * 3 + smokeOffset2, y - px * 8, px * 4, px * 3);
        } else {
          ctx.fillStyle = '#8b4513';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== CREAM WALL (3D look) ==========
      case TILE_WALL_CREAM:
        if (state.isPixelMode) {
          const px = 3;
          // Main cream/beige wall
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x, y, size, size);

          // Shadow under roof overhang (top of wall)
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(x, y, size, px * 3);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(x, y + px * 3, size, px * 2);

          // Horizontal plank/siding lines for depth
          ctx.fillStyle = '#e8d4a8';
          for (let i = 1; i < 5; i++) {
            ctx.fillRect(x, y + i * px * 3 + px * 2, size, px);
          }

          // Left edge highlight (light hitting from left)
          ctx.fillStyle = '#fff8e8';
          ctx.fillRect(x, y + px * 3, px, size - px * 3);

          // Right edge shadow (depth)
          ctx.fillStyle = '#d4c39a';
          ctx.fillRect(x + size - px * 2, y, px * 2, size);
          ctx.fillStyle = '#c4b38a';
          ctx.fillRect(x + size - px, y, px, size);

          // Subtle brick/texture pattern
          ctx.fillStyle = '#eddcab';
          ctx.fillRect(x + px * 3, y + px * 6, px * 4, px * 2);
          ctx.fillRect(x + px * 8, y + px * 10, px * 3, px * 2);
        } else {
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== WINDOW (3D look) ==========
      case TILE_WINDOW:
        if (state.isPixelMode) {
          const px = 3;
          // Wall behind with shadow
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x, y, size, size);

          // Shadow under roof on wall
          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.fillRect(x, y, size, px * 2);

          // Right edge shadow
          ctx.fillStyle = '#d4c39a';
          ctx.fillRect(x + size - px * 2, y, px * 2, size);

          // Window outer frame (dark) - with depth
          ctx.fillStyle = '#14263a';
          ctx.fillRect(x + px * 2, y + px * 2, px * 12, px * 13);

          // Window frame shadow (makes it look recessed)
          ctx.fillStyle = '#0a1520';
          ctx.fillRect(x + px * 2, y + px * 2, px * 12, px);
          ctx.fillRect(x + px * 2, y + px * 2, px, px * 13);

          // Window frame (dark blue)
          ctx.fillStyle = '#1e3a5a';
          ctx.fillRect(x + px * 3, y + px * 3, px * 10, px * 11);

          // Glass (gradient effect)
          ctx.fillStyle = '#5a9fe9';
          ctx.fillRect(x + px * 4, y + px * 4, px * 8, px * 9);
          ctx.fillStyle = '#4a8fd9';
          ctx.fillRect(x + px * 4, y + px * 7, px * 8, px * 6);

          // Window cross frame
          ctx.fillStyle = '#1e3a5a';
          ctx.fillRect(x + px * 7, y + px * 4, px * 2, px * 9);
          ctx.fillRect(x + px * 4, y + px * 8, px * 8, px * 2);

          // Reflection highlights
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fillRect(x + px * 5, y + px * 5, px * 2, px * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(x + px * 10, y + px * 5, px, px);
        } else {
          ctx.fillStyle = '#4a90d9';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== FLOWER BOX (window with flowers - 3D) ==========
      case TILE_FLOWER_BOX:
        if (state.isPixelMode) {
          const px = 3;
          // Wall behind with shadow
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x, y, size, size);

          // Shadow under roof
          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.fillRect(x, y, size, px * 2);

          // Right wall shadow
          ctx.fillStyle = '#d4c39a';
          ctx.fillRect(x + size - px * 2, y, px * 2, size);

          // Window outer frame shadow
          ctx.fillStyle = '#14263a';
          ctx.fillRect(x + px * 2, y + px, px * 12, px * 7);
          ctx.fillStyle = '#0a1520';
          ctx.fillRect(x + px * 2, y + px, px * 12, px);
          ctx.fillRect(x + px * 2, y + px, px, px * 7);

          // Window frame
          ctx.fillStyle = '#1e3a5a';
          ctx.fillRect(x + px * 3, y + px * 2, px * 10, px * 5);

          // Glass with gradient
          ctx.fillStyle = '#5a9fe9';
          ctx.fillRect(x + px * 4, y + px * 2, px * 8, px * 4);
          ctx.fillStyle = '#4a8fd9';
          ctx.fillRect(x + px * 4, y + px * 4, px * 8, px * 2);

          // Reflection
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(x + px * 5, y + px * 3, px, px);

          // Flower box - 3D wooden box
          ctx.fillStyle = '#5a3d2a'; // dark wood shadow
          ctx.fillRect(x + px * 2, y + px * 9, px * 12, px * 4);
          ctx.fillStyle = '#8b5a3c'; // main wood
          ctx.fillRect(x + px * 2, y + px * 9, px * 12, px * 3);
          ctx.fillStyle = '#a06d4a'; // wood highlight
          ctx.fillRect(x + px * 2, y + px * 9, px * 12, px);
          ctx.fillStyle = '#704830'; // wood lines
          ctx.fillRect(x + px * 5, y + px * 10, px, px * 2);
          ctx.fillRect(x + px * 10, y + px * 10, px, px * 2);

          // Green foliage base
          ctx.fillStyle = '#2d6b3d';
          ctx.fillRect(x + px * 3, y + px * 8, px * 10, px * 2);
          ctx.fillStyle = '#3d8b4d';
          ctx.fillRect(x + px * 4, y + px * 7, px * 8, px * 2);

          // Colorful flowers (like reference - red, yellow, pink)
          // Red flowers
          ctx.fillStyle = '#e63946';
          ctx.fillRect(x + px * 4, y + px * 6, px * 2, px * 2);
          ctx.fillRect(x + px * 11, y + px * 6, px * 2, px * 2);
          // Yellow flowers
          ctx.fillStyle = '#f4a020';
          ctx.fillRect(x + px * 7, y + px * 5, px * 2, px * 2);
          // Pink flowers
          ctx.fillStyle = '#ff8fab';
          ctx.fillRect(x + px * 5, y + px * 7, px, px);
          ctx.fillRect(x + px * 9, y + px * 6, px, px);
          // Flower centers
          ctx.fillStyle = '#ffd166';
          ctx.fillRect(x + px * 4, y + px * 6, px, px);
          ctx.fillRect(x + px * 7, y + px * 5, px, px);
        } else {
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== PORCH ==========
      case TILE_PORCH:
        if (state.isPixelMode) {
          const px = 3;
          // Base shadow (under the porch)
          ctx.fillStyle = '#4a3828';
          ctx.fillRect(x, y + size - px * 2, size, px * 2);

          // Wooden planks with 3D depth
          const plankColors = {
            dark: '#5a4332',
            mid: '#7a5d45',
            main: '#96735a',
            light: '#b08968',
            highlight: '#c9a87c',
          };

          // Draw individual planks with depth
          for (let i = 0; i < 4; i++) {
            const plankY = y + i * px * 3;
            const plankH = px * 3;

            // Main plank body
            ctx.fillStyle = plankColors.main;
            ctx.fillRect(x, plankY, size, plankH - px);

            // Top highlight of plank
            ctx.fillStyle = plankColors.light;
            ctx.fillRect(x, plankY, size, px);

            // Bright highlight
            ctx.fillStyle = plankColors.highlight;
            ctx.fillRect(x + px * 2, plankY, px * 4, px);

            // Bottom shadow of plank (gap between planks)
            ctx.fillStyle = plankColors.dark;
            ctx.fillRect(x, plankY + plankH - px, size, px);

            // Wood grain details
            ctx.fillStyle = plankColors.mid;
            ctx.fillRect(x + px * 5 + (i % 2) * px * 3, plankY + px, px * 2, px);
            ctx.fillRect(x + px * 10 - (i % 2) * px * 2, plankY + px, px, px);
          }

          // Front edge of porch (3D depth)
          ctx.fillStyle = plankColors.dark;
          ctx.fillRect(x, y + size - px * 3, size, px * 3);
          ctx.fillStyle = plankColors.mid;
          ctx.fillRect(x, y + size - px * 3, size, px);
        } else {
          ctx.fillStyle = '#8b7355';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== BLUE ROOF TILES (Brick building style) ==========
      case TILE_ROOF_BLUE_L:
      case TILE_ROOF_BLUE_R:
      case TILE_ROOF_BLUE_M:
        if (state.isPixelMode) {
          const px = 3;
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);
          // Blue roof
          ctx.fillStyle = '#2c5aa0';
          if (tile === TILE_ROOF_BLUE_L) {
            for (let row = 0; row < 4; row++) {
              const startX = (3 - row) * px * 3;
              ctx.fillRect(x + startX, y + row * px * 4, size - startX, px * 3);
            }
            ctx.fillStyle = '#1e3d70';
            for (let row = 0; row < 4; row++) {
              const startX = (3 - row) * px * 3;
              ctx.fillRect(x + startX, y + row * px * 4, px, px * 3);
            }
          } else if (tile === TILE_ROOF_BLUE_R) {
            for (let row = 0; row < 4; row++) {
              const endX = size - (3 - row) * px * 3;
              ctx.fillRect(x, y + row * px * 4, endX, px * 3);
            }
            ctx.fillStyle = '#1e3d70';
            for (let row = 0; row < 4; row++) {
              const endX = size - (3 - row) * px * 3;
              ctx.fillRect(x + endX - px, y + row * px * 4, px, px * 3);
            }
          } else {
            ctx.fillRect(x, y, size, size);
            ctx.fillStyle = '#1e3d70';
            for (let row = 0; row < 4; row++) {
              ctx.fillRect(x, y + row * px * 4 + px * 3, size, px);
            }
          }
          ctx.fillStyle = '#4080c0';
          ctx.fillRect(x + px * 3, y + px * 2, px * 2, px);
        } else {
          ctx.fillStyle = '#2c5aa0';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== BRICK WALL ==========
      case TILE_WALL_BRICK:
        if (state.isPixelMode) {
          const px = 3;
          // Red brick base
          ctx.fillStyle = '#b5503c';
          ctx.fillRect(x, y, size, size);
          // Brick pattern
          const brickW = px * 5;
          const brickH = px * 3;
          for (let row = 0; row < 5; row++) {
            const offset = (row % 2) * brickW / 2;
            ctx.fillStyle = '#963c2c';
            for (let col = -1; col < 4; col++) {
              const bx = col * brickW + offset;
              if (bx >= -brickW && bx < size) {
                // Mortar lines
                ctx.fillRect(x + Math.max(0, bx), y + row * brickH, px / 2, brickH);
              }
            }
            // Horizontal mortar
            ctx.fillRect(x, y + row * brickH + brickH - px / 2, size, px / 2);
          }
          // Brick variation
          ctx.fillStyle = '#c5604c';
          ctx.fillRect(x + px * 2, y + px * 4, px * 3, px * 2);
          ctx.fillRect(x + px * 8, y + px * 10, px * 4, px * 2);
        } else {
          ctx.fillStyle = '#b5503c';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== WINDOW ON BRICK ==========
      case TILE_WINDOW_BRICK:
        if (state.isPixelMode) {
          const px = 3;
          // Brick wall background
          ctx.fillStyle = '#a04030';
          ctx.fillRect(x, y, size, size);
          // Brick pattern
          ctx.fillStyle = '#c05545';
          for (let row = 0; row < 4; row++) {
            const offset = (row % 2) * px * 4;
            for (let col = 0; col < 3; col++) {
              ctx.fillRect(x + offset + col * px * 6, y + row * px * 4, px * 5, px * 3);
            }
          }
          // Mortar
          ctx.fillStyle = '#d4c4b0';
          for (let i = 0; i < 4; i++) {
            ctx.fillRect(x, y + i * px * 4 + px * 3, size, px);
          }

          // Window frame (blue to match roof)
          ctx.fillStyle = '#1a3a60';
          ctx.fillRect(x + px * 2, y + px * 2, px * 12, px * 12);
          ctx.fillStyle = '#2a4a70';
          ctx.fillRect(x + px * 3, y + px * 3, px * 10, px * 10);

          // Glass
          ctx.fillStyle = '#5a9fe9';
          ctx.fillRect(x + px * 4, y + px * 4, px * 8, px * 8);
          ctx.fillStyle = '#4a8fd9';
          ctx.fillRect(x + px * 4, y + px * 8, px * 8, px * 4);

          // Window cross (blue)
          ctx.fillStyle = '#1a3a60';
          ctx.fillRect(x + px * 7, y + px * 4, px * 2, px * 8);
          ctx.fillRect(x + px * 4, y + px * 7, px * 8, px * 2);

          // Reflection
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(x + px * 5, y + px * 5, px * 2, px);
        } else {
          ctx.fillStyle = '#5a9fe9';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== DOOR ON BRICK (Projects building) ==========
      case TILE_DOOR_BRICK:
        if (state.isPixelMode) {
          const px = 3;
          // Brick wall background
          ctx.fillStyle = '#a04030';
          ctx.fillRect(x, y, size, size);
          // Brick pattern
          ctx.fillStyle = '#c05545';
          for (let row = 0; row < 4; row++) {
            const offset = (row % 2) * px * 4;
            for (let col = 0; col < 3; col++) {
              ctx.fillRect(x + offset + col * px * 6, y + row * px * 4, px * 5, px * 3);
            }
          }

          // Door frame (blue to match roof)
          ctx.fillStyle = '#1a3a60';
          ctx.fillRect(x + px * 2, y, px * 12, size);

          // Door body (lighter blue)
          ctx.fillStyle = '#2a5a90';
          ctx.fillRect(x + px * 3, y + px, px * 10, size - px * 2);

          // Two door panels (top and bottom)
          ctx.fillStyle = '#1a4a70';
          ctx.fillRect(x + px * 4, y + px * 2, px * 8, px * 4);  // Top panel
          ctx.fillRect(x + px * 4, y + px * 8, px * 8, px * 4);  // Bottom panel

          // Panel highlights
          ctx.fillStyle = '#3a6aa0';
          ctx.fillRect(x + px * 4, y + px * 2, px * 8, px);
          ctx.fillRect(x + px * 4, y + px * 8, px * 8, px);

          // Door handle (brass)
          ctx.fillStyle = '#c0a030';
          ctx.fillRect(x + px * 10, y + px * 6, px * 2, px * 2);
          ctx.fillStyle = '#e0c050';
          ctx.fillRect(x + px * 10, y + px * 6, px, px);
        } else {
          ctx.fillStyle = '#2a5a90';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== FLOWER BOX ON BRICK ==========
      case TILE_FLOWER_BOX_BRICK:
        if (state.isPixelMode) {
          const px = 3;
          // Brick wall background
          ctx.fillStyle = '#a04030';
          ctx.fillRect(x, y, size, size);
          // Brick pattern
          ctx.fillStyle = '#c05545';
          for (let row = 0; row < 4; row++) {
            const offset = (row % 2) * px * 4;
            for (let col = 0; col < 3; col++) {
              ctx.fillRect(x + offset + col * px * 6, y + row * px * 4, px * 5, px * 3);
            }
          }

          // Window frame (blue)
          ctx.fillStyle = '#1a3a60';
          ctx.fillRect(x + px * 2, y + px, px * 12, px * 7);
          // Glass
          ctx.fillStyle = '#5a9fe9';
          ctx.fillRect(x + px * 3, y + px * 2, px * 10, px * 5);
          // Reflection
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(x + px * 4, y + px * 3, px * 2, px);

          // Flower box (blue to match)
          ctx.fillStyle = '#1a3a60';
          ctx.fillRect(x + px * 2, y + px * 9, px * 12, px * 4);
          ctx.fillStyle = '#2a4a70';
          ctx.fillRect(x + px * 2, y + px * 9, px * 12, px);

          // Flowers (blue/purple theme)
          ctx.fillStyle = '#6a8fd9';
          ctx.fillRect(x + px * 4, y + px * 7, px * 2, px * 2);
          ctx.fillRect(x + px * 10, y + px * 7, px * 2, px * 2);
          ctx.fillStyle = '#8aaff9';
          ctx.fillRect(x + px * 7, y + px * 6, px * 2, px * 3);
          // Leaves
          ctx.fillStyle = '#2d8a4e';
          ctx.fillRect(x + px * 5, y + px * 9, px, px);
          ctx.fillRect(x + px * 8, y + px * 9, px, px);
        } else {
          ctx.fillStyle = '#a04030';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== WINDOW ON STONE ==========
      case TILE_WINDOW_STONE:
        if (state.isPixelMode) {
          const px = 3;
          // Stone wall background
          ctx.fillStyle = '#707070';
          ctx.fillRect(x, y, size, size);
          // Stone pattern
          ctx.fillStyle = '#858585';
          ctx.fillRect(x + px, y + px * 2, px * 5, px * 4);
          ctx.fillRect(x + px * 7, y + px, px * 5, px * 3);
          ctx.fillRect(x + px * 2, y + px * 8, px * 4, px * 3);
          ctx.fillRect(x + px * 8, y + px * 7, px * 4, px * 4);
          // Grout
          ctx.fillStyle = '#505050';
          ctx.fillRect(x + px * 6, y, px, size);
          ctx.fillRect(x, y + px * 6, size, px);

          // Window frame (brown wood to match roof)
          ctx.fillStyle = '#4a3020';
          ctx.fillRect(x + px * 2, y + px * 2, px * 12, px * 12);
          ctx.fillStyle = '#5a4030';
          ctx.fillRect(x + px * 3, y + px * 3, px * 10, px * 10);

          // Glass
          ctx.fillStyle = '#7ab8e8';
          ctx.fillRect(x + px * 4, y + px * 4, px * 8, px * 8);
          ctx.fillStyle = '#5a98c8';
          ctx.fillRect(x + px * 4, y + px * 8, px * 8, px * 4);

          // Window cross (brown)
          ctx.fillStyle = '#4a3020';
          ctx.fillRect(x + px * 7, y + px * 4, px * 2, px * 8);
          ctx.fillRect(x + px * 4, y + px * 7, px * 8, px * 2);

          // Reflection
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(x + px * 5, y + px * 5, px * 2, px);
        } else {
          ctx.fillStyle = '#7ab8e8';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== DOOR ON STONE (Skills building) ==========
      case TILE_DOOR_STONE:
        if (state.isPixelMode) {
          const px = 3;
          // Stone wall background
          ctx.fillStyle = '#707070';
          ctx.fillRect(x, y, size, size);
          // Stone pattern
          ctx.fillStyle = '#858585';
          ctx.fillRect(x + px, y + px * 2, px * 4, px * 3);
          ctx.fillRect(x + px * 10, y + px, px * 4, px * 3);

          // Door frame (brown wood to match roof)
          ctx.fillStyle = '#3a2515';
          ctx.fillRect(x + px * 2, y, px * 12, size);

          // Door body (brown)
          ctx.fillStyle = '#5a4030';
          ctx.fillRect(x + px * 3, y + px, px * 10, size - px * 2);

          // Two door panels (top and bottom)
          ctx.fillStyle = '#3a2818';
          ctx.fillRect(x + px * 4, y + px * 2, px * 8, px * 4);  // Top panel
          ctx.fillRect(x + px * 4, y + px * 8, px * 8, px * 4);  // Bottom panel

          // Panel highlights
          ctx.fillStyle = '#6a5040';
          ctx.fillRect(x + px * 4, y + px * 2, px * 8, px);
          ctx.fillRect(x + px * 4, y + px * 8, px * 8, px);

          // Door handle (iron/gray)
          ctx.fillStyle = '#404040';
          ctx.fillRect(x + px * 10, y + px * 6, px * 2, px * 2);
          ctx.fillStyle = '#606060';
          ctx.fillRect(x + px * 10, y + px * 6, px, px);
        } else {
          ctx.fillStyle = '#5a4030';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== FLOWER BOX ON STONE ==========
      case TILE_FLOWER_BOX_STONE:
        if (state.isPixelMode) {
          const px = 3;
          // Stone wall background
          ctx.fillStyle = '#707070';
          ctx.fillRect(x, y, size, size);
          // Stone pattern
          ctx.fillStyle = '#858585';
          ctx.fillRect(x + px, y + px * 2, px * 5, px * 4);
          ctx.fillRect(x + px * 7, y + px, px * 5, px * 3);
          // Grout
          ctx.fillStyle = '#505050';
          ctx.fillRect(x + px * 6, y, px, size);

          // Window frame (brown)
          ctx.fillStyle = '#4a3020';
          ctx.fillRect(x + px * 2, y + px, px * 12, px * 7);
          // Glass
          ctx.fillStyle = '#7ab8e8';
          ctx.fillRect(x + px * 3, y + px * 2, px * 10, px * 5);
          // Reflection
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(x + px * 4, y + px * 3, px * 2, px);

          // Flower box (brown wood)
          ctx.fillStyle = '#4a3020';
          ctx.fillRect(x + px * 2, y + px * 9, px * 12, px * 4);
          ctx.fillStyle = '#5a4030';
          ctx.fillRect(x + px * 2, y + px * 9, px * 12, px);

          // Flowers (warm colors - orange/yellow to complement brown)
          ctx.fillStyle = '#e07030';
          ctx.fillRect(x + px * 4, y + px * 7, px * 2, px * 2);
          ctx.fillRect(x + px * 10, y + px * 7, px * 2, px * 2);
          ctx.fillStyle = '#f0a040';
          ctx.fillRect(x + px * 7, y + px * 6, px * 2, px * 3);
          // Leaves
          ctx.fillStyle = '#2d8a4e';
          ctx.fillRect(x + px * 5, y + px * 9, px, px);
          ctx.fillRect(x + px * 8, y + px * 9, px, px);
        } else {
          ctx.fillStyle = '#707070';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== BROWN ROOF TILES (Stone building style) ==========
      case TILE_ROOF_BROWN_L:
      case TILE_ROOF_BROWN_R:
      case TILE_ROOF_BROWN_M:
        if (state.isPixelMode) {
          const px = 3;
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);
          // Brown roof
          ctx.fillStyle = '#6b4423';
          if (tile === TILE_ROOF_BROWN_L) {
            for (let row = 0; row < 4; row++) {
              const startX = (3 - row) * px * 3;
              ctx.fillRect(x + startX, y + row * px * 4, size - startX, px * 3);
            }
            ctx.fillStyle = '#4a3015';
            for (let row = 0; row < 4; row++) {
              const startX = (3 - row) * px * 3;
              ctx.fillRect(x + startX, y + row * px * 4, px, px * 3);
            }
          } else if (tile === TILE_ROOF_BROWN_R) {
            for (let row = 0; row < 4; row++) {
              const endX = size - (3 - row) * px * 3;
              ctx.fillRect(x, y + row * px * 4, endX, px * 3);
            }
            ctx.fillStyle = '#4a3015';
            for (let row = 0; row < 4; row++) {
              const endX = size - (3 - row) * px * 3;
              ctx.fillRect(x + endX - px, y + row * px * 4, px, px * 3);
            }
          } else {
            ctx.fillRect(x, y, size, size);
            ctx.fillStyle = '#4a3015';
            for (let row = 0; row < 4; row++) {
              ctx.fillRect(x, y + row * px * 4 + px * 3, size, px);
            }
          }
          ctx.fillStyle = '#8b5a2b';
          ctx.fillRect(x + px * 4, y + px * 3, px * 2, px);
        } else {
          ctx.fillStyle = '#6b4423';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== STONE WALL ==========
      case TILE_WALL_STONE:
        if (state.isPixelMode) {
          const px = 3;
          // Gray stone base
          ctx.fillStyle = '#808080';
          ctx.fillRect(x, y, size, size);
          // Stone pattern
          ctx.fillStyle = '#909090';
          ctx.fillRect(x + px, y + px * 2, px * 5, px * 4);
          ctx.fillRect(x + px * 7, y + px, px * 6, px * 3);
          ctx.fillRect(x + px * 2, y + px * 8, px * 4, px * 3);
          ctx.fillRect(x + px * 8, y + px * 6, px * 5, px * 4);
          ctx.fillRect(x + px * 3, y + px * 12, px * 6, px * 3);
          // Dark grout
          ctx.fillStyle = '#505050';
          ctx.fillRect(x + px * 6, y, px, size);
          ctx.fillRect(x, y + px * 6, size, px);
          ctx.fillRect(x, y + px * 11, size, px);
          // Highlight
          ctx.fillStyle = '#a0a0a0';
          ctx.fillRect(x + px * 2, y + px * 3, px, px);
          ctx.fillRect(x + px * 9, y + px * 8, px, px);
        } else {
          ctx.fillStyle = '#808080';
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== 2.5D ISOMETRIC HOUSE TILES ==========
      case TILE_ROOF_25D_PEAK:
        if (state.isPixelMode) {
          const px = 3;
          // Background grass
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);

          // Roof ridge/peak - top row of shingles
          const roofDark = '#9a3d10';
          const roofMain = '#c4501f';
          const roofLight = '#d4652a';
          const roofHighlight = '#e8783d';

          // Draw layered shingles from top
          for (let row = 0; row < 5; row++) {
            const rowY = y + row * px * 3;
            // Shadow line
            ctx.fillStyle = roofDark;
            ctx.fillRect(x, rowY + px * 2, size, px);
            // Main shingle
            ctx.fillStyle = roofMain;
            ctx.fillRect(x, rowY, size, px * 2);
            // Top highlight
            ctx.fillStyle = roofLight;
            ctx.fillRect(x + px, rowY, size - px * 2, px);
            // Individual tiles
            ctx.fillStyle = roofHighlight;
            const offset = (row % 2) * px * 2;
            for (let t = 0; t < 4; t++) {
              ctx.fillRect(x + offset + t * px * 4, rowY, px, px);
            }
          }
        } else {
          ctx.fillStyle = '#d4652a';
          ctx.fillRect(x, y, size, size);
        }
        break;

      case TILE_ROOF_25D_FRONT:
        if (state.isPixelMode) {
          const px = 3;
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);

          const roofDark = '#9a3d10';
          const roofMain = '#c4501f';
          const roofLight = '#d4652a';
          const roofHighlight = '#e8783d';

          // Front-facing roof slope with perspective
          for (let row = 0; row < 5; row++) {
            const rowY = y + row * px * 3;
            // Each row is a shingle
            ctx.fillStyle = roofDark;
            ctx.fillRect(x, rowY + px * 2, size, px);
            ctx.fillStyle = roofMain;
            ctx.fillRect(x, rowY, size, px * 2);
            ctx.fillStyle = roofLight;
            ctx.fillRect(x + px, rowY, size - px * 2, px);
            // Shingle pattern
            ctx.fillStyle = roofHighlight;
            const offset = (row % 2) * px * 2;
            for (let t = 0; t < 4; t++) {
              ctx.fillRect(x + offset + t * px * 4 + px, rowY, px * 2, px);
            }
          }
        } else {
          ctx.fillStyle = '#d4652a';
          ctx.fillRect(x, y, size, size);
        }
        break;

      case TILE_ROOF_25D_SIDE:
        if (state.isPixelMode) {
          const px = 3;
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);

          // Side roof - darker to show depth/angle
          const roofDark = '#7a2d08';
          const roofMain = '#9a3d10';
          const roofMid = '#b44818';

          // Fill with angled shingles
          for (let row = 0; row < 5; row++) {
            const rowY = y + row * px * 3;
            ctx.fillStyle = roofDark;
            ctx.fillRect(x, rowY + px * 2, size, px);
            ctx.fillStyle = roofMain;
            ctx.fillRect(x, rowY, size, px * 2);
            ctx.fillStyle = roofMid;
            ctx.fillRect(x, rowY, size - px * 2, px);
          }

          // Left edge highlight (where it meets front)
          ctx.fillStyle = '#c4501f';
          ctx.fillRect(x, y, px, size);
        } else {
          ctx.fillStyle = '#b44818';
          ctx.fillRect(x, y, size, size);
        }
        break;

      case TILE_ROOF_25D_FRONT_L:
        if (state.isPixelMode) {
          const px = 3;
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);

          const roofDark = '#9a3d10';
          const roofMain = '#c4501f';
          const roofLight = '#d4652a';

          // Left edge of roof with overhang
          for (let row = 0; row < 5; row++) {
            const rowY = y + row * px * 3;
            const indent = (4 - row) * px; // Slope effect

            ctx.fillStyle = roofDark;
            ctx.fillRect(x + indent, rowY + px * 2, size - indent, px);
            ctx.fillStyle = roofMain;
            ctx.fillRect(x + indent, rowY, size - indent, px * 2);
            ctx.fillStyle = roofLight;
            ctx.fillRect(x + indent + px, rowY, size - indent - px, px);

            // Dark edge on left
            ctx.fillStyle = '#7a2d08';
            ctx.fillRect(x + indent, rowY, px, px * 3);
          }
        } else {
          ctx.fillStyle = '#d4652a';
          ctx.fillRect(x, y, size, size);
        }
        break;

      case TILE_WALL_25D_FRONT:
        if (state.isPixelMode) {
          const px = 3;

          // Cream front wall
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x, y, size, size);

          // Shadow under roof overhang
          ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          ctx.fillRect(x, y, size, px * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(x, y + px * 2, size, px);

          // Horizontal siding lines
          ctx.fillStyle = '#e8d4a8';
          for (let i = 1; i < 5; i++) {
            ctx.fillRect(x, y + i * px * 3, size, px);
          }

          // Left highlight
          ctx.fillStyle = '#fff8e8';
          ctx.fillRect(x, y + px * 3, px, size - px * 3);
        } else {
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x, y, size, size);
        }
        break;

      case TILE_WALL_25D_SIDE:
        if (state.isPixelMode) {
          const px = 3;

          // Darker side wall for depth
          ctx.fillStyle = '#d4c4a0';
          ctx.fillRect(x, y, size, size);

          // Even darker at right edge
          ctx.fillStyle = '#c4b490';
          ctx.fillRect(x + size - px * 3, y, px * 3, size);
          ctx.fillStyle = '#b4a480';
          ctx.fillRect(x + size - px, y, px, size);

          // Siding lines
          ctx.fillStyle = '#c0b090';
          for (let i = 1; i < 5; i++) {
            ctx.fillRect(x, y + i * px * 3, size, px);
          }

          // Left edge highlight (where it meets front)
          ctx.fillStyle = '#e8d8b8';
          ctx.fillRect(x, y, px, size);
        } else {
          ctx.fillStyle = '#d4c4a0';
          ctx.fillRect(x, y, size, size);
        }
        break;

      case TILE_WINDOW_25D:
        if (state.isPixelMode) {
          const px = 3;

          // Wall behind
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x, y, size, size);

          // Shadow under roof
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(x, y, size, px * 2);

          // Window frame (wooden - brown)
          ctx.fillStyle = '#5a3a20';
          ctx.fillRect(x + px * 2, y + px * 2, px * 12, px * 11);

          // Window recess shadow
          ctx.fillStyle = '#3a2510';
          ctx.fillRect(x + px * 2, y + px * 2, px * 12, px);
          ctx.fillRect(x + px * 2, y + px * 2, px, px * 11);

          // Glass (lighter blue)
          ctx.fillStyle = '#7ab8e8';
          ctx.fillRect(x + px * 3, y + px * 3, px * 10, px * 9);

          // Glass darker bottom (reflection)
          ctx.fillStyle = '#5a98c8';
          ctx.fillRect(x + px * 3, y + px * 8, px * 10, px * 4);

          // Window cross frame
          ctx.fillStyle = '#5a3a20';
          ctx.fillRect(x + px * 7, y + px * 3, px * 2, px * 9);
          ctx.fillRect(x + px * 3, y + px * 7, px * 10, px * 2);

          // Reflection highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fillRect(x + px * 4, y + px * 4, px * 2, px * 2);
        } else {
          ctx.fillStyle = '#7ab8e8';
          ctx.fillRect(x, y, size, size);
        }
        break;

      case TILE_DOOR_25D:
        if (state.isPixelMode) {
          const px = 3;

          // Wall behind
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x, y, size, size);

          // Door frame shadow (recessed)
          ctx.fillStyle = '#3a2510';
          ctx.fillRect(x + px, y, px * 14, size);

          // Door frame (wooden)
          ctx.fillStyle = '#5a3a20';
          ctx.fillRect(x + px * 2, y, px * 12, size);

          // Door body (dark blue like reference)
          ctx.fillStyle = '#2a4a6a';
          ctx.fillRect(x + px * 3, y + px, px * 10, size - px * 2);

          // Door depth - left lighter
          ctx.fillStyle = '#3a5a7a';
          ctx.fillRect(x + px * 3, y + px, px, size - px * 2);

          // Door depth - right darker
          ctx.fillStyle = '#1a3a5a';
          ctx.fillRect(x + px * 12, y + px, px, size - px * 2);

          // Door panel (recessed)
          ctx.fillStyle = '#1a3a5a';
          ctx.fillRect(x + px * 4, y + px * 2, px * 8, px * 5);
          ctx.fillRect(x + px * 4, y + px * 8, px * 8, px * 5);

          // Panel highlights
          ctx.fillStyle = '#3a5a7a';
          ctx.fillRect(x + px * 4, y + px * 2, px * 8, px);
          ctx.fillRect(x + px * 4, y + px * 8, px * 8, px);

          // Door handle
          ctx.fillStyle = '#c0a030';
          ctx.fillRect(x + px * 10, y + px * 7, px * 2, px * 2);
          ctx.fillStyle = '#e0c050';
          ctx.fillRect(x + px * 10, y + px * 7, px, px);
        } else {
          ctx.fillStyle = '#2a4a6a';
          ctx.fillRect(x, y, size, size);
        }
        break;

      case TILE_WALL:
        if (state.isPixelMode) {
          // Pallet Town sprite sheet style stone wall
          const px = 3;
          const stoneW = 12;
          const stoneH = 9;

          // Base stone color
          ctx.fillStyle = '#808080';
          ctx.fillRect(x, y, size, size);

          // Stone blocks pattern
          for (let py = 0; py < size; py += stoneH) {
            const rowOffset = ((py / stoneH) % 2) * (stoneW / 2);
            for (let px2 = -stoneW; px2 < size + stoneW; px2 += stoneW) {
              const stoneX = px2 + rowOffset;
              if (stoneX >= -stoneW / 2 && stoneX < size) {
                // Stone face with variation
                const stoneSeed = ((tileX * 7 + stoneX) + (tileY * 11 + py)) % 100;
                if (stoneSeed < 30) {
                  ctx.fillStyle = '#696969';
                } else if (stoneSeed < 70) {
                  ctx.fillStyle = '#808080';
                } else {
                  ctx.fillStyle = '#a0a0a0';
                }
                const drawX = Math.max(0, stoneX);
                const drawW = Math.min(stoneW - px, size - drawX);
                if (drawW > 0) {
                  ctx.fillRect(x + drawX, y + py + px, drawW, stoneH - px * 2);
                }

                // Stone highlight (top-left)
                ctx.fillStyle = '#b0b0b0';
                if (drawX < size - px) {
                  ctx.fillRect(x + drawX, y + py + px, Math.min(px * 2, drawW), px);
                }
              }
            }
          }

          // Mortar/grout lines
          ctx.fillStyle = '#505050';
          for (let py = stoneH; py < size; py += stoneH) {
            ctx.fillRect(x, y + py - px, size, px);
          }
          for (let py = 0; py < size; py += stoneH) {
            const rowOffset = ((py / stoneH) % 2) * (stoneW / 2);
            for (let px2 = rowOffset; px2 < size; px2 += stoneW) {
              if (px2 > 0) {
                ctx.fillRect(x + px2 - px, y + py, px, stoneH);
              }
            }
          }
        } else {
          ctx.fillStyle = state.currentMap === 'overworld' ? COLORS.wall : COLORS.wallInterior;
          ctx.fillRect(x, y, size, size);
          ctx.strokeStyle = '#374151';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 4, y + 4, size / 2 - 6, size / 2 - 6);
          ctx.strokeRect(x + size / 2 + 2, y + size / 2 + 2, size / 2 - 6, size / 2 - 6);
        }
        break;
      case TILE_BUILDING:
        if (state.isPixelMode) {
          // Pallet Town sprite sheet style building - cream wall with wood trim
          const px = 3;

          // Cream/beige wall base
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x, y, size, size);

          // Wall texture lines
          ctx.fillStyle = '#efe4c4';
          for (let py = px * 2; py < size; py += px * 4) {
            ctx.fillRect(x + px * 2, y + py, size - px * 4, px);
          }

          // Wood beam/trim on edges (like sprite sheet)
          ctx.fillStyle = '#8b5a2b';
          ctx.fillRect(x, y, px * 2, size);
          ctx.fillRect(x + size - px * 2, y, px * 2, size);
          // Beam shadow
          ctx.fillStyle = '#5c3a21';
          ctx.fillRect(x, y, px, size);
          // Beam highlight
          ctx.fillStyle = '#a67c52';
          ctx.fillRect(x + px, y, px, size);
          ctx.fillRect(x + size - px * 2, y, px, size);

          // Window with flower box (like sprite sheet)
          // Window frame
          ctx.fillStyle = '#5c3a21';
          ctx.fillRect(x + 12, y + 6, 24, 24);
          // Window panes
          ctx.fillStyle = '#87ceeb';
          ctx.fillRect(x + 15, y + 9, 18, 18);
          // Window dividers
          ctx.fillStyle = '#8b5a2b';
          ctx.fillRect(x + 23, y + 9, px, 18);
          ctx.fillRect(x + 15, y + 17, 18, px);
          // Window shine
          ctx.fillStyle = '#b0e2ff';
          ctx.fillRect(x + 16, y + 10, px * 2, px * 2);

          // Flower box under window
          ctx.fillStyle = '#8b4513';
          ctx.fillRect(x + 12, y + 30, 24, px * 2);
          ctx.fillStyle = '#a0522d';
          ctx.fillRect(x + 12, y + 30, 24, px);
          // Flowers in box
          ctx.fillStyle = '#ff6b6b';
          ctx.fillRect(x + 15, y + 28, px, px * 2);
          ctx.fillRect(x + 24, y + 28, px, px * 2);
          ctx.fillStyle = '#ffd93d';
          ctx.fillRect(x + 18, y + 27, px, px * 3);
          ctx.fillRect(x + 30, y + 28, px, px * 2);
          // Leaves
          ctx.fillStyle = '#27ae60';
          ctx.fillRect(x + 21, y + 29, px, px);
          ctx.fillRect(x + 27, y + 29, px, px);
        } else {
          ctx.fillStyle = COLORS.building;
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(x + size / 3, y + size / 3, size / 3, size / 3);
        }
        break;
      case TILE_DOOR:
        if (state.isPixelMode) {
          // Two single-panel doors with handles in the middle
          const px = 3;

          // Wall background (cream)
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x, y, size, size);

          // Stone/wooden step at bottom
          ctx.fillStyle = '#5a4a3a';
          ctx.fillRect(x + px, y + size - px * 2, size - px * 2, px * 2);
          ctx.fillStyle = '#7a6a5a';
          ctx.fillRect(x + px, y + size - px * 2, size - px * 2, px);

          // Door frame (dark wood)
          ctx.fillStyle = '#4a2a15';
          ctx.fillRect(x + px, y, px * 14, size - px * 2);
          ctx.fillStyle = '#5c3a21';
          ctx.fillRect(x + px, y, px * 14, px);

          // === LEFT DOOR (one single panel only) ===
          ctx.fillStyle = '#1e3a5f';
          ctx.fillRect(x + px * 2, y + px, px * 6, size - px * 4);
          // One panel spanning full height
          ctx.fillStyle = '#152a45';
          ctx.fillRect(x + px * 3, y + px * 2, px * 4, size - px * 5);
          // Panel highlight
          ctx.fillStyle = '#2a4a70';
          ctx.fillRect(x + px * 3, y + px * 2, px * 4, px);
          // Left door handle (on RIGHT side - near middle)
          ctx.fillStyle = '#b8860b';
          ctx.fillRect(x + px * 6, y + px * 6, px, px * 2);
          ctx.fillStyle = '#daa520';
          ctx.fillRect(x + px * 6, y + px * 6, px, px);

          // === RIGHT DOOR (one single panel only) ===
          ctx.fillStyle = '#1e3a5f';
          ctx.fillRect(x + px * 8, y + px, px * 6, size - px * 4);
          // One panel spanning full height
          ctx.fillStyle = '#152a45';
          ctx.fillRect(x + px * 9, y + px * 2, px * 4, size - px * 5);
          // Panel highlight
          ctx.fillStyle = '#2a4a70';
          ctx.fillRect(x + px * 9, y + px * 2, px * 4, px);
          // Right door handle (on LEFT side - near middle)
          ctx.fillStyle = '#b8860b';
          ctx.fillRect(x + px * 9, y + px * 6, px, px * 2);
          ctx.fillStyle = '#daa520';
          ctx.fillRect(x + px * 9, y + px * 6, px, px);

          // Center gap between doors
          ctx.fillStyle = '#0a1a30';
          ctx.fillRect(x + px * 7, y + px, px * 2, size - px * 4);
        } else {
          ctx.fillStyle = COLORS.door;
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(x + size - 14, y + size / 2, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      // ========== LEFT DOOR (single panel, handle on right) ==========
      case TILE_DOOR_L:
        if (state.isPixelMode) {
          const px = 3;

          // Wall background (cream)
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x, y, size, size);

          // Stone step at bottom
          ctx.fillStyle = '#5a4a3a';
          ctx.fillRect(x, y + size - px * 2, size, px * 2);
          ctx.fillStyle = '#7a6a5a';
          ctx.fillRect(x, y + size - px * 2, size, px);

          // Door frame (dark wood) - right side open to connect with right door
          ctx.fillStyle = '#4a2a15';
          ctx.fillRect(x + px, y, size - px, size - px * 2);
          ctx.fillStyle = '#5c3a21';
          ctx.fillRect(x + px, y, size - px, px);

          // Door body (dark blue)
          ctx.fillStyle = '#1e3a5f';
          ctx.fillRect(x + px * 2, y + px, size - px * 2, size - px * 4);

          // Single panel
          ctx.fillStyle = '#152a45';
          ctx.fillRect(x + px * 3, y + px * 2, size - px * 4, size - px * 5);

          // Panel highlight
          ctx.fillStyle = '#2a4a70';
          ctx.fillRect(x + px * 3, y + px * 2, size - px * 4, px);

          // Handle on right side (near middle where doors meet)
          ctx.fillStyle = '#b8860b';
          ctx.fillRect(x + size - px * 3, y + px * 6, px, px * 2);
          ctx.fillStyle = '#daa520';
          ctx.fillRect(x + size - px * 3, y + px * 6, px, px);
        } else {
          ctx.fillStyle = COLORS.door;
          ctx.fillRect(x, y, size, size);
        }
        break;

      // ========== RIGHT DOOR (single panel, handle on left) ==========
      case TILE_DOOR_R:
        if (state.isPixelMode) {
          const px = 3;

          // Wall background (cream)
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x, y, size, size);

          // Stone step at bottom
          ctx.fillStyle = '#5a4a3a';
          ctx.fillRect(x, y + size - px * 2, size, px * 2);
          ctx.fillStyle = '#7a6a5a';
          ctx.fillRect(x, y + size - px * 2, size, px);

          // Door frame (dark wood) - left side open to connect with left door
          ctx.fillStyle = '#4a2a15';
          ctx.fillRect(x, y, size - px, size - px * 2);
          ctx.fillStyle = '#5c3a21';
          ctx.fillRect(x, y, size - px, px);

          // Door body (dark blue)
          ctx.fillStyle = '#1e3a5f';
          ctx.fillRect(x, y + px, size - px * 2, size - px * 4);

          // Single panel
          ctx.fillStyle = '#152a45';
          ctx.fillRect(x + px, y + px * 2, size - px * 4, size - px * 5);

          // Panel highlight
          ctx.fillStyle = '#2a4a70';
          ctx.fillRect(x + px, y + px * 2, size - px * 4, px);

          // Handle on left side (near middle where doors meet)
          ctx.fillStyle = '#b8860b';
          ctx.fillRect(x + px * 2, y + px * 6, px, px * 2);
          ctx.fillStyle = '#daa520';
          ctx.fillRect(x + px * 2, y + px * 6, px, px);
        } else {
          ctx.fillStyle = COLORS.door;
          ctx.fillRect(x, y, size, size);
        }
        break;

      case TILE_TREE:
        if (state.isPixelMode) {
          // Pallet Town sprite sheet style tree - cloud-like canopy
          const px = 3;

          // Bright grass background (same as regular grass)
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);

          // Tree trunk (thick, brown)
          ctx.fillStyle = '#5c3a21'; // dark bark
          ctx.fillRect(x + 18, y + 30, px * 4, px * 6);
          ctx.fillStyle = '#8b5a2b'; // medium bark
          ctx.fillRect(x + 19, y + 30, px * 3, px * 6);
          ctx.fillStyle = '#a67c52'; // bark highlight
          ctx.fillRect(x + 21, y + 32, px, px * 3);

          // Cloud-like canopy - DARK base layer (outer edge/shadow)
          ctx.fillStyle = '#2d5a27';
          // Bottom puffs
          ctx.fillRect(x + 3, y + 24, px * 4, px * 3);
          ctx.fillRect(x + 33, y + 24, px * 4, px * 3);
          ctx.fillRect(x + 12, y + 27, px * 6, px * 2);
          ctx.fillRect(x + 24, y + 27, px * 6, px * 2);
          // Middle layer
          ctx.fillRect(x + 0, y + 15, px * 5, px * 4);
          ctx.fillRect(x + 33, y + 15, px * 5, px * 4);
          ctx.fillRect(x + 6, y + 18, px * 12, px * 4);
          ctx.fillRect(x + 24, y + 18, px * 12, px * 4);
          // Top puffs
          ctx.fillRect(x + 6, y + 6, px * 6, px * 4);
          ctx.fillRect(x + 30, y + 6, px * 6, px * 4);
          ctx.fillRect(x + 15, y + 3, px * 6, px * 5);
          ctx.fillRect(x + 21, y + 0, px * 4, px * 4);

          // MEDIUM layer (main canopy color)
          ctx.fillStyle = '#4a8c44';
          ctx.fillRect(x + 6, y + 24, px * 4, px * 2);
          ctx.fillRect(x + 30, y + 24, px * 4, px * 2);
          ctx.fillRect(x + 15, y + 24, px * 6, px * 2);
          ctx.fillRect(x + 3, y + 15, px * 5, px * 3);
          ctx.fillRect(x + 33, y + 15, px * 4, px * 3);
          ctx.fillRect(x + 9, y + 15, px * 10, px * 4);
          ctx.fillRect(x + 24, y + 15, px * 8, px * 4);
          ctx.fillRect(x + 9, y + 9, px * 6, px * 3);
          ctx.fillRect(x + 27, y + 9, px * 6, px * 3);
          ctx.fillRect(x + 18, y + 6, px * 6, px * 4);

          // LIGHT layer (highlights - top/left lit)
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x + 9, y + 21, px * 3, px * 2);
          ctx.fillRect(x + 6, y + 15, px * 4, px * 2);
          ctx.fillRect(x + 12, y + 12, px * 5, px * 3);
          ctx.fillRect(x + 18, y + 9, px * 4, px * 3);
          ctx.fillRect(x + 21, y + 3, px * 3, px * 3);

          // Bright highlight spots
          ctx.fillStyle = '#a8d86e';
          ctx.fillRect(x + 12, y + 15, px * 2, px);
          ctx.fillRect(x + 18, y + 12, px * 2, px);
          ctx.fillRect(x + 21, y + 6, px * 2, px);
        } else {
          ctx.fillStyle = COLORS.grass;
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = COLORS.treeTrunk;
          ctx.fillRect(x + size / 3, y + size / 2, size / 3, size / 2);
          ctx.fillStyle = COLORS.tree;
          ctx.beginPath();
          ctx.arc(x + size / 2, y + size / 3, size / 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case TILE_MONUMENT:
        if (state.isPixelMode) {
          // Pixel art monument/obelisk
          const pxM = 4;
          // Path background
          ctx.fillStyle = COLORS.pixelPath1;
          ctx.fillRect(x, y, size, size);
          // Stone base
          ctx.fillStyle = '#374151';
          ctx.fillRect(x + 8, y + size - 12, size - 16, 10);
          // Monument body with pixel shading
          ctx.fillStyle = '#9333ea';
          ctx.fillRect(x + 12, y + 8, size - 24, size - 18);
          // Highlight side
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(x + 12, y + 8, pxM, size - 18);
          // Dark side
          ctx.fillStyle = '#7e22ce';
          ctx.fillRect(x + size - 16, y + 8, pxM, size - 18);
          // Glowing runes (animated)
          const runeGlow = Math.sin(frameCountRef.current * 0.1) > 0;
          ctx.fillStyle = runeGlow ? '#e9d5ff' : '#c4b5fd';
          ctx.fillRect(x + 18, y + 14, pxM * 3, pxM);
          ctx.fillRect(x + 18, y + 22, pxM * 3, pxM);
          ctx.fillRect(x + 18, y + 30, pxM * 3, pxM);
        } else {
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
        }
        break;
      case TILE_SIGN:
        if (state.isPixelMode) {
          // Pokemon-style wooden sign
          const px = 3;

          // Bright grass background (same as regular grass)
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);

          // Wooden post
          ctx.fillStyle = COLORS.pixelBuilding1;
          ctx.fillRect(x + 21, y + 24, px * 2, px * 8);
          ctx.fillStyle = COLORS.pixelBuilding2;
          ctx.fillRect(x + 22, y + 24, px, px * 8);

          // Sign board with wood texture
          ctx.fillStyle = COLORS.pixelBuilding2;
          ctx.fillRect(x + 6, y + 6, size - 12, px * 6);
          // Wood grain
          ctx.fillStyle = COLORS.pixelBuilding3;
          ctx.fillRect(x + 9, y + 9, size - 18, px);
          ctx.fillRect(x + 9, y + 15, size - 18, px);
          // Dark edges
          ctx.fillStyle = COLORS.pixelBuilding1;
          ctx.fillRect(x + 6, y + 6, size - 12, px);
          ctx.fillRect(x + 6, y + 6 + px * 5, size - 12, px);
          ctx.fillRect(x + 6, y + 6, px, px * 6);
          ctx.fillRect(x + size - 9, y + 6, px, px * 6);

          // "!" text
          ctx.fillStyle = '#f5deb3';
          ctx.fillRect(x + 22, y + 10, px, px * 3);
          ctx.fillRect(x + 22, y + 16, px, px);
        } else {
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
        }
        break;
      case TILE_FLOOR:
        if (state.isPixelMode) {
          // Pixel art checkered floor
          const pxFl = 8;
          for (let py = 0; py < size; py += pxFl) {
            for (let px = 0; px < size; px += pxFl) {
              const isLight = ((px / pxFl + py / pxFl + tileX + tileY) % 2) === 0;
              ctx.fillStyle = isLight ? '#64748b' : '#475569';
              ctx.fillRect(x + px, y + py, pxFl, pxFl);
            }
          }
          // Add subtle shine
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(x + 4, y + 4, 4, 4);
        } else {
          ctx.fillStyle = COLORS.floor;
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = COLORS.floorDark;
          ctx.fillRect(x, y, 2, size);
          ctx.fillRect(x, y, size, 2);
        }
        break;
      case TILE_EXIT_MAT:
        if (state.isPixelMode) {
          // Pixel art exit mat with arrow
          ctx.fillStyle = '#b91c1c';
          ctx.fillRect(x, y, size, size);
          // Border pattern
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(x, y, size, 4);
          ctx.fillRect(x, y + size - 4, size, 4);
          ctx.fillRect(x, y, 4, size);
          ctx.fillRect(x + size - 4, y, 4, size);
          // Arrow pointing down (pixel style)
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(x + 20, y + 8, 8, 20);
          ctx.fillRect(x + 12, y + 24, 8, 8);
          ctx.fillRect(x + 28, y + 24, 8, 8);
          ctx.fillRect(x + 16, y + 32, 16, 8);
          ctx.fillRect(x + 20, y + 40, 8, 4);
        } else {
          ctx.fillStyle = COLORS.exitMat;
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('EXIT', x + size / 2, y + size / 2 + 4);
        }
        break;
      case TILE_EXHIBIT:
        if (state.isPixelMode) {
          // Pixel art exhibit pedestal
          const pxE = 4;
          // Floor
          ctx.fillStyle = '#475569';
          ctx.fillRect(x, y, size, size);
          // Pedestal base
          ctx.fillStyle = '#6b21a8';
          ctx.fillRect(x + 8, y + 8, size - 16, size - 16);
          // Pedestal top (lighter)
          ctx.fillStyle = '#9333ea';
          ctx.fillRect(x + 12, y + 12, size - 24, size - 24);
          // Glowing item on pedestal (animated)
          const exhibitGlow = Math.sin(frameCountRef.current * 0.12);
          ctx.fillStyle = exhibitGlow > 0 ? '#e9d5ff' : '#d8b4fe';
          ctx.fillRect(x + 18, y + 18, 12, 12);
          // Sparkles
          if (exhibitGlow > 0.5) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + 16, y + 16, pxE, pxE);
            ctx.fillRect(x + 28, y + 28, pxE, pxE);
          }
        } else {
          ctx.fillStyle = COLORS.floor;
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = COLORS.exhibit;
          ctx.fillRect(x + 4, y + 4, size - 8, size - 8);
          const pulse = Math.sin(frameCountRef.current * 0.1) * 0.2 + 0.8;
          ctx.globalAlpha = pulse;
          ctx.fillStyle = '#c4b5fd';
          ctx.fillRect(x + 8, y + 8, size - 16, size - 16);
          ctx.globalAlpha = 1;
        }
        break;

      // ============ THEMED EXHIBITS ============
      case TILE_EXHIBIT_FRAME:
        // About building: Elegant picture frame on stand
        {
          const px = 3;
          // Wooden floor background
          ctx.fillStyle = '#c9a66b';
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = '#a67c52';
          ctx.fillRect(x, y + 24, size, 1);

          // Easel/stand legs
          ctx.fillStyle = '#5c3a21';
          ctx.fillRect(x + 12, y + 30, px * 2, size - 30);
          ctx.fillRect(x + 30, y + 30, px * 2, size - 30);
          ctx.fillRect(x + 21, y + 36, px * 2, size - 36);

          // Picture frame (gold)
          ctx.fillStyle = '#d4af37';
          ctx.fillRect(x + 9, y + 6, px * 10, px * 9);

          // Picture inside (gradient sky)
          ctx.fillStyle = '#1e3a5f';
          ctx.fillRect(x + 12, y + 9, px * 8, px * 6);

          // Picture content (portrait silhouette)
          ctx.fillStyle = '#fcd34d';
          ctx.fillRect(x + 18, y + 12, px * 3, px * 3);

          // Frame shine
          const shine = Math.sin(frameCountRef.current * 0.08) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(255, 215, 0, ${shine * 0.5})`;
          ctx.fillRect(x + 9, y + 6, px * 2, px);
        }
        break;

      case TILE_EXHIBIT_MONITOR:
        // Projects building: Holographic monitor display
        {
          const px = 3;
          // Metallic floor background
          ctx.fillStyle = '#2d3444';
          ctx.fillRect(x, y, size, size);

          // Monitor stand base
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(x + 12, y + 36, px * 8, px * 4);
          ctx.fillStyle = '#374151';
          ctx.fillRect(x + 18, y + 24, px * 4, px * 4);

          // Monitor frame (sleek black)
          ctx.fillStyle = '#111827';
          ctx.fillRect(x + 6, y + 3, size - 12, px * 8);

          // Screen with animated code
          const scanLine = (frameCountRef.current % 30) * 1.5;
          ctx.fillStyle = '#0a1628';
          ctx.fillRect(x + 9, y + 6, size - 18, px * 6);

          // Code/data visualization
          ctx.fillStyle = '#39ff14';
          ctx.fillRect(x + 12, y + 8, px * 4, px);
          ctx.fillRect(x + 12, y + 11, px * 6, px);
          ctx.fillRect(x + 12, y + 14, px * 3, px);
          ctx.fillRect(x + 21, y + 8, px * 2, px * 3);
          ctx.fillRect(x + 27, y + 11, px * 3, px);

          // Scan line effect
          ctx.fillStyle = 'rgba(57, 255, 20, 0.3)';
          ctx.fillRect(x + 9, y + 6 + (scanLine % 18), size - 18, 2);

          // Glow effect
          const glow = Math.sin(frameCountRef.current * 0.1) * 0.2 + 0.6;
          ctx.fillStyle = `rgba(57, 255, 20, ${glow * 0.15})`;
          ctx.fillRect(x + 3, y, size - 6, px * 10);
        }
        break;

      case TILE_EXHIBIT_ORB:
        // Skills building: Glowing skill orb on pedestal
        {
          const px = 3;
          // Checkered floor background
          const isLightOrb = ((Math.floor(x / size) + Math.floor(y / size)) % 2) === 0;
          ctx.fillStyle = isLightOrb ? '#fef3c7' : '#fde68a';
          ctx.fillRect(x, y, size, size);

          // Pedestal (red Pokemon style)
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(x + 12, y + 30, px * 8, px * 6);
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(x + 12, y + 30, px * 8, px * 2);

          // Pedestal top
          ctx.fillStyle = '#fef3c7';
          ctx.fillRect(x + 9, y + 27, px * 10, px * 2);

          // Glowing orb (animated)
          const orbPulse = Math.sin(frameCountRef.current * 0.12) * 0.3 + 0.7;
          const orbSize = 10 + Math.sin(frameCountRef.current * 0.1) * 2;

          // Outer glow
          ctx.fillStyle = `rgba(236, 72, 153, ${orbPulse * 0.3})`;
          ctx.beginPath();
          ctx.arc(x + size / 2, y + 18, orbSize + 4, 0, Math.PI * 2);
          ctx.fill();

          // Main orb
          ctx.fillStyle = `rgba(236, 72, 153, ${orbPulse})`;
          ctx.beginPath();
          ctx.arc(x + size / 2, y + 18, orbSize, 0, Math.PI * 2);
          ctx.fill();

          // Inner shine
          ctx.fillStyle = '#fdf4ff';
          ctx.beginPath();
          ctx.arc(x + size / 2 - 3, y + 15, 3, 0, Math.PI * 2);
          ctx.fill();

          // Sparkle particles
          if (orbPulse > 0.8) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + 12, y + 9, px, px);
            ctx.fillRect(x + 30, y + 12, px, px);
            ctx.fillRect(x + 18, y + 24, px, px);
          }
        }
        break;

      case TILE_RUG:
        if (state.isPixelMode) {
          // Pixel art oriental rug pattern
          const pxR = 4;
          // Base color
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(x, y, size, size);
          // Border
          ctx.fillStyle = '#7f1d1d';
          ctx.fillRect(x, y, size, pxR);
          ctx.fillRect(x, y + size - pxR, size, pxR);
          ctx.fillRect(x, y, pxR, size);
          ctx.fillRect(x + size - pxR, y, pxR, size);
          // Inner pattern
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(x + 8, y + 8, pxR, pxR);
          ctx.fillRect(x + size - 12, y + 8, pxR, pxR);
          ctx.fillRect(x + 8, y + size - 12, pxR, pxR);
          ctx.fillRect(x + size - 12, y + size - 12, pxR, pxR);
          // Center diamond
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(x + 20, y + 16, 8, 16);
          ctx.fillRect(x + 16, y + 20, 16, 8);
          ctx.fillStyle = '#fcd34d';
          ctx.fillRect(x + 22, y + 22, 4, 4);
        } else {
          ctx.fillStyle = COLORS.rug;
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = '#7f1d1d';
          ctx.fillRect(x + 4, y + 4, size - 8, size - 8);
        }
        break;
      case TILE_FLOWER:
        if (state.isPixelMode) {
          // Pokemon-style flower garden patch
          const px = 3;

          // Bright grass background (same as regular grass)
          ctx.fillStyle = '#7ec850';
          ctx.fillRect(x, y, size, size);

          // Multiple small flowers (like reference garden)
          const flowerPositions = [
            { fx: 6, fy: 12, color: '#ff6b6b' },   // red
            { fx: 24, fy: 9, color: '#ffd93d' },   // yellow
            { fx: 15, fy: 24, color: '#6bcfff' },  // blue
            { fx: 33, fy: 21, color: '#ff8fab' },  // pink
            { fx: 21, fy: 36, color: '#ffd93d' },  // yellow
          ];

          for (const flower of flowerPositions) {
            // Stem
            ctx.fillStyle = '#228b22';
            ctx.fillRect(x + flower.fx + px, y + flower.fy + px * 2, px, px * 3);
            // Petals
            ctx.fillStyle = flower.color;
            ctx.fillRect(x + flower.fx, y + flower.fy + px, px, px); // left
            ctx.fillRect(x + flower.fx + px * 2, y + flower.fy + px, px, px); // right
            ctx.fillRect(x + flower.fx + px, y + flower.fy, px, px); // top
            ctx.fillRect(x + flower.fx + px, y + flower.fy + px * 2, px, px); // bottom
            // Center
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(x + flower.fx + px, y + flower.fy + px, px, px);
          }
        } else {
          ctx.fillStyle = COLORS.grass;
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = COLORS.flower;
          ctx.beginPath();
          ctx.arc(x + size / 2, y + size / 2, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case TILE_PIXEL_TREE:
        // Pallet Town sprite sheet style decorative tree
        const pxPT = 3;

        // Grass background
        ctx.fillStyle = '#7ec850';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#4a8c44';
        ctx.fillRect(x + 9, y + 39, pxPT, pxPT);
        ctx.fillRect(x + 33, y + 36, pxPT, pxPT);

        // Tree trunk
        ctx.fillStyle = '#5c3a21';
        ctx.fillRect(x + 18, y + 30, pxPT * 4, pxPT * 6);
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(x + 19, y + 30, pxPT * 3, pxPT * 6);
        ctx.fillStyle = '#a67c52';
        ctx.fillRect(x + 21, y + 32, pxPT, pxPT * 3);

        // Cloud canopy - dark base
        ctx.fillStyle = '#2d5a27';
        ctx.fillRect(x + 3, y + 24, pxPT * 4, pxPT * 3);
        ctx.fillRect(x + 33, y + 24, pxPT * 4, pxPT * 3);
        ctx.fillRect(x + 12, y + 27, pxPT * 6, pxPT * 2);
        ctx.fillRect(x + 24, y + 27, pxPT * 6, pxPT * 2);
        ctx.fillRect(x + 0, y + 15, pxPT * 5, pxPT * 4);
        ctx.fillRect(x + 33, y + 15, pxPT * 5, pxPT * 4);
        ctx.fillRect(x + 6, y + 18, pxPT * 12, pxPT * 4);
        ctx.fillRect(x + 24, y + 18, pxPT * 12, pxPT * 4);
        ctx.fillRect(x + 6, y + 6, pxPT * 6, pxPT * 4);
        ctx.fillRect(x + 30, y + 6, pxPT * 6, pxPT * 4);
        ctx.fillRect(x + 15, y + 3, pxPT * 6, pxPT * 5);
        ctx.fillRect(x + 21, y + 0, pxPT * 4, pxPT * 4);

        // Medium layer
        ctx.fillStyle = '#4a8c44';
        ctx.fillRect(x + 6, y + 24, pxPT * 4, pxPT * 2);
        ctx.fillRect(x + 30, y + 24, pxPT * 4, pxPT * 2);
        ctx.fillRect(x + 15, y + 24, pxPT * 6, pxPT * 2);
        ctx.fillRect(x + 3, y + 15, pxPT * 5, pxPT * 3);
        ctx.fillRect(x + 33, y + 15, pxPT * 4, pxPT * 3);
        ctx.fillRect(x + 9, y + 15, pxPT * 10, pxPT * 4);
        ctx.fillRect(x + 24, y + 15, pxPT * 8, pxPT * 4);
        ctx.fillRect(x + 9, y + 9, pxPT * 6, pxPT * 3);
        ctx.fillRect(x + 27, y + 9, pxPT * 6, pxPT * 3);
        ctx.fillRect(x + 18, y + 6, pxPT * 6, pxPT * 4);

        // Light highlights
        ctx.fillStyle = '#7ec850';
        ctx.fillRect(x + 9, y + 21, pxPT * 3, pxPT * 2);
        ctx.fillRect(x + 6, y + 15, pxPT * 4, pxPT * 2);
        ctx.fillRect(x + 12, y + 12, pxPT * 5, pxPT * 3);
        ctx.fillRect(x + 18, y + 9, pxPT * 4, pxPT * 3);
        ctx.fillRect(x + 21, y + 3, pxPT * 3, pxPT * 3);

        // Bright spots
        ctx.fillStyle = '#a8d86e';
        ctx.fillRect(x + 12, y + 15, pxPT * 2, pxPT);
        ctx.fillRect(x + 18, y + 12, pxPT * 2, pxPT);
        ctx.fillRect(x + 21, y + 6, pxPT * 2, pxPT);
        break;
      case TILE_PORTAL:
        // Draw path background
        ctx.fillStyle = COLORS.path;
        ctx.fillRect(x, y, size, size);

        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const time = frameCountRef.current * 0.05;

        // Outer glow (pulsing)
        const glowSize = 20 + Math.sin(time) * 3;
        ctx.globalAlpha = 0.3 + Math.sin(time * 0.5) * 0.1;
        ctx.fillStyle = COLORS.portalGlow;
        ctx.beginPath();
        ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Outer ring - rotating pixel squares
        const outerRadius = 16;
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + time;
          const px3 = centerX + Math.cos(angle) * outerRadius - 3;
          const py3 = centerY + Math.sin(angle) * outerRadius - 3;
          ctx.fillStyle = i % 2 === 0 ? COLORS.portalOuter : COLORS.portalMid;
          ctx.fillRect(px3, py3, 6, 6);
        }

        // Middle ring - counter-rotating
        const midRadius = 10;
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 - time * 1.5;
          const px4 = centerX + Math.cos(angle) * midRadius - 2;
          const py4 = centerY + Math.sin(angle) * midRadius - 2;
          ctx.fillStyle = i % 2 === 0 ? COLORS.portalMid : COLORS.portalInner;
          ctx.fillRect(px4, py4, 4, 4);
        }

        // Inner core - pulsing
        const coreSize = 6 + Math.sin(time * 2) * 2;
        ctx.fillStyle = COLORS.portalCore;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle effect
        const sparkleAngle = time * 3;
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.8;
        ctx.fillRect(centerX + Math.cos(sparkleAngle) * 8 - 1, centerY + Math.sin(sparkleAngle) * 8 - 1, 3, 3);
        ctx.fillRect(centerX + Math.cos(sparkleAngle + Math.PI) * 8 - 1, centerY + Math.sin(sparkleAngle + Math.PI) * 8 - 1, 3, 3);
        ctx.globalAlpha = 1;

        // Label based on current mode
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(state.isPixelMode ? '8-BIT' : 'PIXEL', centerX, y + size - 4);
        break;
      case TILE_FENCE:
        // Pallet Town sprite sheet style wooden fence
        const pxFence = 3;

        // Grass background
        ctx.fillStyle = state.isPixelMode ? '#7ec850' : COLORS.grass;
        ctx.fillRect(x, y, size, size);

        // Fence posts (vertical)
        const postColor1 = state.isPixelMode ? '#5c3a21' : '#78350f';
        const postColor2 = state.isPixelMode ? '#8b5a2b' : '#92400e';
        const postColor3 = state.isPixelMode ? '#a67c52' : '#b45309';

        // Left post
        ctx.fillStyle = postColor1;
        ctx.fillRect(x + 3, y + 12, pxFence * 3, pxFence * 10);
        ctx.fillStyle = postColor2;
        ctx.fillRect(x + 6, y + 12, pxFence * 2, pxFence * 10);
        ctx.fillStyle = postColor3;
        ctx.fillRect(x + 6, y + 15, pxFence, pxFence * 6);
        // Post top
        ctx.fillStyle = postColor1;
        ctx.fillRect(x + 3, y + 9, pxFence * 3, pxFence);
        ctx.fillRect(x + 6, y + 6, pxFence, pxFence);

        // Right post
        ctx.fillStyle = postColor1;
        ctx.fillRect(x + 36, y + 12, pxFence * 3, pxFence * 10);
        ctx.fillStyle = postColor2;
        ctx.fillRect(x + 36, y + 12, pxFence * 2, pxFence * 10);
        ctx.fillStyle = postColor3;
        ctx.fillRect(x + 39, y + 15, pxFence, pxFence * 6);
        // Post top
        ctx.fillStyle = postColor1;
        ctx.fillRect(x + 36, y + 9, pxFence * 3, pxFence);
        ctx.fillRect(x + 39, y + 6, pxFence, pxFence);

        // Horizontal rails
        ctx.fillStyle = postColor1;
        ctx.fillRect(x, y + 15, size, pxFence * 2);
        ctx.fillRect(x, y + 30, size, pxFence * 2);
        ctx.fillStyle = postColor2;
        ctx.fillRect(x, y + 15, size, pxFence);
        ctx.fillRect(x, y + 30, size, pxFence);
        ctx.fillStyle = postColor3;
        ctx.fillRect(x + 12, y + 15, pxFence * 4, pxFence);
        ctx.fillRect(x + 12, y + 30, pxFence * 4, pxFence);
        break;

      // ============ BIG OAK TREE (2x2 tiles) ============
      case TILE_OAK_CANOPY_L:
        // Top-left canopy of big oak tree
        {
          const px = 3;
          // Grass background
          ctx.fillStyle = state.isPixelMode ? '#7ec850' : COLORS.grass;
          ctx.fillRect(x, y, size, size);

          if (state.isPixelMode) {
            // Dark canopy base (extends from right)
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(x + 6, y + 12, size - 6, size - 12);
            ctx.fillRect(x + 12, y + 6, size - 12, size - 6);
            ctx.fillRect(x + 18, y + 3, size - 18, size - 3);
            ctx.fillRect(x + 30, y, size - 30, size);
            // Left edge puffs
            ctx.fillRect(x, y + 24, px * 4, px * 6);
            ctx.fillRect(x + 3, y + 18, px * 4, px * 4);

            // Medium green layer
            ctx.fillStyle = '#4a8c44';
            ctx.fillRect(x + 12, y + 15, size - 15, size - 18);
            ctx.fillRect(x + 18, y + 9, size - 21, size - 12);
            ctx.fillRect(x + 24, y + 6, size - 27, size - 9);
            ctx.fillRect(x + 6, y + 24, px * 6, px * 6);

            // Light green highlights
            ctx.fillStyle = '#7ec850';
            ctx.fillRect(x + 15, y + 18, px * 6, px * 4);
            ctx.fillRect(x + 21, y + 12, px * 5, px * 4);
            ctx.fillRect(x + 27, y + 9, px * 4, px * 3);
            ctx.fillRect(x + 9, y + 27, px * 4, px * 3);

            // Bright highlights
            ctx.fillStyle = '#a8d86e';
            ctx.fillRect(x + 18, y + 21, px * 2, px * 2);
            ctx.fillRect(x + 27, y + 15, px * 2, px);
            ctx.fillRect(x + 12, y + 30, px * 2, px);
          } else {
            ctx.fillStyle = COLORS.tree;
            ctx.beginPath();
            ctx.arc(x + size, y + size, size * 0.9, Math.PI, Math.PI * 1.5);
            ctx.fill();
          }
        }
        break;

      case TILE_OAK_CANOPY_R:
        // Top-right canopy of big oak tree
        {
          const px = 3;
          ctx.fillStyle = state.isPixelMode ? '#7ec850' : COLORS.grass;
          ctx.fillRect(x, y, size, size);

          if (state.isPixelMode) {
            // Dark canopy base
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(x, y + 12, size - 6, size - 12);
            ctx.fillRect(x, y + 6, size - 12, size - 6);
            ctx.fillRect(x, y + 3, size - 18, size - 3);
            ctx.fillRect(x, y, size - 30, size);
            // Right edge puffs
            ctx.fillRect(x + size - 12, y + 24, px * 4, px * 6);
            ctx.fillRect(x + size - 15, y + 18, px * 4, px * 4);

            // Medium green
            ctx.fillStyle = '#4a8c44';
            ctx.fillRect(x + 3, y + 15, size - 15, size - 18);
            ctx.fillRect(x + 6, y + 9, size - 21, size - 12);
            ctx.fillRect(x + 9, y + 6, size - 27, size - 9);
            ctx.fillRect(x + size - 18, y + 24, px * 6, px * 6);

            // Light highlights
            ctx.fillStyle = '#7ec850';
            ctx.fillRect(x + 9, y + 18, px * 6, px * 4);
            ctx.fillRect(x + 12, y + 12, px * 5, px * 4);
            ctx.fillRect(x + 15, y + 9, px * 4, px * 3);

            // Bright highlights
            ctx.fillStyle = '#a8d86e';
            ctx.fillRect(x + 12, y + 21, px * 2, px * 2);
            ctx.fillRect(x + 18, y + 15, px * 2, px);
          } else {
            ctx.fillStyle = COLORS.tree;
            ctx.beginPath();
            ctx.arc(x, y + size, size * 0.9, Math.PI * 1.5, 0);
            ctx.fill();
          }
        }
        break;

      case TILE_OAK_TRUNK_L:
        // Bottom-left of oak tree (trunk left + canopy bottom)
        {
          const px = 3;
          ctx.fillStyle = state.isPixelMode ? '#7ec850' : COLORS.grass;
          ctx.fillRect(x, y, size, size);

          if (state.isPixelMode) {
            // Grass detail
            ctx.fillStyle = '#4a8c44';
            ctx.fillRect(x + 3, y + 42, px, px);
            ctx.fillRect(x + 12, y + 39, px, px);

            // Lower canopy (dark)
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(x, y, size, px * 8);
            ctx.fillRect(x + 6, y, size - 6, px * 10);
            ctx.fillRect(x + 24, y, size - 24, px * 12);

            // Lower canopy (medium)
            ctx.fillStyle = '#4a8c44';
            ctx.fillRect(x + 9, y, size - 12, px * 6);
            ctx.fillRect(x + 27, y, size - 30, px * 8);

            // Tree trunk (on right side, extends to next tile)
            ctx.fillStyle = '#5c3a21';
            ctx.fillRect(x + 33, y + 18, px * 5, size - 18);
            ctx.fillStyle = '#8b5a2b';
            ctx.fillRect(x + 36, y + 18, px * 3, size - 18);
            ctx.fillStyle = '#a67c52';
            ctx.fillRect(x + 39, y + 24, px * 2, size - 30);

            // Trunk roots
            ctx.fillStyle = '#5c3a21';
            ctx.fillRect(x + 30, y + size - 6, px * 2, px * 2);
          } else {
            ctx.fillStyle = COLORS.tree;
            ctx.fillRect(x + 6, y, size - 6, size / 3);
            ctx.fillStyle = COLORS.treeTrunk;
            ctx.fillRect(x + size - 15, y + size / 3, 12, size * 2 / 3);
          }
        }
        break;

      case TILE_OAK_TRUNK_R:
        // Bottom-right of oak tree (trunk right + canopy bottom)
        {
          const px = 3;
          ctx.fillStyle = state.isPixelMode ? '#7ec850' : COLORS.grass;
          ctx.fillRect(x, y, size, size);

          if (state.isPixelMode) {
            // Grass detail
            ctx.fillStyle = '#4a8c44';
            ctx.fillRect(x + 33, y + 42, px, px);
            ctx.fillRect(x + 24, y + 39, px, px);

            // Lower canopy (dark)
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(x, y, size, px * 8);
            ctx.fillRect(x, y, size - 6, px * 10);
            ctx.fillRect(x, y, size - 24, px * 12);

            // Lower canopy (medium)
            ctx.fillStyle = '#4a8c44';
            ctx.fillRect(x + 3, y, size - 12, px * 6);
            ctx.fillRect(x + 6, y, size - 30, px * 8);

            // Tree trunk (on left side, continues from previous tile)
            ctx.fillStyle = '#5c3a21';
            ctx.fillRect(x, y + 18, px * 5, size - 18);
            ctx.fillStyle = '#8b5a2b';
            ctx.fillRect(x, y + 18, px * 3, size - 18);
            ctx.fillStyle = '#a67c52';
            ctx.fillRect(x + 3, y + 24, px * 2, size - 30);

            // Trunk roots
            ctx.fillStyle = '#5c3a21';
            ctx.fillRect(x + 12, y + size - 6, px * 2, px * 2);
          } else {
            ctx.fillStyle = COLORS.tree;
            ctx.fillRect(x, y, size - 6, size / 3);
            ctx.fillStyle = COLORS.treeTrunk;
            ctx.fillRect(x + 3, y + size / 3, 12, size * 2 / 3);
          }
        }
        break;

      // ============ TALL PINE TREE (1x2 tiles) ============
      case TILE_PINE_TOP:
        // Top part of pine tree
        {
          const px = 3;
          ctx.fillStyle = state.isPixelMode ? '#7ec850' : COLORS.grass;
          ctx.fillRect(x, y, size, size);

          if (state.isPixelMode) {
            // Pine tree top - pointed triangle shape
            // Darkest layer (outer edge)
            ctx.fillStyle = '#1e4d2b';
            ctx.fillRect(x + 21, y + 3, px * 2, px);       // tip
            ctx.fillRect(x + 18, y + 6, px * 4, px);
            ctx.fillRect(x + 15, y + 9, px * 6, px * 2);
            ctx.fillRect(x + 12, y + 12, px * 8, px * 2);
            ctx.fillRect(x + 9, y + 15, px * 10, px * 2);
            ctx.fillRect(x + 6, y + 18, px * 12, px * 2);
            ctx.fillRect(x + 3, y + 21, px * 14, px * 3);
            ctx.fillRect(x + 6, y + 27, px * 12, px * 3);
            ctx.fillRect(x + 9, y + 33, px * 10, px * 3);
            ctx.fillRect(x + 3, y + 39, px * 14, px * 3);
            ctx.fillRect(x, y + 45, px * 16, px * 3);

            // Medium green layer
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(x + 18, y + 9, px * 4, px);
            ctx.fillRect(x + 15, y + 12, px * 6, px);
            ctx.fillRect(x + 12, y + 15, px * 8, px);
            ctx.fillRect(x + 9, y + 18, px * 10, px);
            ctx.fillRect(x + 9, y + 24, px * 10, px * 2);
            ctx.fillRect(x + 12, y + 33, px * 8, px * 2);
            ctx.fillRect(x + 6, y + 42, px * 12, px * 2);

            // Light green highlights
            ctx.fillStyle = '#4a8c44';
            ctx.fillRect(x + 18, y + 12, px * 3, px);
            ctx.fillRect(x + 15, y + 15, px * 4, px);
            ctx.fillRect(x + 12, y + 21, px * 5, px);
            ctx.fillRect(x + 15, y + 36, px * 4, px);
            ctx.fillRect(x + 12, y + 45, px * 6, px);

            // Bright highlight
            ctx.fillStyle = '#7ec850';
            ctx.fillRect(x + 18, y + 18, px * 2, px);
            ctx.fillRect(x + 15, y + 27, px * 2, px);
          } else {
            ctx.fillStyle = COLORS.tree;
            ctx.beginPath();
            ctx.moveTo(x + size / 2, y);
            ctx.lineTo(x + size, y + size);
            ctx.lineTo(x, y + size);
            ctx.closePath();
            ctx.fill();
          }
        }
        break;

      case TILE_PINE_BOTTOM:
        // Bottom part of pine tree (trunk + lower branches)
        {
          const px = 3;
          ctx.fillStyle = state.isPixelMode ? '#7ec850' : COLORS.grass;
          ctx.fillRect(x, y, size, size);

          if (state.isPixelMode) {
            // Grass details
            ctx.fillStyle = '#4a8c44';
            ctx.fillRect(x + 6, y + 42, px, px);
            ctx.fillRect(x + 33, y + 39, px, px);

            // Lower pine branches (dark)
            ctx.fillStyle = '#1e4d2b';
            ctx.fillRect(x, y, px * 16, px * 3);
            ctx.fillRect(x + 3, y + 6, px * 14, px * 3);
            ctx.fillRect(x + 6, y + 12, px * 12, px * 3);
            ctx.fillRect(x + 9, y + 18, px * 10, px * 2);

            // Medium layer
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(x + 3, y, px * 14, px * 2);
            ctx.fillRect(x + 6, y + 6, px * 12, px * 2);
            ctx.fillRect(x + 9, y + 12, px * 10, px * 2);

            // Light highlights
            ctx.fillStyle = '#4a8c44';
            ctx.fillRect(x + 9, y + 3, px * 8, px);
            ctx.fillRect(x + 12, y + 9, px * 6, px);
            ctx.fillRect(x + 15, y + 15, px * 4, px);

            // Tree trunk
            ctx.fillStyle = '#5c3a21';
            ctx.fillRect(x + 18, y + 21, px * 4, size - 21);
            ctx.fillStyle = '#8b5a2b';
            ctx.fillRect(x + 21, y + 21, px * 2, size - 21);
            ctx.fillStyle = '#a67c52';
            ctx.fillRect(x + 24, y + 27, px, size - 33);

            // Trunk roots
            ctx.fillStyle = '#5c3a21';
            ctx.fillRect(x + 15, y + size - 6, px * 2, px * 2);
            ctx.fillRect(x + 27, y + size - 6, px * 2, px * 2);
          } else {
            ctx.fillStyle = COLORS.tree;
            ctx.beginPath();
            ctx.moveTo(x + size / 2, y - size / 2);
            ctx.lineTo(x + size, y + size / 2);
            ctx.lineTo(x, y + size / 2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = COLORS.treeTrunk;
            ctx.fillRect(x + size / 2 - 6, y + size / 2, 12, size / 2);
          }
        }
        break;

      case TILE_BUSH:
        // Bush tile for boundaries - rounded shrub
        {
          const px = 3;

          // Grass background
          ctx.fillStyle = state.isPixelMode ? '#7ec850' : COLORS.grass;
          ctx.fillRect(x, y, size, size);

          if (state.isPixelMode) {
            // Bush shadow/base (dark green)
            ctx.fillStyle = '#1e4d2b';
            ctx.fillRect(x + 6, y + 12, size - 12, size - 18);
            ctx.fillRect(x + 3, y + 18, size - 6, size - 24);
            ctx.fillRect(x + 9, y + 9, size - 18, size - 15);

            // Bush body (medium green)
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(x + 9, y + 12, size - 18, size - 21);
            ctx.fillRect(x + 6, y + 18, size - 12, size - 27);
            ctx.fillRect(x + 12, y + 9, size - 24, size - 18);

            // Bush highlights (light green)
            ctx.fillStyle = '#4a8c44';
            ctx.fillRect(x + 12, y + 15, size - 27, size - 30);
            ctx.fillRect(x + 15, y + 12, size - 33, size - 27);
            ctx.fillRect(x + 9, y + 21, size - 24, px * 3);

            // Bright spots
            ctx.fillStyle = '#7ec850';
            ctx.fillRect(x + 15, y + 15, px * 3, px * 2);
            ctx.fillRect(x + 24, y + 18, px * 2, px * 2);
            ctx.fillRect(x + 12, y + 24, px * 2, px);

            // Very bright highlights
            ctx.fillStyle = '#a8d86e';
            ctx.fillRect(x + 18, y + 15, px, px);
            ctx.fillRect(x + 27, y + 21, px, px);
          } else {
            // Simple bush for non-pixel mode
            ctx.fillStyle = '#166534';
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2 + 6, size / 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.arc(x + size / 2 - 4, y + size / 2 + 2, size / 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;

      // ============ INTERIOR TILES - ABOUT (Cozy Home) ============
      case TILE_BOOKSHELF:
        {
          const px = 3;
          // Warm wallpaper background
          ctx.fillStyle = '#f5f0e6';
          ctx.fillRect(x, y, size, size);
          // Bookshelf frame (dark wood) - fills most of the tile
          ctx.fillStyle = '#5c3a21';
          ctx.fillRect(x + 3, y + 3, size - 6, size - 6);
          // Shelves
          ctx.fillStyle = '#8b5a2b';
          ctx.fillRect(x + 6, y + 12, size - 12, px);
          ctx.fillRect(x + 6, y + 27, size - 12, px);
          ctx.fillRect(x + 6, y + 42, size - 12, px);
          // Books (colorful spines)
          const bookColors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];
          for (let i = 0; i < 6; i++) {
            ctx.fillStyle = bookColors[i % bookColors.length];
            ctx.fillRect(x + 6 + i * 5, y + 6, px + 1, px * 2);
            ctx.fillRect(x + 6 + i * 5, y + 15, px + 1, px * 4);
            ctx.fillRect(x + 6 + i * 5, y + 30, px + 1, px * 4);
          }
        }
        break;

      case TILE_DESK:
        {
          const px = 3;
          // Wooden floor background
          ctx.fillStyle = '#c9a66b';
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = '#a67c52';
          ctx.fillRect(x, y + 12, size, 1);
          ctx.fillRect(x, y + 24, size, 1);
          ctx.fillRect(x, y + 36, size, 1);
          // Desk surface (wood)
          ctx.fillStyle = '#8b5a2b';
          ctx.fillRect(x + 3, y + 18, size - 6, px * 4);
          // Desk top highlight
          ctx.fillStyle = '#a67c52';
          ctx.fillRect(x + 3, y + 18, size - 6, px);
          // Desk legs
          ctx.fillStyle = '#5c3a21';
          ctx.fillRect(x + 6, y + 30, px * 2, size - 30);
          ctx.fillRect(x + size - 12, y + 30, px * 2, size - 30);
          // Small lamp on desk
          ctx.fillStyle = '#fcd34d';
          ctx.fillRect(x + 12, y + 9, px * 3, px * 3);
          ctx.fillStyle = '#374151';
          ctx.fillRect(x + 13, y + 12, px * 2, px * 2);
        }
        break;

      case TILE_PLANT_POT:
        {
          const px = 3;
          // Wooden floor background
          ctx.fillStyle = '#c9a66b';
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = '#a67c52';
          ctx.fillRect(x, y + 12, size, 1);
          ctx.fillRect(x, y + 24, size, 1);
          ctx.fillRect(x, y + 36, size, 1);
          // Pot (terracotta)
          ctx.fillStyle = '#b45309';
          ctx.fillRect(x + 12, y + 30, px * 8, px * 5);
          ctx.fillStyle = '#d97706';
          ctx.fillRect(x + 12, y + 30, px * 8, px);
          // Plant leaves
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(x + 18, y + 12, px * 2, px * 6);
          ctx.fillRect(x + 12, y + 15, px * 3, px * 4);
          ctx.fillRect(x + 27, y + 15, px * 3, px * 4);
          ctx.fillRect(x + 15, y + 9, px * 3, px * 3);
          ctx.fillRect(x + 24, y + 9, px * 3, px * 3);
          // Leaf highlights
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(x + 13, y + 16, px, px * 2);
          ctx.fillRect(x + 28, y + 16, px, px * 2);
        }
        break;

      case TILE_COUCH:
        {
          const px = 3;
          // Wooden floor background
          ctx.fillStyle = '#c9a66b';
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = '#a67c52';
          ctx.fillRect(x, y + 36, size, 1);
          // Couch back
          ctx.fillStyle = '#7c3aed';
          ctx.fillRect(x + 3, y + 6, size - 6, px * 6);
          // Couch seat
          ctx.fillStyle = '#8b5cf6';
          ctx.fillRect(x + 3, y + 18, size - 6, px * 6);
          // Couch arms
          ctx.fillStyle = '#6d28d9';
          ctx.fillRect(x + 3, y + 12, px * 3, px * 8);
          ctx.fillRect(x + size - 12, y + 12, px * 3, px * 8);
          // Cushion details
          ctx.fillStyle = '#a78bfa';
          ctx.fillRect(x + 15, y + 9, px * 5, px * 3);
        }
        break;

      case TILE_CARPET:
        {
          const px = 3;
          // Carpet base (warm beige)
          ctx.fillStyle = '#d4a574';
          ctx.fillRect(x, y, size, size);
          // Carpet pattern
          ctx.fillStyle = '#b8956e';
          ctx.fillRect(x + 6, y + 6, px * 2, px * 2);
          ctx.fillRect(x + 24, y + 6, px * 2, px * 2);
          ctx.fillRect(x + 6, y + 24, px * 2, px * 2);
          ctx.fillRect(x + 24, y + 24, px * 2, px * 2);
          ctx.fillRect(x + 15, y + 15, px * 6, px * 6);
          // Border hint
          ctx.fillStyle = '#a67c52';
          ctx.fillRect(x, y, size, px);
          ctx.fillRect(x, y + size - px, size, px);
        }
        break;

      case TILE_LAMP:
        {
          const px = 3;
          // Wooden floor background
          ctx.fillStyle = '#c9a66b';
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = '#a67c52';
          ctx.fillRect(x, y + 12, size, 1);
          ctx.fillRect(x, y + 24, size, 1);
          ctx.fillRect(x, y + 36, size, 1);
          // Lamp pole
          ctx.fillStyle = '#374151';
          ctx.fillRect(x + 21, y + 18, px * 2, size - 18);
          // Lamp shade
          ctx.fillStyle = '#fef3c7';
          ctx.fillRect(x + 12, y + 6, px * 8, px * 5);
          // Lamp glow
          ctx.fillStyle = '#fcd34d';
          ctx.fillRect(x + 15, y + 9, px * 5, px * 2);
          // Lamp base
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(x + 15, y + size - 6, px * 6, px * 2);
        }
        break;

      case TILE_PICTURE_FRAME:
        {
          const px = 3;
          // Warm wallpaper background
          ctx.fillStyle = '#f5f0e6';
          ctx.fillRect(x, y, size, size);
          // Wallpaper stripes
          ctx.fillStyle = '#ebe5d9';
          ctx.fillRect(x + 6, y, px, size);
          ctx.fillRect(x + 18, y, px, size);
          ctx.fillRect(x + 30, y, px, size);
          ctx.fillRect(x + 42, y, px, size);
          // Wainscoting at bottom
          ctx.fillStyle = '#8b5a2b';
          ctx.fillRect(x, y + 30, size, size - 30);
          ctx.fillStyle = '#5c3a21';
          ctx.fillRect(x, y + 27, size, px * 2);
          // Frame (gold)
          ctx.fillStyle = '#d4af37';
          ctx.fillRect(x + 9, y + 9, px * 10, px * 10);
          // Picture inside
          ctx.fillStyle = '#1e3a5f';
          ctx.fillRect(x + 12, y + 12, px * 8, px * 7);
          // Simple landscape
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(x + 12, y + 24, px * 8, px * 3);
          ctx.fillStyle = '#fcd34d';
          ctx.fillRect(x + 27, y + 15, px * 2, px * 2);
        }
        break;

      // ============ INTERIOR TILES - PROJECTS (Tech Lab) ============
      case TILE_COMPUTER:
        {
          const px = 3;
          // Metallic floor background
          ctx.fillStyle = '#2d3444';
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = '#3d4555';
          ctx.fillRect(x + 15, y + 39, 6, 6);
          ctx.fillRect(x + 33, y + 39, 6, 6);
          // Desk
          ctx.fillStyle = '#374151';
          ctx.fillRect(x + 3, y + 30, size - 6, px * 5);
          // Monitor frame
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(x + 9, y + 6, px * 10, px * 8);
          // Screen (glowing)
          const glow = Math.sin(frameCountRef.current * 0.1) * 0.2 + 0.8;
          ctx.fillStyle = `rgba(57, 255, 20, ${glow})`;
          ctx.fillRect(x + 12, y + 9, px * 8, px * 5);
          // Code lines on screen
          ctx.fillStyle = '#39ff14';
          ctx.fillRect(x + 13, y + 10, px * 4, px);
          ctx.fillRect(x + 13, y + 13, px * 6, px);
          ctx.fillRect(x + 13, y + 16, px * 3, px);
          // Keyboard
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(x + 12, y + 33, px * 8, px * 3);
          ctx.fillStyle = '#374151';
          for (let i = 0; i < 6; i++) {
            ctx.fillRect(x + 13 + i * 3, y + 34, px - 1, px);
          }
        }
        break;

      case TILE_SERVER_RACK:
        {
          const px = 3;
          // Dark industrial wall background
          ctx.fillStyle = '#1a1f2e';
          ctx.fillRect(x, y, size, size);
          // Panel pattern
          ctx.fillStyle = '#252b3b';
          ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
          // Server cabinet
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(x + 3, y + 3, size - 6, size - 6);
          // Server units
          for (let i = 0; i < 4; i++) {
            ctx.fillStyle = '#374151';
            ctx.fillRect(x + 6, y + 6 + i * 10, size - 12, px * 3);
            // Blinking lights
            const lightOn = (frameCountRef.current + i * 10) % 30 < 15;
            ctx.fillStyle = lightOn ? '#39ff14' : '#064e3b';
            ctx.fillRect(x + 9, y + 8 + i * 10, px, px);
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(x + 15, y + 8 + i * 10, px, px);
          }
          // Ventilation
          ctx.fillStyle = '#111827';
          for (let i = 0; i < 3; i++) {
            ctx.fillRect(x + 24 + i * 4, y + 9, px, px * 10);
          }
        }
        break;

      case TILE_MONITOR_WALL:
        {
          const px = 3;
          // Dark industrial wall background
          ctx.fillStyle = '#1a1f2e';
          ctx.fillRect(x, y, size, size);
          // Panel pattern
          ctx.fillStyle = '#252b3b';
          ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
          // Large monitor frame
          ctx.fillStyle = '#111827';
          ctx.fillRect(x + 3, y + 6, size - 6, size - 15);
          // Screen
          ctx.fillStyle = '#1e3a5f';
          ctx.fillRect(x + 6, y + 9, size - 12, size - 21);
          // Data visualization
          ctx.fillStyle = '#39ff14';
          ctx.fillRect(x + 9, y + 12, px * 2, px * 6);
          ctx.fillRect(x + 15, y + 15, px * 2, px * 5);
          ctx.fillRect(x + 21, y + 9, px * 2, px * 8);
          ctx.fillRect(x + 27, y + 18, px * 2, px * 4);
          // Title bar
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(x + 6, y + 9, size - 12, px);
        }
        break;

      case TILE_LAB_FLOOR:
        {
          const px = 3;
          // Metallic floor base
          ctx.fillStyle = '#2d3444';
          ctx.fillRect(x, y, size, size);
          // Diamond plate pattern
          ctx.fillStyle = '#3d4555';
          ctx.fillRect(x + 3, y + 3, 6, 6);
          ctx.fillRect(x + 15, y + 15, 6, 6);
          ctx.fillRect(x + 27, y + 27, 6, 6);
          ctx.fillRect(x + 39, y + 3, 6, 6);
          ctx.fillRect(x + 3, y + 39, 6, 6);
          // Grid lines
          ctx.fillStyle = '#1e2430';
          ctx.fillRect(x, y, size, 1);
          ctx.fillRect(x, y, 1, size);
          // Subtle glow spots
          ctx.fillStyle = 'rgba(57, 255, 20, 0.08)';
          ctx.fillRect(x + 18, y + 18, px * 4, px * 4);
        }
        break;

      case TILE_DESK_TECH:
        {
          const px = 3;
          // Metallic floor background
          ctx.fillStyle = '#2d3444';
          ctx.fillRect(x, y, size, size);
          ctx.fillStyle = '#3d4555';
          ctx.fillRect(x + 15, y + 3, 6, 6);
          // Tech desk surface
          ctx.fillStyle = '#374151';
          ctx.fillRect(x, y + 21, size, px * 5);
          ctx.fillStyle = '#4b5563';
          ctx.fillRect(x, y + 21, size, px);
          // LED strip
          ctx.fillStyle = '#39ff14';
          ctx.fillRect(x + 3, y + 33, size - 6, px);
          // Desk legs
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(x + 6, y + 36, px * 2, size - 36);
          ctx.fillRect(x + size - 12, y + 36, px * 2, size - 36);
        }
        break;

      case TILE_CABLE_FLOOR:
        {
          const px = 3;
          // Metallic floor background
          ctx.fillStyle = '#2d3444';
          ctx.fillRect(x, y, size, size);
          // Cable channels
          ctx.fillStyle = '#111827';
          ctx.fillRect(x + 6, y, px * 3, size);
          ctx.fillRect(x + 24, y, px * 3, size);
          // Cables (colorful)
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(x + 7, y + 6, px, size - 12);
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(x + 25, y + 3, px, size - 6);
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(x + 10, y + 12, px, size - 24);
        }
        break;

      // ============ INTERIOR TILES - SKILLS (Pokemon Center) ============
      case TILE_COUNTER:
        {
          const px = 3;
          // Checkered floor background
          const isLightC = ((Math.floor(x / size) + Math.floor(y / size)) % 2) === 0;
          ctx.fillStyle = isLightC ? '#fef3c7' : '#fde68a';
          ctx.fillRect(x, y, size, size);
          // Counter front
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(x, y + 12, size, size - 12);
          // Counter top
          ctx.fillStyle = '#fef3c7';
          ctx.fillRect(x, y + 12, size, px * 2);
          // White accent stripe
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, y + 21, size, px * 2);
          // Pokeball logo hint
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 18, y + 27, px * 4, px * 4);
          ctx.fillStyle = '#111827';
          ctx.fillRect(x + 19, y + 29, px * 2, px);
        }
        break;

      case TILE_HEALING_MACHINE:
        {
          const px = 3;
          // Pokemon Center wall background
          ctx.fillStyle = '#fef9f3';
          ctx.fillRect(x, y, size, size);
          // Red accent at top
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(x, y, size, px * 3);
          // Machine base
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(x + 6, y + 18, size - 12, size - 18);
          // Machine top
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 6, y + 6, size - 12, px * 5);
          // Healing orb (animated)
          const pulse = Math.sin(frameCountRef.current * 0.15) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(236, 72, 153, ${pulse})`;
          ctx.beginPath();
          ctx.arc(x + size / 2, y + 12, 6, 0, Math.PI * 2);
          ctx.fill();
          // Pokeball slots
          ctx.fillStyle = '#ffffff';
          for (let i = 0; i < 3; i++) {
            ctx.fillRect(x + 10 + i * 10, y + 24, px * 2, px * 2);
          }
        }
        break;

      case TILE_PC_STATION:
        {
          const px = 3;
          // Pokemon Center wall background
          ctx.fillStyle = '#fef9f3';
          ctx.fillRect(x, y, size, size);
          // Red accent at top
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(x, y, size, px * 3);
          // PC unit
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(x + 9, y + 6, px * 10, size - 12);
          // Screen
          ctx.fillStyle = '#1e3a5f';
          ctx.fillRect(x + 12, y + 9, px * 8, px * 8);
          // Screen content (storage boxes)
          ctx.fillStyle = '#60a5fa';
          for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
              ctx.fillRect(x + 14 + j * 6, y + 11 + i * 6, px + 1, px + 1);
            }
          }
          // Keyboard area
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(x + 12, y + 33, px * 8, px * 3);
        }
        break;

      case TILE_POKEBALL_DISPLAY:
        {
          const px = 3;
          // Pokemon Center wall background
          ctx.fillStyle = '#fef9f3';
          ctx.fillRect(x, y, size, size);
          // Red accent at top
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(x, y, size, px * 3);
          // Display shelf
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(x + 6, y + 9, size - 12, size - 12);
          // Shelf levels
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(x + 9, y + 18, size - 18, px);
          ctx.fillRect(x + 9, y + 30, size - 18, px);
          // Pokeballs
          const ballColors = ['#ef4444', '#3b82f6', '#fbbf24'];
          for (let i = 0; i < 3; i++) {
            ctx.fillStyle = ballColors[i];
            ctx.beginPath();
            ctx.arc(x + 15 + i * 8, y + 14, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + 14 + i * 8, y + 14, px, px);
          }
        }
        break;

      case TILE_TILE_FLOOR:
        {
          const px = 3;
          // Checkered tile floor
          const isLight = ((Math.floor(x / size) + Math.floor(y / size)) % 2) === 0;
          ctx.fillStyle = isLight ? '#fef3c7' : '#fde68a';
          ctx.fillRect(x, y, size, size);
          // Subtle grid
          ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx.fillRect(x, y, size, px);
          ctx.fillRect(x, y, px, size);
        }
        break;

      case TILE_BENCH:
        {
          const px = 3;
          // Checkered floor background
          const isLightB = ((Math.floor(x / size) + Math.floor(y / size)) % 2) === 0;
          ctx.fillStyle = isLightB ? '#fef3c7' : '#fde68a';
          ctx.fillRect(x, y, size, size);
          // Bench seat
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(x + 3, y + 21, size - 6, px * 4);
          // Bench back
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(x + 3, y + 12, size - 6, px * 3);
          // Legs
          ctx.fillStyle = '#374151';
          ctx.fillRect(x + 6, y + 33, px * 2, size - 33);
          ctx.fillRect(x + size - 12, y + 33, px * 2, size - 33);
        }
        break;

      // ============ ABOUT BUILDING - Cozy Home Wall & Floor ============
      case TILE_WALL_HOME:
        {
          const px = 3;
          // Warm wallpaper background (cream/beige)
          ctx.fillStyle = '#f5f0e6';
          ctx.fillRect(x, y, size, size);

          // Wallpaper pattern (subtle stripes)
          ctx.fillStyle = '#ebe5d9';
          ctx.fillRect(x + 6, y, px, size);
          ctx.fillRect(x + 18, y, px, size);
          ctx.fillRect(x + 30, y, px, size);
          ctx.fillRect(x + 42, y, px, size);

          // Wainscoting (wood paneling at bottom)
          ctx.fillStyle = '#8b5a2b';
          ctx.fillRect(x, y + 30, size, size - 30);

          // Wainscoting detail lines
          ctx.fillStyle = '#a67c52';
          ctx.fillRect(x, y + 30, size, px);
          ctx.fillRect(x + 12, y + 33, px, size - 36);
          ctx.fillRect(x + 33, y + 33, px, size - 36);

          // Chair rail (dividing line)
          ctx.fillStyle = '#5c3a21';
          ctx.fillRect(x, y + 27, size, px * 2);
          ctx.fillStyle = '#a67c52';
          ctx.fillRect(x, y + 27, size, px);
        }
        break;

      case TILE_FLOOR_WOOD:
        {
          const px = 3;
          // Hardwood floor base
          ctx.fillStyle = '#c9a66b';
          ctx.fillRect(x, y, size, size);

          // Wood plank pattern
          const plankHeight = 12;
          for (let py = 0; py < size; py += plankHeight) {
            // Plank divider line
            ctx.fillStyle = '#a67c52';
            ctx.fillRect(x, y + py, size, 1);

            // Wood grain (subtle)
            ctx.fillStyle = '#d4b87a';
            ctx.fillRect(x + 6, y + py + 3, px * 4, px);
            ctx.fillRect(x + 24, y + py + 6, px * 5, px);
            ctx.fillRect(x + 12, y + py + 9, px * 3, px);
          }

          // Subtle edge shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx.fillRect(x, y, px, size);
        }
        break;

      // ============ PROJECTS BUILDING - Tech Lab Wall & Floor ============
      case TILE_WALL_LAB:
        {
          const px = 3;
          // Dark industrial wall base
          ctx.fillStyle = '#1a1f2e';
          ctx.fillRect(x, y, size, size);

          // Metal panel pattern
          ctx.fillStyle = '#252b3b';
          ctx.fillRect(x + 3, y + 3, size - 6, size - 6);

          // Panel lines (rivets/seams)
          ctx.fillStyle = '#0f1219';
          ctx.fillRect(x, y + 15, size, px);
          ctx.fillRect(x, y + 33, size, px);
          ctx.fillRect(x + 24, y, px, size);

          // Tech accent lights
          ctx.fillStyle = '#39ff14';
          ctx.fillRect(x + 6, y + 6, px, px);
          ctx.fillRect(x + 6, y + 39, px, px);

          // Subtle glow
          ctx.fillStyle = 'rgba(57, 255, 20, 0.1)';
          ctx.fillRect(x + 3, y + 3, px * 3, px * 3);
        }
        break;

      case TILE_FLOOR_METAL:
        {
          const px = 3;
          // Metallic floor base
          ctx.fillStyle = '#2d3444';
          ctx.fillRect(x, y, size, size);

          // Diamond plate pattern
          ctx.fillStyle = '#3d4555';
          for (let py = 0; py < size; py += 12) {
            for (let px2 = 0; px2 < size; px2 += 12) {
              ctx.fillRect(x + px2 + 3, y + py + 3, 6, 6);
            }
          }

          // Grid lines
          ctx.fillStyle = '#1e2430';
          ctx.fillRect(x, y, size, 1);
          ctx.fillRect(x, y, 1, size);
          ctx.fillRect(x + 24, y, 1, size);
          ctx.fillRect(x, y + 24, size, 1);

          // Subtle green glow reflection
          ctx.fillStyle = 'rgba(57, 255, 20, 0.05)';
          ctx.fillRect(x + 12, y + 12, px * 4, px * 4);
        }
        break;

      // ============ SKILLS BUILDING - Pokemon Center Wall ============
      case TILE_WALL_POKECENTER:
        {
          const px = 3;
          // White upper wall
          ctx.fillStyle = '#fef9f3';
          ctx.fillRect(x, y, size, size);

          // Red accent stripe at top
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(x, y, size, px * 3);

          // Pokeball logo pattern (subtle)
          ctx.fillStyle = '#fee2e2';
          ctx.fillRect(x + 15, y + 18, px * 6, px * 6);

          // Red bottom accent
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(x, y + size - px * 4, size, px * 4);

          // White stripe on red
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, y + size - px * 3, size, px);

          // Subtle shadow line
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(x, y + 9, size, 1);
        }
        break;
    }
  }, [state.currentMap, state.isPixelMode]);

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

            // Check if player stepped on a disturbable plant
            const currentTileKey = `${playerPos.tileX},${playerPos.tileY}`;
            if (currentTileKey !== lastPlayerTileRef.current) {
              const tile = map[playerPos.tileY]?.[playerPos.tileX];
              if (tile !== undefined && isDisturbablePlant(tile)) {
                // Create disturbance effect with falling leaves
                const leaves: Array<{ x: number; y: number; vx: number; vy: number; life: number; size: number }> = [];
                for (let i = 0; i < 4; i++) {
                  leaves.push({
                    x: playerPos.tileX * SCALED_TILE + SCALED_TILE / 2 + (Math.random() - 0.5) * 20,
                    y: playerPos.tileY * SCALED_TILE + SCALED_TILE / 2,
                    vx: (Math.random() - 0.5) * 3,
                    vy: -Math.random() * 2 - 1,
                    life: 30 + Math.random() * 20,
                    size: 3 + Math.random() * 3,
                  });
                }
                disturbedPlantsRef.current.set(currentTileKey, {
                  startFrame: frameCountRef.current,
                  leaves,
                });
              }
              lastPlayerTileRef.current = currentTileKey;
            }

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

            // Check for portal (pixel mode toggle)
            checkPortalTransition(playerPos.tileX, playerPos.tileY);
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

      // Update leaf particles and clean up old disturbances
      const disturbedToRemove: string[] = [];
      disturbedPlantsRef.current.forEach((disturbance, key) => {
        const elapsed = frameCountRef.current - disturbance.startFrame;
        if (elapsed > 60) { // Remove after 60 frames (1 second)
          disturbedToRemove.push(key);
        } else {
          // Update leaf particles
          disturbance.leaves = disturbance.leaves.filter(leaf => {
            leaf.x += leaf.vx;
            leaf.y += leaf.vy;
            leaf.vy += 0.15; // gravity
            leaf.vx *= 0.98; // air resistance
            leaf.life--;
            return leaf.life > 0;
          });
        }
      });
      disturbedToRemove.forEach(key => disturbedPlantsRef.current.delete(key));

      // First pass: Draw all tiles EXCEPT tree canopies (draw grass base under canopies)
      for (let y = startTileY; y < endTileY; y++) {
        for (let x = startTileX; x < endTileX; x++) {
          const screenX = offsetX > 0 ? offsetX + x * SCALED_TILE : x * SCALED_TILE - cameraX;
          const screenY = offsetY > 0 ? offsetY + y * SCALED_TILE : y * SCALED_TILE - cameraY;
          const tile = map[y][x];

          // Calculate shake offset for disturbed plants
          let shakeOffset = 0;
          if (isDisturbablePlant(tile)) {
            const tileKey = `${x},${y}`;
            const disturbance = disturbedPlantsRef.current.get(tileKey);
            if (disturbance) {
              const elapsed = frameCountRef.current - disturbance.startFrame;
              if (elapsed < 20) {
                // Shake effect: fast oscillation that decays
                const intensity = Math.max(0, 1 - elapsed / 20);
                shakeOffset = Math.sin(elapsed * 1.5) * 4 * intensity;
              }
            }
          }

          if (isTreeCanopy(tile)) {
            // Draw grass base under canopy tiles
            drawTile(ctx, TILE_GRASS, screenX, screenY, x, y, map);
          } else {
            drawTile(ctx, tile, screenX, screenY, x, y, map, shakeOffset);
          }
        }
      }

      // Draw falling leaves from disturbed plants
      ctx.fillStyle = '#4caf50';
      disturbedPlantsRef.current.forEach((disturbance) => {
        for (const leaf of disturbance.leaves) {
          const leafScreenX = offsetX > 0 ? offsetX + leaf.x : leaf.x - cameraX;
          const leafScreenY = offsetY > 0 ? offsetY + leaf.y : leaf.y - cameraY;
          // Draw simple leaf shape
          ctx.save();
          ctx.translate(leafScreenX, leafScreenY);
          ctx.rotate(leaf.life * 0.2); // Spin as it falls
          ctx.fillRect(-leaf.size / 2, -leaf.size / 2, leaf.size, leaf.size);
          ctx.restore();
        }
      });

      // Draw NPCs
      for (const npc of currentNPCs) {
        const npcScreenX = offsetX > 0 ? offsetX + npc.position.tileX * SCALED_TILE : npc.position.tileX * SCALED_TILE - cameraX;
        const npcScreenY = offsetY > 0 ? offsetY + npc.position.tileY * SCALED_TILE : npc.position.tileY * SCALED_TILE - cameraY;
        if (npcScreenX > -SCALED_TILE && npcScreenX < CANVAS_WIDTH && npcScreenY > -SCALED_TILE && npcScreenY < CANVAS_HEIGHT) {
          drawNPC(ctx, npc, npcScreenX, npcScreenY);
        }
      }

      // Draw floating interaction arrows (only in building interiors)
      if (state.currentMap !== 'overworld') {
        const bounceOffset = Math.sin(frameCountRef.current * 0.05) * 3;
        const currentExhibits = getCurrentExhibits();

        // Draw arrows above exhibits
        for (const exhibit of currentExhibits) {
          const exhibitScreenX = offsetX > 0 ? offsetX + exhibit.position.tileX * SCALED_TILE : exhibit.position.tileX * SCALED_TILE - cameraX;
          const exhibitScreenY = offsetY > 0 ? offsetY + exhibit.position.tileY * SCALED_TILE : exhibit.position.tileY * SCALED_TILE - cameraY;

          if (exhibitScreenX > -SCALED_TILE && exhibitScreenX < CANVAS_WIDTH && exhibitScreenY > -SCALED_TILE && exhibitScreenY < CANVAS_HEIGHT) {
            const arrowX = exhibitScreenX + SCALED_TILE / 2;
            const arrowY = exhibitScreenY - 8 + bounceOffset;

            // Arrow shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY + 14);
            ctx.lineTo(arrowX - 6, arrowY + 4);
            ctx.lineTo(arrowX + 6, arrowY + 4);
            ctx.closePath();
            ctx.fill();

            // Arrow body (white)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY + 12);
            ctx.lineTo(arrowX - 5, arrowY + 3);
            ctx.lineTo(arrowX + 5, arrowY + 3);
            ctx.closePath();
            ctx.fill();
          }
        }

        // Draw arrows above NPCs
        for (const npc of currentNPCs) {
          const npcScreenX = offsetX > 0 ? offsetX + npc.position.tileX * SCALED_TILE : npc.position.tileX * SCALED_TILE - cameraX;
          const npcScreenY = offsetY > 0 ? offsetY + npc.position.tileY * SCALED_TILE : npc.position.tileY * SCALED_TILE - cameraY;

          if (npcScreenX > -SCALED_TILE && npcScreenX < CANVAS_WIDTH && npcScreenY > -SCALED_TILE && npcScreenY < CANVAS_HEIGHT) {
            const arrowX = npcScreenX + SCALED_TILE / 2;
            const arrowY = npcScreenY - 12 + bounceOffset;

            // Arrow shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY + 14);
            ctx.lineTo(arrowX - 6, arrowY + 4);
            ctx.lineTo(arrowX + 6, arrowY + 4);
            ctx.closePath();
            ctx.fill();

            // Arrow body (white)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY + 12);
            ctx.lineTo(arrowX - 5, arrowY + 3);
            ctx.lineTo(arrowX + 5, arrowY + 3);
            ctx.closePath();
            ctx.fill();
          }
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

      // Second pass: Draw tree canopies ON TOP of player (for depth effect)
      for (let y = startTileY; y < endTileY; y++) {
        for (let x = startTileX; x < endTileX; x++) {
          const tile = map[y][x];
          if (isTreeCanopy(tile)) {
            const screenX = offsetX > 0 ? offsetX + x * SCALED_TILE : x * SCALED_TILE - cameraX;
            const screenY = offsetY > 0 ? offsetY + y * SCALED_TILE : y * SCALED_TILE - cameraY;
            drawTile(ctx, tile, screenX, screenY, x, y, map);
          }
        }
      }

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
  }, [state.gameState, state.currentMap, state.isTransitioning, state.playerPosition, state.playerDirection, state.collectibles, state.isPixelMode, drawTile, drawPlayer, drawNPC, drawCollectible, getDirectionFromKeys, getCurrentMap, getCurrentMapSize, getCurrentNPCs, getCurrentExhibits, movePlayer, dispatch, checkDoorTransition, checkPortalTransition, collectItem, unlockAchievement, startDialog]);

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
