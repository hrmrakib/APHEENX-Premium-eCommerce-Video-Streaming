import baseAPI from "@/redux/api/api";

export const videoAPI = baseAPI.injectEndpoints({
  // Register the Video tag here
  endpoints: (builder) => ({
    getVideoStream: builder.query({
      query: (id) => ({
        url: `/videos/${id}/stream/`,
        responseHandler: (response: Response) => response.blob(),
      }),
    }),

    getVideosCategories: builder.query({
      query: () => "/video-categories/",
    }),

    // Get Newest Videos
    getNewestVideos: builder.query({
      query: () => "/videos/?ordering=-created_at",
      providesTags: ["Video"],
    }),

    // Get Most Viewed Videos
    getMostViewedVideos: builder.query({
      query: () => "/videos/?ordering=-views_count",
      providesTags: ["Video"],
    }),

    // user purchased videos
    getMyPurchasedVideos: builder.query({
      query: (params) => ({
        url: "/videos/my-unlocked/",
        method: "GET",
        params,
      }),
      providesTags: ["Video"],
    }),

    unlockVideoByOrder: builder.mutation({
      query: (body) => ({
        url: `/video-orders/create/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Video"],
    }),
  }),
});

// Export hooks
export const {
  useGetVideoStreamQuery,
  useGetVideosCategoriesQuery,
  useGetNewestVideosQuery,
  useGetMostViewedVideosQuery,
  useGetMyPurchasedVideosQuery,
  useUnlockVideoByOrderMutation,
} = videoAPI;

export default videoAPI;
