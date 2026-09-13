import { PGListing, BookingRecord, MaintenanceTicket } from '../types';
import { PROPERTIES_DATA } from './properties';
import mockDataJson from './mockData.json';

export const INITIAL_USER = mockDataJson.user;

export const MOCK_NOTIFICATIONS = mockDataJson.notifications as Array<{
  id: string;
  title: string;
  message: string;
  time: string;
  timestamp: string;
  read: boolean;
  type: 'rent' | 'maintenance' | 'food';
}>;

export const INITIAL_NOTIFICATIONS = MOCK_NOTIFICATIONS;

// Export canonical properties as the single source of truth for listings
export const MOCK_PG_LISTINGS: PGListing[] = PROPERTIES_DATA;

export const INITIAL_USER_BOOKINGS: BookingRecord[] = mockDataJson.bookings as BookingRecord[];

export const INITIAL_BOOKING = INITIAL_USER_BOOKINGS[0];

export const INITIAL_MAINTENANCE_TICKETS: MaintenanceTicket[] = mockDataJson.maintenanceTickets as MaintenanceTicket[];

