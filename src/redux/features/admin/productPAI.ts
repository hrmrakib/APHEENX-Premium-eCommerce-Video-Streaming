import baseAPI from "@/redux/api/api";

const productAdminAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "/products/",
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    createProductCategory: builder.mutation({
      query: (data) => ({
        url: "/product-categories/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    addProductImage: builder.mutation({
      query: ({ productId, imageData }) => ({
        url: `/products/${productId}/images/add/`,
        method: "POST",
        body: imageData,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProductImage: builder.mutation({
      query: ({ productId, imageId }) => ({
        url: `/products/${productId}/images/${imageId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useCreateProductCategoryMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddProductImageMutation,
  useDeleteProductImageMutation,
} = productAdminAPI;

export default productAdminAPI;
