import baseAPI from "@/redux/api/api";

export const productAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getBestDeals: builder.query({
      query: (params) => ({
        url: "/products/best-deals/",
        method: "GET",
        params,
      }),
    }),

    getProductCategories: builder.query({
      query: () => "/product-categories/",
    }),
  }),
});

export const { useGetBestDealsQuery, useGetProductCategoriesQuery } =
  productAPI;

export default productAPI;
