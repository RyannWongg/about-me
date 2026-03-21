import React from 'react';
import { LayoutDashboard, FolderKanban, Mail, Github, Linkedin, MapPin, Sparkles, Building2 } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  className?: string;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isHorizontal?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = "", currentView, onNavigate, isHorizontal = false }) => {
  if (isHorizontal) {
    return (
      <header className={`w-full bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-slate-400 ${className}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">
          {/* Top Row: Profile + Navigation */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar */}
              <div className="relative group cursor-pointer shrink-0">
                <div className="w-20 h-20 rounded-full bg-slate-800 overflow-hidden ring-2 ring-[#39ff14]/70 ring-offset-4 ring-offset-slate-900 shadow-[0_0_25px_rgba(57,255,20,0.4)] transition-all duration-300 group-hover:ring-[#39ff14] group-hover:shadow-[0_0_35px_rgba(57,255,20,0.6)]">
                  <img
                    src={`${import.meta.env.BASE_URL}profile.png`}
                    alt="Profile"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#39ff14] rounded-full border-2 border-slate-900 flex items-center justify-center shadow-[0_0_10px_rgba(57,255,20,0.6)]">
                  <Sparkles size={10} className="text-slate-900" />
                </div>
              </div>

              {/* Info */}
              <div className="text-center sm:text-left">
                <h2 className="font-display text-xl font-bold text-white tracking-tight">Ip Fong Wong (Ryan)</h2>
                <p className="font-mono-refined text-[10px] text-[#39ff14] mt-1.5 font-bold tracking-[0.15em] uppercase">Math, Statistics & CS @ UofT</p>
                <p className="font-body-refined mt-2 text-[13px] text-slate-400 leading-relaxed max-w-md hidden md:block">
                  Merging statistical rigor with creative software design. Building tools that turn complex data into clear insights.
                </p>

                {/* Contact & Social Row */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3">
                  <div className="flex items-center gap-1.5 font-body-refined text-[11px] text-slate-500">
                    <MapPin size={11} className="text-[#39ff14]" />
                    <span>Toronto, Canada</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono-refined text-[10px] text-slate-500">
                    <Mail size={11} className="text-[#39ff14]" />
                    <a href="mailto:fong20040311@gmail.com" className="hover:text-[#39ff14] transition-colors duration-200">fong20040311@gmail.com</a>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="https://github.com/RyannWongg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-[#39ff14] text-slate-400 hover:text-slate-900 transition-all duration-200 border border-slate-700/50 hover:border-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.4)]"
                    >
                      <Github size={16} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/ip-fong-wong-ryan/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-[#39ff14] text-slate-400 hover:text-slate-900 transition-all duration-200 border border-slate-700/50 hover:border-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.4)]"
                    >
                      <Linkedin size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-2 flex-wrap justify-center lg:justify-end">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer font-body-refined text-[13px] font-medium ${
                  currentView !== 'museum'
                    ? 'bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => onNavigate('projects')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer font-body-refined text-[13px] font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600"
              >
                <FolderKanban size={15} />
                <span>Projects</span>
              </button>
              <button
                onClick={() => onNavigate('museum')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer font-body-refined text-[13px] font-medium ${
                  currentView === 'museum'
                    ? 'bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <Building2 size={15} />
                <span>3D Museum</span>
              </button>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  // Original vertical sidebar layout
  return (
    <aside className={`flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/80 text-slate-400 shadow-2xl ${className}`}>
      {/* Profile Section */}
      <div className="p-6 border-b border-slate-800/60 flex flex-col items-center text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#39ff14]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full bg-slate-800 overflow-hidden ring-2 ring-[#39ff14]/70 ring-offset-4 ring-offset-slate-900 shadow-[0_0_25px_rgba(57,255,20,0.4)] transition-all duration-300 group-hover:ring-[#39ff14] group-hover:shadow-[0_0_35px_rgba(57,255,20,0.6)]">
            <img
              src={`${import.meta.env.BASE_URL}profile.png`}
              alt="Profile"
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#39ff14] rounded-full border-3 border-slate-900 flex items-center justify-center shadow-[0_0_10px_rgba(57,255,20,0.6)]">
            <Sparkles size={12} className="text-slate-900" />
          </div>
        </div>

        <h2 className="font-display text-xl font-bold text-white mt-5 tracking-tight">Ip Fong Wong (Ryan)</h2>
        <p className="font-mono-refined text-[10px] text-[#39ff14] mt-1.5 font-bold tracking-[0.15em] uppercase">Math, Statistics & CS @ UofT</p>

        <p className="font-body-refined mt-4 mb-4 text-[13px] text-slate-400 leading-relaxed px-1">
          Merging statistical rigor with creative software design. Building tools that turn complex data into clear insights.
        </p>

        <div className="flex flex-col gap-2.5 mb-5 w-full">
          <div className="flex items-center gap-2 font-body-refined text-[11px] text-slate-500 justify-center hover:text-slate-300 transition-colors">
            <MapPin size={12} className="text-[#39ff14]" />
            <span>Toronto, Canada</span>
          </div>
          <div className="flex items-center gap-2 font-mono-refined text-[10px] text-slate-500 justify-center">
            <Mail size={12} className="text-[#39ff14]" />
            <a href="mailto:fong20040311@gmail.com" className="hover:text-[#39ff14] transition-colors duration-200">fong20040311@gmail.com</a>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href="https://github.com/RyannWongg"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-[#39ff14] text-slate-400 hover:text-slate-900 transition-all duration-200 border border-slate-700/50 hover:border-[#39ff14] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:-translate-y-0.5"
          >
            <Github size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/ip-fong-wong-ryan/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-[#39ff14] text-slate-400 hover:text-slate-900 transition-all duration-200 border border-slate-700/50 hover:border-[#39ff14] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:-translate-y-0.5"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <p className="font-mono-refined text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-3 px-3">Navigation</p>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group cursor-pointer ${
                currentView !== 'museum'
                  ? 'bg-gradient-to-r from-[#39ff14]/15 to-[#39ff14]/5 text-[#39ff14] shadow-[inset_0_0_20px_rgba(57,255,20,0.1)] border border-[#39ff14]/30'
                  : 'hover:bg-slate-800/60 hover:text-white border border-transparent hover:border-slate-700/50'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-200 ${currentView !== 'museum' ? 'bg-[#39ff14]/20' : 'bg-slate-800/50 group-hover:bg-slate-700/50'}`}>
                <LayoutDashboard size={18} className={currentView !== 'museum' ? 'text-[#39ff14]' : 'text-slate-400 group-hover:text-[#39ff14] transition-colors'} />
              </div>
              <span className="font-body-refined text-[13px] font-medium">Dashboard</span>
              {currentView !== 'museum' && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#39ff14] shadow-[0_0_8px_rgba(57,255,20,0.8)]"></div>
              )}
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('projects')}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-slate-800/60 hover:text-white border border-transparent hover:border-slate-700/50"
            >
              <div className="p-2 rounded-lg transition-all duration-200 bg-slate-800/50 group-hover:bg-slate-700/50">
                <FolderKanban size={18} className="text-slate-400 group-hover:text-[#39ff14] transition-colors" />
              </div>
              <span className="font-body-refined text-[13px] font-medium">Projects</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('museum')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group cursor-pointer ${
                currentView === 'museum'
                  ? 'bg-gradient-to-r from-[#39ff14]/15 to-[#39ff14]/5 text-[#39ff14] shadow-[inset_0_0_20px_rgba(57,255,20,0.1)] border border-[#39ff14]/30'
                  : 'hover:bg-slate-800/60 hover:text-white border border-transparent hover:border-slate-700/50'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-200 ${currentView === 'museum' ? 'bg-[#39ff14]/20' : 'bg-slate-800/50 group-hover:bg-slate-700/50'}`}>
                <Building2 size={18} className={currentView === 'museum' ? 'text-[#39ff14]' : 'text-slate-400 group-hover:text-[#39ff14] transition-colors'} />
              </div>
              <span className="font-body-refined text-[13px] font-medium">3D Museum</span>
              {currentView === 'museum' && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#39ff14] shadow-[0_0_8px_rgba(57,255,20,0.8)]"></div>
              )}
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/60 font-mono-refined text-[10px] text-slate-600 text-center tracking-wide">
        <span className="text-[#39ff14]/50">&lt;/&gt;</span> 2024 Ryan Wong
      </div>
    </aside>
  );
};
