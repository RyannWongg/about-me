import React, { useState, useEffect, useCallback } from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

type SectionId = 'career' | 'skills' | 'featured' | 'repository' | 'museum';

const navItems: { id: SectionId; label: string }[] = [
  { id: 'career', label: 'Career' },
  { id: 'skills', label: 'Skills' },
  { id: 'featured', label: 'Projects' },
  { id: 'repository', label: 'Repository' },
  { id: 'museum', label: '3D Museum' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  // Smooth scroll animation with custom duration
  const smoothScrollTo = useCallback((targetY: number, duration: number = 1200) => {
    const startY = window.scrollY;
    const difference = targetY - startY;
    const startTime = performance.now();

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startY + difference * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Add background when scrolled past the hero section (100vh)
      setIsScrolled(window.scrollY > window.innerHeight - 100);

      // Determine active section based on scroll position
      const sections = ['career', 'skills', 'featured', 'repository'] as SectionId[];
      let current: SectionId | null = null;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = sectionId;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: SectionId) => {
    if (sectionId === 'museum') {
      onNavigate('museum');
      return;
    }

    const doScroll = () => {
      // For career section, use slow smooth scroll to match hero down arrow
      if (sectionId === 'career') {
        smoothScrollTo(window.innerHeight, 1200);
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = element.offsetTop - 80;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }
    };

    // If we're in museum view, switch to dashboard first
    if (currentView === 'museum') {
      onNavigate('dashboard');
      setTimeout(doScroll, 100);
    } else {
      doScroll();
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/60 shadow-lg'
        : 'bg-transparent'
    }`}>
      <div className="w-full px-6 md:px-12 lg:px-16 py-5 flex items-center justify-between">
        {/* Logo / Signature */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-white font-display text-lg font-bold tracking-tight hover:text-[#39ff14] transition-colors cursor-pointer"
        >
          Ryan<span className="text-[#39ff14]">.</span>
        </button>

        {/* Navigation Links */}
        <div className="flex items-center gap-5 md:gap-7">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`font-body-refined text-[13px] font-medium tracking-wide transition-colors cursor-pointer ${
                (item.id === 'museum' && currentView === 'museum') ||
                (item.id !== 'museum' && activeSection === item.id)
                  ? 'text-[#39ff14]'
                  : 'text-slate-300 hover:text-[#39ff14]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <a
            href="mailto:fong20040311@gmail.com"
            className="font-body-refined text-[13px] font-medium tracking-wide text-slate-300 hover:text-[#39ff14] transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};
