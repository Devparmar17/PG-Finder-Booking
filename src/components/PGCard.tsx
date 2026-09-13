import React from 'react';
import { Star, MapPin, Wifi, BedDouble, Heart } from 'lucide-react';
import { PGListing } from '../types';
import { getOptimizedImageUrl } from '../lib/imageUtils';

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
  const categoryLabel =
    pg.category === 'girls' ? 'Girls' : pg.category === 'boys' ? 'Boys' : 'Unisex';
  const categorySymbol =
    pg.category === 'girls' ? '♀' : pg.category === 'boys' ? '♂' : '⚥';

  return (
    <div
      id={`pg-card-${pg.id}`}
      onClick={() => onSelect(pg)}
      className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex gap-3.5 items-center group relative"
    >
      {/* Left Thumbnail with aspect ratio and lazy loading */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 aspect-square">
        <img
          src={getOptimizedImageUrl(pg.images[0], 240)}
          alt={`${pg.name} room view`}
          width={112}
          height={112}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {pg.isVerified && (
          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#7C3AED] text-white text-[11px] font-bold rounded shadow-xs tracking-tight">
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
          <div className="flex items-center gap-1 text-slate-500 text-xs mb-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" aria-hidden="true" />
            <span className="truncate">{pg.location.replace(/^[A-Za-z]+,\s*/, '') || 'Ahmedabad-Gujarat'}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs mb-1.5">
            <div className="flex items-center gap-0.5 text-slate-700 font-semibold">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" aria-hidden="true" />
              <span>{pg.rating}</span>
            </div>
            <span className="text-slate-500 text-[11px]">({pg.reviewCount})</span>
          </div>
        </div>

        {/* Bottom Row: Amenities Icons & 44x44 Heart Icon */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2.5 text-[#6D28D9]">
            <BedDouble className="w-4 h-4 text-[#6D28D9]" aria-hidden="true" />
            <Wifi className="w-4 h-4 text-[#6D28D9]" aria-hidden="true" />
            <span
              className="text-xs font-bold text-[#6D28D9] flex items-center gap-0.5"
              aria-label={`${categoryLabel} PG accommodation`}
            >
              <span className="text-[15px] leading-none" aria-hidden="true">{categorySymbol}</span>
              <span className="text-[11px] uppercase tracking-wider">{categoryLabel}</span>
            </span>
          </div>

          {/* Heart Button - 44x44px touch target (WCAG 2.5.5) */}
          <button
            id={`btn-fav-card-${pg.id}`}
            onClick={(e) => onToggleFavorite(pg.id, e)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] -mr-2.5 -mb-2 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            aria-label={isFavorite ? `Remove ${pg.name} from saved favorites` : `Save ${pg.name} to favorites`}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-300 hover:text-red-400'
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
};


