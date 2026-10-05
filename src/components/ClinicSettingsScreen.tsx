import React, { useState } from 'react';
import { DR_JENKINS_AVATAR } from '../data/mockDentalData';

export const ClinicSettingsScreen: React.FC = () => {
  const [clinicName, setClinicName] = useState(
    'DentalCare Advanced Practice & Implant Center'
  );
  const [whatsAppPhone, setWhatsAppPhone] = useState('+1 (555) 482-9000');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 482-9009');
  const [email, setEmail] = useState('contact@dentalcare-clinic.com');
  const [licenseId, setLicenseId] = useState('DENT-US-883921-IL');
  const [address, setAddress] = useState(
    '742 Evergreen Medical Pavilion, Suite 300, Springfield, IL 62704'
  );
  const [intervalMinutes, setIntervalMinutes] = useState<number>(30);
  const [autoAttachPdf, setAutoAttachPdf] = useState<boolean>(true);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="w-full pb-16">
      <div className="px-4 lg:px-6 py-5 max-w-[1380px] w-full mx-auto flex flex-col gap-6">
        {/* Toast */}
        {saveToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-neutral-700">
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">
              check_circle
            </span>
            <span>Clinic profile and practice rules saved successfully!</span>
          </div>
        )}

        {/* Top Administrative Action Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-1.5 text-text-secondary text-xs mb-1">
              <span>Practice Administration</span>
              <span className="material-symbols-outlined text-[14px]">
                chevron_right
              </span>
              <span className="text-primary font-semibold">
                Clinic Configuration
              </span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">
              Clinic Settings & Practice Administration
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Manage institutional profile, operatory scheduling rules, doctor privileges, and auxiliary personnel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => alert('Add auxiliary staff member form')}
              className="h-10 px-3.5 rounded-lg bg-surface text-on-surface text-xs font-semibold flex items-center gap-1.5 shadow-sm border border-border-card hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">
                person_add
              </span>
              <span>Add Staff</span>
            </button>
            <button
              onClick={() => alert('Add physician/doctor onboarding form')}
              className="h-10 px-3.5 rounded-lg bg-surface text-on-surface text-xs font-semibold flex items-center gap-1.5 shadow-sm border border-border-card hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">
                medical_services
              </span>
              <span>Add Doctor</span>
            </button>
            <button
              onClick={handleSave}
              className="h-10 px-4 rounded-lg bg-primary-container text-on-primary hover:bg-primary-hover text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                save
              </span>
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* 2-Column Configuration Architecture */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Practice Profile & Scheduling Rules */}
          <div className="xl:col-span-6 flex flex-col gap-6">
            {/* Clinic Profile & Brand Card */}
            <div className="bg-surface rounded-xl shadow-sm border border-border-card/60 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-border-divider/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    local_hospital
                  </span>
                  <h2 className="text-sm font-bold text-on-surface">
                    Clinic Profile & Brand
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-success-tint text-tertiary-container text-xs font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Verified Facility
                </span>
              </div>

              {/* Logo Presentation Box */}
              <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border-divider/50">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-surface shadow-2xs flex items-center justify-center p-2 border border-border-card">
                    <span className="material-symbols-outlined text-[32px] text-primary">
                      dentistry
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface">
                      Registered Clinic Trademark
                    </span>
                    <span className="text-[11px] text-text-secondary">
                      Official seal printed on prescriptions & statements
                    </span>
                    <span className="text-[11px] text-primary font-mono font-semibold mt-0.5">
                      dentalcare_vector_master.svg
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => alert('Select new logo image')}
                  className="h-8 px-3 rounded-lg bg-surface text-on-surface hover:bg-surface-container text-xs font-semibold shadow-2xs border border-border-card cursor-pointer"
                >
                  Change Logo
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-text-secondary font-medium">
                    Official Clinic Name
                  </label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-text-secondary font-medium">
                      Primary Desk (WhatsApp)
                    </label>
                    <span className="text-emerald-700 text-[10px] font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">
                        check_circle
                      </span>{' '}
                      Sync Active
                    </span>
                  </div>
                  <input
                    type="text"
                    value={whatsAppPhone}
                    onChange={(e) => setWhatsAppPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-text-secondary font-medium">
                    Secondary / Emergency Phone
                  </label>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-text-secondary font-medium">
                    Practice Inquiries Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-text-secondary font-medium">
                    Tax / License Registration ID
                  </label>
                  <input
                    type="text"
                    value={licenseId}
                    onChange={(e) => setLicenseId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-text-secondary font-medium">
                    Physical Operatory Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface border border-border-divider focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Working Hours & Schedule Rules Card */}
            <div className="bg-surface rounded-xl shadow-sm border border-border-card/60 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-border-divider/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    schedule
                  </span>
                  <h2 className="text-sm font-bold text-on-surface">
                    Working Hours & Booking Rules
                  </h2>
                </div>
                <span className="text-xs text-text-secondary">
                  Central Standard Time (CST)
                </span>
              </div>

              {/* Rows */}
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-surface-container-low rounded-lg gap-2 border border-border-divider/50">
                  <div className="flex items-center gap-2 min-w-[130px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-on-surface">
                      Monday – Friday
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-surface rounded border border-border-divider font-mono">
                      08:30 AM
                    </span>
                    <span className="text-text-secondary">to</span>
                    <span className="px-2 py-1 bg-surface rounded border border-border-divider font-mono">
                      06:00 PM
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-success-tint text-tertiary-container font-semibold">
                    Open (9.5 hrs)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-surface-container-low rounded-lg gap-2 border border-border-divider/50">
                  <div className="flex items-center gap-2 min-w-[130px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span className="font-semibold text-on-surface">
                      Saturday
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-surface rounded border border-border-divider font-mono">
                      09:00 AM
                    </span>
                    <span className="text-text-secondary">to</span>
                    <span className="px-2 py-1 bg-surface rounded border border-border-divider font-mono">
                      02:00 PM
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-semibold">
                    Half Day
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-surface-container-low rounded-lg gap-2 opacity-80 border border-border-divider/50">
                  <div className="flex items-center gap-2 min-w-[130px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-outline" />
                    <span className="font-semibold text-on-surface">Sunday</span>
                  </div>
                  <span className="text-text-secondary italic">
                    Facility sanitization & emergency on-call only
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold">
                    Closed
                  </span>
                </div>
              </div>

              {/* Operatory Interval Selector */}
              <div className="bg-primary-tint rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-primary/10">
                <div>
                  <p className="text-xs font-bold text-primary">
                    Standard Operatory Appointment Interval
                  </p>
                  <p className="text-[11px] text-secondary">
                    Default calendar grid division for chair turn-over
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-surface p-1 rounded-lg shadow-xs border border-border-card">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setIntervalMinutes(mins)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                        intervalMinutes === mins
                          ? 'bg-primary-container text-on-primary shadow-xs'
                          : 'text-text-secondary hover:text-on-surface'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Doctors, Aux Staff & Document Print Rules */}
          <div className="xl:col-span-6 flex flex-col gap-6">
            {/* Doctors & Specialists Section */}
            <div className="bg-surface rounded-xl shadow-sm border border-border-card/60 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-border-divider/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    stethoscope
                  </span>
                  <h2 className="text-sm font-bold text-on-surface">
                    Doctors & Specialists
                  </h2>
                </div>
                <button
                  onClick={() => alert('New doctor credentialing form')}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  + Add Doctor
                </button>
              </div>

              {/* Doctor 1 */}
              <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border-divider/50 shadow-2xs">
                <div className="flex items-center gap-3">
                  <img
                    alt="Dr. Sarah Jenkins"
                    className="w-12 h-12 rounded-full object-cover shadow-2xs shrink-0 ring-2 ring-primary-tint"
                    src={DR_JENKINS_AVATAR}
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface truncate">
                        Dr. Sarah Jenkins, DMD
                      </span>
                      <span className="px-2 py-0.2 rounded-full bg-success-tint text-tertiary-container text-[10px] font-semibold">
                        Active
                      </span>
                    </div>
                    <span className="text-[11px] text-text-secondary truncate">
                      Lead Dental Surgeon & Implantologist
                    </span>
                    <div className="flex items-center gap-2 text-text-secondary text-[11px] mt-0.5">
                      <span>License #IL-49821</span>
                      <span>•</span>
                      <span className="text-primary font-medium">
                        Operatory: Room 1
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => alert('Privileges & ACL settings for Dr. Jenkins')}
                    className="h-8 px-2.5 rounded-lg bg-surface text-on-surface text-xs font-semibold shadow-2xs border border-border-card"
                  >
                    Permissions
                  </button>
                  <button
                    onClick={() => alert('Edit Doctor Profile')}
                    className="h-8 px-2.5 rounded-lg bg-primary-container text-on-primary text-xs font-semibold shadow-2xs"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Doctor 2 */}
              <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border-divider/50 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-sm font-bold shrink-0">
                    MA
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface truncate">
                        Dr. Marc Alami, DDS
                      </span>
                      <span className="px-2 py-0.2 rounded-full bg-success-tint text-tertiary-container text-[10px] font-semibold">
                        Active
                      </span>
                    </div>
                    <span className="text-[11px] text-text-secondary truncate">
                      Orthodontics & Endodontics Specialist
                    </span>
                    <div className="flex items-center gap-2 text-text-secondary text-[11px] mt-0.5">
                      <span>License #IL-51209</span>
                      <span>•</span>
                      <span className="text-primary font-medium">
                        Operatory: Room 2
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => alert('Privileges & ACL settings for Dr. Alami')}
                    className="h-8 px-2.5 rounded-lg bg-surface text-on-surface text-xs font-semibold shadow-2xs border border-border-card"
                  >
                    Permissions
                  </button>
                  <button
                    onClick={() => alert('Edit Doctor Profile')}
                    className="h-8 px-2.5 rounded-lg bg-primary-container text-on-primary text-xs font-semibold shadow-2xs"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Auxiliary Staff & Receptionists Table */}
            <div className="bg-surface rounded-xl shadow-sm border border-border-card/60 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-border-divider/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    badge
                  </span>
                  <h2 className="text-sm font-bold text-on-surface">
                    Clinic Staff & Receptionists
                  </h2>
                </div>
                <button
                  onClick={() => alert('Add staff form')}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  + Add Staff
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-surface-container-low text-text-secondary font-semibold uppercase text-[11px]">
                      <th className="py-2 px-3 rounded-l-lg">Staff Member</th>
                      <th className="py-2 px-3">Role & Desk</th>
                      <th className="py-2 px-3">Scope Access</th>
                      <th className="py-2 px-3 text-right rounded-r-lg">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-divider/40">
                    <tr className="hover:bg-surface-container-low/50">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-bold text-[11px]">
                            ER
                          </div>
                          <div>
                            <p className="font-semibold text-on-surface leading-tight">
                              Elena Rostova
                            </p>
                            <p className="text-[10px] text-text-secondary">
                              Primary Desk Operator
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-on-surface block">
                          Reception & Intake
                        </span>
                        <span className="text-[10px] text-text-secondary">
                          WhatsApp Desk Active
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-primary-tint text-primary text-[10px] font-semibold">
                          Bookings & Invoices
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button className="text-outline hover:text-on-surface">
                          <span className="material-symbols-outlined text-[16px]">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-surface-container-low/50">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px]">
                            MC
                          </div>
                          <div>
                            <p className="font-semibold text-on-surface leading-tight">
                              Michael Chang, RDH
                            </p>
                            <p className="text-[10px] text-text-secondary">
                              Clinical Hygienist
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-on-surface block">
                          Hygiene Suite 1
                        </span>
                        <span className="text-[10px] text-text-secondary">
                          Full Ultrasonic Rig
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-primary-tint text-primary text-[10px] font-semibold">
                          Appointments & Odontogram
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button className="text-outline hover:text-on-surface">
                          <span className="material-symbols-outlined text-[16px]">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-surface-container-low/50">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-bold text-[11px]">
                            NV
                          </div>
                          <div>
                            <p className="font-semibold text-on-surface leading-tight">
                              Nadia Vance
                            </p>
                            <p className="text-[10px] text-text-secondary">
                              Surgical Assistant
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-on-surface block">
                          Operatories 1 & 2
                        </span>
                        <span className="text-[10px] text-text-secondary">
                          Autoclave & Inventory
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-primary-tint text-primary text-[10px] font-semibold">
                          Clinical Notes
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button className="text-outline hover:text-on-surface">
                          <span className="material-symbols-outlined text-[16px]">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Document Templates & Printing Settings */}
            <div className="bg-surface rounded-xl shadow-sm border border-border-card/60 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-border-divider/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    print
                  </span>
                  <h2 className="text-sm font-bold text-on-surface">
                    Document Templates & Printing (A4 / A5)
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-semibold">
                  Thermal & Laser
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-surface-container-low rounded-xl flex flex-col justify-between gap-1 border border-border-divider/50">
                  <div>
                    <span className="font-bold text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[17px]">
                        receipt
                      </span>
                      Rx Prescription Paper Format
                    </span>
                    <p className="text-[11px] text-text-secondary mt-1">
                      Configured for standard dental prescription pads.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-1 border-t border-border-divider/50">
                    <span className="px-2 py-0.5 bg-surface text-primary font-bold rounded shadow-2xs">
                      A5 Landscape
                    </span>
                    <span className="text-text-secondary text-[11px]">
                      Header: DentalCare Official
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl flex flex-col justify-between gap-1 border border-border-divider/50">
                  <div>
                    <span className="font-bold text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[17px]">
                        request_quote
                      </span>
                      Patient Invoice & Tax Bill
                    </span>
                    <p className="text-[11px] text-text-secondary mt-1">
                      Itemized with CDT procedure code breakdowns.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-1 border-t border-border-divider/50">
                    <span className="px-2 py-0.5 bg-surface text-primary font-bold rounded shadow-2xs">
                      A4 Portrait
                    </span>
                    <span className="text-text-secondary text-[11px]">
                      VAT & Tax ID Included
                    </span>
                  </div>
                </div>
              </div>

              {/* Auto PDF Toggle */}
              <div className="pt-2 flex items-center justify-between border-t border-border-divider/50">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    send_to_mobile
                  </span>
                  <div>
                    <p className="text-xs font-bold text-on-surface leading-tight">
                      Auto-attach PDF to WhatsApp receipt
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      Sends verified PDF bill directly to patient upon checkout
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoAttachPdf((prev) => !prev)}
                  className={`w-11 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                    autoAttachPdf ? 'bg-primary-container' : 'bg-surface-container-high'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                      autoAttachPdf ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
