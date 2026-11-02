import React, { useState } from 'react';
import { Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import { speakSpanish } from './speech';

interface SpanishPhraseProps {
  es: string;
  ru?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showAudioButton?: boolean;
  highlightWord?: string;
  highlightColor?: 'yellow' | 'orange' | 'blue' | 'green';
  initiallyRevealed?: boolean;
  className?: string;
  badgeText?: string;
}

export const SpanishPhrase: React.FC<SpanishPhraseProps> = ({
  es,
  ru,
  size = 'md',
  showAudioButton = true,
  highlightWord,
  highlightColor = 'orange',
  initiallyRevealed = false,
  className = '',
  badgeText,
}) => {
  const [isRevealed, setIsRevealed] = useState(initiallyRevealed);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    speakSpanish(es, () => setIsPlaying(false));
  };

  const toggleTranslation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ru) {
      setIsRevealed((prev) => !prev);
    }
  };

  // Render text with highlight if specified
  const renderHighlightedEs = () => {
    if (!highlightWord) return es;

    const regex = new RegExp(`(${highlightWord})`, 'gi');
    const parts = es.split(regex);

    const highlightClasses = {
      yellow: 'bg-amber-300 text-slate-900 px-1.5 py-0.5 rounded-lg font-extrabold shadow-xs',
      orange: 'bg-orange-400 text-white px-1.5 py-0.5 rounded-lg font-extrabold shadow-xs',
      blue: 'bg-blue-600 text-white px-1.5 py-0.5 rounded-lg font-extrabold shadow-xs',
      green: 'bg-emerald-500 text-white px-1.5 py-0.5 rounded-lg font-extrabold shadow-xs',
    }[highlightColor];

    return parts.map((part, index) =>
      part.toLowerCase() === highlightWord.toLowerCase() ? (
        <span key={index} className={highlightClasses}>
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const sizeClasses = {
    sm: 'text-sm sm:text-base font-semibold',
    md: 'text-base sm:text-lg font-bold',
    lg: 'text-lg sm:text-xl font-extrabold',
    xl: 'text-xl sm:text-2xl font-black',
  }[size];

  return (
    <div
      onClick={toggleTranslation}
      role={ru ? 'button' : undefined}
      tabIndex={ru ? 0 : undefined}
      onKeyDown={(e) => {
        if (ru && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          toggleTranslation(e as unknown as React.MouseEvent);
        }
      }}
      className={`group relative inline-flex flex-col gap-1 transition-all text-left ${
        ru ? 'cursor-pointer select-none' : ''
      } ${className}`}
    >
      <div className="inline-flex items-center flex-wrap gap-2">
        {badgeText && (
          <span className="text-xs uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            {badgeText}
          </span>
        )}

        <span
          className={`text-slate-900 group-hover:text-blue-700 transition-colors ${sizeClasses} underline decoration-dashed decoration-blue-300 group-hover:decoration-blue-600 underline-offset-4`}
          title={ru ? 'Нажми, чтобы увидеть русский перевод' : undefined}
        >
          {renderHighlightedEs()}
        </span>

        {showAudioButton && (
          <button
            type="button"
            onClick={handleAudio}
            className={`p-1.5 rounded-full transition-all shrink-0 ${
              isPlaying
                ? 'bg-amber-400 text-slate-900 scale-110 shadow-md ring-2 ring-amber-300'
                : 'bg-white/80 hover:bg-amber-300 text-blue-700 hover:text-slate-900 shadow-xs'
            }`}
            title="Прослушать фразу"
            aria-label="Прослушать фразу на испанском"
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse text-blue-900" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        )}

        {ru && (
          <span
            className="text-[11px] font-bold text-blue-600/70 group-hover:text-blue-800 bg-white/60 px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0"
            title="Нажми, чтобы скрыть или показать перевод"
          >
            {isRevealed ? (
              <>
                <EyeOff className="w-3 h-3 inline text-slate-500" />
                <span className="hidden sm:inline">скрыть</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 inline text-blue-600" />
                <span>перевод 👆</span>
              </>
            )}
          </span>
        )}
      </div>

      {ru && isRevealed && (
        <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-amber-50/90 border border-amber-300/80 px-2.5 py-1 rounded-lg w-fit shadow-xs animate-in fade-in zoom-in-95 duration-150">
          <span className="text-amber-600 font-bold">🇷🇺</span>
          <span>«{ru}»</span>
        </div>
      )}
    </div>
  );
};
