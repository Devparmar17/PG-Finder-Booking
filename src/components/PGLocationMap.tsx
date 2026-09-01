import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { PGListing } from '../types';
import { MapPin, Navigation, ExternalLink, Compass, Layers, ShieldCheck, Footprints, Bus } from 'lucide-react';

interface PGLocationMapProps {
  pg: PGListing;
}

export const PGLocationMap: React.FC<PGLocationMapProps> = ({ pg }) => {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [isCopied, setIsCopied] = useState(false);
  const apiKey = ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || '';

  const lat = pg.coordinates.lat;
  const lng = pg.coordinates.lng;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`;
  const viewMapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const handleCopyLocation = () => {
    navigator.clipboard?.writeText(`${pg.name}, ${pg.location} (${lat}, ${lng})`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section id="section-detail-location" className="px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center text-[#7C3AED] border border-purple-100">
            <MapPin className="w-4 h-4" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Location & Connectivity
          </h3>
        </div>

        <a
          href={viewMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#7C3AED] hover:text-purple-700 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200/80 transition-colors"
        >
          <span>Open Google Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Main Interactive Google Map Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-3">
        {/* Map Container */}
        <div className="relative h-60 w-full bg-slate-100 overflow-hidden">
          {apiKey ? (
            <APIProvider
              apiKey={apiKey}
              solutionChannel="gmp_mcp_codeassist_v1_aistudio"
            >
              <Map
                defaultCenter={{ lat, lng }}
                defaultZoom={15}
                mapId="DEMO_MAP_ID"
                mapTypeId={mapType}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                className="w-full h-full"
                gestureHandling="cooperative"
                disableDefaultUI={false}
              >
                <AdvancedMarker position={{ lat, lng }} title={pg.name}>
                  <div className="flex flex-col items-center group cursor-pointer">
                    <div className="bg-[#7C3AED] text-white px-2 py-0.5 rounded-md text-[10px] font-extrabold shadow-md mb-1 border border-white whitespace-nowrap animate-bounce">
                      {pg.name}
                    </div>
                    <Pin
                      background="#7C3AED"
                      borderColor="#FFFFFF"
                      glyphColor="#FFFFFF"
                      scale={1.2}
                    />
                  </div>
                </AdvancedMarker>
              </Map>
            </APIProvider>
          ) : (
            /* High-fidelity interactive Google Maps view */
            <div className="w-full h-full relative">
              <iframe
                title={`Google Map for ${pg.name}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${lat},${lng}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=15&output=embed`}
                className="w-full h-full"
              />

              {/* Floating Custom Badge */}
              <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse" />
                <span className="text-xs font-bold text-slate-800">{pg.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">({pg.area})</span>
              </div>
            </div>
          )}

          {/* Map Controls: Satellite / Roadmap Switcher */}
          <div className="absolute top-2.5 right-2.5 z-10 flex bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-slate-200/80">
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                mapType === 'roadmap'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                mapType === 'satellite'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Quick Get Directions Floating Button */}
          <div className="absolute bottom-2.5 right-2.5 z-10">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-xl shadow-lg text-xs font-bold transition-transform active:scale-95 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>

        {/* Address Banner */}
        <div className="p-3.5 bg-slate-50/80 border-t border-slate-200/80 flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900 leading-snug">{pg.location}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Coordinates: {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyLocation}
            className="shrink-0 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Neighborhood Transit & Landmarks */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <Bus className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Nearby Transit & Hubs</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            94/100 Walk Score
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {pg.nearbyHubs && pg.nearbyHubs.length > 0 ? (
            pg.nearbyHubs.map((hub, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 text-[11px] truncate">{hub.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{hub.type}</div>
                </div>
                <span className="shrink-0 text-[11px] font-extrabold text-[#7C3AED] bg-white px-2 py-0.5 rounded-md shadow-2xs">
                  {hub.distance}
                </span>
              </div>
            ))
          ) : (
            <>
              <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 text-[11px]">Thaltej Metro</div>
                  <div className="text-[10px] text-slate-500">Metro Station</div>
                </div>
                <span className="text-[11px] font-extrabold text-[#7C3AED] bg-white px-2 py-0.5 rounded-md">
                  400 m
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 text-[11px]">SG Highway</div>
                  <div className="text-[10px] text-slate-500">Main Arterial Road</div>
                </div>
                <span className="text-[11px] font-extrabold text-[#7C3AED] bg-white px-2 py-0.5 rounded-md">
                  600 m
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 text-[11px]">Acropolis Mall</div>
                  <div className="text-[10px] text-slate-500">Commercial / Food</div>
                </div>
                <span className="text-[11px] font-extrabold text-[#7C3AED] bg-white px-2 py-0.5 rounded-md">
                  1.1 km
                </span>
              </div>
            </>
          )}
        </div>

        {/* Walkability Highlights */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-600">
          <Footprints className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
          <span>Daily grocery stores, pharmacy, gyms, and ATMs within 3–5 minutes walk.</span>
        </div>
      </div>
    </section>
  );
};
