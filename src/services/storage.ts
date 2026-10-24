import { StudentProfile, SubjectGrades, CareerGoal, AuthState } from '../types/student';
import { INITIAL_STUDENTS } from '../data/initialStudents';
import { calculateWeightedGPA } from './orientationEngine';

const STORAGE_KEY = 'tawjih_students_v1';
const SELECTED_STUDENT_KEY = 'tawjih_selected_student';
const API_KEY_STORAGE = 'tawjih_gemini_api_key';
const AUTH_STORAGE_KEY = 'tawjih_auth_state_v1';

type ChangeListener = () => void;
const listeners: Set<ChangeListener> = new Set();

export function subscribeToStore(listener: ChangeListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error in store listener:', e);
    }
  });
}

export function getStoredAuth(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { role: 'unauthenticated' };
    }
    return JSON.parse(raw);
  } catch {
    return { role: 'unauthenticated' };
  }
}

export function saveStoredAuth(auth: AuthState): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    notifyListeners();
  } catch (err) {
    console.error('Failed to save auth state:', err);
  }
}

export function loginAsTeacher(): void {
  saveStoredAuth({
    role: 'teacher',
    teacherName: 'Prof. Mohammed Amrani',
  });
}

export function loginAsStudent(studentId: string): void {
  setSelectedStudentId(studentId);
  saveStoredAuth({
    role: 'student',
    studentId,
  });
}

export function logout(): void {
  saveStoredAuth({ role: 'unauthenticated' });
}

export function getStoredStudents(): StudentProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    // Ensure className exists in all loaded students
    return parsed.map((st: any) => {
      const initial = INITIAL_STUDENTS.find((i) => i.id === st.id);
      return {
        ...st,
        className: st.className || initial?.className || 'Tronc Commun',
      };
    });
  } catch (err) {
    console.error('Failed to read from localStorage:', err);
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: StudentProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    notifyListeners();
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function getSelectedStudentId(): string {
  try {
    const stored = localStorage.getItem(SELECTED_STUDENT_KEY);
    return stored || 'salma';
  } catch {
    return 'salma';
  }
}

export function setSelectedStudentId(id: string): void {
  try {
    localStorage.setItem(SELECTED_STUDENT_KEY, id);
    notifyListeners();
  } catch (err) {
    console.error('Failed to set selected student id:', err);
  }
}

export function getStoredApiKey(): string {
  try {
    const key = localStorage.getItem(API_KEY_STORAGE);
    if (key !== null && key !== undefined && key.trim().length > 0) return key;
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (envKey) return envKey;
    return '';
  } catch {
    return (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  }
}

export function saveStoredApiKey(apiKey: string): void {
  try {
    localStorage.setItem(API_KEY_STORAGE, apiKey.trim());
    notifyListeners();
  } catch (err) {
    console.error('Failed to save API key:', err);
  }
}

export function updateStudentGrades(
  studentId: string,
  newGrades: Partial<SubjectGrades>
): StudentProfile[] {
  const students = getStoredStudents();
  const updated = students.map((s) => {
    if (s.id !== studentId) return s;

    const mergedGrades: SubjectGrades = {
      ...s.currentGrades,
      ...newGrades,
    };

    // Recalculate GPA
    const isHighSchool = s.currentLevel === 'TC' || s.currentLevel === '1Bac' || s.currentLevel === '2Bac';
    const newGpa = calculateWeightedGPA(mergedGrades, isHighSchool);

    // Update the last item in historicalYears representing current year
    const updatedHistory = [...s.historicalYears];
    if (updatedHistory.length > 0) {
      const lastIndex = updatedHistory.length - 1;
      updatedHistory[lastIndex] = {
        ...updatedHistory[lastIndex],
        grades: mergedGrades,
        gpa: newGpa,
      };
    }

    return {
      ...s,
      currentGrades: mergedGrades,
      historicalYears: updatedHistory,
    };
  });

  saveStudents(updated);
  return updated;
}

export function updateStudentMode(
  studentId: string,
  mode: 'discovery' | 'target_lock'
): StudentProfile[] {
  const students = getStoredStudents();
  const updated = students.map((s) => (s.id === studentId ? { ...s, activeMode: mode } : s));
  saveStudents(updated);
  return updated;
}

export function updateStudentLockedCareer(
  studentId: string,
  career: CareerGoal
): StudentProfile[] {
  const careerNames: Record<CareerGoal, string> = {
    engineer: "Ingénieur d'État (ENSA / CPGE / UM6P)",
    doctor: 'Médecine & Pharmacie (FMP / FMD)',
    pilot: 'Pilote de Ligne & Aviation (ERA / AIAC)',
    architect: 'Architecte (ENA Rabat)',
    data_scientist: 'Data Scientist & AI Specialist (INSEA / EMI)',
  };

  const defaultThresholds: Record<
    CareerGoal,
    { math: number; physics: number; svt?: number; english?: number; french?: number }
  > = {
    engineer: { math: 15.5, physics: 15.0 },
    doctor: { math: 14.0, physics: 15.0, svt: 16.0 },
    pilot: { math: 15.0, physics: 15.0, english: 15.5 },
    architect: { math: 14.5, physics: 14.0, french: 15.0 },
    data_scientist: { math: 16.0, physics: 14.5, english: 15.0 },
  };

  const students = getStoredStudents();
  const updated = students.map((s) => {
    if (s.id !== studentId) return s;
    return {
      ...s,
      lockedCareer: career,
      targetThresholds: {
        career,
        careerName: careerNames[career] || career,
        subjects: defaultThresholds[career] || { math: 15.0, physics: 15.0 },
      },
    };
  });

  saveStudents(updated);
  return updated;
}

export function resetAllStudentData(): StudentProfile[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
  notifyListeners();
  return INITIAL_STUDENTS;
}
