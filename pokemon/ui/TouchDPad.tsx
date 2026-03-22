import React, { useCallback, useRef, useEffect } from 'react';
import { usePokemonGame } from '../context/PokemonGameContext';
import { Direction } from '../../types';

export const TouchDPad: React.FC = () => {
  const { state, dispatch } = usePokemonGame();
  const activeDirection = useRef<Direction | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate key press
  const simulateKeyDown = useCallback((direction: Direction) => {
    const keyMap: Record<Direction, string> = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    };

    window.dispatchEvent(new KeyboardEvent('keydown', { key: keyMap[direction] }));
  }, []);

  const simulateKeyUp = useCallback((direction: Direction) => {
    const keyMap: Record<Direction, string> = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    };

    window.dispatchEvent(new KeyboardEvent('keyup', { key: keyMap[direction] }));
  }, []);

  const handleButtonDown = useCallback((direction: Direction) => {
    if (state.gameState !== 'exploring') return;

    activeDirection.current = direction;
    simulateKeyDown(direction);

    // Continue moving while held
    intervalRef.current = setInterval(() => {
      if (activeDirection.current === direction) {
        simulateKeyDown(direction);
      }
    }, 150);
  }, [state.gameState, simulateKeyDown]);

  const handleButtonUp = useCallback(() => {
    if (activeDirection.current) {
      simulateKeyUp(activeDirection.current);
      activeDirection.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [simulateKeyUp]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Only show on touch devices
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (!isTouchDevice) return null;

  const buttonClass = "w-14 h-14 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 border-2 border-slate-600 rounded-lg flex items-center justify-center text-white text-xl font-bold transition-colors touch-none select-none";

  return (
    <div className="fixed bottom-24 left-6 z-40 md:hidden">
      {/* D-Pad Container */}
      <div className="relative w-44 h-44">
        {/* Up */}
        <button
          className={`${buttonClass} absolute top-0 left-1/2 -translate-x-1/2`}
          onTouchStart={() => handleButtonDown('up')}
          onTouchEnd={handleButtonUp}
          onMouseDown={() => handleButtonDown('up')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        >
          ▲
        </button>

        {/* Left */}
        <button
          className={`${buttonClass} absolute left-0 top-1/2 -translate-y-1/2`}
          onTouchStart={() => handleButtonDown('left')}
          onTouchEnd={handleButtonUp}
          onMouseDown={() => handleButtonDown('left')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        >
          ◀
        </button>

        {/* Center (decorative) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800 rounded-full border-2 border-slate-600" />

        {/* Right */}
        <button
          className={`${buttonClass} absolute right-0 top-1/2 -translate-y-1/2`}
          onTouchStart={() => handleButtonDown('right')}
          onTouchEnd={handleButtonUp}
          onMouseDown={() => handleButtonDown('right')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        >
          ▶
        </button>

        {/* Down */}
        <button
          className={`${buttonClass} absolute bottom-0 left-1/2 -translate-x-1/2`}
          onTouchStart={() => handleButtonDown('down')}
          onTouchEnd={handleButtonUp}
          onMouseDown={() => handleButtonDown('down')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        >
          ▼
        </button>
      </div>

      {/* Action Buttons */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {/* A Button (interact) */}
        <button
          className="w-12 h-12 bg-green-600 hover:bg-green-500 active:bg-green-400 border-2 border-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
          onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))}
          onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }))}
        >
          A
        </button>

        {/* B Button (back/cancel) */}
        <button
          className="w-12 h-12 bg-red-600 hover:bg-red-500 active:bg-red-400 border-2 border-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
          onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}
          onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }))}
        >
          B
        </button>
      </div>
    </div>
  );
};

export default TouchDPad;
