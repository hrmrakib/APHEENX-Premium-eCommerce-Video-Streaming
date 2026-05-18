import baseAPI from "@/redux/api/api";

const announcementAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: () => ({
        url: "/announcements/",
        method: "GET",
      }),
    }),

    postAnnouncement: builder.mutation({
      query: (data) => ({
        url: "/announcements/",
        method: "POST",
        body: data,
      }),
    }),

    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/announcements/${id}/`,
        method: "DELETE",
      }),
    }),

    updateAnnouncement: builder.mutation({
      query: ({ id, data }) => ({
        url: `/announcements/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  usePostAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useUpdateAnnouncementMutation,
} = announcementAPI;
export default announcementAPI;
