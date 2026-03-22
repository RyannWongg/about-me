import React from 'react';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

// Theme configurations for each project
const getProjectTheme = (projectId: string) => {
  switch (projectId) {
    case 'p1': // Lakers Performance Analytics
      return {
        primary: '#552583', // Lakers purple
        secondary: '#FDB927', // Lakers gold
        accent: '#552583',
        gradientFrom: 'from-[#552583]/20',
        gradientTo: 'to-[#FDB927]/10',
        glowColor: 'rgba(85, 37, 131, 0.3)',
        hoverGlow: 'hover:shadow-[0_25px_50px_-12px_rgba(253,185,39,0.25)]',
        borderHover: 'hover:border-[#FDB927]/50',
        textHover: 'group-hover:text-[#FDB927]',
        badgeBg: 'group-hover:bg-[#552583]/20',
        badgeText: 'group-hover:text-[#FDB927]',
        badgeBorder: 'group-hover:border-[#FDB927]/40',
      };
    case 'p2': // House of Data (NBA Evolution)
      return {
        primary: '#C9082A', // NBA red
        secondary: '#17408B', // NBA blue
        accent: '#C9082A',
        gradientFrom: 'from-[#C9082A]/15',
        gradientTo: 'to-[#17408B]/15',
        glowColor: 'rgba(201, 8, 42, 0.3)',
        hoverGlow: 'hover:shadow-[0_25px_50px_-12px_rgba(201,8,42,0.2)]',
        borderHover: 'hover:border-[#C9082A]/50',
        textHover: 'group-hover:text-[#C9082A]',
        badgeBg: 'group-hover:bg-[#17408B]/20',
        badgeText: 'group-hover:text-white',
        badgeBorder: 'group-hover:border-[#C9082A]/40',
      };
    case 'p3': // Java Solitaire Engine
      return {
        primary: '#DC2626', // Card red
        secondary: '#1E293B', // Card black/dark
        accent: '#DC2626',
        gradientFrom: 'from-[#DC2626]/10',
        gradientTo: 'to-[#1E293B]/20',
        glowColor: 'rgba(220, 38, 38, 0.3)',
        hoverGlow: 'hover:shadow-[0_25px_50px_-12px_rgba(220,38,38,0.2)]',
        borderHover: 'hover:border-[#DC2626]/50',
        textHover: 'group-hover:text-[#DC2626]',
        badgeBg: 'group-hover:bg-[#DC2626]/15',
        badgeText: 'group-hover:text-[#DC2626]',
        badgeBorder: 'group-hover:border-[#DC2626]/40',
      };
    case 'p4': // Assembly Tetris
      return {
        primary: '#06B6D4', // Cyan tetris
        secondary: '#8B5CF6', // Purple tetris
        accent: '#06B6D4',
        gradientFrom: 'from-[#06B6D4]/15',
        gradientTo: 'to-[#8B5CF6]/15',
        glowColor: 'rgba(6, 182, 212, 0.3)',
        hoverGlow: 'hover:shadow-[0_25px_50px_-12px_rgba(6,182,212,0.25)]',
        borderHover: 'hover:border-[#06B6D4]/50',
        textHover: 'group-hover:text-[#06B6D4]',
        badgeBg: 'group-hover:bg-[#06B6D4]/15',
        badgeText: 'group-hover:text-[#06B6D4]',
        badgeBorder: 'group-hover:border-[#06B6D4]/40',
      };
    default:
      return {
        primary: '#39ff14',
        secondary: '#39ff14',
        accent: '#39ff14',
        gradientFrom: 'from-[#39ff14]/10',
        gradientTo: 'to-[#39ff14]/5',
        glowColor: 'rgba(57, 255, 20, 0.3)',
        hoverGlow: 'hover:shadow-[0_25px_50px_-12px_rgba(57,255,20,0.15)]',
        borderHover: 'hover:border-[#39ff14]/40',
        textHover: 'group-hover:text-[#39ff14]',
        badgeBg: 'group-hover:bg-[#39ff14]/10',
        badgeText: 'group-hover:text-[#39ff14]',
        badgeBorder: 'group-hover:border-[#39ff14]/30',
      };
  }
};

