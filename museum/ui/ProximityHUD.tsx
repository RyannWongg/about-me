import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Info, Briefcase, Zap, User, Clock } from 'lucide-react';

const typeIcons = {
  project: Briefcase,
  skill: Zap,
  about: User,
  timeline: Clock,
};

const typeColors = {
  project: '#00ffff',
  skill: '#ff6b6b',
  about: '#c084fc',
  timeline: '#ffd93d',
};

export const ProximityHUD: React.FC = () => {
  const { nearbyExhibit } = useGame();
  const [isVisible, setIsVisible] = useState(false);
  const [displayExhibit, setDisplayExhibit] = useState(nearbyExhibit);

  useEffect(() => {
    if (nearbyExhibit) {
      setDisplayExhibit(nearbyExhibit);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [nearbyExhibit]);

  if (!displayExhibit) return null;

  const Icon = typeIcons[displayExhibit.type] || Info;
  const color = typeColors[displayExhibit.type] || '#39ff14';

  return (
    <div
      className={`fixed bottom-4 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[calc(100%-2rem)] sm:w-auto ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div
        className="relative bg-slate-900/95 backdrop-blur-md border-2 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 min-w-0 sm:min-w-[280px] max-w-[400px] mx-auto"
        style={{ borderColor: `${color}66`, boxShadow: `0 0 30px ${color}33` }}
      >
        {/* Scanning line animation */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${color}11 50%, transparent 100%)`,
            animation: 'scan 2s linear infinite',
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: color }} />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-2xl" style={{ borderColor: color }} />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-2xl" style={{ borderColor: color }} />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: color }} />

        {/* Content */}
        <div className="relative flex items-start gap-4">
          {/* Icon */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}
          >
            <Icon size={24} style={{ color }} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>
                {displayExhibit.type} Detected
              </span>
            </div>
            <h3 className="text-white font-bold text-lg truncate">{displayExhibit.name}</h3>
            <p className="text-slate-400 text-sm mt-1 line-clamp-2">{displayExhibit.description}</p>
          </div>
        </div>

        {/* Action hint */}
        <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-center gap-2">
          <kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-[10px] font-mono text-slate-300">
            CLICK
          </kbd>
          <span className="text-xs text-slate-500">to interact</span>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};
