# 🧭 Tawjih AI (The GPS for Education) 🇲🇦
### *Portail National d'Orientation Intelligente & Suivi Longitudinal (Massar 2.0)*

A production-grade, full-stack reactive SaaS web application designed for Moroccan secondary education longitudinal academic tracking and AI-driven orientation from **7th Grade (1AC / 1ère Année Collège)** to **12th Grade (2ème Bac)**.

---

## ⚡ Google GenAI Integration (`gemma-4-26b-a4b-it`)

The application is powered by Google's official **`google-genai`** SDK using the **`gemma-4-26b-a4b-it`** model:

```python
from google import genai

client = genai.Client()

response = client.models.generate_content(
    model="gemma-4-26b-a4b-it",
    contents="Roses are red...",
)

print(response.text)
```

### 🧪 Run the Standalone Python Test Script
You can test the exact Python SDK implementation directly in the terminal:

```bash
npm run test:genai
# OR directly with uv:
uv run --with google-genai python3 test_genai.py
```

---

## 🚀 Quick Start (Full Stack)

### 1. Start the Python GenAI Backend (Port 8000)
```bash
npm run backend
# OR:
uv run --with fastapi --with uvicorn --with google-genai uvicorn api.server:app --port 8000 --reload
```

### 2. Start the Frontend (Port 5173)
```bash
npm run dev
```

Open **`http://localhost:5173`** in your browser. All requests to `/api/*` are automatically proxied to the Python backend.

---

## 🏛️ Strictly Separated 3-Screen Architecture

### 🔐 Screen 1: The Login & Role Selection Portal (`/login`)
- **Moroccan EdTech Branding:** *"Tawjih AI — Portail National d'Orientation Intelligente (المملكة المغربية • منظومة مسار)"*.
- **Role Selection Tabs:**
  - **👨‍🏫 Espace Enseignant (Teacher Portal):** Pre-filled Massar Teacher ID (`PROF-88421`), password, and 1-click **"Se connecter (Demo Teacher)"**.
  - **🎓 Espace Élève (Student Portal):** Visual profile selector to choose between:
    - **Salma Mansouri (Tronc Commun - 10th Grade):** *Target Lock: Future Engineer*.
    - **Youssef Benali (3ème Collège - 9th Grade):** *Undecided / Discovery Mode*.
    - **Amine Tazi (2ème Bac - 12th Grade):** *Post-Bac Career Matcher*.
  - Pre-filled Massar ID and 1-click **"Accéder à mon Passeport (Login)"**.

---

### 👨‍🏫 Screen 2: Dedicated Teacher Workspace (Massar 2.0 Gradebook)
*Only visible when logged in as a Teacher.*
- **Left Sidebar:**
  - Profile badge for **Prof. Mohammed Amrani** (`PROF-88421`).
  - Class selector (`Toutes les Classes`, `Tronc Commun Sc. 1`, `3ème Collège A`, `2ème Bac SM-A`).
  - Student Roster list with live calculated GPAs, class tags, and threshold status badges.
- **Main Notion-Style Gradebook:**
  - **Student Grade Entry Grid:** Live assessment scores across **Mathématiques, Physique-Chimie (PC), SVT, Français, Anglais** with CC1, CC2, CC3 sub-columns, direct inputs, and quick sliders.
  - **Visual Grade Status Pills:** Automatic color coding (`≥16` Emerald Green, `12–15.9` Indigo, `<12` Rose Red).
  - **Quick Demo Simulation Toolbar (1-Click Hackathon Triggers):**
    - `📉 Baisse Salma Math (14.5/20)` ➔ Triggers the -2% Engineering School Red Alert!
    - `📈 Boost Salma Math (17.5/20)` ➔ Triggers Confetti 🎉 & Green Smart Rebalance Alert!
  - **Save & Sync Button:** Prominent *"Enregistrer & Synchroniser avec Tawjih AI"* button with loading state and toast notification.
  - **Top-Right Action:** 1-Click **"Déconnexion / Changer de compte"** button to return to the Login Portal.

---

### 🎓 Screen 3: Dedicated Student Platform (Bento-Grid Dashboard)
*Only visible when logged in as a Student.*
- **Top Header:**
  - Student identity, Massar Code badge, school & city.
  - **6-Year Timeline Stepper:** Visual stepper from `1AC (7th)` ➔ `2AC (8th)` ➔ `3AC (9th)` ➔ `TC (10th)` ➔ `1Bac (11th)` ➔ `2Bac (12th)` indicating where the student stands in their secondary education.
  - Top-Right **"Déconnexion / Changer de compte"** button.
- **Left Sidebar Navigation:**
  - 📊 *Mon Passeport (6-Year Overview)*
  - 🧭 *Mode Découverte (Stream & Career Matcher)*
  - 🎯 *Mode Objectif / Target Lock (My Dream Career)*
  - 💬 *Assistant IA Al-Mouwajih*
- **Bento Grid Layout (Passport Tab):**
  - **Card 1: Hero Alert Banner (Dynamic Real-Time):**
    - 🔴 **Red Alert:** *"🛑 STOP HERE: Your Math average (14.5/20) is 2% below the Engineering School threshold. Focus on Math immediately!"*
    - 🟢 **Green Optimization Card:** *"✅ HIGH PROBABILITY (89%): Your Math score is strong for Engineering! Shift your focus to Physics (PC) right now."*
  - **Card 2: Live Career Readiness Radial Gauge:** Animated circular SVG progress gauge showing exact readiness % for target career (Engineer, Doctor, Pilot) or top recommended stream.
  - **Card 3: 6-Year Longitudinal Trajectory Chart:** Smooth composed area/line chart with gradient fill showing performance against benchmark threshold lines.
  - **Card 4: Embedded AI Advisor Chat (Al-Mouwajih):** Powered by **`gemma-4-26b-a4b-it`** through the official **`google-genai`** SDK.
  - **Cluster Radar & Disciplines Grid:** Multi-axial comparison against required skills.
