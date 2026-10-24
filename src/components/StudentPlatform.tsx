import React, { useState } from 'react';
import {
  LogOut,
  Compass,
  Target,
  Sparkles,
  Award,
  Layers,
  GraduationCap,
  MapPin,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  BarChart3,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Send,
  Bot,
  User,
  Zap,
  Check,
} from 'lucide-react';
import {
  StudentProfile,
  SubjectGrades,
  CareerGoal,
  GradeLevel,
} from '../types/student';
import { LongitudinalChart } from './LongitudinalChart';
import { SubjectClusterChart } from './SubjectClusterChart';
import { DiscoveryMode } from './DiscoveryMode';
import { TargetLockMode } from './TargetLockMode';
import { calculateWeightedGPA, evaluateTargetLock } from '../services/orientationEngine';
import { askTawjihAI } from '../services/aiService';
import { MarkdownContent } from './MarkdownContent';

interface StudentPlatformProps {
  student: StudentProfile;
  onUpdateCareerGoal: (career: CareerGoal) => void;
  onUpdateMode: (mode: 'discovery' | 'target_lock') => void;
  onLogout: () => void;
  apiKey: string;
  onOpenApiKeyModal: () => void;
}

export const StudentPlatform: React.FC<StudentPlatformProps> = ({
  student,
  onUpdateCareerGoal,
  onUpdateMode,
  onLogout,
  apiKey,
  onOpenApiKeyModal,
}) => {
  // Navigation tabs in Left Sidebar
  const [activeTab, setActiveTab] = useState<'passport' | 'discovery' | 'target' | 'chat'>('passport');

  // Embedded AI chat state for Card 4 in Bento Grid
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: 'user' | 'assistant'; content: string; time: string }[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `👋 Salam ${student.name} ! Je suis **Al-Mouwajih AI**. J'analyse vos notes actuelles en direct (Math: ${student.currentGrades.math}/20, PC: ${student.currentGrades.physics}/20, SVT: ${student.currentGrades.svt}/20). Posez-moi vos questions d'orientation !`,
      time: 'À l’instant',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const isHighSchool =
    student.currentLevel === 'TC' ||
    student.currentLevel === '1Bac' ||
    student.currentLevel === '2Bac';
  const currentGPA = calculateWeightedGPA(student.currentGrades, isHighSchool);
  const stemIndex = ((student.currentGrades.math + student.currentGrades.physics) / 2).toFixed(1);

  // Evaluate target lock thresholds and alerts
  const targetEval = evaluateTargetLock(student, student.currentGrades);
  const { readinessPercentage, primaryAlert, thresholdMath } = targetEval;

  // 6-Year Timeline steps
  const secondaryCycle: { level: GradeLevel; short: string; label: string; yearNum: string }[] = [
    { level: '1AC', short: '1AC', label: '1ère Collège', yearNum: '7th' },
    { level: '2AC', short: '2AC', label: '2ème Collège', yearNum: '8th' },
    { level: '3AC', short: '3AC', label: '3ème Collège', yearNum: '9th' },
    { level: 'TC', short: 'TC', label: 'Tronc Commun', yearNum: '10th' },
    { level: '1Bac', short: '1Bac', label: '1ère Bac', yearNum: '11th' },
    { level: '2Bac', short: '2Bac', label: '2ème Bac', yearNum: '12th' },
  ];

  const currentLevelIndex = secondaryCycle.findIndex((c) => c.level === student.currentLevel);

  // Circular gauge parameters
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readinessPercentage / 100) * circumference;

  const getGaugeColor = () => {
    if (readinessPercentage >= 85) return '#10b981';
    if (readinessPercentage >= 70) return '#6366f1';
    return '#f43f5e';
  };

  const handleSendChat = async (presetText?: string) => {
    const query = presetText || chatInput;
    if (!query.trim() || isChatLoading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user' as const,
      content: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await askTawjihAI(query, student, student.currentGrades, apiKey);
      const assistantMsg = {
        id: `a-${Date.now()}`,
        sender: 'assistant' as const,
        content: response.content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'Désolé, une erreur est survenue. Le moteur hors-ligne reste opérationnel.',
          time: 'À l’instant',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Student Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <span className="text-lg">🧭</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight">
                  Tawjih<span className="text-emerald-400">AI</span>
                </span>
                <span className="text-xs font-semibold text-slate-400">• Espace Élève</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200">{student.name}</span>
                <span>•</span>
                <span className="text-emerald-400 font-mono">Massar: {student.massarCode}</span>
              </div>
            </div>
          </div>

          {/* Center: 6-Year Timeline Stepper */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1.5 tracking-wider">
              Parcours 6 Ans :
            </span>
            {secondaryCycle.map((step, idx) => {
              const isPast = idx < currentLevelIndex;
              const isCurrent = idx === currentLevelIndex;
              return (
                <div key={step.level} className="flex items-center">
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono transition-all ${
                      isCurrent
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400'
                        : isPast
                        ? 'bg-slate-800 text-slate-300'
                        : 'text-slate-500 opacity-60'
                    }`}
                  >
                    <span>{step.short}</span>
                    {isPast && <Check className="w-2.5 h-2.5 text-emerald-400 ml-0.5" />}
                  </div>
                  {idx < secondaryCycle.length - 1 && (
                    <span className="text-slate-600 text-xs mx-1">›</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Action: Logout / Switch Account */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenApiKeyModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{apiKey ? 'Gemini 1.5 Actif' : 'IA Hors-Ligne'}</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-800/60 text-xs font-semibold transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion / Changer de compte</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body: Left Sidebar Navigation + Content Canvas */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          {/* Student Profile Card */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/40 shadow-lg"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-white truncate">{student.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block mt-0.5 truncate">
                  {student.levelLabel}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Moyenne Générale :</span>
                <strong className="text-emerald-400 font-mono">{currentGPA}/20</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Indice STEM :</span>
                <strong className="text-indigo-400 font-mono">{stemIndex}/20</strong>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                <span className="truncate">{student.school}</span>
                <span>{student.city}</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="glass-panel rounded-2xl p-2.5 border border-slate-800 space-y-1">
            <button
              onClick={() => setActiveTab('passport')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'passport'
                  ? 'bg-emerald-600 text-slate-950 font-bold shadow-md shadow-emerald-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Mon Passeport (6-Year Overview)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('discovery');
                onUpdateMode('discovery');
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'discovery'
                  ? 'bg-emerald-600 text-slate-950 font-bold shadow-md shadow-emerald-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Mode Découverte (Filières)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('target');
                onUpdateMode('target_lock');
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'target'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Mode Objectif (Target Lock)</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Assistant IA Al-Mouwajih</span>
            </button>
          </nav>

          {/* Quick Target Summary Card */}
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 text-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Carrière Cible Verrouillée :
            </span>
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <span className="text-xl">
                {student.lockedCareer === 'engineer' ? '👷‍♂️' : student.lockedCareer === 'doctor' ? '👨‍⚕️' : '✈️'}
              </span>
              <span className="truncate">{student.targetThresholds.careerName}</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${readinessPercentage}%`,
                  backgroundColor: getGaugeColor(),
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono pt-1 text-slate-400">
              <span>Score de Préparation</span>
              <strong className="text-white">{readinessPercentage}%</strong>
            </div>
          </div>
        </aside>

        {/* MAIN CANVAS: Bento Grid or Tab Content */}
        <main className="flex-1 min-w-0">
          {activeTab === 'passport' && (
            /* BENTO GRID DASHBOARD LAYOUT (CARD 1, 2, 3, 4) */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* BENTO ROW 1: Card 1 (Hero Alert Banner) & Card 2 (Radial Gauge) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CARD 1: HERO ALERT BANNER (CRITICAL REAL-TIME DYNAMIC ALERT) */}
                <div
                  className={`lg:col-span-2 rounded-2xl p-6 border shadow-xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                    primaryAlert.type === 'critical'
                      ? 'bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/60 border-red-500/60 shadow-red-950/50'
                      : primaryAlert.type === 'success'
                      ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/60 border-emerald-500/60 shadow-emerald-950/50'
                      : 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/60 border-amber-500/60 shadow-amber-950/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        primaryAlert.type === 'critical'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                          : primaryAlert.type === 'success'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {primaryAlert.type === 'critical' ? (
                        <AlertOctagon className="w-6 h-6 text-red-400" />
                      ) : primaryAlert.type === 'success' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-amber-400" />
                      )}
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-950/60 border border-slate-700 text-slate-300">
                          Alerte Préventive Seuil Tawjih
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-200">
                          {primaryAlert.subjectBadge || `Math: ${student.currentGrades.math}/20`}
                        </span>
                      </div>

                      <h3
                        className={`text-lg font-extrabold tracking-tight ${
                          primaryAlert.type === 'critical'
                            ? 'text-red-300'
                            : primaryAlert.type === 'success'
                            ? 'text-emerald-300'
                            : 'text-amber-300'
                        }`}
                      >
                        {primaryAlert.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                        {primaryAlert.message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Plan de Redressement : </strong>
                      {primaryAlert.actionItem}
                    </div>
                  </div>
                </div>

                {/* CARD 2: LIVE CAREER READINESS RADIAL GAUGE */}
                <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col items-center justify-between text-center">
                  <div className="w-full flex items-center justify-between text-xs">
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Indice de Préparation
                    </span>
                    <span className="text-slate-400 font-mono">{readinessPercentage}%</span>
                  </div>

                  {/* SVG Radial Meter */}
                  <div className="relative my-3 flex items-center justify-center">
                    <svg className="w-36 h-36 -rotate-90 transform">
                      <circle
                        cx="72"
                        cy="72"
                        r={radius}
                        className="stroke-slate-800"
                        strokeWidth="11"
                        fill="transparent"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r={radius}
                        stroke={getGaugeColor()}
                        strokeWidth="11"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-black text-white tracking-tight">
                        {readinessPercentage}%
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {readinessPercentage >= 85
                          ? 'Optimal'
                          : readinessPercentage >= 70
                          ? 'En Cours'
                          : 'Alerte'}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 text-[11px] text-slate-300">
                    <span className="font-bold text-indigo-400">Cible : </span>
                    {student.targetThresholds.careerName}
                  </div>
                </div>
              </div>

              {/* BENTO ROW 2: Card 3 (Longitudinal Chart) & Card 4 (Embedded AI Chat Advisor) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CARD 3: 6-YEAR LONGITUDINAL TRAJECTORY CHART (AREA/LINE GRADIENT) */}
                <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl">
                  <LongitudinalChart student={student} />
                </div>

                {/* CARD 4: EMBEDDED AI ADVISOR CHAT (AL-MOUWAJIH) */}
                <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Al-Mouwajih AI</h4>
                          <span className="text-[10px] text-emerald-400 font-mono">Grounded en Direct</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {apiKey ? 'Cloud' : 'Offline Engine'}
                      </span>
                    </div>

                    {/* Chat Messages Container */}
                    <div className="my-3 space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-indigo-600 text-white ml-6 rounded-br-none whitespace-pre-wrap'
                              : 'bg-slate-900 border border-slate-800 text-slate-200 mr-4 rounded-bl-none'
                          }`}
                        >
                          {msg.sender === 'assistant' ? (
                            <MarkdownContent content={msg.content} />
                          ) : (
                            msg.content
                          )}
                        </div>
                      ))}
                      {isChatLoading && (
                        <div className="p-2 rounded-lg bg-slate-900 text-xs text-slate-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                          <span>Calcul de la réponse...</span>
                        </div>
                      )}
                    </div>

                    {/* Quick clickable chips */}
                    <div className="space-y-1 mb-2">
                      <button
                        type="button"
                        onClick={() => handleSendChat("Why did my Engineering probability drop after my last Math test?")}
                        className="w-full text-left text-[11px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 transition-colors truncate"
                      >
                        💬 Pourquoi ma probabilité Ingénieur a baissé ?
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendChat("Based on my points right now, can I become a Doctor, Engineer, or Pilot?")}
                        className="w-full text-left text-[11px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 transition-colors truncate"
                      >
                        💬 Comparer Médecin vs Ingénieur vs Pilote
                      </button>
                    </div>
                  </div>

                  {/* Input form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendChat();
                    }}
                    className="flex items-center gap-1.5 pt-2 border-t border-slate-800"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Posez une question à l'IA..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading || !chatInput.trim()}
                      className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold shadow-md shadow-emerald-600/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>

              {/* BENTO ROW 3: Subject Cluster Radar / Bar Chart & Disciplines Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SubjectClusterChart
                  grades={student.currentGrades}
                  careerTarget={student.targetThresholds.careerName}
                />

                {/* Subject Grade Details Grid */}
                <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span>Relevé des Disciplines du Contrôle Continu</span>
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Dernières notes enregistrées par vos enseignants dans la base Massar.
                    </p>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <span className="font-semibold text-slate-200">📐 Mathématiques</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-100">
                            {student.currentGrades.math}/20
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              student.currentGrades.math >= 15.5
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {student.currentGrades.math >= 15.5 ? 'Seuil Requis Atteint' : 'Sous Seuil Ingénieur'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <span className="font-semibold text-slate-200">⚡ Physique-Chimie (PC)</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-100">
                            {student.currentGrades.physics}/20
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                            {student.currentGrades.physics >= 15.0 ? 'Validé' : 'À Renforcer'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <span className="font-semibold text-slate-200">🧬 SVT</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-100">
                            {student.currentGrades.svt}/20
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                            {student.currentGrades.svt >= 16.0 ? 'Excellence' : 'Normal'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <span className="font-semibold text-slate-200">📚 Français & Langues</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-100">
                            {student.currentGrades.french}/20 • {student.currentGrades.english}/20
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                            Conforme
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-right">
                    <button
                      onClick={() => setActiveTab('target')}
                      className="text-xs text-indigo-400 hover:underline font-bold"
                    >
                      Voir les seuils de toutes les filières ➔
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'discovery' && (
            <div className="animate-in fade-in duration-300">
              <DiscoveryMode
                student={student}
                grades={student.currentGrades}
                onLockCareer={(career) => {
                  onUpdateCareerGoal(career);
                  setActiveTab('target');
                }}
                onSwitchToTargetLock={() => setActiveTab('target')}
              />
            </div>
          )}

          {activeTab === 'target' && (
            <div className="animate-in fade-in duration-300">
              <TargetLockMode
                student={student}
                grades={student.currentGrades}
                onUpdateCareerGoal={onUpdateCareerGoal}
                onSwitchToDiscovery={() => setActiveTab('discovery')}
              />
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-slate-950 font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Assistant IA Al-Mouwajih (Plein Écran)</h3>
                    <p className="text-xs text-slate-400">
                      Conseiller d'orientation personnalisé pour {student.name} • Système Massar
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-lg">
                  {apiKey ? 'Gemini 1.5 Cloud' : 'Moteur Déterministe'}
                </span>
              </div>

              {/* Chat messages */}
              <div className="space-y-3 min-h-[360px] max-h-[500px] overflow-y-auto pr-2">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none whitespace-pre-wrap'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.sender === 'assistant' ? (
                        <MarkdownContent content={msg.content} />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center gap-2 pt-3 border-t border-slate-800"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Posez votre question à Al-Mouwajih (ex: Que faire avec mes notes actuelles ?)..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-md shadow-emerald-600/30"
                >
                  Envoyer
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
