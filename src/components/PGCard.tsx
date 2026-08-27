import React from 'react';
import { Star, MapPin, Wifi, BedDouble, Heart } from 'lucide-react';
import { PGListing } from '../types';

interface PGCardProps {
  pg: PGListing;
  onSelect: (pg: PGListing) => void;
  isFavorite: boolean;
  onToggleFavorite: (pgId: string, e: React.MouseEvent) => void;
}

export const PGCard: React.FC<PGCardProps> = ({
  pg,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div
      id={`pg-card-${pg.id}`}
      onClick={() => onSelect(pg)}
      className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex gap-3.5 items-center group relative"
    >
      {/* Left Thumbnail */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
        <img
          src={pg.images[0]}
          alt={pg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {pg.isVerified && (
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#7C3AED] text-white text-[8px] font-bold rounded shadow-xs">
            Verified
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
        <div>
          {/* Title and Rating */}
          <div className="flex items-start justify-between gap-1 mb-0.5">
            <h3 className="font-bold text-base text-slate-900 truncate">
              {pg.name}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-slate-400 text-xs mb-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
            <span className="truncate">{pg.location.replace(/^[A-Za-z]+,\s*/, '') || 'Ahmedabad-Gujarat'}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs mb-1.5">
            <div className="flex items-center gap-0.5 text-slate-700 font-semibold">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{pg.rating}</span>
            </div>
            <span className="text-slate-400 text-[11px]">({pg.reviewCount})</span>
          </div>
        </div>

        {/* Bottom Row: Amenities Icons & Heart Icon */}
        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
          <div className="flex items-center gap-3 text-[#8B5CF6]">
            <BedDouble className="w-4 h-4 text-[#8B5CF6]" />
            <Wifi className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-sm font-bold text-[#8B5CF6]">
              {pg.category === 'girls' ? '♀' : pg.category === 'boys' ? '♂' : '⚥'}
            </span>
          </div>

          {/* Heart Button */}
          <button
            id={`btn-fav-card-${pg.id}`}
            onClick={(e) => onToggleFavorite(pg.id, e)}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            aria-label="Save to favorites"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-300'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

