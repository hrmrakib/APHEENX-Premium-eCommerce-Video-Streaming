"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";

import { TProduct } from "@/types/product.types";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useGetProductCategoriesQuery,
  useGetProductsQuery,
} from "@/redux/features/product/productAPI";

type TCategory = {
  id: string;
  name: string;
  slug: string;
};
const categories = [
  { value: "all", label: "All Products" },
  { value: "accessories", label: "Accessories" },
  { value: "fashion", label: "Fashion" },
];

const tabs = [
  { value: "featured", label: "Featured Products", icon: "✦" },
  { value: "most_buying", label: "Most Buying", icon: "↗" },
  { value: "price_off", label: "Best Deal", icon: "%" },
];

type FilterTab = "featured" | "price_off" | "most_buying" | null;

const tabFilters: Record<string, object> = {
  featured: { is_featured: true },
  price_off: { price_off__gt: 0 },
  most_buying: { most_buying: true },
};

export default function ShopPage() {
  const [category, setCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<FilterTab>(null);
  const [search, setSearch] = useState("");
  const searchQuery = useDebounce(search);

  const { data: productsData, isFetching } = useGetProductsQuery({
    search: searchQuery,
    ...(activeTab ? tabFilters[activeTab] : {}),
    category__slug: category === "all" ? undefined : category,
  });

  const { data: categoriesData } = useGetProductCategoriesQuery({});

  const products = productsData?.data || [];

  const categories: TCategory[] = [
    { id: "all", name: "All Products", slug: "all" },
    ...(categoriesData?.data || []),
  ];

  console.log(products);

  return (
    <div className='mx-auto container px-4 py-8 lg:px-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gold italic'>Shop</h1>
        <p className='mt-2 text-sm text-muted'>
          Discover our curated collection of luxury items
        </p>
      </div>

      {/* Filters */}
      <div className='mb-8 space-y-4'>
        <div className='flex items-center gap-6 mb-8'>
          {/* Category dropdown */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Categories
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field w-auto min-w-45 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23888%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m19.5%208.25-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')] bg-size-[16px] bg-position-[right_12px_center] bg-no-repeat pr-10"
            >
              {categories.map((cat: TCategory) => (
                <option
                  key={cat.id}
                  value={cat.slug}
                  className='bg-surface text-foreground'
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className='flex-1 ml-4 mt-6'>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search products...'
              className='input-field'
            />
          </div>
        </div>

        {/* Tab filters */}
        <div className='flex flex-wrap gap-2'>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() =>
                setActiveTab(
                  activeTab === (tab.value as FilterTab)
                    ? null
                    : (tab.value as FilterTab),
                )
              }
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.value
                  ? "gold-gradient text-black shadow-lg shadow-gold/20"
                  : "border border-border text-muted hover:border-gold/30 hover:text-foreground"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {isFetching &&
            Array.from({ length: 9 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}

          {products.map((product: TProduct) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <svg
            className='h-16 w-16 text-border mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1'
              d='M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z'
            />
          </svg>
          <p className='text-muted text-lg'>No products found</p>
          <p className='text-muted/60 text-sm mt-1'>
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
}
