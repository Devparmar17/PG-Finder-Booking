import React from 'react';
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
  return (
    <div
      id="filter-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-md max-h-[90vh] rounded-t-2xl sm:rounded-xl flex flex-col relative shadow-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">All Filters</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 p-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Form Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-slate-800">Max Monthly Rent</span>
              <span className="font-bold text-blue-600 text-sm">
                ₹{filters.maxPrice.toLocaleString()} / mo
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="30000"
              step="1000"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
              <span>₹5,000</span>
              <span>₹15,000</span>
              <span>₹30,000+</span>
            </div>
          </div>

          {/* Gender Accommodation */}
          <div>
            <label className="block font-semibold text-slate-800 mb-2">Resident Type / Gender</label>
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
                  className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    filters.genderCategory === opt.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sharing Preference */}
          <div>
            <label className="block font-semibold text-slate-800 mb-2">Room Sharing</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: 'Any', value: 'all' },
                { label: 'Single', value: 'Single' },
                { label: 'Double', value: 'Double' },
                { label: 'Triple', value: 'Triple' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange({ sharingType: opt.value as any })}
                  className={`py-2 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                    filters.sharingType === opt.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Food Preference */}
          <div>
            <label className="block font-semibold text-slate-800 mb-2">Food / Mess Quality</label>
            <div className="space-y-1.5">
              {[
                { label: 'Any (Included or Self-Cook)', value: 'all' },
                { label: '3 Meals Included Daily', value: 'included' },
                { label: 'Pure Veg Mess Only', value: 'veg_only' },
                { label: 'Optional Mess (Save with skip)', value: 'optional' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange({ foodPreference: opt.value as FoodPreference })}
                  className={`w-full py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-between text-left transition-all cursor-pointer ${
                    filters.foodPreference === opt.value
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{opt.label}</span>
                  {filters.foodPreference === opt.value && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Key Amenities Checkboxes */}
          <div>
            <label className="block font-semibold text-slate-800 mb-2">Safety & Key Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              <label
                onClick={() => onFilterChange({ hasBiometric: !filters.hasBiometric })}
                className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                  filters.hasBiometric
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <Fingerprint className="w-4 h-4 text-blue-600" />
                <span>Biometric Lock</span>
              </label>

              <label
                onClick={() => onFilterChange({ verifiedOnly: !filters.verifiedOnly })}
                className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                  filters.verifiedOnly
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Verified PGs</span>
              </label>

              <label
                onClick={() => onFilterChange({ hasAC: !filters.hasAC })}
                className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                  filters.hasAC
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <Zap className="w-4 h-4 text-blue-600" />
                <span>AC Included</span>
              </label>

              <label
                onClick={() => onFilterChange({ minRating: filters.minRating > 0 ? 0 : 4.0 })}
                className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                  filters.minRating >= 4.0
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>4.0+ Star Rated</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Apply Button */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Show {totalResultsCount} Matching PGs
          </button>
        </div>
      </div>
    </div>
  );
};
