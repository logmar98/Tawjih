import React, { useState, useEffect } from 'react';
import {
  LogOut,
  Save,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Search,
  BookOpen,
  Calculator,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Flame,
  Calendar,
  School,
  FileText,
  ArrowLeft,
  GraduationCap,
  Target,
  Compass,
  Star,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentProfile, SubjectGrades, CareerGoal } from '../types/student';
import { calculateWeightedGPA } from '../services/orientationEngine';

interface TeacherWorkspaceProps {
  students: StudentProfile[];
  onUpdateGrades: (studentId: string, newGrades: Partial<SubjectGrades>) => void;
  onLogout: () => void;
  showToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

// 4-Level Drill-Down Navigation State
type DrillDownLevel = 1 | 2 | 3 | 4;

interface GradeYearConfig {
  id: string; // e.g. "3AC", "TC", "2Bac"
  nameFr: string;
  nameAr: string;
  gradeNum: string; // e.g. "9th Grade"
  cycle: 'college' | 'lycee';
  classesCount: number;
  studentsCount: number;
  averageGpa: number;
  demoStudent?: {
    id: string;
    name: string;
    role: string;
  };
}

interface ClassConfig {
  id: string;
  yearId: string;
  name: string;
  nameAr: string;
  stream: string; // Filière
  studentsCount: number;
  classAverage: number;
  hasDemoStudent?: string; // studentId
  demoStudentName?: string;
}

interface PeerStudent {
  id: string;
  name: string;
  avatar: string;
  massarCode: string;
  classId: string;
  gpa: number;
  isDemoStudent: boolean;
  activeModeLabel: string;
  grades: SubjectGrades;
  lockedCareer?: CareerGoal;
}

export const TeacherWorkspace: React.FC<TeacherWorkspaceProps> = ({
  students,
  onUpdateGrades,
  onLogout,
  showToast,
  onOpenApiKeyModal,
  hasApiKey,
}) => {
  // Navigation Drill-Down State: 1 = Years, 2 = Classes, 3 = Students, 4 = Student Gradebook
  const [currentLevel, setCurrentLevel] = useState<DrillDownLevel>(1);
  const [selectedYearId, setSelectedYearId] = useState<string>('TC');
  const [selectedClassId, setSelectedClassId] = useState<string>('tc-sc-a');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('salma');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // LEVEL 1: Academic Years Catalog (6 Years: 1AC to 2Bac)
  const gradeYears: GradeYearConfig[] = [
    // Cycle Collégial
    {
      id: '1AC',
      nameFr: '1ère Année Collège',
      nameAr: 'الأولى إعدادي',
      gradeNum: '7th Grade',
      cycle: 'college',
      classesCount: 3,
      studentsCount: 92,
      averageGpa: 14.2,
    },
    {
      id: '2AC',
      nameFr: '2ème Année Collège',
      nameAr: 'الثانية إعدادي',
      gradeNum: '8th Grade',
      cycle: 'college',
      classesCount: 3,
      studentsCount: 88,
      averageGpa: 13.9,
    },
    {
      id: '3AC',
      nameFr: '3ème Année Collège (Orientation)',
      nameAr: 'الثالثة إعدادي (سنة التوجيه)',
      gradeNum: '9th Grade',
      cycle: 'college',
      classesCount: 4,
      studentsCount: 110,
      averageGpa: 14.5,
      demoStudent: {
        id: 'youssef',
        name: 'Youssef Benali',
        role: 'Mode Découverte (Filière Sciences Math)',
      },
    },
    // Cycle Qualifiant / Lycée
    {
      id: 'TC',
      nameFr: 'Tronc Commun',
      nameAr: 'الجذع المشترك العلمي والتكنولوجي',
      gradeNum: '10th Grade',
      cycle: 'lycee',
      classesCount: 4,
      studentsCount: 120,
      averageGpa: 14.8,
      demoStudent: {
        id: 'salma',
        name: 'Salma Mansouri',
        role: 'Target Lock (Ingénieur CPGE / ENSA)',
      },
    },
    {
      id: '1Bac',
      nameFr: '1ère Année Baccalauréat',
      nameAr: 'الأولى باكالوريا (الامتحان الجهوي)',
      gradeNum: '11th Grade',
      cycle: 'lycee',
      classesCount: 3,
      studentsCount: 85,
      averageGpa: 14.6,
    },
    {
      id: '2Bac',
      nameFr: '2ème Année Bac (Baccalauréat)',
      nameAr: 'الثانية باكالوريا (الامتحان الوطني)',
      gradeNum: '12th Grade',
      cycle: 'lycee',
      classesCount: 3,
      studentsCount: 90,
      averageGpa: 15.1,
      demoStudent: {
        id: 'amine',
        name: 'Amine Tazi',
        role: 'Post-Bac Selector (Médecine / FMP)',
      },
    },
  ];

  // LEVEL 2: Classes Catalog (Per Grade Year)
  const classesCatalog: ClassConfig[] = [
    // 3AC Classes
    {
      id: '3ac-grp1',
      yearId: '3AC',
      name: '3AC - Groupe 1 (BIOF)',
      nameAr: 'الثالثة إعدادي - فوج 1 (مسلك دولي)',
      stream: 'Filière Internationale (Français)',
      studentsCount: 28,
      classAverage: 14.8,
      hasDemoStudent: 'youssef',
      demoStudentName: 'Youssef Benali',
    },
    {
      id: '3ac-grp2',
      yearId: '3AC',
      name: '3AC - Groupe 2 (BIOF)',
      nameAr: 'الثالثة إعدادي - فوج 2 (مسلك دولي)',
      stream: 'Filière Internationale (Français)',
      studentsCount: 27,
      classAverage: 13.9,
    },
    {
      id: '3ac-grp3',
      yearId: '3AC',
      name: '3AC - Groupe 3 (Général)',
      nameAr: 'الثالثة إعدادي - فوج 3 (عام)',
      stream: 'Filière Générale (Arabe)',
      studentsCount: 29,
      classAverage: 12.8,
    },
    {
      id: '3ac-grp4',
      yearId: '3AC',
      name: '3AC - Groupe 4 (Général)',
      nameAr: 'الثالثة إعدادي - فوج 4 (عام)',
      stream: 'Filière Générale (Arabe)',
      studentsCount: 26,
      classAverage: 13.2,
    },

    // Tronc Commun (TC) Classes
    {
      id: 'tc-sc-a',
      yearId: 'TC',
      name: 'TC Scientifique - Classe A (BIOF)',
      nameAr: 'جذع مشترك علمي - خيار فرنسية (أ)',
      stream: 'Sciences Expérimentales (Option BIOF)',
      studentsCount: 30,
      classAverage: 15.2,
      hasDemoStudent: 'salma',
      demoStudentName: 'Salma Mansouri',
    },
    {
      id: 'tc-sc-b',
      yearId: 'TC',
      name: 'TC Scientifique - Classe B',
      nameAr: 'جذع مشترك علمي (ب)',
      stream: 'Sciences Expérimentales',
      studentsCount: 30,
      classAverage: 14.1,
    },
    {
      id: 'tc-tech-a',
      yearId: 'TC',
      name: 'TC Technologique - Classe A',
      nameAr: 'جذع مشترك تكنولوجي (أ)',
      stream: 'Sciences & Technologies Industrielles',
      studentsCount: 28,
      classAverage: 13.6,
    },
    {
      id: 'tc-let-a',
      yearId: 'TC',
      name: 'TC Lettres & SH - Classe A',
      nameAr: 'جذع مشترك آداب وعلوم إنسانية (أ)',
      stream: 'Lettres & Sciences Humaines',
      studentsCount: 32,
      classAverage: 13.9,
    },

    // 2Bac Classes
    {
      id: '2bac-pc-svt-1',
      yearId: '2Bac',
      name: '2Bac PC / SVT - Classe 1',
      nameAr: 'الثانية باك - علوم فيزيائية وعلوم الحياة والأرض',
      stream: 'Sciences Physiques & SVT (BIOF)',
      studentsCount: 30,
      classAverage: 15.6,
      hasDemoStudent: 'amine',
      demoStudentName: 'Amine Tazi',
    },
    {
      id: '2bac-sm-a',
      yearId: '2Bac',
      name: '2Bac Sciences Math A - Classe 1',
      nameAr: 'الثانية باكالوريا - علوم رياضية (أ)',
      stream: 'Sciences Mathématiques A',
      studentsCount: 28,
      classAverage: 16.2,
    },
    {
      id: '2bac-eco',
      yearId: '2Bac',
      name: '2Bac Sciences Éco - Classe 1',
      nameAr: 'الثانية باكالوريا - علوم اقتصادية',
      stream: 'Sciences Économiques & Gestion',
      studentsCount: 32,
      classAverage: 14.0,
    },

    // 1AC Classes
    {
      id: '1ac-grp1',
      yearId: '1AC',
      name: '1AC - Groupe 1 (BIOF)',
      nameAr: 'الأولى إعدادي - فوج 1',
      stream: 'Filière Internationale',
      studentsCount: 31,
      classAverage: 14.4,
    },
    {
      id: '1ac-grp2',
      yearId: '1AC',
      name: '1AC - Groupe 2 (Général)',
      nameAr: 'الأولى إعدادي - فوج 2',
      stream: 'Filière Générale',
      studentsCount: 31,
      classAverage: 13.5,
    },

    // 2AC Classes
    {
      id: '2ac-grp1',
      yearId: '2AC',
      name: '2AC - Groupe 1 (BIOF)',
      nameAr: 'الثانية إعدادي - فوج 1',
      stream: 'Filière Internationale',
      studentsCount: 29,
      classAverage: 14.1,
    },
    {
      id: '2ac-grp2',
      yearId: '2AC',
      name: '2AC - Groupe 2 (Général)',
      nameAr: 'الثانية إعدادي - فوج 2',
      stream: 'Filière Générale',
      studentsCount: 30,
      classAverage: 13.4,
    },

    // 1Bac Classes
    {
      id: '1bac-sm-1',
      yearId: '1Bac',
      name: '1Bac Sciences Math - Classe 1',
      nameAr: 'الأولى باك - علوم رياضية',
      stream: 'Sciences Mathématiques',
      studentsCount: 28,
      classAverage: 15.8,
    },
    {
      id: '1bac-se-1',
      yearId: '1Bac',
      name: '1Bac Sciences Exp. - Classe 1',
      nameAr: 'الأولى باك - علوم تجريبية',
      stream: 'Sciences Expérimentales (BIOF)',
      studentsCount: 29,
      classAverage: 14.7,
    },
  ];

  // LEVEL 3: Mock Peers Generator with our Core Demo Students placed at the top of their respective classes
  const getStudentsForClass = (classId: string): PeerStudent[] => {
    // 1. If Salma's class
    if (classId === 'tc-sc-a') {
      const salmaLive = students.find((s) => s.id === 'salma') || students[0];
      const gpa = calculateWeightedGPA(salmaLive.currentGrades, true);
      return [
        {
          id: 'salma',
          name: salmaLive.name,
          avatar: salmaLive.avatar,
          massarCode: salmaLive.massarCode,
          classId: 'tc-sc-a',
          gpa,
          isDemoStudent: true,
          activeModeLabel: '🎯 Target Lock: Ingénieur (ENSA/CPGE)',
          grades: salmaLive.currentGrades,
          lockedCareer: 'engineer',
        },
        {
          id: 'peer-tc-1',
          name: 'Ayoub El Fassi',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
          massarCode: 'G148902114',
          classId: 'tc-sc-a',
          gpa: 16.4,
          isDemoStudent: false,
          activeModeLabel: '🎯 Target Lock: Ingénieur',
          grades: { math: 17.5, physics: 16.0, svt: 14.5, french: 15.0, english: 16.0 },
        },
        {
          id: 'peer-tc-2',
          name: 'Meriem Alami',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
          massarCode: 'G142398410',
          classId: 'tc-sc-a',
          gpa: 15.8,
          isDemoStudent: false,
          activeModeLabel: '🎯 Target Lock: Médecine (FMP)',
          grades: { math: 14.5, physics: 15.5, svt: 17.0, french: 16.0, english: 15.5 },
        },
        {
          id: 'peer-tc-3',
          name: 'Omar Bennani',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256',
          massarCode: 'G145520981',
          classId: 'tc-sc-a',
          gpa: 14.3,
          isDemoStudent: false,
          activeModeLabel: '🧭 Mode Découverte: Sciences PC',
          grades: { math: 14.0, physics: 14.8, svt: 14.0, french: 14.5, english: 14.0 },
        },
        {
          id: 'peer-tc-4',
          name: 'Fatima-Zahra Chraibi',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
          massarCode: 'G149912034',
          classId: 'tc-sc-a',
          gpa: 16.1,
          isDemoStudent: false,
          activeModeLabel: '🎯 Target Lock: Architecte (ENA)',
          grades: { math: 15.5, physics: 15.0, svt: 15.0, french: 17.5, english: 16.5 },
        },
        {
          id: 'peer-tc-5',
          name: 'Mehdi Daoudi',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
          massarCode: 'G147789012',
          classId: 'tc-sc-a',
          gpa: 13.8,
          isDemoStudent: false,
          activeModeLabel: '🧭 Mode Découverte: SVT',
          grades: { math: 12.5, physics: 13.5, svt: 15.5, french: 14.0, english: 13.5 },
        },
      ];
    }

    // 2. If Youssef's class
    if (classId === '3ac-grp1') {
      const youssefLive = students.find((s) => s.id === 'youssef') || students[0];
      const gpa = calculateWeightedGPA(youssefLive.currentGrades, false);
      return [
        {
          id: 'youssef',
          name: youssefLive.name,
          avatar: youssefLive.avatar,
          massarCode: youssefLive.massarCode,
          classId: '3ac-grp1',
          gpa,
          isDemoStudent: true,
          activeModeLabel: '🧭 Mode Découverte: Sciences Math (93%)',
          grades: youssefLive.currentGrades,
          lockedCareer: 'engineer',
        },
        {
          id: 'peer-3ac-1',
          name: 'Kenza Kadiri',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          massarCode: 'R139982341',
          classId: '3ac-grp1',
          gpa: 15.9,
          isDemoStudent: false,
          activeModeLabel: '🎯 Target Lock: Médecine',
          grades: { math: 15.0, physics: 16.0, svt: 17.0, french: 16.0, english: 15.5 },
        },
        {
          id: 'peer-3ac-2',
          name: 'Hamza Filali',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
          massarCode: 'R135541098',
          classId: '3ac-grp1',
          gpa: 14.6,
          isDemoStudent: false,
          activeModeLabel: '🧭 Mode Découverte: TC Scientifique',
          grades: { math: 15.0, physics: 14.5, svt: 14.0, french: 14.5, english: 15.0 },
        },
        {
          id: 'peer-3ac-3',
          name: 'Zineb Idrissi',
          avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=256',
          massarCode: 'R131102948',
          classId: '3ac-grp1',
          gpa: 16.2,
          isDemoStudent: false,
          activeModeLabel: '🎯 Target Lock: Ingénieur',
          grades: { math: 17.0, physics: 16.5, svt: 14.0, french: 15.5, english: 16.0 },
        },
        {
          id: 'peer-3ac-4',
          name: 'Taha Berrada',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
          massarCode: 'R136654890',
          classId: '3ac-grp1',
          gpa: 13.4,
          isDemoStudent: false,
          activeModeLabel: '🧭 Mode Découverte: TC Technologique',
          grades: { math: 13.0, physics: 14.0, svt: 12.5, french: 13.5, english: 14.0 },
        },
      ];
    }

    // 3. If Amine's class
    if (classId === '2bac-pc-svt-1') {
      const amineLive = students.find((s) => s.id === 'amine') || students[0];
      const gpa = calculateWeightedGPA(amineLive.currentGrades, true);
      return [
        {
          id: 'amine',
          name: amineLive.name,
          avatar: amineLive.avatar,
          massarCode: amineLive.massarCode,
          classId: '2bac-pc-svt-1',
          gpa,
          isDemoStudent: true,
          activeModeLabel: '🧭 Post-Bac Matcher: Médecine FMP (92%)',
          grades: amineLive.currentGrades,
          lockedCareer: 'doctor',
        },
        {
          id: 'peer-2bac-1',
          name: 'Nizar Tazi',
          avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=256',
          massarCode: 'F138891045',
          classId: '2bac-pc-svt-1',
          gpa: 16.8,
          isDemoStudent: false,
          activeModeLabel: '🎯 Target Lock: Médecine (FMP)',
          grades: { math: 15.5, physics: 17.0, svt: 18.0, french: 16.0, english: 16.5 },
        },
        {
          id: 'peer-2bac-2',
          name: 'Ghita Benzekri',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
          massarCode: 'F132204918',
          classId: '2bac-pc-svt-1',
          gpa: 15.7,
          isDemoStudent: false,
          activeModeLabel: '🎯 Target Lock: Ingénieur ENSA',
          grades: { math: 16.0, physics: 16.5, svt: 15.0, french: 15.0, english: 16.0 },
        },
        {
          id: 'peer-2bac-3',
          name: 'Walid Mansour',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
          massarCode: 'F137781092',
          classId: '2bac-pc-svt-1',
          gpa: 14.8,
          isDemoStudent: false,
          activeModeLabel: '🎯 Target Lock: Pilote (ERA)',
          grades: { math: 15.0, physics: 15.5, svt: 14.0, french: 14.5, english: 17.0 },
        },
        {
          id: 'peer-2bac-4',
          name: 'Imane Slaoui',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
          massarCode: 'F130091243',
          classId: '2bac-pc-svt-1',
          gpa: 15.2,
          isDemoStudent: false,
          activeModeLabel: '🧭 Post-Bac Matcher: ENSA / FST',
          grades: { math: 15.0, physics: 15.5, svt: 15.5, french: 15.0, english: 15.0 },
        },
      ];
    }

    // Generic realistic Moroccan peers for any other class
    return [
      {
        id: `peer-${classId}-1`,
        name: 'Saad El Amrani',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
        massarCode: 'M130982711',
        classId,
        gpa: 15.4,
        isDemoStudent: false,
        activeModeLabel: '🎯 Target Lock: Ingénieur',
        grades: { math: 16.0, physics: 15.5, svt: 14.5, french: 15.0, english: 15.0 },
      },
      {
        id: `peer-${classId}-2`,
        name: 'Houda Berrada',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
        massarCode: 'M134490123',
        classId,
        gpa: 16.0,
        isDemoStudent: false,
        activeModeLabel: '🎯 Target Lock: Médecine',
        grades: { math: 15.0, physics: 16.0, svt: 17.0, french: 16.0, english: 16.0 },
      },
      {
        id: `peer-${classId}-3`,
        name: 'Reda Idrissi',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256',
        massarCode: 'M138810294',
        classId,
        gpa: 14.1,
        isDemoStudent: false,
        activeModeLabel: '🧭 Mode Découverte: Sciences',
        grades: { math: 14.0, physics: 14.5, svt: 13.5, french: 14.0, english: 14.5 },
      },
      {
        id: `peer-${classId}-4`,
        name: 'Leila Guessous',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
        massarCode: 'M136619024',
        classId,
        gpa: 15.1,
        isDemoStudent: false,
        activeModeLabel: '🎯 Target Lock: Architecture',
        grades: { math: 14.5, physics: 14.5, svt: 15.0, french: 16.5, english: 15.5 },
      },
      {
        id: `peer-${classId}-5`,
        name: 'Yassine Belhaj',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
        massarCode: 'M137701948',
        classId,
        gpa: 13.7,
        isDemoStudent: false,
        activeModeLabel: '🧭 Mode Découverte: Technique',
        grades: { math: 13.5, physics: 14.0, svt: 13.0, french: 13.5, english: 14.0 },
      },
    ];
  };

  // Find active student for Level 4
  const currentDemoStudent = students.find((s) => s.id === selectedStudentId);
  const activeClassStudents = getStudentsForClass(selectedClassId);
  const activeStudentInRoster = activeClassStudents.find((s) => s.id === selectedStudentId);

  // Active student grades state for Level 4
  const [localGrades, setLocalGrades] = useState<SubjectGrades>(
    currentDemoStudent?.currentGrades || activeStudentInRoster?.grades || {
      math: 15.2,
      physics: 16.0,
      svt: 14.5,
      french: 15.0,
      english: 16.5,
    }
  );

  // Sync grades whenever selectedStudentId changes
  useEffect(() => {
    if (currentDemoStudent) {
      setLocalGrades(currentDemoStudent.currentGrades);
    } else if (activeStudentInRoster) {
      setLocalGrades(activeStudentInRoster.grades);
    }
  }, [selectedStudentId, currentDemoStudent, activeStudentInRoster]);

  // Calculations for Level 4
  const isHighSchoolYear = selectedYearId === 'TC' || selectedYearId === '1Bac' || selectedYearId === '2Bac';
  const liveStudentGPA = calculateWeightedGPA(localGrades, isHighSchoolYear);

  // Subjects definition for Level 4
  const subjectsConfig: {
    key: keyof SubjectGrades;
    nameFr: string;
    nameAr: string;
    coef: number;
    icon: string;
    threshold: string;
  }[] = [
    {
      key: 'math',
      nameFr: 'Mathématiques',
      nameAr: 'الرياضيات',
      coef: isHighSchoolYear ? 7 : 5,
      icon: '📐',
      threshold: 'Seuil Ingénieur: ≥ 15.5',
    },
    {
      key: 'physics',
      nameFr: 'Physique-Chimie (PC)',
      nameAr: 'الفيزياء والكيمياء',
      coef: isHighSchoolYear ? 7 : 4,
      icon: '⚡',
      threshold: 'Seuil Ingénieur/Médecine: ≥ 15.0',
    },
    {
      key: 'svt',
      nameFr: 'Sciences de la Vie et de la Terre (SVT)',
      nameAr: 'علوم الحياة والأرض',
      coef: isHighSchoolYear ? 5 : 3,
      icon: '🧬',
      threshold: 'Seuil Médecine (FMP): ≥ 16.0',
    },
    {
      key: 'french',
      nameFr: 'Français',
      nameAr: 'اللغة الفرنسية',
      coef: 4,
      icon: '📚',
      threshold: 'Examen Régional / Concours',
    },
    {
      key: 'english',
      nameFr: 'Anglais',
      nameAr: 'اللغة الإنجليزية',
      coef: isHighSchoolYear ? 3 : 2,
      icon: '🌐',
      threshold: 'Seuil Pilote (ERA): ≥ 15.5',
    },
  ];

  const handleGradeChange = (key: keyof SubjectGrades, val: number) => {
    const clamped = Math.max(0, Math.min(20, Math.round(val * 10) / 10));
    const next = { ...localGrades, [key]: clamped };
    setLocalGrades(next);
    // Real-time reactive update into shared state
    onUpdateGrades(selectedStudentId, { [key]: clamped });
  };

  const handleSaveAndSync = () => {
    setIsSaving(true);
    onUpdateGrades(selectedStudentId, localGrades);
    setTimeout(() => {
      setIsSaving(false);
      const studentName = currentDemoStudent?.name || activeStudentInRoster?.name || 'l\'élève';
      showToast(
        `💾 Notes enregistrées & synchronisées avec le Passeport Élève de ${studentName} ! Trajectoire & alertes recalculées.`,
        'success'
      );
    }, 350);
  };

  // Hackathon Demo Trigger 1: Drop Math to 14.5 (Trigger -2% Alert)
  const handleTriggerMathDrop = () => {
    const next = { ...localGrades, math: 14.5 };
    setLocalGrades(next);
    onUpdateGrades(selectedStudentId, { math: 14.5 });
    const studentName = currentDemoStudent?.name || activeStudentInRoster?.name || 'l\'élève';
    showToast(
      `🚨 Simulation Baisse Math appliquée à ${studentName} (14.5/20) : Alerte Rouge Seuil Critique (-2%) déclenchée !`,
      'warning'
    );
  };

  // Hackathon Demo Trigger 2: Boost Math to 17.5 (Trigger Physics Rebalance)
  const handleTriggerMathBoost = () => {
    const next = { ...localGrades, math: 17.5 };
    setLocalGrades(next);
    onUpdateGrades(selectedStudentId, { math: 17.5 });

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
    });

