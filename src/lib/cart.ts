// Cart utilities using localStorage

export interface CartItem {
  productId: string;
  quantity: number;
}

const CART_KEY = "apheenx_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Dispatch custom event so Navbar can update count
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(productId: string, quantity = 1): void {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  saveCart(cart);
}

export function removeFromCart(productId: string): void {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
}

export function updateCartQuantity(
  productId: string,
  quantity: number
): void {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
  }
  saveCart(cart);
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function clearCart(): void {
  saveCart([]);
}
