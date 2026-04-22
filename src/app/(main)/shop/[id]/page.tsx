"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import { getProductById, getRelatedProducts } from "@/lib/data";
import { addToCart } from "@/lib/cart";
import { toggleWishlist, isInWishlist } from "@/lib/wishlist";
import type { Product } from "@/lib/data";

export default function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const p = getProductById(id);
    if (p) {
      setProduct(p);
      setRelated(getRelatedProducts(id));
      setInWishlist(isInWishlist(id));
      setCurrentImage(0);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted text-lg">Product not found</p>
          <button onClick={() => router.push("/shop")} className="btn-gold mt-4 text-sm">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product.id);
    // In a real app, navigate to checkout
    alert("Redirecting to checkout...");
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist(product.id);
    setInWishlist(added);
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Product Detail */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Carousel */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-surface border border-border">
            <Image
              src={product.images[currentImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            {/* Nav arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                  aria-label="Next image"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Dots */}
          {product.images.length > 1 && (
            <div className="mt-4 flex justify-center gap-2">
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
        <div className="flex flex-col">
          {/* Category badge */}
          <span className="inline-block w-fit rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs font-medium text-gold">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>

          <h1 className="mt-3 text-2xl font-bold text-gold italic md:text-3xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-gold">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-muted line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-foreground">
              Description
            </h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Availability */}
          <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
            <span className="text-sm font-semibold text-foreground">
              Availability:
            </span>
            <span className="text-sm font-semibold text-success">
              {product.stock} In Stock
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${
                  addedToCart
                    ? "bg-success text-white"
                    : "gold-gradient text-black hover:shadow-lg hover:shadow-gold/20"
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                {addedToCart ? "Added!" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                className="btn-outline-gold flex items-center justify-center gap-2 py-3 text-sm"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                Buy Now
              </button>
            </div>
            <button
              onClick={handleToggleWishlist}
              className={`flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold transition-all ${
                inWishlist
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border text-muted hover:border-gold/30 hover:text-foreground"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill={inWishlist ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {inWishlist ? "Added to Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeader title="You may also like" href="/shop" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
