/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useGetVideosQuery } from "@/redux/features/admin/videoAPI";
import GlobalPagination from "@/components/pagination/GlobalPagination";

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

  const { data: videosData, isLoading } = useGetVideosQuery({
    page: currentPage,
  });

  const videos = (videosData?.data as Video[]) || [];
  const meta = videosData?.meta;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-white mb-1'>Videos</h1>
          <p className='text-white/60 text-sm'>
            Manage your video content library
          </p>
        </div>
        <Link
          href='/admin/videos/add'
          className='bg-[#D4A843] hover:bg-[#B8922F] text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors'
        >
          <Plus size={18} />
          Add Video
        </Link>
      </div>

      <div className='bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden'>
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
                    <td className='px-6 py-4 font-medium text-white max-w-[200px] truncate'>
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
                          href={`/admin/videos/edit/${video.id}`}
                          className='text-white/60 hover:text-white transition-colors'
                        >
                          <Pencil size={18} />
                        </Link>
                        <button className='text-red-500/80 hover:text-red-500 transition-colors'>
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

      {!isLoading && (
        <GlobalPagination
          currentPage={currentPage}
          totalPages={meta?.total_pages || 1}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
