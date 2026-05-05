import baseAPI from "@/redux/api/api";

const productAdminAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "/products/",
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products/",
        method: "POST",
        body: data,
      }),
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
  useCreateProductMutation,
  useDeleteProductMutation,
} = productAdminAPI;

export default productAdminAPI;
