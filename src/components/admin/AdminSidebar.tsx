"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Video,
  ShoppingCart,
  Users,
  Settings,
  X,
  Megaphone,
} from "lucide-react";
import Image from "next/image";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Videos", href: "/admin/videos", icon: Video },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col`}
      >
        <div className='p-6 flex items-center justify-center'>
          <div className='w-6 lg:hidden' />
          {/* Logo */}
          <Link href='/admin' className='shrink-0'>
            <div className='relative w-36 h-10'>
              <Image
                src={"/logo.png"}
                fill
                unoptimized
                alt='APHEENX Logo'
                className='object-contain object-left'
              />
            </div>
          </Link>
          <button
            className='lg:hidden text-white/70 hover:text-white'
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className='flex-1 px-4 py-6 space-y-2 overflow-y-auto'>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== "/admin");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-black" : "text-white/70"}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
