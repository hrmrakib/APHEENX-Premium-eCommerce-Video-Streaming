/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AccountSidebar from "@/components/AccountSidebar";
import { getOrders } from "@/lib/orders";
import { getPurchasedVideos } from "@/lib/orders";
import { getWishlistCount } from "@/lib/wishlist";
import type { Order } from "@/lib/orders";

export default function AccountDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [videoCount, setVideoCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    setOrders(getOrders());
    setVideoCount(getPurchasedVideos().length);
    setWishlistCount(getWishlistCount());
  }, []);

  return (
    <div className='mx-auto container px-4 py-8 lg:px-8'>
      <h1 className='text-3xl font-bold text-gold italic mb-8'>My Account</h1>
      <div className='flex flex-col gap-8 lg:flex-row'>
        <AccountSidebar />
        <div className='flex-1 min-w-0'>
          {/* Stats */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
            <div className='card-border bg-surface/50 p-4 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold'>
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
                    d='M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z'
                  />
                </svg>
              </div>
              <div>
                <p className='text-2xl font-bold text-foreground'>
                  {orders.length}
                </p>
                <p className='text-xs text-muted'>Total Orders</p>
              </div>
            </div>
            <div className='card-border bg-surface/50 p-4 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold'>
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
                    d='m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z'
                  />
                </svg>
              </div>
              <div>
                <p className='text-2xl font-bold text-foreground'>
                  {videoCount}
                </p>
                <p className='text-xs text-muted'>Purchased Videos</p>
              </div>
            </div>
            <div className='card-border bg-surface/50 p-4 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold'>
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
                    d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
                  />
                </svg>
              </div>
              <div>
                <p className='text-2xl font-bold text-foreground'>
                  {wishlistCount}
                </p>
                <p className='text-xs text-muted'>Wishlist Items</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className='card-border bg-surface/50 p-5'>
            <h2 className='text-lg font-bold text-foreground mb-4'>
              Recent Orders
            </h2>
            {orders.length === 0 ? (
              <p className='text-sm text-muted py-6 text-center'>
                No orders yet
              </p>
            ) : (
              <div className='space-y-3'>
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className='flex items-center justify-between border-b border-border pb-3 last:border-0'
                  >
                    <div>
                      <p className='text-sm font-semibold text-foreground'>
                        Order #{order.id}
                      </p>
                      <p className='text-xs text-muted'>{order.date}</p>
                    </div>
                    <p className='text-sm font-bold text-gold'>
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {orders.length > 0 && (
              <Link
                href='/account/orders'
                className='mt-4 inline-block text-sm text-gold hover:text-gold-light transition-colors'
              >
                View all orders →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
