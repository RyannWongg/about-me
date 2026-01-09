import React from 'react';
import { Project } from '../types';
import { ExternalLink, Code2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div 
      onClick={() => onClick(project)}
      className="group col-span-1 bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(57,255,20,0.2)] hover:border-[#39ff14]/50 cursor-pointer flex flex-col h-full relative overflow-hidden"
    >
      {/* Subtle hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/0 to-[#39ff14]/0 group-hover:from-[#39ff14]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-[#39ff14]/20 transition-colors duration-300">
           <Code2 size={20} className="text-slate-400 group-hover:text-[#39ff14] transition-colors duration-300" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#39ff14] transition-colors duration-300 relative z-10">{project.title}</h3>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3 relative z-10">{project.category}</p>
      
      <p className="text-sm text-slate-400 mb-5 leading-relaxed flex-grow relative z-10 group-hover:text-slate-300 transition-colors">
        {project.longDescription}
      </p>

      <div className="flex flex-wrap gap-2 mb-5 relative z-10">
        {project.techStack.map(tech => (
            <span key={tech} className="text-[10px] px-2.5 py-1 rounded-full bg-[#39ff14]/5 text-[#39ff14] border border-[#39ff14]/30 shadow-[0_0_8px_rgba(57,255,20,0.15)] font-medium transition-all hover:shadow-[0_0_12px_rgba(57,255,20,0.4)] hover:bg-[#39ff14]/10">
                {tech}
            </span>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-800 mt-auto relative z-10">
        <button className="w-full text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-[#39ff14] flex items-center justify-between transition-all duration-300 rounded-lg p-2 group-hover:bg-[#39ff14]/10">
          View Case Study
          <ExternalLink size={12} className="transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};