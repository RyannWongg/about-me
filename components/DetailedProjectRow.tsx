import React from 'react';
import { Project } from '../types';
import { ExternalLink, Layers, ChevronRight, AlertTriangle, Lightbulb, Clock, CheckCircle2, Hammer, Code2 } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface DetailedProjectRowProps {
  project: Project;
  index?: number;
}

export const DetailedProjectRow: React.FC<DetailedProjectRowProps> = ({ project, index = 0 }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });
  const isInProgress = project.status === 'In Progress';
  const isReversed = index % 2 === 1;

  // Alternate animation direction based on row index
  const animationClass = isReversed ? 'scroll-animate-right' : 'scroll-animate-left';

  return (
    <div
      ref={ref}
      className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-12 lg:gap-16 items-center group ${animationClass} ${isVisible ? 'visible' : ''}`}
    >

      {/* Image Section */}
      <div className="w-full md:w-1/2 relative">
        <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 transition-all duration-700 ${
          isInProgress
            ? 'group-hover:shadow-[0_30px_60px_-15px_rgba(251,191,36,0.15)]'
            : 'group-hover:shadow-[0_30px_60px_-15px_rgba(57,255,20,0.15)]'
        }`}>
          {project.image ? (
            <>
              <img
                src={`${import.meta.env.BASE_URL}${project.image}`}
                alt={`${project.title} preview`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
            </>
          ) : isInProgress ? (
            /* In Progress Placeholder */
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800/90 to-slate-900">
              {/* Animated diagonal stripes pattern */}
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #fbbf24 0, #fbbf24 1px, transparent 0, transparent 50%)',
                  backgroundSize: '12px 12px'
                }}
              ></div>

              {/* Animated scan line */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute w-full h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent animate-pulse"
                  style={{ top: '40%' }}
                ></div>
              </div>

              {/* Ambient glows - amber theme */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/8 rounded-full blur-3xl"></div>

              {/* Code lines decoration */}
              <div className="absolute top-6 left-6 right-6 space-y-2 opacity-20">
                <div className="h-2 bg-amber-500/40 rounded w-3/4"></div>
                <div className="h-2 bg-amber-500/30 rounded w-1/2"></div>
                <div className="h-2 bg-amber-500/20 rounded w-2/3"></div>
              </div>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Pulsing ring */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-amber-500/20 animate-ping"></div>
                  <div className="relative p-5 rounded-2xl bg-slate-800/80 border border-amber-500/40 group-hover:border-amber-400/60 group-hover:bg-amber-500/15 transition-all duration-500 mb-4 backdrop-blur-sm">
                    <div className="relative">
                      <Hammer size={36} strokeWidth={1.5} className="text-amber-400 opacity-80 group-hover:opacity-100 transition-opacity" />
                      <Code2 size={18} className="absolute -bottom-1 -right-1 text-amber-500/60" />
                    </div>
                  </div>
                </div>

                {/* Status text */}
                <div className="text-center">
                  <span className="font-mono-refined text-[10px] text-amber-400 uppercase tracking-[0.3em] font-bold">
                    Building
                  </span>
                  <div className="flex items-center gap-1 mt-2 justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="font-mono-refined text-[8px] text-slate-500 uppercase tracking-[0.2em] mt-2 text-center">
                    In Development
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Default Placeholder for completed without image */
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/90">
              {/* Decorative grid pattern */}
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#39ff14 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

              {/* Ambient glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#39ff14]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>

              {/* Placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 group-hover:text-[#39ff14] transition-colors duration-500">
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 group-hover:border-[#39ff14]/30 group-hover:bg-[#39ff14]/10 transition-all duration-500 mb-4">
                  <Layers size={48} strokeWidth={1.5} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="font-mono-refined text-[10px] uppercase tracking-[0.3em] opacity-40 group-hover:opacity-80 transition-opacity">Preview</span>
              </div>
            </div>
          )}
        </div>

        {/* Floating accent line */}
        <div className={`absolute ${isReversed ? '-left-4' : '-right-4'} top-1/2 -translate-y-1/2 w-1 h-24 bg-gradient-to-b from-transparent ${isInProgress ? 'via-amber-500/50' : 'via-[#39ff14]/50'} to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      </div>

      {/* Content Section */}
      <div className={`w-full md:w-1/2 ${isReversed ? 'md:text-right' : 'md:text-left'}`}>

        {/* Status & Tech Stack */}
        <div className={`flex flex-wrap gap-2 mb-4 ${isReversed ? 'md:justify-end' : 'md:justify-start'}`}>
          {isInProgress ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono-refined text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-[0.15em]">
              <Clock size={10} className="animate-pulse" />
              In Progress
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono-refined text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-[0.15em]">
              <CheckCircle2 size={10} />
              Completed
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white group-hover:text-[#39ff14] transition-colors duration-500 tracking-[-0.02em] leading-tight mb-3">
          {project.title}
        </h3>

        {/* Tech Stack */}
        <div className={`flex flex-wrap gap-2 mb-6 ${isReversed ? 'md:justify-end' : 'md:justify-start'}`}>
          {project.techStack.map(t => (
            <span key={t} className="font-mono-refined text-[10px] px-3 py-1.5 text-slate-400 border-b border-slate-700/50 font-semibold tracking-[0.04em] group-hover:text-[#39ff14] group-hover:border-[#39ff14]/40 transition-all duration-300">
              {t}
            </span>
          ))}
        </div>

        {/* Challenge & Solution */}
        <div className="space-y-4 mb-6">
          <div className={`flex items-start gap-3 ${isReversed ? 'md:flex-row-reverse md:text-right' : ''}`}>
            <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/25 shrink-0">
              <AlertTriangle size={14} className="text-amber-400" />
            </div>
            <div>
              <h4 className="font-mono-refined text-amber-400 text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5">Challenge</h4>
              <p className="font-body-refined text-[13px] text-slate-400 leading-[1.7]">
                {project.challenge || "Optimizing complex systems for performance and scalability."}
              </p>
            </div>
          </div>

          <div className={`flex items-start gap-3 ${isReversed ? 'md:flex-row-reverse md:text-right' : ''}`}>
            <div className="p-2 rounded-lg bg-[#39ff14]/15 border border-[#39ff14]/25 shrink-0">
              <Lightbulb size={14} className="text-[#39ff14]" />
            </div>
            <div>
              <h4 className="font-mono-refined text-[#39ff14] text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5">Solution</h4>
              <p className="font-body-refined text-[13px] text-slate-400 leading-[1.7]">
                {project.solution || "Implemented efficient algorithms and robust architectural patterns."}
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className={`mb-6 ${isReversed ? 'md:text-right' : ''}`}>
          <h4 className="font-mono-refined text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-3">Key Features</h4>
          <div className={`flex flex-wrap gap-x-5 gap-y-2 ${isReversed ? 'md:justify-end' : ''}`}>
            {project.features?.map((feature, idx) => (
              <div key={idx} className={`flex items-center gap-2 ${isReversed ? 'md:flex-row-reverse' : ''}`}>
                <ChevronRight size={11} className="text-[#39ff14]/50" />
                <span className="font-body-refined text-[12px] text-slate-400 leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        <div className={`flex ${isReversed ? 'md:justify-end' : 'md:justify-start'}`}>
          {isInProgress ? (
            <span className="font-mono-refined text-[10px] text-slate-600 uppercase tracking-[0.2em] font-semibold">
              Coming Soon
            </span>
          ) : (
            project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono-refined text-[10px] text-slate-400 hover:text-[#39ff14] uppercase tracking-[0.15em] font-semibold transition-colors duration-300 group/link"
              >
                <span>View Project</span>
                <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
};
