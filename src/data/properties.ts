import { BedSlot, DayFoodMenu, GenderCategory, PGListing, Review, SharingType } from '../types';

// ============================================================================
// Shared Currency & Number Formatter (Single source of truth for INR)
// ============================================================================
export const formatINR = (n: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
};

// ============================================================================
// Normalized Bed & Room Types
// ============================================================================
export interface CanonicalBed {
  id: string;
  bedLabel: string; // 'Bed A', 'Bed B'
  roomNumber: string; // bare "201" - NO "Room" prefix
  floor: number;
  sharingType: 'single' | 'double' | 'triple' | 'four';
  priceMonthly: number;
  status: 'available' | 'occupied';
}

export const SHARING_LABEL: Record<string, string> = {
  single: 'Single sharing',
  double: 'Double sharing',
  triple: 'Triple sharing',
  four: 'Four sharing',
  four_plus: '4+ sharing',
};

export const GENDER_CATEGORY_LABEL: Record<GenderCategory, string> = {
  boys: 'Boys',
  girls: 'Girls',
  unisex: 'Unisex',
  all: 'All',
};

// ============================================================================
// Generate Real Current Week Food Menu Strip
// ============================================================================
export const getDynamicWeeklyMenu = (): DayFoodMenu[] => {
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ...
  // Calculate Monday of current week
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  const daysShort = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const sampleMenus = [
    {
      breakfast: { time: '7:30 – 9:30 AM', title: 'Breakfast', items: 'Aloo Paratha with Fresh Curd, Pickle & Masala Chai', boxAvailable: true },
      lunch: { time: '12:30 – 2:30 PM', title: 'Lunch', items: 'Rajma Masala, Jeera Rice, Phulka Rotis & Crisp Cucumber Salad', boxAvailable: true },
      dinner: { time: '8:00 – 10:00 PM', title: 'Dinner', items: 'Paneer Butter Masala, Dal Tadka, Steamed Rice & Hot Chapatis', boxAvailable: false },
    },
    {
      breakfast: { time: '7:30 – 9:30 AM', title: 'Breakfast', items: 'Poha with Roasted Peanuts, Sev, Fresh Lemon & Mint Chutney', boxAvailable: true },
      lunch: { time: '12:30 – 2:30 PM', title: 'Lunch', items: 'Gujarati Khatti Meethi Dal, Bhindi Fry, Steamed Rice & Phulkas', boxAvailable: true },
      dinner: { time: '8:00 – 10:00 PM', title: 'Dinner', items: 'Chole Masala, Butter Naan / Phulkas, Onion Rings & Gulab Jamun', boxAvailable: false },
    },
    {
      breakfast: { time: '7:30 – 9:30 AM', title: 'Breakfast', items: 'Steamed Idli Sambar with Coconut Chutney & Filter Coffee', boxAvailable: true },
      lunch: { time: '12:30 – 2:30 PM', title: 'Lunch', items: 'Kadhi Pakoda, Aloo Jeera, Steamed Basmati Rice & Rotis', boxAvailable: true },
      dinner: { time: '8:00 – 10:00 PM', title: 'Dinner', items: 'Mix Vegetable Korma, Yellow Dal Fry, Jeera Rice & Hot Rotis', boxAvailable: false },
    },
    {
      breakfast: { time: '7:30 – 9:30 AM', title: 'Breakfast', items: 'Methi Thepla with Sweet Chhunda, White Butter & Masala Chai', boxAvailable: true },
      lunch: { time: '12:30 – 2:30 PM', title: 'Lunch', items: 'Dal Fry, Baingan Bharta, Steamed Rice & Phulka Rotis', boxAvailable: true },
      dinner: { time: '8:00 – 10:00 PM', title: 'Dinner', items: 'Matar Paneer, Dal Makhani, Pulao & Phulka Rotis', boxAvailable: false },
    },
    {
      breakfast: { time: '7:30 – 9:30 AM', title: 'Breakfast', items: 'Masala Vegetable Upma with Coconut Chutney & Fresh Seasonal Fruit', boxAvailable: true },
      lunch: { time: '12:30 – 2:30 PM', title: 'Lunch', items: 'Dal Palak, Aloo Gobhi Dry, Chapati & Steamed Rice', boxAvailable: true },
      dinner: { time: '8:00 – 10:00 PM', title: 'Dinner', items: 'Pav Bhaji Feast with Butter Toasted Pav, Masala Papad & Kheer', boxAvailable: false },
    },
    {
      breakfast: { time: '8:00 – 10:00 AM', title: 'Breakfast', items: 'Toasted Club Vegetable Sandwich with Green Mint Chutney & Juice', boxAvailable: true },
      lunch: { time: '12:30 – 2:30 PM', title: 'Lunch', items: 'Hyderabadi Veg Biryani with Boondi Raita & Roasted Papad', boxAvailable: true },
      dinner: { time: '8:00 – 10:00 PM', title: 'Dinner', items: 'Dal Bati Churma Special Weekend Thali with Ghee & Garlic Chutney', boxAvailable: false },
    },
    {
      breakfast: { time: '8:00 – 10:30 AM', title: 'Breakfast', items: 'Khaman Dhokla, Crispy Hot Jalebi & Special Masala Chai', boxAvailable: false },
      lunch: { time: '12:30 – 3:00 PM', title: 'Lunch', items: 'Shahi Paneer, Kashmiri Pulao, Butter Naan & Rasgulla Special Thali', boxAvailable: false },
      dinner: { time: '8:00 – 10:00 PM', title: 'Dinner', items: 'Kathiyawadi Khichdi Kadhi Comfort Meal with Ringan Olo & Ghee', boxAvailable: false },
    },
  ];

  return daysShort.map((dayName, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const m = sampleMenus[idx % sampleMenus.length];
    return {
      day: dayName,
      dateNum: d.getDate(),
      breakfast: m.breakfast,
      lunch: m.lunch,
      dinner: m.dinner,
    };
  });
};