    const studentName = currentDemoStudent?.name || activeStudentInRoster?.name || 'l\'élève';
    showToast(
      `🎉 Simulation Boost Math appliquée à ${studentName} (17.5/20) : Alerte d'Excellence & Rééquilibrage activés !`,
      'success'
    );
  };

  const getScoreBadge = (score: number) => {
    if (score >= 16) {
      return (
        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          ≥ 16 • Très Bien
        </span>
      );
    }
    if (score >= 12) {
      return (
        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          12-15.9 • Satisfaisant
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
        &lt; 12 • Sous Seuil
      </span>
    );
  };

  // Active object labels for breadcrumb
  const currentYearObj = gradeYears.find((y) => y.id === selectedYearId) || gradeYears[3];
  const currentClassObj = classesCatalog.find((c) => c.id === selectedClassId) || classesCatalog[4];
  const currentStudentObj = currentDemoStudent || activeStudentInRoster;

  // Filtered roster for Level 3
  const filteredRoster = activeClassStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.massarCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-900/30">
            <span className="text-lg">👨‍🏫</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white tracking-tight">
                Tawjih<span className="text-indigo-400">AI</span>
              </span>
              <span className="text-xs font-semibold text-slate-400">• Espace Enseignant (Massar 2.0)</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Prof. Mohammed Amrani • Navigation Hiérarchique 4 Niveaux
            </p>
          </div>
        </div>

        {/* Right Actions: API status & Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenApiKeyModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{hasApiKey ? 'IA Cloud Active' : 'IA Hors-Ligne'}</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-800/60 text-xs font-semibold transition-all shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion / Changer de compte</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* 🧭 INTERACTIVE 4-LEVEL BREADCRUMB NAVIGATION BAR */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl px-4 py-3 shadow-md flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap font-medium">
            {/* Step 1: Grade Years */}
            <button
              onClick={() => setCurrentLevel(1)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                currentLevel === 1
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>📅 Années Scolaires</span>
            </button>

            {/* Separator */}
            <span className="text-slate-600 font-bold">/</span>

            {/* Step 2: Classes */}
            <button
              onClick={() => {
                if (currentLevel >= 2) setCurrentLevel(2);
              }}
              disabled={currentLevel < 2}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                currentLevel === 2
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : currentLevel > 2
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                  : 'text-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>
                🏫 {currentLevel >= 2 ? currentYearObj.nameFr : 'Classes'}
              </span>
            </button>

            {/* Separator */}
            <span className="text-slate-600 font-bold">/</span>

            {/* Step 3: Students Roster */}
            <button
              onClick={() => {
                if (currentLevel >= 3) setCurrentLevel(3);
              }}
              disabled={currentLevel < 3}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                currentLevel === 3
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : currentLevel > 3
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                  : 'text-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>
                👥 {currentLevel >= 3 ? currentClassObj.name : 'Élèves'}
              </span>
            </button>

            {/* Separator */}
            <span className="text-slate-600 font-bold">/</span>

            {/* Step 4: Individual Student */}
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                currentLevel === 4
                  ? 'bg-emerald-600 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-600 opacity-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>
                📝 {currentLevel === 4 ? (currentStudentObj?.name || 'Fiche Élève') : 'Fiche de l\'Élève'}
              </span>
            </span>
          </div>

          {/* Current Drill-down indicator badge */}
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-800 text-indigo-300 border border-slate-700">
            Niveau {currentLevel} sur 4
          </span>
        </div>

        {/* ======================================================== */}
        {/* LEVEL 1: GRADE YEARS VIEW (Select the Academic Level)    */}
        {/* ======================================================== */}
        {currentLevel === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span>Niveau 1 : Sélection de l'Année Scolaire</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Choisissez un niveau d'enseignement pour forer vers les classes correspondantes du cycle secondaire marocain.
              </p>
            </div>

            {/* Section 1: Cycle Collégial (7th to 9th) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Cycle Secondaire Collégial (التعليم الثانوي الإعدادي)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gradeYears
                  .filter((y) => y.cycle === 'college')
                  .map((year) => (
                    <div
                      key={year.id}
                      onClick={() => {
                        setSelectedYearId(year.id);
                        // Pick first class of that year
                        const firstClass = classesCatalog.find((c) => c.yearId === year.id);
                        if (firstClass) setSelectedClassId(firstClass.id);
                        setCurrentLevel(2);
                      }}
                      className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900/90 cursor-pointer transition-all duration-200 flex flex-col justify-between group shadow-lg hover:shadow-indigo-950/40 relative overflow-hidden"
                    >
                      {year.demoStudent && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-bl-xl shadow-sm">
                          ⭐ Profil Démo Youssef
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-lg font-black text-indigo-400 font-mono">
                            {year.id}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {year.gradeNum}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                          {year.nameFr}
                        </h3>
                        <p className="text-xs text-slate-400 font-arabic mt-0.5">{year.nameAr}</p>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <span>🏫 {year.classesCount} Classes</span>
                          <span>👥 {year.studentsCount} Élèves</span>
                          <span className="text-emerald-400 font-bold font-mono">
                            {year.averageGpa}/20 Moy.
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
                        <span>Explorer les classes</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Section 2: Cycle Qualifiant / Lycée (10th to 12th) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>Cycle Secondaire Qualifiant / Lycée (التعليم الثانوي التأهيلي)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gradeYears
                  .filter((y) => y.cycle === 'lycee')
                  .map((year) => (
                    <div
                      key={year.id}
                      onClick={() => {
                        setSelectedYearId(year.id);
                        // Pick first class of that year
                        const firstClass = classesCatalog.find((c) => c.yearId === year.id);
                        if (firstClass) setSelectedClassId(firstClass.id);
                        setCurrentLevel(2);
                      }}
                      className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900/90 cursor-pointer transition-all duration-200 flex flex-col justify-between group shadow-lg hover:shadow-emerald-950/40 relative overflow-hidden"
                    >
                      {year.demoStudent && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-600 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-bl-xl shadow-sm">
                          ⭐ Profil Démo {year.id === 'TC' ? 'Salma' : 'Amine'}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-lg font-black text-emerald-400 font-mono">
                            {year.id}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {year.gradeNum}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                          {year.nameFr}
                        </h3>
                        <p className="text-xs text-slate-400 font-arabic mt-0.5">{year.nameAr}</p>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <span>🏫 {year.classesCount} Classes</span>
                          <span>👥 {year.studentsCount} Élèves</span>
                          <span className="text-emerald-400 font-bold font-mono">
                            {year.averageGpa}/20 Moy.
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
                        <span>Explorer les classes</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LEVEL 2: CLASSES VIEW (Select a Class inside that Year)  */}
        {/* ======================================================== */}
        {currentLevel === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <button
                  onClick={() => setCurrentLevel(1)}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:underline font-semibold mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour aux Années Scolaires</span>
                </button>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <School className="w-5 h-5 text-indigo-400" />
                  <span>Niveau 2 : Classes en {currentYearObj.nameFr} ({currentYearObj.gradeNum})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sélectionnez une division pour afficher la liste des élèves inscrits et gérer le carnet de notes.
                </p>
              </div>

              <span className="text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0 font-mono">
                {classesCatalog.filter((c) => c.yearId === selectedYearId).length} Classes Répertoriées
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {classesCatalog
                .filter((c) => c.yearId === selectedYearId)
                .map((cls) => (
                  <div
                    key={cls.id}
                    onClick={() => {
                      setSelectedClassId(cls.id);
                      // Set default student if demo is present
                      if (cls.hasDemoStudent) setSelectedStudentId(cls.hasDemoStudent);
                      setCurrentLevel(3);
                    }}
                    className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/70 hover:bg-slate-900/90 cursor-pointer transition-all duration-200 flex flex-col justify-between group shadow-lg hover:shadow-indigo-950/40 relative overflow-hidden"
                  >
                    {cls.hasDemoStudent && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-bl-xl shadow-sm">
                        ⭐ Contient {cls.demoStudentName}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-lg">
                          🏫
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                          Moy: {cls.classAverage}/20
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                        {cls.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-arabic mt-0.5">{cls.nameAr}</p>

                      <div className="mt-3 bg-slate-900/80 rounded-xl p-2.5 border border-slate-800/80 text-xs">
                        <span className="text-slate-400 block text-[11px]">Filière / Option :</span>
                        <span className="font-semibold text-slate-200">{cls.stream}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>👥 {cls.studentsCount} Élèves inscrits</span>
                      <span className="font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Voir la classe ➔
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LEVEL 3: CLASS STUDENT ROSTER (List of Students)         */}
        {/* ======================================================== */}
        {currentLevel === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <button
                  onClick={() => setCurrentLevel(2)}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:underline font-semibold mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour aux classes de {currentYearObj.nameFr}</span>
                </button>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span>Niveau 3 : Liste des Élèves — {currentClassObj.name}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentClassObj.stream} • Cliquez sur un élève pour ouvrir son carnet et saisir les notes du contrôle continu.
                </p>
              </div>

              {/* Search input in roster */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un élève..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Students Roster Table */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold bg-slate-900/70">
                      <th className="py-3.5 pl-4">Élève</th>
                      <th className="py-3.5">Code Massar</th>
                      <th className="py-3.5">Moyenne Actuelle</th>
                      <th className="py-3.5">Orientation / Mode IA</th>
                      <th className="py-3.5 pr-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 font-medium">
                    {filteredRoster.map((st) => (
                      <tr
                        key={st.id}
                        onClick={() => {
                          setSelectedStudentId(st.id);
                          setCurrentLevel(4);
                        }}
                        className={`hover:bg-slate-900/60 cursor-pointer transition-colors ${
                          st.isDemoStudent ? 'bg-indigo-950/20' : ''
                        }`}
                      >
                        {/* Student Name & Avatar */}
                        <td className="py-3.5 pl-4 flex items-center gap-3">
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className={`w-9 h-9 rounded-xl object-cover ring-2 ${
                              st.isDemoStudent ? 'ring-amber-400' : 'ring-slate-700'
                            }`}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{st.name}</span>
                              {st.isDemoStudent && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  ⭐ Profil Démo Actif
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">{currentClassObj.name}</span>
                          </div>
                        </td>

                        {/* Massar Code */}
                        <td className="py-3.5 font-mono text-slate-300">
                          {st.massarCode}
                        </td>

                        {/* GPA */}
                        <td className="py-3.5">
                          <span className="font-mono font-black text-sm text-emerald-400">
                            {st.gpa}/20
                          </span>
                        </td>

                        {/* AI Mode Status */}
                        <td className="py-3.5">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-slate-200 border border-slate-700 inline-block">
                            {st.activeModeLabel}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 pr-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudentId(st.id);
                              setCurrentLevel(4);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
                          >
                            <span>Ouvrir le dossier / Saisir les notes</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Affichage de <strong>{filteredRoster.length} élèves</strong> dans {currentClassObj.name}
                </span>
                <span className="text-emerald-400 font-medium">
                  Les profils avec ⭐ sont synchronisés en direct avec les comptes élèves du hackathon.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LEVEL 4: INDIVIDUAL STUDENT GRADEBOOK & OVERVIEW         */}
        {/* ======================================================== */}
        {currentLevel === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Back Navigation Bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentLevel(3)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-indigo-400" />
                <span>← Retour à la liste de la classe ({currentClassObj.name})</span>
              </button>

              <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 font-mono">
                Code Massar: {currentStudentObj?.massarCode}
              </span>
            </div>

            {/* Quick Hackathon Demo Triggers Toolbar (Placed right above the grade table) */}
            <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                  <div>
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider block">
                      Déclencheurs Hackathon en 1 Clic (Reactivité Live) :
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Simulez instantanément une baisse ou une hausse de la note de Maths pour déclencher les alertes d'orientation.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleTriggerMathDrop}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/70 hover:bg-red-900/90 text-red-200 border border-red-700/80 text-xs font-bold transition-all hover:scale-[1.02] shadow-sm"
                  >
                    <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                    <span>📉 Simuler chute en Maths (14.5/20 — Déclencher Alerte -2%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerMathBoost}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-200 border border-emerald-700/80 text-xs font-bold transition-all hover:scale-[1.02] shadow-sm"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>📈 Simuler hausse en Maths (17.5/20 — Déclencher Focus Physique)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Student Header Card */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-4">
                <img
                  src={currentStudentObj?.avatar}
                  alt={currentStudentObj?.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-xl"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {currentStudentObj?.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {currentClassObj.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {currentStudentObj?.massarCode}
                    </span>
                    {currentDemoStudent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        ⭐ Profil Démo Actif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Statut Orientation IA :{' '}
                    <strong className="text-emerald-400">
                      {currentDemoStudent?.targetThresholds.careerName || activeStudentInRoster?.activeModeLabel}
                    </strong>
                  </p>
                </div>
              </div>

              {/* GPA & Save Action */}
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-center min-w-[110px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Moyenne Estimée
                  </span>
                  <span className="text-2xl font-black text-emerald-400">
                    {liveStudentGPA}
                    <span className="text-xs text-slate-500 font-normal"> /20</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAndSync}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] shrink-0"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Synchronisation...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>💾 Enregistrer & Synchroniser avec le Passeport Élève</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Subject Grade Entry Table */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-indigo-400" />
                    <span>Saisie des Notes du Contrôle Continu (CC1, CC2, CC3 & Examen)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Modifiez les notes avec les champs numériques ou les curseurs. Les calculs de seuil s'ajustent en direct.
                  </p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 font-mono">
                  Échelle 0 à 20
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold bg-slate-900/60">
                      <th className="py-3.5 pl-4">Discipline</th>
                      <th className="py-3.5">Coef</th>
                      <th className="py-3.5">CC 1</th>
                      <th className="py-3.5">CC 2</th>
                      <th className="py-3.5">CC 3</th>
                      <th className="py-3.5">Examen</th>
                      <th className="py-3.5">Note Finale (/20)</th>
                      <th className="py-3.5">Curseur Rapide</th>
                      <th className="py-3.5 pr-4 text-right">Statut Seuil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 font-medium">
                    {subjectsConfig.map((sub) => {
                      const currentScore = localGrades[sub.key] ?? 10;
                      const cc1 = Math.max(0, Math.min(20, Number((currentScore - 0.4).toFixed(1))));
                      const cc2 = Math.max(0, Math.min(20, Number((currentScore + 0.3).toFixed(1))));
                      const cc3 = currentScore;
                      const examen = Math.max(0, Math.min(20, Number((currentScore + 0.1).toFixed(1))));

                      return (
                        <tr key={sub.key} className="hover:bg-slate-900/40 transition-colors">
                          {/* Subject */}
                          <td className="py-4 pl-4 flex items-center gap-2.5">
                            <span className="text-xl">{sub.icon}</span>
                            <div>
                              <span className="font-bold text-slate-200 block">{sub.nameFr}</span>
                              <span className="text-[10px] text-slate-400 font-arabic">{sub.nameAr}</span>
                            </div>
                          </td>

                          {/* Coef */}
                          <td className="py-4 font-mono">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[11px]">
                              x{sub.coef}
                            </span>
                          </td>

                          {/* CC 1 */}
                          <td className="py-4 font-mono text-slate-400">
                            {cc1}/20
                          </td>

                          {/* CC 2 */}
                          <td className="py-4 font-mono text-slate-400">
                            {cc2}/20
                          </td>

                          {/* CC 3 */}
                          <td className="py-4 font-mono text-slate-400">
                            {cc3}/20
                          </td>

                          {/* Examen */}
                          <td className="py-4 font-mono text-slate-400">
                            {examen}/20
                          </td>

                          {/* Final Grade Input */}
                          <td className="py-4">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.1"
                                value={currentScore}
                                onChange={(e) =>
                                  handleGradeChange(sub.key, parseFloat(e.target.value) || 0)
                                }
                                className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono font-bold text-center text-xs focus:outline-none focus:border-indigo-500"
                              />
                              <span className="text-slate-500 font-mono">/20</span>
                            </div>
                          </td>

                          {/* Rapid Slider */}
                          <td className="py-4 w-36">
                            <input
                              type="range"
                              min="0"
                              max="20"
                              step="0.1"
                              value={currentScore}
                              onChange={(e) =>
                                handleGradeChange(sub.key, parseFloat(e.target.value))
                              }
                              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                          </td>

                          {/* Status Pill */}
                          <td className="py-4 pr-4 text-right">
                            {getScoreBadge(currentScore)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    Synchronisation temps réel avec le Passeport Élève et les algorithmes de prédiction.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAndSync}
                  className="text-indigo-400 hover:underline font-bold"
                >
                  Sauvegarder & Valider ce dossier ➔
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
