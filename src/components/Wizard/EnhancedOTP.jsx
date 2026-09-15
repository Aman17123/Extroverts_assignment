import React, { useState, useEffect, useRef } from 'react';
import { Mail, ArrowLeft, RotateCw, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function EnhancedOTP({ 
  email, 
  onVerifySuccess, 
  onBackToEmail, 
  addToast 
}) {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState('');
  
  const inputRefs = useRef([]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Resend Countdown Timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (index, value) => {
    // Only accept numeric digits
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned && value !== '') return;

    const newOtp = [...otpValues];
    newOtp[index] = cleaned.slice(-1); // Take the latest single digit
    setOtpValues(newOtp);
    setOtpError('');

    // Auto-advance to next input if digit entered
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        // Current box is empty, move back and clear previous
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (!pasteData) return;

    const digits = pasteData.slice(0, 6).split('');
    const newOtp = [...otpValues];
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });
    setOtpValues(newOtp);
    setOtpError('');

    // Focus last filled box or verify if full
    const nextFocusIndex = Math.min(digits.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
    addToast('OTP auto-filled from clipboard!', 'info');
  };

  const handleQuickFillDemo = () => {
    setOtpValues(['1', '2', '3', '4', '5', '6']);
    setOtpError('');
    addToast('Filled demo verification code: 123456', 'info');
  };

  const handleResend = () => {
    if (!canResend) return;
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setTimer(30);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      setOtpError('');
      inputRefs.current[0]?.focus();
      addToast('A new 6-digit verification code has been sent to ' + email, 'success');
    }, 1000);
  };

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    const enteredCode = otpValues.join('');

    if (enteredCode.length < 6) {
      setOtpError('Please enter all 6 digits of your verification code.');
      addToast('Incomplete OTP. Please enter all 6 digits.', 'error');
      return;
    }

    // In a prototype/assessment, any 6 digits or test '123456' is accepted
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      addToast('Email verified successfully! Profile unlocked.', 'success');
      onVerifySuccess();
    }, 1200);
  };

  const isComplete = otpValues.every((digit) => digit !== '');

  return (
    <div className="otp-container">
      <div style={{ textAlign: 'center', maxWidth: '360px' }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'rgba(168, 85, 247, 0.15)',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          color: 'var(--accent-light)'
        }}>
          <ShieldCheck size={26} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '0.4rem' }}>
          Verify Your Email
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          We sent a 6-digit confirmation code to <br />
          <strong style={{ color: 'var(--accent-light)', wordBreak: 'break-all' }}>{email}</strong>
        </p>
        
        <button
          type="button"
          onClick={onBackToEmail}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-light)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            textDecoration: 'underline',
            marginTop: '0.4rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <ArrowLeft size={12} /> Edit email address
        </button>
      </div>

      {/* 6-Digit OTP Boxes with Auto-Advance & Paste */}
      <div className="otp-boxes-wrapper" onPaste={handlePaste}>
        {otpValues.map((val, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={val}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`otp-input-box ${val ? 'filled' : ''} ${otpError ? 'error' : ''}`}
            aria-label={`Digit ${index + 1}`}
            id={`otp-digit-${index}`}
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {otpError && (
        <div className="field-error-msg" style={{ fontSize: '0.82rem', marginTop: -8 }}>
          {otpError}
        </div>
      )}

      {/* Assessment Enhancement: Demo auto-fill chip */}
      <div 
        className="otp-test-hint-chip" 
        onClick={handleQuickFillDemo}
        title="Click to quickly fill demo code"
      >
        <Sparkles size={13} />
        <span>Demo code: <strong>123456</strong> (Click to fill)</span>
      </div>

      {/* Resend Timer & Button */}
      <div className="otp-resend-row">
        <span>Didn't receive code?</span>
        {canResend ? (
          <button
            type="button"
            className="resend-link-btn"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend Code'}
          </button>
        ) : (
          <span style={{ color: 'var(--text-subtle)', fontVariantNumeric: 'tabular-nums' }}>
            Resend in {timer}s
          </span>
        )}
      </div>

      {/* Verify Action Button with Spinner */}
      <button
        type="button"
        className="btn-accent"
        onClick={handleVerify}
        disabled={!isComplete || isVerifying}
        id="btn-verify-otp"
        style={{ marginTop: '0.5rem' }}
      >
        {isVerifying ? (
          <>
            <div className="spinner light" />
            <span>Verifying Code...</span>
          </>
        ) : (
          <>
            <span>Verify & Continue</span>
            <CheckCircle2 size={18} />
          </>
        )}
      </button>
    </div>
  );
}
