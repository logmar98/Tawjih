import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Key,
  RotateCcw,
  MessageSquareCode,
  School,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { StudentProfile } from '../types/student';

interface NavigationProps {
  currentView: 'teacher' | 'student';
  onViewChange: (view: 'teacher' | 'student') => void;
  students: StudentProfile[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  onResetData: () => void;
  onOpenApiKeyModal: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  hasApiKey: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  students,
  selectedStudentId,
  onSelectStudent,
  onResetData,
  onOpenApiKeyModal,
  onToggleChat,
  isChatOpen,
  hasApiKey,
}) => {
  const currentStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Moroccan Branding */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <span className="text-xl">🧭</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                  Tawjih<span className="text-emerald-400">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-morocco-red/20 text-red-300 border border-morocco-red/40">
                  <span>🇲🇦</span> Maroc
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                The GPS for Education • Le GPS de l'Orientation Scolaire (7th ➔ 2Bac)
              </p>
            </div>
          </div>

          {/* Center: Main View Switcher (Teacher vs Student) */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => onViewChange('teacher')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentView === 'teacher'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>👨‍🏫</span>
              <span className="hidden sm:inline">Teacher Dashboard</span>
              <span className="sm:hidden">Teacher</span>
              <span className="text-[10px] opacity-75 font-normal hidden lg:inline">(Grade Input)</span>
            </button>

            <button
              onClick={() => onViewChange('student')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentView === 'student'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>🎓</span>
              <span className="hidden sm:inline">Student Platform</span>
              <span className="sm:hidden">Student</span>
              <span className="text-[10px] opacity-75 font-normal hidden lg:inline">(6-Year Passport & AI)</span>
            </button>
          </div>

          {/* Right: Demo Student Selector & Controls */}
          <div className="flex items-center gap-2">
            {/* Student Selector Dropdown */}
            <div className="relative">
              <label htmlFor="student-selector" className="sr-only">Demo Student</label>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
                <span className="text-slate-400 font-medium hidden xl:inline">Demo Student:</span>
                <select
                  id="student-selector"
                  value={selectedStudentId}
                  onChange={(e) => onSelectStudent(e.target.value)}
                  className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[190px] truncate"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id} className="bg-slate-900 text-slate-100">
                      {st.name} ({st.currentLevel})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AI Key Status Button */}
            <button
              onClick={onOpenApiKeyModal}
              title={hasApiKey ? 'Live Gemini Key Configured' : 'Offline Deterministic Fallback Active'}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors relative"
            >
              <Key className="w-4 h-4" />
              <span
                className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
                  hasApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
            </button>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              title="Reset Demo Data to Initial State"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-900/50 hover:text-red-400 text-slate-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* AI Chat Drawer Toggle Button */}
            <button
              onClick={onToggleChat}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isChatOpen
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-slate-800 hover:border-emerald-500/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">AI Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subheader banner for active student context */}
      <div className="bg-slate-900/60 border-t border-slate-800/60 px-4 py-1.5 text-xs text-slate-400 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-200">{currentStudent?.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-medium">{currentStudent?.levelLabel}</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">{currentStudent?.school} ({currentStudent?.city})</span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-slate-300 font-mono">
              Massar: {currentStudent?.massarCode}
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <Cpu className="w-3 h-3 text-indigo-400" />
              <span>{hasApiKey ? 'Gemini 1.5 Cloud' : 'Deterministic Fallback Active'}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
