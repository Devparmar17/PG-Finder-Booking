import React, { useState, useMemo } from 'react';
import {
  MOCK_PG_LISTINGS,
  INITIAL_BOOKING,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { PGListing, FilterState, BedSlot, BookingRecord, MaintenanceTicket, Review, NotificationItem } from './types';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { FilterModal } from './components/FilterModal';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { NearYouMapPreview } from './components/NearYouMapPreview';
import { PGCard } from './components/PGCard';
import { PGDetailModal } from './components/PGDetailModal';
import { InteractiveMapView } from './components/InteractiveMapView';
import { BookingModal } from './components/BookingModal';
import { ResidentManagementView } from './components/ResidentManagementView';
import { SavedFavoritesView } from './components/SavedFavoritesView';
import { ProfileView } from './components/ProfileView';
import { NotificationsModal } from './components/NotificationsModal';
import { WriteReviewModal } from './components/WriteReviewModal';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { Sparkles, Building2, Shield, Search } from 'lucide-react';

export default function App() {
  // Core application state
  const [listings, setListings] = useState<PGListing[]>(MOCK_PG_LISTINGS);
  const [selectedCity, setSelectedCity] = useState<string>('Ahmedabad');
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [selectedPG, setSelectedPG] = useState<PGListing | null>(null);
  const [bookingPG, setBookingPG] = useState<PGListing | null>(null);
  const [bookingInitialBed, setBookingInitialBed] = useState<BedSlot | undefined>(undefined);
  const [favorites, setFavorites] = useState<string[]>(['pg-1', 'pg-4']); // Raj PG & Shreeji default saved
  const [bookings, setBookings] = useState<BookingRecord[]>([INITIAL_BOOKING]);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(
    INITIAL_MAINTENANCE_TICKETS
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals visibility
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showWriteReviewModal, setShowWriteReviewModal] = useState<boolean>(false);

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
  });

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

  return (
    <div className="min-h-screen bg-slate-900/5 sm:bg-slate-200/60 flex justify-center text-slate-900 antialiased font-sans selection:bg-[#7C3AED] selection:text-white">
      {/* Mobile Frame Container */}
      <main className="w-full max-w-md bg-[#FBF9FE] min-h-screen relative flex flex-col shadow-2xl border-x border-purple-100/60 overflow-x-hidden">
        {/* Top App Header */}
        <Header
          unreadNotificationCount={unreadNotificationsCount}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          onOpenProfile={() => setActiveTab('profile')}
        />

        {/* TAB 1: Explore (Main Screen matching screenshot iPhone 14 & 15 Pro - 41.png) */}
        {activeTab === 'explore' && (
          <div className="flex-1 pb-24 space-y-2 animate-in fade-in duration-200">
            {/* Find Your PG Search Bar */}
            <SearchBar
              searchQuery={filters.searchQuery}
              onSearchChange={(query) => handleFilterUpdate({ searchQuery: query })}
              onLocationTagClick={(tag) => handleFilterUpdate({ searchQuery: tag })}
            />

            {/* Filter Pills (All, Price ▾, Food ▾, Category ▾, Filters) */}
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterUpdate}
              onOpenAdvancedFilters={() => setShowFilterModal(true)}
              totalResultsCount={filteredListings.length}
            />

            {/* Featured Stay Section */}
            {!filters.searchQuery && (
              <FeaturedCarousel
                listings={listings}
                onSelectPG={(pg) => setSelectedPG(pg)}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSeeAllClick={() => setShowFilterModal(true)}
              />
            )}

            {/* Near You Vector Map Preview Card (matching screenshot) */}
            {!filters.searchQuery && (
              <NearYouMapPreview
                onOpenMap={() => setActiveTab('map')}
                listingsCount={filteredListings.length}
                nearestPG={filteredListings[0]}
              />
            )}

            {/* Recommended Accommodations Section (matching screenshot) */}
            <section id="section-recommended" className="px-5 py-2">
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
              </div>

              {/* Listings Stack */}
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
                <div className="space-y-3">
                  {recommendedListings.map((pg) => (
                    <PGCard
                      key={pg.id}
                      pg={pg}
                      onSelect={(item) => setSelectedPG(item)}
                      isFavorite={favorites.includes(pg.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              )}

              {/* "View more Listing" Button matching screenshot */}
              {filteredListings.length > 0 && (
                <div className="pt-4 pb-2">
                  <button
                    id="btn-view-more-listings"
                    onClick={() => setShowFilterModal(true)}
                    className="w-full py-3.5 px-4 bg-[#B48CF8] hover:bg-[#a375f5] active:bg-[#925ee8] text-white font-bold text-sm rounded-2xl shadow-sm transition-all text-center cursor-pointer"
                  >
                    View more Listing
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: Full Interactive Map */}
        {activeTab === 'map' && (
          <InteractiveMapView
            listings={filteredListings}
            onClose={() => setActiveTab('explore')}
            onSelectPG={(pg) => setSelectedPG(pg)}
            filters={filters}
            onFilterChange={handleFilterUpdate}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* TAB 3: My Stay Resident Management Hub */}
        {activeTab === 'mystay' && (
          <ResidentManagementView
            activeBooking={activeBooking}
            pgListing={activeStayPG}
            maintenanceTickets={maintenanceTickets}
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
        )}

        {/* TAB 4: Saved Wishlist & Comparison */}
        {activeTab === 'saved' && (
          <SavedFavoritesView
            favoritePGs={savedListings}
            onSelectPG={(pg) => setSelectedPG(pg)}
            onRemoveFavorite={(pgId) => setFavorites((prev) => prev.filter((id) => id !== pgId))}
            onExploreMore={() => setActiveTab('explore')}
          />
        )}

        {/* TAB 5: User Profile & KYC */}
        {activeTab === 'profile' && (
          <ProfileView
            bookings={bookings}
            onBackToHome={() => setActiveTab('explore')}
          />
        )}

        {/* Mobile Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          savedCount={favorites.length}
          hasActiveStay={bookings.length > 0}
        />

        {/* Full-Screen Detailed PG Modal (matching screenshot iPhone 14 & 15 Pro - 12.png) */}
        {selectedPG && (
          <PGDetailModal
            pg={selectedPG}
            onClose={() => setSelectedPG(null)}
            onBookNow={(pg, selectedBed) => {
              setBookingPG(pg);
              setBookingInitialBed(selectedBed);
            }}
            isFavorite={favorites.includes(selectedPG.id)}
            onToggleFavorite={handleToggleFavorite}
            onOpenWriteReview={() => setShowWriteReviewModal(true)}
          />
        )}

        {/* Online Booking & Transparent Payment Modal */}
        {bookingPG && (
          <BookingModal
            pg={bookingPG}
            initialBed={bookingInitialBed}
            onClose={() => setBookingPG(null)}
            onBookingComplete={handleBookingComplete}
          />
        )}

        {/* Comprehensive Filter Modal */}
        {showFilterModal && (
          <FilterModal
            filters={filters}
            onFilterChange={handleFilterUpdate}
            onResetFilters={handleResetFilters}
            onClose={() => setShowFilterModal(false)}
            totalResultsCount={filteredListings.length}
          />
        )}

        {/* Notifications Modal */}
        {showNotificationsModal && (
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
        )}

        {/* Write Verified Review Modal */}
        {showWriteReviewModal && selectedPG && (
          <WriteReviewModal
            pgName={selectedPG.name}
            pgId={selectedPG.id}
            onClose={() => setShowWriteReviewModal(false)}
            onSubmitReview={handleAddReview}
          />
        )}
      </main>
    </div>
  );
}

