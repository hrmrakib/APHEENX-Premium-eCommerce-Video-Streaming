"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

interface OrderDetailsProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsProps) {
  // Unwrap params using React.use() to avoid Next.js 15+ warnings about synchronous access to dynamic params.
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  return (
    <div className="max-w-6xl space-y-8 pb-10">
      <div>
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm">Back to order</span>
        </Link>
        <h1 className="text-2xl font-bold text-white mb-1">Order Details</h1>
        <p className="text-white/60 text-sm">Order {orderId}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Customer Information Card */}
          <div className="bg-[#FFCC80] rounded-xl p-6 text-black">
            <h2 className="font-semibold text-sm mb-6">Customer Information</h2>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                  <User size={18} className="text-black/70" />
                </div>
                <div>
                  <p className="text-xs text-black/60">Name</p>
                  <p className="font-medium text-sm">John Doe</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-black/70" />
                </div>
                <div>
                  <p className="text-xs text-black/60">Email</p>
                  <p className="font-medium text-sm">john@example.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-black/70" />
                </div>
                <div>
                  <p className="text-xs text-black/60">Phone</p>
                  <p className="font-medium text-sm">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-black/70" />
                </div>
                <div>
                  <p className="text-xs text-black/60">Shipping Address</p>
                  <p className="font-medium text-sm">123 Main Street, Apt 4B, New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Card */}
          <div className="bg-[#FFE0B2] rounded-xl p-6 text-black">
            <h2 className="font-semibold text-sm mb-6">Order Items</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-black/10 text-xs text-black/60">
                  <tr>
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium text-center">Quantity</th>
                    <th className="pb-3 font-medium text-right">Price</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black/5 rounded flex items-center justify-center">
                          <span className="text-[8px] font-bold">IMG</span>
                        </div>
                        <span className="font-medium">Premium Wireless Headphones</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">1</td>
                    <td className="py-4 text-right">$299.99</td>
                    <td className="py-4 text-right font-medium">$299.99</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-black/10 space-y-2">
              <div className="flex justify-between text-sm text-black/70">
                <span>Subtotal</span>
                <span>$299.99</span>
              </div>
              <div className="flex justify-between text-sm text-black/70">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 mt-2 border-t border-black/10">
                <span>Total</span>
                <span>$299.99</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-80">
          <div className="bg-[#EFEFEF] rounded-xl p-6 text-black sticky top-24">
            <h2 className="font-semibold text-sm mb-6">Order Status</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-black/60 font-medium">Update Status</label>
                <select className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4A843]">
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered" selected>Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-black/60 font-medium">Order Date</label>
                <p className="text-sm font-medium">2026-04-14</p>
              </div>

              <button className="w-full bg-[#D4A843] hover:bg-[#B8922F] text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
                Update Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
