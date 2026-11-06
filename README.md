# CampusPulse (Campus Plus) – AI-Powered Modern Job Recruitment Platform

> **Tagline:** Smart Job Search. Smarter Resumes. Better Opportunities.  
> **PulseAI Engine:** Advanced contextual intelligence for deep resume diagnostics, quantifiable bullet improvements, and semantic recruiter matching.

---

## Overview

**CampusPulse** is a premium, full-featured recruitment platform connecting ambitious job seekers with leading companies. Powered by **PulseAI**, candidates can analyze their resumes against 20+ enterprise ATS parameters, generate quantifiable bullet rewrites, and discover high-fit job opportunities. Recruiters gain access to automated candidate ranking, applicant management, and interview scheduling workflows.

---

## Key Features

### For Candidates
- **PulseAI Resume Diagnostics:** Comprehensive ATS scoring, structural breakdown, missing sections detection, and strategic career recommendations.
- **PulseAI Bullet Optimizer:** Side-by-side comparison with instant rephrasing focused on measurable metrics and strong leadership verbs.
- **Resume Builder:** Interactive ATS-compliant CV editor with instant print & PDF export.
- **Smart Recommendations:** Jobs matched to candidate competencies with explainable fit rationales.
- **Application Tracking:** Real-time visibility into application lifecycle stages (Applied, Under Review, Shortlisted, Interview Scheduled, Rejected).

### For Companies & Recruiters
- **Company Dashboard:** Analytics on applicant flow, active vacancies, and hiring metrics.
- **Job Management:** Post, edit, filter, and close vacancies with rich salary, experience, and skill criteria.
- **Applicant Pipeline:** Candidates ranked automatically by **PulseAI Match Score** with detailed matched and missing competency pills.
- **Interview Scheduling:** Direct scheduling for Google Meet or Zoom interviews with candidate notifications.

### Platform Support & Admin
- **Help & Support Center:** Interactive ticketing system (`CP-XXXXX`), status tracker, simulated **PulseAI Assistant Bot**, and categorized FAQ accordions.
- **Admin Console:** Platform oversight, user management, company verification badges, and system health telemetry.

---

## Technology Stack

### Frontend
- **React 18** with **Vite**
- **Tailwind CSS** (Custom Brand Emerald `#159B79` & Navy `#062D32` palette)
- **Lucide React** (Strict icon design system – zero emojis)
- **Motion for React** (Framer Motion animations)
- **React Router DOM v6**
- **Axios** with automatic token refresh

### Backend
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** (with built-in in-memory fallback store for offline testing)
- **JWT Authentication** (Access & Refresh tokens)
- **PulseAI Engine** (Google Generative AI SDK with structured JSON extraction)
- **Cloudinary** integration for resume uploads

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Optional: works with local MongoDB or falls back gracefully to in-memory store)

---

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your environment credentials if desired
npm run dev
```
Backend runs on `http://localhost:5000`.

---

### 3. Frontend Setup
```bash
# In the root directory:
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

### 4. Build for Production
```bash
npm run build
```

---

## Brand Palette

| Color | Hex | Usage |
|---|---|---|
| Primary Emerald | `#159B79` | Actions, active states, key highlights |
| Dark Emerald | `#0F735A` | Hover states, accents |
| Brand Navy | `#062D32` | Headings, dark backgrounds, high-contrast text |
| Light Mint | `#DDF3E8` | Badges, card highlights, soft containers |
| Clean Neutral | `#F8F8F2` | Page background |

---

## License
MIT License. Built for modern campus recruitment and career intelligence.