// Basketball Icon with bounce animation - matching reference image
const BasketballDecor: React.FC<{ color: string; secondary: string }> = ({ color, secondary }) => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
    <style>
      {`
        @keyframes ballBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .basketball-bounce { animation: ballBounce 1.2s ease-in-out infinite; }
      `}
    </style>
    <g className="basketball-bounce" stroke={color} strokeWidth="1.5" fill="none">
      {/* Ball outline */}
      <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.15" />
      {/* Vertical line */}
      <line x1="12" y1="3" x2="12" y2="21" />
      {/* Horizontal line */}
      <line x1="3" y1="12" x2="21" y2="12" />
      {/* Left curved line - bows inward toward center */}
      <path d="M 5.5 5 Q 10 12, 5.5 19" />
      {/* Right curved line - bows inward toward center */}
      <path d="M 18.5 5 Q 14 12, 18.5 19" />
    </g>
  </svg>
);

// Lakers "L" Logo
const LakersLogo: React.FC<{ color: string; secondary: string }> = ({ color, secondary }) => (
  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
    <style>
      {`
        @keyframes lakersGlow {
          0%, 100% { filter: drop-shadow(0 0 2px ${secondary}); }
          50% { filter: drop-shadow(0 0 6px ${secondary}); }
        }
        .lakers-glow { animation: lakersGlow 2s ease-in-out infinite; }
      `}
    </style>
    <g className="lakers-glow">
      {/* L shape */}
      <path d="M12 8 L12 28 L28 28 L28 24 L16 24 L16 8 Z" fill={secondary} stroke={color} strokeWidth="1" />
      {/* Small basketball accent */}
      <circle cx="30" cy="12" r="5" fill="none" stroke={secondary} strokeWidth="1.5" opacity="0.6" />
      <line x1="30" y1="7" x2="30" y2="17" stroke={secondary} strokeWidth="1" opacity="0.6" />
      <line x1="25" y1="12" x2="35" y2="12" stroke={secondary} strokeWidth="1" opacity="0.6" />
    </g>
  </svg>
);

// Data/Stats visualization for NBA Evolution
const DataStatsDecor: React.FC<{ color: string; secondary: string }> = ({ color, secondary }) => (
  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
    <style>
      {`
        @keyframes barGrow1 { 0%, 100% { transform: scaleY(0.6); } 50% { transform: scaleY(1); } }
        @keyframes barGrow2 { 0%, 100% { transform: scaleY(0.8); } 50% { transform: scaleY(0.5); } }
        @keyframes barGrow3 { 0%, 100% { transform: scaleY(0.5); } 50% { transform: scaleY(0.9); } }
        @keyframes dotPulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        .bar1 { animation: barGrow1 2s ease-in-out infinite; transform-origin: bottom; }
        .bar2 { animation: barGrow2 2.5s ease-in-out infinite; transform-origin: bottom; }
        .bar3 { animation: barGrow3 1.8s ease-in-out infinite; transform-origin: bottom; }
        .stat-dot { animation: dotPulse 1.5s ease-in-out infinite; }
      `}
    </style>
    {/* Bar chart */}
    <rect x="8" y="18" width="6" height="22" rx="2" fill={color} opacity="0.8" className="bar1" />
    <rect x="18" y="12" width="6" height="28" rx="2" fill={secondary} opacity="0.7" className="bar2" />
    <rect x="28" y="20" width="6" height="20" rx="2" fill={color} opacity="0.8" className="bar3" />
    {/* Trend line dots */}
    <circle cx="11" cy="14" r="2" fill={secondary} className="stat-dot" />
    <circle cx="21" cy="10" r="2" fill={color} className="stat-dot" style={{ animationDelay: '0.3s' }} />
    <circle cx="31" cy="16" r="2" fill={secondary} className="stat-dot" style={{ animationDelay: '0.6s' }} />
    <circle cx="40" cy="12" r="2" fill={color} className="stat-dot" style={{ animationDelay: '0.9s' }} />
    {/* Connecting line */}
    <path d="M11 14 L21 10 L31 16 L40 12" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" strokeDasharray="2 2" />
  </svg>
);

