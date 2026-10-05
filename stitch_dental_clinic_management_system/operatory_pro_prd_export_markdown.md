# Product Requirements Document (PRD) & Product Brief

**Project Name:** Operatory Pro (DentalCare Practice & Operatory Suite)  
**Document Version:** 1.0.0  
**Target Release:** Q4 2026 / Clinical Phase 1  
**Classification:** Class I Medical Dental Practice Management & Operatory Software  
**Status:** Approved for Engineering & Clinical Review  
**Export Date:** October 2026  
**Primary Brand Action Color:** #192F86 (Deep Royal Cobalt)  
**Design Standards:** WCAG 2.1 AAA Compliant, Tactile 3D Float, Dual-Script LTR/RTL  

---

## 1. Executive Summary & Vision

### 1.1 Problem Statement
Modern dental practices operate under extreme sensory, ergonomic, and cognitive demands. Existing dental software suites (legacy on-premise systems like Dentrix, Eaglesoft, or generic cloud PMS) suffer from:
- Cluttered, dated desktop interfaces with dense text and tiny touch targets unsuitable for gloved, chairside operatory use.
- Severe visual wash-out under intense operatory surgical lighting (5,000–10,000 Lux).
- Disconnected workflows between patient reception, chairside clinical charting, digital diagnostics/radiology, and patient billing.
- Fragile communication channels with patients (unreliable SMS vs. modern structured WhatsApp booking and appointment confirmations).

### 1.2 Product Vision
**Operatory Pro** is a high-precision, tactile, cloud-native dental operatory and practice management workstation. Engineered with ergonomic chairside workflows, zero-latency clinical state caching, high-contrast surgical visibility (WCAG AAA), and integrated bilingual localization (English / Arabic RTL / French), Operatory Pro unifies reception, clinical diagnostics, treatment planning, and chairside financial settlement into a single, cohesive experience.

---

## 2. User Personas & Stakeholders

| Persona | Role | Primary Goals & Core Jobs | Critical Pain Points |
|---|---|---|---|
| **Dr. Sarah Jenkins / Dr. Peter Deck** | Lead Dentist / Prosthodontist | Rapid review of medical alerts/allergies, instant access to radiographic DICOM/bitewings, quick SOAP note signing, accurate tooth-level procedure coding (CDT/FDI). | Tiny buttons impossible to click with surgical gloves; slow loading of CBCT/radiology; high visual fatigue from low contrast. |
| **Elena Rostova / Receptionist** | Clinic Front Desk & Scheduling | Triage daily calendar, process patient arrivals, manage multi-chair utilization, review and confirm incoming WhatsApp appointment requests. | Patient double-bookings across providers; phone tag for confirmations; delayed insurance copay collection. |
| **Michael Chang, RDH** | Dental Hygienist | Record periodontal pocket probing depths, plaque/gingivitis indices, and hygiene scalings without switching applications. | Complicated charting screens; delayed tooth-by-tooth entry. |
| **Robert Chen / Julia Smith** | Patient | Transparent fee estimates, frictionless WhatsApp booking, immediate receipt/e-Rx access on mobile. | Surprise out-of-pocket costs; unclear treatment plan stages. |

---

## 3. Product Architecture & Key Modules

Operatory Pro divides clinic operations into **two synchronized environments**:
1. **Front-of-House Practice Administration (`DentalCare Clinic`)**
2. **Chairside Operatory Surgical Workstation (`Operatory Pro Clinical Suite`)**

