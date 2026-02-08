"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Shield, Users, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if admin is logged in
    if (typeof window !== 'undefined') {
      const adminId = localStorage.getItem('adminId');
      if (!adminId) {
        router.push('/admin-login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminId');
    router.push('/admin-login');
  };

  const navItems = [
    { href: '/dashboard/admin/brands', label: 'Brand Accounts', icon: Users },
    { href: '/dashboard/admin/influencers', label: 'Influencer Accounts', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-[#E5E7EB] relative overflow-hidden">
      {/* Grid Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59,130,246,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59,130,246,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            backgroundPosition: "0 0",
          }}
        />
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(2,6,23,0.6) 60%, rgba(2,6,23,1) 100%)",
          }}
        />
      </div>
      <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] bg-[#1E3A8A]/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-160px] right-[-40px] w-[480px] h-[480px] bg-[#3B82F6]/25 rounded-full blur-[140px] -z-10" />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#020617]/95 backdrop-blur-xl border-r border-[#1F2937] transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-4 md:p-6 border-b border-[#1F2937]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-black text-[#E5E7EB]">Admin</h1>
                <p className="text-xs text-[#9CA3AF]">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 md:p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-900/30'
                      : 'text-[#9CA3AF] hover:bg-[#0B1120] hover:text-[#E5E7EB]'
                  }`}
                >
                  <Icon size={18} className="md:w-5 md:h-5" />
                  <span className="text-sm md:text-base font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 md:p-4 border-t border-[#1F2937]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-[#9CA3AF] hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} className="md:w-5 md:h-5" />
              <span className="text-sm md:text-base font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 relative z-10">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-[#020617]/80 backdrop-blur-xl border-b border-[#1F2937] px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex-1"></div>
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-3 bg-[#0B1120] rounded-xl border border-[#1F2937] text-[#E5E7EB] hover:bg-[#3B82F6] hover:text-white transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="p-4 md:p-8 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

