import baseAPI from "@/redux/api/api";

const paymentAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    updateProductOrderCapture: build.mutation({
      query: (id) => ({
        url: `/orders/${id}/capture/`,
        method: "POST",
      }),
    }),

    updateVideoOrderCapture: build.mutation({
      query: (id) => ({
        url: `/video-orders/${id}/capture/`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useUpdateProductOrderCaptureMutation,
  useUpdateVideoOrderCaptureMutation,
} = paymentAPI;
export default paymentAPI;