```
+-----------------------------------------------------------------------------------+
|                           OPERATORY PRO APPLICATION SUITE                         |
+-----------------------------------------------------------------------------------+
                                          |
         +--------------------------------+--------------------------------+
         |                                                                 |
         v                                                                 v
+--------------------------------------+      +-------------------------------------+
|      1. ADMINISTRATIVE SUITE         |      |       2. OPERATORY WORKSTATION      |
|  - Main Dashboard & Day Schedule     |      |  - Patient Clinical Dossier Header  |
|  - WhatsApp Inbound Booking Triage   |      |  - 3D/2D Odontogram & Tooth Mapping |
|  - Prescriptions & Document Dispatch |      |  - DICOM Radiology & AI Triage View |
|  - Financial Collections & Ledger    |      |  - Multi-Stage Treatment Roadmap    |
|  - Practice & Staff Settings         |      |  - Chairside Terminal & Checkout    |
+--------------------------------------+      +-------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                           FOUNDATIONAL PLATFORM SERVICES                          |
|  - Operatory Pro Design System (WCAG AAA, Tactile 3D Depth, #192F86 Cobalt)      |
|  - Dual-Script Typography & RTL/LTR Engine (Inter + Alyamama / Tahoma)            |
|  - Real-Time Appointment Overlap & Slot Collision Exclusion Engine               |
|  - WhatsApp Cloud Gateway & Template Verification Pipeline                       |
+-----------------------------------------------------------------------------------+
```

---

## 4. Detailed Feature & Functional Specifications

### 4.1 Daily Operatory Schedule & Day Matrix (`U02`, `SCREEN_24`)
- **Proportional Time Grid:** Visual timeline spanning clinic operating hours (08:30 – 18:00) with 15-minute cadence ticks and hour demarcation lines.
- **Dynamic Slot Duration Mapping:** Appointment cards scaled directly to procedure duration (15m, 30m, 45m, 60m, 90m) without rounding up.
- **Multi-Chair / Multi-Doctor Columns:** Simultaneous side-by-side view for Operatory 1 (Dr. Jenkins) and Operatory 2 (Dr. Alami) with quick doctor filtering.
- **Real-Time Chair Utilization Metric:** Live indicator showing daily utilization percentage (e.g., 87% Active), completed vs. in-chair patient tallies, and daily production revenue counters.
- **Quick Inspector Panel:** Selecting an appointment expands patient thumbnail, high-visibility medical alerts (e.g., *Hypertensive, Penicillin Anaphylaxis*), CDT target tooth code, and quick status actions (*Mark Arrived, Reschedule, Open Dossier*).

### 4.2 Inbound WhatsApp Booking & Human-in-the-Loop Triage (`FRONTEND_UX.md`)
- **Patient Journey:** Patient requests date/time via WhatsApp conversational messaging.
- **Human Triage Workflow:** Inbound requests land in a shared clinic queue. Receptionists or attending dentists review request details, verify identity (or register new patient without losing draft), adjust duration/time, and approve.
- **Mutual Broadcast:** Approving or declining triggers automatic WhatsApp updates to both patient phone and requester phone.
- **Zero Double-Booking Guarantee:** Exclusion constraints at both server validation and database level prevent doctor overlaps or patient double-booking across multiple chairs.

### 4.3 Patient Clinical Overview & Records (`SCREEN_2`, `SCREEN_16`)
- **Persistent Dossier Banner:** Displays patient MRN (`#P6L272`), verified active status, attending doctor, primary insurance benefit status, emergency contact, and critical allergy pill flags.
- **Vitals & Perio Risk Strip:** Real-time blood pressure (`118/76 mmHg`), pulse/SpO2 waveform, temperature, plaque index (`18%`), bleeding on probing (`14%`), and pocket depth counts (`>4mm`).
- **Clinical SOAP Notes:** Structured documentation module for Subjective, Objective, Assessment, and Plan with digital doctor signature stamp and license verification.
- **Active eRx Quick Drawer:** Active prescriptions list with allergy cross-check verification tag and one-click dispense authorization.

