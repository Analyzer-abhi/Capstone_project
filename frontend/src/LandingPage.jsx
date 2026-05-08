import React from 'react';
import { BookOpen, Briefcase, TrendingUp, Bell, MessageSquare, FileQuestion } from 'lucide-react';

export default function LandingPage({ onSelectFeature }) {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="logo-large">
          <BookOpen size={48} strokeWidth={2} />
          <h1>Career Accelerator</h1>
        </div>
        <p className="landing-tagline">
          Your AI-powered companion for career growth — from skill gaps to job offers
        </p>
      </header>

      <main className="landing-main">
        <section className="feature-section">
          <h2 className="section-title">Career Development</h2>
          <div className="feature-cards">
            <div className="feature-card" onClick={() => onSelectFeature('skill-gap')}>
              <div className="feature-icon">
                <TrendingUp size={40} />
              </div>
              <h2>Skill-Gap Analysis</h2>
              <p>
                Upload your resume and target job title. Get a personalized learning roadmap,
                track your progress, and build an ATS-optimized resume.
              </p>
              <ul className="feature-list">
                <li>AI-powered skill extraction</li>
                <li>Customized learning roadmap</li>
                <li>Progress tracking</li>
                <li>Tailored resume builder</li>
              </ul>
              <button className="feature-btn">Get Started →</button>
            </div>

            <div className="feature-card" onClick={() => onSelectFeature('job-search')}>
              <div className="feature-icon">
                <Briefcase size={40} />
              </div>
              <h2>Job Search & Alerts</h2>
              <p>
                Upload your updated resume to find matching jobs. Set up alerts for FAANG
                companies and get notified instantly when new opportunities arise.
              </p>
              <ul className="feature-list">
                <li>Smart job matching</li>
                <li>FAANG job alerts</li>
                <li>Email notifications</li>
                <li>Real-time updates</li>
              </ul>
              <button className="feature-btn">Explore Jobs →</button>
            </div>
          </div>
        </section>

        <section className="feature-section">
          <h2 className="section-title">Interview Preparation</h2>
          <div className="feature-cards">
            <div className="feature-card" onClick={() => onSelectFeature('ai-interview')}>
              <div className="feature-icon feature-icon-gradient-2">
                <MessageSquare size={40} />
              </div>
              <h2>AI Interview Chat</h2>
              <p>
                Practice real-time interviews with AI. Upload your resume, select a job role,
                and get personalized questions. Receive detailed feedback after completion.
              </p>
              <ul className="feature-list">
                <li>Resume-based questions</li>
                <li>Role-specific scenarios</li>
                <li>Real-time chat interface</li>
                <li>Detailed performance report</li>
              </ul>
              <button className="feature-btn">Start Practice →</button>
            </div>

            <div className="feature-card" onClick={() => onSelectFeature('faang-questions')}>
              <div className="feature-icon feature-icon-gradient-2">
                <FileQuestion size={40} />
              </div>
              <h2>FAANG Interview Bank</h2>
              <p>
                Access real interview questions from top tech companies. Browse questions
                by company, difficulty, and topic to prepare effectively.
              </p>
              <ul className="feature-list">
                <li>Company-specific questions</li>
                <li>Online assessment problems</li>
                <li>Difficulty levels</li>
                <li>Topic categorization</li>
              </ul>
              <button className="feature-btn">Browse Questions →</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>Built for B.Tech students — your complete career growth platform</p>
      </footer>
    </div>
  );
}
