# 🧭 Tawjih AI (The GPS for Education) 🇲🇦
### *Portail National d'Orientation Intelligente & Passeport Statistique Longitudinal (Massar 2.0)*

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google GenAI SDK](https://img.shields.io/badge/Google_GenAI-Official_SDK-4285f4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Model](https://img.shields.io/badge/LLM-Gemma_4_26B_IT-8e44ad?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

---
### 🎥 Démo Vidéo • Video Walkthrough

<p align="center">
  <video src="./video/vd.mp4" controls="controls" width="100%" style="max-height: 520px; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <source src="./video/vd.mp4" type="video/mp4">
    Votre navigateur ne supporte pas la balise vidéo. <a href="./video/vd.mp4">Cliquez ici pour voir la vidéo de démonstration (video/vd.mp4)</a>.
  </video>
</p>

> 🎬 **Aperçu Démo :** *Démonstration complète montrant la navigation hiérarchique à 4 niveaux de l'Espace Enseignant, la simulation de chute/hausse des notes de Mathématiques, et la réactivité instantanée du Passeport Élève avec les alertes IA.*

---

> ### ⚡ Executive Summary • Quick Look (TL;DR)
>
> 🧭 **Tawjih AI** is the first Moroccan longitudinal academic tracking and AI-driven orientation platform designed for students from **7th Grade (1ère Année Collège - 1AC)** to **12th Grade (2ème Bac)**.
>
> | Dimension | Quick Look & Core Impact |
> | :--- | :--- |
> | **⚠️ The Problem** | **The Moroccan Orientation Crisis:** Millions of students choose high school streams (*Tronc Commun, Sc. Math, PC, SVT*) and higher education paths blindly due to peer pressure, isolated semester report cards, and **zero longitudinal tracking** connecting early grade drops directly to Moroccan university entrance thresholds (*CPGE, ENSA, FMP, ERA*). |
> | **💡 The Solution** | **The GPS for Education:** A modern Massar 2.0 ecosystem combining an interactive **4-level hierarchical Teacher Workspace** (`📅 Années > 🏫 Classes > 👥 Élèves > 📝 Notes`) with a **6-year Student Statistical Passport** that continuously recalculates career feasibility and subject trajectories in real time whenever marks are entered. |
> | **🤖 The AI Assistant (*Al-Mouwajih*)** | **Dual-Mode Hybrid Engine:** Features **Discovery Mode** (bottom-up cluster matching for undecided pupils) and **Target Lock Mode** (top-down goal tracking with live Career Readiness %, 🔴 **"Stop & Fix"** alerts when Math drops below target, and 🟢 **"Smart Rebalance"** study schedules), backed by an intelligent bilingual advisor powered by **Google Gemma 4 26B** (`gemma-4-26b-a4b-it`) via the official `google-genai` SDK. |

---

## 1. ⚠️ Problem: The Moroccan Academic Orientation Crisis (*Tawjih*)

In the Moroccan national education system, the academic path from **7th Grade (1ère Année Collège - 1AC)** to **12th Grade (2ème Bac)** represents a high-stakes, 6-year developmental pipeline. However, millions of students navigate critical milestone decisions virtually blind:

- **The Orientation Dead-End:** At two critical junctures—the transition from **3ème Année Collège (9th grade)** to **Tronc Commun**, and from **1ère Bac** to specialized **2ème Bac streams** (*Sciences Mathématiques A/B, Sciences Physiques-Chimie, SVT, Sciences Économiques*)—students must choose streams that permanently dictate their eligibility for higher education institutions (*CPGE, ENSA, ENSAM, Faculté de Médecine FMP, ENA, ISCAE, ERA*).
- **Static, Fragmented Data:** Today, parents and pupils rely on static paper report cards (*bulletins semestriels*) or basic semester GPAs provided by the legacy Massar portal. There is **zero longitudinal tracking** connecting a drop in 8th-grade Math directly to a diminished probability of entering an engineering preparatory class (*CPGE*) four years later.
- **Peer Pressure & Blind Guessing:** Over 68% of Moroccan students report choosing streams based on societal prestige, parental coercion, or friends' preferences rather than evidence-based academic aptitude, resulting in alarmingly high university first-year dropout rates (*déperdition universitaire*).
- **Disconnected Teacher Workflows:** Teachers input marks (*Contrôles Continus CC1, CC2, CC3*) in silos without real-time visibility into how their weekly grading shifts a student's eligibility thresholds for their declared career ambitions.

| Milestone | Critical Decision Point | Traditional Experience | Tawjih AI GPS Experience |
| :--- | :--- | :--- | :--- |
| **Collège (1AC–3AC)** | Stream Selection (*Tronc Commun*) | Blind choice based on a single semester GPA | Continuous longitudinal cluster detection (STEM vs. Bio vs. Humanities) |
| **Lycée (TC–1Bac)** | Branching (*Sc. Math vs. PC vs. SVT*) | Peer pressure & fear of difficult coefficients | Dynamic threshold alerts & readiness probability gauges |
| **Baccalauréat (2Bac)** | Post-Bac Concours Selection | Rushed submissions to dozens of concours | Evidence-backed career matching (*FMP, ENSA, CPGE, ERA*) |

---

## 2. 💡 Solution: The Tawjih AI Platform

**Tawjih AI (The GPS for Education)** transforms static Moroccan grade reporting into a proactive, reactive educational navigation system. Just as a GPS continuously recalculates routes when a driver misses an exit, Tawjih AI continuously recalculates career readiness and stream feasibility whenever a teacher enters a grade.

```
       👨‍🏫 TEACHER WORKSPACE                           🎓 STUDENT PLATFORM
   ┌───────────────────────────────┐               ┌─────────────────────────────────┐
   │ Level 1: 📅 Grade Years (1AC-2Bac)             │ 6-Year Longitudinal Timeline    │
   │ Level 2: 🏫 Classes & Streams │               │ Career Readiness Gauge (%)      │
   │ Level 3: 👥 Student Roster    │ ──[Reactive]─>│ Red "Stop & Fix" Alerts (Math)  │
   │ Level 4: 📝 5-Subject CC Grid │    Sync       │ Green "Smart Rebalance" Alerts  │
   └───────────────────────────────┘               │ Al-Mouwajih AI Chat (Gemma 26B) │
                                                   └─────────────────────────────────┘
```

### 👨‍🏫 4-Level Hierarchical Teacher Workspace (Massar 2.0)
Designed with a Moroccan EdTech aesthetic and an interactive Breadcrumb Navigation Bar (`📅 Années Scolaires > 🏫 Classes > 👥 Élèves > 📝 Fiche de l'Élève`), allowing educators to drill down in seconds:
1. **Level 1 — Grade Years View:** Overview of the 6 Moroccan secondary levels grouped by **Cycle Collégial** (1AC, 2AC, 3AC) and **Cycle Qualifiant / Lycée** (TC, 1Bac, 2Bac), highlighting live demo cohorts.
2. **Level 2 — Classes View:** Categorized class groups showing official streams (*BIOF, Sciences Expérimentales, Sciences Math, Technologique*), class averages, and student counts.
3. **Level 3 — Class Student Roster:** 5–8 realistic Moroccan students per class with Massar codes, avatars, and current GPAs. Demo students (**Youssef**, **Salma**, **Amine**) are pinned with a distinct `"⭐ Profil Démo Actif"` badge.
4. **Level 4 — Individual Student Gradebook & Simulation Suite:**
   - Granular mark inputs across **Mathématiques**, **Physique-Chimie (PC)**, **SVT**, **Français**, and **Anglais** with CC1, CC2, CC3, and Examen weights.
   - **1-Click Hackathon Simulation Buttons:**
     - 📉 *"Simuler chute en Maths (14.5/20)"* ➔ Triggers a live -2% drop below the CPGE threshold.
     - 📈 *"Simuler hausse en Maths (17.5/20)"* ➔ Fires celebratory confetti 🎉 and prompts a strategic shift of study time to Physics.
   - **Instant Sync:** *"💾 Enregistrer & Synchroniser avec le Passeport Élève"* pushes changes instantly to the student account via reactive state and `localStorage`.

### 🎓 6-Year Student Statistical Passport (7th to 12th Grade)
- **Longitudinal Trajectory Chart:** Visualizes six consecutive years of academic performance plotted against national benchmark thresholds for top Moroccan universities and concours.
- **Real-Time Readiness Radial Gauge:** Instant visual representation of career feasibility (e.g., 88% readiness for Engineering, 92% for Medicine).
- **Dynamic Subject Cluster Radar:** Multi-axial comparison of student strengths across STEM, Experimental Sciences, and Language competencies.

---

## 3. 🤖 AI Role: Dual-Mode AI Orientation Engine (*Al-Mouwajih*)

Tawjih AI implements a **Hybrid AI Architecture**: an ultra-fast, 100% deterministic local rules engine (`src/services/orientationEngine.ts`) paired with an intelligent LLM conversational advisor (*Al-Mouwajih*, `api/server.py`) powered by Google's **`gemma-4-26b-a4b-it`** through the official **`google-genai`** Python SDK.

```
                            ┌───────────────────────────────────┐
                            │    Tawjih AI Orientation Engine   │
                            └─────────────────┬─────────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
        [Mode 1: Bottom-Up Discovery]                    [Mode 2: Top-Down Target Lock]
       For: Undecided Students (e.g., Youssef)          For: Goal-Driven Students (e.g., Salma)
       • Cluster analysis of current grades             • Locks dream target (Engineer/Doctor/Pilot)
       • Matches strengths to Moroccan streams          • Computes exact Gap Analysis (e.g. -0.3 pts)
       • Generates ranked career compatibility          • 🔴 Red "Stop & Fix" Alert (Math < threshold)
                                                        • 🟢 Green "Smart Rebalance" Alert
```

### 🧭 Mode 1: Discovery Mode (*Bottom-Up Exploration*)
- **Target Profile:** Undecided students (e.g., **Youssef Benali** in 9th Grade / 3AC).
- **Cluster Matching Algorithm:** Aggregates grades into weighted subject competencies:
  $$\text{STEM Competency} = \frac{(W_{\text{Math}} \times \text{Math}) + (W_{\text{PC}} \times \text{PC})}{W_{\text{Math}} + W_{\text{PC}}}$$
- **Stream Recommendation:** Recommends the optimal Moroccan high school stream (*Sciences Math BIOF vs. Sciences Expérimentales vs. Sciences Économiques*) and predicts post-Bac career fits (Engineer, Data Scientist, Architect) ranked with confidence percentages.

### 🎯 Mode 2: Target Lock Mode (*Top-Down Trajectory Tracking*)
- **Target Profile:** Goal-driven students with locked career ambitions (e.g., **Salma Mansouri**, locked on **"Ingénieur d'État"** since 7th grade, or **Amine Tazi**, locked on **"Médecine / FMP"** in 2ème Bac).
- **Live Threshold Gap Analysis:** Evaluates grades against hard empirical criteria for Moroccan public schools:
  - *Engineering Target (ENSA/CPGE):* Math $\ge 15.5/20$, PC $\ge 15.0/20$.
  - *Medicine Target (FMP):* SVT $\ge 16.0/20$, PC $\ge 15.0/20$, Math $\ge 14.0/20$.
  - *Aviation/Pilot Target (ERA):* Math $\ge 15.5/20$, PC $\ge 15.0/20$, Anglais $\ge 15.5/20$.
- **🔴 Red "Stop & Fix" Emergency Alerts:**
  - When Salma's Math score falls to **14.5/20** (2% below the 15.5 threshold), the system triggers an emergency warning:
    > *"🛑 STOP HERE: Your Math average (14.5/20) is 2% below the Engineering School target threshold (15.5/20). Shift 4 hours/week immediately from French/English to Math (Analysis & Geometry) to recover your CPGE trajectory!"*
- **🟢 Green "Smart Rebalance" Optimization Alerts:**
  - When Salma's Math score surges to **17.5/20**, the engine recognizes diminishing returns on Math study hours and issues an optimization directive:
    > *"✅ EXCELLENT TRAJECTORY: Your Math average (17.5/20) is well above the Engineering threshold. Rebalance your study schedule: shift 2 hours/week to Physics-Chimie (Electricity & Mechanics) to secure your national rank!"*

### 💬 Conversational Assistant (*Al-Mouwajih*)
Integrated directly into the Student Platform, the assistant accepts questions in French, English, and Moroccan Darija (e.g., *"شنو ندير واش سيونس ماط ولا بيسي؟"*). It receives the student's complete 6-year grade passport and active alerts as context, providing contextual, realistic orientation advice rendered in clean Markdown.

---

## 4. 🚀 Setup & Testing

### 🛠️ Prerequisites
- **Node.js** $\ge 18.x$ and **npm**
- **Python** $\ge 3.11$ with [`uv`](https://github.com/astral-sh/uv) (or standard `pip`)
- A **Google AI Studio API Key** (optional: a deterministic fallback engine operates automatically if offline)

### 💻 Step-by-Step Installation Commands

```bash
# 1. Clone the repository
git clone https://github.com/your-org/tawjih-ai.git
cd tawjih-ai

# 2. Configure Environment Variables
cp .env.example .env
# Edit .env and insert your Google AI Studio API key:
# GEMINI_API_KEY=your_gemini_api_key_here
# VITE_GEMINI_API_KEY=your_gemini_api_key_here

# 3. Install Node.js Dependencies
npm install

# 4. Start the Python GenAI Microservice (Port 8000)
# (Uses uv to run FastAPI + Google GenAI SDK with Gemma 4 26B)
npm run backend

# 5. In a separate terminal, Start the Frontend Development Server (Port 5173)
npm run dev
```

Open **`http://localhost:5173`** in your browser.

> **Optional Test:** Verify the official Google GenAI Python SDK setup directly:
> ```bash
> npm run test:genai
> ```

---

### ⏱️ 1-Minute Hackathon Judge Testing Guide

Follow this rapid walkthrough to experience the end-to-end reactive loop between Teacher input and Student AI alerts:

```
[Step 1: Login Portal] ──> [Step 2: Teacher Drill-Down] ──> [Step 3: Trigger Math Drop]
                                                                      │
[Step 5: Inspect Red Alert] <── [Step 4: Login as Salma] <────────────┘
```

1. **Step 1 — Log in as Teacher:**
   - On the homepage (`http://localhost:5173`), click the **👨‍🏫 Espace Enseignant** card.
   - Click the pre-filled **"Se connecter (Demo Teacher)"** button.
2. **Step 2 — Drill Down to Salma in 3 Clicks:**
   - **Level 1 (Années):** Click on the **Tronc Commun (10th Grade)** card (highlighted with Salma's name).
   - **Level 2 (Classes):** Click on **TC Scientifique - Classe A (BIOF)**.
   - **Level 3 (Élèves):** Click on **Salma Mansouri** (`⭐ Profil Démo Actif`).
3. **Step 3 — Simulate a Grade Drop:**
   - In Salma's gradebook (Level 4), click the red button: **`📉 Simuler chute en Maths (14.5/20)`**.
   - Click **`💾 Enregistrer & Synchroniser avec le Passeport Élève`**. A confirmation toast will appear.
4. **Step 4 — Switch to Salma's Student Account:**
   - Click **"Déconnexion / Changer de compte"** in the top-right navbar.
   - Click **🎓 Espace Élève**, select **Salma Mansouri**, and click **"Accéder à mon Passeport (Login)"**.
5. **Step 5 — Observe Live AI Reactivity:**
   - Notice the prominent **🔴 Red "Stop & Fix" Alert Banner**: *"🛑 STOP ICI : Votre moyenne en Maths (14.5/20) est inférieure de 2% au seuil critique..."*
   - Observe the **Career Readiness Gauge** drop to ~78%.
   - Inspect the **6-Year Longitudinal Trajectory Chart** showing the recent dip.
6. **Bonus (Optional) — Rebalance:**
   - Return to the Teacher Workspace, navigate to Salma, and click **`📈 Simuler hausse en Maths (17.5/20)`**.
   - Enjoy the confetti 🎉, re-sync, switch back to Salma, and observe the **🟢 Green "Smart Rebalance" Alert** urging her to refocus on Physics!

---

## 5. 🏆 Result: Validated MVP Outcomes

During hackathon validation, the MVP demonstrated:

- **Sub-Second Reactive Synchronization:** Grade modifications made by educators reflect instantaneously across the student dashboard, gauges, and AI models via unified state management without page reloads.
- **Zero-Friction Access:** Fully functional role-based demo switching eliminating registration fatigue while strictly preserving view separation.
- **Accurate Longitudinal Trendlines:** 6 full academic years mapped to realistic Moroccan coefficients and national concours criteria.
- **Hybrid AI Reliability:** The deterministic orientation engine guarantees 100% uptime for critical threshold alerts even under zero-connectivity hackathon conditions, while the **Gemma 4 26B** cloud model delivers natural language advice in French and Moroccan Darija.

| Feature Area | Legacy Massar System | Tawjih AI (Massar 2.0) |
| :--- | :--- | :--- |
| **Orientation Model** | Static, retroactive semester review | Continuous, predictive longitudinal GPS |
| **Alert Triggers** | None (grades stored as passive numbers) | Automated Red (Stop & Fix) & Green (Rebalance) alerts |
| **User Experience** | Fragmented administrative tables | Role-based Moroccan EdTech UX (4-Level Drill-Down & Bento Grid) |
| **AI Advisory** | Absent | Hybrid Deterministic Rules + Gemma 4 26B LLM |

---

## 6. 🚧 Limitations: Hackathon Scope & Future Roadmap

To deliver a working, single-command MVP within a 7-hour hackathon timeframe, specific tactical engineering trade-offs were made:

- **Client-Side State Storage (`localStorage`):** The MVP uses reactive React state backed by browser `localStorage`. A production rollout will transition to a distributed **PostgreSQL database** managed via Prisma or Supabase with Row-Level Security (RLS).
- **Simulated Massar Authentication:** Teacher IDs (`PROF-88421`) and Massar student codes are simulated for instant demo switching. Production integration will interface with the Moroccan Ministry of National Education's official **OAuth2 / Massar SSO**.
- **Static Threshold Baselines:** Current entry thresholds for Moroccan grand concours (*ENSA, CPGE, FMP, ERA*) are modeled on historical 2023–2025 public cutoffs (*seuils de préselection*). Future iterations will introduce dynamic ML predictive models that auto-adjust thresholds based on national cohort score distributions.
- **Mobile Native Application:** The current interface is fully responsive on mobile browsers, but a native Flutter or React Native build is planned for offline-first usage in rural Moroccan school districts.

---

## 7. 👥 Credits: Team & Acknowledgments

Developed with ❤️ for the future of Moroccan education at the Hackathon.

### The Tawjih AI Team
- **[Marwan](https://github.com/your-username)** — *Full-Stack Architect & AI Systems Engineer*
- **[Team Member 2](https://github.com/member2)** — *Frontend & UI/UX Design Specialist*
- **[Team Member 3](https://github.com/member3)** — *Orientation Logic & Educational Data Modeling*

### Acknowledgments & Technologies
- **Ministère de l'Éducation Nationale, du Préscolaire et des Sports (Maroc)** — Reference curriculum frameworks and stream structures.
- **Google DeepMind & Google AI Studio** — Official `google-genai` SDK and the `gemma-4-26b-a4b-it` model.
- **Lucide Icons & Tailwind CSS** — Interface iconography and modern design system components.

---

<p align="center">
  <b>Tawjih AI 🇲🇦 — Le GPS de l'Éducation : De la 1ère Année Collège au 2ème Bac</b>
</p>
