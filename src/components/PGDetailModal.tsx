import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Phone,
  MapPin,
  ChevronDown,
  Star,
  ShieldCheck,
  CheckCircle2,
  Info,
  Sunrise,
  Sun,
  Moon,
  Fingerprint,
  Video,
  Wifi,
  WashingMachine,
  Droplets,
  Zap,
  Sparkles,
  BookOpen,
  Coffee,
  Dumbbell,
  Check,
  Calendar,
  Layers,
  MessageCircle,
  Share2,
  ChevronRight,
  Sparkle,
} from 'lucide-react';
import { PGListing, BedSlot, Review } from '../types';

interface PGDetailModalProps {
  pg: PGListing;
  onClose: () => void;
  onBookNow: (pg: PGListing, selectedBed?: BedSlot) => void;
  isFavorite: boolean;
  onToggleFavorite: (pgId: string, e: React.MouseEvent) => void;
  onOpenWriteReview?: () => void;
}

export const PGDetailModal: React.FC<PGDetailModalProps> = ({
  pg,
  onClose,
  onBookNow,
  isFavorite,
  onToggleFavorite,
  onOpenWriteReview,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Wednesday (matches screenshot WED 14)
  const [selectedSharing, setSelectedSharing] = useState<'Single' | 'Double' | 'Triple'>('Double');
  const [selectedFoodOption, setSelectedFoodOption] = useState('Included');
  const [selectedBed, setSelectedBed] = useState<BedSlot | undefined>(
    pg.availableBeds.find((b) => b.status === 'available')
  );
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic price based on sharing option
  const effectivePrice =
    selectedSharing === 'Single'
      ? Math.round(pg.pricePerMonth * 1.5)
      : selectedSharing === 'Triple'
        ? Math.round(pg.pricePerMonth * 0.85)
        : pg.pricePerMonth;

  const currentDayMenu = pg.weeklyFoodMenu[selectedDayIndex] || pg.weeklyFoodMenu[0];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Fingerprint':
        return <Fingerprint className="w-5 h-5 text-blue-600" />;
      case 'Cctv':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'Wifi':
        return <Wifi className="w-5 h-5 text-blue-600" />;
      case 'WashingMachine':
        return <WashingMachine className="w-5 h-5 text-blue-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-blue-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-blue-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-blue-600" />;
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div
      id="pg-detail-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-slate-50 w-full max-w-md min-h-screen flex flex-col relative pb-28 shadow-2xl">
        {/* Top Header Bar matching screenshot */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <button
            id="btn-detail-back"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {pg.name}
          </h1>

          <div className="flex items-center gap-1.5">
            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Share listing"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>

            {/* Favorite button */}
            <button
              id="btn-detail-favorite"
              onClick={(e) => onToggleFavorite(pg.id, e)}
              className="p-2 rounded-lg hover:bg-red-50 text-slate-600 transition-colors"
              aria-label="Save to favorite"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-700'
                }`}
              />
            </button>

            {/* Call Owner button */}
            <a
              id="btn-detail-call"
              href={`tel:${pg.managerContact.phone}`}
              className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
              aria-label="Call manager"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Hero Photo Carousel with 360 Badge */}
        <div className="relative bg-slate-900">
          <div className="relative h-64 sm:h-72 w-full overflow-hidden">
            <img
              src={pg.images[selectedPhotoIndex] || pg.images[0]}
              alt={pg.name}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Virtual 360 Tour badge button */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-md text-white text-xs font-semibold rounded-md border border-white/20 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>360° Verified Room</span>
            </div>

            {/* Image pagination dots */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
              {pg.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    selectedPhotoIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                  aria-label={`Photo ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Secondary Thumbnail Strip */}
          <div className="flex gap-2 p-2 bg-slate-900/90 overflow-x-auto no-scrollbar">
            {pg.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  selectedPhotoIndex === idx
                    ? 'border-blue-500 scale-105 shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Property Title & Price Header matching screenshot */}
        <div className="px-4 pt-4 pb-3 bg-white border-b border-slate-200">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {pg.subTitle || pg.name}
              </h2>
              <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{pg.location}</span>
              </div>
            </div>

            {/* Price Tag */}
            <div className="text-right shrink-0">
              <div className="text-2xl font-black text-blue-600 tracking-tight">
                {effectivePrice} ₹<span className="text-xs font-semibold text-slate-500">/Mo</span>
              </div>
              <div className="text-[11px] font-semibold text-emerald-600">0% Brokerage</div>
            </div>
          </div>

          {/* Quick Filter Selectors matching screenshot: Category ▾ | Sharing ▾ | Food ▾ */}
          <div className="flex items-center gap-2 mt-3.5 pb-1 overflow-x-auto no-scrollbar">
            {/* Category Dropdown */}
            <div className="relative shrink-0">
              <select
                id="select-detail-category"
                value={selectedSharing}
                onChange={(e) => setSelectedSharing(e.target.value as any)}
                className="appearance-none pl-2.5 pr-6 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer border border-slate-200"
              >
                <option value="Single">Single Sharing</option>
                <option value="Double">Double Sharing</option>
                <option value="Triple">Triple Sharing</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sharing Dropdown */}
            <div className="relative shrink-0">
              <select
                id="select-detail-sharing"
                className="appearance-none pl-2.5 pr-6 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer border border-slate-200"
              >
                <option>AC Room</option>
                <option>Non-AC Room</option>
                <option>Attached Washroom</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Food Dropdown */}
            <div className="relative shrink-0">
              <select
                id="select-detail-food"
                value={selectedFoodOption}
                onChange={(e) => setSelectedFoodOption(e.target.value)}
                className="appearance-none pl-2.5 pr-6 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer border border-slate-200"
              >
                <option value="Included">Food Included (3 Meals)</option>
                <option value="VegOnly">Pure Veg Mess</option>
                <option value="SelfCook">Self Cooking Allowed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Section 1: Financial Transparency (Tackling hidden charges & deposit challenges) */}
        <section id="section-financial-transparency" className="px-4 py-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Financial Transparency
            </h3>
          </div>

          {/* Cost Breakdown Card */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="font-bold text-sm text-slate-900">Cost Breakdown</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>No Extra Charge</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Monthly Rent */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Monthly Rent</span>
                <span className="font-bold text-slate-900">{effectivePrice} ₹</span>
              </div>

              {/* Security Deposit with 100% Refundable */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Security Deposit</span>
                  <span className="font-bold text-blue-600">
                    {pg.costBreakdown.securityDeposit} ₹
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>100% Refundable</span>
                </div>
              </div>

              {/* Maintenance */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Maintenance</span>
                <span className="font-bold text-slate-900">{pg.costBreakdown.maintenanceFee} ₹</span>
              </div>

              {/* Electricity */}
              <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-slate-500 text-[11px]">
                <span>Electricity</span>
                <span className="font-medium text-slate-700">
                  {pg.costBreakdown.electricityRateText}
                </span>
              </div>
            </div>

            {/* Explanatory Policy note */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
              <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>
                {pg.costBreakdown.depositRefundableText}. Zero broker commission. 30-day notice period.
              </span>
            </div>
          </div>
        </section>

        {/* Real-time Bed Availability Selector */}
        <section id="section-bed-selection" className="px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Real-Time Bed Selection</h3>
            </div>
            <span className="text-[11px] font-semibold text-blue-600">
              {pg.availableBeds.filter((b) => b.status === 'available').length} Beds Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {pg.availableBeds.slice(0, 4).map((bed) => {
              const isSelected = selectedBed?.id === bed.id;
              const isAvailable = bed.status === 'available';

              return (
                <button
                  key={bed.id}
                  disabled={!isAvailable}
                  onClick={() => setSelectedBed(bed)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    !isAvailable
                      ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                      : isSelected
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className="text-slate-900">{bed.bedNumber}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                        isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isAvailable ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">{bed.roomNumber} (Fl. {bed.floor})</div>
                  <div className="text-[11px] font-bold text-blue-600 mt-1">
                    ₹{bed.price.toLocaleString()}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Weekly Food Menu Schedule */}
        <section id="section-food-menu" className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Weekly Food Menu
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Hygienic & Home-Cooked
            </span>
          </div>

          {/* Days Horizontal Picker */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
            {pg.weeklyFoodMenu.map((item, idx) => {
              const isSelected = selectedDayIndex === idx;

              return (
                <button
                  key={item.day}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`flex flex-col items-center justify-center min-w-[54px] py-2 px-1 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-200'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase ${
                      isSelected ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {item.day}
                  </span>
                  <span className="text-base font-bold mt-0.5">{item.dateNum}</span>
                </button>
              );
            })}
          </div>

          {/* Meal Details Cards matching screenshot icons: Breakfast (Sunrise), Lunch (Sun), Dinner (Moon) */}
          <div className="space-y-2.5">
            {/* Breakfast Card */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sunrise className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-900">
                    Breakfast ({currentDayMenu.breakfast.time})
                  </div>
                  {currentDayMenu.breakfast.boxAvailable && (
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                      Box Ready
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  {currentDayMenu.breakfast.items}
                </p>
              </div>
            </div>

            {/* Lunch Card */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sun className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-900">
                    Lunch (Box Available)
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">12:30 - 2:30 PM</span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  {currentDayMenu.lunch.items}
                </p>
              </div>
            </div>

            {/* Dinner Card */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-900">
                    Dinner ({currentDayMenu.dinner.time})
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600">Hot Buffet</span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  {currentDayMenu.dinner.items}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Security & Amenities Grid */}
        <section id="section-security-amenities" className="px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Security & Amenities
            </h3>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {pg.amenities.map((amenity) => (
              <div
                key={amenity.id}
                className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center gap-3 hover:border-slate-300 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  {getAmenityIcon(amenity.icon)}
                </div>
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {amenity.title}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Resident Reviews */}
        <section id="section-resident-reviews" className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Resident Reviews
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.3 (132)</span>
            </div>
          </div>

          {/* Review Cards List */}
          <div className="space-y-3">
            {(showAllReviews ? pg.reviews : pg.reviews.slice(0, 2)).map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative"
              >
                {/* Header: Avatar, Name, Verified Resident Badge, Star */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {review.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{review.authorName}</div>
                      {review.isCurrentResident && (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Current Resident</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{review.rating}</span>
                  </div>
                </div>

                {/* Review Body */}
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  "{review.content}"
                </p>
              </div>
            ))}
          </div>

          {/* View More Reviews Button */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <button
              id="btn-view-more-reviews"
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-lg shadow-sm transition-colors"
            >
              {showAllReviews ? 'Show Fewer Reviews' : 'View more Reviews'}
            </button>

            {onOpenWriteReview && (
              <button
                onClick={onOpenWriteReview}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 py-1"
              >
                + Write a Verified Review
              </button>
            )}
          </div>
        </section>

        {/* Sticky Bottom Booking Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="w-full max-w-md bg-white border-t border-slate-200 px-5 py-3.5 shadow-xl flex items-center justify-between pointer-events-auto">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Monthly Rent
              </div>
              <div className="text-xl font-black text-slate-900">
                ₹{effectivePrice.toLocaleString()} <span className="text-xs font-medium text-slate-400">/mo</span>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              id="btn-book-now-bottom"
              onClick={() => onBookNow(pg, selectedBed)}
              className="px-6 py-3 bg-[#7C3AED] hover:bg-purple-700 active:bg-purple-800 text-white text-sm font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Book Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
