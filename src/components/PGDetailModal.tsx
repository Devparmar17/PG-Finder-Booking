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
  BedDouble,
  X,
  Sparkle,
  Utensils,
  Grid,
} from 'lucide-react';
import { PGListing, BedSlot, Review } from '../types';
import { PGLocationMap } from './PGLocationMap';

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
  const [selectedCategory, setSelectedCategory] = useState<'AC Room' | 'Non-AC Room' | 'Attached Washroom' | 'Deluxe Studio'>('AC Room');
  const [selectedSharing, setSelectedSharing] = useState<'Single' | 'Double' | 'Triple' | 'Four'>('Double');
  const [selectedFoodOption, setSelectedFoodOption] = useState<'Included' | 'VegOnly' | 'Jain' | 'SelfCook'>('Included');
  
  // Pop box active state
  const [activePopBox, setActivePopBox] = useState<'category' | 'sharing' | 'food' | null>(null);

  const [selectedBed, setSelectedBed] = useState<BedSlot | undefined>(
    pg.availableBeds.find((b) => b.status === 'available')
  );
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic price calculation based on category & sharing
  const basePrice = pg.pricePerMonth;
  let sharingMultiplier = 1;
  if (selectedSharing === 'Single') sharingMultiplier = 1.45;
  if (selectedSharing === 'Triple') sharingMultiplier = 0.85;
  if (selectedSharing === 'Four') sharingMultiplier = 0.70;

  const acAddon = selectedCategory === 'AC Room' ? 1200 : selectedCategory === 'Deluxe Studio' ? 2500 : 0;
  const effectivePrice = Math.round((basePrice * sharingMultiplier) / 100) * 100 + acAddon;
  const securityDeposit = effectivePrice * 2;

  const currentDayMenu = pg.weeklyFoodMenu[selectedDayIndex] || pg.weeklyFoodMenu[0];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Fingerprint':
        return <Fingerprint className="w-5 h-5 text-[#7C3AED]" />;
      case 'Cctv':
        return <Video className="w-5 h-5 text-[#7C3AED]" />;
      case 'Wifi':
        return <Wifi className="w-5 h-5 text-[#7C3AED]" />;
      case 'WashingMachine':
        return <WashingMachine className="w-5 h-5 text-[#7C3AED]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#7C3AED]" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-[#7C3AED]" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#7C3AED]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#7C3AED]" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[#7C3AED]" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-[#7C3AED]" />;
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5 text-[#7C3AED]" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-[#7C3AED]" />;
    }
  };

  return (
    <div
      id="pg-detail-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-start sm:items-center overflow-y-auto p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-[#FBF9FE] w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl min-h-screen sm:min-h-0 sm:max-h-[92vh] sm:rounded-2xl flex flex-col relative shadow-2xl overflow-y-auto border border-purple-100/90 no-scrollbar">
        {/* Top Sticky Header Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-200/90 flex items-center justify-between">
          <button
            id="btn-detail-back"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-[#7C3AED] transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base font-extrabold text-slate-900 uppercase tracking-wide truncate max-w-[200px] sm:max-w-xs text-center">
            {pg.name}
          </h1>

          <div className="flex items-center gap-1">
            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Share listing"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>

            {/* Favorite button */}
            <button
              id="btn-detail-favorite"
              onClick={(e) => onToggleFavorite(pg.id, e)}
              className="p-2 rounded-xl hover:bg-red-50 text-slate-600 transition-colors cursor-pointer"
              aria-label="Save to favorite"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorite ? 'fill-purple-600 text-purple-600' : 'text-purple-600 stroke-[2]'
                }`}
              />
            </button>

            {/* Call Owner button */}
            <a
              id="btn-detail-call"
              href={`tel:${pg.managerContact.phone}`}
              className="p-2 rounded-xl hover:bg-emerald-50 text-emerald-600 transition-colors cursor-pointer"
              aria-label="Call manager"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Hero Photo Carousel with 360 Badge */}
        <div className="relative bg-slate-900">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img
              src={pg.images[selectedPhotoIndex] || pg.images[0]}
              alt={pg.name}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Virtual 360 Tour badge button */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/75 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-white/20 shadow-md">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                360°
              </div>
              <span>Verified Virtual Tour</span>
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
          <div className="flex gap-2 p-2.5 bg-slate-900/90 overflow-x-auto no-scrollbar">
            {pg.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  selectedPhotoIndex === idx
                    ? 'border-[#7C3AED] scale-105 shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Property Title & Price Header */}
        <div className="px-4 sm:px-6 pt-4 pb-3 bg-white border-b border-slate-200/90">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {pg.subTitle || pg.name}
              </h2>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs sm:text-sm mt-1 font-medium">
                <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <span>{pg.location.replace(/^[A-Za-z]+,\s*/, '') || 'Ahmedabad-Gujarat'}</span>
              </div>
            </div>

            {/* Price Tag in blue matching screenshot */}
            <div className="text-right shrink-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] tracking-tight">
                {effectivePrice.toLocaleString()}₹<span className="text-xs font-semibold text-slate-700">/Mo</span>
              </div>
              <div className="text-[11px] font-bold text-emerald-600">0% Brokerage</div>
            </div>
          </div>

          {/* Quick Pop Box Filter Buttons: [ ⊞ Category ▾ ] | [ 🛏 Sharing ▾ ] | [ 🍴 Food ▾ ] */}
          <div className="flex items-center gap-2 mt-4 pb-1 overflow-x-auto no-scrollbar">
            {/* Category Pop Box Button */}
            <button
              id="btn-popbox-category"
              onClick={() => setActivePopBox('category')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                activePopBox === 'category'
                  ? 'bg-purple-100 border-[#7C3AED] text-[#7C3AED] shadow-xs'
                  : 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/80 text-purple-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>{selectedCategory}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7C3AED]" />
            </button>

            {/* Sharing Pop Box Button */}
            <button
              id="btn-popbox-sharing"
              onClick={() => setActivePopBox('sharing')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                activePopBox === 'sharing'
                  ? 'bg-purple-100 border-[#7C3AED] text-[#7C3AED] shadow-xs'
                  : 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/80 text-purple-900'
              }`}
            >
              <BedDouble className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>{selectedSharing} Sharing</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7C3AED]" />
            </button>

            {/* Food Pop Box Button */}
            <button
              id="btn-popbox-food"
              onClick={() => setActivePopBox('food')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                activePopBox === 'food'
                  ? 'bg-purple-100 border-[#7C3AED] text-[#7C3AED] shadow-xs'
                  : 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/80 text-purple-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>
                {selectedFoodOption === 'Included'
                  ? 'Food Included'
                  : selectedFoodOption === 'VegOnly'
                  ? 'Pure Veg Mess'
                  : selectedFoodOption === 'Jain'
                  ? 'Jain Food'
                  : 'Self Cooking'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7C3AED]" />
            </button>
          </div>
        </div>

        {/* ================= POP BOX MODAL OVERLAYS ================= */}
        {activePopBox && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-md rounded-2xl p-5 border border-slate-200 shadow-2xl space-y-4 animate-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold">
                    {activePopBox === 'category' && <Grid className="w-4 h-4" />}
                    {activePopBox === 'sharing' && <BedDouble className="w-4 h-4" />}
                    {activePopBox === 'food' && <Utensils className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      {activePopBox === 'category' && 'Select Room Category'}
                      {activePopBox === 'sharing' && 'Select Room Sharing'}
                      {activePopBox === 'food' && 'Select Food Preference'}
                    </h4>
                    <p className="text-xs text-slate-500">Live pricing and deposit updates instantly</p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePopBox(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Options */}
              {activePopBox === 'category' && (
                <div className="space-y-2.5">
                  {[
                    { id: 'AC Room', title: 'AC Room (Premium)', desc: 'Split Air Conditioner with Power Backup', extra: '+₹1,200/mo' },
                    { id: 'Non-AC Room', title: 'Non-AC Room (Standard)', desc: 'High-speed ceiling fan & cross ventilation', extra: 'Standard' },
                    { id: 'Attached Washroom', title: 'Attached Washroom', desc: 'Ensuite private modern bathroom with geyser', extra: '+₹800/mo' },
                    { id: 'Deluxe Studio', title: 'Deluxe Studio Suite', desc: 'Spacious room with work desk and private balcony', extra: '+₹2,500/mo' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedCategory(opt.id as any);
                        setActivePopBox(null);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedCategory === opt.id
                          ? 'bg-purple-50/80 border-[#7C3AED] ring-2 ring-purple-500/20'
                          : 'bg-white border-slate-200/90 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900">{opt.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                      </div>
                      <span className="text-xs font-bold text-[#7C3AED] bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                        {opt.extra}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Sharing Options */}
              {activePopBox === 'sharing' && (
                <div className="space-y-2.5">
                  {[
                    { id: 'Single', title: 'Single Sharing (Private)', price: Math.round(basePrice * 1.45), desc: 'Dedicated private room with personal wardrobe' },
                    { id: 'Double', title: 'Double Sharing (Twin)', price: basePrice, desc: 'Shared with 1 roommate, individual beds & study desk' },
                    { id: 'Triple', title: 'Triple Sharing', price: Math.round(basePrice * 0.85), desc: 'Economical 3-bed setup with individual storage' },
                    { id: 'Four', title: '4-Bed Sharing (Budget)', price: Math.round(basePrice * 0.70), desc: 'Maximum savings with all standard amenities' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedSharing(opt.id as any);
                        setActivePopBox(null);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedSharing === opt.id
                          ? 'bg-purple-50/80 border-[#7C3AED] ring-2 ring-purple-500/20'
                          : 'bg-white border-slate-200/90 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900">{opt.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-[#2563EB]">₹{opt.price.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">per month</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Food Options */}
              {activePopBox === 'food' && (
                <div className="space-y-2.5">
                  {[
                    { id: 'Included', title: 'Food Included (3 Meals)', desc: 'Unlimited Breakfast, Lunch & Hot Dinner Buffet' },
                    { id: 'VegOnly', title: 'Pure Veg Mess', desc: '100% pure vegetarian kitchen with separate utensils' },
                    { id: 'Jain', title: 'Jain Food Available', desc: 'No onion, no garlic preparations upon request' },
                    { id: 'SelfCook', title: 'Self Cooking Allowed', desc: 'Access to shared microwave, induction & refrigerator' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedFoodOption(opt.id as any);
                        setActivePopBox(null);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedFoodOption === opt.id
                          ? 'bg-purple-50/80 border-[#7C3AED] ring-2 ring-purple-500/20'
                          : 'bg-white border-slate-200/90 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900">{opt.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                      </div>
                      {selectedFoodOption === opt.id && (
                        <Check className="w-5 h-5 text-[#7C3AED]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 1: Financial Transparency (matching screenshot exactly) */}
        <section id="section-financial-transparency" className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-xl bg-purple-100 flex items-center justify-center text-[#7C3AED] border border-purple-200">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Financial Transparency
            </h3>
          </div>

          {/* Cost Breakdown Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
              <div className="font-extrabold text-sm text-slate-900">Cost Breakdown</div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>No Extra Charge</span>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {/* Monthly Rent */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Monthly Rent</span>
                <span className="font-extrabold text-[#2563EB]">{effectivePrice.toLocaleString()} ₹</span>
              </div>

              {/* Security Deposit */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Security Deposit</span>
                  <span className="font-extrabold text-[#2563EB]">
                    {securityDeposit.toLocaleString()} ₹
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>100% Refundable</span>
                </div>
              </div>

              {/* Maintenance */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Maintenance</span>
                <span className="font-extrabold text-[#2563EB]">{pg.costBreakdown.maintenanceFee}₹</span>
              </div>

              {/* Electricity */}
              <div className="pt-2.5 border-t border-dashed border-slate-200 flex items-center justify-between text-slate-500 text-xs">
                <span>Electricity</span>
                <span className="font-medium text-slate-700">
                  {pg.costBreakdown.electricityRateText}
                </span>
              </div>
            </div>

            {/* Policy notice note matching design */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-600 bg-purple-50/60 p-3 rounded-2xl border border-purple-100">
              <Info className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
              <span>
                Deposit is refunded within 2 business days of vacating. Zero broker commission. 30-day notice period.
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: Real-time Bed Availability Selector */}
        <section id="section-bed-selection" className="px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-[#7C3AED]" />
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Real-Time Bed Selection</h3>
            </div>
            <span className="text-[11px] font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200/80">
              {pg.availableBeds.filter((b) => b.status === 'available').length} Beds Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {pg.availableBeds.slice(0, 4).map((bed) => {
              const isSelected = selectedBed?.id === bed.id;
              const isAvailable = bed.status === 'available';

              return (
                <button
                  key={bed.id}
                  disabled={!isAvailable}
                  onClick={() => setSelectedBed(bed)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    !isAvailable
                      ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                      : isSelected
                        ? 'bg-purple-50 border-[#7C3AED] ring-2 ring-purple-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className="text-slate-900">{bed.bedNumber}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                        isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isAvailable ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">{bed.roomNumber} (Fl. {bed.floor})</div>
                  <div className="text-xs font-black text-[#2563EB] mt-1">
                    ₹{effectivePrice.toLocaleString()}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 3: Dedicated Location & Google Map */}
        <PGLocationMap pg={pg} />

        {/* Section 4: Weekly Food Menu Schedule (matching screenshot) */}
        <section id="section-food-menu" className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Weekly Food Menu
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
              Hygienic & Home-Cooked
            </span>
          </div>

          {/* Days Horizontal Picker matching screenshot MON 12, TUE 13, WED 14, THU 15, FRI 16 */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-3.5">
            {pg.weeklyFoodMenu.map((item, idx) => {
              const isSelected = selectedDayIndex === idx;

              return (
                <button
                  key={item.day}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`flex flex-col items-center justify-center min-w-[58px] py-2.5 px-2 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-100 text-[#7C3AED] border-[#7C3AED] ring-2 ring-purple-500/20 font-bold'
                      : 'bg-purple-50/60 text-[#7C3AED] border-purple-100 hover:bg-purple-100/60'
                  }`}
                >
                  <span className="text-[10px] font-extrabold tracking-wider uppercase">
                    {item.day}
                  </span>
                  <span className="text-base font-extrabold mt-0.5 text-slate-900">{item.dateNum}</span>
                </button>
              );
            })}
          </div>

          {/* Meal Details Cards matching screenshot icons */}
          <div className="space-y-3">
            {/* Breakfast Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sunrise className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                    Breakfast ({currentDayMenu.breakfast.time})
                  </div>
                  {currentDayMenu.breakfast.boxAvailable && (
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-lg">
                      Box Ready
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                  {currentDayMenu.breakfast.items}
                </p>
              </div>
            </div>

            {/* Lunch Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sun className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                    Lunch (Box Available)
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">12:30 - 2:30 PM</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                  {currentDayMenu.lunch.items}
                </p>
              </div>
            </div>

            {/* Dinner Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Moon className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                    Dinner ({currentDayMenu.dinner.time})
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                    Hot Buffet
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                  {currentDayMenu.dinner.items}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Security & Amenities Grid */}
        <section id="section-security-amenities" className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-[#7C3AED]" />
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Security & Amenities
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {pg.amenities.map((amenity) => (
              <div
                key={amenity.id}
                className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-sm flex items-center gap-3 hover:border-purple-300 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  {getAmenityIcon(amenity.icon)}
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {amenity.title}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Resident Reviews */}
        <section id="section-resident-reviews" className="px-4 sm:px-6 py-4 pb-12">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#7C3AED]" />
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Resident Reviews
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{pg.rating} ({pg.reviewCount})</span>
            </div>
          </div>

          {/* Review Cards List */}
          <div className="space-y-3">
            {(showAllReviews ? pg.reviews : pg.reviews.slice(0, 2)).map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#7C3AED] text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                      {review.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">{review.authorName}</div>
                      {review.isCurrentResident && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Current Resident</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{review.rating}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  "{review.content}"
                </p>
              </div>
            ))}
          </div>

          {/* Review Actions */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <button
              id="btn-view-more-reviews"
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="w-full py-3.5 bg-purple-300 hover:bg-purple-400 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-colors cursor-pointer text-center"
            >
              {showAllReviews ? 'Show Fewer Reviews' : 'View more Reviews'}
            </button>

            {onOpenWriteReview && (
              <button
                onClick={onOpenWriteReview}
                className="text-xs font-bold text-[#7C3AED] hover:text-purple-700 py-1.5 cursor-pointer"
              >
                + Write a Verified Review
              </button>
            )}
          </div>
        </section>

        {/* Sticky Bottom Booking Bar */}
        <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-5 py-3.5 shadow-2xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Monthly Rent
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#2563EB]">
              {effectivePrice.toLocaleString()} ₹<span className="text-xs font-medium text-slate-700">/month</span>
            </div>
          </div>

          {/* Book Now Button */}
          <button
            id="btn-book-now-bottom"
            onClick={() => onBookNow(pg, selectedBed)}
            className="px-7 py-3 bg-[#7C3AED] hover:bg-purple-700 active:bg-purple-800 text-white text-sm sm:text-base font-bold rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Book Now</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};

