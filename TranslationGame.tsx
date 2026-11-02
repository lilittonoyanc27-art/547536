import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Type,
  Shuffle,
  ListOrdered,
} from 'lucide-react';
import { TRANSLATION_TASKS, TranslationTask } from './translationGameData';
import { SpanishPhrase } from './SpanishPhrase';
import { Mascot } from './mascot';
import confetti from 'canvas-confetti';

interface TranslationGameProps {
  onBackToMenu: () => void;
  onRecordResult: (isCorrect: boolean) => void;
}

type Mode = 'choice' | 'reorder' | 'input';

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»¡¿!]/g, '')
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export const TranslationGame: React.FC<TranslationGameProps> = ({
  onBackToMenu,
  onRecordResult,
}) => {
  const [taskIndex, setTaskIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('reorder');
  const [score, setScore] = useState(0);

  const currentTask: TranslationTask = TRANSLATION_TASKS[taskIndex];

  // State for reorder
  const [availableWords, setAvailableWords] = useState<string[]>(() =>
    [...currentTask.words].sort(() => Math.random() - 0.5)
  );
  const [reorderedWords, setReorderedWords] = useState<string[]>([]);

  // State for choice
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);

  // State for text input
  const [inputText, setInputText] = useState('');

  // Results
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');

  // When task changes, reset
  const resetTask = (newTaskIdx: number, newMode: Mode = mode) => {
    setTaskIndex(newTaskIdx);
    const task = TRANSLATION_TASKS[newTaskIdx];
    setAvailableWords([...task.words].sort(() => Math.random() - 0.5));
    setReorderedWords([]);
    setSelectedChoiceIndex(null);
    setInputText('');
    setIsAnswered(false);
    setIsCorrect(false);
    setFeedback('');
  };

  // Handle reorder
  const handleTapWord = (word: string, index: number) => {
    if (isAnswered) return;
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
    setReorderedWords((prev) => [...prev, word]);
  };

  const handleReturnWord = (word: string, index: number) => {
    if (isAnswered) return;
    setReorderedWords((prev) => prev.filter((_, i) => i !== index));
    setAvailableWords((prev) => [...prev, word]);
  };

  const handleCheckReorder = () => {
    if (reorderedWords.length === 0 || isAnswered) return;
    const userStr = normalizeText(reorderedWords.join(' '));
    const targetStr = normalizeText(currentTask.esCanonical);
    const matchesAccepted = currentTask.acceptedEs.some(
      (a) => normalizeText(a) === userStr
    );

    const match = userStr === targetStr || matchesAccepted;
    setIsCorrect(match);
    setIsAnswered(true);

    if (match) {
      setScore((s) => s + 1);
      onRecordResult(true);
      triggerCelebration();
    } else {
      onRecordResult(false);
      setFeedback(`Собрано: «${reorderedWords.join(' ')}». Давай посмотрим на правильный порядок!`);
    }
  };

  // Handle choice
  const handleChoice = (opt: { text: string; isCorrect: boolean; explanation?: string }, idx: number) => {
    if (isAnswered) return;
    setSelectedChoiceIndex(idx);
    setIsCorrect(opt.isCorrect);
    setIsAnswered(true);

    if (opt.isCorrect) {
      setScore((s) => s + 1);
      onRecordResult(true);
      triggerCelebration();
    } else {
      onRecordResult(false);
      setFeedback(opt.explanation || 'Этот вариант не совсем точный.');
    }
  };

  // Handle input
  const handleCheckInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAnswered) return;

    const userStr = normalizeText(inputText);
    const targetStr = normalizeText(currentTask.esCanonical);
    const matchesAccepted = currentTask.acceptedEs.some(
      (a) => normalizeText(a) === userStr
    );

    const match = userStr === targetStr || matchesAccepted;
    setIsCorrect(match);
    setIsAnswered(true);

    if (match) {
      setScore((s) => s + 1);
      onRecordResult(true);
      triggerCelebration();
    } else {
      onRecordResult(false);
      setFeedback(`Твой ввод: «${inputText}». Ничего страшного, давай проверим!`);
    }
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#2563EB', '#FFD84D', '#FF914D'],
      });
    } catch {
      // Ignore
    }
  };

  const handleNextTask = () => {
    const nextIdx = (taskIndex + 1) % TRANSLATION_TASKS.length;
    resetTask(nextIdx);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl shadow-md border-2 border-blue-200">
        <button
          type="button"
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>В меню</span>
        </button>

        {/* Mode selector pills */}
        <div className="flex items-center gap-1.5 bg-sky-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setMode('reorder');
              resetTask(taskIndex, 'reorder');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              mode === 'reorder'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-blue-900 hover:bg-white/50'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Собрать</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('choice');
              resetTask(taskIndex, 'choice');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              mode === 'choice'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-blue-900 hover:bg-white/50'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Выбрать</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('input');
              resetTask(taskIndex, 'input');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              mode === 'input'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-blue-900 hover:bg-white/50'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Ввести</span>
          </button>
        </div>

        <div className="text-right">
          <span className="text-xs font-black text-blue-900 bg-amber-200 px-3 py-1 rounded-full">
            Очки: {score}
          </span>
        </div>
      </div>

      {/* Mascot Message */}
      <div className="mb-6 flex justify-center">
        <Mascot
          mood={isAnswered ? (isCorrect ? 'celebrating' : 'comforting') : 'happy'}
          speechText={
            isAnswered
              ? isCorrect
                ? '¡Maravilloso! Ты точно перевёл фразу на испанский!'
                : 'Отличная попытка! Посмотри на правильный перевод и повтори его вслух!'
              : 'Переведи предложение с русского на испанский язык!'
          }
          size="md"
        />
      </div>

      {/* Main Translation Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border-3 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-sky-50 px-3 py-1 rounded-full">
            Задание {taskIndex + 1} из {TRANSLATION_TASKS.length}
          </span>
          <span className="text-xs font-bold text-slate-400">
            {mode === 'reorder'
              ? '🧩 Собери фразу из слов'
              : mode === 'choice'
              ? '🔘 Выбери вариант'
              : '✍️ Напиши перевод'}
          </span>
        </div>

        {/* Russian prompt */}
        <div className="p-4 bg-amber-50/80 rounded-2xl border-2 border-[#FFD84D] mb-6">
          <span className="text-xs font-extrabold text-amber-800 uppercase block mb-1">
            🇷🇺 Фраза на русском языке:
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            «{currentTask.ru}»
          </h2>
        </div>

        {/* ============================================================== */}
        {/* MODE: REORDER                                                  */}
        {/* ============================================================== */}
        {mode === 'reorder' && (
          <div className="my-5">
            <div className="min-h-16 p-4 rounded-2xl bg-sky-50 border-2 border-dashed border-[#FF914D] flex flex-wrap items-center gap-2 mb-4">
              {reorderedWords.length === 0 ? (
                <span className="text-slate-400 font-bold text-sm italic">
                  Нажимай на слова внизу, чтобы составить испанскую фразу...
                </span>
              ) : (
                reorderedWords.map((word, index) => (
                  <button
                    key={`reord-${word}-${index}`}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleReturnWord(word, index)}
                    className="bg-[#2563EB] hover:bg-rose-500 text-white font-extrabold text-base px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 group flex items-center gap-1.5"
                    title="Нажми, чтобы вернуть слово"
                  >
                    <span>{word}</span>
                    <span className="text-xs opacity-70 group-hover:opacity-100">✕</span>
                  </button>
                ))
              )}
            </div>

            {/* Word Bank */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap gap-2 justify-center mb-5">
              {availableWords.map((word, index) => (
                <button
                  key={`bank-${word}-${index}`}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleTapWord(word, index)}
                  className="bg-white hover:bg-amber-100 text-slate-900 border-2 border-blue-300 font-extrabold text-base px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  {word}
                </button>
              ))}
            </div>

            {!isAnswered && (
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={reorderedWords.length === 0}
                  onClick={() => {
                    setAvailableWords([...currentTask.words]);
                    setReorderedWords([]);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold text-sm"
                >
                  Сбросить
                </button>
                <button
                  type="button"
                  disabled={reorderedWords.length === 0}
                  onClick={handleCheckReorder}
                  className="px-6 py-2.5 rounded-xl bg-[#FF914D] hover:bg-orange-600 text-white font-black text-base shadow-md active:scale-95 disabled:opacity-50"
                >
                  Проверить перевод
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE: CHOICE                                                   */}
        {/* ============================================================== */}
        {mode === 'choice' && (
          <div className="space-y-3 my-5">
            {currentTask.options.map((opt, idx) => {
              const isSelected = selectedChoiceIndex === idx;
              let style =
                'bg-sky-50 hover:bg-amber-100 border-2 border-blue-200 text-slate-900';

              if (isAnswered) {
                if (opt.isCorrect) {
                  style =
                    'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-300';
                } else if (isSelected && !opt.isCorrect) {
                  style =
                    'bg-orange-100 border-2 border-[#FF914D] text-orange-950 font-bold';
                } else {
                  style = 'opacity-50 bg-slate-50 border border-slate-200';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleChoice(opt, idx)}
                  className={`w-full text-left p-4 rounded-2xl font-black text-base sm:text-lg transition-all shadow-xs flex items-center justify-between gap-3 ${style}`}
                >
                  <SpanishPhrase
                    es={opt.text}
                    size="md"
                    showAudioButton={!isAnswered}
                    initiallyRevealed={false}
                  />
                  {isAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !opt.isCorrect && (
                    <AlertCircle className="w-6 h-6 text-[#FF914D] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE: TEXT INPUT                                               */}
        {/* ============================================================== */}
        {mode === 'input' && (
          <form onSubmit={handleCheckInput} className="my-5">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                disabled={isAnswered}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Введи испанский перевод..."
                className="flex-1 px-4 py-3.5 rounded-2xl border-2 border-blue-300 focus:border-[#2563EB] outline-hidden font-bold text-base sm:text-lg bg-sky-50/50"
              />
              {!isAnswered && (
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-6 py-3.5 rounded-2xl bg-[#FF914D] hover:bg-orange-600 text-white font-black text-base shadow-md disabled:opacity-50 active:scale-95"
                >
                  Проверить
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 font-bold mt-2">
              💡 Заглавные буквы, знаки препинания и ударения не помешают проверке!
            </p>
          </form>
        )}

        {/* ============================================================== */}
        {/* EXPLANATION & FEEDBACK                                         */}
        {/* ============================================================== */}
        {isAnswered && (
          <div
            className={`mt-6 p-5 sm:p-6 rounded-3xl border-3 animate-in fade-in ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-orange-50 border-[#FF914D] text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 font-black text-base">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span className="text-emerald-900">¡Excelente! Всё верно!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-[#FF914D]" />
                  <span className="text-orange-900">Разберём перевод:</span>
                </>
              )}
            </div>

            {!isCorrect && feedback && (
              <p className="text-xs sm:text-sm font-bold text-orange-950 mb-3 bg-white/70 p-2.5 rounded-xl border border-orange-200">
                {feedback}
              </p>
            )}

            <div className="p-3.5 bg-white/90 rounded-2xl border border-blue-200 mb-3">
              <span className="text-xs font-bold text-slate-500 block mb-1">
                Правильный испанский перевод (нажми для перевода):
              </span>
              <SpanishPhrase
                es={currentTask.explanation.correctEs}
                ru={currentTask.explanation.correctRu}
                size="lg"
                initiallyRevealed={true}
              />
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed mb-4">
              {currentTask.explanation.why}
            </p>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleNextTask}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-black text-sm shadow-md active:scale-95 glow-btn"
              >
                <span>Следующая фраза</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
