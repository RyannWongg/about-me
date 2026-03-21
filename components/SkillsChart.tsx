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
import { Terminal, Globe, Sparkles, Cloud } from 'lucide-react';

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
      backgroundColor: 'rgba(57, 255, 20, 0.15)',
      borderColor: '#39ff14',
      pointBackgroundColor: '#39ff14',
      pointBorderColor: '#0f172a',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#39ff14',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
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
        color: '#cbd5e1',
        font: { size: 10, family: "'JetBrains Mono', monospace", weight: '600' }
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
      bodyColor: '#e2e8f0',
      borderColor: 'rgba(57, 255, 20, 0.4)',
      borderWidth: 1,
      displayColors: false,
      padding: 12,
      cornerRadius: 8,
      titleFont: { weight: 'bold', size: 11, family: "'Syne', sans-serif" },
      bodyFont: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
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
    <span className={`font-mono-refined px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-[0.04em] transition-all duration-300 cursor-default select-none border backdrop-blur-sm ${
      isPrimary
        ? 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-[#39ff14]/15 hover:text-[#39ff14] hover:border-[#39ff14]/40 hover:shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:-translate-y-0.5'
        : 'bg-slate-800/50 border-orange-500/30 text-slate-300 hover:bg-orange-500/15 hover:text-orange-400 hover:border-orange-400/50 hover:shadow-[0_0_20px_rgba(251,146,60,0.2)] hover:-translate-y-0.5'
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
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8 md:p-10 relative overflow-hidden group hover:border-slate-600/50 transition-colors duration-500">
      {/* Ambient glow effects */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#39ff14]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#39ff14]/8 transition-colors duration-700"></div>
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/3 rounded-full blur-3xl pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        {/* Radar Chart Section */}
        <div className="flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 mb-8 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] shadow-[0_0_8px_rgba(57,255,20,0.8)] animate-pulse"></div>
            <span className="font-mono-refined text-[9px] font-bold text-[#39ff14] uppercase tracking-[0.25em]">Core Proficiency</span>
          </div>
          <div className="w-full max-w-[280px] h-[280px] relative z-10">
            <Radar data={devSkillsData} options={radarOptions} />
          </div>
        </div>

        {/* Tech Badges Section */}
        <div className="flex flex-col justify-center space-y-7">

          {/* Languages Group */}
          <div className="group/section">
            <h4 className="font-mono-refined text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3 group-hover/section:text-slate-200 transition-colors">
              <div className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 group-hover/section:border-[#39ff14]/30 transition-colors">
                <Terminal size={12} className="text-[#39ff14]" />
              </div>
              Languages
            </h4>
            <div className="flex flex-wrap gap-2">
              {languages.map(skill => <SkillBadge key={skill} skill={skill} />)}
            </div>
          </div>

          {/* Web & Tools Group */}
          <div className="group/section">
            <h4 className="font-mono-refined text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3 group-hover/section:text-slate-200 transition-colors">
              <div className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 group-hover/section:border-[#39ff14]/30 transition-colors">
                <Globe size={12} className="text-[#39ff14]" />
              </div>
              Web & Tools
            </h4>
            <div className="flex flex-wrap gap-2">
              {webTools.map(skill => <SkillBadge key={skill} skill={skill} />)}
            </div>
          </div>

          {/* Libraries & AI Group */}
          <div className="group/section">
            <h4 className="font-mono-refined text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3 group-hover/section:text-slate-200 transition-colors">
              <div className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 group-hover/section:border-[#39ff14]/30 transition-colors">
                <Sparkles size={12} className="text-[#39ff14]" />
              </div>
              Libraries & AI
            </h4>
            <div className="flex flex-wrap gap-2">
              {librariesAI.map(skill => <SkillBadge key={skill} skill={skill} />)}
            </div>
          </div>

          {/* Cloud & Infrastructure Group */}
          <div className="group/section">
            <h4 className="font-mono-refined text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3 group-hover/section:text-slate-200 transition-colors">
              <div className="p-1.5 rounded-lg bg-slate-800/60 border border-orange-500/30 group-hover/section:border-orange-400/50 transition-colors">
                <Cloud size={12} className="text-orange-400" />
              </div>
              Cloud & Infra
            </h4>
            <div className="flex flex-wrap gap-2">
              {cloudInfra.map(skill => <SkillBadge key={skill} skill={skill} variant="secondary" />)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
