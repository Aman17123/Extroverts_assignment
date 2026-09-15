import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import TermsModal from './components/TermsModal';
import WizardContainer from './components/Wizard/WizardContainer';
import Toast from './components/Toast';
import { AVATAR_PRESETS } from './data/vibeData';
import { Wifi, Battery, Signal } from 'lucide-react';

const INITIAL_FORM_STATE = {
  email: '',
  password: '',
  termsAccepted: false,
  emailVerified: false,
  firstName: '',
  lastName: '',
  dob: '',
  age: null,
  under18Consent: false,
  pronouns: '',
  phone: '',
  state: '',
  city: '',
  college: '',
  gradYear: '',
  vibes: ['music_jam', 'tea_party'],
  bio: '',
  avatar: AVATAR_PRESETS[0].url
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing' | 'wizard'
  const [wizardStep, setWizardStep] = useState(1);
  const [viewMode, setViewMode] = useState('web'); // 'web' | 'mobile'
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateFormData = (patch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const handleStartWizard = () => {
    setCurrentScreen('wizard');
    setWizardStep(1);
  };

  const handleResetWizard = () => {
    setFormData(INITIAL_FORM_STATE);
    setWizardStep(1);
    addToast('Wizard state reset. Ready for a new test run.', 'info');
  };

  const handleGoHome = () => {
    setCurrentScreen('landing');
  };

  return (
    <div className="app-container">
      {/* Ambient background glows & stars */}
      <div className="ambient-background">
        <div className="ambient-blob-1" />
        <div className="ambient-blob-2" />
        <div className="ambient-stars" />
      </div>

      {/* Global Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenTerms={() => setIsTermsOpen(true)}
        onGoHome={handleGoHome}
        currentScreen={currentScreen}
      />

      {/* Main Content Area */}
      {viewMode === 'mobile' ? (
        <div className="viewport-simulator-wrapper">
          <div className="mobile-frame-container">
            {/* Phone Status Bar */}
            <div className="phone-dynamic-island" />
            <div className="phone-status-bar">
              <span>9:41</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Signal size={12} />
                <Wifi size={12} />
                <Battery size={13} />
              </div>
            </div>

            {/* Mobile Viewport Inner Content */}
            <div className="mobile-viewport-content">
              {currentScreen === 'landing' ? (
                <LandingPage
                  onStartWizard={handleStartWizard}
                  onOpenTerms={() => setIsTermsOpen(true)}
                />
              ) : (
                <WizardContainer
                  currentStep={wizardStep}
                  setCurrentStep={setWizardStep}
                  formData={formData}
                  updateFormData={updateFormData}
                  onOpenTerms={() => setIsTermsOpen(true)}
                  onResetWizard={handleResetWizard}
                  onGoHome={handleGoHome}
                  addToast={addToast}
                />
              )}
            </div>

            {/* Phone Home Bar */}
            <div className="phone-home-indicator" />
          </div>
        </div>
      ) : (
        /* Expanded Desktop / Tablet Web Container */
        <main className="expanded-web-container">
          {currentScreen === 'landing' ? (
            <LandingPage
              onStartWizard={handleStartWizard}
              onOpenTerms={() => setIsTermsOpen(true)}
            />
          ) : (
            <WizardContainer
              currentStep={wizardStep}
              setCurrentStep={setWizardStep}
              formData={formData}
              updateFormData={updateFormData}
              onOpenTerms={() => setIsTermsOpen(true)}
              onResetWizard={handleResetWizard}
              onGoHome={handleGoHome}
              addToast={addToast}
            />
          )}
        </main>
      )}

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        isAccepted={formData.termsAccepted}
        onAccept={() => {
          updateFormData({ termsAccepted: true });
          addToast('Terms & Conditions accepted!', 'success');
        }}
      />

      {/* Global Floating Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
