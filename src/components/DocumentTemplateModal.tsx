import React, { useState, useEffect } from 'react';
import { Patient, InvoiceItem, PrescriptionItem } from '../types/dental';
import { INITIAL_PATIENTS } from '../data/mockDentalData';
import { PrescriptionTemplate } from './PrescriptionTemplate';
import { InvoiceTemplate } from './InvoiceTemplate';

interface DocumentTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'prescription' | 'invoice';
  patient?: Patient;
  invoice?: InvoiceItem;
  prescriptions?: PrescriptionItem[];
}

export const DocumentTemplateModal: React.FC<DocumentTemplateModalProps> = ({
  isOpen,
  onClose,
  initialType = 'prescription',
  patient,
  invoice,
  prescriptions,
}) => {
  const [docType, setDocType] = useState<'prescription' | 'invoice'>(initialType);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patient?.id || INITIAL_PATIENTS[0].id
  );
  const [docTheme, setDocTheme] = useState<'clinical' | 'classic' | 'monochrome'>('clinical');
  const [variant, setVariant] = useState<'full' | 'compact'>('full');
  const [showWatermark, setShowWatermark] = useState(true);
  const [showPaidStamp, setShowPaidStamp] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    if (initialType) {
      setDocType(initialType);
    }
  }, [initialType]);

  useEffect(() => {
    if (patient?.id) {
      setSelectedPatientId(patient.id);
    }
  }, [patient?.id]);

  if (!isOpen) return null;

  const currentPatient =
    INITIAL_PATIENTS.find((p) => p.id === selectedPatientId) ||
    patient ||
    INITIAL_PATIENTS[0];

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3200);
  };

  const handlePrint = () => {
    triggerToast(
      `Sending ${docType === 'prescription' ? 'A5/A4 ℞ Prescription' : 'Dental Statement Invoice'} to printer...`
    );
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleDownloadPDF = () => {
    // Generate text/html representation and download
    const docTitle =
      docType === 'prescription'
        ? `Prescription_${currentPatient.name.replace(/\s+/g, '_')}_Rx.html`
        : `Dental_Invoice_${currentPatient.name.replace(/\s+/g, '_')}_${invoice?.id || 'INV-0841'}.html`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${docType === 'prescription' ? 'Dental Prescription' : 'Dental Statement'}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; }
          .header { border-bottom: 2px solid #001868; padding-bottom: 12px; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #001868; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
          th { background: #f4f6fc; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">DentalCare Surgical Center</div>
          <p>Operatory 1-6 • 402 Medical Plaza • Phone: (555) 234-8900</p>
        </div>
        <h2>${docType === 'prescription' ? 'OFFICIAL e-PRESCRIPTION' : 'STATEMENT / WALKOUT INVOICE'}</h2>
        <p><strong>Patient:</strong> ${currentPatient.name} (MRN: ${currentPatient.mrn}, DOB: ${currentPatient.dob})</p>
        <p><strong>Prescribing Doctor:</strong> Dr. Sarah Jenkins, DMD (DEA: BX-9812441)</p>
        <p><strong>Date:</strong> Oct 05, 2026</p>
        <hr/>
        <p><em>Generated from DentalCare PMS. Compliant with electronic record standards.</em></p>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', docTitle);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast(`Downloaded printable document for ${currentPatient.name}`);
  };

  const handleSendWhatsApp = () => {
    triggerToast(
      `Dispatched encrypted link for ${docType === 'prescription' ? 'e-Rx' : 'Invoice Statement'} to ${currentPatient.name} via WhatsApp (${currentPatient.phone})`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      {/* Toast inside modal */}
      {feedbackToast && (
        <div className="fixed top-5 right-5 z-60 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs border border-neutral-700 animate-bounce">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">
            check_circle
          </span>
          <span>{feedbackToast}</span>
        </div>
      )}

      <div className="relative w-full max-w-5xl max-h-[95vh] bg-surface rounded-2xl shadow-2xl border border-border-card flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="no-print px-5 py-3.5 border-b border-border-divider flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Template Switcher */}
            <div className="inline-flex bg-surface-container-low p-1 rounded-xl border border-border-card text-xs">
              <button
                type="button"
                onClick={() => setDocType('prescription')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  docType === 'prescription'
                    ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="font-serif italic text-[15px] font-bold">℞</span>
                <span>Prescription Template</span>
              </button>

              <button
                type="button"
                onClick={() => setDocType('invoice')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  docType === 'invoice'
                    ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                <span>Invoice Template</span>
              </button>
            </div>

            {/* Patient Switcher */}
            <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1 rounded-xl border border-border-card">
              <span className="text-[11px] text-text-secondary font-medium hidden sm:inline">Patient:</span>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-text-primary cursor-pointer focus:outline-none"
              >
                {INITIAL_PATIENTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.dob})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden md:flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-lg border border-border-card text-xs">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(65, z - 10))}
                className="w-6 h-6 rounded hover:bg-surface flex items-center justify-center text-text-secondary cursor-pointer"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[15px]">remove</span>
              </button>
              <span className="font-mono text-[11px] font-bold text-text-primary w-9 text-center">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(125, z + 10))}
                className="w-6 h-6 rounded hover:bg-surface flex items-center justify-center text-text-secondary cursor-pointer"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="h-8.5 px-3 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Print standard A4 / A5 sheet"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="h-8.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-semibold flex items-center gap-1.5 border border-border-card transition-colors cursor-pointer"
              title="Download Printable File"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="h-8.5 px-3 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] text-xs font-semibold flex items-center gap-1.5 border border-[#25D366]/30 transition-colors cursor-pointer"
              title="Send to patient WhatsApp"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-8.5 w-8.5 rounded-lg hover:bg-surface-container-high text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors cursor-pointer ml-1"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Secondary Customization Bar */}
        <div className="no-print px-5 py-2 bg-surface-container-low border-b border-border-divider flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            {/* Design Style */}
            <div className="flex items-center gap-1.5">
              <span className="text-text-secondary font-medium">Style:</span>
              <div className="flex items-center gap-1">
                {(['clinical', 'classic', 'monochrome'] as const).map((thm) => (
                  <button
                    key={thm}
                    type="button"
                    onClick={() => setDocTheme(thm)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      docTheme === thm
                        ? 'bg-surface text-primary shadow-2xs font-bold border border-border-card'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {thm === 'clinical' ? 'Clinical Blue' : thm === 'classic' ? 'Parchment' : 'Monochrome'}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Variant */}
            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-border-card">
              <span className="text-text-secondary font-medium">Sheet Size:</span>
              <button
                type="button"
                onClick={() => setVariant('full')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  variant === 'full'
                    ? 'bg-surface text-primary shadow-2xs font-bold border border-border-card'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                A4 / Pad
              </button>
              <button
                type="button"
                onClick={() => setVariant('compact')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  variant === 'compact'
                    ? 'bg-surface text-primary shadow-2xs font-bold border border-border-card'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                A5 / Slip
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {docType === 'prescription' ? (
              <label className="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary select-none">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                />
                <span className="text-[11px] font-medium">Official Security Watermark</span>
              </label>
            ) : (
              <label className="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary select-none">
                <input
                  type="checkbox"
                  checked={showPaidStamp}
                  onChange={(e) => setShowPaidStamp(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                />
                <span className="text-[11px] font-medium">Rubber 'PAID IN FULL' Stamp</span>
              </label>
            )}
          </div>
        </div>

        {/* Scrollable Document Canvas Viewport */}
        <div className="printable-document-container flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-200/70 flex items-start justify-center">
          <div
            style={{
              transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
            }}
            className="w-full flex justify-center"
          >
            {docType === 'prescription' ? (
              <PrescriptionTemplate
                patient={currentPatient}
                prescriptions={prescriptions}
                variant={variant}
                theme={docTheme}
                showWatermark={showWatermark}
              />
            ) : (
              <InvoiceTemplate
                patient={currentPatient}
                invoice={invoice}
                variant={variant}
                theme={docTheme}
                showPaidStamp={showPaidStamp}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
