import React from 'react';
import { Patient, PrescriptionItem } from '../types/dental';
import { CLINIC_LOGO_URL } from '../data/mockDentalData';

interface PrescriptionTemplateProps {
  patient?: Patient;
  prescriptions?: PrescriptionItem[];
  variant?: 'compact' | 'full';
  theme?: 'clinical' | 'classic' | 'monochrome';
  showWatermark?: boolean;
}

export const PrescriptionTemplate: React.FC<PrescriptionTemplateProps> = ({
  patient,
  prescriptions,
  variant = 'full',
  theme = 'clinical',
  showWatermark = true,
}) => {
  // Fallback default patient (Robert Chen)
  const currentPatient = patient || {
    id: 'PT-2026-0842',
    mrn: 'PT-2026-0842',
    name: 'Robert Chen',
    dob: '08.14.1984',
    age: 42,
    gender: 'Male',
    phone: '+1 (555) 234-8901',
    email: 'robert.chen@email.com',
    operatoryRoom: 'Operatory 1 (Chair 1)',
    assignedDoctor: 'Dr. Sarah Jenkins, DMD',
    medicalAlerts: [
      {
        type: 'critical' as const,
        title: 'Severe Penicillin Allergy (Anaphylaxis Risk)',
        description: 'Do not prescribe beta-lactam antibiotics. Recommend Clindamycin or Azithromycin.',
      },
    ],
  };

  // Fallback default prescription items
  const items: PrescriptionItem[] = prescriptions && prescriptions.length > 0
    ? prescriptions
    : [
        {
          id: 'rx-1',
          medicationName: 'Clindamycin HCl 300mg',
          dosage: '300mg',
          form: 'Oral Capsule',
          quantity: '#21 (Twenty-One)',
          instructions: 'Take 1 capsule by mouth every 8 hours with a full glass of water for 7 consecutive days.',
          indication: 'Pre/Post-Operative Prophylaxis for Tooth #14 Crown Prep (Beta-lactam Substitute)',
          datePrescribed: 'Oct 05, 2026',
          doctorName: 'Dr. Sarah Jenkins, DMD',
          refillsRemaining: 0,
          status: 'Active',
        },
        {
          id: 'rx-2',
          medicationName: 'Ibuprofen 600mg',
          dosage: '600mg',
          form: 'Film-Coated Tablet',
          quantity: '#16 (Sixteen)',
          instructions: 'Take 1 tablet every 6 to 8 hours as needed for moderate operatory pain and tissue edema. Take with food.',
          indication: 'Analgesic & Anti-inflammatory Management',
          datePrescribed: 'Oct 05, 2026',
          doctorName: 'Dr. Sarah Jenkins, DMD',
          refillsRemaining: 1,
          status: 'Active',
        },
        {
          id: 'rx-3',
          medicationName: 'Chlorhexidine Gluconate 0.12%',
          dosage: '0.12%',
          form: 'Oral Rinse Solution',
          quantity: '1 Bottle (473 mL)',
          instructions: 'Swish 15 mL (1 tablespoon) in mouth for 30 seconds twice daily after morning and evening brushing. Do not swallow.',
          indication: 'Gingival Antimicrobial Sulcular Irrigation',
          datePrescribed: 'Oct 05, 2026',
          doctorName: 'Dr. Sarah Jenkins, DMD',
          refillsRemaining: 0,
          status: 'Active',
        },
      ];

  const hasAllergy = currentPatient.medicalAlerts?.some(
    (a) => a.type === 'critical' || a.title.toLowerCase().includes('allergy')
  );

  return (
    <div
      className={`printable-document-sheet w-full bg-white text-neutral-900 border transition-all relative overflow-hidden font-sans ${
        variant === 'full'
          ? 'p-8 sm:p-10 rounded-2xl shadow-xl border-border-card max-w-[800px] mx-auto min-h-[920px]'
          : 'p-5 rounded-xl shadow-sm border-border-card'
      } ${
        theme === 'monochrome'
          ? 'border-neutral-400'
          : theme === 'classic'
          ? 'border-amber-200/80 bg-amber-50/20'
          : 'border-primary/20'
      }`}
    >
      {/* Decorative Top Surgical Stripe */}
      {theme !== 'monochrome' && (
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-primary-container to-primary" />
      )}

      {/* Security Watermark Background */}
      {showWatermark && variant === 'full' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] rotate-[-25deg]">
          <span className="text-[120px] font-black tracking-widest text-primary uppercase font-serif">
            OFFICIAL ℞ PAD
          </span>
        </div>
      )}

      {/* OFFICIAL CLINIC LETTERHEAD */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-tint flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
            <img
              src={CLINIC_LOGO_URL}
              alt="DentalCare"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-primary leading-tight uppercase font-sans">
              DentalCare Surgical Center
            </h2>
            <p className="text-[11px] text-neutral-600 leading-tight">
              Downtown Practice & Implant Surgery Suite • 402 Medical Plaza
            </p>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
              Phone: +1 (555) 234-8900 • Emergency: +1 (555) 234-2401 • Fax: (555) 234-8905
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="inline-block border border-neutral-300 rounded px-2 py-0.5 bg-neutral-50 text-[10px] font-mono text-neutral-700">
            DEA: <strong className="text-neutral-900">BX-9812441</strong> • NPI: <strong className="text-neutral-900">1942087519</strong>
          </div>
          <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
            State Lic # <span className="font-semibold text-neutral-800">DEN-8849-NY</span> • CDS #4419
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold flex items-center justify-end gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            EPCS Certified Electronic Prescription
          </div>
        </div>
      </div>

      {/* PRACTITIONER & PATIENT BIOMETRIC BANNER */}
      <div className="my-4 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Prescriber */}
        <div className="flex flex-col gap-0.5 pr-2 sm:border-r border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
            Prescribing Clinician:
          </span>
          <span className="text-sm font-bold text-primary">
            {currentPatient.assignedDoctor || 'Dr. Sarah Jenkins, DMD'}
          </span>
          <span className="text-[11px] text-neutral-600">
            Lead Dental Surgeon • Operatory 1 (Downtown)
          </span>
        </div>

        {/* Patient */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
              Patient Information:
            </span>
            <span className="text-[10px] font-mono font-bold text-primary">
              MRN: #{currentPatient.mrn}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-neutral-900">
              {currentPatient.name}
            </span>
            <span className="text-neutral-600 text-xs">
              ({currentPatient.gender}, {currentPatient.age} yrs)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-neutral-600 font-mono mt-0.5">
            <span>DOB: <strong>{currentPatient.dob}</strong></span>
            <span>•</span>
            <span>Tel: <strong>{currentPatient.phone}</strong></span>
            <span>•</span>
            <span>Date: <strong>Oct 05, 2026</strong></span>
          </div>
        </div>
      </div>

      {/* ALLERGY & CONTRAINDICATION SAFETY WARNING */}
      {hasAllergy && (
        <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-300 flex items-center gap-2.5 text-xs text-rose-900">
          <span className="material-symbols-outlined text-[20px] text-rose-600 shrink-0">
            warning
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
              Critical Allergy Flag Verified
            </span>
            <span className="text-xs font-semibold">
              PATIENT ALLERGY: SEVERE PENICILLIN ANAPHYLAXIS RISK — BETA-LACTAMS STRICTLY CONTRAINDICATED.
            </span>
          </div>
        </div>
      )}

      {/* ℞ MEDICAL SYMBOL & ITEM MATRIX */}
      <div className="flex items-center gap-2 pb-1 text-primary">
        <span className="text-3xl font-serif font-black italic select-none">
          ℞
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Prescribed Medications & Dispense Instructions
        </span>
      </div>

      <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200 my-2">
        {items.map((item, index) => (
          <div key={item.id || index} className="py-3.5 flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-100 border border-neutral-300 text-neutral-800 text-[11px] font-bold font-mono flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <span className="text-sm font-bold text-neutral-900">
                  {item.medicationName}
                </span>
                <span className="text-xs text-neutral-500">
                  ({item.form})
                </span>
              </div>

              <div className="text-right font-mono font-bold text-xs text-primary bg-primary-tint/50 px-2 py-0.5 rounded border border-primary/20">
                Disp: {item.quantity}
              </div>
            </div>

            {/* Directions / Sig */}
            <div className="pl-7 flex flex-col gap-0.5 text-xs">
              <div className="text-neutral-800 font-medium">
                <span className="font-bold text-neutral-500 mr-1.5 font-mono">Sig:</span>
                {item.instructions}
              </div>
              {item.indication && (
                <div className="text-[11px] text-neutral-500 italic">
                  Clinical Indication: {item.indication}
                </div>
              )}
              <div className="flex items-center gap-4 text-[10px] text-neutral-600 font-mono mt-1 pt-1 border-t border-dashed border-neutral-200">
                <span>Refills: <strong>{item.refillsRemaining} (Zero)</strong></span>
                <span>•</span>
                <span>DAW: <strong>0 (Substitution Permitted)</strong></span>
                <span>•</span>
                <span>Schedule: <strong>Non-Controlled / Rx-Only</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DISPENSING RULES & PHARMACY NOTES */}
      <div className="my-3 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-[10px] text-neutral-600 flex flex-col gap-1 leading-relaxed">
        <p>
          <strong>Pharmacist Note:</strong> Verify patient identity upon pickup. In accordance with state dental board regulations, this prescription is valid for 30 days from date of issuance.
        </p>
        <p>
          Electronic Prescribing Security Hash: <code className="font-mono text-neutral-800">SHA256: 8f3c7e91a0b2d4f8...4419JENKINS</code>
        </p>
      </div>

      {/* SIGNATURE & LEGAL VALIDATION BLOCK */}
      <div className="mt-6 pt-4 border-t-2 border-neutral-800 flex flex-col sm:flex-row items-end justify-between gap-6">
        {/* Left: Barcode & Digital Verification Seal */}
        <div className="flex items-center gap-3">
          {/* Simulated 2D DataMatrix barcode */}
          <div className="w-14 h-14 bg-neutral-900 p-1 rounded border border-neutral-300 shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-white p-1 grid grid-cols-6 gap-0.5">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className={`${
                    (i * 7) % 3 === 0 || i % 5 === 0 ? 'bg-black' : 'bg-white'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col text-[10px] text-neutral-500 font-mono">
            <span className="font-bold text-neutral-800">DIGITAL Rx AUDIT TRAIL</span>
            <span>Ref: <strong>RX-2026-0842-CHAIR1</strong></span>
            <span>Auth Stamp: 2026-10-05T09:12:44Z</span>
            <span className="text-emerald-700 font-semibold">✓ Cryptographically Signed</span>
          </div>
        </div>

        {/* Right: Clinician Signature Line */}
        <div className="flex flex-col items-center sm:items-end w-full sm:w-64">
          <div className="relative w-full h-12 flex items-center justify-center sm:justify-end mb-1">
            {/* Elegant Vector Cursive Signature */}
            <svg
              className="w-48 h-10 text-primary-container"
              fill="none"
              viewBox="0 0 200 40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 25 C 25 10, 35 35, 50 15 C 65 -5, 75 30, 90 20 C 105 10, 115 30, 130 15 C 145 0, 155 25, 175 18 C 185 15, 195 25, 190 28"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M50 32 L185 30"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="2 4"
              />
            </svg>
          </div>
          <div className="w-full border-t border-neutral-800 pt-1 text-right">
            <span className="text-xs font-bold text-neutral-900 block">
              Dr. Sarah Jenkins, DMD
            </span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
              Licensed Dental Practitioner • State of NY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
