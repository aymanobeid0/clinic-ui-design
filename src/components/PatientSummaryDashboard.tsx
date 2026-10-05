import React, { useState } from 'react';
import { Patient, PatientTabId } from '../types/dental';
import { INITIAL_APPOINTMENTS } from '../data/mockDentalData';

interface PatientSummaryDashboardProps {
  patient: Patient;
  onNavigateTab: (tab: PatientTabId) => void;
  onBookNextVisit: () => void;
  onGenerateInvoice: () => void;
}

export const PatientSummaryDashboard: React.FC<PatientSummaryDashboardProps> = ({
  patient,
  onNavigateTab,
  onBookNextVisit,
  onGenerateInvoice,
}) => {
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [quickPaymentSuccess, setQuickPaymentSuccess] = useState<string | null>(null);

  // 1. Calculate / Retrieve 'Last Visit' Quick Stat
  const lastVisit = React.useMemo(() => {
    const completedAppt = INITIAL_APPOINTMENTS.find(
      (a) => a.patientId === patient.id && a.status === 'Completed'
    );
    if (completedAppt) {
      return {
        date: 'Today, 09:00 AM',
        relativeTime: 'Earlier today',
        procedure: completedAppt.procedureName,
        code: completedAppt.procedureCode || 'CDT D0150',
        doctor: completedAppt.doctor,
        operatory: completedAppt.operatory,
        status: 'Completed',
        notes: completedAppt.alert || 'Crown margin clearance verified.',
      };
    }

    const historyMap: Record<string, any> = {
      'PT-2026-0842': {
        date: 'Sep 22, 2026',
        relativeTime: '13 days ago',
        procedure: 'Comprehensive Exam & Bitewings (4 Films)',
        code: 'CDT D0150 • D0274',
        doctor: 'Dr. Sarah Jenkins',
        operatory: 'Operatory 1',
        status: 'Completed',
        notes: 'Found deep occlusal caries on #16. Restorative treatment plan formulated.',
      },
      P6L272: {
        date: 'Sep 28, 2025',
        relativeTime: '7 days ago',
        procedure: 'Pulpectomy & Temporary Crown Cementation',
        code: 'CDT D3220 • FDI #26',
        doctor: 'Dr. Peter Deck, DDS',
        operatory: 'Operatory Suite A-1',
        status: 'Completed',
        notes: 'Canals cleansed with NaOCl. Temporary acrylic crown seated with TempBond.',
      },
      'PT-77631': {
        date: 'Aug 14, 2026',
        relativeTime: '52 days ago',
        procedure: 'Periodontal Debridement & Scaling',
        code: 'CDT D4341 • Quad 1 & 2',
        doctor: 'Dr. Sarah Jenkins',
        operatory: 'Operatory 2',
        status: 'Completed',
        notes: 'Pre-op BP monitored (138/88). Safe vasoconstrictor dosage limit adhered to.',
      },
      'PT-91204': {
        date: 'Oct 05, 2026',
        relativeTime: 'Today, 09:30 AM',
        procedure: 'Routine Scaling & Prophylaxis',
        code: 'CDT D1110 • Full Arch',
        doctor: 'Dr. Marc Alami',
        operatory: 'Hygiene Suite',
        status: 'Completed',
        notes: 'Mild cold sensitivity lower anterior. Desensitizing fluoride varnish applied.',
      },
      'PT-64119': {
        date: 'Jul 19, 2026',
        relativeTime: '78 days ago',
        procedure: 'Implant Site Assessment & 3D CBCT Scan',
        code: 'CDT D9310 • 3D Volumetric',
        doctor: 'Dr. Sarah Jenkins',
        operatory: 'Operatory 1',
        status: 'Completed',
        notes: 'HbA1c 6.8 verified. Adequate alveolar ridge bone density at #19 site.',
      },
      'PT-88402': {
        date: 'Sep 12, 2026',
        relativeTime: '23 days ago',
        procedure: 'Diagnostic Cast & Intraoral Digital Scan',
        code: 'CDT D0470 • 3Shape Scan',
        doctor: 'Dr. Sarah Jenkins',
        operatory: 'Operatory 2 (Chair 2)',
        status: 'Completed',
        notes: 'Inhaler kept chairside. Digital impression transferred to milling partner.',
      },
    };

    return (
      historyMap[patient.id] || {
        date: 'Sep 15, 2026',
        relativeTime: '20 days ago',
        procedure: 'Periodic Oral Evaluation & Polish',
        code: 'CDT D0120',
        doctor: patient.assignedDoctor,
        operatory: patient.operatoryRoom || 'Downtown Branch',
        status: 'Completed',
        notes: 'Soft tissues normal. Plaque index stable.',
      }
    );
  }, [patient.id, patient.assignedDoctor, patient.operatoryRoom]);

  // 2. Calculate / Retrieve 'Upcoming Procedure' Quick Stat
  const upcomingProcedure = React.useMemo(() => {
    const activeAppt = INITIAL_APPOINTMENTS.find(
      (a) =>
        a.patientId === patient.id &&
        (a.status === 'In Chair' || a.status === 'Confirmed' || a.status === 'Waiting Room')
    );

    if (activeAppt) {
      return {
        title: activeAppt.procedureName,
        code: activeAppt.procedureCode || 'CDT D2740',
        target: activeAppt.toothTarget || 'Active Chair',
        scheduledTime: activeAppt.timeSlot,
        operatory: activeAppt.operatory,
        doctor: activeAppt.doctor,
        status: activeAppt.status,
        durationMinutes: activeAppt.durationMinutes,
        copay: activeAppt.copay || 136,
      };
    }

    const procedureMap: Record<string, any> = {
      'PT-2026-0842': {
        title: 'Zirconia Crown Placement & Cementation',
        code: 'CDT D2740',
        target: 'Tooth FDI #14 (Upper Right 1st Premolar)',
        scheduledTime: 'Today, 14:00 PM',
        operatory: 'Operatory 1 (Chair 1)',
        doctor: 'Dr. Sarah Jenkins',
        status: 'In Chair',
        durationMinutes: 45,
        copay: 136,
      },
      P6L272: {
        title: 'Monolithic Zirconia Crown Try-In & Scan',
        code: 'CDT D2740',
        target: 'Tooth FDI #26 (Maxillary 1st Molar)',
        scheduledTime: 'Tomorrow, 09:00 AM',
        operatory: 'Suite A-1',
        doctor: 'Dr. Peter Deck, DDS',
        status: 'Confirmed',
        durationMinutes: 60,
        copay: 340,
      },
      'PT-77631': {
        title: 'Restorative Composite 3-Surface (MOD)',
        code: 'CDT D2393',
        target: 'Tooth FDI #15 (Upper Right 2nd Premolar)',
        scheduledTime: 'Today, 10:15 AM - 11:15 AM',
        operatory: 'Operatory 1',
        doctor: 'Dr. Sarah Jenkins',
        status: 'In Chair',
        durationMinutes: 60,
        copay: 76,
      },
      'PT-91204': {
        title: 'Clear Aligner Tracking & Interproximal Check',
        code: 'CDT D8090',
        target: 'Full Arch Aligner Tray #12',
        scheduledTime: 'Next Thursday, 11:30 AM',
        operatory: 'Hygiene Suite',
        doctor: 'Dr. Marc Alami',
        status: 'Confirmed',
        durationMinutes: 30,
        copay: 50,
      },
      'PT-64119': {
        title: 'Implant Fixture Placement (Stage 1)',
        code: 'CDT D6010',
        target: 'Tooth FDI #19 Site',
        scheduledTime: 'Oct 14, 2026 • 13:00 PM',
        operatory: 'Operatory 1',
        doctor: 'Dr. Sarah Jenkins',
        status: 'Confirmed',
        durationMinutes: 90,
        copay: 450,
      },
      'PT-88402': {
        title: 'Crown Preparation & Digital Scan',
        code: 'CDT D2740',
        target: 'Tooth FDI #26',
        scheduledTime: 'Today, 14:30 PM - 15:15 PM',
        operatory: 'Operatory 2 (Chair 2)',
        doctor: 'Dr. Sarah Jenkins',
        status: 'In Chair',
        durationMinutes: 45,
        copay: 180,
      },
    };

    return (
      procedureMap[patient.id] || {
        title: 'Comprehensive Oral Evaluation & Cleaning',
        code: 'CDT D0150',
        target: 'Full Arch',
        scheduledTime: 'Oct 22, 2026 • 10:00 AM',
        operatory: patient.operatoryRoom || 'Operatory 1',
        doctor: patient.assignedDoctor,
        status: 'Scheduled',
        durationMinutes: 45,
        copay: 45,
      }
    );
  }, [patient.id, patient.assignedDoctor, patient.operatoryRoom]);

  // 3. Calculate / Retrieve 'Outstanding Balance' Quick Stat
  const financialData = React.useMemo(() => {
    const financeMap: Record<string, any> = {
      'PT-2026-0842': {
        balance: 136.0,
        billedTotal: 680.0,
        insurancePaid: 544.0,
        patientPaid: 0.0,
        status: 'Due Upon Receipt',
        invoiceNumber: 'INV-2026-0841',
        coveragePct: 80,
        dueDays: 14,
        plan: 'Delta Dental Premier PPO',
      },
      P6L272: {
        balance: 340.0,
        billedTotal: 1850.0,
        insurancePaid: 1295.0,
        patientPaid: 215.0,
        status: 'Pre-Authorization Granted',
        invoiceNumber: 'INV-2026-0392',
        coveragePct: 70,
        dueDays: 30,
        plan: 'Delta Dental Premier',
      },
      'PT-77631': {
        balance: 280.0,
        billedTotal: 1120.0,
        insurancePaid: 840.0,
        patientPaid: 0.0,
        status: 'Insurance Pending',
        invoiceNumber: 'INV-2026-0771',
        coveragePct: 75,
        dueDays: 21,
        plan: 'MetLife Preferred PPO',
      },
      'PT-91204': {
        balance: 20.0,
        billedTotal: 185.0,
        insurancePaid: 148.0,
        patientPaid: 17.0,
        status: 'Copay Settled',
        invoiceNumber: 'INV-2026-0914',
        coveragePct: 80,
        dueDays: 0,
        plan: 'Guardian DentalGuard',
      },
      'PT-64119': {
        balance: 450.0,
        billedTotal: 2200.0,
        insurancePaid: 1320.0,
        patientPaid: 430.0,
        status: 'Statement Dispatched',
        invoiceNumber: 'INV-2026-0641',
        coveragePct: 60,
        dueDays: 15,
        plan: 'Cigna Dental Health',
      },
      'PT-88402': {
        balance: 180.0,
        billedTotal: 720.0,
        insurancePaid: 540.0,
        patientPaid: 0.0,
        status: 'Pre-auth Active',
        invoiceNumber: 'INV-2026-0884',
        coveragePct: 75,
        dueDays: 28,
        plan: 'Aetna Dental Direct PPO',
      },
    };

    return (
      financeMap[patient.id] || {
        balance: 65.0,
        billedTotal: 320.0,
        insurancePaid: 255.0,
        patientPaid: 0.0,
        status: 'Current',
        invoiceNumber: `INV-${patient.mrn}`,
        coveragePct: patient.primaryInsurance?.coveragePct || 70,
        dueDays: 30,
        plan: patient.primaryInsurance?.planName || 'Delta Dental PPO',
      }
    );
  }, [patient.id, patient.mrn, patient.primaryInsurance]);

  const handleCopyStatement = (invNumber: string) => {
    navigator.clipboard?.writeText(invNumber);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  const handleQuickCollect = () => {
    setQuickPaymentSuccess(`Payment receipt authorized for $${financialData.balance.toFixed(2)}.`);
    setTimeout(() => setQuickPaymentSuccess(null), 3500);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Toast Notification for Quick Payment */}
      {quickPaymentSuccess && (
        <div className="p-3 bg-success-tint border border-emerald-300 rounded-xl text-xs text-tertiary-container flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">
              check_circle
            </span>
            <span className="font-semibold">{quickPaymentSuccess}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-800">
            Audit ID: TX-2026-CHAIR2
          </span>
        </div>
      )}

      {/* Summary Dashboard Header Banner */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[19px]">
            dashboard
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Patient Clinical & Financial Summary
          </h2>
          <span className="text-xs text-text-secondary hidden sm:inline">
            • Real-time Chairside Biometrics & Account State
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-secondary text-[11px]">Primary Carrier:</span>
          <span className="px-2 py-0.5 rounded-md bg-surface border border-border-card text-primary font-semibold font-mono text-[11px]">
            {patient.primaryInsurance?.planName || 'Delta Dental PPO'} ({financialData.coveragePct}%)
          </span>
        </div>
      </div>

      {/* Triad Metric Cards: Last Visit | Upcoming Procedure | Outstanding Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* STAT 1: LAST VISIT */}
        <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-card/70 hover:border-primary/40 transition-all flex flex-col justify-between gap-3 group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  history
                </span>
              </div>
              <div>
                <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider block">
                  Last Clinical Visit
                </span>
                <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                  {lastVisit.date}
                </span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-surface-container text-text-secondary text-[10px] font-semibold font-mono">
              {lastVisit.relativeTime}
            </span>
          </div>

          {/* Procedure & Provider Details */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-border-divider/50 flex flex-col gap-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-primary truncate">
                {lastVisit.procedure}
              </span>
            </div>
            <div className="flex items-center justify-between text-text-secondary text-[11px]">
              <span className="font-mono text-primary font-bold">{lastVisit.code}</span>
              <span>{lastVisit.operatory}</span>
            </div>
            <p className="text-[11px] text-text-secondary italic line-clamp-1 border-t border-border-divider/40 pt-1">
              "{lastVisit.notes}"
            </p>
          </div>

          {/* Card Footer / Action */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-1.5 text-text-secondary text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Seen by {lastVisit.doctor}</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('overview')}
              className="text-primary hover:underline font-semibold text-xs flex items-center gap-0.5 cursor-pointer"
            >
              <span>SOAP Note</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* STAT 2: UPCOMING PROCEDURE */}
        <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-card/70 hover:border-primary/40 transition-all flex flex-col justify-between gap-3 group relative overflow-hidden">
          {upcomingProcedure.status === 'In Chair' && (
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-primary to-primary-container" />
          )}

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  event_upcoming
                </span>
              </div>
              <div>
                <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider block">
                  Upcoming Procedure
                </span>
                <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                  {upcomingProcedure.scheduledTime}
                </span>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                upcomingProcedure.status === 'In Chair'
                  ? 'bg-success-tint text-tertiary-container border border-emerald-300'
                  : 'bg-primary-tint text-primary'
              }`}
            >
              {upcomingProcedure.status === 'In Chair' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              )}
              {upcomingProcedure.status}
            </span>
          </div>

          {/* Procedure details */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-border-divider/50 flex flex-col gap-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-primary truncate">
                {upcomingProcedure.title}
              </span>
            </div>
            <div className="flex items-center justify-between text-text-secondary text-[11px]">
              <span className="font-mono text-primary font-bold">
                {upcomingProcedure.code}
              </span>
              <span className="font-medium text-text-primary">
                {upcomingProcedure.target}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-text-secondary border-t border-border-divider/40 pt-1">
              <span>{upcomingProcedure.operatory}</span>
              <span className="font-mono font-medium">Est: {upcomingProcedure.durationMinutes}</span>
            </div>
          </div>

          {/* Card Footer / Action */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              type="button"
              onClick={onBookNextVisit}
              className="text-text-secondary hover:text-text-primary text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">calendar_month</span>
              <span>Reschedule</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('treatments')}
              className="text-primary hover:underline font-semibold text-xs flex items-center gap-0.5 cursor-pointer"
            >
              <span>Treatment Plan</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* STAT 3: OUTSTANDING BALANCE */}
        <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-card/70 hover:border-primary/40 transition-all flex flex-col justify-between gap-3 group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  financialData.balance > 0
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300'
                    : 'bg-success-tint text-tertiary-container'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  account_balance_wallet
                </span>
              </div>
              <div>
                <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider block">
                  Outstanding Balance
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`text-xl font-bold font-mono ${
                      financialData.balance > 0 ? 'text-amber-800 dark:text-amber-400' : 'text-emerald-700'
                    }`}
                  >
                    ${financialData.balance.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-text-secondary">
                    of ${financialData.billedTotal.toFixed(2)} billed
                  </span>
                </div>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                financialData.balance > 0
                  ? 'bg-warning-tint text-warning border border-amber-300'
                  : 'bg-success-tint text-tertiary-container'
              }`}
            >
              {financialData.status}
            </span>
          </div>

          {/* Breakdown: Insurance Paid vs Patient Portion */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-border-divider/50 flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-text-secondary">Insurance Covered:</span>
              <span className="font-mono font-bold text-emerald-700">
                ${financialData.insurancePaid.toFixed(2)} ({financialData.coveragePct}%)
              </span>
            </div>

            {/* Progress visual bar */}
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden flex">
              <div
                style={{ width: `${financialData.coveragePct}%` }}
                className="bg-emerald-600 h-full"
                title={`Insurance Covered: ${financialData.coveragePct}%`}
              />
              <div
                style={{ width: `${100 - financialData.coveragePct}%` }}
                className="bg-amber-500 h-full"
                title={`Patient Copay Portion: ${100 - financialData.coveragePct}%`}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-text-secondary font-mono">
              <span className="flex items-center gap-1">
                <span>Inv #{financialData.invoiceNumber}</span>
                <button
                  type="button"
                  onClick={() => handleCopyStatement(financialData.invoiceNumber)}
                  className="hover:text-primary cursor-pointer"
                  title="Copy Invoice ID"
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {copiedInvoice ? 'check' : 'content_copy'}
                  </span>
                </button>
              </span>
              <span>{financialData.dueDays > 0 ? `Net ${financialData.dueDays} Days` : 'Settled'}</span>
            </div>
          </div>

          {/* Card Footer / Action */}
          <div className="flex items-center justify-between pt-1 text-xs">
            {financialData.balance > 0 ? (
              <button
                type="button"
                onClick={handleQuickCollect}
                className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">credit_card</span>
                <span>Collect ${financialData.balance.toFixed(0)}</span>
              </button>
            ) : (
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>Account in Good Standing</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => onNavigateTab('billing')}
              className="text-primary hover:underline font-semibold text-xs flex items-center gap-0.5 cursor-pointer ml-auto"
            >
              <span>Ledger & Invoices</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