// ============================================================================
// Canonical Property Definition Shape
// ============================================================================
export interface CanonicalProperty {
  id: string;
  name: string;
  slug: string;
  subTitle: string; // e.g. "Block A • Premium"
  location: string;
  area: string; // e.g. "Thaltej"
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceFromUserKm: number;
  isVerified: boolean;
  isFeatured: boolean;
  category: GenderCategory;
  sharingOptions: ('Single' | 'Double' | 'Triple' | 'Four Sharing')[];
  foodType: 'Included (3 Meals)' | 'Breakfast & Dinner' | 'Self Cooking / Optional';
  images: string[];
  description: string;
  rules: string[];
  // Policies (Single source of truth)
  policies: {
    refundWindowText: string;
    noticePeriodText: string;
    deductionConditions: string;
    houseRulesSummary: string;
  };
  // Wi-Fi and Security Credentials
  credentials: {
    networkName: string; // SSID
    networkPassword: string;
    biometricPrefix: string;
  };
  // Bed Inventory (Single source of truth)
  beds: CanonicalBed[];
  // Distinct Reviews
  reviews: Review[];
  managerContact: {
    name: string;
    phone: string;
    whatsapp: string;
    responseTime: string;
  };
  nearbyHubs: { name: string; distance: string; type: string }[];
  amenities: {
    id: string;
    title: string;
    icon: string;
    category: 'security' | 'living' | 'convenience';
  }[];
}

