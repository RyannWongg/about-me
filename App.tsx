import React, { useState, useMemo, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SkillsChart } from './components/SkillsChart';
import { ProjectCard } from './components/ProjectCard';
import { DetailedProjectRow } from './components/DetailedProjectRow';
import { Timeline } from './components/Timeline';
import { ProjectModal } from './components/ProjectModal';
import { Project, ViewState } from './types';
import { FolderOpen, Code2, Filter } from 'lucide-react';
import { useScrollAnimation } from './hooks/useScrollAnimation';

// Lazy load the Museum component for better initial load
const Museum = lazy(() => import('./museum/Museum').then(m => ({ default: m.Museum })));

// Real Data for Projects with Extended Details
const projects: Project[] = [
  {
    id: 'p1',
    title: 'Lakers Performance Analytics',
    category: 'Sports Analytics',
    status: 'Completed',
    techStack: ['Data Viz', 'Python', 'Analytics'],
    metrics: { label: 'Full Roster Analysis', value: 'Season 24-25', accentText: 'Player Efficiency Trends' },
    longDescription: "Leveraged historical game data to visualize and evaluate the LA Lakers' seasonal performance metrics vs. league averages.",
    link: "https://ryannwongg.github.io/Lakers-Analysis/",
    challenge: "Processing 82 games of raw play-by-play data to identify meaningful trends vs league averages.",
    solution: "Built a data pipeline to scrape, clean, and aggregate season stats, visualizing them with interactive charts.",
    features: [
        "Custom D3.js/Chart.js rendering logic.",
        "Interactive efficiency heatmaps.",
        "Comparative league analysis."
    ],
    image: "lakers-preview.png"
  },
  {
    id: 'p2',
    title: 'House of Data (NBA Evolution)',
    category: 'Statistical Modeling',
    status: 'Completed',
    techStack: ['Statistical Modeling', 'Data Mining'],
    metrics: { label: 'Players Tracked', value: '20 seasons', accentText: 'Multi-Decade Clustering' },
    longDescription: "A deep-dive analysis tracing the statistical evolution of NBA player roles and archetypes over decades.",
    link: "https://ryannwongg.github.io/House-of-Data/",
    challenge: "Clustering 500+ players into non-obvious archetypes beyond standard positions.",
    solution: "Applied unsupervised machine learning algorithms to historical datasets to discover latent player roles.",
    features: [
        "K-Means Clustering implementation.",
        "PCA Dimensionality Reduction.",
        "20-year trend visualization."
    ],
    image: "house-of-data-preview.png"
  },
  {
    id: 'p3',
    title: 'Java Solitaire Engine',
    category: 'Game Development',
    status: 'Completed',
    techStack: ['Java', 'OOP', 'Game Logic'],
    metrics: { label: 'OOP Compliance', value: '100%', accentText: 'Zero-Latency Logic' },
    longDescription: "Collaboratively architected a classic card game simulation emphasizing strict Object-Oriented Design patterns.",
    link: "https://github.com/RyannWongg/Solitaire",
    challenge: "Enforcing strict OOP principles for game state management and UI decoupling.",
    solution: "Implemented a robust engine using Model-View-Controller architecture to separate game logic from rendering.",
    features: [
        "MVC Design Pattern.",
        "Custom Event Listener System.",
        "Undo/Redo Stack."
    ],
    image: "java-solitaire-preview.png"
  },
  {
    id: 'p4',
    title: 'Assembly Tetris',
    category: 'Systems Programming',
    status: 'Completed',
    techStack: ['Assembly', 'Low-Level', 'Optimization'],
    metrics: { label: 'Executable Size', value: '< 2KB', accentText: 'Assembly Optimized' },
    longDescription: "Engineered a fully functional Tetris clone in Assembly, optimizing memory management and CPU cycles.",
    link: "https://github.com/RyannWongg/Tetris-assembly",
    challenge: "Managing strict memory constraints and CPU cycles on low-level hardware.",
    solution: "Wrote highly optimized assembly code handling direct video memory manipulation and input interrupts.",
    features: [
        "< 2KB Executable size.",
        "Direct Memory Management.",
        "Register-level Optimization."
    ],
    image: "assembly-tetris-preview.png"
  },
  {
    id: 'p5',
    title: 'Smart Travel Planner',
    category: 'Mobile App',
    status: 'In Progress',
    techStack: ['React Native', 'Google Maps API', 'Firebase'],
    metrics: { label: 'Platform Support', value: 'iOS & Android', accentText: 'Cross-Platform' },
    longDescription: "An intelligent travel companion designed to streamline itinerary management with real-time location services.",
    challenge: "Coordinating multi-stop logistics and real-time location data for seamless itinerary planning.",
    solution: "Building a cross-platform mobile architecture with offline-first capabilities and live map integration.",
    features: [
        "Offline-first Architecture.",
        "Real-time Geolocation Sync.",
        "Multi-stop Route Optimization."
    ]
  },
  {
    id: 'p6',
    title: 'AI Grocery Assistant',
    category: 'Mobile App',
    status: 'In Progress',
    techStack: ['Python', 'OpenAI API', 'Computer Vision'],
    metrics: { label: 'Detection Accuracy', value: 'Target 95%', accentText: 'CV Integration' },
    longDescription: "A smart kitchen assistant that tracks inventory via receipt scanning and suggests recipes to reduce food waste.",
    challenge: "Automating inventory tracking and reducing food waste through intelligent suggestions.",
    solution: "Integrating image recognition to scan receipts and using LLMs to generate recipes based on expiring pantry items.",
    features: [
        "OCR Receipt Scanning.",
        "LLM-powered Recipe Generation.",
        "Expiry Notification System."
    ]
  }
];

