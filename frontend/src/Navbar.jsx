import React, { useState } from 'react';
import { Menu, X, LogOut, User, Settings, BookOpen, Home, LogIn, Target, MessageSquare, FileQuestion } from 'lucide-react';
import './navbar.css';

export default function Navbar({ user, onLogout, onNavigate, onLogin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'skill-gap', label: 'Skill Analysis', icon: BookOpen },
    { id: 'job-search', label: 'Job Search', icon: Target },
    { id: 'ai-interview', label: 'AI Interview', icon: MessageSquare },
    { id: 'faang-questions', label: 'FAANG Bank', icon: FileQuestion },
    ...(user ? [{ id: 'profile', label: 'Profile', icon: User }] : []),
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <button className="navbar-logo" onClick={() => handleNavClick('home')}>
          <BookOpen size={28} strokeWidth={1.5} />
          <span>PathForge AI</span>
        </button>

        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          {navLinks.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className="nav-link"
              onClick={() => handleNavClick(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* User Section */}
        <div className="navbar-user">
          {user ? (
            <div className="profile-section">
              <button
                className="profile-button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="Open profile menu"
              >
                <div className="profile-avatar">
                  {user.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>

              {isProfileOpen && (
                <>
                  <div className="profile-drawer">
                    <div className="drawer-header">
                      <div className="drawer-avatar">
                        {user.fullName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="drawer-user">
                        <p className="drawer-name">{user.fullName || 'User'}</p>
                        <p className="drawer-status">Account settings</p>
                      </div>
                      <button className="drawer-close" onClick={() => setIsProfileOpen(false)} aria-label="Close profile panel">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="drawer-links">
                      <button className="drawer-link" onClick={() => { onNavigate('profile'); setIsProfileOpen(false); }}>
                        <User size={18} />
                        Profile
                      </button>
                      <button className="drawer-link" onClick={() => setIsProfileOpen(false)}>
                        <Settings size={18} />
                        Settings
                      </button>
                      <button className="drawer-link logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                  <div className="backdrop" onClick={() => setIsProfileOpen(false)} />
                </>
              )}
            </div>
          ) : (
            <button
              className="btn-login-navbar"
              onClick={onLogin}
            >
              <LogIn size={18} />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className="mobile-nav-link"
              onClick={() => handleNavClick(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
          <div className="mobile-menu-divider"></div>
          {user ? (
            <>
              <div className="mobile-user-info">
                <div className="profile-avatar-small">
                  {user.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="mobile-profile-name">{user.fullName || 'User'}</p>
                  <p className="mobile-profile-email">{user.email}</p>
                </div>
              </div>
              <button className="mobile-nav-link logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                Sign Out
              </button>
            </>
          ) : (
            <button className="mobile-nav-link" onClick={onLogin}>
              <LogIn size={18} />
              Sign In
            </button>
          )}
        </div>
      )}

      {/* Backdrop for profile menu */}
      {isProfileOpen && (
        <div className="backdrop" onClick={() => setIsProfileOpen(false)} />
      )}
    </nav>
  );
}
