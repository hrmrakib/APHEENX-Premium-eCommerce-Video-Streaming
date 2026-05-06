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
  }),
});

export const { useCreateOrderMutation } = orderAPI;
export default orderAPI;
