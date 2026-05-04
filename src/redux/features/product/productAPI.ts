import baseAPI from "@/redux/api/api";

export const productAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products/",
        method: "GET",
        params,
      }),
      providesTags: ["Product"],
    }),

    // 2. Get Best Deals
    getBestDeals: builder.query({
      query: (params) => ({
        url: "/products/best-deals/",
        method: "GET",
        params,
      }),
    }),

    // 3. Get Single Product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["Product"],
    }),

    // 4. Get Categories
    getProductCategories: builder.query({
      query: () => "/product-categories/",
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetBestDealsQuery,
  useGetProductByIdQuery,
  useGetProductCategoriesQuery,
} = productAPI;

export default productAPI;
