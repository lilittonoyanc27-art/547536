import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Trophy,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Volume2,
  Star,
  Layers,
  Heart,
  RotateCcw,
} from 'lucide-react';
import { TopicId, UserProgress, UserMistakeRecord, LessonData } from './types';
import { LESSONS } from './lessonData';
import { Navbar, ActiveTab } from './Navbar';
import { LessonView } from './LessonView';
import { ConfusionsGame } from './ConfusionsGame';
import { TranslationGame } from './TranslationGame';
import { MistakesReview } from './MistakesReview';
import { TeacherMode } from './TeacherMode';
import { Mascot } from './mascot';
import { SpanishPhrase } from './SpanishPhrase';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'espanol_facil_progress_v1';

const MOTIVATION_MESSAGES = [
  '¡Muy bien! Ты отлично справляешься! 🌟',
  '¡Excelente! Ещё немного практики и ты настоящий полиглот! 🚀',
  '¡Buen trabajo! Ты уже намного лучше различаешь эти похожие слова! 👏',
  '¡Estupendo! Испанский язык становится всё понятнее и ближе! 💖',
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('lessons');
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId | null>(null);

  // User Progress with local storage
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse progress from localStorage', e);
    }
    return {
      completedLessons: [],
      stars: 0,
      totalAnswered: 0,
      totalCorrect: 0,
      topicMastery: {
        tener: { attempted: 0, correct: 0 },
        tener_que: { attempted: 0, correct: 0 },
        hay_tener: { attempted: 0, correct: 0 },
        muy_mucho: { attempted: 0, correct: 0 },
        bien_bueno: { attempted: 0, correct: 0 },
        poco: { attempted: 0, correct: 0 },
        estar_gerundio: { attempted: 0, correct: 0 },
        seguir_gerundio: { attempted: 0, correct: 0 },
      },
      mistakes: [],
    };
  });

  // Motivational toast every 5 correct answers
  const [motivationToast, setMotivationToast] = useState<string | null>(null);

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  // Record an answer result
  const recordResult = (
    topicId?: TopicId,
    isCorrect: boolean = true,
    mistake?: UserMistakeRecord
  ) => {
    setProgress((prev) => {
      const nextTotalAnswered = prev.totalAnswered + 1;
      const nextTotalCorrect = isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect;
      const nextStars = isCorrect ? prev.stars + 1 : prev.stars;

      const nextTopicMastery = { ...prev.topicMastery };
      if (topicId) {
        const current = nextTopicMastery[topicId] || { attempted: 0, correct: 0 };
        nextTopicMastery[topicId] = {
          attempted: current.attempted + 1,
          correct: isCorrect ? current.correct + 1 : current.correct,
        };
      }

      // If mistake, add to list (avoid duplicates for same question)
      let nextMistakes = [...prev.mistakes];
      if (!isCorrect && mistake) {
        nextMistakes = [
          mistake,
          ...nextMistakes.filter((m) => m.questionId !== mistake.questionId),
        ].slice(0, 30);
      } else if (isCorrect && mistake) {
        // If question answered correctly later, remove from mistakes
        nextMistakes = nextMistakes.filter((m) => m.questionId !== mistake.questionId);
      }

      // Check motivation milestone (every 5 correct answers)
      if (isCorrect && nextTotalCorrect > 0 && nextTotalCorrect % 5 === 0) {
        const msg =
          MOTIVATION_MESSAGES[
            (nextTotalCorrect / 5 - 1) % MOTIVATION_MESSAGES.length
          ];
        setMotivationToast(msg);
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.3 },
            colors: ['#FFD84D', '#FF914D', '#2563EB'],
          });
        } catch {
          // Ignore
        }
        setTimeout(() => setMotivationToast(null), 5000);
      }

      return {
        ...prev,
        totalAnswered: nextTotalAnswered,
        totalCorrect: nextTotalCorrect,
        stars: nextStars,
        topicMastery: nextTopicMastery,
        mistakes: nextMistakes,
      };
    });
  };

  const handleCompleteLesson = (topicId: TopicId) => {
    setProgress((prev) => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(topicId)
        ? prev.completedLessons
        : [...prev.completedLessons, topicId],
      stars: prev.stars + 5, // Bonus stars for completing entire lesson!
    }));
  };

  const handleResetProgress = () => {
    if (confirm('Ты действительно хочешь сбросить весь прогресс и начать сначала?')) {
      setProgress({
        completedLessons: [],
        stars: 0,
        totalAnswered: 0,
        totalCorrect: 0,
        topicMastery: {
          tener: { attempted: 0, correct: 0 },
          tener_que: { attempted: 0, correct: 0 },
          hay_tener: { attempted: 0, correct: 0 },
          muy_mucho: { attempted: 0, correct: 0 },
          bien_bueno: { attempted: 0, correct: 0 },
          poco: { attempted: 0, correct: 0 },
          estar_gerundio: { attempted: 0, correct: 0 },
          seguir_gerundio: { attempted: 0, correct: 0 },
        },
        mistakes: [],
      });
      setSelectedTopicId(null);
    }
  };

  const handleClearMistakes = () => {
    setProgress((p) => ({ ...p, mistakes: [] }));
  };

  // Currently active lesson
  const selectedLesson = LESSONS.find((l) => l.id === selectedTopicId);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      {/* Navbar with tabs and stars */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedTopicId(null);
        }}
        progress={progress}
        onResetProgress={handleResetProgress}
      />

      {/* Motivational Celebration Toast every 5 correct answers */}
      {motivationToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 px-6 py-3.5 bg-[#FFD84D] text-amber-950 font-black rounded-3xl shadow-2xl border-3 border-amber-500 text-sm sm:text-base">
            <span className="text-2xl animate-bounce">🎉</span>
            <span>{motivationToast}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-6">
        {/* ============================================================== */}
        {/* VIEW 1: LESSON VIEW (when a lesson is opened)                  */}
        {/* ============================================================== */}
        {activeTab === 'lessons' && selectedLesson && (
          <LessonView
            lesson={selectedLesson}
            onBackToMenu={() => setSelectedTopicId(null)}
            onRecordResult={(tid, correct, mistake) =>
              recordResult(tid, correct, mistake)
            }
            onCompleteLesson={handleCompleteLesson}
          />
        )}

        {/* ============================================================== */}
        {/* VIEW 2: LESSONS CATALOG (8 topics list)                        */}
        {/* ============================================================== */}
        {activeTab === 'lessons' && !selectedLesson && (
          <div>
            {/* Friendly Hero Banner */}
            <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-blue-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block mb-2">
                  Испанский для начинающих A1
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-2">
                  Учи испанский легко! 🇪🇸
                </h2>
                <p className="text-sm sm:text-base font-bold text-slate-600 leading-relaxed">
                  Нажимай на любое испанское предложение, чтобы увидеть русский перевод. Никакой сложной терминологии — только простые жизненные правила, наглядные сравнения и добрый друг Паблито!
                </p>
              </div>

              <div className="shrink-0">
                <Mascot
                  mood="happy"
                  speechText="Выбирай любую тему и начни с простого правила!"
                  size="lg"
                />
              </div>
            </div>

            {/* Lessons Grid: 8 topics */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-heading text-lg sm:text-xl font-black text-blue-900">
                  📚 8 основных тем курса:
                </h3>
                <span className="text-xs font-bold text-blue-800 bg-white/80 px-3 py-1 rounded-full shadow-xs">
                  Пройдено: {progress.completedLessons.length} из {LESSONS.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LESSONS.map((lesson, idx) => {
                  const isDone = progress.completedLessons.includes(lesson.id);
                  const mastery = progress.topicMastery[lesson.id] || {
                    attempted: 0,
                    correct: 0,
                  };

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => setSelectedTopicId(lesson.id)}
                      className="group bg-white/95 rounded-3xl p-5 sm:p-6 shadow-md border-3 border-blue-200 hover:border-[#FF914D] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                            Тема {idx + 1}
                          </span>

                          {isDone ? (
                            <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Изучено!</span>
                            </span>
                          ) : mastery.attempted > 0 ? (
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                              В процессе
                            </span>
                          ) : null}
                        </div>

                        {/* Title & icon */}
                        <div className="flex items-start gap-3 mb-2">
                          <span className="text-3xl p-2 rounded-2xl bg-sky-50 border border-blue-200">
                            {lesson.icon}
                          </span>
                          <div>
                            <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                              {lesson.title}
                            </h4>
                            <p className="text-xs font-bold text-blue-600">
                              {lesson.spanishTitle}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-4 line-clamp-2">
                          {lesson.shortDesc}
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">
                          5 этапов: правило, примеры, сравнение, практика, тест
                        </span>
                        <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-[#FF914D] group-hover:text-white text-blue-700 flex items-center justify-center transition-all shrink-0">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: GAME «НЕ ПУТАЙ СЛОВА»                                  */}
        {/* ============================================================== */}
        {activeTab === 'confusions' && (
          <ConfusionsGame
            onBackToMenu={() => setActiveTab('lessons')}
            onRecordResult={(correct) => recordResult(undefined, correct)}
          />
        )}

        {/* ============================================================== */}
        {/* VIEW 4: GAME «РУССКИЙ → ИСПАНСКИЙ»                             */}
        {/* ============================================================== */}
        {activeTab === 'translation' && (
          <TranslationGame
            onBackToMenu={() => setActiveTab('lessons')}
            onRecordResult={(correct) => recordResult(undefined, correct)}
          />
        )}

        {/* ============================================================== */}
        {/* VIEW 5: «МОИ СЛОЖНЫЕ СЛОВА» (Mistakes & Repetition)            */}
        {/* ============================================================== */}
        {activeTab === 'mistakes' && (
          <MistakesReview
            mistakes={progress.mistakes}
            onSelectTopic={(tid) => {
              setSelectedTopicId(tid);
              setActiveTab('lessons');
            }}
            onClearMistakes={handleClearMistakes}
            onBackToMenu={() => setActiveTab('lessons')}
          />
        )}

        {/* ============================================================== */}
        {/* VIEW 6: «РЕЖИМ УЧИТЕЛЯ»                                        */}
        {/* ============================================================== */}
        {activeTab === 'teacher' && (
          <TeacherMode
            mistakes={progress.mistakes}
            onBackToMenu={() => setActiveTab('lessons')}
            onRecordResult={(correct) => recordResult(undefined, correct)}
          />
        )}
      </main>

      {/* Footer with friendly note */}
      <footer className="mt-auto py-4 px-4 text-center text-xs font-bold text-blue-900/80 bg-white/30 backdrop-blur-xs border-t border-blue-200">
        <p>
          «Испанский язык — Español Fácil» • Дружелюбный интерактивный тренажёр для начинающих (A1)
        </p>
      </footer>
    </div>
  );
}
