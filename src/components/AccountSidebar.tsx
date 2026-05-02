"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signout } from "@/lib/auth";
import { useState } from "react";

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
        d='m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z'
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
  // const [user, setUser] = useState<{ fullName: string; email: string } | null>(
  //   null,
  // );
  const [user, setUser] = useState<{ fullName: string; email: string } | null>({
    fullName: "John Doe",
    email: "john.doe@example.com",
  });

  // useEffect(() => {
  //   const u = getCurrentUser();
  //   if (!u) {
  //     router.push("/signin");
  //     return;
  //   }
  //   setUser({ fullName: u.fullName, email: u.email });
  // }, [router]);

  const handleSignOut = () => {
    signout();
    router.push("/signin");
  };

  // if (!user) return null;

  return (
    <aside className='w-full lg:w-64 shrink-0'>
      <div className='card-border bg-surface/50 p-5'>
        {/* User Info */}
        <div className='flex items-center gap-3 pb-4 border-b border-border'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-gold text-sm font-bold'>
            {user!.fullName.charAt(0).toUpperCase()}
          </div>
          <div className='min-w-0'>
            <p className='text-sm font-semibold text-foreground truncate'>
              {user!.fullName}
            </p>
            <p className='text-xs text-muted truncate'>{user!.email}</p>
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

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className='mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger/5 transition-colors'
        >
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
              d='M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9'
            />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
