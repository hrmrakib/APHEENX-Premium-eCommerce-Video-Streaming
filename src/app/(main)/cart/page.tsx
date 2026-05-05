"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProductCart } from "@/hooks/useProductCart";

export default function CartPage() {
  const router = useRouter();

  const {
    items,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    isMaxStock,
    totalPrice,
    totalSavings,
  } = useProductCart();

  const tax = parseFloat(totalPrice) * 0.1;
  const total = (parseFloat(totalPrice) + tax).toFixed(2);

  if (items.length === 0) {
    return (
      <div className='mx-auto container px-4 py-8 lg:px-8'>
        <h1 className='text-3xl font-bold text-gold italic'>Shopping Cart</h1>
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
      </div>
    );
  }

  return (
    <div className='mx-auto container px-4 py-8 lg:px-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gold italic'>Shopping Cart</h1>
        <button
          onClick={clearCart}
          className='text-xs text-muted hover:text-danger transition-colors'
        >
          Clear All
        </button>
      </div>

      <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Cart Items */}
        <div className='lg:col-span-2 space-y-4'>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className='card-border bg-surface/50 p-4'>
              <div className='flex gap-4'>
                {/* Thumbnail */}
                <Link href={`/shop/${product.slug}`} className='shrink-0'>
                  <div className='relative h-20 w-20 overflow-hidden rounded-lg bg-surface'>
                    <Image
                      src={product.images[0]?.image}
                      alt={product.name}
                      fill
                      unoptimized
                      className='object-cover'
                      sizes='80px'
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h3 className='font-semibold text-foreground'>
                        {product.name}
                      </h3>
                      <div className='mt-1 flex items-center gap-2'>
                        <span className='text-xs text-muted'>
                          {product.category_name}
                        </span>
                        {product.is_featured && (
                          <span className='rounded-md border border-gold/30 bg-gold/5 px-2 py-0.5 text-[10px] font-medium text-gold'>
                            Featured
                          </span>
                        )}
                      </div>
                      <p className='mt-1 text-xs text-success'>
                        {product.stock} In Stock
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className='p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors'
                      aria-label='Remove item'
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

                  {/* Stepper + Price */}
                  <div className='mt-3 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={isMaxStock(product.id)}
                        className='flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed'
                      >
                        +
                      </button>
                      <span className='w-10 text-center text-sm font-medium text-foreground border border-border rounded-lg py-1'>
                        {quantity}
                      </span>
                      <button
                        onClick={() => decreaseQuantity(product.id)}
                        className='flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors text-sm font-bold'
                      >
                        −
                      </button>
                    </div>

                    <div className='text-right'>
                      <p className='text-xs text-muted line-through'>
                        ${(parseFloat(product.price) * quantity).toFixed(2)}
                      </p>
                      <p className='text-lg font-bold text-gold'>
                        ${(product.discounted_price * quantity).toFixed(2)}
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
            <h2 className='text-lg font-bold text-foreground'>Order Summary</h2>
            <div className='mt-4 space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted'>Subtotal</span>
                <span className='text-foreground'>${totalPrice}</span>
              </div>
              {parseFloat(totalSavings) > 0 && (
                <div className='flex justify-between text-sm'>
                  <span className='text-muted'>Savings</span>
                  <span className='text-success'>−${totalSavings}</span>
                </div>
              )}
              <div className='flex justify-between text-sm'>
                <span className='text-muted'>Tax (10%)</span>
                <span className='text-foreground'>${tax.toFixed(2)}</span>
              </div>
              <div className='border-t border-border pt-3 flex justify-between'>
                <span className='font-bold text-foreground'>Total</span>
                <span className='font-bold text-gold'>${total}</span>
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
    </div>
  );
}
