import React, { useState, useMemo } from 'react';
import { Patient } from '../types/dental';
import { matchPatientByNameOrDob } from '../utils/patientSearch';

interface PatientListViewProps {
  patients: Patient[];
  selectedPatientId?: string;
  onSelectPatient: (patientId: string) => void;
  onOpenQuickAppointment?: (patient: Patient) => void;
  onNewRx?: (patient: Patient) => void;
  onOpenRadiology?: (patient: Patient) => void;
}

export const PatientListView: React.FC<PatientListViewProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onOpenQuickAppointment,
  onNewRx,
  onOpenRadiology,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [viewStyle, setViewStyle] = useState<'table' | 'cards'>('table');

  // Filter patients by real-time name or date of birth (DOB), plus optional status/doctor
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      // 1. Real-time Name or DOB search
      const match = matchPatientByNameOrDob(p, searchQuery);
      if (!match.matched) return false;

      // 2. Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'in-chair' && p.status !== 'In Chair') return false;
        if (statusFilter === 'waiting' && p.status !== 'Waiting Room') return false;
        if (statusFilter === 'confirmed' && p.status !== 'Confirmed') return false;
        if (statusFilter === 'completed' && p.status !== 'Completed') return false;
      }

      // 3. Doctor filter
      if (doctorFilter !== 'all') {
        if (doctorFilter === 'sarah' && !p.assignedDoctor.includes('Sarah')) return false;
        if (doctorFilter === 'marc' && !p.assignedDoctor.includes('Marc')) return false;
      }

      return true;
    });
  }, [patients, searchQuery, statusFilter, doctorFilter]);

  // Quick DOB suggestions to demonstrate real-time DOB filter capability
  const quickDobExamples = ['1984', '01.28.1994', '1972', 'Nov 1996', '1965'];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header & KPI Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-tint text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">
                groups
              </span>
              Clinical Registry
            </span>
            <span className="text-xs text-text-secondary">
              • Operatory Practice Management
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Patient List & Records Directory
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Instant real-time search by patient full name or date of birth (DOB) across all active chairside charts.
          </p>
        </div>

        {/* Practice Registry KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs shrink-0">
          <div className="bg-surface px-3 py-2 rounded-xl border border-border-card shadow-xs flex flex-col">
            <span className="text-text-secondary text-[11px] font-medium">Total Registered</span>
            <span className="text-base font-bold text-primary font-mono">{patients.length} Patients</span>
          </div>
          <div className="bg-surface px-3 py-2 rounded-xl border border-border-card shadow-xs flex flex-col">
            <span className="text-text-secondary text-[11px] font-medium">In Chair Now</span>
            <span className="text-base font-bold text-emerald-700 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              {patients.filter((p) => p.status === 'In Chair').length}
            </span>
          </div>
          <div className="bg-surface px-3 py-2 rounded-xl border border-border-card shadow-xs flex flex-col">
            <span className="text-text-secondary text-[11px] font-medium">Waiting Room</span>
            <span className="text-base font-bold text-amber-700 font-mono">
              {patients.filter((p) => p.status === 'Waiting Room').length}
            </span>
          </div>
          <div className="bg-surface px-3 py-2 rounded-xl border border-border-card shadow-xs flex flex-col">
            <span className="text-text-secondary text-[11px] font-medium">Medical Alerts</span>
            <span className="text-base font-bold text-danger font-mono">
              {patients.filter((p) => p.medicalAlerts.length > 0).length} Flags
            </span>
          </div>
        </div>
      </div>

      {/* Main Search & Real-Time Filter Hub */}
      <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-card/70 flex flex-col gap-4">
        {/* Real-Time Search Input with High-Visibility Ergonomics */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[22px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name (e.g. Robert, Julia) or date of birth (e.g. 08.14.1984, 1994, Jan 28)..."
              className="w-full h-12 pl-11 pr-10 rounded-xl bg-surface-container-low border border-border-divider/70 text-on-surface text-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface shadow-xs transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-surface-container cursor-pointer transition-colors"
                title="Clear search query"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 px-3 rounded-xl bg-surface-container-low border border-border-divider/70 text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-xs"
            >
              <option value="all">All Chair Statuses</option>
              <option value="in-chair">In Chair</option>
              <option value="waiting">Waiting Room</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>

            {/* Doctor Filter Dropdown */}
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="h-12 px-3 rounded-xl bg-surface-container-low border border-border-divider/70 text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-xs"
            >
              <option value="all">All Clinicians</option>
              <option value="sarah">Dr. Sarah Jenkins</option>
              <option value="marc">Dr. Marc Alami</option>
            </select>

            {/* View Style Switcher */}
            <div className="h-12 bg-surface-container-low rounded-xl p-1 border border-border-divider/70 flex items-center">
              <button
                type="button"
                onClick={() => setViewStyle('table')}
                className={`h-10 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  viewStyle === 'table'
                    ? 'bg-surface text-primary shadow-xs font-bold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                title="Table View"
              >
                <span className="material-symbols-outlined text-[18px]">table_rows</span>
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewStyle('cards')}
                className={`h-10 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  viewStyle === 'cards'
                    ? 'bg-surface text-primary shadow-xs font-bold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                title="Cards View"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Search Helper Bar & Quick DOB presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border-divider/40 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-text-secondary flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">
                filter_alt
              </span>
              <span>Quick DOB Presets:</span>
            </span>
            {quickDobExamples.map((dobChip) => (
              <button
                key={dobChip}
                type="button"
                onClick={() => setSearchQuery(dobChip)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-medium transition-colors cursor-pointer ${
                  searchQuery === dobChip
                    ? 'bg-primary-container text-on-primary border-primary-container font-bold shadow-xs'
                    : 'bg-surface-container-low text-text-secondary border-border-divider hover:bg-primary-tint hover:text-primary hover:border-primary/30'
                }`}
              >
                {dobChip}
              </button>
            ))}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-primary font-semibold hover:underline ml-1 cursor-pointer"
              >
                Reset Search
              </button>
            )}
          </div>

          {/* Match Counter Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">
              Showing <strong className="text-primary font-bold">{filteredPatients.length}</strong> of {patients.length} patients
            </span>
            {searchQuery.trim() && (
              <span className="px-2 py-0.5 rounded-full bg-primary-tint text-primary text-[11px] font-bold border border-primary/20">
                Live Filter Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Results View: Table Mode */}
      {viewStyle === 'table' ? (
        <div className="bg-surface rounded-2xl shadow-sm border border-border-card/70 overflow-hidden">
          {filteredPatients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-text-secondary border-b border-border-divider/60 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Patient & Identity</th>
                    <th className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-primary font-bold">
                        <span className="material-symbols-outlined text-[15px]">event</span>
                        <span>Date of Birth (DOB)</span>
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Chair Status</th>
                    <th className="py-3.5 px-4">Assigned Doctor</th>
                    <th className="py-3.5 px-4">Medical Alerts</th>
                    <th className="py-3.5 px-4">Primary Insurance</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-divider/40">
                  {filteredPatients.map((p) => {
                    const matchInfo = matchPatientByNameOrDob(p, searchQuery);
                    const isDobMatched = matchInfo.matchedField === 'dob' && searchQuery.trim().length > 0;
                    const isNameMatched = matchInfo.matchedField === 'name' && searchQuery.trim().length > 0;
                    const isSelected = selectedPatientId === p.id;

                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-primary-tint/20 transition-colors group cursor-pointer ${
                          isSelected ? 'bg-primary-tint/30' : ''
                        }`}
                        onClick={() => onSelectPatient(p.id)}
                      >
                        {/* 1. Patient Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              {p.avatar.startsWith('http') ? (
                                <img
                                  src={p.avatar}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-border-divider"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center shadow-xs">
                                  {p.avatar}
                                </div>
                              )}
                              {p.status === 'In Chair' && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-surface animate-pulse" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-sm font-bold group-hover:text-primary transition-colors ${
                                    isNameMatched
                                      ? 'bg-amber-100 dark:bg-amber-900/40 text-on-surface px-1 rounded'
                                      : 'text-on-surface'
                                  }`}
                                >
                                  {p.name}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-container text-text-secondary font-semibold">
                                  {p.mrn}
                                </span>
                              </div>
                              <div className="text-[11px] text-text-secondary flex items-center gap-2 mt-0.5">
                                <span>{p.gender}</span>
                                <span>•</span>
                                <span>{p.age} yrs</span>
                                <span>•</span>
                                <span className="font-mono">{p.phone}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Date of Birth (DOB) Column - Prominently Styled */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-0.5">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all w-fit ${
                                isDobMatched
                                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30 scale-105'
                                  : 'bg-surface-container-low text-text-primary border border-border-divider/70'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                calendar_month
                              </span>
                              <span>{p.dob}</span>
                            </div>
                            <span className="text-[10px] text-text-secondary font-mono pl-1">
                              Age: {p.age} years
                            </span>
                          </div>
                        </td>

                        {/* 3. Status & Operatory */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold w-fit flex items-center gap-1 ${
                                p.status === 'In Chair'
                                  ? 'bg-success-tint text-tertiary-container border border-emerald-300'
                                  : p.status === 'Waiting Room'
                                  ? 'bg-warning-tint text-warning border border-amber-300'
                                  : p.status === 'Completed'
                                  ? 'bg-surface-container text-text-secondary'
                                  : 'bg-primary-tint text-primary border border-primary/20'
                              }`}
                            >
                              {p.status === 'In Chair' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              )}
                              {p.status}
                            </span>
                            <span className="text-[11px] text-text-secondary">
                              {p.operatoryRoom || 'Downtown Branch'}
                            </span>
                          </div>
                        </td>

                        {/* 4. Assigned Doctor */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary-tint text-primary text-[10px] font-bold flex items-center justify-center">
                              {p.assignedDoctor.includes('Sarah') ? 'SJ' : 'MA'}
                            </div>
                            <span className="font-medium text-text-primary">
                              {p.assignedDoctor}
                            </span>
                          </div>
                        </td>

                        {/* 5. Medical Alerts */}
                        <td className="py-3.5 px-4">
                          {p.medicalAlerts.length > 0 ? (
                            <div className="flex flex-col gap-1 max-w-[220px]">
                              {p.medicalAlerts.slice(0, 1).map((alert, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 rounded text-[11px] font-semibold truncate flex items-center gap-1 ${
                                    alert.type === 'critical'
                                      ? 'bg-danger-tint text-danger'
                                      : 'bg-warning-tint text-warning'
                                  }`}
                                  title={alert.title}
                                >
                                  <span className="material-symbols-outlined text-[13px] shrink-0">
                                    warning
                                  </span>
                                  <span className="truncate">{alert.title}</span>
                                </span>
                              ))}
                              {p.medicalAlerts.length > 1 && (
                                <span className="text-[10px] text-text-secondary font-medium">
                                  +{p.medicalAlerts.length - 1} more alert(s)
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-text-secondary text-[11px] flex items-center gap-1">
                              <span className="material-symbols-outlined text-emerald-600 text-[14px]">
                                check
                              </span>
                              No active alerts
                            </span>
                          )}
                        </td>

                        {/* 6. Primary Insurance */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-text-primary truncate max-w-[160px]">
                              {p.primaryInsurance.planName}
                            </span>
                            <span className="text-[11px] text-text-secondary font-mono">
                              {p.primaryInsurance.coveragePct}% Covered • {p.primaryInsurance.policyNumber}
                            </span>
                          </div>
                        </td>

                        {/* 7. Action Button */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectPatient(p.id);
                              }}
                              className="px-3 h-8 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                            >
                              <span>Open Chart</span>
                              <span className="material-symbols-outlined text-[16px]">
                                chevron_right
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-low text-outline flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[36px]">
                  person_search
                </span>
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-text-primary">
                  No patients match "{searchQuery}"
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  We couldn't find any patient matching that name or date of birth. Try searching with a different birth year (e.g., "1984"), full date ("08.14.1984"), or patient surname.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setDoctorFilter('all');
                }}
                className="mt-2 px-4 h-9 rounded-lg bg-primary-tint text-primary hover:bg-primary hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results View: Cards Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((p) => {
              const matchInfo = matchPatientByNameOrDob(p, searchQuery);
              const isDobMatched = matchInfo.matchedField === 'dob' && searchQuery.trim().length > 0;
              const isNameMatched = matchInfo.matchedField === 'name' && searchQuery.trim().length > 0;

              return (
                <div
                  key={p.id}
                  onClick={() => onSelectPatient(p.id)}
                  className="bg-surface rounded-2xl p-5 shadow-sm border border-border-card/70 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        {p.avatar.startsWith('http') ? (
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-border-divider"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary font-bold text-sm flex items-center justify-center shadow-xs">
                            {p.avatar}
                          </div>
                        )}
                        {p.status === 'In Chair' && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-surface animate-pulse" />
                        )}
                      </div>
                      <div>
                        <h4
                          className={`text-sm font-bold group-hover:text-primary transition-colors ${
                            isNameMatched ? 'bg-amber-100 text-on-surface px-1 rounded' : 'text-on-surface'
                          }`}
                        >
                          {p.name}
                        </h4>
                        <span className="text-xs text-text-secondary font-mono">
                          {p.mrn} • {p.gender}, {p.age}y
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        p.status === 'In Chair'
                          ? 'bg-success-tint text-tertiary-container'
                          : p.status === 'Waiting Room'
                          ? 'bg-warning-tint text-warning'
                          : 'bg-primary-tint text-primary'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  {/* Date of Birth (DOB) Highlight Card */}
                  <div
                    className={`p-3 rounded-xl flex items-center justify-between border transition-all ${
                      isDobMatched
                        ? 'bg-primary-tint text-primary border-primary ring-2 ring-primary/20'
                        : 'bg-surface-container-low border-border-divider/60 text-text-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        event
                      </span>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider block">
                          Date of Birth (DOB)
                        </span>
                        <span className="text-xs font-mono font-bold text-text-primary">
                          {p.dob}
                        </span>
                      </div>
                    </div>
                    {isDobMatched && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary text-white">
                        ✓ DOB Match
                      </span>
                    )}
                  </div>

                  {/* Medical Alerts & Doctor */}
                  <div className="flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between text-text-secondary">
                      <span>Doctor:</span>
                      <span className="font-semibold text-text-primary">
                        {p.assignedDoctor}
                      </span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Insurance:</span>
                      <span className="font-medium text-text-primary truncate max-w-[160px]">
                        {p.primaryInsurance.planName}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPatient(p.id);
                    }}
                    className="w-full h-9 rounded-xl bg-primary-container hover:bg-primary-hover text-on-primary text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>View Odontogram & Chart</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 p-12 text-center flex flex-col items-center justify-center gap-2 bg-surface rounded-2xl border border-border-card">
              <span className="material-symbols-outlined text-[36px] text-outline">
                person_search
              </span>
              <p className="text-sm font-bold text-text-primary">
                No patients match "{searchQuery}"
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-primary font-semibold hover:underline cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
