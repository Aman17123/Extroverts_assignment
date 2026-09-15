import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import EnhancedOTP from './EnhancedOTP';

export default function Step1Auth({ 
  formData, 
  updateFormData, 
  onNext, 
  onOpenTerms, 
  addToast 
}) {
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  
  // Real-time validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    let error = '';
    if (field === 'email') {
      const emailVal = (value || '').trim();
      if (!emailVal) {
        error = 'Email is required to join Extroverts.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        error = 'Please enter a valid email address (e.g. name@campus.edu).';
      }
    } else if (field === 'password') {
      if (!value) {
        error = 'Password is required.';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters.';
      }
    } else if (field === 'termsAccepted') {
      if (!value) {
        error = 'You must accept the Terms & Conditions to proceed.';
      }
    }
    return error;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, val) => {
    let processedVal = val;
    if (field === 'email') {
      // Prevent whitespace in email
      processedVal = val.replace(/\s/g, '').toLowerCase();
    }
    updateFormData({ [field]: processedVal });
    if (touched[field]) {
      const error = validateField(field, processedVal);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleRequestOtp = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true, termsAccepted: true });

    const emailErr = validateField('email', formData.email);
    const passErr = validateField('password', formData.password);
    const termsErr = validateField('termsAccepted', formData.termsAccepted);

    if (emailErr || passErr || termsErr) {
      setErrors({ email: emailErr, password: passErr, termsAccepted: termsErr });
      addToast('Please correct the errors before continuing.', 'error');
      return;
    }

    setSubmitting(true);
    // Simulate sending OTP
    setTimeout(() => {
      setSubmitting(false);
      setShowOtpScreen(true);
      addToast(`Verification code dispatched to ${formData.email}`, 'info');
    }, 900);
  };

  if (showOtpScreen) {
    return (
      <EnhancedOTP
        email={formData.email}
        onVerifySuccess={() => {
          updateFormData({ emailVerified: true });
          onNext();
        }}
        onBackToEmail={() => setShowOtpScreen(false)}
        addToast={addToast}
      />
    );
  }

  return (
    <form onSubmit={handleRequestOtp} className="form-grid" noValidate>
      {/* Email Input */}
      <div className="form-group">
        <label className="form-label" htmlFor="auth-email">
          <span>Email Address <span className="req">*</span></span>
          <span className="field-hint">College or Personal</span>
        </label>
        <div className="input-wrapper">
          <Mail size={18} className="input-icon-left" />
          <input
            id="auth-email"
            type="email"
            placeholder="you@campus.edu or name@gmail.com"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={`form-input has-icon-left ${errors.email && touched.email ? 'error' : ''}`}
            autoComplete="email"
          />
        </div>
        {errors.email && touched.email && (
          <div className="field-error-msg" id="email-error">{errors.email}</div>
        )}
      </div>

      {/* Password Input */}
      <div className="form-group">
        <label className="form-label" htmlFor="auth-password">
          <span>Password <span className="req">*</span></span>
          <span className="field-hint">Min. 6 characters</span>
        </label>
        <div className="input-wrapper">
          <Lock size={18} className="input-icon-left" />
          <input
            id="auth-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a secure password"
            value={formData.password || ''}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            className={`form-input has-icon-left has-icon-right ${errors.password && touched.password ? 'error' : ''}`}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="input-icon-right"
            onClick={() => setShowPassword(!showPassword)}
            style={{ background: 'none', border: 'none' }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && touched.password && (
          <div className="field-error-msg" id="password-error">{errors.password}</div>
        )}
      </div>

      {/* Terms & Conditions Checkbox with Link to Modal */}
      <div className="form-group" style={{ marginTop: '0.5rem' }}>
        <div 
          className="checkbox-row" 
          onClick={() => handleChange('termsAccepted', !formData.termsAccepted)}
        >
          <div className={`custom-checkbox ${formData.termsAccepted ? 'checked' : ''}`}>
            {formData.termsAccepted && <span style={{ fontSize: '11px', fontWeight: 'bold' }}>✓</span>}
          </div>
          <div>
            I have read and agree to the{' '}
            <span 
              className="terms-link" 
              onClick={(e) => {
                e.stopPropagation();
                onOpenTerms();
              }}
            >
              Terms & Conditions
            </span>{' '}
            and Privacy Policy. I confirm I meet the community age standards (18+).
          </div>
        </div>
        {errors.termsAccepted && touched.termsAccepted && (
          <div className="field-error-msg" style={{ marginTop: 6 }}>{errors.termsAccepted}</div>
        )}
      </div>

      {/* Submit Button with Loading Spinner */}
      <button 
        type="submit" 
        className="btn-primary" 
        disabled={submitting}
        id="btn-submit-step1"
        style={{ marginTop: '1rem' }}
      >
        {submitting ? (
          <>
            <div className="spinner" />
            <span>Sending Verification Code...</span>
          </>
        ) : (
          <>
            <span>Verify with OTP</span>
            <ArrowRight size={18} />
          </>
        )}
      </button>

      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: 4 }}>
        Step 1 of 4 • Email verification unlocks profile setup
      </div>
    </form>
  );
}
