import React from 'react';
import { ArrowRight, MapPin, Navigation, Sparkles } from 'lucide-react';
import { PGListing } from '../types';

interface NearYouMapPreviewProps {
  onOpenMap: () => void;
  listingsCount: number;
  nearestPG?: PGListing;
}

export const NearYouMapPreview: React.FC<NearYouMapPreviewProps> = ({
  onOpenMap,
  listingsCount,
  nearestPG,
}) => {
  const centerLat = nearestPG?.coordinates.lat || 23.0525;
  const centerLng = nearestPG?.coordinates.lng || 72.5186;

  return (
    <section id="section-near-you" className="px-5 sm:px-6 py-2">
      {/* Title */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
          Near <span className="text-slate-800 font-extrabold">You</span>
        </h2>
        <span className="text-xs font-bold text-[#7C3AED] flex items-center gap-1">
          <Navigation className="w-3 h-3" />
          <span>Within 5 km</span>
        </span>
      </div>

      {/* Map Interactive Card */}
      <div
        id="card-map-preview"
        onClick={onOpenMap}
        className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-white cursor-pointer group hover:shadow-md transition-all duration-300"
      >
        {/* Google Map Embedded Preview Canvas */}
        <div className="relative h-48 w-full bg-[#EEF2F6] overflow-hidden">
          <iframe
            title="Near You Google Map Preview"
            width="100%"
            height="100%"
            style={{ border: 0, pointerEvents: 'none' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${centerLat},${centerLng}&t=m&z=14&output=embed`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Semi-transparent tint to make UI elements pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20 pointer-events-none" />

          {/* Floating Top Badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-extrabold text-slate-800">
              Live Location: Ahmedabad
            </span>
          </div>

          {/* Floating Action Overlay at Bottom of Map */}
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 px-4 flex items-center justify-between shadow-lg border border-slate-100/90">
            <div>
              <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#7C3AED]" />
                <span>{listingsCount || 10} Accommodations Near You</span>
              </div>
              <div className="text-xs font-bold text-[#7C3AED] flex items-center gap-1 mt-0.5 ml-5">
                <span>Tap to explore interactive map</span>
              </div>
            </div>

            {/* Circular Purple Arrow Button matching screenshot */}
            <div className="w-10 h-10 rounded-full bg-[#7C3AED] group-hover:bg-purple-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
