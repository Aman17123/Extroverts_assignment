import React from 'react';
import { ArrowRight, Sparkles, Shield, Users, PartyPopper, Flame } from 'lucide-react';
import { VIBE_CATEGORIES } from '../data/vibeData';

export default function LandingPage({ onStartWizard, onOpenTerms }) {
  return (
    <div className="hero-section">
      <div className="hero-pill-badge">
        <Sparkles size={15} />
        <span>Random people. Real parties. Real memories.</span>
      </div>

      <h1 className="hero-headline">
        Strangers.
        <span>Hangouts. Memories.</span>
      </h1>

      <p className="hero-subhead">
        Break free from endless scrolling and reconnect with real people, in the real world. 
        Discover spontaneous meetups, campus clubs, and exclusive house parties tailored to your vibe.
      </p>

      {/* Floating party vibe tags directly from Extroverts app */}
      <div className="floating-vibes-row">
        {VIBE_CATEGORIES.slice(0, 8).map((vibe) => (
          <div key={vibe.id} className="vibe-tag-badge">
            <span>{vibe.emoji}</span>
            <span>{vibe.label}</span>
          </div>
        ))}
      </div>

      {/* Primary CTAs */}
      <div className="hero-cta-group">
        <button 
          type="button"
          className="btn-primary" 
          onClick={onStartWizard}
          id="btn-start-wizard"
        >
          <span>Get Started • 4-Step Signup</span>
          <ArrowRight size={18} />
        </button>

        <button 
          type="button"
          className="btn-ghost" 
          onClick={onOpenTerms}
          id="btn-view-terms"
        >
          <Shield size={16} />
          <span>Terms & Conditions (18+ Policy)</span>
        </button>
      </div>

      {/* Feature highlight mini-cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        width: '100%', 
        maxWidth: '700px', 
        marginTop: '3.5rem',
        textAlign: 'left'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A855F7', marginBottom: 8 }}>
            <PartyPopper size={20} />
            <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#fff' }}>Exclusive Hangouts</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Access curated college gatherings, board game showdowns, and music jams in your city.
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#F59E0B', marginBottom: 8 }}>
            <Flame size={20} />
            <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#fff' }}>Honorary Vibe Tokens</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Earn vibe tokens upon onboarding to unlock bronze, silver, and ivory party circles.
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34D399', marginBottom: 8 }}>
            <Users size={20} />
            <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#fff' }}>Verified Profiles</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Campus email and phone verification keeping every hangout safe, authentic, and fun.
          </p>
        </div>
      </div>
    </div>
  );
}
