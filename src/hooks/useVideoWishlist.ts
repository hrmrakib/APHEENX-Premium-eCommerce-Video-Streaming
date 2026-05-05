/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";

export interface WishlistVideo {
  id: number;
  title: string;
  slug: string;
  category: any; // Can be object or ID depending on your API
  category_name?: string;
  price: string;
  thumbnail: string;
  trailer: string;
  short_description?: string;
  description?: string;
  duration_display: string;
  views_count: number;
  is_featured: boolean;
  is_unlocked: boolean;
  created_at: string;
  updated_at?: string;
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

  useEffect(() => {
    setWishlistItems(readWishlist());
  }, []);

  const persist = useCallback((next: WishlistVideo[]) => {
    writeWishlist(next);
    setWishlistItems(next);
  }, []);

  /**
   * Toggles a video in the wishlist:
   * Strips related_videos if adding, removes if already present.
   */
  const toggleWishlist = useCallback(
    (video: any) => {
      const current = readWishlist();
      const isAlreadyInWishlist = current.some((item) => item.id === video.id);

      if (isAlreadyInWishlist) {
        // Remove logic
        const next = current.filter((item) => item.id !== video.id);
        persist(next);
      } else {
        // Add logic:
        // Destructure to extract and discard related_videos
        const { related_videos, ...mainVideoObject } = video;

        persist([...current, mainVideoObject as WishlistVideo]);
      }
    },
    [persist],
  );

  const removeFromWishlist = useCallback(
    (videoId: number) => {
      const next = readWishlist().filter((item) => item.id !== videoId);
      persist(next);
    },
    [persist],
  );

  const isInWishlist = useCallback(
    (videoId: number) => wishlistItems.some((item) => item.id === videoId),
    [wishlistItems],
  );

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
