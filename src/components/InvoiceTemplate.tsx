import React from 'react';
import { Patient, InvoiceItem } from '../types/dental';
import { CLINIC_LOGO_URL } from '../data/mockDentalData';

interface InvoiceTemplateProps {
  patient?: Patient;
  invoice?: InvoiceItem;
  theme?: 'clinical' | 'classic' | 'executive' | 'monochrome';
  variant?: 'full' | 'compact';
  showPaidStamp?: boolean;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  patient,
  invoice,
  theme = 'clinical',
  variant = 'full',
  showPaidStamp = false,
}) => {
  const currentPatient = patient || {
    id: 'PT-2026-0842',
    mrn: 'PT-2026-0842',
    name: 'Robert Chen',
    dob: '08.14.1984',
    phone: '+1 (555) 234-8901',
    email: 'robert.chen@email.com',
    operatoryRoom: 'Operatory 1',
    assignedDoctor: 'Dr. Sarah Jenkins, DMD',
    primaryInsurance: {
      planName: 'Delta Dental Premier PPO',
      policyNumber: 'DENT-8849-NY',
      status: 'Active • Verified',
      coveragePct: 80,
      renewalDate: 'Dec 2026',
    },
  };

  // Line items - dynamic based on invoice prop if provided
  const lineItems = invoice
    ? [
        {
          date: invoice.date || 'Oct 05, 2026',
          tooth: invoice.tooth || 'FDI #14',
          code: invoice.code || 'CDT D2740',
          description: invoice.procedure || 'Crown - Porcelain / Ceramic Substrate (Zirconia)',
          provider: 'Dr. Sarah Jenkins',
          fee: invoice.billed || 680.0,
          insEst: invoice.paidIns || (invoice.billed * 0.8),
          copay: invoice.balance !== undefined ? invoice.balance : (invoice.billed * 0.2),
        },
        {
          date: 'Sep 22, 2026',
          tooth: 'Full Arch',
          code: 'CDT D0150',
          description: 'Comprehensive Oral Evaluation - New Patient',
          provider: 'Dr. Sarah Jenkins',
          fee: 85.0,
          insEst: 68.0,
          copay: 17.0,
        },
      ]
    : [
        {
          date: 'Oct 05, 2026',
          tooth: 'FDI #14',
          code: 'CDT D2740',
          description: 'Crown - Porcelain / Ceramic Substrate (Zirconia)',
          provider: 'Dr. Sarah Jenkins',
          fee: 680.0,
          insEst: 544.0,
          copay: 136.0,
        },
        {
          date: 'Sep 22, 2026',
          tooth: 'Full Arch',
          code: 'CDT D0150',
          description: 'Comprehensive Oral Evaluation - New Patient',
          provider: 'Dr. Sarah Jenkins',
          fee: 85.0,
          insEst: 68.0,
          copay: 17.0,
        },
        {
          date: 'Sep 22, 2026',
          tooth: 'Posteriors',
          code: 'CDT D0274',
          description: 'Bitewings - Four Radiographic Image Series',
          provider: 'Dr. Sarah Jenkins',
          fee: 65.0,
          insEst: 52.0,
          copay: 13.0,
        },
      ];

  const totalFee = lineItems.reduce((acc, item) => acc + item.fee, 0);
  const totalInsEst = lineItems.reduce((acc, item) => acc + item.insEst, 0);
  const totalCopay = lineItems.reduce((acc, item) => acc + item.copay, 0);
  const isPaid = invoice?.status === 'Paid' || showPaidStamp;

  return (
    <div
      className={`printable-document-sheet w-full bg-white text-neutral-900 border transition-all relative overflow-hidden font-sans ${
        variant === 'full'
          ? 'p-8 sm:p-10 rounded-2xl shadow-xl border-border-card max-w-[840px] mx-auto min-h-[960px]'
          : 'p-5 rounded-xl shadow-sm border-border-card'
      } ${
        theme === 'monochrome'
          ? 'border-neutral-400'
          : theme === 'classic'
          ? 'border-amber-200/80 bg-amber-50/20'
          : theme === 'executive'
          ? 'border-slate-300 bg-slate-50/10'
          : 'border-primary/20'
      }`}
    >
      {/* Top Brand Accent */}
      {theme !== 'monochrome' && (
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-primary-container to-primary" />
      )}

      {/* Optional "PAID" Watermark Stamp */}
      {isPaid && (
        <div className="absolute top-36 right-12 pointer-events-none select-none rotate-[-18deg] z-20">
          <div className="px-6 py-2 rounded-xl border-4 border-emerald-600 text-emerald-600 font-black text-3xl tracking-widest uppercase opacity-85 shadow-sm bg-white/70 backdrop-blur-xs">
            PAID IN FULL
          </div>
        </div>
      )}

      {/* HEADER SECTION: CLINIC LETTERHEAD & STATEMENT TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b-2 border-neutral-800">
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
            <h1 className="text-xl font-bold tracking-tight text-primary leading-tight uppercase font-sans">
              DentalCare Practice & Surgery
            </h1>
            <p className="text-[11px] text-neutral-600 leading-tight">
              Comprehensive Operatory & Implant Center • Suite 402 Medical Center
            </p>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
              Billing Dept: +1 (555) 234-8902 • Tax EIN: 12-8849201 • NPI: 1942087519
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="inline-block px-3 py-1 rounded-md bg-neutral-100 text-primary font-mono font-bold text-xs uppercase tracking-wider border border-neutral-300">
            STATEMENT / WALKOUT INVOICE
          </div>
          <div className="mt-1 text-xs font-mono font-bold text-neutral-900">
            Invoice #{invoice?.id || 'INV-2026-0841'}
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">
            Date: <strong>Oct 05, 2026</strong> • Terms: <strong>Net 30 Days</strong>
          </div>
        </div>
      </div>

      {/* PATIENT & INSURANCE BILLING INFO */}
      <div className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Patient / Bill To */}
        <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
            Bill To (Patient / Guarantor):
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-neutral-900">
              {currentPatient.name}
            </span>
            <span className="font-mono text-[11px] font-bold text-primary">
              MRN: #{currentPatient.mrn}
            </span>
          </div>
          <p className="text-[11px] text-neutral-600">
            742 Evergreen Terrace • New York, NY 10001
          </p>
          <div className="flex items-center gap-3 text-[11px] text-neutral-600 font-mono mt-0.5">
            <span>Phone: {currentPatient.phone}</span>
            <span>•</span>
            <span>DOB: {currentPatient.dob}</span>
          </div>
        </div>

        {/* Primary Dental Insurance Details */}
        <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
            Primary Dental Insurance:
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-primary">
              {currentPatient.primaryInsurance?.planName || 'Delta Dental Premier PPO'}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
              Coverage: {currentPatient.primaryInsurance?.coveragePct || 80}%
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 font-mono">
            Policy #: <strong>{currentPatient.primaryInsurance?.policyNumber || 'DENT-8849-NY'}</strong> • Group: <strong>NY-TECH-04</strong>
          </p>
          <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
            Pre-Authorization Ref: <strong className="text-neutral-800">AUTH-991204-OK</strong> • Claim Electronic Payer ID: <strong>04118</strong>
          </p>
        </div>
      </div>

      {/* ITEMIZED DENTAL CDT PROCEDURES TABLE */}
      <div className="my-4 overflow-hidden rounded-xl border border-neutral-300">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-100 text-neutral-700 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-300">
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Tooth / Quad</th>
              <th className="py-2.5 px-3">CDT Code</th>
              <th className="py-2.5 px-3">Procedure Description</th>
              <th className="py-2.5 px-3 text-right">Fee</th>
              <th className="py-2.5 px-3 text-right">Ins Est</th>
              <th className="py-2.5 px-3 text-right">Patient Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 text-[11px]">
            {lineItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-neutral-50">
                <td className="py-2.5 px-3 font-mono text-neutral-600">{item.date}</td>
                <td className="py-2.5 px-3 font-semibold text-primary">{item.tooth}</td>
                <td className="py-2.5 px-3 font-mono font-bold text-neutral-800">{item.code}</td>
                <td className="py-2.5 px-3">
                  <span className="font-semibold text-neutral-900 block">{item.description}</span>
                  <span className="text-[10px] text-neutral-500">Provider: {item.provider}</span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-neutral-700">
                  ${item.fee.toFixed(2)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-semibold">
                  -${item.insEst.toFixed(2)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900">
                  ${item.copay.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FINANCIAL BREAKDOWN BENTO & SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-5">
        {/* Left Notice & Payment Options (7 cols) */}
        <div className="sm:col-span-7 flex flex-col justify-between gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-1">
              Payment Instructions & Remittance:
            </span>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              Payments are due within 30 days of the statement date. We accept CareCredit, HSA/FSA cards, Visa, MasterCard, and checks.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-neutral-200">
            {/* QR Code for Instant Mobile Payment */}
            <div className="w-14 h-14 bg-neutral-900 p-1 rounded border border-neutral-300 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-white p-1 grid grid-cols-6 gap-0.5">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${
                      (i * 5) % 4 === 0 || i % 3 === 0 ? 'bg-black' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col text-[11px]">
              <span className="font-bold text-neutral-800">Scan to Pay Online Instantly:</span>
              <span className="text-primary font-mono font-semibold">
                dentalcare.clinic/pay/{invoice?.id || 'INV-2026-0841'}
              </span>
              <span className="text-[10px] text-neutral-500">Contactless 256-bit SSL encrypted checkout</span>
            </div>
          </div>
        </div>

        {/* Right Financial Ledger Balance (5 cols) */}
        <div className="sm:col-span-5 p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between gap-2 text-xs">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-neutral-600 text-[11px]">
              <span>Gross Billed Total:</span>
              <span className="font-mono">${totalFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600 text-[11px]">
              <span>Contractual PPO Discount:</span>
              <span className="font-mono text-neutral-500">-$0.00</span>
            </div>
            <div className="flex justify-between text-emerald-700 text-[11px] font-medium">
              <span>Primary Insurance Benefit:</span>
              <span className="font-mono">-${totalInsEst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600 text-[11px]">
              <span>Patient Payments Received:</span>
              <span className="font-mono text-neutral-500">-$0.00</span>
            </div>
          </div>

          <div className="pt-2 border-t-2 border-neutral-300 flex items-baseline justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-900 uppercase tracking-tight">
                Total Balance Due:
              </span>
              <span className="text-[10px] text-neutral-500">Due: Nov 04, 2026</span>
            </div>
            <span className="text-xl font-bold font-mono text-primary">
              ${totalCopay.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* PERFORATED REMITTANCE TEAR-OFF SLIP */}
      <div className="mt-8 pt-4 border-t-2 border-dashed border-neutral-400 relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 bg-white text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">content_cut</span>
          <span>Detach and return with payment if mailing check</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
          <div>
            <span className="text-neutral-500 block">Patient Name:</span>
            <span className="font-bold text-neutral-900">{currentPatient.name}</span>
            <span className="text-neutral-500 block font-mono text-[10px]">MRN: #{currentPatient.mrn}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Statement Number:</span>
            <span className="font-mono font-bold text-neutral-900">{invoice?.id || 'INV-2026-0841'}</span>
            <span className="text-neutral-500 block text-[10px]">Due: Nov 04, 2026</span>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-neutral-500 block">Amount Enclosed:</span>
            <div className="inline-block w-32 border-b-2 border-neutral-800 text-right font-mono font-bold text-sm text-primary">
              $ ____________
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
