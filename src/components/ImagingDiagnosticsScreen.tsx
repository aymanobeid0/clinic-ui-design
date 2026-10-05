import React, { useState } from 'react';
import { DiagnosticStudy, Patient } from '../types/dental';
import { INITIAL_DIAGNOSTIC_STUDIES } from '../data/mockDentalData';

interface ImagingDiagnosticsScreenProps {
  patient: Patient;
  onOpenPatientFile: (patientId: string) => void;
  onAddToTreatmentPlan: (finding: string) => void;
}

export const ImagingDiagnosticsScreen: React.FC<
  ImagingDiagnosticsScreenProps
> = ({ patient, onOpenPatientFile, onAddToTreatmentPlan }) => {
  const [studies, setStudies] = useState<DiagnosticStudy[]>(
    INITIAL_DIAGNOSTIC_STUDIES
  );
  const [activeStudy, setActiveStudy] = useState<DiagnosticStudy>(
    INITIAL_DIAGNOSTIC_STUDIES[0]
  );
  const [activeModalityFilter, setActiveModalityFilter] = useState<'All' | 'X-Ray' | 'CBCT' | 'Photo'>('All');
  const [activeTool, setActiveTool] = useState<
    'select' | 'pan' | 'measure' | 'angle' | 'density' | 'annotate'
  >('select');
  const [contrastVal, setContrastVal] = useState<number>(128);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [doctorImpression, setDoctorImpression] = useState<string>(
    'Confirming recurrent caries under distal margin of #15 restoration. Recommend composite replacement. Tooth #11 exhibits non-vital apical lesion; schedule electric pulp test and root canal therapy prior to prosthetic crown preparation.'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredStudies = studies.filter((s) => {
    if (activeModalityFilter === 'All') return true;
    if (activeModalityFilter === 'X-Ray')
      return s.modality.includes('OPG') || s.modality.includes('BW') || s.modality.includes('PA');
    if (activeModalityFilter === 'CBCT') return s.modality.includes('CBCT');
    if (activeModalityFilter === 'Photo') return s.modality.includes('Camera');
    return true;
  });

  return (
    <div className="w-full pb-16">
      <div className="p-4 lg:p-6 max-w-[1380px] mx-auto w-full flex flex-col gap-5">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-neutral-700">
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">
              check_circle
            </span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Patient Summary Header */}
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="relative shrink-0">
              {patient.avatar.startsWith('http') ? (
                <img
                  src={patient.avatar}
                  alt={patient.name}
                  className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-primary-tint"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-xl">
                  {patient.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-surface" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-xs uppercase tracking-wider font-bold">
                  #{patient.mrn}
                </span>
                <span className="bg-success-tint text-tertiary-container text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Active - Patient Portal
                </span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                {patient.name}
              </h1>
              <p className="text-xs text-text-secondary">
                DOB: {patient.dob} ({patient.age}y) • {patient.gender} • Blood: {patient.bloodType || 'O+'} • No known drug allergies
              </p>
            </div>

            <div className="flex items-center gap-2 sm:ml-4">
              <button
                onClick={() => onOpenPatientFile(patient.id)}
                className="h-10 px-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-semibold text-xs flex items-center gap-1.5 transition-colors border border-border-divider cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  folder_shared
                </span>
                <span>Open Chart</span>
              </button>
              <button
                onClick={() =>
                  triggerToast(`Calling ${patient.name} at ${patient.phone}`)
                }
                className="h-10 px-3.5 rounded-xl bg-primary-container hover:bg-primary-hover text-on-primary font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  call
                </span>
                <span>Call Patient</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-xs">
            <div className="flex flex-col">
              <span className="text-text-secondary font-medium">
                Primary Provider
              </span>
              <span className="font-bold text-text-primary">
                {patient.assignedDoctor}
              </span>
              <span className="text-text-secondary">{patient.phone}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-text-secondary font-medium">
                Insurance Status
              </span>
              <span className="font-bold text-text-primary">
                {patient.primaryInsurance.planName}
              </span>
              <span className="text-emerald-700 font-semibold">
                {patient.primaryInsurance.status}
              </span>
            </div>
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <span className="text-text-secondary font-medium">
                Radiology History
              </span>
              <span className="font-bold text-text-primary">
                Full Survey (12.11.23)
              </span>
              <span className="text-danger font-semibold">
                Recall Due: Root Apex #11
              </span>
            </div>
          </div>
        </div>

        {/* 3-Column Diagnostic Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Study Thumbnails (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-bold text-text-primary">
                    Diagnostic Series
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Study: Oct 24, 2024 • 6 Studies
                  </p>
                </div>
                <span className="material-symbols-outlined text-outline text-[18px]">
                  collections_bookmark
                </span>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
                {(['All', 'X-Ray', 'CBCT', 'Photo'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveModalityFilter(filter)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      activeModalityFilter === filter
                        ? 'bg-primary-container text-on-primary'
                        : 'bg-surface-container-low text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Stack of Study Cards */}
              <div className="flex flex-col gap-2 max-h-[640px] overflow-y-auto pr-1">
                {filteredStudies.map((study) => (
                  <div
                    key={study.id}
                    onClick={() => setActiveStudy(study)}
                    className={`p-2 rounded-xl cursor-pointer transition-all border ${
                      activeStudy.id === study.id
                        ? 'bg-primary-tint/60 border-primary ring-2 ring-primary shadow-sm'
                        : 'bg-surface hover:bg-surface-container-low border-border-card'
                    }`}
                  >
                    <div className="relative rounded-lg overflow-hidden mb-1.5 bg-neutral-900 aspect-[16/9] flex items-center justify-center">
                      <img
                        src={study.thumbnail}
                        alt={study.title}
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-neutral-900/80 backdrop-blur-sm text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                        {study.modality}
                      </span>
                      {study.alertsCount && study.alertsCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 bg-danger text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                          {study.alertsCount} Alerts
                        </span>
                      )}
                      {activeStudy.id === study.id && (
                        <span className="absolute bottom-1.5 right-1.5 bg-success-tint text-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          Active View
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-primary truncate">
                        {study.title}
                      </span>
                      <span className="text-[10px] text-text-secondary font-mono">
                        {study.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-text-secondary text-[11px] mt-0.5">
                      <span className="truncate">{study.teethInvolved}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column: Interactive Radiology Canvas (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Toolbar Ribbon */}
            <div className="bg-surface rounded-xl p-2 px-3 shadow-sm border border-border-card/60 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1">
                {(
                  [
                    { id: 'select', icon: 'near_me', label: 'Pointer' },
                    { id: 'pan', icon: 'pan_tool', label: 'Pan' },
                    { id: 'measure', icon: 'straighten', label: 'Measure mm' },
                    { id: 'angle', icon: 'square_foot', label: 'Angle' },
                    { id: 'density', icon: 'grain', label: 'Density HU' },
                    { id: 'annotate', icon: 'ink_pen', label: 'Box' },
                  ] as const
                ).map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      activeTool === tool.id
                        ? 'bg-primary-container text-on-primary shadow-xs'
                        : 'hover:bg-surface-container text-text-primary'
                    }`}
                    title={tool.label}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {tool.icon}
                    </span>
                  </button>
                ))}
              </div>

              <div className="h-5 w-px bg-border-divider hidden sm:block" />

              {/* Contrast Range Slider */}
              <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                <span className="material-symbols-outlined text-text-secondary text-[16px]">
                  contrast
                </span>
                <div className="flex flex-col w-full">
                  <div className="flex justify-between text-[10px] font-mono text-text-secondary">
                    <span>Contrast</span>
                    <span>{contrastVal} / 256</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="220"
                    value={contrastVal}
                    onChange={(e) => setContrastVal(Number(e.target.value))}
                    className="w-full h-1 bg-surface-container-high rounded appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div className="h-5 w-px bg-border-divider hidden sm:block" />

              {/* Zoom & Invert Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsInverted((prev) => !prev)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    isInverted
                      ? 'bg-primary-tint text-primary font-bold'
                      : 'hover:bg-surface-container text-text-primary'
                  }`}
                  title="Invert Colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    invert_colors
                  </span>
                </button>
                <button
                  onClick={() => setZoomScale((prev) => Math.min(prev + 0.2, 2.5))}
                  className="w-8 h-8 rounded-lg hover:bg-surface-container text-text-primary flex items-center justify-center transition-all cursor-pointer"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    zoom_in
                  </span>
                </button>
                <button
                  onClick={() => setZoomScale((prev) => Math.max(prev - 0.2, 0.7))}
                  className="w-8 h-8 rounded-lg hover:bg-surface-container text-text-primary flex items-center justify-center transition-all cursor-pointer"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    zoom_out
                  </span>
                </button>
                <button
                  onClick={() => {
                    setZoomScale(1);
                    setContrastVal(128);
                    setIsInverted(false);
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-surface-container text-text-primary flex items-center justify-center transition-all cursor-pointer"
                  title="Reset Frame"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    restart_alt
                  </span>
                </button>
              </div>
            </div>

            {/* MAIN VIEWPORT DISPLAY */}
            <div
              className={`relative bg-neutral-950 rounded-xl overflow-hidden shadow-lg border border-neutral-800 flex items-center justify-center select-none transition-all ${
                isFullscreen ? 'fixed inset-4 z-50 min-h-screen' : 'min-h-[500px]'
              }`}
            >
              <div className="relative w-full h-[500px] overflow-hidden flex items-center justify-center">
                <img
                  src={activeStudy.thumbnail}
                  alt={activeStudy.title}
                  style={{
                    filter: `contrast(${contrastVal}%) ${
                      isInverted ? 'invert(100%)' : ''
                    }`,
                    transform: `scale(${zoomScale})`,
                  }}
                  className="w-full h-full object-cover transition-all duration-150"
                />

                {/* Live Diagnostic Overlay 1: Interproximal Caries on #15 */}
                <div
                  onClick={() =>
                    triggerToast('Tooth #15 selected: D2 Caries Depth 0.9mm')
                  }
                  className="absolute top-[36%] left-[39%] w-14 h-16 rounded-md border-2 border-dashed border-warning bg-warning/15 cursor-pointer hover:bg-warning/30 transition-all flex flex-col justify-between p-1 z-20"
                >
                  <span className="text-[9px] font-mono font-bold bg-warning text-neutral-900 px-1 py-0.2 rounded w-fit">
                    #15 D2 Caries
                  </span>
                  <span className="text-[9px] font-mono text-white bg-neutral-900/80 px-1 py-0.2 rounded w-fit self-end">
                    94%
                  </span>
                </div>

                {/* Live Diagnostic Overlay 2: Periapical Radiolucency on #11 */}
                <div
                  onClick={() =>
                    triggerToast(
                      'Tooth #11 selected: Apex Radiolucency Ø 3.8mm'
                    )
                  }
                  className="absolute top-[28%] left-[51%] w-12 h-12 rounded-full border-2 border-danger bg-danger/15 cursor-pointer hover:bg-danger/30 transition-all flex items-center justify-center z-20"
                >
                  <span className="w-2 h-2 rounded-full bg-danger animate-ping" />
                  <span className="absolute -top-5 bg-danger text-white text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                    Apex #11 Ø 3.8mm
                  </span>
                </div>

                {/* Alveolar Crest Calibration Line */}
                <div className="absolute bottom-[28%] right-[32%] flex items-center gap-1 pointer-events-none z-20">
                  <div className="h-20 w-1 bg-emerald-400 relative flex flex-col justify-between">
                    <span className="w-3 h-0.5 bg-emerald-400 -ml-1" />
                    <span className="w-2 h-0.5 bg-emerald-400 -ml-0.5" />
                    <span className="w-3 h-0.5 bg-emerald-400 -ml-1" />
                  </div>
                  <span className="bg-neutral-900/90 text-emerald-300 font-mono text-[10px] px-1.5 py-0.5 rounded border border-neutral-700">
                    14.6 mm Alveolar Crest
                  </span>
                </div>
              </div>

              {/* DICOM Header Watermarks */}
              <div className="absolute top-3 left-3 flex flex-col gap-0.5 pointer-events-none z-20">
                <div className="font-mono text-[11px] text-neutral-200 font-semibold">
                  {patient.name.toUpperCase()} • {patient.dob}
                </div>
                <div className="font-mono text-[10px] text-neutral-400">
                  STUDY ID: OPG-2024-8841 • {activeStudy.specs}
                </div>
              </div>

              <div className="absolute top-3 right-3 text-right pointer-events-none z-20">
                <div className="font-mono text-[11px] text-sky-400 font-bold uppercase">
                  HD Sirona Orthophos SL
                </div>
                <div className="font-mono text-[10px] text-neutral-300">
                  Direct Conversion CsI Sensor
                </div>
              </div>

              <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen((prev) => !prev)}
                  className="bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 text-xs font-mono px-3 py-1.5 rounded-lg border border-neutral-700 backdrop-blur-md flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isFullscreen ? 'close_fullscreen' : 'crop_free'}
                  </span>
                  <span>{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
                </button>
              </div>
            </div>

            {/* Quick Measurement Reference Under Canvas */}
            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex flex-col">
                <span className="text-text-secondary font-medium">
                  Bone Level #15-#16
                </span>
                <span className="text-base font-bold text-text-primary mt-0.5">
                  14.6 mm
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">
                    check_circle
                  </span>{' '}
                  Normal Crest
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-text-secondary font-medium">
                  Radiolucency #11
                </span>
                <span className="text-base font-bold text-danger mt-0.5">
                  3.8 × 4.1 mm
                </span>
                <span className="text-danger font-semibold flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">
                    error
                  </span>{' '}
                  Apex Involvement
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-text-secondary font-medium">
                  Mandibular Canal Gap
                </span>
                <span className="text-base font-bold text-text-primary mt-0.5">
                  4.2 mm Safety
                </span>
                <span className="text-emerald-700 font-semibold mt-0.5">
                  Safe Margin
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-text-secondary font-medium">
                  Bone Density (HU)
                </span>
                <span className="text-base font-bold text-text-primary mt-0.5">
                  +820 HU
                </span>
                <span className="text-text-secondary mt-0.5">Type II Dense</span>
              </div>
            </div>
          </div>

          {/* Right Column: AI Findings, Impressions & Handoff (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* AI Diagnostic Triage */}
            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[19px]">
                    smart_toy
                  </span>
                  <h2 className="text-sm font-bold text-text-primary">
                    AI Diagnostic Triage
                  </h2>
                </div>
                <span className="bg-primary-tint text-primary font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                  v4.1 Neural
                </span>
              </div>

              <p className="text-xs text-text-secondary">
                Real-time automatic pathology screening across current radiograph study.
              </p>

              {/* Finding 1 */}
              <div className="p-3 rounded-xl bg-warning-tint/70 border border-amber-200/60 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-warning flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    Tooth #15 • Interproximal
                  </span>
                  <span className="font-mono text-[10px] font-bold text-warning">
                    94% Conf.
                  </span>
                </div>
                <p className="text-xs text-text-primary leading-tight">
                  Enamel-dentin junction caries on distal surface. Demineralization depth 0.9 mm.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-text-secondary">
                    Severity: Moderate (D2)
                  </span>
                  <button
                    onClick={() =>
                      onAddToTreatmentPlan('Tooth #15 Composite Restoration (CDT D2392)')
                    }
                    className="text-primary font-semibold text-[11px] hover:underline cursor-pointer"
                  >
                    + Add to Plan
                  </button>
                </div>
              </div>

              {/* Finding 2 */}
              <div className="p-3 rounded-xl bg-danger-tint/70 border border-danger/20 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-danger flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-danger" />
                    Tooth #11 • Apex Root
                  </span>
                  <span className="font-mono text-[10px] font-bold text-danger">
                    98% Conf.
                  </span>
                </div>
                <p className="text-xs text-text-primary leading-tight">
                  Well-defined circumscribed periapical radiolucency. Suspected chronic apical periodontitis.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-danger font-semibold">
                    Flag: Endodontic Eval
                  </span>
                  <button
                    onClick={() =>
                      onAddToTreatmentPlan('Tooth #11 Root Canal Therapy (CDT D3330)')
                    }
                    className="text-danger font-semibold text-[11px] hover:underline cursor-pointer"
                  >
                    + Add to Plan
                  </button>
                </div>
              </div>

              {/* Finding 3 */}
              <div className="p-3 rounded-xl bg-success-tint/70 border border-emerald-200/50 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    Quadrants 3 & 4 Bone Level
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-800">
                    99%
                  </span>
                </div>
                <p className="text-xs text-text-primary leading-tight">
                  Horizontal alveolar crest preserved. No significant furcation involvement.
                </p>
              </div>
            </div>

            {/* Doctor Impression Card */}
            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary">
                  Doctor Impression
                </h3>
                <span className="text-xs text-text-secondary">Dr. P. Deck</span>
              </div>
              <textarea
                rows={3}
                value={doctorImpression}
                onChange={(e) => setDoctorImpression(e.target.value)}
                className="w-full bg-surface-container-low rounded-lg p-2.5 text-xs text-text-primary border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary-container resize-none"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-text-secondary">
                  Signed: 10:59 AM
                </span>
                <button
                  onClick={() => triggerToast('Doctor Impression note updated successfully!')}
                  className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold cursor-pointer"
                >
                  Update Note
                </button>
              </div>
            </div>

            {/* Actions & Handoff Card */}
            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60 flex flex-col gap-2">
              <h3 className="text-sm font-bold text-text-primary mb-0.5">
                Actions & Handoff
              </h3>
              <button
                onClick={() => {
                  onAddToTreatmentPlan('OPG Diagnostic Pathology Findings');
                  triggerToast('Added findings to patient active treatment plan!');
                }}
                className="w-full h-10 px-3 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  assignment_add
                </span>
                <span>Add to Treatment Plan</span>
              </button>
              <button
                onClick={() =>
                  triggerToast(`Diagnostic summary dispatched to patient via WhatsApp!`)
                }
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-semibold flex items-center justify-center gap-2 border border-border-divider transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-600">
                  send
                </span>
                <span>Share to Patient WhatsApp</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => triggerToast('DICOM image exported as .dcm')}
                  className="h-9 px-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-semibold flex items-center justify-center gap-1 border border-border-divider transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    download
                  </span>
                  <span>Export DICOM</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="h-9 px-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-semibold flex items-center justify-center gap-1 border border-border-divider transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    print
                  </span>
                  <span>Print Sheet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
