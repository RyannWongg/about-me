import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const { isMusicPlaying, setIsMusicPlaying, musicVolume, setMusicVolume } = useGame();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Simple synth music generator (no external files needed)
  useEffect(() => {
    if (isMusicPlaying) {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioContextRef.current;

      // Create gain node for volume control
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.gain.value = musicVolume * 0.1;
      gainNodeRef.current.connect(ctx.destination);

      // Create a simple ambient loop
      const playNote = (freq: number, duration: number, delay: number) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        noteGain.gain.setValueAtTime(0, ctx.currentTime + delay);
        noteGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + delay + 0.1);
        noteGain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration);

        osc.connect(noteGain);
        noteGain.connect(gainNodeRef.current!);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      // Ambient chord progression
      const notes = [
        { freq: 220, duration: 2, delay: 0 },     // A3
        { freq: 277, duration: 2, delay: 0.5 },   // C#4
        { freq: 330, duration: 2, delay: 1 },     // E4
        { freq: 196, duration: 2, delay: 2 },     // G3
        { freq: 247, duration: 2, delay: 2.5 },   // B3
        { freq: 294, duration: 2, delay: 3 },     // D4
        { freq: 175, duration: 2, delay: 4 },     // F3
        { freq: 220, duration: 2, delay: 4.5 },   // A3
        { freq: 262, duration: 2, delay: 5 },     // C4
        { freq: 165, duration: 2, delay: 6 },     // E3
        { freq: 208, duration: 2, delay: 6.5 },   // G#3
        { freq: 247, duration: 2, delay: 7 },     // B3
      ];

      let intervalId: NodeJS.Timeout;

      const playLoop = () => {
        notes.forEach(note => playNote(note.freq, note.duration, note.delay));
      };

      playLoop();
      intervalId = setInterval(playLoop, 8000);

      return () => {
        clearInterval(intervalId);
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };
    }
  }, [isMusicPlaying]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = musicVolume * 0.1;
    }
  }, [musicVolume]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-900/90 backdrop-blur-sm border border-[#39ff14]/30 rounded-xl p-3 shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${isMusicPlaying ? 'bg-[#39ff14] animate-pulse' : 'bg-slate-600'}`} />
          <span className="text-[10px] font-mono text-slate-400 uppercase">Music</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={() => setIsMusicPlaying(!isMusicPlaying)}
            className={`p-2 rounded-lg transition-all ${
              isMusicPlaying
                ? 'bg-[#39ff14]/20 text-[#39ff14] hover:bg-[#39ff14]/30'
                : 'bg-slate-800 text-slate-400 hover:text-[#39ff14] hover:bg-slate-700'
            }`}
          >
            {isMusicPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMusicVolume(musicVolume === 0 ? 0.5 : 0)}
              className="text-slate-400 hover:text-[#39ff14] transition-colors"
            >
              {musicVolume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#39ff14]"
            />
          </div>
        </div>

        {/* Now playing indicator */}
        {isMusicPlaying && (
          <div className="mt-2 pt-2 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="flex items-end gap-0.5 h-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#39ff14] rounded-full animate-pulse"
                    style={{
                      height: `${40 + Math.random() * 60}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.5s',
                    }}
                  />
                ))}
              </div>
              <span className="text-[9px] text-[#39ff14] font-mono">Ambient Vibes</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
