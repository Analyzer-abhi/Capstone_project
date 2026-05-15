import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import './footer.css';

export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  const handleFooterNavigate = (pageId) => (event) => {
    event.preventDefault();
    onNavigate?.(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="app-footer">
      <div className="footer-container">
        {/* Company Info Section */}
        <div className="footer-section footer-info">
          <div className="footer-logo">
            <span className="footer-logo-icon">📘</span>
            <span className="footer-logo-text">PathForge AI</span>
          </div>
          <p className="footer-description">
            Your AI-powered career companion. Analyze skills, discover opportunities, and build your next career move with confidence.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" title="GitHub">
              <Github size={18} />
            </a>
            <a href="#" className="social-link" title="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="#" className="social-link" title="Twitter">
              <Twitter size={18} />
            </a>
            <a href="#" className="social-link" title="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Product Links */}
        <div className="footer-section">
          <h4>Product</h4>
          <ul className="footer-links">
            <li><a href="#features" onClick={handleFooterNavigate('features')}>Features</a></li>
            <li><a href="#pricing" onClick={handleFooterNavigate('pricing')}>Pricing</a></li>
            <li><a href="#security" onClick={handleFooterNavigate('security')}>Security</a></li>
            <li><a href="#roadmap" onClick={handleFooterNavigate('roadmap-info')}>Roadmap</a></li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="footer-section">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><a href="#about" onClick={handleFooterNavigate('about')}>About Us</a></li>
            <li><a href="#blog" onClick={handleFooterNavigate('blog')}>Blog</a></li>
            <li><a href="#careers" onClick={handleFooterNavigate('careers')}>Careers</a></li>
            <li><a href="#contact" onClick={handleFooterNavigate('contact')}>Contact</a></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div className="footer-section">
          <h4>Legal</h4>
          <ul className="footer-links">
            <li><a href="#privacy" onClick={handleFooterNavigate('privacy')}>Privacy Policy</a></li>
            <li><a href="#terms" onClick={handleFooterNavigate('terms')}>Terms of Service</a></li>
            <li><a href="#cookies" onClick={handleFooterNavigate('cookies')}>Cookie Policy</a></li>
            <li><a href="#compliance" onClick={handleFooterNavigate('compliance')}>Compliance</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} PathForge AI. All rights reserved. | Empowering careers through AI</p>
      </div>
    </footer>
  );
}
