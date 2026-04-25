"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Minus, Plus } from "lucide-react";

export default function AddNewProductPage() {
  const [isFeatured, setIsFeatured] = useState(false);
  const [stock, setStock] = useState(0);

  const handleStockChange = (amount: number) => {
    setStock(prev => Math.max(0, prev + amount));
  };

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm">Back to products</span>
        </Link>
        <h1 className="text-2xl font-bold text-white mb-1">Add New Product</h1>
        <p className="text-white/60 text-sm">Create a new product for your store</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-yellow-500 font-semibold text-lg border-b border-white/5 pb-2">Product Information</h2>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Product Name<span className="text-red-500">*</span></label>
          <input type="text" placeholder="Enter product name" className="input-field" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Product Description<span className="text-red-500">*</span></label>
          <textarea 
            placeholder="Enter product description" 
            rows={4}
            className="input-field resize-none" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Price (USD)<span className="text-red-500">*</span></label>
            <input type="number" placeholder="0.00" className="input-field" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Stock Quantity<span className="text-red-500">*</span></label>
            <div className="flex items-center">
              <input 
                type="number" 
                value={stock} 
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                className="input-field rounded-r-none border-r-0" 
              />
              <div className="flex items-center border border-white/20 border-l-0 rounded-r-lg bg-[#0a0a0a] px-2 h-[46px]">
                <button 
                  type="button"
                  onClick={() => handleStockChange(-1)}
                  className="p-1 text-white/60 hover:text-white"
                >
                  <Minus size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => handleStockChange(1)}
                  className="p-1 text-white/60 hover:text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Price OFF (%)<span className="text-red-500">*</span></label>
          <input type="number" placeholder="00.0%" className="input-field max-w-[calc(50%-12px)]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Category<span className="text-red-500">*</span></label>
            <select className="input-field appearance-none bg-[#0a0a0a]">
              <option value="">Select category</option>
              <option value="accessories">Accessories</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Status<span className="text-red-500">*</span></label>
            <select className="input-field appearance-none bg-[#0a0a0a]">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-white/90">Product Images<span className="text-red-500">*</span></label>
          <div className="border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-500/50 hover:bg-white/5 transition-all">
            <Upload className="text-white/40 mb-3" size={24} />
            <p className="text-white/80 text-sm mb-1">Click to upload or drag and drop</p>
            <p className="text-white/40 text-xs">PNG, JPG, WEBP (max. 5MB each)</p>
          </div>
          
          {/* Mock image previews */}
          <div className="flex gap-4 mt-4">
             <div className="w-24 h-24 rounded-lg bg-yellow-900/40 border border-yellow-500/20 flex items-center justify-center overflow-hidden">
                <span className="text-[10px] text-yellow-500 font-bold">IMAGE 1</span>
             </div>
             <div className="w-24 h-24 rounded-lg bg-yellow-900/40 border border-yellow-500/20 flex items-center justify-center overflow-hidden">
                <span className="text-[10px] text-yellow-500 font-bold">IMAGE 2</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button 
          onClick={() => setIsFeatured(!isFeatured)}
          className={`w-12 h-6 rounded-full transition-colors relative ${isFeatured ? 'bg-yellow-500' : 'bg-white/20'}`}
        >
          <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
        <span className="text-white font-medium">Mark as Featured Product</span>
      </div>

      <div className="flex items-center gap-4 pt-6">
        <button className="btn-gold min-w-[140px]">Publish Product</button>
        <Link href="/admin/products" className="btn-outline-gold border-white/20 text-white hover:bg-white/5 min-w-[140px]">Cancel</Link>
      </div>
    </div>
  );
}
