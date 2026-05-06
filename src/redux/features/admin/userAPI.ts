import baseAPI from "@/redux/api/api";

const adminUserAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/admin/user-list/",
        params,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetAllUsersQuery } = adminUserAPI;

export default adminUserAPI;
