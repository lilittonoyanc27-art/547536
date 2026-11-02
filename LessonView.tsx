import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  Trophy,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { LessonData, Exercise, UserMistakeRecord } from './types';
import { SpanishPhrase } from './SpanishPhrase';
import { Mascot } from './mascot';
import { ExerciseEngine } from './exerciseEngine';
import confetti from 'canvas-confetti';

interface LessonViewProps {
  lesson: LessonData;
  onBackToMenu: () => void;
  onRecordResult: (
    topicId: LessonData['id'],
    isCorrect: boolean,
    mistake?: UserMistakeRecord
  ) => void;
  onCompleteLesson: (topicId: LessonData['id']) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  onBackToMenu,
  onRecordResult,
  onCompleteLesson,
}) => {
  // Current stage: 1 to 5
  // Stage 1: Rule
  // Stage 2: Examples
  // Stage 3: Difference
  // Stage 4: Practice
  // Stage 5: Quiz
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Practice state
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceCompleted, setPracticeCompleted] = useState(false);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Mascot message state
  const getMascotMessage = () => {
    switch (stage) {
      case 1:
        return 'Привет! Давай разберём это правило без зубрежки. Всё очень просто!';
      case 2:
        return 'Послушай эти примеры и нажми на них, чтобы увидеть перевод на русский!';
      case 3:
        return 'Смотри, как легко не перепутать эти слова, если помнить главную разницу!';
      case 4:
        return 'Давай немного потренируемся — от самых лёгких заданий к более интересным!';
      case 5:
        return 'Мини-викторина из 10 вопросов! Не бойся ошибаться, я всегда помогу!';
    }
  };

  const handleNextQuizQuestion = (isCorrect: boolean) => {
    const currentQ = lesson.quizQuestions[quizIndex];
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      onRecordResult(lesson.id, true);
    } else {
      const mistake: UserMistakeRecord = {
        id: `mistake-${Date.now()}`,
        topicId: lesson.id,
        questionId: currentQ.id,
        prompt: currentQ.promptRu,
        chosenAnswer: 'Неверный ответ',
        correctAnswer: currentQ.correctAnswer,
        explanation: currentQ.explanation.why,
        timestamp: Date.now(),
      };
      onRecordResult(lesson.id, false, mistake);
    }

    if (quizIndex + 1 < lesson.quizQuestions.length) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      onCompleteLesson(lesson.id);
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#FFD84D', '#FF914D', '#10B981'],
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const handleNextPracticeQuestion = (isCorrect: boolean) => {
    const currentQ = lesson.practiceQuestions[practiceIndex];
    onRecordResult(lesson.id, isCorrect);

    if (practiceIndex + 1 < lesson.practiceQuestions.length) {
      setPracticeIndex((prev) => prev + 1);
    } else {
      setPracticeCompleted(true);
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const restartLesson = () => {
    setStage(1);
    setPracticeIndex(0);
    setPracticeCompleted(false);
    restartQuiz();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-16">
      {/* Top Navigation Bar with Step Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-3xl shadow-md border-2 border-blue-200">
        <button
          type="button"
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs sm:text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Все темы</span>
        </button>

        {/* 5-step Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
          {[
            { num: 1, label: 'Правило' },
            { num: 2, label: 'Примеры' },
            { num: 3, label: 'Разница' },
            { num: 4, label: 'Практика' },
            { num: 5, label: 'Викторина' },
          ].map((st) => {
            const isActive = stage === st.num;
            return (
              <button
                key={st.num}
                type="button"
                onClick={() => setStage(st.num as 1 | 2 | 3 | 4 | 5)}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md scale-105'
                    : 'bg-sky-100 hover:bg-sky-200 text-blue-900'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px]">
                  {st.num}
                </span>
                <span className="hidden sm:inline">{st.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={restartLesson}
          className="p-2 rounded-2xl text-slate-500 hover:bg-slate-100 transition-all"
          title="Начать урок с начала"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Mascot Companion Bar */}
      <div className="mb-6 flex justify-center">
        <Mascot
          mood={stage === 5 && quizFinished ? 'celebrating' : 'happy'}
          speechText={getMascotMessage()}
          size="md"
        />
      </div>

      {/* ============================================================== */}
      {/* ЭТАП 1: ПРОСТОЕ ПРАВИЛО                                         */}
      {/* ============================================================== */}
      {stage === 1 && (
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-xl border-3 border-blue-200 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{lesson.icon}</span>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                Этап 1 из 5 • Простое правило
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {lesson.ruleStage.heroTitle}
              </h2>
            </div>
          </div>

          {/* Simple bullet explanations */}
          <div className="space-y-3 my-6">
            {lesson.ruleStage.simpleRules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sm sm:text-base font-bold text-slate-800"
              >
                <span className="w-6 h-6 rounded-full bg-[#FFD84D] text-amber-950 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p>{rule}</p>
              </div>
            ))}
          </div>

          {/* Conjugation table if available */}
          {lesson.ruleStage.conjugations && (
            <div className="my-6">
              <h4 className="text-sm font-extrabold text-blue-900 uppercase tracking-wider mb-3">
                📋 Как меняется форма слова (Presente):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {lesson.ruleStage.conjugations.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white border-2 border-blue-100 shadow-xs hover:border-[#FF914D] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-16">
                        {row.pronoun}
                      </span>
                      <SpanishPhrase es={row.form} size="sm" showAudioButton={true} />
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                      {row.translation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special expressions if any (e.g. tener hambre, tener 12 años) */}
          {lesson.ruleStage.specialExpressions && (
            <div className="my-6">
              <h4 className="text-sm font-extrabold text-amber-800 uppercase tracking-wider mb-3">
                ⭐ Важные устойчивые выражения:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {lesson.ruleStage.specialExpressions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-amber-50/90 border border-[#FFD84D] shadow-xs flex items-center justify-between gap-2"
                  >
                    <SpanishPhrase es={item.phrase} size="sm" showAudioButton={true} />
                    <span className="text-xs font-bold text-amber-950 text-right">
                      {item.translation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crucial Note (Why note) */}
          {lesson.ruleStage.crucialNote && (
            <div className="my-6 p-4 sm:p-5 rounded-2xl bg-[#FFD84D]/30 border-2 border-[#FFD84D] text-slate-900">
              <div className="flex items-center gap-2 font-black text-amber-950 text-sm sm:text-base mb-1.5">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <span>{lesson.ruleStage.crucialNote.title}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold leading-relaxed text-slate-800">
                {lesson.ruleStage.crucialNote.text}
              </p>
            </div>
          )}

          {/* Next stage button */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setStage(2)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-black text-base shadow-lg transition-all active:scale-95 glow-btn"
            >
              <span>Посмотреть примеры</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ЭТАП 2: ПРИМЕРЫ С ОЗВУЧКОЙ И ПЕРЕВОДОМ ПО КЛИКУ                */}
      {/* ============================================================== */}
      {stage === 2 && (
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-xl border-3 border-blue-200 animate-in fade-in duration-200">
          <div className="mb-6">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Этап 2 из 5 • Примеры
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Нажимай на любое предложение, чтобы увидеть русский перевод! 👆
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
              Также можно нажать на иконку 🔊, чтобы услышать правильное испанское произношение.
            </p>
          </div>

          {/* 3 Simple Examples */}
          <div className="mb-6">
            <h3 className="text-sm font-extrabold text-blue-900 uppercase tracking-wider mb-3">
              1️⃣ Короткие простые примеры:
            </h3>
            <div className="space-y-3">
              {lesson.examplesStage.simple.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-sky-50/80 border-2 border-blue-200 hover:border-[#FF914D] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
                >
                  <SpanishPhrase es={ex.es} ru={ex.ru} size="lg" initiallyRevealed={false} />
                  {ex.note && (
                    <span className="text-xs font-extrabold text-blue-700 bg-white/90 px-2.5 py-1 rounded-xl w-fit">
                      {ex.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3 Extended Examples */}
          <div className="mb-6">
            <h3 className="text-sm font-extrabold text-orange-900 uppercase tracking-wider mb-3">
              2️⃣ Примеры из жизни подлиннее:
            </h3>
            <div className="space-y-3">
              {lesson.examplesStage.extended.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-amber-50/70 border-2 border-[#FFD84D] hover:border-[#FF914D] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
                >
                  <SpanishPhrase es={ex.es} ru={ex.ru} size="md" initiallyRevealed={false} />
                  {ex.note && (
                    <span className="text-xs font-extrabold text-amber-900 bg-white/90 px-2.5 py-1 rounded-xl w-fit">
                      {ex.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setStage(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад к правилу</span>
            </button>
            <button
              type="button"
              onClick={() => setStage(3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-black text-base shadow-lg transition-all active:scale-95 glow-btn"
            >
              <span>Посмотреть на разницу</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ЭТАП 3: ПОСМОТРИ НА РАЗНИЦУ (ДВЕ КАРТОЧКИ БОК О БОК)           */}
      {/* ============================================================== */}
      {stage === 3 && (
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-xl border-3 border-blue-200 animate-in fade-in duration-200">
          <div className="mb-6">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Этап 3 из 5 • Посмотри на разницу
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {lesson.differenceStage.title}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
              {lesson.differenceStage.explanation}
            </p>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {/* Left Card */}
            <div className="p-5 rounded-3xl bg-blue-50/80 border-3 border-blue-300 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-black text-white px-3 py-1 rounded-full bg-[#2563EB] inline-block mb-2">
                  {lesson.differenceStage.left.badge}
                </span>
                <h3 className="text-lg font-black text-slate-900 mb-1">
                  {lesson.differenceStage.left.title}
                </h3>
                <p className="text-xs font-bold text-slate-600 mb-3">
                  {lesson.differenceStage.left.subtitle}
                </p>
                <div className="p-2.5 bg-white/90 rounded-xl border border-blue-200 font-black text-xs text-blue-900 mb-4">
                  Формула: {lesson.differenceStage.left.formula}
                </div>

                <div className="space-y-2.5">
                  {lesson.differenceStage.left.examples.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-xl border border-blue-100">
                      <SpanishPhrase
                        es={item.es}
                        ru={item.ru}
                        size="md"
                        highlightWord={item.highlightWord}
                        highlightColor="blue"
                        initiallyRevealed={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="p-5 rounded-3xl bg-amber-50/80 border-3 border-[#FF914D] flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-black text-white px-3 py-1 rounded-full bg-[#FF914D] inline-block mb-2">
                  {lesson.differenceStage.right.badge}
                </span>
                <h3 className="text-lg font-black text-slate-900 mb-1">
                  {lesson.differenceStage.right.title}
                </h3>
                <p className="text-xs font-bold text-slate-600 mb-3">
                  {lesson.differenceStage.right.subtitle}
                </p>
                <div className="p-2.5 bg-white/90 rounded-xl border border-amber-300 font-black text-xs text-amber-950 mb-4">
                  Формула: {lesson.differenceStage.right.formula}
                </div>

                <div className="space-y-2.5">
                  {lesson.differenceStage.right.examples.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-xl border border-amber-200">
                      <SpanishPhrase
                        es={item.es}
                        ru={item.ru}
                        size="md"
                        highlightWord={item.highlightWord}
                        highlightColor="orange"
                        initiallyRevealed={true}
                      />
                    </div>
                  ))}
                </div>

                {lesson.differenceStage.right.warning && (
                  <p className="mt-4 text-xs font-extrabold text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                    ⚠️ {lesson.differenceStage.right.warning}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setStage(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад к примерам</span>
            </button>
            <button
              type="button"
              onClick={() => setStage(4)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FF914D] hover:bg-orange-600 text-white font-black text-base shadow-lg transition-all active:scale-95"
            >
              <span>Перейти к практике</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ЭТАП 4: ПРАКТИКА (NIVEL 1, 2, 3)                                */}
      {/* ============================================================== */}
      {stage === 4 && (
        <div>
          {!practiceCompleted ? (
            <div>
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-white/80 px-3 py-1 rounded-full shadow-xs">
                  Этап 4 из 5 • Практика (Nivel {lesson.practiceQuestions[practiceIndex].level})
                </span>
                <button
                  type="button"
                  onClick={() => setStage(1)}
                  className="text-xs font-extrabold text-blue-700 hover:underline flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Повторить правило</span>
                </button>
              </div>

              <ExerciseEngine
                exercise={lesson.practiceQuestions[practiceIndex]}
                currentNumber={practiceIndex + 1}
                totalQuestions={lesson.practiceQuestions.length}
                onNext={handleNextPracticeQuestion}
                onRepeatRule={() => setStage(1)}
              />
            </div>
          ) : (
            <div className="bg-white/95 rounded-3xl p-8 shadow-xl border-3 border-emerald-400 text-center animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                ¡Muy bien! Практика завершена!
              </h2>
              <p className="text-slate-600 font-bold mb-6 max-w-md mx-auto">
                Ты отлично закрепил лёгкие и средние примеры. Теперь давай проверим свои силы в мини-викторине из 10 вопросов!
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPracticeIndex(0);
                    setPracticeCompleted(false);
                  }}
                  className="px-5 py-3 rounded-2xl border-2 border-slate-300 font-bold text-slate-700 text-sm hover:bg-slate-50"
                >
                  Пройти практику ещё раз
                </button>
                <button
                  type="button"
                  onClick={() => setStage(5)}
                  className="px-7 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-black text-base shadow-lg transition-all active:scale-95 glow-btn"
                >
                  Перейти к викторине (10 вопросов)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* ЭТАП 5: МИНИ-ВИКТОРИНА (10 ВОПРОСОВ)                            */}
      {/* ============================================================== */}
      {stage === 5 && (
        <div>
          {!quizFinished ? (
            <div>
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-[#FFD84D] px-3.5 py-1 rounded-full shadow-xs">
                  Этап 5 из 5 • Финальная викторина
                </span>
                <button
                  type="button"
                  onClick={() => setStage(1)}
                  className="text-xs font-extrabold text-blue-700 hover:underline flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Повторить правило</span>
                </button>
              </div>

              <ExerciseEngine
                exercise={lesson.quizQuestions[quizIndex]}
                currentNumber={quizIndex + 1}
                totalQuestions={lesson.quizQuestions.length}
                onNext={handleNextQuizQuestion}
                onRepeatRule={() => setStage(1)}
              />
            </div>
          ) : (
            <div className="bg-white/95 rounded-3xl p-8 shadow-xl border-3 border-[#FFD84D] text-center animate-in zoom-in-95">
              <div className="w-24 h-24 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50">
                <Trophy className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                ¡Felicidades! Урок пройден! 🎉
              </h2>
              <p className="text-lg font-bold text-slate-700 mb-2">
                Твой результат в викторине: <span className="font-black text-blue-600 text-xl">{quizScore} из 10</span> правильных ответов!
              </p>
              <p className="text-sm font-semibold text-slate-500 mb-6 max-w-md mx-auto">
                {quizScore >= 8
                  ? 'Великолепно! Ты прекрасно усвоил тему и не путаешь слова!'
                  : 'Хороший результат! Паблито всегда рядом, чтобы помочь потренироваться ещё раз!'}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={restartQuiz}
                  className="px-5 py-3 rounded-2xl border-2 border-slate-300 font-bold text-slate-700 text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Пройти викторину заново</span>
                </button>
                <button
                  type="button"
                  onClick={onBackToMenu}
                  className="px-7 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-black text-base shadow-lg transition-all active:scale-95"
                >
                  Выбрать другую тему
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
