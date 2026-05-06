"use client";

import { useAuth } from "@/hooks/useAuth";
import { Search, Menu } from "lucide-react";
import Image from "next/image";

interface AdminHeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export default function AdminHeader({ setSidebarOpen }: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <header className='sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/5'>
      <div className='flex items-center gap-4'>
        <button
          className='lg:hidden text-white/70 hover:text-white'
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        <div className='relative hidden md:block w-96'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-white/40'
            size={18}
          />
          <input
            type='text'
            placeholder='Search here'
            className='w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all'
          />
        </div>
      </div>

      <div className='flex items-center gap-6'>
        <div className='flex items-center gap-3'>
          <div
            className='w-10 h-10 rounded-full bg-yellow-900/50 flex items-center justify-center overflow-hidden border border-yellow-500/20'
            title={user?.name + " - Profile Picture"}
          >
            <Image
              src={(user?.profile_image as string) || "/placeholder.png"}
              width={40}
              height={40}
              unoptimized
              alt='Profile'
              className='object-cover'
            />
          </div>
          <div className='hidden md:block'>
            <p className='text-sm font-semibold text-white' title={user?.name}>
              {user?.name} (Admin)
            </p>
            <p className='text-xs text-white/50' title={user?.email}>
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
