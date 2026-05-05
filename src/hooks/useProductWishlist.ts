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

// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/set-state-in-effect */
// import { TProduct } from "@/types/product.types";
// import { useState, useEffect, useCallback } from "react";

// export interface WishlistProduct {
//   id: number;
//   name: string;
//   slug: string;
//   description: string;
//   price_off: string;
//   price: string;
//   discounted_price: number;
//   primary_image: string;
//   images: { image: string }[];
//   category_name: string;
//   stock: number;
//   is_featured: boolean;
// }

// export interface ProductWishlistItem {
//   product: WishlistProduct;
//   quantity: number;
// }

// // The stored product won't have the related_products array
// export type TWishlistProduct = Omit<TProduct, "related_products">;

// const WISHLIST_KEY = "product_wishlist";

// function readWishlist(): TWishlistProduct[] {
//   try {
//     const raw = localStorage.getItem(WISHLIST_KEY);
//     return raw ? (JSON.parse(raw) as TWishlistProduct[]) : [];
//   } catch {
//     return [];
//   }
// }

// function writeWishlist(items: TWishlistProduct[]): void {
//   localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
// }

// export function useProductWishlist() {
//   const [wishlistItems, setWishlistItems] = useState<TWishlistProduct[]>([]);

//   // Hydrate from localStorage on mount
//   useEffect(() => {
//     setWishlistItems(readWishlist());
//   }, []);

//   const persist = useCallback((next: TWishlistProduct[]) => {
//     writeWishlist(next);
//     setWishlistItems(next);
//   }, []);

//   /** Toggle Wishlist: Adds if missing (stripping related_products), removes if present */
//   const toggleWishlist = useCallback(
//     (product: TProduct) => {
//       const current = readWishlist();
//       const isExist = current.find((item) => item.id === product.id);

//       if (isExist) {
//         // Remove if it already exists
//         const next = current.filter((item) => item.id !== product.id);
//         persist(next);
//       } else {
//         // Add if it doesn't exist (Strip related_products here)
//         const { related_products, ...productToStore } = product as any;
//         persist([...current, productToStore]);
//       }
//     },
//     [persist],
//   );

//   /** Explicitly remove from wishlist */
//   const removeFromWishlist = useCallback(
//     (productId: number) => {
//       const next = readWishlist().filter((item) => item.id !== productId);
//       persist(next);
//     },
//     [persist],
//   );

//   /** Check if a product is in the wishlist */
//   const isInWishlist = useCallback(
//     (productId: number) => wishlistItems.some((item) => item.id === productId),
//     [wishlistItems],
//   );

//   /** Clear entire wishlist */
//   const clearWishlist = useCallback(() => {
//     persist([]);
//   }, [persist]);

//   return {
//     wishlistItems,
//     toggleWishlist,
//     removeFromWishlist,
//     isInWishlist,
//     clearWishlist,
//     totalWishlistItems: wishlistItems.length,
//   };
// }
