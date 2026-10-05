import React, { useState } from 'react';
import { CLINIC_LOGO_URL, DR_JENKINS_AVATAR } from '../data/mockDentalData';

interface AuthScreenProps {
  isLoggedIn: boolean;
  currentUser: string;
  onLoginSuccess: (staffName: string, role: string) => void;
  onLogout: () => void;
  onNavigateToDashboard: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  isLoggedIn,
  currentUser,
  onLoginSuccess,
  onLogout,
  onNavigateToDashboard,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [language, setLanguage] = useState<'en' | 'ar' | 'fr' | 'es'>('en');

  // Login Form State
  const [loginRole, setLoginRole] = useState<'dentist' | 'hygienist' | 'reception' | 'admin'>('dentist');
  const [loginIdentifier, setLoginIdentifier] = useState('sarah.jenkins@dentalcare.com');
  const [loginPassword, setLoginPassword] = useState('operatory2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [trustDevice, setTrustDevice] = useState(true);
  const [loginMethod, setLoginMethod] = useState<'password' | 'pin'>('password');
  const [pinCode, setPinCode] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Sign Up Form State
  const [signupData, setSignupData] = useState({
    fullName: '',
    title: 'DMD',
    specialty: 'General Dentistry',
    clinicName: 'Downtown Dental & Implant Suite',
    licenseNumber: '',
    npiNumber: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeHipaa: true,
  });
  const [signupLoading, setSignupLoading] = useState(false);

  // Quick Demo Logins
  const demoAccounts = [
    {
      name: 'Dr. Sarah Jenkins',
      role: 'dentist' as const,
      roleLabel: 'Lead Dentist (DMD)',
      email: 'sarah.jenkins@dentalcare.com',
      pin: '4419',
      avatar: DR_JENKINS_AVATAR,
    },
    {
      name: 'Dr. Marc Alami',
      role: 'dentist' as const,
      roleLabel: 'Orthodontist (DDS)',
      email: 'marc.alami@dentalcare.com',
      pin: '2026',
      avatar: 'MA',
    },
    {
      name: 'Elena Rostova',
      role: 'reception' as const,
      roleLabel: 'Front Desk Reception',
      email: 'elena.rostova@dentalcare.com',
      pin: '1001',
      avatar: 'ER',
    },
    {
      name: 'System Admin',
      role: 'admin' as const,
      roleLabel: 'Practice Administrator',
      email: 'admin@dentalcare.com',
      pin: '9999',
      avatar: 'SA',
    },
  ];

  const handleQuickDemoLogin = (account: (typeof demoAccounts)[0]) => {
    setLoginRole(account.role);
    setLoginIdentifier(account.email);
    setPinCode(account.pin);
    setErrorMessage(null);
    setLoginLoading(true);

    setTimeout(() => {
      setLoginLoading(false);
      onLoginSuccess(`${account.name} (${account.roleLabel})`, account.role);
      onNavigateToDashboard();
    }, 400);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (loginMethod === 'pin') {
      if (pinCode.length < 4) {
        setErrorMessage('Please enter a complete 4-digit chairside PIN.');
        return;
      }
    } else {
      if (!loginIdentifier.trim() || !loginPassword) {
        setErrorMessage('Please provide your staff email/ID and password.');
        return;
      }
    }

    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      const roleLabel =
        loginRole === 'dentist'
          ? 'Dr. Sarah Jenkins (Dentist)'
          : loginRole === 'hygienist'
          ? 'Registered Dental Hygienist'
          : loginRole === 'reception'
          ? 'Front Desk Reception'
          : 'System Admin';

      const userName = loginIdentifier.includes('@')
        ? loginIdentifier.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : loginIdentifier;

      onLoginSuccess(`${userName} (${roleLabel})`, loginRole);
      onNavigateToDashboard();
    }, 500);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signupData.fullName.trim()) {
      setErrorMessage('Please enter your full legal or professional name.');
      return;
    }
    if (!signupData.email.trim() || !signupData.email.includes('@')) {
      setErrorMessage('Please provide a valid work email address.');
      return;
    }
    if (signupData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }
    if (!signupData.agreeHipaa) {
      setErrorMessage('You must acknowledge HIPAA compliance and BAA terms.');
      return;
    }

    setSignupLoading(true);
    setTimeout(() => {
      setSignupLoading(false);
      const registeredName = `${signupData.fullName}, ${signupData.title}`;
      onLoginSuccess(`${registeredName} (${signupData.specialty})`, 'dentist');
      onNavigateToDashboard();
    }, 600);
  };

  // Password Strength Calculation
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };
  const passwordStrength = calculatePasswordStrength(signupData.password);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Decorative Ambient Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-tint/50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-container/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-5xl bg-surface rounded-3xl shadow-xl border border-border-card/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Clinical Branding Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-primary to-primary-container p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          {/* Top Branding */}
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-md">
                <img
                  src={CLINIC_LOGO_URL}
                  alt="DentalCare"
                  className="h-7 w-auto object-contain brightness-0 invert"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">
                  DentalCare
                </span>
                <span className="text-[11px] font-mono tracking-widest uppercase text-white/70 block">
                  Operatory Pro OS
                </span>
              </div>
            </div>

            <div className="mt-4">
              <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-semibold border border-white/20 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Class I Medical Dental System
              </span>
              <h2 className="text-2xl font-bold mt-2 leading-tight">
                Secure Practitioner & Operatory Portal
              </h2>
              <p className="text-xs text-white/80 mt-2 leading-relaxed">
                Chairside patient records, interactive FDI odontogram charting, DICOM imaging viewer, and HIPAA-compliant e-prescriptions.
              </p>
            </div>
          </div>

          {/* Clinical Features List */}
          <div className="my-8 flex flex-col gap-3.5 relative z-10 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[15px] text-emerald-300">
                  verified
                </span>
              </div>
              <div>
                <span className="font-semibold block">HIPAA & HITECH Certified</span>
                <span className="text-white/70 text-[11px]">256-bit AES end-to-end encrypted storage</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[15px] text-emerald-300">
                  dentistry
                </span>
              </div>
              <div>
                <span className="font-semibold block">Live Multi-Chair Sync</span>
                <span className="text-white/70 text-[11px]">Downtown & Uptown Operatories 1-6</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[15px] text-emerald-300">
                  badge
                </span>
              </div>
              <div>
                <span className="font-semibold block">Multi-Role Access Control (RBAC)</span>
                <span className="text-white/70 text-[11px]">Dentist, Hygienist, Receptionist & Admin</span>
              </div>
            </div>
          </div>

          {/* Terminal Audit Footer */}
          <div className="pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70 font-mono relative z-10">
            <span>Terminal: OP-DT-04</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Core v2.4 Live
            </span>
          </div>
        </div>

        {/* Right Form & Auth Panel */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Top Bar: Language & Active Session Indicator */}
            <div className="flex items-center justify-between pb-4 border-b border-border-divider/50 mb-6">
              {/* Login / Sign Up Tab Pill Switcher */}
              <div className="inline-flex bg-surface-container-low p-1 rounded-xl border border-border-card text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Register Practice
                </button>
              </div>

              {/* Language Switcher */}
              <div className="relative inline-flex items-center bg-surface-container-low px-2.5 py-1 rounded-lg border border-border-divider text-xs text-text-secondary">
                <span className="material-symbols-outlined text-[16px] mr-1 text-primary">
                  language
                </span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-transparent font-medium cursor-pointer focus:outline-none pr-1"
                >
                  <option value="en">English (US)</option>
                  <option value="ar">العربية (Arabic)</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>

            {/* If user is already logged in, show status & quick switch */}
            {isLoggedIn && (
              <div className="mb-6 p-4 rounded-2xl bg-primary-tint border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white font-bold flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">
                      lock_open
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-text-secondary uppercase font-bold tracking-wider block">
                      Active Clinical Session
                    </span>
                    <span className="font-bold text-sm text-primary">
                      {currentUser}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onNavigateToDashboard}
                    className="px-3 py-1.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    Go to Operatory
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="px-3 py-1.5 rounded-lg bg-surface border border-border-card text-danger hover:bg-danger-tint font-semibold transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-danger-tint border border-danger/30 text-danger text-xs flex items-center gap-2 animate-shake">
                <span className="material-symbols-outlined text-[18px]">
                  error
                </span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* MODE 1: SIGN IN / LOGIN VIEW */}
            {authMode === 'login' ? (
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    Operatory Terminal Sign In
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Select a staff role or enter your practice credentials to unlock chairside tools.
                  </p>
                </div>

                {/* Role Selector Tabs */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'dentist', label: 'Dentist', icon: 'dentistry' },
                    { id: 'hygienist', label: 'Hygienist', icon: 'clean_hands' },
                    { id: 'reception', label: 'Reception', icon: 'support_agent' },
                    { id: 'admin', label: 'Admin', icon: 'admin_panel_settings' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setLoginRole(r.id as any)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        loginRole === r.id
                          ? 'bg-primary-tint border-primary text-primary font-bold shadow-xs ring-1 ring-primary/30'
                          : 'bg-surface-container-low border-border-divider/70 text-text-secondary hover:bg-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {r.icon}
                      </span>
                      <span className="text-[11px]">{r.label}</span>
                    </button>
                  ))}
                </div>

                {/* Login Method Toggle: Password vs Quick PIN */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-text-secondary font-medium">Authentication Method:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('password')}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                        loginMethod === 'password'
                          ? 'bg-surface-container-high text-primary font-bold shadow-2xs'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('pin')}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                        loginMethod === 'pin'
                          ? 'bg-surface-container-high text-primary font-bold shadow-2xs'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      Chairside PIN (4-Digit)
                    </button>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
                  {loginMethod === 'password' ? (
                    <>
                      {/* Email / Staff ID Input */}
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="text-text-secondary font-medium">
                          Staff Email or Terminal Identifier
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
                            badge
                          </span>
                          <input
                            type="text"
                            required
                            value={loginIdentifier}
                            onChange={(e) => setLoginIdentifier(e.target.value)}
                            placeholder="e.g. sarah.jenkins@dentalcare.com or DENT-4029"
                            className="w-full h-11 pl-10 pr-3 rounded-xl bg-surface-container-low border border-border-divider text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface text-xs font-medium"
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div className="flex flex-col gap-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <label className="text-text-secondary font-medium">
                            Security Password
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-primary hover:underline text-[11px] font-semibold cursor-pointer"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
                            lock
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="Enter password..."
                            className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface-container-low border border-border-divider text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-text-secondary hover:text-text-primary cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Tactile Quick PIN Input for Touchscreens */
                    <div className="flex flex-col items-center gap-3 py-2">
                      <label className="text-xs text-text-secondary font-medium">
                        Enter 4-Digit Operatory Quick PIN
                      </label>
                      <div className="flex gap-2">
                        {[0, 1, 2, 3].map((idx) => (
                          <div
                            key={idx}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-mono font-bold border ${
                              pinCode[idx]
                                ? 'bg-primary-tint border-primary text-primary shadow-xs'
                                : 'bg-surface-container-low border-border-divider text-outline'
                            }`}
                          >
                            {pinCode[idx] ? '●' : '—'}
                          </div>
                        ))}
                      </div>

                      {/* Numeric Keypad */}
                      <div className="grid grid-cols-3 gap-2 w-48 mt-1">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => {
                              if (k === 'C') setPinCode('');
                              else if (k === '⌫') setPinCode((p) => p.slice(0, -1));
                              else if (pinCode.length < 4) setPinCode((p) => p + k);
                            }}
                            className="h-10 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-border-divider text-sm font-semibold text-text-primary active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
                          >
                            {k}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trust Workstation Checkbox */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="trustDevice"
                      checked={trustDevice}
                      onChange={(e) => setTrustDevice(e.target.checked)}
                      className="w-4 h-4 rounded text-primary border-border-divider focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="trustDevice" className="text-xs text-text-secondary cursor-pointer">
                      Trust this operatory terminal for 12 hours (Shift Session)
                    </label>
                  </div>

                  {/* Sign In CTA */}
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full h-11 rounded-xl bg-primary-container hover:bg-primary-hover active:scale-[0.99] text-on-primary text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 mt-1"
                  >
                    {loginLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authenticating Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">
                          login
                        </span>
                        <span>Sign In to Terminal</span>
                      </>
                    )}
                  </button>
                </form>

                {/* One-Click Demo Staff Accounts */}
                <div className="pt-4 border-t border-border-divider/50 flex flex-col gap-2">
                  <span className="text-[11px] text-text-secondary uppercase font-bold tracking-wider">
                    Quick Clinical Demo Accounts:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {demoAccounts.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => handleQuickDemoLogin(acc)}
                        className="p-2 rounded-xl bg-surface-container-low hover:bg-primary-tint/50 border border-border-divider hover:border-primary/30 flex items-center gap-2 text-left transition-colors cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-primary-tint text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                          {acc.name.slice(0, 2)}
                        </div>
                        <div className="truncate">
                          <span className="font-semibold text-text-primary block truncate group-hover:text-primary">
                            {acc.name}
                          </span>
                          <span className="text-[10px] text-text-secondary block truncate">
                            {acc.roleLabel}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* MODE 2: SIGN UP / PRACTICE REGISTRATION VIEW */
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    Register Dental Practice & Clinician
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Enroll your practice for multi-operatory charting, DICOM viewer, and billing.
                  </p>
                </div>

                <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3 text-xs">
                  {/* Row 1: Name and Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2 flex flex-col gap-1">
                      <label className="text-text-secondary font-medium">Full Legal Name</label>
                      <input
                        type="text"
                        required
                        value={signupData.fullName}
                        onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                        placeholder="e.g. Dr. Alexander Wright"
                        className="h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-text-secondary font-medium">Degree / Title</label>
                      <select
                        value={signupData.title}
                        onChange={(e) => setSignupData({ ...signupData, title: e.target.value })}
                        className="h-10 px-2 rounded-lg bg-surface-container-low border border-border-divider font-semibold cursor-pointer"
                      >
                        <option value="DMD">DMD</option>
                        <option value="DDS">DDS</option>
                        <option value="RDH">RDH (Hygienist)</option>
                        <option value="BDS">BDS</option>
                        <option value="Admin">Practice Admin</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Specialty & Practice Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-text-secondary font-medium">Clinical Specialty</label>
                      <select
                        value={signupData.specialty}
                        onChange={(e) => setSignupData({ ...signupData, specialty: e.target.value })}
                        className="h-10 px-2 rounded-lg bg-surface-container-low border border-border-divider cursor-pointer"
                      >
                        <option value="General Dentistry">General Dentistry</option>
                        <option value="Endodontics">Endodontics (Root Canal)</option>
                        <option value="Orthodontics">Orthodontics & Aligners</option>
                        <option value="Periodontics">Periodontics & Implants</option>
                        <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                        <option value="Oral Surgery">Oral & Maxillofacial Surgery</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-text-secondary font-medium">Clinic / Facility Name</label>
                      <input
                        type="text"
                        required
                        value={signupData.clinicName}
                        onChange={(e) => setSignupData({ ...signupData, clinicName: e.target.value })}
                        placeholder="e.g. Wright Family Dental & Implants"
                        className="h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Row 3: License & NPI */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-text-secondary font-medium">State Board Dental License #</label>
                      <input
                        type="text"
                        value={signupData.licenseNumber}
                        onChange={(e) => setSignupData({ ...signupData, licenseNumber: e.target.value })}
                        placeholder="e.g. NY-DENT-8849"
                        className="h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-text-secondary font-medium">NPI Number (10 Digits)</label>
                      <input
                        type="text"
                        value={signupData.npiNumber}
                        onChange={(e) => setSignupData({ ...signupData, npiNumber: e.target.value })}
                        placeholder="e.g. 1928475019"
                        className="h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Row 4: Work Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-text-secondary font-medium">Official Work Email</label>
                      <input
                        type="email"
                        required
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        placeholder="dr.wright@dentalcare.com"
                        className="h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-text-secondary font-medium">Operatory Direct Phone</label>
                      <input
                        type="tel"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        placeholder="+1 (555) 304-8812"
                        className="h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Row 5: Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-text-secondary font-medium">Create Password (Min 8 chars)</label>
                      <input
                        type="password"
                        required
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        placeholder="••••••••••••"
                        className="h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-text-secondary font-medium">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        placeholder="••••••••••••"
                        className="h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {signupData.password && (
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] text-text-secondary">
                        <span>Password Strength:</span>
                        <span className="font-semibold text-primary">
                          {passwordStrength <= 25 ? 'Weak' : passwordStrength <= 75 ? 'Good' : 'Strong (HIPAA Grade)'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength <= 25
                              ? 'bg-danger w-1/4'
                              : passwordStrength <= 75
                              ? 'bg-warning w-3/4'
                              : 'bg-emerald-600 w-full'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* HIPAA & BAA Acknowledgement */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="agreeHipaa"
                      checked={signupData.agreeHipaa}
                      onChange={(e) => setSignupData({ ...signupData, agreeHipaa: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded text-primary border-border-divider focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="agreeHipaa" className="text-[11px] text-text-secondary leading-tight cursor-pointer">
                      I certify that I am a licensed healthcare provider or authorized representative, and agree to the <strong>Business Associate Agreement (BAA)</strong> and HIPAA privacy safeguarding standards.
                    </label>
                  </div>

                  {/* Register CTA Button */}
                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full h-11 rounded-xl bg-primary-container hover:bg-primary-hover active:scale-[0.99] text-on-primary text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {signupLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Provisioning Practice Account...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">
                          how_to_reg
                        </span>
                        <span>Complete Practice Registration</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Bottom Security Assurance */}
          <div className="pt-6 border-t border-border-divider/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-secondary">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-emerald-600 text-[15px]">
                lock
              </span>
              256-bit SSL encrypted connection
            </span>
            <span>Emergency IT Support: <strong>+1 (800) 555-DENT</strong></span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Dialog */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-surface rounded-2xl p-6 shadow-2xl border border-border-card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined text-[20px]">
                  lock_reset
                </span>
                <span>Reset Staff Password</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotSent(false);
                }}
                className="text-text-secondary hover:text-text-primary p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-success-tint border border-emerald-300 text-tertiary-container flex flex-col gap-2 text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Recovery Instructions Dispatched
                </span>
                <p>
                  A temporary password reset link and dual-factor token have been sent to <strong>{forgotEmail}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotSent(false);
                  }}
                  className="mt-2 w-full h-8 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail.trim()) {
                    setForgotSent(true);
                  }
                }}
                className="flex flex-col gap-3 text-xs"
              >
                <p className="text-text-secondary">
                  Enter your registered practitioner or clinic email address. We will verify your NPI record and dispatch a secure reset link.
                </p>
                <div className="flex flex-col gap-1">
                  <label className="text-text-secondary font-medium">Work Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="sarah.jenkins@dentalcare.com"
                    className="h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-3 h-9 rounded-lg hover:bg-surface-container font-semibold text-text-secondary cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 h-9 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover shadow-xs cursor-pointer"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
