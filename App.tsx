import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { HeroCard } from './components/HeroCard';
import { SkillsChart } from './components/SkillsChart';
import { ProjectCard } from './components/ProjectCard';
import { DetailedProjectRow } from './components/DetailedProjectRow';
import { Timeline } from './components/Timeline';
import { ProjectModal } from './components/ProjectModal';
import { Project } from './types';
import { Menu, Terminal, FolderOpen, History } from 'lucide-react';

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
    ]
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
    ]
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
    ]
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
    ]
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
          className="fixed inset-0 bg-slate-950/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar Panel */}
       <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      </div>

      {/* Main Content Wrapper */}
      <div className="md:ml-64 min-h-screen flex flex-col">
        
        {/* Mobile Menu Button */}
        <header className="md:hidden sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
          <button
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Dynamic Main Content */}
        <main className="flex-1 p-4 md:p-8">
          
          {/* DASHBOARD VIEW */}
          {currentView === 'dashboard' && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              <HeroCard />
              <SkillsChart />
              
              {/* Timeline Section with Header */}
              <div className="lg:row-span-2 flex flex-col h-full">
                 <div className="flex items-center gap-3 mb-4 pl-1">
                    <History size={18} className="text-[#39ff14]" />
                    <h3 className="text-lg font-mono-tech text-slate-300 tracking-widest uppercase font-bold">Career Log</h3>
                    <div className="h-[2px] w-8 bg-[#39ff14] rounded-full shadow-[0_0_8px_rgba(57,255,20,0.5)]"></div>
                    <div className="h-[1px] flex-1 bg-slate-800"></div>
                 </div>
                 <div className="flex-1">
                   <Timeline />
                 </div>
              </div>
              
              {/* Projects Section with Header */}
              <div className="col-span-1 md:col-span-2 flex flex-col">
                 <div className="flex items-center gap-3 mb-5 pl-1">
                    <FolderOpen size={18} className="text-[#39ff14]" />
                    <h3 className="text-lg font-mono-tech text-slate-300 tracking-widest uppercase font-bold">Finished Projects</h3>
                    <div className="h-[2px] w-8 bg-[#39ff14] rounded-full shadow-[0_0_8px_rgba(57,255,20,0.5)]"></div>
                    <div className="h-[1px] flex-1 bg-slate-800"></div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Terminal className="text-[#39ff14]" />
                    Code Repository
                  </h2>
                  <p className="text-slate-400 mt-1">Explore my software engineering and data science portfolio.</p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  {(['All', 'Data Analysis', 'Game Dev', 'App'] as ProjectCategoryFilter[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`
                        px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300
                        ${activeFilter === filter 
                          ? 'bg-[#39ff14]/10 text-[#39ff14] border-[#39ff14] shadow-[0_0_15px_rgba(57,255,20,0.3)]' 
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-[#39ff14]/50 hover:text-slate-200'
                        }
                      `}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Row List */}
              <div className="space-y-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <DetailedProjectRow key={project.id} project={project} />
                  ))
                ) : (
                  <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
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