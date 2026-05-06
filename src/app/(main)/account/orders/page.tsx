"use client";

import { useState } from "react";
import AccountSidebar from "@/components/AccountSidebar";
import { useGetMyOrdersQuery } from "@/redux/features/order/orderAPI";
import GlobalPagination from "@/components/pagination/GlobalPagination";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  subtotal: number;
}

export interface Order {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  paypal_order_id: string | null;
  payment_status: "pending" | "completed" | "failed";
  order_status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  total_price: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: orderData, isLoading } = useGetMyOrdersQuery({
    page: currentPage,
    page_size: 6,
  });

  const orders: Order[] = orderData?.data || [];
  const totalPages = orderData?.meta?.total_pages || 1;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <RoleRedirect allowedRole='USER'>
      <div className='mx-auto container px-4 py-8 lg:px-8'>
        <h1 className='text-3xl font-bold text-gold italic mb-8'>My Account</h1>
        <div className='flex flex-col gap-8 lg:flex-row'>
          <AccountSidebar />

          <div className='flex-1 min-w-0'>
            <h2 className='text-xl font-bold text-foreground mb-6'>
              Order History
            </h2>

            {isLoading ? (
              <div className='text-center py-10 text-muted'>
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className='card-border bg-surface/50 p-8 text-center'>
                <p className='text-muted'>No orders yet</p>
              </div>
            ) : (
              <>
                <div className='space-y-4'>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className='card-border bg-surface/50 p-5'
                    >
                      <div className='flex items-center justify-between mb-4'>
                        <div>
                          <div className='flex items-center gap-3'>
                            <p className='text-sm font-bold text-foreground uppercase'>
                              Order #{order.id}
                            </p>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                order.payment_status === "pending"
                                  ? "border-yellow-500/50 text-yellow-500"
                                  : "border-green-500/50 text-green-500"
                              }`}
                            >
                              {order.payment_status}
                            </span>
                          </div>
                          <p className='text-xs text-muted mt-1'>
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-xs text-muted'>Total Amount</p>
                          <p className='text-lg font-bold text-gold'>
                            ${parseFloat(order.total_price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className='border-t border-white/5 pt-3 space-y-3'>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className='flex items-center justify-between'
                          >
                            <div className='flex items-center gap-3'>
                              <div className='h-1.5 w-1.5 rounded-full bg-gold' />
                              <div>
                                <p className='text-sm font-medium text-foreground'>
                                  {item.product_name}
                                </p>
                                <p className='text-xs text-muted'>
                                  Qty: {item.quantity} × $
                                  {parseFloat(item.unit_price).toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <p className='text-sm font-semibold text-foreground'>
                              ${item.subtotal.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Component */}
                <GlobalPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </RoleRedirect>
  );
}
