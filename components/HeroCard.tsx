import React from 'react';
import { ArrowRight } from 'lucide-react';

export const HeroCard: React.FC = () => {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden relative group">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#39ff14]/5 to-transparent pointer-events-none"></div>
      
      <div className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39ff14]/10 text-[#39ff14] text-xs font-bold mb-5 border border-[#39ff14]/30 shadow-[0_0_10px_rgba(57,255,20,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39ff14]"></span>
            </span>
            Available for New Projects
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-normal">
            Building Logic. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-emerald-500">Visualizing Data.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
            Math & CS Student @ U of T. Passionate about designing innovative software and extracting insights from data.
          </p>
        </div>
        
        <div className="flex gap-4">
          <a 
            href="https://github.com/RyannWongg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 text-slate-200 border border-slate-700 font-medium rounded-xl hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all"
          >
            View Github <ArrowRight size={16} />
          </a>
        </div>
      </div>
      
      {/* Decorative gradient line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#39ff14] via-emerald-500 to-teal-500 opacity-50"></div>
    </div>
  );
};