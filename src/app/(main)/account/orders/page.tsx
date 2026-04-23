"use client";

import { useState, useEffect } from "react";
import AccountSidebar from "@/components/AccountSidebar";
import { getOrders } from "@/lib/orders";
import type { Order } from "@/lib/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-bold text-gold italic mb-8">My Account</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <AccountSidebar />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground mb-6">Order History</h2>
          {orders.length === 0 ? (
            <div className="card-border bg-surface/50 p-8 text-center">
              <p className="text-muted">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="card-border bg-surface/50 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-bold text-foreground">Order #{order.id}</p>
                      <p className="text-xs text-muted">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted">Total</p>
                      <p className="text-lg font-bold text-gold">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3 space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-gold" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted capitalize">{item.type}</p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
