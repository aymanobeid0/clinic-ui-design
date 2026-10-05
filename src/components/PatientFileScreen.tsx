import React, { useState, useEffect } from 'react';
import {
  Patient,
  PatientTabId,
  ToothCondition,
  TreatmentPhase,
  TreatmentProcedureItem,
  InvoiceItem,
  PrescriptionItem,
} from '../types/dental';
import {
  INITIAL_TEETH_MAP,
  INITIAL_TREATMENT_PHASES,
  INITIAL_TREATMENT_PROCEDURES,
  INITIAL_INVOICES,
  INITIAL_PRESCRIPTIONS,
  TOOTH_XRAY_PA,
  PANORAMIC_OPG_IMAGE,
  CBCT_3D_IMAGE,
} from '../data/mockDentalData';
import { PatientListView } from './PatientListView';
import { matchPatientByNameOrDob } from '../utils/patientSearch';
import { PatientSummaryDashboard } from './PatientSummaryDashboard';
import { DocumentTemplateModal } from './DocumentTemplateModal';

interface PatientFileScreenProps {
  patient: Patient;
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onBookNextVisit: () => void;
  onNewRx: () => void;
  onGenerateInvoice: () => void;
  onOpenRadiology: () => void;
  activeTab?: PatientTabId;
  initialViewMode?: 'directory' | 'chart';
}

