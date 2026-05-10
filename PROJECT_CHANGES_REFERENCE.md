# PathForge AI - Project Changes & Reference Guide

## Project Overview
**Project Name:** PathForge AI  
**Type:** Full-stack AI career platform  
**Current Phase:** Post-authentication Firestore persistence & UI polish  

---

## Technology Stack

### Frontend
- **Framework:** React 18.3.1 + Vite 5.4.10
- **UI Library:** Lucide React (icons)
- **File Upload:** react-dropzone
- **Build:** npm run build (outputs to dist/)
- **Styling:** Custom CSS with dark theme (CSS variables in index.css)

### Backend
- **Runtime:** Node.js + Express
- **Deployment:** Render
- **Auth Route:** POST /api/auth/verify (Firebase ID token verification)

### Database & Auth
- **Authentication:** Firebase Auth v9+ (Email/Password, Google OAuth)
- **Database:** Firestore (NoSQL)
- **Collections:** users, interviews, roadmaps
- **API Key:** All in frontend/.env (VITE_* variables)

### Deployment
- **Frontend:** Vercel (localhost & deployed domain authorized)
- **Backend:** Render

---

## Session Changes Summary

### 1. **Firestore User Profile Persistence** ✅
**Objective:** Auto-save user profiles to Firestore on signup/signin/page-refresh  
**Files Modified:**
- **frontend/src/firebase.js** - Added Firestore initialization
- **frontend/src/firebaseHelpers.js** - Created new file with `saveUserProfile()` helper
- **frontend/src/LoginPage.jsx** - Integrated saveUserProfile in auth handlers
- **frontend/src/App.jsx** - Added saveUserProfile to onAuthStateChanged hook
- **frontend/src/ProfileView.jsx** - Integrated profile edits into Firestore

**Implementation Details:**
```javascript
// saveUserProfile(user, extraData) - handles:
// - New users: creates users/{uid} with uid, fullName, email, photoURL, createdAt, lastLogin
// - Returning users: updates lastLogin only, preserves createdAt
// - Upsert logic: merge: true prevents overwriting
// - Error handling: try/catch with console logging
```

**Trigger Points:**
1. Email/password signup → createUserWithEmailAndPassword → saveUserProfile
2. Email/password signin → signInWithEmailAndPassword → saveUserProfile  
3. Google sign-in → signInWithPopup → saveUserProfile
4. Page refresh → onAuthStateChanged → saveUserProfile (updates lastLogin)
5. Profile edit save → ProfileView handleSave → saveUserProfile

---

### 2. **Consistent Footer Across Website** ✅
**Objective:** Add professional footer with company info on all pages  
**Files Created:**
- **frontend/src/Footer.jsx** - Footer component with sections
- **frontend/src/footer.css** - Responsive footer styling

**Footer Structure:**
- Company info & branding (logo, description, social links)
- Product section (Features, Pricing, Security, Roadmap)
- Company section (About, Blog, Careers, Contact)
- Legal section (Privacy, Terms, Cookies, Compliance)
- Footer bottom with copyright & tagline

**Responsive Breakpoints:**
- Desktop (1200px+): 4-column grid
- Tablet (768px): 2-column grid  
- Mobile (480px): 1-column stack

**Files Updated to Include Footer:**
- frontend/src/App.jsx - Added `<Footer />` to all 7 page returns:
  1. Auth page (LoginPage)
  2. Landing page (LandingPage)
  3. Job Search (JobSearchView)
  4. AI Interview (AIInterviewView)
  5. FAANG Questions (FAANGQuestionsView)
  6. Profile (ProfileView)
  7. Skill Analysis (RoadmapView) - already had footer

---

### 3. **Profile Card Hover Effects** ✅
**Objective:** Apply smooth, non-intrusive hover effects (subtle brightening, no movement on header cards)

**Changed Classes in App.css:**
- `.profile-details-card` - Header card: hover brightens only, no lift
- `.profile-form-card` - Form card: hover brightens only, no lift  
- `.profile-card` - Grid cards: hover with lift effect + decorative gradients

**Implementation:**
```css
/* Header cards - subtle hover */
.profile-details-card:hover {
  background: var(--surface-hover);      /* 0.1 opacity white */
  border-color: var(--border-heavy);
  /* NO transform - prevents displacement */
}

/* Grid cards - lift effect */
.profile-card:hover {
  background: var(--surface-light);
  border-color: var(--border-heavy);
  transform: translateY(-12px);          /* Lift on hover */
}
```

**Color Palette:**
- `--surface-hover`: rgba(255, 255, 255, 0.1) - subtle, not bright white
- `--surface-light`: rgba(255, 255, 255, 0.08) - lighter
- Removed `--surface-light` from header cards (was too white)

---

### 4. **Improved Button Styling** ✅
**Objective:** Better visibility and consistency across all buttons

**Button Changes in App.css:**
- `.back-home-btn` - Transparent with subtle border, no absolute positioning
- `.btn-primary` - White gradient background with black text (high contrast)

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  color: #000000;
  font-weight: 700;
  width: 100%;
  min-height: 48px;
}

