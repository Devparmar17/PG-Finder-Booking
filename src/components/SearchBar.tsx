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
      {/* Hero Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
        Find Your <span className="text-[#8B5CF6] font-extrabold">PG</span>
      </h1>

      {/* Search Input Box */}
      <div className="relative flex items-center bg-white rounded-2xl border border-purple-100/90 shadow-sm hover:border-purple-200 transition-all">
        <div className="absolute left-4 text-[#8B5CF6] flex items-center pointer-events-none">
          <Home className="w-5 h-5 text-[#8B5CF6] stroke-[2]" />
        </div>

        <input
          id="input-location-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by location"
          className="w-full pl-12 pr-10 py-3.5 bg-transparent rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30"
        />

        {searchQuery ? (
          <button
            id="btn-clear-search"
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

