import React from 'react';
import { X, Bell } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
  onClearAll,
}) => {
  return (
    <div
      id="notifications-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-md sm:max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#7C3AED]" />
            <h2 className="text-base font-extrabold text-slate-900">Notifications</h2>
          </div>

          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs font-bold text-[#7C3AED] hover:text-purple-700 cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No new notifications right now.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-white border-slate-200 text-slate-600'
                    : 'bg-purple-50/70 border-purple-200 text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs text-slate-900">{n.title}</div>
                  <span className="text-[10px] text-slate-500 shrink-0">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
