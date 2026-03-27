import React, { useState, useEffect, useCallback } from 'react';
import { usePokemonGame } from '../context/PokemonGameContext';
import { SoundManager } from '../audio/SoundManager';

interface BattleQuestion {
  id: string;
  question: string;
  answers: string[];
  correctIndex: number;
  skill: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const BATTLE_QUESTIONS: BattleQuestion[] = [
  {
    id: 'q1',
    question: 'What hook is used for side effects in React?',
    answers: ['useState', 'useEffect', 'useContext', 'useMemo'],
    correctIndex: 1,
    skill: 'React',
    difficulty: 'easy',
  },
  {
    id: 'q2',
    question: 'Which data structure uses LIFO?',
    answers: ['Queue', 'Stack', 'Linked List', 'Tree'],
    correctIndex: 1,
    skill: 'Data Structures',
    difficulty: 'easy',
  },
  {
    id: 'q3',
    question: 'What is the time complexity of binary search?',
    answers: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
    correctIndex: 2,
    skill: 'Algorithms',
    difficulty: 'medium',
  },
  {
    id: 'q4',
    question: 'Which SQL keyword is used to filter groups?',
    answers: ['WHERE', 'HAVING', 'FILTER', 'GROUP BY'],
    correctIndex: 1,
    skill: 'SQL',
    difficulty: 'medium',
  },
  {
    id: 'q5',
    question: 'What does the "D" stand for in SOLID?',
    answers: ['Design', 'Dependency Inversion', 'Data', 'Decorator'],
    correctIndex: 1,
    skill: 'Software Design',
    difficulty: 'hard',
  },
  {
    id: 'q6',
    question: 'What is the purpose of useCallback in React?',
    answers: ['State management', 'Memoize functions', 'Handle side effects', 'Context access'],
    correctIndex: 1,
    skill: 'React',
    difficulty: 'medium',
  },
  {
    id: 'q7',
    question: 'Which sorting algorithm has O(n log n) average case?',
    answers: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'],
    correctIndex: 1,
    skill: 'Algorithms',
    difficulty: 'medium',
  },
  {
    id: 'q8',
    question: 'What does REST stand for?',
    answers: ['Remote State Transfer', 'Representational State Transfer', 'Request State Transfer', 'Resource State Transfer'],
    correctIndex: 1,
    skill: 'Web Development',
    difficulty: 'easy',
  },
];

interface SkillBattleProps {
  onClose: () => void;
  onVictory: () => void;
}

type BattlePhase = 'intro' | 'battle' | 'playerAttack' | 'bossAttack' | 'result' | 'victory' | 'defeat' | 'evading' | 'escaped';

export const SkillBattle: React.FC<SkillBattleProps> = ({ onClose, onVictory }) => {
  const { dispatch } = usePokemonGame();

  const [phase, setPhase] = useState<BattlePhase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerHP, setPlayerHP] = useState(100);
  const [bossHP, setBossHP] = useState(100);
  const [message, setMessage] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shake, setShake] = useState<'player' | 'boss' | null>(null);
  const [questions, setQuestions] = useState<BattleQuestion[]>([]);
  const [introStep, setIntroStep] = useState(0);
  const [showAttackEffect, setShowAttackEffect] = useState(false);
  const [playerLevel] = useState(Math.floor(Math.random() * 10) + 40);
  const [bossLevel] = useState(Math.floor(Math.random() * 5) + 45);
  const [evadeAttempts, setEvadeAttempts] = useState(0);

  // Shuffle and select questions
  useEffect(() => {
    const shuffled = [...BATTLE_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
  }, []);

  // Intro sequence animation
  useEffect(() => {
    if (phase === 'intro') {
      const timers = [
        setTimeout(() => setIntroStep(1), 500),
        setTimeout(() => setIntroStep(2), 1200),
        setTimeout(() => setIntroStep(3), 2000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [phase]);

  const handleIntroComplete = () => {
    setPhase('battle');
    setMessage('What will DEVELOPER do?');
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const question = questions[currentQuestion];
    const correct = index === question.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      // Player attacks boss
      SoundManager.playCorrect();
      setPhase('playerAttack');
      setMessage(`DEVELOPER used ${question.skill.toUpperCase()}!`);
      setShowAttackEffect(true);

      setTimeout(() => {
        setShowAttackEffect(false);
        setShake('boss');
        setMessage("It's super effective!");
        setTimeout(() => {
          setBossHP(prev => Math.max(0, prev - 25));
          setShake(null);
          setTimeout(() => setPhase('result'), 800);
        }, 400);
      }, 600);
    } else {
      // Boss attacks player
      SoundManager.playWrong();
      setPhase('bossAttack');
      setMessage('BUG used SYNTAX ERROR!');

      setTimeout(() => {
        setShake('player');
        setMessage('It hit DEVELOPER!');
        setTimeout(() => {
          setPlayerHP(prev => Math.max(0, prev - 20));
          setShake(null);
          setTimeout(() => setPhase('result'), 800);
        }, 400);
      }, 800);
    }
  };

  const handleNextQuestion = () => {
    if (bossHP <= 0) {
      setPhase('victory');
      setMessage('DEVELOPER defeated BUG!');
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: 'battle-master' });
      onVictory();
      return;
    }

    if (playerHP <= 0) {
      setPhase('defeat');
      setMessage('DEVELOPER fainted!');
      return;
    }

    if (currentQuestion >= questions.length - 1) {
      if (bossHP < playerHP) {
        setPhase('victory');
        setMessage('DEVELOPER defeated BUG!');
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: 'battle-master' });
        onVictory();
      } else {
        setPhase('defeat');
        setMessage('DEVELOPER fainted!');
      }
      return;
    }

    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setPhase('battle');
    setMessage('What will DEVELOPER do?');
  };

  const handleEvade = () => {
    setPhase('evading');
    setEvadeAttempts(prev => prev + 1);

    // Escape chance increases with each attempt (base 40% + 15% per attempt)
    const escapeChance = Math.min(0.4 + (evadeAttempts * 0.15), 0.95);
    const escaped = Math.random() < escapeChance;

    setMessage('DEVELOPER is trying to escape...');

    setTimeout(() => {
      if (escaped) {
        setPhase('escaped');
        setMessage('Got away safely!');
      } else {
        // Failed to escape, boss gets a free attack
        setMessage("Can't escape!");
        setTimeout(() => {
          setShake('player');
          setMessage('BUG blocked the way!');
          setTimeout(() => {
            setPlayerHP(prev => Math.max(0, prev - 10));
            setShake(null);
            if (playerHP - 10 <= 0) {
              setPhase('defeat');
              setMessage('DEVELOPER fainted!');
            } else {
              setTimeout(() => {
                setPhase('battle');
                setMessage('What will DEVELOPER do?');
              }, 800);
            }
          }, 400);
        }, 800);
      }
    }, 1000);
  };

  // Pokemon-style HP bar component
  const HPBar = ({ current, max, isPlayer }: { current: number; max: number; isPlayer: boolean }) => {
    const percentage = (current / max) * 100;
    const barColor = percentage > 50 ? '#22c55e' : percentage > 20 ? '#eab308' : '#ef4444';

    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] font-bold text-yellow-400">HP</span>
        <div className="flex-1 h-2 bg-slate-700 rounded-sm overflow-hidden border border-slate-500">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: barColor,
              boxShadow: `0 0 4px ${barColor}`,
            }}
          />
        </div>
        {isPlayer && (
          <span className="font-mono text-[10px] text-white min-w-[45px] text-right">
            {current}/{max}
          </span>
        )}
      </div>
    );
  };

  // Pixel art bug sprite
  const BugSprite = ({ shake: isShaking }: { shake: boolean }) => (
    <div className={`relative ${isShaking ? 'animate-shake' : ''}`}>
      <svg width="80" height="80" viewBox="0 0 16 16" className="pixelated">
        {/* Bug body */}
        <rect x="5" y="6" width="6" height="6" fill="#4ade80" />
        <rect x="4" y="7" width="1" height="4" fill="#4ade80" />
        <rect x="11" y="7" width="1" height="4" fill="#4ade80" />
        {/* Bug head */}
        <rect x="6" y="4" width="4" height="3" fill="#22c55e" />
        {/* Eyes */}
        <rect x="6" y="5" width="1" height="1" fill="#ef4444" />
        <rect x="9" y="5" width="1" height="1" fill="#ef4444" />
        {/* Antennae */}
        <rect x="5" y="3" width="1" height="2" fill="#166534" />
        <rect x="10" y="3" width="1" height="2" fill="#166534" />
        {/* Legs */}
        <rect x="3" y="8" width="2" height="1" fill="#166534" />
        <rect x="11" y="8" width="2" height="1" fill="#166534" />
        <rect x="3" y="10" width="2" height="1" fill="#166534" />
        <rect x="11" y="10" width="2" height="1" fill="#166534" />
        {/* Shell pattern */}
        <rect x="6" y="7" width="1" height="1" fill="#166534" />
        <rect x="9" y="7" width="1" height="1" fill="#166534" />
        <rect x="7" y="9" width="2" height="1" fill="#166534" />
        {/* Highlight */}
        <rect x="7" y="6" width="2" height="1" fill="#86efac" />
      </svg>
    </div>
  );

  // Pixel art developer sprite (back view for battle)
  const DeveloperSprite = ({ shake: isShaking }: { shake: boolean }) => (
    <div className={`relative ${isShaking ? 'animate-shake' : ''}`}>
      <svg width="64" height="80" viewBox="0 0 16 20" className="pixelated">
        {/* Hair */}
        <rect x="5" y="1" width="6" height="4" fill="#1a1a2e" />
        <rect x="6" y="0" width="4" height="2" fill="#1a1a2e" />
        {/* Hat */}
        <rect x="4" y="0" width="8" height="2" fill="#dc2626" />
        <rect x="6" y="0" width="4" height="1" fill="#f5f5f5" />
        {/* Neck */}
        <rect x="7" y="5" width="2" height="1" fill="#ffd5b8" />
        {/* Jacket back */}
        <rect x="4" y="6" width="8" height="6" fill="#1e40af" />
        <rect x="4" y="6" width="1" height="6" fill="#1e3a8a" />
        <rect x="11" y="6" width="1" height="6" fill="#1e3a8a" />
        {/* Back design */}
        <rect x="6" y="7" width="4" height="3" fill="#3b82f6" />
        {/* Arms */}
        <rect x="3" y="7" width="1" height="4" fill="#1e40af" />
        <rect x="12" y="7" width="1" height="4" fill="#1e40af" />
        <rect x="3" y="11" width="1" height="1" fill="#ffd5b8" />
        <rect x="12" y="11" width="1" height="1" fill="#ffd5b8" />
        {/* Pants */}
        <rect x="5" y="12" width="3" height="3" fill="#374151" />
        <rect x="8" y="12" width="3" height="3" fill="#374151" />
        {/* Shoes */}
        <rect x="5" y="15" width="3" height="1" fill="#ef4444" />
        <rect x="8" y="15" width="3" height="1" fill="#ef4444" />
      </svg>
    </div>
  );

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full h-full max-w-[640px] max-h-[480px] flex flex-col overflow-hidden">
        {/* Battle Scene - Pokemon Gen 4 style */}
        <div
          className="flex-1 relative"
          style={{
            background: 'linear-gradient(180deg, #87ceeb 0%, #87ceeb 50%, #90EE90 50%, #228B22 100%)',
          }}
        >
          {/* Grid pattern overlay for grass */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 20px), repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 20px)',
            }}
          />

          {/* Boss section (top right) */}
          <div className={`absolute top-4 right-8 ${introStep >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'} transition-all duration-500`}>
            {/* Boss info panel */}
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 border-4 border-slate-800 rounded-lg px-3 py-2 mb-2 min-w-[180px] shadow-lg"
              style={{ boxShadow: '4px 4px 0 #1e293b' }}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-sm font-bold text-slate-800">BUG</span>
                <span className="font-mono text-[10px] text-slate-500">Lv{bossLevel}</span>
              </div>
              <HPBar current={bossHP} max={100} isPlayer={false} />
            </div>
            {/* Boss sprite */}
            <div className="flex justify-center">
              <BugSprite shake={shake === 'boss'} />
            </div>
          </div>

          {/* Player section (bottom left) */}
          <div className={`absolute bottom-4 left-8 ${introStep >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'} transition-all duration-500`}>
            {/* Player sprite */}
            <div className="flex justify-center mb-2">
              <DeveloperSprite shake={shake === 'player'} />
            </div>
            {/* Player info panel */}
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 border-4 border-slate-800 rounded-lg px-3 py-2 min-w-[200px] shadow-lg"
              style={{ boxShadow: '4px 4px 0 #1e293b' }}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-sm font-bold text-slate-800">DEVELOPER</span>
                <span className="font-mono text-[10px] text-slate-500">Lv{playerLevel}</span>
              </div>
              <HPBar current={playerHP} max={100} isPlayer={true} />
            </div>
          </div>

          {/* Attack effects */}
          {showAttackEffect && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 bg-yellow-400"
                    style={{
                      transform: `rotate(${i * 45}deg) translateY(-30px)`,
                      animation: 'attackPulse 0.3s ease-out',
                      boxShadow: '0 0 10px #facc15',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {phase === 'bossAttack' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-4xl font-mono text-red-500 font-bold animate-pulse">
                SYNTAX ERROR!
              </div>
            </div>
          )}
        </div>

        {/* Dialog/Action Box - Pokemon style */}
        <div
          className="bg-slate-100 border-t-4 border-slate-800 min-h-[160px]"
          style={{ boxShadow: '0 -4px 0 #475569 inset' }}
        >
          {phase === 'intro' && (
            <div className="p-4 h-full flex flex-col justify-between">
              <div className="bg-white border-4 border-slate-800 rounded-lg p-4 flex-1"
                style={{ boxShadow: '4px 4px 0 #1e293b' }}>
                <p className={`font-mono text-slate-800 ${introStep >= 3 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                  A wild BUG appeared!
                </p>
              </div>
              {introStep >= 3 && (
                <button
                  onClick={handleIntroComplete}
                  className="mt-2 self-end px-6 py-2 bg-slate-800 text-white font-mono font-bold rounded border-2 border-slate-600 hover:bg-slate-700 transition-colors"
                  style={{ boxShadow: '2px 2px 0 #1e293b' }}
                >
                  FIGHT ▶
                </button>
              )}
            </div>
          )}

          {phase === 'battle' && questions[currentQuestion] && (
            <div className="p-3 h-full flex gap-3">
              {/* Left side - Question and answers */}
              <div className="flex-1">
                {/* Question area */}
                <div className="bg-white border-4 border-slate-800 rounded-lg p-3 mb-2"
                  style={{ boxShadow: '4px 4px 0 #1e293b' }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                      {questions[currentQuestion].skill}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {currentQuestion + 1}/{questions.length}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-slate-800">
                    {questions[currentQuestion].question}
                  </p>
                </div>

                {/* Answer buttons - Pokemon menu style */}
                <div className="grid grid-cols-2 gap-2">
                  {questions[currentQuestion].answers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="px-3 py-2 bg-white border-4 border-slate-800 rounded font-mono text-xs text-slate-800 hover:bg-[#39ff14] hover:text-slate-900 transition-all text-left flex items-center gap-2"
                      style={{ boxShadow: '2px 2px 0 #1e293b' }}
                    >
                      <span className="font-bold">{String.fromCharCode(65 + index)}.</span>
                      <span className="truncate">{answer}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right side - Run button */}
              <div className="w-24 flex flex-col justify-end">
                <button
                  onClick={handleEvade}
                  className="px-3 py-3 bg-white border-4 border-slate-800 rounded font-mono text-xs text-slate-800 hover:bg-yellow-300 hover:text-slate-900 transition-all flex flex-col items-center gap-1"
                  style={{ boxShadow: '2px 2px 0 #1e293b' }}
                >
                  <span className="text-lg">🏃</span>
                  <span className="font-bold">RUN</span>
                </button>
              </div>
            </div>
          )}

          {(phase === 'playerAttack' || phase === 'bossAttack' || phase === 'result') && (
            <div className="p-4 h-full flex flex-col justify-between">
              <div className="bg-white border-4 border-slate-800 rounded-lg p-4 flex-1"
                style={{ boxShadow: '4px 4px 0 #1e293b' }}>
                <p className={`font-mono ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
                {phase === 'result' && selectedAnswer !== null && questions[currentQuestion] && !isCorrect && (
                  <p className="font-mono text-xs text-slate-500 mt-2">
                    Correct: {questions[currentQuestion].answers[questions[currentQuestion].correctIndex]}
                  </p>
                )}
              </div>
              {phase === 'result' && (
                <button
                  onClick={handleNextQuestion}
                  className="mt-2 self-end px-6 py-2 bg-slate-800 text-white font-mono font-bold rounded border-2 border-slate-600 hover:bg-slate-700 transition-colors"
                  style={{ boxShadow: '2px 2px 0 #1e293b' }}
                >
                  Continue ▶
                </button>
              )}
            </div>
          )}

          {phase === 'evading' && (
            <div className="p-4 h-full flex flex-col justify-center">
              <div className="bg-white border-4 border-slate-800 rounded-lg p-4 text-center"
                style={{ boxShadow: '4px 4px 0 #1e293b' }}>
                <p className="font-mono text-slate-800 animate-pulse">
                  {message}
                </p>
              </div>
            </div>
          )}

          {phase === 'escaped' && (
            <div className="p-4 h-full flex flex-col justify-between">
              <div className="bg-white border-4 border-slate-800 rounded-lg p-4 flex-1 text-center"
                style={{ boxShadow: '4px 4px 0 #1e293b' }}>
                <p className="font-mono text-xl text-blue-600 font-bold mb-2">
                  ESCAPED!
                </p>
                <p className="font-mono text-sm text-slate-600">
                  {message}
                </p>
                <p className="font-mono text-xs text-slate-500 mt-2">
                  You avoided the battle this time.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 self-end px-6 py-2 bg-blue-500 text-white font-mono font-bold rounded border-2 border-blue-600 hover:bg-blue-400 transition-colors"
                style={{ boxShadow: '2px 2px 0 #1e40af' }}
              >
                Continue ▶
              </button>
            </div>
          )}

          {phase === 'victory' && (
            <div className="p-4 h-full flex flex-col justify-between">
              <div className="bg-white border-4 border-slate-800 rounded-lg p-4 flex-1 text-center"
                style={{ boxShadow: '4px 4px 0 #1e293b' }}>
                <p className="font-mono text-xl text-green-600 font-bold mb-2">
                  VICTORY!
                </p>
                <p className="font-mono text-sm text-slate-600">
                  {message}
                </p>
                <p className="font-mono text-xs text-slate-500 mt-2">
                  DEVELOPER gained experience!
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 self-end px-6 py-2 bg-[#39ff14] text-slate-900 font-mono font-bold rounded border-2 border-green-600 hover:bg-[#32e612] transition-colors"
                style={{ boxShadow: '2px 2px 0 #166534' }}
              >
                Continue ▶
              </button>
            </div>
          )}

          {phase === 'defeat' && (
            <div className="p-4 h-full flex flex-col justify-between">
              <div className="bg-white border-4 border-slate-800 rounded-lg p-4 flex-1 text-center"
                style={{ boxShadow: '4px 4px 0 #1e293b' }}>
                <p className="font-mono text-xl text-red-600 font-bold mb-2">
                  DEFEATED
                </p>
                <p className="font-mono text-sm text-slate-600">
                  {message}
                </p>
                <p className="font-mono text-xs text-slate-500 mt-2">
                  Try debugging again!
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 self-end px-6 py-2 bg-slate-800 text-white font-mono font-bold rounded border-2 border-slate-600 hover:bg-slate-700 transition-colors"
                style={{ boxShadow: '2px 2px 0 #1e293b' }}
              >
                Return ▶
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes attackPulse {
          0% { opacity: 0; transform: rotate(var(--rotation, 0deg)) translateY(-10px) scale(0.5); }
          50% { opacity: 1; transform: rotate(var(--rotation, 0deg)) translateY(-30px) scale(1.2); }
          100% { opacity: 0; transform: rotate(var(--rotation, 0deg)) translateY(-50px) scale(0.5); }
        }
        .pixelated {
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
};

export default SkillBattle;
