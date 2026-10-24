export type GradeLevel = '1AC' | '2AC' | '3AC' | 'TC' | '1Bac' | '2Bac';

export type UserRole = 'unauthenticated' | 'teacher' | 'student';

export interface AuthState {
  role: UserRole;
  studentId?: string;
  teacherName?: string;
}

export interface SubjectGrades {
  math: number;
  physics: number;     // Physique-Chimie (PC)
  svt: number;         // Sciences de la Vie et de la Terre
  french: number;      // Français
  english: number;     // Anglais
  historyGeo?: number; // Histoire-Géographie
  philosophy?: number; // Philosophie (Lycée)
}

export interface DetailedSubjectRecord {
  cc1: number;
  cc2: number;
  cc3: number;
  exam: number;
  finalScore: number;
}

export interface YearRecord {
  gradeLevel: GradeLevel;
  yearLabel: string; // e.g. "1ère Année Collège (7th)", "Tronc Commun (10th)"
  academicYear: string; // e.g. "2021-2022"
  grades: SubjectGrades;
  gpa: number; // Note générale /20
  completed: boolean;
}

export type CareerGoal = 'engineer' | 'doctor' | 'pilot' | 'architect' | 'data_scientist';

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  currentLevel: GradeLevel;
  levelLabel: string;
  className: string; // e.g. "Tronc Commun Sc. 1", "3ème Collège A", "2ème Bac SM-A"
  school: string;
  city: string;
  massarCode: string;
  demoRole: string; // e.g. "Undecided / Discovery Mode"
  activeMode: 'discovery' | 'target_lock';
  lockedCareer: CareerGoal;
  historicalYears: YearRecord[];
  currentGrades: SubjectGrades;
  targetThresholds: {
    career: CareerGoal;
    careerName: string;
    subjects: {
      math: number;
      physics: number;
      svt?: number;
      english?: number;
      french?: number;
    };
  };
}

export interface CareerMatch {
  id: CareerGoal;
  title: string;
  titleAr: string;
  icon: string;
  institutions: string[]; // e.g. ["ENSA", "CPGE", "UM6P", "EMI"]
  matchPercentage: number;
  status: 'optimal' | 'achievable' | 'at_risk' | 'low';
  readinessExplanation: string;
  keyRequirements: string;
  formulaDescription: string;
  rebalanceTip?: string;
}

export interface StreamRecommendation {
  id: string;
  name: string;
  nameAr: string;
  cycle: 'tronc_commun' | 'bac_stream';
  matchPercentage: number;
  suitability: 'highly_recommended' | 'recommended' | 'challenging';
  description: string;
  highlightedSubjects: string[];
  keyStrengths: string;
}

export interface AIAlert {
  type: 'critical' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  gapPercentage?: number;
  actionItem: string;
  subjectBadge?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  highlightGrade?: {
    subject: string;
    score: number;
  };
}
