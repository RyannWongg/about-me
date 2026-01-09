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