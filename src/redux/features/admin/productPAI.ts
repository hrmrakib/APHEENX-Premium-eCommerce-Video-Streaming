import baseAPI from "@/redux/api/api";

const productAdminAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "/products/",
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useDeleteProductMutation,
} = productAdminAPI;

export default productAdminAPI;
