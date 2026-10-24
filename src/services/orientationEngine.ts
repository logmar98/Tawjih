import {
  StudentProfile,
  SubjectGrades,
  CareerGoal,
  CareerMatch,
  StreamRecommendation,
  AIAlert,
} from '../types/student';

// Coefficients based on Moroccan Curriculum
export function calculateWeightedGPA(grades: SubjectGrades, isHighSchool: boolean = false): number {
  if (isHighSchool) {
    const totalPoints =
      grades.math * 7 +
      grades.physics * 7 +
      grades.svt * 5 +
      grades.french * 4 +
      grades.english * 3;
    const totalCoef = 7 + 7 + 5 + 4 + 3;
    return Number((totalPoints / totalCoef).toFixed(2));
  } else {
    // Collège (1AC - 3AC)
    const totalPoints =
      grades.math * 5 +
      grades.physics * 4 +
      grades.svt * 3 +
      grades.french * 4 +
      grades.english * 2;
    const totalCoef = 5 + 4 + 3 + 4 + 2;
    return Number((totalPoints / totalCoef).toFixed(2));
  }
}

// Post-Bac Career Matching Engine
export function getCareerMatches(grades: SubjectGrades): CareerMatch[] {
  // 1. Engineering (ENSA, CPGE, UM6P, EMI)
  // Weights: Math 50%, PC 40%, English 10%
  const engScore = (grades.math * 0.50 + grades.physics * 0.40 + grades.english * 0.10);
  const engPercentage = Math.min(100, Math.max(20, Math.round((engScore / 17.5) * 100)));

  // 2. Medicine / FMP / FMD (Faculté de Médecine et de Pharmacie)
  // Weights: SVT 45%, PC 35%, Math 12%, French 8%
  const medScore = (grades.svt * 0.45 + grades.physics * 0.35 + grades.math * 0.12 + grades.french * 0.08);
  const medPercentage = Math.min(100, Math.max(20, Math.round((medScore / 17.5) * 100)));

  // 3. Pilot (ERA - École Royale de l'Air / AIAC Aviation Civile)
  // Weights: Math 35%, PC 35%, English 20%, French 10%
  const pilotScore = (grades.math * 0.35 + grades.physics * 0.35 + grades.english * 0.20 + grades.french * 0.10);
  const pilotPercentage = Math.min(100, Math.max(20, Math.round((pilotScore / 17.5) * 100)));

  return [
    {
      id: 'doctor',
      title: 'Médecine & Pharmacie (FMP / FMD)',
      titleAr: 'الطب والصيدلة وطب الأسنان',
      icon: '👨‍⚕️',
      institutions: ['FMP Casablanca', 'FMP Rabat', 'UM6SS', 'FMD'],
      matchPercentage: medPercentage,
      status: medPercentage >= 85 ? 'optimal' : medPercentage >= 70 ? 'achievable' : 'at_risk',
      readinessExplanation: `Excellent alignement biologique et biochimique (SVT: ${grades.svt}/20, PC: ${grades.physics}/20).`,
      keyRequirements: 'SVT ≥ 16.0, PC ≥ 15.0, Note Concours Commun FMP/FMD',
      formulaDescription: 'Pondération: 45% SVT + 35% Physique-Chimie + 12% Math + 8% Français',
      rebalanceTip: grades.math < 14 ? 'Renforcer les bases de probabilités et biostatistiques en Mathématiques.' : 'Maintenir le rythme en SVT et annales du concours FMP.',
    },
    {
      id: 'engineer',
      title: "Ingénieur d'État (ENSA / CPGE / UM6P)",
      titleAr: 'الهندسة والمدارس الوطنية الكبرى',
      icon: '👷‍♂️',
      institutions: ['CPGE (MPSI/PCSI)', 'ENSA', 'ENSAM', 'UM6P - SAP+D / CS'],
      matchPercentage: engPercentage,
      status: engPercentage >= 85 ? 'optimal' : engPercentage >= 70 ? 'achievable' : 'at_risk',
      readinessExplanation: `Profil quantitatif et analytique (Math: ${grades.math}/20, PC: ${grades.physics}/20).`,
      keyRequirements: 'Math ≥ 15.5, PC ≥ 15.0, Seuil de présélection CPGE / ENSA',
      formulaDescription: 'Pondération: 50% Mathématiques + 40% Physique-Chimie + 10% Anglais',
      rebalanceTip: grades.math < 15.5 ? 'Alerte Seuil: Math sous 15.5. Priorité absolue aux devoirs surveillés.' : 'Très solide en Math. Maximiser la vitesse de résolution en Physique.',
    },
    {
      id: 'pilot',
      title: 'Pilote de Ligne & Aviation (ERA / AIAC)',
      titleAr: 'طيران مدني وعسكري (المدرسة الملكية الجوية)',
      icon: '✈️',
      institutions: ['ERA Marrakech', 'AIAC Mohammed VI', 'CFP Nouaceur'],
      matchPercentage: pilotPercentage,
      status: pilotPercentage >= 85 ? 'optimal' : pilotPercentage >= 70 ? 'achievable' : 'at_risk',
      readinessExplanation: `Compétences spatio-temporelles et bilinguisme technique (Anglais: ${grades.english}/20, PC: ${grades.physics}/20).`,
      keyRequirements: 'Math ≥ 15.0, PC ≥ 15.0, Anglais ≥ 15.5, Aptitude médicale classe 1',
      formulaDescription: 'Pondération: 35% Math + 35% PC + 20% Anglais + 10% Français',
      rebalanceTip: grades.english < 15 ? 'Renforcer le vocabulaire ICAO en anglais et la fluidité orale.' : 'Excellente maîtrise linguistique et scientifique.',
    },
  ];
}

