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
  onLocationTagClick,
}) => {
  const quickLocations = ['Thaltej', 'Bodakdev', 'Satellite', 'Navrangpura', 'Vastrapur', 'SG Highway'];

  return (
    <div id="search-section" className="px-4 pt-1 pb-3">
      {/* Hero Title */}
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
        Find Your <span className="text-blue-600 font-extrabold">PG</span>
      </h1>

      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-blue-600 flex items-center pointer-events-none">
          <Home className="w-5 h-5 text-blue-600" />
        </div>

        <input
          id="input-location-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by location, area, or landmark"
          className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
        />

        {searchQuery ? (
          <button
            id="btn-clear-search"
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute right-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Quick Location Pills */}
      <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
          Popular:
        </span>
        {quickLocations.map((loc) => (
          <button
            key={loc}
            onClick={() => {
              onSearchChange(loc);
              onLocationTagClick?.(loc);
            }}
            className={`px-2.5 py-1 rounded-md font-medium transition-all shrink-0 text-[11px] ${
              searchQuery.toLowerCase().includes(loc.toLowerCase())
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
};
