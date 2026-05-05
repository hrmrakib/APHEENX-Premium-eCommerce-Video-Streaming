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

    deleteVideo: builder.mutation({
      query: (id) => ({
        url: `/videos/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Video"],
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetVideoQuery,
  useAddVideoMutation,
  useDeleteVideoMutation,
} = videoAdminAPI;

export default videoAdminAPI;
