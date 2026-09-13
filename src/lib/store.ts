import { UserProfile, BookingRecord } from '../types';

export interface AppStoreData {
  version: 1;
  user: UserProfile | null;
  bookings: BookingRecord[];
  savedIds: string[];
}

const STORAGE_KEY = 'apnapg_store';

/**
 * Validate that an unknown parsed object matches the required store shape.
 */
function isValidStore(obj: any): obj is AppStoreData {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    obj.version === 1 &&
    Array.isArray(obj.bookings) &&
    Array.isArray(obj.savedIds)
  );
}

/**
 * Reads the stored state from localStorage wrapped in try/catch.
 * Falls back to an empty structure (never to mock data) if parsing fails or data is missing.
 */
export function loadStore(): AppStoreData {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidStore(parsed)) {
        return {
          version: 1,
          user: parsed.user ?? null,
          bookings: parsed.bookings,
          savedIds: parsed.savedIds,
        };
      }
    }

    // Backwards-compatible check for legacy apnapg_user
    let legacyUser: UserProfile | null = null;
    try {
      const legacyRaw = typeof window !== 'undefined' ? localStorage.getItem('apnapg_user') || localStorage.getItem('stayfinder_user') : null;
      if (legacyRaw) {
        legacyUser = JSON.parse(legacyRaw);
      }
    } catch {
      legacyUser = null;
    }

    return {
      version: 1,
      user: legacyUser,
      bookings: [],
      savedIds: [],
    };
  } catch (error) {
    // localStorage can throw in private browsing mode
    return {
      version: 1,
      user: null,
      bookings: [],
      savedIds: [],
    };
  }
}

/**
 * Writes the versioned state to localStorage wrapped in try/catch.
 */
export function saveStore(data: Partial<AppStoreData>): void {
  try {
    if (typeof window === 'undefined') return;
    
    // Read existing store safely
    const current = loadStore();
    const updated: AppStoreData = {
      version: 1,
      user: data.user !== undefined ? data.user : current.user,
      bookings: data.bookings !== undefined ? data.bookings : current.bookings,
      savedIds: data.savedIds !== undefined ? data.savedIds : current.savedIds,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Keep legacy key in sync
    if (updated.user) {
      localStorage.setItem('apnapg_user', JSON.stringify(updated.user));
    } else {
      localStorage.removeItem('apnapg_user');
      localStorage.removeItem('stayfinder_user');
    }
  } catch (error) {
    console.warn('Unable to persist ApnaPG store:', error);
  }
}

/**
 * Clears stored data on logout
 */
export function clearStore(): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('apnapg_user');
    localStorage.removeItem('stayfinder_user');
  } catch (error) {
    console.warn('Unable to clear store:', error);
  }
}
