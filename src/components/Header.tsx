import React from 'react';
import { Bell, MapPin, ChevronDown } from 'lucide-react';
import { INITIAL_USER } from '../data/mockData';

interface HeaderProps {
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unreadNotificationCount,
  onOpenNotifications,
  selectedCity,
  onCityChange,
  onOpenProfile,
}) => {
  const cities = ['Ahmedabad', 'Gandhinagar', 'Pune', 'Bangalore', 'Delhi NCR', 'Mumbai'];

  return (
    <header id="app-header" className="pt-3 pb-2 px-4 flex items-center justify-between">
      {/* User greeting and avatar */}
      <div className="flex items-center gap-3">
        <button
          id="btn-user-avatar"
          onClick={onOpenProfile}
          className="relative rounded-full ring-2 ring-blue-500/30 p-0.5 hover:scale-105 transition-transform"
          aria-label="Open profile"
        >
          <img
            src={INITIAL_USER.avatar}
            alt={INITIAL_USER.name}
            className="w-11 h-11 rounded-full object-cover shadow-sm"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
        </button>

        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hello</div>
          <div className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>{INITIAL_USER.name}</span>
            <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md uppercase tracking-wider">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Right controls: City badge & Notification bell */}
      <div className="flex items-center gap-2.5">
        {/* City picker dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-sm transition-colors cursor-pointer hover:border-slate-300">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>{selectedCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
          <select
            id="select-city-dropdown"
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            aria-label="Select City"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Notification Bell */}
        <button
          id="btn-notifications-bell"
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4 text-slate-600" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
          )}
        </button>
      </div>
    </header>
  );
};
