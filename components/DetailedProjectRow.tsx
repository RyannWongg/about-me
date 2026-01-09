import React from 'react';
import { Project } from '../types';
import { ExternalLink, Layers, ArrowRight } from 'lucide-react';

interface DetailedProjectRowProps {
  project: Project;
}

export const DetailedProjectRow: React.FC<DetailedProjectRowProps> = ({ project }) => {
  const isInProgress = project.status === 'In Progress';

  return (
    <div className={`bg-slate-900 rounded-2xl border ${isInProgress ? 'border-yellow-500/20' : 'border-slate-800'} overflow-hidden flex flex-col md:flex-row hover:border-[#39ff14]/50 transition-all duration-300 group shadow-lg hover:shadow-[0_10px_30px_-5px_rgba(57,255,20,0.15)]`}>
      {/* Left Side: Visual Placeholder */}
      <div className="w-full md:w-1/3 min-h-[220px] bg-slate-800/50 relative border-b md:border-b-0 md:border-r border-slate-800 group-hover:bg-slate-800/80 transition-colors overflow-hidden">
         {/* Decorative Background */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-700/20 to-transparent opacity-50"></div>
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#39ff14 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
         
         <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 group-hover:text-[#39ff14] transition-colors p-6 text-center">
           <Layers size={48} strokeWidth={1} className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
           <span className="text-xs font-mono-tech uppercase tracking-widest opacity-70">Project Snapshot</span>
         </div>
      </div>

      {/* Right Side: Technical Content */}
      <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col">
         {/* Header */}
         <div className="flex justify-between items-start mb-6">
            <div>
               <div className="flex items-center gap-3 mb-3">
                 <h3 className="text-2xl font-bold text-white group-hover:text-[#39ff14] transition-colors">{project.title}</h3>
                 {isInProgress && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-wider shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                      🚧 In Development
                    </span>
                 )}
               </div>
               <div className="flex flex-wrap gap-2">
                  {project.techStack.map(t => (
                    <span key={t} className="text-[10px] px-2.5 py-1 rounded bg-[#39ff14]/5 text-[#39ff14] border border-[#39ff14]/20 font-medium">
                        {t}
                    </span>
                  ))}
               </div>
            </div>
            
            {isInProgress ? (
               <button disabled className="px-3 py-1.5 rounded-lg bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider border border-slate-700 cursor-not-allowed select-none">
                 Coming Soon
               </button>
            ) : (
                project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <ExternalLink size={20} />
                    </a>
                )
            )}
         </div>

         {/* Challenge & Solution Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
               <h4 className="text-amber-500/90 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                 The Challenge
               </h4>
               <p className="text-sm text-slate-400 leading-relaxed font-light">
                 {project.challenge || "Optimizing complex systems for performance and scalability."}
               </p>
            </div>
            <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
               <h4 className="text-[#39ff14] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                 The Solution
               </h4>
               <p className="text-sm text-slate-400 leading-relaxed font-light">
                 {project.solution || "Implemented efficient algorithms and robust architectural patterns."}
               </p>
            </div>
         </div>

         {/* Key Features */}
         <div className="mt-auto">
            <h4 className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-3">Key Technical Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               {project.features?.map((feature, idx) => (
                 <div key={idx} className="flex items-start gap-2 text-sm text-slate-400 group/item">
                   <ArrowRight size={14} className="mt-1 text-[#39ff14]/50 group-hover/item:text-[#39ff14] transition-colors shrink-0" />
                   <span className="leading-snug">{feature}</span>
                 </div>
               )) || (
                 <div className="text-slate-500 italic text-sm">Feature list loading...</div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};