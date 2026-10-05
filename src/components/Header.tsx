import React, { useState } from 'react';
import { DR_JENKINS_AVATAR } from '../data/mockDentalData';
import { Patient } from '../types/dental';
import { matchPatientByNameOrDob } from '../utils/patientSearch';

interface HeaderProps {
  onNewAppointment: () => void;
  onSelectPatient: (patientId: string) => void;
  patients: Patient[];
  onOpenNotifications: () => void;
  unreadCount: number;
  currentUser?: string;
  onOpenAuth?: () => void;
  onOpenDocumentTemplates?: (type: 'prescription' | 'invoice') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewAppointment,
  onSelectPatient,
  patients,
  onOpenNotifications,
  unreadCount,
  currentUser = 'Dr. Sarah Jenkins',
  onOpenAuth,
  onOpenDocumentTemplates,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredPatients = searchQuery.trim()
    ? patients.filter((p) => matchPatientByNameOrDob(p, searchQuery).matched)
    : [];

  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-surface/95 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-border-divider/50">
      <div className="h-16 w-full px-6 flex items-center justify-between gap-4">
        {/* Quick Search with interactive dropdown */}
        <div className="flex-1 max-w-md relative">
          <div className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search patients by name or DOB (e.g. Robert, 08.14.1984)..."
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline text-sm focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-container transition-all border border-border-divider/40"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-3 text-text-secondary hover:text-text-primary cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            )}
          </div>

          {/* Live Search Dropdown */}
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-surface rounded-xl shadow-xl border border-border-card p-2 z-50 max-h-72 overflow-y-auto">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => {
                  const match = matchPatientByNameOrDob(p, searchQuery);
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectPatient(p.id);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="w-full p-2.5 rounded-lg hover:bg-surface-container-low text-left flex items-center justify-between transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-tint text-primary font-bold flex items-center justify-center text-xs">
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-text-primary group-hover:text-primary">
                              {p.name}
                            </p>
                            <span className="text-[11px] px-1.5 py-0.2 rounded bg-surface-container text-text-secondary font-mono">
                              DOB: {p.dob}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary">
                            {p.mrn} • {p.phone}
                            {match.matchedField === 'dob' && (
                              <span className="ml-1 text-primary font-semibold">
                                • Matched DOB
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container text-text-secondary">
                        {p.status}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-sm text-text-secondary">
                  No matching patients found for "{searchQuery}".
                  <span className="block text-xs text-outline mt-1">
                    Try searching by name or birth date (e.g. 1984, 08.14.1984, Julia).
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Hub */}
        <div className="flex items-center gap-3">
          {/* Official Templates (Rx & Invoice) Quick Launcher */}
          {onOpenDocumentTemplates && (
            <button
              onClick={() => onOpenDocumentTemplates('prescription')}
              className="h-11 px-3.5 rounded-lg bg-surface text-primary border border-primary/25 hover:bg-primary-tint/60 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Preview Official ℞ & Invoice Templates"
            >
              <span className="font-serif italic text-[16px] font-bold">℞</span>
              <span className="hidden sm:inline">Templates</span>
            </button>
          )}

          {/* New Appointment Primary Button */}
          <button
            onClick={onNewAppointment}
            className="h-11 px-4 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>New Appointment</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative h-11 w-11 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
            title="Notifications & Alerts"
          >
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-danger rounded-full ring-2 ring-surface animate-pulse" />
            )}
          </button>

          <div className="h-6 w-px bg-surface-container-high" />

          {/* Doctor Account Lockup / Auth trigger */}
          <div
            onClick={onOpenAuth}
            className="flex items-center gap-2.5 pl-1 cursor-pointer hover:opacity-90 transition-opacity group"
            title="Click to switch practitioner or sign in/out"
          >
            <div className="relative shrink-0">
              <img
                alt={currentUser}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-tint group-hover:ring-primary"
                src={DR_JENKINS_AVATAR}
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-on-surface leading-tight group-hover:text-primary">
                {currentUser}
              </span>
              <span className="text-[12px] text-text-secondary leading-tight">
                Staff Account • Switch
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
