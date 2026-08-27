import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
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
    <section id="section-near-you" className="px-5 py-3">
      {/* Title */}
      <h2 className="text-xl font-extrabold text-slate-800 tracking-tight mb-3">
        Near <span className="text-slate-800 font-extrabold">You</span>
      </h2>

      {/* Map Interactive Card */}
      <div
        id="card-map-preview"
        onClick={onOpenMap}
        className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-white cursor-pointer group hover:shadow-md transition-all duration-300"
      >
        {/* Stylized Vector Map Graphics */}
        <div className="relative h-48 w-full bg-[#EEF2F6] overflow-hidden">
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 400 190"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Base */}
            <rect width="400" height="190" fill="#E8EEF5" />

            {/* River Sabarmati outline */}
            <path
              d="M 280,-20 Q 255,60 270,110 T 245,210"
              fill="none"
              stroke="#BEE3F8"
              strokeWidth="22"
              strokeLinecap="round"
            />
            <path
              d="M 280,-20 Q 255,60 270,110 T 245,210"
              fill="none"
              stroke="#90CDF4"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Major Arterial Roads / SG Highway */}
            <path
              d="M 45,0 L 145,190"
              stroke="#FFFFFF"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 45,0 L 145,190"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Ring Roads */}
            <path
              d="M -10,90 Q 150,30 390,120"
              stroke="#FFFFFF"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d="M 80,0 Q 220,100 400,40"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 20,145 Q 180,165 390,150"
              stroke="#FFFFFF"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Minor streets */}
            <path d="M 60,40 L 220,45" stroke="#CBD5E1" strokeWidth="2.5" />
            <path d="M 120,80 L 260,100" stroke="#CBD5E1" strokeWidth="2.5" />
            <path d="M 170,20 L 190,180" stroke="#CBD5E1" strokeWidth="2.5" />
            <path d="M 310,10 L 330,180" stroke="#CBD5E1" strokeWidth="2.5" />

            {/* Locality text annotations */}
            <text x="140" y="32" fill="#334155" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              અમદાવાદ (Ahmedabad)
            </text>
            <text x="55" y="58" fill="#64748B" fontSize="9" fontWeight="600" fontFamily="sans-serif">
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

            {/* Location pins */}
            {/* User location dot with ripple */}
            <circle cx="110" cy="70" r="14" fill="#7C3AED" fillOpacity="0.2" />
            <circle cx="110" cy="70" r="7" fill="#7C3AED" fillOpacity="0.4" />
            <circle cx="110" cy="70" r="3.5" fill="#7C3AED" />

            {/* Red / Violet map pins */}
            <g transform="translate(100, 48)">
              <circle cx="10" cy="10" r="7" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
            <g transform="translate(70, 95)">
              <circle cx="10" cy="10" r="7" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
            <g transform="translate(175, 105)">
              <circle cx="10" cy="10" r="7" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
            <g transform="translate(225, 65)">
              <circle cx="10" cy="10" r="7" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
          </svg>

          {/* Floating Action Overlay at Bottom of Map */}
          <div className="absolute bottom-3 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 px-4 flex items-center justify-between shadow-md border border-slate-100">
            <div>
              <div className="text-sm font-bold text-slate-800">
                {listingsCount || 10} PGs near by you
              </div>
              <div className="text-xs font-semibold text-[#7C3AED] flex items-center gap-1 mt-0.5">
                <span>Explore Area</span>
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

