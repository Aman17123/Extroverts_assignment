import React, { useState, useMemo } from 'react';
import { MapPin, Building, GraduationCap, Calendar, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { STATES_DATA } from '../../data/locationData';

export default function Step3Location({ 
  formData, 
  updateFormData, 
  onNext, 
  onBack, 
  addToast 
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Memoized available cities based on selected state
  const availableCities = useMemo(() => {
    if (!formData.state) return [];
    const stateObj = STATES_DATA.find((s) => s.id === formData.state);
    return stateObj ? stateObj.cities : [];
  }, [formData.state]);

  // Memoized available colleges based on selected city
  const availableColleges = useMemo(() => {
    if (!formData.city || availableCities.length === 0) return [];
    const cityObj = availableCities.find((c) => c.id === formData.city);
    return cityObj ? cityObj.colleges : [];
  }, [formData.city, availableCities]);

  const handleStateChange = (stateId) => {
    // Cross-field logic: Reset city and college when state changes
    updateFormData({
      state: stateId,
      city: '',
      college: ''
    });
    if (touched.state) {
      setErrors((prev) => ({ ...prev, state: '', city: '', college: '' }));
    }
  };

  const handleCityChange = (cityId) => {
    // Cross-field logic: Reset college when city changes
    updateFormData({
      city: cityId,
      college: ''
    });
    if (touched.city) {
      setErrors((prev) => ({ ...prev, city: '', college: '' }));
    }
  };

  const validate = (data) => {
    const errs = {};
    if (!data.state) errs.state = 'Please select your state.';
    if (!data.city) errs.city = 'Please select your city.';
    if (!data.college) errs.college = 'Please select your college or professional status.';
    
    // Grad year validation if student
    if (data.gradYear) {
      const yearNum = parseInt(data.gradYear, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(yearNum) || yearNum < 1980 || yearNum > currentYear + 8) {
        errs.gradYear = `Please enter a realistic 4-digit graduation year (e.g. ${currentYear}).`;
      }
    }
    return errs;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [field]: currentErrors[field] }));
  };

  const handleGradYearChange = (val) => {
    // Numeric only, 4 digits max
    const numeric = val.replace(/\D/g, '').slice(0, 4);
    updateFormData({ gradYear: numeric });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ state: true, city: true, college: true, gradYear: true });

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast('Please complete all location and college dependencies.', 'error');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onNext();
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid" noValidate>
      <div style={{
        background: 'rgba(168, 85, 247, 0.08)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        padding: '12px 14px',
        borderRadius: '12px',
        fontSize: '0.84rem',
        color: 'var(--accent-light)'
      }}>
        📍 <strong>Local Hangouts & Circles:</strong> Choosing your state and city helps Extroverts connect you to local campus events and party organizers near you.
      </div>

      {/* State Selector (Cross-Field Dependency Parent) */}
      <div className="form-group">
        <label className="form-label" htmlFor="location-state">
          <span>Select State <span className="req">*</span></span>
        </label>
        <div className="input-wrapper">
          <MapPin size={17} className="input-icon-left" />
          <select
            id="location-state"
            value={formData.state || ''}
            onChange={(e) => handleStateChange(e.target.value)}
            onBlur={() => handleBlur('state')}
            className={`form-select has-icon-left ${errors.state && touched.state ? 'error' : ''}`}
          >
            <option value="">-- Choose State --</option>
            {STATES_DATA.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        {errors.state && touched.state && (
          <div className="field-error-msg">{errors.state}</div>
        )}
      </div>

      {/* City Selector (Cascading: Dependent on State) */}
      <div className="form-group">
        <label className="form-label" htmlFor="location-city">
          <span>Select City <span className="req">*</span></span>
          <span className="field-hint">
            {!formData.state ? 'Select State first' : `${availableCities.length} cities available`}
          </span>
        </label>
        <div className="input-wrapper">
          <Building size={17} className="input-icon-left" />
          <select
            id="location-city"
            value={formData.city || ''}
            onChange={(e) => handleCityChange(e.target.value)}
            onBlur={() => handleBlur('city')}
            disabled={!formData.state}
            className={`form-select has-icon-left ${errors.city && touched.city ? 'error' : ''}`}
          >
            <option value="">
              {!formData.state ? '-- First Select a State --' : '-- Choose City --'}
            </option>
            {availableCities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        {errors.city && touched.city && (
          <div className="field-error-msg">{errors.city}</div>
        )}
      </div>

      {/* College / Campus Selector (Cascading: Dependent on City) */}
      <div className="form-group">
        <label className="form-label" htmlFor="location-college">
          <span>College / University / Organization <span className="req">*</span></span>
          <span className="field-hint">
            {!formData.city ? 'Select City first' : `${availableColleges.length} institutions`}
          </span>
        </label>
        <div className="input-wrapper">
          <GraduationCap size={17} className="input-icon-left" />
          <select
            id="location-college"
            value={formData.college || ''}
            onChange={(e) => updateFormData({ college: e.target.value })}
            onBlur={() => handleBlur('college')}
            disabled={!formData.city}
            className={`form-select has-icon-left ${errors.college && touched.college ? 'error' : ''}`}
          >
            <option value="">
              {!formData.city ? '-- First Select a City --' : '-- Select Campus or Professional --'}
            </option>
            {availableColleges.map((collegeName) => (
              <option key={collegeName} value={collegeName}>
                {collegeName}
              </option>
            ))}
            <option value="Other Campus">Other Institution / University</option>
          </select>
        </div>
        {errors.college && touched.college && (
          <div className="field-error-msg">{errors.college}</div>
        )}
      </div>

      {/* Academic Year / Grad Year (Numeric constraint) */}
      <div className="form-group">
        <label className="form-label" htmlFor="location-gradyear">
          <span>Graduation Year (Optional)</span>
          <span className="field-hint">4-digit year (e.g. 2026)</span>
        </label>
        <div className="input-wrapper">
          <Calendar size={17} className="input-icon-left" />
          <input
            id="location-gradyear"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 2026"
            value={formData.gradYear || ''}
            onChange={(e) => handleGradYearChange(e.target.value)}
            onBlur={() => handleBlur('gradYear')}
            className={`form-input has-icon-left ${errors.gradYear && touched.gradYear ? 'error' : ''}`}
            maxLength={4}
          />
        </div>
        {errors.gradYear && touched.gradYear && (
          <div className="field-error-msg">{errors.gradYear}</div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          type="button"
          className="btn-ghost"
          style={{ width: '40%' }}
          onClick={onBack}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '60%' }}
          disabled={submitting}
          id="btn-submit-step3"
        >
          {submitting ? (
            <>
              <div className="spinner" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <span>Next • Party Vibe</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
