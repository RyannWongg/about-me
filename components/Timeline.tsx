import React, { useState, useEffect, useRef } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            // Animate items from past to present (reverse order: last to first)
            const totalItems = events.length;
            events.forEach((_, index) => {
              // Reverse the order: last item (past) appears first
              const reverseIndex = totalItems - 1 - index;
              setTimeout(() => {
                setAnimatedItems((prev) => [...prev, reverseIndex]);
              }, index * 400); // 400ms delay between each item
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div ref={sectionRef} className="w-full py-20 relative">
      {/* Section Header */}
      <div className={`max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-16 text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <p className="font-mono-refined text-[10px] font-semibold text-[#39ff14] tracking-[0.35em] uppercase mb-5 opacity-90">
          Experience & Education
        </p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-[-0.02em] leading-[1.1]">
          Career Log
        </h2>
        <p className="font-body-refined text-slate-500 text-sm md:text-base font-normal tracking-wide max-w-md mx-auto leading-relaxed">
          My journey — Present to Past
        </p>
      </div>

      {/* Timeline Track */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="relative flex flex-wrap justify-center gap-8">
          {/* Connecting Line - animates from right to left */}
          <div
            className="hidden sm:block absolute top-7 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-[#39ff14]/60 via-slate-600 to-slate-700 transition-all duration-1000 ease-out origin-right"
            style={{
              width: 'calc(100% - 120px)',
              transform: `translateX(-50%) scaleX(${animatedItems.length === events.length ? 1 : 0})`,
            }}
          />

          {events.map((event, index) => {
            const Icon = getEventIcon(event);
            const isFirst = index === 0;
            const isAnimated = animatedItems.includes(index);

            return (
              <div
                key={event.id}
                className={`relative flex flex-col items-center group w-full sm:w-[320px] transition-all duration-700 ease-out ${
                  isAnimated
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                }`}
              >
                {/* Node */}
                <div className={`relative mb-6 z-10 transition-all duration-500 ${
                  isAnimated ? 'scale-100' : 'scale-0'
                }`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 backdrop-blur-sm ${
                    isFirst
                      ? 'bg-[#39ff14]/20 border-2 border-[#39ff14] shadow-[0_0_25px_rgba(57,255,20,0.5)] rotate-45'
                      : 'bg-slate-800/80 border-2 border-slate-600 group-hover:border-[#39ff14]/50 group-hover:bg-[#39ff14]/10 group-hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] rotate-45'
                  }`}>
                    <Icon
                      size={20}
                      className={`${isFirst ? 'text-[#39ff14]' : 'text-slate-400 group-hover:text-[#39ff14]'} transition-colors -rotate-45`}
                    />
                  </div>
                </div>

                {/* Card */}
                <div className={`bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 transition-all duration-500 group-hover:border-[#39ff14]/40 group-hover:bg-slate-800/80 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(57,255,20,0.1)] group-hover:-translate-y-2 cursor-pointer w-full ${
                  isAnimated ? 'scale-100' : 'scale-95'
                }`}>
                  {/* Year Badge */}
                  <div className="flex items-center gap-2.5 mb-5 flex-wrap">
                    <span className="font-mono-refined text-[10px] font-bold text-[#39ff14] bg-[#39ff14]/10 border border-[#39ff14]/30 px-3 py-1.5 rounded-lg tracking-[0.08em]">
                      {event.year}
                    </span>
                    {isFirst && (
                      <span className="font-mono-refined text-[8px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-md uppercase tracking-[0.2em] animate-pulse">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="font-display text-lg md:text-xl font-bold text-white group-hover:text-[#39ff14] transition-colors mb-2 tracking-[-0.01em] leading-snug">
                    {event.title}
                  </h4>
                  <p className="font-mono-refined text-[11px] font-medium text-slate-500 mb-5 tracking-[0.05em] uppercase">{event.subtitle}</p>

                  {/* Description */}
                  <ul className="space-y-3">
                    {event.description.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 font-body-refined text-[13px] text-slate-400 leading-[1.7] group-hover:text-slate-300 transition-colors"
                      >
                        <ChevronRight size={12} className="text-[#39ff14]/50 mt-1 shrink-0 group-hover:text-[#39ff14] transition-colors" />
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
