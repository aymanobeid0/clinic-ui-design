import { Patient } from '../types/dental';

export interface SearchMatchInfo {
  matched: boolean;
  matchedField?: 'name' | 'dob' | 'mrn' | 'phone' | 'email';
  matchedSnippet?: string;
}

const MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

const SHORT_MONTH_NAMES = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

/**
 * Checks whether a patient matches a search query by Name or Date of Birth (DOB),
 * with real-time support for flexible date formats (dots, slashes, dashes, month names, year-only).
 */
export function matchPatientByNameOrDob(
  patient: Patient,
  rawQuery: string
): SearchMatchInfo {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return { matched: true };
  }

  // 1. Patient Name search (case-insensitive substring)
  if (patient.name.toLowerCase().includes(query)) {
    return {
      matched: true,
      matchedField: 'name',
      matchedSnippet: patient.name,
    };
  }

  // 2. Medical Record Number (MRN) or ID search
  if (
    patient.mrn.toLowerCase().includes(query) ||
    patient.id.toLowerCase().includes(query)
  ) {
    return {
      matched: true,
      matchedField: 'mrn',
      matchedSnippet: patient.mrn,
    };
  }

  // 3. Date of Birth (DOB) search
  const rawDob = (patient.dob || '').toLowerCase();
  if (rawDob) {
    // Exact or substring match in stored format (e.g. "08.14.1984" or "1984")
    if (rawDob.includes(query)) {
      return {
        matched: true,
        matchedField: 'dob',
        matchedSnippet: patient.dob,
      };
    }

    // Strip non-digits for digit-only typing (e.g. user typed "08141984" or "0814")
    const digitsOnlyQuery = query.replace(/\D/g, '');
    const digitsOnlyDob = rawDob.replace(/\D/g, '');
    if (digitsOnlyQuery.length >= 2 && digitsOnlyDob.includes(digitsOnlyQuery)) {
      return {
        matched: true,
        matchedField: 'dob',
        matchedSnippet: patient.dob,
      };
    }

    // Normalized delimiter formats (user types with '/' or '-' or spaces instead of dots)
    const normalizedQuery = query.replace(/[./\\-]/g, '.');
    const normalizedDob = rawDob.replace(/[./\\-]/g, '.');
    if (normalizedDob.includes(normalizedQuery)) {
      return {
        matched: true,
        matchedField: 'dob',
        matchedSnippet: patient.dob,
      };
    }

    // Parse month, day, year components
    const parts = rawDob.split(/[./-]/);
    if (parts.length === 3) {
      let m = 0,
        d = 0,
        y = 0;
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        y = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10);
        d = parseInt(parts[2], 10);
      } else {
        // MM.DD.YYYY
        m = parseInt(parts[0], 10);
        d = parseInt(parts[1], 10);
        y = parseInt(parts[2], 10);
      }

      if (m >= 1 && m <= 12) {
        const fullMonth = MONTH_NAMES[m - 1];
        const shortMonth = SHORT_MONTH_NAMES[m - 1];

        // Format representations e.g. "august 14", "aug 14", "august 1984", "aug 1984"
        const textualRepresentations = [
          `${fullMonth} ${d}`,
          `${shortMonth} ${d}`,
          `${fullMonth} ${d}, ${y}`,
          `${shortMonth} ${d}, ${y}`,
          `${d} ${fullMonth}`,
          `${d} ${shortMonth}`,
          `${d} ${fullMonth} ${y}`,
          `${d} ${shortMonth} ${y}`,
          `${fullMonth} ${y}`,
          `${shortMonth} ${y}`,
          `${fullMonth}`,
          `${shortMonth}`,
          `${y}`,
        ];

        for (const rep of textualRepresentations) {
          if (rep.toLowerCase().includes(query)) {
            return {
              matched: true,
              matchedField: 'dob',
              matchedSnippet: `${patient.dob} (${rep})`,
            };
          }
        }
      }
    }
  }

  // 4. Secondary fallback: Phone or Email
  if (patient.phone.toLowerCase().includes(query)) {
    return {
      matched: true,
      matchedField: 'phone',
      matchedSnippet: patient.phone,
    };
  }
  if (patient.email.toLowerCase().includes(query)) {
    return {
      matched: true,
      matchedField: 'email',
      matchedSnippet: patient.email,
    };
  }

  return { matched: false };
}
