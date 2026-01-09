import React from 'react';
import { TimelineEvent } from '../types';
import { Briefcase, Beaker, Terminal } from 'lucide-react';

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

export const Timeline: React.FC = () => {
  return (
    <div className="col-span-1 bg-slate-900 rounded-2xl shadow-lg border border-slate-800 flex flex-col h-full">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Experience Log</h3>
          <p className="text-sm text-slate-400">Career Trajectory</p>
        </div>
        <Terminal size={18} className="text-[#39ff14]" />
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="relative border-l-2 border-slate-800 ml-3 space-y-10 pb-2">
          {events.map((event) => (
            <div key={event.id} className="relative pl-8 group">
              {/* Dot */}
              <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-300 group-hover:scale-125 bg-[#39ff14] shadow-[0_0_8px_rgba(57,255,20,0.6)]">
              </span>

              {/* Icon floating */}
              <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full pr-2 text-[#39ff14]">
                {event.subtitle.includes('SJM') ? <Briefcase size={16}/> : event.description.some(d => d.includes('iGEM')) ? <Beaker size={16} /> : <Terminal size={16} />}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                <span className="font-mono-tech text-[10px] font-bold text-[#39ff14] bg-[#39ff14]/10 border border-[#39ff14]/20 px-2 py-0.5 rounded-sm inline-block w-max mb-1 sm:mb-0">
                  {event.year}
                </span>
              </div>
              
              <h4 className="text-sm font-bold text-slate-100 mt-1">{event.title}</h4>
              <p className="text-xs font-semibold text-slate-400 mb-3">{event.subtitle}</p>
              
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 group-hover:border-[#39ff14]/30 transition-colors">
                <ul className="list-disc list-inside space-y-1">
                  {event.description.map((item, i) => (
                    <li key={i} className="text-xs text-slate-400 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};