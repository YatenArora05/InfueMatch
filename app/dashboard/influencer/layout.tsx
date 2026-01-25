"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/dashboard/Sidebar";
import ChatBot from "@/components/dashboard/ChatBot";
import NotificationBell from "@/components/dashboard/NotificationBell";
import { Menu } from "lucide-react";

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FD]">
      {/* Sidebar - Fixed width on desktop, mobile menu on mobile */}
      <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Bar with Notifications */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex-1"></div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            {userId && <NotificationBell userId={userId} />}
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-3 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Dashboard View */}
        <main className="p-4 md:p-8 overflow-y-auto w-full">
          {children}
        </main>
      </div>

      {/* ChatBot - Appears on all influencer dashboard pages */}
      <ChatBot userType="influencer" />
    </div>
  );
}