import { BookingRecord } from '../types';

// Crockford's Base32 alphabet: 0-9, A-Z excluding I, L, O, U to prevent misreading
const CROCKFORD_BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/**
 * Generates a collision-resistant, human-readable booking reference.
 * Format: PG-AHM-YYMMDD-XXXX
 *
 * NOTE: In a multi-tenant production environment, a server-side database uniqueness constraint
 * and retry transaction (e.g. PostgreSQL UNIQUE column with fallback) is required.
 */
export function generateBookingCode(existingBookings: BookingRecord[] = []): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const datePrefix = `PG-AHM-${yy}${mm}${dd}`;

  const existingCodes = new Set(existingBookings.map((b) => b.bookingCode));

  // Up to 10 collision-retry attempts
  for (let attempt = 0; attempt < 10; attempt++) {
    const randomBytes = new Uint8Array(4);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(randomBytes);
    } else {
      for (let i = 0; i < 4; i++) {
        randomBytes[i] = Math.floor(Math.random() * 256);
      }
    }

    let codeSuffix = '';
    for (let i = 0; i < 4; i++) {
      codeSuffix += CROCKFORD_BASE32[randomBytes[i] % CROCKFORD_BASE32.length];
    }

    const fullCode = `${datePrefix}-${codeSuffix}`;
    if (!existingCodes.has(fullCode)) {
      return fullCode;
    }
  }

  // Fallback unique timestamp suffix if tight loop
  return `${datePrefix}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

/**
 * Generates safe biometric gate pass ID without double hyphens
 * e.g., BIO-DEV-8821 or BIO-RES-4912
 */
export function generateBiometricId(tenantName: string): string {
  const clean = (tenantName || '').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
  const prefix = clean.length > 0 ? clean : 'RES';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `BIO-${prefix}-${num}`;
}
