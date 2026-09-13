import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MOCK_PG_LISTINGS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER,
} from './data/mockData';
import { PGListing, FilterState, BedSlot, BookingRecord, MaintenanceTicket, Review, NotificationItem, UserProfile } from './types';
import { loadStore, saveStore, clearStore } from './lib/store';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { NearYouMapPreview } from './components/NearYouMapPreview';
import { PGCard } from './components/PGCard';
import { AuthModal } from './components/AuthModal';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { Footer } from './components/LegalPages';
import { Sparkles, Building2, Shield, Search, Key } from 'lucide-react';

// Bundle splitting: Lazy-loaded routes and secondary views
const PGDetailModal = lazy(() =>
  import('./components/PGDetailModal').then((m) => ({ default: m.PGDetailModal }))
);
const BookingModal = lazy(() =>
  import('./components/BookingModal').then((m) => ({ default: m.BookingModal }))
);
const InteractiveMapView = lazy(() =>
  import('./components/InteractiveMapView').then((m) => ({ default: m.InteractiveMapView }))
);
const ResidentManagementView = lazy(() =>
  import('./components/ResidentManagementView').then((m) => ({ default: m.ResidentManagementView }))
);
const SavedFavoritesView = lazy(() =>
  import('./components/SavedFavoritesView').then((m) => ({ default: m.SavedFavoritesView }))
);
const ProfileView = lazy(() =>
  import('./components/ProfileView').then((m) => ({ default: m.ProfileView }))
);
const FilterModal = lazy(() =>
  import('./components/FilterModal').then((m) => ({ default: m.FilterModal }))
);
const NotificationsModal = lazy(() =>
  import('./components/NotificationsModal').then((m) => ({ default: m.NotificationsModal }))
);
const WriteReviewModal = lazy(() =>
  import('./components/WriteReviewModal').then((m) => ({ default: m.WriteReviewModal }))
);
const TermsPage = lazy(() =>
  import('./components/LegalPages').then((m) => ({ default: m.TermsPage }))
);
const PrivacyPage = lazy(() =>
  import('./components/LegalPages').then((m) => ({ default: m.PrivacyPage }))
);
const NotFoundPage = lazy(() =>
  import('./components/LegalPages').then((m) => ({ default: m.NotFoundPage }))
);

const ViewLoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center p-12 min-h-[50vh]">
    <div className="w-8 h-8 border-3 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  // Authentication & Onboarding state - persisted in store
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return loadStore().user;
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(() => {
    return !loadStore().user;
  });

  // Core application state
  const [listings, setListings] = useState<PGListing[]>(MOCK_PG_LISTINGS);
  const [selectedCity, setSelectedCity] = useState<string>('Ahmedabad');
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [selectedPG, setSelectedPG] = useState<PGListing | null>(null);
  const [bookingPG, setBookingPG] = useState<PGListing | null>(null);
  const [bookingInitialBed, setBookingInitialBed] = useState<BedSlot | undefined>(undefined);
  const [favorites, setFavorites] = useState<string[]>(() => loadStore().savedIds);
  const [bookings, setBookings] = useState<BookingRecord[]>(() => loadStore().bookings);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(
    INITIAL_MAINTENANCE_TICKETS
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Filter sheet active tracking to hide bottom nav
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Modals visibility
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showWriteReviewModal, setShowWriteReviewModal] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Route & URL sync with view tabs and modals
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveTab('explore');
      setSelectedPG(null);
      setBookingPG(null);
    } else if (path === '/saved') {
      setActiveTab('saved');
      setSelectedPG(null);
      setBookingPG(null);
    } else if (path === '/mystay') {
      setActiveTab('mystay');
      setSelectedPG(null);
      setBookingPG(null);
    } else if (path === '/profile') {
      setActiveTab('profile');
      setSelectedPG(null);
      setBookingPG(null);
    } else if (path === '/map') {
      setActiveTab('map');
      setSelectedPG(null);
      setBookingPG(null);
    } else if (path.startsWith('/pg/')) {
      const pgId = path.replace('/pg/', '');
      const found = listings.find((p) => p.id === pgId);
      if (found) {
        setSelectedPG(found);
        setBookingPG(null);
      }
    } else if (path.startsWith('/book/')) {
      const pgId = path.replace('/book/', '');
      const found = listings.find((p) => p.id === pgId);
      if (found) {
        setBookingPG(found);
        setSelectedPG(null);
      }
    }
  }, [location.pathname, listings]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'explore') navigate('/');
    else if (tab === 'saved') navigate('/saved');
    else if (tab === 'mystay') navigate('/mystay');
    else if (tab === 'profile') navigate('/profile');
    else if (tab === 'map') navigate('/map');
  };

  const handleSelectPG = (pg: PGListing) => {
    setSelectedPG(pg);
    setBookingPG(null);
    navigate(`/pg/${pg.id}`);
  };

  const handleClosePG = () => {
    setSelectedPG(null);
    setBookingPG(null);
    if (location.pathname.startsWith('/pg/') || location.pathname.startsWith('/book/')) {
      navigate('/');
    }
  };

  const handleOpenBooking = (pg: PGListing, selectedBed?: BedSlot) => {
    setBookingPG(pg);
    setBookingInitialBed(selectedBed);
    setSelectedPG(null);
    navigate(`/book/${pg.id}`);
  };

  const handleCloseBooking = () => {
    const prevPG = bookingPG;
    setBookingPG(null);
    if (prevPG) {
      setSelectedPG(prevPG);
      navigate(`/pg/${prevPG.id}`);
    } else {
      navigate('/');
    }
  };

  // Persistent storage sync
  useEffect(() => {
    saveStore({ savedIds: favorites });
  }, [favorites]);

  useEffect(() => {
    saveStore({ bookings });
  }, [bookings]);

  useEffect(() => {
    saveStore({ user: currentUser });
  }, [currentUser]);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    maxPrice: 30000,
    genderCategory: 'all',
    foodPreference: 'all',
    sharingType: 'all',
    verifiedOnly: false,
    hasAC: false,
    hasBiometric: false,
    minRating: 0,
    sortBy: 'recommended',
    selectedCity: 'Ahmedabad',
    hasAttachedBath: false,
    hasWifi: false,
  });

  // When user logs in and completes pre-details
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('apnapg_user', JSON.stringify(user));
    setShowAuthModal(false);
    
    // Automatically match city and gender category if specified
    if (user.city) {
      setSelectedCity(user.city);
    }
    if (user.gender === 'male') {
      setFilters(prev => ({ ...prev, genderCategory: 'boys' }));
    } else if (user.gender === 'female') {
      setFilters(prev => ({ ...prev, genderCategory: 'girls' }));
    }

    // Add welcome notification
    const welcomeNotif: NotificationItem = {
      id: `notif-welcome-${Date.now()}`,
      title: `Welcome to Apna PG, ${user.name}! 🏠`,
      message: `Your pre-details for ${user.city} are active. Explore verified student & professional PGs with 100% refundable security deposits.`,
      timestamp: 'Just now',
      read: false,
      type: 'system',
    };
    setNotifications(prev => [welcomeNotif, ...prev]);
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('apnapg_user', JSON.stringify(updatedUser));
    if (updatedUser.city) {
      setSelectedCity(updatedUser.city);
      setFilters(prev => ({ ...prev, selectedCity: updatedUser.city }));
    }
    if (updatedUser.gender === 'male') {
      setFilters(prev => ({ ...prev, genderCategory: 'boys' }));
    } else if (updatedUser.gender === 'female') {
      setFilters(prev => ({ ...prev, genderCategory: 'girls' }));
    }

    const profileNotif: NotificationItem = {
      id: `notif-profile-${Date.now()}`,
      title: 'Resident Profile Updated 👤',
      message: `Profile details for ${updatedUser.name} were updated. Changes are saved across your resident stay hub and rent receipts.`,
      timestamp: 'Just now',
      read: false,
      type: 'system',
    };
    setNotifications(prev => [profileNotif, ...prev]);
  };

  const handleSignOut = () => {
    clearStore();
    setCurrentUser(null);
    setBookings([]);
    setFavorites([]);
    setShowAuthModal(true);
  };

  const handleSeeAllListings = () => {
    // Reset filters to show all listed PGs
    setFilters({
      searchQuery: '',
      genderCategory: 'all',
      foodPreference: 'all',
      maxPrice: 30000,
      sharingType: 'all',
      verifiedOnly: false,
      hasAC: false,
      hasBiometric: false,
      minRating: 0,
    });
    // Smooth scroll to the full listing section
    setTimeout(() => {
      const section = document.getElementById('section-recommended');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleFilterUpdate = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      maxPrice: 30000,
      genderCategory: 'all',
      foodPreference: 'all',
      sharingType: 'all',
      verifiedOnly: false,
      hasAC: false,
      hasBiometric: false,
      minRating: 0,
    });
  };

  // Toggle Favorite
  const handleToggleFavorite = (pgId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(pgId) ? prev.filter((id) => id !== pgId) : [...prev, pgId]
    );
  };

  // Add review to a PG
  const handleAddReview = (review: Review) => {
    if (!selectedPG) return;
    const updatedListings = listings.map((item) => {
      if (item.id === selectedPG.id) {
        const newReviews = [review, ...item.reviews];
        return {
          ...item,
          reviews: newReviews,
          reviewCount: item.reviewCount + 1,
        };
      }
      return item;
    });

    setListings(updatedListings);
    // update current selected PG
    const updatedSelected = updatedListings.find((p) => p.id === selectedPG.id);
    if (updatedSelected) setSelectedPG(updatedSelected);
  };

  // Handle successful booking
  const handleBookingComplete = (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Update the PG bed status
    setListings((prev) =>
      prev.map((pg) => {
        if (pg.id === newBooking.pgId) {
          const updatedBeds = pg.availableBeds.map((bed) => {
            if (bed.bedNumber === newBooking.bedNumber && bed.roomNumber === newBooking.roomNumber) {
              return { ...bed, status: 'booked' as const };
            }
            return bed;
          });
          return { ...pg, availableBeds: updatedBeds };
        }
        return pg;
      })
    );

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Booking Confirmed!',
      message: `Your bed at ${newBooking.pgName} is reserved. Booking code: ${newBooking.bookingCode}.`,
      timestamp: 'Just now',
      read: false,
      type: 'booking',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setBookingPG(null);
    setSelectedPG(null);
    setActiveTab('mystay');
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((pg) => {
      // Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = pg.name.toLowerCase().includes(q);
        const matchesLocation = pg.location.toLowerCase().includes(q);
        const matchesArea = pg.area.toLowerCase().includes(q);
        const matchesAmenities = pg.amenities.some((a) => a.title.toLowerCase().includes(q));
        if (!matchesName && !matchesLocation && !matchesArea && !matchesAmenities) {
          return false;
        }
      }

      // Max Price
      if (pg.pricePerMonth > filters.maxPrice) {
        return false;
      }

      // Gender Category
      if (filters.genderCategory !== 'all' && pg.category !== filters.genderCategory) {
        return false;
      }

      // Food Preference
      if (filters.foodPreference === 'included' && !pg.foodIncluded) {
        return false;
      }
      if (filters.foodPreference === 'veg_only' && !pg.isPureVeg) {
        return false;
      }

      // Sharing Type
      if (
        filters.sharingType !== 'all' &&
        !pg.sharingOptions.some((s) => s.toLowerCase().includes(filters.sharingType.toLowerCase()))
      ) {
        return false;
      }

      // Verified Only
      if (filters.verifiedOnly && !pg.isVerified) {
        return false;
      }

      // AC
      if (
        filters.hasAC &&
        !pg.amenities.some((a) => a.id === 'ac' || a.title.toLowerCase().includes('ac'))
      ) {
        return false;
      }

      // Biometric
      if (filters.hasBiometric && !pg.amenities.some((a) => a.id === 'biometric')) {
        return false;
      }

      // Rating
      if (filters.minRating > 0 && pg.rating < filters.minRating) {
        return false;
      }

      return true;
    });
  }, [listings, filters]);

  // Recommended Listings (filter results excluding featured or showing all)
  const recommendedListings = filteredListings;

  const savedListings = useMemo(() => {
    return listings.filter((pg) => favorites.includes(pg.id));
  }, [listings, favorites]);

  const activeBooking = bookings[0];
  const activeStayPG = listings.find((p) => p.id === activeBooking?.pgId) || listings[0];
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Bottom navigation hiding logic when any sheet or modal is open
  const isAnySheetOpen = Boolean(
    isFilterSheetOpen ||
    bookingPG ||
    showFilterModal ||
    selectedPG ||
    showAuthModal ||
    showNotificationsModal ||
    showWriteReviewModal
  );

  // Route checking for legal pages, booking, pg detail, and 404
  if (location.pathname === '/terms') {
    return (
      <Suspense fallback={<ViewLoadingFallback />}>
        <TermsPage />
      </Suspense>
    );
  }

  if (location.pathname === '/privacy') {
    return (
      <Suspense fallback={<ViewLoadingFallback />}>
        <PrivacyPage />
      </Suspense>
    );
  }

  const knownPaths = ['/', '/saved', '/mystay', '/profile', '/map'];
  const isPgRoute = location.pathname.startsWith('/pg/');
  const isBookRoute = location.pathname.startsWith('/book/');
  const isValidPgRoute = isPgRoute && listings.some((p) => `/pg/${p.id}` === location.pathname);
  const isValidBookRoute = isBookRoute && listings.some((p) => `/book/${p.id}` === location.pathname);

  if (!knownPaths.includes(location.pathname) && !isValidPgRoute && !isValidBookRoute) {
    return (
      <Suspense fallback={<ViewLoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    );
  }

  // Full-Screen Online Booking View (Replaces PGDetail instead of stacking)
  if (bookingPG) {
    return (
      <Suspense fallback={<ViewLoadingFallback />}>
        <BookingModal
          pg={bookingPG}
          initialBed={bookingInitialBed}
          currentUser={currentUser}
          allBookings={bookings}
          onClose={handleCloseBooking}
          onBookingComplete={handleBookingComplete}
        />
      </Suspense>
    );
  }

  // Full-Screen Detailed PG View (Replaces Home instead of overlaying/stacking)
  if (selectedPG) {
    return (
      <Suspense fallback={<ViewLoadingFallback />}>
        <PGDetailModal
          pg={selectedPG}
          onClose={handleClosePG}
          onBookNow={handleOpenBooking}
          isFavorite={favorites.includes(selectedPG.id)}
          onToggleFavorite={handleToggleFavorite}
          onOpenWriteReview={() => setShowWriteReviewModal(true)}
        />
        {showWriteReviewModal && (
          <Suspense fallback={<ViewLoadingFallback />}>
            <WriteReviewModal
              pgName={selectedPG.name}
              pgId={selectedPG.id}
              onClose={() => setShowWriteReviewModal(false)}
              onSubmitReview={handleAddReview}
            />
          </Suspense>
        )}
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/5 sm:bg-slate-100/70 flex justify-center text-slate-900 antialiased font-sans selection:bg-[#7C3AED] selection:text-white">
      {/* Skip to main content link as first focusable element (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-[#7C3AED] focus:text-white focus:font-bold focus:rounded-xl focus:shadow-2xl focus:ring-2 focus:ring-white focus:outline-none text-xs"
      >
        Skip to main content
      </a>

      {/* Responsive App Frame Container */}
      <main
        id="main-content"
        tabIndex={-1}
        className="w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl bg-[#FBF9FE] min-h-screen relative flex flex-col shadow-2xl border-x border-purple-100/60 overflow-x-hidden transition-all duration-200 outline-none"
      >
        <h1 className="sr-only">Apna PG - Verified Student and Professional Accommodations</h1>

        {/* Top App Header */}
        <Header
          currentUser={currentUser}
          unreadNotificationCount={unreadNotificationsCount}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          onOpenProfile={() => handleTabChange('profile')}
        />

        {/* TAB 1: Explore (Main Screen matching screenshot iPhone 14 & 15 Pro - 41.png) */}
        {activeTab === 'explore' && (
          <div className="flex-1 pb-28 space-y-3 animate-in fade-in duration-200">
            {/* Find Your PG Search Bar */}
            <SearchBar
              searchQuery={filters.searchQuery}
              onSearchChange={(query) => handleFilterUpdate({ searchQuery: query })}
              onLocationTagClick={(tag) => handleFilterUpdate({ searchQuery: tag })}
            />

            {/* Filter Pills (All, Price ▾, Food ▾, Category ▾) */}
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterUpdate}
              onOpenAdvancedFilters={() => setShowFilterModal(true)}
              totalResultsCount={filteredListings.length}
              onSheetOpenChange={setIsFilterSheetOpen}
            />

            {/* Featured Stay Section */}
            {!filters.searchQuery && (
              <FeaturedCarousel
                listings={listings}
                onSelectPG={handleSelectPG}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSeeAllClick={handleSeeAllListings}
              />
            )}

            {/* Near You Vector Map Preview Card (matching screenshot) */}
            {!filters.searchQuery && (
              <NearYouMapPreview
                onOpenMap={() => handleTabChange('map')}
                listingsCount={filteredListings.length}
                nearestPG={filteredListings[0]}
              />
            )}

            {/* Recommended Accommodations Section (matching screenshot) */}
            <section id="section-recommended" className="px-5 sm:px-6 py-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                  {filters.searchQuery ? (
                    <span>
                      Search Results{' '}
                      <span className="text-sm font-medium text-slate-400">
                        ({filteredListings.length})
                      </span>
                    </span>
                  ) : (
                    <span>
                      Recommended
                    </span>
                  )}
                </h2>

                <span className="text-xs font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/80">
                  {filteredListings.length} Available
                </span>
              </div>

              {/* Listings Stack - Responsive 1-col on mobile, 2-col on md+ */}
              {filteredListings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/90 shadow-sm space-y-2">
                  <div className="w-12 h-12 bg-purple-50 text-[#7C3AED] rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-800">No Accommodations Found</h3>
                  <p className="text-xs text-slate-500">
                    Try adjusting your rent budget or clearing some filters to see more results.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors mt-2 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {recommendedListings.map((pg) => (
                    <PGCard
                      key={pg.id}
                      pg={pg}
                      onSelect={(item) => handleSelectPG(item)}
                      isFavorite={favorites.includes(pg.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              )}

              {/* "View more Listing" Button matching screenshot with high contrast */}
              {filteredListings.length > 0 && (
                <div className="pt-4 pb-2">
                  <button
                    id="btn-view-more-listings"
                    onClick={handleSeeAllListings}
                    className="w-full min-h-[44px] py-3.5 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] active:bg-[#5B21B6] text-white font-bold text-sm rounded-2xl shadow-sm transition-all text-center cursor-pointer flex items-center justify-center"
                  >
                    View All {listings.length} Listed PGs
                  </button>
                </div>
              )}
            </section>

            {/* Footer with Transparency & Legal Policy Links */}
            <Footer />
          </div>
        )}

        {/* TAB 2: Full Interactive Map */}
        {activeTab === 'map' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            <InteractiveMapView
              listings={filteredListings}
              onClose={() => handleTabChange('explore')}
              onSelectPG={handleSelectPG}
              filters={filters}
              onFilterChange={handleFilterUpdate}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </Suspense>
        )}

        {/* TAB 3: My Stay Resident Management Hub */}
        {activeTab === 'mystay' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            {activeBooking ? (
              <ResidentManagementView
                activeBooking={activeBooking}
                pgListing={activeStayPG}
                maintenanceTickets={maintenanceTickets}
                currentUser={currentUser}
                onUpdateProfile={handleUpdateProfile}
                onAddTicket={(ticket) => {
                  const newT: MaintenanceTicket = {
                    ...ticket,
                    id: `TICK-${Date.now()}`,
                    createdAt: new Date().toISOString().split('T')[0],
                    status: 'open',
                  };
                  setMaintenanceTickets((prev) => [newT, ...prev]);
                }}
                onPayRent={(bookingId) => {
                  // mark rent paid
                  const notif: NotificationItem = {
                    id: `notif-${Date.now()}`,
                    title: 'Rent Payment Successful',
                    message: `Payment of ₹${activeBooking.monthlyRent} recorded. Receipt available in profile.`,
                    timestamp: 'Just now',
                    read: false,
                    type: 'rent',
                  };
                  setNotifications((prev) => [notif, ...prev]);
                }}
                onBackToExplore={() => setActiveTab('explore')}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center mb-4 shadow-sm">
                  <Key className="w-8 h-8 stroke-[2]" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">No Active Stay Found</h3>
                <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                  You do not have an active PG booking yet. Book a bed with zero brokerage and a 100% refundable security deposit to access your resident portal.
                </p>
                <button
                  onClick={() => handleTabChange('explore')}
                  className="px-6 py-3 bg-[#7C3AED] hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer min-h-[44px]"
                >
                  Explore Verified PGs
                </button>
              </div>
            )}
          </Suspense>
        )}

        {/* TAB 4: Saved Wishlist & Comparison */}
        {activeTab === 'saved' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            <SavedFavoritesView
              favoritePGs={savedListings}
              onSelectPG={handleSelectPG}
              onRemoveFavorite={(pgId) => setFavorites((prev) => prev.filter((id) => id !== pgId))}
              onExploreMore={() => handleTabChange('explore')}
            />
          </Suspense>
        )}

        {/* TAB 5: User Profile & KYC */}
        {activeTab === 'profile' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            <ProfileView
              currentUser={currentUser}
              bookings={bookings}
              onBackToHome={() => handleTabChange('explore')}
              onOpenSupport={() => handleTabChange('mystay')}
              onSignOut={handleSignOut}
              onUpdateProfile={handleUpdateProfile}
            />
          </Suspense>
        )}

        {/* Mobile Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          savedCount={favorites.length}
          hasActiveStay={bookings.length > 0}
          hidden={isAnySheetOpen}
        />

        {/* Login & Pre-Details Onboarding Modal (Opens When App Starts) */}
        {showAuthModal && (
          <AuthModal onLoginSuccess={handleLoginSuccess} />
        )}

        {/* Comprehensive Filter Modal */}
        {showFilterModal && (
          <Suspense fallback={null}>
            <FilterModal
              filters={filters}
              onFilterChange={handleFilterUpdate}
              onResetFilters={handleResetFilters}
              onClose={() => setShowFilterModal(false)}
              totalResultsCount={filteredListings.length}
            />
          </Suspense>
        )}

        {/* Notifications Modal */}
        {showNotificationsModal && (
          <Suspense fallback={null}>
            <NotificationsModal
              notifications={notifications}
              onClose={() => setShowNotificationsModal(false)}
              onMarkAsRead={(id) => {
                setNotifications((prev) =>
                  prev.map((n) => (n.id === id ? { ...n, read: true } : n))
                );
              }}
              onClearAll={() => setNotifications([])}
            />
          </Suspense>
        )}
      </main>
    </div>
  );
}

