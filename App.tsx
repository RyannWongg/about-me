import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { HeroCard } from './components/HeroCard';
import { SkillsChart } from './components/SkillsChart';
import { ProjectCard } from './components/ProjectCard';
import { DetailedProjectRow } from './components/DetailedProjectRow';
import { Timeline } from './components/Timeline';
import { ProjectModal } from './components/ProjectModal';
import { Project } from './types';
import { Menu, Terminal, FolderOpen, History, Code2, Filter } from 'lucide-react';

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

type ViewState = 'dashboard' | 'projects';
type ProjectCategoryFilter = 'All' | 'Data Analysis' | 'Game Dev' | 'App';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar on mobile when navigating
    window.scrollTo(0, 0);
  };

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

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <ProjectModal
        isOpen={isModalOpen}
        project={selectedProject}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/90 z-40 md:hidden backdrop-blur-md transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Panel */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      </div>

      {/* Main Content Wrapper */}
      <div className="md:ml-64 min-h-screen flex flex-col">

        {/* Mobile Menu Button */}
        <header className="md:hidden sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60 px-5 py-4">
          <button
            className="p-2.5 text-slate-400 hover:text-[#39ff14] hover:bg-slate-800/80 rounded-xl transition-all duration-200 border border-slate-800 hover:border-[#39ff14]/30 cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={22} />
          </button>
        </header>

        {/* Dynamic Main Content */}
        <main className="flex-1 p-5 md:p-8 lg:p-10">
          
          {/* DASHBOARD VIEW */}
          {currentView === 'dashboard' && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              <HeroCard />
              <SkillsChart />

              {/* Timeline Section with Header */}
              <div className="lg:row-span-2 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4 pl-1">
                  <div className="p-1.5 rounded-lg bg-[#39ff14]/10">
                    <History size={16} className="text-[#39ff14]" />
                  </div>
                  <h3 className="text-base font-mono-tech text-slate-200 tracking-widest uppercase font-bold">Career Log</h3>
                  <div className="h-[2px] w-10 bg-gradient-to-r from-[#39ff14] to-[#39ff14]/30 rounded-full"></div>
                  <div className="h-px flex-1 bg-slate-800/60"></div>
                </div>
                <div className="flex-1">
                  <Timeline />
                </div>
              </div>

              {/* Projects Section with Header */}
              <div className="col-span-1 md:col-span-2 flex flex-col">
                <div className="flex items-center gap-3 mb-5 pl-1">
                  <div className="p-1.5 rounded-lg bg-[#39ff14]/10">
                    <FolderOpen size={16} className="text-[#39ff14]" />
                  </div>
                  <h3 className="text-base font-mono-tech text-slate-200 tracking-widest uppercase font-bold">Finished Projects</h3>
                  <div className="h-[2px] w-10 bg-gradient-to-r from-[#39ff14] to-[#39ff14]/30 rounded-full"></div>
                  <div className="h-px flex-1 bg-slate-800/60"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {projects.filter(p => p.status === 'Completed').map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={handleProjectClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS VIEW */}
          {currentView === 'projects' && (
            <div id="projects-view" className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-[#39ff14]/10 border border-[#39ff14]/20">
                      <Code2 size={22} className="text-[#39ff14]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      Code Repository
                    </h2>
                  </div>
                  <p className="text-slate-400 text-sm md:text-base">Explore my software engineering and data science portfolio.</p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mr-2">
                    <Filter size={12} />
                    <span className="font-medium">Filter:</span>
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
                          group relative px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer overflow-hidden
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
                            inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-bold transition-all duration-300
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
              </div>

              {/* Detailed Row List with Filter Animation */}
              <div key={activeFilter} className="space-y-5">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <div
                      key={project.id}
                      className="filter-item"
                      style={{
                        animationDelay: `${index * 80}ms`
                      }}
                    >
                      <DetailedProjectRow project={project} />
                    </div>
                  ))
                ) : (
                  <div className="filter-item text-center py-20 border border-dashed border-slate-800/60 rounded-2xl bg-slate-900/30">
                    <FolderOpen size={40} className="mx-auto text-slate-700 mb-3" />
                    <p className="text-slate-500">No projects found in this category yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;