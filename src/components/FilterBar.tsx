import React, { useState } from 'react';
import {
  ChevronDown,
  Check,
  X,
  IndianRupee,
  Utensils,
  Users,
  BedDouble,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Wind,
  KeyRound,
  Star,
} from 'lucide-react';
import { FilterState, GenderCategory, FoodPreference, SharingType } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onOpenAdvancedFilters?: () => void;
  totalResultsCount?: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  totalResultsCount,
}) => {
  const [activePopBox, setActivePopBox] = useState<
    'price' | 'food' | 'category' | 'sharing' | 'amenities' | null
  >(null);

  // Temporary local price state for slider inside popbox
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(filters.maxPrice);

  const pricePresets = [
    { label: 'All Budgets (Up to ₹30k)', max: 30000, desc: 'View all standard & luxury rooms' },
    { label: 'Under ₹8,000 / mo', max: 8000, desc: 'Pocket-friendly & student stays' },
    { label: 'Under ₹12,000 / mo', max: 12000, desc: 'Most popular standard PGs' },
    { label: 'Under ₹16,000 / mo', max: 16000, desc: 'Premium AC & attached washrooms' },
    { label: 'Under ₹22,000 / mo', max: 22000, desc: 'Luxury private studio apartments' },
  ];

  const foodOptions: {
    label: string;
    sublabel: string;
    value: FoodPreference;
    badge?: string;
  }[] = [
    {
      label: 'All Food Options',
      sublabel: 'With mess, optional food, or self-cooking',
      value: 'all',
    },
    {
      label: '3 Meals Included',
      sublabel: 'Unlimited breakfast, lunch & hot dinner buffet',
      value: 'included',
      badge: 'Popular',
    },
    {
      label: 'Pure Veg Mess Only',
      sublabel: '100% vegetarian kitchen with separate utensils',
      value: 'veg_only',
      badge: 'Pure Veg',
    },
    {
      label: 'Optional / Self-Cooking',
      sublabel: 'Equipped kitchen with fridge, induction & microwave',
      value: 'optional',
    },
  ];

  const categoryOptions: {
    label: string;
    sublabel: string;
    value: GenderCategory;
    iconText: string;
  }[] = [
    {
      label: 'All Accommodations',
      sublabel: 'View all verified boys, girls & co-living PGs',
      value: 'all',
      iconText: '🏢',
    },
    {
      label: 'Boys PG & Hostels',
      sublabel: 'Dedicated accommodations for working men & students',
      value: 'boys',
      iconText: '👦',
    },
    {
      label: 'Girls PG & Hostels',
      sublabel: '24/7 security, biometric gates & dedicated warden',
      value: 'girls',
      iconText: '👧',
    },
    {
      label: 'Co-Living & Unisex',
      sublabel: 'Modern studio suites and collaborative community',
      value: 'unisex',
      iconText: '👫',
    },
  ];

  const sharingOptions: {
    label: string;
    sublabel: string;
    value: SharingType;
    iconText: string;
  }[] = [
    {
      label: 'All Sharing Types',
      sublabel: 'Any bed and room configuration',
      value: 'all',
      iconText: '🏠',
    },
    {
      label: 'Single Sharing (Private)',
      sublabel: 'Dedicated private room with personal wardrobe',
      value: 'single',
      iconText: '🚪',
    },
    {
      label: 'Double Sharing (Twin)',
      sublabel: 'Shared between 2 roommates with individual beds',
      value: 'double',
      iconText: '👥',
    },
    {
      label: 'Triple Sharing',
      sublabel: '3-bed setup, balanced comfort and budget',
      value: 'triple',
      iconText: '👨‍👦‍👦',
    },
    {
      label: '4-Bed Sharing (Budget)',
      sublabel: 'Maximum savings with all standard amenities',
      value: 'four_plus',
      iconText: '🏘',
    },
  ];

  const isAllActive =
    filters.genderCategory === 'all' &&
    filters.foodPreference === 'all' &&
    filters.maxPrice >= 30000 &&
    filters.sharingType === 'all' &&
    !filters.hasAC &&
    !filters.verifiedOnly &&
    !filters.hasBiometric;

  const handleResetAll = () => {
    onFilterChange({
      genderCategory: 'all',
      foodPreference: 'all',
      maxPrice: 30000,
      sharingType: 'all',
      verifiedOnly: false,
      hasAC: false,
      hasBiometric: false,
      minRating: 0,
    });
    setTempMaxPrice(30000);
    setActivePopBox(null);
  };

  return (
    <div id="filter-bar" className="px-5 py-2 relative z-30">
      {/* Horizontal Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {/* 'All' button */}
        <button
          id="btn-filter-all"
          onClick={handleResetAll}
          className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            isAllActive
              ? 'bg-[#7C3AED] text-white shadow-sm'
              : 'bg-purple-50/80 hover:bg-purple-100/80 border border-purple-200/80 text-purple-900'
          }`}
        >
          All
        </button>

        {/* 💰 Price Pop Box Button */}
        <button
          id="btn-filter-price"
          onClick={() => {
            setTempMaxPrice(filters.maxPrice);
            setActivePopBox('price');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
            filters.maxPrice < 30000
              ? 'bg-purple-100 border-[#7C3AED] text-[#7C3AED] shadow-xs'
              : 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/80 text-purple-900'
          }`}
        >
          <IndianRupee className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>
            {filters.maxPrice < 30000 ? `≤ ₹${filters.maxPrice.toLocaleString()}` : 'Price'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#7C3AED]" />
        </button>

        {/* 🍴 Food Pop Box Button */}
        <button
          id="btn-filter-food"
          onClick={() => setActivePopBox('food')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
            filters.foodPreference !== 'all'
              ? 'bg-purple-100 border-[#7C3AED] text-[#7C3AED] shadow-xs'
              : 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/80 text-purple-900'
          }`}
        >
          <Utensils className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>
            {filters.foodPreference === 'included'
              ? '3 Meals Included'
              : filters.foodPreference === 'veg_only'
              ? 'Pure Veg Mess'
              : filters.foodPreference === 'optional'
              ? 'Self Cooking'
              : 'Food'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#7C3AED]" />
        </button>

        {/* 👤 Category Pop Box Button */}
        <button
          id="btn-filter-category"
          onClick={() => setActivePopBox('category')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
            filters.genderCategory !== 'all'
              ? 'bg-purple-100 border-[#7C3AED] text-[#7C3AED] shadow-xs'
              : 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/80 text-purple-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>
            {filters.genderCategory === 'boys'
              ? 'Boys PG'
              : filters.genderCategory === 'girls'
              ? 'Girls PG'
              : filters.genderCategory === 'unisex'
              ? 'Co-Living'
              : 'Category'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#7C3AED]" />
        </button>

        {/* 🛏 Sharing Pop Box Button */}
        <button
          id="btn-filter-sharing"
          onClick={() => setActivePopBox('sharing')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
            filters.sharingType !== 'all'
              ? 'bg-purple-100 border-[#7C3AED] text-[#7C3AED] shadow-xs'
              : 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/80 text-purple-900'
          }`}
        >
          <BedDouble className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>
            {filters.sharingType === 'single'
              ? 'Single Bed'
              : filters.sharingType === 'double'
              ? 'Double Sharing'
              : filters.sharingType === 'triple'
              ? 'Triple Sharing'
              : filters.sharingType === 'four_plus'
              ? '4-Sharing'
              : 'Sharing'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#7C3AED]" />
        </button>

        {/* ✨ Features / Amenities Pop Box Button */}
        <button
          id="btn-filter-amenities"
          onClick={() => setActivePopBox('amenities')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
            filters.hasAC || filters.verifiedOnly || filters.hasBiometric || filters.minRating > 0
              ? 'bg-purple-100 border-[#7C3AED] text-[#7C3AED] shadow-xs'
              : 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/80 text-purple-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>Features</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#7C3AED]" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ======================= HOME SCREEN POP BOX OVERLAYS ==================== */}
      {/* ========================================================================= */}
      {activePopBox && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 border border-slate-200 shadow-2xl space-y-4 animate-in slide-in-from-bottom-4 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Pop Box Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold">
                  {activePopBox === 'price' && <IndianRupee className="w-4 h-4" />}
                  {activePopBox === 'food' && <Utensils className="w-4 h-4" />}
                  {activePopBox === 'category' && <Users className="w-4 h-4" />}
                  {activePopBox === 'sharing' && <BedDouble className="w-4 h-4" />}
                  {activePopBox === 'amenities' && <Sparkles className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {activePopBox === 'price' && 'Select Price & Budget'}
                    {activePopBox === 'food' && 'Select Food & Mess Preference'}
                    {activePopBox === 'category' && 'Select Accommodation Category'}
                    {activePopBox === 'sharing' && 'Select Room Sharing Type'}
                    {activePopBox === 'amenities' && 'Filter by Features & Security'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {totalResultsCount !== undefined
                      ? `${totalResultsCount} properties available`
                      : 'Instant real-time search results'}
                  </p>
                </div>
              </div>
              <button
                id="btn-close-popbox"
                onClick={() => setActivePopBox(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ================= 1. PRICE POP BOX CONTENT ================= */}
            {activePopBox === 'price' && (
              <div className="space-y-4">
                {/* Real-time Slider */}
                <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Max Monthly Budget</span>
                    <span className="text-base font-extrabold text-[#2563EB]">
                      {tempMaxPrice >= 30000 ? 'Any Budget' : `₹${tempMaxPrice.toLocaleString()}/mo`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={30000}
                    step={1000}
                    value={tempMaxPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTempMaxPrice(val);
                      onFilterChange({ maxPrice: val });
                    }}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>₹5,000</span>
                    <span>₹15,000</span>
                    <span>₹30,000+</span>
                  </div>
                </div>

                {/* Preset Options */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    Quick Budget Presets
                  </div>
                  {pricePresets.map((preset) => {
                    const isSelected = filters.maxPrice === preset.max;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => {
                          setTempMaxPrice(preset.max);
                          onFilterChange({ maxPrice: preset.max });
                          setActivePopBox(null);
                        }}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50/80 border-[#7C3AED] ring-2 ring-purple-500/20'
                            : 'bg-white border-slate-200/90 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-900">{preset.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{preset.desc}</div>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-[#7C3AED]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= 2. FOOD POP BOX CONTENT ================= */}
            {activePopBox === 'food' && (
              <div className="space-y-2.5">
                {foodOptions.map((opt) => {
                  const isSelected = filters.foodPreference === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onFilterChange({ foodPreference: opt.value });
                        setActivePopBox(null);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50/80 border-[#7C3AED] ring-2 ring-purple-500/20'
                          : 'bg-white border-slate-200/90 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{opt.label}</span>
                          {opt.badge && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{opt.sublabel}</p>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-[#7C3AED] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ================= 3. CATEGORY POP BOX CONTENT ================= */}
            {activePopBox === 'category' && (
              <div className="space-y-2.5">
                {categoryOptions.map((opt) => {
                  const isSelected = filters.genderCategory === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onFilterChange({ genderCategory: opt.value });
                        setActivePopBox(null);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50/80 border-[#7C3AED] ring-2 ring-purple-500/20'
                          : 'bg-white border-slate-200/90 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{opt.iconText}</div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{opt.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{opt.sublabel}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-[#7C3AED] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ================= 4. SHARING POP BOX CONTENT ================= */}
            {activePopBox === 'sharing' && (
              <div className="space-y-2.5">
                {sharingOptions.map((opt) => {
                  const isSelected = filters.sharingType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onFilterChange({ sharingType: opt.value });
                        setActivePopBox(null);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50/80 border-[#7C3AED] ring-2 ring-purple-500/20'
                          : 'bg-white border-slate-200/90 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{opt.iconText}</div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{opt.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{opt.sublabel}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-[#7C3AED] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ================= 5. AMENITIES / FEATURES POP BOX ================= */}
            {activePopBox === 'amenities' && (
              <div className="space-y-2.5">
                {/* AC Toggle */}
                <button
                  onClick={() => onFilterChange({ hasAC: !filters.hasAC })}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    filters.hasAC
                      ? 'bg-purple-50/80 border-[#7C3AED] ring-2 ring-purple-500/20'
                      : 'bg-white border-slate-200/90 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                      <Wind className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Air Conditioned (AC)</div>
                      <div className="text-xs text-slate-500">Power backup split AC units</div>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                      filters.hasAC
                        ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {filters.hasAC && <Check className="w-4 h-4" />}
                  </div>
                </button>

                {/* Zero Brokerage / Verified */}
                <button
                  onClick={() => onFilterChange({ verifiedOnly: !filters.verifiedOnly })}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    filters.verifiedOnly
                      ? 'bg-purple-50/80 border-[#7C3AED] ring-2 ring-purple-500/20'
                      : 'bg-white border-slate-200/90 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Verified (0% Brokerage)</div>
                      <div className="text-xs text-slate-500">Physically audited & approved</div>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                      filters.verifiedOnly
                        ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {filters.verifiedOnly && <Check className="w-4 h-4" />}
                  </div>
                </button>

                {/* Biometric */}
                <button
                  onClick={() => onFilterChange({ hasBiometric: !filters.hasBiometric })}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    filters.hasBiometric
                      ? 'bg-purple-50/80 border-[#7C3AED] ring-2 ring-purple-500/20'
                      : 'bg-white border-slate-200/90 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Biometric & CCTV</div>
                      <div className="text-xs text-slate-500">Keyless smart lock security</div>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                      filters.hasBiometric
                        ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {filters.hasBiometric && <Check className="w-4 h-4" />}
                  </div>
                </button>

                {/* Top Rated (4.5+) */}
                <button
                  onClick={() =>
                    onFilterChange({ minRating: filters.minRating >= 4.5 ? 0 : 4.5 })
                  }
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    filters.minRating >= 4.5
                      ? 'bg-purple-50/80 border-[#7C3AED] ring-2 ring-purple-500/20'
                      : 'bg-white border-slate-200/90 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                      <Star className="w-5 h-5 fill-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Top Rated (4.5+ Stars)</div>
                      <div className="text-xs text-slate-500">Highest resident reviews & hygiene</div>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                      filters.minRating >= 4.5
                        ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {filters.minRating >= 4.5 && <Check className="w-4 h-4" />}
                  </div>
                </button>
              </div>
            )}

            {/* Bottom Actions for Pop Box */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
              <button
                id="btn-reset-filter"
                onClick={handleResetAll}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
              <button
                id="btn-apply-filter"
                onClick={() => setActivePopBox(null)}
                className="flex-1 py-3 px-4 bg-[#7C3AED] hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold rounded-2xl shadow-sm transition-all cursor-pointer text-center"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
