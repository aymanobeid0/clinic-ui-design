export type ScreenId =
  | 'dashboard-calendar'
  | 'patients'
  | 'prescriptions-invoices'
  | 'imaging'
  | 'clinic-settings'
  | 'tokens'
  | 'auth';

export type PatientTabId =
  | 'overview'
  | 'chart'
  | 'treatments'
  | 'billing'
  | 'rx'
  | 'xrays';

export type OperatoryId = 'all' | 'op1' | 'op2' | 'hygiene';

export type DoctorFilter = 'all' | 'sarah' | 'marc';

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  dob: string;
  age: number;
  gender: string;
  bloodType?: string;
  phone: string;
  email: string;
  avatar: string;
  status: 'In Chair' | 'Waiting Room' | 'Completed' | 'Confirmed' | 'Active';
  operatoryRoom?: string;
  assignedDoctor: string;
  primaryInsurance: {
    planName: string;
    policyNumber: string;
    status: string;
    coveragePct: number;
    renewalDate: string;
  };
  medicalAlerts: Array<{
    type: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
  }>;
  vitals?: {
    bloodPressure: string;
    pulse: number;
    spO2: number;
    respiratoryRate: number;
    temperature: string;
    weight: string;
    recordedAt: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
    hipaaAuthorized: boolean;
  };
  perioRisk?: {
    level: 'Low' | 'Moderate' | 'High';
    stage: string;
    bopPct: number;
    plaqueIndex: number;
    deepPocketsCount: number;
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  age: number;
  gender: string;
  timeSlot: string; // e.g. "10:15 - 11:15 AM"
  startTime: string; // e.g. "10:15"
  durationMinutes: number;
  operatory: string;
  doctor: string;
  procedureName: string;
  procedureCode?: string;
  toothTarget?: string;
  status: 'In Chair' | 'Completed' | 'Waiting Room' | 'Confirmed';
  alert: string;
  cost: number;
  copay?: number;
  waStatus?: {
    delivered: boolean;
    confirmedAt?: string;
  };
  canalsInfo?: {
    located: string;
    note: string;
  };
}

export interface ToothCondition {
  number: number; // 1-32 Universal or FDI 11-48
  fdiNumber: number;
  name: string;
  arch: 'maxillary' | 'mandibular';
  quadrant: 1 | 2 | 3 | 4;
  condition: 'healthy' | 'caries' | 'crown' | 'endo' | 'composite' | 'missing' | 'implant';
  surfaces: {
    buccal: boolean;
    lingual: boolean;
    mesial: boolean;
    distal: boolean;
    occlusal: boolean;
  };
  notes?: string;
  probingDepth?: number[]; // [B, M, D]
}

export interface TreatmentPhase {
  phaseNumber: number;
  title: string;
  status: 'completed' | 'in-progress' | 'scheduled' | 'pending';
  progressPct: number;
  subtext: string;
}

export interface TreatmentProcedureItem {
  id: string;
  tooth: string;
  toothType: 'TOOTH' | 'QUAD';
  title: string;
  cdtCode: string;
  status: 'Completed' | 'Pre-auth Approved' | 'In-Progress' | 'Scheduled';
  description: string;
  provider: string;
  dateOrSchedule: string;
  insuranceNote: string;
  totalFee: number;
  copayOrInsEst: number;
  badgeLabel?: string;
}

export interface InvoiceItem {
  id: string;
  date: string;
  procedure: string;
  code: string;
  tooth?: string;
  provider: string;
  billed: number;
  paidIns: number;
  paidPt: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Overdue';
  paymentMethod?: string;
}

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  dosage: string;
  form: string;
  quantity: string;
  instructions: string;
  indication: string;
  datePrescribed: string;
  doctorName: string;
  refillsRemaining: number;
  status: 'Active' | 'Dispensed' | 'Completed';
}

export interface DiagnosticStudy {
  id: string;
  title: string;
  modality: 'OPG 2D' | 'BW Left' | 'BW Right' | 'PA Incisor' | '3D CBCT' | 'Camera 4K';
  time: string;
  teethInvolved: string;
  thumbnail: string;
  specs: string;
  alertsCount?: number;
  resolutionOrDose?: string;
  aiTag?: string;
  findings: Array<{
    title: string;
    confidence: string;
    severity: 'Danger' | 'Warning' | 'Normal';
    description: string;
  }>;
}

export interface BookingRequest {
  id: string;
  patientName: string;
  phone: string;
  channel: 'WhatsApp' | 'Web Portal';
  requestedTime: string;
  requestedDate: string;
  reason: string;
  urgency: 'Emergency' | 'Routine' | 'Follow-up';
  status: 'Pending' | 'Approved' | 'Declined';
}
