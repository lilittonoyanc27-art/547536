import React from 'react';

export type MascotMood = 'happy' | 'thinking' | 'celebrating' | 'comforting' | 'curious' | 'waving';

interface MascotProps {
  mood?: MascotMood;
  speechText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'happy',
  speechText,
  size = 'md',
  className = '',
}) => {
  // SVG Illustrations for cute puppy "Паблито" with sombrero
  const renderMascotFace = () => {
    return (
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-md select-none transition-transform hover:scale-105 duration-200"
      >
        {/* Sombrero / Hat */}
        <ellipse cx="60" cy="42" rx="48" ry="12" fill="#FFD84D" stroke="#D97706" strokeWidth="2.5" />
        <path
          d="M38 42 C40 20, 80 20, 82 42 Z"
          fill="#FF914D"
          stroke="#D97706"
          strokeWidth="2.5"
        />
        <path
          d="M40 38 Q60 34 80 38"
          stroke="#EF4444"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Ears */}
        <ellipse
          cx="24"
          cy="66"
          rx="12"
          ry="20"
          transform="rotate(-15 24 66)"
          fill="#D97706"
        />
        <ellipse
          cx="96"
          cy="66"
          rx="12"
          ry="20"
          transform="rotate(15 96 66)"
          fill="#D97706"
        />

        {/* Head */}
        <circle cx="60" cy="72" r="34" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
        
        {/* Cheeks */}
        <circle cx="38" cy="80" r="6" fill="#F87171" opacity="0.6" />
        <circle cx="82" cy="80" r="6" fill="#F87171" opacity="0.6" />

        {/* Eyes based on mood */}
        {mood === 'celebrating' || mood === 'happy' ? (
          <>
            {/* Happy curved eyes */}
            <path
              d="M42 68 Q48 60 54 68"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M66 68 Q72 60 78 68"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Star sparkles */}
            {mood === 'celebrating' && (
              <>
                <polygon points="26,30 28,34 33,35 29,38 30,43 26,40 22,43 23,38 19,35 24,34" fill="#F59E0B" />
                <polygon points="94,30 96,34 101,35 97,38 98,43 94,40 90,43 91,38 87,35 92,34" fill="#F59E0B" />
              </>
            )}
          </>
        ) : mood === 'thinking' ? (
          <>
            {/* Thinking look up */}
            <circle cx="48" cy="66" r="4.5" fill="#1E293B" />
            <circle cx="50" cy="64" r="1.5" fill="#FFFFFF" />
            <circle cx="72" cy="66" r="4.5" fill="#1E293B" />
            <circle cx="74" cy="64" r="1.5" fill="#FFFFFF" />
            <path d="M42 60 L54 62" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M66 62 L78 58" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : mood === 'comforting' ? (
          <>
            {/* Gentle reassuring eyes */}
            <circle cx="48" cy="69" r="4" fill="#1E293B" />
            <circle cx="50" cy="68" r="1.5" fill="#FFFFFF" />
            <circle cx="72" cy="69" r="4" fill="#1E293B" />
            <circle cx="74" cy="68" r="1.5" fill="#FFFFFF" />
            <path d="M43 62 Q48 65 53 64" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M67 64 Q72 65 77 62" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            {/* Normal round friendly eyes */}
            <circle cx="48" cy="68" r="4.5" fill="#1E293B" />
            <circle cx="50" cy="66" r="1.8" fill="#FFFFFF" />
            <circle cx="72" cy="68" r="4.5" fill="#1E293B" />
            <circle cx="74" cy="66" r="1.8" fill="#FFFFFF" />
          </>
        )}

        {/* Snout and Nose */}
        <ellipse cx="60" cy="79" rx="14" ry="10" fill="#FEF3C7" />
        <ellipse cx="60" cy="75" rx="5" ry="3.5" fill="#3B2508" />

        {/* Mouth */}
        {mood === 'celebrating' || mood === 'happy' ? (
          <>
            <path
              d="M52 82 Q60 92 68 82"
              stroke="#3B2508"
              strokeWidth="2.5"
              fill="#EF4444"
              strokeLinecap="round"
            />
            {/* Little tongue */}
            <path d="M57 85 Q60 90 63 85 Z" fill="#F87171" />
          </>
        ) : mood === 'thinking' ? (
          <path
            d="M55 83 Q60 81 65 83"
            stroke="#3B2508"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : mood === 'comforting' ? (
          <path
            d="M54 82 Q60 87 66 82"
            stroke="#3B2508"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d="M53 82 Q60 88 67 82"
            stroke="#3B2508"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    );
  };

  const dimensionClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16 sm:w-20 sm:h-20',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`shrink-0 ${dimensionClasses} animate-soft-bounce`}>
        {renderMascotFace()}
      </div>

      {speechText && (
        <div className="relative bg-white/95 border-2 border-blue-400 rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-slate-800 shadow-md max-w-sm sm:max-w-md animate-in fade-in slide-in-from-left-2 duration-200">
          {/* Speech bubble tail */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-blue-400" />
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-7 border-t-transparent border-b-7 border-b-transparent border-r-7 border-r-white" />
          <p className="font-bold leading-relaxed">{speechText}</p>
        </div>
      )}
    </div>
  );
};
