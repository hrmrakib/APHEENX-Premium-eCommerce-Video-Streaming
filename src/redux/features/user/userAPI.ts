import baseAPI from "@/redux/api/api";

const userAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => "/auth/profile/",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserProfileQuery } = userAPI;

export default userAPI;
