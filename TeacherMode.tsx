import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  CheckSquare,
  Square,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowLeft,
  Filter,
  BarChart2,
} from 'lucide-react';
import {
  TopicId,
  Level,
  ExerciseFormat,
  Exercise,
  TeacherFilterConfig,
  UserMistakeRecord,
} from './types';
import { LESSONS } from './lessonData';
import { ExerciseEngine } from './exerciseEngine';
import { SpanishPhrase } from './SpanishPhrase';
import confetti from 'canvas-confetti';

interface TeacherModeProps {
  mistakes: UserMistakeRecord[];
  onBackToMenu: () => void;
  onRecordResult: (isCorrect: boolean) => void;
}

export const TeacherMode: React.FC<TeacherModeProps> = ({
  mistakes,
  onBackToMenu,
  onRecordResult,
}) => {
  // Configuration
  const [config, setConfig] = useState<TeacherFilterConfig>({
    selectedTopics: LESSONS.map((l) => l.id),
    selectedLevel: 'all',
    questionCount: 10,
    hintsEnabled: true,
    selectedFormats: [
      'choose_word',
      'translate_choice',
      'fill_blank',
      'reorder_words',
      'find_error',
      'text_input',
      'sentence_meaning',
      'mini_dialogue',
    ],
    onlyMistakes: false,
  });

  // Active quiz state
  const [quizRunning, setQuizRunning] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Toggle topic
  const toggleTopic = (id: TopicId) => {
    setConfig((prev) => {
      const exists = prev.selectedTopics.includes(id);
      if (exists && prev.selectedTopics.length === 1) return prev; // Keep at least one
      return {
        ...prev,
        selectedTopics: exists
          ? prev.selectedTopics.filter((t) => t !== id)
          : [...prev.selectedTopics, id],
      };
    });
  };

  // Toggle format
  const toggleFormat = (f: ExerciseFormat) => {
    setConfig((prev) => {
      const exists = prev.selectedFormats.includes(f);
      if (exists && prev.selectedFormats.length === 1) return prev;
      return {
        ...prev,
        selectedFormats: exists
          ? prev.selectedFormats.filter((fmt) => fmt !== f)
          : [...prev.selectedFormats, f],
      };
    });
  };

  // Launch Custom Quiz
  const handleStartCustomQuiz = () => {
    // Gather all pool questions from chosen topics
    let pool: Exercise[] = [];

    LESSONS.forEach((lesson) => {
      if (config.selectedTopics.includes(lesson.id)) {
        // Collect from both practice and quiz bank
        const combined = [...lesson.practiceQuestions, ...lesson.quizQuestions];
        pool.push(...combined);
      }
    });

    // Filter by level
    if (config.selectedLevel !== 'all') {
      pool = pool.filter((q) => q.level === config.selectedLevel);
    }

    // Filter by format
    pool = pool.filter((q) => config.selectedFormats.includes(q.format));

    // Shuffle pool
    pool = pool.sort(() => Math.random() - 0.5);

    // Limit to requested count
    const selected = pool.slice(0, config.questionCount);

    if (selected.length === 0) {
      alert('По выбранным фильтрам не найдено вопросов. Пожалуйста, выберите больше тем или типов заданий.');
      return;
    }

    setActiveQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setQuizRunning(true);
  };

  const handleNextQuestion = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    onRecordResult(isCorrect);

    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#FFD84D', '#FF914D'],
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const handleStopQuiz = () => {
    setQuizRunning(false);
    setQuizCompleted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl shadow-md border-2 border-blue-200">
        <button
          type="button"
          onClick={quizRunning ? handleStopQuiz : onBackToMenu}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{quizRunning ? 'К настройкам учителя' : 'В главное меню'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-blue-600 text-white">
            <Sliders className="w-4 h-4" />
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            Режим преподавателя
          </h2>
        </div>
      </div>

      {/* If Quiz is active */}
      {quizRunning ? (
        <div>
          {!quizCompleted ? (
            <div>
              <ExerciseEngine
                exercise={activeQuestions[currentIndex]}
                currentNumber={currentIndex + 1}
                totalQuestions={activeQuestions.length}
                onNext={handleNextQuestion}
                hintsEnabled={config.hintsEnabled}
              />
            </div>
          ) : (
            <div className="bg-white/95 rounded-3xl p-8 shadow-xl border-3 border-blue-300 text-center animate-in zoom-in-95">
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Смешанная викторина завершена! 🎓
              </h2>
              <p className="text-lg font-bold text-slate-700 mb-4">
                Результат: <strong className="text-blue-600 text-2xl">{score}</strong> из{' '}
                {activeQuestions.length} правильных ответов!
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleStartCustomQuiz}
                  className="px-6 py-3 rounded-2xl bg-[#FF914D] text-white font-black text-sm shadow-md"
                >
                  Запустить ещё раз с теми же фильтрами
                </button>
                <button
                  type="button"
                  onClick={handleStopQuiz}
                  className="px-6 py-3 rounded-2xl bg-[#2563EB] text-white font-black text-sm shadow-md"
                >
                  Изменить параметры викторины
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Configuration Panel */
        <div className="space-y-6">
          {/* Mistake Analytics Box */}
          <div className="bg-white/95 rounded-3xl p-5 sm:p-6 shadow-md border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <BarChart2 className="w-5 h-5 text-blue-600" />
                <span>Журнал ошибок ученика ({mistakes.length})</span>
              </div>
            </div>

            {mistakes.length === 0 ? (
              <p className="text-xs font-bold text-slate-500">
                Ученик ещё не допустил ошибок во время текущей сессии.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {mistakes.slice(-5).map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <strong className="text-slate-900 block font-black">
                        {m.prompt}
                      </strong>
                      <span className="text-slate-600 font-semibold">
                        Правильно: «{m.correctAnswer}»
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md shrink-0">
                      {m.topicId}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter 1: Topics Selection */}
          <div className="bg-white/95 rounded-3xl p-5 sm:p-6 shadow-md border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>1. Выбор тем для викторины</span>
              </h3>
              <div className="flex gap-2 text-xs font-extrabold">
                <button
                  type="button"
                  onClick={() =>
                    setConfig((p) => ({
                      ...p,
                      selectedTopics: LESSONS.map((l) => l.id),
                    }))
                  }
                  className="text-blue-600 hover:underline"
                >
                  Выбрать все
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LESSONS.map((lesson) => {
                const isChecked = config.selectedTopics.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => toggleTopic(lesson.id)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-2 ${
                      isChecked
                        ? 'bg-blue-50/90 border-[#2563EB] text-blue-950 font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-500 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{lesson.icon}</span>
                      <span className="text-xs sm:text-sm">{lesson.title}</span>
                    </div>
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter 2 & 3: Level and Question Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Level */}
            <div className="bg-white/95 rounded-3xl p-5 shadow-md border-2 border-blue-200">
              <h3 className="font-black text-sm text-slate-900 mb-3">
                2. Уровень сложности
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'Все уровни' },
                  { id: 1, label: 'Nivel 1 (Лёгкий)' },
                  { id: 2, label: 'Nivel 2 (Средний)' },
                  { id: 3, label: 'Nivel 3 (Сложнее)' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() =>
                      setConfig((p) => ({
                        ...p,
                        selectedLevel: lvl.id as 'all' | Level,
                      }))
                    }
                    className={`p-2.5 rounded-xl text-xs font-black transition-all ${
                      config.selectedLevel === lvl.id
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question count */}
            <div className="bg-white/95 rounded-3xl p-5 shadow-md border-2 border-blue-200">
              <h3 className="font-black text-sm text-slate-900 mb-3">
                3. Количество вопросов
              </h3>
              <div className="flex items-center gap-2">
                {[5, 10, 15, 20, 30].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() =>
                      setConfig((p) => ({
                        ...p,
                        questionCount: count as 5 | 10 | 15 | 20 | 30,
                      }))
                    }
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                      config.questionCount === count
                        ? 'bg-[#FF914D] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter 4: Hints toggle & Types */}
          <div className="bg-white/95 rounded-3xl p-5 sm:p-6 shadow-md border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-base text-slate-900">
                4. Подсказки и типы заданий
              </h3>
              <button
                type="button"
                onClick={() =>
                  setConfig((p) => ({ ...p, hintsEnabled: !p.hintsEnabled }))
                }
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                  config.hintsEnabled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                Подсказки: {config.hintsEnabled ? 'ВКЛЮЧЕНЫ ✅' : 'ВЫКЛЮЧЕНЫ ❌'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'choose_word', label: 'Выбор слова' },
                { id: 'translate_choice', label: 'Перевод' },
                { id: 'fill_blank', label: 'Пропуски' },
                { id: 'reorder_words', label: 'Сборка слов' },
                { id: 'find_error', label: 'Поиск ошибок' },
                { id: 'text_input', label: 'Ввод текста' },
                { id: 'sentence_meaning', label: 'Значение' },
                { id: 'mini_dialogue', label: 'Диалоги' },
              ].map((fmt) => {
                const isChecked = config.selectedFormats.includes(
                  fmt.id as ExerciseFormat
                );
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => toggleFormat(fmt.id as ExerciseFormat)}
                    className={`p-2.5 rounded-xl text-xs font-extrabold text-left transition-all border flex items-center justify-between ${
                      isChecked
                        ? 'bg-amber-50 border-[#FFD84D] text-amber-950 font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <span>{fmt.label}</span>
                    <span className="text-[10px]">{isChecked ? '✓' : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Launch Button */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleStartCustomQuiz}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-[#2563EB] hover:bg-blue-700 text-white font-black text-lg shadow-xl transition-all active:scale-95 glow-btn"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>Запустить смешанную викторину ({config.questionCount} вопросов)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
