import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Step1Auth from './Step1Auth';
import Step2Profile from './Step2Profile';
import Step3Location from './Step3Location';
import Step4Vibe from './Step4Vibe';
import SuccessScreen from './SuccessScreen';

export default function WizardContainer({ 
  currentStep, 
  setCurrentStep, 
  formData, 
  updateFormData, 
  onOpenTerms, 
  onResetWizard, 
  onGoHome, 
  addToast 
}) {
  const stepsMetadata = [
    { number: 1, title: 'Create Account', subtitle: 'Verify your email with our upgraded OTP system' },
    { number: 2, title: 'Personal Details', subtitle: 'Name, age verification, and pronouns' },
    { number: 3, title: 'Campus & Location', subtitle: 'Discover circles at your college and city' },
    { number: 4, title: 'Set Your Vibe', subtitle: 'Choose your party style and profile avatar' }
  ];

  const currentMeta = stepsMetadata[currentStep - 1] || {};
  const progressPercent = Math.min(100, Math.round((currentStep / 4) * 100));

  return (
    <div className="wizard-card">
      {/* Show header and progress bar only during active steps 1-4 */}
      {currentStep <= 4 && (
        <div className="wizard-header">
          <div className="wizard-nav-top">
            {currentStep > 1 ? (
              <button
                type="button"
                className="wizard-back-btn"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                aria-label="Previous step"
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <div style={{ width: 60 }} />
            )}

            <div className="wizard-step-counter">
              Step {currentStep} of 4
            </div>

            <div style={{ width: 60, textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
              {progressPercent}%
            </div>
          </div>

          <div className="progress-track">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>

          <div className="step-title-group">
            <h2 className="step-title">{currentMeta.title}</h2>
            <p className="step-subtitle">{currentMeta.subtitle}</p>
          </div>
        </div>
      )}

      {/* Step Renderers */}
      {currentStep === 1 && (
        <Step1Auth
          formData={formData}
          updateFormData={updateFormData}
          onNext={() => setCurrentStep(2)}
          onOpenTerms={onOpenTerms}
          addToast={addToast}
        />
      )}

      {currentStep === 2 && (
        <Step2Profile
          formData={formData}
          updateFormData={updateFormData}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
          addToast={addToast}
        />
      )}

      {currentStep === 3 && (
        <Step3Location
          formData={formData}
          updateFormData={updateFormData}
          onNext={() => setCurrentStep(4)}
          onBack={() => setCurrentStep(2)}
          addToast={addToast}
        />
      )}

      {currentStep === 4 && (
        <Step4Vibe
          formData={formData}
          updateFormData={updateFormData}
          onSubmitComplete={() => setCurrentStep(5)}
          onBack={() => setCurrentStep(3)}
          addToast={addToast}
        />
      )}

      {currentStep === 5 && (
        <SuccessScreen
          formData={formData}
          onReset={onResetWizard}
          onGoHome={onGoHome}
        />
      )}
    </div>
  );
}
