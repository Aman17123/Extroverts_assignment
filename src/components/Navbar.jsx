import React from 'react';
import { Smartphone, Monitor, Shield, Sparkles } from 'lucide-react';

export default function Navbar({ 
  viewMode, 
  setViewMode, 
  onOpenTerms, 
  onGoHome, 
  currentScreen 
}) {
  return (
    <header className="navbar">
      <div className="brand-wrapper" onClick={onGoHome} title="Go to Extroverts Home">
        <div className="brand-icon">
          <img src="/extroverts-logo.png" alt="Extroverts App Logo" />
        </div>
        <div className="brand-name">
          Extroverts<span className="brand-dot">•</span>
        </div>
      </div>

      <div className="nav-actions">
        {/* Device Switcher for Evaluators / Recruiters */}
        <div className="mode-toggle" title="Switch between native mobile frame and expanded desktop layout">
          <button
            type="button"
            className={`mode-toggle-btn ${viewMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setViewMode('mobile')}
            aria-label="Mobile Mockup View"
          >
            <Smartphone size={14} />
            <span>Mobile App</span>
          </button>
          <button
            type="button"
            className={`mode-toggle-btn ${viewMode === 'web' ? 'active' : ''}`}
            onClick={() => setViewMode('web')}
            aria-label="Desktop Web View"
          >
            <Monitor size={14} />
            <span>Web View</span>
          </button>
        </div>

        <button 
          type="button"
          className="nav-link-btn" 
          onClick={onOpenTerms}
          title="Review Extroverts Terms and Conditions"
        >
          <Shield size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
          Terms
        </button>
      </div>
    </header>
  );
}
