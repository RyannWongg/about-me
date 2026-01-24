import React from 'react';
import { Project } from '../types';
import { ArrowUpRight, Code2, Sparkles } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div
      onClick={() => onClick(project)}
      className="group col-span-1 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl shadow-lg border border-slate-800/80 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(57,255,20,0.15)] hover:border-[#39ff14]/40 cursor-pointer flex flex-col h-full relative overflow-hidden"
    >
      {/* Subtle hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/0 to-[#39ff14]/0 group-hover:from-[#39ff14]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-[#39ff14]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/50 group-hover:bg-[#39ff14]/15 group-hover:border-[#39ff14]/30 transition-all duration-300">
          <Code2 size={18} className="text-slate-400 group-hover:text-[#39ff14] transition-colors duration-300" />
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Sparkles size={10} className="text-[#39ff14]" />
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Featured</span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-[#39ff14] transition-colors duration-300 relative z-10">{project.title}</h3>
      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-4 relative z-10">{project.category}</p>

      <p className="text-sm text-slate-400 mb-5 leading-relaxed flex-grow relative z-10 group-hover:text-slate-300 transition-colors line-clamp-3">
        {project.longDescription}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
        {project.techStack.map(tech => (
          <span key={tech} className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/50 font-medium group-hover:bg-[#39ff14]/10 group-hover:text-[#39ff14] group-hover:border-[#39ff14]/30 transition-all duration-300">
            {tech}
          </span>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-800/60 mt-auto relative z-10">
        <button className="w-full text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#39ff14] flex items-center justify-between transition-all duration-300 rounded-xl p-3 group-hover:bg-[#39ff14]/10 border border-transparent group-hover:border-[#39ff14]/20">
          <span>View Case Study</span>
          <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};