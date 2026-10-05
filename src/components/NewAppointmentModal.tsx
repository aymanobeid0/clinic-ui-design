import React, { useState } from 'react';
import { Appointment, Patient } from '../types/dental';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onAddAppointment: (appointment: Appointment) => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  patients,
  onAddAppointment,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [customName, setCustomName] = useState('');
  const [operatory, setOperatory] = useState('Operatory 1');
  const [doctor, setDoctor] = useState('Dr. Sarah Jenkins');
  const [timeSlot, setTimeSlot] = useState('03:30 PM - 04:15 PM');
  const [procedureName, setProcedureName] = useState('Emergency Toothache Consultation');
  const [toothTarget, setToothTarget] = useState('FDI #36 (Lower Left 1st Molar)');
  const [cost, setCost] = useState(250);
  const [alertNote, setAlertNote] = useState('No known drug allergies reported.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.id === selectedPatientId);
    const pName = selectedPatientId === 'new' ? customName : patientObj?.name || 'Walk-in Patient';

    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      patientId: selectedPatientId === 'new' ? `PT-${Math.floor(10000 + Math.random() * 90000)}` : selectedPatientId,
      patientName: pName,
      age: patientObj?.age || 35,
      gender: patientObj?.gender || 'Male',
      timeSlot,
      startTime: timeSlot.split(' ')[0],
      durationMinutes: 45,
      operatory,
      doctor,
      procedureName,
      toothTarget,
      status: 'Confirmed',
      alert: alertNote,
      cost,
      copay: Math.round(cost * 0.2),
      waStatus: {
        delivered: true,
        confirmedAt: 'Just now',
      },
    };

    onAddAppointment(newAppt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface rounded-2xl shadow-2xl border border-border-card max-w-lg w-full p-5 lg:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-border-divider/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              event_available
            </span>
            <h2 className="text-base font-bold text-text-primary">
              Schedule New Operatory Appointment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          {/* Patient Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-text-secondary font-medium">Select Patient</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (#{p.mrn}) • {p.phone}
                </option>
              ))}
              <option value="new">+ Add Walk-in / New Patient</option>
            </select>
          </div>

          {selectedPatientId === 'new' && (
            <div className="flex flex-col gap-1">
              <label className="text-text-secondary font-medium">Patient Full Name</label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Mark Jansen"
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider text-on-surface"
              />
            </div>
          )}

          {/* Operatory & Doctor Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-text-secondary font-medium">Operatory Suite</label>
              <select
                value={operatory}
                onChange={(e) => setOperatory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider text-on-surface cursor-pointer"
              >
                <option>Operatory 1</option>
                <option>Operatory 2</option>
                <option>Hygiene Suite</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-text-secondary font-medium">Practitioner</label>
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider text-on-surface cursor-pointer"
              >
                <option>Dr. Sarah Jenkins</option>
                <option>Dr. Marc Alami</option>
                <option>Dr. Peter Deck</option>
              </select>
            </div>
          </div>

          {/* Time Slot & Fee */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-text-secondary font-medium">Time Slot (GMT-4)</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider text-on-surface cursor-pointer"
              >
                <option>08:30 AM - 09:15 AM</option>
                <option>10:15 AM - 11:15 AM</option>
                <option>01:30 PM - 02:15 PM</option>
                <option>03:30 PM - 04:15 PM</option>
                <option>04:30 PM - 05:15 PM</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-text-secondary font-medium">Estimated Fee ($)</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider text-on-surface"
              />
            </div>
          </div>

          {/* Procedure & Tooth */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-text-secondary font-medium">Clinical Procedure</label>
              <input
                type="text"
                value={procedureName}
                onChange={(e) => setProcedureName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider text-on-surface"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-text-secondary font-medium">Tooth Target</label>
              <input
                type="text"
                value={toothTarget}
                onChange={(e) => setToothTarget(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider text-on-surface"
              />
            </div>
          </div>

          {/* Clinical Alert */}
          <div className="flex flex-col gap-1">
            <label className="text-text-secondary font-medium">Clinical Warning / Allergy Alert</label>
            <input
              type="text"
              value={alertNote}
              onChange={(e) => setAlertNote(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-border-divider text-on-surface"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-divider/50">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary font-semibold shadow-sm cursor-pointer"
            >
              Save Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
