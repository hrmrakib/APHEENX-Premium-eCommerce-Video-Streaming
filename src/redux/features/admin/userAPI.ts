import baseAPI from "@/redux/api/api";

const adminUserAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "/admin/user-list/",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetAllUsersQuery } = adminUserAPI;

export default adminUserAPI;
