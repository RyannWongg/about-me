import React from 'react';

export interface Project {
  id: string;
  title: string;
  category: string;
  status: 'Completed' | 'In Progress' | 'Maintenance';
  techStack: string[];
  metrics: {
    label: string;
    value: string;
    accentText: string;
  };
  longDescription: string;
  // New detailed view fields
  challenge?: string;
  solution?: string;
  features?: string[];
  link?: string;
  image?: string;
}

export interface Skill {
  name: string;
  proficiency: number; // 0-100
  category: 'Frontend' | 'Backend' | 'Tools';
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string[];
  type: 'education' | 'experience';
}

export interface NavItem {
  label: string;
  id: string;
  icon: React.ReactNode;
}

// View States
export type ViewState = 'museum' | 'dashboard' | 'projects' | 'pokemon';

export interface MuseumRoom {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
}

export interface ExhibitData {
  projectId: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export type MuseumViewState = 'exploring' | 'viewing-exhibit' | 'transitioning';

// Pokemon 2D World Types
export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  tileX: number;
  tileY: number;
  pixelX: number;
  pixelY: number;
}

export interface PokemonCollectible {
  id: string;
  name: string;
  position: { tileX: number; tileY: number };
  collected: boolean;
  sprite: string;
}

export interface PokemonAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface DialogMessage {
  speaker?: string;
  text: string;
  avatar?: string;
}

export interface NPC {
  id: string;
  name: string;
  position: { tileX: number; tileY: number };
  direction: Direction;
  sprite: string;
  dialogs: DialogMessage[];
}

export interface InteractiveObject {
  id: string;
  type: 'project' | 'skill' | 'timeline' | 'sign' | 'door';
  position: { tileX: number; tileY: number };
  data?: Project | Skill | TimelineEvent | string;
}

export type PokemonGameState = 'exploring' | 'dialog' | 'menu' | 'minigame' | 'paused';