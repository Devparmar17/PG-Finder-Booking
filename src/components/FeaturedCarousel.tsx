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
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
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
              className="min-w-[260px] max-w-[280px] bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer snap-start shrink-0 overflow-hidden flex flex-col group"
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
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 bg-purple-600/95 backdrop-blur-sm text-white text-[11px] font-bold rounded-full shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    <span>Verified</span>
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  id={`btn-fav-featured-${pg.id}`}
                  onClick={(e) => onToggleFavorite(pg.id, e)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/85 hover:bg-white text-slate-700 backdrop-blur-sm shadow-sm transition-transform active:scale-90"
                  aria-label="Toggle favorite"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isFav ? 'fill-red-500 text-red-500' : 'text-slate-600'
                    }`}
                  />
                </button>

                {/* Price Tag Pill on Image */}
                <div className="absolute bottom-2.5 right-2.5 px-3 py-1 bg-purple-700/90 backdrop-blur-md text-white text-xs font-bold rounded-lg shadow-sm">
                  ₹ {pg.pricePerMonth.toLocaleString()}/Mo
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="font-bold text-base text-slate-900 truncate">{pg.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{pg.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-2.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="truncate">{pg.location}</span>
                  </div>
                </div>

                {/* Amenities Icons Row matching screenshot */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-purple-600 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-slate-600" title="Sharing Available">
                      <BedDouble className="w-4 h-4 text-purple-600" />
                      <span className="text-[11px] font-medium text-slate-600">
                        {pg.sharingOptions[0]?.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600" title="High Speed Wi-Fi">
                      <Wifi className="w-4 h-4 text-purple-600" />
                      <span className="text-[11px] font-medium text-slate-600">Wi-Fi</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600" title="Category">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-[11px] font-medium capitalize text-slate-600">
                        {pg.category}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
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
