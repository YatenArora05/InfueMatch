"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, PieChart, 
  Settings, CreditCard, Rocket, LogOut 
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/brand/dashboard' },
  { name: 'Influencer Finder', icon: Users, href: '/brand/finder' },
  { name: 'Campaigns', icon: Rocket, href: '/brand/campaigns' },
  { name: 'Analytics', icon: PieChart, href: '/brand/analytics' },
  { name: 'Payments', icon: CreditCard, href: '/brand/payments' },
];

export default function BrandSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#161922] border-r border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Brand Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <Rocket className="text-white" size={18} />
        </div>
        <span className="text-xl font-bold tracking-tight">InflueMatch</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                ? 'bg-purple-600/10 text-purple-500 shadow-[inset_0_0_20px_rgba(168,85,247,0.05)]' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-purple-500' : 'group-hover:text-gray-200'} />
              <span className="font-medium text-sm">{item.name}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Settings */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-gray-200 transition-colors text-sm">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-400/5 rounded-xl transition-colors text-sm">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}