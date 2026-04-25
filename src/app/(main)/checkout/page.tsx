"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCart, clearCart } from "@/lib/cart";
import { getProductById } from "@/lib/data";
import { createOrder } from "@/lib/orders";
import type { Product } from "@/lib/data";

interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: Product;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadCart = useCallback(() => {
    const cartItems = getCart();
    const withProducts: CartItemWithProduct[] = [];
    cartItems.forEach((item) => {
      const product = getProductById(item.productId);
      if (product) withProducts.push({ ...item, product });
    });
    setItems(withProducts);
    if (withProducts.length === 0) router.push("/cart");
  }, [router]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field])
      setErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePayWithPaypal = () => {
    if (!validate()) return;
    const orderItems = items.map((i) => ({
      productId: i.productId,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      type: "product" as const,
    }));
    createOrder(orderItems, total);
    clearCart();
    alert("Order placed successfully! Redirecting to PayPal...");
    router.push("/account/orders");
  };

  return (
    <div className='mx-auto container px-4 py-8 lg:px-8'>
      <h1 className='text-3xl font-bold text-gold italic'>Checkout</h1>

      <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Left - Billing + Payment */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Billing Information */}
          <div className='card-border bg-surface/50 p-6'>
            <h2 className='text-lg font-bold text-foreground mb-5'>
              Billing Information
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-foreground mb-1'>
                  Full Name *
                </label>
                <input
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder='John Doe'
                  className={`input-field ${errors.fullName ? "border-danger" : ""}`}
                />
                {errors.fullName && (
                  <p className='text-xs text-danger mt-1'>{errors.fullName}</p>
                )}
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-foreground mb-1'>
                    Email *
                  </label>
                  <input
                    type='email'
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder='john@example.com'
                    className={`input-field ${errors.email ? "border-danger" : ""}`}
                  />
                  {errors.email && (
                    <p className='text-xs text-danger mt-1'>{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className='block text-xs font-semibold text-foreground mb-1'>
                    Mobile No*
                  </label>
                  <input
                    type='tel'
                    value={form.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    placeholder='(000) 00 00 00'
                    className='input-field'
                  />
                </div>
              </div>
              <div>
                <label className='block text-xs font-semibold text-foreground mb-1'>
                  Address *
                </label>
                <input
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder='123 Main St'
                  className={`input-field ${errors.address ? "border-danger" : ""}`}
                />
                {errors.address && (
                  <p className='text-xs text-danger mt-1'>{errors.address}</p>
                )}
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-foreground mb-1'>
                    City *
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder='New York'
                    className={`input-field ${errors.city ? "border-danger" : ""}`}
                  />
                  {errors.city && (
                    <p className='text-xs text-danger mt-1'>{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className='block text-xs font-semibold text-foreground mb-1'>
                    Postal Code
                  </label>
                  <input
                    value={form.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                    placeholder='10001'
                    className='input-field'
                  />
                </div>
              </div>
              <div>
                <label className='block text-xs font-semibold text-foreground mb-1'>
                  Country
                </label>
                <input
                  value={form.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className='input-field'
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className='card-border bg-surface/50 p-6'>
            <h2 className='text-lg font-bold text-foreground mb-2'>
              Payment Method
            </h2>
            <p className='text-sm text-muted mb-4'>
              You will be redirected to PayPal to complete your payment
              securely.
            </p>
            <button
              onClick={handlePayWithPaypal}
              className='btn-gold w-full py-3 text-sm'
            >
              Pay with PayPal
            </button>
          </div>
        </div>

        {/* Right - Order Summary */}
        <div className='lg:col-span-1'>
          <div className='card-border bg-surface/50 p-5 sticky top-20'>
            <h2 className='text-lg font-bold text-foreground'>Order Summary</h2>
            <div className='mt-4 space-y-3'>
              {items.map((item) => (
                <div
                  key={item.productId}
                  className='flex justify-between text-sm'
                >
                  <span className='text-muted truncate mr-2'>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className='text-foreground flex-shrink-0'>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className='border-t border-border pt-3 space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted'>Subtotal</span>
                  <span className='text-foreground'>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted'>Tax (10%)</span>
                  <span className='text-foreground'>${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className='border-t border-border pt-3 flex justify-between'>
                <span className='font-bold text-foreground'>Total</span>
                <span className='font-bold text-gold'>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
