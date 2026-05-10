import React, { useEffect, useState } from 'react';
import { ArrowLeft, Award, CalendarCheck, ShieldCheck } from 'lucide-react';
import { saveUserProfile } from './firebaseHelpers';

export default function ProfileView({ user, onBack, onProfileSave }) {
  const [profileInfo, setProfileInfo] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    jobTitle: user?.jobTitle || '',
    location: user?.location || '',
    bio: user?.bio || 'I am building my next career move with PathForge AI.',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    setProfileInfo({
      fullName: user?.fullName || '',
      email: user?.email || '',
      jobTitle: user?.jobTitle || '',
      location: user?.location || '',
      bio: user?.bio || 'I am building my next career move with PathForge AI.',
    });
  }, [user]);

  const handleChange = (field, value) => {
    setProfileInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    setStatus('Saving...');
    
    const profileUpdates = {
      fullName: profileInfo.fullName,
      jobTitle: profileInfo.jobTitle,
      location: profileInfo.location,
      bio: profileInfo.bio,
    };

    // Save profile to Firestore
    if (user?.uid) {
      saveUserProfile(user, profileUpdates)
        .then(() => {
          setStatus('Profile saved successfully');
          onProfileSave?.(profileUpdates);
          window.setTimeout(() => setStatus(''), 3000);
        })
        .catch((err) => {
          console.error('Failed to save profile:', err);
          setStatus('Failed to save profile');
          window.setTimeout(() => setStatus(''), 3000);
        });
    } else {
      setStatus('User not authenticated');
      window.setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <main className="app-container profile-view">
      <div className="profile-header">
        <button className="btn btn-ghost back-home-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>

        <div className="profile-details-card">
          <div className="profile-card-top">
            <div className="profile-avatar-large-page">{profileInfo.fullName?.charAt(0).toUpperCase() || 'U'}</div>
            <div>
              <h1>{profileInfo.fullName || 'Career Builder'}</h1>
              <p className="profile-email-page">{profileInfo.email || 'No email set'}</p>
            </div>
          </div>
          <p className="profile-summary">
            Use this page to keep your profile details current and help PathForge AI personalize your next career step.
          </p>
        </div>

        <div className="profile-form-card">
          <div className="profile-form-header">
            <h2>Profile edit</h2>
            <p>Update your name, career title, location, and personal summary.</p>
          </div>
          <form className="profile-form" onSubmit={handleSave}>
            <div className="form-row">
              <label>Name</label>
              <input
                type="text"
                value={profileInfo.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                value={profileInfo.email}
                readOnly
              />
            </div>
            <div className="form-row">
              <label>Job title</label>
              <input
                type="text"
                value={profileInfo.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                placeholder="Product designer, Data analyst, etc."
              />
            </div>
            <div className="form-row">
              <label>Location</label>
              <input
                type="text"
                value={profileInfo.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Remote, New York, London"
              />
            </div>
            <div className="form-row">
              <label>Bio</label>
              <textarea
                rows="4"
                value={profileInfo.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="A short career snapshot"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save profile
            </button>
            {status && <p className="profile-save-status">{status}</p>}
          </form>
        </div>
      </div>

      <section className="profile-grid">
        <article className="profile-card feature-card">
          <div className="feature-card-header">
            <Award size={28} />
            <h3>Career journey</h3>
          </div>
          <p className="feature-description">Your personalized roadmap, saved progress, and resume insights are ready when you are.</p>
        </article>

        <article className="profile-card feature-card">
          <div className="feature-card-header">
            <CalendarCheck size={28} />
            <h3>Recent activity</h3>
          </div>
          <p className="feature-description">Continue your last session or jump straight into AI interview practice and job search.</p>
        </article>

        <article className="profile-card feature-card">
          <div className="feature-card-header">
            <ShieldCheck size={28} />
            <h3>Secure access</h3>
          </div>
          <p className="feature-description">Your profile is stored locally for now, but soon this will update through Firebase authentication.</p>
        </article>
      </section>
    </main>
  );
}