### 4.4 Dental Imaging & DICOM Radiographic Diagnostics (`SCREEN_6`)
- **Diagnostic Series Reel:** Panoramic Full Arch (OPG 2D), Bitewing Left/Right, Periapical (PA), and CBCT 3D volume selector.
- **DICOM Viewport & Micro-Tools:** Window/Level (W/L) contrast adjustment slider, digital caliper measurement tool (e.g., *14.6 mm Alveolar Crest*), inverted tone mode, zoom loupe, and angle measurement.
- **AI Diagnostic Pathology Triage:** Neural pathology assistance overlay flagging caries demineralization depth (e.g., *Tooth #15 Interproximal 94% Conf.*) and periapical radiolucencies (*Tooth #11 Apex 98% Conf.*).

### 4.5 Multi-Stage Treatment Planning & Procedure Roadmap (`SCREEN_10`)
- **Phased Treatment Stepper:**
  - *Phase 1:* Urgent / Pain Relief (Completed)
  - *Phase 2 (Current):* Restorative & Endodontics (In-Progress)
  - *Phase 3:* Crown & Bridge (Scheduled)
  - *Phase 4:* Periodontal Maintenance (Pending)
- **CDT Procedure Matrix:** Detailed rows showing Tooth notation, CDT code (`D3330 Root Canal`, `D2740 Monolithic Zirconia Crown`), pre-auth approval badges, fee schedules, insurance allowable, and patient copay.
- **Digital Patient Consent:** Tablet-based e-signed consent capture with timestamp and chairside IP audit trail.

### 4.6 Chairside Ledger & Financial Billing (`SCREEN_4`)
- **Split-Payment Visualization:** Real-time breakdown displaying Gross Billed, Delta Dental PPO insurance allowable (`67.1% coverage`), Patient Co-pay paid, and Remaining Balance Due (`$350.00`).
- **Chairside Terminal:** One-touch payment collector supporting Credit Card, Apple Pay, Cash Ledger, and HSA/FSA debit accounts.
- **Electronic Claims (EDI) Tracker:** Adjudicated claim tracker with batch identification and instant resubmit actions.
- **Document Exporter:** Immediate compilation of itemized ADA/CDT statements and annual HSA tax receipts.

---

## 5. UI/UX & Design System Architecture (`design.md`)

### 5.1 Color Architecture & Surface Contrast
To solve the critical visual wash-out problem identified in clinical reviews, Operatory Pro enforces strict luminance separation:
- **Canvas Foundation (`#E2E8F0` / `#EEF2F6`):** Grounded, cool surgical neutral plane.
- **Card Planes (`#FFFFFF`):** 100% opaque clinical white surfaces featuring `border: 1px solid #CBD5E1` and tactile multi-tier drop shadows (`box-shadow: 0 4px 14px rgba(15,23,42,0.08)`).
- **Primary Cobalt (`#192F86`):** High-visibility action token for primary CTAs, active navigation capsules, and confirmed states.
- **Hover/Pressed State (`#14266D`)** & **Primary Tint (`#EEF1FA`)**: Non-glare selection surfaces.

### 5.2 Clinical Semantic Color Matrix
- **Critical Contraindication / Allergy:** `#B42318` on `#FEF3F2` (Crimson)
- **Proposed / Pending / Caution:** `#B45309` on `#FFFBEB` (Clinical Amber)
- **Completed / Adjudicated / Verified:** `#176544` on `#ECFDF3` (Emerald Green)
- **AI Diagnostics & Radiology:** `#0369A1` on `#E0F2FE` (Cyan/Teal)

### 5.3 Odontogram Color Classification
- **Ceramic / Zirconia Crown:** `#A855F7` (Royal Purple)
- **Endodontic Obturation:** `#EAB308` (Clinical Ochre)
- **Composite Restorative:** `#3B82F6` (Electric Blue)
- **Intact Enamel:** `#10B981` (Emerald)

### 5.4 Typography & Dual-Script Standard
- **Latin Font:** `Inter` variable (`400`, `500`, `600`, `700`)
- **Arabic / RTL Font:** `Alyamama` / `Tahoma`
- **Tabular Figures (`tnum`):** Mandatory for all CDT codes, dental fees, and tooth coordinate numbering to eliminate vertical optical jitter during rapid scanning.

### 5.5 Ergonomics & Touch Cadence
- **Minimum Hit Target:** `44px × 44px` across all interactive elements, buttons, and counter steppers to guarantee error-free gloved touch interaction.
- **Corner Radii Hierarchy:** `10px` (buttons, inputs), `12px` (badges), `16px` (sub-cards), `24px` (master panels), `9999px` (pills).

---

## 6. Non-Functional & Technical Requirements

| Dimension | Specification | Verification Metric |
|---|---|---|
| **Form Factor & Device** | Primary: Desktop / Laptop (1440px / 1920px); Secondary: Operatory Chairside Tablet (1024px landscape). | Zero horizontal page scroll; fluid responsive columns down to 1024px. |
| **Performance** | Next-gen SPA/SSR architecture; initial page paint < 1.2s; tab switching < 50ms. | Instantaneous DOM tab shifts via zero-latency state caching. |
| **Accessibility & Contrast** | Compliance with WCAG 2.1 AAA for clinical text and medical alert banners (contrast ratio ≥ 7:1). | Automated Lighthouse Accessibility score ≥ 98. |
| **Security & Compliance** | HIPAA certified, encrypted at rest and in transit (TLS 1.3), HttpOnly SameSite Strict session cookies. | Zero plaintext PHI/PII leakage; explicit session expiration after 12h operatory lock. |
| **Resilience & Offline** | Automatic revalidation on reconnect with preserved form drafts; idempotent mutation IDs (`request-id`). | Zero duplicated payments or appointments on flaky clinic Wi-Fi. |

---

## 7. Release Milestones & Implementation Roadmap

```
Phase 1: Foundations & Shell Architecture (Weeks 1-3)
├── Deliverable 1.1: Design token system implementation (CSS variables, Inter + Alyamama)
├── Deliverable 1.2: Persistent App Shell (Top navigation, Left sidebar, patient dossier banner)
└── Deliverable 1.3: Authentication & 12-hour surgical operatory terminal lock

Phase 2: Core Clinic & Schedule Workflows (Weeks 4-6)
├── Deliverable 2.1: Proportional Day Schedule & Multi-chair calendar (U02)
├── Deliverable 2.2: WhatsApp Inbound Booking Review & Patient Registration flow
└── Deliverable 2.3: Zero-overlap appointment collision engine & slots API

Phase 3: Chairside Clinical Suite (Weeks 7-9)
├── Deliverable 3.1: Patient Clinical Dossier, Vitals & Perio Risk indices (U07)
├── Deliverable 3.2: Interactive 2D/3D Odontogram & universal FDI tooth numbering
├── Deliverable 3.3: Radiographic DICOM / Bitewing viewer with AI triage markers
└── Deliverable 3.4: Treatment plan multi-phase roadmap with digital consent capture

Phase 4: Chairside Financials & Document Engine (Weeks 10-12)
├── Deliverable 4.1: Chairside payment collection terminal & real-time EDI claims tracker
├── Deliverable 4.2: A4/A5 Document template customizer for Prescriptions, Receipts & Statements
└── Deliverable 4.3: Clinical QA, HIPAA penetration testing & pilot clinic onboarding
```

---

## 8. Success Metrics & Key Performance Indicators (KPIs)

1. **Chairside Efficiency:** Reduction in post-treatment documentation time from ~8 minutes to < 2.5 minutes per patient.
2. **Scheduling Friction:** Over 75% of routine appointment requests triaged and confirmed via WhatsApp within 4 minutes.
3. **Billing Velocity:** 95%+ of patient out-of-pocket copays collected chairside prior to patient exiting the operatory.
4. **Clinical Safety:** 100% zero-miss rate on critical medical allergies (penicillin, latex, bleeding tendencies) highlighted across all active views.
