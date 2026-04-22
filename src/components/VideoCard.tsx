"use client";

import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/data";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const categoryColors: Record<string, string> = {
    entertainment: "bg-gold/80 text-black",
    tutorial: "bg-emerald-600/80 text-white",
  };

  return (
    <Link href={`/video/${video.id}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-surface-light border border-border transition-all duration-300 group-hover:border-gold/30 group-hover:shadow-lg group-hover:shadow-gold/5">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-surface">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Featured badge */}
          {video.featured && (
            <span className="absolute left-3 top-3 rounded-md bg-gold/90 px-2.5 py-1 text-[10px] font-bold text-black backdrop-blur-sm">
              Featured
            </span>
          )}
          {/* Category badge */}
          <span
            className={`absolute left-3 bottom-3 rounded-md px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm ${
              categoryColors[video.category] || "bg-border text-foreground"
            }`}
          >
            {video.category.charAt(0).toUpperCase() + video.category.slice(1)}
          </span>
          {/* Price */}
          <span className="absolute right-3 bottom-3 text-base font-bold text-gold drop-shadow-lg">
            ${video.price.toFixed(2)}
          </span>
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/90 text-black shadow-xl">
              <svg className="h-5 w-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-base font-bold text-foreground italic truncate">
            {video.title}
          </h3>
          <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">
            {video.description}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <span>{video.duration}</span>
            <span>{video.views.toLocaleString()} Views</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
