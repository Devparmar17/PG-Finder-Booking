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
          className="relative rounded-full ring-2 ring-purple-400/40 p-0.5 hover:scale-105 transition-transform"
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
          <div className="text-xs font-medium text-slate-500 tracking-tight">Hello</div>
          <div className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>{INITIAL_USER.name}</span>
            <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700 rounded-full">
              Resident
            </span>
          </div>
        </div>
      </div>

      {/* Right controls: City badge & Notification bell */}
      <div className="flex items-center gap-2.5">
        {/* City picker dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100/90 hover:bg-slate-200/80 rounded-full text-xs font-medium text-slate-700 transition-colors cursor-pointer">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>{selectedCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
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
          className="relative p-2.5 rounded-full bg-white shadow-sm border border-slate-200/70 text-slate-700 hover:text-purple-600 hover:border-purple-200 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5 text-purple-600" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};
