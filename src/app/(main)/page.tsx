/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import VideoCard from "@/components/VideoCard";
import SectionHeader from "@/components/SectionHeader";
import {
  useGetBestDealsQuery,
  useProductsQuery,
} from "@/queries/products.query";
import { TBestDealProduct, TProduct } from "@/types/product.types";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import {
  useGetMostViewedVideosQuery,
  useGetNewestVideosQuery,
  useVideosQuery,
} from "@/queries/videos.query";
import { TVideo } from "@/types/video.types";
import BestDealProductCard from "@/components/BestDealProductCard";
import NewestVideoCard from "@/components/NewestVideoCard";

export default function HomePage() {
  const { data: featuredVideosData, isPending: featuredVideosPending } =
    useVideosQuery({
      is_featured: true,
    });
  const { data: featuredProductsData, isPending: featuredProductsPending } =
    useProductsQuery({
      is_featured: true,
    });

  const { data: bestDealsData, isPending: bestDealsPending } =
    useGetBestDealsQuery({
      is_featured: true,
    });
  const { data: newestVideosData, isPending: newestVideosPending } =
    useGetNewestVideosQuery();
  const { data: mostViewedVideosData, isPending: mostViewedVideosPending } =
    useGetMostViewedVideosQuery();

  const featuredProducts = featuredProductsData?.data ?? [];
  const featuredVideos = featuredVideosData?.data ?? [];
  const bestDeals = bestDealsData?.data ?? [];
  const newestVideos = newestVideosData?.data ?? [];
  const mostViewedVideos = mostViewedVideosData?.data ?? [];

  console.log({ newestVideos, mostViewedVideos });

  return (
    <div>
      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='mx-auto container px-4 lg:px-8'>
          <div className='relative flex min-h-125 items-center py-16 md:min-h-150'>
            {/* Background Image */}
            <div className='absolute inset-0 z-0'>
              <Image
                src='/images/hero-banner.png'
                alt='Shopping lifestyle'
                fill
                className='object-cover object-top opacity-40 rounded-2xl'
                priority
                sizes='100vw'
              />
              <div className='absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent rounded-2xl' />
              <div className='absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent rounded-2xl' />
            </div>

            {/* Content */}
            <div className='relative z-10 max-w-xl px-4 md:px-8'>
              <h1 className='text-4xl font-bold leading-tight text-gold md:text-5xl lg:text-6xl'>
                Elevate Your Style
              </h1>
              <p className='mt-4 text-sm text-muted leading-relaxed md:text-base max-w-md'>
                Discover premium fashion and exclusive video content. Your
                one-stop luxury streaming platform.
              </p>
              <div className='mt-8 flex flex-wrap gap-3'>
                <Link
                  href='/shop'
                  className='btn-gold flex items-center gap-2 text-sm'
                >
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z'
                    />
                  </svg>
                  Browse Shop
                </Link>
                <button className='btn-outline-gold flex items-center gap-2 text-sm'>
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z'
                    />
                  </svg>
                  Watch Video
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2 z-10'>
          <div className='flex flex-col items-center gap-1 animate-bounce'>
            <svg
              className='h-5 w-5 text-gold/60'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m19.5 8.25-7.5 7.5-7.5-7.5'
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Videos */}
      <section className='mx-auto container px-4 py-12 lg:px-8'>
        {featuredVideos?.length > 0 && (
          <SectionHeader title='Featured Videos' href='/video' />
        )}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {featuredVideosPending &&
            Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          {!featuredVideosPending &&
            featuredVideos.map((video: TVideo) => (
              <VideoCard key={video.id} video={video} />
            ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className='mx-auto container px-4 py-12 lg:px-8'>
        {featuredProducts?.length > 0 && (
          <SectionHeader title='Featured Products' href='/shop' />
        )}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {featuredProductsPending &&
            Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}

          {!featuredProductsPending &&
            featuredProducts.map((product: TProduct) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      {/* Best Viewed Videos */}
      <section className='mx-auto container px-4 py-12 lg:px-8'>
        {mostViewedVideos?.length > 0 && (
          <SectionHeader title='Best Viewed Videos' href='#' />
        )}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {mostViewedVideosPending &&
            Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}

          {mostViewedVideos.map((video: TVideo) => (
            <VideoCard key={`best-${video.id}`} video={video} />
          ))}
        </div>
      </section>

      {/* Best Deals */}
      <section className='mx-auto container px-4 py-12 lg:px-8'>
        {bestDeals?.length > 0 && (
          <SectionHeader title='Best Deals' href='/shop' />
        )}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {bestDealsPending &&
            Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          {!bestDealsPending &&
            bestDeals.map((product: TBestDealProduct) => (
              <BestDealProductCard
                key={`deal-${product.id}`}
                product={product}
              />
            ))}
        </div>
      </section>

      {/* Newest Videos */}
      <section className='mx-auto container px-4 pb-16 pt-12 lg:px-8'>
        {newestVideos?.length > 0 && (
          <SectionHeader title='Newest Videos' href='#' />
        )}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {newestVideosPending &&
            Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}

          {!newestVideosPending &&
            newestVideos.map((video: TVideo) => (
              <NewestVideoCard key={video.id} video={video} />
            ))}
        </div>
      </section>
    </div>
  );
}
