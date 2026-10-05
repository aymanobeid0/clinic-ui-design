import React, { useState } from 'react';
import { InvoiceItem, PrescriptionItem } from '../types/dental';
import {
  INITIAL_INVOICES,
  INITIAL_PRESCRIPTIONS,
} from '../data/mockDentalData';
import { DocumentTemplateModal } from './DocumentTemplateModal';

interface PrescriptionsInvoicesScreenProps {
  onNewRx: () => void;
  onCreateInvoice: () => void;
  onOpenPatientFile: (patientId: string) => void;
}

export const PrescriptionsInvoicesScreen: React.FC<
  PrescriptionsInvoicesScreenProps
> = ({ onNewRx, onCreateInvoice, onOpenPatientFile }) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'prescriptions'>('invoices');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Paid' | 'Partial' | 'Overdue'>('all');
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem>(INITIAL_INVOICES[0]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(INITIAL_PRESCRIPTIONS);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Template Modal State
  const [showDocModal, setShowDocModal] = useState(false);
  const [docModalType, setDocModalType] = useState<'prescription' | 'invoice'>('prescription');
  const [modalInvoice, setModalInvoice] = useState<InvoiceItem | undefined>(undefined);

  const openTemplateModal = (type: 'prescription' | 'invoice', inv?: InvoiceItem) => {
    setDocModalType(type);
    setModalInvoice(inv || selectedInvoice);
    setShowDocModal(true);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter === 'all') return true;
    return inv.status === statusFilter;
  });

  const showToast = (message: string) => {
    setActionFeedback(message);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handlePrintRx = () => {
    showToast('Sent A5 / A4 Print Command to Operatory Laser Printer #1');
    window.print();
  };

  const handleSendWhatsAppRx = () => {
    showToast('Verified e-Prescription PDF sent via WhatsApp to Robert Chen (+1 555-234-8901)');
  };

  const handleDuplicateRx = () => {
    const copy: PrescriptionItem = {
      ...prescriptions[0],
      id: `rx-${Date.now()}`,
      datePrescribed: 'Today',
      status: 'Active',
    };
    setPrescriptions((prev) => [copy, ...prev]);
    showToast('Prescription duplicated into current queue as pending refill draft.');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Invoice ID,Date,Procedure,Fee,Paid,Balance,Status\n' +
      invoices
        .map(
          (i) =>
            `${i.id},${i.date},"${i.procedure}",$${i.billed},$${i.paidIns + i.paidPt},$${i.balance},${i.status}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'DentalCare_Invoices_Ledger.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported billing ledger to CSV.');
  };

  return (
    <div className="w-full pb-16">
      <div className="w-full max-w-[1380px] mx-auto px-4 lg:px-6 py-5 flex flex-col gap-5">
        {/* Toast Feedback */}
        {actionFeedback && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-bounce border border-neutral-700">
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">
              check_circle
            </span>
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-text-secondary text-xs">
              <span className="uppercase tracking-wider text-secondary font-bold">
                Billing & Clinical Dispensary
              </span>
              <span>•</span>
              <span className="text-primary font-semibold">Operatory 1-6</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Clinical Prescriptions & Patient Invoicing
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Switcher Tabs */}
            <div className="bg-surface-container-low p-1 rounded-lg flex items-center shadow-sm border border-border-divider/50">
              <button
                onClick={() => setActiveTab('invoices')}
                className={`px-3.5 h-9 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'invoices'
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-text-secondary hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  receipt_long
                </span>
                <span>Invoices & Billing</span>
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`px-3.5 h-9 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'prescriptions'
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-text-secondary hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  medication
                </span>
                <span>Prescriptions (Rx)</span>
              </button>
            </div>

            {/* Date Range Filter */}
            <div className="h-10 px-3 bg-surface rounded-lg shadow-sm flex items-center gap-2 text-on-surface text-xs font-medium border border-border-divider">
              <span className="material-symbols-outlined text-outline text-[16px]">
                calendar_today
              </span>
              <span>Oct 01, 2026 – Oct 31, 2026</span>
              <span className="material-symbols-outlined text-outline text-[15px]">
                arrow_drop_down
              </span>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as 'all' | 'Paid' | 'Partial' | 'Overdue')
                }
                className="h-10 pl-3 pr-8 bg-surface rounded-lg shadow-sm text-on-surface text-xs font-medium appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary border border-border-divider"
              >
                <option value="all">Status: All Records</option>
                <option value="Paid">Paid in Full</option>
                <option value="Partial">Pending Partial</option>
                <option value="Overdue">Overdue / Arrears</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline text-[17px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => openTemplateModal('prescription')}
                className="h-10 px-3.5 rounded-lg bg-surface text-primary border border-primary/25 hover:bg-primary-tint/60 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Open Official Prescription Pad Template"
              >
                <span className="font-serif italic text-[15px] font-bold">℞</span>
                <span>Rx Template</span>
              </button>

              <button
                onClick={() => openTemplateModal('invoice')}
                className="h-10 px-3.5 rounded-lg bg-surface text-primary border border-primary/25 hover:bg-primary-tint/60 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Open Official Walkout Invoice Template"
              >
                <span className="material-symbols-outlined text-[17px]">
                  receipt_long
                </span>
                <span>Invoice Template</span>
              </button>

              <button
                onClick={onNewRx}
                className="h-10 px-3.5 rounded-lg bg-surface text-text-primary text-xs font-semibold hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-1.5 border border-border-divider cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px] text-primary">
                  add
                </span>
                <span>New Rx</span>
              </button>
              <button
                onClick={onCreateInvoice}
                className="h-10 px-3.5 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">
                  receipt
                </span>
                <span>Create Invoice</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Summary Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary font-medium">
                Total Invoiced (This Month)
              </span>
              <span className="w-8 h-8 rounded-lg bg-primary-tint text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">
                  payments
                </span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-text-primary tracking-tight">
                $24,850
              </span>
              <span className="inline-flex items-center text-emerald-700 text-xs font-semibold">
                <span className="material-symbols-outlined text-[15px]">
                  trending_up
                </span>
                +12.4%
              </span>
            </div>
            <div className="mt-2 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full rounded-full w-[78%]" />
            </div>
          </div>

          <div className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary font-medium">
                Collected Revenue
              </span>
              <span className="w-8 h-8 rounded-lg bg-success-tint text-emerald-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">
                  check_circle
                </span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-text-primary tracking-tight">
                $21,100
              </span>
              <span className="px-2 py-0.5 rounded-full bg-success-tint text-emerald-800 text-xs font-semibold">
                85% cleared
              </span>
            </div>
            <div className="mt-2 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full w-[85%]" />
            </div>
          </div>

          <div className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary font-medium">
                Pending Balances
              </span>
              <span className="w-8 h-8 rounded-lg bg-warning-tint text-warning flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">
                  pending_actions
                </span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-text-primary tracking-tight">
                $3,750
              </span>
              <span className="text-warning text-xs font-semibold">
                5 outstanding
              </span>
            </div>
            <div className="mt-2 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full w-[28%]" />
            </div>
          </div>

          <div className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary font-medium">
                Active Prescriptions Issued
              </span>
              <span className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">
                  medical_services
                </span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-text-primary tracking-tight">
                42 <span className="text-sm font-normal text-text-secondary">Rx</span>
              </span>
              <span className="text-secondary text-xs font-medium">
                Active 7d
              </span>
            </div>
            <div className="mt-2 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full w-[92%]" />
            </div>
          </div>
        </div>

        {/* Main Content Dual-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Panel: Invoice Registry (8 cols) */}
          <section className="lg:col-span-8 flex flex-col gap-4 bg-surface rounded-xl p-5 shadow-sm border border-border-card/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-6 bg-primary rounded-full" />
                <div>
                  <h2 className="text-lg font-bold text-text-primary tracking-tight">
                    Financial & Treatment Invoices
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Real-time chairside dental procedures and billing ledger
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="h-9 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-border-divider cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    file_download
                  </span>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto w-full rounded-lg border border-border-divider/50">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-text-secondary uppercase tracking-wider font-semibold border-b border-border-divider/50">
                    <th className="py-3 px-3">Invoice ID</th>
                    <th className="py-3 px-3">Patient</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Dental Procedures</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-3 text-right">Paid</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-on-surface divide-y divide-border-divider/40">
                  {filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className={`cursor-pointer transition-colors ${
                        selectedInvoice.id === inv.id
                          ? 'bg-primary-tint/50'
                          : 'hover:bg-surface-container-low/60'
                      }`}
                    >
                      <td className="py-3.5 px-3 font-semibold text-primary whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {selectedInvoice.id === inv.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                          <span>{inv.id}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary text-[11px] flex items-center justify-center font-bold">
                            RC
                          </div>
                          <div>
                            <div className="font-semibold text-text-primary leading-tight">
                              Robert Chen
                            </div>
                            <div className="text-[10px] text-text-secondary">
                              MRN #D-88204
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-text-secondary whitespace-nowrap">
                        {inv.date}
                      </td>

                      <td className="py-3.5 px-3 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono text-[10px] font-bold">
                            {inv.tooth || '#26'}
                          </span>
                          <span className="truncate font-medium text-text-primary">
                            {inv.procedure}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right font-bold text-text-primary whitespace-nowrap">
                        ${inv.billed}.00
                      </td>

                      <td className="py-3.5 px-3 text-right text-emerald-800 font-semibold whitespace-nowrap">
                        ${inv.paidIns + inv.paidPt}.00
                      </td>

                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            inv.status === 'Paid'
                              ? 'bg-success-tint text-tertiary-container'
                              : inv.status === 'Partial'
                              ? 'bg-warning-tint text-warning'
                              : 'bg-danger-tint text-danger'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              inv.status === 'Paid'
                                ? 'bg-emerald-600'
                                : inv.status === 'Partial'
                                ? 'bg-amber-500'
                                : 'bg-danger'
                            }`}
                          />
                          {inv.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openTemplateModal('invoice', inv);
                            }}
                            className="h-7 px-2 rounded-lg bg-primary-tint hover:bg-primary-fixed text-primary text-[11px] font-bold flex items-center gap-1 shadow-2xs border border-primary/20 cursor-pointer"
                            title="Preview Official Statement"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              receipt_long
                            </span>
                            <span>Template</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenPatientFile('PT-2026-0842');
                            }}
                            className="h-7 w-7 rounded-lg bg-surface hover:bg-surface-container flex items-center justify-center text-primary shadow-xs border border-border-divider cursor-pointer"
                            title="View Patient Chart"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              visibility
                            </span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.print();
                            }}
                            className="h-7 w-7 rounded-lg bg-surface hover:bg-surface-container flex items-center justify-center text-text-secondary shadow-xs border border-border-divider cursor-pointer"
                            title="Print Invoice Receipt"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              print
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-text-secondary text-xs">
              <div>
                Showing{' '}
                <span className="font-semibold text-text-primary">
                  1 to {filteredInvoices.length}
                </span>{' '}
                of 48 records
              </div>
              <div className="flex items-center gap-1">
                <button
                  disabled
                  className="h-7 px-2.5 rounded-lg bg-surface-container-low text-text-secondary opacity-50 cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-2 font-bold text-primary">1</span>
                <button className="h-7 w-7 rounded-lg hover:bg-surface-container text-on-surface">
                  2
                </button>
                <button className="h-7 w-7 rounded-lg hover:bg-surface-container text-on-surface">
                  3
                </button>
                <button className="h-7 px-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface">
                  Next
                </button>
              </div>
            </div>

            {/* Active Chair Assignment Context Banner */}
            <div className="mt-2 p-3.5 rounded-xl bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-3 border border-border-divider/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shadow-xs text-primary border border-border-card">
                  <span className="material-symbols-outlined text-[24px]">
                    dentistry
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-text-primary">
                    Active Chair Assignment: Operatory 3
                  </div>
                  <p className="text-xs text-text-secondary">
                    Patient Robert Chen is linked with treatment plan #TP-2026-89 • Next recall: 6 Months
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-center">
                <span className="px-3 py-1 rounded-lg bg-surface text-primary text-xs font-bold shadow-2xs border border-border-card flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">
                    verified
                  </span>{' '}
                  Pre-Auth Approved
                </span>
              </div>
            </div>
          </section>

          {/* Right Panel: Simulated A5 / A4 Physical Prescription Pad Preview (4 cols) */}
          <section className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-surface rounded-xl p-3 shadow-sm border border-border-card/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[19px]">
                  print
                </span>
                <span className="text-xs font-bold text-text-primary">
                  Document Preview
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary-tint text-primary text-[11px] font-bold">
                A5 Standard
              </span>
            </div>

            {/* Simulated Paper Prescription Pad Sheet */}
            <div className="bg-surface rounded-2xl p-5 shadow-md border border-border-card relative flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary-container" />

              {/* Sheet Header */}
              <div className="flex items-start justify-between pb-3 border-b border-border-divider/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-primary-tint flex items-center justify-center text-primary shadow-xs">
                    <span className="material-symbols-outlined text-[22px]">
                      dentistry
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-primary tracking-tight">
                      DENTALCARE CLINIC
                    </span>
                    <span className="text-[10px] text-text-secondary leading-tight">
                      Downtown Surgery Center • Suite 402
                    </span>
                    <span className="text-[10px] text-text-secondary leading-tight">
                      Licence #DEN-99421 • DEA #BX981244
                    </span>
                  </div>
                </div>
                <span className="text-2xl font-serif italic text-primary-container font-bold">
                  ℞
                </span>
              </div>

              {/* Doctor & Patient Block */}
              <div className="mt-3 p-2.5 rounded-lg bg-surface-container-low flex flex-col gap-1 text-xs border border-border-divider/50">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-text-secondary">
                    Prescribing Practitioner:
                  </span>
                  <span className="font-bold text-primary">
                    Dr. Sarah Jenkins, DMD
                  </span>
                </div>
                <div className="h-px bg-surface-container-high my-0.5" />
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-text-secondary block">
                      Patient Name:
                    </span>
                    <span className="font-bold text-text-primary">
                      Robert Chen
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-text-secondary block">
                      Date / Age / Sex:
                    </span>
                    <span className="font-bold text-text-primary">
                      Oct 05, 2026 • 42y • M
                    </span>
                  </div>
                </div>
              </div>

              {/* Critical Medical Warning */}
              <div className="mt-2.5 p-2 rounded-lg bg-danger-tint border border-danger/20 flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-danger text-[18px]">
                  warning
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-danger uppercase tracking-wider">
                    Critical Allergy Alert
                  </span>
                  <span className="text-[11px] text-danger font-medium leading-tight">
                    PATIENT HAS SEVERE PENICILLIN ALLERGY (ANAPHYLAXIS RISK)
                  </span>
                </div>
              </div>

              {/* Prescribed Items */}
              <div className="mt-3.5 flex flex-col gap-2">
                <div className="text-[11px] uppercase tracking-wider text-text-secondary font-bold">
                  Prescribed Items:
                </div>

                {/* 1. Clindamycin */}
                <div className="p-2 rounded-lg bg-surface-container-lowest border border-border-divider/60 shadow-2xs flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">
                      1. Clindamycin 300mg Capsules
                    </span>
                    <span className="text-[10px] font-mono bg-surface-container px-1.5 py-0.2 rounded font-bold text-text-primary">
                      Qty: #21
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-snug">
                    Take 1 capsule orally every 8 hours for 7 days. Take with a
                    full glass of water.
                  </p>
                  <span className="text-[10px] text-primary font-medium">
                    Indication: Pre/Post-Op Crown Prep Prophylaxis (Penicillin Sub)
                  </span>
                </div>

                {/* 2. Ibuprofen */}
                <div className="p-2 rounded-lg bg-surface-container-lowest border border-border-divider/60 shadow-2xs flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">
                      2. Ibuprofen 600mg Tablets
                    </span>
                    <span className="text-[10px] font-mono bg-surface-container px-1.5 py-0.2 rounded font-bold text-text-primary">
                      Qty: #16
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-snug">
                    Take 1 tablet every 6 hours PRN for post-procedure
                    discomfort and swelling.
                  </p>
                  <span className="text-[10px] text-text-secondary">
                    Note: Do not exceed 2400mg in 24 hours. Take after meals.
                  </span>
                </div>

                {/* 3. Chlorhexidine */}
                <div className="p-2 rounded-lg bg-surface-container-lowest border border-border-divider/60 shadow-2xs flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">
                      3. Chlorhexidine 0.12% Oral Rinse
                    </span>
                    <span className="text-[10px] font-mono bg-surface-container px-1.5 py-0.2 rounded font-bold text-text-primary">
                      Qty: 1 Bottle
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-snug">
                    Swish 15ml (1 tbsp) in mouth for 30 seconds twice daily
                    after brushing for 10 days. Do not swallow.
                  </p>
                </div>
              </div>

              {/* Signature & Clinic Seal */}
              <div className="mt-4 pt-3 border-t border-border-divider/60 flex items-end justify-between">
                <div className="flex flex-col gap-1">
                  <div className="font-serif italic text-primary text-base font-bold">
                    Dr. Sarah Jenkins DMD
                  </div>
                  <div className="h-px w-28 bg-on-surface/40" />
                  <span className="text-[10px] text-text-secondary font-mono">
                    Signed Electronically (e-Rx 2.0)
                  </span>
                </div>

                <div className="w-14 h-14 rounded-full bg-primary-tint/70 text-primary flex flex-col items-center justify-center p-1 text-center border border-primary/20">
                  <span className="material-symbols-outlined text-[16px]">
                    verified
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-tight">
                    OFFICIAL RX
                  </span>
                  <span className="text-[7px] text-text-secondary">SEAL</span>
                </div>
              </div>

              {/* Actions on Bottom of Sheet */}
              <div className="mt-4 pt-2 border-t border-border-divider/50 flex flex-col gap-2">
                <button
                  onClick={() => openTemplateModal('prescription')}
                  className="w-full h-10 rounded-lg bg-surface hover:bg-primary-tint text-primary border border-primary/25 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  title="Open Fullscreen Official Prescription Pad Template"
                >
                  <span className="font-serif italic text-[16px] font-bold">℞</span>
                  <span>View Official ℞ Template Pad</span>
                </button>

                <button
                  onClick={handlePrintRx}
                  className="w-full h-10 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    print
                  </span>
                  <span>Print Rx (A5 / A4)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleSendWhatsAppRx}
                    className="h-9 rounded-lg bg-surface hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center gap-1 border border-border-divider transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px] text-emerald-600">
                      chat
                    </span>
                    <span>Send WhatsApp</span>
                  </button>
                  <button
                    onClick={handleDuplicateRx}
                    className="h-9 rounded-lg bg-surface hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center gap-1 border border-border-divider transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px] text-secondary">
                      content_copy
                    </span>
                    <span>Duplicate Rx</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Official Prescription and Invoice Template Modal */}
      <DocumentTemplateModal
        isOpen={showDocModal}
        onClose={() => setShowDocModal(false)}
        initialType={docModalType}
        invoice={modalInvoice}
        prescriptions={prescriptions}
      />
    </div>
  );
};
