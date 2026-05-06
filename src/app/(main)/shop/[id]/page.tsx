/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import { useProductCart } from "@/hooks/useProductCart";
import { useProductWishlist } from "@/hooks/useProductWishlist";
import { useGetProductByIdQuery } from "@/redux/features/admin/productPAI";

const ShopDetailSkeleton = () => {
  return (
    <div className='mx-auto container px-4 py-8 lg:px-8 animate-pulse'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Image Carousel Skeleton */}
        <div>
          <div className='aspect-square rounded-xl bg-muted/20 border border-border' />
          <div className='mt-4 flex justify-center gap-2'>
            <div className='h-2 w-6 rounded-full bg-muted/20' />
            <div className='h-2 w-2 rounded-full bg-muted/20' />
            <div className='h-2 w-2 rounded-full bg-muted/20' />
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className='flex flex-col'>
          <div className='h-6 w-24 rounded-full bg-muted/20' /> {/* Badge */}
          <div className='mt-4 h-10 w-3/4 rounded-lg bg-muted/20' />{" "}
          {/* Title */}
          <div className='mt-4 h-8 w-32 rounded-lg bg-muted/20' /> {/* Price */}
          <div className='mt-8 space-y-2'>
            {" "}
            {/* Description */}
            <div className='h-4 w-24 rounded bg-muted/20' />
            <div className='h-3 w-full rounded bg-muted/20' />
            <div className='h-3 w-full rounded bg-muted/20' />
            <div className='h-3 w-2/3 rounded bg-muted/20' />
          </div>
          <div className='mt-8 h-10 w-full border-t border-border pt-4 bg-transparent'>
            <div className='h-4 w-40 rounded bg-muted/20' />
          </div>
          <div className='mt-6 space-y-3'>
            {" "}
            {/* Buttons */}
            <div className='grid grid-cols-2 gap-3'>
              <div className='h-12 rounded-lg bg-muted/20' />
              <div className='h-12 rounded-lg bg-muted/20' />
            </div>
            <div className='h-12 w-full rounded-lg bg-muted/20' />
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className='mt-16'>
        <div className='flex justify-between items-center mb-6'>
          <div className='h-8 w-48 rounded bg-muted/20' />
          <div className='h-4 w-20 rounded bg-muted/20' />
        </div>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='aspect-[3/4] rounded-xl bg-muted/20' />
          ))}
        </div>
      </div>
    </div>
  );
};

export interface Product {
  id: number;
  images: {
    image: string;
  }[];
  category_name: string;
  category: number;
  discounted_price: number;
  related_products: {
    id: number;
    name: string;
    slug: string;
    description: string;
    price_off: string | null;
    price: string;
    discounted_price: number;
    primary_image: string;
    stock: number;
    is_featured: boolean;
  }[];
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  price_off: string | null;
  status: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export default function ShopDetailPage() {
  const id = useParams().id as string;
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);

  const { addToCart, isInCart } = useProductCart();

  const {
    wishlistItems,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  } = useProductWishlist();

  const { data: productData, isLoading } = useGetProductByIdQuery(id);
  const product = productData?.data as Product;

  if (isLoading) {
    return <ShopDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className='flex items-center justify-center min-h-100'>
        <div className='text-center'>
          <p className='text-muted text-lg'>Product not found</p>
          <button
            onClick={() => router.push("/shop")}
            className='btn-gold mt-4 text-sm'
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // ✅ Derived values from actual API shape
  const price = parseFloat(product.price);
  const originalPrice = product.price_off
    ? price + parseFloat(product.price_off)
    : null;
  const related = product.related_products ?? [];

  const { related_products, ...productWithoutRelated } = product;

  const handleAddToCart = () => {
    console.log(productWithoutRelated);
    addToCart(productWithoutRelated);
  };

  const handleBuyNow = () => {
    addToCart(productWithoutRelated);
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    toggleWishlist(productWithoutRelated);
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className='mx-auto container px-4 py-8 lg:px-8'>
      {/* Product Detail */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Image Carousel */}
        <div className='relative'>
          <div className='relative aspect-square overflow-hidden rounded-xl bg-surface border border-border'>
            <Image
              src={product.images[currentImage].image}
              alt={product.name}
              fill
              unoptimized
              className='object-cover'
              sizes='(max-width: 1024px) 100vw, 50vw'
              priority
            />

            {/* Nav arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className='absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70'
                  aria-label='Previous image'
                >
                  <svg
                    className='h-5 w-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M15.75 19.5 8.25 12l7.5-7.5'
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className='absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70'
                  aria-label='Next image'
                >
                  <svg
                    className='h-5 w-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m8.25 4.5 7.5 7.5-7.5 7.5'
                    />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Dots */}
          {product.images.length > 1 && (
            <div className='mt-4 flex justify-center gap-2'>
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    i === currentImage
                      ? "bg-gold w-6"
                      : "bg-border hover:bg-muted"
                  }`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className='flex flex-col'>
          {/* Category badge */}
          <span className='inline-block w-fit rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs font-medium text-gold'>
            {product.category_name}
          </span>

          <h1 className='mt-3 text-2xl font-bold text-gold italic md:text-3xl'>
            {product.name}
          </h1>

          {/* Price */}
          <div className='mt-3 flex items-baseline gap-3'>
            <span className='text-2xl font-bold text-gold'>
              ${price.toFixed(2)} {/* ✅ parsed float */}
            </span>
            {originalPrice && (
              <span className='text-base text-muted line-through'>
                ${originalPrice.toFixed(2)} {/* ✅ derived from price_off */}
              </span>
            )}
          </div>

          {/* Description */}
          <div className='mt-6'>
            <h3 className='text-sm font-semibold text-foreground'>
              Description
            </h3>
            <p className='mt-2 text-sm text-muted leading-relaxed'>
              {product.description}
            </p>
          </div>

          {/* Availability */}
          <div className='mt-4 flex items-center gap-2 border-t border-border pt-4'>
            <span className='text-sm font-semibold text-foreground'>
              Availability:
            </span>
            <span className='text-sm font-semibold text-success'>
              {product.stock} In Stock
            </span>
          </div>

          {/* Action Buttons */}
          <div className='mt-6 space-y-3'>
            <div className='grid grid-cols-2 gap-3'>
              <button
                onClick={() => handleAddToCart()}
                className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${
                  isInCart(product?.id)
                    ? "bg-success text-white"
                    : "gold-gradient text-black hover:shadow-lg hover:shadow-gold/20"
                }`}
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
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                  />
                </svg>
                {isInCart(product?.id) ? "Added!" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                className='btn-outline-gold flex items-center justify-center gap-2 py-3 text-sm'
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
                    d='M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
                  />
                </svg>
                Buy Now
              </button>
            </div>
            <button
              onClick={handleToggleWishlist}
              className={`flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold transition-all ${
                isInWishlist(product?.id)
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border text-muted hover:border-gold/30 hover:text-foreground"
              }`}
            >
              <svg
                className='h-4 w-4'
                fill={isInWishlist(product?.id) ? "currentColor" : "none"}
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
                />
              </svg>
              {isInWishlist(product?.id)
                ? "Added to Wishlist"
                : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && ( // ✅ uses product.related_products
        <section className='mt-16'>
          <SectionHeader title='You may also like' href='/shop' />
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {related.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
