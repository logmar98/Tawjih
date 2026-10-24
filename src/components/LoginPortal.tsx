import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  School,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Target,
  UserCheck,
  Lock,
  Layers,
  KeyRound,
} from 'lucide-react';
import { StudentProfile } from '../types/student';

interface LoginPortalProps {
  students: StudentProfile[];
  onLoginAsTeacher: () => void;
  onLoginAsStudent: (studentId: string) => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  students,
  onLoginAsTeacher,
  onLoginAsStudent,
  onOpenApiKeyModal,
  hasApiKey,
}) => {
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student'>('student');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('salma'); // Default to Salma (Target Lock Engineer)
  const [teacherId, setTeacherId] = useState<string>('PROF-88421');
  const [teacherPassword, setTeacherPassword] = useState<string>('••••••••');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const currentSelectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onLoginAsTeacher();
      setIsSubmitting(false);
    }, 350);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onLoginAsStudent(selectedStudentId);
      setIsSubmitting(false);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <span className="text-xl">🧭</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">
                Tawjih<span className="text-emerald-400">AI</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-morocco-red/20 text-red-300 border border-morocco-red/40">
                <span>🇲🇦</span> Portail National
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Le GPS de l'Orientation Scolaire & Professionnelle Marocaine (7th ➔ 2Bac)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{hasApiKey ? 'Gemini 1.5 Cloud' : 'Moteur Hors-Ligne'}</span>
          </button>
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Système Massar Compatible</span>
          </div>
        </div>
      </header>

      {/* Main Login / Role Selection Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="max-w-4xl w-full">
          {/* Hero Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plateforme d'Aiguillage Longitudinal K-12</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tawjih AI — Portail d'Orientation Intelligente
            </h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2 font-arabic text-base sm:text-lg">
              البوابة الوطنية للتوجيه المدرسي والمهني الذكي والمتابعة المستمرة
            </p>
          </div>

          {/* Role Selection Switcher Tabs */}
          <div className="flex justify-center mb-6">
            <div className="bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-1 max-w-md w-full">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedRole === 'student'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 scale-[1.01]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>🎓</span>
                <span>Espace Élève</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('teacher')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedRole === 'teacher'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 scale-[1.01]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>👨‍🏫</span>
                <span>Espace Enseignant</span>
              </button>
            </div>
          </div>

          {/* Dynamic Card based on Selected Role */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/90 shadow-2xl relative overflow-hidden">
            {selectedRole === 'student' ? (
              /* STUDENT PORTAL CARD */
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <GraduationCap className="w-6 h-6 text-emerald-400" />
                      <span>Connexion au Passeport Élève & Conseiller IA</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Sélectionnez un profil pré-chargé pour tester le suivi longitudinal et l'orientation en direct.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-lg shrink-0">
                    3 Profils Démo Disponibles
                  </span>
                </div>

                <form onSubmit={handleStudentSubmit} className="space-y-6">
                  {/* Visual Student Profile Selector */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-3 uppercase tracking-wider">
                      Sélectionnez le Profil Démo de l'Élève :
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {students.map((student) => {
                        const isSelected = selectedStudentId === student.id;
                        return (
                          <div
                            key={student.id}
                            onClick={() => setSelectedStudentId(student.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between relative ${
                              isSelected
                                ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/60 scale-[1.02]'
                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 text-emerald-400">
                                <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-slate-950" />
                              </div>
                            )}

                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className={`w-12 h-12 rounded-xl object-cover ring-2 ${
                                  isSelected ? 'ring-emerald-400' : 'ring-slate-700'
                                }`}
                              />
                              <div>
                                <h3 className="font-bold text-sm text-white">{student.name}</h3>
                                <p className="text-[11px] text-emerald-400 font-medium">
                                  {student.levelLabel}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs">
                              <div className="text-slate-400 font-mono text-[11px] flex justify-between">
                                <span>Code Massar:</span>
                                <strong className="text-slate-200">{student.massarCode}</strong>
                              </div>
                              <div className="text-slate-300 text-[11px] font-medium">
                                📌 {student.demoRole}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {student.school} ({student.city})
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pre-filled credentials summary */}
                  <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                        🔑
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-400 block">Identifiant Massar Associé :</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">
                          {currentSelectedStudent.massarCode}@taalim.ma
                        </span>
                        <span className="text-slate-500 block text-[11px]">
                          Authentification SSO Ministère simplifiée pour la démo
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] shrink-0"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Chargement du Passeport...</span>
                        </div>
                      ) : (
                        <>
                          <span>Accéder à mon Passeport (Login)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* TEACHER PORTAL CARD */
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <School className="w-6 h-6 text-indigo-400" />
                      <span>Espace Enseignant — Carnet de Notes Massar 2.0</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Accédez au carnet de notes interactif, saisissez les notes des contrôles continus et simulez les alertes d'orientation.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 px-2.5 py-1 rounded-lg shrink-0">
                    Compte Enseignant Référent
                  </span>
                </div>

                <form onSubmit={handleTeacherSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Massar ID Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Identifiant Enseignant Massar :
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={teacherId}
                          onChange={(e) => setTeacherId(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                        />
                        <UserCheck className="w-4 h-4 text-indigo-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Mot de passe :
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          value={teacherPassword}
                          onChange={(e) => setTeacherPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>
                  </div>

                  {/* Teacher Profile Preview Banner */}
                  <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 rounded-2xl p-4 border border-indigo-500/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-2xl shrink-0">
                        👨‍🏫
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">Prof. Mohammed Amrani</h4>
                        <p className="text-xs text-indigo-300">
                          Enseignant Coordonnateur • Mathématiques & Physique-Chimie
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Classes assignées : 3ème Collège A, Tronc Commun Sc. 1, 2ème Bac SM-A
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:block text-right">
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                        Accès Direct Démo
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Connexion en cours...</span>
                        </div>
                      ) : (
                        <>
                          <span>Se connecter (Demo Teacher)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Value Props Footer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-xs text-slate-400">
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80 flex items-center gap-2.5">
              <span className="text-lg">📊</span>
              <span>
                <strong className="text-slate-200 block">Passeport 6 ans :</strong>
                Traçabilité continue de 1AC (7th) au Baccalauréat.
              </span>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80 flex items-center gap-2.5">
              <span className="text-lg">⚡</span>
              <span>
                <strong className="text-slate-200 block">Alertes Préventives :</strong>
                Détection de sous-seuil (-2% Seuil Grandes Écoles).
              </span>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80 flex items-center gap-2.5">
              <span className="text-lg">🤖</span>
              <span>
                <strong className="text-slate-200 block">Assistant Al-Mouwajih :</strong>
                IA ancrée sur les notes réelles et programmes Massar.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Tawjih AI © 2026 • Royaume du Maroc • Ministère de l'Éducation Nationale</span>
          <span className="text-slate-400">Architecture SaaS 3 Écrans Séparés • Déconnexion 1-Clic</span>
        </div>
      </footer>
    </div>
  );
};
