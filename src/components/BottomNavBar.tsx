import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Key, Heart, User } from 'lucide-react';

export type TabType = 'explore' | 'map' | 'mystay' | 'saved' | 'profile';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  savedCount: number;
  hasActiveStay: boolean;
  hidden?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  savedCount,
  hasActiveStay,
  hidden,
}) => {
  if (hidden) return null;

  const navItems = [
    { id: 'explore' as TabType, label: 'Explore', icon: Compass, path: '/' },
    {
      id: 'saved' as TabType,
      label: 'Saved',
      icon: Heart,
      badgeCount: savedCount > 0 ? savedCount : undefined,
      path: '/saved',
    },
    {
      id: 'mystay' as TabType,
      label: 'My Stay',
      icon: Key,
      badge: hasActiveStay ? 'Active' : undefined,
      path: '/mystay',
    },
    { id: 'profile' as TabType, label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-2.5 px-6 sm:px-12 flex justify-around items-center max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto shadow-lg transition-all duration-200"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <Link
            key={item.id}
            id={`nav-tab-${item.id}`}
            to={item.path}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative cursor-pointer no-underline ${
              isActive ? 'text-[#7C3AED] font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.4] text-[#7C3AED]' : 'stroke-[1.8]'
                }`}
                aria-hidden="true"
              />
              {item.badgeCount !== undefined && (
                <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-[#7C3AED] text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {item.badgeCount}
                </span>
              )}
              {item.badge && (
                <span
                  className="absolute -top-1 -right-2 flex h-2.5 w-2.5"
                  title="Active stay booked"
                  aria-label="Active stay booked"
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 ring-2 ring-white"></span>
                </span>
              )}
            </div>

            <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'text-[#7C3AED] font-bold' : 'text-slate-500'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

