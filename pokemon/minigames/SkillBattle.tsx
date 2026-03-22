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
];

interface SkillBattleProps {
  onClose: () => void;
  onVictory: () => void;
}

type BattlePhase = 'intro' | 'battle' | 'attack' | 'result' | 'victory' | 'defeat';

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

  // Shuffle and select questions
  useEffect(() => {
    const shuffled = [...BATTLE_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
  }, []);

  const handleIntroComplete = () => {
    setPhase('battle');
    setMessage('What will you do?');
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const question = questions[currentQuestion];
    const correct = index === question.correctIndex;
    setIsCorrect(correct);
    setPhase('attack');

    if (correct) {
      // Player attacks boss
      SoundManager.playCorrect();
      setShake('boss');
      setMessage(`Correct! Super effective ${question.skill} attack!`);
      setTimeout(() => {
        setBossHP(prev => Math.max(0, prev - 25));
        setShake(null);
      }, 500);
    } else {
      // Boss attacks player
      SoundManager.playWrong();
      setShake('player');
      setMessage(`Wrong! The bug attacks back!`);
      setTimeout(() => {
        setPlayerHP(prev => Math.max(0, prev - 20));
        setShake(null);
      }, 500);
    }

    // Move to result after animation
    setTimeout(() => {
      setPhase('result');
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (bossHP <= 0) {
      setPhase('victory');
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: 'battle-master' });
      onVictory();
      return;
    }

    if (playerHP <= 0) {
      setPhase('defeat');
      return;
    }

    if (currentQuestion >= questions.length - 1) {
      // Ran out of questions
      if (bossHP < playerHP) {
        setPhase('victory');
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: 'battle-master' });
        onVictory();
      } else {
        setPhase('defeat');
      }
      return;
    }

    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setPhase('battle');
    setMessage('What will you do?');
  };

  const renderHealthBar = (hp: number, maxHp: number, color: string) => (
    <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600">
      <div
        className={`h-full transition-all duration-500 ${color}`}
        style={{ width: `${(hp / maxHp) * 100}%` }}
      />
    </div>
  );

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full h-full max-w-[640px] max-h-[480px] bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-slate-600 rounded-lg overflow-hidden flex flex-col">
        {/* Battle Scene */}
        <div className="flex-1 relative p-4">
          {/* Boss (top right) */}
          <div className={`absolute top-4 right-4 transition-transform ${shake === 'boss' ? 'animate-shake' : ''}`}>
            <div className="text-6xl mb-2">🐛</div>
            <div className="bg-slate-800/80 rounded px-3 py-1 min-w-[150px]">
              <div className="font-mono text-[10px] text-slate-400">THE BUG</div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-300">HP</span>
                {renderHealthBar(bossHP, 100, 'bg-red-500')}
              </div>
            </div>
          </div>

          {/* Player (bottom left) */}
          <div className={`absolute bottom-4 left-4 transition-transform ${shake === 'player' ? 'animate-shake' : ''}`}>
            <div className="bg-slate-800/80 rounded px-3 py-1 min-w-[150px] mb-2">
              <div className="font-mono text-[10px] text-slate-400">DEVELOPER</div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-300">HP</span>
                {renderHealthBar(playerHP, 100, 'bg-green-500')}
              </div>
            </div>
            <div className="text-6xl">👨‍💻</div>
          </div>

          {/* Battle effects */}
          {phase === 'attack' && isCorrect && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-6xl animate-ping">⚡</div>
            </div>
          )}
        </div>

        {/* Dialog/Action Box */}
        <div className="bg-slate-800 border-t-4 border-slate-600 p-4 min-h-[180px]">
          {phase === 'intro' && (
            <div className="text-center">
              <p className="font-mono text-white mb-4">
                A wild BUG appeared! 🐛
              </p>
              <p className="font-mono text-slate-400 text-sm mb-4">
                Use your coding knowledge to defeat it!
              </p>
              <button
                onClick={handleIntroComplete}
                className="px-6 py-2 bg-[#39ff14] text-slate-900 font-mono font-bold rounded hover:bg-[#32e612] transition-colors"
              >
                FIGHT!
              </button>
            </div>
          )}

          {phase === 'battle' && questions[currentQuestion] && (
            <div>
              <div className="mb-3">
                <span className="font-mono text-[10px] text-slate-500">
                  Q{currentQuestion + 1}/{questions.length} • {questions[currentQuestion].skill}
                </span>
                <p className="font-mono text-white text-sm">
                  {questions[currentQuestion].question}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {questions[currentQuestion].answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 border-2 border-slate-500 hover:border-[#39ff14] rounded font-mono text-xs text-white transition-all text-left"
                  >
                    {String.fromCharCode(65 + index)}. {answer}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(phase === 'attack' || phase === 'result') && (
            <div className="text-center">
              <p className={`font-mono text-lg mb-4 ${isCorrect ? 'text-[#39ff14]' : 'text-red-400'}`}>
                {message}
              </p>
              {phase === 'result' && (
                <>
                  {selectedAnswer !== null && questions[currentQuestion] && (
                    <p className="font-mono text-xs text-slate-400 mb-4">
                      Correct answer: {questions[currentQuestion].answers[questions[currentQuestion].correctIndex]}
                    </p>
                  )}
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-mono rounded transition-colors"
                  >
                    Continue →
                  </button>
                </>
              )}
            </div>
          )}

          {phase === 'victory' && (
            <div className="text-center">
              <p className="font-mono text-2xl text-[#39ff14] mb-2">
                🎉 VICTORY! 🎉
              </p>
              <p className="font-mono text-slate-400 text-sm mb-4">
                You defeated the bug with your coding skills!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#39ff14] text-slate-900 font-mono font-bold rounded hover:bg-[#32e612] transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {phase === 'defeat' && (
            <div className="text-center">
              <p className="font-mono text-2xl text-red-400 mb-2">
                💀 DEFEATED 💀
              </p>
              <p className="font-mono text-slate-400 text-sm mb-4">
                The bug was too strong... Try again!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-mono rounded transition-colors"
              >
                Return
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SkillBattle;
