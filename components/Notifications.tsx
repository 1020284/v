'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/lib/store';

export default function Notifications() {
  const notifications = useChatStore((state) => state.notifications);
  const unreadCount = useChatStore((state) => state.unreadCount);
  const markNotificationAsRead = useChatStore((state) => state.markNotificationAsRead);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
      >
        🔔 Notifications
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-lg shadow-2xl overflow-y-auto z-40">
          {notifications.length === 0 ? (
            <div className="p-4 text-white/60 text-center">No notifications</div>
          ) : (
            <div className="p-4 space-y-2">
              {notifications.slice().reverse().map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read) markNotificationAsRead(notif.id);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    notif.read
                      ? 'bg-white/5 border border-white/10'
                      : 'bg-blue-500/20 border border-blue-500/30'
                  }`}
                >
                  <p className="text-white font-semibold text-sm">{notif.title}</p>
                  <p className="text-white/70 text-xs mt-1">{notif.message}</p>
                  <p className="text-white/40 text-xs mt-2">
                    {new Date(notif.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
