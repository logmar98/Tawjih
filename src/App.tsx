import React, { useState, useEffect } from 'react';
import { LoginPortal } from './components/LoginPortal';
import { TeacherWorkspace } from './components/TeacherWorkspace';
import { StudentPlatform } from './components/StudentPlatform';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Toast, ToastData } from './components/Toast';
import {
  getStoredStudents,
  getStoredAuth,
  loginAsTeacher,
  loginAsStudent,
  logout,
  getStoredApiKey,
  saveStoredApiKey,
  updateStudentGrades,
  updateStudentMode,
  updateStudentLockedCareer,
  resetAllStudentData,
  subscribeToStore,
} from './services/storage';
import { StudentProfile, SubjectGrades, CareerGoal, AuthState } from './types/student';

export const App: React.FC = () => {
  const [students, setStudents] = useState<StudentProfile[]>(getStoredStudents());
  const [auth, setAuth] = useState<AuthState>(getStoredAuth());
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  // Subscribe to reactive store changes across all components
  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setStudents(getStoredStudents());
      setAuth(getStoredAuth());
      setApiKey(getStoredApiKey());
    });
    return unsubscribe;
  }, []);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToast({
      id: `toast-${Date.now()}`,
      message,
      type,
    });
  };

  const handleLoginAsTeacher = () => {
    loginAsTeacher();
    showToast('Bienvenue Prof. Mohammed Amrani (Espace Enseignant)', 'success');
  };

  const handleLoginAsStudent = (studentId: string) => {
    loginAsStudent(studentId);
    const st = students.find((s) => s.id === studentId);
    showToast(`Bienvenue ${st?.name || 'Élève'} sur votre Passeport Tawjih AI`, 'success');
  };

  const handleLogout = () => {
    logout();
    showToast('Déconnexion réussie. Choisissez un compte pour vous reconnecter.', 'info');
  };

  const handleUpdateGrades = (studentId: string, newGrades: Partial<SubjectGrades>) => {
    updateStudentGrades(studentId, newGrades);
  };

  const handleUpdateMode = (mode: 'discovery' | 'target_lock') => {
    if (auth.studentId) {
      updateStudentMode(auth.studentId, mode);
      showToast(
        mode === 'discovery'
          ? 'Mode Découverte activé (Filières & Métiers explorés)'
          : 'Mode Target Lock activé (Surveillance des seuils cibles)',
        'info'
      );
    }
  };

  const handleUpdateCareerGoal = (career: CareerGoal) => {
    if (auth.studentId) {
      updateStudentLockedCareer(auth.studentId, career);
      showToast(`Objectif de carrière verrouillé : ${career.toUpperCase()}`, 'success');
    }
  };

  const handleSaveApiKey = (newKey: string) => {
    saveStoredApiKey(newKey);
    setApiKey(newKey);
    showToast(
      newKey ? 'Clé Gemini API enregistrée avec succès.' : 'Moteur hors-ligne activé.',
      'success'
    );
  };

  // Find logged-in student profile if student role is active
  const currentStudent = auth.role === 'student'
    ? students.find((s) => s.id === auth.studentId) || students[0]
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 
        ROUTING LOGIC: Strictly separate 3 distinct views/screens
        1. LoginPortal: Shown when role === 'unauthenticated'
        2. TeacherWorkspace: Shown ONLY when role === 'teacher'
        3. StudentPlatform: Shown ONLY when role === 'student'
      */}

      {auth.role === 'unauthenticated' && (
        <LoginPortal
          students={students}
          onLoginAsTeacher={handleLoginAsTeacher}
          onLoginAsStudent={handleLoginAsStudent}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          hasApiKey={Boolean(apiKey && apiKey.length > 5)}
        />
      )}

      {auth.role === 'teacher' && (
        <TeacherWorkspace
          students={students}
          onUpdateGrades={handleUpdateGrades}
          onLogout={handleLogout}
          showToast={showToast}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          hasApiKey={Boolean(apiKey && apiKey.length > 5)}
        />
      )}

      {auth.role === 'student' && currentStudent && (
        <StudentPlatform
          student={currentStudent}
          onUpdateCareerGoal={handleUpdateCareerGoal}
          onUpdateMode={handleUpdateMode}
          onLogout={handleLogout}
          apiKey={apiKey}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />
      )}

      {/* Gemini API Key Modal (Available across views) */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentApiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Floating Notification Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default App;
