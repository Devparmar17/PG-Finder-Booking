import React from 'react';
import { createPortal } from 'react-dom';
import { X, Check, RotateCcw, ShieldCheck, Sparkles, Fingerprint, Zap } from 'lucide-react';
import { FilterState, GenderCategory, FoodPreference } from '../types';

interface FilterModalProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onClose: () => void;
  totalResultsCount: number;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onClose,
  totalResultsCount,
}) => {
  const modalContent = (
    <div
      id="filter-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative z-60 bg-white w-full max-w-md sm:max-w-xl md:max-w-2xl rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-4 duration-200"
        style={{ maxHeight: 'min(85dvh, 640px)' }}
      >
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900">All Filters</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetFilters}
              className="text-xs font-bold text-[#7C3AED] hover:text-purple-700 flex items-center gap-1 p-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Form Body */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-5 text-xs">
          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-800">Max Monthly Rent</span>
              <span className="font-black text-[#7C3AED] text-sm">
                ₹{(filters.maxPrice ?? 30000).toLocaleString('en-IN')} / mo
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="30000"
              step="1000"
              value={filters.maxPrice ?? 30000}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
              <span>₹5,000</span>
              <span>₹15,000</span>
              <span>₹30,000+</span>
            </div>
          </div>

          {/* Gender Accommodation */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">Resident Type / Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'All PGs', value: 'all' },
                { label: 'Boys Only', value: 'boys' },
                { label: 'Girls Only', value: 'girls' },
                { label: 'Co-Living / Unisex', value: 'unisex' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange({ genderCategory: opt.value as GenderCategory })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    filters.genderCategory === opt.value
                      ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sharing Preference */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">Room Sharing</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Any', value: 'all' },
                { label: 'Single', value: 'Single' },
                { label: 'Double', value: 'Double' },
                { label: 'Triple', value: 'Triple' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange({ sharingType: opt.value as any })}
                  className={`py-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    filters.sharingType === opt.value
                      ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Food Preference */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">Food / Mess Quality</label>
            <div className="space-y-2">
              {[
                { label: 'Any (Included or Self-Cook)', value: 'all' },
                { label: '3 Meals Included Daily', value: 'included' },
                { label: 'Pure Veg Mess Only', value: 'veg_only' },
                { label: 'Optional Mess (Save with skip)', value: 'optional' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange({ foodPreference: opt.value as FoodPreference })}
                  className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-between text-left transition-all cursor-pointer ${
                    filters.foodPreference === opt.value
                      ? 'bg-purple-50 border-purple-300 text-[#7C3AED]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50/50'
                  }`}
                >
                  <span>{opt.label}</span>
                  {filters.foodPreference === opt.value && (
                    <Check className="w-4 h-4 text-[#7C3AED]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Key Amenities Checkboxes */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">Safety & Key Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onFilterChange({ hasBiometric: !filters.hasBiometric })}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  filters.hasBiometric
                    ? 'bg-purple-50 border-purple-300 text-[#7C3AED] font-bold'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <Fingerprint className="w-4 h-4 text-[#7C3AED]" />
                <span>Biometric Lock</span>
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ verifiedOnly: !filters.verifiedOnly })}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  filters.verifiedOnly
                    ? 'bg-purple-50 border-purple-300 text-[#7C3AED] font-bold'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
                <span>Verified PGs</span>
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ hasAC: !filters.hasAC })}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  filters.hasAC
                    ? 'bg-purple-50 border-purple-300 text-[#7C3AED] font-bold'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <Zap className="w-4 h-4 text-[#7C3AED]" />
                <span>AC Included</span>
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ minRating: filters.minRating > 0 ? 0 : 4.0 })}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  filters.minRating >= 4.0
                    ? 'bg-purple-50 border-purple-300 text-[#7C3AED] font-bold'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>4.0+ Star Rated</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Apply Button - Pinned Sticky */}
        <div
          className="shrink-0 sticky bottom-0 p-4 border-t border-slate-200/80 bg-slate-50 z-10"
          style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
        >
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#7C3AED] hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Show {totalResultsCount} Matching PGs
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};
