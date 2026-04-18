"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Zap,
  LogOut,
  LayoutDashboard,
  Search,
  User,
  X,
  Settings,
  MoreVertical,
} from "lucide-react";
import { getAvatarBackgroundColorFromName } from "@/lib/utils";

const mainNav = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/brand" },
  { name: "Find Influencer", icon: Search, href: "/dashboard/brand/find-influencer" },
] as const;

const accountNav = [{ name: "Profile", icon: User, href: "/dashboard/brand/profile" }] as const;

function navIsActive(pathname: string, href: string) {
  if (href === "/dashboard/brand") {
    return pathname === "/dashboard/brand";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "B";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface BrandSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full flex-col border border-[#1e2228] bg-[#0b0d12] text-[#E5E7EB] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export default function BrandSidebar({ isMobileOpen = false, onMobileClose }: BrandSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Brand");

  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!id) return;
    axios
      .get(`/api/user?id=${id}`)
      .then((res) => {
        const n = res.data?.user?.name;
        if (typeof n === "string" && n.trim()) setUserName(n.trim());
      })
      .catch(() => {});
  }, []);

  const initials = useMemo(() => initialsFromName(userName), [userName]);
  const avatarBg = useMemo(() => getAvatarBackgroundColorFromName(userName), [userName]);

  const handleLogout = () => {
    router.push("/login");
  };

  const handleLinkClick = () => {
    onMobileClose?.();
  };

  const divider = <div className="mx-4 h-px bg-[#1e2228]" />;

  const renderNavLink = (
    item: { name: string; icon: typeof LayoutDashboard; href: string },
    active: boolean
  ) => (
    <Link
      key={item.name}
      href={item.href}
      onClick={handleLinkClick}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-[#2563EB] text-white shadow-md shadow-blue-900/20"
          : "text-[#E5E7EB] hover:bg-white/[0.06]"
      }`}
    >
      <item.icon size={18} strokeWidth={1.75} className={active ? "text-white" : "text-[#9CA3AF] group-hover:text-[#E5E7EB]"} />
      <span className="flex-1">{item.name}</span>
      {active && item.href === "/dashboard/brand/find-influencer" && (
        <span className="size-2 shrink-0 rounded-full bg-[#60A5FA]" aria-hidden />
      )}
    </Link>
  );

  const userCard = (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: avatarBg }}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{userName}</p>
        {/* <p className="text-xs text-[#9CA3AF]">Free plan</p> */}
      </div>
      {/* <button
        type="button"
        className="shrink-0 rounded-lg p-1.5 text-[#9CA3AF] transition-colors hover:bg-white/5 hover:text-[#E5E7EB]"
        aria-label="Account menu"
      >
        <MoreVertical size={18} strokeWidth={1.75} />
      </button> */}
    </div>
  );

  const header = (
    <div className="flex items-center gap-3 px-4 pb-4 pt-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6] shadow-lg shadow-blue-900/30">
        <Zap className="size-5 text-white" fill="currentColor" strokeWidth={1.5} />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-lg font-bold tracking-tight text-white">
          Influe<span className="text-[#3B82F6]">Match</span>
        </span>
        {/* <span className="shrink-0 rounded-full border border-[#3B82F6]/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#60A5FA]">
          Pro
        </span> */}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full md:flex md:w-[272px] md:py-4 md:pl-4">
        <SidebarShell className="w-full rounded-2xl shadow-xl shadow-black/40">
          {header}
          {divider}

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Main</p>
            {mainNav.map((item) => renderNavLink(item, navIsActive(pathname, item.href)))}

            <p className="mt-5 px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
              Account
            </p>
            {accountNav.map((item) => renderNavLink(item, navIsActive(pathname, item.href)))}
          </nav>

          {divider}

          <div className="space-y-1 px-3 py-4">
            {userCard}
            <Link
              href="/dashboard/brand/settings"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#E5E7EB] transition-colors hover:bg-white/[0.06]"
            >
              <Settings size={18} strokeWidth={1.75} className="text-[#9CA3AF]" />
              Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#F97316] transition-colors hover:bg-[#F97316]/10"
            >
              <LogOut size={18} strokeWidth={1.75} className="text-[#F97316]" />
              Logout
            </button>
          </div>
        </SidebarShell>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[min(100vw,300px)] transform flex-col transition-transform duration-300 ease-out md:hidden ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <SidebarShell className="rounded-none border-l border-[#1e2228]">
          <div className="flex items-center justify-between border-b border-[#1e2228] px-4 py-4">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]">
                <Zap className="size-4 text-white" fill="currentColor" strokeWidth={1.5} />
              </div>
              <span className="truncate font-bold text-white">
                Influe<span className="text-[#3B82F6]">Match</span>
              </span>
              {/* <span className="shrink-0 rounded-full border border-[#3B82F6]/70 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#60A5FA]">
                Pro
              </span> */}
            </div>
            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-lg p-2 text-[#9CA3AF] hover:bg-white/5 hover:text-white"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Main</p>
            {mainNav.map((item) => renderNavLink(item, navIsActive(pathname, item.href)))}
            <p className="mt-5 px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
              Account
            </p>
            {accountNav.map((item) => renderNavLink(item, navIsActive(pathname, item.href)))}
          </nav>

          <div className="border-t border-[#1e2228] space-y-1 px-3 py-4">
            {userCard}
            <Link
              href="/dashboard/brand/settings"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#E5E7EB] transition-colors hover:bg-white/[0.06]"
            >
              <Settings size={18} strokeWidth={1.75} className="text-[#9CA3AF]" />
              Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#F97316] transition-colors hover:bg-[#F97316]/10"
            >
              <LogOut size={18} strokeWidth={1.75} className="text-[#F97316]" />
              Logout
            </button>
          </div>
        </SidebarShell>
      </aside>
    </>
  );
}
