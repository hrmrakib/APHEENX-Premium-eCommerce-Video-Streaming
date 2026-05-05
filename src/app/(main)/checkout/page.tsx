/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useProductCart } from "@/hooks/useProductCart";
import { useCreateOrderMutation } from "@/redux/features/order/orderAPI";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useProductCart(); // items is [{ product, quantity }]
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

              <div>
                <label className='block text-xs font-semibold text-foreground mb-1 text-muted-foreground uppercase'>
                  Street Address *
                </label>
                <input
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder='123 Luxury Ave'
                  className={`w-full bg-surface border p-3 rounded-lg outline-none focus:border-gold transition-colors ${errors.address ? "border-danger" : "border-border"}`}
                />
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
            <div className='mt-4 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar'>
              {items.map((item) => (
                <div key={item.product.id} className='flex gap-3'>
                  <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border'>
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

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { getCart, clearCart } from "@/lib/cart";
// import { getProductById } from "@/lib/data";
// import { createOrder } from "@/lib/orders";
// import type { Product } from "@/lib/data";
// import { useProductCart } from "@/hooks/useProductCart";
// import { useCreateOrderMutation } from "@/redux/features/order/orderAPI";

// interface CartItemWithProduct {
//   productId: string;
//   quantity: number;
//   product: Product;
// }

// export default function CheckoutPage() {
//   const router = useRouter();
//   const [items, setItems] = useState<CartItemWithProduct[]>([]);
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     mobile: "",
//     address: "",
//     city: "",
//     postalCode: "",
//     country: "United States",
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const { items } = useProductCart();
//   const [createOrderMutation] = useCreateOrderMutation();

//   const loadCart = useCallback(() => {
//     const cartItems = getCart();
//     const withProducts: CartItemWithProduct[] = [];
//     cartItems.forEach((item) => {
//       const product = getProductById(item.productId);
//       if (product) withProducts.push({ ...item, product });
//     });
//     setItems(withProducts);
//     // if (withProducts.length === 0) router.push("/cart");
//   }, [router]);

//   useEffect(() => {
//     loadCart();
//   }, [loadCart]);

//   const subtotal = items.reduce(
//     (sum, i) => sum + i.product.price * i.quantity,
//     0,
//   );
//   const tax = subtotal * 0.1;
//   const total = subtotal + tax;

//   const handleChange = (field: string, value: string) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//     if (errors[field])
//       setErrors((prev) => {
//         const n = { ...prev };
//         delete n[field];
//         return n;
//       });
//   };

//   const validate = () => {
//     const e: Record<string, string> = {};
//     if (!form.fullName.trim()) e.fullName = "Required";
//     if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
//       e.email = "Valid email required";
//     if (!form.address.trim()) e.address = "Required";
//     if (!form.city.trim()) e.city = "Required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handlePayWithPaypal = () => {
//     if (!validate()) return;
//     const orderItems = items.map((i) => ({
//       productId: i.productId,
//       name: i.product.name,
//       price: i.product.price,
//       quantity: i.quantity,
//       type: "product" as const,
//     }));
//     createOrder(orderItems, total);
//     clearCart();
//     alert("Order placed successfully! Redirecting to PayPal...");
//     router.push("/account/orders");
//   };

//   return (
//     <div className='mx-auto container px-4 py-8 lg:px-8'>
//       <h1 className='text-3xl font-bold text-gold italic'>Checkout</h1>

//       <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3'>
//         {/* Left - Billing + Payment */}
//         <div className='lg:col-span-2 space-y-6'>
//           {/* Billing Information */}
//           <div className='card-border bg-surface/50 p-6'>
//             <h2 className='text-lg font-bold text-foreground mb-5'>
//               Billing Information
//             </h2>
//             <div className='space-y-4'>
//               <div>
//                 <label className='block text-xs font-semibold text-foreground mb-1'>
//                   Full Name *
//                 </label>
//                 <input
//                   value={form.fullName}
//                   onChange={(e) => handleChange("fullName", e.target.value)}
//                   placeholder='John Doe'
//                   className={`input-field ${errors.fullName ? "border-danger" : ""}`}
//                 />
//                 {errors.fullName && (
//                   <p className='text-xs text-danger mt-1'>{errors.fullName}</p>
//                 )}
//               </div>
//               <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
//                 <div>
//                   <label className='block text-xs font-semibold text-foreground mb-1'>
//                     Email *
//                   </label>
//                   <input
//                     type='email'
//                     value={form.email}
//                     onChange={(e) => handleChange("email", e.target.value)}
//                     placeholder='john@example.com'
//                     className={`input-field ${errors.email ? "border-danger" : ""}`}
//                   />
//                   {errors.email && (
//                     <p className='text-xs text-danger mt-1'>{errors.email}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className='block text-xs font-semibold text-foreground mb-1'>
//                     Mobile No*
//                   </label>
//                   <input
//                     type='tel'
//                     value={form.mobile}
//                     onChange={(e) => handleChange("mobile", e.target.value)}
//                     placeholder='(000) 00 00 00'
//                     className='input-field'
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className='block text-xs font-semibold text-foreground mb-1'>
//                   Address *
//                 </label>
//                 <input
//                   value={form.address}
//                   onChange={(e) => handleChange("address", e.target.value)}
//                   placeholder='123 Main St'
//                   className={`input-field ${errors.address ? "border-danger" : ""}`}
//                 />
//                 {errors.address && (
//                   <p className='text-xs text-danger mt-1'>{errors.address}</p>
//                 )}
//               </div>
//               <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
//                 <div>
//                   <label className='block text-xs font-semibold text-foreground mb-1'>
//                     City *
//                   </label>
//                   <input
//                     value={form.city}
//                     onChange={(e) => handleChange("city", e.target.value)}
//                     placeholder='New York'
//                     className={`input-field ${errors.city ? "border-danger" : ""}`}
//                   />
//                   {errors.city && (
//                     <p className='text-xs text-danger mt-1'>{errors.city}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className='block text-xs font-semibold text-foreground mb-1'>
//                     Postal Code
//                   </label>
//                   <input
//                     value={form.postalCode}
//                     onChange={(e) => handleChange("postalCode", e.target.value)}
//                     placeholder='10001'
//                     className='input-field'
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className='block text-xs font-semibold text-foreground mb-1'>
//                   Country
//                 </label>
//                 <input
//                   value={form.country}
//                   onChange={(e) => handleChange("country", e.target.value)}
//                   className='input-field'
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Payment Method */}
//           <div className='card-border bg-surface/50 p-6'>
//             <h2 className='text-lg font-bold text-foreground mb-2'>
//               Payment Method
//             </h2>
//             <p className='text-sm text-muted mb-4'>
//               You will be redirected to PayPal to complete your payment
//               securely.
//             </p>
//             <button
//               onClick={handlePayWithPaypal}
//               className='btn-gold w-full py-3 text-sm'
//             >
//               Pay with PayPal
//             </button>
//           </div>
//         </div>

//         {/* Right - Order Summary */}
//         <div className='lg:col-span-1'>
//           <div className='card-border bg-surface/50 p-5 sticky top-20'>
//             <h2 className='text-lg font-bold text-foreground'>Order Summary</h2>
//             <div className='mt-4 space-y-3'>
//               {items.map((item) => (
//                 <div
//                   key={item.productId}
//                   className='flex justify-between text-sm'
//                 >
//                   <span className='text-muted truncate mr-2'>
//                     {item.product.name} x{item.quantity}
//                   </span>
//                   <span className='text-foreground shrink-0'>
//                     ${(item.product.price * item.quantity).toFixed(2)}
//                   </span>
//                 </div>
//               ))}
//               <div className='border-t border-border pt-3 space-y-2'>
//                 <div className='flex justify-between text-sm'>
//                   <span className='text-muted'>Subtotal</span>
//                   <span className='text-foreground'>
//                     ${subtotal.toFixed(2)}
//                   </span>
//                 </div>
//                 <div className='flex justify-between text-sm'>
//                   <span className='text-muted'>Tax (10%)</span>
//                   <span className='text-foreground'>${tax.toFixed(2)}</span>
//                 </div>
//               </div>
//               <div className='border-t border-border pt-3 flex justify-between'>
//                 <span className='font-bold text-foreground'>Total</span>
//                 <span className='font-bold text-gold'>${total.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
