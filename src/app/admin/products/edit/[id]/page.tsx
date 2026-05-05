/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import { Upload, Minus, Plus, X, Loader2 } from "lucide-react";
import {
  useAddProductImageMutation,
  useCreateProductCategoryMutation,
  useCreateProductMutation,
  useDeleteProductImageMutation,
} from "@/redux/features/admin/productPAI";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetProductByIdQuery } from "@/redux/features/product/productAPI";

export interface ProductImage {
  id: number; // Added ID for deletion
  image: string;
}

export interface DetailedProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: number;
  category_name: string;
  price: string;
  price_off: string;
  discounted_price: number;
  images: ProductImage[];
  related_products: DetailedProduct[] | any[];
  stock: number;
  status: "active" | "inactive" | string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface IFormData {
  name: string;
  description: string;
  price: string;
  price_off: string;
  category: string | number;
  customCategory?: string;
  status: "active" | "draft";
}

export default function AddNewProductPage() {
  const id = useParams().id as string;
  const router = useRouter();

  // Mutations
  const [createProduct, { isLoading: createProductLoading }] =
    useCreateProductMutation();
  const [createProductCategoryMutation] = useCreateProductCategoryMutation();
  const [addProductImage] = useAddProductImageMutation();
  const [deleteProductImage] = useDeleteProductImageMutation();

  // Queries
  const { data: productdata, isLoading: isFetchingProduct } =
    useGetProductByIdQuery(id, {
      skip: !id,
    });

  const product = productdata?.data as DetailedProduct;

  // States
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    description: "",
    price: "",
    price_off: "",
    category: "",
    customCategory: "",
    status: "active",
  });

  const [stock, setStock] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // For NEW uploads
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]); // For EXISTING display

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        price_off: product.price_off || "",
        category: String(product.category) || "",
        status: (product.status as any) || "active",
      });
      setStock(product.stock || 0);
      setIsFeatured(product.is_featured || false);
      setExistingImages(product.images || []);
    }
  }, [product]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (amount: number) => {
    setStock((prev) => Math.max(0, prev + amount));
  };

  // IMAGE LOGIC
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // If we are editing an existing product, upload immediately
      if (id) {
        for (const file of filesArray) {
          const imgData = new FormData();
          imgData.append("images", file);

          try {
            await addProductImage({
              productId: id,
              imageData: imgData,
            }).unwrap();
            toast.success("Image uploaded");
          } catch (err) {
            toast.error("Failed to upload image");
          }
        }
      } else {
        // If creating new, just store in state
        setSelectedFiles((prev) => [...prev, ...filesArray]);
      }
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExisting = async (imageId: number) => {
    if (!id) return;
    try {
      await deleteProductImage({ productId: id, imageId }).unwrap();
      toast.success("Image deleted");
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  const handlePublish = async () => {
    try {
      let finalCategoryId = formData.category;

      if (formData.category === "custom" && formData.customCategory) {
        const categoryRes = await createProductCategoryMutation({
          name: formData.customCategory,
        }).unwrap();
        finalCategoryId = categoryRes.id || categoryRes.data?.id;
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("price_off", formData.price_off);
      data.append("category", String(finalCategoryId));
      data.append("stock", stock.toString());
      data.append("status", formData.status);
      data.append("is_featured", String(isFeatured));

      // Append files only if creating new (Edit mode uses addProductImageMutation)
      if (!id) {
        selectedFiles.forEach((file) => data.append("images", file));
      }

      await createProduct(data).unwrap();
      toast.success(id ? "Product updated!" : "Product created!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  if (id && isFetchingProduct)
    return (
      <div className='flex justify-center p-10'>
        <Loader2 className='animate-spin text-yellow-500' />
      </div>
    );

  return (
    <div className='max-w-4xl space-y-8 pb-10'>
      <div className='space-y-6'>
        <h2 className='text-yellow-500 font-semibold text-lg border-b border-white/5 pb-2'>
          {id ? "Edit Product" : "Product Information"}
        </h2>

        {/* Name */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-white/90'>
            Product Name*
          </label>
          <input
            name='name'
            value={formData.name}
            onChange={handleChange}
            type='text'
            className='input-field'
          />
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-white/90'>
            Product Description*
          </label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className='input-field resize-none'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Price */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Price (USD)*
            </label>
            <input
              name='price'
              value={formData.price}
              onChange={handleChange}
              type='number'
              className='input-field'
            />
          </div>

          {/* Stock */}
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
              <div className='flex items-center border border-white/20 border-l-0 rounded-r-lg bg-background px-2 h-11.5'>
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
          {/* Category */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>
              Category*
            </label>
            <select
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='input-field appearance-none bg-background text-white'
            >
              <option value=''>Select category</option>
              <option value='1'>Accessories</option>
              <option value='custom' className='text-yellow-500'>
                + Add New Category
              </option>
            </select>
          </div>

          {/* Status */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/90'>Status*</label>
            <select
              name='status'
              value={formData.status}
              onChange={handleChange}
              className='input-field bg-background text-white'
            >
              <option value='active'>Active</option>
              <option value='draft'>Draft</option>
            </select>
          </div>
        </div>

        {/* Custom Category Input */}
        {formData.category === "custom" && (
          <input
            name='customCategory'
            value={formData.customCategory}
            onChange={handleChange}
            type='text'
            placeholder='New Category Name'
            className='input-field border-yellow-500/30'
          />
        )}

        {/* Image Section */}
        <div className='space-y-4'>
          <label className='text-sm font-medium text-white/90'>
            Product Images*
          </label>
          <input
            type='file'
            id='file-upload'
            className='hidden'
            accept='image/*'
            multiple
            onChange={handleImageChange}
          />
          <label
            htmlFor='file-upload'
            className='border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-500/50 hover:bg-white/5 transition-all'
          >
            <Upload className='text-white/40 mb-3' size={24} />
            <p className='text-white/80 text-sm'>Click to upload images</p>
          </label>

          <div className='flex flex-wrap gap-4 mt-4'>
            {/* 1. Render Existing Images (from API) */}
            {existingImages.map((img) => (
              <div key={img.id} className='relative group w-24 h-24'>
                <div className='w-full h-full rounded-lg bg-yellow-900/40 border border-yellow-500/20 overflow-hidden'>
                  <img
                    src={img.image}
                    alt='product'
                    className='object-cover w-full h-full'
                  />
                </div>
                <button
                  onClick={() => handleDeleteExisting(img.id)}
                  className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* 2. Render Selected Files (not yet uploaded) */}
            {selectedFiles.map((file, index) => (
              <div key={index} className='relative group w-24 h-24'>
                <div className='w-full h-full rounded-lg bg-blue-900/40 border border-blue-500/20 overflow-hidden'>
                  <img
                    src={URL.createObjectURL(file)}
                    alt='preview'
                    className='object-cover w-full h-full'
                  />
                </div>
                <button
                  onClick={() => removeSelectedFile(index)}
                  className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured */}
      <div className='flex items-center gap-3 pt-4'>
        <button
          onClick={() => setIsFeatured(!isFeatured)}
          className={`w-12 h-6 rounded-full transition-colors relative ${isFeatured ? "bg-yellow-500" : "bg-white/20"}`}
        >
          <span
            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? "translate-x-6" : "translate-x-0"}`}
          />
        </button>
        <span className='text-white font-medium'>Mark as Featured</span>
      </div>

      <div className='flex items-center gap-4 pt-6'>
        <button
          onClick={handlePublish}
          disabled={createProductLoading}
          className='btn-gold min-w-35 disabled:opacity-50'
        >
          {createProductLoading
            ? "Saving..."
            : id
              ? "Update Product"
              : "Publish Product"}
        </button>
        <Link
          href='/admin/products'
          className='btn-outline-gold border-white/20 text-white hover:bg-white/5 min-w-35'
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}

// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-img-element */
// "use client";

// import { useState, ChangeEvent, useEffect } from "react";
// import Link from "next/link";
// import { Upload, Minus, Plus, X } from "lucide-react";
// import {
//   useAddProductImageMutation,
//   useCreateProductCategoryMutation,
//   useCreateProductMutation,
//   useDeleteProductImageMutation,
// } from "@/redux/features/admin/productPAI";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { useGetProductByIdQuery } from "@/redux/features/product/productAPI";

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

// export interface IFormData {
//   name: string;
//   description: string;
//   price: string;
//   price_off: string;
//   category: string | number;
//   customCategory?: string;
//   status: "active" | "draft";
// }

// export default function AddNewProductPage() {
//   const id = useParams().id as string;
//   const router = useRouter();
//   const [createProduct, { isLoading: createProductLoading }] =
//     useCreateProductMutation();
//   const [createProductCategoryMutation] = useCreateProductCategoryMutation();

//   // 1. Unified State for Text Fields
//   const [formData, setFormData] = useState<IFormData>({
//     name: "",
//     description: "",
//     price: "",
//     price_off: "",
//     category: "", // Ensure this receives a PK (ID) as a string/number
//     customCategory: "",
//     status: "active",
//   });

//   const [stock, setStock] = useState(0);
//   const [isFeatured, setIsFeatured] = useState(false);
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);

//   const [addProductImageMutation] = useAddProductImageMutation();
//   const [deleteProductImageMutation] = useDeleteProductImageMutation();
//   const { data: productdata, isLoading } = useGetProductByIdQuery(id);

//   const product = productdata?.data as DetailedProduct;

//   // 2. Use useEffect to set values when data arrives
//   useEffect(() => {
//     if (product) {
//       setFormData({
//         name: product.name || "",
//         description: product.description || "",
//         price: product.price || "",
//         price_off: product.price_off || "",
//         category: String(product.category) || "",
//         status: product.status || "active",
//       });
//       setStock(product.stock || 0);
//       setIsFeatured(product.is_featured || false);
//     }
//   }, [product]);

//   // Handle Text/Select Changes
//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleStockChange = (amount: number) => {
//     setStock((prev) => Math.max(0, prev + amount));
//   };

//   // 2. Image Selection Logic
//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const filesArray = Array.from(e.target.files);
//       setSelectedImages((prev) => [...prev, ...filesArray]);
//     }
//   };

//   const removeImage = (index: number) => {
//     setSelectedImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   // 3. Create Product Function
//   const handlePublish = async () => {
//     try {
//       let finalCategoryId = formData.category;

//       // 1. If user chose 'custom', create the category first
//       if (formData.category === "custom" && formData.customCategory) {
//         const categoryRes = await createProductCategoryMutation({
//           name: formData.customCategory,
//         }).unwrap();

//         // Use the ID returned from the API response
//         // Adjust 'categoryRes.id' or 'categoryRes.data.id' based on your API structure
//         finalCategoryId = categoryRes.id || categoryRes.data?.id;
//       }

//       if (!finalCategoryId) {
//         toast.error("Please select or create a category");
//         return;
//       }

//       // 2. Prepare FormData with the correct Category ID
//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("description", formData.description);
//       data.append("price", formData.price);
//       data.append("price_off", formData.price_off);
//       data.append("category", String(finalCategoryId));
//       data.append("stock", stock.toString());
//       data.append("status", formData.status);
//       data.append("is_featured", String(isFeatured));

//       selectedImages.forEach((file) => {
//         data.append("images", file);
//       });

//       // 3. Create the Product
//       await createProduct(data).unwrap();
//       toast.success("Product created successfully!");
//       router.push("/admin/products");
//     } catch (err: any) {
//       console.error("Failed to create product:", err);
//       toast.error(err?.data?.message || "Error: Check console for details.");
//     }
//   };

//   return (
//     <div className='max-w-4xl space-y-8 pb-10'>
//       <div className='space-y-6'>
//         <h2 className='text-yellow-500 font-semibold text-lg border-b border-white/5 pb-2'>
//           Product Information
//         </h2>

//         <div className='space-y-2'>
//           <label className='text-sm font-medium text-white/90'>
//             Product Name*
//           </label>
//           <input
//             name='name'
//             value={formData.name}
//             onChange={handleChange}
//             type='text'
//             placeholder='Enter product name'
//             className='input-field'
//           />
//         </div>

//         <div className='space-y-2'>
//           <label className='text-sm font-medium text-white/90'>
//             Product Description*
//           </label>
//           <textarea
//             name='description'
//             value={formData.description}
//             onChange={handleChange}
//             placeholder='Enter product description'
//             rows={4}
//             className='input-field resize-none'
//           />
//         </div>

//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           <div className='space-y-2'>
//             <label className='text-sm font-medium text-white/90'>
//               Price (USD)*
//             </label>
//             <input
//               name='price'
//               value={formData.price}
//               onChange={handleChange}
//               type='number'
//               placeholder='0.00'
//               className='input-field'
//             />
//           </div>

//           <div className='space-y-2'>
//             <label className='text-sm font-medium text-white/90'>
//               Stock Quantity*
//             </label>
//             <div className='flex items-center'>
//               <input
//                 type='number'
//                 value={stock}
//                 onChange={(e) => setStock(parseInt(e.target.value) || 0)}
//                 className='input-field rounded-r-none border-r-0'
//               />
//               <div className='flex items-center border border-white/20 border-l-0 rounded-r-lg bg-background px-2 h-11.5'>
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
//             Price OFF (%)*
//           </label>
//           <input
//             name='price_off'
//             value={formData.price_off}
//             onChange={handleChange}
//             type='number'
//             placeholder='0'
//             className='input-field max-w-[calc(50%-12px)]'
//           />
//         </div>

//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           <div className='space-y-2'>
//             <label className='text-sm font-medium text-black/90'>
//               Category*
//             </label>
//             <select
//               name='category'
//               value={formData.category}
//               onChange={handleChange}
//               className='input-field appearance-none bg-background text-black'
//             >
//               <option value='' className='bg-background text-white'>
//                 Select category
//               </option>
//               <option value='1' className='bg-background text-white'>
//                 Accessories
//               </option>
//               <option value='2' className='bg-background text-white'>
//                 Fashion
//               </option>
//               <option
//                 value='custom'
//                 className='bg-background text-yellow-500 font-bold'
//               >
//                 + Add New Category
//               </option>
//             </select>
//           </div>

//           <div className='space-y-2'>
//             <label className='text-sm font-medium text-white/90'>Status*</label>
//             <div className='relative'>
//               <select
//                 name='status'
//                 value={formData.status}
//                 onChange={handleChange}
//                 className='w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-yellow-500/50 appearance-none'
//               >
//                 <option value='active' className='bg-background text-white'>
//                   Active
//                 </option>
//                 <option value='draft' className='bg-background text-white'>
//                   Draft
//                 </option>
//               </select>

//               {/* Custom Arrow Icon because appearance-none hides the default one */}
//               <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/40'>
//                 <svg className='h-4 w-4 fill-current' viewBox='0 0 20 20'>
//                   <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {formData.category === "custom" && (
//             <div className='space-y-2 animate-in fade-in slide-in-from-top-2 duration-300'>
//               <label className='text-sm font-medium text-yellow-500'>
//                 New Category Name*
//               </label>
//               <input
//                 name='customCategory'
//                 value={formData.customCategory}
//                 onChange={handleChange}
//                 type='text'
//                 placeholder='Type your new category name'
//                 className='input-field border-yellow-500/30 focus:border-yellow-500'
//               />
//             </div>
//           )}
//         </div>

//         {/* Image Upload Input */}
//         <div className='space-y-4'>
//           <label className='text-sm font-medium text-white/90'>
//             Product Images*
//           </label>

//           <input
//             type='file'
//             id='file-upload'
//             className='hidden'
//             accept='image/*'
//             multiple // 5. Added multiple attribute
//             onChange={handleImageChange}
//           />

//           <label
//             htmlFor='file-upload'
//             className='border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-500/50 hover:bg-white/5 transition-all'
//           >
//             <Upload className='text-white/40 mb-3' size={24} />
//             <p className='text-white/80 text-sm mb-1'>
//               Click to upload multiple images
//             </p>
//           </label>

//           {/* 6. Image Preview Grid */}
//           {selectedImages.length > 0 && (
//             <div className='flex flex-wrap gap-4 mt-4'>
//               {selectedImages.map((file, index) => (
//                 <div key={index} className='relative group w-24 h-24'>
//                   <div className='w-full h-full rounded-lg bg-yellow-900/40 border border-yellow-500/20 flex items-center justify-center overflow-hidden'>
//                     <img
//                       src={URL.createObjectURL(file)}
//                       alt='preview'
//                       className='object-cover w-full h-full'
//                     />
//                   </div>
//                   <button
//                     onClick={() => removeImage(index)}
//                     className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
//                   >
//                     <X size={12} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
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
//         <button
//           onClick={handlePublish}
//           disabled={isLoading}
//           className='btn-gold min-w-35 disabled:opacity-50'
//         >
//           {isLoading ? "Publishing..." : "Publish Product"}
//         </button>
//         <Link
//           href='/admin/products'
//           className='btn-outline-gold border-white/20 text-white hover:bg-white/5 min-w-35'
//         >
//           Cancel
//         </Link>
//       </div>
//     </div>
//   );
// }

// // /* eslint-disable react-hooks/set-state-in-effect */
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // "use client";

// // import { useState, useEffect } from "react";
// // import Link from "next/link";
// // import { ArrowLeft, Upload, Minus, Plus } from "lucide-react";
// // import { useParams } from "next/navigation";
// // import { useGetProductByIdQuery } from "@/redux/features/admin/productPAI";

// // export interface ProductImage {
// //   image: string; // URL string
// // }

// // export interface DetailedProduct {
// //   id: number;
// //   name: string;
// //   slug: string;
// //   description: string;
// //   category: number;
// //   category_name: string;

// //   // Pricing: mixing strings and numbers as per your JSON
// //   price: string;
// //   price_off: string;
// //   discounted_price: number;

// //   // Media & Relations
// //   images: ProductImage[];
// //   related_products: DetailedProduct[] | any[];

// //   // Inventory & Status
// //   stock: number;
// //   status: "active" | "inactive" | string;
// //   is_featured: boolean;

// //   // Metadata
// //   created_at: string;
// //   updated_at: string;
// // }

// // export default function UpdateProductPage() {
// //   const id = useParams().id as string;

// //   // 1. Define states for all form fields
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     description: "",
// //     price: "",
// //     price_off: "",
// //     category: "",
// //     status: "active",
// //   });
// //   const [stock, setStock] = useState(0);
// //   const [isFeatured, setIsFeatured] = useState(false);

// //   const { data: productdata, isLoading } = useGetProductByIdQuery(id);
// //   const product = productdata?.data as DetailedProduct;

// //   // 2. Use useEffect to set values when data arrives
// //   useEffect(() => {
// //     if (product) {
// //       setFormData({
// //         name: product.name || "",
// //         description: product.description || "",
// //         price: product.price || "",
// //         price_off: product.price_off || "",
// //         category: String(product.category) || "",
// //         status: product.status || "active",
// //       });
// //       setStock(product.stock || 0);
// //       setIsFeatured(product.is_featured || false);
// //     }
// //   }, [product]);

// //   // Handle simple input changes
// //   const handleChange = (
// //     e: React.ChangeEvent<
// //       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
// //     >,
// //   ) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleStockChange = (amount: number) => {
// //     setStock((prev) => Math.max(0, prev + amount));
// //   };

// //   if (isLoading)
// //     return <div className='p-10 text-white'>Loading product details...</div>;

// //   return (
// //     <div className='max-w-4xl space-y-8 pb-10'>
// //       <div>
// //         <Link
// //           href='/admin/products'
// //           className='inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors'
// //         >
// //           <ArrowLeft size={16} />
// //           <span className='text-sm'>Back to products</span>
// //         </Link>
// //         <h1 className='text-2xl font-bold text-white mb-1'>Update Product</h1>
// //         <p className='text-white/60 text-sm'>
// //           Editing: <span className='text-yellow-500'>{product?.name}</span>
// //         </p>
// //       </div>

// //       <div className='space-y-6'>
// //         <h2 className='text-yellow-500 font-semibold text-lg border-b border-white/5 pb-2'>
// //           Product Information
// //         </h2>

// //         <div className='space-y-2'>
// //           <label className='text-sm font-medium text-white/90'>
// //             Product Name*
// //           </label>
// //           <input
// //             type='text'
// //             name='name'
// //             value={formData.name}
// //             onChange={handleChange}
// //             placeholder='Enter product name'
// //             className='input-field'
// //           />
// //         </div>

// //         <div className='space-y-2'>
// //           <label className='text-sm font-medium text-white/90'>
// //             Product Description*
// //           </label>
// //           <textarea
// //             name='description'
// //             value={formData.description}
// //             onChange={handleChange}
// //             placeholder='Enter product description'
// //             rows={4}
// //             className='input-field resize-none'
// //           />
// //         </div>

// //         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
// //           <div className='space-y-2'>
// //             <label className='text-sm font-medium text-white/90'>
// //               Price (USD)*
// //             </label>
// //             <input
// //               type='number'
// //               name='price'
// //               value={formData.price}
// //               onChange={handleChange}
// //               placeholder='0.00'
// //               className='input-field'
// //             />
// //           </div>

// //           <div className='space-y-2'>
// //             <label className='text-sm font-medium text-white/90'>
// //               Stock Quantity*
// //             </label>
// //             <div className='flex items-center'>
// //               <input
// //                 type='number'
// //                 value={stock}
// //                 onChange={(e) => setStock(parseInt(e.target.value) || 0)}
// //                 className='input-field rounded-r-none border-r-0'
// //               />
// //               <div className='flex items-center border border-white/20 border-l-0 rounded-r-lg bg-[#0a0a0a] px-2 h-[46px]'>
// //                 <button
// //                   type='button'
// //                   onClick={() => handleStockChange(-1)}
// //                   className='p-1 text-white/60 hover:text-white'
// //                 >
// //                   <Minus size={16} />
// //                 </button>
// //                 <button
// //                   type='button'
// //                   onClick={() => handleStockChange(1)}
// //                   className='p-1 text-white/60 hover:text-white'
// //                 >
// //                   <Plus size={16} />
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
// //           <div className='space-y-2'>
// //             <label className='text-sm font-medium text-white/90'>
// //               Price OFF (%)*
// //             </label>
// //             <input
// //               type='number'
// //               name='price_off'
// //               value={formData.price_off}
// //               onChange={handleChange}
// //               placeholder='00.0%'
// //               className='input-field'
// //             />
// //           </div>

// //           <div className='space-y-2'>
// //             <label className='text-sm font-medium text-white/90'>
// //               Category*
// //             </label>
// //             <select
// //               name='category'
// //               value={formData.category}
// //               onChange={handleChange}
// //               className='input-field appearance-none bg-[#0a0a0a]'
// //             >
// //               <option value=''>Select category</option>
// //               <option value='1'>Accessories</option>{" "}
// //               {/* Use IDs based on your data */}
// //               <option value='2'>Fashion</option>
// //               <option value='3'>Electronics</option>
// //             </select>
// //           </div>
// //         </div>

// //         <div className='space-y-2'>
// //           <label className='text-sm font-medium text-white/90'>Status*</label>
// //           <select
// //             name='status'
// //             value={formData.status}
// //             onChange={handleChange}
// //             className='input-field appearance-none bg-[#0a0a0a]'
// //           >
// //             <option value='inactive' className='bg-background text-white'>
// //               Inactive / Draft
// //             </option>
// //             <option value='active' className='bg-background text-white'>
// //               Active
// //             </option>
// //           </select>
// //         </div>

// //         {/* Images section */}
// //         <div className='space-y-4'>
// //           <label className='text-sm font-medium text-white/90'>
// //             Product Images*
// //           </label>
// //           <div className='border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer'>
// //             <Upload className='text-white/40 mb-3' size={24} />
// //             <p className='text-white/80 text-sm mb-1'>Upload New Images</p>
// //           </div>

// //           <div className='flex gap-4 mt-4'>
// //             {product?.images?.map((img, idx) => (
// //               <div
// //                 key={idx}
// //                 className='w-24 h-24 rounded-lg border border-white/10 overflow-hidden'
// //               >
// //                 <img
// //                   src={img.image}
// //                   alt='preview'
// //                   className='w-full h-full object-cover'
// //                 />
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       <div className='flex items-center gap-3 pt-4'>
// //         <button
// //           onClick={() => setIsFeatured(!isFeatured)}
// //           className={`w-12 h-6 rounded-full transition-colors relative ${isFeatured ? "bg-yellow-500" : "bg-white/20"}`}
// //         >
// //           <span
// //             className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? "translate-x-6" : "translate-x-0"}`}
// //           />
// //         </button>
// //         <span className='text-white font-medium'>Mark as Featured Product</span>
// //       </div>

// //       <div className='flex items-center gap-4 pt-6'>
// //         <button className='bg-[#D4A843] hover:bg-[#B8922F] text-black px-6 py-2.5 rounded-lg font-bold min-w-[140px]'>
// //           Update Product
// //         </button>
// //         <Link
// //           href='/admin/products'
// //           className='border border-white/20 text-white hover:bg-white/5 px-6 py-2.5 rounded-lg text-center min-w-[140px]'
// //         >
// //           Cancel
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // }
