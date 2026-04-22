// Wishlist utilities using localStorage

const WISHLIST_KEY = "apheenx_wishlist";

export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(WISHLIST_KEY);
  return data ? JSON.parse(data) : [];
}

function saveWishlist(list: string[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("wishlist-updated"));
}

export function addToWishlist(productId: string): void {
  const list = getWishlist();
  if (!list.includes(productId)) {
    list.push(productId);
    saveWishlist(list);
  }
}

export function removeFromWishlist(productId: string): void {
  const list = getWishlist().filter((id) => id !== productId);
  saveWishlist(list);
}

export function toggleWishlist(productId: string): boolean {
  const list = getWishlist();
  if (list.includes(productId)) {
    removeFromWishlist(productId);
    return false;
  } else {
    addToWishlist(productId);
    return true;
  }
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().includes(productId);
}

export function getWishlistCount(): number {
  return getWishlist().length;
}
