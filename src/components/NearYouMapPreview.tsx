import React from 'react';
import { ArrowRight, MapPin, Navigation } from 'lucide-react';
import { PGListing } from '../types';

interface NearYouMapPreviewProps {
  onOpenMap: () => void;
  listingsCount: number;
  nearestPG?: PGListing;
}

export const NearYouMapPreview: React.FC<NearYouMapPreviewProps> = ({
  onOpenMap,
  listingsCount,
}) => {
  return (
    <section id="section-near-you" className="px-4 py-3">
      {/* Title */}
      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-3">
        Near <span className="text-slate-900 font-extrabold">You</span>
      </h2>

      {/* Map Interactive Banner Card */}
      <div
        id="card-map-preview"
        onClick={onOpenMap}
        className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 cursor-pointer group hover:shadow-md hover:border-slate-300 transition-all duration-300"
      >
        {/* Stylized Vector Map Graphics with Road Network & Pin Highlights */}
        <div className="relative h-44 w-full bg-[#EBF2F7] overflow-hidden">
          <svg
            className="w-full h-full object-cover opacity-90"
            viewBox="0 0 400 180"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Base */}
            <rect width="400" height="180" fill="#E8EFF5" />

            {/* River Sabarmati outline */}
            <path
              d="M 280,-20 Q 260,60 270,110 T 250,200"
              fill="none"
              stroke="#BEE3F8"
              strokeWidth="24"
              strokeLinecap="round"
            />
            <path
              d="M 280,-20 Q 260,60 270,110 T 250,200"
              fill="none"
              stroke="#90CDF4"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Major Arterial Roads / SG Highway */}
            <path
              d="M 40,0 L 140,180"
              stroke="#FFFFFF"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 40,0 L 140,180"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Ring Road */}
            <path
              d="M -10,90 Q 150,30 380,120"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 80,0 Q 220,100 390,40"
              stroke="#FFFFFF"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 20,140 Q 180,160 380,150"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Minor streets */}
            <path d="M 60,40 L 220,45" stroke="#E2E8F0" strokeWidth="3" />
            <path d="M 120,80 L 260,100" stroke="#E2E8F0" strokeWidth="3" />
            <path d="M 170,20 L 190,170" stroke="#E2E8F0" strokeWidth="3" />
            <path d="M 310,10 L 330,170" stroke="#E2E8F0" strokeWidth="3" />

            {/* Locality text annotations matching screenshot */}
            <text x="140" y="32" fill="#334155" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              અમદાવાદ (Ahmedabad)
            </text>
            <text x="60" y="58" fill="#64748B" fontSize="9" fontWeight="600" fontFamily="sans-serif">
              Sarkhej-Okaf
            </text>
            <text x="210" y="48" fill="#64748B" fontSize="8" fontFamily="sans-serif">
              કાઠવાડ
            </text>
            <text x="280" y="56" fill="#64748B" fontSize="8" fontFamily="sans-serif">
              Bakrol Bujrang
            </text>
            <text x="340" y="52" fill="#64748B" fontSize="8" fontFamily="sans-serif">
              Kuha
            </text>
            <text x="190" y="90" fill="#64748B" fontSize="8" fontFamily="sans-serif">
              Hathijan
            </text>
            <text x="150" y="125" fill="#64748B" fontSize="8" fontFamily="sans-serif">
              Jetalpur
            </text>
            <text x="15" y="115" fill="#64748B" fontSize="8" fontFamily="sans-serif">
              Changodar
            </text>

            {/* Radar / Pulse on User Location */}
            <circle cx="110" cy="70" r="16" fill="#2563EB" fillOpacity="0.15" />
            <circle cx="110" cy="70" r="8" fill="#2563EB" fillOpacity="0.3" />
            <circle cx="110" cy="70" r="4" fill="#1D4ED8" />

            {/* PG Pin 1 (Raj PG) */}
            <g transform="translate(100, 50)">
              <rect x="0" y="0" width="46" height="18" rx="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x="23" y="12" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                ₹10k
              </text>
            </g>

            {/* PG Pin 2 (Darshan PG) */}
            <g transform="translate(75, 95)">
              <rect x="0" y="0" width="48" height="18" rx="9" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x="24" y="12" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                ₹12.5k
              </text>
            </g>

            {/* PG Pin 3 (Sarda PG) */}
            <g transform="translate(180, 110)">
              <rect x="0" y="0" width="44" height="18" rx="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x="22" y="12" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                ₹8.5k
              </text>
            </g>

            {/* PG Pin 4 (Shreeji) */}
            <g transform="translate(230, 70)">
              <rect x="0" y="0" width="44" height="18" rx="9" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x="22" y="12" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                ₹11k
              </text>
            </g>
          </svg>

          {/* Current location tag badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-md text-[11px] font-semibold text-slate-800 shadow-sm border border-slate-200">
            <Navigation className="w-3 h-3 text-blue-600 fill-blue-600" />
            <span>Thaltej, Ahmedabad</span>
          </div>

          {/* Bottom Overlay Pill matching design */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg shadow-sm border border-slate-200">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {listingsCount} Verified PGs nearby
              </div>
              <div className="text-sm font-bold text-blue-600 tracking-tight flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Explore on Map</span>
              </div>
            </div>

            {/* Blue Circular Action Button */}
            <div className="w-10 h-10 rounded-lg bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
