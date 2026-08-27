import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  MapPin,
  Star,
  Navigation,
  Layers,
  ChevronRight,
  Wifi,
  BedDouble,
  Heart,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { PGListing, FilterState } from '../types';

interface InteractiveMapViewProps {
  listings: PGListing[];
  onClose: () => void;
  onSelectPG: (pg: PGListing) => void;
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  favorites: string[];
  onToggleFavorite: (pgId: string, e: React.MouseEvent) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  listings,
  onClose,
  onSelectPG,
  filters,
  onFilterChange,
  favorites,
  onToggleFavorite,
}) => {
  const [selectedPG, setSelectedPG] = useState<PGListing | null>(listings[0] || null);
  const [radiusKm, setRadiusKm] = useState(5);
  const [mapCenter, setMapCenter] = useState({ lat: 23.05, lng: 72.52 });
  const [showRadiusMenu, setShowRadiusMenu] = useState(false);

  // Map pin position calculations relative to SVG bounding box
  // Center around Ahmedabad (23.04, 72.53)
  const getCoordinatesPosition = (lat: number, lng: number) => {
    const minLat = 23.01;
    const maxLat = 23.08;
    const minLng = 72.48;
    const maxLng = 72.58;

    const x = ((lng - minLng) / (maxLng - minLng)) * 360 + 20;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 360 + 20;

    return { x: Math.max(30, Math.min(370, x)), y: Math.max(30, Math.min(370, y)) };
  };

  return (
    <div
      id="interactive-map-view"
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-center animate-in fade-in duration-200"
    >
      <div className="bg-[#EBF2F7] w-full max-w-md h-full flex flex-col relative overflow-hidden shadow-2xl">
        {/* Map Top Floating Controls */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 space-y-2 pointer-events-none">
          {/* Top Bar with Back, Search, and Locate button */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              id="btn-close-map"
              onClick={onClose}
              className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-200/80 text-slate-800 hover:bg-slate-50 transition-colors"
              aria-label="Back to list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                placeholder="Search area (e.g. Thaltej, Bodakdev)"
                className="w-full pl-9 pr-8 py-2.5 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
              />
              <Search className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
              {filters.searchQuery && (
                <button
                  onClick={() => onFilterChange({ searchQuery: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowRadiusMenu(!showRadiusMenu)}
              className="px-3 py-2.5 bg-purple-600 text-white rounded-2xl shadow-md text-xs font-bold flex items-center gap-1 hover:bg-purple-700 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{radiusKm}km</span>
            </button>
          </div>

          {/* Quick Gender & Price filter chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto py-1">
            {['all', 'boys', 'girls', 'unisex'].map((gen) => (
              <button
                key={gen}
                onClick={() => onFilterChange({ genderCategory: gen as any })}
                className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize backdrop-blur-md shadow-sm transition-all ${
                  filters.genderCategory === gen
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-white'
                }`}
              >
                {gen === 'all' ? 'All Genders' : `${gen} PG`}
              </button>
            ))}
          </div>

          {/* Radius Selector popover */}
          {showRadiusMenu && (
            <div className="bg-white rounded-2xl p-3 shadow-xl border border-slate-100 pointer-events-auto animate-in fade-in zoom-in-95">
              <div className="text-xs font-bold text-slate-800 mb-2">Search Radius</div>
              <div className="flex gap-2">
                {[1, 3, 5, 10, 15].map((km) => (
                  <button
                    key={km}
                    onClick={() => {
                      setRadiusKm(km);
                      setShowRadiusMenu(false);
                    }}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                      radiusKm === km
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {km} km
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Full Interactive SVG Canvas Map */}
        <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 400 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Grid & Terrain */}
            <rect width="400" height="600" fill="#EBF2F7" />

            {/* Sabarmati River Corridor */}
            <path
              d="M 320,-10 Q 300,150 310,320 T 290,610"
              fill="none"
              stroke="#BEE3F8"
              strokeWidth="42"
              strokeLinecap="round"
            />
            <path
              d="M 320,-10 Q 300,150 310,320 T 290,610"
              fill="none"
              stroke="#90CDF4"
              strokeWidth="28"
              strokeLinecap="round"
            />

            {/* Major Arteries / SG Highway & Ring Roads */}
            <path d="M 60,0 L 160,600" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
            <path d="M 60,0 L 160,600" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="6 6" />

            <path d="M 0,220 Q 200,150 400,280" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
            <path d="M 0,400 Q 200,360 400,420" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
            <path d="M 0,110 Q 180,80 400,140" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />

            {/* Neighborhood Roads */}
            <path d="M 40,80 L 280,100" stroke="#E2E8F0" strokeWidth="4" />
            <path d="M 80,180 L 290,200" stroke="#E2E8F0" strokeWidth="4" />
            <path d="M 30,320 L 280,310" stroke="#E2E8F0" strokeWidth="4" />
            <path d="M 120,480 L 320,460" stroke="#E2E8F0" strokeWidth="4" />
            <path d="M 220,40 L 240,550" stroke="#E2E8F0" strokeWidth="4" />

            {/* City Landmarks & Localities */}
            <text x="175" y="160" fill="#475569" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              અમદાવાદ (Ahmedabad)
            </text>
            <text x="80" y="120" fill="#64748B" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              Thaltej
            </text>
            <text x="75" y="245" fill="#64748B" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              Bodakdev
            </text>
            <text x="85" y="340" fill="#64748B" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              Satellite
            </text>
            <text x="210" y="230" fill="#64748B" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              Navrangpura
            </text>
            <text x="140" y="290" fill="#64748B" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              Vastrapur Lake
            </text>

            {/* User GPS Location Marker */}
            <circle cx="110" cy="190" r="32" fill="#7C3AED" fillOpacity="0.12" />
            <circle cx="110" cy="190" r="14" fill="#7C3AED" fillOpacity="0.25" />
            <circle cx="110" cy="190" r="6" fill="#6D28D9" stroke="#FFFFFF" strokeWidth="2" />
          </svg>

          {/* Interactive HTML Map Pins placed on SVG coordinates */}
          {listings.map((pg, index) => {
            const isSelected = selectedPG?.id === pg.id;
            const isFav = favorites.includes(pg.id);

            // Default fallback position if lat/lng math needed
            const pos = getCoordinatesPosition(pg.coordinates.lat, pg.coordinates.lng);

            return (
              <div
                key={pg.id}
                id={`map-pin-${pg.id}`}
                onClick={() => setSelectedPG(pg)}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y + 60}px`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10 ${
                  isSelected ? 'scale-115 z-30' : 'hover:scale-110'
                }`}
              >
                <div
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full shadow-lg font-bold text-xs border transition-all ${
                    isSelected
                      ? 'bg-purple-700 text-white border-white ring-4 ring-purple-400/40'
                      : 'bg-white text-slate-800 border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  <MapPin
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-white' : 'text-purple-600'
                    }`}
                  />
                  <span>₹{(pg.pricePerMonth / 1000).toFixed(0)}k</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected PG Bottom Preview Drawer */}
        {selectedPG && (
          <div
            id="map-selected-pg-drawer"
            className="absolute bottom-4 left-4 right-4 z-30 bg-white rounded-3xl p-3.5 shadow-2xl border border-slate-200/80 animate-in slide-in-from-bottom-6 duration-200"
          >
            <div className="flex gap-3 items-center">
              {/* Photo */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={selectedPG.images[0]}
                  alt={selectedPG.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-bold rounded">
                  ⭐ {selectedPG.rating}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 truncate">
                      {selectedPG.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                      <MapPin className="w-3 h-3 text-purple-600 shrink-0" />
                      <span>{selectedPG.area}, Ahmedabad</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => onToggleFavorite(selectedPG.id, e)}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(selectedPG.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Price and Amenities */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold">Rent</div>
                    <div className="text-sm font-black text-purple-700">
                      ₹{selectedPG.pricePerMonth.toLocaleString()}/m
                    </div>
                  </div>

                  <button
                    id="btn-map-view-details"
                    onClick={() => onSelectPG(selectedPG)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1 transition-all"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
