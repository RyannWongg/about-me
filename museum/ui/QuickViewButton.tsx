import React from 'react';
import { LayoutDashboard, ChevronRight } from 'lucide-react';

interface QuickViewButtonProps {
  onExit: () => void;
}

export const QuickViewButton: React.FC<QuickViewButtonProps> = ({ onExit }) => {
  return (
    <button
      onClick={onExit}
      className="fixed top-4 right-4 z-50 px-5 py-3 bg-slate-900/95 backdrop-blur-md border-2 border-[#39ff14]/60 rounded-xl text-[#39ff14] hover:bg-[#39ff14] hover:text-slate-900 hover:border-[#39ff14] transition-all duration-300 cursor-pointer group shadow-[0_0_20px_rgba(57,255,20,0.15)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]"
    >
      <span className="flex items-center gap-2 font-bold text-sm tracking-wide">
        <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
        <span>Quick View</span>
        <ChevronRight size={16} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </span>
    </button>
  );
};
