import React from 'react';
import { Bell } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentUser?: UserProfile | null;
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  selectedCity?: string;
  onCityChange?: (city: string) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  unreadNotificationCount,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const userName = currentUser?.name || 'Dev Parmar';
  const userAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

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
            src={userAvatar}
            alt={userName}
            className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white ring-2 ring-purple-500/20"
          />
          {currentUser?.authProvider === 'google' && (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center"
              title="Connected with Google"
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </span>
          )}
          {currentUser?.authProvider === 'apple' && (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-black text-white shadow-xs border border-slate-700 flex items-center justify-center"
              title="Connected with Apple ID"
            >
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.79-11.97-14.24-5.33-8.08-9.47-17.15-12.43-27.22-2.96-10.07-4.44-19.68-4.44-28.84 0-13.06 3.34-24.16 10.03-33.3 6.69-9.14 15.26-13.79 25.7-13.96 4.35 0 9.29 1.13 14.81 3.38 5.53 2.25 9.4 3.42 11.62 3.5 1.94-.13 5.92-1.37 11.94-3.73 6.01-2.36 10.9-3.41 14.65-3.15 11.39.87 20.35 5.09 26.89 12.67-10.15 6.17-15.11 14.76-14.88 25.77.23 8.7 3.51 16.03 9.85 21.99 6.34 5.96 13.9 9.38 22.68 10.25-2.08 6.09-4.57 12.42-7.46 19-.94 2.17-1.84 4.36-2.7 6.55zM119.22 33.64c0-7.39 2.65-14.28 7.94-20.67 5.29-6.39 11.83-10.45 19.62-12.18.33 1.25.49 2.37.49 3.36 0 7.39-2.73 14.4-8.19 21.03-5.46 6.63-12.04 10.7-19.74 12.21-.08-1.25-.12-2.5-.12-3.75z" />
              </svg>
            </span>
          )}
        </button>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-800 leading-tight">Hello</span>
          <span className="text-base font-bold text-[#2563EB] tracking-tight leading-snug">
            {userName}
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

