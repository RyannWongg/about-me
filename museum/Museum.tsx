import React, { Suspense, useState, useCallback } from 'react';
import { MuseumCanvas } from './MuseumCanvas';
import { LoadingScreen } from './ui/LoadingScreen';
import { QuickViewButton } from './ui/QuickViewButton';
import { ExhibitModal } from './ui/ExhibitModal';
import { TouchControls } from './player/TouchControls';
import { Project } from '../types';

interface MuseumProps {
  projects: Project[];
  onExitMuseum: () => void;
}

export const Museum: React.FC<MuseumProps> = ({ projects, onExitMuseum }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [touchInput, setTouchInput] = useState({ x: 0, y: 0 });

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleTouchMove = useCallback((x: number, y: number) => {
    setTouchInput({ x, y });
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full">
      <LoadingScreen />
      <QuickViewButton onExit={onExitMuseum} />
      <ExhibitModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      <TouchControls onMove={handleTouchMove} />

      {/* Controls hint - hidden on mobile */}
      <div className="fixed bottom-4 left-4 z-40 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-3 hidden md:block">
        <div className="text-slate-400 text-xs font-mono space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[#39ff14] font-bold">WASD</span>
            <span>or</span>
            <span className="text-[#39ff14] font-bold">Arrow Keys</span>
            <span>- Move</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#39ff14] font-bold">Click</span>
            <span>- View project details</span>
          </div>
        </div>
      </div>

      <Suspense fallback={<LoadingScreen />}>
        <MuseumCanvas
          projects={projects}
          onSelectProject={handleSelectProject}
          touchInput={touchInput}
        />
      </Suspense>
    </div>
  );
};
