/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useGetVideosCategoriesQuery } from "@/redux/features/video/videoAPI";
import { useDebounce } from "@/hooks/useDebounce";
import VideoCard from "@/components/VideoCard";
import GlobalPagination from "@/components/pagination/GlobalPagination";
import { useGetVideosQuery } from "@/redux/features/admin/videoAPI";

// 1. Fixed Interfaces
interface ICategory {
  id: string | number;
  name: string;
  slug: string;
}

// 2. Consistent Tab Types & Mappings
type FilterTab = "featured" | "most-views" | "entertainment" | "tutorial";

const tabs = [
  { value: "featured", label: "Featured", icon: "✦" },
  { value: "most-views", label: "Most Views", icon: "↗" },
  { value: "entertainment", label: "Entertainment", icon: "🎬" },
  { value: "tutorial", label: "Tutorials", icon: "🎓" },
];

// Mapping tabs to API query parameters
const tabFilters: Record<string, object> = {
  featured: { is_featured: true },
  "most-views": { ordering: "-views_count" },
  entertainment: { category__slug: "entertainment" },
  tutorial: { category__slug: "tutorial" },
};

export default function VideoPage() {
  const [category, setCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<FilterTab>("featured");
  const [search, setSearch] = useState("");
  const searchQuery = useDebounce(search);
  const [page, setPage] = useState(1);

  // 3. Fetching Data with corrected filter merging
  const { data: videosData, isLoading: videosLoading } = useGetVideosQuery({
    search: searchQuery,
    // Use category dropdown if not "all", otherwise let the tab handle specific categories
    ...(category !== "all" ? { category__slug: category } : {}),
    ...(activeTab ? tabFilters[activeTab] : {}),
    page,
    page_size: 9,
  });
  const { data: categoriesData } = useGetVideosCategoriesQuery({});

  const totalPages = videosData?.meta?.total_pages || 1;
  // 4. Safe Data Access
  const videos = videosData?.data || [];
  const displayCategories: ICategory[] = [
    { id: "all", name: "All Categories", slug: "all" },
    ...(categoriesData?.data || []),
  ];

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
      <div className='mb-8 space-y-6'>
        <div className='flex flex-col md:flex-row md:items-end gap-4'>
          {/* Category dropdown */}
          <div className='w-full md:w-auto'>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Filter by Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field w-full md:min-w-50 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23888%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m19.5%208.25-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')] bg-size-[16px] bg-position-[right_12px_center] bg-no-repeat pr-10"
            >
              {displayCategories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.slug}
                  className='bg-surface text-foreground'
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className='flex-1'>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Search
            </label>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search videos...'
              className='input-field'
            />
          </div>
        </div>

        {/* Tab filters */}
        <div className='flex flex-wrap gap-2'>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as FilterTab)}
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

      {/* Video Grid / Loading / Empty State */}
      {videosLoading ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='h-64 animate-pulse bg-surface rounded-xl' />
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {videos.map((video: any) => (
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

      <GlobalPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(page) => setPage(page)}
      />
    </div>
  );
}
