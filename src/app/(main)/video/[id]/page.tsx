/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import SectionHeader from "@/components/SectionHeader";
import { useUnlockVideoByOrderMutation } from "@/redux/features/video/videoAPI";
import { useVideoWishlist } from "@/hooks/useVideoWishlist";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGetVideoQuery } from "@/redux/features/admin/videoAPI";

export default function VideoDetailPage() {
  const router = useRouter();
  const params = useParams().id as string;
  const [showPayment, setShowPayment] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { user } = useAuth();

  const { toggleWishlist, isInWishlist } = useVideoWishlist();
  const [unlockVideoByOrderMutation, { isLoading: isUnlockingVideo }] =
    useUnlockVideoByOrderMutation();

  const { data: videoData, isLoading, isError } = useGetVideoQuery(params);
  const video = videoData?.data;

  // unlocked → main_video, locked → trailer
  const playbackSrc: string | undefined = video?.is_unlocked
    ? video?.main_video
    : video?.trailer;

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

  const handleUnlockVideo = async (videoId: string | number) => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      const res = await unlockVideoByOrderMutation({
        video_id: Number(videoId),
      }).unwrap();

      // Extract Stripe checkout URL from API response
      const paymentUrl =
        res?.data?.payment_url ||
        res?.data?.url ||
        res?.data?.checkout_url ||
        res?.data?.stripe_url ||
        res?.data?.approval_url ||
        res?.url ||
        res?.checkout_url;

      if (paymentUrl) {
        setShowPayment(false);

        // Open Stripe checkout in a new tab immediately
        const newTab = window.open(paymentUrl, "_blank", "noopener,noreferrer");

        if (newTab) {
          toast.success(
            res?.message || "Opening Stripe payment in a new tab...",
            {
              action: {
                label: "Pay Now",
                onClick: () =>
                  window.open(paymentUrl, "_blank", "noopener,noreferrer"),
              },
            },
          );
        } else {
          toast.warning(
            "Pop-up blocked! Click 'Pay Now' to complete your Stripe payment.",
            {
              action: {
                label: "Pay Now",
                onClick: () =>
                  window.open(paymentUrl, "_blank", "noopener,noreferrer"),
              },
              duration: 10000,
            },
          );
        }
      } else if (res?.status === "success") {
        setShowPayment(false);
        toast.success(
          res?.message || res?.data?.detail || "Order placed successfully!",
        );
      }
    } catch (error: any) {
      console.error("Error unlocking video:", error);
      const errorMsg =
        error?.data?.message ||
        error?.data?.detail ||
        "Failed to initiate Stripe payment. Please try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className='mx-auto container px-4 py-8 lg:px-8'>
      {/* Video Player */}
      <div className='relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-border'>
        {!isPlaying ? (
          /* ── Thumbnail + Play Button ── */
          <div
            className='relative h-full w-full cursor-pointer group'
            onClick={() => setIsPlaying(true)}
          >
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              unoptimized
              className='object-cover'
              sizes='100vw'
              priority
            />

            {/* Dark overlay on hover */}
            <div className='absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors' />

            {/* Locked badge */}
            {!video.is_unlocked && (
              <span className='absolute right-4 top-4 z-10 rounded-md bg-black/60 px-3 py-1.5 text-sm font-semibold text-gold italic backdrop-blur-sm'>
                Trailer Only
              </span>
            )}

            {/* Play Button */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-black/50 text-gold backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-gold/20'>
                <svg
                  className='h-9 w-9 ml-1'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M8 5v14l11-7z' />
                </svg>
              </div>
            </div>

            {/* Duration bottom bar */}
            {video.duration_display && (
              <div className='absolute bottom-4 right-4 rounded bg-black/60 px-2 py-1 text-xs text-white font-mono backdrop-blur-sm'>
                {video.duration_display}
              </div>
            )}
          </div>
        ) : (
          /* ── Video Player (shown after play clicked) ── */
          <video
            src={playbackSrc}
            poster={video.thumbnail}
            controls
            autoPlay
            controlsList='nodownload'
            onContextMenu={(e) => e.preventDefault()}
            className='h-full w-full object-contain'
          />
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

      {/* Stripe Payment Modal */}
      {showPayment && (
        <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4'>
          <div
            className='absolute inset-0'
            onClick={() => !isUnlockingVideo && setShowPayment(false)}
          />
          <div className='relative w-full max-w-md card-border bg-surface p-6 shadow-2xl rounded-xl border border-border space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-bold text-foreground flex items-center gap-2'>
                <svg
                  className='h-5 w-5 text-gold'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
                <span>Stripe Checkout</span>
              </h2>
              <span className='text-[10px] font-semibold px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/30 uppercase tracking-wider'>
                Secure
              </span>
            </div>

            <p className='text-sm text-muted-foreground leading-relaxed'>
              You will be redirected to Stripe in a new tab to complete your payment securely. After payment, this video will be permanently unlocked in your account.
            </p>

            <div className='bg-surface-light/40 rounded-lg p-3 border border-border/50 text-xs text-muted-foreground space-y-1.5'>
              <div className='flex justify-between text-foreground font-medium'>
                <span>Video</span>
                <span className='truncate max-w-[200px]'>{video.title}</span>
              </div>
              <div className='flex justify-between'>
                <span>Access</span>
                <span>Unlimited Full Streaming</span>
              </div>
              <div className='flex justify-between pt-1 border-t border-border/40 font-bold text-gold text-sm'>
                <span>Total</span>
                <span>${video.price}</span>
              </div>
            </div>

            <button
              onClick={() => handleUnlockVideo(video.id)}
              disabled={isUnlockingVideo}
              className='btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold cursor-pointer'
            >
              {isUnlockingVideo ? (
                <>
                  <Loader className='animate-spin' size={16} />
                  <span>Connecting to Stripe...</span>
                </>
              ) : (
                <>
                  <span>Pay with Stripe — ${video.price}</span>
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
                      d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                    />
                  </svg>
                </>
              )}
            </button>

            <button
              onClick={() => setShowPayment(false)}
              disabled={isUnlockingVideo}
              className='w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center cursor-pointer'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
