import React from 'react';
import { Home, Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLocationTagClick?: (tag: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div id="search-section" className="px-5 pt-3 pb-2">
      {/* Hero Title - Sole H1 on Explore screen */}
      <h1 tabIndex={-1} className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-3 outline-none">
        Find Your <span className="text-[#7C3AED] font-extrabold">PG</span>
      </h1>

      {/* Visible Input Label */}
      <label
        htmlFor="input-location-search"
        className="block text-xs font-bold text-slate-600 mb-1.5"
      >
        Search by location, college, or area
      </label>

      {/* Search Input Box */}
      <div className="relative flex items-center bg-white rounded-2xl border border-purple-100/90 shadow-sm hover:border-purple-200 transition-all">
        <div className="absolute left-4 text-[#7C3AED] flex items-center pointer-events-none" aria-hidden="true">
          <Home className="w-5 h-5 text-[#7C3AED] stroke-[2]" />
        </div>

        <input
          id="input-location-search"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="e.g. Navrangpura, CEPT, Vastrapur"
          autoComplete="street-address"
          className="w-full pl-12 pr-12 py-3.5 bg-transparent rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
        />

        {searchQuery ? (
          <button
            id="btn-clear-search"
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-1 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

