export type TProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_off: string | null;
  price: string;
  discounted_price: number;
  primary_image?: string;
  stock: number;
  is_featured: boolean;
};

export type ProductList = TProduct[];

export type TProductDetail = {
  id: number;
  images: string[];
  category_name: string;
  category: number;
  discounted_price: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  price_off: string | null;
  status: "active" | "inactive" | "draft";
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type TBestDealProduct = {
  id: number;
  images: { image: string }[];
  category_name: string;
  category: number;
  discounted_price: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  price_off: string;
  status: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

// Optional: Type for array of products
export type TBestDealProductList = TBestDealProduct[];
