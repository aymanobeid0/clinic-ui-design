# Operatory Pro — Clinical Dental Design System (design.md)

## 1. Overview & Visual Direction
This design system defines the visual language, token architecture, and component standards for the modern tactile dental operatory web suite. It harmonizes the 4 clinical workspaces:
- **Patient Clinical Overview & Records** (`SCREEN_8`)
- **Dental Imaging & X-Ray Diagnostics Viewer** (`SCREEN_6`)
- **Treatment Plans & Operatory Procedures** (`SCREEN_2`)
- **Chairside Ledger & Financial Billing** (`SCREEN_4`)

The aesthetic balances clean, sterile surgical clarity with approachable, tactile organic ergonomics (smooth radii, subtle floating elevation, and high-legibility clinical contrast).

---

## 2. Color System & Token Tokens

### Primary Brand & Action Tokens
- **`--color-primary-main`**: `#192F86` (Deep Royal Cobalt — primary CTA, active navigation pills, confirmed states)
- **`--color-primary-hover`**: `#14266D` (Interactive hover & pressed state for primary buttons)
- **`--color-primary-tint`**: `#EEF1FA` (Light contrast wash for selected rows, active tabs, subtle badge backings)
- **`--color-primary-subtle`**: `#E3E8FC` (Border accents and highlighted dental tooth indicators)

### Surface & Neutral Cadence
- **`--color-bg-canvas`**: `#F4F6FA` (Soft neutral cool background canvas for the entire workstation)
- **`--color-surface-card`**: `#FFFFFF` (Crisp, solid white clinical surfaces; 100% opacity, no muddy transparency)
- **`--color-surface-subtle`**: `#F8FAFC` (Secondary card fills, inactive input backgrounds, muted header segments)
- **`--color-surface-inset`**: `#F1F3F7` (Probing matrix rows, tooth numbering strips, code preview blocks)

### Border & Division Tokens
- **`--color-border-card`**: `#E6E9F0` (Ultra-subtle 1px boundary for tactile card differentiation)
- **`--color-border-subtle`**: `#EDF0F5` (Internal dividers between patient attributes and appointment timelines)
- **`--color-border-strong`**: `#CBD5E1` (Input borders on hover/focus and divider rules)

### Typography & Ink
- **`--color-text-primary`**: `#0F172A` / `#111827` (High-contrast slate for patient names, clinical diagnosis, CDT codes)
- **`--color-text-secondary`**: `#64748B` (Secondary metadata: insurance policy IDs, tooth labels, timestamps)
- **`--color-text-muted`**: `#94A3B8` (Placeholders, inactive tabs, unselected states)
- **`--color-text-inverted`**: `#FFFFFF` (Pure white on primary blue pills and status chips)

### Semantic & Clinical Status Tokens
- **Success / Completed (`#176544` / `#ECFDF3`)**: Adjudicated claims, completed endo/restorative procedures, active insurance status.
- **Warning / In-Progress (`#B45309` / `#FFFBEB`)**: In-chair treatment, pending lab cases, active phase restorative work.
- **Danger / Critical Allergy (`#B42318` / `#FEF3F2`)**: Penicillin/latex allergies, acute bleeding tendency, past-due balances.
- **Diagnostics & Imaging (`#0369A1` / `#E0F2FE`)**: AI pathology detections, panoramic OPG, bitewings, CBCT 3D volume flags.
- **Odontogram Condition Codes**:
  - Restored/Composite: `#3B82F6` (Electric Blue)
  - Endodontic Obturation: `#EAB308` (Clinical Amber)
  - Full Ceramic/Zirconia: `#A855F7` (Royal Purple)
  - Sound/Healthy: `#10B981` (Emerald)

---

## 3. Typography & Dual-Script Hierarchy
- **Font Family**: Inter (Latin) paired with Alyamama / Tahoma (Arabic / RTL localization), system fallbacks (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`).
- **Tabular Figures (`tnum`)**: Mandatory for CDT procedure codes, monetary balances, FDI tooth coordinates (11–48), and X-ray dose/measurement calipers.

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `display` | 28px–32px | 1.25 | 700 Bold | Patient name in master banner, primary invoice totals |
| `headline-lg` | 22px–24px | 1.3 | 600 SemiBold | View titles (Diagnostics Viewer, Treatment Roadmap) |
| `headline-md` | 18px–20px | 1.35 | 600 SemiBold | Section titles (Active Interventions, AI Triage, Ledger) |
| `headline-sm` | 15px–16px | 1.4 | 600 SemiBold | Card headers, CDT procedure item titles |
| `body-md` | 14px | 1.5 | 400 Regular / 500 Medium | Clinical SOAP notes, provider info, diagnostic details |
| `body-sm` | 12px–13px | 1.4 | 400 Regular / 500 Medium | Timestamps, tooth notation tags, copay breakdowns |
| `caption` | 11px | 1.3 | 600 SemiBold / Uppercase | Sub-labels, sensor metrics, status pills |

---

## 4. Spacing, Radii & Tactile 3D Depth Standard

### 8pt / 4pt Spatial Scale
- `2xs`: `4px` (pill icon gaps, indicator dot margins)
- `xs`: `8px` (button internal padding, chip spacing)
- `sm`: `12px` (inner card element spacing, alert banner padding)
- `md`: `16px` (standard card padding, grid gaps)
- `lg`: `20px` (operatory section padding, panel margins)
- `xl`: `24px` (master container margins, drawer padding)
- `2xl`: `32px` (page canvas outer gutter)

### Corner Radii Hierarchy
- **`10px`**: Interactive buttons, form inputs, counter steppers, dropdown menus.
- **`12px`**: Status chips, drug allergy callout banners, X-ray tool icons.
- **`16px`**: Inner cards, diagnostic thumbnail tiles, procedure rows.
- **`20px`–`24px`**: Main content containers, master patient header banner, terminal drawers.
- **`9999px` (Full Pill)**: Patient action buttons (`Call Patient`, `e-Signed`), category tab navigation buttons.

### Tactile Elevation & Shadows
- **Tier 1 (Base Cards)**: `0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)`
- **Tier 2 (Floating Action Panels & Drawers)**: `0 8px 24px -4px rgba(25, 47, 134, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)`
- **Tier 3 (Clinical Dialogs & Floating Toolbars)**: `0 20px 35px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)`

---

## 5. Component Patterns

### Patient Identity Pill Header
A persistent clinical context banner featuring:
1. Patient Avatar with active status badge.
2. Patient Name, DOB/Age, and prominent Red Critical Allergy tag.
3. Attending Doctor attribution and Primary Insurance PPO with expiration.
4. Next appointment window and quick action buttons (Medical Records, WhatsApp dispatch, Call Patient).

### Operatory Tab Bar
Horizontal smooth pill strip with active cobalt fill and muted gray secondary tabs:
- *General* | *Odontogram* | *Clinical Photos* | *Imaging & X-Ray* | *Treatment Plans* | *eClaims & Ledger* | *Implant Exam*

### Interactive Imaging Tools & Triage Callouts
- Canvas manipulation bar (Pan, Invert, Measure, Calibrate, Window/Level slider).
- Diagnostic findings badges with AI confidence scores (e.g., 94% / 98%).
- Doctor impression signature panel.

### Procedure & Financial Ledger Table
- Structured CDT code badges (`#11 CDT D3330`).
- Progress stepper: Urgent -> Restorative -> Crown/Bridge -> Perio.
- Split payment bar: Ins. Benefit vs. Patient Co-pay with CareCredit or HSA integration.
