import React from 'react';
import { ArrowRight, Github } from 'lucide-react';

export const HeroCard: React.FC = () => {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl shadow-xl border border-slate-800/80 overflow-hidden relative group">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#39ff14]/5 via-transparent to-emerald-500/5 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#39ff14]/3 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#39ff14 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#39ff14]/10 text-[#39ff14] text-xs font-bold mb-6 border border-[#39ff14]/30 shadow-[0_0_15px_rgba(57,255,20,0.2)] backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39ff14] shadow-[0_0_6px_rgba(57,255,20,0.8)]"></span>
            </span>
            Available for Opportunities
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight leading-relaxed">
            Building Logic. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] via-emerald-400 to-teal-400">Visualizing Data.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
            Math & CS Student @ U of T. Passionate about designing innovative software and extracting insights from data.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://github.com/RyannWongg"
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn flex items-center justify-center gap-2 px-6 py-3.5 bg-[#39ff14] text-slate-900 font-semibold rounded-xl hover:bg-[#45ff26] transition-all duration-200 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] hover:-translate-y-0.5 cursor-pointer"
          >
            <Github size={18} />
            View Github
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#39ff14] via-emerald-500 to-teal-500 opacity-60"></div>
    </div>
  );
};