import React, { useCallback } from 'react';
import { usePokemonGame } from '../context/PokemonGameContext';
import { SoundManager } from '../audio/SoundManager';
import { Direction } from '../../types';

interface GameBoyShellProps {
  children: React.ReactNode;
  onExit: () => void;
}

export const GameBoyShell: React.FC<GameBoyShellProps> = ({ children, onExit }) => {
  const { state, dispatch } = usePokemonGame();

  // D-pad handlers
  const handleDPadPress = useCallback((direction: Direction) => {
    const keyMap: Record<Direction, string> = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    };
    window.dispatchEvent(new KeyboardEvent('keydown', { key: keyMap[direction] }));
  }, []);

  const handleDPadRelease = useCallback((direction: Direction) => {
    const keyMap: Record<Direction, string> = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    };
    window.dispatchEvent(new KeyboardEvent('keyup', { key: keyMap[direction] }));
  }, []);

  // A/B button handlers
  const handleAButton = useCallback(() => {
    SoundManager.playSelect();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
    }, 100);
  }, []);

  const handleBButton = useCallback(() => {
    SoundManager.playSelect();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    }, 100);
  }, []);

  // Start/Select handlers
  const handleStart = useCallback(() => {
    SoundManager.playMenuOpen();
    dispatch({ type: 'TOGGLE_MENU' });
  }, [dispatch]);

  const handleSelect = useCallback(() => {
    SoundManager.playSelect();
    dispatch({ type: 'TOGGLE_MINIMAP' });
  }, [dispatch]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-800 to-slate-950 flex items-center justify-center overflow-auto p-4">
      {/* Game Boy Container - Classic DMG style */}
      <div
        className="relative flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #c8c4bf 0%, #b8b4af 50%, #a8a4a0 100%)',
          borderRadius: '12px 12px 12px 60px',
          padding: '16px 16px 100px 16px',
          minWidth: '380px',
          boxShadow: `
            inset 2px 2px 4px rgba(255,255,255,0.6),
            inset -2px -2px 4px rgba(0,0,0,0.15),
            8px 12px 30px rgba(0,0,0,0.5),
            0 0 80px rgba(200, 196, 191, 0.2)
          `,
          border: '1px solid #908c88',
        }}
      >
        {/* Top edge detail / cartridge slot area */}
        <div className="flex justify-between items-center mb-2 px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600" style={{
              boxShadow: state.gameState !== 'paused' ? '0 0 6px #ef4444, 0 0 10px #ef4444' : 'none'
            }} />
            <span className="text-[7px] font-bold tracking-wider" style={{ color: '#5a5652' }}>BATTERY</span>
          </div>
          <div />
        </div>

        {/* Screen housing */}
        <div
          className="relative mx-auto rounded-lg p-3"
          style={{
            background: 'linear-gradient(180deg, #65617c 0%, #54506a 100%)',
            boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.5), inset -1px -1px 3px rgba(255,255,255,0.1)',
            width: 'fit-content',
          }}
        >
          {/* Decorative lines above screen */}
          <div className="flex justify-end gap-0.5 mb-2 pr-2">
            <div className="w-8 h-0.5 rounded" style={{ background: '#8b1538' }} />
            <div className="w-8 h-0.5 rounded" style={{ background: '#1e3a5f' }} />
          </div>

          {/* DOT MATRIX label */}
          <div className="absolute top-2 right-3 text-[6px] font-bold tracking-wider" style={{ color: '#8a869e' }}>
            DOT MATRIX WITH STEREO SOUND
          </div>

          {/* Screen bezel (inner) */}
          <div
            className="p-2 rounded"
            style={{
              background: '#8b956a',
              boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.4), inset -2px -2px 4px rgba(255,255,255,0.1)',
            }}
          >
            {/* Actual game screen */}
            <div
              className="relative rounded-sm overflow-hidden"
              style={{
                background: '#9ca866',
                boxShadow: 'inset 1px 1px 4px rgba(0,0,0,0.3)',
              }}
            >
              {children}
            </div>
          </div>
        </div>

        {/* Nintendo GAME BOY logo */}
        <div className="text-center mt-4 mb-6">
          <span
            className="text-sm italic font-bold tracking-wide"
            style={{ color: '#2a2876' }}
          >
            Nintendo
          </span>
          <span className="mx-2" />
          <span
            className="text-2xl font-black tracking-wider"
            style={{
              color: '#1a1860',
              fontFamily: 'Arial Black, sans-serif',
              letterSpacing: '0.1em',
            }}
          >
            GAME BOY
          </span>
          <sup className="text-[8px] font-bold ml-1" style={{ color: '#2a2876' }}>TM</sup>
        </div>

        {/* Controls area */}
        <div className="flex items-start justify-between px-4">
          {/* D-Pad */}
          <div className="relative w-28 h-28">
            {/* D-pad shadow/base */}
            <div
              className="absolute inset-2 rounded-full"
              style={{
                background: 'radial-gradient(circle, #a8a4a0 0%, #98948f 100%)',
                boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.2)',
              }}
            />

            {/* D-pad cross */}
            <div className="absolute inset-4 flex items-center justify-center">
              {/* Vertical bar */}
              <div
                className="absolute w-9 h-full"
                style={{
                  background: 'linear-gradient(90deg, #1a1a1a 0%, #3a3a3a 15%, #2a2a2a 50%, #3a3a3a 85%, #1a1a1a 100%)',
                  borderRadius: '3px',
                  boxShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                }}
              />
              {/* Horizontal bar */}
              <div
                className="absolute h-9 w-full"
                style={{
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #3a3a3a 15%, #2a2a2a 50%, #3a3a3a 85%, #1a1a1a 100%)',
                  borderRadius: '3px',
                  boxShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                }}
              />

              {/* Direction touch areas */}
              <button
                className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-7 flex items-center justify-center transition-all active:brightness-150"
                onMouseDown={() => handleDPadPress('up')}
                onMouseUp={() => handleDPadRelease('up')}
                onMouseLeave={() => handleDPadRelease('up')}
                onTouchStart={(e) => { e.preventDefault(); handleDPadPress('up'); }}
                onTouchEnd={() => handleDPadRelease('up')}
                style={{ background: 'transparent' }}
              >
                <div className="w-3 h-3 border-t-2 border-l-2 border-gray-600 rotate-45 translate-y-1" />
              </button>
              <button
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-9 h-7 flex items-center justify-center transition-all active:brightness-150"
                onMouseDown={() => handleDPadPress('down')}
                onMouseUp={() => handleDPadRelease('down')}
                onMouseLeave={() => handleDPadRelease('down')}
                onTouchStart={(e) => { e.preventDefault(); handleDPadPress('down'); }}
                onTouchEnd={() => handleDPadRelease('down')}
                style={{ background: 'transparent' }}
              >
                <div className="w-3 h-3 border-b-2 border-r-2 border-gray-600 rotate-45 -translate-y-1" />
              </button>
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-9 flex items-center justify-center transition-all active:brightness-150"
                onMouseDown={() => handleDPadPress('left')}
                onMouseUp={() => handleDPadRelease('left')}
                onMouseLeave={() => handleDPadRelease('left')}
                onTouchStart={(e) => { e.preventDefault(); handleDPadPress('left'); }}
                onTouchEnd={() => handleDPadRelease('left')}
                style={{ background: 'transparent' }}
              >
                <div className="w-3 h-3 border-b-2 border-l-2 border-gray-600 rotate-45 translate-x-1" />
              </button>
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-9 flex items-center justify-center transition-all active:brightness-150"
                onMouseDown={() => handleDPadPress('right')}
                onMouseUp={() => handleDPadRelease('right')}
                onMouseLeave={() => handleDPadRelease('right')}
                onTouchStart={(e) => { e.preventDefault(); handleDPadPress('right'); }}
                onTouchEnd={() => handleDPadRelease('right')}
                style={{ background: 'transparent' }}
              >
                <div className="w-3 h-3 border-t-2 border-r-2 border-gray-600 rotate-45 -translate-x-1" />
              </button>

              {/* Center indent */}
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                  boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.1)',
                }}
              />
            </div>
          </div>

          {/* A/B Buttons area */}
          <div className="relative mt-12" style={{ transform: 'rotate(-25deg)' }}>
            <div className="flex gap-4">
              {/* B Button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={handleBButton}
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all active:scale-95 active:brightness-90"
                  style={{
                    background: 'linear-gradient(145deg, #9b2257 0%, #7a1b45 50%, #691838 100%)',
                    boxShadow: `
                      3px 4px 8px rgba(0,0,0,0.4),
                      inset 1px 1px 2px rgba(255,255,255,0.3),
                      inset -1px -1px 2px rgba(0,0,0,0.2)
                    `,
                    color: '#d4a5b5',
                  }}
                >
                  B
                </button>
                <span
                  className="text-[9px] font-bold mt-1"
                  style={{ color: '#2a2876', transform: 'rotate(25deg)' }}
                >
                  B
                </span>
              </div>

              {/* A Button */}
              <div className="flex flex-col items-center -mt-8">
                <button
                  onClick={handleAButton}
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all active:scale-95 active:brightness-90"
                  style={{
                    background: 'linear-gradient(145deg, #9b2257 0%, #7a1b45 50%, #691838 100%)',
                    boxShadow: `
                      3px 4px 8px rgba(0,0,0,0.4),
                      inset 1px 1px 2px rgba(255,255,255,0.3),
                      inset -1px -1px 2px rgba(0,0,0,0.2)
                    `,
                    color: '#d4a5b5',
                  }}
                >
                  A
                </button>
                <span
                  className="text-[9px] font-bold mt-1"
                  style={{ color: '#2a2876', transform: 'rotate(25deg)' }}
                >
                  A
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Start/Select buttons - absolutely positioned */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex gap-8"
          style={{
            bottom: '50px',
            transform: 'translateX(-50%) rotate(-25deg)',
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-[8px] font-bold tracking-wider"
              style={{ color: '#2a2876', transform: 'rotate(25deg)' }}
            >
              SELECT
            </span>
            <button
              onClick={handleSelect}
              className="w-14 h-4 rounded-full transition-all active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #7a7672 0%, #5a5652 100%)',
                boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.4), 1px 2px 3px rgba(0,0,0,0.2)',
              }}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-[8px] font-bold tracking-wider"
              style={{ color: '#2a2876', transform: 'rotate(25deg)' }}
            >
              START
            </span>
            <button
              onClick={handleStart}
              className="w-14 h-4 rounded-full transition-all active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #7a7672 0%, #5a5652 100%)',
                boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.4), 1px 2px 3px rgba(0,0,0,0.2)',
              }}
            />
          </div>
        </div>

        {/* Speaker grille */}
        <div
          className="absolute bottom-6 left-8 grid gap-1"
          style={{
            gridTemplateColumns: 'repeat(6, 1fr)',
            transform: 'rotate(-25deg)',
          }}
        >
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-1 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #6a6662 0%, #4a4642 100%)',
                boxShadow: 'inset 0.5px 0.5px 1px rgba(0,0,0,0.5)',
              }}
            />
          ))}
        </div>

        {/* Phones/headphone jack label (decorative) */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[6px] font-bold tracking-widest"
          style={{ color: '#8a8682' }}
        >
          🎧 PHONES
        </div>

        {/* Exit button - subtle */}
        <button
          onClick={onExit}
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all hover:bg-black/10 active:scale-95"
          style={{ color: '#6a6662' }}
          title="Exit to Dashboard"
        >
          ✕
        </button>

        {/* Right side volume slider (decorative) */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-20 rounded-l"
          style={{
            background: 'linear-gradient(90deg, #908c88 0%, #a8a4a0 50%, #b8b4b0 100%)',
            boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.3)',
          }}
        >
          {/* Ridges */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-full h-px my-2"
              style={{ background: '#787470' }}
            />
          ))}
        </div>

        {/* Contrast dial area (decorative) */}
        <div
          className="absolute left-0 top-32 w-3 h-8 rounded-r-full"
          style={{
            background: 'linear-gradient(270deg, #888480 0%, #a8a4a0 100%)',
            boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.2)',
          }}
        />
      </div>

      {/* Instructions overlay (hidden on mobile, shown on desktop) */}
      <div className="hidden lg:block absolute bottom-4 left-4 text-xs text-slate-500 font-mono">
        <div className="bg-slate-800/80 rounded-lg px-4 py-2 backdrop-blur">
          <div className="flex gap-4">
            <span><kbd className="px-1 bg-slate-700 rounded">WASD</kbd> Move</span>
            <span><kbd className="px-1 bg-slate-700 rounded">Space</kbd> A</span>
            <span><kbd className="px-1 bg-slate-700 rounded">ESC</kbd> B</span>
            <span><kbd className="px-1 bg-slate-700 rounded">M</kbd> Map</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoyShell;
