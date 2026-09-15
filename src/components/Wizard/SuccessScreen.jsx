import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle, ShieldCheck, Flame, MapPin, GraduationCap, PartyPopper, RotateCcw } from 'lucide-react';
import { VIBE_CATEGORIES } from '../../data/vibeData';

export default function SuccessScreen({ formData, onReset, onGoHome }) {
  // Trigger celebratory confetti blast on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#C084FC', '#F59E0B', '#34D399', '#EC4899']
      });
      // Second staggered wave
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 350);
      return () => clearTimeout(timer);
    } catch (e) {
      console.warn('Confetti unavailable:', e);
    }
  }, []);

  const selectedVibeDetails = VIBE_CATEGORIES.filter((v) => 
    (formData.vibes || []).includes(v.id)
  );

  return (
    <div className="success-wrapper">
      <div style={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'rgba(52, 211, 153, 0.15)',
        border: '2px solid rgba(52, 211, 153, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 0.75rem',
        color: '#34D399'
      }}>
        <CheckCircle size={32} />
      </div>

      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '0.25rem' }}>
        Welcome to Extroverts!
      </h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Your verified social profile is now live. Let vibes find vibes!
      </p>

      {/* Official Digital Membership Pass (Matches screen_1.png and screen_2.png) */}
      <div className="club-pass-card">
        <div className="pass-header">
          <div className="club-tier-badge">
            <Sparkles size={12} color="#A855F7" />
            <span>BRONZE CLUB MEMBER</span>
          </div>
          <div className="tokens-badge">
            <Flame size={12} />
            <span>10 VIBE TOKENS</span>
          </div>
        </div>

        <div className="pass-user-info">
          <img
            src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt="Profile Avatar"
            className="pass-avatar"
          />
          <div>
            <div className="pass-user-name">
              {formData.firstName || 'Extrovert'} {formData.lastName || 'Member'}
            </div>
            <div className="pass-user-sub">
              {formData.pronouns || 'Member'} • {formData.age ? `${formData.age} yrs` : 'Verified'}
            </div>
          </div>
        </div>

        {/* Location & Campus tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} color="#A855F7" />
            <span>{formData.city ? `${formData.city.toUpperCase()}` : 'City'}, {formData.state ? formData.state.toUpperCase() : 'IN'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <GraduationCap size={14} color="#A855F7" />
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {formData.college || 'Campus Member'}
            </span>
          </div>
        </div>

        {/* Selected vibes */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
          {selectedVibeDetails.map((vibe) => (
            <span
              key={vibe.id}
              style={{
                fontSize: '0.72rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                padding: '3px 8px',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>{vibe.emoji}</span>
              <span>{vibe.label}</span>
            </span>
          ))}
        </div>

        {/* Bio quote if provided */}
        {formData.bio && (
          <div style={{
            fontSize: '0.78rem',
            fontStyle: 'italic',
            color: 'var(--text-accent)',
            background: 'rgba(168, 85, 247, 0.1)',
            padding: '8px 12px',
            borderRadius: '10px',
            marginBottom: '0.75rem'
          }}>
            "{formData.bio}"
          </div>
        )}

        <div className="pass-vibe-bar">
          <span>Promote to Silver at +40 tokens</span>
          <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>10 / 50</span>
        </div>
      </div>

      {/* Simulated Upcoming Hangouts Feed (matching screen_1.png and screen_6.png) */}
      <div style={{ width: '100%', maxWidth: '360px', textAlign: 'left', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Recommended Parties Nearby
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Daycation Vibes 🏖️</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Exclusive Party • Tonight 9:00 PM</div>
          </div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            background: 'var(--accent-purple)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '999px'
          }}>
            Request Join
          </span>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Waffle Cravings Any1? 🧇</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Belgian Waffle Co • Tomorrow 8:00 PM</div>
          </div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '999px'
          }}>
            Joined (6/8)
          </span>
        </div>
      </div>

      {/* Action to restart / test again */}
      <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '360px' }}>
        <button 
          type="button"
          className="btn-ghost" 
          onClick={onReset}
          title="Reset the signup wizard to start over"
        >
          <RotateCcw size={15} />
          <span>Test Wizard Again</span>
        </button>

        <button 
          type="button"
          className="btn-primary" 
          onClick={onGoHome}
        >
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
}
