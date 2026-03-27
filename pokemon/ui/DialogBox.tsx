import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePokemonGame } from '../context/PokemonGameContext';
import { SoundManager } from '../audio/SoundManager';

const TYPEWRITER_SPEED = 30; // ms per character
const BEEP_INTERVAL = 3; // Play beep every N characters

export const DialogBox: React.FC = () => {
  const { state, advanceDialog, endDialog } = usePokemonGame();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  const currentMessage = state.currentDialog?.[state.dialogIndex];

  // Typewriter effect
  useEffect(() => {
    if (!currentMessage) {
      setDisplayedText('');
      return;
    }

    setIsTyping(true);
    setShowContinue(false);
    setDisplayedText('');

    let index = 0;
    const text = currentMessage.text;

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        // Play beep sound every few characters
        if (index % BEEP_INTERVAL === 0 && text[index] !== ' ') {
          SoundManager.playTextBeep();
        }
        index++;
      } else {
        setIsTyping(false);
        setShowContinue(true);
        clearInterval(timer);
      }
    }, TYPEWRITER_SPEED);

    return () => clearInterval(timer);
  }, [currentMessage]);

  // Handle advancing dialog
  const handleAdvance = useCallback(() => {
    SoundManager.playSelect();
    if (isTyping) {
      // Skip to end of current message
      if (currentMessage) {
        setDisplayedText(currentMessage.text);
        setIsTyping(false);
        setShowContinue(true);
      }
    } else if (state.dialogIndex < (state.currentDialog?.length || 0) - 1) {
      // Go to next message
      advanceDialog();
    } else {
      // End dialog
      endDialog();
    }
  }, [isTyping, currentMessage, state.dialogIndex, state.currentDialog, advanceDialog, endDialog]);

  // Keyboard handling
  useEffect(() => {
    if (state.gameState !== 'dialog') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'z') {
        e.preventDefault();
        handleAdvance();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.gameState, handleAdvance]);

  if (state.gameState !== 'dialog' || !currentMessage) {
    return null;
  }

  const isLastMessage = state.dialogIndex >= (state.currentDialog?.length || 0) - 1;

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
      <div
        className="relative bg-white border-4 border-slate-800 rounded-lg p-4 mx-auto max-w-lg cursor-pointer shadow-lg"
        onClick={handleAdvance}
        style={{
          // Pokemon-style pixel border
          boxShadow: '4px 4px 0 #1e293b, -2px -2px 0 #e2e8f0 inset',
        }}
      >
        {/* Speaker name badge */}
        {currentMessage.speaker && (
          <div className="absolute -top-3 left-4 bg-slate-800 text-white px-3 py-1 rounded font-mono text-xs font-bold tracking-wider">
            {currentMessage.speaker}
          </div>
        )}

        {/* Avatar - positioned inside the box on the left */}
        {currentMessage.avatar && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-200 border-3 border-slate-800 rounded-lg flex items-center justify-center text-2xl shrink-0">
            {currentMessage.avatar}
          </div>
        )}

        {/* Message text - add left margin when avatar is present */}
        <p className={`font-mono text-sm text-slate-800 leading-relaxed min-h-[3rem] pt-2 ${currentMessage.avatar ? 'ml-14' : ''}`}>
          {displayedText}
          {isTyping && <span className="animate-pulse">▌</span>}
        </p>

        {/* Continue indicator */}
        {showContinue && (
          <div className="absolute bottom-2 right-3 flex items-center gap-1 text-slate-500">
            <span className="font-mono text-[10px]">
              {isLastMessage ? 'END' : 'NEXT'}
            </span>
            <span className="animate-bounce">▼</span>
          </div>
        )}

        {/* Message counter */}
        {state.currentDialog && state.currentDialog.length > 1 && (
          <div className="absolute top-2 right-3 font-mono text-[10px] text-slate-400">
            {state.dialogIndex + 1}/{state.currentDialog.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogBox;
