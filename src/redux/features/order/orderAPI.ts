import baseAPI from "@/redux/api/api";

const orderAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation({
      query: (data) => ({
        url: "/orders/create/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    getMyOrders: build.query({
      query: () => ({
        url: "/orders/",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const { useCreateOrderMutation, useGetMyOrdersQuery } = orderAPI;
export default orderAPI;
