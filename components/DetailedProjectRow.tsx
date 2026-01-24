import React from 'react';
import { Project } from '../types';
import { ExternalLink, Layers, ChevronRight, AlertTriangle, Lightbulb, Clock, CheckCircle2 } from 'lucide-react';

interface DetailedProjectRowProps {
  project: Project;
}

export const DetailedProjectRow: React.FC<DetailedProjectRowProps> = ({ project }) => {
  const isInProgress = project.status === 'In Progress';

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl border ${isInProgress ? 'border-amber-500/30' : 'border-slate-800/80'} overflow-hidden flex flex-col md:flex-row hover:border-[#39ff14]/40 transition-all duration-300 group shadow-xl hover:shadow-[0_20px_50px_-10px_rgba(57,255,20,0.1)]`}>
      {/* Left Side: Project Image or Placeholder */}
      <div className="w-full md:w-1/3 min-h-[240px] bg-gradient-to-br from-slate-800/60 to-slate-900/60 relative border-b md:border-b-0 md:border-r border-slate-800/60 overflow-hidden">
        {project.image ? (
          <>
            <img
              src={`${import.meta.env.BASE_URL}${project.image}`}
              alt={`${project.title} preview`}
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />
            {/* Overlay gradient for better text contrast if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        ) : (
          <>
            {/* Decorative Background */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#39ff14 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#39ff14]/5 rounded-full blur-3xl group-hover:bg-[#39ff14]/10 transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 group-hover:text-[#39ff14] transition-colors p-6 text-center">
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 group-hover:border-[#39ff14]/30 group-hover:bg-[#39ff14]/10 transition-all duration-300 mb-4">
                <Layers size={36} strokeWidth={1.5} className="opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity">Project Snapshot</span>
            </div>
          </>
        )}
      </div>

      {/* Right Side: Technical Content */}
      <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col relative">
        {/* Corner glow on hover */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#39ff14]/3 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-5 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#39ff14] transition-colors">{project.title}</h3>
              {isInProgress ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  <Clock size={10} />
                  In Progress
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  <CheckCircle2 size={10} />
                  Completed
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map(t => (
                <span key={t} className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/50 font-medium group-hover:text-[#39ff14] group-hover:border-[#39ff14]/30 transition-colors">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {isInProgress ? (
            <button disabled className="px-4 py-2 rounded-xl bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider border border-slate-700/50 cursor-not-allowed select-none">
              Coming Soon
            </button>
          ) : (
            project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-slate-400 hover:text-[#39ff14] bg-slate-800/50 hover:bg-[#39ff14]/10 rounded-xl transition-all duration-200 border border-slate-700/50 hover:border-[#39ff14]/30 cursor-pointer"
              >
                <ExternalLink size={18} />
              </a>
            )
          )}
        </div>

        {/* Challenge & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 relative z-10">
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/50 hover:border-amber-500/30 transition-colors group/card">
            <h4 className="text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertTriangle size={12} />
              The Challenge
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed group-hover/card:text-slate-300 transition-colors">
              {project.challenge || "Optimizing complex systems for performance and scalability."}
            </p>
          </div>
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/50 hover:border-[#39ff14]/30 transition-colors group/card">
            <h4 className="text-[#39ff14] text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Lightbulb size={12} />
              The Solution
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed group-hover/card:text-slate-300 transition-colors">
              {project.solution || "Implemented efficient algorithms and robust architectural patterns."}
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-auto relative z-10">
          <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-3">Key Technical Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {project.features?.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-slate-400 p-2 rounded-lg hover:bg-slate-800/30 transition-colors group/item">
                <ChevronRight size={14} className="mt-0.5 text-[#39ff14]/50 group-hover/item:text-[#39ff14] transition-colors shrink-0" />
                <span className="leading-snug group-hover/item:text-slate-300 transition-colors">{feature}</span>
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