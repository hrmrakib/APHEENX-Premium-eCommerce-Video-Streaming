/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Minus, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetProductByIdQuery } from "@/redux/features/admin/productPAI";

export interface ProductImage {
  image: string; // URL string
}

export interface DetailedProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: number;
  category_name: string;

  // Pricing: mixing strings and numbers as per your JSON
  price: string;
  price_off: string;
  discounted_price: number;

  // Media & Relations
  images: ProductImage[];
  related_products: DetailedProduct[] | any[];

  // Inventory & Status
  stock: number;
  status: "active" | "inactive" | string;
  is_featured: boolean;

  // Metadata
  created_at: string;
  updated_at: string;
}

export default function UpdateProductPage() {
  const id = useParams().id as string;

  // 1. Define states for all form fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    price_off: "",
    category: "",
    status: "active",
  });
  const [stock, setStock] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);

  const { data: productdata, isLoading } = useGetProductByIdQuery(id);
  const product = productdata?.data as DetailedProduct;

  // 2. Use useEffect to set values when data arrives
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        price_off: product.price_off || "",
        category: String(product.category) || "",
        status: product.status || "active",
      });
      setStock(product.stock || 0);
      setIsFeatured(product.is_featured || false);
    }
  }, [product]);

  // Handle simple input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (amount: number) => {
    setStock((prev) => Math.max(0, prev + amount));
  };

  if (isLoading)
    return <div className='p-10 text-white'>Loading product details...</div>;

  return (
    <div className='max-w-4xl space-y-8 pb-10'>
      <div>
        <Link
          href='/admin/products'
          className='inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors'
        >
          <ArrowLeft size={16} />
          <span className='text-sm'>Back to products</span>
        </Link>
        <h1 className='text-2xl font-bold text-white mb-1'>Update Product</h1>
        <p className='text-white/60 text-sm'>
          Editing: <span className='text-yellow-500'>{product?.name}</span>
        </p>
      </div>

      <div className='space-y-6'>
        <h2 className='text-yellow-500 font-semibold text-lg border-b border-white/5 pb-2'>
          Product Information
        </h2>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-white/90'>
            Product Name*
          </label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Enter product name'
            className='input-field'
          />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-white/90'>
            Product Description*
          </label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='Enter product description'
            rows={4}
            className='input-field resize-none'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Price (USD)*
            </label>
            <input
              type='number'
              name='price'
              value={formData.price}
              onChange={handleChange}
              placeholder='0.00'
              className='input-field'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Stock Quantity*
            </label>
            <div className='flex items-center'>
              <input
                type='number'
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                className='input-field rounded-r-none border-r-0'
              />
              <div className='flex items-center border border-white/20 border-l-0 rounded-r-lg bg-[#0a0a0a] px-2 h-[46px]'>
                <button
                  type='button'
                  onClick={() => handleStockChange(-1)}
                  className='p-1 text-white/60 hover:text-white'
                >
                  <Minus size={16} />
                </button>
                <button
                  type='button'
                  onClick={() => handleStockChange(1)}
                  className='p-1 text-white/60 hover:text-white'
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Price OFF (%)*
            </label>
            <input
              type='number'
              name='price_off'
              value={formData.price_off}
              onChange={handleChange}
              placeholder='00.0%'
              className='input-field'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Category*
            </label>
            <select
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='input-field appearance-none bg-[#0a0a0a]'
            >
              <option value=''>Select category</option>
              <option value='1'>Accessories</option>{" "}
              {/* Use IDs based on your data */}
              <option value='2'>Fashion</option>
              <option value='3'>Electronics</option>
            </select>
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-white/90'>Status*</label>
          <select
            name='status'
            value={formData.status}
            onChange={handleChange}
            className='input-field appearance-none bg-[#0a0a0a]'
          >
            <option value='inactive'>Inactive / Draft</option>
            <option value='active'>Active</option>
          </select>
        </div>

        {/* Images section */}
        <div className='space-y-4'>
          <label className='text-sm font-medium text-white/90'>
            Product Images*
          </label>
          <div className='border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer'>
            <Upload className='text-white/40 mb-3' size={24} />
            <p className='text-white/80 text-sm mb-1'>Upload New Images</p>
          </div>

          <div className='flex gap-4 mt-4'>
            {product?.images?.map((img, idx) => (
              <div
                key={idx}
                className='w-24 h-24 rounded-lg border border-white/10 overflow-hidden'
              >
                <img
                  src={img.image}
                  alt='preview'
                  className='w-full h-full object-cover'
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex items-center gap-3 pt-4'>
        <button
          onClick={() => setIsFeatured(!isFeatured)}
          className={`w-12 h-6 rounded-full transition-colors relative ${isFeatured ? "bg-yellow-500" : "bg-white/20"}`}
        >
          <span
            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? "translate-x-6" : "translate-x-0"}`}
          />
        </button>
        <span className='text-white font-medium'>Mark as Featured Product</span>
      </div>

      <div className='flex items-center gap-4 pt-6'>
        <button className='bg-[#D4A843] hover:bg-[#B8922F] text-black px-6 py-2.5 rounded-lg font-bold min-w-[140px]'>
          Update Product
        </button>
        <Link
          href='/admin/products'
          className='border border-white/20 text-white hover:bg-white/5 px-6 py-2.5 rounded-lg text-center min-w-[140px]'
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { ArrowLeft, Upload, Minus, Plus } from "lucide-react";
// import { useParams } from "next/navigation";
// import { useGetProductByIdQuery } from "@/redux/features/admin/productPAI";

// export interface ProductImage {
//   image: string; // URL string
// }

// export interface DetailedProduct {
//   id: number;
//   name: string;
//   slug: string;
//   description: string;
//   category: number;
//   category_name: string;

//   // Pricing: mixing strings and numbers as per your JSON
//   price: string;
//   price_off: string;
//   discounted_price: number;

//   // Media & Relations
//   images: ProductImage[];
//   related_products: DetailedProduct[] | any[];

//   // Inventory & Status
//   stock: number;
//   status: "active" | "inactive" | string;
//   is_featured: boolean;

//   // Metadata
//   created_at: string;
//   updated_at: string;
// }

// export default function UpdateProductPage() {
//   const id = useParams().id as string;
//   const [isFeatured, setIsFeatured] = useState(false);
//   const [stock, setStock] = useState(0);

//   const { data: productdata } = useGetProductByIdQuery(id);

//   const product = productdata?.data as DetailedProduct;

//   const handleStockChange = (amount: number) => {
//     setStock((prev) => Math.max(0, prev + amount));
//   };

//   return (
//     <div className='max-w-4xl space-y-8 pb-10'>
//       <div>
//         <Link
//           href='/admin/products'
//           className='inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors'
//         >
//           <ArrowLeft size={16} />
//           <span className='text-sm'>Back to products</span>
//         </Link>
//         <h1 className='text-2xl font-bold text-white mb-1'>Add New Product</h1>
//         <p className='text-white/60 text-sm'>
//           Create a new product for your store
//         </p>
//       </div>

//       <div className='space-y-6'>
//         <h2 className='text-yellow-500 font-semibold text-lg border-b border-white/5 pb-2'>
//           Product Information
//         </h2>

//         <div className='space-y-2'>
//           <label className='text-sm font-medium text-white/90'>
//             Product Name<span className='text-red-500'>*</span>
//           </label>
//           <input
//             type='text'
//             placeholder='Enter product name'
//             className='input-field'
//           />
//         </div>

//         <div className='space-y-2'>
//           <label className='text-sm font-medium text-white/90'>
//             Product Description<span className='text-red-500'>*</span>
//           </label>
//           <textarea
//             placeholder='Enter product description'
//             rows={4}
//             className='input-field resize-none'
//           />
//         </div>

//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           <div className='space-y-2'>
//             <label className='text-sm font-medium text-white/90'>
//               Price (USD)<span className='text-red-500'>*</span>
//             </label>
//             <input type='number' placeholder='0.00' className='input-field' />
//           </div>

//           <div className='space-y-2'>
//             <label className='text-sm font-medium text-white/90'>
//               Stock Quantity<span className='text-red-500'>*</span>
//             </label>
//             <div className='flex items-center'>
//               <input
//                 type='number'
//                 value={stock}
//                 onChange={(e) => setStock(parseInt(e.target.value) || 0)}
//                 className='input-field rounded-r-none border-r-0'
//               />
//               <div className='flex items-center border border-white/20 border-l-0 rounded-r-lg bg-[#0a0a0a] px-2 h-[46px]'>
//                 <button
//                   type='button'
//                   onClick={() => handleStockChange(-1)}
//                   className='p-1 text-white/60 hover:text-white'
//                 >
//                   <Minus size={16} />
//                 </button>
//                 <button
//                   type='button'
//                   onClick={() => handleStockChange(1)}
//                   className='p-1 text-white/60 hover:text-white'
//                 >
//                   <Plus size={16} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className='space-y-2'>
//           <label className='text-sm font-medium text-white/90'>
//             Price OFF (%)<span className='text-red-500'>*</span>
//           </label>
//           <input
//             type='number'
//             placeholder='00.0%'
//             className='input-field max-w-[calc(50%-12px)]'
//           />
//         </div>

//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           <div className='space-y-2'>
//             <label className='text-sm font-medium text-white/90'>
//               Category<span className='text-red-500'>*</span>
//             </label>
//             <select className='input-field appearance-none bg-[#0a0a0a]'>
//               <option value=''>Select category</option>
//               <option value='accessories'>Accessories</option>
//               <option value='fashion'>Fashion</option>
//               <option value='electronics'>Electronics</option>
//             </select>
//           </div>

//           <div className='space-y-2'>
//             <label className='text-sm font-medium text-white/90'>
//               Status<span className='text-red-500'>*</span>
//             </label>
//             <select className='input-field appearance-none bg-[#0a0a0a]'>
//               <option value='draft'>Draft</option>
//               <option value='active'>Active</option>
//             </select>
//           </div>
//         </div>

//         <div className='space-y-4'>
//           <label className='text-sm font-medium text-white/90'>
//             Product Images<span className='text-red-500'>*</span>
//           </label>
//           <div className='border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-500/50 hover:bg-white/5 transition-all'>
//             <Upload className='text-white/40 mb-3' size={24} />
//             <p className='text-white/80 text-sm mb-1'>
//               Click to upload or drag and drop
//             </p>
//             <p className='text-white/40 text-xs'>
//               PNG, JPG, WEBP (max. 5MB each)
//             </p>
//           </div>

//           {/* Mock image previews */}
//           <div className='flex gap-4 mt-4'>
//             <div className='w-24 h-24 rounded-lg bg-yellow-900/40 border border-yellow-500/20 flex items-center justify-center overflow-hidden'>
//               <span className='text-[10px] text-yellow-500 font-bold'>
//                 IMAGE 1
//               </span>
//             </div>
//             <div className='w-24 h-24 rounded-lg bg-yellow-900/40 border border-yellow-500/20 flex items-center justify-center overflow-hidden'>
//               <span className='text-[10px] text-yellow-500 font-bold'>
//                 IMAGE 2
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className='flex items-center gap-3 pt-4'>
//         <button
//           onClick={() => setIsFeatured(!isFeatured)}
//           className={`w-12 h-6 rounded-full transition-colors relative ${isFeatured ? "bg-yellow-500" : "bg-white/20"}`}
//         >
//           <span
//             className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? "translate-x-6" : "translate-x-0"}`}
//           />
//         </button>
//         <span className='text-white font-medium'>Mark as Featured Product</span>
//       </div>

//       <div className='flex items-center gap-4 pt-6'>
//         <button className='btn-gold min-w-[140px]'>Publish Product</button>
//         <Link
//           href='/admin/products'
//           className='btn-outline-gold border-white/20 text-white hover:bg-white/5 min-w-[140px]'
//         >
//           Cancel
//         </Link>
//       </div>
//     </div>
//   );
// }
