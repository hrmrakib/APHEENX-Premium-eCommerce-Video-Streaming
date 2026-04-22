"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

const categories = [
  { value: "all", label: "All Products" },
  { value: "accessories", label: "Accessories" },
  { value: "fashion", label: "Fashion" },
];

const tabs = [
  { value: "featured", label: "Featured Products", icon: "✦" },
  { value: "most-buying", label: "Most Buying", icon: "↗" },
  { value: "best-deal", label: "Best Deal", icon: "%" },
];

export default function ShopPage() {
  const [category, setCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("featured");

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Filter by tab
    if (activeTab !== "all") {
      result = result.filter((p) => p.tags.includes(activeTab));
    }

    return result;
  }, [category, activeTab]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold italic">Shop</h1>
        <p className="mt-2 text-sm text-muted">
          Discover our curated collection of luxury items
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Category dropdown */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Categories
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field w-auto min-w-[180px] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23888%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m19.5%208.25-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-surface text-foreground">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
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
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="h-16 w-16 text-border mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
          <p className="text-muted text-lg">No products found</p>
          <p className="text-muted/60 text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
