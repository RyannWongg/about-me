import React from 'react';
import { TimelineEvent } from '../types';
import { Briefcase, GraduationCap, Code2, ChevronRight } from 'lucide-react';

const events: TimelineEvent[] = [
  {
    id: '3',
    year: '2022 - Present',
    title: 'Bachelor of Arts & Science',
    subtitle: 'University of Toronto',
    description: [
      'Current: Specialist in Mathematics & Statistics, Major in Computer Science.',
      'Focus: Data Analysis, C, Python, & Statistical Modeling.'
    ],
    type: 'education'
  },
  {
    id: '1',
    year: '2025.07 - 2025.08',
    title: 'IT Support and Software Testing',
    subtitle: 'SJM Macau',
    description: [
      'Executed Software QA Testing & Bug Documentation.',
      'Resolved critical hardware/software system issues for end-users.'
    ],
    type: 'experience'
  },
  {
    id: '2',
    year: '2020.10 - 2021.03',
    title: 'Website Developer',
    subtitle: 'Macau Pui Ching Middle School',
    description: [
      'Architected the iGEM Research Portal (HTML/CSS/JS).',
      'Optimized front-end performance and cross-browser compatibility.'
    ],
    type: 'experience'
  }
];

const getEventIcon = (event: TimelineEvent) => {
  if (event.type === 'education') return GraduationCap;
  if (event.subtitle.includes('SJM')) return Briefcase;
  return Code2;
};

export const Timeline: React.FC = () => {
  return (
    <div className="col-span-1 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl shadow-xl border border-slate-800/80 flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-800/60 flex justify-between items-center bg-slate-900/50">
        <div>
          <h3 className="text-base font-bold text-white">Experience Log</h3>
          <p className="text-xs text-slate-500 mt-0.5">Career Trajectory</p>
        </div>
        <div className="p-2 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
          <Code2 size={16} className="text-[#39ff14]" />
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="relative ml-4 space-y-8">
          {/* Timeline line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-[#39ff14]/50 via-slate-700 to-slate-800"></div>

          {events.map((event, index) => {
            const Icon = getEventIcon(event);
            return (
              <div key={event.id} className="relative pl-8 group">
                {/* Dot with icon */}
                <div className="absolute -left-[14px] top-0 flex items-center justify-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index === 0
                      ? 'bg-[#39ff14]/20 border-2 border-[#39ff14] shadow-[0_0_12px_rgba(57,255,20,0.4)] group-hover:shadow-[0_0_18px_rgba(57,255,20,0.6)]'
                      : 'bg-slate-800 border-2 border-slate-700 group-hover:border-[#39ff14]/50 group-hover:bg-[#39ff14]/10'
                  }`}>
                    <Icon size={12} className={index === 0 ? 'text-[#39ff14]' : 'text-slate-500 group-hover:text-[#39ff14] transition-colors'} />
                  </div>
                </div>

                {/* Content card */}
                <div className="bg-slate-800/30 rounded-xl border border-slate-800/60 p-4 transition-all duration-300 group-hover:border-[#39ff14]/30 group-hover:bg-slate-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] font-semibold text-[#39ff14] bg-[#39ff14]/10 border border-[#39ff14]/20 px-2 py-0.5 rounded">
                      {event.year}
                    </span>
                    {index === 0 && (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Current
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-[#39ff14] transition-colors">{event.title}</h4>
                  <p className="text-xs font-medium text-slate-500 mb-3">{event.subtitle}</p>

                  <ul className="space-y-1.5">
                    {event.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                        <ChevronRight size={12} className="text-[#39ff14]/50 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};