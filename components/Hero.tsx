import React, { useState, useEffect, useCallback } from 'react';
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll animation with custom duration
  const smoothScrollTo = useCallback((targetY: number, duration: number = 1500) => {
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

  const handleScrollDown = () => {
    smoothScrollTo(window.innerHeight, 1200); // 1.2 second duration
  };

  // Calculate slide amount based on scroll (max slide when scrolled 100vh)
  const slideAmount = Math.min(scrollY * 0.5, window.innerHeight * 0.5);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Layer 1: Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}hero-bg.png`}
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-slate-950/30"></div>
      </div>

      {/* Layer 2: RYAN text (behind person) - slides right on scroll */}
      <div
        className="absolute left-4 sm:left-6 md:left-16 top-1/3 sm:top-1/2 z-5 pointer-events-none will-change-transform"
        style={{ transform: `translateY(-50%) translateX(${slideAmount}px)` }}
      >
        <h2 className="text-[25vw] sm:text-[20vw] md:text-[15vw] font-bold text-white/50 tracking-tight leading-none">
          RYAN
        </h2>
      </div>

      {/* Layer 3: Person Cutout */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <img
          src={`${import.meta.env.BASE_URL}hero-cutout.png`}
          alt="Ryan"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Layer 4: Content (in front of person) */}
      <div className="absolute inset-0 z-20">
        {/* Bottom Right - Last Name - slides left on scroll */}
        <div
          className="absolute bottom-[25%] sm:bottom-0 md:bottom-8 right-4 sm:right-6 md:right-16 pointer-events-none will-change-transform"
          style={{ transform: `translateX(-${slideAmount}px)` }}
        >
          <h2 className="text-[25vw] sm:text-[20vw] md:text-[15vw] font-bold text-white/50 tracking-tight leading-none">
            WONG
          </h2>
        </div>

        {/* Right side - Subtitle, Description, and Social Icons */}
        {/* Hidden on very small screens, shown from sm breakpoint */}
        <div className="hidden sm:block absolute right-[5%] sm:right-[10%] md:right-[10%] top-1/2 -translate-y-1/2 text-right max-w-[200px] sm:max-w-xs md:max-w-sm">
          {/* Subtitle */}
          <p className="font-mono-refined text-[9px] sm:text-[10px] md:text-[11px] text-slate-300 tracking-[0.2em] sm:tracking-[0.25em] uppercase font-bold mb-3 sm:mb-4">
            Math, Statistics & CS @ UofT
          </p>

          {/* Decorative Line */}
          <div className="w-24 sm:w-32 md:w-48 h-px bg-gradient-to-l from-slate-400 to-transparent mb-3 sm:mb-4 ml-auto"></div>

          {/* Brief Description */}
          <p className="font-body-refined text-slate-300 text-[11px] sm:text-[13px] md:text-[14px] leading-[1.6] sm:leading-[1.7] mb-4 sm:mb-6">
            Merging statistical rigor with creative software design. Building tools that turn complex data into clear insights.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-2 sm:gap-3 justify-end">
            <a
              href="https://github.com/RyannWongg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-[#39ff14] text-white hover:text-slate-900 transition-all duration-300"
            >
              <Github size={16} className="sm:w-[18px] sm:h-[18px]" />
            </a>
            <a
              href="https://www.linkedin.com/in/ip-fong-wong-ryan/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-[#39ff14] text-white hover:text-slate-900 transition-all duration-300"
            >
              <Linkedin size={16} className="sm:w-[18px] sm:h-[18px]" />
            </a>
            <a
              href="mailto:fong20040311@gmail.com"
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-[#39ff14] text-white hover:text-slate-900 transition-all duration-300"
            >
              <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />
            </a>
          </div>
        </div>

        {/* Mobile-only: Social icons at bottom */}
        <div className="sm:hidden absolute bottom-20 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/RyannWongg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-[#39ff14] text-white hover:text-slate-900 transition-all duration-300"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/ip-fong-wong-ryan/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-[#39ff14] text-white hover:text-slate-900 transition-all duration-300"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:fong20040311@gmail.com"
              className="p-3 rounded-full bg-white/10 hover:bg-[#39ff14] text-white hover:text-slate-900 transition-all duration-300"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={handleScrollDown}
          className="animate-bounce text-white/70 hover:text-[#39ff14] transition-colors cursor-pointer"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  );
};
