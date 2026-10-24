import { StudentProfile, SubjectGrades, CareerGoal } from '../types/student';
import { evaluateTargetLock, calculateWeightedGPA } from './orientationEngine';

export interface AIResponse {
  content: string;
  isFallback: boolean;
  modelUsed: string;
}

const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
];

export async function askTawjihAI(
  userQuery: string,
  student: StudentProfile,
  currentGrades: SubjectGrades,
  apiKey?: string
): Promise<AIResponse> {
  const gpa = calculateWeightedGPA(
    currentGrades,
    student.currentLevel === 'TC' || student.currentLevel === '1Bac' || student.currentLevel === '2Bac'
  );
  const targetEval = evaluateTargetLock(student, currentGrades);

  // 1. Try Python google-genai Backend first (powered by gemma-4-26b-a4b-it via client.models.generate_content)
  try {
    const backendRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: userQuery,
        apiKey: apiKey?.trim(),
        student,
        currentGrades,
      }),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data?.content) {
        return {
          content: data.content,
          isFallback: false,
          modelUsed: data.modelUsed || 'gemma-4-26b-a4b-it (google-genai)',
        };
      }
    }
  } catch (backendErr) {
    console.info('Local google-genai backend not reachable, checking direct browser endpoint:', backendErr);
  }

  // 2. Direct browser fallback using Google Gemini API
  if (apiKey && apiKey.trim().length > 10) {
    const cleanKey = apiKey.trim();
    const systemContext = `
You are Tawjih AI (The Moroccan Education GPS / منصة توجيه الذكية), an elite AI academic orientation advisor specialized in the Moroccan secondary school system (from 7th grade / 1AC to 12th grade / 2ème Bac).
You are currently advising student ${student.name} in ${student.levelLabel} (${student.school}, ${student.city}).
Current Grades: Math: ${currentGrades.math}/20, Physics-Chemistry (PC): ${currentGrades.physics}/20, SVT: ${currentGrades.svt}/20, French: ${currentGrades.french}/20, English: ${currentGrades.english}/20.
Target Career: ${student.lockedCareer} (Readiness: ${targetEval.readinessPercentage}%).
Alerte: ${targetEval.primaryAlert.title} - ${targetEval.primaryAlert.message}

Rules:
1. Always ground your answer in these exact current grades.
2. Use precise Moroccan educational terminology (Tronc Commun Scientifique, Sciences Mathématiques A/B, Sciences Physiques, SVT, CPGE, ENSA, FMP, Concours Commun, Seuils Massar).
3. Be inspiring, data-driven, strategic, and practical.
4. Keep answers concise with clear bullet points.
`;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemContext}\n\nStudent asks: ${userQuery}` }],
                },
              ],
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 800,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const parts = data?.candidates?.[0]?.content?.parts || [];
          const text = parts
            .map((p: any) => p.text)
            .filter(Boolean)
            .join('\n');

          if (text && text.trim().length > 0) {
            return {
              content: text,
              isFallback: false,
              modelUsed: `Google ${model} (Cloud)`,
            };
          }
        }
      } catch (err) {
        console.warn(`Attempt with ${model} failed:`, err);
      }
    }
  }

  // 3. Smart Deterministic Fallback Engine (100% offline, bulletproof for live demo)
  const fallback = generateSmartFallback(userQuery, student, currentGrades, gpa, targetEval);
  return {
    content: fallback,
    isFallback: true,
    modelUsed: 'Tawjih Neural Engine (Offline Deterministic Fallback)',
  };
}

function generateSmartFallback(
  query: string,
  student: StudentProfile,
  grades: SubjectGrades,
  gpa: number,
  targetEval: ReturnType<typeof evaluateTargetLock>
): string {
  const q = query.toLowerCase();

  // Query 1: Tronc Commun / Stream orientation (Sciences Math vs PC vs SVT)
  if (
    q.includes('stream') ||
    q.includes('tronc commun') ||
    q.includes('science math') ||
    q.includes('svt') ||
    q.includes('filière') ||
    q.includes('choisir') ||
    q.includes('7th') ||
    q.includes('9th')
  ) {
    const mathAvg = grades.math;
    const pcAvg = grades.physics;
    const svtAvg = grades.svt;
    const stemAverage = ((mathAvg + pcAvg) / 2).toFixed(1);

    if (mathAvg >= 16 && pcAvg >= 15.5) {
      return `🧭 **Recommandation Stratégique Tawjih AI pour ${student.name} :**