export const PatientFileScreen: React.FC<PatientFileScreenProps> = ({
  patient,
  patients,
  onSelectPatient,
  onBookNextVisit,
  onNewRx,
  onGenerateInvoice,
  onOpenRadiology,
  activeTab = 'overview',
  initialViewMode = 'directory',
}) => {
  const [viewMode, setViewMode] = useState<'directory' | 'chart'>(initialViewMode);
  const [showQuickSearchSwitcher, setShowQuickSearchSwitcher] = useState(false);
  const [quickSwitcherQuery, setQuickSwitcherQuery] = useState('');
  const [currentTab, setCurrentTab] = useState<PatientTabId>(activeTab);
  const [teeth, setTeeth] = useState<ToothCondition[]>(INITIAL_TEETH_MAP);
  const [selectedTooth, setSelectedTooth] = useState<ToothCondition>(
    INITIAL_TEETH_MAP.find((t) => t.fdiNumber === 26) || INITIAL_TEETH_MAP[13]
  );
  const [quickWhatsAppReply, setQuickWhatsAppReply] = useState('');

  // Document Template Modal State
  const [showDocModal, setShowDocModal] = useState(false);
  const [docModalType, setDocModalType] = useState<'prescription' | 'invoice'>('prescription');
  const [docModalInvoice, setDocModalInvoice] = useState<InvoiceItem | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenDocModal = (type: 'prescription' | 'invoice', inv?: InvoiceItem) => {
    setDocModalType(type);
    setDocModalInvoice(inv);
    setShowDocModal(true);
  };
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: string; text: string; time: string; isClinic?: boolean }>
  >([
    {
      sender: patient.name,
      text: 'Hi Dr. Jenkins, the temporary crown feels solid and no pain when biting. See you tomorrow at 9 AM!',
      time: 'Yesterday 4:15 PM',
      isClinic: false,
    },
    {
      sender: 'Clinic Automated Reminders',
      text: `Confirmed appointment today at 09:00 AM with ${patient.assignedDoctor} (Downtown Branch, Chair 2). Fasting not required.`,
      time: 'Today 7:00 AM',
      isClinic: true,
    },
  ]);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [soapNotes, setSoapNotes] = useState({
    subjective:
      'Patient reports no post-op sensitivity following pulpectomy on #26.',
    objective:
      'Soft tissue healing uneventful. Gingival margin healthy around temporary acrylic crown.',
    plan: 'Monolithic zirconia crown try-in and cementation with resin-modified glass ionomer (RMGIC).',
    signedBy: 'Dr. S. Jenkins, DDS (Lic #4419)',
  });
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNoteText, setTempNoteText] = useState(soapNotes.plan);

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickWhatsAppReply.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'Dr. Sarah Jenkins',
        text: quickWhatsAppReply.trim(),
        time: 'Just now',
        isClinic: true,
      },
    ]);
    setQuickWhatsAppReply('');
  };

  const updateToothCondition = (
    condition: ToothCondition['condition']
  ) => {
    setTeeth((prev) =>
      prev.map((t) =>
        t.number === selectedTooth.number ? { ...t, condition } : t
      )
    );
    setSelectedTooth((prev) => ({ ...prev, condition }));
  };

  const toggleToothSurface = (
    surface: keyof ToothCondition['surfaces']
  ) => {
    const updatedSurfaces = {
      ...selectedTooth.surfaces,
      [surface]: !selectedTooth.surfaces[surface],
    };
    setTeeth((prev) =>
      prev.map((t) =>
        t.number === selectedTooth.number
          ? { ...t, surfaces: updatedSurfaces }
          : t
      )
    );
    setSelectedTooth((prev) => ({ ...prev, surfaces: updatedSurfaces }));
  };

  return (
    <div className="w-full pb-16">
      <div className="p-4 lg:p-6 max-w-[1380px] mx-auto w-full flex flex-col gap-5">
        {/* Navigation Mode Switcher: Patient Directory vs Clinical Chart */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-divider/50">
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-border-card text-xs">
            <button
              type="button"
              onClick={() => setViewMode('directory')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'directory'
                  ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">
                table_rows
              </span>
              <span>Patient Directory & Search ({patients.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('chart')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'chart'
                  ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">
                clinical_notes
              </span>
              <span>Active Chart: {patient.name}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {viewMode === 'chart' ? (
              <button
                type="button"
                onClick={() => setViewMode('directory')}
                className="px-3 py-1.5 rounded-lg bg-surface border border-border-card text-text-primary hover:bg-surface-container-low font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_back
                </span>
                <span>Back to Patient Directory</span>
              </button>
            ) : (
              <span className="text-text-secondary text-xs">
                Real-Time Search:{' '}
                <strong className="text-primary font-semibold">
                  Name & Date of Birth (DOB) Filter
                </strong>
              </span>
            )}
          </div>
        </div>

        {viewMode === 'directory' ? (
          <PatientListView
            patients={patients}
            selectedPatientId={patient.id}
            onSelectPatient={(id) => {
              onSelectPatient(id);
              setViewMode('chart');
            }}
            onOpenQuickAppointment={() => onBookNextVisit()}
            onNewRx={() => onNewRx()}
            onOpenRadiology={() => onOpenRadiology()}
          />
        ) : (
          <>
            {/* Top Breadcrumbs & Patient Quick Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-text-secondary text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setViewMode('directory')}
                  className="flex items-center gap-1 text-primary hover:underline font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    groups
                  </span>
                  <span>Patients</span>
                </button>
                <span className="text-outline">/</span>

                {/* Searchable Quick Switcher with Name & DOB Filter */}
                <div className="relative inline-flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setShowQuickSearchSwitcher(!showQuickSearchSwitcher)
                    }
                    className="bg-surface border border-border-card text-on-surface font-semibold py-1.5 px-2.5 rounded-lg text-xs cursor-pointer shadow-2xs flex items-center gap-2 hover:border-primary/50 transition-colors"
                  >
                    <span>
                      {patient.name} ({patient.mrn})
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-container text-primary font-bold">
                      DOB: {patient.dob}
                    </span>
                    <span className="material-symbols-outlined text-outline text-[16px]">
                      expand_more
                    </span>
                  </button>

                  {/* Dropdown with live search */}
                  {showQuickSearchSwitcher && (
                    <div className="absolute top-9 left-0 w-84 bg-surface rounded-xl shadow-xl border border-border-card p-2.5 z-50 flex flex-col gap-2">
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                          search
                        </span>
                        <input
                          type="text"
                          value={quickSwitcherQuery}
                          onChange={(e) =>
                            setQuickSwitcherQuery(e.target.value)
                          }
                          placeholder="Quick search name or DOB..."
                          className="w-full h-8 pl-8 pr-3 text-xs bg-surface-container-low rounded-lg border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary"
                          autoFocus
                        />
                      </div>

                      <div className="max-h-56 overflow-y-auto divide-y divide-border-divider/30 text-xs">
                        {patients
                          .filter(
                            (p) =>
                              matchPatientByNameOrDob(p, quickSwitcherQuery)
                                .matched
                          )
                          .map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                onSelectPatient(p.id);
                                setShowQuickSearchSwitcher(false);
                                setQuickSwitcherQuery('');
                              }}
                              className={`w-full p-2 text-left hover:bg-surface-container-low rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                                p.id === patient.id
                                  ? 'bg-primary-tint/40 font-bold text-primary'
                                  : ''
                              }`}
                            >
                              <div>
                                <p className="font-semibold text-text-primary">
                                  {p.name}
                                </p>
                                <p className="text-[11px] text-text-secondary font-mono">
                                  DOB: {p.dob} • {p.mrn}
                                </p>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-text-secondary font-medium">
                                {p.status}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <span className="px-2 py-0.5 rounded-full bg-success-tint text-tertiary-container text-[11px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  {patient.operatoryRoom || 'In Operatory (Chair 2)'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-text-secondary">Assigned Clinician:</span>
                <div className="flex items-center gap-1.5 bg-surface px-2.5 py-1 rounded-full shadow-sm border border-border-card">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="font-semibold text-primary">
                    {patient.assignedDoctor}
                  </span>
                </div>
              </div>
            </div>

        {/* Master Patient Header Card */}
        <div className="bg-surface rounded-xl p-5 lg:p-6 shadow-sm border border-border-card/60 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Avatar & Identity */}
            <div className="flex items-start md:items-center gap-4">
              <div className="relative shrink-0">
                {patient.avatar.startsWith('http') ? (
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-16 h-16 rounded-xl object-cover shadow-sm ring-2 ring-primary-tint"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-primary-container text-on-primary flex items-center justify-center text-xl font-bold tracking-tight shadow-sm">
                    {patient.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 p-0.5 bg-surface rounded-full shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[16px] block">
                    verified
                  </span>
                </span>
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                    {patient.name}
                  </h1>
                  <span className="text-xs text-text-secondary bg-surface-container-low px-2 py-0.5 rounded-md font-mono border border-border-divider">
                    ID: #{patient.mrn}
                  </span>
                  <span className="text-text-secondary text-sm">
                    • {patient.age} yrs, {patient.gender}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary mt-0.5">
                  <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer font-medium text-text-primary">
                    <span className="material-symbols-outlined text-[17px] text-[#25D366]">
                      chat
                    </span>
                    <span>{patient.phone}</span>
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[17px] text-outline">
                      mail
                    </span>
                    <span>{patient.email}</span>
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="flex items-center gap-1 bg-primary-tint px-2.5 py-0.5 rounded-full text-primary font-semibold">
                    <span className="material-symbols-outlined text-[15px]">
                      schedule
                    </span>
                    <span>Next Visit: Today, 09:00 AM</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-2 lg:self-center">
              <button
                onClick={onBookNextVisit}
                className="h-10 px-3.5 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add_circle
                </span>
                <span>+ Book Next Visit</span>
              </button>
              <button
                onClick={onNewRx}
                className="h-10 px-3.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors border border-border-divider cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">
                  pill
                </span>
                <span>New Rx</span>
              </button>
              <button
                onClick={onGenerateInvoice}
                className="h-10 px-3.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors border border-border-divider cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">
                  receipt_long
                </span>
                <span>Invoice</span>
              </button>
              <button
                onClick={() => window.print()}
                className="h-10 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-secondary hover:text-on-surface transition-colors border border-border-divider cursor-pointer"
                title="Print Dental Record"
              >
                <span className="material-symbols-outlined text-[18px]">
                  print
                </span>
              </button>
            </div>
          </div>

          {/* Critical Alerts Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-divider/50">
            <span className="text-[11px] uppercase tracking-wider text-text-secondary font-bold mr-1">
              Medical Alerts:
            </span>
            {patient.medicalAlerts.map((alert, idx) => (
              <div
                key={idx}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs ${
                  alert.type === 'critical'
                    ? 'bg-danger-tint text-danger border border-danger/20'
                    : alert.type === 'warning'
                    ? 'bg-warning-tint text-warning border border-warning/20'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {alert.type === 'critical'
                    ? 'warning'
                    : alert.type === 'warning'
                    ? 'monitor_heart'
                    : 'health_and_safety'}
                </span>
                <span>{alert.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Summary Dashboard: Quick Stats (Last Visit, Upcoming Procedure, Outstanding Balance) */}
        <PatientSummaryDashboard
          patient={patient}
          onNavigateTab={(tab) => setCurrentTab(tab)}
          onBookNextVisit={onBookNextVisit}
          onGenerateInvoice={onGenerateInvoice}
        />

        {/* Navigation Tabs Bar */}
        <div className="bg-surface rounded-xl px-4 pt-1 shadow-sm border border-border-card/60 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 min-w-max">
            <button
              onClick={() => setCurrentTab('overview')}
              className={`h-11 px-4 border-b-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                currentTab === 'overview'
                  ? 'border-primary-container text-primary'
                  : 'border-transparent text-text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                person
              </span>
              <span>Overview & Patient Details</span>
            </button>

            <button
              onClick={() => setCurrentTab('chart')}
              className={`h-11 px-4 border-b-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                currentTab === 'chart'
                  ? 'border-primary-container text-primary'
                  : 'border-transparent text-text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                dentistry
              </span>
              <span>Odontogram & Dental Chart</span>
              <span className="w-2 h-2 rounded-full bg-primary-container" />
            </button>

            <button
              onClick={() => setCurrentTab('treatments')}
              className={`h-11 px-4 border-b-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                currentTab === 'treatments'
                  ? 'border-primary-container text-primary'
                  : 'border-transparent text-text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                medical_services
              </span>
              <span>Treatment Plans</span>
              <span className="px-1.5 py-0.2 rounded-full bg-primary-tint text-primary text-[11px] font-bold">
                2 Active
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('billing')}
              className={`h-11 px-4 border-b-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                currentTab === 'billing'
                  ? 'border-primary-container text-primary'
                  : 'border-transparent text-text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                receipt_long
              </span>
              <span>Payments & Invoices</span>
              <span className="px-1.5 py-0.2 rounded-full bg-warning-tint text-warning text-[11px] font-bold">
                $850 Due
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('rx')}
              className={`h-11 px-4 border-b-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                currentTab === 'rx'
                  ? 'border-primary-container text-primary'
                  : 'border-transparent text-text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                prescriptions
              </span>
              <span>Prescriptions History</span>
            </button>

            <button
              onClick={() => setCurrentTab('xrays')}
              className={`h-11 px-4 border-b-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                currentTab === 'xrays'
                  ? 'border-primary-container text-primary'
                  : 'border-transparent text-text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                radiology
              </span>
              <span>Documents & X-Rays</span>
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-text-secondary text-xs">
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Synced with PMS 2m ago</span>
          </div>
        </div>

        {/* TAB 1: OVERVIEW TAB CONTENT */}
        {currentTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 8 Cols: Payments & Financial Summary Bento */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              {/* Financial Summary Bento */}
              <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-text-primary">
                      Payments & Financial Summary
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Consolidated Ledger • Copays, Claims & Self-pay
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => handleOpenDocModal('invoice')}
                      className="h-9 px-3 rounded-lg bg-surface hover:bg-surface-container text-primary border border-primary/20 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                      title="Preview Patient Walkout Invoice Statement"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        receipt_long
                      </span>
                      <span>Invoice Template</span>
                    </button>
                    <button
                      onClick={() => setCurrentTab('billing')}
                      className="h-9 px-3.5 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        payments
                      </span>
                      <span>+ Record Payment</span>
                    </button>
                  </div>
                </div>

                {/* 3 Snapshot Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col justify-between border border-border-divider/50">
                    <span className="text-xs text-text-secondary font-medium">
                      Total Billed to Date
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-xl font-bold text-text-primary">
                        $4,250.00
                      </span>
                      <span className="text-text-secondary text-[11px]">
                        5 Procedures
                      </span>
                    </div>
                  </div>
                  <div className="bg-success-tint rounded-xl p-3.5 flex flex-col justify-between border border-emerald-200/50">
                    <span className="text-xs text-emerald-800 font-medium">
                      Total Cleared / Paid
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-xl font-bold text-emerald-800">
                        $3,400.00
                      </span>
                      <span className="text-emerald-800 text-[11px] font-semibold">
                        80% Settled
                      </span>
                    </div>
                  </div>
                  <div className="bg-warning-tint rounded-xl p-3.5 flex flex-col justify-between border border-amber-200/50">
                    <span className="text-xs text-warning font-medium">
                      Outstanding Balance
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-xl font-bold text-warning">
                        $850.00
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[11px] font-bold">
                        1 Due
                      </span>
                    </div>
                  </div>
                </div>

                {/* Invoices Table */}
                <div className="overflow-x-auto rounded-lg border border-border-divider/50">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-text-secondary font-semibold border-b border-border-divider/50">
                        <th className="py-2.5 px-3">Invoice #</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Procedure & Code</th>
                        <th className="py-2.5 px-3 text-right">Billed</th>
                        <th className="py-2.5 px-3 text-right">Paid</th>
                        <th className="py-2.5 px-3">Method</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-center">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-divider/40">
                      {INITIAL_INVOICES.slice(0, 3).map((inv) => (
                        <tr
                          key={inv.id}
                          className="hover:bg-surface-container-low transition-colors"
                        >
                          <td className="py-3 px-3 font-semibold text-primary">
                            {inv.id}
                          </td>
                          <td className="py-3 px-3 text-text-secondary">
                            {inv.date}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold block text-text-primary">
                              {inv.procedure}
                            </span>
                            <span className="text-[11px] text-text-secondary">
                              Tooth {inv.tooth} • {inv.code}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-medium text-text-primary">
                            ${inv.billed}.00
                          </td>
                          <td className="py-3 px-3 text-right text-text-secondary">
                            ${inv.paidPt + inv.paidIns}.00
                          </td>
                          <td className="py-3 px-3 text-text-secondary">
                            <span className="inline-flex items-center gap-1 text-[11px]">
                              <span className="material-symbols-outlined text-[15px]">
                                credit_card
                              </span>
                              {inv.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                inv.status === 'Paid'
                                  ? 'bg-success-tint text-tertiary-container'
                                  : inv.status === 'Partial'
                                  ? 'bg-warning-tint text-warning'
                                  : 'bg-danger-tint text-danger'
                              }`}
                            >
                              {inv.balance > 0 ? `$${inv.balance} Due` : 'Paid Full'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => handleOpenDocModal('invoice', inv)}
                              className="w-7 h-7 rounded-md hover:bg-primary-tint flex items-center justify-center text-primary transition-colors mx-auto cursor-pointer"
                              title="View Official Statement"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                receipt_long
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Patient Vitals & Demographics Bento Card */}
              {patient.vitals && (
                <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-text-primary">
                      Recorded Vitals & Demographics
                    </h3>
                    <span className="text-xs text-text-secondary">
                      {patient.vitals.recordedAt}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-surface-container-low rounded-lg border border-border-divider/50">
                      <span className="text-[11px] text-text-secondary block font-medium">
                        Blood Pressure
                      </span>
                      <span className="text-lg font-bold text-text-primary mt-0.5 block">
                        {patient.vitals.bloodPressure}{' '}
                        <span className="text-xs font-normal text-text-secondary">
                          mmHg
                        </span>
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
                        <span className="material-symbols-outlined text-[13px]">
                          check_circle
                        </span>{' '}
                        Normal
                      </span>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-lg border border-border-divider/50">
                      <span className="text-[11px] text-text-secondary block font-medium">
                        Pulse / SpO2
                      </span>
                      <span className="text-lg font-bold text-text-primary mt-0.5 block">
                        {patient.vitals.pulse} bpm / {patient.vitals.spO2}%
                      </span>
                      <div className="w-full h-1 bg-primary-container/20 rounded mt-1.5 overflow-hidden">
                        <div className="bg-primary-container h-full w-[80%]" />
                      </div>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-lg border border-border-divider/50">
                      <span className="text-[11px] text-text-secondary block font-medium">
                        Resp Rate / Temp
                      </span>
                      <span className="text-sm font-bold text-text-primary mt-0.5 block">
                        {patient.vitals.respiratoryRate} rpm •{' '}
                        {patient.vitals.temperature}
                      </span>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-lg border border-border-divider/50">
                      <span className="text-[11px] text-text-secondary block font-medium">
                        Emergency Contact
                      </span>
                      <span className="text-xs font-bold text-text-primary mt-0.5 block truncate">
                        {patient.emergencyContact.name} (
                        {patient.emergencyContact.relation})
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        {patient.emergencyContact.phone}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Planned Treatment, Imaging, WhatsApp Feed, SOAP Note */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Planned Treatment Card */}
              <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-primary font-bold">
                    Planned Treatment
                  </span>
                  <span className="px-2 py-0.5 rounded bg-primary-tint text-primary text-xs font-semibold">
                    Phase 2 of 3
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-container-low flex flex-col gap-1 border border-border-divider/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">
                        Zirconia Crown (#26)
                      </h4>
                      <p className="text-xs text-text-secondary">
                        Permanent monolithic crown seat
                      </p>
                    </div>
                    <span className="text-base font-bold text-primary">$950</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border-divider/60 text-xs text-text-secondary">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      event
                    </span>
                    <span>
                      Scheduled: <strong className="text-text-primary">Thu, Oct 19 • 10:30 AM</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary text-xs">
                    <span className="material-symbols-outlined text-outline text-[16px]">
                      chair
                    </span>
                    <span>Operatory 2 • Dr. Jenkins (45 min)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentTab('treatments')}
                    className="flex-1 h-9 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      calendar_add_on
                    </span>
                    <span>View Plan</span>
                  </button>
                  <button
                    onClick={() => onOpenRadiology()}
                    className="h-9 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center transition-colors border border-border-divider"
                    title="Radiology"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      radiology
                    </span>
                  </button>
                </div>
              </div>

              {/* Radiography & Visual Documentation Preview */}
              <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      radiology
                    </span>
                    <h3 className="text-sm font-bold text-text-primary">
                      Recent Imaging
                    </h3>
                  </div>
                  <button
                    onClick={() => onOpenRadiology()}
                    className="text-primary text-xs font-semibold hover:underline cursor-pointer"
                  >
                    View All (8)
                  </button>
                </div>

                <div
                  onClick={() => onOpenRadiology()}
                  className="relative rounded-lg overflow-hidden group shadow-sm bg-neutral-900 cursor-pointer"
                >
                  <img
                    className="w-full h-40 object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-90"
                    src={TOOTH_XRAY_PA}
                    alt="Dental X-ray Tooth #26"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 text-white flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold leading-tight">
                        PA View: Tooth #26
                      </p>
                      <p className="text-[10px] text-white/80">
                        Taken Sep 28, 2025 • Post-Op Endo
                      </p>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center backdrop-blur-sm transition-colors">
                      <span className="material-symbols-outlined text-[16px] text-white">
                        zoom_in
                      </span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => onOpenRadiology()}
                    className="p-2 rounded-lg bg-surface-container-low flex items-center gap-2 hover:bg-surface-container transition-colors text-left border border-border-divider/50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      panorama
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">Full OPG Pan</p>
                      <p className="text-[10px] text-text-secondary">
                        May 14, 2025
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => onOpenRadiology()}
                    className="p-2 rounded-lg bg-surface-container-low flex items-center gap-2 hover:bg-surface-container transition-colors text-left border border-border-divider/50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      3d_rotation
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">CBCT 3D Scan</p>
                      <p className="text-[10px] text-text-secondary">
                        Mar 02, 2025
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* WhatsApp & Patient Comms Feed */}
              <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#25D366] text-[20px]">
                      chat
                    </span>
                    <h3 className="text-sm font-bold text-text-primary">
                      WhatsApp Messages
                    </h3>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                </div>

                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg flex flex-col gap-0.5 text-xs ${
                        msg.isClinic
                          ? 'bg-primary-tint text-primary border border-primary/10 self-end w-full'
                          : 'bg-surface-container-low text-text-primary border border-border-divider/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{msg.sender}</span>
                        <span className="text-[10px] opacity-75">{msg.time}</span>
                      </div>
                      <p className="mt-0.5 leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendWhatsApp} className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={quickWhatsAppReply}
                    onChange={(e) => setQuickWhatsAppReply(e.target.value)}
                    placeholder="Type quick WhatsApp response..."
                    className="flex-1 h-9 px-3 rounded-lg bg-surface-container-low text-xs border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary-container"
                  />
                  <button
                    type="submit"
                    className="h-9 w-9 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      send
                    </span>
                  </button>
                </form>
              </div>

              {/* Latest Clinical Note (SOAP) */}
              <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary">
                    Latest Clinical Note
                  </h3>
                  <span className="text-text-secondary text-[11px] font-mono">
                    SOAP Format
                  </span>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg text-xs text-text-secondary leading-relaxed border border-border-divider/50 flex flex-col gap-1.5">
                  <p>
                    <strong className="text-text-primary">Subj:</strong>{' '}
                    {soapNotes.subjective}
                  </p>
                  <p>
                    <strong className="text-text-primary">Obj:</strong>{' '}
                    {soapNotes.objective}
                  </p>
                  {isEditingNote ? (
                    <div className="flex flex-col gap-1.5 pt-1">
                      <strong className="text-text-primary">Plan:</strong>
                      <textarea
                        value={tempNoteText}
                        onChange={(e) => setTempNoteText(e.target.value)}
                        rows={2}
                        className="w-full bg-surface p-2 rounded text-xs text-text-primary border border-primary focus:outline-none"
                      />
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setIsEditingNote(false)}
                          className="px-2 py-1 text-[11px] rounded bg-surface border border-border-card"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setSoapNotes((prev) => ({
                              ...prev,
                              plan: tempNoteText,
                            }));
                            setIsEditingNote(false);
                          }}
                          className="px-2 py-1 text-[11px] rounded bg-primary-container text-on-primary font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p>
                      <strong className="text-text-primary">Plan:</strong>{' '}
                      {soapNotes.plan}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-text-secondary">
                    Signed by {soapNotes.signedBy}
                  </span>
                  <button
                    onClick={() => setIsEditingNote(true)}
                    className="text-primary font-semibold hover:underline cursor-pointer"
                  >
                    + Edit / Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ODONTOGRAM & DENTAL CHART */}
        {currentTab === 'chart' && (
          <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  Interactive Odontogram & Dental Chart
                </h2>
                <p className="text-xs text-text-secondary">
                  FDI Two-Digit & Universal Numbering System • Click any tooth to inspect surfaces
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary font-medium">Quick Legend:</span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Crown
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Caries
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Composite
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Endo
                </span>
              </div>
            </div>

            {/* Tooth Grid View */}
            <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-5 border border-border-divider/60">
              {/* Upper Maxillary Arch */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    Maxillary Upper Arch (Teeth 18 - 28)
                  </span>
                  <span className="text-xs text-text-secondary">Right → Left</span>
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
                  {teeth.slice(0, 16).map((t) => (
                    <button
                      key={t.fdiNumber}
                      onClick={() => setSelectedTooth(t)}
                      className={`p-2 rounded-lg flex flex-col items-center justify-between transition-all border ${
                        selectedTooth.number === t.number
                          ? 'bg-primary-tint border-primary ring-2 ring-primary shadow-sm'
                          : 'bg-surface hover:bg-surface-container border-border-card'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-text-secondary font-bold">
                        {t.fdiNumber}
                      </span>
                      <span
                        className={`material-symbols-outlined text-[24px] my-1 ${
                          t.condition === 'caries'
                            ? 'text-rose-500'
                            : t.condition === 'crown'
                            ? 'text-indigo-600'
                            : t.condition === 'composite'
                            ? 'text-amber-500'
                            : t.condition === 'endo'
                            ? 'text-purple-600'
                            : t.condition === 'missing'
                            ? 'text-gray-300'
                            : 'text-slate-400'
                        }`}
                      >
                        dentistry
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          t.condition === 'caries'
                            ? 'bg-rose-500'
                            : t.condition === 'crown'
                            ? 'bg-indigo-600'
                            : t.condition === 'composite'
                            ? 'bg-amber-500'
                            : t.condition === 'endo'
                            ? 'bg-purple-600'
                            : t.condition === 'missing'
                            ? 'bg-gray-300'
                            : 'bg-emerald-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Lower Mandibular Arch */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    Mandibular Lower Arch (Teeth 48 - 38)
                  </span>
                  <span className="text-xs text-text-secondary">Right → Left</span>
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
                  {teeth.slice(16, 32).map((t) => (
                    <button
                      key={t.fdiNumber}
                      onClick={() => setSelectedTooth(t)}
                      className={`p-2 rounded-lg flex flex-col items-center justify-between transition-all border ${
                        selectedTooth.number === t.number
                          ? 'bg-primary-tint border-primary ring-2 ring-primary shadow-sm'
                          : 'bg-surface hover:bg-surface-container border-border-card'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-text-secondary font-bold">
                        {t.fdiNumber}
                      </span>
                      <span
                        className={`material-symbols-outlined text-[24px] my-1 ${
                          t.condition === 'caries'
                            ? 'text-rose-500'
                            : t.condition === 'crown'
                            ? 'text-indigo-600'
                            : t.condition === 'composite'
                            ? 'text-amber-500'
                            : t.condition === 'endo'
                            ? 'text-purple-600'
                            : t.condition === 'missing'
                            ? 'text-gray-300'
                            : 'text-slate-400'
                        }`}
                      >
                        dentistry
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          t.condition === 'caries'
                            ? 'bg-rose-500'
                            : t.condition === 'crown'
                            ? 'bg-indigo-600'
                            : t.condition === 'composite'
                            ? 'bg-amber-500'
                            : t.condition === 'endo'
                            ? 'bg-purple-600'
                            : t.condition === 'missing'
                            ? 'bg-gray-300'
                            : 'bg-emerald-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Tooth Detail Editor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-container-low p-4 rounded-xl border border-border-divider/50">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-text-secondary uppercase">
                  Inspected Tooth
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-mono font-bold text-lg">
                    {selectedTooth.fdiNumber}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">
                      {selectedTooth.name}
                    </h4>
                    <span className="text-xs text-text-secondary font-mono">
                      Universal #{selectedTooth.number} • Quadrant {selectedTooth.quadrant}
                    </span>
                  </div>
                </div>
                {selectedTooth.notes && (
                  <p className="text-xs text-text-secondary italic mt-1 bg-surface p-2 rounded">
                    "{selectedTooth.notes}"
                  </p>
                )}
              </div>

              {/* Surface Mapping Grid (B, L, M, D, Occlusal) */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-text-secondary mb-2">
                  Anatomical Surfaces (Click to Toggle)
                </span>
                <div className="relative w-32 h-32 bg-surface rounded-xl shadow-sm border border-border-card p-2 flex items-center justify-center">
                  <button
                    onClick={() => toggleToothSurface('buccal')}
                    className={`absolute top-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                      selectedTooth.surfaces.buccal
                        ? 'bg-rose-500 text-white'
                        : 'bg-surface-container text-text-secondary'
                    }`}
                  >
                    B
                  </button>
                  <button
                    onClick={() => toggleToothSurface('lingual')}
                    className={`absolute bottom-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                      selectedTooth.surfaces.lingual
                        ? 'bg-rose-500 text-white'
                        : 'bg-surface-container text-text-secondary'
                    }`}
                  >
                    L
                  </button>
                  <button
                    onClick={() => toggleToothSurface('mesial')}
                    className={`absolute left-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                      selectedTooth.surfaces.mesial
                        ? 'bg-rose-500 text-white'
                        : 'bg-surface-container text-text-secondary'
                    }`}
                  >
                    M
                  </button>
                  <button
                    onClick={() => toggleToothSurface('distal')}
                    className={`absolute right-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                      selectedTooth.surfaces.distal
                        ? 'bg-rose-500 text-white'
                        : 'bg-surface-container text-text-secondary'
                    }`}
                  >
                    D
                  </button>
                  <button
                    onClick={() => toggleToothSurface('occlusal')}
                    className={`w-12 h-12 rounded-lg font-bold text-xs flex items-center justify-center shadow-inner ${
                      selectedTooth.surfaces.occlusal
                        ? 'bg-rose-500 text-white'
                        : 'bg-surface-container-high text-text-primary'
                    }`}
                  >
                    OCC
                  </button>
                </div>
              </div>

              {/* Condition Quick Setter */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-text-secondary uppercase">
                  Assign Clinical Diagnosis
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => updateToothCondition('healthy')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      selectedTooth.condition === 'healthy'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-surface text-text-secondary border-border-card'
                    }`}
                  >
                    Healthy
                  </button>
                  <button
                    onClick={() => updateToothCondition('caries')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      selectedTooth.condition === 'caries'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-surface text-text-secondary border-border-card'
                    }`}
                  >
                    Caries / Cavity
                  </button>
                  <button
                    onClick={() => updateToothCondition('crown')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      selectedTooth.condition === 'crown'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-surface text-text-secondary border-border-card'
                    }`}
                  >
                    Porcelain Crown
                  </button>
                  <button
                    onClick={() => updateToothCondition('endo')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      selectedTooth.condition === 'endo'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-surface text-text-secondary border-border-card'
                    }`}
                  >
                    Root Canal (Endo)
                  </button>
                  <button
                    onClick={() => updateToothCondition('composite')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      selectedTooth.condition === 'composite'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-surface text-text-secondary border-border-card'
                    }`}
                  >
                    Composite Filling
                  </button>
                  <button
                    onClick={() => updateToothCondition('missing')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      selectedTooth.condition === 'missing'
                        ? 'bg-gray-600 text-white border-gray-600'
                        : 'bg-surface text-text-secondary border-border-card'
                    }`}
                  >
                    Extracted / Missing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TREATMENT PLANS */}
        {currentTab === 'treatments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 8 Cols: Comprehensive Plan & Phases */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-primary-tint text-primary px-2.5 py-0.5 rounded-full font-semibold">
                        Comprehensive Rehab #TP-2025-09
                      </span>
                      <span className="text-xs text-text-secondary">Rev. 2.1</span>
                    </div>
                    <h2 className="text-xl font-bold text-text-primary mt-1">
                      Multi-Stage Esthetic & Restorative Reconstruction
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast('Opened treatment plan #TP-2025-09 editor')}
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold cursor-pointer"
                    >
                      Edit Plan
                    </button>
                    <button
                      onClick={() => showToast('Adding new CDT procedure code to treatment plan')}
                      className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary text-xs font-semibold shadow-sm cursor-pointer hover:bg-primary-hover"
                    >
                      + Add Code
                    </button>
                  </div>
                </div>

                {/* 4-Phase Stepper */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {INITIAL_TREATMENT_PHASES.map((phase) => (
                    <div
                      key={phase.phaseNumber}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                        phase.status === 'in-progress'
                          ? 'bg-primary-tint/60 border-primary-container'
                          : 'bg-surface-container-low border-border-divider/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-text-secondary uppercase">
                          PHASE {phase.phaseNumber}
                        </span>
                        {phase.status === 'completed' ? (
                          <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                            check_circle
                          </span>
                        ) : phase.status === 'in-progress' ? (
                          <span className="material-symbols-outlined text-primary text-[18px] animate-spin">
                            autorenew
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-outline text-[18px]">
                            schedule
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-primary">
                          {phase.title}
                        </p>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          {phase.subtext}
                        </p>
                      </div>
                      <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            phase.status === 'completed'
                              ? 'bg-emerald-600'
                              : 'bg-primary-container'
                          }`}
                          style={{ width: `${phase.progressPct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Procedures List */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                    <h3 className="text-sm font-bold text-text-primary">
                      Active Procedures & Interventions
                    </h3>
                  </div>
                  <span className="text-xs text-text-secondary">
                    3 Clinical Items Tracked
                  </span>
                </div>

                {INITIAL_TREATMENT_PROCEDURES.map((proc) => (
                  <div
                    key={proc.id}
                    className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-primary-tint text-primary flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold">
                          {proc.toothType}
                        </span>
                        <span className="text-sm font-bold">{proc.tooth}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-text-primary">
                            {proc.title}
                          </span>
                          <span className="text-xs font-mono bg-surface-container px-2 py-0.5 rounded text-text-secondary">
                            {proc.cdtCode}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-success-tint text-tertiary-container">
                            {proc.status}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary">
                          {proc.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-secondary pt-1">
                          <span>{proc.provider}</span>
                          <span>•</span>
                          <span>{proc.dateOrSchedule}</span>
                          <span>•</span>
                          <span className="text-primary font-medium">
                            {proc.insuranceNote}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-2 md:pt-0 shrink-0">
                      <span className="text-base font-bold text-text-primary">
                        ${proc.totalFee}.00
                      </span>
                      <span className="text-xs text-tertiary-container font-semibold">
                        {proc.badgeLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 Cols: Plan Estimate, Consent, Checklist */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Financial Ledger Overview Card */}
              <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                      Financial Breakdown
                    </span>
                    <h3 className="text-base font-bold text-text-primary">
                      Plan Estimate
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-primary-tint flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">
                      account_balance_wallet
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-3 rounded-xl border border-border-divider/50">
                  <span className="text-xs text-text-secondary">
                    Gross Treatment Cost
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-bold text-text-primary">
                      $2,080.00
                    </span>
                    <span className="text-xs text-text-secondary">
                      3 Procedures
                    </span>
                  </div>
                </div>

                {/* Dual Tonal Distribution Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" /> Ins.
                      Coverage (70%)
                    </span>
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary" /> Patient Co-pay
                      (30%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden flex">
                    <div className="bg-emerald-600 h-full w-[70%]" />
                    <div className="bg-primary-container h-full w-[30%]" />
                  </div>
                </div>

                {/* Ledger Breakdown Rows */}
                <div className="flex flex-col gap-2 text-xs text-text-primary pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">
                      Total Procedure Fees
                    </span>
                    <span className="font-semibold">$2,080.00</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-700">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">
                        verified
                      </span>{' '}
                      Est. Insurance Benefit
                    </span>
                    <span className="font-semibold">-$1,450.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">
                      Deductible Applied
                    </span>
                    <span className="font-medium">$0.00 (Met)</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 bg-primary-tint rounded-lg mt-1">
                    <span className="font-semibold text-primary">
                      Est. Patient Co-pay
                    </span>
                    <span className="text-base font-bold text-primary">
                      $630.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Consent & Authorizations */}
              <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-text-primary">
                    Consent & Authorizations
                  </h4>
                  <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                    task_alt
                  </span>
                </div>
                <div className="bg-success-tint/60 rounded-xl p-3 flex flex-col gap-1 border border-emerald-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">
                      Signed Patient Consent
                    </span>
                    <span className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-0.5 rounded-full shadow-2xs">
                      e-Signed
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Informed consent for Crown #26 & Endo #11 signed via iPad Chairside
                    by {patient.name} on Sept 28, 2025.
                  </p>
                </div>
                <button
                  onClick={() => showToast(`Generated printable Treatment Proposal for ${patient.name}`)}
                  className="w-full h-10 rounded-lg bg-primary-container text-on-primary text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer hover:bg-primary-hover transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    print
                  </span>
                  <span>Print Treatment Proposal</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BILLING & CHAIRSIDE TERMINAL */}
        {currentTab === 'billing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-8 flex flex-col gap-5">
              <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-text-primary">
                      Billing & Invoicing Ledger
                    </h2>
                    <p className="text-xs text-text-secondary">
                      All claims, patient copays, and CDT procedure itemizations
                    </p>
                  </div>
                  <button
                    onClick={onGenerateInvoice}
                    className="h-9 px-3 rounded-lg bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    + Create Invoice
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border-divider/50">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-surface-container-low text-text-secondary font-semibold">
                        <th className="py-2.5 px-3">Invoice #</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Procedure</th>
                        <th className="py-2.5 px-3 text-right">Fee</th>
                        <th className="py-2.5 px-3 text-right">Ins. Paid</th>
                        <th className="py-2.5 px-3 text-right">Balance</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-divider/40">
                      {INITIAL_INVOICES.map((inv) => (
                        <tr key={inv.id} className="hover:bg-surface-container-low">
                          <td className="py-3 px-3 font-semibold text-primary">
                            {inv.id}
                          </td>
                          <td className="py-3 px-3 text-text-secondary">
                            {inv.date}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold block text-text-primary">
                              {inv.procedure}
                            </span>
                            <span className="text-[11px] text-text-secondary font-mono">
                              {inv.code} • Tooth {inv.tooth}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-medium">
                            ${inv.billed}.00
                          </td>
                          <td className="py-3 px-3 text-right text-emerald-700 font-semibold">
                            ${inv.paidIns}.00
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-danger">
                            ${inv.balance}.00
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                inv.status === 'Paid'
                                  ? 'bg-success-tint text-tertiary-container'
                                  : inv.status === 'Partial'
                                  ? 'bg-warning-tint text-warning'
                                  : 'bg-danger-tint text-danger'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Chairside Terminal on Right */}
            <div className="lg:col-span-4 bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-tint text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">
                      point_of_sale
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Chairside Payment Terminal
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-success-tint text-tertiary-container text-[11px] font-bold">
                  Ready
                </span>
              </div>

              <div className="bg-surface-container-low p-3.5 rounded-xl border border-border-divider/50">
                <span className="text-xs text-text-secondary font-medium">
                  Outstanding Patient Due
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-bold text-danger">$850.00</span>
                  <span className="text-xs text-text-secondary font-semibold">
                    1 invoice due
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => showToast(`Payment Terminal: Card transaction processed for $850.00`)}
                  className="w-full h-11 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    credit_card
                  </span>
                  <span>Charge Credit Card ($850.00)</span>
                </button>
                <button
                  onClick={() =>
                    showToast(`SMS & WhatsApp payment link dispatched to ${patient.phone}`)
                  }
                  className="w-full h-10 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-semibold flex items-center justify-center gap-2 border border-border-divider transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-tertiary-container">
                    chat
                  </span>
                  <span>Send SMS / WhatsApp Pay Link</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PRESCRIPTIONS (eRx) */}
        {currentTab === 'rx' && (
          <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  Clinical Prescriptions (eRx) History
                </h2>
                <p className="text-xs text-text-secondary">
                  Prescribed medications, dosage schedule, and allergy cross-checks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenDocModal('prescription')}
                  className="h-9 px-3.5 rounded-lg bg-surface hover:bg-primary-tint text-primary border border-primary/25 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="View and print official ℞ pad template"
                >
                  <span className="font-serif italic text-[16px] font-bold">℞</span>
                  <span>Preview ℞ Pad Template</span>
                </button>
                <button
                  onClick={onNewRx}
                  className="h-9 px-3.5 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>+ New Prescription</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {INITIAL_PRESCRIPTIONS.map((rx) => (
                <div
                  key={rx.id}
                  className="bg-surface-container-low p-4 rounded-xl border border-border-divider/60 flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-primary">
                        {rx.medicationName}
                      </span>
                      <span className="text-[10px] font-mono bg-surface px-1.5 py-0.5 rounded font-semibold text-primary">
                        {rx.quantity}
                      </span>
                    </div>
                    <span className="text-[11px] text-primary font-medium block mt-0.5">
                      {rx.dosage} • {rx.form}
                    </span>
                    <p className="text-xs text-text-secondary mt-1 leading-snug">
                      {rx.instructions}
                    </p>
                    <p className="text-[11px] text-emerald-800 font-medium mt-1">
                      Indication: {rx.indication}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border-divider/50 flex items-center justify-between text-[11px] text-text-secondary">
                    <span>{rx.datePrescribed}</span>
                    <span className="font-semibold text-primary">
                      {rx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: DOCUMENTS & X-RAYS TRIGGER */}
        {currentTab === 'xrays' && (
          <div className="bg-surface rounded-xl p-5 shadow-sm border border-border-card/60 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  Radiology & Diagnostic Imaging Studies
                </h2>
                <p className="text-xs text-text-secondary">
                  Panoramic OPG, Bitewings, PA Incisors, and 3D CBCT Scans
                </p>
              </div>
              <button
                onClick={onOpenRadiology}
                className="h-10 px-4 rounded-lg bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  radiology
                </span>
                <span>Launch Full DICOM Viewer</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={onOpenRadiology}
                className="rounded-xl overflow-hidden border border-border-card cursor-pointer group shadow-sm"
              >
                <img
                  src={PANORAMIC_OPG_IMAGE}
                  alt="OPG"
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-3 bg-surface">
                  <p className="text-xs font-bold text-text-primary">
                    Panoramic Full Arch OPG
                  </p>
                  <p className="text-[11px] text-text-secondary">Oct 24, 2024</p>
                </div>
              </div>

              <div
                onClick={onOpenRadiology}
                className="rounded-xl overflow-hidden border border-border-card cursor-pointer group shadow-sm"
              >
                <img
                  src={TOOTH_XRAY_PA}
                  alt="PA Tooth #26"
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-3 bg-surface">
                  <p className="text-xs font-bold text-text-primary">
                    Periapical PA View #26
                  </p>
                  <p className="text-[11px] text-text-secondary">Sep 28, 2025</p>
                </div>
              </div>

              <div
                onClick={onOpenRadiology}
                className="rounded-xl overflow-hidden border border-border-card cursor-pointer group shadow-sm"
              >
                <img
                  src={CBCT_3D_IMAGE}
                  alt="CBCT 3D"
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-3 bg-surface">
                  <p className="text-xs font-bold text-text-primary">
                    CBCT 3D Volumetric Scan
                  </p>
                  <p className="text-[11px] text-text-secondary">Mar 02, 2025</p>
                </div>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* In-app Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-neutral-700 animate-bounce">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">
            check_circle
          </span>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Official Prescription & Invoice Document Template Modal */}
      <DocumentTemplateModal
        isOpen={showDocModal}
        onClose={() => setShowDocModal(false)}
        initialType={docModalType}
        patient={patient}
        invoice={docModalInvoice}
      />
    </div>
  );
};
