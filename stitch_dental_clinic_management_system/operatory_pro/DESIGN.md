---
name: Operatory Pro
colors:
  surface: '#fef8f8'
  surface-dim: '#ded9d9'
  surface-bright: '#fef8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2f2'
  surface-container: '#f2eced'
  surface-container-high: '#ece7e7'
  surface-container-highest: '#e7e1e1'
  on-surface: '#1d1b1b'
  on-surface-variant: '#454652'
  inverse-surface: '#323030'
  inverse-on-surface: '#f5efef'
  outline: '#757683'
  outline-variant: '#c5c5d3'
  surface-tint: '#4458af'
  primary: '#001868'
  on-primary: '#ffffff'
  primary-container: '#192f86'
  on-primary-container: '#899cf8'
  inverse-primary: '#b9c3ff'
  secondary: '#595f65'
  on-secondary: '#ffffff'
  secondary-container: '#dde3eb'
  on-secondary-container: '#5f656c'
  tertiary: '#002918'
  on-tertiary: '#ffffff'
  tertiary-container: '#004128'
  on-tertiary-container: '#67b089'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b9c3ff'
  on-primary-fixed: '#001257'
  on-primary-fixed-variant: '#2b3f95'
  secondary-fixed: '#dde3eb'
  secondary-fixed-dim: '#c1c7ce'
  on-secondary-fixed: '#161c22'
  on-secondary-fixed-variant: '#41474e'
  tertiary-fixed: '#a8f3c8'
  tertiary-fixed-dim: '#8cd6ad'
  on-tertiary-fixed: '#002112'
  on-tertiary-fixed-variant: '#005234'
  background: '#fef8f8'
  on-background: '#1d1b1b'
  surface-variant: '#e7e1e1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 1.75rem
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
  space-2xl: 1.75rem
  space-3xl: 2rem
---

## Brand & Style
Operatory Pro is an institutional clinical operating system engineered for dental practitioners, surgical specialists, and modern dental networks. It projects clinical precision, high reliability, and calm authority under high-stress chairside environments. 

The aesthetic is Modern Corporate with functional clinical clarity. It balances pristine white operatory cards with low-contrast slate-blue structural containers, avoiding visual fatigue through generous padding, soft micro-elevations, and immediate high-visibility alert semantics.

## Colors
The palette centers on deep royal sapphire (`#192f86`) paired with soft clinical steel neutrals (`#8d939a` and `#fff9f9`) to maintain high legibility against true white surfaces (`#ffffff`). 

- **Primary Roles**: `#192f86` serves as the dominant anchor for critical actions, selected navigation states, and primary buttons. Active states shift to `#14266d`.
- **Secondary Roles**: `#8d939a` and soft tint `#d4e4f9` support secondary iconography, badges, sub-navigation tabs, and clinical metadata.
- **Semantic Color Tiers**:
  - Danger: `#ba1a1a` set against `#ffdad6` for medical warnings, drug interactions, and acute allergies.
  - Warning: `#854d0e` on `#fffaeb` for perio risks, dosage watch, and non-blocking cautions.
  - Success/Normal: `#176544` on `#ecfdf3` for completed treatments, negative pathology, and active insurance coverage.
- **Canvas Neutrals**: The page foundation sits on `#f9f9f9`, layered with elevated white cards (`#ffffff`) and nested recessed panels (`#fff9f9`).

## Typography
Typographic rhythm relies uniformly on `Inter` across all headings, values, and functional labels to prioritize optical legibility in dense charting interfaces. 

