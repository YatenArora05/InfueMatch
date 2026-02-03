"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, Calendar, ListTodo, User, LogOut, Rocket, X } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/influencer' },
  { name: 'Profile', icon: User, href: '/dashboard/influencer/profile' },
  { name: 'Brand Details', icon: Briefcase, href: '/dashboard/influencer/brand-details' },
  { name: 'Post Bookings', icon: Calendar, href: '/dashboard/influencer/post-bookings' },
  { name: 'Event Manager', icon: ListTodo, href: '/dashboard/influencer/event-manager' },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Desktop Sidebar - black / blue / white theme */}
      <aside className="hidden md:flex w-64 bg-[#0F0F0F] border-r border-[#1F2937] flex-col fixed h-full z-40">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Rocket className="text-white" size={18} />
          </div>
          <span className="text-xl font-bold text-[#E5E7EB] tracking-tight">InflueMatch</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-lg shadow-blue-500/30' 
                  : 'text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#E5E7EB]'
                }`}
              >
                <item.icon size={20} />
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-[#1F2937]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-[#9CA3AF] hover:text-red-400 hover:bg-[#1F2937] rounded-xl transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-50 transition-opacity backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar Menu - same black/blue/white theme */}
      <aside className={`md:hidden fixed top-0 right-0 h-full w-80 bg-[#0F0F0F] border-l border-[#1F2937] z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 flex items-center justify-between border-b border-[#1F2937]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Rocket className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-[#E5E7EB] tracking-tight">InflueMatch</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-2 text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1F2937] rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-lg shadow-blue-500/30' 
                  : 'text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#E5E7EB]'
                }`}
              >
                <item.icon size={20} />
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-[#1F2937]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-[#9CA3AF] hover:text-red-400 hover:bg-[#1F2937] rounded-xl transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}