/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { getCartCount } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import { useProductCart } from "@/hooks/useProductCart";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Video", href: "/video" },
  { label: "Wishlist", href: "/wishlist" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { totalItems, items } = useProductCart();

  const { user, token, profileLoading } = useAuth();
  // const user = useSelector((state: RootState) => state.auth.user);

  // console.log({ user, token, profileLoading });

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md'>
      <div className='mx-auto flex h-16 container items-center justify-between px-4 lg:px-8'>
        {/* Logo */}
        <Link href='/' className='shrink-0'>
          <div className='flex items-center gap-1'>
            <div className='relative'>
              <div className='gold-gradient-text text-xl font-black italic tracking-tighter leading-tight'>
                APHEENX
              </div>
              <div className='text-[8px] text-gold tracking-wider'>
                🔥 PREMIUM
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className='hidden md:flex items-center'>
          <div className='flex items-center gap-1 rounded-full border border-border px-2 py-1'>
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "text-gold"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right section */}
        <div className='flex items-center gap-3'>
          {/* Search */}
          <div className='hidden sm:flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2'>
            <svg
              className='h-4 w-4 text-muted'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <circle cx='11' cy='11' r='8' />
              <path d='m21 21-4.3-4.3' strokeLinecap='round' strokeWidth='2' />
            </svg>
            <input
              type='text'
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-28 bg-transparent text-sm text-foreground outline-none placeholder:text-muted lg:w-36'
            />
          </div>

          {/* Cart */}
          <button
            onClick={() => router.push("/cart")}
            className='relative p-2 text-foreground/70 hover:text-foreground transition-colors'
          >
            <svg
              className='h-5 w-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='1.5'
                d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
              />
            </svg>
            {items?.length > 0 && (
              <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black'>
                {items?.length}
              </span>
            )}
          </button>

          {/* User */}
          <Link
            href={user ? "/account" : "/signin"}
            className='p-2 text-foreground/70 hover:text-foreground transition-colors'
          >
            <svg
              className='h-5 w-5'
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
          </Link>

          {/* Mobile hamburger */}
          <button
            className='md:hidden p-2 text-foreground/70'
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label='Toggle menu'
          >
            {menuOpen ? (
              <svg
                className='h-6 w-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18 18 6M6 6l12 12'
                />
              </svg>
            ) : (
              <svg
                className='h-6 w-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className='md:hidden border-t border-border bg-background'>
          <div className='px-4 py-3'>
            <div className='sm:hidden flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 mb-3'>
              <svg
                className='h-4 w-4 text-muted'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <circle cx='11' cy='11' r='8' />
                <path
                  d='m21 21-4.3-4.3'
                  strokeLinecap='round'
                  strokeWidth='2'
                />
              </svg>
              <input
                type='text'
                placeholder='Search...'
                className='w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted'
              />
            </div>
            <nav className='flex flex-col gap-1'>
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-gold bg-gold/5"
                        : "text-foreground/70 hover:text-foreground hover:bg-surface"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
