"use client";

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import BrandSidebar from '@/components/brand/BrandSidebar';
import ChatBot from '@/components/dashboard/ChatBot';

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#020617] text-[#E5E7EB]">
      {/* Sidebar - Fixed width on desktop, mobile menu on mobile */}
      <BrandSidebar isMobileOpen={isMobileMenuOpen} onMobileClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 relative z-10">
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-4 right-4 z-40">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 bg-[#0B1120] rounded-xl border border-[#1F2937] text-[#E5E7EB] hover:bg-[#3B82F6] hover:text-white transition-colors shadow-lg shadow-blue-900/20"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Scrollable Dashboard View */}
        <main className="p-4 md:p-8 overflow-y-auto w-full">
          {children}
        </main>
      </div>

      {/* ChatBot - Appears on all brand dashboard pages */}
      <ChatBot userType="brand" />
    </div>
  );
}