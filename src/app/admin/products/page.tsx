/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "@/redux/features/admin/productPAI";
import GlobalPagination from "@/components/pagination/GlobalPagination";
import { toast } from "sonner";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_off: string;
  price: string;
  discounted_price: number;
  primary_image: string;
  stock: number;
  is_featured: boolean;
}

const TableSkeleton = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <tr key={i} className='animate-pulse border-b border-white/5'>
        <td className='px-6 py-4'>
          <div className='w-12 h-12 bg-white/5 rounded-lg' />
        </td>
        <td className='px-6 py-4'>
          <div className='h-4 bg-white/10 rounded w-32 mb-2' />
          <div className='h-3 bg-white/5 rounded w-20' />
        </td>
        <td className='px-6 py-4'>
          <div className='h-4 bg-white/10 rounded w-16' />
        </td>
        <td className='px-6 py-4'>
          <div className='h-4 bg-white/10 rounded w-16' />
        </td>
        <td className='px-6 py-4'>
          <div className='flex justify-center'>
            <div className='h-6 bg-white/5 rounded-full w-20' />
          </div>
        </td>
        <td className='px-6 py-4'>
          <div className='flex gap-3'>
            <div className='h-8 w-8 bg-white/5 rounded' />
            <div className='h-8 w-8 bg-white/5 rounded' />
          </div>
        </td>
      </tr>
    ))}
  </>
);

export default function AdminProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: number;
    slug: string;
    name: string;
  } | null>(null);

  const { data: productsData, isLoading } = useGetAllProductsQuery({
    page: currentPage,
    page_size: 10,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = (productsData?.data as Product[]) || [];
  const meta = productsData?.meta;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Open Modal Handler
  const openDeleteModal = (product: Product) => {
    setProductToDelete({
      id: product.id,
      slug: product.slug,
      name: product.name,
    });
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Handler
  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.slug).unwrap();
      toast.success("Product deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <div className='space-y-6 relative'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <h1 className='text-2xl font-bold text-white mb-1'>Products</h1>
            <p className='text-white/60 text-sm'>
              Manage your eCommerce product catalog
            </p>
          </div>
          <Link
            href='/admin/products/add'
            className='bg-[#D4A843] hover:bg-[#B8922F] text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors'
          >
            <Plus size={18} />
            Add Products
          </Link>
        </div>

        <div className='bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm text-white/80'>
              {/* ... Thead remains same ... */}
              <thead className='bg-[#111] text-white/60 text-xs border-b border-white/10'>
                <tr>
                  <th className='px-6 py-4 font-medium'>Image</th>
                  <th className='px-6 py-4 font-medium'>Name</th>
                  <th className='px-6 py-4 font-medium'>Price</th>
                  <th className='px-6 py-4 font-medium'>Discounted</th>
                  <th className='px-6 py-4 font-medium text-center'>
                    Featured
                  </th>
                  <th className='px-6 py-4 font-medium'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/5'>
                {isLoading ? (
                  <TableSkeleton />
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className='hover:bg-white/5 transition-colors'
                    >
                      <td className='px-6 py-4'>
                        <div className='w-12 h-12 rounded overflow-hidden border border-white/10'>
                          <img
                            src={product.primary_image}
                            alt={product.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                      </td>
                      <td className='px-6 py-4 font-medium text-white max-w-[200px] truncate'>
                        {product.name}
                      </td>
                      <td className='px-6 py-4 line-through text-white/40'>
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className='px-6 py-4 text-[#D4A843] font-bold'>
                        ${product.discounted_price.toFixed(2)}
                      </td>
                      <td className='px-6 py-4 text-center'>
                        {product.is_featured && (
                          <span className='px-3 py-1 rounded-full text-[10px] uppercase font-bold border border-purple-500/50 text-purple-400 bg-purple-500/10'>
                            Featured
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <Link
                            href={`/admin/products/edit/${product.slug}`}
                            className='text-white/60 hover:text-white transition-colors'
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            onClick={() => openDeleteModal(product)}
                            className='text-red-500/80 hover:text-red-500 transition-colors'
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <GlobalPagination
          currentPage={currentPage}
          totalPages={meta?.total_pages || 1}
          onPageChange={handlePageChange}
        />

        {/* DELETE WARNING MODAL */}
        {isDeleteModalOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'>
            <div className='bg-[#111] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200'>
              <div className='flex items-center gap-4 text-red-500 mb-4'>
                <div className='w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center'>
                  <AlertTriangle size={24} />
                </div>
                <h3 className='text-xl font-bold text-white'>Confirm Delete</h3>
              </div>

              <p className='text-white/60 text-sm mb-6 leading-relaxed'>
                Are you sure you want to delete{" "}
                <span className='text-white font-semibold'>
                  {productToDelete?.name}
                </span>
                ? This action cannot be undone and the product will be
                permanently removed from your catalog.
              </p>

              <div className='flex gap-3'>
                <button
                  disabled={isDeleting}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className='flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors text-sm font-medium'
                >
                  Cancel
                </button>
                <button
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className='flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors text-sm font-medium flex items-center justify-center gap-2'
                >
                  {isDeleting ? "Deleting..." : "Delete Product"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleRedirect>
  );
}
