import React from 'react';
import { Bell } from 'lucide-react';
import { INITIAL_USER } from '../data/mockData';

interface HeaderProps {
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  selectedCity?: string;
  onCityChange?: (city: string) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unreadNotificationCount,
  onOpenNotifications,
  onOpenProfile,
}) => {
  return (
    <header id="app-header" className="pt-4 pb-2 px-5 flex items-center justify-between">
      {/* User greeting and avatar */}
      <div className="flex items-center gap-3">
        <button
          id="btn-user-avatar"
          onClick={onOpenProfile}
          className="relative rounded-full hover:scale-105 transition-transform cursor-pointer"
          aria-label="Open profile"
        >
          <img
            src={INITIAL_USER.avatar}
            alt={INITIAL_USER.name}
            className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white"
          />
        </button>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-800 leading-tight">Hello</span>
          <span className="text-base font-bold text-[#2563EB] tracking-tight leading-snug">
            {INITIAL_USER.name}
          </span>
        </div>
      </div>

      {/* Right controls: Notification bell */}
      <button
        id="btn-notifications-bell"
        onClick={onOpenNotifications}
        className="relative p-2 text-[#7C3AED] hover:text-purple-700 transition-colors cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="w-6 h-6 stroke-[2.2]" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#7C3AED] rounded-full ring-2 ring-white" />
        )}
      </button>
    </header>
  );
};

