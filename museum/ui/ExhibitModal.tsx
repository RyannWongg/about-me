import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Layers, Lightbulb, CheckCircle2, Github } from 'lucide-react';
import { Project } from '../../types';

interface ExhibitModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExhibitModal: React.FC<ExhibitModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isVisible || !project) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#39ff14]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#39ff14]/5 rounded-full blur-3xl" />
      </div>

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900/95 border-2 border-[#39ff14]/40 rounded-2xl shadow-[0_0_60px_rgba(57,255,20,0.25)] transition-all duration-300 ${
          isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#39ff14] rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#39ff14] rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#39ff14] rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#39ff14] rounded-br-2xl" />

        {/* Header */}
        <div className="sticky top-0 bg-slate-900/98 backdrop-blur-sm border-b border-slate-800 p-5 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
              <span className="text-xs font-mono text-[#39ff14] uppercase tracking-wider">
                Project Exhibit
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{project.title}</h2>
            <p className="text-sm text-slate-400 mt-1">{project.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-[#39ff14] hover:bg-slate-800/80 rounded-xl transition-all duration-200 border border-transparent hover:border-[#39ff14]/30 cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          {project.image && (
            <div className="relative rounded-xl overflow-hidden border border-slate-700 group">
              <img
                src={`${import.meta.env.BASE_URL}${project.image}`}
                alt={project.title}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            </div>
          )}

          {/* Tech Stack */}
          <div>
            <div className="text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">
              Technologies
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-300 hover:border-[#39ff14]/50 hover:text-[#39ff14] transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          {/* Challenge & Solution */}
          {project.challenge && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-2 text-amber-400 mb-3">
                  <Lightbulb size={18} />
                  <span className="font-semibold text-sm">Challenge</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{project.challenge}</p>
              </div>

              <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  <CheckCircle2 size={18} />
                  <span className="font-semibold text-sm">Solution</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{project.solution}</p>
              </div>
            </div>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="p-4 bg-[#39ff14]/5 rounded-xl border border-[#39ff14]/20">
              <div className="flex items-center gap-2 text-[#39ff14] mb-4">
                <Layers size={18} />
                <span className="font-semibold text-sm">Key Features</span>
              </div>
              <ul className="space-y-3">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="text-[#39ff14] mt-0.5 text-lg">▸</span>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#39ff14] text-slate-900 font-bold rounded-xl hover:bg-[#39ff14]/90 transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] hover:scale-105"
              >
                {project.link.includes('github') ? <Github size={18} /> : <ExternalLink size={18} />}
                {project.link.includes('github') ? 'View on GitHub' : 'View Project'}
              </a>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4 text-center">
          <p className="text-xs text-slate-500 font-mono">
            Press ESC or click outside to close
          </p>
        </div>
      </div>
    </div>
  );
};
