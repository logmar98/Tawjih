import React, { useState, useEffect } from 'react';
import {
  Save,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Award,
  BookOpen,
  Calculator,
  Flame,
  CheckCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentProfile, SubjectGrades } from '../types/student';
import { calculateWeightedGPA } from '../services/orientationEngine';

interface TeacherDashboardProps {
  student: StudentProfile;
  onUpdateGrades: (studentId: string, newGrades: Partial<SubjectGrades>) => void;
  onNavigateToStudentView: () => void;
  showToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
}

interface SubjectConfig {
  key: keyof SubjectGrades;
  nameFr: string;
  nameAr: string;
  coef: number;
  icon: string;
  color: string;
  thresholdNote: string;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  student,
  onUpdateGrades,
  onNavigateToStudentView,
  showToast,
}) => {
  // Local working state for the inputs before or during changes
  const [localGrades, setLocalGrades] = useState<SubjectGrades>(student.currentGrades);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Sync when student changes
  useEffect(() => {
    setLocalGrades(student.currentGrades);
    setHasUnsavedChanges(false);
  }, [student.id, student.currentGrades]);

  const isHighSchool = student.currentLevel === 'TC' || student.currentLevel === '1Bac' || student.currentLevel === '2Bac';
  const liveGPA = calculateWeightedGPA(localGrades, isHighSchool);

  const subjects: SubjectConfig[] = [
    {
      key: 'math',
      nameFr: 'Mathématiques',
      nameAr: 'الرياضيات',
      coef: isHighSchool ? 7 : 5,
      icon: '📐',
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/40',
      thresholdNote: 'Seuil Ingénieur: ≥ 15.5/20',
    },
    {
      key: 'physics',
      nameFr: 'Physique-Chimie (PC)',
      nameAr: 'الفيزياء والكيمياء',
      coef: isHighSchool ? 7 : 4,
      icon: '⚡',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40',
      thresholdNote: 'Seuil Ingénieur/Médecine: ≥ 15.0/20',
    },
    {
      key: 'svt',
      nameFr: 'Sciences de la Vie et de la Terre (SVT)',
      nameAr: 'علوم الحياة والأرض',
      coef: isHighSchool ? 5 : 3,
      icon: '🧬',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40',
      thresholdNote: 'Seuil Médecine (FMP): ≥ 16.0/20',
    },
    {
      key: 'french',
      nameFr: 'Langue Française',
      nameAr: 'اللغة الفرنسية',
      coef: 4,
      icon: '📚',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/40',
      thresholdNote: 'Examen Régional / Concours',
    },
    {
      key: 'english',
      nameFr: 'Langue Anglaise',
      nameAr: 'اللغة الإنجليزية',
      coef: isHighSchool ? 3 : 2,
      icon: '🌐',
      color: 'from-cyan-500/20 to-sky-500/10 border-cyan-500/40',
      thresholdNote: 'Seuil Pilote (ERA): ≥ 15.5/20',
    },
  ];

  const handleGradeChange = (key: keyof SubjectGrades, val: number) => {
    const clamped = Math.max(0, Math.min(20, Math.round(val * 10) / 10));
    const next = { ...localGrades, [key]: clamped };
    setLocalGrades(next);
    setHasUnsavedChanges(true);
    // Real-time reactive update into shared state!
    onUpdateGrades(student.id, { [key]: clamped });
  };

  const handleSaveAndPush = () => {
    onUpdateGrades(student.id, localGrades);
    setHasUnsavedChanges(false);
    showToast(
      `✅ Notes synchronisées sur le Compte Élève de ${student.name} ! Trajectoire & alertes recalculées.`,
      'success'
    );
  };

  // Quick Demo Trigger 1: Simulate Math Drop (-2.5 pts)
  const handleSimulateMathDrop = () => {
    const newMath = Math.max(8.0, Number((student.currentGrades.math - 2.5).toFixed(1)));
    const updated = { ...localGrades, math: newMath };
    setLocalGrades(updated);
    onUpdateGrades(student.id, { math: newMath });
    showToast(
      `🚨 Simulation Baisse Math (-2.5 pts) appliquée : Math = ${newMath}/20. Alerte Rouge déclenchée !`,
      'warning'
    );
  };

  // Quick Demo Trigger 2: Simulate Math Boost (+3 pts)
  const handleSimulateMathBoost = () => {
    const newMath = Math.min(20.0, Number((student.currentGrades.math + 3.0).toFixed(1)));
    const updated = { ...localGrades, math: newMath };
    setLocalGrades(updated);
    onUpdateGrades(student.id, { math: newMath });

    // Confetti explosion for hackathon judges!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
    });

    showToast(
      `🎉 Simulation Boost Math (+3.0 pts) appliquée : Math = ${newMath}/20 ! Alerte Verte & Rééquilibrage activés !`,
      'success'
    );
  };

  const getScoreColor = (score: number) => {
    if (score < 10) return 'text-red-400 bg-red-950/50 border-red-800';
    if (score < 14) return 'text-amber-400 bg-amber-950/50 border-amber-800';
    if (score < 16) return 'text-emerald-400 bg-emerald-950/50 border-emerald-800';
    return 'text-cyan-300 bg-cyan-950/50 border-cyan-700 shadow-sm shadow-cyan-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Teacher Controls & Student Identity */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-white tracking-tight">{student.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {student.levelLabel}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {student.massarCode}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {student.school} • {student.city} • Mode Démo :{' '}
                <span className="text-amber-300 font-medium">{student.demoRole}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto justify-between sm:justify-start">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-center">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-slate-400 block">
                Moyenne Prévue
              </span>
              <span className="text-2xl font-black text-emerald-400">
                {liveGPA}
                <span className="text-xs text-slate-500 font-normal"> /20</span>
              </span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-center">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-slate-400 block">
                Indice STEM
              </span>
              <span className="text-2xl font-black text-indigo-400">
                {((localGrades.math + localGrades.physics) / 2).toFixed(1)}
                <span className="text-xs text-slate-500 font-normal"> /20</span>
              </span>
            </div>

            <button
              onClick={onNavigateToStudentView}
              className="hidden sm:flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all shadow-sm hover:border-emerald-500/50"
            >
              <span>Voir Côté Élève</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Live Reactivity & Quick Demo Triggers Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-semibold text-slate-300">Hackathon Live Reactivity Triggers :</span>
            <span className="text-slate-500 hidden sm:inline">
              (Démontrez la synchronisation immédiate avec le compte élève en 1 clic)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSimulateMathDrop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm"
            >
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              <span>Simuler Baisse Math (-2.5 pts)</span>
            </button>

            <button
              onClick={handleSimulateMathBoost}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/80 text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simuler Boost Math (+3.0 pts)</span>
            </button>

            <button
              onClick={handleSaveAndPush}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Sauvegarder & Pousser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grade Entry Table / Grid */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              <span>Saisie des Notes du Contrôle Continu (CC)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Modifiez les notes ci-dessous avec les curseurs ou les champs numériques. Les moyennes, alertes d'orientation et graphiques se mettent à jour instantanément.
            </p>
          </div>

          <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            Échelle : <strong className="text-emerald-400">0.00 à 20.00</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subj) => {
            const currentScore = localGrades[subj.key] ?? 10;
            return (
              <div
                key={subj.key}
                className={`bg-slate-900/90 rounded-xl p-4 border transition-all duration-200 hover:border-slate-700 relative overflow-hidden`}
              >
                {/* Subject Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{subj.icon}</span>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-100">{subj.nameFr}</h3>
                      <span className="text-[11px] text-slate-400 font-arabic">{subj.nameAr}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Coef {subj.coef}
                  </span>
                </div>

                {/* Score Input & Live Display */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      value={currentScore}
                      onChange={(e) => handleGradeChange(subj.key, parseFloat(e.target.value) || 0)}
                      className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono font-bold text-center text-base focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-xs text-slate-400">/ 20</span>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getScoreColor(
                      currentScore
                    )}`}
                  >
                    {currentScore >= 16
                      ? 'Très Bien'
                      : currentScore >= 14
                      ? 'Bien'
                      : currentScore >= 12
                      ? 'Assez Bien'
                      : currentScore >= 10
                      ? 'Passable'
                      : 'Sous Seuil'}
                  </span>
                </div>

                {/* Interactive Slider */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={currentScore}
                    onChange={(e) => handleGradeChange(subj.key, parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0</span>
                    <span className="text-amber-400/80">10 (Seuil)</span>
                    <span className="text-emerald-400/80">16 (Excellence)</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Benchmark requirement pill */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">{subj.thresholdNote}</span>
                  {currentScore >= 15.5 && (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                  )}
                </div>
              </div>
            );
          })}

          {/* Quick Summary Card in the Grid */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 rounded-xl p-5 border border-indigo-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm mb-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Impact sur le Compte Élève</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Toute modification modifie en direct :
              </p>
              <ul className="text-xs text-slate-400 mt-2 space-y-1.5 list-disc list-inside">
                <li>Le Passeport Longitudinal (Graphique 6 ans)</li>
                <li>Le % de Préparation Carrière (Ingénieur / Médecin)</li>
                <li>L’alerte dynamique (Stop & Fix vs Rebalance)</li>
                <li>Les réponses de l'IA Orientation Tawjih</li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-500/20 flex items-center justify-between">
              <span className="text-xs text-slate-400">Synchronisation :</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Réactif (localStorage)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
