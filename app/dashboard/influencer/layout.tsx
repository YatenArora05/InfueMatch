"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/dashboard/Sidebar";
import ChatBot from "@/components/dashboard/ChatBot";
import { Menu } from "lucide-react";

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#020617]">
      {/* Sidebar - Fixed width on desktop, mobile menu on mobile */}
      <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Mobile Menu Button - fixed on mobile, black/blue theme */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 bg-[#1F2937] rounded-xl shadow-lg border border-[#374151] text-[#E5E7EB] hover:bg-[#3B82F6] hover:border-[#3B82F6] transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Dashboard View (single page scroll via document, no inner scroll) */}
        <main className="p-4 md:p-8 w-full">
          {children}
        </main>
      </div>

      {/* ChatBot - Appears on all influencer dashboard pages */}
      <ChatBot userType="influencer" />
    </div>
  );
}