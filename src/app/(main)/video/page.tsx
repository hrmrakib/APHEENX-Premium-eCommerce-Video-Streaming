"use client";

import { useState, useMemo } from "react";
import VideoCard from "@/components/VideoCard";
import { videos } from "@/lib/data";

const categories = [
  { value: "all", label: "All Videos" },
  { value: "entertainment", label: "Entertainment" },
  { value: "tutorial", label: "Tutorials" },
];

const tabs = [
  { value: "featured", label: "Featured Videos", icon: "✦" },
  { value: "most-views", label: "Most Views", icon: "↗" },
  { value: "entertainment", label: "Entertainment", icon: "🎬" },
  { value: "tutorial", label: "Tutorials", icon: "🎓" },
];

export default function VideoPage() {
  const [category, setCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("featured");

  const filteredVideos = useMemo(() => {
    let result = videos;

    // Category filter
    if (category !== "all") {
      result = result.filter((v) => v.category === category);
    }

    // Tab filter
    if (activeTab === "entertainment" || activeTab === "tutorial") {
      result = result.filter((v) => v.category === activeTab);
    } else if (activeTab === "featured") {
      result = result.filter((v) => v.tags.includes("featured") || v.featured);
    } else if (activeTab === "most-views") {
      result = [...result].sort((a, b) => b.views - a.views);
    }

    return result;
  }, [category, activeTab]);

  return (
    <div className='mx-auto container px-4 py-8 lg:px-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gold italic'>Videos</h1>
        <p className='mt-2 text-sm text-muted'>
          Exclusive content for style enthusiasts
        </p>
      </div>

      {/* Filters */}
      <div className='mb-8 space-y-4'>
        {/* Category dropdown */}
        <div>
          <label className='block text-sm font-medium text-foreground mb-2'>
            Categories
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field w-auto min-w-[180px] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23888%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m19.5%208.25-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"
          >
            {categories.map((cat) => (
              <option
                key={cat.value}
                value={cat.value}
                className='bg-surface text-foreground'
              >
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tab filters */}
        <div className='flex flex-wrap gap-2'>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.value
                  ? "gold-gradient text-black shadow-lg shadow-gold/20"
                  : "border border-border text-muted hover:border-gold/30 hover:text-foreground"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      {filteredVideos.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <svg
            className='h-16 w-16 text-border mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1'
              d='m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z'
            />
          </svg>
          <p className='text-muted text-lg'>No videos found</p>
          <p className='text-muted/60 text-sm mt-1'>
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
}
