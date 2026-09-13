import React from 'react';
import { Bell, User } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentUser?: UserProfile | null;
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  selectedCity?: string;
  onCityChange?: (city: string) => void;
  onOpenProfile: () => void;
  onOpenSignIn?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  unreadNotificationCount,
  onOpenNotifications,
  onOpenProfile,
  onOpenSignIn,
}) => {
  const isAuthenticated = Boolean(currentUser && currentUser.name);
  const userName = currentUser?.name || 'Guest';
  const userAvatar = currentUser?.avatar;

  return (
    <header id="app-header" className="pt-4 pb-2 px-5 flex items-center justify-between">
      {/* User greeting and avatar */}
      <div className="flex items-center gap-3">
        <button
          id="btn-user-avatar"
          onClick={isAuthenticated ? onOpenProfile : (onOpenSignIn || onOpenProfile)}
          className="relative rounded-full hover:scale-105 transition-transform cursor-pointer"
          aria-label={isAuthenticated ? `Open profile for ${userName}` : 'Sign in to Apna PG'}
        >
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-11 h-11 rounded-full object-cover shadow-xs border-2 border-white ring-2 ring-purple-500/20"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold shadow-xs border-2 border-white ring-2 ring-purple-500/20">
              <User className="w-5 h-5" />
            </div>
          )}
        </button>

        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-500 leading-tight">
            {isAuthenticated ? 'Hello,' : 'Welcome,'}
          </span>
          <span className="text-base font-bold text-[#7C3AED] tracking-tight leading-snug">
            {isAuthenticated ? userName : 'Guest (Explore PGs)'}
          </span>
        </div>
      </div>

      {/* Right controls: Notification bell - 44x44px touch target (WCAG 2.5.5) */}
      <button
        id="btn-notifications-bell"
        onClick={onOpenNotifications}
        className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center relative rounded-full text-[#7C3AED] hover:text-purple-700 hover:bg-purple-50/80 transition-colors cursor-pointer"
        aria-label={
          unreadNotificationCount > 0
            ? `View notifications (${unreadNotificationCount} unread)`
            : 'View notifications'
        }
      >
        <Bell className="w-6 h-6 stroke-[2.2]" aria-hidden="true" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#7C3AED] rounded-full ring-2 ring-white" />
        )}
      </button>
    </header>
  );
};


