import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import './auth.css';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp) {
      if (!fullName || password !== confirmPassword) {
        setError('Please check your information');
        return;
      }
    }

    setLoading(true);
    try {
      // Simulate auth request
      await new Promise(r => setTimeout(r, 2000));
      // TODO: Integrate with backend auth
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-background" />
      
      <div className="auth-card">
        <div className="auth-header">
          <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p>{isSignUp ? 'Join our community today' : 'Sign in to your account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error">{error}</div>}

          {isSignUp && (
            <div className="form-row">
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="form-row">
            <label className="label">
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-row">
            <label className="label">
              <Lock size={18} />
              Password
            </label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div className="form-row">
              <label className="label">
                <Lock size={18} />
                Confirm Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {!isSignUp && (
            <div className="form-row">
              <button type="button" className="forgot-password">
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                {isSignUp ? 'Creating account...' : 'Signing in...'}
              </>
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="oauth-buttons">
          <button className="oauth-btn">Google</button>
          <button className="oauth-btn">GitHub</button>
        </div>

        <div className="auth-footer">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="toggle-auth"
                onClick={() => setIsSignUp(false)}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                className="toggle-auth"
                onClick={() => setIsSignUp(true)}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>

      <div className="auth-sidebar">
        <div className="sidebar-content">
          <h2>Career Accelerator</h2>
          <p>Transform your career with AI-powered insights</p>
          <ul className="sidebar-features">
            <li>✓ Personalized learning roadmaps</li>
            <li>✓ AI interview preparation</li>
            <li>✓ Smart job matching</li>
            <li>✓ ATS-optimized resumes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
