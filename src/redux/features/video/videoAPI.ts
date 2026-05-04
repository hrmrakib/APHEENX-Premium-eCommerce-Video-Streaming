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

    // 2. Get Single Video (Secure/Public)
    getVideoById: builder.query({
      query: (id) => `/video/${id}`,
      providesTags: (result, error, id) => [{ type: "Video", id }],
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

    // 5. Add Video (Secure)
    addVideo: builder.mutation({
      query: (newVideo) => ({
        url: "/videos/",
        method: "POST",
        body: newVideo,
      }),
      // This replaces queryClient.invalidateQueries({ queryKey: ["videos"] })
      invalidatesTags: ["Video"],
    }),
  }),
});

// Export hooks
export const {
  useGetVideosQuery,
  useGetVideoByIdQuery,
  useGetNewestVideosQuery,
  useGetMostViewedVideosQuery,
  useAddVideoMutation,
} = videoAPI;

export default videoAPI;
