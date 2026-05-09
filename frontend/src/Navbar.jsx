import React, { useState } from 'react';
import { Menu, X, LogOut, User, Settings, BookOpen, Home, LogIn } from 'lucide-react';
import './navbar.css';

export default function Navbar({ user, onLogout, onNavigate, onLogin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'skill-gap', label: 'Skill Analysis', icon: BookOpen },
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
          <span>Career Accelerator</span>
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
              >
                <div className="profile-avatar">
                  {user.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="profile-name">{user.fullName || 'User'}</span>
              </button>

              {isProfileOpen && (
                <div className="profile-menu">
                  <div className="profile-header">
                    <div className="profile-avatar-large">
                      {user.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="profile-email">{user.email}</p>
                      <p className="profile-fullname">{user.fullName || 'User'}</p>
                    </div>
                  </div>

                  <div className="profile-menu-divider"></div>

                  <button className="profile-menu-item">
                    <User size={18} />
                    View Profile
                  </button>
                  <button className="profile-menu-item">
                    <Settings size={18} />
                    Settings
                  </button>

                  <div className="profile-menu-divider"></div>

                  <button className="profile-menu-item logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
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
