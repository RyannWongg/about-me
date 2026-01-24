import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Cpu, Terminal, Globe, Sparkles, Cloud } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const devSkillsData = {
  labels: ['Python', 'C', 'Java', 'Assembly', 'SQL'],
  datasets: [
    {
      label: 'Proficiency',
      data: [90, 80, 85, 70, 85],
      backgroundColor: 'rgba(57, 255, 20, 0.12)',
      borderColor: '#39ff14',
      pointBackgroundColor: '#39ff14',
      pointBorderColor: '#0f172a',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#39ff14',
      pointBorderWidth: 2,
      borderWidth: 2,
    },
  ],
};

const radarOptions: ChartOptions<'radar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { color: 'rgba(148, 163, 184, 0.08)' },
      grid: { color: 'rgba(148, 163, 184, 0.08)' },
      pointLabels: {
        color: '#94a3b8',
        font: { size: 12, family: "'Orbitron', sans-serif", weight: '500' }
      },
      ticks: { display: false, backdropColor: 'transparent' },
      suggestedMin: 0,
      suggestedMax: 100,
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      titleColor: '#39ff14',
      bodyColor: '#fff',
      borderColor: '#39ff14',
      borderWidth: 1,
      displayColors: false,
      padding: 12,
      cornerRadius: 8,
    }
  },
};

interface SkillBadgeProps {
  skill: string;
  variant?: 'primary' | 'secondary';
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, variant = 'primary' }) => {
  const isPrimary = variant === 'primary';
  return (
    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-default select-none border ${
      isPrimary
        ? 'bg-slate-950/80 border-[#39ff14]/20 text-slate-300 hover:bg-[#39ff14]/10 hover:text-[#39ff14] hover:border-[#39ff14]/50 hover:shadow-[0_0_12px_rgba(57,255,20,0.25)]'
        : 'bg-slate-950/80 border-orange-400/20 text-slate-300 hover:bg-orange-400/10 hover:text-orange-400 hover:border-orange-400/50 hover:shadow-[0_0_12px_rgba(251,146,60,0.25)]'
    }`}>
      {skill}
    </span>
  );
};

export const SkillsChart: React.FC = () => {
  const languages = ['Python', 'C', 'Java', 'SQL', 'Assembly', 'TypeScript'];
  const webTools = ['HTML5', 'CSS3', 'JavaScript', 'Git', 'React', 'D3.js'];
  const librariesAI = ['Pandas', 'NumPy', 'OpenCV', 'OpenAI API'];
  const cloudInfra = ['GCP', 'Firebase'];

  return (
    <div className="col-span-1 md:col-span-2 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 pl-1">
        <div className="p-1.5 rounded-lg bg-[#39ff14]/10">
          <Cpu size={16} className="text-[#39ff14]" />
        </div>
        <h3 className="text-base font-mono-tech text-slate-200 tracking-widest uppercase font-bold">Skill Matrix</h3>
        <div className="h-[2px] w-10 bg-gradient-to-r from-[#39ff14] to-[#39ff14]/30 rounded-full"></div>
        <div className="h-px flex-1 bg-slate-800/60"></div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl shadow-xl border border-slate-800/80 p-6 flex flex-col relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-[#39ff14]/3 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8">
          {/* Radar Chart Section */}
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800/50 pb-6 md:pb-0 md:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/20 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] shadow-[0_0_6px_rgba(57,255,20,0.8)]"></div>
              <span className="text-[10px] font-bold text-[#39ff14] uppercase tracking-wider">Core Proficiency</span>
            </div>
            <div className="w-full h-[220px] relative z-10">
              <Radar data={devSkillsData} options={radarOptions} />
            </div>
          </div>

          {/* Tech Badges Section */}
          <div className="flex flex-col justify-center space-y-5 md:pl-2">

            {/* Languages Group */}
            <div className="group">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-2 group-hover:text-slate-400 transition-colors">
                <Terminal size={13} className="text-[#39ff14]" /> Languages
              </h4>
              <div className="flex flex-wrap gap-2">
                {languages.map(skill => <SkillBadge key={skill} skill={skill} />)}
              </div>
            </div>

            {/* Web & Tools Group */}
            <div className="group">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-2 group-hover:text-slate-400 transition-colors">
                <Globe size={13} className="text-[#39ff14]" /> Web & Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {webTools.map(skill => <SkillBadge key={skill} skill={skill} />)}
              </div>
            </div>

            {/* Libraries & AI Group */}
            <div className="group">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-2 group-hover:text-slate-400 transition-colors">
                <Sparkles size={13} className="text-[#39ff14]" /> Libraries & AI
              </h4>
              <div className="flex flex-wrap gap-2">
                {librariesAI.map(skill => <SkillBadge key={skill} skill={skill} />)}
              </div>
            </div>

            {/* Cloud & Infrastructure Group */}
            <div className="group">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-2 group-hover:text-slate-400 transition-colors">
                <Cloud size={13} className="text-orange-400" /> Cloud & Infra
              </h4>
              <div className="flex flex-wrap gap-2">
                {cloudInfra.map(skill => <SkillBadge key={skill} skill={skill} variant="secondary" />)}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};