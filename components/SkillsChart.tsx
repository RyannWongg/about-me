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
import { Cpu, Terminal, Globe } from 'lucide-react';

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
      backgroundColor: 'rgba(57, 255, 20, 0.1)',
      borderColor: '#39ff14',
      pointBackgroundColor: '#39ff14',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#39ff14',
      borderWidth: 2,
    },
  ],
};

const radarOptions: ChartOptions<'radar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { color: 'rgba(148, 163, 184, 0.1)' },
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      pointLabels: {
        color: '#94a3b8',
        font: { size: 13, family: "'Orbitron', sans-serif" }
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
    }
  },
};

export const SkillsChart: React.FC = () => {
  const languages = ['Python', 'C', 'Java', 'SQL', 'Assembly'];
  const webTools = ['HTML5', 'CSS3', 'JavaScript', 'Git', 'React', 'VS Code'];

  return (
    <div className="col-span-1 md:col-span-2 bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 flex flex-col relative overflow-hidden h-full">
      <div className="flex items-center justify-between mb-4 z-10">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Skill Matrix
          </h3>
          <p className="text-sm text-slate-400">Technical Competencies</p>
        </div>
        <Cpu size={18} className="text-[#39ff14]" />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
        {/* Radar Chart Section */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
            <h4 className="text-xs font-bold text-[#39ff14] uppercase tracking-wider mb-4">Core Proficiency</h4>
            <div className="w-full h-[220px] relative z-10">
                <Radar data={devSkillsData} options={radarOptions} />
            </div>
        </div>

        {/* Tech Badges Section */}
        <div className="flex flex-col justify-center space-y-6">
            
            {/* Languages Group */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <Terminal size={14} className="text-[#39ff14]" /> Languages
                </h4>
                <div className="flex flex-wrap gap-2">
                    {languages.map(skill => (
                        <span key={skill} className="px-3 py-1.5 rounded-full bg-slate-950 border border-[#39ff14]/30 text-slate-300 text-xs font-medium hover:bg-[#39ff14]/10 hover:text-[#39ff14] hover:border-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all cursor-default select-none transform hover:-translate-y-0.5">
                           {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Web & Tools Group */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <Globe size={14} className="text-[#39ff14]" /> Web & Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                    {webTools.map(skill => (
                        <span key={skill} className="px-3 py-1.5 rounded-full bg-slate-950 border border-[#39ff14]/30 text-slate-300 text-xs font-medium hover:bg-[#39ff14]/10 hover:text-[#39ff14] hover:border-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all cursor-default select-none transform hover:-translate-y-0.5">
                           {skill}
                        </span>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};