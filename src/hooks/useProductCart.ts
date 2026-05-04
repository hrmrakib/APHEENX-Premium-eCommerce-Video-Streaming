/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";

export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  discounted_price: number;
  price_off: string;
  stock: number;
  is_featured: boolean;
  category: number;
  category_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  // This matches your localStorage data exactly
  images: { image: string }[];
  // We make this optional or derived so it doesn't break the code
  primary_image?: string;
}

export interface ProductCartItem {
  product: CartProduct;
  quantity: number;
}

const CART_KEY = "product_cart";
const CART_EVENT = "product_cart_updated"; // custom sync event

function readCart(): ProductCartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as ProductCartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: ProductCartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  // Notify ALL hook instances in the same page instantly
  window.dispatchEvent(new Event(CART_EVENT));
}

export function useProductCart() {
  const [items, setItems] = useState<ProductCartItem[]>([]);

  // Hydrate on mount + re-sync whenever any instance writes
  useEffect(() => {
    setItems(readCart());

    const sync = () => setItems(readCart());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync); // cross-tab sync bonus
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const persist = useCallback((next: ProductCartItem[]) => {
    writeCart(next);
    setItems(next);
  }, []);

  const addToCart = useCallback(
    (product: CartProduct) => {
      const current = readCart();
      const existing = current.find((item) => item.product.id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) return;
        persist(
          current.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        );
      } else {
        persist([...current, { product, quantity: 1 }]);
      }
    },
    [persist],
  );

  const decreaseQuantity = useCallback(
    (productId: number) => {
      const current = readCart();
      const item = current.find((i) => i.product.id === productId);
      if (!item || item.quantity <= 1) return; // never go below 1
      persist(
        current.map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
        ),
      );
    },
    [persist],
  );

  const removeFromCart = useCallback(
    (productId: number) => {
      persist(readCart().filter((item) => item.product.id !== productId));
    },
    [persist],
  );

  const clearCart = useCallback(() => persist([]), [persist]);

  const isInCart = useCallback(
    (productId: number) => items.some((item) => item.product.id === productId),
    [items],
  );

  const getQuantity = useCallback(
    (productId: number) =>
      items.find((item) => item.product.id === productId)?.quantity ?? 0,
    [items],
  );

  const isMaxStock = useCallback(
    (productId: number) => {
      const item = items.find((i) => i.product.id === productId);
      return item ? item.quantity >= item.product.stock : false;
    },
    [items],
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items
    .reduce(
      (sum, item) => sum + item.product.discounted_price * item.quantity,
      0,
    )
    .toFixed(2);

  const totalSavings = items
    .reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.product.price) - item.product.discounted_price) *
          item.quantity,
      0,
    )
    .toFixed(2);

  return {
    items,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getQuantity,
    isMaxStock,
    totalItems,
    totalPrice,
    totalSavings,
  };
}