// NBA Logo - classic red/white/blue shield with player silhouette
const NBALogo: React.FC<{ color: string; secondary: string }> = ({ color, secondary }) => (
  <svg className="w-10 h-10" viewBox="0 0 40 48" fill="none">
    <style>
      {`
        @keyframes nbaGlow {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
        .nba-glow { animation: nbaGlow 2s ease-in-out infinite; }
      `}
    </style>
    <g className="nba-glow">
      {/* Shield background */}
      <rect x="2" y="2" width="36" height="44" rx="4" fill="#fff" stroke="#1d428a" strokeWidth="2" />

      {/* Blue left half */}
      <path d="M2 6 C2 3.79 3.79 2 6 2 L20 2 L20 46 L6 46 C3.79 46 2 44.21 2 42 Z" fill="#1d428a" />

      {/* Red right half */}
      <path d="M20 2 L34 2 C36.21 2 38 3.79 38 6 L38 42 C38 44.21 36.21 46 34 46 L20 46 Z" fill="#c8102e" />

      {/* Player silhouette in white */}
      <g fill="#fff">
        {/* Head */}
        <circle cx="20" cy="10" r="4" />
        {/* Body leaning */}
        <path d="M17 14 L23 14 L25 20 L24 28 L26 38 L22 38 L20 30 L18 38 L14 38 L16 28 L15 20 Z" />
        {/* Left arm up */}
        <path d="M17 16 L10 10 L8 12 L14 18" fill="#fff" />
        {/* Right arm with ball */}
        <path d="M23 16 L28 22" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        {/* Ball */}
        <circle cx="30" cy="24" r="4" fill="#fff" />
      </g>
    </g>
  </svg>
);

// Playing cards for Solitaire - main icon
const PlayingCardsDecor: React.FC<{ color: string }> = ({ color }) => (
  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
    <style>
      {`
        @keyframes cardFlip1 {
          0%, 40%, 100% { transform: rotateY(0deg) translateX(0); }
          45%, 95% { transform: rotateY(15deg) translateX(2px); }
        }
        @keyframes cardFlip2 {
          0%, 50%, 100% { transform: rotateY(0deg); }
          55%, 95% { transform: rotateY(-10deg); }
        }
        @keyframes suitPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .card1 { animation: cardFlip1 3s ease-in-out infinite; transform-origin: left center; }
        .card2 { animation: cardFlip2 3.5s ease-in-out infinite; transform-origin: right center; }
        .suit { animation: suitPulse 2s ease-in-out infinite; }
      `}
    </style>
    {/* Back card */}
    <g className="card2">
      <rect x="18" y="6" width="22" height="30" rx="3" fill="#1E293B" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <rect x="20" y="8" width="18" height="26" rx="2" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
    </g>
    {/* Front card */}
    <g className="card1">
      <rect x="8" y="10" width="22" height="30" rx="3" fill="#F8FAFC" stroke={color} strokeWidth="1.5" />
      {/* Heart suit */}
      <g className="suit">
        <path d="M19 20 C19 17 15 17 15 20 C15 23 19 26 19 26 C19 26 23 23 23 20 C23 17 19 17 19 20" fill={color} />
      </g>
      <text x="11" y="18" fill={color} fontSize="8" fontWeight="bold">A</text>
      <text x="25" y="36" fill={color} fontSize="8" fontWeight="bold" transform="rotate(180, 25, 34)">A</text>
    </g>
  </svg>
);

