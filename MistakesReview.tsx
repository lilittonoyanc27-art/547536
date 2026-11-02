import React, { useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Trash2,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { UserMistakeRecord, TopicId } from './types';
import { LESSONS } from './lessonData';
import { SpanishPhrase } from './SpanishPhrase';
import { Mascot } from './mascot';

interface MistakesReviewProps {
  mistakes: UserMistakeRecord[];
  onSelectTopic: (topicId: TopicId) => void;
  onClearMistakes: () => void;
  onBackToMenu: () => void;
}

export const MistakesReview: React.FC<MistakesReviewProps> = ({
  mistakes,
  onSelectTopic,
  onClearMistakes,
  onBackToMenu,
}) => {
  // Aggregate mistakes by topic
  const topicCounts: Partial<Record<TopicId, number>> = {};
  mistakes.forEach((m) => {
    topicCounts[m.topicId] = (topicCounts[m.topicId] || 0) + 1;
  });

  // Find most troubled topic
  let mostTroubledTopicId: TopicId | null = null;
  let maxMistakes = 0;
  (Object.keys(topicCounts) as TopicId[]).forEach((tid) => {
    if ((topicCounts[tid] || 0) > maxMistakes) {
      maxMistakes = topicCounts[tid] || 0;
      mostTroubledTopicId = tid;
    }
  });

  const troubledLesson = LESSONS.find((l) => l.id === mostTroubledTopicId);

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-5 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl shadow-md border-2 border-blue-200">
        <button
          type="button"
          onClick={onBackToMenu}
          className="px-3.5 py-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs sm:text-sm"
        >
          ← В главное меню
        </button>

        <h2 className="text-base sm:text-lg font-black text-slate-900">
          💡 Мои сложные слова
        </h2>

        {mistakes.length > 0 && (
          <button
            type="button"
            onClick={onClearMistakes}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all text-xs flex items-center gap-1 font-bold"
            title="Очистить историю ошибок"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Очистить</span>
          </button>
        )}
      </div>

      {/* Mascot Guidance */}
      <div className="mb-6 flex justify-center">
        <Mascot
          mood={mistakes.length > 0 ? 'comforting' : 'celebrating'}
          speechText={
            mistakes.length > 0
              ? 'Ошибки — это наши лучшие друзья и ступеньки к успеху! Давай разберём их спокойно.'
              : 'Ура! Список сложных слов чист! Ты не сделал ни одной неразобранной ошибки!'
          }
          size="md"
        />
      </div>

      {/* Targeted Repetition Banner if user has repeated mistakes in a topic */}
      {troubledLesson && maxMistakes >= 2 && (
        <div className="mb-6 p-5 sm:p-6 bg-[#FFD84D]/40 border-3 border-[#FFD84D] rounded-3xl shadow-md animate-in fade-in">
          <div className="flex items-center gap-2 text-amber-900 font-black text-sm uppercase tracking-wider mb-2">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <span>Паблито заметил сложную тему!</span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
            «Давай ещё немного потренируем {troubledLesson.title}»
          </h3>

          <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed mb-4">
            В этой теме встретилось {maxMistakes} неточности. Вот короткое напоминание:
            <br />
            <strong className="text-blue-900 bg-white/90 px-2 py-0.5 rounded-md inline-block mt-1">
              {troubledLesson.ruleStage.simpleRules[0]}
            </strong>
          </p>

          <button
            type="button"
            onClick={() => onSelectTopic(troubledLesson.id)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all active:scale-95 glow-btn"
          >
            <span>Потренировать тему {troubledLesson.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* List of mistakes */}
      {mistakes.length === 0 ? (
        <div className="bg-white/95 rounded-3xl p-8 shadow-xl border-3 border-blue-200 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">
            Здесь пока нет сложных слов!
          </h3>
          <p className="text-sm font-bold text-slate-500 max-w-sm mx-auto mb-5">
            Проходи уроки и викторины. Если встретится трудный вопрос, он появится здесь для повторения.
          </p>
          <button
            type="button"
            onClick={onBackToMenu}
            className="px-6 py-3 rounded-2xl bg-[#2563EB] text-white font-black text-sm shadow-md"
          >
            К списку уроков
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-black uppercase tracking-wider text-slate-600 px-2">
            История вопросов для повторения ({mistakes.length}):
          </p>

          {mistakes.map((record) => {
            const lesson = LESSONS.find((l) => l.id === record.topicId);
            return (
              <div
                key={record.id}
                className="bg-white/95 rounded-3xl p-5 shadow-md border-2 border-orange-200 hover:border-orange-400 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {lesson?.title || 'Тема'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {new Date(record.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <h4 className="text-base font-black text-slate-900 mb-2">
                  {record.prompt}
                </h4>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 mb-3">
                  <span className="text-xs font-bold text-emerald-800 block mb-1">
                    Правильный ответ (нажми для перевода):
                  </span>
                  <SpanishPhrase
                    es={record.correctAnswer}
                    size="md"
                    initiallyRevealed={true}
                  />
                </div>

                <p className="text-xs font-bold text-slate-600 leading-relaxed mb-3">
                  💡 <span className="text-slate-800">Объяснение:</span>{' '}
                  {record.explanation}
                </p>

                {lesson && (
                  <button
                    type="button"
                    onClick={() => onSelectTopic(lesson.id)}
                    className="text-xs font-black text-blue-700 hover:text-blue-900 flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Повторить эту тему целиком →</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
