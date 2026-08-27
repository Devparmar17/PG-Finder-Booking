import React from 'react';
import { Star, MapPin, Wifi, BedDouble, Users, Heart, CheckCircle2, Shield } from 'lucide-react';
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
      className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex gap-3.5 items-center group relative"
    >
      {/* Left Thumbnail with Verified badge */}
      <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-lg overflow-hidden bg-slate-100 shrink-0">
        <img
          src={pg.images[0]}
          alt={pg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {pg.isVerified && (
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[9px] font-bold rounded uppercase tracking-wider shadow-sm" title="Verified PG">
            Verified
          </div>
        )}

        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-bold rounded">
          ₹{(pg.pricePerMonth / 1000).toFixed(pg.pricePerMonth % 1000 === 0 ? 0 : 1)}k/mo
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
        <div>
          {/* Title and Rating */}
          <div className="flex items-start justify-between gap-1 mb-0.5">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {pg.name}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-slate-500 text-xs mb-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{pg.location}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs mb-2">
            <div className="flex items-center gap-0.5 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{pg.rating}</span>
            </div>
            <span className="text-slate-400 text-[11px]">({pg.reviewCount} reviews)</span>
            {pg.distanceFromUserKm && (
              <span className="text-blue-600 text-[11px] font-medium ml-1">
                • {pg.distanceFromUserKm} km
              </span>
            )}
          </div>
        </div>

        {/* Bottom Row: Amenities & Heart Icon matching design */}
        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded">
              {pg.sharingOptions[0]?.split(' ')[0]}
            </span>

            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded">
              Wi-Fi
            </span>

            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded capitalize">
              {pg.category}
            </span>
          </div>

          {/* Heart Button */}
          <button
            id={`btn-fav-card-${pg.id}`}
            onClick={(e) => onToggleFavorite(pg.id, e)}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
            aria-label="Save to favorites"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