// ============================================================================
// Canonical Properties Data
// ============================================================================
export const CANONICAL_PROPERTIES: CanonicalProperty[] = [
  {
    id: 'raj-pg-thaltej',
    name: 'Raj PG',
    slug: 'raj-pg',
    subTitle: 'Block A • Premium • Thaltej, Ahmedabad',
    location: 'Thaltej, Ahmedabad-Gujarat',
    area: 'Thaltej',
    city: 'Ahmedabad',
    coordinates: {
      lat: 23.0525,
      lng: 72.5186,
    },
    distanceFromUserKm: 1.2,
    isVerified: true,
    isFeatured: true,
    category: 'boys',
    sharingOptions: ['Single', 'Double', 'Triple'],
    foodType: 'Included (3 Meals)',
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&auto=format&fit=crop&q=80',
    ],
    description:
      'Raj PG offers hotel-grade comfort designed for working professionals and students in Ahmedabad. Located right beside SG Highway and Thaltej Metro Station, with zero brokerage, dedicated fiber internet, and hygienic North & Gujarati meals.',
    rules: [
      'Quiet hours from 10:30 PM to 6:30 AM',
      'Biometric access open 24/7 (Late gate pass logged on app)',
      'Visitors allowed in lounge area until 8:00 PM',
      'Non-smoking and alcohol-free premises',
    ],
    policies: {
      refundWindowText: 'Refunded within 2 business days of vacating following room inspection',
      noticePeriodText: '30 days advance notice submitted via app',
      deductionConditions: 'Nil deductions except unpaid electricity meter balance or verified physical damage',
      houseRulesSummary: 'Zero smoking, quiet hours after 10:30 PM, visitor registration at reception',
    },
    credentials: {
      networkName: 'RajPG_Fiber_5G',
      networkPassword: 'RajStay@Secure2026',
      biometricPrefix: 'RAJ',
    },
    beds: [
      { id: 'b1', bedLabel: 'Bed A', roomNumber: '201', floor: 2, sharingType: 'double', priceMonthly: 10000, status: 'available' },
      { id: 'b2', bedLabel: 'Bed B', roomNumber: '201', floor: 2, sharingType: 'double', priceMonthly: 10000, status: 'occupied' },
      { id: 'b3', bedLabel: 'Bed A', roomNumber: '202', floor: 2, sharingType: 'double', priceMonthly: 10000, status: 'available' },
      { id: 'b4', bedLabel: 'Bed B', roomNumber: '202', floor: 2, sharingType: 'double', priceMonthly: 10000, status: 'available' },
      { id: 'b5', bedLabel: 'Bed A', roomNumber: '301', floor: 3, sharingType: 'single', priceMonthly: 15000, status: 'available' },
      { id: 'b6', bedLabel: 'Bed A', roomNumber: '302', floor: 3, sharingType: 'triple', priceMonthly: 8500, status: 'occupied' },
      { id: 'b7', bedLabel: 'Bed B', roomNumber: '302', floor: 3, sharingType: 'triple', priceMonthly: 8500, status: 'available' },
      { id: 'b8', bedLabel: 'Bed C', roomNumber: '302', floor: 3, sharingType: 'triple', priceMonthly: 8500, status: 'occupied' },
    ],
    reviews: [
      {
        id: 'rev-raj-1',
        authorName: 'Arjun Kulkarni',
        isCurrentResident: true,
        durationStayed: '8 months resident',
        rating: 5,
        date: '2 weeks ago',
        content:
          'I had a great experience staying at Raj PG. The rooms are clean, well-maintained, and comfortable. Food quality is consistently good and feels like a home-cooked meal.',
        subRatings: { food: 4.8, cleanliness: 4.9, wifi: 5.0, security: 5.0, management: 4.8 },
      },
      {
        id: 'rev-raj-2',
        authorName: 'Rakesh Patel',
        isCurrentResident: true,
        durationStayed: '1 year resident',
        rating: 4,
        date: '1 month ago',
        content:
          'Solid accommodation close to the metro. Rooms are cleaned daily and laundry machines work well. Dinner gets crowded between 8:30 and 9:00 PM, but the staff keeps things moving.',
        subRatings: { food: 4.2, cleanliness: 4.6, wifi: 4.8, security: 4.9, management: 4.5 },
      },
      {
        id: 'rev-raj-3',
        authorName: 'Mohit Sharma',
        isCurrentResident: true,
        durationStayed: '5 months resident',
        rating: 5,
        date: '2 months ago',
        content:
          'Zero brokerage is completely genuine. Deposit terms were clearly recorded on the agreement and the high-speed fiber connection has zero drops during my US shift calls.',
        subRatings: { food: 4.7, cleanliness: 4.8, wifi: 5.0, security: 5.0, management: 4.7 },
      },
      {
        id: 'rev-raj-4',
        authorName: 'Aakash Verma',
        isCurrentResident: false,
        durationStayed: 'Former resident (6 months)',
        rating: 3,
        date: '3 months ago',
        content:
          'Good amenities and prompt maintenance when our AC remote broke. However, street traffic noise from the highway can be heard from front-facing 2nd floor rooms. Ask for a courtyard-facing room if you are a light sleeper.',
        subRatings: { food: 3.8, cleanliness: 4.2, wifi: 4.5, security: 4.8, management: 4.0 },
      },
      {
        id: 'rev-raj-5',
        authorName: 'Parth Joshi',
        isCurrentResident: true,
        durationStayed: '3 months resident',
        rating: 4,
        date: '4 months ago',
        content:
          'The mess menu rotation is great, especially Sunday thali and Wednesday Kadhi Pakoda. Housekeeping staff are very respectful. Overall great value for money in Thaltej.',
        subRatings: { food: 4.5, cleanliness: 4.7, wifi: 4.6, security: 4.8, management: 4.4 },
      },
    ],
    managerContact: {
      name: 'Ramesh Patel',
      phone: '+919428011223',
      whatsapp: '+919428011223',
      responseTime: 'Replies in ~5 mins',
    },
    nearbyHubs: [
      { name: 'Thaltej Metro Station', distance: '400 m', type: 'Metro' },
      { name: 'Acropolis Mall & SG Highway', distance: '1.1 km', type: 'Shopping' },
      { name: 'Zydus Hospital', distance: '1.8 km', type: 'Hospital' },
    ],
    amenities: [
      { id: 'a1', title: 'Biometric Entry', icon: 'Fingerprint', category: 'security' },
      { id: 'a2', title: 'CCTV 24/7', icon: 'Cctv', category: 'security' },
      { id: 'a3', title: 'High-speed Wi-Fi', icon: 'Wifi', category: 'convenience' },
      { id: 'a4', title: 'Washing Machine', icon: 'WashingMachine', category: 'living' },
      { id: 'a5', title: 'Security Guard', icon: 'ShieldCheck', category: 'security' },
      { id: 'a6', title: 'RO Water Purifier', icon: 'Droplets', category: 'living' },
      { id: 'a7', title: 'Daily Housekeeping', icon: 'Sparkles', category: 'living' },
      { id: 'a8', title: 'Power Backup', icon: 'Zap', category: 'convenience' },
      { id: 'a9', title: 'Study Desk & Chair', icon: 'BookOpen', category: 'living' },
    ],
  },
  {
    id: 'darshan-pg-bodakdev',
    name: 'Darshan PG',
    slug: 'darshan-pg',
    subTitle: 'Premium Co-Living Hub • Bodakdev, Ahmedabad',
    location: 'Bodakdev, Ahmedabad-Gujarat',
    area: 'Bodakdev',
    city: 'Ahmedabad',
    coordinates: {
      lat: 23.0378,
      lng: 72.512,
    },
    distanceFromUserKm: 2.1,
    isVerified: true,
    isFeatured: true,
    category: 'unisex',
    sharingOptions: ['Single', 'Double'],
    foodType: 'Included (3 Meals)',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
    ],
    description:
      'Darshan PG offers wooden decor, bunk pods with private privacy curtains, reading lights, and dedicated ergonomic workstations. Ideal for IT professionals working on Sindhu Bhavan Road.',
    rules: [
      'Quiet hours from 11:00 PM to 6:00 AM',
      'Digital keycard entry at all floor access points',
      'Separate female and male wings with dedicated access credentials',
    ],
    policies: {
      refundWindowText: 'Refunded within 2 business days of vacating following room inspection',
      noticePeriodText: '30 days advance notice submitted via app',
      deductionConditions: 'Nil deductions except unpaid electricity meter balance or verified physical damage',
      houseRulesSummary: 'Designated quiet work areas, zero smoking, visitor passes required',
    },
    credentials: {
      networkName: 'Darshan_CoLive_Guest',
      networkPassword: 'Bodakdev@Stay2026',
      biometricPrefix: 'DAR',
    },
    beds: [
      { id: 'db1', bedLabel: 'Bed A', roomNumber: '102', floor: 1, sharingType: 'double', priceMonthly: 12500, status: 'available' },
      { id: 'db2', bedLabel: 'Bed B', roomNumber: '102', floor: 1, sharingType: 'double', priceMonthly: 12500, status: 'available' },
      { id: 'db3', bedLabel: 'Bed A', roomNumber: '401', floor: 4, sharingType: 'single', priceMonthly: 18000, status: 'available' },
      { id: 'db4', bedLabel: 'Bed B', roomNumber: '401', floor: 4, sharingType: 'single', priceMonthly: 18000, status: 'occupied' },
    ],
    reviews: [
      {
        id: 'rev-dar-1',
        authorName: 'Sneha Patel',
        isCurrentResident: true,
        durationStayed: '6 months resident',
        rating: 5,
        date: '3 weeks ago',
        content:
          'Security is exceptional. As a female resident returning from late evening corporate shifts, the biometric wing lock and 24/7 security team give complete peace of mind.',
        subRatings: { food: 4.6, cleanliness: 5.0, wifi: 4.9, security: 5.0, management: 4.8 },
      },
      {
        id: 'rev-dar-2',
        authorName: 'Chirag Desai',
        isCurrentResident: true,
        durationStayed: '4 months resident',
        rating: 4,
        date: '1 month ago',
        content:
          'Great study pods with personal reading lights. The gym room is clean and has free weights and a treadmill. Walking distance from Sindhu Bhavan cafes.',
        subRatings: { food: 4.3, cleanliness: 4.7, wifi: 4.8, security: 4.9, management: 4.6 },
      },
      {
        id: 'rev-dar-3',
        authorName: 'Nidhi Shah',
        isCurrentResident: false,
        durationStayed: 'Former resident (9 months)',
        rating: 4,
        date: '3 months ago',
        content:
          'Food is hygienic and light on oil. My security deposit was returned within 48 hours to my UPI account after the checkout room inspection.',
        subRatings: { food: 4.4, cleanliness: 4.8, wifi: 4.7, security: 5.0, management: 4.9 },
      },
      {
        id: 'rev-dar-4',
        authorName: 'Kunal Singhal',
        isCurrentResident: true,
        durationStayed: '2 months resident',
        rating: 3,
        date: '4 months ago',
        content:
          'High quality rooms and very modern vibe. However parking space for cars on weekends is tight. 2-wheeler parking is plenty.',
        subRatings: { food: 4.0, cleanliness: 4.5, wifi: 4.8, security: 4.7, management: 4.2 },
      },
    ],
    managerContact: {
      name: 'Darshan Joshi',
      phone: '+919898044556',
      whatsapp: '+919898044556',
      responseTime: 'Replies in ~2 mins',
    },
    nearbyHubs: [
      { name: 'Sindhu Bhavan Road', distance: '800 m', type: 'IT Hub' },
      { name: 'PVR Acropolis', distance: '1.4 km', type: 'Entertainment' },
    ],
    amenities: [
      { id: 'd1', title: 'Biometric Entry', icon: 'Fingerprint', category: 'security' },
      { id: 'd2', title: 'CCTV 24/7', icon: 'Cctv', category: 'security' },
      { id: 'd3', title: 'High-speed Wi-Fi', icon: 'Wifi', category: 'convenience' },
      { id: 'd4', title: 'Washing Machine', icon: 'WashingMachine', category: 'living' },
      { id: 'd5', title: 'Fitness Gym Room', icon: 'Dumbbell', category: 'living' },
      { id: 'd6', title: 'RO Water Purifier', icon: 'Droplets', category: 'living' },
    ],
  },
  {
    id: 'sarda-pg-satellite',
    name: 'Sarda PG',
    slug: 'sarda-pg',
    subTitle: 'Budget & Student Friendly • Satellite, Ahmedabad',
    location: 'Satellite, Ahmedabad-Gujarat',
    area: 'Satellite',
    city: 'Ahmedabad',
    coordinates: {
      lat: 23.0305,
      lng: 72.5255,
    },
    distanceFromUserKm: 2.8,
    isVerified: true,
    isFeatured: false,
    category: 'girls',
    sharingOptions: ['Double', 'Triple'],
    foodType: 'Included (3 Meals)',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1000&auto=format&fit=crop&q=80',
    ],
    description:
      'Safe, homely, and well-maintained girls PG with biometric facial recognition entrance, resident lady warden, RO drinking water, and delicious pure vegetarian home food.',
    rules: [
      'Exclusively girls accommodation with verified biometric access',
      'Curfew time: 10:30 PM (permission easily granted through app gate pass)',
      'Visitors allowed in ground floor reception lounge only',
    ],
    policies: {
      refundWindowText: 'Refunded within 2 business days of vacating following room inspection',
      noticePeriodText: '30 days advance notice submitted via app',
      deductionConditions: 'Nil deductions except unpaid electricity meter balance or verified physical damage',
      houseRulesSummary: 'Warden on site 24/7, app-based late pass logging, strictly female guests in rooms',
    },
    credentials: {
      networkName: 'Sarda_Girls_Secure',
      networkPassword: 'Satellite@Safe2026',
      biometricPrefix: 'SAR',
    },
    beds: [
      { id: 'sb1', bedLabel: 'Bed A', roomNumber: '204', floor: 2, sharingType: 'double', priceMonthly: 8500, status: 'available' },
      { id: 'sb2', bedLabel: 'Bed B', roomNumber: '204', floor: 2, sharingType: 'double', priceMonthly: 8500, status: 'occupied' },
      { id: 'sb3', bedLabel: 'Bed A', roomNumber: '101', floor: 1, sharingType: 'triple', priceMonthly: 7000, status: 'available' },
      { id: 'sb4', bedLabel: 'Bed B', roomNumber: '101', floor: 1, sharingType: 'triple', priceMonthly: 7000, status: 'available' },
      { id: 'sb5', bedLabel: 'Bed C', roomNumber: '101', floor: 1, sharingType: 'triple', priceMonthly: 7000, status: 'occupied' },
    ],
    reviews: [
      {
        id: 'rev-sar-1',
        authorName: 'Pooja Trivedi',
        isCurrentResident: true,
        durationStayed: '10 months resident',
        rating: 5,
        date: '1 week ago',
        content:
          'Best PG in Satellite area for female students and interns. Extremely hygienic washrooms, comfortable spring beds, and the food tastes just like home. Lady warden is very kind and helpful.',
        subRatings: { food: 4.9, cleanliness: 4.8, wifi: 4.6, security: 5.0, management: 4.9 },
      },
      {
        id: 'rev-sar-2',
        authorName: 'Megha Dave',
        isCurrentResident: true,
        durationStayed: '5 months resident',
        rating: 4,
        date: '1 month ago',
        content:
          'Warm atmosphere and great security. App based gate pass makes weekend visits to family very convenient without paperwork.',
        subRatings: { food: 4.5, cleanliness: 4.7, wifi: 4.5, security: 5.0, management: 4.7 },
      },
      {
        id: 'rev-sar-3',
        authorName: 'Ritu Sen',
        isCurrentResident: false,
        durationStayed: 'Former resident (1 year)',
        rating: 4,
        date: '2 months ago',
        content:
          'Good study environment and prompt housekeeping. Water purifiers and washing machines are maintained in pristine condition.',
        subRatings: { food: 4.3, cleanliness: 4.6, wifi: 4.7, security: 4.9, management: 4.6 },
      },
    ],
    managerContact: {
      name: 'Mrs. Sarda Patel',
      phone: '+919723455667',
      whatsapp: '+919723455667',
      responseTime: 'Replies in ~10 mins',
    },
    nearbyHubs: [
      { name: 'Shivranjani Crossroads', distance: '600 m', type: 'Transit' },
      { name: 'ISRO Colony', distance: '1.2 km', type: 'Landmark' },
    ],
    amenities: [
      { id: 's1', title: 'Biometric Entry', icon: 'Fingerprint', category: 'security' },
      { id: 's2', title: 'CCTV 24/7', icon: 'Cctv', category: 'security' },
      { id: 's3', title: 'High-speed Wi-Fi', icon: 'Wifi', category: 'convenience' },
      { id: 's4', title: 'Washing Machine', icon: 'WashingMachine', category: 'living' },
      { id: 's5', title: 'Lady Warden on Site', icon: 'ShieldCheck', category: 'security' },
      { id: 's6', title: 'RO Water Purifier', icon: 'Droplets', category: 'living' },
    ],
  },
  {
    id: 'shree-ji-co-living-navrangpura',
    name: 'Shreeji Co-Living',
    slug: 'shreeji-co-living',
    subTitle: 'Modern Tech Sanctuary • Navrangpura, Ahmedabad',
    location: 'Navrangpura, Ahmedabad-Gujarat',
    area: 'Navrangpura',
    city: 'Ahmedabad',
    coordinates: {
      lat: 23.0365,
      lng: 72.5598,
    },
    distanceFromUserKm: 3.5,
    isVerified: true,
    isFeatured: true,
    category: 'unisex',
    sharingOptions: ['Single', 'Double'],
    foodType: 'Included (3 Meals)',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80',
    ],
    description:
      'Located near Ahmedabad University and CEPT. Includes 300 Mbps dual fiber lines, rooftop cafeteria, study lounge, and table tennis.',
    rules: [
      'Respect quiet co-working hours in shared lounge',
      'App-based transparent bill settlement',
      'Visitors allowed in community rooftop area',
    ],
    policies: {
      refundWindowText: 'Refunded within 2 business days of vacating following room inspection',
      noticePeriodText: '30 days advance notice submitted via app',
      deductionConditions: 'Nil deductions except unpaid electricity meter balance or verified physical damage',
      houseRulesSummary: 'Quiet working areas, keycard access on each floor, clean desk policy in study hall',
    },
    credentials: {
      networkName: 'Shreeji_300Mbps_Fiber',
      networkPassword: 'Navrangpura@Pro2026',
      biometricPrefix: 'SHR',
    },
    beds: [
      { id: 'sjb1', bedLabel: 'Bed A', roomNumber: '305', floor: 3, sharingType: 'double', priceMonthly: 11000, status: 'available' },
      { id: 'sjb2', bedLabel: 'Bed B', roomNumber: '305', floor: 3, sharingType: 'double', priceMonthly: 11000, status: 'available' },
      { id: 'sjb3', bedLabel: 'Bed A', roomNumber: '306', floor: 3, sharingType: 'single', priceMonthly: 17000, status: 'available' },
    ],
    reviews: [
      {
        id: 'rev-shr-1',
        authorName: 'Vikas Mehta',
        isCurrentResident: true,
        durationStayed: '4 months resident',
        rating: 5,
        date: '2 weeks ago',
        content:
          'Superb internet connection in Navrangpura. As a developer handling production deployments, zero power cuts with generator backup and 300 Mbps speed is unmatched.',
        subRatings: { food: 4.6, cleanliness: 4.9, wifi: 5.0, security: 4.9, management: 4.8 },
      },
      {
        id: 'rev-shr-2',
        authorName: 'Tanvi Shah',
        isCurrentResident: true,
        durationStayed: '6 months resident',
        rating: 4,
        date: '1 month ago',
        content:
          'Rooftop lounge is great for evening breaks. The walk to Ahmedabad University takes under 8 minutes. Very convenient.',
        subRatings: { food: 4.4, cleanliness: 4.7, wifi: 4.9, security: 4.8, management: 4.5 },
      },
      {
        id: 'rev-shr-3',
        authorName: 'Harshvardhan R.',
        isCurrentResident: false,
        durationStayed: 'Former resident (8 months)',
        rating: 4,
        date: '3 months ago',
        content:
          'Great student and startup crowd. The automated monthly rent receipts were accepted immediately for HRA tax exemption with no landlord hassle.',
        subRatings: { food: 4.2, cleanliness: 4.6, wifi: 5.0, security: 4.8, management: 4.7 },
      },
    ],
    managerContact: {
      name: 'Kunal Shah',
      phone: '+919879122334',
      whatsapp: '+919879122334',
      responseTime: 'Replies in ~3 mins',
    },
    nearbyHubs: [
      { name: 'Ahmedabad University', distance: '700 m', type: 'Education' },
      { name: 'CEPT Campus', distance: '900 m', type: 'Education' },
    ],
    amenities: [
      { id: 'sj1', title: 'Biometric Entry', icon: 'Fingerprint', category: 'security' },
      { id: 'sj2', title: 'CCTV 24/7', icon: 'Cctv', category: 'security' },
      { id: 'sj3', title: 'Fiber Wi-Fi 300 Mbps', icon: 'Wifi', category: 'convenience' },
      { id: 'sj4', title: 'Smart Laundry', icon: 'WashingMachine', category: 'living' },
      { id: 'sj5', title: 'Rooftop Lounge', icon: 'Coffee', category: 'living' },
      { id: 'sj6', title: 'Power Backup', icon: 'Zap', category: 'convenience' },
    ],
  },
  {
    id: 'vastrapur-lake-residency',
    name: 'Vastrapur Heights PG',
    slug: 'vastrapur-heights',
    subTitle: 'Block B • Lake View • Vastrapur, Ahmedabad',
    location: 'Vastrapur, Ahmedabad-Gujarat',
    area: 'Vastrapur',
    city: 'Ahmedabad',
    coordinates: {
      lat: 23.036,
      lng: 72.5305,
    },
    distanceFromUserKm: 2.4,
    isVerified: true,
    isFeatured: false,
    category: 'boys',
    sharingOptions: ['Single', 'Double', 'Triple'],
    foodType: 'Included (3 Meals)',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&auto=format&fit=crop&q=80',
    ],
    description:
      'Serene lake-facing PG near IIM Ahmedabad and AlphaOne Mall. Fully air-conditioned rooms, attached balconies, regular housekeeping, and wholesome meals.',
    rules: [
      'Quiet studying environment',
      'Biometric access verification for all entry and exit',
      'Cleanliness audit every Sunday',
    ],
    policies: {
      refundWindowText: 'Refunded within 2 business days of vacating following room inspection',
      noticePeriodText: '30 days advance notice submitted via app',
      deductionConditions: 'Nil deductions except unpaid electricity meter balance or verified physical damage',
      houseRulesSummary: 'Balcony quiet hours from 10:30 PM, no loud speakers, registered guests only',
    },
    credentials: {
      networkName: 'Vastrapur_Heights_WiFi',
      networkPassword: 'LakeView@Fast2026',
      biometricPrefix: 'VAS',
    },
    beds: [
      { id: 'vhb1', bedLabel: 'Bed A', roomNumber: '202', floor: 2, sharingType: 'double', priceMonthly: 9500, status: 'available' },
      { id: 'vhb2', bedLabel: 'Bed B', roomNumber: '202', floor: 2, sharingType: 'double', priceMonthly: 9500, status: 'available' },
      { id: 'vhb3', bedLabel: 'Bed A', roomNumber: '301', floor: 3, sharingType: 'single', priceMonthly: 14000, status: 'available' },
    ],
    reviews: [
      {
        id: 'rev-vas-1',
        authorName: 'Deepak Rao',
        isCurrentResident: true,
        durationStayed: '3 months resident',
        rating: 4,
        date: '2 weeks ago',
        content:
          'Very close to Vastrapur Lake for evening jogs. Mess food is hygienic and less oily. Housekeeping is very regular.',
        subRatings: { food: 4.4, cleanliness: 4.6, wifi: 4.3, security: 4.7, management: 4.3 },
      },
      {
        id: 'rev-vas-2',
        authorName: 'Karan Mehra',
        isCurrentResident: true,
        durationStayed: '7 months resident',
        rating: 5,
        date: '1 month ago',
        content:
          'Balcony view is peaceful. Great proximity to IIM campus for library access and Ahmedabad One Mall for weekend shopping.',
        subRatings: { food: 4.6, cleanliness: 4.8, wifi: 4.7, security: 4.9, management: 4.6 },
      },
    ],
    managerContact: {
      name: 'Jayeshbhai',
      phone: '+919825199887',
      whatsapp: '+919825199887',
      responseTime: 'Replies in ~15 mins',
    },
    nearbyHubs: [
      { name: 'IIM Ahmedabad', distance: '1.2 km', type: 'Education' },
      { name: 'Ahmedabad One Mall', distance: '700 m', type: 'Shopping' },
    ],
    amenities: [
      { id: 'vh1', title: 'Biometric Entry', icon: 'Fingerprint', category: 'security' },
      { id: 'vh2', title: 'CCTV 24/7', icon: 'Cctv', category: 'security' },
      { id: 'vh3', title: 'High-speed Wi-Fi', icon: 'Wifi', category: 'convenience' },
      { id: 'vh4', title: 'Washing Machine', icon: 'WashingMachine', category: 'living' },
      { id: 'vh5', title: 'RO Water Purifier', icon: 'Droplets', category: 'living' },
      { id: 'vh6', title: 'Balcony View', icon: 'Sun', category: 'living' },
    ],
  },
];

