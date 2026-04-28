/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosPublic } from "@/hooks/useAxiosPublic";
import useAxiosSecure from "@/hooks/useAxiosSecure";

// Public API calls (no token required)
const fetchProducts = async (params: Record<string, any>) => {
  const { data } = await axiosPublic.get("/products/", { params });
  return data;
};

// Secure API calls (token required)

export const useProductsQuery = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
  });
};

export const useGetBestDealsQuery = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/products/best-deals/", {
        params,
      });
      return data;
    },
  });
};

export const useProductQuery = (id: string) => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/product/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
