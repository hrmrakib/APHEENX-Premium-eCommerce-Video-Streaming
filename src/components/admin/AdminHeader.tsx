"use client";

import { Search, Menu, Bell } from "lucide-react";
import Image from "next/image";

interface AdminHeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export default function AdminHeader({ setSidebarOpen }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden text-white/70 hover:text-white"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        
        <div className="relative hidden md:block w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Search here" 
            className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-white/70 hover:text-white relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-900/50 flex items-center justify-center overflow-hidden border border-yellow-500/20">
            {/* Avatar placeholder */}
            <span className="text-yellow-500 font-bold text-sm">AU</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-white">Admin Users</p>
            <p className="text-xs text-white/50">admin@gmail.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