// Collège & Tronc Commun Stream Recommendation Engine
export function getStreamRecommendations(grades: SubjectGrades): StreamRecommendation[] {
  // Tronc Commun Scientifique -> Sciences Mathématiques
  const mathScore = (grades.math * 0.55 + grades.physics * 0.45);
  const smMatch = Math.min(99, Math.max(30, Math.round((mathScore / 18.0) * 100)));

  // Sciences Physiques (PC)
  const pcScore = (grades.physics * 0.50 + grades.math * 0.35 + grades.svt * 0.15);
  const pcMatch = Math.min(98, Math.max(35, Math.round((pcScore / 17.0) * 100)));

  // SVT (Sciences de la Vie et de la Terre)
  const svtScore = (grades.svt * 0.55 + grades.physics * 0.25 + grades.math * 0.20);
  const svtMatch = Math.min(98, Math.max(30, Math.round((svtScore / 17.0) * 100)));

  return [
    {
      id: 'sc_math',
      name: 'Tronc Commun Scientifique ➔ Sciences Mathématiques (A & B)',
      nameAr: 'جذع مشترك علمي ➔ شعبة العلوم الرياضية',
      cycle: 'bac_stream',
      matchPercentage: smMatch,
      suitability: smMatch >= 85 ? 'highly_recommended' : smMatch >= 70 ? 'recommended' : 'challenging',
      description: 'Voie royale pour les classes préparatoires (CPGE MPSI), les grandes écoles d’ingénieurs et les carrières aérospatiales et data.',
      highlightedSubjects: ['Mathématiques (Coef 9)', 'Physique-Chimie (Coef 7)'],
      keyStrengths: `Score d'aptitude Math/PC: ${((grades.math + grades.physics) / 2).toFixed(1)}/20`,
    },
    {
      id: 'sc_physiques',
      name: 'Sciences Physiques (PC - مسلك العلوم الفيزيائية)',
      nameAr: 'مسلك العلوم الفيزيائية',
      cycle: 'bac_stream',
      matchPercentage: pcMatch,
      suitability: pcMatch >= 80 ? 'highly_recommended' : 'recommended',
      description: 'L’équilibre parfait entre modélisation expérimentale et abstraction mathématique. Ouvre ENSA, médecine, architecture et universités.',
      highlightedSubjects: ['Physique-Chimie (Coef 7)', 'Mathématiques (Coef 7)', 'SVT (Coef 5)'],
      keyStrengths: `Score expérimental PC: ${grades.physics}/20, Math: ${grades.math}/20`,
    },
    {
      id: 'svt',
      name: 'Sciences de la Vie et de la Terre (SVT - علوم الحياة والأرض)',
      nameAr: 'مسلك علوم الحياة والأرض',
      cycle: 'bac_stream',
      matchPercentage: svtMatch,
      suitability: svtMatch >= 80 ? 'highly_recommended' : 'recommended',
      description: 'Filière idéale pour les carrières médicales, biotechnologies, pharmacie, agronomie (IAV Hassan II) et sciences de l’environnement.',
      highlightedSubjects: ['SVT (Coef 7)', 'Physique-Chimie (Coef 5)', 'Mathématiques (Coef 5)'],
      keyStrengths: `Score biologie/géologie SVT: ${grades.svt}/20`,
    },
  ];
}

