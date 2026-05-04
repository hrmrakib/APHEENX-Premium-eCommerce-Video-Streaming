/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { TProduct } from "@/types/product.types";
import { useState, useEffect, useCallback } from "react";

export interface WishlistProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_off: string;
  price: string;
  discounted_price: number;
  primary_image: string;
  images: { image: string }[];
  category_name: string;
  stock: number;
  is_featured: boolean;
}

export interface ProductWishlistItem {
  product: WishlistProduct;
  quantity: number;
}

// The stored product won't have the related_products array
export type TWishlistProduct = Omit<TProduct, "related_products">;

const WISHLIST_KEY = "product_wishlist";

function readWishlist(): TWishlistProduct[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as TWishlistProduct[]) : [];
  } catch {
    return [];
  }
}

function writeWishlist(items: TWishlistProduct[]): void {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

export function useProductWishlist() {
  const [wishlistItems, setWishlistItems] = useState<TWishlistProduct[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setWishlistItems(readWishlist());
  }, []);

  const persist = useCallback((next: TWishlistProduct[]) => {
    writeWishlist(next);
    setWishlistItems(next);
  }, []);

  /** Toggle Wishlist: Adds if missing (stripping related_products), removes if present */
  const toggleWishlist = useCallback(
    (product: TProduct) => {
      const current = readWishlist();
      const isExist = current.find((item) => item.id === product.id);

      if (isExist) {
        // Remove if it already exists
        const next = current.filter((item) => item.id !== product.id);
        persist(next);
      } else {
        // Add if it doesn't exist (Strip related_products here)
        const { related_products, ...productToStore } = product as any;
        persist([...current, productToStore]);
      }
    },
    [persist],
  );

  /** Explicitly remove from wishlist */
  const removeFromWishlist = useCallback(
    (productId: number) => {
      const next = readWishlist().filter((item) => item.id !== productId);
      persist(next);
    },
    [persist],
  );

  /** Check if a product is in the wishlist */
  const isInWishlist = useCallback(
    (productId: number) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems],
  );

  /** Clear entire wishlist */
  const clearWishlist = useCallback(() => {
    persist([]);
  }, [persist]);

  return {
    wishlistItems,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    totalWishlistItems: wishlistItems.length,
  };
}