// Card suits decoration for top-right
const CardSuitsDecor: React.FC<{ color: string }> = ({ color }) => (
  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
    <style>
      {`
        @keyframes suitRotate {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        .suit-rotate { animation: suitRotate 3s ease-in-out infinite; transform-origin: center; }
      `}
    </style>
    <g className="suit-rotate">
      {/* Spade */}
      <path d="M12 8 C12 8 6 14 6 18 C6 21 8 22 10 22 C11 22 12 21 12 21 L12 26 L8 26 L16 26 L12 26 L12 21 C12 21 13 22 14 22 C16 22 18 21 18 18 C18 14 12 8 12 8" fill={color} opacity="0.9" />
      {/* Diamond */}
      <path d="M28 6 L34 14 L28 22 L22 14 Z" fill={color} opacity="0.7" />
      {/* Club */}
      <circle cx="12" cy="32" r="4" fill={color} opacity="0.6" />
      <circle cx="8" cy="36" r="3" fill={color} opacity="0.6" />
      <circle cx="16" cy="36" r="3" fill={color} opacity="0.6" />
      {/* Heart */}
      <path d="M30 26 C30 24 27 24 27 26 C27 28 30 31 30 31 C30 31 33 28 33 26 C33 24 30 24 30 26" fill={color} opacity="0.8" />
    </g>
  </svg>
);

// Tetris blocks for Assembly Tetris - main icon
const TetrisBlocksDecor: React.FC<{ color: string; secondary: string }> = ({ color, secondary }) => (
  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
    <style>
      {`
        @keyframes tetrisFall1 {
          0% { transform: translateY(-20px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(48px); opacity: 0; }
        }
        @keyframes tetrisFall2 {
          0% { transform: translateY(-15px); opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 1; }
          100% { transform: translateY(48px); opacity: 0; }
        }
        @keyframes blockGlow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .tetris-fall1 { animation: tetrisFall1 3s linear infinite; }
        .tetris-fall2 { animation: tetrisFall2 3.5s linear infinite 0.5s; }
        .block-glow { animation: blockGlow 1.5s ease-in-out infinite; }
      `}
    </style>
    {/* Falling L-piece */}
    <g className="tetris-fall1">
      <rect x="8" y="8" width="8" height="8" rx="1" fill={color} className="block-glow" />
      <rect x="8" y="16" width="8" height="8" rx="1" fill={color} className="block-glow" />
      <rect x="16" y="16" width="8" height="8" rx="1" fill={color} className="block-glow" />
    </g>
    {/* Falling T-piece */}
    <g className="tetris-fall2">
      <rect x="28" y="4" width="8" height="8" rx="1" fill={secondary} className="block-glow" />
      <rect x="20" y="12" width="8" height="8" rx="1" fill={secondary} className="block-glow" />
      <rect x="28" y="12" width="8" height="8" rx="1" fill={secondary} className="block-glow" />
      <rect x="36" y="12" width="8" height="8" rx="1" fill={secondary} className="block-glow" />
    </g>
    {/* Stacked blocks at bottom */}
    <rect x="4" y="36" width="8" height="8" rx="1" fill={color} opacity="0.4" />
    <rect x="12" y="36" width="8" height="8" rx="1" fill={secondary} opacity="0.5" />
    <rect x="20" y="36" width="8" height="8" rx="1" fill={color} opacity="0.4" />
    <rect x="28" y="36" width="8" height="8" rx="1" fill={secondary} opacity="0.5" />
    <rect x="12" y="28" width="8" height="8" rx="1" fill={color} opacity="0.3" />
    <rect x="20" y="28" width="8" height="8" rx="1" fill={secondary} opacity="0.35" />
  </svg>
);

// Retro score display for Tetris top-right
const RetroScoreDecor: React.FC<{ color: string; secondary: string }> = ({ color, secondary }) => (
  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
    <style>
      {`
        @keyframes scoreFlicker {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0.7; }
        }
        @keyframes levelPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .score-flicker { animation: scoreFlicker 2s ease-in-out infinite; }
        .level-pulse { animation: levelPulse 1.5s ease-in-out infinite; }
      `}
    </style>
    {/* Retro display frame */}
    <rect x="4" y="4" width="32" height="32" rx="3" fill="#0f172a" stroke={color} strokeWidth="1.5" />
    {/* Score label */}
    <text x="8" y="14" fill={secondary} fontSize="6" fontFamily="monospace" className="score-flicker">SCORE</text>
    {/* Score number */}
    <text x="8" y="24" fill={color} fontSize="10" fontFamily="monospace" fontWeight="bold" className="score-flicker">9999</text>
    {/* Level */}
    <g className="level-pulse">
      <text x="8" y="34" fill={secondary} fontSize="6" fontFamily="monospace">LV.99</text>
    </g>
  </svg>
);

