"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AccountSidebar from "@/components/AccountSidebar";
import { useGetMyPurchasedVideosQuery } from "@/redux/features/video/videoAPI";
import GlobalPagination from "@/components/pagination/GlobalPagination";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

interface VideoCategory {
  id: number;
  name: string;
  slug: string;
}

interface PurchasedVideo {
  id: number;
  title: string;
  slug: string;
  category: VideoCategory;
  price: string;
  thumbnail: string | null;
  trailer: string;
  short_description: string;
  duration_display: string;
  views_count: number;
  is_featured: boolean;
  is_unlocked: boolean;
  created_at: string;
}

export default function MyVideosPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // RTK Query with pagination
  const { data: myVideosData, isLoading } = useGetMyPurchasedVideosQuery({
    page: currentPage,
    page_size: 8,
  });

  const videos = myVideosData?.data || [];
  const totalPages = myVideosData?.meta?.total_pages || 1;

  const categoryColors: Record<string, string> = {
    entertainment: "border-gold/30 text-gold",
    tutorial: "border-emerald-600/30 text-emerald-500",
  };

  return (
    <RoleRedirect allowedRole='USER'>
      <div className='mx-auto container px-4 py-8 lg:px-8'>
        <h1 className='text-3xl font-bold text-gold italic mb-8'>My Account</h1>
        <div className='flex flex-col gap-8 lg:flex-row'>
          <AccountSidebar />

          <div className='flex-1 min-w-0'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-foreground'>
                My Video Library
              </h2>
              <span className='text-xs text-muted'>
                {myVideosData?.meta?.count || 0} Videos Total
              </span>
            </div>

            {isLoading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className='aspect-video animate-pulse bg-surface/50 rounded-lg card-border'
                  />
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className='card-border bg-surface/50 p-8 text-center'>
                <p className='text-muted mb-4'>No purchased videos yet</p>
                <Link href='/video' className='btn-gold text-sm'>
                  Browse Videos
                </Link>
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {videos.map((video: PurchasedVideo) => (
                    <Link
                      href={`/video/${video.slug}`}
                      key={video.id}
                      className='group'
                    >
                      <div className='card-border bg-surface/50 overflow-hidden transition-all group-hover:border-gold/40 h-full flex flex-col'>
                        <div className='relative aspect-video overflow-hidden bg-surface'>
                          <Image
                            src={video.thumbnail || "/placeholder-video.jpg"}
                            alt={video.title}
                            fill
                            unoptimized
                            className='object-cover transition-transform duration-500 group-hover:scale-105'
                            sizes='(max-width: 640px) 100vw, 50vw'
                          />
                          <div className='absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors' />
                          <span className='absolute left-3 top-3 rounded-md bg-success/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg uppercase'>
                            Owned
                          </span>
                          <div className='absolute right-2 bottom-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-white'>
                            {video.duration_display}
                          </div>
                        </div>

                        <div className='p-4 flex-1 flex flex-col'>
                          <span
                            className={`inline-block w-fit rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              categoryColors[video.category.slug] ||
                              "border-border text-muted"
                            }`}
                          >
                            {video.category.name}
                          </span>

                          <h3 className='mt-2 text-lg font-bold text-foreground italic line-clamp-1'>
                            {video.title}
                          </h3>

                          <p className='mt-1 text-xs text-muted line-clamp-2 flex-1'>
                            {video.short_description}
                          </p>

                          <div className='mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-semibold'>
                            <span className='flex items-center gap-1'>
                              <span className='h-1 w-1 rounded-full bg-gold' />
                              {video.views_count.toLocaleString()} Views
                            </span>
                            <span>
                              {new Date(video.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination Component */}
                <GlobalPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </RoleRedirect>
  );
}
