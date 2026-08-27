import React from 'react';
import { Star, MapPin, Wifi, BedDouble, Users, Heart, CheckCircle2 } from 'lucide-react';
import { PGListing } from '../types';

interface FeaturedCarouselProps {
  listings: PGListing[];
  onSelectPG: (pg: PGListing) => void;
  favorites: string[];
  onToggleFavorite: (pgId: string, e: React.MouseEvent) => void;
  onSeeAllClick: () => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  listings,
  onSelectPG,
  favorites,
  onToggleFavorite,
  onSeeAllClick,
}) => {
  const featuredListings = listings.filter((l) => l.isFeatured);

  return (
    <section id="section-featured-stay" className="pt-2 pb-4">
      {/* Section Header */}
      <div className="px-4 flex items-center justify-between mb-3">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Featured <span className="text-slate-900 font-extrabold">Stay</span>
        </h2>
        <button
          id="btn-see-all-featured"
          onClick={onSeeAllClick}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
        >
          see all
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-2 snap-x snap-mandatory">
        {featuredListings.map((pg) => {
          const isFav = favorites.includes(pg.id);

          return (
            <div
              key={pg.id}
              id={`featured-card-${pg.id}`}
              onClick={() => onSelectPG(pg)}
              className="min-w-[260px] max-w-[280px] bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer snap-start shrink-0 overflow-hidden flex flex-col group"
            >
              {/* Image with Badges */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={pg.images[0]}
                  alt={pg.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Verified Badge */}
                {pg.isVerified && (
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold rounded uppercase tracking-wider shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span>Verified</span>
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  id={`btn-fav-featured-${pg.id}`}
                  onClick={(e) => onToggleFavorite(pg.id, e)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm transition-transform active:scale-90"
                  aria-label="Toggle favorite"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isFav ? 'fill-red-500 text-red-500' : 'text-slate-600'
                    }`}
                  />
                </button>

                {/* Price Tag Pill on Image */}
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-slate-900/85 backdrop-blur-sm text-white text-xs font-bold rounded-md shadow-sm">
                  ₹ {pg.pricePerMonth.toLocaleString()}<span className="text-[10px] font-normal text-slate-300">/mo</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="font-bold text-base text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {pg.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{pg.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-2.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{pg.location}</span>
                  </div>
                </div>

                {/* Amenities Icons Row matching screenshot */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
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

                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    0 Brokerage
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
