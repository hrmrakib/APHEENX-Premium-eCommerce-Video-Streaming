"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Premium Wireless Headphone",
    category: "Accessories",
    price: 299.9,
    stock: 45,
    featured: true,
    status: "Active",
  },
  {
    id: 2,
    name: "Sunglass",
    category: "Fashion",
    price: 159.9,
    stock: 78,
    featured: false,
    status: "Active",
  },
  {
    id: 3,
    name: "Leather Wallet",
    category: "Accessories",
    price: 89.9,
    stock: 120,
    featured: true,
    status: "Active",
  },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Products</h1>
          <p className="text-white/60 text-sm">Manage your eCommerce product catalog</p>
        </div>
        <Link 
          href="/admin/products/add"
          className="btn-gold flex items-center gap-2"
        >
          <Plus size={18} />
          Add Products
        </Link>
      </div>

      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-[#111] text-white/60 text-xs border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded flex items-center justify-center border border-white/10">
                      {/* Placeholder for product image */}
                      <span className="text-[10px] text-black font-bold">IMG</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs border border-white/20 text-white/70">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">${product.price.toFixed(1)}</td>
                  <td className="px-6 py-4 text-orange-500 font-bold">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4">
                    {product.featured ? (
                      <span className="px-3 py-1 rounded-full text-xs border border-purple-500/50 text-purple-400 bg-purple-500/10">
                        Featured
                      </span>
                    ) : null}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${
                      product.status === 'Active' 
                        ? 'border-green-500/50 text-green-400 bg-green-500/10' 
                        : 'border-white/20 text-white/70 bg-white/5'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="text-white/60 hover:text-white transition-colors">
                        <Pencil size={18} />
                      </button>
                      <button className="text-red-500/80 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
