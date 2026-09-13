export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: string;
  gender: 'male' | 'female' | 'other';
  userType: 'student' | 'working_professional';
  institutionOrCompany?: string;
  kycStatus: 'Verified' | 'Pending' | 'Not Started';
  emergencyContact: string;
  authProvider: 'google' | 'apple' | 'phone' | 'email';
  dietPreference?: 'veg' | 'jain' | 'non_veg' | 'eggetarian';
  bloodGroup?: string;
}

export type GenderCategory = 'boys' | 'girls' | 'unisex' | 'all';
export type SharingType = 'single' | 'double' | 'triple' | 'four_plus' | 'all';
export type FoodPreference = 'included' | 'veg_only' | 'non_veg' | 'optional' | 'all';

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  isSecurity?: boolean;
}

export interface MealItem {
  time: string;
  title: string;
  items: string;
  isSpecial?: boolean;
  boxAvailable?: boolean;
}

export interface DayFoodMenu {
  day: string; // 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'
  dateNum: number;
  breakfast: MealItem;
  lunch: MealItem;
  dinner: MealItem;
}

export interface CostBreakdown {
  monthlyRent: number;
  securityDeposit: number;
  depositRefundableText: string;
  maintenanceFee: number;
  electricityRateText: string;
  waterChargesText?: string;
  brokerageFee: number; // always 0
  noticePeriodDays: number;
  lockInPeriodMonths: number;
}

export interface BedSlot {
  id: string;
  bedNumber: string; // 'Bed A', 'Bed B'
  roomNumber: string; // 'Room 101'
  floor: number;
  status: 'available' | 'reserved' | 'occupied';
  price: number;
  priceMonthly?: number;
  type: 'Single' | 'Double' | 'Triple';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp?: string;
  time?: string;
  read: boolean;
  type: 'rent' | 'maintenance' | 'food' | 'booking' | 'system';
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  isCurrentResident: boolean;
  durationStayed?: string;
  rating: number;
  date: string;
  content: string;
  subRatings?: {
    food: number;
    cleanliness: number;
    wifi: number;
    security: number;
    management: number;
  };
  categoryRatings?: {
    food: number;
    cleanliness: number;
    wifi: number;
    security: number;
  };
}

export interface PGListing {
  id: string;
  name: string;
  subTitle: string; // e.g. "Block A - Premium"
  location: string;
  city: string;
  area: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceFromUserKm?: number;
  pricePerMonth: number;
  originalPrice?: number;
  isVerified: boolean;
  isFeatured: boolean;
  foodIncluded?: boolean;
  isPureVeg?: boolean;
  rating: number;
  reviewCount: number;
  category: GenderCategory; // boys, girls, unisex
  sharingOptions: ('Single' | 'Double' | 'Triple' | 'Four Sharing')[];
  foodType: 'Included (3 Meals)' | 'Breakfast & Dinner' | 'Self Cooking / Optional';
  images: string[];
  description: string;
  rules: string[];
  costBreakdown: CostBreakdown;
  amenities: {
    id: string;
    title: string;
    icon: string;
    category: 'security' | 'living' | 'convenience';
  }[];
  weeklyFoodMenu: DayFoodMenu[];
  availableBeds: BedSlot[];
  reviews: Review[];
  managerContact: {
    name: string;
    phone: string;
    whatsapp: string;
    responseTime: string;
  };
  nearbyHubs: { name: string; distance: string; type: string }[];
}

export interface BookingRecord {
  id: string;
  bookingCode: string;
  pgId: string;
  pgName: string;
  pgImage: string;
  pgLocation: string;
  roomNumber: string;
  bedNumber: string;
  sharingType: string;
  moveInDate: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  emergencyContact: string;
  idProofType: string;
  monthlyRent: number;
  securityDeposit: number;
  tokenPaid: number;
  dueAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking';
  transactionId: string;
  status: 'confirmed' | 'active' | 'pending_verification' | 'completed';
  createdAt: string;
  rentCycleDay: number;
  wifiCredentials?: { ssid: string; pass: string };
  biometricId?: string;
}

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  pgId: string;
  pgName: string;
  roomNumber: string;
  category: 'Electricity & AC' | 'Plumbing' | 'Wi-Fi & Internet' | 'Cleaning & Hygiene' | 'Carpentry / Furniture' | 'Other';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt?: string;
  assignedStaff?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCity: string;
  genderCategory: GenderCategory;
  sharingType: SharingType;
  foodPreference: FoodPreference;
  maxPrice: number;
  minRating: number;
  verifiedOnly: boolean;
  hasAC: boolean;
  hasAttachedBath: boolean;
  hasBiometric: boolean;
  hasWifi: boolean;
  sortBy: 'recommended' | 'price_low' | 'price_high' | 'rating' | 'distance';
}