// ============================================================================
// Helper: Convert Canonical Property to Compatible PGListing
// Ensures single source of truth for price, deposit, bed inventory, reviews,
// policies, and weekly menu
// ============================================================================
export const canonicalToPGListing = (prop: CanonicalProperty): PGListing => {
  // Derive minimum bed price as base monthly rent
  const prices = prop.beds.map((b) => b.priceMonthly);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 10000;
  // Security deposit rule: exactly 2 * minPrice
  const securityDeposit = minPrice * 2;

  // Derive reviews aggregate
  const reviewCount = prop.reviews.length;
  const ratingSum = prop.reviews.reduce((acc, r) => acc + r.rating, 0);
  const rating = reviewCount > 0 ? parseFloat((ratingSum / reviewCount).toFixed(1)) : 4.5;

  // Convert CanonicalBed to BedSlot
  const availableBeds: BedSlot[] = prop.beds.map((b) => {
    let typeName: 'Single' | 'Double' | 'Triple' = 'Double';
    if (b.sharingType === 'single') typeName = 'Single';
    else if (b.sharingType === 'triple' || b.sharingType === 'four') typeName = 'Triple';

    return {
      id: b.id,
      bedNumber: b.bedLabel,
      roomNumber: b.roomNumber,
      floor: b.floor,
      status: b.status,
      price: b.priceMonthly,
      type: typeName,
    };
  });

  return {
    id: prop.id,
    name: prop.name,
    subTitle: prop.subTitle,
    location: prop.location,
    city: prop.city,
    area: prop.area,
    coordinates: prop.coordinates,
    distanceFromUserKm: prop.distanceFromUserKm,
    pricePerMonth: minPrice,
    originalPrice: Math.round(minPrice * 1.15),
    isVerified: prop.isVerified,
    isFeatured: prop.isFeatured,
    foodIncluded: prop.foodType.includes('Included'),
    isPureVeg: true,
    rating,
    reviewCount,
    category: prop.category,
    sharingOptions: prop.sharingOptions,
    foodType: prop.foodType,
    images: prop.images,
    description: prop.description,
    rules: prop.rules,
    costBreakdown: {
      monthlyRent: minPrice,
      securityDeposit,
      depositRefundableText: `100% Refundable within 2 business days of vacating`,
      maintenanceFee: 0,
      electricityRateText: '₹10 / unit sub-metered',
      waterChargesText: 'Included in rent (24/7 RO purifiers)',
      brokerageFee: 0,
      noticePeriodDays: 30,
      lockInPeriodMonths: 1,
    },
    amenities: prop.amenities,
    weeklyFoodMenu: getDynamicWeeklyMenu(),
    availableBeds,
    reviews: prop.reviews,
    managerContact: prop.managerContact,
    nearbyHubs: prop.nearbyHubs,
  };
};

export const PROPERTIES_DATA: PGListing[] = CANONICAL_PROPERTIES.map(canonicalToPGListing);
