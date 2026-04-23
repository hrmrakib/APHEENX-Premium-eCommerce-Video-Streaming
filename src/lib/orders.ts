// Orders & purchased videos utilities using localStorage

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  type: "product" | "video";
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
}

const ORDERS_KEY = "apheenx_orders";
const PURCHASED_VIDEOS_KEY = "apheenx_purchased_videos";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function createOrder(items: OrderItem[], total: number): Order {
  const orders = getOrders();
  const order: Order = {
    id: Date.now().toString(),
    date: new Date().toLocaleDateString("en-GB"),
    items,
    total,
  };
  orders.unshift(order);
  saveOrders(orders);

  // Track purchased videos
  const videoItems = items.filter((i) => i.type === "video");
  if (videoItems.length > 0) {
    const purchased = getPurchasedVideos();
    videoItems.forEach((v) => {
      if (!purchased.includes(v.productId)) purchased.push(v.productId);
    });
    localStorage.setItem(PURCHASED_VIDEOS_KEY, JSON.stringify(purchased));
  }

  return order;
}

export function getPurchasedVideos(): string[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(PURCHASED_VIDEOS_KEY);
  return data ? JSON.parse(data) : [];
}

export function isVideoPurchased(videoId: string): boolean {
  return getPurchasedVideos().includes(videoId);
}
