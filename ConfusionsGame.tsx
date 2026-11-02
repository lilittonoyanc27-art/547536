import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trophy,
  ArrowLeft,
  Columns,
} from 'lucide-react';
import { CONFUSION_PAIRS, ConfusionPair } from './confusionsData';
import { SpanishPhrase } from './SpanishPhrase';
import { Mascot } from './mascot';
import confetti from 'canvas-confetti';

interface ConfusionsGameProps {
  onBackToMenu: () => void;
  onRecordResult: (isCorrect: boolean) => void;
}

export const ConfusionsGame: React.FC<ConfusionsGameProps> = ({
  onBackToMenu,
  onRecordResult,
}) => {
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showDifferenceModal, setShowDifferenceModal] = useState(false);

  // Question state
  const [selectedOptionText, setSelectedOptionText] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const currentPair: ConfusionPair = CONFUSION_PAIRS[selectedPairIndex];
  const currentQ = currentPair.questions[questionIndex];

  const handleSelectOption = (opt: { text: string; isCorrect: boolean; explanation: string }) => {
    if (isAnswered) return;
    setSelectedOptionText(opt.text);
    setIsCorrect(opt.isCorrect);
    setIsAnswered(true);

    if (opt.isCorrect) {
      setScore((prev) => prev + 1);
      onRecordResult(true);
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#2563EB', '#FFD84D', '#FF914D'],
        });
      } catch {
        // Safe fallback
      }
    } else {
      onRecordResult(false);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedOptionText(null);

    if (questionIndex + 1 < currentPair.questions.length) {
      setQuestionIndex((prev) => prev + 1);
    } else if (selectedPairIndex + 1 < CONFUSION_PAIRS.length) {
      // Move to next confusion pair!
      setSelectedPairIndex((prev) => prev + 1);
      setQuestionIndex(0);
    } else {
      // Finished all pairs, loop or complete
      setSelectedPairIndex(0);
      setQuestionIndex(0);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-5 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl shadow-md border-2 border-blue-200">
        <button
          type="button"
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>В меню</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Тренировка: {currentPair.title}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowDifferenceModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#FFD84D] hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm shadow-xs transition-all active:scale-95"
        >
          <Columns className="w-4 h-4 text-amber-900" />
          <span>Показать разницу</span>
        </button>
      </div>

      {/* Mascot Message */}
      <div className="mb-6 flex justify-center">
        <Mascot
          mood={isAnswered ? (isCorrect ? 'happy' : 'comforting') : 'thinking'}
          speechText={
            isAnswered
              ? isCorrect
                ? '¡Exacto! Ты прекрасно различаешь эти похожие фразы!'
                : 'Почти получилось! Нажми «Показать разницу», чтобы освежить правило!'
              : 'Выбери правильный вариант для этой конкретной ситуации!'
          }
          size="md"
        />
      </div>

      {/* Selector pills for confusion pairs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
        {CONFUSION_PAIRS.map((pair, idx) => {
          const isSelected = selectedPairIndex === idx;
          return (
            <button
              key={pair.id}
              type="button"
              onClick={() => {
                setSelectedPairIndex(idx);
                setQuestionIndex(0);
                setIsAnswered(false);
                setSelectedOptionText(null);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-blue-200'
              }`}
            >
              {pair.title}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border-3 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-extrabold text-blue-700 bg-sky-50 px-3 py-1 rounded-full">
            Ситуация {questionIndex + 1} из {currentPair.questions.length}
          </span>
          <span className="text-xs font-bold text-slate-500">
            Очки: <strong className="text-blue-700">{score}</strong>
          </span>
        </div>

        {/* Russian prompt */}
        <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-4">
          {currentQ.promptRu}
        </h3>

        {/* Sentence with blank */}
        <div className="p-4 bg-sky-50 rounded-2xl border-2 border-blue-200 font-black text-lg text-slate-800 mb-6 flex items-center gap-2 flex-wrap">
          <span>{currentQ.sentenceWithBlank.split('___')[0]}</span>
          <span className="px-3 py-1 bg-amber-200 text-amber-950 rounded-xl border border-amber-400 font-extrabold text-base">
            {selectedOptionText || '...'}
          </span>
          <span>{currentQ.sentenceWithBlank.split('___')[1]}</span>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOptionText === opt.text;
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
                onClick={() => handleSelectOption(opt)}
                className={`p-4 rounded-2xl font-black text-base sm:text-lg transition-all shadow-xs active:scale-95 flex items-center justify-between ${style}`}
              >
                <span>{opt.text}</span>
                {isAnswered && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !opt.isCorrect && (
                  <AlertCircle className="w-5 h-5 text-[#FF914D] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation after answer */}
        {isAnswered && (
          <div
            className={`p-5 rounded-2xl border-2 mb-4 animate-in fade-in ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-orange-50 border-[#FF914D] text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 font-black text-base">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span>Правильно!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-[#FF914D]" />
                  <span>Разберём разницу:</span>
                </>
              )}
            </div>

            {/* Clickable full Spanish phrase */}
            <div className="p-3 bg-white/90 rounded-xl border border-blue-200 mb-2">
              <SpanishPhrase
                es={currentQ.fullSentenceEs}
                ru={currentQ.fullSentenceRu}
                size="md"
                initiallyRevealed={true}
              />
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
              {currentQ.why}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all active:scale-95"
              >
                <span>Следующая ситуация</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Difference Comparison Modal */}
      {showDifferenceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border-3 border-blue-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-blue-900">
                Разница: {currentPair.title}
              </h3>
              <button
                type="button"
                onClick={() => setShowDifferenceModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-sm font-bold text-slate-600 mb-5">
              {currentPair.description}
            </p>

            {/* Side-by-side cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-300">
                <span className="text-xs font-black text-white bg-blue-600 px-2.5 py-0.5 rounded-full mb-2 inline-block">
                  {currentPair.cardA.badge}
                </span>
                <h4 className="font-black text-blue-950 text-base mb-1">
                  {currentPair.cardA.title}
                </h4>
                <p className="text-xs font-bold text-slate-600 mb-3">
                  {currentPair.cardA.explanation}
                </p>
                <div className="p-2 bg-white rounded-xl border border-blue-200 text-xs font-black text-blue-800 mb-2">
                  {currentPair.cardA.formula}
                </div>
                <SpanishPhrase
                  es={currentPair.cardA.exampleEs}
                  ru={currentPair.cardA.exampleRu}
                  size="sm"
                  initiallyRevealed={true}
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-orange-300">
                <span className="text-xs font-black text-white bg-[#FF914D] px-2.5 py-0.5 rounded-full mb-2 inline-block">
                  {currentPair.cardB.badge}
                </span>
                <h4 className="font-black text-orange-950 text-base mb-1">
                  {currentPair.cardB.title}
                </h4>
                <p className="text-xs font-bold text-slate-600 mb-3">
                  {currentPair.cardB.explanation}
                </p>
                <div className="p-2 bg-white rounded-xl border border-amber-300 text-xs font-black text-amber-950 mb-2">
                  {currentPair.cardB.formula}
                </div>
                <SpanishPhrase
                  es={currentPair.cardB.exampleEs}
                  ru={currentPair.cardB.exampleRu}
                  size="sm"
                  initiallyRevealed={true}
                />
              </div>

              {currentPair.cardC && (
                <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-300 sm:col-span-2">
                  <span className="text-xs font-black text-white bg-teal-600 px-2.5 py-0.5 rounded-full mb-2 inline-block">
                    {currentPair.cardC.badge}
                  </span>
                  <h4 className="font-black text-teal-950 text-base mb-1">
                    {currentPair.cardC.title}
                  </h4>
                  <p className="text-xs font-bold text-slate-600 mb-3">
                    {currentPair.cardC.explanation}
                  </p>
                  <div className="p-2 bg-white rounded-xl border border-teal-200 text-xs font-black text-teal-800 mb-2">
                    {currentPair.cardC.formula}
                  </div>
                  <SpanishPhrase
                    es={currentPair.cardC.exampleEs}
                    ru={currentPair.cardC.exampleRu}
                    size="sm"
                    initiallyRevealed={true}
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDifferenceModal(false)}
                className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-white font-black text-sm shadow-md"
              >
                Понятно, продолжить!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
