"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getWishlist, removeFromWishlist } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";
import { products, videos } from "@/lib/data";
import type { Product, Video } from "@/lib/data";

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [wishlistVideos, setWishlistVideos] = useState<Video[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const loadWishlist = useCallback(() => {
    const ids = getWishlist();
    const prods = products.filter((p) => ids.includes(p.id));
    const vids = videos.filter((v) => ids.includes(`video-${v.id}`));
    setWishlistProducts(prods);
    setWishlistVideos(vids);
  }, []);

  useEffect(() => {
    loadWishlist();
    window.addEventListener("wishlist-updated", loadWishlist);
    return () => window.removeEventListener("wishlist-updated", loadWishlist);
  }, [loadWishlist]);

  const handleRemoveProduct = (id: string) => {
    removeFromWishlist(id);
    loadWishlist();
  };

  const handleRemoveVideo = (id: string) => {
    removeFromWishlist(`video-${id}`);
    loadWishlist();
  };

  const handleAddToCart = (productId: string) => {
    addToCart(productId);
    setAddedIds((prev) => new Set(prev).add(productId));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }, 2000);
  };

  const isEmpty = wishlistProducts.length === 0 && wishlistVideos.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-bold text-gold italic">My Wishlist</h1>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="h-20 w-20 text-border mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <p className="text-muted text-lg">Your wishlist is empty</p>
          <p className="text-muted/60 text-sm mt-1 mb-6">Browse products and videos to add them here</p>
          <div className="flex gap-3">
            <Link href="/shop" className="btn-gold text-sm">Browse Shop</Link>
            <Link href="/video" className="btn-outline-gold text-sm">Browse Videos</Link>
          </div>
        </div>
      ) : (
        <>
          {/* Shop Section */}
          {wishlistProducts.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-gold italic mb-4">Shop</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="overflow-hidden rounded-xl bg-surface-light border border-border">
                    <Link href={`/shop/${product.id}`}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                        {product.discount && (
                          <span className="absolute left-3 top-3 rounded-full bg-danger px-2.5 py-1 text-xs font-semibold text-white">-{product.discount}% OFF</span>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-foreground truncate">{product.name}</h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gold">${product.price.toFixed(2)}</span>
                        {product.originalPrice && <span className="text-sm text-muted line-through">${product.originalPrice.toFixed(2)}</span>}
                      </div>
                      <p className="mt-1 text-xs text-success">{product.stock} In Stock</p>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => handleAddToCart(product.id)} className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${addedIds.has(product.id) ? "bg-success text-white" : "gold-gradient text-black"}`}>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                          {addedIds.has(product.id) ? "Added!" : "Add"}
                        </button>
                        <button onClick={() => handleRemoveProduct(product.id)} className="flex items-center justify-center rounded-lg border border-danger/30 p-2.5 text-danger hover:bg-danger/10 transition-colors">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Video Section */}
          {wishlistVideos.length > 0 && (
            <section className="mt-12">
              <h2 className="text-lg font-bold text-gold italic mb-4">Video</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {wishlistVideos.map((video) => (
                  <div key={video.id} className="overflow-hidden rounded-xl bg-surface-light border border-border">
                    <Link href={`/video/${video.id}`}>
                      <div className="relative aspect-video overflow-hidden bg-surface">
                        <Image src={video.thumbnail} alt={video.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                        {video.featured && <span className="absolute left-3 top-3 rounded-md bg-gold/90 px-2.5 py-1 text-[10px] font-bold text-black">Featured</span>}
                      </div>
                    </Link>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-foreground italic truncate">{video.title}</h3>
                        <span className="text-base font-bold text-gold">${video.price.toFixed(2)}</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 rounded-lg gold-gradient py-2.5 text-sm font-semibold text-black">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                          Add
                        </button>
                        <button onClick={() => handleRemoveVideo(video.id)} className="flex items-center justify-center rounded-lg border border-danger/30 p-2.5 text-danger hover:bg-danger/10 transition-colors">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted">
                        <span>{video.duration}</span>
                        <span>{video.views.toLocaleString()} Views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
