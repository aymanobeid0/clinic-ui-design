import React, { useState } from 'react';
import { Appointment, DoctorFilter, OperatoryId, Patient } from '../types/dental';
import { DAVID_MILLER_AVATAR } from '../data/mockDentalData';

interface DashboardScreenProps {
  appointments: Appointment[];
  patients: Patient[];
  selectedAppointment: Appointment;
  onSelectAppointment: (appointment: Appointment) => void;
  onOpenPatientFile: (patientId: string) => void;
  onOpenQuickAppointment: () => void;
  onOpenBookingRequests: () => void;
  onGenerateInvoice: (appointment: Appointment) => void;
  onMarkArrived: (appointmentId: string) => void;
  onReschedule: (appointment: Appointment) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  appointments,
  patients,
  selectedAppointment,
  onSelectAppointment,
  onOpenPatientFile,
  onOpenQuickAppointment,
  onOpenBookingRequests,
  onGenerateInvoice,
  onMarkArrived,
  onReschedule,
}) => {
  const [doctorFilter, setDoctorFilter] = useState<DoctorFilter>('all');
  const [operatoryFilter, setOperatoryFilter] = useState<OperatoryId>('all');
  const [currentDayOffset, setCurrentDayOffset] = useState<number>(0);
  const [dismissFooterTray, setDismissFooterTray] = useState<boolean>(false);

  // Filter appointments
  const filteredAppointments = appointments.filter((appt) => {
    if (doctorFilter === 'sarah' && !appt.doctor.includes('Sarah')) return false;
    if (doctorFilter === 'marc' && !appt.doctor.includes('Marc')) return false;
    if (operatoryFilter === 'op1' && !appt.operatory.includes('Operatory 1'))
      return false;
    if (operatoryFilter === 'op2' && !appt.operatory.includes('Operatory 2'))
      return false;
    if (operatoryFilter === 'hygiene' && !appt.operatory.includes('Hygiene'))
      return false;
    return true;
  });

  // Calculate day title
  const days = ['Monday, Oct 05, 2026', 'Tuesday, Oct 06, 2026', 'Wednesday, Oct 07, 2026'];
  const displayDate =
    currentDayOffset === 0
      ? 'Monday, Oct 05, 2026'
      : currentDayOffset === 1
      ? 'Tuesday, Oct 06, 2026'
      : currentDayOffset === -1
      ? 'Sunday, Oct 04, 2026'
      : `Day Offset (${currentDayOffset})`;

  // Lookup full patient for current appointment
  const currentPatient =
    patients.find((p) => p.id === selectedAppointment.patientId) || patients[0];

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="p-4 lg:p-6 flex flex-col gap-5 max-w-[1440px] mx-auto w-full">
        {/* Top Action / Filtering Hub */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-surface p-4 rounded-xl shadow-sm border border-border-card/60">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-primary-tint text-primary px-3 py-2 rounded-lg font-semibold text-base">
              <span className="material-symbols-outlined text-[20px]">
                calendar_today
              </span>
              <span>{displayDate}</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-success-tint text-tertiary-container text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Clinic Live
            </span>
          </div>

          {/* Practitioner & Operatory Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-1 bg-surface-container-low rounded-lg gap-1 border border-border-divider/60">
              <button
                onClick={() => setDoctorFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  doctorFilter === 'all'
                    ? 'text-on-primary bg-primary-container shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                All Dentists
              </button>
              <button
                onClick={() => setDoctorFilter('sarah')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  doctorFilter === 'sarah'
                    ? 'text-on-primary bg-primary-container shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Dr. Sarah Jenkins
              </button>
              <button
                onClick={() => setDoctorFilter('marc')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  doctorFilter === 'marc'
                    ? 'text-on-primary bg-primary-container shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Dr. Marc Alami
              </button>
            </div>

            <div className="relative inline-flex items-center">
              <select
                value={operatoryFilter}
                onChange={(e) => setOperatoryFilter(e.target.value as OperatoryId)}
                className="h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-container appearance-none cursor-pointer border border-border-divider/60"
              >
                <option value="all">All Operatories</option>
                <option value="op1">Operatory 1 (Surgical)</option>
                <option value="op2">Operatory 2 (Restorative)</option>
                <option value="hygiene">Hygiene Suite</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 text-outline text-[18px]">
                expand_more
              </span>
            </div>

            <button
              onClick={onOpenQuickAppointment}
              className="h-10 px-4 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Quick Appointment</span>
            </button>
          </div>
        </div>

        {/* 4 Top KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="bg-surface p-5 rounded-xl shadow-sm border border-border-card/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                Today's Appointments
              </span>
              <div className="w-9 h-9 rounded-lg bg-primary-tint text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  event_available
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary leading-none">
                  18
                </span>
                <span className="text-xs text-text-secondary">scheduled</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-text-secondary">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  4 done
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  2 in-chair
                </span>
              </div>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-surface p-5 rounded-xl shadow-sm border border-border-card/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                WhatsApp Requests
              </span>
              <div className="w-9 h-9 rounded-lg bg-secondary-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  chat
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary leading-none">
                  5
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary text-[11px] font-semibold">
                  Awaiting review
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Avg. response time: 4m
              </p>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-surface p-5 rounded-xl shadow-sm border border-border-card/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                Today's Clinic Revenue
              </span>
              <div className="w-9 h-9 rounded-lg bg-success-tint text-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  payments
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-text-primary leading-none">
                  $3,420
                </span>
                <span className="text-xs text-emerald-700 font-semibold">
                  +14% vs avg
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                8 invoices processed • 3 unbilled
              </p>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-surface p-5 rounded-xl shadow-sm border border-border-card/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                Chair Utilization
              </span>
              <div className="w-9 h-9 rounded-lg bg-warning-tint text-warning flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  airline_seat_recline_extra
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-primary leading-none">
                  87%
                </span>
                <span className="text-xs text-text-secondary font-medium">
                  Operatories 1-3 active
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-primary-container h-full rounded-full transition-all"
                  style={{ width: '87%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace Layout: Calendar Grid + Detailed Context Side Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Interactive Hourly Time-Grid Calendar (8 Columns on desktop) */}
          <div className="xl:col-span-8 bg-surface rounded-xl shadow-sm border border-border-card/60 flex flex-col overflow-hidden">
            {/* Calendar Header Bar with Operatory Column Identifiers */}
            <div className="p-4 bg-surface flex items-center justify-between border-b border-border-divider/50">
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold text-text-primary">
                  Daily Operatory Schedule
                </span>
                <span className="text-xs text-text-secondary bg-surface-container-low px-2 py-0.5 rounded font-mono">
                  GMT-4 Live
                </span>
              </div>
              <div className="flex items-center gap-1 text-text-secondary">
                <button
                  onClick={() => setCurrentDayOffset((prev) => prev - 1)}
                  className="p-1 hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                  title="Previous Day"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_left
                  </span>
                </button>
                <button
                  onClick={() => setCurrentDayOffset(0)}
                  className="px-2.5 py-1 text-xs bg-surface-container-low hover:bg-surface-container rounded-lg font-semibold text-on-surface cursor-pointer"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentDayOffset((prev) => prev + 1)}
                  className="p-1 hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                  title="Next Day"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>

            {/* Schedule Matrix Column Headers */}
            <div className="grid grid-cols-12 bg-surface-container-low py-2.5 text-text-secondary text-xs px-3 border-b border-border-divider/50 font-medium">
              <div className="col-span-2 text-center font-semibold">Time</div>
              <div className="col-span-5 px-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                  <span className="font-semibold text-on-surface">
                    Operatory 1
                  </span>
                  <span className="text-[11px] text-text-secondary hidden sm:inline">
                    Dr. Sarah Jenkins
                  </span>
                </div>
                <span className="text-[11px] bg-surface px-1.5 py-0.5 rounded font-mono border border-border-divider/60">
                  Ch-1
                </span>
              </div>
              <div className="col-span-5 px-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container" />
                  <span className="font-semibold text-on-surface">
                    Operatory 2
                  </span>
                  <span className="text-[11px] text-text-secondary hidden sm:inline">
                    Dr. Marc Alami
                  </span>
                </div>
                <span className="text-[11px] bg-surface px-1.5 py-0.5 rounded font-mono border border-border-divider/60">
                  Ch-2
                </span>
              </div>
            </div>

            {/* Scrollable Hourly Canvas */}
            <div className="relative overflow-y-auto max-h-[640px] bg-surface">
              <div className="relative min-w-[560px]">
                {/* Red Live Time Marker (10:45 AM) */}
                <div className="absolute left-0 right-0 top-[205px] z-30 flex items-center pointer-events-none">
                  <div className="w-16 text-right pr-2 font-mono text-[11px] font-bold text-danger">
                    10:45 AM
                  </div>
                  <div className="w-2 h-2 rounded-full bg-danger -ml-1" />
                  <div className="flex-1 h-[2px] bg-danger" />
                </div>

                {/* 08:30 AM */}
                <div className="grid grid-cols-12 h-16 border-b border-border-divider/30 bg-surface-container-lowest">
                  <div className="col-span-2 pr-4 pt-1.5 text-right font-mono text-xs text-text-secondary">
                    08:30
                  </div>
                  <div className="col-span-5 relative bg-surface-container-low/10 border-r border-border-divider/20" />
                  <div className="col-span-5 relative bg-surface-container-low/10" />
                </div>

                {/* 09:00 AM */}
                <div className="grid grid-cols-12 h-20 border-b border-border-divider/30 bg-surface">
                  <div className="col-span-2 pr-4 pt-1.5 text-right font-mono text-xs text-text-secondary">
                    09:00
                  </div>
                  <div className="col-span-5 relative p-1 border-r border-border-divider/20">
                    {/* Robert Chen Card */}
                    {filteredAppointments.some((a) => a.id === 'appt-1') && (
                      <div
                        onClick={() => {
                          const appt = appointments.find((a) => a.id === 'appt-1');
                          if (appt) onSelectAppointment(appt);
                        }}
                        className={`absolute inset-x-1 top-1 h-[70px] rounded-lg bg-primary-container text-on-primary p-2 flex flex-col justify-between shadow-sm cursor-pointer hover:brightness-110 transition-all z-10 ${
                          selectedAppointment.id === 'appt-1'
                            ? 'ring-2 ring-warning-cta shadow-md'
                            : ''
                        }`}
                      >
                        <div className="flex items-start justify-between leading-tight">
                          <span className="text-xs font-bold truncate">
                            Robert Chen
                          </span>
                          <span className="text-[10px] bg-danger text-on-error px-1.5 py-0.5 rounded font-bold uppercase">
                            Allergy
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-primary-fixed-dim">
                          <span className="truncate">Crown Prep • FDI #14</span>
                          <span className="font-mono">45m</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-span-5 relative p-1">
                    {/* Emily Watson Card */}
                    {filteredAppointments.some((a) => a.id === 'appt-2') && (
                      <div
                        onClick={() => {
                          const appt = appointments.find((a) => a.id === 'appt-2');
                          if (appt) onSelectAppointment(appt);
                        }}
                        className={`absolute inset-x-1 top-6 h-[46px] rounded-lg bg-tertiary-container text-on-tertiary p-2 flex flex-col justify-between shadow-sm cursor-pointer hover:brightness-110 transition-all z-10 ${
                          selectedAppointment.id === 'appt-2'
                            ? 'ring-2 ring-warning-cta shadow-md'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between leading-tight">
                          <span className="text-xs truncate font-semibold">
                            Emily Watson
                          </span>
                          <span className="text-[10px] bg-white/20 text-on-tertiary px-1 py-0.2 rounded font-mono">
                            WA Confirmed
                          </span>
                        </div>
                        <div className="text-[11px] text-tertiary-fixed-dim truncate">
                          Routine Scaling & Polish
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 10:00 AM */}
                <div className="grid grid-cols-12 h-24 border-b border-border-divider/30 bg-surface">
                  <div className="col-span-2 pr-4 pt-1.5 text-right font-mono text-xs text-text-secondary">
                    10:00
                  </div>
                  <div className="col-span-5 relative p-1 border-r border-border-divider/20">
                    {/* David Miller Card */}
                    {filteredAppointments.some((a) => a.id === 'appt-3') && (
                      <div
                        onClick={() => {
                          const appt = appointments.find((a) => a.id === 'appt-3');
                          if (appt) onSelectAppointment(appt);
                        }}
                        className={`absolute inset-x-1 top-4 h-[84px] rounded-lg bg-primary text-on-primary p-2.5 flex flex-col justify-between shadow-md cursor-pointer transition-all z-10 ${
                          selectedAppointment.id === 'appt-3'
                            ? 'ring-2 ring-warning-cta shadow-lg'
                            : 'hover:brightness-110'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-warning-cta animate-ping" />
                              <span className="text-xs text-white font-bold truncate">
                                David Miller
                              </span>
                            </div>
                            <span className="text-[12px] text-primary-fixed mt-0.5 truncate">
                              Root Canal Treatment (FDI #26)
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-warning-tint text-warning text-[11px] font-bold">
                            In Chair
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-outline-variant pt-1 border-t border-white/10">
                          <span className="flex items-center gap-1 text-white/90">
                            <span className="material-symbols-outlined text-[14px]">
                              timer
                            </span>
                            10:15 - 11:15
                          </span>
                          <span className="text-white font-mono bg-white/10 px-1.5 rounded">
                            60 min
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-span-5 relative p-1" />
                </div>

                {/* 11:00 AM */}
                <div className="grid grid-cols-12 h-20 border-b border-border-divider/30 bg-surface">
                  <div className="col-span-2 pr-4 pt-1.5 text-right font-mono text-xs text-text-secondary">
                    11:00
                  </div>
                  <div className="col-span-5 relative p-1 border-r border-border-divider/20" />
                  <div className="col-span-5 relative p-1">
                    {/* Sophia Martinez Card */}
                    {filteredAppointments.some((a) => a.id === 'appt-4') && (
                      <div
                        onClick={() => {
                          const appt = appointments.find((a) => a.id === 'appt-4');
                          if (appt) onSelectAppointment(appt);
                        }}
                        className={`absolute inset-x-1 top-6 h-[48px] rounded-lg bg-secondary text-on-secondary p-2 flex flex-col justify-between shadow-sm cursor-pointer hover:brightness-110 transition-all z-10 ${
                          selectedAppointment.id === 'appt-4'
                            ? 'ring-2 ring-warning-cta shadow-md'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between leading-tight">
                          <span className="text-xs truncate font-bold">
                            Sophia Martinez
                          </span>
                          <span className="text-[10px] bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded font-semibold">
                            New Patient
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-surface-container">
                          <span className="truncate">Consultation & Panorex</span>
                          <span className="font-mono">30m</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 12:00 PM Break Slot */}
                <div className="grid grid-cols-12 h-14 border-b border-border-divider/30 bg-surface-container-low/40">
                  <div className="col-span-2 pr-4 pt-1.5 text-right font-mono text-xs text-text-secondary">
                    12:00 PM
                  </div>
                  <div className="col-span-10 flex items-center justify-center text-text-secondary text-xs gap-2 font-medium">
                    <span className="material-symbols-outlined text-[16px]">
                      coffee
                    </span>
                    <span>Sterilization Cycle & Staff Turnaround Break</span>
                  </div>
                </div>

                {/* 01:00 PM */}
                <div className="grid grid-cols-12 h-20 border-b border-border-divider/30 bg-surface">
                  <div className="col-span-2 pr-4 pt-1.5 text-right font-mono text-xs text-text-secondary">
                    01:00 PM
                  </div>
                  <div className="col-span-5 relative p-1 border-r border-border-divider/20" />
                  <div className="col-span-5 relative p-1" />
                </div>

                {/* 02:00 PM */}
                <div className="grid grid-cols-12 h-24 border-b border-border-divider/30 bg-surface">
                  <div className="col-span-2 pr-4 pt-1.5 text-right font-mono text-xs text-text-secondary">
                    02:00 PM
                  </div>
                  <div className="col-span-5 relative p-1 border-r border-border-divider/20">
                    {/* James O'Connor Card */}
                    {filteredAppointments.some((a) => a.id === 'appt-5') && (
                      <div
                        onClick={() => {
                          const appt = appointments.find((a) => a.id === 'appt-5');
                          if (appt) onSelectAppointment(appt);
                        }}
                        className={`absolute inset-x-1 top-2 h-[80px] rounded-lg bg-primary-container text-on-primary p-2.5 flex flex-col justify-between shadow-sm cursor-pointer hover:brightness-110 transition-all z-10 ${
                          selectedAppointment.id === 'appt-5'
                            ? 'ring-2 ring-warning-cta shadow-md'
                            : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold truncate block">
                              James O'Connor
                            </span>
                            <span className="text-[12px] text-primary-fixed-dim">
                              Dental Implant Follow-up
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-success-tint text-tertiary-container text-[11px] font-semibold">
                            Confirmed
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-primary-fixed border-t border-white/10 pt-1">
                          <span>Implant Stage 2 Check</span>
                          <span className="font-mono">60 min</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-span-5 relative p-1" />
                </div>

                {/* 03:00 PM - 05:00 PM */}
                <div className="grid grid-cols-12 h-16 border-b border-border-divider/30 bg-surface">
                  <div className="col-span-2 pr-4 pt-1.5 text-right font-mono text-xs text-text-secondary">
                    03:00 PM
                  </div>
                  <div className="col-span-5 relative p-1 border-r border-border-divider/20" />
                  <div className="col-span-5 relative p-1" />
                </div>
                <div className="grid grid-cols-12 h-16 border-b border-border-divider/30 bg-surface">
                  <div className="col-span-2 pr-4 pt-1.5 text-right font-mono text-xs text-text-secondary">
                    04:00 PM
                  </div>
                  <div className="col-span-5 relative p-1 border-r border-border-divider/20" />
                  <div className="col-span-5 relative p-1" />
                </div>
              </div>
            </div>

            {/* Calendar Bottom Legend */}
            <div className="p-3 bg-surface-container-low flex flex-wrap items-center justify-between gap-3 text-xs text-text-secondary border-t border-border-divider/50">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-primary-container" /> Dr.
                  Jenkins
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-tertiary-container" /> Dr.
                  Marc Alami
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-secondary" /> New
                  Consultation
                </span>
              </div>
              <span className="flex items-center gap-1 text-on-surface-variant font-medium">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">
                  verified
                </span>
                Automated WhatsApp sync active
              </span>
            </div>
          </div>

          {/* Right Context Side-Panel: Selected Appointment Summary (4 Columns on desktop) */}
          <div className="xl:col-span-4 bg-surface rounded-xl shadow-sm border border-border-card/60 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1 border-b border-border-divider/40">
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  Appointment Detail
                </h2>
                <p className="text-xs text-text-secondary">
                  Real-time operatory inspect
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-warning-tint text-warning text-xs font-bold">
                {selectedAppointment.status}
              </span>
            </div>

            {/* Patient Header Card */}
            <div className="p-3.5 bg-surface-container-low rounded-xl flex items-center gap-3.5 border border-border-divider/50">
              <img
                className="w-14 h-14 rounded-full object-cover shadow-sm bg-surface-container shrink-0"
                src={selectedAppointment.patientAvatar || DAVID_MILLER_AVATAR}
                alt={selectedAppointment.patientName}
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-text-primary truncate">
                  {selectedAppointment.patientName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                  <span className="font-mono text-primary font-semibold">
                    {selectedAppointment.patientId}
                  </span>
                  <span>•</span>
                  <span>
                    {selectedAppointment.age} yrs, {selectedAppointment.gender}
                  </span>
                </div>
              </div>
            </div>

            {/* High-Priority Alert Banner */}
            <div
              className={`p-3.5 rounded-xl flex items-start gap-2.5 ${
                selectedAppointment.alert.toLowerCase().includes('high') ||
                selectedAppointment.alert.toLowerCase().includes('allergy')
                  ? 'bg-danger-tint text-danger'
                  : 'bg-warning-tint text-warning'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                warning
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider">
                  Clinical Alert
                </p>
                <p className="text-xs text-on-surface mt-0.5 leading-snug">
                  {selectedAppointment.alert}
                </p>
              </div>
            </div>

            {/* Operational Specifications Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-surface-container-low rounded-lg border border-border-divider/50">
                <span className="text-[11px] text-text-secondary uppercase font-semibold block">
                  Scheduled Time
                </span>
                <span className="text-xs text-on-surface font-semibold mt-0.5 block">
                  {selectedAppointment.timeSlot}
                </span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-lg border border-border-divider/50">
                <span className="text-[11px] text-text-secondary uppercase font-semibold block">
                  Location
                </span>
                <span className="text-xs text-on-surface font-semibold mt-0.5 block">
                  {selectedAppointment.operatory}
                </span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-lg border border-border-divider/50">
                <span className="text-[11px] text-text-secondary uppercase font-semibold block">
                  Primary Doctor
                </span>
                <span className="text-xs text-primary font-semibold mt-0.5 block truncate">
                  {selectedAppointment.doctor}
                </span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-lg border border-border-divider/50">
                <span className="text-[11px] text-text-secondary uppercase font-semibold block">
                  Estimated Fee
                </span>
                <span className="text-xs text-text-primary font-bold mt-0.5 block">
                  ${selectedAppointment.cost}.00
                </span>
              </div>
            </div>

            {/* Treatment Plan Quick Status & Odontogram Mapping */}
            <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-border-divider/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">
                  Procedure Target
                </span>
                <span className="text-xs font-mono text-primary font-bold">
                  {selectedAppointment.toothTarget || 'FDI #26 (Upper Molar)'}
                </span>
              </div>
              <p className="text-xs text-on-surface font-medium">
                {selectedAppointment.procedureName}
              </p>

              {/* Mini Odontogram Tooth Map Representation */}
              <div className="mt-1 pt-2 flex items-center justify-between bg-surface p-2.5 rounded-lg border border-border-divider/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-primary-tint text-primary flex items-center justify-center font-mono font-bold text-xs">
                    26
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-primary">
                      Canals Located: 3/3
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      Pulp extirpation complete
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onOpenPatientFile(selectedAppointment.patientId)}
                  className="text-primary hover:text-primary-hover text-xs font-semibold underline cursor-pointer"
                >
                  View Chart
                </button>
              </div>
            </div>

            {/* WhatsApp Interaction Capsule */}
            <div className="p-3 bg-success-tint rounded-xl flex items-center justify-between border border-emerald-200/50">
              <div className="flex items-center gap-2 text-tertiary-container">
                <span className="material-symbols-outlined text-[20px] text-emerald-700">
                  chat
                </span>
                <div>
                  <span className="text-xs font-bold block text-emerald-950 leading-tight">
                    WhatsApp Notification
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    Arrival confirmed at 10:08 AM
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[11px] font-bold">
                Delivered
              </span>
            </div>

            {/* Chairside Clinical Action Triggers */}
            <div className="flex flex-col gap-2 mt-1">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onMarkArrived(selectedAppointment.id)}
                  className="h-10 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    how_to_reg
                  </span>
                  <span>Mark Arrived</span>
                </button>
                <button
                  onClick={() => onReschedule(selectedAppointment)}
                  className="h-10 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    edit_calendar
                  </span>
                  <span>Reschedule</span>
                </button>
              </div>

              <button
                onClick={() => onOpenPatientFile(selectedAppointment.patientId)}
                className="w-full h-11 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  folder_shared
                </span>
                <span>Open Patient Clinical File</span>
              </button>

              <button
                onClick={() => onGenerateInvoice(selectedAppointment)}
                className="w-full h-10 rounded-lg bg-surface hover:bg-surface-container-low text-text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-border-divider/70 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  receipt_long
                </span>
                <span>Generate & Send Invoice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Booking Requests Alert Footer Tray */}
        {!dismissFooterTray && (
          <div className="bg-surface rounded-xl p-4 shadow-sm border border-border-card/60 flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">
                  Incoming Online & WhatsApp Requests Need Verification
                </h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  Latest request: Mark Jansen requested Emergency Toothache
                  Consultation for 03:30 PM
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDismissFooterTray(true)}
                className="h-10 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={onOpenBookingRequests}
                className="h-10 px-4 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Review Requests (4)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
