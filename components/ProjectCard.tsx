import React from 'react';
import { Project } from '../types';
import { ArrowUpRight, Code2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div
      onClick={() => onClick(project)}
      className="group col-span-1 bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-700/50 p-6 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(57,255,20,0.15)] hover:border-[#39ff14]/40 cursor-pointer flex flex-col h-full relative overflow-hidden"
    >
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/0 via-transparent to-[#39ff14]/0 group-hover:from-[#39ff14]/5 group-hover:to-[#39ff14]/3 transition-all duration-700 pointer-events-none" />

      {/* Ambient corner glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#39ff14]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      {/* Header Row */}
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="p-3 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 group-hover:bg-[#39ff14]/15 group-hover:border-[#39ff14]/30 group-hover:shadow-[0_0_20px_rgba(57,255,20,0.2)] transition-all duration-300">
          <Code2 size={20} className="text-slate-400 group-hover:text-[#39ff14] transition-colors duration-300" />
        </div>
      </div>

      {/* Title & Category */}
      <h3 className="font-display text-lg md:text-xl font-bold text-white mb-1.5 group-hover:text-[#39ff14] transition-colors duration-300 relative z-10 tracking-[-0.01em] leading-snug">{project.title}</h3>
      <p className="font-mono-refined text-[9px] text-slate-500 font-bold uppercase tracking-[0.25em] mb-4 relative z-10">{project.category}</p>

      {/* Description */}
      <p className="font-body-refined text-[12px] text-slate-400 mb-5 leading-[1.7] flex-grow relative z-10 group-hover:text-slate-300 transition-colors line-clamp-3">
        {project.longDescription}
      </p>

      {/* Tech Stack Badges */}
      <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
        {project.techStack.map(tech => (
          <span key={tech} className="font-mono-refined text-[9px] px-2.5 py-1.5 rounded-lg bg-slate-800/50 backdrop-blur-sm text-slate-400 border border-slate-700/50 font-semibold tracking-[0.04em] group-hover:bg-[#39ff14]/10 group-hover:text-[#39ff14] group-hover:border-[#39ff14]/30 transition-all duration-300">
            {tech}
          </span>
        ))}
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-slate-700/40 mt-auto relative z-10">
        <button className="w-full font-mono-refined text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-[#39ff14] flex items-center justify-between transition-all duration-300 rounded-lg p-3 group-hover:bg-[#39ff14]/10 border border-transparent group-hover:border-[#39ff14]/25">
          <span>View Case Study</span>
          <ArrowUpRight size={12} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};
