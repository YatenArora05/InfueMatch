"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import ChatBot from "@/components/dashboard/ChatBot";
import InfluencerProfileViewportGrid from "@/components/dashboard/InfluencerProfileViewportGrid";
import { Menu } from "lucide-react";

function isInfluencerProfilePath(pathname: string | null) {
  if (!pathname) return false;
  return (
    pathname === "/dashboard/influencer/profile" ||
    pathname.startsWith("/dashboard/influencer/profile/")
  );
}

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const showProfileGrid = isInfluencerProfilePath(pathname);

  return (
    <div className="relative flex min-h-screen bg-[#060d24] text-[#E5E7EB]">
      {showProfileGrid ? <InfluencerProfileViewportGrid /> : null}

      {/* Sidebar - Fixed width on desktop, mobile menu on mobile */}
      <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col md:ml-68">
        {/* Mobile Menu Button */}
        <div className="fixed top-4 right-4 z-40 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-xl border border-[#1F2937] bg-[#0B1120] p-3 text-[#E5E7EB] shadow-lg shadow-blue-900/20 transition-colors hover:bg-[#3B82F6] hover:text-white"
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