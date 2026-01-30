"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Mail } from 'lucide-react';
import axios from 'axios';

interface Notification {
  _id: string;
  title: string;
  message: string;
  brandName?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationBellProps {
  userId: string;
  /** When true, styles the bell to match dashboard header (box, border) */
  variant?: 'default' | 'header';
}

export default function NotificationBell({ userId, variant = 'default' }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/notifications?userId=${userId}`);
      if (response.data) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.patch('/api/notifications', {
        notificationId,
        userId,
      });
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post('/api/notifications/mark-all-read', { userId });
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const buttonClass = variant === 'header'
    ? 'relative p-2.5 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl hover:bg-white transition-colors shadow-sm text-purple-600'
    : 'relative p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50/50 rounded-full transition-colors';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClass}
        aria-label="Notifications"
      >
        <Bell size={variant === 'header' ? 20 : 24} className="text-current" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown - full-screen overlay on mobile, absolute panel on desktop */}
      {isOpen && (
        <>
          {/* Mobile: backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[100] md:hidden"
            aria-hidden
            onClick={() => setIsOpen(false)}
          />
          {/* Panel: bottom sheet on mobile; on desktop = absolute dropdown below bell (no layout distortion) */}
          <div className="fixed bottom-0 left-0 right-0 z-[101] flex flex-col max-h-[85vh] rounded-t-2xl bg-white shadow-2xl overflow-hidden md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-2 md:w-96 md:max-h-[500px] md:rounded-2xl md:shadow-2xl md:border md:border-gray-100">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 shrink-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="md:hidden p-2 -m-2 rounded-lg hover:bg-purple-100 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Close"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1 min-h-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-purple-50/30' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification._id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        !notification.read 
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600' 
                          : 'bg-gray-100'
                      }`}>
                        <Mail size={18} className={notification.read ? 'text-gray-400' : 'text-white'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                              {notification.message}
                            </p>
                            {notification.brandName && (
                              <p className="text-xs text-purple-600 font-semibold mt-1">
                                From: {notification.brandName}
                              </p>
                            )}
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

