import React from 'react';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  School,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  StudentProfile,
  SubjectGrades,
  CareerMatch,
  StreamRecommendation,
} from '../types/student';
import {
  getCareerMatches,
  getStreamRecommendations,
} from '../services/orientationEngine';

interface DiscoveryModeProps {
  student: StudentProfile;
  grades: SubjectGrades;
  onLockCareer: (careerId: any) => void;
  onSwitchToTargetLock: () => void;
}

export const DiscoveryMode: React.FC<DiscoveryModeProps> = ({
  student,
  grades,
  onLockCareer,
  onSwitchToTargetLock,
}) => {
  const isPostBac = student.currentLevel === '2Bac' || student.currentLevel === '1Bac';
  const streams: StreamRecommendation[] = getStreamRecommendations(grades);
  const careers: CareerMatch[] = getCareerMatches(grades);

  const getMatchBadgeColor = (percentage: number) => {
    if (percentage >= 85) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (percentage >= 70) return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  };

  return (
    <div className="space-y-8">
      {/* Discovery Mode Header */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0">
              🧭
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  MODE A : Mode Découverte & Exploration
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  "Je ne sais pas encore quoi choisir"
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                L’algorithme Tawjih analyse l'empreinte de vos notes actuelles et vous propose les filières et métiers où votre probabilité de réussite est maximale.
              </p>
            </div>
          </div>

          <button
            onClick={onSwitchToTargetLock}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all shrink-0 hover:border-indigo-500/50"
          >
            <span>Vous avez déjà une idée ?</span>
            <span className="text-indigo-400">Verrouiller un Objectif ➔</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Stream Recommender (For Collège / Tronc Commun) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Recommandation de Filières (Collège & Tronc Commun)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Adapté pour l'orientation 3ème Collège (3AC) vers Tronc Commun et du Tronc Commun vers le Baccalauréat.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-lg">
            3 Filières Scannées
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {streams.map((stream, idx) => (
            <div
              key={stream.id}
              className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                idx === 0
                  ? 'glass-panel-glow border-emerald-500/40'
                  : 'glass-panel hover:border-slate-700'
              }`}
            >
              {idx === 0 && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-600 to-teal-600 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-md">
                  Recommandation #1
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-3xl">
                    {stream.id === 'sc_math' ? '📐' : stream.id === 'sc_physiques' ? '⚡' : '🧬'}
                  </span>
                  <span
                    className={`text-sm font-extrabold px-3 py-1 rounded-xl border ${getMatchBadgeColor(
                      stream.matchPercentage
                    )}`}
                  >
                    {stream.matchPercentage}% Affinité
                  </span>
                </div>

                <h4 className="font-bold text-base text-white leading-snug">{stream.name}</h4>
                <p className="text-xs font-arabic text-emerald-300/80 mt-0.5">{stream.nameAr}</p>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">{stream.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Disciplines Clés :
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {stream.highlightedSubjects.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">{stream.keyStrengths}</span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  Éligible <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Post-Bac Career Matcher (For 2ème Bac & Lycée) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <School className="w-5 h-5 text-indigo-400" />
              <span>Simulateur Post-Bac & Grandes Écoles Marocaines (2ème Bac)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Pondération algorithmique basée sur les formules de sélection officielles (Concours Commun FMP, Seuils ENSA, CPGE MPSI/PCSI, Concours ERA).
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-800/50 px-2.5 py-1 rounded-lg">
            3 Carrières Post-Bac Évaluées
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {careers.map((career) => (
            <div
              key={career.id}
              className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{career.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                        {career.title}
                      </h4>
                      <span className="text-[11px] font-arabic text-slate-400">{career.titleAr}</span>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-extrabold px-3 py-1 rounded-xl border ${getMatchBadgeColor(
                      career.matchPercentage
                    )}`}
                  >
                    {career.matchPercentage}%
                  </span>
                </div>

                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800/80 my-3 text-xs space-y-1.5">
                  <p className="text-slate-300">{career.readinessExplanation}</p>
                  <p className="text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-800">
                    {career.formulaDescription}
                  </p>
                </div>

                {/* Institutions */}
                <div className="space-y-1.5 mb-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Écoles Cibles :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {career.institutions.map((inst, iIdx) => (
                      <span
                        key={iIdx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-indigo-900/50"
                      >
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Requirements */}
                <div className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <strong className="text-slate-300">Critère :</strong> {career.keyRequirements}
                </div>
              </div>

              {/* Action Button: Lock Target */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    onLockCareer(career.id);
                    onSwitchToTargetLock();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold transition-all shadow-sm"
                >
                  <span>Verrouiller cette Carrière Cible</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
