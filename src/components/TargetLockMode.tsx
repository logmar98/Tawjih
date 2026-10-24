import React from 'react';
import {
  Target,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Flame,
  Award,
} from 'lucide-react';
import {
  StudentProfile,
  SubjectGrades,
  CareerGoal,
} from '../types/student';
import { evaluateTargetLock } from '../services/orientationEngine';

interface TargetLockModeProps {
  student: StudentProfile;
  grades: SubjectGrades;
  onUpdateCareerGoal: (career: CareerGoal) => void;
  onSwitchToDiscovery: () => void;
}

export const TargetLockMode: React.FC<TargetLockModeProps> = ({
  student,
  grades,
  onUpdateCareerGoal,
  onSwitchToDiscovery,
}) => {
  const targetEval = evaluateTargetLock(student, grades);
  const { readinessPercentage, primaryAlert, thresholdMath, thresholdPhysics } = targetEval;

  const careerOptions: { id: CareerGoal; label: string; icon: string; targetNote: string }[] = [
    {
      id: 'engineer',
      label: "Ingénieur d'État (ENSA / CPGE / UM6P)",
      icon: '👷‍♂️',
      targetNote: 'Math ≥ 15.5, PC ≥ 15.0',
    },
    {
      id: 'doctor',
      label: 'Médecine & Pharmacie (FMP / FMD)',
      icon: '👨‍⚕️',
      targetNote: 'SVT ≥ 16.0, PC ≥ 15.0',
    },
    {
      id: 'pilot',
      label: 'Pilote de Ligne & Aviation (ERA / AIAC)',
      icon: '✈️',
      targetNote: 'Math ≥ 15.0, Anglais ≥ 15.5',
    },
  ];

  // SVG Circular Gauge calculations
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readinessPercentage / 100) * circumference;

  const getGaugeColor = () => {
    if (readinessPercentage >= 85) return '#10b981'; // Emerald
    if (readinessPercentage >= 70) return '#6366f1'; // Indigo
    return '#f43f5e'; // Rose / Red
  };

  return (
    <div className="space-y-6">
      {/* Target Mode Header Bar */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 border border-indigo-500/20 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl shrink-0">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  MODE B : Target Lock Mode (Objectif Verrouillé)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  "Je connais mon rêve depuis le Collège"
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Surveillance longitudinale continue des seuils d'admissibilité avec déclenchement d'alertes préventives en temps réel.
              </p>
            </div>
          </div>

          {/* Career Selector Dropdown */}
          <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-400 pl-1">Carrière Cible :</span>
            <select
              value={student.lockedCareer}
              onChange={(e) => onUpdateCareerGoal(e.target.value as CareerGoal)}
              className="bg-slate-950 text-indigo-300 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {careerOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-100">
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DYNAMIC REAL-TIME ALERT BANNER (CRITICAL HACKATHON REQUIREMENT) */}
      <div
        className={`rounded-2xl p-6 border transition-all duration-300 shadow-xl ${
          primaryAlert.type === 'critical'
            ? 'bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/50 border-red-500/60 shadow-red-950/40 animate-soft-pulse'
            : primaryAlert.type === 'success'
            ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/50 border-emerald-500/60 shadow-emerald-950/40'
            : 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/50 border-amber-500/60 shadow-amber-950/40'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl ${
              primaryAlert.type === 'critical'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : primaryAlert.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
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
              <h3
                className={`text-base font-extrabold tracking-tight ${
                  primaryAlert.type === 'critical'
                    ? 'text-red-300'
                    : primaryAlert.type === 'success'
                    ? 'text-emerald-300'
                    : 'text-amber-300'
                }`}
              >
                {primaryAlert.title}
              </h3>
              {primaryAlert.subjectBadge && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-900 border border-slate-700 text-slate-200">
                  {primaryAlert.subjectBadge}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {primaryAlert.message}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-slate-300">
                <strong className="text-white">Plan d'Action Recommandé : </strong>
                {primaryAlert.actionItem}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Gauge & Gap Analysis Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Circular Readiness Gauge */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="w-full text-left mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
              Jauge de Préparation
            </span>
            <h4 className="text-sm font-bold text-white">Career Readiness Score</h4>
          </div>

          {/* SVG Circular Meter */}
          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-48 h-48 -rotate-90 transform">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="14"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke={getGaugeColor()}
                strokeWidth="14"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-white tracking-tight">
                {readinessPercentage}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                {readinessPercentage >= 85
                  ? 'Excellente Trajectoire'
                  : readinessPercentage >= 70
                  ? 'Sur La Bonne Voie'
                  : 'Alerte Seuil'}
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-indigo-400">Objectif Verrouillé : </span>
            {student.targetThresholds.careerName}
          </div>
        </div>

        {/* Right: Disciplines Gap Analysis Table */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📊</span>
                  <span>Analyse Granulaire des Seuils d'Admission</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparaison en temps réel entre vos notes de contrôles continus et les exigences du concours.
                </p>
              </div>

              <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                Seuils Concours 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 pl-2">Matière Clé</th>
                    <th className="pb-3">Votre Note</th>
                    <th className="pb-3">Seuil Requis</th>
                    <th className="pb-3">Écart Relatif</th>
                    <th className="pb-3 pr-2 text-right">Statut Algorithmique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {/* Math Row */}
                  <tr>
                    <td className="py-3 pl-2 flex items-center gap-2">
                      <span>📐</span>
                      <span className="font-bold text-slate-200">Mathématiques</span>
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-100">
                      {grades.math}/20
                    </td>
                    <td className="py-3 font-mono text-slate-400">
                      {thresholdMath}/20
                    </td>
                    <td className="py-3 font-mono">
                      {grades.math >= thresholdMath ? (
                        <span className="text-emerald-400 font-bold">
                          +{(grades.math - thresholdMath).toFixed(1)} pts
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold">
                          -{(thresholdMath - grades.math).toFixed(1)} pts
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      {grades.math >= 16.5 ? (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                          ✅ Seuil Dépassé (+Optimisé)
                        </span>
                      ) : grades.math >= thresholdMath ? (
                        <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold">
                          🎯 Seuil Validé
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-bold animate-pulse">
                          🛑 Seuil Critique (-2%)
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Physics Row */}
                  <tr>
                    <td className="py-3 pl-2 flex items-center gap-2">
                      <span>⚡</span>
                      <span className="font-bold text-slate-200">Physique-Chimie</span>
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-100">
                      {grades.physics}/20
                    </td>
                    <td className="py-3 font-mono text-slate-400">
                      {thresholdPhysics}/20
                    </td>
                    <td className="py-3 font-mono">
                      {grades.physics >= thresholdPhysics ? (
                        <span className="text-emerald-400 font-bold">
                          +{(grades.physics - thresholdPhysics).toFixed(1)} pts
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold">
                          -{(thresholdPhysics - grades.physics).toFixed(1)} pts
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      {grades.physics >= thresholdPhysics ? (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                          🎯 Seuil Validé
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                          ⚠️ À Renforcer
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* SVT Row */}
                  <tr>
                    <td className="py-3 pl-2 flex items-center gap-2">
                      <span>🧬</span>
                      <span className="font-bold text-slate-200">SVT (Sciences Vie & Terre)</span>
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-100">
                      {grades.svt}/20
                    </td>
                    <td className="py-3 font-mono text-slate-400">
                      {student.lockedCareer === 'doctor' ? '16.0/20' : '14.0/20'}
                    </td>
                    <td className="py-3 font-mono">
                      <span className="text-slate-300">
                        {grades.svt >= 14 ? 'Conforme' : 'Moyen'}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                        {student.lockedCareer === 'doctor' ? 'Pilier Majeur (45%)' : 'Complémentaire'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>
              Besoin de comparer d'autres horizons ?{' '}
              <button
                onClick={onSwitchToDiscovery}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Basculer vers le Mode Découverte ➔
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
