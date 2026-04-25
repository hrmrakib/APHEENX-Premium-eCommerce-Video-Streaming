"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCart, removeFromCart, updateCartQuantity } from "@/lib/cart";
import { getProductById } from "@/lib/data";
import type { Product } from "@/lib/data";

interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: Product;
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);

  const loadCart = useCallback(() => {
    const cartItems = getCart();
    const withProducts: CartItemWithProduct[] = [];
    cartItems.forEach((item) => {
      const product = getProductById(item.productId);
      if (product) withProducts.push({ ...item, product });
    });
    setItems(withProducts);
  }, []);

  useEffect(() => {
    loadCart();
    window.addEventListener("cart-updated", loadCart);
    return () => window.removeEventListener("cart-updated", loadCart);
  }, [loadCart]);

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    loadCart();
  };

  const handleQuantity = (productId: string, qty: number) => {
    if (qty < 1) return;
    updateCartQuantity(productId, qty);
    loadCart();
  };

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className='mx-auto container px-4 py-8 lg:px-8'>
      <h1 className='text-3xl font-bold text-gold italic'>Shopping Cart</h1>

      {items.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <svg
            className='h-20 w-20 text-border mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1'
              d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
            />
          </svg>
          <p className='text-muted text-lg'>Your cart is empty</p>
          <Link href='/shop' className='btn-gold mt-6 text-sm'>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Cart Items */}
          <div className='lg:col-span-2 space-y-4'>
            {items.map((item) => (
              <div
                key={item.productId}
                className='card-border bg-surface/50 p-4'
              >
                <div className='flex gap-4'>
                  <Link
                    href={`/shop/${item.productId}`}
                    className='flex-shrink-0'
                  >
                    <div className='relative h-20 w-20 overflow-hidden rounded-lg bg-surface'>
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className='object-cover'
                        sizes='80px'
                      />
                    </div>
                  </Link>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='font-semibold text-foreground'>
                          {item.product.name}
                        </h3>
                        {item.product.tags.includes("featured") && (
                          <span className='inline-block mt-1 rounded-md border border-gold/30 bg-gold/5 px-2 py-0.5 text-[10px] font-medium text-gold'>
                            Featured
                          </span>
                        )}
                        <p className='mt-1 text-xs text-success'>
                          {item.product.stock} In Stock
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className='p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors'
                      >
                        <svg
                          className='h-4 w-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                          />
                        </svg>
                      </button>
                    </div>
                    <div className='mt-3 flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() =>
                            handleQuantity(item.productId, item.quantity + 1)
                          }
                          className='flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors text-sm font-bold'
                        >
                          +
                        </button>
                        <span className='w-10 text-center text-sm font-medium text-foreground border border-border rounded-lg py-1'>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantity(item.productId, item.quantity - 1)
                          }
                          className='flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors text-sm font-bold'
                        >
                          −
                        </button>
                      </div>
                      <div className='text-right'>
                        <p className='text-xs text-muted'>
                          ${item.product.price.toFixed(2)} x {item.quantity}
                        </p>
                        <p className='text-lg font-bold text-gold'>
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='card-border bg-surface/50 p-5 sticky top-20'>
              <h2 className='text-lg font-bold text-foreground'>
                Order Summary
              </h2>
              <div className='mt-4 space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted'>Subtotal</span>
                  <span className='text-foreground'>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted'>Tax</span>
                  <span className='text-foreground'>${tax.toFixed(2)}</span>
                </div>
                <div className='border-t border-border pt-3 flex justify-between'>
                  <span className='font-bold text-foreground'>Total</span>
                  <span className='font-bold text-gold'>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => router.push("/checkout")}
                className='btn-gold mt-6 w-full py-3 text-sm'
              >
                Proceed to Checkout
              </button>
              <Link
                href='/shop'
                className='btn-outline-gold mt-3 block w-full py-3 text-sm text-center'
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
