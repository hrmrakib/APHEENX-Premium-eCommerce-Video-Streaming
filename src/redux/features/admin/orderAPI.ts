import baseAPI from "@/redux/api/api";

const orderAdminAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (params) => ({
        url: "/orders/",
        params,
      }),
    }),

    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status/`,
        method: "PATCH",
        body: { order_status: status },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = orderAdminAPI;

export default orderAdminAPI;
