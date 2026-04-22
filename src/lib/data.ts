export interface Product {
  id: string;
  name: string;
  category: "accessories" | "fashion";
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  discount?: number;
  tags: string[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  views: number;
  duration: string;
  category: "entertainment" | "tutorial";
  tags: string[];
  featured: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Leather Watch",
    category: "accessories",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    price: 269.99,
    originalPrice: 299.99,
    stock: 140,
    images: ["/images/watch.png", "/images/watch.png", "/images/watch.png"],
    discount: 10,
    tags: ["featured", "best-deal"],
  },
  {
    id: "2",
    name: "Designer Sunglasses",
    category: "accessories",
    description:
      "A cinematic journey through the world of luxury fashion and high-end styling. Premium UV-protection lenses with modern cat-eye frame design.",
    price: 249.99,
    stock: 25,
    images: ["/images/sunglasses.png", "/images/sunglasses.png"],
    tags: ["featured", "most-buying"],
  },
  {
    id: "3",
    name: "Designer Blazer",
    category: "fashion",
    description:
      "A cinematic journey through the world of luxury fashion and high-end styling. Navy blue blazer with gold-tone buttons and premium tailoring.",
    price: 899.99,
    stock: 15,
    images: ["/images/blazer.png", "/images/blazer.png"],
    tags: ["featured", "most-buying"],
  },
  {
    id: "4",
    name: "Premium Leather Watch",
    category: "accessories",
    description:
      "A cinematic journey through the world of luxury fashion and high-end styling.",
    price: 269.99,
    originalPrice: 299.99,
    stock: 15,
    images: ["/images/watch.png"],
    discount: 10,
    tags: ["best-deal"],
  },
  {
    id: "5",
    name: "Premium Leather Watch",
    category: "accessories",
    description:
      "A cinematic journey through the world of luxury fashion and high-end styling.",
    price: 269.99,
    originalPrice: 299.99,
    stock: 15,
    images: ["/images/watch.png"],
    discount: 10,
    tags: ["best-deal"],
  },
  {
    id: "6",
    name: "Premium Leather Watch",
    category: "accessories",
    description:
      "A cinematic journey through the world of luxury fashion and high-end styling.",
    price: 269.99,
    originalPrice: 299.99,
    stock: 15,
    images: ["/images/watch.png"],
    discount: 10,
    tags: ["best-deal"],
  },
];

export const videos: Video[] = [
  {
    id: "v1",
    title: "The Covenant",
    description:
      "A cinematic journey through the world of luxury fashion and high-end styling.",
    thumbnail: "/images/video-thumb-1.png",
    price: 49.99,
    views: 16160,
    duration: "2h 15min",
    category: "entertainment",
    tags: ["featured", "most-views"],
    featured: true,
  },
  {
    id: "v2",
    title: "Computer Network",
    description:
      "A cinematic journey through the world of luxury fashion and high-end styling.",
    thumbnail: "/images/sunglasses.png",
    price: 49.99,
    views: 16160,
    duration: "2h 15min",
    category: "tutorial",
    tags: ["featured", "most-views"],
    featured: true,
  },
  {
    id: "v3",
    title: "The Covenant",
    description:
      "A cinematic journey through the world of luxury fashion and high-end styling.",
    thumbnail: "/images/video-thumb-1.png",
    price: 49.99,
    views: 16160,
    duration: "2h 15min",
    category: "entertainment",
    tags: ["most-views"],
    featured: false,
  },
  {
    id: "v4",
    title: "The Covenant",
    description:
      "A cinematic journey through the world of luxury fashion and high-end styling.",
    thumbnail: "/images/video-thumb-1.png",
    price: 49.99,
    views: 16160,
    duration: "2h 15min",
    category: "entertainment",
    tags: ["featured"],
    featured: false,
  },
  {
    id: "v5",
    title: "Computer Network",
    description:
      "A cinematic journey through the world of luxury fashion and high-end styling.",
    thumbnail: "/images/sunglasses.png",
    price: 49.99,
    views: 16160,
    duration: "2h 15min",
    category: "tutorial",
    tags: ["featured"],
    featured: true,
  },
  {
    id: "v6",
    title: "The Covenant",
    description:
      "A cinematic journey through the world of luxury fashion and high-end styling.",
    thumbnail: "/images/video-thumb-1.png",
    price: 49.99,
    views: 16160,
    duration: "2h 15min",
    category: "entertainment",
    tags: [],
    featured: false,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(currentId: string, limit = 3): Product[] {
  return products.filter((p) => p.id !== currentId).slice(0, limit);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}

export function getProductsByTag(tag: string): Product[] {
  if (tag === "all") return products;
  return products.filter((p) => p.tags.includes(tag));
}

export function getVideoById(id: string): Video | undefined {
  return videos.find((v) => v.id === id);
}

export function getRelatedVideos(currentId: string, limit = 3): Video[] {
  return videos.filter((v) => v.id !== currentId).slice(0, limit);
}
