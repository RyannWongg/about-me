import React from 'react';
import { Project } from '../types';
import { X, Layers, Activity, ExternalLink, Zap } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-[#39ff14]/50 rounded-2xl shadow-[0_0_60px_rgba(57,255,20,0.15)] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Top glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#39ff14] to-transparent"></div>

        <div className="p-6 border-b border-slate-800/60 flex justify-between items-start relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#39ff14]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-[#39ff14]" />
              <span className="text-xs font-mono text-[#39ff14] bg-[#39ff14]/10 px-2 py-0.5 rounded border border-[#39ff14]/20">
                {project.category}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200 border border-transparent hover:border-slate-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-slate-300 leading-relaxed text-sm">
            {project.longDescription}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60 flex flex-col justify-center hover:border-[#39ff14]/20 transition-colors">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-wider font-semibold mb-2">
                <Activity size={12} className="text-[#39ff14]" />
                Impact
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {project.metrics.value}
              </div>
              <div className="text-[11px] font-medium text-[#39ff14] mt-1">
                {project.metrics.accentText}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{project.metrics.label}</div>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/60 hover:border-[#39ff14]/20 transition-colors">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-wider font-semibold mb-3">
                <Layers size={12} className="text-[#39ff14]" />
                Tech Stack
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map(t => (
                  <span key={t} className="text-[10px] text-[#39ff14] border border-[#39ff14]/30 px-2 py-1 rounded-lg bg-[#39ff14]/5 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950/40 border-t border-slate-800/60 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800/80 text-slate-300 hover:text-white text-sm rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium border border-slate-700/50 hover:border-slate-600 cursor-pointer"
          >
            Close
          </button>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#39ff14] text-slate-900 text-sm rounded-xl hover:bg-[#45ff26] transition-all duration-200 font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]"
            >
              View Project <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};