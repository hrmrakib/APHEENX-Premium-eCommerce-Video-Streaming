/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, MapPin } from "lucide-react";
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/admin/orderAPI";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getStatusColor } from "../page";
import Image from "next/image";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

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
  payment_status: "pending" | "captured" | "failed" | "refunded" | string;
  order_status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | string;
  total_price: string;
  items: IOrderItem[];
  created_at: string;
  updated_at: string;
}

/*
PAYMENT_STATUS_CHOICES = (
    ('pending', 'Pending'),
    ('captured', 'Captured'),
    ('failed', 'Failed'),
    ('refunded', 'Refunded'),
)

const ORDER_STATUS_CHOICES = {
    ('pending', 'Pending'),
    ('processing', 'Processing'),
    ('shipped', 'Shipped'),
    ('delivered', 'Delivered'),
    ('cancelled', 'Cancelled'),
}
*/

export default function OrderDetailsPage() {
  const id = useParams().id as string;
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // Local state for select

  const { data: orderDetails, isLoading } = useGetOrderByIdQuery(id);
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation(); // Mutation Hook

  const order = orderDetails?.data as IOrder | undefined;

  // Sync local state when data loads
  useEffect(() => {
    if (order?.order_status) {
      setSelectedStatus(order.order_status);
    }
  }, [order]);

  const handleUpdateStatus = async () => {
    try {
      await updateOrderStatus({
        id,
        status: selectedStatus,
      }).unwrap();
      toast.success("Order status updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return <div className='p-10 text-white'>Loading order details...</div>;
  }

  if (!order) {
    return <div className='p-10 text-white'>Order not found.</div>;
  }

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <div className='max-w-6xl space-y-8 pb-10'>
        <div>
          <Link
            href='/admin/orders'
            className='inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors'
          >
            <ArrowLeft size={16} />
            <span className='text-sm'>Back to orders</span>
          </Link>
          <h1 className='text-2xl font-bold text-white mb-1'>Order Details</h1>
          <p className='text-white/60 text-sm'>Order #{order.id}</p>
        </div>

        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Left Column */}
          <div className='flex-1 space-y-6'>
            {/* Customer Information Card */}
            <div className='bg-[#FFCC80] rounded-xl p-6 text-black'>
              <h2 className='font-semibold text-sm mb-6'>
                Customer Information
              </h2>

              <div className='space-y-5'>
                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0'>
                    <User size={18} className='text-[#0A0A0A]' />
                  </div>
                  <div>
                    <p className='text-xs text-[#6A7282]'>Name</p>
                    <p className='font-medium text-sm text-[#101828]'>
                      {order.full_name}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0'>
                    <Mail size={18} className='text-[#0A0A0A]' />
                  </div>
                  <div>
                    <p className='text-xs text-[#6A7282]'>Email</p>
                    <p className='font-medium text-sm text-[#101828]'>
                      {order.email}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0'>
                    <Phone size={18} className='text-[#0A0A0A]' />
                  </div>
                  <div>
                    <p className='text-xs text-[#6A7282]'>Phone</p>
                    <p className='font-medium text-sm text-[#101828]'>
                      {order.phone}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0'>
                    <MapPin size={18} className='text-[#0A0A0A]' />
                  </div>
                  <div>
                    <p className='text-xs text-[#6A7282]'>Shipping Address</p>
                    <p className='font-medium text-sm'>
                      {order.address}, {order.city}, {order.state}{" "}
                      {order.postal_code}, {order.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Card */}
            <div className='bg-[#FFE0B2] rounded-xl p-6 text-black'>
              <h2 className='font-semibold text-sm mb-6'>Order Items</h2>

              <div className='overflow-x-auto'>
                <table className='w-full text-left text-sm'>
                  <thead className='border-b border-black/10 text-xs text-[#6A7282]'>
                    <tr>
                      <th className='pb-3 font-medium'>Product</th>
                      <th className='pb-3 font-medium text-center'>Quantity</th>
                      <th className='pb-3 font-medium text-right'>Price</th>
                      <th className='pb-3 font-medium text-right'>Total</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-black/5'>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className='py-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-black/5 rounded-2xl flex items-center justify-center'>
                              <Image
                                className='rounded-sm'
                                src={"/images/belt.png"}
                                alt={item.product_name}
                                width={40}
                                height={40}
                              />
                            </div>
                            <span className='font-medium'>
                              {item.product_name}
                            </span>
                          </div>
                        </td>
                        <td className='py-4 text-center'>{item.quantity}</td>
                        <td className='py-4 text-right'>${item.unit_price}</td>
                        <td className='py-4 text-right font-medium'>
                          ${item.subtotal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className='mt-6 pt-4 border-t border-black/10 space-y-2'>
                <div className='flex justify-between text-sm text-[#0A0A0A]'>
                  <span>Subtotal</span>
                  <span>${order.total_price}</span>
                </div>
                <div className={`flex justify-between text-sm text-[#0A0A0A]`}>
                  <span>Payment Status</span>
                  <span
                    className={`capitalize px-3 py-1 rounded-full text-sm tracking-wider font-semibold border ${getStatusColor(order.order_status)}`}
                  >
                    {order.payment_status}
                  </span>
                </div>
                <div className='flex justify-between text-base font-bold pt-2 mt-2 border-t border-black/10'>
                  <span>Total</span>
                  <span>${order.total_price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className='w-full lg:w-80'>
            <div className='bg-[#EFEFEF] rounded-xl p-6 text-black sticky top-24'>
              <h2 className='font-semibold text-sm mb-6'>Order Status</h2>

              <div className='space-y-6'>
                <div className='space-y-2'>
                  <label className='text-xs text-[#6A7282] font-medium'>
                    Update Status
                  </label>
                  <select
                    value={selectedStatus} // Controlled component
                    onChange={(e) => setSelectedStatus(e.target.value)} // Update state
                    className='w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4A843] capitalize'
                  >
                    <option value='pending'>Pending</option>
                    <option value='processing'>Processing</option>
                    <option value='shipped'>Shipped</option>
                    <option value='delivered'>Delivered</option>
                    <option value='cancelled'>Cancelled</option>
                  </select>
                </div>

                <div className='space-y-1'>
                  <label className='text-xs text-[#6A7282] font-medium'>
                    Order Date
                  </label>
                  <p className='text-sm font-medium'>
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={handleUpdateStatus} // Click Handler
                  disabled={isUpdating || selectedStatus === order.order_status}
                  className='w-full bg-[#D4A843] hover:bg-[#B8922F] disabled:bg-[#D4A843]/50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm'
                >
                  {isUpdating ? "Updating..." : "Update Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleRedirect>
  );
}
