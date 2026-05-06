import baseAPI from "@/redux/api/api";

const videoAdminAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getVideos: builder.query({
      query: () => "/videos",
      providesTags: ["Video"],
    }),

    getVideo: builder.query({
      query: (id) => `/videos/${id}`,
      providesTags: ["Video"],
    }),

    addVideo: builder.mutation({
      query: (data) => ({
        url: "/videos/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Video"],
    }),

    updateVideo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/videos/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Video"],
    }),

    deleteVideo: builder.mutation({
      query: (id) => ({
        url: `/videos/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Video"],
    }),

    createVideoCategory: builder.mutation({
      query: (data) => ({
        url: "/video-categories/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Video"],
    }),

    getVideoCategories: builder.query({
      query: () => "/video-categories/",
      providesTags: ["Video"],
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetVideoQuery,
  useAddVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useCreateVideoCategoryMutation,
  useGetVideoCategoriesQuery,
} = videoAdminAPI;

export default videoAdminAPI;
