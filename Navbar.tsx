import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Languages,
  BrainCircuit,
  UserCheck,
  Star,
  RotateCcw,
} from 'lucide-react';
import { UserProgress } from './types';

export type ActiveTab = 'lessons' | 'confusions' | 'translation' | 'mistakes' | 'teacher';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  progress: UserProgress;
  onResetProgress: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  progress,
  onResetProgress,
}) => {
  const mistakesCount = progress.mistakes.length;

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 py-3 bg-[#87CEFA]/90 backdrop-blur-md border-b-2 border-blue-300 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div
            onClick={() => onSelectTab('lessons')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FFD84D] border-2 border-amber-500 text-amber-950 flex items-center justify-center font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
              🇪🇸
            </div>
            <div>
              <h1 className="font-heading font-black text-lg sm:text-xl text-blue-900 leading-tight">
                Испанский язык
              </h1>
              <p className="text-xs font-bold text-blue-700 tracking-wide">
                Español Fácil • Начальный уровень A1
              </p>
            </div>
          </div>

          {/* Star Counter on Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD84D] text-amber-950 font-black text-xs shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
              <span>{progress.stars}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 justify-start md:justify-center">
          <button
            type="button"
            onClick={() => onSelectTab('lessons')}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'lessons'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-blue-900 border border-blue-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Уроки</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('confusions')}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'confusions'
                ? 'bg-[#FF914D] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-slate-800 border border-blue-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Не путай слова</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('translation')}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'translation'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-blue-900 border border-blue-200'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>Русский → Испанский</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('mistakes')}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shrink-0 relative ${
              activeTab === 'mistakes'
                ? 'bg-[#FFD84D] text-amber-950 shadow-md'
                : 'bg-white/80 hover:bg-white text-slate-800 border border-blue-200'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Сложные слова</span>
            {mistakesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FF914D] text-white text-[10px] font-black flex items-center justify-center -ml-0.5">
                {mistakesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('teacher')}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'teacher'
                ? 'bg-blue-800 text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-blue-900 border border-blue-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Учитель</span>
          </button>
        </nav>

        {/* Stars Counter & Stats on Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/90 border border-amber-300 shadow-xs">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-sm font-black text-amber-950">
              {progress.stars} звёзд
            </span>
          </div>

          <button
            type="button"
            onClick={onResetProgress}
            className="p-2 rounded-xl text-blue-800/60 hover:text-rose-600 hover:bg-white/80 transition-all text-xs"
            title="Сбросить прогресс"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