// Get the appropriate decorations for each project (top-left icon and top-right logo)
const getProjectDecorations = (projectId: string, theme: ReturnType<typeof getProjectTheme>) => {
  switch (projectId) {
    case 'p1': // Lakers
      return {
        topLeft: <BasketballDecor color={theme.secondary} secondary={theme.primary} />,
        topRight: <LakersLogo color={theme.primary} secondary={theme.secondary} />,
      };
    case 'p2': // House of Data / NBA
      return {
        topLeft: <DataStatsDecor color={theme.primary} secondary={theme.secondary} />,
        topRight: <NBALogo color={theme.primary} secondary={theme.secondary} />,
      };
    case 'p3': // Solitaire
      return {
        topLeft: <PlayingCardsDecor color={theme.primary} />,
        topRight: <CardSuitsDecor color={theme.primary} />,
      };
    case 'p4': // Tetris
      return {
        topLeft: <TetrisBlocksDecor color={theme.primary} secondary={theme.secondary} />,
        topRight: <RetroScoreDecor color={theme.primary} secondary={theme.secondary} />,
      };
    default:
      return { topLeft: null, topRight: null };
  }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const theme = getProjectTheme(project.id);
  const decorations = getProjectDecorations(project.id, theme);

  return (
    <div
      onClick={() => onClick(project)}
      className={`group col-span-1 bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-700/50 p-6 transition-all duration-500 ease-out hover:-translate-y-2 ${theme.hoverGlow} ${theme.borderHover} cursor-pointer flex flex-col h-full relative overflow-hidden`}
    >
      {/* Themed gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradientFrom} via-transparent ${theme.gradientTo} opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none`} />

      {/* Ambient corner glow with theme color */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: theme.glowColor }}
      />

      {/* Header Row with themed icons - Left and Right */}
      <div className="flex justify-between items-start mb-5 relative z-10">
        {/* Top Left - Main animated icon */}
        <div
          className="p-2 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 group-hover:border-opacity-80 transition-all duration-300 group-hover:bg-slate-800/80"
          style={{ borderColor: `${theme.primary}40` }}
        >
          <div className="w-10 h-10 flex items-center justify-center">
            {decorations.topLeft}
          </div>
        </div>

        {/* Top Right - Logo/Badge */}
        <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-500">
          {decorations.topRight}
        </div>
      </div>

      {/* Title & Category */}
      <h3 className={`font-display text-lg md:text-xl font-bold text-white mb-1.5 ${theme.textHover} transition-colors duration-300 relative z-10 tracking-[-0.01em] leading-snug`}>
        {project.title}
      </h3>
      <p className="font-mono-refined text-[9px] text-slate-500 font-bold uppercase tracking-[0.25em] mb-4 relative z-10">
        {project.category}
      </p>

      {/* Description */}
      <p className="font-body-refined text-[12px] text-slate-400 mb-5 leading-[1.7] flex-grow relative z-10 group-hover:text-slate-300 transition-colors line-clamp-3">
        {project.longDescription}
      </p>

      {/* Tech Stack Badges with theme colors */}
      <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
        {project.techStack.map(tech => (
          <span
            key={tech}
            className={`font-mono-refined text-[9px] px-2.5 py-1.5 rounded-lg bg-slate-800/50 backdrop-blur-sm text-slate-400 border border-slate-700/50 font-semibold tracking-[0.04em] ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} transition-all duration-300`}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-slate-700/40 mt-auto relative z-10">
        <button
          className={`w-full font-mono-refined text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ${theme.textHover} flex items-center justify-between transition-all duration-300 rounded-lg p-3 border border-transparent`}
          style={{
            ['--hover-bg' as string]: `${theme.primary}15`,
            ['--hover-border' as string]: `${theme.primary}40`,
          }}
        >
          <span>View Case Study</span>
          <ArrowUpRight size={12} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};
