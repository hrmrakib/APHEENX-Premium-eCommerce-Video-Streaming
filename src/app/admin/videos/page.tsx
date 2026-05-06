/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader, AlertTriangle } from "lucide-react";
import {
  useDeleteVideoMutation,
  useGetVideosQuery,
} from "@/redux/features/admin/videoAPI";
import GlobalPagination from "@/components/pagination/GlobalPagination";
import { toast } from "sonner";

export interface Video {
  id: number;
  title: string;
  slug: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  price: string;
  income: string;
  thumbnail: string;
  trailer: string;
  short_description: string;
  duration_display: string;
  views_count: number;
  is_featured: boolean;
  status: string;
  created_at: string;
}

// Video-specific Skeleton
const VideoTableSkeleton = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <tr key={i} className='animate-pulse border-b border-white/5'>
        <td className='px-6 py-4'>
          <div className='w-16 h-10 bg-white/5 rounded border border-white/10' />
        </td>
        <td className='px-6 py-4'>
          <div className='h-4 bg-white/10 rounded w-40 mb-2' />
          <div className='h-3 bg-white/5 rounded w-24' />
        </td>
        <td className='px-6 py-4'>
          <div className='h-6 bg-white/5 rounded-full w-20' />
        </td>
        <td className='px-6 py-4'>
          <div className='h-4 bg-white/10 rounded w-12' />
        </td>
        <td className='px-6 py-4'>
          <div className='h-4 bg-white/10 rounded w-12' />
        </td>
        <td className='px-6 py-4'>
          <div className='flex justify-center'>
            <div className='h-6 bg-white/5 rounded-full w-16' />
          </div>
        </td>
        <td className='px-6 py-4'>
          <div className='h-6 bg-white/5 rounded-full w-20' />
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

export default function AdminVideosPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<{
    slug: string;
    title: string;
  } | null>(null);

  const { data: videosData, isLoading } = useGetVideosQuery({
    page: currentPage,
  });
  const [deleteVideo, { isLoading: isDeleting }] = useDeleteVideoMutation();

  const videos = (videosData?.data as Video[]) || [];
  const meta = videosData?.meta;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDeleteModal = (video: Video) => {
    setVideoToDelete({ slug: video.slug, title: video.title });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!videoToDelete) return;

    try {
      await deleteVideo(videoToDelete.slug).unwrap();
      toast.success("Video deleted successfully");
      setIsDeleteModalOpen(false);
      setVideoToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete video");
    }
  };

  return (
    <div className='space-y-6 relative'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-white mb-1'>Videos</h1>
          <p className='text-white/60 text-sm'>
            Manage your video content library
          </p>
        </div>
        <Link
          href='/admin/videos/add'
          className='bg-gold hover:bg-gold-dark text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors'
        >
          <Plus size={18} />
          Add Video
        </Link>
      </div>

      {/* Table */}
      <div className='bg-background rounded-xl border border-white/10 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-white/80'>
            <thead className='bg-[#111] text-white/60 text-xs border-b border-white/10'>
              <tr>
                <th className='px-6 py-4 font-medium'>Thumbnail</th>
                <th className='px-6 py-4 font-medium'>Title</th>
                <th className='px-6 py-4 font-medium'>Category</th>
                <th className='px-6 py-4 font-medium'>Price</th>
                <th className='px-6 py-4 font-medium'>Income</th>
                <th className='px-6 py-4 font-medium text-center'>Featured</th>
                <th className='px-6 py-4 font-medium'>Status</th>
                <th className='px-6 py-4 font-medium'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/5'>
              {isLoading ? (
                <VideoTableSkeleton />
              ) : (
                videos.map((video) => (
                  <tr
                    key={video.id}
                    className='hover:bg-white/5 transition-colors'
                  >
                    <td className='px-6 py-4'>
                      <div className='relative w-16 h-10 rounded overflow-hidden border border-white/10 bg-white/5'>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    </td>
                    <td className='px-6 py-4 font-medium text-white max-w-50 truncate'>
                      {video.title}
                    </td>
                    <td className='px-6 py-4'>
                      <span className='px-3 py-1 rounded-full text-[10px] uppercase font-semibold border border-white/20 text-white/70'>
                        {video.category.name}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      ${parseFloat(video.price).toFixed(2)}
                    </td>
                    <td className='px-6 py-4 text-green-500 font-medium'>
                      ${parseFloat(video.income).toFixed(2)}
                    </td>
                    <td className='px-6 py-4 text-center'>
                      {video.is_featured && (
                        <span className='px-3 py-1 rounded-full text-[10px] uppercase font-bold border border-purple-500/50 text-purple-400 bg-purple-500/10'>
                          Featured
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold border ${
                          video.status === "published"
                            ? "border-green-500/50 text-green-400 bg-green-500/10"
                            : "border-white/20 text-white/70 bg-white/5"
                        }`}
                      >
                        {video.status}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <Link
                          href={`/admin/videos/edit/${video.slug}`}
                          className='text-white/60 hover:text-white transition-colors'
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(video)}
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

      {/* Pagination */}
      {!isLoading && (
        <GlobalPagination
          currentPage={currentPage}
          totalPages={meta?.total_pages || 1}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Warning Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'>
          <div className='bg-[#111] border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200'>
            <div className='flex flex-col items-center text-center'>
              <div className='w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4'>
                <AlertTriangle className='text-red-500' size={24} />
              </div>
              <h3 className='text-white text-lg font-bold mb-2'>
                Delete Video?
              </h3>
              <p className='text-white/60 text-sm mb-6'>
                Are you sure you want to delete{" "}
                <span className='text-white font-semibold'>
                  &quot;{videoToDelete?.title}&quot;
                </span>
                ? This action cannot be undone.
              </p>

              <div className='flex gap-3 w-full'>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className='flex-1 px-4 py-2 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-50'
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className='flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50'
                >
                  {isDeleting ? (
                    <Loader size={18} className='animate-spin' />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
