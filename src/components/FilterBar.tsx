import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, Check } from 'lucide-react';
import { FilterState, GenderCategory, FoodPreference } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onOpenAdvancedFilters: () => void;
  totalResultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onOpenAdvancedFilters,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'price' | 'food' | 'category' | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const priceOptions = [
    { label: 'Any Price', max: 30000 },
    { label: 'Under ₹8,000', max: 8000 },
    { label: 'Under ₹12,000', max: 12000 },
    { label: 'Under ₹15,000', max: 15000 },
    { label: 'Above ₹15,000', max: 30000 },
  ];

  const foodOptions: { label: string; value: FoodPreference }[] = [
    { label: 'All Food Types', value: 'all' },
    { label: '3 Meals Included', value: 'included' },
    { label: 'Veg Only Mess', value: 'veg_only' },
    { label: 'Optional / Self-Cook', value: 'optional' },
  ];

  const categoryOptions: { label: string; value: GenderCategory }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Boys PG', value: 'boys' },
    { label: 'Girls PG', value: 'girls' },
    { label: 'Co-Living / Unisex', value: 'unisex' },
  ];

  const isAllActive =
    filters.genderCategory === 'all' &&
    filters.foodPreference === 'all' &&
    filters.maxPrice >= 30000 &&
    filters.sharingType === 'all';

  const hasActiveFiltersCount =
    (filters.genderCategory !== 'all' ? 1 : 0) +
    (filters.foodPreference !== 'all' ? 1 : 0) +
    (filters.maxPrice < 30000 ? 1 : 0) +
    (filters.sharingType !== 'all' ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.hasAC ? 1 : 0) +
    (filters.hasBiometric ? 1 : 0);

  return (
    <div ref={barRef} id="filter-bar" className="px-4 py-2 relative z-30">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {/* 'All' pill button */}
        <button
          id="btn-filter-all"
          onClick={() => {
            onFilterChange({
              genderCategory: 'all',
              foodPreference: 'all',
              maxPrice: 30000,
              sharingType: 'all',
              verifiedOnly: false,
              hasAC: false,
              hasBiometric: false,
            });
            setOpenDropdown(null);
          }}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
            isAllActive
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All
        </button>

        {/* Price ▾ Dropdown */}
        <div className="relative shrink-0">
          <button
            id="btn-filter-price"
            onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              filters.maxPrice < 30000
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>
              {filters.maxPrice < 30000 ? `≤ ₹${filters.maxPrice.toLocaleString()}` : 'Price'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'price' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}
            />
          </button>

          {openDropdown === 'price' && (
            <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Filter by Rent / Mo
              </div>
              {priceOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    onFilterChange({ maxPrice: opt.max });
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between transition-colors"
                >
                  <span>{opt.label}</span>
                  {filters.maxPrice === opt.max && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Food ▾ Dropdown */}
        <div className="relative shrink-0">
          <button
            id="btn-filter-food"
            onClick={() => setOpenDropdown(openDropdown === 'food' ? null : 'food')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              filters.foodPreference !== 'all'
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>
              {filters.foodPreference === 'included'
                ? '3 Meals'
                : filters.foodPreference === 'veg_only'
                  ? 'Pure Veg'
                  : filters.foodPreference === 'optional'
                    ? 'Optional'
                    : 'Food'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'food' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}
            />
          </button>

          {openDropdown === 'food' && (
            <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Food / Mess Option
              </div>
              {foodOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onFilterChange({ foodPreference: opt.value });
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between transition-colors"
                >
                  <span>{opt.label}</span>
                  {filters.foodPreference === opt.value && (
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category ▾ Dropdown */}
        <div className="relative shrink-0">
          <button
            id="btn-filter-category"
            onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              filters.genderCategory !== 'all'
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>
              {filters.genderCategory === 'boys'
                ? 'Boys'
                : filters.genderCategory === 'girls'
                  ? 'Girls'
                  : filters.genderCategory === 'unisex'
                    ? 'Co-Living'
                    : 'Category'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'category' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}
            />
          </button>

          {openDropdown === 'category' && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Gender / Accommodation
              </div>
              {categoryOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onFilterChange({ genderCategory: opt.value });
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between transition-colors"
                >
                  <span>{opt.label}</span>
                  {filters.genderCategory === opt.value && (
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* More Filters button */}
        <button
          id="btn-open-advanced-filters"
          onClick={onOpenAdvancedFilters}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
            hasActiveFiltersCount > 0
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
          aria-label="Filter Options"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {hasActiveFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-blue-700 text-[10px] font-bold flex items-center justify-center">
              {hasActiveFiltersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