type ProjectCategoryFilter = 'All' | 'Data Analysis' | 'Game Dev' | 'App';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Project View State
  const [activeFilter, setActiveFilter] = useState<ProjectCategoryFilter>('All');

  const handleProjectClick = (project: Project) => {
    // Only open modal for completed projects or handle separately
    if (project.status === 'Completed') {
      setSelectedProject(project);
      setIsModalOpen(true);
    }
  };

  const handleNavigate = (view: ViewState) => {
    if (view === 'museum') {
      setCurrentView('museum');
      window.scrollTo(0, 0);
    } else {
      // For dashboard/projects, ensure we're on the main page then scroll to section
      if (currentView === 'museum') {
        setCurrentView('dashboard');
        // Wait for render then scroll
        setTimeout(() => {
          const element = document.getElementById(view);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(view);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Scroll animation for featured projects section
  const { ref: featuredRef, isVisible: featuredVisible } = useScrollAnimation({ threshold: 0.1 });

  // Filter Logic
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;

    return projects.filter(p => {
      if (activeFilter === 'Data Analysis') {
        return ['Sports Analytics', 'Statistical Modeling'].includes(p.category);
      }
      if (activeFilter === 'Game Dev') {
        return ['Game Development', 'Systems Programming'].includes(p.category);
      }
      if (activeFilter === 'App') {
        return ['Mobile App'].includes(p.category);
      }
      return true;
    });
  }, [activeFilter]);

  // Render Museum view
  if (currentView === 'museum') {
    return (
      <Suspense fallback={
        <div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
          <div className="text-[#39ff14] text-xl font-mono-tech tracking-widest animate-pulse">
            LOADING MUSEUM...
          </div>
        </div>
      }>
        <Museum projects={projects} onExitMuseum={() => setCurrentView('dashboard')} />
      </Suspense>
    );
  }


  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <ProjectModal
        isOpen={isModalOpen}
        project={selectedProject}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Fixed Navigation Bar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Hero Section - Full Viewport */}
      <Hero />

      {/* CAREER LOG SECTION - Full Width Horizontal Timeline */}
      <section id="career" className="w-full">
        <Timeline />
      </section>

      {/* Main Content Wrapper */}
      <div className="flex flex-col">

        {/* Scrollable Main Content */}
        <main className="flex-1">

          {/* SKILLS SECTION */}
          <section id="skills" className="py-20 px-6 md:px-12 lg:px-16">
            <div className="max-w-5xl mx-auto">
              {/* Section Header - Centered */}
              <div className="text-center mb-14">
                <p className="font-mono-refined text-[10px] font-semibold text-[#39ff14] tracking-[0.35em] uppercase mb-5 opacity-90">
                  Technical Expertise
                </p>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-[-0.02em] leading-[1.1]">
                  Skill Matrix
                </h2>
                <p className="font-body-refined text-slate-500 text-sm md:text-base font-normal tracking-wide max-w-md mx-auto leading-relaxed">
                  Technologies and tools I work with
                </p>
              </div>

              {/* Skills Content */}
              <SkillsChart />
            </div>
          </section>

          {/* FINISHED PROJECTS SECTION */}
          <section id="featured" className="py-20 px-6 md:px-12 lg:px-16 bg-slate-900/30">
            <div className="max-w-6xl mx-auto">
              {/* Section Header - Centered */}
              <div className="text-center mb-14">
                <p className="font-mono-refined text-[10px] font-semibold text-[#39ff14] tracking-[0.35em] uppercase mb-5 opacity-90">
                  Portfolio Highlights
                </p>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-[-0.02em] leading-[1.1]">
                  Featured Projects
                </h2>
                <p className="font-body-refined text-slate-500 text-sm md:text-base font-normal tracking-wide max-w-md mx-auto leading-relaxed">
                  Completed works showcasing my expertise
                </p>
              </div>

              {/* Projects Grid - Centered */}
              <div ref={featuredRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {projects.filter(p => p.status === 'Completed').map((project, index) => (
                  <div
                    key={project.id}
                    className={`scroll-animate-fade-up ${featuredVisible ? 'visible' : ''}`}
                    style={{ animationDelay: featuredVisible ? `${index * 100}ms` : '0ms' }}
                  >
                    <ProjectCard
                      project={project}
                      onClick={handleProjectClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PROJECTS SECTION */}
          <section id="repository" className="py-20 px-6 md:px-12 lg:px-16 scroll-mt-24">
            <div className="max-w-5xl mx-auto">

            {/* Section Header */}
            <div className="text-center mb-14">
              <p className="font-mono-refined text-[10px] font-semibold text-[#39ff14] tracking-[0.35em] uppercase mb-5 opacity-90">
                All Projects
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-[-0.02em] leading-[1.1]">
                Code Repository
              </h2>
              <p className="font-body-refined text-slate-500 text-sm md:text-base font-normal tracking-wide max-w-md mx-auto leading-relaxed">
                Explore my software engineering and data science portfolio
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mr-2">
                <Filter size={11} />
                <span className="font-mono-refined font-semibold tracking-[0.1em] text-[10px] uppercase">Filter:</span>
              </div>
              {(['All', 'Data Analysis', 'Game Dev', 'App'] as ProjectCategoryFilter[]).map((filter) => {
                const count = filter === 'All' ? projects.length :
                  filter === 'Data Analysis' ? projects.filter(p => ['Sports Analytics', 'Statistical Modeling'].includes(p.category)).length :
                  filter === 'Game Dev' ? projects.filter(p => ['Game Development', 'Systems Programming'].includes(p.category)).length :
                  projects.filter(p => p.category === 'Mobile App').length;

                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`
                      group relative px-3.5 py-2 rounded-lg font-mono-refined text-[10px] font-bold uppercase tracking-[0.15em] border transition-all duration-300 cursor-pointer overflow-hidden
                      ${activeFilter === filter
                        ? 'filter-btn-active bg-[#39ff14]/15 text-[#39ff14] border-[#39ff14]/50'
                        : 'bg-slate-900/80 text-slate-400 border-slate-700/50 hover:border-[#39ff14]/30 hover:text-slate-200 hover:bg-slate-800/80'
                      }
                    `}
                  >
                    {/* Active indicator pulse */}
                    {activeFilter === filter && (
                      <span className="absolute inset-0 bg-[#39ff14]/10 animate-pulse pointer-events-none"></span>
                    )}
                    <span className="relative flex items-center gap-2">
                      {filter}
                      <span className={`
                        font-mono-refined inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded text-[8px] font-bold transition-all duration-300
                        ${activeFilter === filter
                          ? 'bg-[#39ff14]/30 text-[#39ff14]'
                          : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300'
                        }
                      `}>
                        {count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Row List with Filter Animation */}
            <div key={activeFilter} className="space-y-8">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="filter-item"
                    style={{
                      animationDelay: `${index * 80}ms`
                    }}
                  >
                    <DetailedProjectRow project={project} index={index} />
                  </div>
                ))
              ) : (
                <div className="filter-item text-center py-20 border border-dashed border-slate-800/60 rounded-2xl bg-slate-900/30">
                  <FolderOpen size={40} className="mx-auto text-slate-700 mb-3" />
                  <p className="font-body-refined text-slate-500">No projects found in this category yet.</p>
                </div>
              )}
            </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default App;