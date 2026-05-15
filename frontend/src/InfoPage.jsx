import React from 'react';
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  FileText,
  Lock,
  Mail,
  Map,
  Newspaper,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

const pages = {
  features: {
    icon: Sparkles,
    eyebrow: 'Product',
    title: 'Features',
    intro: 'PathForge AI brings career planning, interview practice, resume improvement, and job discovery into one focused workspace.',
    sections: [
      {
        title: 'Career tools',
        items: [
          'Skill-gap analysis from your resume and target role.',
          'AI-generated learning roadmap with progress tracking.',
          'ATS-focused resume builder after roadmap completion.',
          'Job search, FAANG question bank, and AI interview practice.',
        ],
      },
      {
        title: 'Built for students',
        items: [
          'Clear next steps instead of generic advice.',
          'Role-specific preparation for placements and internships.',
          'Fast resume upload flows and guided AI feedback.',
        ],
      },
    ],
  },
  pricing: {
    icon: CheckCircle2,
    eyebrow: 'Product',
    title: 'Pricing',
    intro: 'PathForge AI is currently available as a student-focused project and does not charge users inside the app.',
    sections: [
      {
        title: 'Current access',
        items: [
          'Core roadmap, resume, job search, and interview features are available without an in-app payment flow.',
          'Some AI and search features depend on backend API availability and configured service limits.',
          'Future premium plans may add advanced analytics, saved histories, and team dashboards.',
        ],
      },
    ],
  },
  security: {
    icon: ShieldCheck,
    eyebrow: 'Product',
    title: 'Security',
    intro: 'The app uses Firebase authentication and keeps service credentials on the backend side where they belong.',
    sections: [
      {
        title: 'Account protection',
        items: [
          'Firebase Auth handles email/password and Google sign-in.',
          'Frontend Firebase keys identify the app but do not grant admin access.',
          'Backend Firebase Admin credentials should stay only in Render environment variables.',
        ],
      },
      {
        title: 'Data handling',
        items: [
          'Uploaded resumes are processed to extract skills and career signals.',
          'Profile data is stored in Firestore for authenticated users.',
          'Users should avoid uploading unnecessary sensitive personal data.',
        ],
      },
    ],
  },
  'roadmap-info': {
    icon: Map,
    eyebrow: 'Product',
    title: 'Roadmap',
    intro: 'The roadmap engine turns a resume and target job title into a phased learning plan.',
    sections: [
      {
        title: 'How it works',
        items: [
          'Upload a resume and enter your target role.',
          'The backend extracts your current skills and compares them with role expectations.',
          'PathForge AI creates learning phases with skills, resources, and progress tracking.',
        ],
      },
      {
        title: 'What comes next',
        items: [
          'More saved roadmap history.',
          'Better recommendations from completed phases.',
          'Profile-aware suggestions across interview and job-search flows.',
        ],
      },
    ],
  },
  about: {
    icon: Users,
    eyebrow: 'Company',
    title: 'About Us',
    intro: 'PathForge AI is built to help students move from uncertainty to a practical career plan.',
    sections: [
      {
        title: 'Mission',
        items: [
          'Make placement preparation easier to understand.',
          'Show students what to learn next and why it matters.',
          'Connect learning progress with resumes, interviews, and jobs.',
        ],
      },
    ],
  },
  blog: {
    icon: Newspaper,
    eyebrow: 'Company',
    title: 'Blog',
    intro: 'The blog will share product updates, placement preparation notes, resume tips, and AI career workflows.',
    sections: [
      {
        title: 'Coming topics',
        items: [
          'How to read a skill-gap report.',
          'Building an ATS-friendly student resume.',
          'Preparing for AI-assisted mock interviews.',
          'Using job descriptions to guide learning plans.',
        ],
      },
    ],
  },
  careers: {
    icon: Briefcase,
    eyebrow: 'Company',
    title: 'Careers',
    intro: 'PathForge AI is not hiring right now, but this page is ready for future project and contributor opportunities.',
    sections: [
      {
        title: 'Future roles',
        items: [
          'Frontend and full-stack contributors.',
          'AI workflow and prompt engineering contributors.',
          'Content contributors for interview and placement preparation.',
        ],
      },
    ],
  },
  contact: {
    icon: Mail,
    eyebrow: 'Company',
    title: 'Contact',
    intro: 'For project feedback, deployment questions, or collaboration ideas, use the contact options connected to the project repository or owner profile.',
    sections: [
      {
        title: 'What to include',
        items: [
          'A short description of the issue or request.',
          'Screenshots for UI bugs.',
          'Browser and deployment URL when reporting production problems.',
        ],
      },
    ],
  },
  privacy: {
    icon: Lock,
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    intro: 'PathForge AI collects only the information needed to provide career guidance and account functionality.',
    sections: [
      {
        title: 'Information used',
        items: [
          'Account details such as name, email, and profile fields.',
          'Resume content uploaded for analysis, job matching, and interview practice.',
          'Roadmap, progress, job alert, and interview data created while using the app.',
        ],
      },
      {
        title: 'Purpose',
        items: [
          'Generate personalized career recommendations.',
          'Save user profile and progress information.',
          'Improve the usefulness of resume, roadmap, and interview features.',
        ],
      },
    ],
  },
  terms: {
    icon: FileText,
    eyebrow: 'Legal',
    title: 'Terms of Service',
    intro: 'By using PathForge AI, users agree to use the platform responsibly and understand that AI output is guidance, not a guarantee.',
    sections: [
      {
        title: 'Use of the platform',
        items: [
          'Do not upload documents you do not have permission to use.',
          'Review AI-generated resumes, roadmaps, and job suggestions before acting on them.',
          'Do not misuse the platform, backend APIs, or authentication flows.',
        ],
      },
      {
        title: 'Limitations',
        items: [
          'AI responses may be incomplete or inaccurate.',
          'Job listings and interview questions can change over time.',
          'PathForge AI does not guarantee job placement or interview success.',
        ],
      },
    ],
  },
  cookies: {
    icon: FileText,
    eyebrow: 'Legal',
    title: 'Cookie Policy',
    intro: 'PathForge AI may rely on browser storage and Firebase authentication state to keep users signed in and maintain app sessions.',
    sections: [
      {
        title: 'Storage usage',
        items: [
          'Firebase may store authentication session data in the browser.',
          'The app may use local browser storage for session continuity and UI behavior.',
          'You can clear browser data to remove local session information.',
        ],
      },
    ],
  },
  compliance: {
    icon: Rocket,
    eyebrow: 'Legal',
    title: 'Compliance',
    intro: 'PathForge AI is designed as an educational career platform and should be deployed with proper environment variables, authentication settings, and Firestore rules.',
    sections: [
      {
        title: 'Deployment checklist',
        items: [
          'Keep Firebase Admin service credentials only on the backend host.',
          'Use Vercel environment variables for frontend Firebase web config.',
          'Set Firebase authorized domains for production URLs.',
          'Keep Firestore rules aligned with authenticated user access.',
        ],
      },
    ],
  },
};

export function isInfoPage(pageId) {
  return Boolean(pages[pageId]);
}

export default function InfoPage({ pageId, onBack }) {
  const page = pages[pageId] || pages.features;
  const Icon = page.icon;

  return (
    <main className="info-page">
      <div className="info-page-inner">
        <button className="btn btn-ghost info-back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Home
        </button>

        <header className="info-hero">
          <div className="info-icon">
            <Icon size={34} strokeWidth={1.7} />
          </div>
          <p className="info-eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </header>

        <section className="info-sections">
          {page.sections.map((section) => (
            <article className="info-card" key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
