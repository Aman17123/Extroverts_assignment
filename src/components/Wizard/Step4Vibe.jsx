import React, { useState } from 'react';
import { Sparkles, Image, Check, ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import { VIBE_CATEGORIES, AVATAR_PRESETS, SAMPLE_SUPERLATIVES } from '../../data/vibeData';

export default function Step4Vibe({ 
  formData, 
  updateFormData, 
  onSubmitComplete, 
  onBack, 
  addToast 
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const selectedVibes = formData.vibes || [];
  const selectedAvatar = formData.avatar || AVATAR_PRESETS[0].url;

  const toggleVibe = (vibeId) => {
    let updated;
    if (selectedVibes.includes(vibeId)) {
      updated = selectedVibes.filter((id) => id !== vibeId);
    } else {
      if (selectedVibes.length >= 6) {
        addToast('You can select up to 6 party vibes.', 'info');
        return;
      }
      updated = [...selectedVibes, vibeId];
    }
    updateFormData({ vibes: updated });
    setErrors((prev) => ({ ...prev, vibes: '' }));
  };

  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('Please upload a valid image file (PNG/JPEG).', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateFormData({ avatar: event.target.result });
        addToast('Custom profile photo loaded!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs = {};
    if (selectedVibes.length === 0) {
      errs.vibes = 'Please select at least 1 party vibe to customize your feed.';
    }
    const bioText = (formData.bio || '').trim();
    if (bioText.length > 160) {
      errs.bio = 'Bio cannot exceed 160 characters.';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ vibes: true, bio: true });

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      addToast('Please select your party vibe preferences.', 'error');
      return;
    }

    setSubmitting(true);
    // Simulate final account creation and badge minting
    setTimeout(() => {
      setSubmitting(false);
      onSubmitComplete();
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid" noValidate>
      {/* Avatar Picker Section */}
      <div className="form-group">
        <label className="form-label">
          <span>Choose Profile Avatar</span>
          <span className="field-hint">Presets or upload</span>
        </label>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', margin: '0.5rem 0' }}>
          <img
            src={selectedAvatar}
            alt="Current Avatar"
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: '3px solid var(--accent-neon)',
              objectFit: 'cover',
              boxShadow: '0 0 16px var(--accent-glow)'
            }}
          />
          <div>
            <label 
              htmlFor="avatar-file-upload" 
              className="btn-ghost" 
              style={{ width: 'auto', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              <Upload size={14} /> Upload Custom Photo
            </label>
            <input
              id="avatar-file-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleCustomAvatarUpload}
            />
          </div>
        </div>

        <div className="avatar-grid">
          {AVATAR_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className={`avatar-option ${selectedAvatar === preset.url ? 'selected' : ''}`}
              onClick={() => updateFormData({ avatar: preset.url })}
              title={preset.label}
            >
              <img src={preset.url} alt={preset.label} />
            </div>
          ))}
        </div>
      </div>

      {/* Vibe Selection Grid */}
      <div className="form-group">
        <label className="form-label">
          <span>Set Your Vibe (Pick 1 - 6) <span className="req">*</span></span>
          <span className="field-hint" style={{ color: selectedVibes.length > 0 ? '#34D399' : 'var(--text-subtle)' }}>
            {selectedVibes.length} selected
          </span>
        </label>

        <div className="vibe-selection-grid">
          {VIBE_CATEGORIES.map((vibe) => {
            const isSelected = selectedVibes.includes(vibe.id);
            return (
              <div
                key={vibe.id}
                className={`vibe-select-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleVibe(vibe.id)}
              >
                <span className="vibe-emoji">{vibe.emoji}</span>
                <span className="vibe-name">{vibe.label}</span>
                <span className="vibe-tagline">{vibe.tag}</span>
              </div>
            );
          })}
        </div>
        {errors.vibes && (
          <div className="field-error-msg">{errors.vibes}</div>
        )}
      </div>

      {/* Bio / Superlative (max 160 chars) */}
      <div className="form-group">
        <label className="form-label" htmlFor="vibe-bio">
          <span>Party Superlative & Bio</span>
          <span className="field-hint">
            {(formData.bio || '').length}/160 characters
          </span>
        </label>
        <textarea
          id="vibe-bio"
          rows={3}
          placeholder="e.g. Always down for karaoke and 2 AM street food runs. Looking for music lovers!"
          value={formData.bio || ''}
          onChange={(e) => {
            if (e.target.value.length <= 160) {
              updateFormData({ bio: e.target.value });
            }
          }}
          className={`form-textarea ${(formData.bio || '').length > 160 ? 'error' : ''}`}
        />
        
        {/* Quick chip ideas */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
          {SAMPLE_SUPERLATIVES.slice(0, 3).map((sup, idx) => (
            <span
              key={idx}
              onClick={() => updateFormData({ bio: sup })}
              style={{
                fontSize: '0.72rem',
                background: 'rgba(255,255,255,0.05)',
                padding: '3px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
              title="Click to insert"
            >
              + {sup}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          type="button"
          className="btn-ghost"
          style={{ width: '35%' }}
          onClick={onBack}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          type="submit"
          className="btn-accent"
          style={{ width: '65%' }}
          disabled={submitting}
          id="btn-submit-step4"
        >
          {submitting ? (
            <>
              <div className="spinner light" />
              <span>Minting Profile & Tokens...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Complete Setup & Join</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
