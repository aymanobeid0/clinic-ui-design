import React, { useState } from 'react';
import { ARTHUR_PENDELTON_AVATAR } from '../data/mockDentalData';

export const DesignTokensScreen: React.FC = () => {
  const [activeSection, setActiveSection] = useState('buttons');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [activeTheme, setActiveTheme] = useState('Classic Blue');

  // Interactive Button System Playground State
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonToast, setButtonToast] = useState<string | null>(null);

  const triggerButtonAction = (label: string) => {
    setButtonToast(label);
    setTimeout(() => {
      setButtonToast((prev) => (prev === label ? null : prev));
    }, 3200);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset for sticky header and nav
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full pb-16">
      {/* Sticky Token Navigator Bar */}
      <div className="sticky top-16 z-30 bg-surface/95 backdrop-blur-md px-6 py-2.5 shadow-sm border-b border-border-divider/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-xs text-primary-container flex items-center gap-1 font-bold pr-2">
            <span className="material-symbols-outlined text-[17px]">
              menu_book
            </span>{' '}
            Tokens
          </span>
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('overview');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === 'overview'
                ? 'bg-surface-container-high text-on-surface font-semibold'
                : 'text-text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            Overview
          </a>
          <a
            href="#colors"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('colors');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === 'colors'
                ? 'bg-surface-container-high text-on-surface font-semibold'
                : 'text-text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            Color System
          </a>
          <a
            href="#typography"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('typography');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === 'typography'
                ? 'bg-surface-container-high text-on-surface font-semibold'
                : 'text-text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            Typography
          </a>
          <a
            href="#elevation"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('elevation');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === 'elevation'
                ? 'bg-surface-container-high text-on-surface font-semibold'
                : 'text-text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            Elevation & Radii
          </a>

          {/* 5th element matching CSS selector: div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > a:nth-of-type(5) */}
          <a
            href="#buttons"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('buttons');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-xs ${
              activeSection === 'buttons'
                ? 'bg-primary-container text-on-primary ring-2 ring-primary/30 font-bold scale-[1.03]'
                : 'bg-primary-tint text-primary hover:bg-primary-container hover:text-on-primary font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              smart_button
            </span>
            <span>Buttons</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                activeSection === 'buttons'
                  ? 'bg-white/20 text-white'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              System
            </span>
          </a>

          <a
            href="#inputs"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('inputs');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === 'inputs'
                ? 'bg-surface-container-high text-on-surface font-semibold'
                : 'text-text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            Form Controls
          </a>
          <a
            href="#badges"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('badges');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === 'badges'
                ? 'bg-surface-container-high text-on-surface font-semibold'
                : 'text-text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            Badges & Alerts
          </a>
          <a
            href="#archetypes"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('archetypes');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === 'archetypes'
                ? 'bg-surface-container-high text-on-surface font-semibold'
                : 'text-text-secondary hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            Clinical Cards
          </a>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success-tint text-tertiary-container text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> v2.4 Verified
        </span>
      </div>

      <div className="px-4 lg:px-6 py-6 flex flex-col gap-8 max-w-[1380px] w-full mx-auto">
        {/* SECTION 1: Overview */}
        <section
          id="overview"
          className="scroll-mt-28 bg-surface rounded-2xl p-6 shadow-sm border border-border-card/60 relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[32px]">
                  dentistry
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary-tint text-primary text-xs font-bold uppercase tracking-wider">
                    Design Architecture
                  </span>
                  <span className="text-text-secondary text-xs">
                    • Class I Medical Dental Standard
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                  Clinical UI Design System & Tokens
                </h1>
                <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
                  Rigorous healthcare design tokens balancing error reduction,
                  operatory visibility, tactile 3D feedback, and bi-directional
                  clinical documentation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full lg:w-auto shrink-0 text-xs">
              <div className="p-3 bg-surface-container-low rounded-xl flex flex-col border border-border-divider/50">
                <span className="text-text-secondary font-medium">Grid Metric</span>
                <span className="text-sm font-bold text-text-primary">8pt / 4pt</span>
                <span className="text-primary text-[11px] font-semibold">
                  Micro-stepped
                </span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl flex flex-col border border-border-divider/50">
                <span className="text-text-secondary font-medium">Radii</span>
                <span className="text-sm font-bold text-text-primary">10 / 14 / 20</span>
                <span className="text-text-secondary text-[11px]">
                  Btn / Card / Sheet
                </span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl flex flex-col border border-border-divider/50">
                <span className="text-text-secondary font-medium">Min Touch</span>
                <span className="text-sm font-bold text-text-primary">44px</span>
                <span className="text-emerald-700 text-[11px] font-semibold">
                  Safe Chairside
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Color System */}
        <section id="colors" className="scroll-mt-28 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-primary uppercase font-bold tracking-wider">
                Foundation 01
              </span>
              <h2 className="text-xl font-bold text-text-primary">
                Color Architecture & Contrast Calibration
              </h2>
            </div>
            <span className="text-xs text-text-secondary font-semibold">
              WCAG AAA Certified (7.1:1+)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60 flex flex-col gap-3">
              <div className="h-24 rounded-lg bg-primary-container p-3 flex flex-col justify-between text-on-primary shadow-inner">
                <span className="text-xs opacity-80 font-medium">Primary Main</span>
                <span className="text-lg font-bold font-mono">#192F86</span>
              </div>
              <div className="flex flex-col gap-0.5 text-xs">
                <span className="font-bold text-text-primary">primary-container</span>
                <span className="text-text-secondary">
                  Key Action & Brand • High-visibility surgical blue
                </span>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60 flex flex-col gap-3">
              <div className="h-24 rounded-lg bg-primary-hover p-3 flex flex-col justify-between text-on-primary shadow-inner">
                <span className="text-xs opacity-80 font-medium">
                  Primary Hover / Pressed
                </span>
                <span className="text-lg font-bold font-mono">#14266D</span>
              </div>
              <div className="flex flex-col gap-0.5 text-xs">
                <span className="font-bold text-text-primary">primary-hover</span>
                <span className="text-text-secondary">
                  Interaction State • Saturated deep tone for active touch
                </span>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60 flex flex-col gap-3">
              <div className="h-24 rounded-lg bg-primary-tint p-3 flex flex-col justify-between text-primary shadow-inner border border-primary/20">
                <span className="text-xs opacity-80 font-medium">
                  Primary Light Wash
                </span>
                <span className="text-lg font-bold font-mono">#EEF1FA</span>
              </div>
              <div className="flex flex-col gap-0.5 text-xs">
                <span className="font-bold text-text-primary">primary-tint</span>
                <span className="text-text-secondary">
                  Selection Wash • Soft non-glare surface highlight
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Semantic Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-surface rounded-xl p-3.5 shadow-sm border border-border-card/60 flex flex-col gap-2">
              <div className="h-16 rounded-lg bg-success-tint p-2.5 flex flex-col justify-between text-tertiary-container border border-emerald-200">
                <span className="text-xs font-bold flex items-center justify-between">
                  Active / Complete{' '}
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                </span>
                <span className="text-xs font-mono font-bold">
                  #176544 / #ECFDF3
                </span>
              </div>
              <span className="text-xs text-text-secondary">
                Confirmed bookings & sterilized trays.
              </span>
            </div>

            <div className="bg-surface rounded-xl p-3.5 shadow-sm border border-border-card/60 flex flex-col gap-2">
              <div className="h-16 rounded-lg bg-warning-tint p-2.5 flex flex-col justify-between text-warning border border-amber-200">
                <span className="text-xs font-bold flex items-center justify-between">
                  Pending / In-Chair{' '}
                  <span className="material-symbols-outlined text-[16px]">
                    hourglass_top
                  </span>
                </span>
                <span className="text-xs font-mono font-bold">
                  #854D0E / #FFFAEB
                </span>
              </div>
              <span className="text-xs text-text-secondary">
                Waiting lounge, lab prosthesis pending delivery.
              </span>
            </div>

            <div className="bg-surface rounded-xl p-3.5 shadow-sm border border-border-card/60 flex flex-col gap-2">
              <div className="h-16 rounded-lg bg-danger-tint p-2.5 flex flex-col justify-between text-danger border border-rose-200">
                <span className="text-xs font-bold flex items-center justify-between">
                  Medical Alert / Danger{' '}
                  <span className="material-symbols-outlined text-[16px]">
                    warning
                  </span>
                </span>
                <span className="text-xs font-mono font-bold">
                  #B42318 / #FEF3F2
                </span>
              </div>
              <span className="text-xs text-text-secondary">
                Severe drug allergy, bleeding risk, cancel.
              </span>
            </div>

            <div className="bg-surface rounded-xl p-3.5 shadow-sm border border-border-card/60 flex flex-col gap-2">
              <div className="h-16 rounded-lg bg-secondary-container p-2.5 flex flex-col justify-between text-on-secondary-fixed border border-sky-200">
                <span className="text-xs font-bold flex items-center justify-between">
                  Consultation / Info{' '}
                  <span className="material-symbols-outlined text-[16px]">
                    info
                  </span>
                </span>
                <span className="text-xs font-mono font-bold">
                  #0B1C2F / #D3E4FD
                </span>
              </div>
              <span className="text-xs text-text-secondary">
                Orthodontic check-in, system sync indicator.
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3: Typography & Multilingual Hierarchy */}
        <section id="typography" className="scroll-mt-28 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-primary uppercase font-bold tracking-wider">
                Foundation 02
              </span>
              <h2 className="text-xl font-bold text-text-primary">
                Typography Scale & Script Hierarchy
              </h2>
            </div>
            <span className="text-xs text-text-secondary">
              Inter (Latin) + Arabic Multilingual
            </span>
          </div>

          <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-3">
            <div className="p-3 bg-surface-container-low rounded-lg flex flex-col md:flex-row md:items-baseline justify-between gap-2 border border-border-divider/50">
              <span className="text-xs font-bold text-primary w-40">
                display (30px / 700)
              </span>
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-2xl font-bold text-text-primary">
                  Operatory Patient Overview
                </span>
                <span
                  className="text-xl font-bold text-text-secondary"
                  dir="rtl"
                >
                  نظرة عامة على سجل المريض السريري
                </span>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg flex flex-col md:flex-row md:items-baseline justify-between gap-2 border border-border-divider/50">
              <span className="text-xs font-bold text-primary w-40">
                headline-lg (24px / 600)
              </span>
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-lg font-semibold text-text-primary">
                  Treatment Plan & Diagnosis Matrix
                </span>
                <span
                  className="text-base font-semibold text-text-secondary"
                  dir="rtl"
                >
                  خطة العلاج ومصفوفة التشخيص الرقمي
                </span>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg flex flex-col md:flex-row md:items-baseline justify-between gap-2 border border-border-divider/50">
              <span className="text-xs font-bold text-primary w-40">
                label-sm (13px / 500)
              </span>
              <div className="flex-1 flex items-center gap-3 font-mono text-xs text-text-secondary">
                <span className="px-2 py-0.5 bg-surface rounded border border-border-card text-primary font-bold">
                  FDI: #16-MOD
                </span>
                <span className="px-2 py-0.5 bg-surface rounded border border-border-card">
                  ISO-13485: 2026-10-05
                </span>
                <span className="px-2 py-0.5 bg-danger-tint rounded text-danger font-semibold">
                  ICD-10: K02.1 Caries
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Elevation & Radii Tokens */}
        <section id="elevation" className="scroll-mt-28 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-primary uppercase font-bold tracking-wider">
                Foundation 03
              </span>
              <h2 className="text-xl font-bold text-text-primary">
                Elevation, Depth Layers & Radii Standards
              </h2>
            </div>
            <span className="text-xs text-text-secondary font-mono">
              Ambient Lumens Calibration
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-surface rounded-lg p-4 border border-border-divider/60 shadow-xs flex flex-col justify-between h-28">
              <span className="text-xs font-bold text-text-primary">Level 01: shadow-xs</span>
              <span className="text-xs text-text-secondary">Subtle card surface, table cell chips</span>
              <span className="text-[10px] font-mono text-primary font-semibold">radius: 8px (0.5rem)</span>
            </div>

            <div className="bg-surface rounded-xl p-4 border border-border-divider/60 shadow-sm flex flex-col justify-between h-28">
              <span className="text-xs font-bold text-text-primary">Level 02: shadow-sm</span>
              <span className="text-xs text-text-secondary">Operatory cards, Odontogram canvas</span>
              <span className="text-[10px] font-mono text-primary font-semibold">radius: 12px (0.75rem)</span>
            </div>

            <div className="bg-surface rounded-2xl p-4 border border-border-card/70 shadow-md flex flex-col justify-between h-28">
              <span className="text-xs font-bold text-text-primary">Level 03: shadow-md</span>
              <span className="text-xs text-text-secondary">Dropdown menus, hover state overlays</span>
              <span className="text-[10px] font-mono text-primary font-semibold">radius: 16px (1.0rem)</span>
            </div>

            <div className="bg-surface rounded-3xl p-4 border border-border-card shadow-xl flex flex-col justify-between h-28">
              <span className="text-xs font-bold text-text-primary">Level 04: shadow-xl</span>
              <span className="text-xs text-text-secondary">Active surgical modal, terminal lock</span>
              <span className="text-[10px] font-mono text-primary font-semibold">radius: 24px (1.5rem)</span>
            </div>
          </div>
        </section>

        {/* SECTION 5: CLINICAL BUTTON SYSTEM (Explicitly targeted by user prompt & 5th nav link) */}
        <section
          id="buttons"
          className="scroll-mt-28 flex flex-col gap-5 p-6 bg-surface rounded-2xl shadow-sm border border-border-card/60 transition-all duration-300"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-divider/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-primary-tint text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">
                    smart_button
                  </span>
                  Clinical Button System
                </span>
                <span className="text-xs text-text-secondary">
                  • Ergonomic Tactile Actions
                </span>
              </div>
              <h2 className="text-xl font-bold text-text-primary tracking-tight">
                Button Matrix & Action Hierarchy
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Decoupled 48px touch targets for operatory gloves, WCAG AAA compliant contrast, and instant visual state feedback.
              </p>
            </div>

            {/* Live Playground Toggles */}
            <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl border border-border-divider/60 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setButtonLoading(!buttonLoading)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  buttonLoading
                    ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {buttonLoading ? 'hourglass_top' : 'motion_photos_on'}
                </span>
                <span>Simulate Loading</span>
              </button>
              <button
                type="button"
                onClick={() => setButtonDisabled(!buttonDisabled)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  buttonDisabled
                    ? 'bg-danger text-white font-bold shadow-xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  block
                </span>
                <span>Disable All</span>
              </button>
            </div>
          </div>

          {/* Interactive Trigger Toast Feedback */}
          {buttonToast && (
            <div className="p-3 bg-primary-tint text-primary rounded-xl border border-primary/20 flex items-center justify-between text-xs animate-pulse">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  check_circle
                </span>
                <span>
                  <strong>Interactive Action Triggered:</strong> {buttonToast}
                </span>
              </div>
              <span className="text-[10px] text-text-secondary font-mono">
                Click event verified
              </span>
            </div>
          )}

          {/* Matrix of Button Archetypes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Primary Solid Buttons */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-border-divider/60 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    Primary Solid
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-primary/10 text-primary rounded font-semibold">
                    Emphasis: High
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  Primary clinical workflows: appointment bookings, surgical authorizations, and e-signatures.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  disabled={buttonDisabled}
                  onClick={() =>
                    triggerButtonAction('Primary Solid: Schedule Appointment')
                  }
                  className="w-full h-11 px-4 rounded-xl bg-primary-container hover:bg-primary-hover active:scale-[0.98] text-on-primary font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {buttonLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        calendar_today
                      </span>
                      <span>Schedule Appointment</span>
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={buttonDisabled}
                    onClick={() =>
                      triggerButtonAction('Primary: Sign & Authorize')
                    }
                    className="flex-1 h-9 px-3 rounded-lg bg-primary text-white hover:bg-primary-hover active:scale-[0.98] text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      draw
                    </span>
                    <span>Sign & Authorize</span>
                  </button>
                  <button
                    type="button"
                    disabled={buttonDisabled}
                    onClick={() =>
                      triggerButtonAction('Primary Icon: Print Treatment Plan')
                    }
                    className="w-9 h-9 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary flex items-center justify-center shadow-xs transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    title="Print Treatment Plan"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      print
                    </span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-text-secondary font-mono pt-2 border-t border-border-divider/40">
                Token:{' '}
                <code className="text-primary font-semibold">
                  bg-primary-container text-on-primary
                </code>
              </div>
            </div>

            {/* 2. Secondary & Tonal Tint Buttons */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-border-divider/60 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Tonal / Secondary
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-200 text-text-primary rounded font-semibold">
                    Emphasis: Medium
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  Auxiliary operative tasks: adding CDT procedures, exporting DICOM files, or duplicating charts.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  disabled={buttonDisabled}
                  onClick={() =>
                    triggerButtonAction('Tonal: Add CDT Procedure')
                  }
                  className="w-full h-11 px-4 rounded-xl bg-primary-tint hover:bg-primary-tint/80 active:scale-[0.98] text-primary font-semibold text-xs flex items-center justify-center gap-2 border border-primary/20 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {buttonLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span>Adding Code...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        add_circle
                      </span>
                      <span>Add CDT Procedure</span>
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={buttonDisabled}
                    onClick={() => triggerButtonAction('Tonal: Export DICOM')}
                    className="flex-1 h-9 px-3 rounded-lg bg-surface hover:bg-surface-container-high active:scale-[0.98] text-xs font-medium text-text-primary flex items-center justify-center gap-1.5 border border-border-divider transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      file_download
                    </span>
                    <span>Export DICOM</span>
                  </button>
                  <button
                    type="button"
                    disabled={buttonDisabled}
                    onClick={() =>
                      triggerButtonAction('Tonal: Odontogram Surface')
                    }
                    className="w-9 h-9 rounded-lg bg-primary-tint text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    title="Tooth Surface Selector"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      grid_view
                    </span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-text-secondary font-mono pt-2 border-t border-border-divider/40">
                Token:{' '}
                <code className="text-primary font-semibold">
                  bg-primary-tint text-primary border-primary/20
                </code>
              </div>
            </div>

            {/* 3. Outlined & Ghost Buttons */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-border-divider/60 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Outlined & Ghost
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-100 text-text-secondary rounded font-semibold">
                    Emphasis: Low
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  Navigation, filter toggles, dialog dismissals, and secondary exploratory patient chart views.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  disabled={buttonDisabled}
                  onClick={() =>
                    triggerButtonAction('Outlined: View Full Odontogram')
                  }
                  className="w-full h-11 px-4 rounded-xl bg-surface hover:bg-surface-container-low active:scale-[0.98] text-on-surface font-semibold text-xs flex items-center justify-center gap-2 border border-border-card shadow-xs transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    dentistry
                  </span>
                  <span>View Full Odontogram</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={buttonDisabled}
                    onClick={() =>
                      triggerButtonAction('Ghost: Dismiss Modal')
                    }
                    className="flex-1 h-9 px-3 rounded-lg hover:bg-neutral-200/60 active:scale-[0.98] text-xs font-medium text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                    <span>Dismiss</span>
                  </button>
                  <button
                    type="button"
                    disabled={buttonDisabled}
                    onClick={() =>
                      triggerButtonAction('Ghost Icon: More Options')
                    }
                    className="w-9 h-9 rounded-lg hover:bg-neutral-200/60 text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    title="More Operatory Options"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      more_vert
                    </span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-text-secondary font-mono pt-2 border-t border-border-divider/40">
                Token:{' '}
                <code className="text-text-secondary font-semibold">
                  border-border-card text-on-surface
                </code>
              </div>
            </div>

            {/* 4. Danger & Surgical Safety Buttons */}
            <div className="p-4 rounded-xl bg-danger-tint/30 border border-danger/20 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-danger uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      warning
                    </span>
                    Danger & Safety
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-danger-tint text-danger rounded font-semibold">
                    High Risk
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  Irreversible actions: revoking active narcotic e-prescriptions, cancelling booked surgical suites, purging records.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  disabled={buttonDisabled}
                  onClick={() =>
                    triggerButtonAction('Danger Solid: Revoke e-Prescription')
                  }
                  className="w-full h-11 px-4 rounded-xl bg-danger hover:bg-rose-700 active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    cancel
                  </span>
                  <span>Revoke e-Prescription</span>
                </button>

                <button
                  type="button"
                  disabled={buttonDisabled}
                  onClick={() =>
                    triggerButtonAction('Danger Outlined: Cancel Operatory Block')
                  }
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-danger/40 text-danger hover:bg-danger-tint active:scale-[0.98] text-xs font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    emergency
                  </span>
                  <span>Cancel Operatory Block</span>
                </button>
              </div>

              <div className="text-[11px] text-danger font-mono pt-2 border-t border-danger/20">
                Token:{' '}
                <code className="font-semibold">
                  bg-danger text-white hover:bg-rose-700
                </code>
              </div>
            </div>

            {/* 5. Success & Sterilization Verification Buttons */}
            <div className="p-4 rounded-xl bg-success-tint/30 border border-emerald-200 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-tertiary-container uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      verified
                    </span>
                    Success & Clinical
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-success-tint text-tertiary-container rounded font-semibold">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  Positive confirmation: sterilizer autoclave cycle passed, patient seated in operatory, payment settled.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  disabled={buttonDisabled}
                  onClick={() =>
                    triggerButtonAction('Success Solid: Mark Trays Sterilized')
                  }
                  className="w-full h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    sanitizer
                  </span>
                  <span>Mark Trays Sterilized</span>
                </button>

                <button
                  type="button"
                  disabled={buttonDisabled}
                  onClick={() =>
                    triggerButtonAction('Success Tonal: Confirm Patient Arrived')
                  }
                  className="w-full h-9 px-3 rounded-lg bg-success-tint text-tertiary-container hover:bg-emerald-100 active:scale-[0.98] text-xs font-medium flex items-center justify-center gap-1.5 border border-emerald-300 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  <span>Confirm Patient Arrived</span>
                </button>
              </div>

              <div className="text-[11px] text-tertiary-container font-mono pt-2 border-t border-emerald-200">
                Token:{' '}
                <code className="font-semibold">
                  bg-emerald-600 text-white
                </code>
              </div>
            </div>

            {/* 6. Ergonomic Sizes & Anatomy Matrix */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-border-divider/60 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Touch Targets
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-200 text-text-primary rounded font-semibold">
                    48px Hit-Box
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  Calibrated size scale ensuring zero accidental mis-clicks during active surgical procedures.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-secondary font-mono">
                    Large (44px)
                  </span>
                  <button
                    type="button"
                    disabled={buttonDisabled}
                    onClick={() =>
                      triggerButtonAction('Size LG: Chairside Trigger')
                    }
                    className="h-11 px-4 rounded-xl bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-1.5 hover:bg-primary-hover cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      dentistry
                    </span>
                    <span>Chairside Trigger</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-secondary font-mono">
                    Standard (36px)
                  </span>
                  <button
                    type="button"
                    disabled={buttonDisabled}
                    onClick={() =>
                      triggerButtonAction('Size MD: Form Submit')
                    }
                    className="h-9 px-3 rounded-lg bg-primary-container text-on-primary text-xs font-medium flex items-center gap-1.5 hover:bg-primary-hover cursor-pointer"
                  >
                    <span>Form Submit</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-secondary font-mono">
                    Compact (28px)
                  </span>
                  <button
                    type="button"
                    disabled={buttonDisabled}
                    onClick={() =>
                      triggerButtonAction('Size SM: Tooth Tool')
                    }
                    className="h-7 px-2.5 rounded-md bg-primary-tint text-primary text-[11px] font-semibold flex items-center gap-1 hover:bg-primary hover:text-white cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      edit
                    </span>
                    <span>Tooth Tool</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-text-secondary font-mono pt-2 border-t border-border-divider/40">
                Standards:{' '}
                <code className="text-primary font-semibold">
                  ISO-9241-9 & FDA Ergonomics
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Interactive Inputs & Chairside Duration Stepper */}
        <section id="inputs" className="scroll-mt-28 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-primary uppercase font-bold tracking-wider">
                Components 02
              </span>
              <h2 className="text-xl font-bold text-text-primary">
                Clinical Inputs & Chairside Controls
              </h2>
            </div>
            <span className="text-xs text-text-secondary">
              Decoupled Hit-Box Ergonomics
            </span>
          </div>

          <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary font-medium">
                Patient Medical Record #
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
                  tag
                </span>
                <input
                  type="text"
                  defaultValue="PT-88921"
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low border border-border-divider text-on-surface font-mono"
                />
              </div>
              <span className="text-[11px] text-text-secondary">
                Matches national dental insurance registry ID.
              </span>
            </div>

            {/* Duration Stepper with working buttons */}
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary font-medium">
                Procedure Duration (Chairside Stepper)
              </label>
              <div className="h-10 rounded-lg bg-surface-container-low p-1 flex items-center justify-between border border-border-divider">
                <button
                  type="button"
                  onClick={() =>
                    setDurationMinutes((prev) => Math.max(prev - 15, 15))
                  }
                  className="w-8 h-8 rounded-md bg-surface text-on-surface hover:bg-primary-container hover:text-on-primary flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    remove
                  </span>
                </button>
                <span className="font-bold text-primary font-mono text-sm">
                  {durationMinutes} min
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setDurationMinutes((prev) => Math.min(prev + 15, 240))
                  }
                  className="w-8 h-8 rounded-md bg-surface text-on-surface hover:bg-primary-container hover:text-on-primary flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    add
                  </span>
                </button>
              </div>
              <span className="text-[11px] text-text-secondary">
                Chair blocks: Min 15m • Max 240m
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-danger font-medium">
                Local Anesthetic Dosage (ml)
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-danger text-[18px]">
                  syringe
                </span>
                <input
                  type="text"
                  defaultValue="4.8 ml (Exceeds Limit)"
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-danger-tint text-danger border border-danger/30 font-semibold"
                />
              </div>
              <span className="text-[11px] text-danger">
                Maximum recommended safe dose is 3.6ml.
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 7: Badges & Clinical Alerts */}
        <section id="badges" className="scroll-mt-28 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-primary uppercase font-bold tracking-wider">
                Components 03
              </span>
              <h2 className="text-xl font-bold text-text-primary">
                Badges, Tags & Clinical Warning Chips
              </h2>
            </div>
            <span className="text-xs text-text-secondary font-mono">
              Visual Triage Taxonomy
            </span>
          </div>

          <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger-tint text-danger text-xs font-bold border border-danger/20">
              <span className="material-symbols-outlined text-[15px]">
                warning
              </span>
              Allergy: Amoxicillin (Severe)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning-tint text-warning text-xs font-bold border border-warning/20">
              <span className="material-symbols-outlined text-[15px]">
                vital_signs
              </span>
              Hypertension Stage 2
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-tint text-tertiary-container text-xs font-bold border border-emerald-300">
              <span className="material-symbols-outlined text-[15px]">
                check_circle
              </span>
              Pre-Authorization Approved
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-tint text-primary text-xs font-bold border border-primary/20">
              <span className="material-symbols-outlined text-[15px]">
                chair
              </span>
              Operatory 1: In Chair
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-xs font-medium border border-border-divider">
              <span className="material-symbols-outlined text-[15px]">
                badge
              </span>
              FDI #16-MOD Active Chart
            </span>
          </div>
        </section>

        {/* SECTION 8: Clinical Archetype Cards */}
        <section id="archetypes" className="scroll-mt-28 flex flex-col gap-4">
          <div>
            <span className="text-xs text-primary uppercase font-bold tracking-wider">
              Patterns
            </span>
            <h2 className="text-xl font-bold text-text-primary">
              Clinical Archetype Cards (Production Patterns)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Archetype 1: KPI with Sparkline */}
            <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-card/60 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">
                  Operatory Utilization
                </span>
                <div className="w-8 h-8 rounded-lg bg-primary-tint text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">
                    chair
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-text-primary">
                  91.4%
                </span>
                <span className="text-emerald-700 text-xs font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[15px]">
                    trending_up
                  </span>{' '}
                  +6.2%
                </span>
              </div>
              <div className="h-12 w-full">
                <svg
                  className="w-full h-full text-primary-container"
                  fill="none"
                  viewBox="0 0 240 50"
                >
                  <path
                    d="M0 45 L35 38 L70 42 L105 25 L140 28 L175 12 L210 18 L240 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M0 45 L35 38 L70 42 L105 25 L140 28 L175 12 L210 18 L240 6 L240 50 L0 50 Z"
                    fill="currentColor"
                    fillOpacity="0.08"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-between text-xs text-text-secondary pt-2 border-t border-border-divider/50">
                <span>5 Chairs Booked of 6</span>
                <span className="text-primary font-bold">Downtown Main</span>
              </div>
            </div>

            {/* Archetype 2: Arthur Pendelton */}
            <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-card/60 flex flex-col justify-between gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={ARTHUR_PENDELTON_AVATAR}
                    alt="Arthur Pendelton"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">
                      Arthur Pendelton
                    </h4>
                    <span className="text-xs text-text-secondary">
                      Chart #AP-2041 • 42 yrs
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-warning-tint text-warning text-xs font-bold">
                  Chair 02
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low text-xs flex flex-col gap-1 border border-border-divider/50">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Procedure:</span>
                  <span className="font-semibold text-text-primary">
                    Crown Prep & Scan
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Dentist:</span>
                  <span className="text-text-primary">Dr. Sarah Jenkins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Time Slot:</span>
                  <span className="font-mono text-primary font-bold">
                    14:30 - 15:15 (45m)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  triggerButtonAction('Odontogram opened for Arthur Pendelton')
                }
                className="w-full h-9 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">
                  clinical_notes
                </span>
                <span>Open Odontogram</span>
              </button>
            </div>

            {/* Archetype 3: Tooth FDI #26 Surface Map */}
            <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-card/60 flex flex-col justify-between gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">
                    Tooth FDI #26
                  </span>
                  <h4 className="text-sm font-bold text-text-primary">
                    Maxillary First Molar
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-danger-tint text-danger text-xs font-bold">
                  Caries Deep
                </span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-center py-2 border border-border-divider/50">
                <div className="relative w-24 h-24 bg-surface rounded-xl shadow-xs border border-border-card flex items-center justify-center">
                  <span className="absolute top-1 text-[10px] font-bold text-text-secondary">
                    B
                  </span>
                  <span className="absolute bottom-1 text-[10px] font-bold text-text-secondary">
                    L
                  </span>
                  <span className="absolute left-1 text-[10px] font-bold text-text-secondary">
                    M
                  </span>
                  <span className="absolute right-1 text-[10px] font-bold text-text-secondary">
                    D
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-danger-tint text-danger flex items-center justify-center font-bold text-xs border border-danger/20">
                    MOD
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-text-secondary">
                  Diagnosis: Composite 3-Surface
                </span>
                <button
                  type="button"
                  onClick={() =>
                    triggerButtonAction('Procedure queued for Tooth FDI #26')
                  }
                  className="h-8 px-2.5 rounded-lg bg-primary-tint text-primary font-semibold hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                >
                  Queue Procedure
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
