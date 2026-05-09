import React from 'react';
import { BookOpen, Briefcase, TrendingUp, MessageSquare, FileQuestion, ArrowRight } from 'lucide-react';

export default function LandingPage({ onSelectFeature }) {
  const features = [
    {
      id: 'skill-gap',
      icon: TrendingUp,
      title: 'Skill-Gap Analysis',
      description: 'Upload your resume and target job title. Get a personalized learning roadmap, track your progress, and build an ATS-optimized resume.',
      items: ['AI-powered skill extraction', 'Customized learning roadmap', 'Progress tracking', 'Tailored resume builder'],
      cta: 'Get Started'
    },
    {
      id: 'job-search',
      icon: Briefcase,
      title: 'Job Search & Alerts',
      description: 'Upload your updated resume to find matching jobs. Set up alerts for FAANG companies and get notified instantly when new opportunities arise.',
      items: ['Smart job matching', 'FAANG job alerts', 'Email notifications', 'Real-time updates'],
      cta: 'Explore Jobs'
    },
    {
      id: 'ai-interview',
      icon: MessageSquare,
      title: 'AI Interview Chat',
      description: 'Practice real-time interviews with AI. Upload your resume, select a job role, and get personalized questions. Receive detailed feedback after completion.',
      items: ['Resume-based questions', 'Role-specific scenarios', 'Real-time chat interface', 'Detailed performance report'],
      cta: 'Start Practice'
    },
    {
      id: 'faang-questions',
      icon: FileQuestion,
      title: 'FAANG Interview Bank',
      description: 'Access real interview questions from top tech companies. Browse questions by company, difficulty, and topic to prepare effectively.',
      items: ['Company-specific questions', 'Online assessment problems', 'Difficulty levels', 'Topic categorization'],
      cta: 'Browse Questions'
    }
  ];

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="logo-large">
          <BookOpen size={56} strokeWidth={1.5} />
          <div>
            <h1>Career Accelerator</h1>
            <p className="landing-tagline">Your AI-powered companion for career growth — from skill gaps to job offers</p>
          </div>
        </div>
      </header>

      <main className="landing-main">
        <section className="feature-section">
          <h2 className="section-title">Career Development</h2>
          <div className="feature-cards">
            {features.slice(0, 2).map((feature) => (
              <FeatureCard key={feature.id} feature={feature} onSelect={onSelectFeature} />
            ))}
          </div>
        </section>

        <section className="feature-section">
          <h2 className="section-title">Interview Preparation</h2>
          <div className="feature-cards">
            {features.slice(2).map((feature) => (
              <FeatureCard key={feature.id} feature={feature} onSelect={onSelectFeature} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ feature, onSelect }) {
  const Icon = feature.icon;
  return (
    <button
      type="button"
      className="feature-card-btn"
      onClick={() => onSelect(feature.id)}
    >
      <div className="feature-card">
        <div className="feature-card-header">
          <div className="feature-icon">
            <Icon size={44} strokeWidth={1.5} />
          </div>
          <h3>{feature.title}</h3>
        </div>

        <p className="feature-description">{feature.description}</p>

        <ul className="feature-list">
          {feature.items.map((item) => (
            <li key={item}>
              <span className="checkmark">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="feature-cta">
          <span className="cta-text">{feature.cta}</span>
          <ArrowRight size={18} className="cta-arrow" />
        </div>
      </div>
    </button>
  );
}

      <footer className="landing-footer">
        <p>Built for B.Tech students — your complete career growth platform</p>
      </footer>
    </div>
  );
}
