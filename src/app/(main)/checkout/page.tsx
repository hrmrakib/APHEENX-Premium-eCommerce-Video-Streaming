/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useProductCart } from "@/hooks/useProductCart";
import { useCreateOrderMutation } from "@/redux/features/order/orderAPI";
import { toast } from "sonner";
import { US_STATES } from "@/constants";

export default function CheckoutPage() {
  const { items, clearCart } = useProductCart();
  const [createOrderMutation, { isLoading }] = useCreateOrderMutation();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculations based on your data structure
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.discounted_price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.mobile.trim()) e.mobile = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    if (items.length === 0) return toast.error("Cart is empty");

    // Format data according to your required order place format
    const orderData = {
      full_name: form.fullName,
      email: form.email,
      phone: form.mobile,
      address: form.address,
      city: form.city,
      state: form.state || "N/A",
      postal_code: form.postalCode,
      country: form.country,
      items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await createOrderMutation(orderData).unwrap();

      if (res?.status === "success") {
        toast.success("Order placed successfully!");
        setTimeout(() => {
          window.open(res?.data?.approval_url, "_blank");
        }, 999);
        clearCart();
      }
      // router.push("/account/orders");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className='mx-auto container px-4 py-8 lg:px-8'>
      <h1 className='text-3xl font-bold text-gold italic'>Checkout</h1>

      <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Left - Billing Information */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='card-border bg-surface/50 p-6 rounded-xl border border-border'>
            <h2 className='text-lg font-bold text-foreground mb-5'>
              Billing Information
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-foreground mb-1 text-muted-foreground uppercase'>
                  Full Name *
                </label>
                <input
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder='John Doe'
                  className={`w-full bg-surface border p-3 rounded-lg outline-none focus:border-gold transition-colors ${errors.fullName ? "border-danger" : "border-border"}`}
                />
                {errors.fullName && (
                  <p className='text-xs text-danger mt-1'>{errors.fullName}</p>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-foreground mb-1 text-muted-foreground uppercase'>
                    Email *
                  </label>
                  <input
                    type='email'
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder='john@example.com'
                    className={`w-full bg-surface border p-3 rounded-lg outline-none focus:border-gold transition-colors ${errors.email ? "border-danger" : "border-border"}`}
                  />
                  {errors.email && (
                    <p className='text-xs text-danger mt-1'>{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className='block text-xs font-semibold text-foreground mb-1 text-muted-foreground uppercase'>
                    Phone Number *
                  </label>
                  <input
                    type='tel'
                    value={form.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    placeholder='+1 234 567 890'
                    className={`w-full bg-surface border p-3 rounded-lg outline-none focus:border-gold transition-colors ${errors.mobile ? "border-danger" : "border-border"}`}
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-4  gap-4'>
                <div className='col-span-3'>
                  <label className='block text-xs font-semibold text-foreground text-muted-foreground uppercase mb-2'>
                    Street Address *
                  </label>
                  <input
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder='123 Luxury Ave'
                    className={`w-full bg-surface border p-3 rounded-lg outline-none focus:border-gold transition-colors ${errors.address ? "border-danger" : "border-border"}`}
                  />
                </div>

                <div className='col-span-1'>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    State
                  </label>
                  <select
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="input-field w-auto min-w-45 h-12! cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23888%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m19.5%208.25-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')] bg-size-[16px] bg-position-[right_12px_center] bg-no-repeat pr-10"
                  >
                    {US_STATES.map(
                      (
                        state: { code: string; name: string },
                        index: number,
                      ) => (
                        <option
                          key={index}
                          value={state.code}
                          className='bg-surface text-foreground'
                        >
                          {state.name}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-xs font-semibold text-foreground mb-1 text-muted-foreground uppercase'>
                    City *
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder='New York'
                    className='w-full bg-surface border border-border p-3 rounded-lg outline-none focus:border-gold'
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-foreground mb-1 text-muted-foreground uppercase'>
                    Postal Code
                  </label>
                  <input
                    value={form.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                    placeholder='10001'
                    className='w-full bg-surface border border-border p-3 rounded-lg outline-none focus:border-gold'
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-foreground mb-1 text-muted-foreground uppercase'>
                    Country
                  </label>
                  <input
                    value={form.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className='w-full bg-surface border border-border p-3 rounded-lg outline-none focus:border-gold'
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            disabled={isLoading}
            onClick={handlePlaceOrder}
            className='w-full py-4 bg-gold text-black font-bold rounded-xl hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider'
          >
            {isLoading ? "Processing..." : "Confirm & Place Order"}
          </button>
        </div>

        {/* Right - Product Preview & Summary */}
        <div className='lg:col-span-1'>
          <div className='card-border bg-surface/50 p-5 sticky top-20 rounded-xl border border-border'>
            <h2 className='text-lg font-bold text-foreground border-b border-border pb-3'>
              Product Preview
            </h2>
            <div className='mt-4 space-y-4 max-h-100 overflow-y-auto pr-2 custom-scrollbar'>
              {items.map((item) => (
                <div key={item.product.id} className='flex gap-3'>
                  <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border'>
                    <Image
                      src={item.product.images[0]?.image || "/placeholder.png"}
                      alt={item.product.name}
                      fill
                      unoptimized
                      className='object-cover'
                    />
                  </div>
                  <div className='flex flex-1 flex-col justify-center min-w-0'>
                    <h4 className='text-sm font-medium text-foreground truncate'>
                      {item.product.name}
                    </h4>
                    <p className='text-xs text-muted-foreground'>
                      Qty: {item.quantity}
                    </p>
                    <p className='text-sm font-bold text-gold mt-1'>
                      $
                      {(item.product.discounted_price * item.quantity).toFixed(
                        2,
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-6 border-t border-border pt-4 space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Subtotal</span>
                <span className='text-foreground font-medium'>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Tax (10%)</span>
                <span className='text-foreground font-medium'>
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between pt-2 border-t border-border'>
                <span className='font-bold text-foreground'>Total</span>
                <span className='font-bold text-gold text-xl'>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