Tight negative tracking (`-0.02em` to `-0.01em`) is reserved for high-prominence patient identity headlines (`display` and `headline-lg`), while uppercase meta captions and clinical category labels employ positive tracking (`0.01em` to `0.02em`) with medium-to-semibold weights for rapid parsing. Tabular numerals and clinical teeth indexes (#1–32) should adhere to standard monospace or tabular figures where applicable.

## Layout & Spacing
The layout follows a persistent vertical fixed rail navigation (80px width) combined with a pinned frosted header (64px height). 

- **Grid Strategy**: The main content wrapper spans up to a max width of `1380px` centered, utilizing a 12-column desktop grid:
  - Left rail (3 columns): Medical alerts, vitals monitor, emergency contacts, and periodontal risk metrics.
  - Central stage (6 columns): Odontogram tooth mapping, SOAP progress records, and appointment schedules.
  - Right rail (3 columns): Phased treatment plans, active eRx pharmacy manifests, and chairside quick actions.
- **Responsive Adaptation**: Below `1024px` (tablet/mobile), the 3-column layout collapses into a single-column stacked view with the Odontogram and Alert cards prioritizing the visual hierarchy.
- **Rhythm**: Element padding standardizes on `space-md` (16px) for interior components and `space-xl` (24px) for primary surface cards.

## Elevation & Depth
Elevation is constructed via layered tonal planes and diffused ambient drop shadows rather than heavy structural borders:

1. **Base Plane**: Global canvas foundation at `#f9f9f9`.
2. **Surface Cards**: Primary white surfaces (`#ffffff`) cast a diffuse sapphire-tinted shadow (`0 4px 24px rgba(25, 47, 134, 0.06)`) on hero profile containers, and neutral soft shadows (`0 1px 3px rgba(0, 0, 0, 0.04)`) on standard data modules.
3. **Recessed Wells**: Data tiles, vital readouts, and odontogram matrices use `#fff9f9` with subtle interior depth (`shadow-inner`) to delineate nested interaction zones.
4. **Overlay Elements**: The top bar utilizes a light frosted glass treatment (`bg-surface/80` with `backdrop-blur-xl` and `shadow-[0_1px_8px_rgba(0,0,0,0.04)]`) to maintain context over scrolling patient data.

## Shapes
Operatory Pro uses a refined modern rounded aesthetic (Level 2). 

- **Master Profile & Hero Containers**: Use `rounded-3xl` (24px) for prominent welcoming cards.
- **Standard Clinical Cards & Modals**: Standardized at `rounded-2xl` (16px).
- **Nested Data Blocks & Alert Boxes**: Use `rounded-xl` (12px).
- **Buttons & Interactive Indicators**: Call-to-action buttons, search bars, and sub-nav tabs utilize `rounded-full` pills to maintain a friendly, approachable touch footprint chairside.

## Components

### Buttons
- **Primary Action**: Pill shape (`rounded-full`), `bg-primary-container` (`#192f86`), text white, `shadow-md`, with hover state `#14266d`.
- **Secondary / Action Tiles**: `rounded-xl` to `rounded-2xl`, background `#fff9f9`, text `#8d939a`, transitioning to `#d4e4f9` and `#192f86` on hover.
- **Quick Operatory Action Buttons**: Square/tall rounded cards (`rounded-xl`), centered icons (20px), label below in `font-label-sm`.

### Chips & Badges
- **Status Tags**: Pill shape (`rounded-full`), height 22–26px, padding `px-2.5 py-0.5`. Text styled with `label-sm` or `text-xs font-semibold`.
  - Alert/Critical: `bg-danger-tint` with text `danger`.
  - Caution/Warning: `bg-warning-tint` with text `warning`.
  - Verified/Active: `bg-success-tint` with text `tertiary`.
  - Informational/Provider: `bg-secondary-container` with text `primary`.

### Cards & Modules
- Primary modules are true white (`#ffffff`), `rounded-2xl`, padded with `space-md` or `space-lg`, bounded by faint ambient shadow.
- Interior items are structured into recessed containers (`bg-surface-container-low`) with `rounded-xl` borders to group related metrics (e.g., Blood Pressure, Plaque Index).

### Sub-Navigation Bar
- Horizontally scrollable capsule bar (`rounded-2xl`, `bg-surface`, `shadow-sm`).
- Tab items styled as `rounded-full` pills: active tab uses `bg-primary-container` with `text-on-primary`; inactive tabs use subtle text `#8d939a` with hover transition to `#fff9f9`.

### Odontogram & Vitals Visualization
- Tooth matrix items use miniature white cards with rounded corners, centered tooth icons (20px), tooth numbering (1–32) in 10px monospace, and condition-coded status pips (e.g., Indigo for crowns, Amber for composites, Rose for caries).
- Sparklines and meters utilize SVG stroked paths (2px stroke width, rounded caps) and segmented pill progress bars.