// Target Lock Readiness & Alert Engine
export function evaluateTargetLock(
  student: StudentProfile,
  grades: SubjectGrades
): {
  readinessPercentage: number;
  primaryAlert: AIAlert;
  thresholdMath: number;
  thresholdPhysics: number;
  thresholdSvt?: number;
  mathDiff: number;
  physicsDiff: number;
} {
  const career = student.lockedCareer;
  const thresholds = student.targetThresholds.subjects;

  let readiness = 80;
  let alert: AIAlert;

  const thresholdMath = thresholds.math || 15.5;
  const thresholdPhysics = thresholds.physics || 15.0;
  const thresholdSvt = thresholds.svt || 15.0;

  const mathDiff = Number((grades.math - thresholdMath).toFixed(1));
  const physicsDiff = Number((grades.physics - thresholdPhysics).toFixed(1));

  if (career === 'engineer') {
    // Target: Math >= 15.5, PC >= 15.0
    const rawScore = (grades.math * 0.52 + grades.physics * 0.38 + grades.english * 0.10);
    readiness = Math.min(99, Math.max(35, Math.round((rawScore / 17.5) * 100)));

    if (grades.math < thresholdMath) {
      // 🔴 RED STOP & FIX ALERT
      const gapPercent = Math.round(((thresholdMath - grades.math) / thresholdMath) * 100);
      alert = {
        type: 'critical',
        title: '🛑 STOP HERE: Seuil Critique Mathématiques Détecté',
        message: `Your Math score (${grades.math}/20) is ${gapPercent}% below the required threshold (${thresholdMath}/20) for Engineering School (CPGE / ENSA / UM6P). Prioritize Math before your next exam!`,
        gapPercentage: gapPercent,
        actionItem: `Planifier 3 séances de révision ciblées (Analyse / Suites / Géométrie vectorielle) et faire 2 examens blancs avant le Contrôle Continu 2.`,
        subjectBadge: `Math: ${grades.math}/20 (Seuil: ${thresholdMath})`,
      };
    } else if (grades.math >= 16.5) {
      // 🟢 GREEN SMART REBALANCE ALERT
      alert = {
        type: 'success',
        title: `✅ HIGH PROBABILITY (${readiness}%): Seuil d'Excellence Atteint en Mathématiques`,
        message: `Your Math score (${grades.math}/20) puts you solidly on track for Engineering School! Shift your study focus toward Physics (PC) right now to maximize your admission score.`,
        actionItem: `Votre avance en mathématiques vous permet d'allouer 40% de temps supplémentaire à la Physique-Chimie (Électricité & Ondes) pour viser le Top 5% aux concours.`,
        subjectBadge: `Math: ${grades.math}/20 (+${mathDiff} pts au-dessus du seuil)`,
      };
    } else {
      // Amber Warning / Borderline
      alert = {
        type: 'warning',
        title: `⚠️ ZONE DE SÉCURITÉ: Mathématiques Conformes (${readiness}%)`,
        message: `Votre note de Math (${grades.math}/20) franchit tout juste le seuil (${thresholdMath}/20). Maintenez la rigueur pour ne pas glisser dans la zone de risque.`,
        actionItem: `Sécurisez vos notes de contrôles continus en évitant les erreurs de calcul élémentaires.`,
        subjectBadge: `Math: ${grades.math}/20 (En marge de +${mathDiff})`,
      };
    }
  } else if (career === 'doctor') {
    // Target: SVT >= 16.0, PC >= 15.0, Math >= 14.0
    const rawScore = (grades.svt * 0.45 + grades.physics * 0.35 + grades.math * 0.12 + grades.french * 0.08);
    readiness = Math.min(99, Math.max(35, Math.round((rawScore / 17.5) * 100)));

    if (grades.svt < thresholdSvt) {
      const gapPercent = Math.round(((thresholdSvt - grades.svt) / thresholdSvt) * 100);
      alert = {
        type: 'critical',
        title: '🛑 STOP HERE: Seuil SVT Insuffisant pour la Médecine',
        message: `Your SVT score (${grades.svt}/20) is ${gapPercent}% below the required benchmark (${thresholdSvt}/20) for FMP / FMD. Prioritize Genetics & Geology review!`,
        gapPercentage: gapPercent,
        actionItem: `Revoir la méthodologie de synthèse et d'analyse des documents expérimentaux en SVT.`,
        subjectBadge: `SVT: ${grades.svt}/20 (Seuil: ${thresholdSvt})`,
      };
    } else if (grades.svt >= 17.0 && grades.physics >= 15.5) {
      alert = {
        type: 'success',
        title: `✅ ADMISSION PROBABLE (${readiness}%): Profil Médical d'Élite`,
        message: `Your SVT score (${grades.svt}/20) and Physics (${grades.physics}/20) place you in the top candidate tier for Faculté de Médecine! Rebalance your study towards QCM speed.`,
        actionItem: `Commencer l'entraînement chronométré aux QCMs du Concours Commun FMP dès ce trimestre.`,
        subjectBadge: `SVT: ${grades.svt}/20 • PC: ${grades.physics}/20`,
      };
    } else {
      alert = {
        type: 'warning',
        title: `⚠️ TRAJECTOIRE EN COURS (${readiness}%): Médecine Accessible`,
        message: `Votre moyenne en SVT (${grades.svt}/20) est au seuil requis. Renforcez la Chimie organique pour garantir le concours.`,
        actionItem: `Travailler les annales de chimie et biologie cellulaire.`,
        subjectBadge: `SVT: ${grades.svt}/20`,
      };
    }
  } else {
    // Pilot (ERA / AIAC)
    const rawScore = (grades.math * 0.35 + grades.physics * 0.35 + grades.english * 0.20 + grades.french * 0.10);
    readiness = Math.min(99, Math.max(35, Math.round((rawScore / 17.5) * 100)));

    if (grades.english < 15.0 || grades.math < 15.0) {
      alert = {
        type: 'critical',
        title: '🛑 ALERTE SEUIL: Profil Aéronautique Déficitaire',
        message: `Les écoles de pilotage (ERA / AIAC) exigent l'excellence simultanée en Math (${grades.math}/20) et Anglais (${grades.english}/20). Priorité immédiate!`,
        actionItem: `Travailler le raisonnement trigonométrique et les tests psychotechniques d'anglais aéronautique.`,
        subjectBadge: `Math: ${grades.math}/20 • Anglais: ${grades.english}/20`,
      };
    } else {
      alert = {
        type: 'success',
        title: `✅ HAUTE ÉLIGIBILITÉ (${readiness}%): Profil Pilote Validé`,
        message: `Vos scores en Math (${grades.math}/20), Physique (${grades.physics}/20) et Anglais (${grades.english}/20) satisfont aux critères stricts de l'ERA.`,
        actionItem: `Préparer le dossier médical aéronautique et maintenir l'endurance physique.`,
        subjectBadge: `Anglais: ${grades.english}/20 • Math: ${grades.math}/20`,
      };
    }
  }

  return {
    readinessPercentage: readiness,
    primaryAlert: alert,
    thresholdMath,
    thresholdPhysics,
    thresholdSvt,
    mathDiff,
    physicsDiff,
  };
}
