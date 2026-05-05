/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import SectionHeader from "@/components/SectionHeader";
import {
  useGetVideoByIdQuery,
  // useGetVideoStreamQuery,
} from "@/redux/features/video/videoAPI";
import { useVideoWishlist } from "@/hooks/useVideoWishlist";

export default function VideoDetailPage() {
  const params = useParams().id as string;
  const [showPayment, setShowPayment] = useState(false);

  const { toggleWishlist, isInWishlist } = useVideoWishlist();
  const { data: videoData, isLoading, isError } = useGetVideoByIdQuery(params);
  const video = videoData?.data;
  // const { data: getVideoStreamData } = useGetVideoStreamQuery(video?.id);

  // console.log({ getVideoStreamData });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-100'>
        <p className='text-muted text-lg'>Loading...</p>
      </div>
    );
  }

  if (isError || !video) {
    return (
      <div className='flex items-center justify-center min-h-100'>
        <p className='text-muted text-lg'>Video not found</p>
      </div>
    );
  }

  const related = video.related_videos ?? [];

  const catColor =
    video.category_name?.toLowerCase() === "entertainment"
      ? "bg-gold/80 text-black"
      : "bg-emerald-600/80 text-white";

  return (
    <div className='mx-auto container px-4 py-8 lg:px-8'>
      {/* Video Player */}
      <div className='relative aspect-video w-full overflow-hidden rounded-xl bg-surface border border-border'>
        {video.is_unlocked ? (
          /* Fully unlocked — show the real trailer/video */
          <video
            src={video.trailer}
            poster={video.thumbnail}
            controls
            controlsList='nodownload'
            onContextMenu={(e) => e.preventDefault()}
            className='h-full w-full object-cover'
          />
        ) : (
          /* Locked — show thumbnail preview */
          <>
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className='object-cover'
              sizes='100vw'
              priority
            />
            <span className='absolute right-4 top-4 rounded-md bg-black/50 px-3 py-1.5 text-sm font-medium text-gold italic backdrop-blur-sm'>
              Preview Only
            </span>
            <div className='absolute inset-0 flex items-center justify-center cursor-pointer'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-gold/20 text-gold backdrop-blur-sm transition-all hover:bg-gold/30 hover:scale-110'>
                <svg
                  className='h-7 w-7 ml-1'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M8 5v14l11-7z' />
                </svg>
              </div>
            </div>
            <div className='absolute bottom-0 left-0 right-0 p-4'>
              <div className='flex items-center gap-3'>
                <div className='flex-1 h-1 rounded-full bg-border overflow-hidden'>
                  <div className='h-full w-1/3 rounded-full gold-gradient' />
                </div>
                <span className='text-xs text-foreground/70 font-mono'>
                  {video.duration_display}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Video Info */}
      <div className='mt-6'>
        <span
          className={`inline-block rounded-md px-3 py-1 text-xs font-semibold ${catColor}`}
        >
          {video.category_name}
        </span>
        <h1 className='mt-3 text-2xl font-bold text-foreground md:text-3xl'>
          {video.title}
        </h1>
        <div className='mt-2 flex items-center gap-4 text-sm text-muted'>
          <span>{video.duration_display}</span>
          <span>{video.views_count?.toLocaleString()} Views</span>
        </div>
        <div className='mt-6'>
          <h3 className='text-sm font-semibold text-foreground'>Description</h3>
          <p className='mt-2 text-sm text-muted leading-relaxed'>
            {video.description}
          </p>
        </div>

        {/* Actions */}
        <div className='mt-6 flex flex-wrap gap-3'>
          {video.is_unlocked ? (
            <button
              disabled
              className='flex items-center gap-2 rounded-lg bg-surface-light px-4 py-2.5 text-sm font-semibold text-green-500 border border-green-500 cursor-default'
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
                  d='M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
                />
              </svg>
              Video Unlocked
            </button>
          ) : (
            <button
              onClick={() => setShowPayment(true)}
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
                  d='M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
                />
              </svg>
              Unlock Full Video — ${video.price}
            </button>
          )}

          <button
            // onClick={toggleWishlist}
            onClick={() => toggleWishlist(video)}
            className={`flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-all ${
              isInWishlist(video.id)
                ? "border-gold bg-gold/10 text-gold"
                : "border-border text-muted hover:border-gold/30 hover:text-foreground"
            }`}
          >
            <svg
              className='h-4 w-4'
              fill={isInWishlist(video.id) ? "currentColor" : "none"}
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
              />
            </svg>
            {isInWishlist(video.id) ? "In Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>

      {/* Related Videos */}
      {related.length > 0 && (
        <section className='mt-16'>
          <SectionHeader title='Related Videos' href='/video' />
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {related.map((v: any) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4'>
          <div
            className='absolute inset-0'
            onClick={() => setShowPayment(false)}
          />
          <div className='relative w-full max-w-md card-border bg-surface p-6 shadow-2xl'>
            <h2 className='text-lg font-bold text-foreground'>
              Payment Method
            </h2>
            <p className='mt-2 text-sm text-muted'>
              You will be redirected to PayPal to complete your payment
              securely.
            </p>
            <button
              onClick={() => {
                setShowPayment(false);
                alert("Redirecting to PayPal...");
              }}
              className='btn-gold mt-6 w-full py-3 text-sm'
            >
              Pay with PayPal — ${video.price}
            </button>
            <button
              onClick={() => setShowPayment(false)}
              className='mt-3 w-full py-2 text-sm text-muted hover:text-foreground transition-colors'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
