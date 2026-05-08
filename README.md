# AI-Powered Career Accelerator

An AI-powered platform with two main features:

1. **Skill-Gap Analysis & Resume Builder** – Analyzes your resume, compares it to a target job, generates a personalized learning roadmap, tracks your progress, and builds an ATS-optimized resume when you complete all phases.

2. **Job Search & FAANG Alerts** – Upload your resume to find matching jobs and setup automated email alerts for FAANG company openings.

Built for B.Tech students to reduce placement anxiety by clearly showing the gap, providing a path to close it, and connecting you with relevant opportunities.

## Features

### 1. Skill-Gap Analysis & Resume Builder

**How it works (Agentic workflow):**

1. **Agent 1 – Resume analyst**  
   Extracts skills, experience, and education from your uploaded resume using the Gemini API.

2. **Agent 2 – Job requirements**  
   Uses Scrape.do to fetch Google search results for current industry requirements for your target role, then Gemini to structure required vs nice-to-have skills.

3. **Agent 3 – Roadmap builder**  
   Computes the skill gap, orders learning by phase, and uses Scrape.do again to attach real course/docs links to each skill.

4. **Progress tracking**  
   Check off phases as you complete them. Your progress is saved to Firebase.

5. **Agent 4 – Resume builder**  
   When all phases are completed, generates a tailored, ATS-optimized resume with your new skills, provides an ATS match score (0-100), and key highlights.

### 2. Job Search & FAANG Alerts

**How it works:**

1. **Agent 5 – Job matcher**  
   Extracts skills and experience from your resume for job matching.

2. **Agent 6 – Job search**  
   Searches for jobs matching your profile using AI and web scraping. Shows match scores and highlights FAANG companies.

3. **FAANG alerts**  
   Setup email notifications for new job openings at Facebook/Meta, Apple, Amazon, Netflix, Google, and Microsoft. Get notified instantly when opportunities arise.

## Tech stack

- **Frontend:** React (Vite), react-dropzone, Lucide icons  
- **Backend:** Node.js, Express, Multer (file upload), pdf-parse  
- **Database:** Firebase (Firestore)  
- **AI:** Google Gemini 2.5 Flash  
- **Scraping:** Scrape.do API (to fetch Google search results for job requirements and course links)

## Prerequisites

- Node.js 18+  
- Firebase project with Firestore ([full Firebase setup guide](docs/FIREBASE_SETUP.md))  
- [Gemini API key](https://aistudio.google.com/apikey)  
- [Scrape.do API token](https://scrape.do/) (optional; fallback uses only Gemini)

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Environment variables

Copy the example env and fill in your keys:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

- `GEMINI_API_KEY` – required for resume and roadmap analysis  
- `FIREBASE_SERVICE_ACCOUNT_PATH` – path to your Firebase service account JSON ([how to get it](docs/FIREBASE_SETUP.md#step-4-get-the-service-account-key-for-the-backend))  
  - Or set `FIREBASE_SERVICE_ACCOUNT_JSON` to the raw JSON string (e.g. for serverless)  
- `SCRAPE_DO_TOKEN` – optional; enables real-time job search and course links via Scrape.do  
- `FRONTEND_URL` – default `http://localhost:5173` for CORS

### 3. Run the app

**Option A – Backend and frontend together (from project root):**

```bash
npm run dev
```

**Option B – Separate terminals:**

```bash
# Terminal 1 – backend (default port 4000)
npm run dev:backend

# Terminal 2 – frontend (Vite dev server on 5173)
npm run dev:frontend
```

### 4. Use the app

1. Open **http://localhost:5173**  
2. Choose a feature from the landing page:
   - **Skill-Gap Analysis** – Upload resume, set target job, get roadmap, track progress, build tailored resume
   - **Job Search & Alerts** – Upload resume, find matching jobs, setup FAANG email alerts

## Project structure

```
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── geminiClient.js              # Gemini API wrapper
│   │   │   ├── agent1-resume-skills.js      # Resume skill extraction
│   │   │   ├── agent2-job-requirements.js   # Job requirements analysis
│   │   │   ├── agent3-roadmap-builder.js    # Roadmap generation
│   │   │   ├── agent4-resume-builder.js     # Tailored resume builder
│   │   │   ├── agent5-job-matcher.js        # Job profile extraction
│   │   │   └── agent6-job-search.js         # Job search engine
│   │   ├── middleware/
│   │   │   └── upload.js
│   │   ├── services/
│   │   │   ├── roadmapService.js            # Roadmap Firestore operations
│   │   │   └── jobService.js                # Job search Firestore operations
│   │   ├── routes/
│   │   │   ├── roadmap.js                   # Skill-gap & roadmap routes
│   │   │   └── jobs.js                      # Job search routes
│   │   ├── utils/
│   │   │   ├── pdfParser.js
│   │   │   └── scrapeDoClient.js
│   │   ├── config.js
│   │   ├── db.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                          # Main app with routing
│   │   ├── App.css                          # All styles
│   │   ├── LandingPage.jsx                  # Landing page with feature cards
│   │   ├── RoadmapView.jsx                  # Roadmap display & progress
│   │   ├── ResumeBuilderView.jsx            # Resume builder view
│   │   ├── JobSearchView.jsx                # Job search & alerts
│   │   ├── api.js                           # API client
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
│   └── FIREBASE_SETUP.md
├── package.json
└── README.md
```

## API

### Skill-Gap & Roadmap

- **POST `/api/roadmap/analyze`**  
  - Body: `multipart/form-data` with `resume` (file) and `targetJobTitle` (string)  
  - Returns: `{ id, targetJobTitle, result, progress }` (skill gap, job summary, phases with links)

- **GET `/api/roadmap/:id`**  
  - Returns saved roadmap by ID with progress and completion status

- **PATCH `/api/roadmap/:id/progress`**  
  - Body: `{ completedPhaseIndices: [0, 1, 2] }`  
  - Updates progress and returns `{ progress, allPhasesCompleted }`

- **POST `/api/roadmap/:id/build-resume`**  
  - Generates tailored resume (only allowed when all phases completed)  
  - Returns: `{ tailoredResume, highlights, score }`

### Job Search & Alerts

- **POST `/api/jobs/upload-resume`**  
  - Body: `multipart/form-data` with `resume` (file)  
  - Returns: `{ id, skills, experience, education }`

- **POST `/api/jobs/search`**  
  - Body: `{ skills: [...], experience: "..." }`  
  - Returns: `{ jobs: [...] }` with match scores and FAANG indicators

- **POST `/api/jobs/faang-alerts`**  
  - Body: `{ email: "...", resumeId: "..." }`  
  - Sets up email alerts for FAANG job openings  
  - Returns: `{ id, email, active }`

- **GET `/api/jobs/faang-alerts?email=...`**  
  - Returns active alerts for the email

- **DELETE `/api/jobs/faang-alerts/:id`**  
  - Disables the alert

## Why this helps

Many B.Tech students are unsure what to learn next and how it maps to roles they want. This platform:

- Shows **what you already have** (from your resume)  
- Shows **what the role expects** (from current job requirements)  
- Highlights the **gap** and a **phased schedule** with real learning links  
- Tracks your **progress** as you complete phases  
- Builds a **tailored, ATS-optimized resume** when you're ready  
- Connects you with **relevant job opportunities**  
- Keeps you **notified** about FAANG openings  

You get a complete career growth platform from skill gaps to job offers.
