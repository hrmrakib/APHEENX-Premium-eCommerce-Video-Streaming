"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    customer: "Akash Saha",
    email: "aksaha9@gmail.com",
    total: 1450,
    status: "Delivered",
    date: "14/04/2026",
  },
  {
    id: "ORD-002",
    customer: "Sakib",
    email: "sakib9@gmail.com",
    total: 1450,
    status: "Shipped",
    date: "14/04/2026",
  },
  {
    id: "ORD-003",
    customer: "Sakib",
    email: "sakib9@gmail.com",
    total: 1450,
    status: "Processing",
    date: "14/04/2026",
  },
];

export default function AdminOrdersPage() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "border-green-500/50 text-green-500 bg-green-500/10";
      case "shipped":
        return "border-purple-500/50 text-purple-500 bg-purple-500/10";
      case "processing":
        return "border-blue-500/50 text-blue-500 bg-blue-500/10";
      default:
        return "border-white/20 text-white/70 bg-white/5";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Orders</h1>
        <p className="text-white/60 text-sm">Manage and track customer orders</p>
      </div>

      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-[#111] text-white/60 text-xs border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.email}</td>
                  <td className="px-6 py-4 text-green-500 font-medium">
                    $ {order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-white/60 hover:text-white transition-colors block">
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
