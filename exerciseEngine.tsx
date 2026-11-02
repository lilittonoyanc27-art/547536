import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Volume2,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { Exercise, ExerciseOption } from './types';
import { SpanishPhrase } from './SpanishPhrase';
import { speakSpanish } from './speech';
import confetti from 'canvas-confetti';

interface ExerciseEngineProps {
  exercise: Exercise;
  onNext: (isCorrect: boolean) => void;
  onRepeatRule?: () => void;
  currentNumber: number;
  totalQuestions: number;
  hintsEnabled?: boolean;
}

// Lenient string normalization for text input
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»¡¿!]/g, '')
    .replace(/\s+/g, ' ')
    // Normalize accents if user doesn't have a Spanish keyboard:
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export const ExerciseEngine: React.FC<ExerciseEngineProps> = ({
  exercise,
  onNext,
  onRepeatRule,
  currentNumber,
  totalQuestions,
  hintsEnabled = true,
}) => {
  // State for user actions
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [reorderedWords, setReorderedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  
  // Find error format state
  const [errorCheckAnswer, setErrorCheckAnswer] = useState<boolean | null>(null);
  const [selectedCorrectionIndex, setSelectedCorrectionIndex] = useState<number | null>(null);

  // Status
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [specificErrorFeedback, setSpecificErrorFeedback] = useState<string>('');
  const [showHint, setShowHint] = useState(false);

  // Initialize or reset on exercise change
  useEffect(() => {
    setSelectedOptionId(null);
    setTextInput('');
    setIsAnswered(false);
    setIsCorrect(false);
    setSpecificErrorFeedback('');
    setShowHint(false);
    setErrorCheckAnswer(null);
    setSelectedCorrectionIndex(null);

    if (exercise.format === 'reorder_words' && exercise.words) {
      // Shuffle words slightly for practice
      const shuffled = [...exercise.words].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
      setReorderedWords([]);
    }
  }, [exercise.id]);

  // Handle Multiple Choice or Meaning or Blank
  const handleSelectOption = (option: ExerciseOption) => {
    if (isAnswered) return;
    setSelectedOptionId(option.id);

    const correct = Boolean(option.isCorrect);
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      triggerConfetti();
    } else {
      setSpecificErrorFeedback(
        option.explanationIfChosen ||
          `Ты выбрал «${option.text}». Давай разберём, почему здесь нужна другая форма.`
      );
    }
  };

  // Handle Word Reorder (tap to add to sentence, tap in sentence to return to pool)
  const handleTapAvailableWord = (word: string, index: number) => {
    if (isAnswered) return;
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
    setReorderedWords((prev) => [...prev, word]);
  };

  const handleTapSelectedWord = (word: string, index: number) => {
    if (isAnswered) return;
    setReorderedWords((prev) => prev.filter((_, i) => i !== index));
    setAvailableWords((prev) => [...prev, word]);
  };

  const handleCheckReorder = () => {
    if (reorderedWords.length === 0 || isAnswered) return;

    const assembled = reorderedWords.join(' ').toLowerCase();
    const target = (exercise.correctOrder || exercise.words || [])
      .join(' ')
      .toLowerCase();

    // Check with normalized accents and punctuation
    const isMatch = normalizeText(assembled) === normalizeText(target);
    setIsCorrect(isMatch);
    setIsAnswered(true);

    if (isMatch) {
      triggerConfetti();
    } else {
      setSpecificErrorFeedback(
        `Ты собрал: «${reorderedWords.join(' ')}». Правильный порядок слов немного другой.`
      );
    }
  };

  // Handle Text Input
  const handleCheckTextInput = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim() || isAnswered) return;

    const normalizedUser = normalizeText(textInput);
    const normalizedCorrect = normalizeText(exercise.correctAnswer);
    const normalizedAccepted = (exercise.acceptedAnswers || []).map(normalizeText);

    const matches =
      normalizedUser === normalizedCorrect ||
      normalizedAccepted.includes(normalizedUser);

    setIsCorrect(matches);
    setIsAnswered(true);

    if (matches) {
      triggerConfetti();
    } else {
      setSpecificErrorFeedback(
        `Твой ответ: «${textInput}». Ничего страшного, давай посмотрим на правильный вариант!`
      );
    }
  };

  // Handle Find Error exercise
  const handleFindErrorChoice = (userSaysHasError: boolean) => {
    if (isAnswered || !exercise.hasErrorOption) return;
    setErrorCheckAnswer(userSaysHasError);

    const actualHasError = exercise.hasErrorOption.hasError;
    if (userSaysHasError === actualHasError) {
      if (!actualHasError) {
        // Correct! Sentence has no error
        setIsCorrect(true);
        setIsAnswered(true);
        triggerConfetti();
      } else {
        // Sentence indeed has error, let user pick correction
        // Stay in step to choose correction
      }
    } else {
      // User guessed wrong on whether error exists
      setIsCorrect(false);
      setIsAnswered(true);
      if (actualHasError) {
        setSpecificErrorFeedback(
          'В этом предложении действительно есть ошибка! Давай исправим её.'
        );
      } else {
        setSpecificErrorFeedback(
          'На самом деле эта фраза построена абсолютно правильно, здесь нет ошибки!'
        );
      }
    }
  };

  const handleCorrectionSelect = (
    fixOpt: { text: string; isCorrect: boolean; explanationIfChosen?: string },
    idx: number
  ) => {
    if (isAnswered) return;
    setSelectedCorrectionIndex(idx);
    setIsCorrect(fixOpt.isCorrect);
    setIsAnswered(true);

    if (fixOpt.isCorrect) {
      triggerConfetti();
    } else {
      setSpecificErrorFeedback(
        fixOpt.explanationIfChosen || 'Это исправление не совсем точное.'
      );
    }
  };

  // Confetti burst for kids/positive reinforcement
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#2563EB', '#FFD84D', '#FF914D', '#10B981'],
      });
    } catch {
      // Ignore if confetti not supported
    }
  };

  // Try again without penalty
  const handleTryAgain = () => {
    setIsAnswered(false);
    setSelectedOptionId(null);
    setSelectedCorrectionIndex(null);
    setSpecificErrorFeedback('');
    if (exercise.format === 'reorder_words' && exercise.words) {
      setAvailableWords([...exercise.words]);
      setReorderedWords([]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with question progress & hint button */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full shadow-xs border border-blue-200">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs sm:text-sm font-extrabold text-blue-900">
            Вопрос {currentNumber} из {totalQuestions}
          </span>
        </div>

        {hintsEnabled && exercise.hint && (
          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 bg-[#FFD84D] hover:bg-amber-300 px-3 py-1.5 rounded-full shadow-xs transition-all active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-amber-800" />
            <span>{showHint ? 'Скрыть подсказку' : 'Подсказка'}</span>
          </button>
        )}
      </div>

      {/* Hint Alert */}
      {showHint && exercise.hint && (
        <div className="mb-4 p-3.5 bg-amber-50 border-2 border-[#FFD84D] rounded-2xl text-xs sm:text-sm text-amber-950 font-bold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 shadow-xs">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-amber-800 mb-0.5">💡 Подсказка от Паблито:</p>
            <p>{exercise.hint}</p>
          </div>
        </div>
      )}

      {/* Main Question Card - Round, colorful, friendly */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-xl border-3 border-blue-200 text-slate-800 transition-all">
        {/* Dialogue context if mini-dialogue */}
        {exercise.format === 'mini_dialogue' && exercise.dialogueReplica && (
          <div className="mb-6 p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-blue-700">
                {exercise.dialogueSpeaker || 'Собеседник'}
              </p>
              <SpanishPhrase
                es={exercise.dialogueReplica}
                ru={exercise.dialogueReplicaRu}
                size="lg"
                initiallyRevealed={false}
              />
            </div>
          </div>
        )}

        {/* Prompt in Russian */}
        <div className="mb-5">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
            {exercise.promptRu}
          </h3>

          {/* Context sentence on Spanish if any (e.g. fill blank or incomplete sentence) */}
          {exercise.contextEs && exercise.format !== 'mini_dialogue' && (
            <div className="mt-3 p-3.5 bg-sky-50/80 rounded-2xl border border-sky-200">
              <SpanishPhrase
                es={exercise.contextEs}
                ru={exercise.contextEsTranslation}
                size="lg"
                initiallyRevealed={false}
              />
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* FORMAT 1, 2, 3, 7: Multiple Choice Options                      */}
        {/* ============================================================== */}
        {exercise.options &&
          exercise.format !== 'reorder_words' &&
          exercise.format !== 'text_input' &&
          exercise.format !== 'find_error' && (
            <div className="grid grid-cols-1 gap-3 sm:gap-3.5 my-4">
              {exercise.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                let btnStyle =
                  'bg-sky-50/70 hover:bg-amber-100/70 border-2 border-blue-200 hover:border-[#FF914D] text-slate-900';

                if (isAnswered) {
                  if (option.isCorrect) {
                    btnStyle =
                      'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-300';
                  } else if (isSelected && !option.isCorrect) {
                    btnStyle =
                      'bg-orange-100 border-2 border-[#FF914D] text-orange-950 font-bold';
                  } else {
                    btnStyle = 'opacity-60 bg-slate-50 border border-slate-200';
                  }
                } else if (isSelected) {
                  btnStyle =
                    'bg-[#FF914D] text-white border-2 border-orange-600 font-extrabold';
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between gap-3 text-base sm:text-lg font-bold shadow-xs active:scale-[0.99] ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-white/90 border border-blue-300 flex items-center justify-center text-sm font-extrabold text-blue-800 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <SpanishPhrase
                        es={option.text}
                        ru={option.textRu}
                        size="md"
                        showAudioButton={!isAnswered}
                        initiallyRevealed={false}
                      />
                    </div>

                    {isAnswered && option.isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 animate-in zoom-in-75" />
                    )}
                    {isAnswered && isSelected && !option.isCorrect && (
                      <AlertCircle className="w-6 h-6 text-[#FF914D] shrink-0 animate-in zoom-in-75" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

        {/* ============================================================== */}
        {/* FORMAT 4: Reorder words (Interactive tap-to-order)              */}
        {/* ============================================================== */}
        {exercise.format === 'reorder_words' && (
          <div className="my-5">
            {/* Target Assembly Area */}
            <div className="min-h-16 p-4 rounded-2xl bg-amber-50/80 border-2 border-dashed border-[#FF914D] flex flex-wrap items-center gap-2 mb-4">
              {reorderedWords.length === 0 ? (
                <span className="text-slate-400 font-bold text-sm italic">
                  Нажимай на слова внизу по порядку, чтобы составить фразу...
                </span>
              ) : (
                reorderedWords.map((word, index) => (
                  <button
                    key={`sel-${word}-${index}`}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleTapSelectedWord(word, index)}
                    className="bg-[#2563EB] hover:bg-rose-500 text-white font-extrabold text-base px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 group flex items-center gap-1.5"
                    title="Нажми, чтобы вернуть слово вниз"
                  >
                    <span>{word}</span>
                    <span className="text-xs opacity-75 group-hover:opacity-100">✕</span>
                  </button>
                ))
              )}
            </div>

            {/* Word Pool Area */}
            <div className="p-3 bg-sky-50 rounded-2xl border border-blue-200 flex flex-wrap gap-2 justify-center mb-5">
              {availableWords.map((word, index) => (
                <button
                  key={`avail-${word}-${index}`}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleTapAvailableWord(word, index)}
                  className="bg-white hover:bg-amber-100 text-slate-900 border-2 border-blue-300 font-extrabold text-base px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  {word}
                </button>
              ))}
            </div>

            {!isAnswered && (
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  disabled={reorderedWords.length === 0}
                  onClick={() => {
                    setAvailableWords([...(exercise.words || [])]);
                    setReorderedWords([]);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-100 text-sm"
                >
                  Сбросить
                </button>
                <button
                  type="button"
                  disabled={reorderedWords.length === 0}
                  onClick={handleCheckReorder}
                  className="px-6 py-2.5 rounded-xl bg-[#FF914D] hover:bg-orange-600 text-white font-black text-base shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  Проверить
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* FORMAT 5: Find Error (Is there an error? -> pick fix)           */}
        {/* ============================================================== */}
        {exercise.format === 'find_error' && exercise.hasErrorOption && (
          <div className="my-5">
            <div className="p-4 bg-amber-50/90 rounded-2xl border-2 border-[#FFD84D] mb-4">
              <p className="text-xs font-bold text-slate-500 mb-1">Предложение для проверки:</p>
              <SpanishPhrase
                es={exercise.hasErrorOption.sentence}
                ru={exercise.hasErrorOption.sentenceRu}
                size="lg"
                initiallyRevealed={false}
              />
            </div>

            {/* Step 1: Does it have an error? */}
            {errorCheckAnswer === null && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleFindErrorChoice(false)}
                  className="p-4 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-extrabold text-base sm:text-lg shadow-xs transition-all active:scale-95 text-center"
                >
                  Всё верно ✅
                  <span className="block text-xs font-bold text-emerald-700 mt-1">
                    Ошибок нет
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFindErrorChoice(true)}
                  className="p-4 rounded-2xl bg-white hover:bg-orange-50 border-2 border-[#FF914D] text-orange-950 font-extrabold text-base sm:text-lg shadow-xs transition-all active:scale-95 text-center"
                >
                  Есть ошибка ⚠️
                  <span className="block text-xs font-bold text-orange-700 mt-1">
                    Нужно исправить
                  </span>
                </button>
              </div>
            )}

            {/* Step 2: If user said "Есть ошибка" and there really is one, show options */}
            {errorCheckAnswer === true &&
              exercise.hasErrorOption.hasError &&
              exercise.hasErrorOption.fixOptions &&
              !isAnswered && (
                <div className="mt-4">
                  <p className="font-extrabold text-sm text-slate-800 mb-2">
                    Отлично заметил! Как исправить ошибку?
                  </p>
                  <div className="space-y-2.5">
                    {exercise.hasErrorOption.fixOptions.map((fix, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleCorrectionSelect(fix, idx)}
                        className="w-full text-left p-3.5 rounded-xl bg-sky-50 hover:bg-amber-100 border-2 border-blue-300 font-bold text-slate-900 transition-all shadow-xs"
                      >
                        <SpanishPhrase es={fix.text} size="md" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* ============================================================== */}
        {/* FORMAT 6: Text Input (lenient check)                           */}
        {/* ============================================================== */}
        {exercise.format === 'text_input' && (
          <form onSubmit={handleCheckTextInput} className="my-5">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                disabled={isAnswered}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Введи испанский перевод..."
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-blue-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-200 outline-hidden font-bold text-base sm:text-lg bg-sky-50/50"
              />
              {!isAnswered && (
                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="px-6 py-3 rounded-2xl bg-[#FF914D] hover:bg-orange-600 text-white font-black text-base shadow-md transition-all active:scale-95 disabled:opacity-50"
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
        {/* EXPLANATION SECTION (Shown after EVERY answer as required!)     */}
        {/* ============================================================== */}
        {isAnswered && (
          <div
            className={`mt-6 p-5 sm:p-6 rounded-3xl border-3 animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              isCorrect
                ? 'bg-emerald-50/95 border-emerald-400 text-emerald-950'
                : 'bg-orange-50/95 border-[#FF914D] text-slate-900'
            }`}
          >
            {/* Header Badge */}
            <div className="flex items-center gap-2.5 mb-3">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  <span className="text-lg sm:text-xl font-black text-emerald-800">
                    ¡Correcto! Отлично справился! 🎉
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-7 h-7 text-[#FF914D]" />
                  <span className="text-lg sm:text-xl font-black text-orange-900">
                    Почти получилось! Разберём вместе 🧡
                  </span>
                </>
              )}
            </div>

            {/* If error: show custom feedback why the chosen option was wrong */}
            {!isCorrect && specificErrorFeedback && (
              <div className="mb-3.5 p-3 rounded-2xl bg-white/80 border border-orange-300 text-xs sm:text-sm font-bold text-orange-950">
                {specificErrorFeedback}
              </div>
            )}

            {/* The correct sentence with click-to-translate & speech */}
            <div className="p-3.5 rounded-2xl bg-white/90 border border-blue-200 mb-3 shadow-xs">
              <span className="text-xs font-bold text-slate-500 block mb-1">
                Правильный вариант (нажми для перевода):
              </span>
              <SpanishPhrase
                es={exercise.explanation.correctEs}
                ru={exercise.explanation.correctRu}
                size="lg"
                initiallyRevealed={true}
              />
            </div>

            {/* Why explanation (mandatory) */}
            <div className="text-sm font-semibold leading-relaxed mb-4">
              <span className="font-extrabold text-blue-900 block mb-1">
                🧐 Почему именно так?
              </span>
              <p className="text-slate-800">{exercise.explanation.why}</p>

              {/* Extra example if available */}
              {exercise.explanation.extraExampleEs && (
                <div className="mt-2.5 pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-500 block mb-1">
                    Ещё один пример:
                  </span>
                  <SpanishPhrase
                    es={exercise.explanation.extraExampleEs}
                    ru={exercise.explanation.extraExampleRu}
                    size="sm"
                    initiallyRevealed={true}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons: Try again / Repeat Rule / Next Question */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-200/60">
              <div className="flex flex-wrap gap-2">
                {!isCorrect && (
                  <button
                    type="button"
                    onClick={handleTryAgain}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 transition-all active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-600" />
                    <span>Попробовать ещё раз</span>
                  </button>
                )}

                {onRepeatRule && (
                  <button
                    type="button"
                    onClick={onRepeatRule}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFD84D] hover:bg-amber-300 text-amber-950 font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
                  >
                    <BookOpen className="w-4 h-4 text-amber-900" />
                    <span>Повторить правило</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => onNext(isCorrect)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-black text-sm sm:text-base shadow-md transition-all active:scale-95 ml-auto glow-btn"
              >
                <span>Следующий вопрос</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
