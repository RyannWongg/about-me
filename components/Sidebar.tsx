import React from 'react';
import { LayoutDashboard, FolderKanban, Mail, Github, Linkedin, MapPin } from 'lucide-react';

interface SidebarProps {
  className?: string;
  currentView: 'dashboard' | 'projects';
  onNavigate: (view: 'dashboard' | 'projects') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = "", currentView, onNavigate }) => {
  return (
    <aside className={`flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-400 shadow-2xl ${className}`}>
      {/* Profile Section */}
      <div className="p-6 border-b border-slate-800 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-slate-800 mb-4 overflow-hidden ring-2 ring-[#39ff14] ring-offset-2 ring-offset-slate-900 shadow-[0_0_15px_rgba(57,255,20,0.5)]">
          <img
            src="/profile.png"
            alt="Profile"
            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Ip Fong Wong (Ryan)</h2>
        <p className="text-xs text-[#39ff14] mt-1 font-medium tracking-wide">Math, Statistics & CS Student @ U of Toronto</p>
        
        <div className="mt-4 mb-4 text-[0.9rem] text-slate-400 leading-[1.6] px-2 text-center">
          Merging statistical rigor with creative software design. Building tools that turn complex data into clear insights.
        </div>

        <div className="flex flex-col gap-2 mb-4 px-2 w-full">
            <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                <MapPin size={12} className="text-[#39ff14]" />
                <span>Toronto, Canada</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                <Mail size={12} className="text-[#39ff14]" />
                <a href="mailto:fong20040311@gmail.com" className="hover:text-white transition-colors">fong20040311@gmail.com</a>
            </div>
        </div>
        
        <div className="flex gap-3 px-2">
          <a href="https://github.com/RyannWongg" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-800 hover:bg-[#39ff14]/20 hover:text-[#39ff14] transition-all border border-slate-700 hover:border-[#39ff14]/50">
            <Github size={18} />
          </a>
          <a href="https://www.linkedin.com/in/ip-fong-wong-ryan/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-800 hover:bg-[#39ff14]/20 hover:text-[#39ff14] transition-all border border-slate-700 hover:border-[#39ff14]/50">
            <Linkedin size={18} />
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-1">
          <li>
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                currentView === 'dashboard' 
                  ? 'bg-[#39ff14]/10 text-[#39ff14] border-r-2 border-[#39ff14] shadow-[inset_10px_0_20px_-10px_rgba(57,255,20,0.2)]' 
                  : 'hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <LayoutDashboard size={20} className={currentView === 'dashboard' ? '' : 'group-hover:text-[#39ff14] transition-colors'} />
              <span className="font-medium">Dashboard</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => onNavigate('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                currentView === 'projects' 
                  ? 'bg-[#39ff14]/10 text-[#39ff14] border-r-2 border-[#39ff14] shadow-[inset_10px_0_20px_-10px_rgba(57,255,20,0.2)]' 
                  : 'hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <FolderKanban size={20} className={currentView === 'projects' ? '' : 'group-hover:text-[#39ff14] transition-colors'} />
              <span className="font-medium">Projects</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-600 text-center font-mono">
        © 2024 Ryan Wong
      </div>
    </aside>
  );
};