"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, Calendar, ListTodo, BarChart3, HelpCircle, LogOut, Rocket, X } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/influencer' },
  { name: 'Brand Details', icon: Briefcase, href: '/dashboard/influencer/brand-details' },
  { name: 'Post Bookings', icon: Calendar, href: '/dashboard/influencer/post-bookings' },
  { name: 'Event Manager', icon: ListTodo, href: '/dashboard/influencer/event-manager' },
//   { name: 'Analytics', icon: BarChart3, href: '/dashboard/influencer/analytics' },
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
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col fixed h-full z-40">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Rocket className="text-white" size={18} />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">InflueMatch</span>
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
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200' 
                  : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <item.icon size={20} />
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar Menu */}
      <aside className={`md:hidden fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Rocket className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">InflueMatch</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200' 
                  : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <item.icon size={20} />
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}