/* Back Button */
.back-home-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text-secondary);
  align-self: flex-start;      /* Align left in flex container */
}
```

---

### 5. **Skill Analysis Page Layout Fixes** ✅
**Objective:** Fix overlapping header, button, and paragraph; reduce form size

**Changes to App.css:**
- `.header` - Reduced padding (3rem → 1.5rem top/bottom), added flex layout
- `.header h1` - Reduced size (3.5rem → 2.2rem)
- `.tagline` - Reduced size (1.15rem → 0.95rem), tighter line-height
- `.back-home-btn` - Changed from absolute to flex positioning, align-self: flex-start
- `.form-card` - Added max-width: 900px, centered with margin-left/right auto, reduced padding (3rem → 2rem)
- `.form-row` - Reduced margin (1.75rem → 1.25rem)
- `.label` - Reduced font size (0.95rem → 0.9rem), margin (0.75rem → 0.65rem)
- `.input` - Reduced padding, smaller font (1rem → 0.95rem)
- `.dropzone` - Reduced padding (3.5rem → 2.5rem)

**Layout Flow:**
```
Header (flex column, centered)
  ├─ Back Button (align-self: flex-start)
  ├─ Logo + Title
  ├─ Tagline
  
Form Card (max-width: 900px, centered)
  ├─ Target Job Title input
  ├─ Resume Upload (dropzone)
  └─ Analyze & Build Roadmap button
```

---

## Current Firebase Configuration

### frontend/.env
```
VITE_FIREBASE_API_KEY=<your_key>
VITE_FIREBASE_AUTH_DOMAIN=<your_domain>
VITE_FIREBASE_PROJECT_ID=<your_project_id>
VITE_FIREBASE_STORAGE_BUCKET=<your_bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
VITE_FIREBASE_APP_ID=<your_app_id>
VITE_FIREBASE_MEASUREMENT_ID=<your_measurement_id>
```

### Firestore Collections
1. **users** (auto-created by profile persistence)
   - Document ID: user.uid
   - Fields: uid, fullName, email, photoURL, createdAt, lastLogin, jobTitle, location, bio

2. **interviews** (existing)
3. **roadmaps** (existing)

---

## Key Implementation Files

### Profile Persistence Flow
**Entry Points:**
1. `frontend/src/firebaseHelpers.js` - Core `saveUserProfile()` function
2. `frontend/src/LoginPage.jsx` - Line ~60-65 (handleSubmit), Line ~75 (handleGoogleSignIn)
3. `frontend/src/App.jsx` - Line ~33-36 (onAuthStateChanged)
4. `frontend/src/ProfileView.jsx` - Line ~35-50 (handleSave)

**Error Handling:**
- All calls wrapped in try/catch
- Console logging with [Firestore] prefix for debugging
- User-facing status messages in ProfileView

---

## CSS Architecture

### Dark Theme Variables (frontend/src/index.css)
```css
:root {
  --surface: rgba(255, 255, 255, 0.05);
  --surface-light: rgba(255, 255, 255, 0.08);
  --surface-hover: rgba(255, 255, 255, 0.1);
  --border: rgba(255, 255, 255, 0.08);
  --border-heavy: rgba(255, 255, 255, 0.15);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --radius-lg: 24px;
}
```

### Responsive Breakpoints (App.css)
- Desktop: 1200px+
- Tablet: 768px
- Mobile: 480px

---

## Build & Deployment Status

### Latest Build
```
✓ 1618 modules transformed
✓ dist/index.html 0.84 kB (gzip: 0.45 kB)
✓ dist/assets/index-*.css 69.48 kB (gzip: 12.08 kB)
✓ dist/assets/index-*.js 729.46 kB (gzip: 186.30 kB)
✓ Built in ~13 seconds
```

### Test Commands
```bash
# Build frontend
cd frontend && npm run build

# Development (if needed)
npm run dev
```

---

## Known Limitations & Notes

1. **Chunk Size Warning** - JS bundle >500KB (consider lazy loading for large features)
2. **Footer Links** - Currently point to hash anchors (#features, etc.) - update with real URLs
3. **Profile Image** - Uses initials avatar, no upload UI yet
4. **Page Refresh** - onAuthStateChanged delays slightly (normal Firebase behavior)

---

## Feature Checklist

- ✅ Firebase Authentication (Email/Password + Google)
- ✅ User Profile Persistence (Firestore)
- ✅ Profile Edit & Save
- ✅ Consistent Footer (All Pages)
- ✅ Dark Theme UI
- ✅ Responsive Design
- ✅ Hover Effects (Subtle & Professional)
- ✅ Button Styling (High Contrast)
- ✅ Skill Analysis Layout (Fixed Spacing)
- ⏳ Profile Image Upload
- ⏳ Additional Firestore Data (interviews, roadmaps sync)
- ⏳ Backend API Integration (fully)

---

## Next Steps for Future Agent

1. **Profile Image Upload** - Add file upload to ProfileView → save photoURL to Firestore
2. **Data Sync** - Save interview & roadmap results to Firestore collections
3. **Performance** - Implement code splitting to reduce JS bundle size
4. **Footer Links** - Update placeholder URLs to actual pages
5. **Testing** - Add unit & integration tests for Firestore operations
6. **Production** - Deploy to Vercel (frontend) & Render (backend)

---

## Contact Points for Integration

- **Profile Data Hook:** Use `user` state from App.jsx (uid, email, fullName)
- **Save to Firestore:** Call `saveUserProfile(user, extraData)` from firebaseHelpers.js
- **Auth State:** Listen to `onAuthStateChanged(auth, callback)` in App.jsx
- **Backend Verification:** POST to `/api/auth/verify` with Firebase ID token

---

**Last Updated:** May 10, 2026  
**All Changes Verified:** ✅ Build successful, no errors
