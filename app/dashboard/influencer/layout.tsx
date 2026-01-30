"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/dashboard/Sidebar";
import ChatBot from "@/components/dashboard/ChatBot";
import { Menu } from "lucide-react";

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F9FD]">
      {/* Sidebar - Fixed width on desktop, mobile menu on mobile */}
      <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Mobile Menu Button - fixed on mobile */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
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