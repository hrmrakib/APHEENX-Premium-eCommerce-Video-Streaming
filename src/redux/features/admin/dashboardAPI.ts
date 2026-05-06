import baseAPI from "@/redux/api/api";

const dashboardAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getStats: build.query({
      query: () => ({
        url: "/admin/dashboard-stats/",
        method: "GET",
      }),
    }),

    getChartsData: build.query({
      query: (params) => ({
        url: "/admin/dashboard-charts/",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetStatsQuery, useGetChartsDataQuery } = dashboardAPI;
export default dashboardAPI;
