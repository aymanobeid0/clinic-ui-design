/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenId, Patient, Appointment, BookingRequest } from './types/dental';
import {
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
} from './data/mockDentalData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardScreen } from './components/DashboardScreen';
import { PatientFileScreen } from './components/PatientFileScreen';
import { PrescriptionsInvoicesScreen } from './components/PrescriptionsInvoicesScreen';
import { ImagingDiagnosticsScreen } from './components/ImagingDiagnosticsScreen';
import { ClinicSettingsScreen } from './components/ClinicSettingsScreen';
import { DesignTokensScreen } from './components/DesignTokensScreen';
import { BookingRequestsModal } from './components/BookingRequestsModal';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';
import { DocumentTemplateModal } from './components/DocumentTemplateModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(
    'dashboard-calendar'
  );
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    INITIAL_PATIENTS[0].id
  );
  const [appointments, setAppointments] = useState<Appointment[]>(
    INITIAL_APPOINTMENTS
  );
  // Default selected appointment is David Miller (10:15 - 11:15 AM In Chair) as shown in Image 1
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>(
    INITIAL_APPOINTMENTS[2]
  );

  // Modals state
  const [showBookingRequests, setShowBookingRequests] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGlobalDocModal, setShowGlobalDocModal] = useState(false);
  const [globalDocModalType, setGlobalDocModalType] = useState<'prescription' | 'invoice'>('prescription');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState('Dr. Sarah Jenkins');
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const activePatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  const triggerToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 3500);
  };

  const handleLoginSuccess = (staffName: string, role: string) => {
    setIsLoggedIn(true);
    setCurrentUser(staffName);
    triggerToast(`Authenticated as ${staffName} (${role.toUpperCase()})`);
    setCurrentScreen('dashboard-calendar');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    triggerToast('Operatory terminal locked.');
    setCurrentScreen('auth');
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentScreen('patients');
  };

  const handleOpenPatientFile = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentScreen('patients');
  };

  const handleAddAppointment = (newAppt: Appointment) => {
    setAppointments((prev) => [newAppt, ...prev]);
    setSelectedAppointment(newAppt);
    triggerToast(
      `Appointment scheduled for ${newAppt.patientName} at ${newAppt.timeSlot} (${newAppt.operatory})`
    );
  };

  const handleMarkArrived = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId ? { ...a, status: 'In Chair' } : a
      )
    );
    setSelectedAppointment((prev) =>
      prev.id === appointmentId ? { ...prev, status: 'In Chair' } : prev
    );
    triggerToast('Patient status updated to "In Chair" • Operatory notified.');
  };

  const handleReschedule = (appointment: Appointment) => {
    setShowNewAppointmentModal(true);
  };

  const handleGenerateInvoice = (appointment: Appointment) => {
    setCurrentScreen('prescriptions-invoices');
    triggerToast(
      `Generated billing draft for ${appointment.patientName} ($${appointment.cost}.00)`
    );
  };

  const handleAcceptBookingRequest = (req: BookingRequest) => {
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      patientId: `PT-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName: req.patientName,
      age: 38,
      gender: 'Male',
      timeSlot: `${req.requestedTime} - 04:15 PM`,
      startTime: req.requestedTime,
      durationMinutes: 45,
      operatory: 'Operatory 1',
      doctor: 'Dr. Sarah Jenkins',
      procedureName: req.reason,
      toothTarget: 'Emergency Operatory Triage',
      status: 'Confirmed',
      alert: 'Emergency intake from WhatsApp request',
      cost: 290,
      copay: 50,
      waStatus: {
        delivered: true,
        confirmedAt: 'Just now',
      },
    };
    setAppointments((prev) => [newAppt, ...prev]);
    setSelectedAppointment(newAppt);
    triggerToast(
      `Accepted request: Scheduled ${req.patientName} for ${req.requestedTime} in Operatory 1.`
    );
  };

  const handleAddToTreatmentPlan = (finding: string) => {
    triggerToast(`Added "${finding}" to patient active treatment plan.`);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-on-surface antialiased flex">
      {/* Toast Notification Container */}
      {globalToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-bounce border border-neutral-700">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">
            check_circle
          </span>
          <span className="font-medium">{globalToast}</span>
        </div>
      )}

      {/* Persistent Left Sidebar Navigation */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        pendingRequestsCount={4}
        onOpenRequests={() => setShowBookingRequests(true)}
        onOpenAuth={() => setCurrentScreen('auth')}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Main App Container (with left padding for 240px sidebar) */}
      <div className="pl-60 flex-1 min-h-screen flex flex-col">
        {/* Sticky Frosted Header */}
        <Header
          onNewAppointment={() => setShowNewAppointmentModal(true)}
          onSelectPatient={handleSelectPatient}
          patients={patients}
          onOpenNotifications={() => setShowBookingRequests(true)}
          unreadCount={4}
          currentUser={currentUser}
          onOpenAuth={() => setCurrentScreen('auth')}
          onOpenDocumentTemplates={(type) => {
            setGlobalDocModalType(type);
            setShowGlobalDocModal(true);
          }}
        />

        {/* Content Viewport with top padding for 64px header */}
        <main className="w-full pt-16 flex-1 bg-background">
          {currentScreen === 'dashboard-calendar' && (
            <DashboardScreen
              appointments={appointments}
              patients={patients}
              selectedAppointment={selectedAppointment}
              onSelectAppointment={setSelectedAppointment}
              onOpenPatientFile={handleOpenPatientFile}
              onOpenQuickAppointment={() => setShowNewAppointmentModal(true)}
              onOpenBookingRequests={() => setShowBookingRequests(true)}
              onGenerateInvoice={handleGenerateInvoice}
              onMarkArrived={handleMarkArrived}
              onReschedule={handleReschedule}
            />
          )}

          {currentScreen === 'patients' && (
            <PatientFileScreen
              patient={activePatient}
              patients={patients}
              onSelectPatient={setSelectedPatientId}
              onBookNextVisit={() => setShowNewAppointmentModal(true)}
              onNewRx={() => setCurrentScreen('prescriptions-invoices')}
              onGenerateInvoice={() => setCurrentScreen('prescriptions-invoices')}
              onOpenRadiology={() => setCurrentScreen('imaging')}
            />
          )}

          {currentScreen === 'prescriptions-invoices' && (
            <PrescriptionsInvoicesScreen
              onNewRx={() =>
                triggerToast('Opening physical e-Rx pad for electronic authorization')
              }
              onCreateInvoice={() =>
                triggerToast('Drafting new itemized statement with CDT codes')
              }
              onOpenPatientFile={handleOpenPatientFile}
            />
          )}

          {currentScreen === 'imaging' && (
            <ImagingDiagnosticsScreen
              patient={activePatient}
              onOpenPatientFile={handleOpenPatientFile}
              onAddToTreatmentPlan={handleAddToTreatmentPlan}
            />
          )}

          {currentScreen === 'clinic-settings' && <ClinicSettingsScreen />}

          {currentScreen === 'tokens' && <DesignTokensScreen />}

          {currentScreen === 'auth' && (
            <AuthScreen
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              onLoginSuccess={handleLoginSuccess}
              onLogout={handleLogout}
              onNavigateToDashboard={() => setCurrentScreen('dashboard-calendar')}
            />
          )}
        </main>
      </div>

      {/* Booking Requests Review Modal */}
      <BookingRequestsModal
        isOpen={showBookingRequests}
        onClose={() => setShowBookingRequests(false)}
        onAcceptRequest={handleAcceptBookingRequest}
      />

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        patients={patients}
        onAddAppointment={handleAddAppointment}
      />

      {/* Staff Auth / Terminal Login Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(staffName, role) => {
          handleLoginSuccess(staffName, role);
        }}
      />

      {/* Global Prescription and Invoice Template Preview Modal */}
      <DocumentTemplateModal
        isOpen={showGlobalDocModal}
        onClose={() => setShowGlobalDocModal(false)}
        initialType={globalDocModalType}
        patient={activePatient}
      />
    </div>
  );
}
