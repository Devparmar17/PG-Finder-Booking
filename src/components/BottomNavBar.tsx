import React from 'react';
import { Compass, Key, Heart, User } from 'lucide-react';

export type TabType = 'explore' | 'map' | 'mystay' | 'saved' | 'profile';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  savedCount: number;
  hasActiveStay: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  savedCount,
  hasActiveStay,
}) => {
  const navItems = [
    { id: 'explore' as TabType, label: 'Explore', icon: Compass },
    {
      id: 'saved' as TabType,
      label: 'Saved',
      icon: Heart,
      badgeCount: savedCount > 0 ? savedCount : undefined,
    },
    {
      id: 'mystay' as TabType,
      label: 'My Stay',
      icon: Key,
      badge: hasActiveStay ? 'Active' : undefined,
    },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-2.5 px-6 flex justify-around items-center max-w-md mx-auto shadow-lg"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            id={`nav-tab-${item.id}`}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative cursor-pointer ${
              isActive ? 'text-[#7C3AED] font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.4] text-[#7C3AED]' : 'stroke-[1.8]'
                }`}
              />
              {item.badgeCount !== undefined && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#7C3AED] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {item.badgeCount}
                </span>
              )}
              {item.badge && (
                <span className="absolute -top-1 -right-2.5 px-1 py-0.2 bg-emerald-500 text-white text-[8px] font-bold rounded-full ring-1 ring-white">
                  {item.badge}
                </span>
              )}
            </div>

            <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'text-[#7C3AED] font-bold' : 'text-slate-500'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

