/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";

export interface WishlistVideo {
  id: number;
  title: string;
  slug: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  price: string;
  thumbnail: string;
  trailer: string;
  short_description: string;
  duration_display: string;
  views_count: number;
  is_featured: boolean;
  is_unlocked: boolean;
  created_at: string;
}

const WISHLIST_KEY = "video_wishlist";

function readWishlist(): WishlistVideo[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as WishlistVideo[]) : [];
  } catch {
    return [];
  }
}

function writeWishlist(items: WishlistVideo[]): void {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

export function useVideoWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistVideo[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    setWishlistItems(readWishlist());
  }, []);

  const persist = useCallback((next: WishlistVideo[]) => {
    writeWishlist(next);
    setWishlistItems(next);
  }, []);

  /**
   * Toggles a video in the wishlist:
   * Removes it if already there, adds it if it's missing.
   */
  const toggleWishlist = useCallback(
    (video: WishlistVideo) => {
      const current = readWishlist();
      const isAlreadyInWishlist = current.some((item) => item.id === video.id);

      if (isAlreadyInWishlist) {
        const next = current.filter((item) => item.id !== video.id);
        persist(next);
      } else {
        persist([...current, video]);
      }
    },
    [persist],
  );

  /** Explicitly remove a video from wishlist */
  const removeFromWishlist = useCallback(
    (videoId: number) => {
      const next = readWishlist().filter((item) => item.id !== videoId);
      persist(next);
    },
    [persist],
  );

  /** Check if a specific video ID is in the wishlist */
  const isInWishlist = useCallback(
    (videoId: number) => wishlistItems.some((item) => item.id === videoId),
    [wishlistItems],
  );

  /** Clear all videos from the wishlist */
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
