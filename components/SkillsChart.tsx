import React from 'react';
import { Terminal, Globe, Sparkles, Cloud } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface SkillBadgeProps {
  skill: string;
  variant?: 'primary' | 'secondary';
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, variant = 'primary' }) => {
  const isPrimary = variant === 'primary';
  return (
    <span className={`font-mono-refined px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-[0.04em] transition-all duration-300 cursor-default select-none border backdrop-blur-sm ${
      isPrimary
        ? 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-[#39ff14]/15 hover:text-[#39ff14] hover:border-[#39ff14]/40 hover:shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:-translate-y-0.5'
        : 'bg-slate-800/50 border-orange-500/30 text-slate-300 hover:bg-orange-500/15 hover:text-orange-400 hover:border-orange-400/50 hover:shadow-[0_0_20px_rgba(251,146,60,0.2)] hover:-translate-y-0.5'
    }`}>
      {skill}
    </span>
  );
};

export const SkillsChart: React.FC = () => {
  const { ref: containerRef, isVisible } = useScrollAnimation({ threshold: 0.15 });

  const languages = ['Python', 'C', 'Java', 'SQL', 'Assembly', 'TypeScript'];
  const webTools = ['HTML5', 'CSS3', 'JavaScript', 'Git', 'React', 'D3.js'];
  const librariesAI = ['Pandas', 'NumPy', 'OpenCV', 'OpenAI API'];
  const cloudInfra = ['GCP', 'Firebase'];

  return (
    <div
      ref={containerRef}
      className={`bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8 md:p-10 relative overflow-hidden group hover:border-slate-600/50 transition-colors duration-500 scroll-animate-scale ${isVisible ? 'visible' : ''}`}
    >
      {/* Ambient glow effects */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#39ff14]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#39ff14]/8 transition-colors duration-700"></div>
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/3 rounded-full blur-3xl pointer-events-none"></div>

      {/* Tech Badges Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">

        {/* Languages Group */}
        <div className={`group/section scroll-animate-fade-up ${isVisible ? 'visible delay-100' : ''}`}>
          <h4 className="font-mono-refined text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3 group-hover/section:text-slate-200 transition-colors">
            <div className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 group-hover/section:border-[#39ff14]/30 transition-colors">
              <Terminal size={12} className="text-[#39ff14]" />
            </div>
            Languages
          </h4>
          <div className="flex flex-wrap gap-2">
            {languages.map(skill => <SkillBadge key={skill} skill={skill} />)}
          </div>
        </div>

        {/* Web & Tools Group */}
        <div className={`group/section scroll-animate-fade-up ${isVisible ? 'visible delay-200' : ''}`}>
          <h4 className="font-mono-refined text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3 group-hover/section:text-slate-200 transition-colors">
            <div className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 group-hover/section:border-[#39ff14]/30 transition-colors">
              <Globe size={12} className="text-[#39ff14]" />
            </div>
            Web & Tools
          </h4>
          <div className="flex flex-wrap gap-2">
            {webTools.map(skill => <SkillBadge key={skill} skill={skill} />)}
          </div>
        </div>

        {/* Libraries & AI Group */}
        <div className={`group/section scroll-animate-fade-up ${isVisible ? 'visible delay-300' : ''}`}>
          <h4 className="font-mono-refined text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3 group-hover/section:text-slate-200 transition-colors">
            <div className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 group-hover/section:border-[#39ff14]/30 transition-colors">
              <Sparkles size={12} className="text-[#39ff14]" />
            </div>
            Libraries & AI
          </h4>
          <div className="flex flex-wrap gap-2">
            {librariesAI.map(skill => <SkillBadge key={skill} skill={skill} />)}
          </div>
        </div>

        {/* Cloud & Infrastructure Group */}
        <div className={`group/section scroll-animate-fade-up ${isVisible ? 'visible delay-400' : ''}`}>
          <h4 className="font-mono-refined text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3 group-hover/section:text-slate-200 transition-colors">
            <div className="p-1.5 rounded-lg bg-slate-800/60 border border-orange-500/30 group-hover/section:border-orange-400/50 transition-colors">
              <Cloud size={12} className="text-orange-400" />
            </div>
            Cloud & Infra
          </h4>
          <div className="flex flex-wrap gap-2">
            {cloudInfra.map(skill => <SkillBadge key={skill} skill={skill} variant="secondary" />)}
          </div>
        </div>

      </div>
    </div>
  );
};