En analysant votre relevé de notes actuel en **${student.levelLabel}** :
- **Mathématiques :** \`${mathAvg}/20\`
- **Physique-Chimie (PC) :** \`${pcAvg}/20\`
- **SVT :** \`${svtAvg}/20\`
- **Indice STEM (Math + PC) :** \`${stemAverage}/20\`

### 🏆 Choix N°1 : Tronc Commun Scientifique ➔ **Sciences Mathématiques (SM)**
Avec un indice STEM de **${stemAverage}/20**, vous êtes dans le **Top 5%** des profils éligibles à la filière Sciences Mathématiques A/B (مسلك العلوم الرياضية). C'est la voie royale pour intégrer les classes préparatoires (**CPGE MPSI**) et les Grandes Écoles d'Ingénieurs (**ENSA, ENSAM, UM6P**).

> **Conseil GPS :** Même si votre SVT est à \`${svtAvg}/20\`, la filière SM valorise le coefficient 9 en Math et 7 en PC. Vous avez déjà la vitesse analytique nécessaire !`;
    } else if (svtAvg >= 16.5) {
      return `🧭 **Diagnostic d'Orientation Tawjih AI :**

Pour votre profil en **${student.levelLabel}** :
- **SVT :** \`${svtAvg}/20\` (Excellence remarquable)
- **Physique-Chimie :** \`${pcAvg}/20\`
- **Mathématiques :** \`${mathAvg}/20\`

### 🌿 Choix N°1 : **Sciences Expérimentales (Option SVT / PC)**
Votre affinité biologique (\`${svtAvg}/20\`) combinée à la Physique (\`${pcAvg}/20\`) trace une trajectoire parfaite vers les facultés de **Médecine et de Pharmacie (FMP/FMD)**, les biotechnologies ou l'Institut Agronomique et Vétérinaire (**IAV Hassan II**).`;
    } else {
      return `🧭 **Diagnostic d'Orientation Tawjih AI :**

Avec **Math :** \`${mathAvg}/20\`, **PC :** \`${pcAvg}/20\`, et **SVT :** \`${svtAvg}/20\`, le **Tronc Commun Scientifique** classique vous assure une polyvalence totale. Vous gardez ouvertes toutes les passerelles vers Sciences PC ou Sciences SVT au Baccalauréat.`;
    }
  }

  // Query 2: Probability drop / Math test explanation
  if (
    q.includes('drop') ||
    q.includes('chut') ||
    q.includes('pourquoi') ||
    q.includes('why') ||
    q.includes('math test') ||
    q.includes('baisse')
  ) {
    const diff = (targetEval.thresholdMath - grades.math).toFixed(1);
    if (grades.math < targetEval.thresholdMath) {
      return `📉 **Explication Algorithmique du Score de Préparation :**

Votre probabilité d'admission pour l'objectif **${targetEval.primaryAlert.subjectBadge || 'Ingénieur'}** a réagi immédiatement suite à votre dernière note de Mathématiques :
- **Note actuelle enregistrée :** \`${grades.math}/20\`
- **Seuil minimal recommandé (CPGE/ENSA) :** \`${targetEval.thresholdMath}/20\`
- **Écart critique :** \`-${diff} points\` (${targetEval.primaryAlert.gapPercentage}% en-dessous de l'optimum).

Les algorithmes de présélection de la plateforme Massar pour les écoles d'ingénieurs appliquent un coefficient prépondérant sur les Mathématiques. Une variation de seulement 1 à 2 points impacte directement votre rang percentile.

> **Action Immédiate :** Travaillez les 2 prochains devoirs surveillés pour remonter à \`≥ 16.0/20\`. Dès que vous atteindrez 16.5, l'alerte verte d'optimisation se déclenchera automatiquement !`;
    } else {
      return `📈 **Statut Actuel : Trajectoire Positive !**

Votre note actuelle de Mathématiques est de \`${grades.math}/20\`, ce qui dépasse le seuil minimal de \`${targetEval.thresholdMath}/20\` de **+${(grades.math - targetEval.thresholdMath).toFixed(1)} points** ! Votre probabilité d'admission globale est à **${targetEval.readinessPercentage}%**.`;
    }
  }

  // Query 3: Doctor vs Engineer vs Pilot eligibility based on current points
  if (
    q.includes('doctor') ||
    q.includes('médecin') ||
    q.includes('engineer') ||
    q.includes('ingénieur') ||
    q.includes('pilot') ||
    q.includes('pilote') ||
    q.includes('points') ||
    q.includes('devenir')
  ) {
    return `🎯 **Simulateur d'Éligibilité Carrière Tawjih AI (Relevé Instantané) :**

Basé sur vos notes actuelles en **${student.levelLabel}** (Moyenne Générale : \`${gpa}/20\`) :

1. **👷‍♂️ Ingénieur d'État (ENSA / CPGE / UM6P) :**
   - Éligibilité : **${targetEval.readinessPercentage}%**
   - Facteurs clés : Math (\`${grades.math}/20\`) + PC (\`${grades.physics}/20\`).
   - Condition : ${grades.math >= 15.5 ? '✅ Seuil franchi avec succès.' : '⚠️ Math sous le seuil optimal (15.5/20).'}

2. **👨‍⚕️ Médecin / Pharmacien (FMP / FMD) :**
   - Éligibilité : **${grades.svt >= 16 ? '92%' : '74%'}**
   - Facteurs clés : SVT (\`${grades.svt}/20\`) + PC (\`${grades.physics}/20\`).
   - Condition : ${grades.svt >= 16.0 ? '✅ Excellente maîtrise des disciplines de la santé.' : '⚠️ Renforcer le score en SVT pour le concours commun.'}

3. **✈️ Pilote de Ligne / Aviation (ERA Marrakech / AIAC) :**
   - Éligibilité : **${grades.english >= 15 && grades.math >= 15 ? '88%' : '68%'}**
   - Facteurs clés : Anglais (\`${grades.english}/20\`) + Math (\`${grades.math}/20\`) + PC (\`${grades.physics}/20\`).

> **Verdict du GPS :** ${grades.math >= 16 ? 'Votre profil quantitatif vous oriente prioritairement vers l’Ingénierie de pointe.' : grades.svt >= 16.5 ? 'Votre profil vous qualifie directement pour le concours des Facultés de Médecine.' : 'Votre polyvalence vous permet de choisir votre spécialité d’ici le prochain semestre.'}`;
  }

  // General questions fallback
  return `🤖 **Analyse Tawjih AI personnalisée pour ${student.name} :**

Vous êtes actuellement en **${student.levelLabel}** avec une moyenne globale estimée à **${gpa}/20**.
Vos notes actuelles :
- **Mathématiques :** \`${grades.math}/20\`
- **Physique-Chimie (PC) :** \`${grades.physics}/20\`
- **SVT :** \`${grades.svt}/20\`
- **Français :** \`${grades.french}/20\`
- **Anglais :** \`${grades.english}/20\`

**Indicateur Clé :**
Votre objectif verrouillé est **"${student.targetThresholds.careerName}"** avec un indice de préparation de **${targetEval.readinessPercentage}%**.

${targetEval.primaryAlert.message}

N'hésitez pas à me poser une question précise sur vos filières (Sciences Math vs PC vs SVT), vos chances aux concours (ENSA, CPGE, FMP, ERA) ou la façon de booster votre moyenne !`;
}
