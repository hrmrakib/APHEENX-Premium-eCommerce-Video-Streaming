import baseAPI from "@/redux/api/api";

export const videoAPI = baseAPI.injectEndpoints({
  // Register the Video tag here
  endpoints: (builder) => ({
    // 1. Get All Videos (Public)
    getVideos: builder.query({
      query: (params) => ({
        url: "/videos/",
        method: "GET",
        params,
      }),
      providesTags: ["Video"],
    }),

    getVideoStream: builder.query({
      query: (id) => ({
        url: `/videos/${id}/stream/`,
        responseHandler: (response: Response) => response.blob(),
      }),
    }),

    // 2. Get Single Video (Secure/Public)
    getVideoById: builder.query({
      query: (id) => `/videos/${id}`,
      providesTags: (result, error, id) => [{ type: "Video", id }],
    }),

    getVideosCategories: builder.query({
      query: () => "/video-categories/",
    }),

    // 3. Get Newest Videos
    getNewestVideos: builder.query({
      query: () => "/videos/?ordering=-created_at",
      providesTags: ["Video"],
    }),

    // 4. Get Most Viewed Videos
    getMostViewedVideos: builder.query({
      query: () => "/videos/?ordering=-views_count",
      providesTags: ["Video"],
    }),

    // user purchased videos
    getMyPurchasedVideos: builder.query({
      query: () => "/videos/my-unlocked/",
      providesTags: ["Video"],
    }),
  }),
});

// Export hooks
export const {
  useGetVideosQuery,
  useGetVideoStreamQuery,
  useGetVideoByIdQuery,
  useGetVideosCategoriesQuery,
  useGetNewestVideosQuery,
  useGetMostViewedVideosQuery,
  useGetMyPurchasedVideosQuery,
} = videoAPI;

export default videoAPI;
