import React, { useState, useEffect } from 'react';
import './App.css';
import { useDropzone } from 'react-dropzone';
import { Upload, Target, Loader2, BookOpen } from 'lucide-react';
import { analyzeResume } from './api';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { saveUserProfile } from './firebaseHelpers';
import Navbar from './Navbar';
import Footer from './Footer';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RoadmapView from './RoadmapView';
import ResumeBuilderView from './ResumeBuilderView';
import JobSearchView from './JobSearchView';
import AIInterviewView from './AIInterviewView';
import FAANGQuestionsView from './FAANGQuestionsView';
import ProfileView from './ProfileView';

export default function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [isAuthMode, setIsAuthMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          fullName: fbUser.displayName || fbUser.email?.split('@')[0],
        });
        
        // Persist user profile to Firestore (updates lastLogin for returning users)
        saveUserProfile(fbUser).catch((err) => {
          console.error('Failed to save user profile in App.jsx:', err);
        });
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  // Navigation state
  const [currentFeature, setCurrentFeature] = useState(null);
  const [file, setFile] = useState(null);
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [view, setView] = useState('roadmap');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: (accepted) => setFile(accepted[0] || null),
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthMode(false);
    setCurrentFeature(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Logout failed', err);
    }

    setUser(null);
    setCurrentFeature(null);
    setFile(null);
    setTargetJobTitle('');
    setResult(null);
    setView('roadmap');
    setError('');
  };

  const handleProfileSave = (updates) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updates,
    }));
  };

  const handleNavigate = (featureId) => {
    if (featureId === 'home') {
      setCurrentFeature(null);
      setFile(null);
      setTargetJobTitle('');
      setResult(null);
      setView('roadmap');
      setError('');
      return;
    }

    if (!user) {
      setIsAuthMode(true);
      return;
    }

    setCurrentFeature(featureId);
  };

  const handleOpenAuth = () => {
    setIsAuthMode(true);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!file || !targetJobTitle.trim()) {
      setError('Please upload a resume and enter a target job title.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetJobTitle', targetJobTitle.trim());
      const data = await analyzeResume(formData);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function handleBackToLanding() {
    setCurrentFeature(null);
    setFile(null);
    setTargetJobTitle('');
    setResult(null);
    setView('roadmap');
    setError('');
  }

  // Auth page
  if (isAuthMode) {
    return (
      <>
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onNavigate={handleNavigate}
          onLogin={handleOpenAuth}
        />
        <LoginPage onLoginSuccess={handleLoginSuccess} onCancel={() => setIsAuthMode(false)} />
        <Footer />
      </>
    );
  }

  // Landing page (unauthenticated or when home is selected)
  if (!user || !currentFeature) {
    return (
      <>
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onNavigate={handleNavigate}
          onLogin={handleOpenAuth}
        />
        <LandingPage 
          onSelectFeature={user ? setCurrentFeature : () => setIsAuthMode(true)}
          user={user}
        />
        <Footer />
      </>
    );
  }

  // Job Search feature
  if (currentFeature === 'job-search') {
    return (
      <>
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onNavigate={handleNavigate}
          onLogin={handleOpenAuth}
        />
        <JobSearchView onBack={handleBackToLanding} />
        <Footer />
      </>
    );
  }

  // AI Interview feature
  if (currentFeature === 'ai-interview') {
    return (
      <>
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onNavigate={handleNavigate}
          onLogin={handleOpenAuth}
        />
        <AIInterviewView onBack={handleBackToLanding} />
        <Footer />
      </>
    );
  }

  // FAANG Questions feature
  if (currentFeature === 'faang-questions') {
    return (
      <>
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onNavigate={handleNavigate}
          onLogin={handleOpenAuth}
        />
        <FAANGQuestionsView onBack={handleBackToLanding} />
        <Footer />
      </>
    );
  }

  // Profile page
  if (currentFeature === 'profile') {
    return (
      <>
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onNavigate={handleNavigate}
          onLogin={handleOpenAuth}
        />
        <ProfileView user={user} onBack={handleBackToLanding} onProfileSave={handleProfileSave} />
        <Footer />
      </>
    );
  }

  // Skill-Gap Analysis feature
  return (
    <>
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={handleNavigate}
        onLogin={handleOpenAuth}
      />
      <div className="app">
        <header className="header">
          <button className="btn btn-ghost back-home-btn" onClick={handleBackToLanding}>
            ← Home
          </button>
          <div className="logo">
            <BookOpen size={28} strokeWidth={2} />
            <h1>Skill-Gap Career Roadmap</h1>
          </div>
          <p className="tagline">Upload your resume, set your target role — get a personalized learning path to close the gap.</p>
        </header>

        <main className="main">
          {!result ? (
            <form className="card form-card" onSubmit={handleSubmit}>
              <div className="form-row">
                <label className="label">
                  <Target size={18} /> Target job title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer at Google"
                  value={targetJobTitle}
                  onChange={(e) => setTargetJobTitle(e.target.value)}
                  className="input"
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <span className="label">
                  <Upload size={18} /> Resume (PDF, DOC, or TXT)
                </span>
                <div
                  {...getRootProps()}
                  className={`dropzone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <span className="file-name">{file.name}</span>
                  ) : (
                    <span>Drop your resume here or click to browse</span>
                  )}
                </div>
              </div>

              {error && <p className="error">{error}</p>}

              <div className="actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 size={20} className="spin" /> Building your roadmap…
                    </>
                  ) : (
                    'Analyze & build roadmap'
                  )}
                </button>
              </div>
            </form>
          ) : null}
        </main>
      </div>
      <Footer />
    </>
  );
}
