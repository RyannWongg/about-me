import React from 'react';
import { Project } from '../types';
import { X, Layers, Activity, ExternalLink } from 'lucide-react';

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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-[#39ff14] rounded-2xl shadow-[0_0_50px_rgba(57,255,20,0.2)] overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-start">
          <div>
             <h2 className="text-2xl font-bold text-white mb-1">{project.title}</h2>
             <span className="text-xs font-mono-tech text-[#39ff14] bg-[#39ff14]/10 px-2 py-1 rounded">
               {project.category}
             </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
           <div className="text-slate-300 leading-relaxed text-sm">
             {project.longDescription}
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-center">
               <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider mb-2">
                 <Activity size={14} />
                 Impact
               </div>
               <div className="text-3xl font-bold text-white tracking-tighter">
                 {project.metrics.value}
               </div>
               <div className="text-xs font-mono text-[#39ff14] mt-1 mb-0.5">
                   {project.metrics.accentText}
               </div>
               <div className="text-xs text-slate-500">{project.metrics.label}</div>
             </div>

             <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider mb-2">
                 <Layers size={14} />
                 Tech Stack
               </div>
               <div className="flex flex-wrap gap-2">
                 {project.techStack.map(t => (
                   <span key={t} className="text-[10px] text-[#39ff14] border border-[#39ff14]/30 px-1.5 py-0.5 rounded bg-[#39ff14]/5">
                     {t}
                   </span>
                 ))}
               </div>
             </div>
           </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white text-sm rounded-lg hover:bg-slate-700 transition-colors font-medium">
            Close
          </button>
          {project.link && (
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#39ff14] text-slate-900 text-sm rounded-lg hover:bg-[#32d412] transition-colors font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]"
            >
              View Project <ExternalLink size={14} />
            </a>
          )}
        </div>

      </div>
    </div>
  );
};