import React from 'react';
import { useProgress } from '@react-three/drei';

export const LoadingScreen: React.FC = () => {
  const { progress, active } = useProgress();

  if (!active) return null;

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(#39ff14 1px, transparent 1px),
            linear-gradient(90deg, #39ff14 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Animated glow orbs */}
      <div className="absolute w-96 h-96 rounded-full bg-[#39ff14] opacity-5 blur-3xl animate-pulse" />
      <div
        className="absolute w-64 h-64 rounded-full bg-[#39ff14] opacity-10 blur-2xl"
        style={{ animation: 'pulse 2s ease-in-out infinite 0.5s' }}
      />

      <div className="text-center relative z-10">
        {/* Museum icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-[#39ff14] rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#39ff14] rounded-sm" />
            </div>
            {/* Scanning line animation */}
            <div
              className="absolute left-0 right-0 h-0.5 bg-[#39ff14]"
              style={{
                animation: 'scan 1.5s ease-in-out infinite',
                boxShadow: '0 0 10px #39ff14',
              }}
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-[#39ff14] text-2xl mb-2 font-mono tracking-[0.3em] uppercase">
          Welcome
        </div>
        <div className="text-slate-400 text-sm mb-6 font-mono tracking-wider">
          Initializing Portfolio Museum...
        </div>

        {/* Progress bar container */}
        <div className="relative w-72 mx-auto">
          {/* Progress bar background */}
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-[#39ff14] transition-all duration-300 relative"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 10px #39ff14, 0 0 20px #39ff14',
              }}
            >
              {/* Shimmer effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                style={{ animation: 'shimmer 1s ease-in-out infinite' }}
              />
            </div>
          </div>

          {/* Progress percentage */}
          <div className="flex justify-between mt-3 text-xs font-mono">
            <span className="text-slate-500">Loading assets</span>
            <span className="text-[#39ff14]">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Loading tips */}
        <div className="mt-8 text-slate-500 text-xs font-mono max-w-xs mx-auto">
          <span className="text-[#39ff14]">TIP:</span> Use WASD or Arrow keys to explore
        </div>
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; opacity: 1; }
          50% { top: 100%; opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
