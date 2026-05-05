/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";

// 1. Updated interface to match your exact JSON structure
export interface TWishlistProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string; // String in JSON: "15.00"
  discounted_price: number; // Number in JSON: 13.5
  price_off: string; // String in JSON: "10.00"
  stock: number;
  is_featured: boolean;
  category: number; // Added (number)
  category_name: string;
  status: string; // Added (e.g., "active")
  created_at: string;
  updated_at: string;
  images: { image: string }[];
  primary_image?: string; // Optional
}

const WISHLIST_KEY = "product_wishlist";
const WISHLIST_EVENT = "product_wishlist_updated";

function readWishlist(): TWishlistProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as TWishlistProduct[]) : [];
  } catch {
    return [];
  }
}

function writeWishlist(items: TWishlistProduct[]): void {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  // Notify other hook instances
  window.dispatchEvent(new Event(WISHLIST_EVENT));
}

export function useProductWishlist() {
  const [wishlistItems, setWishlistItems] = useState<TWishlistProduct[]>([]);

  // Hydrate and Sync
  useEffect(() => {
    setWishlistItems(readWishlist());

    const sync = () => setWishlistItems(readWishlist());
    window.addEventListener(WISHLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const persist = useCallback((next: TWishlistProduct[]) => {
    writeWishlist(next);
    setWishlistItems(next);
  }, []);

  const toggleWishlist = useCallback(
    (product: TWishlistProduct) => {
      const current = readWishlist();
      const isExist = current.find((item) => item.id === product.id);

      if (isExist) {
        persist(current.filter((item) => item.id !== product.id));
      } else {
        // Ensure we strip large unwanted fields if they exist in the source object
        const { related_products, ...cleanProduct } = product as any;
        persist([...current, cleanProduct]);
      }
    },
    [persist],
  );

  const removeFromWishlist = useCallback(
    (productId: number) => {
      persist(readWishlist().filter((item) => item.id !== productId));
    },
    [persist],
  );

  const isInWishlist = useCallback(
    (productId: number) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems],
  );

  const clearWishlist = useCallback(() => persist([]), [persist]);

  return {
    wishlistItems,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    totalWishlistItems: wishlistItems.length,
  };
}
