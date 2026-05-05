/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import AccountSidebar from "@/components/AccountSidebar";

import { useProductWishlist } from "@/hooks/useProductWishlist";
import { useVideoWishlist } from "@/hooks/useVideoWishlist";
import { useGetUserDashboardQuery } from "@/redux/features/user/userAPI";
import { ChevronRight, Clock, Package } from "lucide-react";

interface OrderItem {
  product_name: string;
  quantity: number;
}

interface Order {
  id: number;
  full_name: string;
  total_price: string;
  order_status: string;
  payment_status: string;
  created_at: string;
  items: OrderItem[];
}

export default function AccountDashboard() {
  const { wishlistItems } = useProductWishlist();
  const { wishlistItems: videoWishlistItems } = useVideoWishlist();

  const wishlistCount = wishlistItems?.length + videoWishlistItems?.length;

  const { data: userDashboardData } = useGetUserDashboardQuery({});

  const userDashboard = userDashboardData?.data;

  const orders = userDashboard?.recent_orders || [];

  console.log({ userDashboard });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
                  {userDashboard?.total_orders}
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
                  {userDashboard?.purchased_videos}
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
          {orders.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 opacity-40'>
              <Package size={40} strokeWidth={1} className='mb-2 text-white' />
              <p className='text-sm text-white'>No orders yet</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {orders.slice(0, 5).map((order: Order) => (
                <div
                  key={order.id}
                  className='group flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0'
                >
                  <div className='space-y-1'>
                    <div className='flex items-center gap-3'>
                      <p className='text-sm font-bold text-white group-hover:text-yellow-500 transition-colors'>
                        Order #{order.id}
                      </p>
                      {/* Status Badge */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                          order.payment_status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                            : "bg-green-500/10 text-green-500 border border-green-500/20"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </div>

                    <div className='flex items-center gap-2 text-xs text-white/40'>
                      <Clock size={12} />
                      <span>{formatDate(order.created_at)}</span>
                      <span>•</span>
                      <span>
                        {order.items.length}{" "}
                        {order.items.length > 1 ? "items" : "item"}
                      </span>
                    </div>
                  </div>

                  <div className='text-right flex items-center gap-4'>
                    <div>
                      <p className='text-sm font-black text-yellow-500'>
                        ${parseFloat(order.total_price).toFixed(2)}
                      </p>
                      <p className='text-[10px] text-white/30 font-medium italic'>
                        {order.items[0]?.product_name.substring(0, 15)}...
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className='text-white/20 group-hover:text-white transition-colors'
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {orders.length > 0 && (
            <Link
              href='/account/orders'
              className='mt-6 flex items-center justify-center w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white/80 hover:text-white transition-all group'
            >
              View all orders
              <ChevronRight
                size={14}
                className='ml-1 group-hover:translate-x-1 transition-transform'
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
