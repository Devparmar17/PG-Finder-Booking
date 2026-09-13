import React from 'react';
import { Star, MapPin, Wifi, BedDouble, Check } from 'lucide-react';
import { PGListing } from '../types';
import { getOptimizedImageUrl } from '../lib/imageUtils';

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
  onSeeAllClick,
}) => {
  const featuredListings = listings.filter((l) => l.isFeatured);

  return (
    <section id="section-featured-stay" className="pt-2 pb-3">
      {/* Section Header */}
      <div className="px-5 flex items-center justify-between mb-2">
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
          Featured <span className="text-slate-800 font-extrabold">Stay</span>
        </h2>
        {/* "see all" button with minimum 44x44px touch target (WCAG 2.5.5) */}
        <button
          id="btn-see-all-featured"
          onClick={onSeeAllClick}
          className="min-h-[44px] min-w-[44px] px-3 py-2.5 flex items-center justify-end text-xs font-bold text-[#2563EB] hover:text-blue-700 hover:underline transition-all cursor-pointer"
          aria-label="See all featured PG accommodations"
        >
          see all
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-2 snap-x snap-mandatory">
        {featuredListings.map((pg, index) => {
          const categoryLabel =
            pg.category === 'girls' ? 'Girls' : pg.category === 'boys' ? 'Boys' : 'Unisex';
          const categorySymbol =
            pg.category === 'girls' ? '♀' : pg.category === 'boys' ? '♂' : '⚥';

          return (
            <div
              key={pg.id}
              id={`featured-card-${pg.id}`}
              onClick={() => onSelectPG(pg)}
              className="min-w-[265px] max-w-[285px] bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer snap-start shrink-0 overflow-hidden flex flex-col group"
            >
              {/* Image with Badges */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 aspect-[16/10]">
                <img
                  src={getOptimizedImageUrl(pg.images[0], 600)}
                  alt={`${pg.name} featured room view`}
                  width={285}
                  height={176}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  {...(index === 0 ? { fetchPriority: 'high' } : {})}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Verified Badge on top left */}
                {pg.isVerified && (
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 bg-[#7C3AED] text-white text-[11px] font-bold rounded-lg shadow-sm tracking-tight">
                    <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
                    <span>Verified</span>
                  </div>
                )}

                {/* Price Tag Pill on Image bottom right */}
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#7C3AED] text-white text-xs font-bold rounded-md shadow-sm">
                  ₹ {(pg.pricePerMonth ?? 0).toLocaleString('en-IN')} <span className="text-[11px] font-normal">/Mo</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="font-bold text-base text-slate-900 truncate">
                      {pg.name}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-700 text-xs font-semibold shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" aria-hidden="true" />
                      <span>{pg.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-2.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" aria-hidden="true" />
                    <span className="truncate">{pg.location.replace(/^[A-Za-z]+,\s*/, '') || 'Ahmedabad-Gujarat'}</span>
                  </div>
                </div>

                {/* Amenities Icons Row */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-3.5 text-[#6D28D9]">
                  <div className="flex items-center gap-1 text-xs text-[#6D28D9]">
                    <BedDouble className="w-4 h-4 text-[#6D28D9]" aria-hidden="true" />
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[#6D28D9]">
                    <Wifi className="w-4 h-4 text-[#6D28D9]" aria-hidden="true" />
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[#6D28D9]">
                    <span
                      className="text-xs font-bold text-[#6D28D9] flex items-center gap-0.5"
                      aria-label={`${categoryLabel} PG`}
                    >
                      <span className="text-[15px] leading-none" aria-hidden="true">{categorySymbol}</span>
                      <span className="text-[11px] uppercase tracking-wider">{categoryLabel}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

