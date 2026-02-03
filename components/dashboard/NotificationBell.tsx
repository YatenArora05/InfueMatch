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
  /** When 'dark', uses black/blue/white theme for header button (influencer dashboard) */
  theme?: 'light' | 'dark';
}

export default function NotificationBell({ userId, variant = 'default', theme = 'light' }: NotificationBellProps) {
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
    ? theme === 'dark'
      ? 'relative p-2.5 bg-[#0B1220]/90 backdrop-blur-sm border border-[#1F2937] rounded-xl hover:border-[#3B82F6]/50 hover:bg-[#1F2937] transition-colors shadow-lg shadow-blue-900/10 text-[#3B82F6]'
      : 'relative p-2.5 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl hover:bg-white transition-colors shadow-sm text-purple-600'
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
          <div className="fixed bottom-0 left-0 right-0 z-[101] flex flex-col max-h-[85vh] rounded-t-2xl bg-[#020617] shadow-2xl shadow-blue-900/40 overflow-hidden md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-2 md:w-96 md:max-h-[500px] md:rounded-2xl md:border md:border-[#1F2937]">
            {/* Header */}
            <div className="p-4 border-b border-[#1F2937] flex items-center justify-between bg-[#020617] shrink-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-[#E5E7EB]">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-[#3B82F6] hover:text-[#60A5FA] px-2 py-1 rounded-lg hover:bg-[#1E3A8A]/40 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="md:hidden p-2 -m-2 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
                  aria-label="Close"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1 min-h-0 bg-[#020617]">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-[#9CA3AF]">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={32} className="text-[#4B5563] mx-auto mb-2" />
                <p className="text-sm text-[#9CA3AF]">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[#1F2937]">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-[#020617] transition-colors cursor-pointer ${
                      !notification.read ? 'bg-[#0B1120]' : ''
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
                          ? 'bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8]' 
                          : 'bg-[#111827]'
                      }`}>
                        <Mail size={18} className={notification.read ? 'text-[#9CA3AF]' : 'text-white'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${notification.read ? 'text-[#E5E7EB]' : 'text-white'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
                              {notification.message}
                            </p>
                            {notification.brandName && (
                              <p className="text-xs text-[#3B82F6] font-semibold mt-1">
                                From: {notification.brandName}
                              </p>
                            )}
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#3B82F6] rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-xs text-[#6B7280] mt-2">
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

