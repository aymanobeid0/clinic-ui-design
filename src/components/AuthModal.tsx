import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (staffName: string, role: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [role, setRole] = useState<'dentist' | 'reception' | 'admin'>('dentist');
  const [identifier, setIdentifier] = useState('DENT-4029');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [clinicLicense, setClinicLicense] = useState('DEN-8849-NY');
  const [trustDevice, setTrustDevice] = useState(true);
  const [language, setLanguage] = useState('en');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roleName =
      role === 'dentist'
        ? 'Dr. Sarah Jenkins (Dentist)'
        : role === 'reception'
        ? 'Elena Rostova (Reception)'
        : 'System Admin';
    onLoginSuccess(roleName, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-[480px]">
        {/* Ambient Brand Highlight Behind Card */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary-tint/60 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Main Authentication Portal Card */}
        <div className="w-full bg-surface rounded-2xl shadow-2xl p-6 sm:p-8 border border-border-card/80 transition-all duration-200">
          {/* Top Utility Header: Language Switcher & Security Badge */}
          <div className="flex items-center justify-between mb-5">
            <div className="relative inline-flex items-center bg-surface-container-low px-2.5 py-1 rounded-full text-on-surface-variant border border-border-divider">
              <span className="material-symbols-outlined text-[16px] text-secondary mr-1">
                language
              </span>
              <select
                aria-label="Select interface language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs text-on-surface cursor-pointer focus:outline-none pr-1 font-medium"
              >
                <option value="en">English (US)</option>
                <option value="ar">العربية (Arabic)</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-tint text-tertiary-container border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-800">
                HIPAA Certified
              </span>
            </div>
          </div>

          {/* Clinic Header & Brand Identity */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-2.5 p-2 rounded-2xl bg-primary-tint flex items-center justify-center border border-primary/20">
              <svg
                className="w-12 h-12 text-primary"
                fill="none"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28 28C28 20 34 16 42 18C47 19.3 48.5 24 50 24C51.5 24 53 19.3 58 18C66 16 72 20 72 28C72 38 68 52 64 68C61.5 78 57 84 53 84C49 84 48 76 45 76C42 76 41 84 37 84C33 84 28.5 78 26 68C22 52 18 38 18 28C18 20 20 20 28 28Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="5"
                />
                <path
                  d="M43 36H57V48H69V60H57V72H43V60H31V48H43V36Z"
                  fill="currentColor"
                  fillOpacity="0.15"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="4.5"
                />
                <path
                  d="M12 50C22 42 34 54 50 50C66 46 78 58 88 50"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="5"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
              DentalCare Clinic
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Surgical Precision Practice Management System
            </p>
          </div>

          {/* Segmented View Toggle Switch */}
          <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-xl mb-5 border border-border-divider">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Staff Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Register Clinic
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Clinical Role Selector Chips */}
            <div className="space-y-1.5">
              <label className="block text-xs text-text-secondary font-medium">
                Clinical Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('dentist')}
                  className={`h-10 flex items-center justify-center px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    role === 'dentist'
                      ? 'bg-primary-tint text-primary border-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] mr-1">
                    dentistry
                  </span>
                  Dentist
                </button>

                <button
                  type="button"
                  onClick={() => setRole('reception')}
                  className={`h-10 flex items-center justify-center px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    role === 'reception'
                      ? 'bg-primary-tint text-primary border-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] mr-1">
                    desk
                  </span>
                  Reception
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`h-10 flex items-center justify-center px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    role === 'admin'
                      ? 'bg-primary-tint text-primary border-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] mr-1">
                    admin_panel_settings
                  </span>
                  Admin
                </button>
              </div>
            </div>

            {/* Clinic License (for register mode) */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="block text-xs text-text-secondary font-medium">
                  Clinic License or Facility ID
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-secondary text-[18px]">
                    local_hospital
                  </span>
                  <input
                    type="text"
                    value={clinicLicense}
                    onChange={(e) => setClinicLicense(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-lowest text-text-primary text-xs border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="DEN-8849-NY"
                    required
                  />
                </div>
              </div>
            )}

            {/* Username / Staff ID */}
            <div className="space-y-1">
              <label className="block text-xs text-text-secondary font-medium">
                {mode === 'signin'
                  ? 'Staff ID / Registered Mobile'
                  : 'Primary Practice Contact Email / Phone'}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-secondary text-[18px]">
                  badge
                </span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-lowest text-text-primary text-xs border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. DENT-4029 or +1 (555) 019-2834"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-text-secondary font-medium">
                  Security Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link sent to registered phone.');
                  }}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Forgot key?
                </a>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-secondary text-[18px]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-9 pr-10 rounded-lg bg-surface-container-lowest text-text-primary text-xs border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 text-secondary hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Trust Operatory Hardware */}
            <div className="pt-1 flex items-start gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={trustDevice}
                onChange={(e) => setTrustDevice(e.target.checked)}
                className="w-4 h-4 rounded text-primary mt-0.5 accent-primary cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-xs text-on-surface-variant cursor-pointer select-none leading-tight"
              >
                Trust this surgical operatory terminal for 12 hours
              </label>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-lg bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary-hover shadow-md transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]">
                  login
                </span>
                <span>
                  {mode === 'signin'
                    ? 'Sign In to Clinic Workspace'
                    : 'Register Clinic Account'}
                </span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Support Footer */}
          <div className="mt-5 pt-3 border-t border-border-divider/50 flex flex-col items-center gap-1 text-center">
            <p className="text-xs text-text-secondary">
              Need clinical onboarding assistance?
            </p>
            <button
              onClick={() => alert('Practice support line: (800) 555-DENT')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                support_agent
              </span>
              <span>Contact Practice Tech Support</span>
            </button>
          </div>
        </div>

        {/* Operatory Footer Metadata */}
        <div className="flex items-center justify-between px-3 mt-3 text-xs text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Operatory Cloud Gateway v4.8</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hover:text-on-surface cursor-pointer">
              Data Privacy
            </span>
            <span>•</span>
            <span className="hover:text-on-surface cursor-pointer">
              Audit Logs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
