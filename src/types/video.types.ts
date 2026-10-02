export interface Category {
  id: number;
  name: string;
  slug: string;
}

export type TVideo = {
  id: number;
  title: string;
  slug: string;
  category: Category;
  price: string;
  thumbnail: string | null;
  trailer: string;
  short_description: string;
  duration_display: string | null;
  views_count: number;
  is_featured: boolean;
  is_unlocked: boolean;
  created_at: string;
};

export type VideoList = TVideo[];

export type TVideoDetail = {
  id: number;
  category_name?: string;
  category: number | Category; // category ID or Category object
  duration_display: string | null;
  is_unlocked: boolean;
  title: string;
  slug: string;
  description: string;
  price: string;
  thumbnail: string | null;
  trailer: string;
  duration: number | null; // duration in seconds
  views_count: number;
  is_featured: boolean;
  cf_stream_uid?: string;
  main_video?: string | null;
  related_videos?: TVideo[];
  created_at: string;
  updated_at: string;
};

// Optional: Type for array of videos
export type VideoDetailList = TVideoDetail[];

export type TFeaturedVideo = {
  id: number;
  title: string;
  slug: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  short_description: string;
  price: string;
  thumbnail: string | null;
  trailer: string;
  duration_display: string | null;
  views_count: number;
  is_featured: boolean;
  is_unlocked: boolean;
  created_at: string; // ISO datetime string
};

// For array of videos
export type TNewestVideoList = TFeaturedVideo[];
