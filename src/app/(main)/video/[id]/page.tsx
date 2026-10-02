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
import { Loader, Film, Play, Lock, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGetVideoQuery } from "@/redux/features/admin/videoAPI";

export default function VideoDetailPage() {
  const router = useRouter();
  const params = useParams().id as string;
  const [showPayment, setShowPayment] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerMode, setPlayerMode] = useState<"trailer" | "full">("trailer");
  const [thumbnailError, setThumbnailError] = useState(false);
  const { user } = useAuth();

  const { toggleWishlist, isInWishlist } = useVideoWishlist();
  const [unlockVideoByOrderMutation, { isLoading: isUnlockingVideo }] =
    useUnlockVideoByOrderMutation();

  const { data: videoData, isLoading, isError } = useGetVideoQuery(params);
  const video = videoData?.data;

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='flex flex-col items-center gap-3'>
          <Loader className='animate-spin text-gold' size={32} />
          <p className='text-muted text-sm font-medium'>Loading video details...</p>
        </div>
      </div>
    );
  }

  if (isError || !video) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center space-y-3'>
          <Film className='h-12 w-12 text-muted/40 mx-auto' />
          <p className='text-muted text-lg'>Video not found</p>
          <button
            onClick={() => router.push("/video")}
            className='btn-gold text-xs px-4 py-2'
          >
            Back to Videos
          </button>
        </div>
      </div>
    );
  }

  const related = video.related_videos ?? [];

  const catColor =
    video.category_name?.toLowerCase() === "entertainment"
      ? "bg-gold/80 text-black"
      : "bg-emerald-600/80 text-white";

  const formattedPrice =
    parseFloat(video.price || "0") === 0
      ? "Free"
      : `$${parseFloat(video.price || "0").toFixed(2)}`;

  const hasFullStream = Boolean(video.cf_stream_uid || video.main_video);

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

  const playTrailer = () => {
    setPlayerMode("trailer");
    setIsPlaying(true);
  };

  const playFullVideo = () => {
    if (!video.is_unlocked) {
      setShowPayment(true);
      return;
    }
    setPlayerMode("full");
    setIsPlaying(true);
  };

  return (
    <div className='mx-auto container px-4 py-8 lg:px-8'>
      {/* ── Player Header Controls / Switcher ── */}
      <div className='mb-3 flex items-center justify-between flex-wrap gap-2'>
        <div className='flex items-center gap-2'>
          {/* Watch Trailer Tab */}
          <button
            onClick={playTrailer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isPlaying && playerMode === "trailer"
                ? "bg-gold text-black shadow-md shadow-gold/20"
                : "bg-surface-light border border-border text-muted hover:text-foreground hover:border-gold/40"
            }`}
          >
            <Film className='h-3.5 w-3.5' />
            <span>Trailer</span>
            <span className='text-[10px] opacity-75 font-normal'>Preview</span>
          </button>

          {/* Full Video Tab */}
          {video.is_unlocked ? (
            <button
              onClick={playFullVideo}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isPlaying && playerMode === "full"
                  ? "bg-gold text-black shadow-md shadow-gold/20"
                  : "bg-surface-light border border-border text-muted hover:text-foreground hover:border-gold/40"
              }`}
            >
              <Play className='h-3.5 w-3.5' fill='currentColor' />
              <span>Full Video</span>
              <span className='text-[10px] rounded px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 font-mono'>
                Unlocked
              </span>
            </button>
          ) : (
            <button
              onClick={() => setShowPayment(true)}
              className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-light border border-border text-muted hover:text-gold hover:border-gold/40 transition-all cursor-pointer'
              title='Unlock full video'
            >
              <Lock className='h-3.5 w-3.5 text-gold' />
              <span>Full Video</span>
              <span className='text-[10px] text-gold font-bold'>
                {formattedPrice}
              </span>
            </button>
          )}

          {/* Show Poster Button (if playing) */}
          {isPlaying && (
            <button
              onClick={() => setIsPlaying(false)}
              className='flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-surface-light transition-all cursor-pointer'
              title='View thumbnail poster'
            >
              <ImageIcon className='h-3.5 w-3.5' />
              <span>Poster</span>
            </button>
          )}
        </div>

        {/* Status Indicator */}
        <div className='text-xs text-muted flex items-center gap-2'>
          {isPlaying ? (
            <span className='flex items-center gap-1.5 text-gold font-medium'>
              <span className='h-2 w-2 rounded-full bg-gold animate-pulse' />
              Playing: {playerMode === "trailer" ? "Trailer (Free Preview)" : "Full Video"}
            </span>
          ) : (
            <span className='text-muted'>Click thumbnail to play</span>
          )}
        </div>
      </div>

      {/* ── Main Video Player Container ── */}
      <div className='relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-border shadow-2xl'>
        {!isPlaying ? (
          /* ── Thumbnail + Play Trigger ── */
          <div className='relative h-full w-full group'>
            {video.thumbnail && !thumbnailError ? (
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                unoptimized
                onError={() => setThumbnailError(true)}
                className='object-cover transition-transform duration-700 group-hover:scale-105'
                sizes='100vw'
                priority
              />
            ) : (
              <div className='absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-surface-light via-surface to-background text-muted'>
                <Film className='h-16 w-16 text-muted/30 mb-2' />
                <p className='text-base font-semibold text-foreground'>{video.title}</p>
                {video.category_name && (
                  <span className='text-xs text-muted mt-1'>{video.category_name}</span>
                )}
              </div>
            )}

            {/* Gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 group-hover:via-black/40 transition-colors' />

            {/* Top Badges */}
            <div className='absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none'>
              {video.category_name && (
                <span
                  className={`rounded-md px-3 py-1 text-xs font-semibold backdrop-blur-md shadow ${catColor}`}
                >
                  {video.category_name}
                </span>
              )}

              {video.is_unlocked ? (
                <span className='rounded-md bg-emerald-600/90 px-3 py-1 text-xs font-bold text-white shadow backdrop-blur-md flex items-center gap-1.5'>
                  <CheckCircle2 className='h-3.5 w-3.5' />
                  Video Unlocked
                </span>
              ) : (
                <span className='rounded-md bg-black/70 border border-gold/40 px-3 py-1 text-xs font-semibold text-gold backdrop-blur-md'>
                  Trailer Only
                </span>
              )}
            </div>

            {/* Center Play Button & Options */}
            <div className='absolute inset-0 flex flex-col items-center justify-center gap-3.5'>
              <div
                onClick={() => {
                  if (video.is_unlocked && hasFullStream) {
                    playFullVideo();
                  } else {
                    playTrailer();
                  }
                }}
                className='cursor-pointer group/btn flex flex-col items-center'
              >
                <div className='flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-black/60 text-gold shadow-2xl backdrop-blur-md transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-gold group-hover/btn:text-black group-hover/btn:shadow-gold/30'>
                  <svg
                    className='h-9 w-9 ml-1'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M8 5v14l11-7z' />
                  </svg>
                </div>
                <span className='mt-2.5 text-xs font-bold tracking-wider uppercase text-white drop-shadow-md group-hover/btn:text-gold transition-colors'>
                  {video.is_unlocked && hasFullStream
                    ? "Play Full Video"
                    : "Play Trailer"}
                </span>
              </div>

              {/* If full video is primary, also offer explicit trailer button */}
              {video.is_unlocked && video.trailer && hasFullStream && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playTrailer();
                  }}
                  className='rounded-full bg-black/70 border border-white/20 hover:border-gold px-4 py-1 text-xs text-white hover:text-gold backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer'
                >
                  <Film className='h-3 w-3' />
                  <span>Watch Trailer</span>
                </button>
              )}
            </div>

            {/* Bottom Bar Info */}
            <div className='absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 backdrop-blur-sm pointer-events-none'>
              <span className='truncate max-w-[70%] font-medium drop-shadow'>
                {video.title}
              </span>
              {video.duration_display && (
                <span className='rounded bg-black/70 px-2 py-1 font-mono text-white'>
                  {video.duration_display}
                </span>
              )}
            </div>
          </div>
        ) : (
          /* ── Active Video Player ── */
          <div className='relative h-full w-full bg-black flex items-center justify-center'>
            {playerMode === "trailer" ? (
              video.trailer ? (
                <video
                  key={`trailer-${video.trailer}`}
                  src={video.trailer}
                  poster={video.thumbnail || undefined}
                  controls
                  autoPlay
                  playsInline
                  controlsList='nodownload'
                  onContextMenu={(e) => e.preventDefault()}
                  className='h-full w-full object-contain'
                />
              ) : (
                <div className='text-center p-6 text-muted'>
                  <p className='text-sm'>Trailer video URL not available.</p>
                </div>
              )
            ) : (
              /* Full Video Mode */
              video.cf_stream_uid ? (
                <iframe
                  key={`cf-${video.cf_stream_uid}`}
                  src={`https://iframe.videodelivery.net/${video.cf_stream_uid}?autoplay=true&poster=${encodeURIComponent(
                    video.thumbnail || "",
                  )}`}
                  className='h-full w-full border-0'
                  allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
                  allowFullScreen
                />
              ) : (video.main_video || video.trailer) ? (
                <video
                  key={`full-${video.main_video || video.trailer}`}
                  src={video.main_video || video.trailer}
                  poster={video.thumbnail || undefined}
                  controls
                  autoPlay
                  playsInline
                  controlsList='nodownload'
                  onContextMenu={(e) => e.preventDefault()}
                  className='h-full w-full object-contain'
                />
              ) : (
                <div className='text-center p-6 text-muted'>
                  <p className='text-sm'>Full video stream not available.</p>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ── Video Info ── */}
      <div className='mt-6'>
        {video.category_name && (
          <span
            className={`inline-block rounded-md px-3 py-1 text-xs font-semibold ${catColor}`}
          >
            {video.category_name}
          </span>
        )}
        <h1 className='mt-3 text-2xl font-bold text-foreground md:text-3xl'>
          {video.title}
        </h1>
        <div className='mt-2 flex items-center gap-4 text-sm text-muted'>
          {video.duration_display && <span>{video.duration_display}</span>}
          {typeof video.views_count === "number" && (
            <span>{video.views_count.toLocaleString()} Views</span>
          )}
        </div>
        {video.description && (
          <div className='mt-6'>
            <h3 className='text-sm font-semibold text-foreground'>Description</h3>
            <p className='mt-2 text-sm text-muted leading-relaxed whitespace-pre-line'>
              {video.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className='mt-6 flex flex-wrap items-center gap-3'>
          {video.is_unlocked ? (
            <button
              disabled
              className='flex items-center gap-2 rounded-lg bg-surface-light px-4 py-2.5 text-sm font-semibold text-green-500 border border-green-500 cursor-default'
            >
              <CheckCircle2 className='h-4 w-4' />
              Video Unlocked
            </button>
          ) : (
            <button
              onClick={() => setShowPayment(true)}
              className='btn-gold flex items-center gap-2 text-sm'
            >
              <Lock className='h-4 w-4' />
              Unlock Full Video — {formattedPrice}
            </button>
          )}

          {/* Quick Play Trailer Button */}
          {video.trailer && (
            <button
              onClick={playTrailer}
              className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                isPlaying && playerMode === "trailer"
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border text-muted hover:border-gold/40 hover:text-foreground"
              }`}
            >
              <Film className='h-4 w-4' />
              Watch Trailer
            </button>
          )}

          {/* Quick Play Full Video Button */}
          {video.is_unlocked && hasFullStream && (
            <button
              onClick={playFullVideo}
              className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                isPlaying && playerMode === "full"
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border text-muted hover:border-gold/40 hover:text-foreground"
              }`}
            >
              <Play className='h-4 w-4' fill='currentColor' />
              Stream Full Video
            </button>
          )}

          <button
            onClick={() => toggleWishlist(video)}
            className={`flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
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
                <span>{formattedPrice}</span>
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
                  <span>Pay with Stripe — {formattedPrice}</span>
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
