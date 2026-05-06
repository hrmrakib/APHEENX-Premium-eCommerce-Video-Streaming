"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, AlertCircle } from "lucide-react"; // I recommend Lucide for cleaner icons
import Image from "next/image";

const menuItems = [
  { label: "Dashboard", href: "/account", icon: "user" },
  { label: "Orders", href: "/account/orders", icon: "orders" },
  { label: "My Videos", href: "/account/videos", icon: "video" },
  { label: "Settings", href: "/account/settings", icon: "settings" },
];

const icons: Record<string, React.ReactNode> = {
  user: (
    <svg
      className='h-4 w-4'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.5'
        d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
      />
    </svg>
  ),
  orders: (
    <svg
      className='h-4 w-4'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.5'
        d='M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z'
      />
    </svg>
  ),
  video: (
    <svg
      className='h-4 w-4'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.5'
        d='m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z'
      />
    </svg>
  ),
  settings: (
    <svg
      className='h-4 w-4'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.5'
        d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z'
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.5'
        d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
      />
    </svg>
  ),
};

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmSignOut = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  console.log({ user });

  return (
    <>
      <aside className='w-full lg:w-64 shrink-0'>
        <div className='card-border bg-surface/50 p-5'>
          {/* User Info */}
          <div className='flex items-center gap-3 pb-4 border-b border-border'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-gold text-sm font-bold'>
              <Image
                src={(user?.profile_image as string) || "/placeholder.png"}
                alt={user?.name || "User"}
                width={40}
                height={40}
                unoptimized
                className='rounded-full'
              />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-semibold text-foreground truncate'>
                {user?.name}
              </p>
              <p className='text-xs text-muted truncate'>{user?.email}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className='mt-4 space-y-1'>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "gold-gradient text-black"
                      : "text-foreground/70 hover:text-foreground hover:bg-surface-light"
                  }`}
                >
                  {icons[item.icon]}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sign Out Button - Triggers Modal */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className='mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger/5 transition-colors'
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Confirmation Modal Overlay */}
      {showLogoutModal && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'>
          <div
            className='w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex flex-col items-center text-center'>
              <div className='h-12 w-12 rounded-full bg-danger/10 flex items-center justify-center text-danger mb-4'>
                <AlertCircle size={28} />
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Sign Out?</h3>
              <p className='text-white/60 text-sm mb-6'>
                Are you sure you want to log out of your account? You will need
                to sign in again to access your content.
              </p>

              <div className='flex w-full gap-3'>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className='flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors text-sm'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSignOut}
                  className='flex-1 px-4 py-2.5 rounded-lg bg-danger text-white font-bold hover:bg-danger/90 transition-all active:scale-95 text-sm'
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
