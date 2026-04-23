"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AccountSidebar from "@/components/AccountSidebar";
import { getPurchasedVideos } from "@/lib/orders";
import { videos } from "@/lib/data";
import type { Video } from "@/lib/data";

export default function MyVideosPage() {
  const [ownedVideos, setOwnedVideos] = useState<Video[]>([]);

  useEffect(() => {
    const purchasedIds = getPurchasedVideos();
    const owned = videos.filter((v) => purchasedIds.includes(v.id));
    setOwnedVideos(owned);
  }, []);

  const categoryColors: Record<string, string> = {
    entertainment: "border-gold/30 text-gold",
    tutorial: "border-emerald-600/30 text-emerald-500",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-bold text-gold italic mb-8">My Account</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <AccountSidebar />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground mb-6">My Video Library</h2>
          {ownedVideos.length === 0 ? (
            <div className="card-border bg-surface/50 p-8 text-center">
              <p className="text-muted mb-4">No purchased videos yet</p>
              <Link href="/video" className="btn-gold text-sm">Browse Videos</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ownedVideos.map((video) => (
                <Link href={`/video/${video.id}`} key={video.id} className="group">
                  <div className="card-border bg-surface/50 overflow-hidden transition-all group-hover:border-gold/40">
                    <div className="relative aspect-video overflow-hidden bg-surface">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 50vw" />
                      <span className="absolute left-3 top-3 rounded-md bg-success/90 px-2.5 py-1 text-[10px] font-bold text-white">Owned</span>
                    </div>
                    <div className="p-4">
                      <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold ${categoryColors[video.category] || "border-border text-muted"}`}>
                        {video.category.charAt(0).toUpperCase() + video.category.slice(1)}
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-foreground italic">{video.title}</h3>
                      <p className="mt-1 text-xs text-muted line-clamp-2">{video.description}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted">
                        <span>{video.duration}</span>
                        <span>{video.views.toLocaleString()} Views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
