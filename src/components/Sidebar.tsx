import React from 'react';
import { ScreenId } from '../types/dental';
import { CLINIC_LOGO_URL } from '../data/mockDentalData';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  pendingRequestsCount: number;
  onOpenRequests: () => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  pendingRequestsCount,
  onOpenRequests,
  onOpenAuth,
  isLoggedIn,
  onLogout,
}) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-surface z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-border-divider/50">
      <div className="flex flex-col flex-1">
        {/* Top Branding Bar */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border-divider/30">
          <button
            onClick={() => onNavigate('dashboard-calendar')}
            className="flex items-center gap-2 text-left focus:outline-none"
          >
            <img
              alt="DentalCare Logo"
              className="h-8 w-auto object-contain"
              src={CLINIC_LOGO_URL}
              onError={(e) => {
                // Fallback SVG if image host fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-semibold text-lg text-primary tracking-tight font-sans">
              DentalCare
            </span>
          </button>
          <button
            aria-label="Collapse sidebar"
            className="h-8 w-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              menu_open
            </span>
          </button>
        </div>

        {/* Branch / Chair Status Capsule */}
        <div className="px-4 py-2">
          <div className="p-2 bg-surface-container-low rounded-lg flex items-center justify-between border border-border-divider/60">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-primary text-[18px]">
                domain
              </span>
              <div className="truncate">
                <p className="text-xs text-on-surface font-semibold truncate leading-tight">
                  Downtown Branch
                </p>
                <p className="text-[11px] text-text-secondary leading-tight mt-0.5">
                  Chair 1-6 • Active
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline text-[16px]">
              unfold_more
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-2 flex flex-col gap-1 overflow-y-auto no-scrollbar">
          {/* 1. Dashboard / Calendar */}
          <button
            onClick={() => onNavigate('dashboard-calendar')}
            className={`w-full flex items-center gap-2.5 px-3 h-11 rounded-lg transition-all text-left text-sm ${
              currentScreen === 'dashboard-calendar'
                ? 'bg-primary-container text-on-primary font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              calendar_month
            </span>
            <span>Dashboard / Calendar</span>
          </button>

          {/* 2. Patients */}
          <button
            onClick={() => onNavigate('patients')}
            className={`w-full flex items-center gap-2.5 px-3 h-11 rounded-lg transition-all text-left text-sm ${
              currentScreen === 'patients'
                ? 'bg-primary-container text-on-primary font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              groups
            </span>
            <span>Patients & Charts</span>
          </button>

          {/* 3. Prescriptions & Invoices */}
          <button
            onClick={() => onNavigate('prescriptions-invoices')}
            className={`w-full flex items-center gap-2.5 px-3 h-11 rounded-lg transition-all text-left text-sm ${
              currentScreen === 'prescriptions-invoices'
                ? 'bg-primary-container text-on-primary font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              receipt_long
            </span>
            <span>Prescriptions & Invoices</span>
          </button>

          {/* 4. Dental Imaging / DICOM */}
          <button
            onClick={() => onNavigate('imaging')}
            className={`w-full flex items-center gap-2.5 px-3 h-11 rounded-lg transition-all text-left text-sm ${
              currentScreen === 'imaging'
                ? 'bg-primary-container text-on-primary font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              radiology
            </span>
            <span>Imaging & X-Ray</span>
          </button>

          {/* 5. Booking Requests (Drawer Trigger) */}
          <button
            onClick={onOpenRequests}
            className="w-full flex items-center justify-between px-3 h-11 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all text-left text-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px]">
                mark_chat_unread
              </span>
              <span>Booking Requests</span>
            </div>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-semibold">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          {/* 6. Clinic Settings */}
          <button
            onClick={() => onNavigate('clinic-settings')}
            className={`w-full flex items-center gap-2.5 px-3 h-11 rounded-lg transition-all text-left text-sm ${
              currentScreen === 'clinic-settings'
                ? 'bg-primary-container text-on-primary font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              settings
            </span>
            <span>Clinic Settings</span>
          </button>

          {/* 7. Design Tokens & UI Specs */}
          <button
            onClick={() => onNavigate('tokens')}
            className={`w-full flex items-center gap-2.5 px-3 h-11 rounded-lg transition-all text-left text-sm ${
              currentScreen === 'tokens'
                ? 'bg-primary-container text-on-primary font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              design_services
            </span>
            <span>Design Tokens</span>
          </button>

          {/* 8. Staff Portal / Signup & Login */}
          <button
            onClick={() => onNavigate('auth')}
            className={`w-full flex items-center gap-2.5 px-3 h-11 rounded-lg transition-all text-left text-sm ${
              currentScreen === 'auth'
                ? 'bg-primary-container text-on-primary font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              passkey
            </span>
            <span>Login & Signup</span>
          </button>
        </nav>
      </div>

      {/* Emergency & Operatory Terminal Footer */}
      <div className="p-2 bg-surface border-t border-border-divider/50">
        <div className="rounded-lg bg-surface-container-low p-2 flex flex-col gap-1.5 border border-border-divider/40">
          <div className="flex items-center justify-between px-1 py-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-outline text-[18px]">
                contact_phone
              </span>
              <span className="text-xs text-text-secondary font-medium">
                Emergency Line
              </span>
            </div>
            <span className="text-xs text-primary font-bold">#2401</span>
          </div>

          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-2.5 h-9 rounded-lg text-danger hover:bg-danger-tint hover:text-danger transition-colors text-xs font-semibold text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
              <span>Lock Terminal / Logout</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="w-full flex items-center gap-2 px-2.5 h-9 rounded-lg text-primary hover:bg-primary-tint hover:text-primary transition-colors text-xs font-semibold text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                login
              </span>
              <span>Staff Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
