import React, { useState, useEffect } from 'react';
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
  X,
  Compass,
  ExternalLink,
  LocateFixed,
  Building,
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
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

const LOCALITY_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  all: { lat: 23.045, lng: 72.525, zoom: 13 },
  thaltej: { lat: 23.0525, lng: 72.5186, zoom: 15 },
  bodakdev: { lat: 23.0378, lng: 72.512, zoom: 15 },
  satellite: { lat: 23.028, lng: 72.529, zoom: 15 },
  vastrapur: { lat: 23.035, lng: 72.532, zoom: 15 },
  navrangpura: { lat: 23.036, lng: 72.561, zoom: 15 },
};

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
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [showRadiusMenu, setShowRadiusMenu] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: listings[0]?.coordinates.lat || 23.045,
    lng: listings[0]?.coordinates.lng || 72.525,
  });
  const [zoomLevel, setZoomLevel] = useState<number>(13);

  const apiKey = ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || '';

  // Update center when selecting a PG
  const handleSelectListing = (pg: PGListing) => {
    setSelectedPG(pg);
    setMapCenter({ lat: pg.coordinates.lat, lng: pg.coordinates.lng });
    setZoomLevel(15);
  };

  // Jump to locality
  const handleLocalityClick = (key: string) => {
    setSelectedLocality(key);
    const loc = LOCALITY_CENTERS[key] || LOCALITY_CENTERS.all;
    setMapCenter({ lat: loc.lat, lng: loc.lng });
    setZoomLevel(loc.zoom);
    if (key !== 'all') {
      onFilterChange({ searchQuery: key });
    } else {
      onFilterChange({ searchQuery: '' });
    }
  };

  // Reset to user GPS location
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setZoomLevel(15);
        },
        () => {
          // Default to Ahmedabad central
          setMapCenter({ lat: 23.045, lng: 72.525 });
          setZoomLevel(14);
        }
      );
    } else {
      setMapCenter({ lat: 23.045, lng: 72.525 });
      setZoomLevel(14);
    }
  };

  return (
    <div
      id="interactive-map-view"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center animate-in fade-in duration-200"
    >
      <div className="bg-[#EBF2F7] w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl h-full flex flex-col relative overflow-hidden shadow-2xl">
        <h1 className="sr-only">Interactive Map of Verified Accommodations</h1>
        {/* Map Top Floating Header Controls */}
        <div className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-4 space-y-2 pointer-events-none">
          {/* Top Bar with Back, Search, and Locate button */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              id="btn-close-map"
              onClick={onClose}
              className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-200/80 text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="Back to explore"
            >
              <ArrowLeft className="w-5 h-5 text-slate-800" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                placeholder="Search area (e.g. Thaltej, Bodakdev, SG Highway)"
                className="w-full pl-9 pr-8 py-2.5 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-md"
              />
              <Search className="w-4 h-4 text-[#7C3AED] absolute left-3 top-1/2 -translate-y-1/2" />
              {filters.searchQuery && (
                <button
                  onClick={() => onFilterChange({ searchQuery: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Radius Button */}
            <button
              onClick={() => setShowRadiusMenu(!showRadiusMenu)}
              className="px-3 py-2.5 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-2xl shadow-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{radiusKm}km</span>
            </button>

            {/* Locate Me */}
            <button
              onClick={handleLocateMe}
              title="Locate my position"
              className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-200/80 text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <LocateFixed className="w-4 h-4 text-[#7C3AED]" />
            </button>
          </div>

          {/* Quick Locality Jump Chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto py-0.5">
            {[
              { id: 'all', label: 'All Localities' },
              { id: 'thaltej', label: 'Thaltej' },
              { id: 'bodakdev', label: 'Bodakdev' },
              { id: 'satellite', label: 'Satellite' },
              { id: 'vastrapur', label: 'Vastrapur' },
              { id: 'navrangpura', label: 'Navrangpura' },
            ].map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleLocalityClick(loc.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  selectedLocality === loc.id
                    ? 'bg-[#7C3AED] text-white ring-2 ring-purple-400/40'
                    : 'bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-white'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>

          {/* Quick Gender filter chips */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {['all', 'boys', 'girls', 'unisex'].map((gen) => (
                <button
                  key={gen}
                  onClick={() => onFilterChange({ genderCategory: gen as any })}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold capitalize backdrop-blur-md shadow-2xs transition-all cursor-pointer ${
                    filters.genderCategory === gen
                      ? 'bg-slate-900 text-white'
                      : 'bg-white/90 text-slate-700 border border-slate-200 hover:bg-white'
                  }`}
                >
                  {gen === 'all' ? 'All' : `${gen} PG`}
                </button>
              ))}
            </div>

            {/* Map Style Controls */}
            <div className="flex bg-white/90 backdrop-blur-md rounded-xl p-0.5 shadow-sm border border-slate-200">
              <button
                onClick={() => setMapType('roadmap')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                  mapType === 'roadmap' ? 'bg-[#7C3AED] text-white' : 'text-slate-600'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setMapType('satellite')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                  mapType === 'satellite' ? 'bg-[#7C3AED] text-white' : 'text-slate-600'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>

          {/* Radius Selector popover */}
          {showRadiusMenu && (
            <div className="bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 pointer-events-auto animate-in fade-in zoom-in-95">
              <div className="text-xs font-bold text-slate-800 mb-2">Search Radius (from Ahmedabad center)</div>
              <div className="flex gap-2">
                {[1, 3, 5, 10, 15].map((km) => (
                  <button
                    key={km}
                    onClick={() => {
                      setRadiusKm(km);
                      setShowRadiusMenu(false);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      radiusKm === km
                        ? 'bg-[#7C3AED] text-white'
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

        {/* Full Google Map Container */}
        <div className="w-full h-full relative">
          {apiKey ? (
            <APIProvider
              apiKey={apiKey}
              solutionChannel="gmp_mcp_codeassist_v1_aistudio"
            >
              <Map
                center={mapCenter}
                zoom={zoomLevel}
                mapId="DEMO_MAP_ID"
                mapTypeId={mapType}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                className="w-full h-full"
                gestureHandling="greedy"
                disableDefaultUI={false}
              >
                {listings.map((pg) => {
                  const isSelected = selectedPG?.id === pg.id;
                  return (
                    <AdvancedMarker
                      key={pg.id}
                      position={{ lat: pg.coordinates.lat, lng: pg.coordinates.lng }}
                      title={pg.name}
                      onClick={() => handleSelectListing(pg)}
                    >
                      <div
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full shadow-lg font-extrabold text-xs border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7C3AED] text-white border-white ring-4 ring-purple-500/40 scale-115 z-30'
                            : 'bg-white text-slate-900 border-slate-300 hover:bg-purple-50 hover:scale-105'
                        }`}
                      >
                        <MapPin
                          className={`w-3.5 h-3.5 ${
                            isSelected ? 'text-white' : 'text-[#7C3AED]'
                          }`}
                        />
                        <span>₹{(((pg.pricePerMonth ?? 0)) / 1000).toFixed(0)}k</span>
                      </div>
                    </AdvancedMarker>
                  );
                })}
              </Map>
            </APIProvider>
          ) : (
            /* High-Fidelity Interactive Google Maps View */
            <div className="w-full h-full relative">
              <iframe
                title="Google Maps Area View"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${selectedPG ? selectedPG.coordinates.lat : mapCenter.lat},${selectedPG ? selectedPG.coordinates.lng : mapCenter.lng}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=${zoomLevel}&output=embed`}
                className="w-full h-full"
              />

              {/* Interactive Pin Overlays for All Listings */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Horizontal Quick Listings Carousel above bottom drawer */}
                <div className="absolute bottom-32 sm:bottom-36 left-0 right-0 px-4 flex gap-2.5 overflow-x-auto no-scrollbar pointer-events-auto">
                  {listings.map((pg) => {
                    const isSelected = selectedPG?.id === pg.id;
                    return (
                      <button
                        key={pg.id}
                        onClick={() => handleSelectListing(pg)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl shadow-md border text-left shrink-0 transition-all cursor-pointer backdrop-blur-md ${
                          isSelected
                            ? 'bg-[#7C3AED] text-white border-purple-400 scale-105'
                            : 'bg-white/95 text-slate-800 border-slate-200/90 hover:bg-white'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                          <img src={pg.images[0]} alt={pg.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs truncate max-w-[100px]">{pg.name}</div>
                          <div className={`text-[11px] font-bold ${isSelected ? 'text-purple-100' : 'text-[#7C3AED]'}`}>
                            ₹{(pg.pricePerMonth ?? 0).toLocaleString('en-IN')}/mo
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected PG Bottom Preview Drawer */}
        {selectedPG && (
          <div
            id="map-selected-pg-drawer"
            className="absolute bottom-4 left-4 right-4 z-40 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-6 duration-200"
          >
            <div className="flex gap-3.5 items-center">
              {/* Photo */}
              <div
                onClick={() => onSelectPG(selectedPG)}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer group"
              >
                <img
                  src={selectedPG.images[0]}
                  alt={selectedPG.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-bold rounded">
                  ⭐ {selectedPG.rating}
                </div>
                {selectedPG.isVerified && (
                  <div className="absolute top-1 left-1 px-1.5 py-0.2 bg-[#7C3AED] text-white text-[8px] font-bold rounded">
                    Verified
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <div onClick={() => onSelectPG(selectedPG)} className="cursor-pointer">
                    <h3 className="font-extrabold text-base text-slate-900 truncate hover:text-[#7C3AED] transition-colors">
                      {selectedPG.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 truncate mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                      <span>{selectedPG.area}, Ahmedabad</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => onToggleFavorite(selectedPG.id, e)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
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

                {/* Price and Action Buttons */}
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      Monthly Rent
                    </div>
                    <div className="text-base font-black text-slate-900">
                      ₹{(selectedPG.pricePerMonth ?? 0).toLocaleString('en-IN')}{' '}
                      <span className="text-[11px] font-medium text-slate-400">/mo</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* View Details button that opens the PGDetailModal */}
                    <button
                      id="btn-map-view-details"
                      onClick={() => onSelectPG(selectedPG)}
                      className="px-4 py-2.5 bg-[#7C3AED] hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
