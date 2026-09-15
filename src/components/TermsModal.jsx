import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Check } from 'lucide-react';

export default function TermsModal({ isOpen, onClose, onAccept, isAccepted }) {
  const [activeTab, setActiveTab] = useState('terms'); // 'terms' | 'privacy'

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={20} color="#A855F7" />
            <h2 className="modal-title">
              {activeTab === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 1.5rem', background: 'rgba(255,255,255,0.02)' }}>
          <button
            onClick={() => setActiveTab('terms')}
            style={{
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'terms' ? '2px solid var(--accent-neon)' : '2px solid transparent',
              color: activeTab === 'terms' ? '#fff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)'
            }}
          >
            Terms of Service (18+ Requirement)
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            style={{
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'privacy' ? '2px solid var(--accent-neon)' : '2px solid transparent',
              color: activeTab === 'privacy' ? '#fff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)'
            }}
          >
            Privacy Policy & Location
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'terms' ? (
            <>
              <p style={{ color: 'var(--accent-light)', fontWeight: 500 }}>Last updated: February 14, 2025 • Extrowurts Inc.</p>
              
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '1rem',
                color: '#FDE68A'
              }}>
                <strong>Age & Eligibility Clause:</strong> You must be at least 18 years of age or possess formal parental/guardian consent to create an account or attend in-person social events.
              </div>

              <h3>1. Acceptance of Terms</h3>
              <p>These Terms and Conditions ("Terms") govern your use of the Extroverts app ("Service" or "App"), operated by Extrowurts ("Company", "we", "our", or "us"). By accessing or using the Service, you agree to comply with and be bound by these Terms.</p>

              <h3>2. Use of the Service & Events</h3>
              <p>The Extroverts app allows users to discover, create, host, and join parties or meetups at designated venues with other verified users. You agree not to use the Service for any illegal, harmful, harassing, or unethical activities.</p>

              <h3>3. Account Security & Verification</h3>
              <p>You are responsible for maintaining the confidentiality of your account credentials and one-time verification passwords (OTP). Any activity under your account remains your legal responsibility.</p>

              <h3>4. Code of Conduct for In-Person Gatherings</h3>
              <p>Every member of Extroverts agrees to respect personal boundaries, consent, and local community standards. Zero tolerance is enforced for violence, discrimination, or non-consensual behavior at social gatherings.</p>

              <h3>5. Limitation of Liability</h3>
              <p>While Extroverts fosters real-world community discovery, users attend social gatherings at their own discretion and mutual agreement with event hosts.</p>
            </>
          ) : (
            <>
              <p style={{ color: 'var(--accent-light)', fontWeight: 500 }}>Last updated: February 14, 2025 • Madhya Pradesh, India</p>

              <h3>1. Personal Data Collected</h3>
              <p>We collect essential identity details including your name, email address, age/date of birth, gender/pronouns, academic campus/city, and vibe preferences to personalize event matching and safety.</p>

              <h3>2. Location Data & Mapping Services</h3>
              <p>With your explicit permission, Extroverts collects device location to recommend nearby college parties, weekend hangouts, and friend circles via Google Maps integration.</p>

              <h3>3. Data Retention & Privacy Rights</h3>
              <p>We implement strict encryption and storage practices. You may request data deletion or revoke location permissions at any time through your account preferences.</p>

              <h3>4. Contact Us</h3>
              <p>For privacy inquiries, contact: <code>pigeon.himanshu@gmail.com</code></p>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" style={{ width: 'auto' }} onClick={onClose}>
            Close
          </button>
          {onAccept && (
            <button 
              className="btn-accent" 
              style={{ width: 'auto', padding: '10px 20px' }} 
              onClick={() => {
                onAccept();
                onClose();
              }}
            >
              <Check size={16} /> {isAccepted ? 'Acknowledged' : 'Accept Terms & Continue'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
