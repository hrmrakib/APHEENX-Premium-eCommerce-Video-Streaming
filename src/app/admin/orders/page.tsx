"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { useGetAllOrdersQuery } from "@/redux/features/admin/orderAPI";
import { RoleRedirect } from "@/components/auth/RoleRedirect";
import { useState } from "react";

export interface IOrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  subtotal: number;
}

export interface IOrder {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  paypal_order_id: string;
  payment_status: "pending" | "completed" | "failed" | string;
  order_status: "pending" | "shipped" | "delivered" | "cancelled" | string;
  total_price: string;
  items: IOrderItem[];
  created_at: string;
  updated_at: string;
}

const OrderTableSkeleton = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <tr key={i} className='animate-pulse border-b border-white/5'>
        <td className='px-6 py-4'>
          <div className='h-4 bg-white/10 rounded w-8' />
        </td>
        <td className='px-6 py-4'>
          <div className='h-4 bg-white/10 rounded w-32' />
        </td>
        <td className='px-6 py-4'>
          <div className='h-4 bg-white/5 rounded w-40' />
        </td>
        <td className='px-6 py-4'>
          <div className='h-4 bg-white/10 rounded w-16' />
        </td>
        <td className='px-6 py-4'>
          <div className='h-6 bg-white/5 rounded-full w-20' />
        </td>
        <td className='px-6 py-4'>
          <div className='h-4 bg-white/5 rounded w-24' />
        </td>
        <td className='px-6 py-4'>
          <div className='flex justify-center'>
            <div className='h-5 w-5 bg-white/10 rounded' />
          </div>
        </td>
      </tr>
    ))}
  </>
);

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
    case "completed":
      return "border-green-500/50 text-green-500 bg-green-500/10";
    case "shipped":
      return "border-purple-500/50 text-purple-500 bg-purple-500/10";
    case "pending":
    case "processing":
      return "border-blue-500/50 text-blue-500 bg-blue-500/10";
    case "failed":
    case "cancelled":
      return "border-red-500/50 text-red-500 bg-red-500/10";
    default:
      return "border-white/20 text-white/70 bg-white/5";
  }
};

export default function AdminOrdersPage() {
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const { data: orderData, isLoading } = useGetAllOrdersQuery({
    order_status: orderStatus,
    payment_status: paymentStatus,
  });
  const orders: IOrder[] = orderData?.data || [];

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-white mb-1'>Orders</h1>
            <p className='text-white/60 text-sm'>
              Manage and track customer orders
            </p>
          </div>

          <div className='flex items-center gap-6'>
            <div className='space-y-4'>
              <label className='text-xs text-[#ffffff] font-medium'>
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className='w-full bg-black border border-[#141413]! rounded-lg px-3 py-2 text-sm outline-none  focus:border-[#D4A843] capitalize pt-2.5'
              >
                <option value=''>All</option>
                <option value='pending'>Pending</option>
                <option value='captured'>Captured</option>
                <option value='failed'>Failed</option>
                <option value='refunded'>Refunded</option>
              </select>
            </div>

            <div className='space-y-2'>
              <label className='text-xs text-[#ffffff] font-medium'>
                Order Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className='w-full bg-black border border-[#141413]! rounded-lg px-3 py-2 text-sm outline-none  focus:border-[#D4A843] capitalize'
              >
                <option value=''>All</option>
                <option value='pending'>Pending</option>
                <option value='processing'>Processing</option>
                <option value='shipped'>Shipped</option>
                <option value='delivered'>Delivered</option>
                <option value='cancelled'>Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className='bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden mt-6'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm text-white/80'>
              <thead className='bg-[#111] text-white/60 text-xs border-b border-white/10'>
                <tr>
                  <th className='px-6 py-4 font-medium'>Order ID</th>
                  <th className='px-6 py-4 font-medium'>Customer</th>
                  <th className='px-6 py-4 font-medium'>Email</th>
                  <th className='px-6 py-4 font-medium'>Total</th>
                  <th className='px-6 py-4 font-medium'>Order Status</th>
                  <th className='px-6 py-4 font-medium'>Payment Status</th>
                  <th className='px-6 py-4 font-medium'>Date</th>
                  <th className='px-6 py-4 font-medium text-center'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/5'>
                {isLoading ? (
                  <OrderTableSkeleton />
                ) : (
                  orders.map((order: IOrder, index: number) => (
                    <tr
                      key={order.id}
                      className='hover:bg-white/5 transition-colors'
                    >
                      <td className='px-6 py-4 font-medium text-white'>
                        #{order.id}
                      </td>
                      <td className='px-6 py-4'>{order.full_name}</td>
                      <td className='px-6 py-4 truncate max-w-[150px]'>
                        {order.email}
                      </td>
                      <td className='px-6 py-4 text-green-500 font-medium'>
                        ${Number(order.total_price).toFixed(2)}
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold border ${getStatusColor(
                            order.order_status,
                          )}`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold border ${getStatusColor(
                            order.payment_status,
                          )}`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-white/60'>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4'>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className='text-white/60 hover:text-white transition-colors flex justify-center'
                        >
                          <Eye size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleRedirect>
  );
}
