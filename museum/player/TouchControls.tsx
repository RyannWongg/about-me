import React, { useRef, useState, useCallback, useEffect } from 'react';

interface TouchControlsProps {
  onMove: (x: number, y: number) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onMove }) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect touch device
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!joystickRef.current) return;
    setIsDragging(true);
  }, []);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || !joystickRef.current) return;

      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let deltaX = clientX - centerX;
      let deltaY = clientY - centerY;

      // Limit to joystick radius
      const maxRadius = rect.width / 2 - 20;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > maxRadius) {
        deltaX = (deltaX / distance) * maxRadius;
        deltaY = (deltaY / distance) * maxRadius;
      }

      setKnobPosition({ x: deltaX, y: deltaY });

      // Normalize to -1 to 1 range
      const normalizedX = deltaX / maxRadius;
      const normalizedY = deltaY / maxRadius;

      onMove(normalizedX, normalizedY);
    },
    [isDragging, onMove]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setKnobPosition({ x: 0, y: 0 });
    onMove(0, 0);
  }, [onMove]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY);
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY);
  const handleMouseUp = () => handleEnd();

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleEnd();
  };

  // Global mouse events for dragging outside joystick
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleGlobalMouseUp = () => handleEnd();

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-8 left-8 z-40 touch-none">
      {/* Joystick base */}
      <div
        ref={joystickRef}
        className="w-32 h-32 rounded-full bg-slate-900/80 border-2 border-[#39ff14]/50 flex items-center justify-center backdrop-blur-sm"
        style={{
          boxShadow: '0 0 20px rgba(57, 255, 20, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.5)',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Direction indicators */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-[#39ff14]/30" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-[#39ff14]/30" />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-8 border-t-transparent border-b-transparent border-r-[#39ff14]/30" />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-[#39ff14]/30" />

        {/* Joystick knob */}
        <div
          className="w-14 h-14 rounded-full bg-[#39ff14] transition-transform duration-75"
          style={{
            transform: `translate(${knobPosition.x}px, ${knobPosition.y}px)`,
            boxShadow: isDragging
              ? '0 0 20px #39ff14, 0 0 40px #39ff14'
              : '0 0 10px #39ff14',
          }}
        />
      </div>

      {/* Label */}
      <div className="text-center mt-2 text-[#39ff14]/50 text-xs font-mono">
        MOVE
      </div>
    </div>
  );
};
