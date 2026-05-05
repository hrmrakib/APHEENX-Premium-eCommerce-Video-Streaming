import baseAPI from "@/redux/api/api";

const userAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => "/auth/profile/",
      providesTags: ["User"],
    }),

    getUserDashboard: builder.query({
      query: () => "/auth/user-dashboard/",
      providesTags: ["User"],
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/profile/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetUserDashboardQuery,
  useUpdateUserProfileMutation,
} = userAPI;

export default userAPI;
